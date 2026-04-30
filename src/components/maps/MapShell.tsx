import React, { useMemo, useState } from "react";
import {
  Box,
  BoxProps,
  Button,
  IconButton,
  SxProps,
  Theme
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useLocation, useNavigate } from "react-router-dom";
import { uiTokens } from "../../design/tokens";
import { MAP_HEIGHT_PRESETS, MapHeightPreset } from "./mapPresets";
import LeafletMapView, {
  type LeafletAlertMarker,
  type LeafletMapLayerMode,
  type LeafletMapMarker,
  type MapPoint
} from "./LeafletMapView";

type MapLayerMode = LeafletMapLayerMode;

interface MapShellProps {
  children?: React.ReactNode;
  childrenLayer?: "overlay" | "canvas";
  preset?: MapHeightPreset;
  height?: number | string;
  rounded?: boolean;
  showGrid?: boolean;
  showControls?: boolean;
  showBackButton?: boolean;
  showSosButton?: boolean;
  showFeatureControls?: boolean;
  onBack?: () => void;
  onSos?: () => void;
  onRecenter?: () => void;
  onZoomChange?: (zoom: number) => void;
  onBearingChange?: (bearing: number) => void;
  onLayerChange?: (layer: MapLayerMode) => void;
  onMapClick?: (point: MapPoint) => void;
  onLocationSelect?: (point: MapPoint) => void;
  onMarkerClick?: (markerId: string) => void;
  initialZoom?: number;
  initialBearing?: number;
  initialLayer?: MapLayerMode;
  mapCenter?: MapPoint;
  mapMarkers?: LeafletMapMarker[];
  pickupLocation?: MapPoint | null;
  dropoffLocation?: MapPoint | null;
  driverLocation?: MapPoint | null;
  riderLocation?: MapPoint | null;
  alerts?: LeafletAlertMarker[];
  routePolyline?: MapPoint[];
  sx?: SxProps<Theme>;
  canvasSx?: SxProps<Theme>;
  overlaysSx?: SxProps<Theme>;
  canvasRef?: React.Ref<HTMLDivElement>;
  canvasProps?: Omit<BoxProps, "sx" | "children" | "ref">;
  fullBleed?: boolean;
  interactive?: boolean;
}

const KAMPALA_CENTER: MapPoint = { lat: 0.3476, lng: 32.5825 };

function clampZoom(zoom: number): number {
  return Math.max(1, Math.min(22, zoom));
}

