import React, { useMemo, useState } from "react";
import {
  Box,
  BoxProps,
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
import { uiTokens } from "../../design/tokens";
import { MAP_HEIGHT_PRESETS, MapHeightPreset } from "./mapPresets";

type MapLayerMode = "default" | "transit" | "terrain";

interface MapShellProps {
  children?: React.ReactNode;
  childrenLayer?: "overlay" | "canvas";
  preset?: MapHeightPreset;
  height?: number | string;
  rounded?: boolean;
  showGrid?: boolean;
  showControls?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  onRecenter?: () => void;
  onZoomChange?: (zoom: number) => void;
  onBearingChange?: (bearing: number) => void;
  onLayerChange?: (layer: MapLayerMode) => void;
  initialZoom?: number;
  initialBearing?: number;
  initialLayer?: MapLayerMode;
  sx?: SxProps<Theme>;
  canvasSx?: SxProps<Theme>;
  overlaysSx?: SxProps<Theme>;
  canvasRef?: React.Ref<HTMLDivElement>;
  canvasProps?: Omit<BoxProps, "sx" | "children" | "ref">;
  fullBleed?: boolean;
}

const LAYER_ORDER: MapLayerMode[] = ["default", "transit", "terrain"];

function clampZoom(zoom: number): number {
  return Math.max(1, Math.min(22, zoom));
}

export default function MapShell({
  children,
  childrenLayer = "overlay",
  preset = "full",
  height,
  rounded = false,
  showGrid = true,
  showControls = true,
  showBackButton,
  onBack,
  onRecenter,
  onZoomChange,
  onBearingChange,
  onLayerChange,
  initialZoom = 13,
  initialBearing = 0,
  initialLayer = "default",
  sx,
  canvasSx,
  overlaysSx,
  canvasRef,
  canvasProps,
  fullBleed = true
}: MapShellProps): React.JSX.Element {
  const [zoom, setZoom] = useState<number>(clampZoom(initialZoom));
  const [bearing, setBearing] = useState<number>(initialBearing % 360);
  const [layer, setLayer] = useState<MapLayerMode>(initialLayer);

  const resolvedHeight = useMemo(() => {
    if (height !== undefined) {
      return typeof height === "number" ? `${height}px` : height;
    }
    return MAP_HEIGHT_PRESETS[preset];
  }, [height, preset]);

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

  const handleLayerCycle = (): void => {
    const currentIndex = LAYER_ORDER.indexOf(layer);
    const next = LAYER_ORDER[(currentIndex + 1) % LAYER_ORDER.length] ?? "default";
    setLayer(next);
    onLayerChange?.(next);
  };

  const canShowBack = showBackButton ?? Boolean(onBack);

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
        {childrenLayer === "canvas" && children}
      </Box>

      {childrenLayer === "overlay" && (
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
          onClick={onBack}
          sx={{
            position: "absolute",
            top: { xs: "max(12px, env(safe-area-inset-top))", md: 14 },
            left: 14,
            zIndex: 5,
            width: 40,
            height: 40,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "rgba(255,255,255,0.92)" : "rgba(15,23,42,0.86)",
            color: (theme) => theme.palette.text.primary,
            borderRadius: "var(--evz-radius-md)",
            border: "1px solid var(--evz-map-control-border)",
            boxShadow: uiTokens.elevation.card,
            "&:hover": {
              bgcolor: "var(--evz-map-overlay-bg)"
            }
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      )}

      {showControls && (
        <>
          <Stack
            spacing={0.75}
            sx={{
              position: "absolute",
              top: 14,
              right: 14,
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
                onClick={onRecenter}
                sx={controlSx}
              >
                <MyLocationRoundedIcon sx={{ fontSize: 17 }} />
              </IconButton>
            </Tooltip>
          </Stack>

          <Box
            sx={{
              position: "absolute",
              right: 14,
              bottom: 14,
              zIndex: 5,
              px: 1.1,
              py: 0.6,
              borderRadius: "var(--evz-radius-pill)",
              border: "1px solid var(--evz-map-overlay-border)",
              bgcolor: "var(--evz-map-overlay-bg)",
              backdropFilter: "blur(6px)",
              boxShadow: uiTokens.elevation.card
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
              Z{zoom} · {layer} · {bearing}deg
            </Typography>
          </Box>
        </>
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
