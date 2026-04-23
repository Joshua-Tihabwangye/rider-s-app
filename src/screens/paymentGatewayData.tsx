import React from "react";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";

export type PaymentMethodId = "wallet" | "card" | "mobile";

export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  detail: string;
  accent: string;
  icon: React.ReactElement;
  gatewayTitle: string;
  gatewayDescription: string;
  submitLabel: string;
  processingLabel: string;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "wallet",
    name: "EVzone wallet",
    detail: "Instant debit from wallet balance",
    accent: "#10B981",
    icon: <AccountBalanceWalletRoundedIcon sx={{ fontSize: 22 }} />,
    gatewayTitle: "Confirm EVzone wallet debit",
    gatewayDescription: "Review the ride amount, confirm your wallet balance, and approve the debit.",
    submitLabel: "Pay with EVzone wallet",
    processingLabel: "Wallet debit approved"
  },
  {
    id: "card",
    name: "Bank card",
    detail: "Visa, Mastercard, and virtual cards",
    accent: "#2563EB",
    icon: <CreditCardRoundedIcon sx={{ fontSize: 22 }} />,
    gatewayTitle: "Secure bank card checkout",
    gatewayDescription: "Enter your bank card details on this simulated card-processing page.",
    submitLabel: "Authorize card payment",
    processingLabel: "Card authorization approved"
  },
  {
    id: "mobile",
    name: "Mobile money",
    detail: "MTN and Airtel secure checkout",
    accent: "#F59E0B",
    icon: <SmartphoneRoundedIcon sx={{ fontSize: 22 }} />,
    gatewayTitle: "Approve mobile money prompt",
    gatewayDescription: "Choose your provider and confirm the push prompt from your mobile money wallet.",
    submitLabel: "Send mobile money prompt",
    processingLabel: "Mobile money prompt approved"
  }
];

export function resolveRideFare(rideData: Record<string, unknown>): string {
  const rawFare =
    (typeof rideData.fare === "string" && rideData.fare) ||
    (typeof rideData.totalFare === "string" && rideData.totalFare) ||
    (typeof rideData.fareEstimate === "string" && rideData.fareEstimate) ||
    "UGX 40,365";

  return rawFare.toUpperCase().includes("UGX") ? rawFare : `UGX ${rawFare}`;
}

export function getPaymentMethodById(id: string | undefined): PaymentMethod {
  return PAYMENT_METHODS.find((method) => method.id === id) ?? PAYMENT_METHODS[0];
}
