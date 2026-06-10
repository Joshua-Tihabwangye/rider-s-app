import { API_BASE_URL } from "./api/config";
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

  try {
    const limit = Math.max(1, Math.min(options.limit ?? 8, 20));
    const params = new URLSearchParams({
      format: "jsonv2",
      q: term,
      countrycodes: "UG",
      limit: String(limit),
      addressdetails: "1",
      dedupe: "1",
      extratags: "1",
      namedetails: "1"
    });

    // Keep UG as default bounded fallback area so search still works when location permission is denied.
    params.set("viewbox", "29.5,4.3,35.0,-1.5");
    params.set("bounded", "0");

    if (isValidCoordinates(options.near)) {
      // Bias results around current location when available.
      const latSpan = 0.45;
      const lngSpan = 0.45 / Math.max(0.35, Math.cos(toRadians(options.near.lat)));
      const west = options.near.lng - lngSpan;
      const east = options.near.lng + lngSpan;
      const north = options.near.lat + latSpan;
      const south = options.near.lat - latSpan;
      params.set("viewbox", `${west},${north},${east},${south}`);
      params.set("bounded", "0");
    }

    const response = await fetch(`${API_BASE_URL}/geo/places/search?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      signal: options.signal
    });

    if (!response.ok) {
      throw new Error(`Nominatim search failed (${response.status})`);
    }

    const data = await response.json();

    const validResults = data
      .filter((item: any) => {
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        const isValidCoord = isFiniteCoordinate(lat) && isFiniteCoordinate(lng) && isValidUgandaCoordinate(lat, lng);
        const hasMeaningfulName = item.display_name && item.display_name.length > 10;

        return isValidCoord && hasMeaningfulName;
      })
      .sort((a: any, b: any) => {
        const aImportance = parseFloat(a.importance) || 0;
        const bImportance = parseFloat(b.importance) || 0;
        const keyPlaceTypes = ["amenity", "tourism", "leisure", "historic", "shop", "place", "education"];
        const aTypeScore = keyPlaceTypes.includes(a.class) ? 1.5 : a.class === "highway" ? 0.7 : 0;
        const bTypeScore = keyPlaceTypes.includes(b.class) ? 1.5 : b.class === "highway" ? 0.7 : 0;
        const aText = String(a.display_name || "").toLowerCase();
        const bText = String(b.display_name || "").toLowerCase();
        const aTokenScore = aText.includes(term) ? 2 : 0;
        const bTokenScore = bText.includes(term) ? 2 : 0;

        let aNearbyScore = 0;
        let bNearbyScore = 0;
        if (isValidCoordinates(options.near)) {
          const aDist = distanceKm(options.near, {
            lat: parseFloat(a.lat),
            lng: parseFloat(a.lon)
          });
          const bDist = distanceKm(options.near, {
            lat: parseFloat(b.lat),
            lng: parseFloat(b.lon)
          });
          aNearbyScore = Math.max(0, 2 - Math.min(aDist / 25, 2));
          bNearbyScore = Math.max(0, 2 - Math.min(bDist / 25, 2));
        }

        const aScore = aImportance * 4 + aTypeScore + aTokenScore + aNearbyScore;
        const bScore = bImportance * 4 + bTypeScore + bTokenScore + bNearbyScore;
        return bScore - aScore;
      })
      .slice(0, limit);

    const suggestions: PlaceSuggestion[] = validResults.map((item: any, index: number) => {
      let description = item.display_name;

      if (item.namedetails && item.namedetails.name) {
        const name = item.namedetails.name;
        const addressParts = [];

        if (item.address) {
          if (item.address.city) addressParts.push(item.address.city);
          if (item.address.state) addressParts.push(item.address.state);
          if (item.address.country) addressParts.push(item.address.country);
        }

        description = addressParts.length > 0 ? `${name}, ${addressParts.join(', ')}` : name;
      }

      return {
        description,
        placeId: `nominatim-${item.place_id}-${index}`,
        coordinates: {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        }
      };
    });

    const deduped = suggestions.filter((suggestion, index, allSuggestions) => {
      const key = `${suggestion.description.toLowerCase()}::${suggestion.coordinates.lat.toFixed(5)}::${suggestion.coordinates.lng.toFixed(5)}`;
      return (
        allSuggestions.findIndex((candidate) => {
          const candidateKey = `${candidate.description.toLowerCase()}::${candidate.coordinates.lat.toFixed(5)}::${candidate.coordinates.lng.toFixed(5)}`;
          return candidateKey === key;
        }) === index
      );
    });

    return deduped;
  } catch (error) {
    if ((error as Error)?.name === "AbortError") {
      return [];
    }

    return [];
  }
}

export async function geocodeAddress(query: string): Promise<Coordinates | null> {
  const term = normalizeQuery(query);
  if (term.length < 3) return null;

  const params = new URLSearchParams({ q: term });
  const response = await fetch(`${API_BASE_URL}/geo/places/resolve?${params.toString()}`, {
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
  const response = await fetch(`${API_BASE_URL}/geo/places/reverse?${params.toString()}`, {
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
    const response = await fetch(`${API_BASE_URL}/geo/routes/estimate`, {
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
