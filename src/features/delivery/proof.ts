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

function buildSignatureImageUrl(orderId: string, recipientName: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 220'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#f8fafc'/><stop offset='100%' stop-color='#e2e8f0'/></linearGradient></defs><rect width='640' height='220' fill='url(#g)'/><text x='26' y='48' fill='#334155' font-size='18' font-family='Arial, sans-serif'>Recipient signature confirmation</text><text x='26' y='80' fill='#64748b' font-size='14' font-family='Arial, sans-serif'>Order ${orderId}</text><text x='26' y='104' fill='#64748b' font-size='14' font-family='Arial, sans-serif'>Recipient ${recipientName}</text><path d='M48 168 C120 132 176 196 244 160 C280 142 314 146 348 172 C380 194 430 198 478 162 C514 136 548 140 592 168' stroke='#0f172a' stroke-width='3.5' fill='none' stroke-linecap='round'/><path d='M70 186 L598 186' stroke='#94a3b8' stroke-width='1.4' stroke-dasharray='6 6'/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
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

export function createSenderSignatureProof(order: DeliveryOrder): DeliveryProofOfDelivery {
  const deliveredAt = order.deliveredAt ?? order.updatedAt ?? new Date().toISOString();
  const auto = createAutoProofOfDelivery({ ...order, deliveredAt });
  const signatureImageUrl = buildSignatureImageUrl(order.id, order.recipient.name);

  return {
    ...auto,
    methods: normalizeMethods([...auto.methods, "photo", "signature"]),
    deliveredAt,
    photoUrl: signatureImageUrl,
    signatureImageUrl,
    signatureName: order.recipient.name,
    verifiedBy: "courier"
  };
}

export function formatProofMethodLabel(method: DeliveryProofMethod): string {
  if (method === "otp") return "OTP";
  if (method === "pin") return "PIN";
  if (method === "photo") return "Photo";
  return "Signature";
}
