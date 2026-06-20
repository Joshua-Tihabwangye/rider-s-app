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

interface SearchablePlaceSuggestion extends PlaceSuggestion {
  source?: "backend" | "google-browser";
  primaryText?: string;
  types?: string[];
}

export interface RouteResult {
  distanceKm: number;
  durationMin: number;
  path: Coordinates[];
  alternativePaths: Coordinates[][];
}

export interface NearbyDriverResult {
  driverId: string;
  latitude: number;
  longitude: number;
  distanceMeters: number;
  accuracy?: number;
  timestamp?: number;
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

function isValidCoordinates(point: Coordinates | null | undefined): point is Coordinates {
  return Boolean(
    point &&
    typeof point.lat === "number" &&
    Number.isFinite(point.lat) &&
    typeof point.lng === "number" &&
    Number.isFinite(point.lng)
  );
}

function normalizePlaceText(value: string): string {
  return value.trim().toLowerCase();
}

function dedupeSuggestions(suggestions: SearchablePlaceSuggestion[]): SearchablePlaceSuggestion[] {
  const seen = new Set<string>();
  const deduped: SearchablePlaceSuggestion[] = [];
  for (const suggestion of suggestions) {
    const key = [
      suggestion.placeId,
      suggestion.coordinates.lat.toFixed(6),
      suggestion.coordinates.lng.toFixed(6),
      normalizePlaceText(suggestion.description),
    ].join("|");
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduped.push(suggestion);
  }
  return deduped;
}

function scoreSuggestion(suggestion: SearchablePlaceSuggestion, query: string): number {
  const normalizedQuery = normalizePlaceText(query);
  const description = normalizePlaceText(suggestion.description);
  const primaryText = normalizePlaceText(suggestion.primaryText || suggestion.description.split(",")[0] || suggestion.description);
  const types = (suggestion.types || []).map((type) => normalizePlaceText(type));

  const routeLikeTypes = new Set([
    "route",
    "street_address",
    "street_number",
    "intersection",
    "plus_code",
    "postal_code",
  ]);
  const landmarkTypes = new Set([
    "establishment",
    "point_of_interest",
    "shopping_mall",
    "store",
    "hospital",
    "school",
    "university",
    "airport",
    "bank",
    "museum",
    "park",
    "church",
    "tourist_attraction",
    "lodging",
    "restaurant",
    "cafe",
    "bar",
    "gym",
    "stadium",
    "movie_theater",
    "local_government_office",
    "premise",
  ]);

  let score = 0;
  if (primaryText === normalizedQuery) score += 900;
  if (description === normalizedQuery) score += 700;
  if (primaryText.startsWith(normalizedQuery)) score += 280;
  if (description.startsWith(normalizedQuery)) score += 180;
  if (description.includes(` ${normalizedQuery}`)) score += 90;
  if (types.some((type) => landmarkTypes.has(type))) score += 220;
  if (types.includes("establishment")) score += 80;
  if (types.some((type) => routeLikeTypes.has(type))) score -= 220;
  if (suggestion.source === "google-browser") score += 60;
  return score;
}

function sortSuggestions(
  suggestions: SearchablePlaceSuggestion[],
  query: string,
  limit: number,
): PlaceSuggestion[] {
  return dedupeSuggestions(suggestions)
    .sort((left, right) => scoreSuggestion(right, query) - scoreSuggestion(left, query))
    .slice(0, limit)
    .map(({ description, placeId, coordinates }) => ({ description, placeId, coordinates }));
}

async function searchPlacesViaBackend(
  query: string,
  options: PlaceSearchOptions,
): Promise<SearchablePlaceSuggestion[]> {
  const limit = Math.max(1, Math.min(options.limit ?? 8, 20));
  const params = new URLSearchParams({
    q: query,
    countryCode: "UG",
    limit: String(limit)
  });

  if (isValidCoordinates(options.near)) {
    params.set("lat", String(options.near.lat));
    params.set("lng", String(options.near.lng));
  }

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
      category?: string;
      type?: string;
    }>;
  } | Array<{
    placeId: string;
    displayName: string;
    name?: string;
    latitude: number;
    longitude: number;
    category?: string;
    type?: string;
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
      description: item.displayName || item.name || query,
      placeId: item.placeId,
      coordinates: {
        lat: item.latitude,
        lng: item.longitude
      },
      source: "backend" as const,
      primaryText: item.name || item.displayName,
      types: [item.category, item.type].filter((value): value is string => Boolean(value)),
    }));
}

