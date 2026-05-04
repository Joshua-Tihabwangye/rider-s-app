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

export async function searchPlaces(query: string): Promise<PlaceSuggestion[]> {
  const term = normalizeQuery(query);
  if (term.length < 3) return [];

  try {
    // Enhanced Nominatim geocoding API for better key location capture
    // Increase limit, add deduplication, and better search parameters for key GPS locations
    const response = await fetch(
      `/api/osm/search?format=json&q=${encodeURIComponent(term)}&countrycodes=UG&limit=15&addressdetails=1&dedupe=1&bounded=1&viewbox=29.5,4.3,35.0,-1.5&extratags=1&namedetails=1`,
      {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      }
    );

    if (!response.ok) {
      console.warn("Nominatim API request failed, falling back to mock data");
      return getFallbackPlaces(term);
    }

    const data = await response.json();

    // Filter and prioritize results - prefer key GPS locations with higher importance and valid coordinates
    const validResults = data
      .filter((item: any) => {
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        // Validate coordinates are finite numbers and within Uganda bounds
        const isValidCoord = isFiniteCoordinate(lat) && isFiniteCoordinate(lng) && isValidUgandaCoordinate(lat, lng);

        // Also check if it's a meaningful place (has a proper name, not just coordinates)
        const hasMeaningfulName = item.display_name && item.display_name.length > 10;

        return isValidCoord && hasMeaningfulName;
      })
      .sort((a: any, b: any) => {
        // Primary sort: importance (higher importance = more key locations)
        const aImportance = parseFloat(a.importance) || 0;
        const bImportance = parseFloat(b.importance) || 0;
        if (aImportance !== bImportance) return bImportance - aImportance;

        // Secondary sort: prefer key place types that are GPS-located landmarks
        const keyPlaceTypes = ['amenity', 'tourism', 'leisure', 'historic', 'shop', 'place'];
        const aTypeScore = keyPlaceTypes.includes(a.class) ? 2 : (a.class === 'highway' ? 1 : 0);
        const bTypeScore = keyPlaceTypes.includes(b.class) ? 2 : (b.class === 'highway' ? 1 : 0);
        if (aTypeScore !== bTypeScore) return bTypeScore - aTypeScore;

        // Tertiary sort: prefer places with more detailed names
        const aNameLength = (a.display_name || '').length;
        const bNameLength = (b.display_name || '').length;
        return bNameLength - aNameLength;
      })
      .slice(0, 8); // Limit to top 8 key results

    const suggestions: PlaceSuggestion[] = validResults.map((item: any, index: number) => {
      // Create more meaningful descriptions for key GPS locations
      let description = item.display_name;

      // If we have namedetails, try to construct a better description
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

    return suggestions;
  } catch (error) {
    console.warn("Failed to fetch from Nominatim API, falling back to mock data:", error);
    return getFallbackPlaces(term);
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

  const requestRoute = async (alternatives: boolean): Promise<Response | null> => {
    try {
      return await fetch(
        `/api/osrm/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&steps=false&alternatives=${alternatives ? "true" : "false"}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json"
          }
        }
      );
    } catch {
      return null;
    }
  };

  let response = await requestRoute(true);
  if (!response || !response.ok) {
    response = await requestRoute(false);
  }

  if (!response || !response.ok) return null;

  const payload = (await response.json()) as {
    routes?: Array<{
      distance?: number;
      duration?: number;
      geometry?: {
        coordinates?: [number, number][];
      };
    }>;
  };

  const rawRoutes = payload.routes ?? [];
  const mappedRoutes = rawRoutes
    .map((candidate) =>
      (candidate.geometry?.coordinates ?? [])
        .map(([lng, lat]) => ({ lat, lng }))
        .filter((point) => isFiniteCoordinate(point.lat) && isFiniteCoordinate(point.lng))
    )
    .filter((candidatePath) => candidatePath.length > 0);
  const path = mappedRoutes[0];
  if (!path?.length) return null;

  return {
    distanceKm: (rawRoutes[0]?.distance ?? 0) / 1000,
    durationMin: (rawRoutes[0]?.duration ?? 0) / 60,
    path,
    alternativePaths: mappedRoutes.slice(1)
  };
}
