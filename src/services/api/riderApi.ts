import type { RideTrip } from "../../store/types";
import { getBackendEnabled } from "./config";
import { request } from "./httpClient";

export interface RiderProfileApi {
  riderId: string;
  fullName: string;
  email: string;
  phone: string;
  city?: string;
  country?: string;
  preferredCurrency?: string;
}

export interface RiderNotificationApi {
  id: string;
  userId: string;
  title: string;
  body: string;
  category?: string | null;
  read: boolean;
  createdAt: number;
}

export interface RiderPaymentMethodApi {
  id: string;
  type: "wallet" | "card" | "mobile_money" | "cash";
  label: string;
  enabled?: boolean;
  isDefault: boolean;
  detail?: string;
}

export interface RiderPromoApi {
  code: string;
  description: string;
  discountType: string;
  discountValue: number;
}

export interface RiderCommuteApi {
  id: string;
  name?: string;
  pickupAddress: string;
  dropoffAddress: string;
  schedule?: Record<string, unknown>;
  createdAt?: number;
  updatedAt?: number;
}

export interface RiderTripApi {
  id: string;
  riderId: string;
  driverId?: string;
  status:
  | "requested"
  | "driver_assigned"
  | "driver_arriving"
  | "arrived"
  | "in_progress"
  | "completed"
  | "cancelled";
  pickup: string;
  dropoff: string;
  pickupLocation: { lat: number; lng: number };
  dropoffLocation: { lat: number; lng: number };
  otpCode: string;
  bookedFor?: {
    source: "self" | "contact" | "manual";
    name?: string;
    phone?: string;
    relation?: string;
    contactId?: number | string;
  } | null;
  requestedAt: number;
  updatedAt: number;
  startedAt?: number;
  completedAt?: number;
}

export interface RiderJobOfferApi {
  id: string;
  type: string;
  status: string;
  tripId?: string | null;
  driverId?: string | null;
  distanceMeters?: number;
}

interface RiderTripRequestResponse {
  trip: RiderTripApi;
  jobOffers?: RiderJobOfferApi[];
  nearbyDriverCount: number;
}

export interface CreateRiderTripRequestPayload {
  pickupLabel: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffLabel: string;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  routeSummary?: string;
  routeMode?: "single_stop" | "multi_stop";
  tripType?: "One Way" | "Round Trip" | "Multi-stop";
  tripMode?: "one_way" | "round_trip";
  returnToOrigin?: boolean;
  waypoints?: Array<{
    label: string;
    address: string;
    lat?: number;
    lng?: number;
  }>;
  bookedFor?: {
    source: "self" | "contact" | "manual";
    name?: string;
    phone?: string;
    relation?: string;
    contactId?: number | string;
  } | null;
}

export interface UpdateRiderTripTrackingPayload {
  status?: "assigned" | "driver_en_route" | "arrived" | "in_progress" | "completed" | "cancelled";
  etaMinutes?: number;
  routeSummary?: string;
  distance?: string;
}

// ---------- Delivery types ----------
export interface RiderDeliveryApi {
  id: string;
  riderId: string;
  driverId?: string;
  status: "pending" | "accepted" | "picked_up" | "in_transit" | "delivered" | "cancelled";
  pickupAddress: string;
  dropoffAddress: string;
  itemDescription?: string;
  routeId?: string;
  requestedAt: number;
  updatedAt: number;
  pickedUpAt?: number;
  deliveredAt?: number;
}

export interface CreateRiderDeliveryPayload {
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  itemDescription?: string;
  routeSummary?: string;
}

// ---------- Rental types ----------
export interface RiderRentalApi {
  id: string;
  riderId: string;
  vehicleId: string;
  vehicleName: string;
  status: "upcoming" | "active" | "completed" | "cancelled";
  startDate: string;
  endDate: string;
  totalAmount: number;
  currency: string;
  createdAt: number;
}

export interface CreateRiderRentalPayload {
  vehicleId: string;
  startDate: string; // ISO date
  endDate: string;
  pickupLocation?: { lat: number; lng: number; address: string };
}

