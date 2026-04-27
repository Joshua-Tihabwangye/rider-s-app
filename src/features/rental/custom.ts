import type {
  RentalAddOnSelection,
  RentalContactPreference,
  RentalCustomEstimate,
  RentalModeOption,
  RentalTripPurpose,
  RentalVehiclePreferenceType
} from "../../store/types";

export const DEFAULT_BASE_DAILY_RATE = 180_000;
export const DEFAULT_ONE_WAY_FEE = 40_000;
export const DEFAULT_REFUNDABLE_DEPOSIT = 300_000;
export const DEFAULT_CHAUFFEUR_DAILY_FEE = 80_000;

export interface RentalOption<TValue extends string> {
  value: TValue;
  label: string;
}

export const RENTAL_TRIP_PURPOSE_OPTIONS: ReadonlyArray<RentalOption<RentalTripPurpose>> = [
  { value: "personal", label: "Personal" },
  { value: "business", label: "Business" },
  { value: "airport_transfer", label: "Airport transfer" },
  { value: "event", label: "Event" },
  { value: "wedding", label: "Wedding" },
  { value: "tourism", label: "Tourism" },
  { value: "corporate", label: "Corporate" },
  { value: "emergency", label: "Emergency" },
  { value: "other", label: "Other" }
];

export const RENTAL_VEHICLE_PREFERENCE_OPTIONS: ReadonlyArray<
  RentalOption<RentalVehiclePreferenceType>
> = [
  { value: "compact_ev", label: "Compact EV" },
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "van", label: "Van / Group transport" },
  { value: "luxury_ev", label: "Luxury EV" },
  { value: "any", label: "Any available EV" }
];

export const RENTAL_CONTACT_PREFERENCE_OPTIONS: ReadonlyArray<
  RentalOption<RentalContactPreference>
> = [
  { value: "call", label: "Phone call" },
  { value: "sms", label: "SMS" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" }
];

export const RENTAL_DRIVER_LANGUAGE_OPTIONS: ReadonlyArray<string> = [
  "English",
  "Luganda",
  "Swahili",
  "French"
];

export interface RentalAddOnCatalogItem {
  id: string;
  name: string;
  description: string;
  price: number;
  pricingType: RentalAddOnSelection["pricingType"];
}

export const RENTAL_ADD_ON_CATALOG: ReadonlyArray<RentalAddOnCatalogItem> = [
  {
    id: "premium_insurance",
    name: "Premium insurance",
    description: "Extended protection with lower excess.",
    price: 45_000,
    pricingType: "per_day"
  },
  {
    id: "extra_mileage",
    name: "Extra mileage package",
    description: "Adds an extra 100 km daily allowance.",
    price: 30_000,
    pricingType: "per_day"
  },
  {
    id: "additional_driver",
    name: "Additional driver",
    description: "Register one more verified driver.",
    price: 40_000,
    pricingType: "per_trip"
  },
  {
    id: "child_seat",
    name: "Child seat / booster seat",
    description: "Safety seat add-on based on age.",
    price: 20_000,
    pricingType: "per_trip"
  },
  {
    id: "airport_assistance",
    name: "Airport pickup assistance",
    description: "Meet and assist service at arrivals.",
    price: 35_000,
    pricingType: "per_trip"
  },
  {
    id: "doorstep_delivery",
    name: "Doorstep delivery",
    description: "Vehicle delivered to your preferred location.",
    price: 60_000,
    pricingType: "one_time"
  },
  {
    id: "doorstep_collection",
    name: "Doorstep vehicle collection",
    description: "Vehicle pickup after your trip ends.",
    price: 60_000,
    pricingType: "one_time"
  },
  {
    id: "chauffeur_waiting",
    name: "Chauffeur waiting time",
    description: "Extra standby hours for chauffeur trips.",
    price: 12_000,
    pricingType: "per_hour"
  },
  {
    id: "wifi_hotspot",
    name: "Wi-Fi hotspot",
    description: "In-car Wi-Fi hotspot during your rental.",
    price: 15_000,
    pricingType: "per_day"
  },
  {
    id: "phone_charging_kit",
    name: "Phone charging kit",
    description: "Universal charging accessories.",
    price: 10_000,
    pricingType: "one_time"
  },
  {
    id: "bottled_water",
    name: "Bottled water",
    description: "Complimentary chilled bottled water pack.",
    price: 8_000,
    pricingType: "per_trip"
  },
  {
    id: "luxury_interior",
    name: "Luxury interior package",
    description: "Premium cabin setup and comfort add-ons.",
    price: 55_000,
    pricingType: "per_day"
  },
  {
    id: "vip_chauffeur",
    name: "VIP chauffeur service",
    description: "Senior chauffeur with protocol support.",
    price: 95_000,
    pricingType: "per_day"
  },
  {
    id: "event_decor",
    name: "Event decoration package",
    description: "Basic decor setup for events and weddings.",
    price: 120_000,
    pricingType: "one_time"
  },
  {
    id: "security_escort",
    name: "Security escort",
    description: "Escort coordination for high-security trips.",
    price: 180_000,
    pricingType: "per_trip"
  },
  {
    id: "priority_support",
    name: "Priority support",
    description: "Dedicated support line with fast response.",
    price: 25_000,
    pricingType: "per_trip"
  }
];

export function createDefaultRentalAddOns(): RentalAddOnSelection[] {
  return RENTAL_ADD_ON_CATALOG.map((item) => ({
    ...item,
    selected: false
  }));
}

function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime());
}

