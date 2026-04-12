import type { DeliveryOrderMode, DeliveryOrderModeConfig } from "../../store/types";

export const DELIVERY_ORDER_MODE_OPTIONS: Array<{
  value: DeliveryOrderMode;
  label: string;
  description: string;
}> = [
  { value: "individual", label: "Individual", description: "Personal one-off sending" },
  { value: "family", label: "Family", description: "Manage payer and household member deliveries" },
  { value: "business", label: "Business", description: "Track spend by cost center" },
  { value: "company", label: "Company", description: "Delegate requests with approval workflow" }
];

export function getDeliveryOrderModeLabel(mode: DeliveryOrderMode): string {
  return DELIVERY_ORDER_MODE_OPTIONS.find((item) => item.value === mode)?.label ?? "Individual";
}

export function getDeliveryOrderModeTone(mode: DeliveryOrderMode): {
  bg: string;
  fg: string;
  border: string;
} {
  if (mode === "family") {
    return { bg: "rgba(59,130,246,0.14)", fg: "#1E40AF", border: "rgba(59,130,246,0.28)" };
  }
  if (mode === "business") {
    return { bg: "rgba(15,118,110,0.15)", fg: "#115E59", border: "rgba(15,118,110,0.28)" };
  }
  if (mode === "company") {
    return { bg: "rgba(124,58,237,0.15)", fg: "#5B21B6", border: "rgba(124,58,237,0.28)" };
  }
  return { bg: "rgba(34,197,94,0.14)", fg: "#166534", border: "rgba(34,197,94,0.28)" };
}

export function getDeliveryOrderModeSummary(params: {
  orderMode: DeliveryOrderMode;
  orderModeConfig: DeliveryOrderModeConfig;
}): string {
  if (params.orderMode === "family") {
    const payer = params.orderModeConfig.family?.payer === "member" ? "Member" : "Sender";
    const member = params.orderModeConfig.family?.memberName?.trim();
    return member ? `Family • Payer: ${payer} (${member})` : `Family • Payer: ${payer}`;
  }
  if (params.orderMode === "business") {
    const costCenter = params.orderModeConfig.business?.costCenter?.trim();
    return costCenter ? `Business • Cost center: ${costCenter}` : "Business";
  }
  if (params.orderMode === "company") {
    const requester = params.orderModeConfig.company?.requesterName?.trim();
    const delegate = params.orderModeConfig.company?.delegateName?.trim();
    if (requester && delegate) {
      return `Company • ${requester} via ${delegate}`;
    }
    return "Company";
  }
  return "Individual";
}
