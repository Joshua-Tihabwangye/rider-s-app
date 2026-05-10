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
  message: string;
  read: boolean;
  createdAt: number;
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
  requestedAt: number;
  updatedAt: number;
  startedAt?: number;
  completedAt?: number;
}

interface RiderTripRequestResponse {
  trip: RiderTripApi;
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
}

export interface UpdateRiderTripTrackingPayload {
  status?: "assigned" | "driver_en_route" | "arrived" | "in_progress" | "completed" | "cancelled";
  etaMinutes?: number;
  routeSummary?: string;
  distance?: string;
}

export function isRiderBackendEnabled(): boolean {
  return getBackendEnabled();
}

export async function getRiderProfile(): Promise<RiderProfileApi> {
  return request<RiderProfileApi>("/riders/me/profile", {
    method: "GET",
  });
}

export async function getRiderNotifications(): Promise<RiderNotificationApi[]> {
  return request<RiderNotificationApi[]>("/riders/me/notifications", {
    method: "GET",
  });
}

export async function getRiderTripHistory(): Promise<RiderTripApi[]> {
  return request<RiderTripApi[]>("/riders/me/trips/history", {
    method: "GET",
  });
}

export async function getRiderActiveTrip(): Promise<RiderTripApi | null> {
  return request<RiderTripApi | null>("/riders/me/trips/active", {
    method: "GET",
  });
}

export async function createRiderTripRequest(
  payload: CreateRiderTripRequestPayload,
): Promise<RiderTripApi> {
  const response = await request<RiderTripRequestResponse>("/riders/me/trips/request", {
    method: "POST",
    body: {
      pickupAddress: payload.pickupAddress,
      pickupLat: payload.pickupLat,
      pickupLng: payload.pickupLng,
      dropoffAddress: payload.dropoffAddress,
      dropoffLat: payload.dropoffLat,
      dropoffLng: payload.dropoffLng,
    },
  });

  return response.trip;
}

export async function updateRiderTripTracking(
  tripId: string,
  payload: UpdateRiderTripTrackingPayload,
): Promise<RiderTripApi> {
  return request<RiderTripApi>(`/riders/me/trips/${tripId}/tracking`, {
    method: "PATCH",
    body: payload,
  });
}

function mapTripStatus(status: RiderTripApi["status"]): RideTrip["status"] {
  switch (status) {
    case "requested":
      return "searching";
    case "driver_assigned":
      return "driver_assigned";
    case "driver_arriving":
      return "driver_on_way";
    case "arrived":
      return "driver_arrived";
    case "in_progress":
      return "ongoing";
    case "completed":
      return "completed";
    case "cancelled":
      return "cancelled";
    default:
      return "idle";
  }
}

export function mapApiTripToRideTrip(trip: RiderTripApi): RideTrip {
  return {
    id: trip.id,
    status: mapTripStatus(trip.status),
    otp: trip.otpCode,
    etaMinutes: 8,
    fareEstimate: "Pending fare",
    distance: "Tracking driver",
    routeSummary: `${trip.pickup} -> ${trip.dropoff}`,
    pickup: {
      label: trip.pickup,
      address: trip.pickup,
      coordinates: trip.pickupLocation,
    },
    dropoff: {
      label: trip.dropoff,
      address: trip.dropoff,
      coordinates: trip.dropoffLocation,
    },
    driver: trip.driverId
      ? {
          id: trip.driverId,
          name: "Assigned driver",
          phone: "+256 700 000000",
          rating: 4.8,
          avatar: "EV",
        }
      : null,
    vehicle: trip.driverId
      ? {
          model: "EV vehicle",
          color: "Green",
          plate: "Pending",
          category: "EV",
        }
      : null,
    startedAt: trip.startedAt ? new Date(trip.startedAt).toISOString() : undefined,
    completedAt: trip.completedAt ? new Date(trip.completedAt).toISOString() : undefined,
  };
}
