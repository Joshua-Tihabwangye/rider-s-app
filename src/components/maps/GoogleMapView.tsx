import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  LoadScript,
  GoogleMap,
  Marker,
  Polyline,
  Circle,
  TrafficLayer,
  InfoWindow,
  useLoadScript,
  useGoogleMap
} from "@react-google-maps/api";

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

export interface GoogleMapViewProps {
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
  alternativePolylines?: MapPoint[][];
  showTraffic?: boolean;
  showAlerts?: boolean;
  showSOS?: boolean;
  showControls?: boolean;
  showCurrentLocationMarker?: boolean;
  showViewSwitcher?: boolean;
  children?: React.ReactNode;
  onMarkerClick?: (markerId: string) => void;
  onMapClick?: (point: MapPoint) => void;
  onLocationSelect?: (point: MapPoint) => void;
  onZoomChange?: (zoom: number) => void;
  className?: string;
  height?: string | number;
  recenterKey?: number;
  resizeKey?: number | string;
}

const LIBRARIES = ["places"] as const;

const DEFAULT_ZOOM = 13;
const MIN_ZOOM = 3;
const MAX_ZOOM = 20;

const MAP_CONTAINER_STYLE: React.CSSProperties = {
  width: "100%",
  height: "100%",
  position: "absolute",
  inset: 0
};

const LAYER_TO_MAPTYPE: Record<string, google.maps.MapTypeId> = {
  default: "roadmap",
  transit: "roadmap",
  terrain: "terrain",
  satellite: "satellite"
};

function createDotIcon(color: string): google.maps.Symbol {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 7,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: "#FFFFFF",
    strokeWeight: 2,
    strokeOpacity: 1
  };
}

