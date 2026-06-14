import type { Coordinates } from "../../services/maps";

export type RideLocationDraft = {
  pickup?: {
    label: string;
    address: string;
    coordinates?: Coordinates | null;
  } | null;
  destination?: {
    label: string;
    address: string;
    coordinates?: Coordinates | null;
  } | null;
  routePolyline?: Coordinates[];
  routeAlternativePolylines?: Coordinates[][];
  updatedAt?: number;
};

const STORAGE_KEY = "evzone_rider_location_draft";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeCoordinates(value: unknown): Coordinates | null {
  if (!isRecord(value)) return null;
  if (!isFiniteNumber(value.lat) || !isFiniteNumber(value.lng)) return null;
  return { lat: value.lat, lng: value.lng };
}

function normalizeLocation(value: unknown): RideLocationDraft["pickup"] {
  if (!isRecord(value)) return null;
  const label = typeof value.label === "string" ? value.label.trim() : "";
  const address = typeof value.address === "string" ? value.address.trim() : label;
  if (!label && !address) return null;
  return {
    label: label || address,
    address: address || label,
    coordinates: normalizeCoordinates(value.coordinates),
  };
}

export function loadRideLocationDraft(): RideLocationDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) return null;

    const draft: RideLocationDraft = {
      pickup: normalizeLocation(parsed.pickup),
      destination: normalizeLocation(parsed.destination),
      routePolyline: Array.isArray(parsed.routePolyline)
        ? parsed.routePolyline
            .map((point) => normalizeCoordinates(point))
            .filter((point): point is Coordinates => Boolean(point))
        : undefined,
      routeAlternativePolylines: Array.isArray(parsed.routeAlternativePolylines)
        ? parsed.routeAlternativePolylines.map((route) =>
            Array.isArray(route)
              ? route
                  .map((point) => normalizeCoordinates(point))
                  .filter((point): point is Coordinates => Boolean(point))
              : [],
          )
        : undefined,
      updatedAt: isFiniteNumber(parsed.updatedAt) ? parsed.updatedAt : undefined,
    };

    return draft;
  } catch {
    return null;
  }
}

export function saveRideLocationDraft(draft: RideLocationDraft | null): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (!draft) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...draft,
        updatedAt: draft.updatedAt ?? Date.now(),
      }),
    );
  } catch {
    // Ignore storage failures. The flow still works in memory.
  }
}

export function clearRideLocationDraft(): void {
  saveRideLocationDraft(null);
}