function getGooglePlacesApi(): any | null {
  return (window as any).google?.maps?.places ?? null;
}

function createAbortError(): Error {
  const error = new Error("Request aborted");
  error.name = "AbortError";
  return error;
}

function assertNotAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw createAbortError();
  }
}

function getPlacePredictions(
  service: any,
  request: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    assertNotAborted(signal);
    const abortHandler = () => reject(createAbortError());
    signal?.addEventListener("abort", abortHandler, { once: true });

    service.getPlacePredictions(request, (predictions: any[] | null, status: string) => {
      signal?.removeEventListener("abort", abortHandler);
      if (signal?.aborted) {
        reject(createAbortError());
        return;
      }
      if (!status || status === "ZERO_RESULTS") {
        resolve([]);
        return;
      }
      if (status !== "OK") {
        reject(new Error(`Google predictions failed (${status})`));
        return;
      }
      resolve(predictions ?? []);
    });
  });
}

function getPlaceDetails(
  service: any,
  placeId: string,
  signal?: AbortSignal,
): Promise<any | null> {
  return new Promise((resolve, reject) => {
    assertNotAborted(signal);
    const abortHandler = () => reject(createAbortError());
    signal?.addEventListener("abort", abortHandler, { once: true });

    service.getDetails(
      {
        placeId,
        fields: ["place_id", "name", "formatted_address", "geometry", "types"],
      },
      (result: any, status: string) => {
        signal?.removeEventListener("abort", abortHandler);
        if (signal?.aborted) {
          reject(createAbortError());
          return;
        }
        if (!status || status === "ZERO_RESULTS" || status === "NOT_FOUND") {
          resolve(null);
          return;
        }
        if (status !== "OK") {
          reject(new Error(`Google place details failed (${status})`));
          return;
        }
        resolve(result ?? null);
      },
    );
  });
}

function runTextSearch(
  service: any,
  request: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    assertNotAborted(signal);
    const abortHandler = () => reject(createAbortError());
    signal?.addEventListener("abort", abortHandler, { once: true });

    service.textSearch(request, (results: any[] | null, status: string) => {
      signal?.removeEventListener("abort", abortHandler);
      if (signal?.aborted) {
        reject(createAbortError());
        return;
      }
      if (!status || status === "ZERO_RESULTS") {
        resolve([]);
        return;
      }
      if (status !== "OK") {
        reject(new Error(`Google text search failed (${status})`));
        return;
      }
      resolve(results ?? []);
    });
  });
}

