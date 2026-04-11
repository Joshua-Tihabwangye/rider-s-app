import type { DeliveryOrder, DeliveryProofMethod, DeliveryProofOfDelivery } from "../../store/types";

function fallbackMethods(order: DeliveryOrder): DeliveryProofMethod[] {
  if (order.parcel.fragile || order.parcel.value >= 150000) {
    return ["photo", "signature", "otp"];
  }
  return ["otp"];
}

function normalizeMethods(methods: Array<DeliveryProofMethod | "recipient">): DeliveryProofMethod[] {
  const normalized = methods
    .map((method) => (method === "recipient" ? "otp" : method))
    .filter((method, index, array) => array.indexOf(method) === index);
  return normalized;
}

export function createAutoProofOfDelivery(order: DeliveryOrder): DeliveryProofOfDelivery {
  const deliveredAt = order.deliveredAt ?? order.updatedAt ?? new Date().toISOString();
  const methods = normalizeMethods(fallbackMethods(order));
  const otpSuffix = order.id.replace(/\D/g, "").slice(-4).padStart(4, "0");

  return {
    methods,
    recipientName: order.recipient.name,
    deliveredAt,
    location: {
      label: order.dropoff.address,
      lat: order.dropoff.coordinates?.lat,
      lng: order.dropoff.coordinates?.lng
    },
    photoUrl: methods.includes("photo") ? `proof://photo/${order.id}` : undefined,
    signatureName: methods.includes("signature") ? order.recipient.name : undefined,
    pinCode: methods.includes("pin") ? otpSuffix : undefined,
    otpCode: methods.includes("otp") ? otpSuffix : undefined,
    verifiedBy: "courier"
  };
}

export function formatProofMethodLabel(method: DeliveryProofMethod): string {
  if (method === "otp") return "OTP";
  if (method === "pin") return "PIN";
  if (method === "photo") return "Photo";
  return "Signature";
}