// ---------- Tour types ----------
export interface RiderTourApi {
  id: string;
  riderId: string;
  tourId: string;
  tourName: string;
  status: "booked" | "in_progress" | "completed" | "cancelled";
  scheduledDate: string;
  participantsCount: number;
  totalPrice: number;
  currency: string;
  createdAt: number;
}

export interface CreateRiderTourPayload {
  tourId: string;
  scheduledDate: string;
  participantsCount: number;
  specialRequests?: string;
}

// ---------- Ambulance types ----------
export interface RiderAmbulanceApi {
  id: string;
  riderId: string;
  driverId?: string;
  status: "requested" | "dispatched" | "en_route" | "arrived" | "in_progress" | "completed" | "cancelled";
  pickupAddress: string;
  dropoffAddress?: string;
  hospitalName?: string;
  priority: "normal" | "urgent" | "emergency";
  requestedAt: number;
  updatedAt: number;
}

export interface CreateRiderAmbulancePayload {
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffAddress?: string;
  hospitalName?: string;
  priority?: "normal" | "urgent" | "emergency";
}

// ---------- Wallet ----------
export interface RiderWalletApi {
  balance: number;
  currency: string;
  pendingAmount: number;
  lastUpdatedAt: number;
}

export interface RiderWalletTransactionApi {
  id: string;
  type: "top_up" | "ride_payment" | "delivery_payment" | "rental_payment" | "tour_payment" | "ambulance_payment" | "refund" | "adjustment";
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  description: string;
  createdAt: number;
  relatedTripId?: string;
}

// ---------- Preferences ----------
export interface RiderPreferencesApi {
  preferredLanguages: string[];
  notificationSettings: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacySettings: {
    shareLocation: boolean;
    shareRideHistory: boolean;
  };
  ridePreferences: {
    vehicleType: "car" | "bike" | "auto";
    comfortLevel: "standard" | "premium";
  };
}

// ---------- Emergency Contacts ----------
export interface RiderEmergencyContactApi {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export interface CreateRiderEmergencyContactPayload {
  name: string;
  phone: string;
  relationship: string;
  isPrimary?: boolean;
}

// ---------- Safety ----------
export interface RiderSosEventApi {
  id: string;
  tripId?: string;
  type: "sos" | "emergency";
  location?: { lat: number; lng: number };
  message?: string;
  status: "active" | "resolved" | "false_alarm";
  createdAt: number;
}

export function isRiderBackendEnabled(): boolean {
  return getBackendEnabled();
}

// Profile endpoint
export async function getRiderProfile(): Promise<RiderProfileApi> {
  return request<RiderProfileApi>("/riders/me/profile", { method: "GET" });
}

// Trip endpoints
export async function getRiderActiveTrip(): Promise<RiderTripApi | null> {
  return request<RiderTripApi>("/riders/me/trips/active", { method: "GET" });
}

export async function getRiderTripHistory(): Promise<RiderTripApi[]> {
  return request<RiderTripApi[]>("/riders/me/trips/history", { method: "GET" });
}

function persistTripDispatchMetadata(response: RiderTripRequestResponse): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(
    "evzone_last_trip_dispatch",
    JSON.stringify({
      tripId: response.trip.id,
      nearbyDriverCount: response.nearbyDriverCount,
      jobOffers: response.jobOffers ?? [],
      updatedAt: Date.now(),
    }),
  );
}

export async function createRiderTripRequest(payload: CreateRiderTripRequestPayload): Promise<RiderTripApi> {
  const response = await request<RiderTripApi | RiderTripRequestResponse>("/riders/me/trips/request", {
    method: "POST",
    body: payload,
  });

  if (response && typeof response === "object" && "trip" in response) {
    persistTripDispatchMetadata(response);
    return response.trip;
  }

  return response;
}

export async function updateRiderTripTracking(tripId: string, patch: UpdateRiderTripTrackingPayload): Promise<RiderTripApi> {
  return request<RiderTripApi>(`/riders/me/trips/${tripId}/tracking`, {
    method: "PATCH",
    body: patch,
  });
}

// Notification endpoints
export async function getRiderNotifications(): Promise<RiderNotificationApi[]> {
  return request<RiderNotificationApi[]>("/riders/me/notifications", { method: "GET" });
}

