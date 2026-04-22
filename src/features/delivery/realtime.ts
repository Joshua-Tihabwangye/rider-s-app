import type {
  DeliveryOrder,
  DeliveryStatus,
  DeliveryTrackingSnapshot,
  DeliveryStatusLog
} from "../../store/types";
import {
  getDeliveryStatusProgress,
  getNextDeliveryStatus,
  isDeliveryTerminalStatus
} from "./stateMachine";

export interface DeliveryRealtimePatch {
  orderId: string;
  status?: DeliveryStatus;
  tracking?: Partial<DeliveryTrackingSnapshot>;
  note?: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function pushTimelineStatus(
  timeline: DeliveryStatusLog[],
  status: DeliveryStatus,
  source: DeliveryStatusLog["source"],
  note?: string
): DeliveryStatusLog[] {
  if (timeline.some((entry) => entry.status === status)) {
    return timeline;
  }

  return [
    ...timeline,
    {
      status,
      timestamp: new Date().toISOString(),
      source,
      note
    }
  ];
}

export function applyRealtimePatch(order: DeliveryOrder, patch: DeliveryRealtimePatch): DeliveryOrder {
  if (order.id !== patch.orderId) {
    return order;
  }

  const nextStatus = patch.status ?? order.status;
  const statusChanged = nextStatus !== order.status;
  const now = new Date().toISOString();

  const tracking = {
    ...order.tracking,
    ...(patch.tracking ?? {}),
    progress: clamp(
      patch.tracking?.progress ?? order.tracking.progress,
      getDeliveryStatusProgress(nextStatus),
      100
    ),
    courierPosition: clamp(patch.tracking?.courierPosition ?? order.tracking.courierPosition, 0, 1),
    etaMinutes: Math.max(0, patch.tracking?.etaMinutes ?? order.tracking.etaMinutes),
    distanceKm: Math.max(0, patch.tracking?.distanceKm ?? order.tracking.distanceKm),
    updatedAt: now
  };

  const timeline = statusChanged
    ? pushTimelineStatus(order.timeline, nextStatus, "websocket", patch.note)
    : order.timeline;

  return {
    ...order,
    status: nextStatus,
    updatedAt: now,
    tracking,
    timeline,
    progress: tracking.progress,
    deliveredAt: nextStatus === "delivered" ? order.deliveredAt ?? now : order.deliveredAt
  };
}

export function simulateDeliveryPollTick(order: DeliveryOrder): DeliveryOrder {
  if (isDeliveryTerminalStatus(order.status) || order.status === "draft") {
    return order;
  }

  const now = new Date().toISOString();
  const progressDelta = Math.floor(Math.random() * 7) + 2;
  const etaDelta = Math.floor(Math.random() * 3) + 1;
  const positionDelta = Number((Math.random() * 0.08 + 0.03).toFixed(3));

  let nextStatus: any = order.status;
  let nextTimeline = order.timeline;
  let nextProgress = clamp(
    order.tracking.progress + progressDelta,
    getDeliveryStatusProgress(order.status),
    100
  );

  const nextStateCandidate = getNextDeliveryStatus(order.status);
  if (nextStateCandidate && nextProgress >= getDeliveryStatusProgress(nextStateCandidate)) {
    nextStatus = nextStateCandidate;
    nextTimeline = pushTimelineStatus(order.timeline, nextStatus, "system", "Auto-updated from polling");
    nextProgress = Math.max(nextProgress, getDeliveryStatusProgress(nextStatus));
  }

  if (isDeliveryTerminalStatus(nextStatus)) {
    nextProgress = 100;
  }

  const tracking: DeliveryTrackingSnapshot = {
    ...order.tracking,
    progress: nextProgress,
    etaMinutes: nextStatus === "delivered" ? 0 : Math.max(1, order.tracking.etaMinutes - etaDelta),
    distanceKm:
      nextStatus === "delivered"
        ? 0
        : Number(Math.max(0.2, order.tracking.distanceKm - progressDelta * 0.12).toFixed(1)),
    courierPosition: nextStatus === "delivered" ? 1 : clamp(order.tracking.courierPosition + positionDelta, 0, 1),
    updatedAt: now
  };

  return {
    ...order,
    status: nextStatus,
    updatedAt: now,
    tracking,
    timeline: nextTimeline,
    progress: tracking.progress,
    deliveredAt: nextStatus === "delivered" ? order.deliveredAt ?? now : order.deliveredAt
  };
}
