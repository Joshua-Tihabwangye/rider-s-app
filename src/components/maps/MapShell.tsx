import React, { useMemo, useState } from "react";
import {
  Box,
  BoxProps,
  Button,
  IconButton,
  Stack,
  SxProps,
  Theme,
  Tooltip,
  Typography
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import TrafficRoundedIcon from "@mui/icons-material/TrafficRounded";
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

const LAYER_ORDER: MapLayerMode[] = ["default", "transit", "terrain", "satellite"];
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
  showControls = true,
  showBackButton,
  showSosButton,
  showFeatureControls,
  onBack,
  onSos,
  onRecenter,
  onZoomChange,
  onBearingChange,
  onLayerChange,
  onMapClick,
  onLocationSelect,
  onMarkerClick,
  initialZoom = 13,
  initialBearing = 0,
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
  const [bearing, setBearing] = useState<number>(initialBearing % 360);
  const [layer, setLayer] = useState<MapLayerMode>(initialLayer);
  const [trafficEnabled, setTrafficEnabled] = useState<boolean>(true);
  const [incidentsEnabled, setIncidentsEnabled] = useState<boolean>(true);
  const [recenterKey, setRecenterKey] = useState<number>(0);

  const resolvedHeight = useMemo(() => {
    if (height !== undefined) {
      return typeof height === "number" ? `${height}px` : height;
    }
    return MAP_HEIGHT_PRESETS[preset];
  }, [height, preset]);

  const fallbackAlerts = useMemo<LeafletAlertMarker[]>(
    () => [
      {
        id: "map_shell_alert_1",
        label: "Traffic incident",
        severity: "high",
        position: { lat: mapCenter.lat + 0.007, lng: mapCenter.lng - 0.009 }
      },
      {
        id: "map_shell_alert_2",
        label: "Road alert",
        severity: "medium",
        position: { lat: mapCenter.lat - 0.006, lng: mapCenter.lng + 0.01 }
      }
    ],
    [mapCenter.lat, mapCenter.lng]
  );

  const handleZoom = (delta: number): void => {
    const next = clampZoom(zoom + delta);
    setZoom(next);
    onZoomChange?.(next);
  };

  const handleRotate = (): void => {
    const next = (bearing + 45) % 360;
    setBearing(next);
    onBearingChange?.(next);
  };

  const handleMapRecenter = (): void => {
    setRecenterKey((prev) => prev + 1);
    onRecenter?.();
  };

  const handleLayerCycle = (): void => {
    const currentIndex = LAYER_ORDER.indexOf(layer);
    const next = LAYER_ORDER[(currentIndex + 1) % LAYER_ORDER.length] ?? "default";
    setLayer(next);
    onLayerChange?.(next);
  };

  const canShowBack = showBackButton ?? isRideMapRoute;
  const canShowSos = (showSosButton ?? isRideMapRoute) && Boolean(onSos ?? isRideMapRoute);
  const canShowFeatureControls = showFeatureControls ?? isRideMapRoute;

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
    navigate(-1);
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
          alerts={alerts.length ? alerts : fallbackAlerts}
          routePolyline={routePolyline}
          showTraffic={trafficEnabled}
          showAlerts={incidentsEnabled}
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
              zIndex: 2
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

      {showControls && (
        <>
          <Stack
            spacing={0.75}
            sx={{
              position: "absolute",
              top: canShowSos
                ? { xs: "calc(env(safe-area-inset-top, 0px) + 58px)", md: 60 }
                : topInsetSx,
              right: rightInsetSx,
              zIndex: 5
            }}
          >
            <Tooltip title="Zoom in">
              <IconButton
                size="small"
                aria-label="Map Zoom In"
                onClick={() => handleZoom(1)}
                sx={controlSx}
              >
                <AddRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zoom out">
              <IconButton
                size="small"
                aria-label="Map Zoom Out"
                onClick={() => handleZoom(-1)}
                sx={controlSx}
              >
                <RemoveRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={`Layer: ${layer}`}>
              <IconButton
                size="small"
                aria-label="Map Layer"
                onClick={handleLayerCycle}
                sx={controlSx}
              >
                <LayersRoundedIcon sx={{ fontSize: 17 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Rotate bearing">
              <IconButton
                size="small"
                aria-label="Map Bearing"
                onClick={handleRotate}
                sx={controlSx}
              >
                <ExploreRoundedIcon sx={{ fontSize: 17 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Recenter">
              <IconButton
                size="small"
                aria-label="Map Recenter"
                onClick={handleMapRecenter}
                sx={controlSx}
              >
                <MyLocationRoundedIcon sx={{ fontSize: 17 }} />
              </IconButton>
            </Tooltip>
          </Stack>

          <Box
            sx={{
              position: "absolute",
              right: rightInsetSx,
              bottom: 14,
              zIndex: 5,
              px: 1.1,
              py: 0.6,
              borderRadius: "var(--evz-radius-pill)",
              border: "1px solid var(--evz-map-overlay-border)",
              bgcolor: "var(--evz-map-overlay-bg)",
              backdropFilter: "blur(6px)",
              boxShadow: uiTokens.elevation.card,
              display: { xs: "none", sm: "block" }
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "var(--evz-map-control-icon-muted)"
              }}
            >
              Z{zoom} · {layer} · T:{trafficEnabled ? "on" : "off"} · A:{incidentsEnabled ? "on" : "off"} · {bearing}deg
            </Typography>
          </Box>

          <Box
            sx={{
              position: "absolute",
              left: leftInsetSx,
              right: rightInsetSx,
              bottom: 12,
              zIndex: 5,
              px: 1.1,
              py: 0.7,
              borderRadius: "14px",
              border: "1px solid var(--evz-map-overlay-border)",
              bgcolor: "var(--evz-map-overlay-bg)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              boxShadow: uiTokens.elevation.card,
              display: { xs: "block", sm: "none" }
            }}
          >
            <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" alignItems="center">
              <Typography sx={mobileInfoLabelSx}>Zoom {zoom}</Typography>
              <Typography sx={mobileInfoLabelSx}>{layer}</Typography>
              <Typography sx={mobileInfoLabelSx}>{bearing}deg</Typography>
            </Stack>
          </Box>
        </>
      )}

      {canShowFeatureControls && (
        <Stack
          direction="row"
          spacing={0.75}
          sx={{
            position: "absolute",
            left: leftInsetSx,
            right: { xs: rightInsetSx, sm: "auto" },
            bottom: { xs: 54, sm: 14 },
            zIndex: 5,
            flexWrap: { xs: "nowrap", sm: "wrap" },
            maxWidth: { xs: "none", sm: "76%" },
            overflowX: { xs: "auto", sm: "visible" },
            overflowY: "hidden",
            pr: { xs: 0.25, sm: 0 },
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none"
            }
          }}
        >
          <Button
            size="small"
            startIcon={<TrafficRoundedIcon sx={{ fontSize: 14 }} />}
            onClick={() => setTrafficEnabled((prev) => !prev)}
            sx={featureButtonSx(trafficEnabled)}
          >
            Traffic
          </Button>
          <Button
            size="small"
            startIcon={<WarningAmberRoundedIcon sx={{ fontSize: 14 }} />}
            onClick={() => setIncidentsEnabled((prev) => !prev)}
            sx={featureButtonSx(incidentsEnabled)}
          >
            Alerts
          </Button>
        </Stack>
      )}
    </Box>
  );
}

const controlSx: SxProps<Theme> = {
  width: 34,
  height: 34,
  borderRadius: "var(--evz-radius-md)",
  border: "1px solid var(--evz-map-control-border)",
  bgcolor: "var(--evz-map-control-bg)",
  color: "var(--evz-map-control-icon)",
  boxShadow: uiTokens.elevation.card,
  "&:hover": {
    bgcolor: "var(--evz-map-overlay-bg)",
    borderColor: "var(--evz-border-brand)",
    color: uiTokens.colors.brand
  }
};

const mobileInfoLabelSx: SxProps<Theme> = {
  px: 0.85,
  py: 0.35,
  borderRadius: "999px",
  bgcolor: "rgba(255,255,255,0.82)",
  color: "var(--evz-map-control-icon-muted)",
  fontSize: 10,
  fontWeight: 700,
  lineHeight: 1,
  textTransform: "uppercase",
  letterSpacing: "0.04em"
};

const featureButtonSx = (active: boolean): SxProps<Theme> => ({
  minHeight: 32,
  px: 1.2,
  flexShrink: 0,
  borderRadius: "999px",
  textTransform: "none",
  fontSize: 11,
  fontWeight: 700,
  lineHeight: 1,
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  border: "1px solid",
  borderColor: active ? "rgba(3,205,140,0.55)" : "var(--evz-map-control-border)",
  bgcolor: active ? "rgba(3,205,140,0.2)" : "var(--evz-map-control-bg)",
  color: active ? "var(--evz-brand-green)" : "var(--evz-map-control-icon-muted)",
  "&:hover": {
    borderColor: active ? "rgba(3,205,140,0.7)" : "rgba(148,163,184,0.9)",
    bgcolor: active ? "rgba(3,205,140,0.26)" : "var(--evz-map-overlay-bg)"
  }
});
