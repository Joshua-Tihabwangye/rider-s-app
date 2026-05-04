import type { Coordinates } from "./maps";

export type LocationPermissionState = PermissionState | "unsupported";

export interface LocationWatchOptions {
  enableHighAccuracy?: boolean;
  timeoutMs?: number;
  maximumAgeMs?: number;
  minEmitIntervalMs?: number;
  minDistanceMeters?: number;
}

const DEFAULT_OPTIONS: Required<LocationWatchOptions> = {
  enableHighAccuracy: false,
  timeoutMs: 10000,
  maximumAgeMs: 15000,
  minEmitIntervalMs: 12000,
  minDistanceMeters: 10
};

function toCoordinates(position: GeolocationPosition): Coordinates {
  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
}

export async function getLocationPermissionState(): Promise<LocationPermissionState> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return "unsupported";
  }

  if (!navigator.permissions?.query) {
    return "prompt";
  }

  try {
    const permission = await navigator.permissions.query({ name: "geolocation" });
    return permission.state;
  } catch {
    return "prompt";
  }
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function distanceMeters(a: Coordinates, b: Coordinates): number {
  const R = 6371000;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function watchLiveLocation(
  onSuccess: (coords: Coordinates) => void,
  onError?: (error: GeolocationPositionError) => void,
  options: LocationWatchOptions = {}
): () => void {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return () => {};
  }

  const merged = { ...DEFAULT_OPTIONS, ...options };
  let lastEmitted: Coordinates | null = null;
  let lastEmitAt = 0;

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const next = toCoordinates(position);
      const now = Date.now();
      if (lastEmitted) {
        const movedMeters = distanceMeters(lastEmitted, next);
        const elapsed = now - lastEmitAt;
        if (movedMeters < merged.minDistanceMeters && elapsed < merged.minEmitIntervalMs) {
          return;
        }
      }
      lastEmitted = next;
      lastEmitAt = now;
      onSuccess(next);
    },
    (error) => {
      onError?.(error);
    },
    {
      enableHighAccuracy: merged.enableHighAccuracy,
      timeout: merged.timeoutMs,
      maximumAge: merged.maximumAgeMs
    }
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}