export function countCustomRentalDays(
  pickupDateTime: string,
  returnDateTime: string
): number {
  const pickup = new Date(pickupDateTime);
  const dropoff = new Date(returnDateTime);
  if (!isValidDate(pickup) || !isValidDate(dropoff) || dropoff <= pickup) {
    return 1;
  }

  const dayMs = 24 * 60 * 60 * 1000;
  const diffMs = dropoff.getTime() - pickup.getTime();
  return Math.max(1, Math.ceil(diffMs / dayMs));
}

export function buildRentalDurationLabel(durationDays: number): string {
  return `${durationDays} day${durationDays === 1 ? "" : "s"}`;
}

export function calculateAddOnCost(
  addOn: RentalAddOnSelection,
  durationDays: number,
  chauffeurWaitingTimeHours: number
): number {
  if (!addOn.selected) {
    return 0;
  }

  switch (addOn.pricingType) {
    case "per_day":
      return addOn.price * durationDays;
    case "per_hour": {
      const hours = Math.max(1, Math.round(chauffeurWaitingTimeHours || 1));
      return addOn.price * hours;
    }
    case "per_trip":
    case "one_time":
    default:
      return addOn.price;
  }
}

export function calculateSelectedAddOnsTotal(
  addOns: RentalAddOnSelection[],
  durationDays: number,
  chauffeurWaitingTimeHours: number
): number {
  return addOns.reduce(
    (total, addOn) =>
      total + calculateAddOnCost(addOn, durationDays, chauffeurWaitingTimeHours),
    0
  );
}

export function buildCustomRentalEstimate(params: {
  pickupDateTime: string;
  returnDateTime: string;
  differentDropoff: boolean;
  driverOption: RentalModeOption;
  addOns: RentalAddOnSelection[];
  chauffeurWaitingTimeHours: number;
  baseDailyRate?: number;
}): RentalCustomEstimate {
  const durationDays = countCustomRentalDays(
    params.pickupDateTime,
    params.returnDateTime
  );
  const baseDailyRate = Math.max(0, params.baseDailyRate ?? DEFAULT_BASE_DAILY_RATE);
  const baseRental = baseDailyRate * durationDays;
  const chauffeurFee =
    params.driverOption === "chauffeur"
      ? DEFAULT_CHAUFFEUR_DAILY_FEE * durationDays
      : 0;
  const addOnsTotal = calculateSelectedAddOnsTotal(
    params.addOns,
    durationDays,
    params.chauffeurWaitingTimeHours
  );
  const oneWayFee = params.differentDropoff ? DEFAULT_ONE_WAY_FEE : 0;
  const refundableDeposit = DEFAULT_REFUNDABLE_DEPOSIT;
  const totalEstimated = baseRental + chauffeurFee + addOnsTotal + oneWayFee;

  return {
    baseRental,
    chauffeurFee,
    addOnsTotal,
    oneWayFee,
    refundableDeposit,
    totalEstimated,
    durationDays
  };
}
