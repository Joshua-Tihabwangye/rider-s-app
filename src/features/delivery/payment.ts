import type {
  DeliveryOrder,
  DeliveryReceipt,
  DeliverySettlement,
  DeliverySettlementStatus,
  PaymentMethodType
} from "../../store/types";

export function getSettlementPolicy(methodType: PaymentMethodType): DeliverySettlement["policy"] {
  return methodType === "cash" ? "cash_on_delivery" : "cashless_pre_auth";
}

export function initializeDeliverySettlement(
  order: DeliveryOrder,
  methodType: PaymentMethodType,
  nowIso = new Date().toISOString()
): DeliverySettlement {
  const policy = getSettlementPolicy(methodType);
  const isCashPolicy = policy === "cash_on_delivery";

  return {
    id: `set_${order.id}`,
    policy,
    methodType,
    status: isCashPolicy ? "cash_due" : "authorized",
    authorizedAmount: isCashPolicy ? 0 : order.costBreakdown.total,
    capturedAmount: 0,
    refundedAmount: 0,
    cancellationFeeCharged: 0,
    authorizedAt: isCashPolicy ? undefined : nowIso,
    note: isCashPolicy ? "Collect cash from recipient at handoff." : "Cashless authorization complete."
  };
}

export function applySettlementForDeliveryStatus(
  settlement: DeliverySettlement,
  order: DeliveryOrder,
  status: DeliveryOrder["status"],
  cancellationFee = 0,
  nowIso = new Date().toISOString()
): DeliverySettlement {
  if (status === "delivered") {
    if (settlement.policy === "cash_on_delivery") {
      return {
        ...settlement,
        status: "cash_collected",
        capturedAmount: order.costBreakdown.total,
        capturedAt: nowIso,
        note: "Cash collected at successful handoff."
      };
    }

    return {
      ...settlement,
      status: "captured",
      capturedAmount: order.costBreakdown.total,
      capturedAt: nowIso,
      note: "Authorization captured on successful delivery."
    };
  }

  if (status === "cancelled") {
    if (cancellationFee > 0) {
      if (settlement.policy === "cash_on_delivery") {
        return {
          ...settlement,
          status: "cash_due",
          cancellationFeeCharged: cancellationFee,
          capturedAmount: 0,
          note: "Cancellation fee due in cash."
        };
      }

      return {
        ...settlement,
        status: "captured",
        cancellationFeeCharged: cancellationFee,
        capturedAmount: cancellationFee,
        capturedAt: nowIso,
        note: "Cancellation fee captured from authorized funds."
      };
    }

    return {
      ...settlement,
      status: "voided",
      cancellationFeeCharged: 0,
      capturedAmount: 0,
      note: "Authorization voided due to cancellation."
    };
  }

  if (status === "failed") {
    if (settlement.capturedAmount > 0) {
      return {
        ...settlement,
        status: "refund_requested",
        note: "Delivery failed after charge. Refund workflow opened."
      };
    }

    return {
      ...settlement,
      status: settlement.policy === "cash_on_delivery" ? "voided" : "voided",
      note: "Delivery failed before final settlement."
    };
  }

  return settlement;
}

export function requestSettlementRefund(
  settlement: DeliverySettlement,
  nowIso = new Date().toISOString()
): DeliverySettlement {
  if (settlement.capturedAmount <= 0) {
    return settlement;
  }

  return {
    ...settlement,
    status: "refunded",
    refundedAmount: settlement.capturedAmount,
    refundedAt: nowIso,
    note: "Refund issued to customer."
  };
}

export function generateDeliveryReceipt(order: DeliveryOrder, settlement: DeliverySettlement): DeliveryReceipt {
  const lineItems: DeliveryReceipt["lineItems"] = [
    { label: "Delivery fee", amount: order.costBreakdown.deliveryFee },
    { label: "Service fee", amount: order.costBreakdown.serviceFee },
    { label: "Insurance", amount: order.costBreakdown.insuranceFee }
  ];

  if (settlement.cancellationFeeCharged > 0) {
    lineItems.push({
      label: "Cancellation fee",
      amount: settlement.cancellationFeeCharged
    });
  }

  const total =
    settlement.status === "captured" || settlement.status === "cash_collected"
      ? settlement.capturedAmount
      : lineItems.reduce((acc, item) => acc + item.amount, 0);

  return {
    id: `rcpt_${order.id}`,
    orderId: order.id,
    issuedAt: new Date().toISOString(),
    lineItems,
    total,
    currency: order.costBreakdown.currency,
    settlementStatus: settlement.status
  };
}

export function isReceiptEligible(status: DeliverySettlementStatus): boolean {
  return status === "captured" || status === "cash_collected" || status === "refunded";
}
