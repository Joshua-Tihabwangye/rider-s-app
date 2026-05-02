import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import MapShell from "../maps/MapShell";
import { getPointAtProgress, normalizeRoute } from "../../utils/mapRoutes";

interface DeliveryTrackingMapProps {
  pickupLabel: string;
  dropoffLabel: string;
  pickupCoordinates?: { lat: number; lng: number } | null;
  dropoffCoordinates?: { lat: number; lng: number } | null;
  routePolyline?: Array<{ lat: number; lng: number }>;
  courierPosition: number;
  etaLabel: string;
  statusLabel: string;
  stopLabels?: string[];
  completedStops?: number;
  height?: number | string;
  rounded?: boolean;
  fullBleed?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  showControls?: boolean;
}

const STANDARD_DELIVERY_MAP_HEIGHT = "clamp(320px, 56vh, 460px)";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export default function DeliveryTrackingMap({
  pickupLabel,
  dropoffLabel,
  pickupCoordinates = null,
  dropoffCoordinates = null,
  routePolyline = [],
  courierPosition,
  etaLabel,
  statusLabel,
  stopLabels = [],
  completedStops = 0,
  height = STANDARD_DELIVERY_MAP_HEIGHT,
  rounded = false,
  fullBleed = true,
  showBackButton = false,
  onBack,
  showControls = false
}: DeliveryTrackingMapProps): React.JSX.Element {
  const fallbackCenter = { lat: 0.3476, lng: 32.5825 };
  const startPoint = pickupCoordinates ?? { lat: 0.3136, lng: 32.5811 };
  const endPoint = dropoffCoordinates ?? { lat: 0.3476, lng: 32.5825 };
  const resolvedRoute = normalizeRoute(routePolyline);
  const courierGeoPoint = getPointAtProgress(resolvedRoute, clamp(courierPosition, 0, 1), startPoint, endPoint);
  const mapCenter = pickupCoordinates
    ? {
        lat: (startPoint.lat + endPoint.lat) / 2,
        lng: (startPoint.lng + endPoint.lng) / 2
      }
    : fallbackCenter;

  return (
    <MapShell
      height={height}
      rounded={rounded}
      fullBleed={fullBleed}
      showControls={showControls}
      showBackButton={showBackButton}
      onBack={onBack}
      mapCenter={mapCenter}
      pickupLocation={startPoint}
      dropoffLocation={endPoint}
      driverLocation={courierGeoPoint}
      routePolyline={resolvedRoute.length > 1 ? resolvedRoute : [startPoint, endPoint]}
      canvasSx={{
        background:
          "radial-gradient(circle at 25% 15%, rgba(3,205,140,0.2), rgba(236,253,245,0.95) 40%, rgba(226,232,240,0.9) 100%)"
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.24,
          backgroundImage:
            "linear-gradient(to right, rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.5) 1px, transparent 1px)",
          backgroundSize: "34px 34px"
        }}
      />

      <Box sx={{ position: "absolute", left: 18, bottom: 18, transform: "translate(0, 0)" }}>
        <MyLocationRoundedIcon sx={{ fontSize: 22, color: "#22c55e" }} />
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: { xs: "max(12px, env(safe-area-inset-top))", md: 12 },
          left: showBackButton ? { xs: 62, md: 64 } : 12,
          display: "flex",
          gap: 1
        }}
      >
        <Chip
          size="small"
          icon={<AccessTimeRoundedIcon sx={{ fontSize: 14 }} />}
          label={`ETA ${etaLabel}`}
          sx={{
            borderRadius: 5,
            fontSize: 11,
            height: 24,
            bgcolor: "rgba(15,23,42,0.74)",
            color: "#F8FAFC"
          }}
        />
        <Chip
          size="small"
          label={statusLabel}
          sx={{
            borderRadius: 5,
            fontSize: 11,
            height: 24,
            bgcolor: "rgba(16,185,129,0.14)",
            color: "#047857"
          }}
        />
      </Box>

      <Box
        sx={{
          position: "absolute",
          left: 12,
          bottom: 12,
          right: 12,
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <Typography variant="caption" sx={{ fontSize: 11, color: "rgba(15,23,42,0.8)", fontWeight: 600 }}>
          {pickupLabel}
        </Typography>
        <Typography variant="caption" sx={{ fontSize: 11, color: "rgba(15,23,42,0.8)", fontWeight: 600 }}>
          {dropoffLabel}
        </Typography>
      </Box>
    </MapShell>
  );
}