export default function MapShell({
  children,
  childrenLayer = "overlay",
  preset = "full",
  height,
  rounded = false,
  showGrid = false,
  showBackButton,
  showSosButton,
  onBack,
  onSos,
  onZoomChange,
  onMapClick,
  onLocationSelect,
  onMarkerClick,
  initialZoom = 13,
  initialLayer = "default",
  mapCenter = KAMPALA_CENTER,
  mapMarkers = [],
  pickupLocation = null,
  dropoffLocation = null,
  driverLocation = null,
  riderLocation = null,
  alerts = [],
  routePolyline = [],
  sx,
  canvasSx,
  overlaysSx,
  canvasRef,
  canvasProps,
  fullBleed = true,
  interactive = true
}: MapShellProps): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const isRideMapRoute = location.pathname.startsWith("/rides");
  const [zoom, setZoom] = useState<number>(clampZoom(initialZoom));
  const layer = initialLayer;
  const recenterKey = 0;

  const resolvedHeight = useMemo(() => {
    if (height !== undefined) {
      return typeof height === "number" ? `${height}px` : height;
    }
    return MAP_HEIGHT_PRESETS[preset];
  }, [height, preset]);

  const canShowBack = showBackButton ?? isRideMapRoute;
  const canShowSos = (showSosButton ?? isRideMapRoute) && Boolean(onSos ?? isRideMapRoute);

  const topInsetSx = {
    xs: "calc(env(safe-area-inset-top, 0px) + 12px)",
    md: 14
  } as const;
  const leftInsetSx = fullBleed
    ? {
        xs: "calc(var(--rider-shell-content-px-xs, 20px) + env(safe-area-inset-left, 0px) + 6px)",
        md: "calc(var(--rider-shell-content-px-md, 24px) + env(safe-area-inset-left, 0px) + 6px)"
      }
    : {
        xs: "calc(env(safe-area-inset-left, 0px) + 12px)",
        md: 14
      };
  const rightInsetSx = fullBleed
    ? {
        xs: "calc(var(--rider-shell-content-px-xs, 20px) + env(safe-area-inset-right, 0px) + 6px)",
        md: "calc(var(--rider-shell-content-px-md, 24px) + env(safe-area-inset-right, 0px) + 6px)"
      }
    : {
        xs: "calc(env(safe-area-inset-right, 0px) + 12px)",
        md: 14
      };

  const handleBack = (): void => {
    if (onBack) {
      onBack();
      return;
    }
    const fallbackRoute = resolveFallbackRoute(location.pathname);
    const hasInAppHistory =
      typeof window !== "undefined" &&
      ((typeof window.history.state?.idx === "number" && window.history.state.idx > 0) ||
        (typeof document !== "undefined" && document.referrer.startsWith(window.location.origin)));
    if (hasInAppHistory) {
      navigate(-1);
      return;
    }
    navigate(fallbackRoute, { replace: true });
  };

  const handleSos = (): void => {
    if (onSos) {
      onSos();
      return;
    }
    if (isRideMapRoute) {
      navigate("/rides/sos");
    }
  };

  return (
    <Box
      data-map-shell="true"
      data-map-preset={preset}
      sx={[
        {
          position: "relative",
          width: fullBleed
            ? {
                xs: "calc(100% + (var(--rider-shell-content-px-xs, 20px) * 2))",
                md: "calc(100% + (var(--rider-shell-content-px-md, 24px) * 2))"
              }
            : "100%",
          mx: fullBleed
            ? {
                xs: "calc(var(--rider-shell-content-px-xs, 20px) * -1)",
                md: "calc(var(--rider-shell-content-px-md, 24px) * -1)"
              }
            : 0,
          height: resolvedHeight,
          overflow: "hidden",
          borderRadius: rounded ? "var(--evz-radius-xl)" : 0,
          border: rounded ? uiTokens.borders.subtle : "none",
          boxShadow: rounded ? uiTokens.elevation.card : "none"
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Box
        ref={canvasRef}
        {...canvasProps}
        sx={[
          {
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            background: uiTokens.map.canvas
          },
          ...(Array.isArray(canvasSx) ? canvasSx : canvasSx ? [canvasSx] : [])
        ]}
      >
        <LeafletMapView
          center={mapCenter}
          zoom={zoom}
          layer={layer}
          markers={mapMarkers}
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          driverLocation={driverLocation}
          riderLocation={riderLocation}
          alerts={alerts}
          routePolyline={routePolyline}
          showTraffic={false}
          showAlerts={false}
          onMarkerClick={onMarkerClick}
          onMapClick={onMapClick}
          onLocationSelect={onLocationSelect}
          onZoomChange={(nextZoom) => {
            const clamped = clampZoom(nextZoom);
            setZoom(clamped);
            onZoomChange?.(clamped);
          }}
          recenterKey={recenterKey}
          className={interactive ? undefined : "evz-map-static"}
        />
        {showGrid && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              opacity: 0.18,
              pointerEvents: "none",
              backgroundImage:
                "linear-gradient(to right, var(--evz-map-grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--evz-map-grid-line) 1px, transparent 1px)",
              backgroundSize: "30px 30px"
            }}
          />
        )}
        {childrenLayer === "canvas" && children && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 2
            }}
          >
            {children}
          </Box>
        )}
      </Box>

      {childrenLayer === "overlay" && children && (
        <Box
          sx={[
            {
              position: "absolute",
              inset: 0,
              zIndex: 2,
              pointerEvents: "none",
              "& button, & [role='button'], & a, & input, & textarea, & select, & .map-clickable": {
                pointerEvents: "auto"
              }
            },
            ...(Array.isArray(overlaysSx) ? overlaysSx : overlaysSx ? [overlaysSx] : [])
          ]}
        >
          {children}
        </Box>
      )}

      {canShowBack && (
        <IconButton
          size="small"
          aria-label="Back"
          onClick={handleBack}
          sx={{
            position: "absolute",
            top: topInsetSx,
            left: leftInsetSx,
            zIndex: 6,
            width: 44,
            height: 44,
            bgcolor: "var(--evz-map-overlay-bg)",
            color: (theme) => theme.palette.text.primary,
            borderRadius: "14px",
            border: "1px solid var(--evz-map-control-border)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            boxShadow: "0 8px 18px rgba(15,23,42,0.2)",
            "&:hover": {
              bgcolor: "var(--evz-map-control-bg)"
            }
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      )}

      {canShowSos && (
        <Button
          size="small"
          variant="contained"
          aria-label="SOS Emergency"
          onClick={handleSos}
          startIcon={<WarningAmberRoundedIcon sx={{ fontSize: 16 }} />}
          sx={{
            position: "absolute",
            top: topInsetSx,
            right: rightInsetSx,
            zIndex: 6,
            minWidth: 82,
            height: 40,
            px: 1.5,
            borderRadius: "999px",
            bgcolor: "var(--evz-danger)",
            color: "#FFFFFF",
            textTransform: "uppercase",
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: "0.07em",
            boxShadow: "0 8px 18px rgba(220,38,38,0.36)",
            "&:hover": {
              bgcolor: "var(--evz-danger-hover)"
            }
          }}
        >
          SOS
        </Button>
      )}

      {/* Map option clusters intentionally removed globally.
          Native Leaflet gestures are used for zoom and pan on desktop/mobile. */}
    </Box>
  );
}

function resolveFallbackRoute(pathname: string): string {
  if (pathname.startsWith("/rides")) return "/rides/enter";
  if (pathname.startsWith("/deliveries")) return "/deliveries";
  if (pathname.startsWith("/rental")) return "/rental";
  if (pathname.startsWith("/tours")) return "/tours";
  if (pathname.startsWith("/ambulance")) return "/ambulance";
  return "/home";
}
