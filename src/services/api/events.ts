/**
 * Authoritative realtime event names shared with the backend.
 * Keep this in sync with backend/src/realtime/events.contract.ts.
 */

export const RiderServerEvents = {
  TRIP_DRIVER_ASSIGNED: "trip.driver.assigned",
  TRIP_DRIVER_ARRIVING: "trip.driver.arriving",
  TRIP_ARRIVED: "trip.arrived",
  TRIP_STARTED: "trip.started",
  TRIP_COMPLETED: "trip.completed",
  TRIP_CANCELLED: "trip.cancelled",
  TRIP_LOCATION_UPDATED: "trip.location.updated",
  DELIVERY_PATCH: "delivery.patch",
  DELIVERY_ORDER_NEW: "delivery.order.new",
  DELIVERY_ROUTE_UPDATED: "delivery.route.updated",
} as const;

export const RiderClientEvents = {
  SUBSCRIBE: "subscribe",
  UNSUBSCRIBE: "unsubscribe",
  TRIP_REQUEST: "trip.request",
  TRIP_CANCEL: "trip.cancel",
} as const;

export type RiderServerEvent = (typeof RiderServerEvents)[keyof typeof RiderServerEvents];
export type RiderClientEvent = (typeof RiderClientEvents)[keyof typeof RiderClientEvents];
