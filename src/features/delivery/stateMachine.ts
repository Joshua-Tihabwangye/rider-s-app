import type { DeliveryStatus, DeliveryStatusLog } from "../../store/types";

export const DELIVERY_STATE_FLOW: DeliveryStatus[] = [
  "draft",
  "requested",
  "accepted",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered"
];

export const DELIVERY_TERMINAL_STATES: DeliveryStatus[] = [
  "delivered",
  "cancelled",
  "failed"
];

const STATUS_LABELS: Record<DeliveryStatus, string> = {
  draft: "Draft",
  requested: "Requested",
  accepted: "Accepted",
  picked_up: "Picked up",
  in_transit: "In transit",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  failed: "Failed"
};

const STATUS_DESCRIPTIONS: Record<DeliveryStatus, string> = {
  draft: "Delivery details are still being prepared.",
  requested: "Waiting for a driver to accept the delivery request.",
  accepted: "A driver accepted your request and is heading to pickup.",
  picked_up: "Parcel has been picked up from the pickup location.",
  in_transit: "Parcel is in transit to the destination.",
  out_for_delivery: "Driver is near the destination and arriving soon.",
  delivered: "Parcel delivered successfully.",
  cancelled: "Delivery was cancelled.",
  failed: "Delivery could not be completed."
};

const STATUS_PROGRESS: Record<DeliveryStatus, number> = {
  draft: 0,
  requested: 12,
  accepted: 24,
  picked_up: 42,
  in_transit: 68,
  out_for_delivery: 88,
  delivered: 100,
  cancelled: 100,
  failed: 100
};

export function getDeliveryStatusLabel(status: DeliveryStatus): string {
  return STATUS_LABELS[status];
}

export function getDeliveryStatusDescription(status: DeliveryStatus): string {
  return STATUS_DESCRIPTIONS[status];
}

export function getDeliveryStatusProgress(status: DeliveryStatus): number {
  return STATUS_PROGRESS[status];
}

export function getNextDeliveryStatus(status: DeliveryStatus): DeliveryStatus | null {
  if (isDeliveryTerminalStatus(status)) {
    return null;
  }

  const currentIndex = DELIVERY_STATE_FLOW.indexOf(status);
  if (currentIndex < 0) {
    return null;
  }

  return DELIVERY_STATE_FLOW[currentIndex + 1] ?? null;
}

export function isDeliveryTerminalStatus(status: DeliveryStatus): boolean {
  return DELIVERY_TERMINAL_STATES.includes(status);
}

export function buildDeliveryTimeline(status: DeliveryStatus, existing?: DeliveryStatusLog[]): DeliveryStatusLog[] {
  const done = new Set((existing ?? []).map((entry) => entry.status));
  const timeline: DeliveryStatusLog[] = existing ? [...existing] : [];
  const now = new Date().toISOString();

  for (const flowStatus of DELIVERY_STATE_FLOW) {
    if (done.has(flowStatus)) {
      continue;
    }
    timeline.push({
      status: flowStatus,
      timestamp: flowStatus === status ? now : "",
      source: "system",
      note: flowStatus === status ? "Current stage" : "Pending"
    });
    done.add(flowStatus);
    if (flowStatus === status) {
      break;
    }
  }

  return timeline;
}

export function formatEtaLabel(etaMinutes: number): string {
  if (etaMinutes <= 0) {
    return "Arriving";
  }
  if (etaMinutes < 60) {
    return `${etaMinutes} min`;
  }

  const hours = Math.floor(etaMinutes / 60);
  const mins = etaMinutes % 60;
  return mins === 0 ? `${hours} hr` : `${hours} hr ${mins} min`;
}

export function getTimelineView(status: DeliveryStatus): Array<{
  status: DeliveryStatus;
  label: string;
  state: "done" | "current" | "upcoming";
}> {
  const terminalCancelled = status === "cancelled" || status === "failed";
  if (terminalCancelled) {
    return [
      {
        status,
        label: getDeliveryStatusLabel(status),
        state: "current"
      }
    ];
  }

  if (status === "delivered") {
    return DELIVERY_STATE_FLOW
      .filter((item) => item !== "draft")
      .map((item) => ({
        status: item,
        label: getDeliveryStatusLabel(item),
        state: "done" as const
      }));
  }

  const maxIndex = Math.max(DELIVERY_STATE_FLOW.indexOf(status), 0);

  return DELIVERY_STATE_FLOW
    .filter((item) => item !== "draft")
    .map((item) => {
      const itemIndex = DELIVERY_STATE_FLOW.indexOf(item);
      return {
        status: item,
        label: getDeliveryStatusLabel(item),
        state: itemIndex < maxIndex ? "done" : itemIndex === maxIndex ? "current" : "upcoming"
      };
    });
}