export async function listRiderPaymentMethods(): Promise<RiderPaymentMethodApi[]> {
  return request<RiderPaymentMethodApi[]>("/riders/me/payment-methods", { method: "GET" });
}

export async function listRiderEligiblePromos(): Promise<RiderPromoApi[]> {
  return request<RiderPromoApi[]>("/riders/me/promos/eligible", { method: "GET" });
}

export async function listRiderCommutes(): Promise<RiderCommuteApi[]> {
  return request<RiderCommuteApi[]>("/riders/me/commutes", { method: "GET" });
}

export async function listRiderWalletTransfers(): Promise<Array<{
  id: string;
  amount: number;
  destination: string;
  method?: string;
  note?: string;
  createdAt?: number;
}>> {
  return request<Array<{
    id: string;
    amount: number;
    destination: string;
    method?: string;
    note?: string;
    createdAt?: number;
  }>>("/riders/me/wallet/transfers", { method: "GET" });
}

// Mapper: backend RiderTripApi → frontend RideTrip
export function mapApiTripToRideTrip(apiTrip: RiderTripApi): RideTrip {
  const pickup: RideTrip["pickup"] = {
    address: apiTrip.pickup,
    coordinates: apiTrip.pickupLocation,
    label: apiTrip.pickup,
  };
  const dropoff: RideTrip["dropoff"] = {
    address: apiTrip.dropoff,
    coordinates: apiTrip.dropoffLocation,
    label: apiTrip.dropoff,
  };
  return {
    id: apiTrip.id,
    status: mapApiTripStatusToRideStatus(apiTrip.status),
    routeMode: "single_stop",
    tripMode: "one_way",
    otp: apiTrip.otpCode,
    etaMinutes: 0, // Backend may not send ETA; fallback to 0 or derive from other fields if available
    fareEstimate: "", // Not in RiderTripApi; fill from elsewhere if needed
    distance: "", // Not in RiderTripApi
    routeSummary: apiTrip.pickup + " → " + apiTrip.dropoff,
    pickup,
    dropoff,
    routePoints: pickup && dropoff ? [pickup, dropoff] : [],
    legs:
      pickup && dropoff
        ? [
          {
            id: "leg_1",
            from: pickup,
            to: dropoff,
            order: 0,
            status: "pending",
            isReturnLeg: false,
          }
        ]
        : [],
    currentLegIndex: 0,
    totalLegs: 1,
    remainingLegs: 1,
    completedStopIds: [],
    isReturnLeg: false,
    driver: null, // Populate from separate driver endpoint if available
    vehicle: null, // Populate from separate vehicle endpoint if available
    bookedFor: apiTrip.bookedFor ?? null,
    lastKnownLocation: undefined,
    startedAt: apiTrip.startedAt ? new Date(apiTrip.startedAt).toISOString() : undefined,
    completedAt: apiTrip.completedAt ? new Date(apiTrip.completedAt).toISOString() : undefined,
  };
}

function mapApiTripStatusToRideStatus(status: RiderTripApi["status"]): RideTrip["status"] {
  const mapping: Record<RiderTripApi["status"], RideTrip["status"]> = {
    requested: "searching",
    driver_assigned: "driver_assigned",
    driver_arriving: "driver_on_way",
    arrived: "driver_arrived",
    in_progress: "in_progress",
    completed: "completed",
    cancelled: "cancelled"
  };
  return mapping[status] ?? "searching";
}

// Existing functions (getRiderNotifications, getRiderTripHistory, getRiderActiveTrip, createRiderTripRequest, updateRiderTripTracking) are below...

// ---------- Delivery endpoints ----------
export async function listRiderDeliveries(): Promise<RiderDeliveryApi[]> {
  return request<RiderDeliveryApi[]>("/riders/me/deliveries", { method: "GET" });
}

export async function getRiderDelivery(deliveryId: string): Promise<RiderDeliveryApi> {
  return request<RiderDeliveryApi>(`/riders/me/deliveries/${deliveryId}`, { method: "GET" });
}

export async function createRiderDelivery(payload: CreateRiderDeliveryPayload): Promise<RiderDeliveryApi> {
  return request<RiderDeliveryApi>("/riders/me/deliveries", {
    method: "POST",
    body: payload,
  });
}

