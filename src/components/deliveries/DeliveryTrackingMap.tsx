import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import MapShell from "../maps/MapShell";

interface DeliveryTrackingMapProps {
  pickupLabel: string;
  dropoffLabel: string;
  courierPosition: number;
  etaLabel: string;
  statusLabel: string;
  height?: number | string;
  rounded?: boolean;
  fullBleed?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  showControls?: boolean;
}

const STANDARD_DELIVERY_MAP_HEIGHT = "clamp(252px, 42vh, 360px)";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export default function DeliveryTrackingMap({
  pickupLabel,
  dropoffLabel,
  courierPosition,
  etaLabel,
  statusLabel,
  height = STANDARD_DELIVERY_MAP_HEIGHT,
  rounded = false,
  fullBleed = true,
  showBackButton = false,
  onBack,
  showControls = false
}: DeliveryTrackingMapProps): React.JSX.Element {
  const start = { x: 16, y: 78 };
  const end = { x: 84, y: 24 };
  const t = clamp(courierPosition, 0, 1);
  const courier = {
    x: start.x + (end.x - start.x) * t,
    y: start.y + (end.y - start.y) * t
  };

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const length = Math.sqrt(dx * dx + dy * dy);

  return (
    <MapShell
      height={height}
      rounded={rounded}
      fullBleed={fullBleed}
      showControls={showControls}
      showBackButton={showBackButton}
      onBack={onBack}
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

      <Box
        sx={{
          position: "absolute",
          left: `${start.x}%`,
          top: `${start.y}%`,
          width: `${length}%`,
          height: 3,
          transformOrigin: "0 50%",
          transform: `translate(0, -50%) rotate(${angle}deg)`,
          bgcolor: "rgba(15,23,42,0.75)",
          borderRadius: 999
        }}
      />

      <Box sx={{ position: "absolute", left: `${start.x}%`, top: `${start.y}%`, transform: "translate(-50%, -50%)" }}>
        <MyLocationRoundedIcon sx={{ fontSize: 22, color: "#22c55e" }} />
      </Box>

      <Box sx={{ position: "absolute", left: `${courier.x}%`, top: `${courier.y}%`, transform: "translate(-50%, -50%)" }}>
        <LocalShippingRoundedIcon sx={{ fontSize: 28, color: "#0ea5e9", filter: "drop-shadow(0 6px 12px rgba(15,23,42,0.45))" }} />
      </Box>

      <Box sx={{ position: "absolute", left: `${end.x}%`, top: `${end.y}%`, transform: "translate(-50%, -50%)" }}>
        <PlaceRoundedIcon sx={{ fontSize: 30, color: "#0284c7" }} />
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
