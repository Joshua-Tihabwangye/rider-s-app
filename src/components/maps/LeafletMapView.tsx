import React, { useMemo } from "react";
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
}

const MAP_ATTRIBUTION = "&copy; OpenStreetMap contributors &copy; CARTO";

const TILE_LAYERS: Record<LeafletMapLayerMode, string> = {
  default: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  transit: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  terrain: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  satellite: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
};

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
  recenterKey = 0
}: LeafletMapViewProps): React.JSX.Element {
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

  return (
    <div
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height, zIndex: 0 }}
    >
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        zoomControl={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer attribution={MAP_ATTRIBUTION} url={TILE_LAYERS[layer]} />
        <MapSyncController center={center} zoom={zoom} recenterKey={recenterKey} />
        <MapEventBridge
          onMapClick={onMapClick}
          onLocationSelect={onLocationSelect}
          onZoomChange={onZoomChange}
        />

        {routePolyline.length > 1 && (
          <Polyline
            positions={routePolyline.map((point) => [point.lat, point.lng])}
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

        {combinedMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.position.lat, marker.position.lng]}
            icon={marker.color ? createDotIcon(marker.color) : undefined}
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
