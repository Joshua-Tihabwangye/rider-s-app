export type RentalLocationAvailabilityStatus =
  | "available"
  | "limited"
  | "unavailable";

export interface RentalLocationOption {
  id: string;
  displayName: string;
  address: string;
  availabilityStatus: RentalLocationAvailabilityStatus;
  pickupAllowed: boolean;
  returnAllowed: boolean;
  countryCode: string;
  country: string;
  region: string;
  latitude: number;
  longitude: number;
  supportsOneWayReturn: boolean;
  supportsCrossBorderReturn: boolean;
  oneWayExtraFee?: number;
  crossBorderExtraFee?: number;
  notes?: string;
  crossBorderPickupCountryCodes?: string[];
}

export interface RentalCountryOption {
  code: string;
  name: string;
}

export interface RentalRegionOption {
  countryCode: string;
  name: string;
}

const RETURN_REGION_CATALOG: Record<string, string[]> = {
  UG: ["Kampala", "Mbarara", "Entebbe", "Gulu", "Jinja"],
  RW: ["Kigali", "Huye"],
  KE: ["Nairobi", "Kisumu"],
  TZ: ["Dar es Salaam", "Arusha"]
};

export const EVZONE_RENTAL_LOCATIONS: ReadonlyArray<RentalLocationOption> = [
  {
    id: "nsambya_hub",
    displayName: "Nsambya EV Hub",
    address: "Nsambya Road, Kampala, Uganda",
    availabilityStatus: "available",
    pickupAllowed: true,
    returnAllowed: true,
    countryCode: "UG",
    country: "Uganda",
    region: "Kampala",
    latitude: 0.2997,
    longitude: 32.5889,
    supportsOneWayReturn: true,
    supportsCrossBorderReturn: true,
    oneWayExtraFee: 40000,
    crossBorderExtraFee: 120000,
    notes: "Cross-border return may require prior approval and customs documents.",
    crossBorderPickupCountryCodes: ["UG", "RW", "KE", "TZ"]
  },
  {
    id: "bugolobi_hub",
    displayName: "Bugolobi EV Hub",
    address: "Luthuli Avenue, Bugolobi, Kampala, Uganda",
    availabilityStatus: "available",
    pickupAllowed: true,
    returnAllowed: true,
    countryCode: "UG",
    country: "Uganda",
    region: "Kampala",
    latitude: 0.3172,
    longitude: 32.6189,
    supportsOneWayReturn: true,
    supportsCrossBorderReturn: false,
    oneWayExtraFee: 40000
  },
  {
    id: "entebbe_airport_desk",
    displayName: "Entebbe Airport EV Desk",
    address: "Entebbe International Airport, Uganda",
    availabilityStatus: "available",
    pickupAllowed: true,
    returnAllowed: true,
    countryCode: "UG",
    country: "Uganda",
    region: "Entebbe",
    latitude: 0.0424,
    longitude: 32.4435,
    supportsOneWayReturn: true,
    supportsCrossBorderReturn: true,
    oneWayExtraFee: 45000,
    crossBorderExtraFee: 125000,
    notes: "Airport desk has fixed handover windows for cross-border returns.",
    crossBorderPickupCountryCodes: ["UG", "RW", "KE", "TZ"]
  },
  {
    id: "kampala_central_hub",
    displayName: "Kampala Central EV Hub",
    address: "Kampala Road, Central Business District, Uganda",
    availabilityStatus: "available",
    pickupAllowed: true,
    returnAllowed: true,
    countryCode: "UG",
    country: "Uganda",
    region: "Kampala",
    latitude: 0.3139,
    longitude: 32.5814,
    supportsOneWayReturn: true,
    supportsCrossBorderReturn: true,
    oneWayExtraFee: 40000,
    crossBorderExtraFee: 120000,
    crossBorderPickupCountryCodes: ["UG", "RW", "KE", "TZ"]
  },
  {
    id: "ntinda_hub",
    displayName: "Ntinda EV Hub",
    address: "Ntinda Trading Centre, Kampala, Uganda",
    availabilityStatus: "limited",
    pickupAllowed: true,
    returnAllowed: true,
    countryCode: "UG",
    country: "Uganda",
    region: "Kampala",
    latitude: 0.3536,
    longitude: 32.6148,
    supportsOneWayReturn: true,
    supportsCrossBorderReturn: false,
    oneWayExtraFee: 40000
  },
  {
    id: "jinja_road_hub",
    displayName: "Jinja Road EV Hub",
    address: "Jinja Road, Nakawa, Kampala, Uganda",
    availabilityStatus: "available",
    pickupAllowed: true,
    returnAllowed: true,
    countryCode: "UG",
    country: "Uganda",
    region: "Kampala",
    latitude: 0.3206,
    longitude: 32.605,
    supportsOneWayReturn: true,
    supportsCrossBorderReturn: false,
    oneWayExtraFee: 40000
  },
  {
    id: "mbarara_hub",
    displayName: "Mbarara EV Hub",
    address: "Mbarara City Centre, Uganda",
    availabilityStatus: "available",
    pickupAllowed: true,
    returnAllowed: true,
    countryCode: "UG",
    country: "Uganda",
    region: "Mbarara",
    latitude: -0.6072,
    longitude: 30.6545,
    supportsOneWayReturn: true,
    supportsCrossBorderReturn: true,
    oneWayExtraFee: 55000,
    crossBorderExtraFee: 135000,
    notes: "Cross-border return from Mbarara requires advance support confirmation.",
    crossBorderPickupCountryCodes: ["UG", "RW", "TZ"]
  },
  {
    id: "kigali_ev_hub",
    displayName: "Kigali EV Hub",
    address: "Kacyiru, Kigali, Rwanda",
    availabilityStatus: "available",
    pickupAllowed: true,
    returnAllowed: true,
    countryCode: "RW",
    country: "Rwanda",
    region: "Kigali",
    latitude: -1.9441,
    longitude: 30.0619,
    supportsOneWayReturn: true,
    supportsCrossBorderReturn: true,
    oneWayExtraFee: 70000,
    crossBorderExtraFee: 180000,
    notes: "Cross-border returns require passport, vehicle permit, and insurance validation.",
    crossBorderPickupCountryCodes: ["UG", "RW", "KE", "TZ"]
  },
  {
    id: "kigali_airport_desk",
    displayName: "Kigali Airport EV Desk",
    address: "Kigali International Airport, Rwanda",
    availabilityStatus: "limited",
    pickupAllowed: true,
    returnAllowed: true,
    countryCode: "RW",
    country: "Rwanda",
    region: "Kigali",
    latitude: -1.9686,
    longitude: 30.1395,
    supportsOneWayReturn: true,
    supportsCrossBorderReturn: true,
    oneWayExtraFee: 70000,
    crossBorderExtraFee: 180000,
    crossBorderPickupCountryCodes: ["UG", "RW"]
  },
  {
    id: "nairobi_ev_hub",
    displayName: "Nairobi EV Hub",
    address: "Westlands, Nairobi, Kenya",
    availabilityStatus: "limited",
    pickupAllowed: true,
    returnAllowed: true,
    countryCode: "KE",
    country: "Kenya",
    region: "Nairobi",
    latitude: -1.2648,
    longitude: 36.801,
    supportsOneWayReturn: true,
    supportsCrossBorderReturn: true,
    oneWayExtraFee: 90000,
    crossBorderExtraFee: 210000,
    notes: "Cross-border return desk operates 08:00-20:00 local time.",
    crossBorderPickupCountryCodes: ["UG", "KE"]
  },
  {
    id: "dar_es_salaam_ev_hub",
    displayName: "Dar es Salaam EV Hub",
    address: "Masaki, Dar es Salaam, Tanzania",
    availabilityStatus: "limited",
    pickupAllowed: true,
    returnAllowed: true,
    countryCode: "TZ",
    country: "Tanzania",
    region: "Dar es Salaam",
    latitude: -6.79,
    longitude: 39.276,
    supportsOneWayReturn: true,
    supportsCrossBorderReturn: true,
    oneWayExtraFee: 95000,
    crossBorderExtraFee: 220000,
    notes: "Cross-border returns require insurance confirmation before trip start.",
    crossBorderPickupCountryCodes: ["UG", "TZ", "RW"]
  }
];

