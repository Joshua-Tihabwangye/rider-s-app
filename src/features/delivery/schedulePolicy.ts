import type {
  DeliveryOrder,
  DeliverySchedulePolicy,
  DeliverySchedulePolicyRule,
  DeliverySchedulePolicyStage,
  DeliveryStatus
} from "../../store/types";

export const DEFAULT_DELIVERY_SCHEDULE_POLICY: DeliverySchedulePolicy = {
  currency: "UGX",
  rescheduleCutoffMinutes: 30,
  rules: [
    {
      stage: "requested",
      feePercent: 0,
      minimumFee: 0,
      description: "Free cancellation while waiting for courier assignment."
    },
    {
      stage: "accepted",
      feePercent: 10,
      minimumFee: 1200,
      description: "Courier is allocated. A small dispatch fee applies."
    },
    {
      stage: "picked_up",
      feePercent: 35,
      minimumFee: 4500,
      description: "Parcel already picked up. Return logistics and handling fee applies."
    },
    {
      stage: "in_transit",
      feePercent: 45,
      minimumFee: 5200,
      description: "Parcel in transit. Routing and handling costs have been incurred."
    },
    {
      stage: "out_for_delivery",
      feePercent: 60,
      minimumFee: 6500,
      description: "Courier reached destination area. Near-full fee applies."
    }
  ]
};

const STATUS_TO_STAGE: Partial<Record<DeliveryStatus, DeliverySchedulePolicyStage>> = {
  requested: "requested",
  accepted: "accepted",
  picked_up: "picked_up",
  in_transit: "in_transit",
  out_for_delivery: "out_for_delivery"
};

function getRuleFromPolicy(
  stage: DeliverySchedulePolicyStage,
  policy: DeliverySchedulePolicy
): DeliverySchedulePolicyRule {
  return policy.rules.find((rule) => rule.stage === stage) ?? DEFAULT_DELIVERY_SCHEDULE_POLICY.rules[0];
}

function getScheduleTimestamp(order: DeliveryOrder): number | null {
  if (!order.scheduleTime) {
    return null;
  }
  const parsed = new Date(order.scheduleTime).getTime();
  if (Number.isNaN(parsed)) {
    return null;
  }
  return parsed;
}

export function getSchedulePolicyRule(
  status: DeliveryStatus,
  policy: DeliverySchedulePolicy = DEFAULT_DELIVERY_SCHEDULE_POLICY
): DeliverySchedulePolicyRule {
  const stage = STATUS_TO_STAGE[status] ?? "requested";
  return getRuleFromPolicy(stage, policy);
}

export function calculateScheduledCancellationFee(order: DeliveryOrder): {
  fee: number;
  feePercent: number;
  stage: DeliverySchedulePolicyStage;
  description: string;
} {
  const policy = order.schedulePolicy ?? DEFAULT_DELIVERY_SCHEDULE_POLICY;
  const rule = getSchedulePolicyRule(order.status, policy);
  const computed = Math.round((order.costBreakdown.total * rule.feePercent) / 100);
  const fee = rule.feePercent === 0 ? 0 : Math.max(rule.minimumFee, computed);

  return {
    fee,
    feePercent: rule.feePercent,
    stage: rule.stage,
    description: rule.description
  };
}

export function canEditScheduledOrder(order: DeliveryOrder, nowIso = new Date().toISOString()): boolean {
  if (order.schedule !== "scheduled") {
    return false;
  }
  if (order.status !== "requested" && order.status !== "accepted") {
    return false;
  }

  const scheduledTimestamp = getScheduleTimestamp(order);
  if (!scheduledTimestamp) {
    return true;
  }

  const now = new Date(nowIso).getTime();
  const policy = order.schedulePolicy ?? DEFAULT_DELIVERY_SCHEDULE_POLICY;
  const cutoffMs = policy.rescheduleCutoffMinutes * 60 * 1000;
  return scheduledTimestamp - now >= cutoffMs;
}

export function canCancelScheduledOrder(order: DeliveryOrder): boolean {
  if (order.schedule !== "scheduled") {
    return false;
  }

  return order.status !== "cancelled" && order.status !== "delivered" && order.status !== "failed";
}
