import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import TwoWheelerRoundedIcon from "@mui/icons-material/TwoWheelerRounded";
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
  titleLabel?: string;
  liveLabel?: string;
  pickupTimeLabel?: string;
  dropoffTimeLabel?: string;
}

const STANDARD_DELIVERY_MAP_HEIGHT = "clamp(360px, 52vh, 520px)";

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
  stopLabels = [],
  completedStops = 0,
  height = STANDARD_DELIVERY_MAP_HEIGHT,
  rounded = false,
  fullBleed = true,
  showBackButton = false,
  onBack,
  showControls = false,
  titleLabel = "Tracking",
  liveLabel = "Live",
  pickupTimeLabel,
  dropoffTimeLabel
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
      routePolyline={resolvedRoute}
      routeProgress={courierPosition}
      routeCompletedColor="#16a34a"
      routeRemainingColor="#f97316"
      routeBaseColor="#ffffff"
      showRouteInfo={false}
      canvasSx={{
        background:
          "radial-gradient(circle at 24% 14%, rgba(3,205,140,0.15), rgba(245,247,250,0.92) 42%, rgba(232,240,252,0.9) 100%)"
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: "absolute",
          left: { xs: 16, md: 22 },
          top: { xs: "30%", md: "34%" },
          borderRadius: "14px",
          border: "1px solid rgba(203,213,225,0.85)",
          bgcolor: "rgba(255,255,255,0.94)",
          px: 1.3,
          py: 1.05,
          zIndex: 3,
          minWidth: 132
        }}
      >
        <Typography variant="caption" sx={{ display: "block", color: "#16a34a", fontWeight: 700, fontSize: 11 }}>
          Pickup
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 13.5, lineHeight: 1.25 }}>
          {pickupLabel}
        </Typography>
        {pickupTimeLabel ? (
          <Typography variant="caption" sx={{ display: "block", mt: 0.2, color: "#64748b", fontSize: 11.5 }}>
            {pickupTimeLabel}
          </Typography>
        ) : null}
      </Paper>

      <Paper
        elevation={0}
        sx={{
          position: "absolute",
          right: { xs: 16, md: 22 },
          top: { xs: "47%", md: "52%" },
          borderRadius: "14px",
          border: "1px solid rgba(203,213,225,0.85)",
          bgcolor: "rgba(255,255,255,0.95)",
          px: 1.3,
          py: 1.05,
          zIndex: 3,
          minWidth: 132
        }}
      >
        <Typography variant="caption" sx={{ display: "block", color: "#f97316", fontWeight: 700, fontSize: 11 }}>
          Drop-off
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 13.5, lineHeight: 1.25 }}>
          {dropoffLabel}
        </Typography>
        {dropoffTimeLabel ? (
          <Typography variant="caption" sx={{ display: "block", mt: 0.2, color: "#64748b", fontSize: 11.5 }}>
            {dropoffTimeLabel}
          </Typography>
        ) : null}
      </Paper>

      <Box
        sx={{
          position: "absolute",
          left: { xs: 16, md: 22 },
          bottom: { xs: 16, md: 20 },
          width: 44,
          height: 44,
          borderRadius: "12px",
          bgcolor: "rgba(255,255,255,0.95)",
          border: "1px solid rgba(203,213,225,0.9)",
          display: "grid",
          placeItems: "center",
          zIndex: 4
        }}
      >
        <MyLocationRoundedIcon sx={{ fontSize: 22, color: "#22c55e" }} />
      </Box>

      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "54%",
          transform: "translate(-50%, -50%)",
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: "3px solid #16a34a",
          bgcolor: "rgba(255,255,255,0.92)",
          display: "grid",
          placeItems: "center",
          zIndex: 4,
          boxShadow: "0 8px 16px rgba(15,23,42,0.18)"
        }}
      >
        <TwoWheelerRoundedIcon sx={{ fontSize: 34, color: "#14532d" }} />
      </Box>
    </MapShell>
  );
}
