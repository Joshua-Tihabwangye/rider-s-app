import type { DeliveryException, DeliveryExceptionType, DeliveryOrder, DeliveryStatus } from "../../store/types";

export const DELIVERY_EXCEPTION_LABELS: Record<DeliveryExceptionType, string> = {
  missing_item: "Missing item",
  damaged_item: "Damaged item",
  delayed_courier: "Delayed courier",
  failed_handoff: "Failed handoff",
  return_to_sender: "Return to sender",
  dispute_refund: "Dispute / refund request"
};

export function createDeliveryException(
  orderId: string,
  type: DeliveryExceptionType,
  note: string,
  requestedRefundAmount?: number
): DeliveryException {
  return {
    id: `ex_${orderId}_${Date.now()}`,
    type,
    status: "open",
    note,
    createdAt: new Date().toISOString(),
    requestedRefundAmount
  };
}

export function resolveDeliveryException(exception: DeliveryException, resolution: string): DeliveryException {
  return {
    ...exception,
    status: "resolved",
    resolvedAt: new Date().toISOString(),
    resolution
  };
}

export function getStatusFromException(
  exceptionType: DeliveryExceptionType,
  currentStatus: DeliveryStatus
): DeliveryStatus {
  if (exceptionType === "failed_handoff" || exceptionType === "return_to_sender") {
    return "failed";
  }
  if (exceptionType === "dispute_refund" && currentStatus === "delivered") {
    return "failed";
  }
  return currentStatus;
}

export function hasOpenException(order: DeliveryOrder): boolean {
  return (order.exceptions ?? []).some((item) => item.status === "open");
}
