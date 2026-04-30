import React, { useEffect, useMemo, useState } from "react";
import L, { type DivIcon } from "leaflet";
import {
  Circle,
  MapContainer,
  Marker,
  Pane,
  Polyline,
  Popup,
  TileLayer,
  useMap,
  useMapEvents
} from "react-leaflet";

export interface MapPoint {
  lat: number;
  lng: number;
}

export interface LeafletMapMarker {
  id: string;
  position: MapPoint;
  label?: string;
  popup?: string;
  color?: string;
}

export interface LeafletAlertMarker {
  id: string;
  position: MapPoint;
  label?: string;
  radiusMeters?: number;
  severity?: "low" | "medium" | "high";
}

export type LeafletMapLayerMode = "default" | "transit" | "terrain" | "satellite";

export interface LeafletMapViewProps {
  center: MapPoint;
  zoom?: number;
  layer?: LeafletMapLayerMode;
  markers?: LeafletMapMarker[];
  pickupLocation?: MapPoint | null;
  dropoffLocation?: MapPoint | null;
  driverLocation?: MapPoint | null;
  riderLocation?: MapPoint | null;
  alerts?: LeafletAlertMarker[];
  routePolyline?: MapPoint[];
  showTraffic?: boolean;
  showAlerts?: boolean;
  showSOS?: boolean;
  showControls?: boolean;
  children?: React.ReactNode;
  onMarkerClick?: (markerId: string) => void;
  onMapClick?: (point: MapPoint) => void;
  onLocationSelect?: (point: MapPoint) => void;
  onZoomChange?: (zoom: number) => void;
  className?: string;
  height?: string | number;
  recenterKey?: number;
  showViewSwitcher?: boolean;
  showCurrentLocationMarker?: boolean;
}

const MAP_ATTRIBUTION = "&copy; OpenStreetMap contributors &copy; CARTO";

const TILE_LAYERS: Record<LeafletMapLayerMode, string> = {
  default: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  transit: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  terrain: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  satellite: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
};
const LAYER_ORDER: LeafletMapLayerMode[] = ["default", "transit", "terrain", "satellite"];
const routeCache = new Map<string, MapPoint[]>();

