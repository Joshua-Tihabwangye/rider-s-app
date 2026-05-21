export const RIDE_MAX_STOPS = 6;

export const ROUND_TRIP_RETURN_PATTERNS = ["direct", "reverse_stops"] as const;
export type RoundTripReturnPattern = (typeof ROUND_TRIP_RETURN_PATTERNS)[number];
export const DEFAULT_ROUND_TRIP_RETURN_PATTERN: RoundTripReturnPattern = "direct";
