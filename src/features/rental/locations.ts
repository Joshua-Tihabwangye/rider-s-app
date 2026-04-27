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
}

export const EVZONE_RENTAL_LOCATIONS: ReadonlyArray<RentalLocationOption> = [
  {
    id: "nsambya_hub",
    displayName: "Nsambya EV Hub",
    address: "Nsambya Road, Kampala",
    availabilityStatus: "available",
    pickupAllowed: true,
    returnAllowed: true
  },
  {
    id: "bugolobi_hub",
    displayName: "Bugolobi EV Hub",
    address: "Luthuli Avenue, Bugolobi",
    availabilityStatus: "available",
    pickupAllowed: true,
    returnAllowed: true
  },
  {
    id: "entebbe_airport_desk",
    displayName: "Entebbe Airport EV Desk",
    address: "Entebbe International Airport",
    availabilityStatus: "available",
    pickupAllowed: true,
    returnAllowed: true
  },
  {
    id: "kampala_central_hub",
    displayName: "Kampala Central EV Hub",
    address: "Kampala Road, Central Business District",
    availabilityStatus: "available",
    pickupAllowed: true,
    returnAllowed: true
  },
  {
    id: "ntinda_hub",
    displayName: "Ntinda EV Hub",
    address: "Ntinda Trading Centre",
    availabilityStatus: "limited",
    pickupAllowed: true,
    returnAllowed: true
  },
  {
    id: "jinja_road_hub",
    displayName: "Jinja Road EV Hub",
    address: "Jinja Road, Nakawa",
    availabilityStatus: "available",
    pickupAllowed: true,
    returnAllowed: true
  }
];

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