function resolveAlertColor(severity?: "low" | "medium" | "high"): string {
  if (severity === "high") return "#dc2626";
  if (severity === "medium") return "#f59e0b";
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

function pointsEqual(a: MapPoint, b: MapPoint): boolean {
  return a.lat === b.lat && a.lng === b.lng;
}

function routesEqual(a: MapPoint[], b: MapPoint[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (!pointsEqual(a[i], b[i])) return false;
  }
  return true;
}

// Child component: sync center/zoom and emit zoom changes
function MapSyncController({
  center,
  zoom,
  recenterKey,
  onZoomChange
}: {
  center: MapPoint;
  zoom: number;
  recenterKey: number;
  onZoomChange?: (zoom: number) => void;
}): null {
  const map = useGoogleMap();
  const zoomListenerRef = useRef<google.maps.MapsEventListener | null>(null);

  useEffect(() => {
    if (!map) return;
    map.setCenter({ lat: center.lat, lng: center.lng });
    map.setZoom(zoom);
  }, [center.lat, center.lng, map, recenterKey, zoom]);

  useEffect(() => {
    if (!map || !onZoomChange) return;
    zoomListenerRef.current = map.addListener("zoom_changed", () => {
      const nextZoom = map.getZoom();
      if (nextZoom !== undefined) onZoomChange(nextZoom);
    });
    return () => {
      if (zoomListenerRef.current) {
        google.maps.event.removeListener(zoomListenerRef.current);
        zoomListenerRef.current = null;
      }
    };
  }, [map, onZoomChange]);

  return null;
}

// Child component: handle resize
function MapResizeController({ resizeKey }: { resizeKey: number | string }): null {
  const map = useGoogleMap();
  useEffect(() => {
    if (!map) return;
    const timeoutId = setTimeout(() => {
      google.maps.event.trigger(map, "resize");
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [resizeKey, map]);
  return null;
}

// Child component: fit bounds to given points
function MapFitBoundsController({
  focusPoints,
  routePolyline
}: {
  focusPoints: MapPoint[];
  routePolyline: MapPoint[];
}): null {
  const map = useGoogleMap();
  const lastBoundsKeyRef = useRef("");

  useEffect(() => {
    if (!map) return;
    const points = [...routePolyline, ...focusPoints].filter(isValidPoint);
    if (points.length < 2) return;
    const boundsKey = points
      .map((p) => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`)
      .join("|");
    if (lastBoundsKeyRef.current === boundsKey) return;
    lastBoundsKeyRef.current = boundsKey;

    const bounds = new google.maps.LatLngBounds();
    points.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));
    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, {
        padding: { top: 40, right: 40, bottom: 40, left: 40 },
        maxZoom: 16
      });
    }
  }, [focusPoints, routePolyline, map]);

  return null;
}

export default function GoogleMapView({
  center,
  zoom = DEFAULT_ZOOM,
  layer = "default",
  markers = [],
  pickupLocation = null,
  dropoffLocation = null,
  driverLocation = null,
  riderLocation = null,
  alerts = [],
  routePolyline = [],
  alternativePolylines = [],
  showTraffic = false,
  showAlerts = false,
  showSOS = false,
  showControls = false,
  showCurrentLocationMarker = true,
  showViewSwitcher = true,
  children,
  onMarkerClick,
  onMapClick,
  onLocationSelect,
  onZoomChange,
  className,
  height = "100%",
  recenterKey = 0,
  resizeKey = 0
}: GoogleMapViewProps): React.JSX.Element {
  const [mapTypeId, setMapTypeId] = useState<google.maps.MapTypeId>(
    LAYER_TO_MAPTYPE[layer] || "roadmap"
  );

  // Sync map type if layer prop changes
  useEffect(() => {
    setMapTypeId(LAYER_TO_MAPTYPE[layer] || "roadmap");
  }, [layer]);

  const [resolvedRoute, setResolvedRoute] = useState<MapPoint[]>(routePolyline);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rawApiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "").trim();
  const googleMapsApiKey = rawApiKey && !/^https?:\/\//i.test(rawApiKey) ? rawApiKey : "";

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries: LIBRARIES
  });

  // Update route if prop changes (no auto-routing for now)
  useEffect(() => {
    const validRoute = routePolyline.filter(isValidPoint);
    setResolvedRoute((prev) => (routesEqual(prev, validRoute) ? prev : validRoute));
  }, [routePolyline]);

  // Combine all markers
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

  // Determine current location marker position
  const currentLocationMarker = useMemo((): MapPoint => {
    const existingCurrent = combinedMarkers.find(
      (m) =>
        m.id.toLowerCase().includes("current") ||
        m.label?.toLowerCase().includes("current")
    );
    if (existingCurrent) return existingCurrent.position;
    if (isValidPoint(riderLocation)) return riderLocation;
    if (isValidPoint(pickupLocation)) return pickupLocation;
    return center;
  }, [center, combinedMarkers, pickupLocation, riderLocation]);

  const hasExplicitCurrentMarker = useMemo(() => {
    return combinedMarkers.some(
      (m) =>
        m.id.toLowerCase().includes("current") ||
        m.label?.toLowerCase().includes("current")
    );
  }, [combinedMarkers]);

  // Cycle through map types
  const cycleMapType = (): void => {
    const types: google.maps.MapTypeId[] = ["roadmap", "satellite", "terrain", "hybrid"];
    const currentIndex = types.indexOf(mapTypeId);
    const nextIndex = (currentIndex + 1) % types.length;
    setMapTypeId(types[nextIndex]);
  };

  // Map click
  const handleMapClick: google.maps.MapListener["click"] = (event) => {
    const lat = event.latLng?.lat();
    const lng = event.latLng?.lng();
    if (lat !== undefined && lng !== undefined) {
      const point: MapPoint = { lat, lng };
      onMapClick?.(point);
      onLocationSelect?.(point);
    }
  };

  // Marker click handler
  const handleMarkerClick = (id: string) => {
    setSelectedMarkerId((prev) => (prev === id ? null : id));
    onMarkerClick?.(id);
  };

  if (loadError) {
    const details =
      loadError instanceof Error
        ? loadError.message
        : typeof loadError === "string"
          ? loadError
          : "Unknown Google Maps loader error";
    const host = typeof window !== "undefined" ? window.location.host : "unknown-host";
    return (
      <div
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f4f6",
          color: "#6b7280",
          fontSize: 14,
          textAlign: "center",
          padding: 16,
          zIndex: 20
        }}
      >
        <div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Failed to load Google Map.</div>
          <div style={{ fontSize: 12 }}>{details}</div>
          <div style={{ fontSize: 11, marginTop: 6 }}>Host: {host}</div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f4f6",
          zIndex: 20
        }}
      >
        Loading map...
      </div>
    );
  }

  const mapOptions: google.maps.MapOptions = {
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    disableDefaultUI: false,
    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    gestureHandling: "greedy"
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height, zIndex: 0 }}
    >
      {showViewSwitcher && (
        <button
          type="button"
          aria-label="Change map view"
          onClick={cycleMapType}
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
            cursor: "pointer",
            backdropFilter: "blur(6px)"
          }}
        >
          View: {mapTypeId}
        </button>
      )}
      <GoogleMap
        key={`${center.lat.toFixed(6)}-${center.lng.toFixed(6)}-${zoom}-${recenterKey}`}
        center={{ lat: center.lat, lng: center.lng }}
        zoom={zoom}
        mapTypeId={mapTypeId}
        onClick={handleMapClick}
        options={mapOptions}
        style={MAP_CONTAINER_STYLE}
      >
        <MapSyncController
          center={center}
          zoom={zoom}
          recenterKey={recenterKey}
          onZoomChange={onZoomChange}
        />
        <MapResizeController resizeKey={resizeKey} />
        <MapFitBoundsController
          focusPoints={combinedMarkers.map((m) => m.position)}
          routePolyline={resolvedRoute}
        />

        {showTraffic && <TrafficLayer />}

        {/* Main route */}
        {resolvedRoute.length > 1 && (
          <Polyline
            path={resolvedRoute}
            options={{
              strokeColor: "#1d4ed8",
              strokeWeight: 5,
              strokeOpacity: 0.95
            }}
          />
        )}

        {/* Alternative routes */}
        {alternativePolylines.map((route, idx) => {
          if (route.length < 2) return null;
          return (
            <Polyline
              key={`alt-${idx}`}
              path={route}
              options={{
                strokeColor: "#64748b",
                strokeWeight: 4,
                strokeOpacity: 0.35
                // Note: dashed lines not natively supported; using solid
              }}
            />
          );
        })}

        {/* Alerts */}
        {showAlerts &&
          alerts.map((alert) => {
            const color = resolveAlertColor(alert.severity);
            return (
              <React.Fragment key={alert.id}>
                <Circle
                  center={alert.position}
                  radius={alert.radiusMeters ?? 80}
                  options={{
                    strokeColor: color,
                    strokeOpacity: 0.5,
                    fillColor: color,
                    fillOpacity: 0.12
                  }}
                />
                <Marker
                  position={alert.position}
                  icon={createDotIcon(color)}
                  onClick={() => handleMarkerClick(alert.id)}
                />
              </React.Fragment>
            );
          })}

        {/* Current location marker */}
        {showCurrentLocationMarker && !hasExplicitCurrentMarker && (
          <Marker position={currentLocationMarker} />
        )}

        {/* Custom markers */}
        {combinedMarkers.map((marker) => {
          const isCurrent =
            marker.id.toLowerCase().includes("current") ||
            marker.label?.toLowerCase().includes("current");
          const icon = !isCurrent && marker.color ? createDotIcon(marker.color) : undefined;
          return (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={icon}
              onClick={() => handleMarkerClick(marker.id)}
            />
          );
        })}

        {/* InfoWindow popup */}
        {selectedMarkerId && (() => {
          const marker = combinedMarkers.find((m) => m.id === selectedMarkerId);
          const alert = alerts.find((a) => a.id === selectedMarkerId);
          const data = marker || alert;
          if (!data) return null;
          const content = marker?.popup || marker?.label || alert?.label || "";
          return (
            <InfoWindow
              position={data.position}
              onCloseClick={() => setSelectedMarkerId(null)}
            >
              <div style={{ color: "#000", fontSize: 12, padding: "4px 8px" }}>{content}</div>
            </InfoWindow>
          );
        })()}

        {children}
      </GoogleMap>
    </div>
  );
}
