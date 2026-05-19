import type { RentalBooking, RentalVehicle } from "../../store/types";
import {
  DEFAULT_CROSS_BORDER_FEE,
  DEFAULT_CHAUFFEUR_DAILY_FEE,
  DEFAULT_ONE_WAY_FEE,
  DEFAULT_REFUNDABLE_DEPOSIT,
  calculateSelectedAddOnsTotal
} from "./custom";

export type RentalModeLabel = "Self-drive" | "With chauffeur";

export interface RentalPricingSummary {
  dailyRate: number;
  durationDays: number;
  rentalSubtotal: number;
  chauffeurFee: number;
  addOnsTotal: number;
  oneWayFee: number;
  crossBorderFee: number;
  isOneWayRental: boolean;
  isCrossBorderRental: boolean;
  refundableDeposit: number;
  dueNow: number;
}

export function parseUgx(value?: string): number {
  if (!value) {
    return 0;
  }

  const numeric = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

export function formatUgx(amount: number): string {
  return `UGX ${Math.round(amount).toLocaleString()}`;
}

export function parseRentalDateTime(value?: string): Date | null {
  if (!value?.trim()) {
    return null;
  }

  const raw = value.trim();
  const normalized =
    raw
      .replace(/\u2022/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}$/.test(normalized)) {
    const isoLike = normalized.replace(" ", "T");
    const parsedIsoLike = new Date(isoLike);
    if (!Number.isNaN(parsedIsoLike.getTime())) {
      return parsedIsoLike;
    }
  }

  const parsed = new Date(normalized);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  return null;
}

export function formatRentalDateTime(value?: string): string {
  const parsed = parseRentalDateTime(value);
  if (!parsed) {
    return value?.trim() || "Not selected";
  }

  return parsed.toLocaleString("en-UG", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

export function getRentalVehicleLabel(vehicleName?: string): string {
  const lower = (vehicleName ?? "").toLowerCase();
  if (lower.includes("van")) {
    return "EV Van";
  }
  if (lower.includes("kona") || lower.includes("suv")) {
    return "Family SUV";
  }
  if (lower.includes("tesla") || lower.includes("sedan")) {
    return "Executive EV";
  }
  return "City EV";
}

export function estimateRentalDays(startDate?: string, endDate?: string): number {
  if (startDate?.trim() && endDate?.trim()) {
    const parsedStart = parseRentalDateTime(startDate);
    const parsedEnd = parseRentalDateTime(endDate);
    if (parsedStart && parsedEnd && parsedEnd > parsedStart) {
      const dayMs = 24 * 60 * 60 * 1000;
      const diffMs = parsedEnd.getTime() - parsedStart.getTime();
      return Math.max(1, Math.ceil(diffMs / dayMs));
    }
  }

  const combined = `${startDate ?? ""} ${endDate ?? ""}`.toLowerCase();
  const plusDaysMatch = combined.match(/\+(\d+)\s*days?/);
  if (plusDaysMatch) {
    return Math.max(1, Number(plusDaysMatch[1]));
  }

  if (combined.includes("2 weeks")) {
    return 14;
  }

  if (combined.includes("1 week")) {
    return 7;
  }

  if (combined.includes("weekend")) {
    return 3;
  }

  if (combined.includes("today only")) {
    return 1;
  }

  return 1;
}

export function formatRentalDateRange(startDate?: string, endDate?: string): string {
  if (startDate && endDate) {
    return `${startDate} -> ${endDate}`;
  }

  if (startDate) {
    return `${startDate} -> Return date pending`;
  }

  if (endDate) {
    return `Pickup date pending -> ${endDate}`;
  }

  return "Dates not selected";
}

export function getRentalBookingVehicle(
  vehicles: RentalVehicle[],
  booking?: RentalBooking | null,
  selectedVehicleId?: string | null
): RentalVehicle | null {
  const vehicleId = booking?.vehicleId ?? selectedVehicleId ?? null;
  return vehicles.find((vehicle) => vehicle.id === vehicleId) ?? vehicles[0] ?? null;
}

export function buildRentalPricing(
  vehicle: RentalVehicle | null,
  booking: RentalBooking
): RentalPricingSummary {
  const dailyRate = parseUgx(vehicle?.dailyPrice);
  const durationDays = estimateRentalDays(booking.startDate, booking.endDate);
  const customPricing = booking.customRequest?.pricing;
  const rentalSubtotal =
    dailyRate > 0
      ? dailyRate * durationDays
      : customPricing?.baseRental && customPricing.baseRental > 0
        ? customPricing.baseRental
        : 0;
  const hasExplicitBranches = Boolean(booking.pickupBranch && booking.dropoffBranch);
  const inferredOneWayRental = hasExplicitBranches
    ? booking.pickupBranch !== booking.dropoffBranch
    : false;
  const isOneWayRental = customPricing?.isOneWayRental ?? inferredOneWayRental;
  const oneWayFee = isOneWayRental
    ? Math.max(
        0,
        customPricing?.oneWayReturnFee ?? customPricing?.oneWayFee ?? DEFAULT_ONE_WAY_FEE
      )
    : 0;
  const isCrossBorderRental =
    customPricing?.isCrossBorderRental ?? booking.customRequest?.crossBorderReturn ?? false;
  const crossBorderFee = isCrossBorderRental
    ? Math.max(0, customPricing?.crossBorderFee ?? DEFAULT_CROSS_BORDER_FEE)
    : 0;
  const isChauffeurRental =
    booking.customRequest?.driverOption === "chauffeur" ||
    booking.rentalMode === "chauffeur";
  const chauffeurFee = isChauffeurRental ? DEFAULT_CHAUFFEUR_DAILY_FEE * durationDays : 0;
  const addOnsTotal =
    booking.customRequest?.addOns && booking.customRequest.addOns.length > 0
      ? calculateSelectedAddOnsTotal(
          booking.customRequest.addOns,
          durationDays,
          booking.customRequest.chauffeurWaitingTimeHours ?? 0
        )
      : customPricing?.addOnsTotal ?? 0;
  const refundableDeposit = customPricing?.refundableDeposit ?? DEFAULT_REFUNDABLE_DEPOSIT;
  const dueNow =
    rentalSubtotal + oneWayFee + crossBorderFee + chauffeurFee + addOnsTotal;

  return {
    dailyRate,
    durationDays,
    rentalSubtotal,
    chauffeurFee,
    addOnsTotal,
    oneWayFee,
    crossBorderFee,
    isOneWayRental,
    isCrossBorderRental,
    refundableDeposit,
    dueNow
  };
}

export function getRentalModeLabel(booking: RentalBooking): RentalModeLabel {
  if (booking.customRequest?.driverOption === "chauffeur" || booking.rentalMode === "chauffeur") {
    return "With chauffeur";
  }

  return "Self-drive";
}

export function getRentalStatusLabel(status: RentalBooking["status"]): string {
  switch (status) {
    case "pending_payment":
      return "Pending payment";
    case "confirmed":
      return "Upcoming";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    case "failed_payment":
      return "Payment failed";
    default:
      return "Draft";
  }
}
