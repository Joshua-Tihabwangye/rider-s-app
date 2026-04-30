export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PlaceSuggestion {
  description: string;
  placeId: string;
  coordinates: Coordinates;
}

export interface RouteResult {
  distanceKm: number;
  durationMin: number;
  path: Coordinates[];
}

function isFiniteCoordinate(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export async function searchPlaces(query: string): Promise<PlaceSuggestion[]> {
  const term = query.trim();
  if (term.length < 2) return [];

  const response = await fetch(
    `/api/osm/search?format=jsonv2&addressdetails=1&limit=6&countrycodes=ug&q=${encodeURIComponent(term)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    }
  );

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as Array<{
    place_id?: number | string;
    display_name?: string;
    lat?: string;
    lon?: string;
  }>;

  return payload
    .map((item, index) => {
      const lat = Number(item.lat);
      const lng = Number(item.lon);
      if (!isFiniteCoordinate(lat) || !isFiniteCoordinate(lng)) return null;
      return {
        description: item.display_name?.trim() || `Result ${index + 1}`,
        placeId: String(item.place_id ?? `${index + 1}`),
        coordinates: { lat, lng }
      };
    })
    .filter((item): item is PlaceSuggestion => Boolean(item));
}

export async function geocodeAddress(query: string): Promise<Coordinates | null> {
  const results = await searchPlaces(query);
  return results[0]?.coordinates ?? null;
}

export async function reverseGeocode(point: Coordinates): Promise<string | null> {
  const response = await fetch(
    `/api/osm/reverse?format=jsonv2&lat=${point.lat}&lon=${point.lng}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    }
  );

  if (!response.ok) return null;

  const payload = (await response.json()) as { display_name?: string };
  return payload.display_name?.trim() || null;
}

export async function calculateRoute(origin: Coordinates, destination: Coordinates): Promise<RouteResult | null> {
  if (!isFiniteCoordinate(origin.lat) || !isFiniteCoordinate(origin.lng)) return null;
  if (!isFiniteCoordinate(destination.lat) || !isFiniteCoordinate(destination.lng)) return null;

  const response = await fetch(
    `/api/osrm/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&steps=false`,
    {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    }
  );

  if (!response.ok) return null;

  const payload = (await response.json()) as {
    routes?: Array<{
      distance?: number;
      duration?: number;
      geometry?: {
        coordinates?: [number, number][];
      };
    }>;
  };

  const route = payload.routes?.[0];
  if (!route?.geometry?.coordinates?.length) return null;

  const path = route.geometry.coordinates
    .map(([lng, lat]) => ({ lat, lng }))
    .filter((point) => isFiniteCoordinate(point.lat) && isFiniteCoordinate(point.lng));

  if (!path.length) return null;

  return {
    distanceKm: (route.distance ?? 0) / 1000,
    durationMin: (route.duration ?? 0) / 60,
    path
  };
}