function createDotIcon(color: string): DivIcon {
  return L.divIcon({
    className: "evz-leaflet-dot-marker",
    html: `<span style="display:block;width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 2px 8px rgba(15,23,42,0.35);"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
}

function resolveAlertColor(alert: LeafletAlertMarker): string {
  if (alert.severity === "high") return "#dc2626";
  if (alert.severity === "medium") return "#f59e0b";
  return "#0ea5e9";
}

function isValidPoint(point: MapPoint | null | undefined): point is MapPoint {
  return Boolean(
    point &&
      typeof point.lat === "number" &&
      Number.isFinite(point.lat) &&
      typeof point.lng === "number" &&
      Number.isFinite(point.lng)
  );
}

async function fetchRoutedPath(points: MapPoint[], signal?: AbortSignal): Promise<MapPoint[] | null> {
  const valid = points.filter(isValidPoint);
  if (valid.length < 2) return null;

  const waypoints = valid.map((point) => `${point.lng},${point.lat}`).join(";");
  const cacheKey = waypoints;
  const cached = routeCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const url = `/api/osrm/route/v1/driving/${waypoints}?overview=full&geometries=geojson&steps=false`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    signal
  });
  if (!response.ok) return null;

  const payload = (await response.json()) as {
    code?: string;
    routes?: Array<{
      geometry?: {
        coordinates?: [number, number][];
      };
    }>;
  };

  const coordinates = payload.routes?.[0]?.geometry?.coordinates;
  if (!coordinates?.length) return null;

  const routedPath = coordinates
    .map(([lng, lat]) => ({ lat, lng }))
    .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng));

  if (!routedPath.length) return null;
  routeCache.set(cacheKey, routedPath);
  return routedPath;
}

function syntheticTrafficPolyline(center: MapPoint): MapPoint[][] {
  return [
    [
      { lat: center.lat + 0.013, lng: center.lng - 0.03 },
      { lat: center.lat + 0.002, lng: center.lng - 0.012 },
      { lat: center.lat - 0.007, lng: center.lng + 0.013 }
    ],
    [
      { lat: center.lat + 0.016, lng: center.lng - 0.006 },
      { lat: center.lat + 0.005, lng: center.lng + 0.007 },
      { lat: center.lat - 0.012, lng: center.lng + 0.026 }
    ],
    [
      { lat: center.lat - 0.018, lng: center.lng - 0.025 },
      { lat: center.lat - 0.004, lng: center.lng - 0.002 },
      { lat: center.lat + 0.007, lng: center.lng + 0.024 }
    ]
  ];
}

function MapSyncController({
  center,
  zoom,
  recenterKey
}: {
  center: MapPoint;
  zoom: number;
  recenterKey: number;
}): null {
  const map = useMap();
  React.useEffect(() => {
    map.setView([center.lat, center.lng], zoom, { animate: true });
  }, [center.lat, center.lng, map, recenterKey, zoom]);
  return null;
}

function MapEventBridge({
  onMapClick,
  onLocationSelect,
  onZoomChange
}: {
  onMapClick?: (point: MapPoint) => void;
  onLocationSelect?: (point: MapPoint) => void;
  onZoomChange?: (zoom: number) => void;
}): null {
  useMapEvents({
    click(event) {
      const point = { lat: event.latlng.lat, lng: event.latlng.lng };
      onMapClick?.(point);
      onLocationSelect?.(point);
    },
    zoomend(event) {
      onZoomChange?.(event.target.getZoom());
    }
  });
  return null;
}

export default function LeafletMapView({
  center,
  zoom = 13,
  layer = "default",
  markers = [],
  pickupLocation = null,
  dropoffLocation = null,
  driverLocation = null,
  riderLocation = null,
  alerts = [],
  routePolyline = [],
  showTraffic = false,
  showAlerts = false,
  children,
  onMarkerClick,
  onMapClick,
  onLocationSelect,
  onZoomChange,
  className,
  height = "100%",
  recenterKey = 0,
  showViewSwitcher = true,
  showCurrentLocationMarker = true
}: LeafletMapViewProps): React.JSX.Element {
  const [activeLayer, setActiveLayer] = useState<LeafletMapLayerMode>(layer);
  const [resolvedRoute, setResolvedRoute] = useState<MapPoint[]>(routePolyline);

  useEffect(() => {
    setActiveLayer(layer);
  }, [layer]);

  useEffect(() => {
    const validRoute = routePolyline.filter(isValidPoint);
    if (validRoute.length < 2) {
      setResolvedRoute(validRoute);
      return;
    }

    const controller = new AbortController();
    let mounted = true;

    fetchRoutedPath(validRoute, controller.signal)
      .then((path) => {
        if (!mounted) return;
        setResolvedRoute(path && path.length > 1 ? path : validRoute);
      })
      .catch(() => {
        if (!mounted) return;
        setResolvedRoute(validRoute);
      });

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [routePolyline]);

  const combinedMarkers = useMemo(() => {
    const items: LeafletMapMarker[] = [...markers];
    if (pickupLocation) {
      items.push({ id: "pickup", position: pickupLocation, label: "Pickup", color: "#22c55e" });
    }
    if (dropoffLocation) {
      items.push({ id: "dropoff", position: dropoffLocation, label: "Dropoff", color: "#f97316" });
    }
    if (driverLocation) {
      items.push({ id: "driver", position: driverLocation, label: "Driver", color: "#0ea5e9" });
    }
    if (riderLocation) {
      items.push({ id: "rider", position: riderLocation, label: "Rider", color: "#1d4ed8" });
    }
    return items;
  }, [driverLocation, dropoffLocation, markers, pickupLocation, riderLocation]);

  const currentLocationMarker = useMemo(() => {
    const existingCurrent = combinedMarkers.find(
      (marker) =>
        marker.id.toLowerCase().includes("current") ||
        marker.label?.toLowerCase().includes("current")
    );

    if (existingCurrent) {
      return existingCurrent.position;
    }
    if (isValidPoint(riderLocation)) {
      return riderLocation;
    }
    if (isValidPoint(pickupLocation)) {
      return pickupLocation;
    }
    return center;
  }, [center, combinedMarkers, pickupLocation, riderLocation]);

  const hasExplicitCurrentMarker = useMemo(
    () =>
      combinedMarkers.some(
        (marker) =>
          marker.id.toLowerCase().includes("current") ||
          marker.label?.toLowerCase().includes("current")
      ),
    [combinedMarkers]
  );

  const cycleLayer = (): void => {
    const currentIndex = LAYER_ORDER.indexOf(activeLayer);
    const nextLayer = LAYER_ORDER[(currentIndex + 1) % LAYER_ORDER.length] ?? "default";
    setActiveLayer(nextLayer);
  };

  const routePositions = useMemo(
    () => resolvedRoute.map((point) => [point.lat, point.lng] as [number, number]),
    [resolvedRoute]
  );

  return (
    <div
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height, zIndex: 0 }}
    >
      {showViewSwitcher && (
        <button
          type="button"
          aria-label="Change map view"
          onClick={cycleLayer}
          style={{
            position: "absolute",
            right: "calc(env(safe-area-inset-right, 0px) + 12px)",
            top: "calc(env(safe-area-inset-top, 0px) + 68px)",
            zIndex: 500,
            border: "1px solid rgba(148,163,184,0.55)",
            borderRadius: 12,
            background: "rgba(255,255,255,0.92)",
            color: "#0f172a",
            fontSize: 11,
            fontWeight: 700,
            lineHeight: 1,
            padding: "8px 10px",
            whiteSpace: "nowrap",
            minWidth: "max-content",
            overflow: "visible",
            cursor: "pointer",
            backdropFilter: "blur(6px)"
          }}
        >
          View: {activeLayer}
        </button>
      )}
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        zoomControl={false}
        dragging
        scrollWheelZoom
        touchZoom
        doubleClickZoom
        boxZoom
        minZoom={3}
        maxZoom={20}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer attribution={MAP_ATTRIBUTION} detectRetina url={TILE_LAYERS[activeLayer]} />
        <MapSyncController center={center} zoom={zoom} recenterKey={recenterKey} />
        <MapEventBridge
          onMapClick={onMapClick}
          onLocationSelect={onLocationSelect}
          onZoomChange={onZoomChange}
        />

        {routePositions.length > 1 && (
          <Polyline
            positions={routePositions}
            pathOptions={{ color: "#1e3a5f", weight: 4, opacity: 0.8 }}
          />
        )}

        {showTraffic && (
          <Pane name="traffic-pane" style={{ zIndex: 420 }}>
            {syntheticTrafficPolyline(center).map((path, index) => (
              <Polyline
                key={`traffic_${index}`}
                pane="traffic-pane"
                positions={path.map((point) => [point.lat, point.lng])}
                pathOptions={{
                  color: index === 0 ? "#dc2626" : index === 1 ? "#f59e0b" : "#fb923c",
                  weight: 3,
                  opacity: 0.5,
                  dashArray: "6 10"
                }}
              />
            ))}
          </Pane>
        )}

        {showAlerts &&
          alerts.map((alert) => (
            <React.Fragment key={alert.id}>
              <Circle
                center={[alert.position.lat, alert.position.lng]}
                radius={alert.radiusMeters ?? 80}
                pathOptions={{ color: resolveAlertColor(alert), opacity: 0.5, fillOpacity: 0.12 }}
              />
              <Marker
                position={[alert.position.lat, alert.position.lng]}
                icon={createDotIcon(resolveAlertColor(alert))}
              >
                {alert.label && <Popup>{alert.label}</Popup>}
              </Marker>
            </React.Fragment>
          ))}

        {showCurrentLocationMarker && !hasExplicitCurrentMarker && (
          <Marker position={[currentLocationMarker.lat, currentLocationMarker.lng]}>
            <Popup>Current location</Popup>
          </Marker>
        )}

        {combinedMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.position.lat, marker.position.lng]}
            {...(() => {
              const isCurrentLocationMarker =
                marker.id.toLowerCase().includes("current") ||
                marker.label?.toLowerCase().includes("current");
              if (isCurrentLocationMarker || !marker.color) {
                return {};
              }
              return { icon: createDotIcon(marker.color) };
            })()}
            eventHandlers={{
              click: () => onMarkerClick?.(marker.id)
            }}
          >
            {(marker.popup || marker.label) && <Popup>{marker.popup ?? marker.label}</Popup>}
          </Marker>
        ))}
        {children}
      </MapContainer>
    </div>
  );
}