function getUniqueCountries(): RentalCountryOption[] {
  const byCode = new Map<string, RentalCountryOption>();
  EVZONE_RENTAL_LOCATIONS.forEach((location) => {
    if (!byCode.has(location.countryCode)) {
      byCode.set(location.countryCode, {
        code: location.countryCode,
        name: location.country
      });
    }
  });
  return Array.from(byCode.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function getLocationById(locationId: string): RentalLocationOption | undefined {
  return EVZONE_RENTAL_LOCATIONS.find((location) => location.id === locationId);
}

export function getPickupLocations(): RentalLocationOption[] {
  return EVZONE_RENTAL_LOCATIONS.filter(
    (location) => location.pickupAllowed && location.availabilityStatus !== "unavailable"
  );
}

export function getReturnLocations(): RentalLocationOption[] {
  return EVZONE_RENTAL_LOCATIONS.filter(
    (location) => location.returnAllowed && location.availabilityStatus !== "unavailable"
  );
}

export function getRentalCountries(): RentalCountryOption[] {
  return getUniqueCountries();
}

export function getRentalRegionsByCountry(countryCode: string): RentalRegionOption[] {
  if (!countryCode) {
    return [];
  }

  const catalogRegions = RETURN_REGION_CATALOG[countryCode] ?? [];
  const locationRegions = getReturnLocations()
    .filter((location) => location.countryCode === countryCode)
    .map((location) => location.region);

  const uniqueRegions = Array.from(new Set([...catalogRegions, ...locationRegions])).sort((a, b) =>
    a.localeCompare(b)
  );

  return uniqueRegions.map((name) => ({ countryCode, name }));
}

export function getReturnLocationsByCountryAndRegion(params: {
  countryCode: string;
  region: string;
  pickupCountryCode?: string;
}): RentalLocationOption[] {
  const { countryCode, region, pickupCountryCode } = params;
  if (!countryCode || !region) {
    return [];
  }

  const isCrossBorder = Boolean(
    pickupCountryCode && pickupCountryCode.trim() && pickupCountryCode !== countryCode
  );

  return getReturnLocations().filter((location) => {
    if (location.countryCode !== countryCode || location.region !== region) {
      return false;
    }

    if (isCrossBorder) {
      if (!location.supportsCrossBorderReturn) {
        return false;
      }
      if (
        pickupCountryCode &&
        location.crossBorderPickupCountryCodes &&
        location.crossBorderPickupCountryCodes.length > 0 &&
        !location.crossBorderPickupCountryCodes.includes(pickupCountryCode)
      ) {
        return false;
      }
      return true;
    }

    return location.supportsOneWayReturn || location.pickupAllowed;
  });
}

export function isCrossBorderReturn(
  pickupLocationId: string,
  returnLocationId: string
): boolean {
  const pickupLocation = getLocationById(pickupLocationId);
  const returnLocation = getLocationById(returnLocationId);
  if (!pickupLocation || !returnLocation) {
    return false;
  }
  return pickupLocation.countryCode !== returnLocation.countryCode;
}

export function getReturnLocationFees(params: {
  pickupLocationId: string;
  returnLocationId: string;
}): { oneWayReturnFee: number; crossBorderFee: number } {
  const pickupLocation = getLocationById(params.pickupLocationId);
  const returnLocation = getLocationById(params.returnLocationId);

  if (!pickupLocation || !returnLocation || pickupLocation.id === returnLocation.id) {
    return { oneWayReturnFee: 0, crossBorderFee: 0 };
  }

  const oneWayReturnFee = Math.max(
    0,
    returnLocation.oneWayExtraFee ?? pickupLocation.oneWayExtraFee ?? 0
  );

  const crossBorderFee =
    pickupLocation.countryCode !== returnLocation.countryCode
      ? Math.max(
          0,
          returnLocation.crossBorderExtraFee ?? pickupLocation.crossBorderExtraFee ?? 0
        )
      : 0;

  return {
    oneWayReturnFee,
    crossBorderFee
  };
}