async function searchPlacesViaGoogleBrowser(
  query: string,
  options: PlaceSearchOptions,
): Promise<SearchablePlaceSuggestion[]> {
  if (typeof window === "undefined") {
    return [];
  }

  const placesApi = getGooglePlacesApi();
  const mapsApi = (window as any).google?.maps;
  if (!placesApi || !mapsApi) {
    return [];
  }

  const autocompleteService = new placesApi.AutocompleteService();
  const detailsService = new placesApi.PlacesService(document.createElement("div"));
  const limit = Math.max(1, Math.min(options.limit ?? 8, 20));

  const predictionRequest: Record<string, unknown> = {
    input: query,
    componentRestrictions: { country: "ug" },
  };

  if (isValidCoordinates(options.near)) {
    predictionRequest.locationBias = new mapsApi.Circle({
      center: { lat: options.near.lat, lng: options.near.lng },
      radius: 50000,
    });
    predictionRequest.origin = { lat: options.near.lat, lng: options.near.lng };
  }

  const [predictions, textResults] = await Promise.all([
    getPlacePredictions(autocompleteService, predictionRequest, options.signal),
    runTextSearch(
      detailsService,
      {
        query,
        location: isValidCoordinates(options.near)
          ? new mapsApi.LatLng(options.near.lat, options.near.lng)
          : undefined,
        radius: isValidCoordinates(options.near) ? 50000 : undefined,
        region: "ug",
      },
      options.signal,
    ).catch(() => []),
  ]);

  const predictionDetails = await Promise.all(
    predictions.slice(0, limit).map(async (prediction: any) => {
      const placeId = prediction.place_id;
      if (!placeId) return null;
      const details = await getPlaceDetails(detailsService, placeId, options.signal).catch(() => null);
      const location = details?.geometry?.location;
      const lat = typeof location?.lat === "function" ? location.lat() : location?.lat;
      const lng = typeof location?.lng === "function" ? location.lng() : location?.lng;
      if (!isFiniteCoordinate(lat) || !isFiniteCoordinate(lng) || !isValidUgandaCoordinate(lat, lng)) {
        return null;
      }
      const description =
        details?.formatted_address ||
        prediction.description ||
        details?.name ||
        query;
      return {
        description,
        placeId,
        coordinates: { lat, lng },
        source: "google-browser" as const,
        primaryText:
          prediction.structured_formatting?.main_text ||
          details?.name ||
          description.split(",")[0] ||
          description,
        types: Array.isArray(details?.types) ? details.types : Array.isArray(prediction.types) ? prediction.types : [],
      } satisfies SearchablePlaceSuggestion;
    }),
  );

  const textSuggestions = textResults.slice(0, limit).flatMap((result: any) => {
    const location = result?.geometry?.location;
    const lat = typeof location?.lat === "function" ? location.lat() : location?.lat;
    const lng = typeof location?.lng === "function" ? location.lng() : location?.lng;
    if (!isFiniteCoordinate(lat) || !isFiniteCoordinate(lng) || !isValidUgandaCoordinate(lat, lng)) {
      return [];
    }
    const description =
      (typeof result.formatted_address === "string" && result.formatted_address.trim()) ||
      (typeof result.vicinity === "string" && result.vicinity.trim()) ||
      (typeof result.name === "string" && result.name.trim()) ||
      query;
    return [{
      description,
      placeId: result.place_id || `${lat}:${lng}:${description}`,
      coordinates: { lat, lng },
      source: "google-browser" as const,
      primaryText: result.name || description.split(",")[0] || description,
      types: Array.isArray(result.types) ? result.types : [],
    } satisfies SearchablePlaceSuggestion];
  });

  return [...predictionDetails.filter(Boolean), ...textSuggestions];
}

