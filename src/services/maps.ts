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

interface MockPlaceEntry {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
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

function buildFallbackRoute(origin: Coordinates, destination: Coordinates): RouteResult {
  const midLat = (origin.lat + destination.lat) / 2;
  const midLng = (origin.lng + destination.lng) / 2;
  const curveFactor = 0.005;
  const controlA: Coordinates = {
    lat: midLat + curveFactor,
    lng: midLng - curveFactor
  };
  const controlB: Coordinates = {
    lat: midLat - curveFactor * 0.6,
    lng: midLng + curveFactor * 0.8
  };
  const path = [origin, controlA, controlB, destination];
  const totalDistanceKm = Math.max(0.2, distanceKm(origin, destination) * 1.18);
  const durationMin = Math.max(3, Math.round(totalDistanceKm * 2.8));
  return {
    distanceKm: Number(totalDistanceKm.toFixed(1)),
    durationMin,
    path,
    alternativePaths: [[origin, { lat: midLat, lng: midLng }, destination]]
  };
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

const MOCK_PLACE_GROUPS: Record<string, MockPlaceEntry[]> = {
  mall: [
    {
      id: "mall-1",
      name: "Arena Mall",
      address: "Nsambya, Kampala",
      coordinates: { lat: 0.3097, lng: 32.5893 }
    },
    {
      id: "mall-2",
      name: "Acacia Mall",
      address: "Kisementi, Kampala",
      coordinates: { lat: 0.3397, lng: 32.5864 }
    },
    {
      id: "mall-3",
      name: "Victoria Mall",
      address: "Entebbe Road, Entebbe",
      coordinates: { lat: 0.0507, lng: 32.4639 }
    },
    {
      id: "mall-4",
      name: "Jinja City Mall",
      address: "Main Street, Jinja",
      coordinates: { lat: 0.4314, lng: 33.2032 }
    },
    {
      id: "mall-5",
      name: "Metroplex Mall",
      address: "Naalya, Kampala",
      coordinates: { lat: 0.3777, lng: 32.6372 }
    }
  ],
  market: [
    {
      id: "market-1",
      name: "Nakasero Market",
      address: "Nakasero, Kampala",
      coordinates: { lat: 0.3182, lng: 32.5805 }
    },
    {
      id: "market-2",
      name: "Owino Market",
      address: "Downtown, Kampala",
      coordinates: { lat: 0.3118, lng: 32.5726 }
    },
    {
      id: "market-3",
      name: "Kalerwe Market",
      address: "Kalerwe, Kampala",
      coordinates: { lat: 0.3564, lng: 32.5612 }
    },
    {
      id: "market-4",
      name: "Nakawa Market",
      address: "Nakawa, Kampala",
      coordinates: { lat: 0.3364, lng: 32.6188 }
    },
    {
      id: "market-5",
      name: "Nateete Market",
      address: "Nateete, Kampala",
      coordinates: { lat: 0.3043, lng: 32.5325 }
    }
  ],
  church: [
    {
      id: "church-1",
      name: "Rubaga Cathedral",
      address: "Rubaga, Kampala",
      coordinates: { lat: 0.3009, lng: 32.5522 }
    },
    {
      id: "church-2",
      name: "Namirembe Cathedral",
      address: "Namirembe Hill, Kampala",
      coordinates: { lat: 0.3133, lng: 32.5566 }
    },
    {
      id: "church-3",
      name: "St. Francis Chapel",
      address: "Kololo, Kampala",
      coordinates: { lat: 0.3371, lng: 32.5923 }
    },
    {
      id: "church-4",
      name: "Watoto Church Downtown",
      address: "Bugolobi, Kampala",
      coordinates: { lat: 0.3229, lng: 32.6131 }
    },
    {
      id: "church-5",
      name: "All Saints Church",
      address: "Nakasero, Kampala",
      coordinates: { lat: 0.3246, lng: 32.5822 }
    }
  ],
  hospital: [
    {
      id: "hospital-1",
      name: "Mulago National Referral Hospital",
      address: "Mulago Hill, Kampala",
      coordinates: { lat: 0.3382, lng: 32.5762 }
    },
    {
      id: "hospital-2",
      name: "Nakasero Hospital",
      address: "Akii Bua Road, Kampala",
      coordinates: { lat: 0.3234, lng: 32.5856 }
    },
    {
      id: "hospital-3",
      name: "Case Hospital",
      address: "Buganda Road, Kampala",
      coordinates: { lat: 0.3099, lng: 32.5808 }
    },
    {
      id: "hospital-4",
      name: "International Hospital Kampala",
      address: "Namuwongo, Kampala",
      coordinates: { lat: 0.3041, lng: 32.6123 }
    },
    {
      id: "hospital-5",
      name: "Mengo Hospital",
      address: "Mengo Hill, Kampala",
      coordinates: { lat: 0.3078, lng: 32.5613 }
    }
  ],
  school: [
    {
      id: "school-1",
      name: "Makerere University",
      address: "Makerere Hill, Kampala",
      coordinates: { lat: 0.3345, lng: 32.5686 }
    },
    {
      id: "school-2",
      name: "Kyambogo University",
      address: "Kyambogo, Kampala",
      coordinates: { lat: 0.3499, lng: 32.6304 }
    },
    {
      id: "school-3",
      name: "Gayaza High School",
      address: "Gayaza, Wakiso",
      coordinates: { lat: 0.4428, lng: 32.6061 }
    },
    {
      id: "school-4",
      name: "King's College Budo",
      address: "Budo, Wakiso",
      coordinates: { lat: 0.2551, lng: 32.4632 }
    },
    {
      id: "school-5",
      name: "Namilyango College",
      address: "Namugongo, Mukono",
      coordinates: { lat: 0.3812, lng: 32.6727 }
    }
  ]
};

const DEFAULT_MOCK_SEQUENCE = ["mall", "market", "church", "hospital", "school"] as const;
type MockGroupKey = (typeof DEFAULT_MOCK_SEQUENCE)[number];

function getMockGroup(key: MockGroupKey): MockPlaceEntry[] {
  return MOCK_PLACE_GROUPS[key] ?? [];
}

function flattenMockPlaces(): MockPlaceEntry[] {
  return DEFAULT_MOCK_SEQUENCE.flatMap((group) => getMockGroup(group));
}

function mapMockPlacesToSuggestions(places: MockPlaceEntry[]): PlaceSuggestion[] {
  return places.map((place) => ({
    description: `${place.name}, ${place.address}`,
    placeId: place.id,
    coordinates: place.coordinates
  }));
}

export async function searchPlaces(query: string, options: PlaceSearchOptions = {}): Promise<PlaceSuggestion[]> {
  const term = normalizeQuery(query);
  if (term.length < 2) return [];

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

    const response = await fetch(`/api/osm/search?${params.toString()}`, {
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

    // Keep mock fallback only for local development.
    if ((import.meta as any).env?.DEV) {
      return getFallbackPlaces(term);
    }
    return [];
  }
}

function getFallbackPlaces(term: string): PlaceSuggestion[] {
  const matches = flattenMockPlaces().filter((place) => {
    const haystack = normalizeQuery(`${place.name} ${place.address}`);
    return haystack.includes(term);
  });

  if (matches.length >= 5) {
    return mapMockPlacesToSuggestions(matches.slice(0, 5));
  }

  const seed = DEFAULT_MOCK_SEQUENCE.flatMap((group) => getMockGroup(group).slice(0, 1));
  const fallback = [...matches, ...seed].filter(
    (place, index, list) => list.findIndex((candidate) => candidate.id === place.id) === index
  );

  return mapMockPlacesToSuggestions(fallback.slice(0, 5));
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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  try {
    if (typeof window !== "undefined") {
      // Google Directions REST is blocked by browser CORS from client-side apps.
      // Use a deterministic local fallback route so UI rendering and tracking remain functional.
      return buildFallbackRoute(origin, destination);
    }

    const rawApiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "").trim();
    const apiKey = rawApiKey && !/^https?:\/\//i.test(rawApiKey) ? rawApiKey : "";
    if (!apiKey) {
      console.warn("Google Maps API key is not set. Route calculation disabled.");
      return null;
    }

    const url = new URL('https://maps.googleapis.com/maps/api/directions/json');
    url.searchParams.set('origin', `${origin.lat},${origin.lng}`);
    url.searchParams.set('destination', `${destination.lat},${destination.lng}`);
    url.searchParams.set('mode', 'driving');
    url.searchParams.set('key', apiKey);
    url.searchParams.set('alternatives', 'true');
    url.searchParams.set('geometries', 'geojson');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Google Directions API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Directions status: ${data.status}`);
    }

    const routes = data.routes ?? [];
    if (routes.length === 0) return null;

    const mappedRoutes = routes.map((route: any) => {
      const coords: Coordinates[] = (route.geometry?.coordinates ?? [])
        .map(([lng, lat]: [number, number]) => ({ lat, lng }))
        .filter((p) => isFiniteCoordinate(p.lat) && isFiniteCoordinate(p.lng));
      return coords;
    }).filter((route) => route.length > 0);

    const mainPath = mappedRoutes[0];
    if (!mainPath) return null;

    const mainRoute = routes[0];
    const distanceKm = (mainRoute.legs?.[0]?.distance?.value ?? 0) / 1000;
    const durationMin = (mainRoute.legs?.[0]?.duration?.value ?? 0) / 60;

    return {
      distanceKm,
      durationMin,
      path: mainPath,
      alternativePaths: mappedRoutes.slice(1)
    };
  } catch (error) {
    if ((error as any)?.name === 'AbortError') return null;
    console.error('calculateRoute failed:', error);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
