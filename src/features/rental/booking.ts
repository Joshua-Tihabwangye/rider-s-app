import type { RentalBooking, RentalVehicle } from "../../store/types";

const DEFAULT_ONE_WAY_FEE = 40_000;
const DEFAULT_REFUNDABLE_DEPOSIT = 300_000;

export interface RentalPricingSummary {
  dailyRate: number;
  durationDays: number;
  rentalSubtotal: number;
  oneWayFee: number;
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

export function estimateRentalDays(startDate?: string, endDate?: string): number {
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

  if (startDate?.trim() && endDate?.trim()) {
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
  const rentalSubtotal = dailyRate * durationDays;
  const oneWayFee =
    booking.pickupBranch && booking.dropoffBranch && booking.pickupBranch !== booking.dropoffBranch
      ? DEFAULT_ONE_WAY_FEE
      : 0;
  const refundableDeposit = DEFAULT_REFUNDABLE_DEPOSIT;
  const dueNow = rentalSubtotal + oneWayFee;

  return {
    dailyRate,
    durationDays,
    rentalSubtotal,
    oneWayFee,
    refundableDeposit,
    dueNow
  };
}

export function getRentalStatusLabel(status: RentalBooking["status"]): string {
  switch (status) {
    case "confirmed":
      return "Upcoming";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return "Draft";
  }
}