export async function updateRiderDelivery(deliveryId: string, patch: Partial<RiderDeliveryApi>): Promise<RiderDeliveryApi> {
  return request<RiderDeliveryApi>(`/riders/me/deliveries/${deliveryId}`, {
    method: "PATCH",
    body: patch,
  });
}

export async function cancelRiderDelivery(deliveryId: string, reason?: string): Promise<RiderDeliveryApi> {
  return request<RiderDeliveryApi>(`/riders/me/deliveries/${deliveryId}/cancel`, {
    method: "POST",
    body: reason ? { reason } : undefined,
  });
}

// ---------- Rental endpoints ----------
export async function listRiderRentals(): Promise<RiderRentalApi[]> {
  return request<RiderRentalApi[]>("/riders/me/rentals", { method: "GET" });
}

export async function getRiderRental(rentalId: string): Promise<RiderRentalApi> {
  return request<RiderRentalApi>(`/riders/me/rentals/${rentalId}`, { method: "GET" });
}

export async function createRiderRental(payload: CreateRiderRentalPayload): Promise<RiderRentalApi> {
  return request<RiderRentalApi>("/riders/me/rentals", {
    method: "POST",
    body: payload,
  });
}

export async function updateRiderRental(rentalId: string, patch: Partial<RiderRentalApi>): Promise<RiderRentalApi> {
  return request<RiderRentalApi>(`/riders/me/rentals/${rentalId}`, {
    method: "PATCH",
    body: patch,
  });
}

export async function cancelRiderRental(rentalId: string, reason?: string): Promise<RiderRentalApi> {
  return request<RiderRentalApi>(`/riders/me/rentals/${rentalId}/cancel`, {
    method: "POST",
    body: reason ? { reason } : undefined,
  });
}

// ---------- Tour endpoints ----------
export async function listRiderTours(): Promise<RiderTourApi[]> {
  return request<RiderTourApi[]>("/riders/me/tours", { method: "GET" });
}

export async function getRiderTour(tourId: string): Promise<RiderTourApi> {
  return request<RiderTourApi>(`/riders/me/tours/${tourId}`, { method: "GET" });
}

export async function createRiderTour(payload: CreateRiderTourPayload): Promise<RiderTourApi> {
  return request<RiderTourApi>("/riders/me/tours", {
    method: "POST",
    body: payload,
  });
}

export async function cancelRiderTour(tourId: string, reason?: string): Promise<RiderTourApi> {
  return request<RiderTourApi>(`/riders/me/tours/${tourId}/cancel`, {
    method: "POST",
    body: reason ? { reason } : undefined,
  });
}

// ---------- Ambulance endpoints ----------
export async function listRiderAmbulances(): Promise<RiderAmbulanceApi[]> {
  return request<RiderAmbulanceApi[]>("/riders/me/ambulances", { method: "GET" });
}

export async function getRiderAmbulance(ambulanceId: string): Promise<RiderAmbulanceApi> {
  return request<RiderAmbulanceApi>(`/riders/me/ambulances/${ambulanceId}`, { method: "GET" });
}

export async function createRiderAmbulance(payload: CreateRiderAmbulancePayload): Promise<RiderAmbulanceApi> {
  return request<RiderAmbulanceApi>("/riders/me/ambulances", {
    method: "POST",
    body: payload,
  });
}

export async function updateRiderAmbulance(ambulanceId: string, patch: Partial<RiderAmbulanceApi>): Promise<RiderAmbulanceApi> {
  return request<RiderAmbulanceApi>(`/riders/me/ambulances/${ambulanceId}`, {
    method: "PATCH",
    body: patch,
  });
}

export async function cancelRiderAmbulance(ambulanceId: string, reason?: string): Promise<RiderAmbulanceApi> {
  return request<RiderAmbulanceApi>(`/riders/me/ambulances/${ambulanceId}/cancel`, {
    method: "POST",
    body: reason ? { reason } : undefined,
  });
}

// ---------- Wallet endpoints ----------
export async function getRiderWallet(): Promise<RiderWalletApi> {
  return request<RiderWalletApi>("/riders/me/wallet", { method: "GET" });
}

export async function listRiderWalletTransactions(limit = 20, offset = 0): Promise<RiderWalletTransactionApi[]> {
  return request<RiderWalletTransactionApi[]>("/riders/me/wallet/transactions", {
    method: "GET",
    query: { limit, offset },
  });
}

