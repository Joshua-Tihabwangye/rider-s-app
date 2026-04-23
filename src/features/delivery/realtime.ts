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
import { createAutoProofOfDelivery } from "./proof";
import { deriveOrderLegacyFields, summarizeRoute } from "./multiStop";

export interface DeliveryRealtimePatch {
  orderId: string;
  status?: DeliveryStatus;
  tracking?: Partial<DeliveryTrackingSnapshot>;
  note?: string;
}

function getActiveStopIndex(order: DeliveryOrder): number {
  const arrivingIndex = order.stops.findIndex((stop) => stop.status === "arriving");
  if (arrivingIndex >= 0) {
    return arrivingIndex;
  }
  const queuedIndex = order.stops.findIndex((stop) => stop.status === "queued");
  if (queuedIndex >= 0) {
    return queuedIndex;
  }
  return order.stops.findIndex((stop) => !["delivered", "failed", "skipped", "cancelled"].includes(stop.status));
}

function syncMultiStopRoute(order: DeliveryOrder, nextStatus: DeliveryStatus, now: string): DeliveryOrder {
  if (order.routeMode !== "multi_stop" || order.stops.length <= 1) {
    return order;
  }

  const nextStops = order.stops.map((stop) => ({ ...stop }));
  const activeIndex = getActiveStopIndex(order);
  const completedThreshold = nextStops.length === 0 ? 100 : 100 / nextStops.length;

  nextStops.forEach((stop, index) => {
    const stopCompletionTarget = completedThreshold * (index + 1);
    if (order.tracking.progress >= stopCompletionTarget && !["delivered", "failed", "skipped", "cancelled"].includes(stop.status)) {
      stop.status = "delivered";
      stop.completedAt = stop.completedAt ?? now;
      stop.proofOfDelivery =
        stop.proofOfDelivery ??
        createAutoProofOfDelivery({
          ...order,
          dropoff: stop.location,
          recipient: {
            name: stop.recipient.name,
            phone: stop.recipient.phone,
            address: stop.recipient.address
          },
          deliveredAt: now
        });
      return;
    }

    if (index === activeIndex && !["delivered", "failed", "skipped", "cancelled"].includes(stop.status)) {
      stop.status = nextStatus === "out_for_delivery" ? "arriving" : "queued";
      return;
    }

    if (!["delivered", "failed", "skipped", "cancelled"].includes(stop.status)) {
      stop.status = index < activeIndex ? "delivered" : "pending";
    }
  });

  const routeSummary = summarizeRoute(nextStops);
  const routeStatus =
    routeSummary.remainingStops === 0
      ? routeSummary.failedStops > 0 || routeSummary.skippedStops > 0
        ? "partially_completed"
        : "delivered"
      : nextStatus;

  const patchedOrder = {
    ...order,
    status: routeStatus,
    stops: nextStops,
    routeSummary,
    proofOfDelivery:
      routeSummary.remainingStops === 0
        ? nextStops[nextStops.length - 1]?.proofOfDelivery ?? order.proofOfDelivery
        : order.proofOfDelivery
  };

  return {
    ...patchedOrder,
    ...deriveOrderLegacyFields(patchedOrder)
  };
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

  const patchedOrder = {
    ...order,
    status: nextStatus,
    updatedAt: now,
    tracking,
    timeline,
    progress: tracking.progress,
    deliveredAt: nextStatus === "delivered" ? order.deliveredAt ?? now : order.deliveredAt
  };

  return syncMultiStopRoute(patchedOrder, nextStatus, now);
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

  const patchedOrder = {
    ...order,
    status: nextStatus,
    updatedAt: now,
    tracking,
    timeline: nextTimeline,
    progress: tracking.progress,
    deliveredAt: nextStatus === "delivered" ? order.deliveredAt ?? now : order.deliveredAt
  };

  return syncMultiStopRoute(patchedOrder, nextStatus, now);
}
