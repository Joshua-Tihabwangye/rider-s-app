import { getApiBaseUrl } from "./api/config";
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PlaceSuggestion {
  description: string;
  placeId: string;
  coordinates: Coordinates;
}

export interface PlaceSearchOptions {
  near?: Coordinates | null;
  limit?: number;
  signal?: AbortSignal;
}

export interface RouteResult {
  distanceKm: number;
  durationMin: number;
  path: Coordinates[];
  alternativePaths: Coordinates[][];
}

function samePoint(a: Coordinates, b: Coordinates): boolean {
  return Math.abs(a.lat - b.lat) < 0.000001 && Math.abs(a.lng - b.lng) < 0.000001;
}

function isFiniteCoordinate(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isValidUgandaCoordinate(lat: number, lng: number): boolean {
  // Uganda geographic bounds (approximate)
  return lat >= -1.5 && lat <= 4.3 && lng >= 29.5 && lng <= 35.0;
}

function normalizeQuery(value: string): string {
  return value.trim().toLowerCase();
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function distanceKm(a: Coordinates, b: Coordinates): number {
  const earthRadiusKm = 6371;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function isValidCoordinates(point: Coordinates | null | undefined): point is Coordinates {
  return Boolean(
    point &&
      typeof point.lat === "number" &&
      Number.isFinite(point.lat) &&
      typeof point.lng === "number" &&
      Number.isFinite(point.lng)
  );
}

export async function searchPlaces(query: string, options: PlaceSearchOptions = {}): Promise<PlaceSuggestion[]> {
  const term = normalizeQuery(query);
  if (term.length < 3) return [];

  const limit = Math.max(1, Math.min(options.limit ?? 8, 20));
  const params = new URLSearchParams({
    q: term,
    countryCode: "UG",
    limit: String(limit)
  });

  if (isValidCoordinates(options.near)) {
    params.set("lat", String(options.near.lat));
    params.set("lng", String(options.near.lng));
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/geo/places/search?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      signal: options.signal
    });

    if (!response.ok) {
      throw new Error(`Backend place search failed (${response.status})`);
    }

    const payload = (await response.json()) as {
      data?: Array<{
        placeId: string;
        displayName: string;
        name?: string;
        latitude: number;
        longitude: number;
      }>;
    } | Array<{
      placeId: string;
      displayName: string;
      name?: string;
      latitude: number;
      longitude: number;
    }>;

    const results = Array.isArray(payload) ? payload : payload.data ?? [];
    return results
      .filter(
        (item) =>
          isFiniteCoordinate(item.latitude) &&
          isFiniteCoordinate(item.longitude) &&
          isValidUgandaCoordinate(item.latitude, item.longitude)
      )
      .map((item) => ({
        description: item.displayName || item.name || term,
        placeId: item.placeId,
        coordinates: {
          lat: item.latitude,
          lng: item.longitude
        }
      }));
  } catch (error) {
    if ((error as Error)?.name === "AbortError") {
      return [];
    }
    throw error;
  }
}

export async function geocodeAddress(query: string): Promise<Coordinates | null> {
  const term = normalizeQuery(query);
  if (term.length < 3) return null;

  const params = new URLSearchParams({ q: term });
  const response = await fetch(`${getApiBaseUrl()}/geo/places/resolve?${params.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) return null;
  const payload = await response.json() as { data?: { latitude?: number; longitude?: number } | null; latitude?: number; longitude?: number };
  const data = payload?.data ?? payload;
  if (!data || !Number.isFinite(data.latitude ?? Number.NaN) || !Number.isFinite(data.longitude ?? Number.NaN)) {
    return null;
  }
  return { lat: Number(data.latitude), lng: Number(data.longitude) };
}

export async function reverseGeocode(point: Coordinates): Promise<string | null> {
  const params = new URLSearchParams({ lat: String(point.lat), lng: String(point.lng) });
  const response = await fetch(`${getApiBaseUrl()}/geo/places/reverse?${params.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as { data?: { displayName?: string; display_name?: string } | null; displayName?: string; display_name?: string };
  const data = payload.data ?? payload;
  return (data.displayName ?? data.display_name ?? null)?.trim() || null;
}

export async function calculateRoute(origin: Coordinates, destination: Coordinates): Promise<RouteResult | null> {
  if (!isFiniteCoordinate(origin.lat) || !isFiniteCoordinate(origin.lng)) return null;
  if (!isFiniteCoordinate(destination.lat) || !isFiniteCoordinate(destination.lng)) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  try {
    const response = await fetch(`${getApiBaseUrl()}/geo/routes/estimate`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      signal: controller.signal,
      body: JSON.stringify({
        points: [origin, destination],
        alternatives: true
      })
    });

    if (!response.ok) {
      throw new Error(`Route proxy failed (${response.status})`);
    }

    const payload = await response.json();
    const data = (payload?.data ?? payload) as {
      distanceKm?: number;
      durationMin?: number;
      path?: Coordinates[];
      alternativePaths?: Coordinates[][];
    } | null;
    if (!data?.path || data.path.length === 0) return null;

    return {
      distanceKm: Number.isFinite(data.distanceKm ?? Number.NaN) ? Number(data.distanceKm) : 0,
      durationMin: Number.isFinite(data.durationMin ?? Number.NaN) ? Number(data.durationMin) : 0,
      path: data.path.filter((p) => isFiniteCoordinate(p.lat) && isFiniteCoordinate(p.lng)),
      alternativePaths: (data.alternativePaths ?? []).map((route) => route.filter((p) => isFiniteCoordinate(p.lat) && isFiniteCoordinate(p.lng)))
    };
  } catch (error) {
    if ((error as any)?.name === "AbortError") return null;
    console.error("calculateRoute failed:", error);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function calculateRouteThroughPoints(points: Coordinates[]): Promise<RouteResult | null> {
  const normalizedPoints = points.filter(
    (point): point is Coordinates =>
      isFiniteCoordinate(point?.lat) &&
      isFiniteCoordinate(point?.lng)
  );
  if (normalizedPoints.length < 2) {
    return null;
  }

  const deduped: Coordinates[] = normalizedPoints.reduce<Coordinates[]>((acc, point) => {
    if (acc.length === 0) {
      acc.push(point);
      return acc;
    }
    const previous = acc[acc.length - 1];
    if (!previous || samePoint(previous, point)) {
      return acc;
    }
    acc.push(point);
    return acc;
  }, []);

  if (deduped.length < 2) {
    return null;
  }

  let totalDistanceKm = 0;
  let totalDurationMin = 0;
  const mergedPath: Coordinates[] = [];
  const mergedAlternatives: Coordinates[][] = [];

  for (let index = 0; index < deduped.length - 1; index += 1) {
    const from = deduped[index];
    const to = deduped[index + 1];
    if (!from || !to) {
      continue;
    }
    const segment = await calculateRoute(from, to);
    if (!segment) {
      return null;
    }
    totalDistanceKm += segment.distanceKm;
    totalDurationMin += segment.durationMin;

    const nextPath = segment.path ?? [];
    if (nextPath.length > 0) {
      if (mergedPath.length === 0) {
        mergedPath.push(...nextPath);
      } else {
        mergedPath.push(...nextPath.slice(1));
      }
    }
    if (segment.alternativePaths.length > 0) {
      mergedAlternatives.push(...segment.alternativePaths);
    }
  }

  if (mergedPath.length < 2) {
    return null;
  }

  return {
    distanceKm: Number(totalDistanceKm.toFixed(1)),
    durationMin: Math.max(1, Math.round(totalDurationMin)),
    path: mergedPath,
    alternativePaths: mergedAlternatives
  };
}
