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
const LEGACY_STORAGE_KEY = STORAGE_KEY;
const MAX_DRAFT_AGE_MS = 30 * 60 * 1000;

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
  const normalizedCoordinates =
    label === "Current location" || address === "Current location"
      ? null
      : normalizeCoordinates(value.coordinates);
  return {
    label: label || address,
    address: address || label,
    coordinates: normalizedCoordinates,
  };
}

export function loadRideLocationDraft(): RideLocationDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw =
      window.sessionStorage.getItem(STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) return null;

    const updatedAt = isFiniteNumber(parsed.updatedAt) ? parsed.updatedAt : undefined;
    if (updatedAt && Date.now() - updatedAt > MAX_DRAFT_AGE_MS) {
      clearRideLocationDraft();
      return null;
    }

    const draft: RideLocationDraft = {
      pickup: normalizeLocation(parsed.pickup),
      destination: normalizeLocation(parsed.destination),
      routePolyline: [],
      routeAlternativePolylines: [],
      updatedAt,
    };

    // Remove legacy localStorage drafts once a valid draft has been recovered.
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);

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
      window.sessionStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      return;
    }

    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...draft,
        pickup:
          draft.pickup?.label === "Current location" || draft.pickup?.address === "Current location"
            ? {
                ...draft.pickup,
                coordinates: null,
              }
            : draft.pickup,
        routePolyline: [],
        routeAlternativePolylines: [],
        updatedAt: draft.updatedAt ?? Date.now(),
      }),
    );
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Ignore storage failures. The flow still works in memory.
  }
}

export function clearRideLocationDraft(): void {
  saveRideLocationDraft(null);
}
