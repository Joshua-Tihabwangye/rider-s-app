import type { TourGatewayOutcome } from "../../store/types";

export interface TourCardFormInput {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export interface TourCardFormErrors {
  cardholderName?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
}

export function formatUgxAmount(amount: number): string {
  return `UGX ${Math.round(amount).toLocaleString()}`;
}

export function normalizeDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatCardNumberInput(value: string): string {
  const digits = normalizeDigits(value).slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function formatExpiryInput(value: string): string {
  const digits = normalizeDigits(value).slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function maskCardNumber(cardNumber: string): string {
  const digits = normalizeDigits(cardNumber);
  const last4 = digits.slice(-4).padStart(4, "*");
  return `**** **** **** ${last4}`;
}

export function validateCardForm(input: TourCardFormInput): TourCardFormErrors {
  const errors: TourCardFormErrors = {};
  const cardholderName = input.cardholderName.trim();
  const cardNumberDigits = normalizeDigits(input.cardNumber);
  const expiry = input.expiry.trim();
  const cvvDigits = normalizeDigits(input.cvv);

  if (cardholderName.length < 2) {
    errors.cardholderName = "Cardholder name is required.";
  }

  if (cardNumberDigits.length !== 16) {
    errors.cardNumber = "Card number must be 16 digits.";
  }

  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    errors.expiry = "Expiry must be in MM/YY format.";
  }

  if (cvvDigits.length < 3 || cvvDigits.length > 4) {
    errors.cvv = "CVV must be 3 or 4 digits.";
  }

  return errors;
}

export function resolveCardOutcome(cardNumber: string): TourGatewayOutcome | null {
  const digits = normalizeDigits(cardNumber);
  if (digits === "4242424242424242") {
    return "success";
  }
  if (digits === "4000000000000002") {
    return "failed";
  }
  if (digits === "4000000000009995") {
    return "insufficient_funds";
  }
  if (digits === "4000000000003220") {
    return "requires_verification";
  }
  return null;
}

export function resolveMobileMoneyOutcome(phoneNumber: string): TourGatewayOutcome | null {
  const digits = normalizeDigits(phoneNumber);
  const localTen = digits.slice(-10);

  if (localTen === "0700000001") {
    return "success";
  }
  if (localTen === "0700000002") {
    return "declined";
  }
  if (localTen === "0700000003") {
    return "timeout";
  }
  if (localTen === "0700000004") {
    return "insufficient_funds";
  }

  return null;
}

export function resolveGatewayFailure(
  outcome: TourGatewayOutcome
): { status: "failed" | "declined" | "timeout" | "insufficient_funds"; reason: string } {
  switch (outcome) {
    case "declined":
      return {
        status: "declined",
        reason: "The payment was declined by your provider."
      };
    case "timeout":
      return {
        status: "timeout",
        reason: "The payment request timed out before approval."
      };
    case "insufficient_funds":
      return {
        status: "insufficient_funds",
        reason: "Insufficient funds or balance for this payment."
      };
    case "failed":
    default:
      return {
        status: "failed",
        reason: "Payment failed. Please verify details and try again."
      };
  }
}

export function validateMobileMoneyPhone(phoneNumber: string): string | null {
  const digits = normalizeDigits(phoneNumber);
  const localTen = digits.slice(-10);
  if (!/^0\d{9}$/.test(localTen)) {
    return "Enter a valid Uganda phone number (e.g. 0700000001).";
  }
  return null;
}
