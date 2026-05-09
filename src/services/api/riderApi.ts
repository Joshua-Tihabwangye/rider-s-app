import type { RideTrip } from "../../store/types";
import { USE_BACKEND } from "./config";
import { request } from "./httpClient";

export interface RiderProfileApi {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  provider: "email" | "evzone" | "google" | "apple";
  role: "rider";
  initials: string;
}

export interface RiderNotificationApi {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: "status" | "payment" | "security" | "promo";
  read: boolean;
  createdAt: number;
}

export interface RiderTripApi {
  id: string;
  userId: string;
  status: "requested" | "assigned" | "driver_en_route" | "arrived" | "in_progress" | "completed" | "cancelled";
  pickupLabel: string;
  pickupAddress: string;
  dropoffLabel: string;
  dropoffAddress: string;
  etaMinutes: number;
  fareEstimate: string;
  distance: string;
  routeSummary: string;
  driverName: string;
  driverPhone: string;
  driverRating: number;
  vehicleModel: string;
  vehicleColor: string;
  vehiclePlate: string;
  otpCode: string;
  startedAt?: number;
  completedAt?: number;
  updatedAt: number;
}

export interface CreateRiderTripRequestPayload {
  pickupLabel: string;
  pickupAddress: string;
  dropoffLabel: string;
  dropoffAddress: string;
  routeSummary?: string;
  fareEstimate?: string;
  distance?: string;
}

export interface UpdateRiderTripTrackingPayload {
  status?: "assigned" | "driver_en_route" | "arrived" | "in_progress" | "completed" | "cancelled";
  etaMinutes?: number;
  routeSummary?: string;
  distance?: string;
}

function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function isRiderBackendEnabled(): boolean {
  return USE_BACKEND;
}

export async function getRiderProfile(token: string): Promise<RiderProfileApi> {
  return request<RiderProfileApi>("/riders/me/profile", {
    method: "GET",
    headers: authHeaders(token),
  });
}

export async function getRiderNotifications(token: string): Promise<RiderNotificationApi[]> {
  return request<RiderNotificationApi[]>("/riders/me/notifications", {
    method: "GET",
    headers: authHeaders(token),
  });
}

export async function getRiderTripHistory(token: string): Promise<RiderTripApi[]> {
  return request<RiderTripApi[]>("/riders/me/trips/history", {
    method: "GET",
    headers: authHeaders(token),
  });
}

export async function getRiderActiveTrip(token: string): Promise<RiderTripApi | null> {
  return request<RiderTripApi | null>("/riders/me/trips/active", {
    method: "GET",
    headers: authHeaders(token),
  });
}

export async function createRiderTripRequest(
  token: string,
  payload: CreateRiderTripRequestPayload,
): Promise<RiderTripApi> {
  return request<RiderTripApi>("/riders/me/trips/request", {
    method: "POST",
    headers: authHeaders(token),
    body: payload,
  });
}

export async function updateRiderTripTracking(
  token: string,
  tripId: string,
  payload: UpdateRiderTripTrackingPayload,
): Promise<RiderTripApi> {
  return request<RiderTripApi>(`/riders/me/trips/${tripId}/tracking`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: payload,
  });
}

function mapTripStatus(status: RiderTripApi["status"]): RideTrip["status"] {
  switch (status) {
    case "requested":
      return "searching";
    case "assigned":
      return "driver_assigned";
    case "driver_en_route":
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
    etaMinutes: trip.etaMinutes,
    fareEstimate: trip.fareEstimate,
    distance: trip.distance,
    routeSummary: trip.routeSummary,
    pickup: {
      label: trip.pickupLabel,
      address: trip.pickupAddress,
    },
    dropoff: {
      label: trip.dropoffLabel,
      address: trip.dropoffAddress,
    },
    driver: {
      id: `driver_${trip.id}`,
      name: trip.driverName,
      phone: trip.driverPhone,
      rating: trip.driverRating,
      avatar: trip.driverName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "EV",
    },
    vehicle: {
      model: trip.vehicleModel,
      color: trip.vehicleColor,
      plate: trip.vehiclePlate,
      category: "EV",
    },
    startedAt: trip.startedAt ? new Date(trip.startedAt).toISOString() : undefined,
    completedAt: trip.completedAt ? new Date(trip.completedAt).toISOString() : undefined,
  };
}