export async function createRiderWalletTransfer(payload: {
  amount: number;
  destination: string;
  method?: string;
  note?: string;
}): Promise<{ id: string; amount: number; destination: string; method?: string; note?: string }> {
  return request<{ id: string; amount: number; destination: string; method?: string; note?: string }>(
    "/riders/me/wallet/transfers",
    {
      method: "POST",
      body: payload,
    },
  );
}

// Payment methods could be added similarly.

// ---------- Preferences ----------
export async function getRiderPreferences(): Promise<RiderPreferencesApi> {
  return request<RiderPreferencesApi>("/riders/me/preferences", { method: "GET" });
}

export async function patchRiderPreferences(patch: Partial<RiderPreferencesApi>): Promise<RiderPreferencesApi> {
  return request<RiderPreferencesApi>("/riders/me/preferences", {
    method: "PATCH",
    body: patch,
  });
}

// ---------- Emergency Contacts ----------
export async function listRiderEmergencyContacts(): Promise<RiderEmergencyContactApi[]> {
  return request<RiderEmergencyContactApi[]>("/riders/me/emergency-contacts", { method: "GET" });
}

export async function createRiderEmergencyContact(payload: CreateRiderEmergencyContactPayload): Promise<RiderEmergencyContactApi> {
  return request<RiderEmergencyContactApi>("/riders/me/emergency-contacts", {
    method: "POST",
    body: payload,
  });
}

export async function updateRiderEmergencyContact(contactId: string, patch: Partial<CreateRiderEmergencyContactPayload>): Promise<RiderEmergencyContactApi> {
  return request<RiderEmergencyContactApi>(`/riders/me/emergency-contacts/${contactId}`, {
    method: "PATCH",
    body: patch,
  });
}

export async function deleteRiderEmergencyContact(contactId: string): Promise<void> {
  return request<void>(`/riders/me/emergency-contacts/${contactId}`, { method: "DELETE" });
}

// ---------- Safety ----------
export async function triggerRiderSOS(payload: { message?: string; location?: { lat: number; lng: number } }): Promise<RiderSosEventApi> {
  return request<RiderSosEventApi>("/riders/me/sos", {
    method: "POST",
    body: payload,
  });
}

export async function listRiderSOSHistory(): Promise<RiderSosEventApi[]> {
  return request<RiderSosEventApi[]>("/riders/me/sos/history", { method: "GET" });
}

// ─── Fare Estimate ────────────────────────────────────────────────────────────

export interface RideFareOption {
  vehicleCategoryId: string;
  vehicleCategoryName: string;
  fare: {
    baseFare: number;
    distanceCharge: number;
    durationCharge: number;
    surcharge: number;
    subtotal: number;
    total: number;
    minimumFare: number;
    currency: string;
    formula: string;
  };
}

/**
 * Fetches live fare estimates for all active ride vehicle categories.
 * Returns an array so the rider can see options for Motorcycle, Sedan, SUV etc.
 *
 * @param distanceKm  Route distance in kilometres
 * @param durationMin Optional estimated trip duration in minutes
 */
export async function getRideFareEstimates(
  distanceKm: number,
  durationMin?: number,
): Promise<RideFareOption[]> {
  const params = new URLSearchParams({
    distanceKm: String(distanceKm),
    serviceType: "ride",
    ...(durationMin !== undefined ? { durationMinutes: String(durationMin) } : {}),
  });
  return request<RideFareOption[]>(`/riders/me/fare-estimate?${params.toString()}`, {
    method: "GET",
  });
}

/**
 * Fetches a delivery fare estimate for a given vehicle category.
 */
export async function getDeliveryFareEstimate(
  distanceKm: number,
  vehicleCategoryId?: string,
): Promise<RideFareOption["fare"]> {
  const params = new URLSearchParams({
    distanceKm: String(distanceKm),
    serviceType: "delivery",
    ...(vehicleCategoryId ? { vehicleCategoryId } : {}),
  });
  return request<RideFareOption["fare"]>(`/riders/me/fare-estimate?${params.toString()}`, {
    method: "GET",
  });
}