export async function searchPlaces(query: string, options: PlaceSearchOptions = {}): Promise<PlaceSuggestion[]> {
  const term = normalizeQuery(query);
  if (term.length < 3) return [];

  const limit = Math.max(1, Math.min(options.limit ?? 8, 20));

  try {
    const [backendResult, browserResult] = await Promise.allSettled([
      searchPlacesViaBackend(term, options),
      searchPlacesViaGoogleBrowser(term, options),
    ]);

    const merged: SearchablePlaceSuggestion[] = [];
    const failures: Error[] = [];

    if (backendResult.status === "fulfilled") {
      merged.push(...backendResult.value);
    } else if (backendResult.reason instanceof Error) {
      failures.push(backendResult.reason);
    }

    if (browserResult.status === "fulfilled") {
      merged.push(...browserResult.value);
    } else if (browserResult.reason instanceof Error) {
      failures.push(browserResult.reason);
    }

    if (merged.length > 0) {
      return sortSuggestions(merged, term, limit);
    }

    if (failures.some((error) => error.name === "AbortError")) {
      return [];
    }

    if (failures.length > 0) {
      throw failures[0];
    }

    return [];
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

export async function fetchNearbyDrivers(
  origin: Coordinates,
  radiusMeters = 5000,
): Promise<NearbyDriverResult[]> {
  if (!isValidCoordinates(origin)) {
    return [];
  }

  const params = new URLSearchParams({
    lat: String(origin.lat),
    lng: String(origin.lng),
    radius: String(radiusMeters),
  });
  const response = await fetch(`${getApiBaseUrl()}/geo/nearby-drivers?${params.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as {
    data?: NearbyDriverResult[];
  } | NearbyDriverResult[];
  const rows = Array.isArray(payload) ? payload : payload.data ?? [];
  return rows
    .filter(
      (item) =>
        typeof item.driverId === "string" &&
        isFiniteCoordinate(item.latitude) &&
        isFiniteCoordinate(item.longitude) &&
        isFiniteCoordinate(item.distanceMeters),
    )
    .sort((a, b) => a.distanceMeters - b.distanceMeters);
}

/**
 * Try route calculation via the Google Maps Directions Service running in the
 * browser. This works whenever the Maps JS SDK is loaded (VITE_GOOGLE_MAPS_API_KEY
 * is set) even if the backend /geo/routes/estimate endpoint is unavailable.
 */
async function calculateRouteClientSide(
  origin: Coordinates,
  destination: Coordinates,
): Promise<RouteResult | null> {
  const googleMaps = (window as any).google?.maps;
  if (!googleMaps) return null;

  return new Promise((resolve) => {
    const service = new googleMaps.DirectionsService();
    service.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: googleMaps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      },
      (
        result: any,
        status: string,
      ) => {
        if (status !== "OK" || !result?.routes?.length) {
          resolve(null);
          return;
        }

        const decodePolyline = (encoded: string): Coordinates[] => {
          const points: Coordinates[] = [];
          let index = 0;
          let lat = 0;
          let lng = 0;
          while (index < encoded.length) {
            let shift = 0;
            let result2 = 0;
            let byte: number;
            do {
              byte = encoded.charCodeAt(index++) - 63;
              result2 |= (byte & 0x1f) << shift;
              shift += 5;
            } while (byte >= 0x20);
            lat += result2 & 1 ? ~(result2 >> 1) : result2 >> 1;
            shift = 0;
            result2 = 0;
            do {
              byte = encoded.charCodeAt(index++) - 63;
              result2 |= (byte & 0x1f) << shift;
              shift += 5;
            } while (byte >= 0x20);
            lng += result2 & 1 ? ~(result2 >> 1) : result2 >> 1;
            points.push({ lat: lat / 1e5, lng: lng / 1e5 });
          }
          return points;
        };

        const mainRoute = result.routes[0];
        const leg = mainRoute?.legs?.[0];
        const path = decodePolyline(mainRoute?.overview_polyline?.points ?? "");
        const distanceKmVal = (leg?.distance?.value ?? 0) / 1000;
        const durationMinVal = (leg?.duration?.value ?? 0) / 60;
        const alternativePaths = (result.routes as any[]).slice(1).map((r: any) =>
          decodePolyline(r?.overview_polyline?.points ?? ""),
        ).filter((p: Coordinates[]) => p.length > 1);

        if (path.length < 2) {
          resolve(null);
          return;
        }

        resolve({
          distanceKm: Math.round(distanceKmVal * 10) / 10,
          durationMin: Math.max(1, Math.round(durationMinVal)),
          path,
          alternativePaths,
        });
      },
    );
  });
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
    // Backend unavailable — fall through to client-side Google Maps Directions
  } finally {
    clearTimeout(timeoutId);
  }

  // Fallback: use Google Maps Directions Service directly in the browser.
  // This draws the route even when the backend /geo/routes/estimate is down.
  const clientSideRoute = await calculateRouteClientSide(origin, destination);
  if (clientSideRoute) {
    return clientSideRoute;
  }

  return null;
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
