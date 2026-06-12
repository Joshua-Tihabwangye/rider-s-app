import React, { useLayoutEffect, useRef, useState } from "react";
import { Box, Button, type SxProps, type Theme } from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";

interface ExpandableMapPanelProps {
  map: React.ReactNode;
  details: React.ReactNode;
  mapHeight: string | number | { xs?: string | number; sm?: string | number; md?: string | number; lg?: string | number; xl?: string | number };
  expandedMapHeight?: string | number | { xs?: string | number; sm?: string | number; md?: string | number; lg?: string | number; xl?: string | number };
  defaultExpanded?: boolean;
  containerSx?: SxProps<Theme>;
  detailsWrapperSx?: SxProps<Theme>;
  mapWrapperSx?: SxProps<Theme>;
  buttonOffsetExpanded?: number;
  buttonOffsetCollapsed?: number;
  minMapHeight?: number;
}

function SmoothHeightCollapse({
  open,
  children,
  sx
}: {
  open: boolean;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}): React.JSX.Element {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [height, setHeight] = useState<string>(open ? "auto" : "0px");
  const [opacity, setOpacity] = useState(open ? 1 : 0);

  useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
    }

    if (open) {
      const currentHeight = node.getBoundingClientRect().height;
      const targetHeight = node.scrollHeight;
      setHeight(`${currentHeight}px`);
      rafRef.current = window.requestAnimationFrame(() => {
        setOpacity(1);
        setHeight(`${targetHeight}px`);
      });
      return;
    }

    const currentHeight = node.getBoundingClientRect().height;
    setHeight(`${currentHeight}px`);
    rafRef.current = window.requestAnimationFrame(() => {
      setHeight("0px");
      setOpacity(0);
    });
  }, [open]);

  return (
    <Box
      onTransitionEnd={(event) => {
        if (event.target !== event.currentTarget || event.propertyName !== "height") {
          return;
        }
        if (open) {
          setHeight("auto");
        }
      }}
      sx={[
        {
          height,
          opacity,
          overflow: "hidden",
          transition: "height 320ms ease-in-out, opacity 220ms ease-in-out",
          willChange: "height, opacity"
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Box ref={contentRef}>{children}</Box>
    </Box>
  );
}

export default function ExpandableMapPanel({
  map,
  details,
  mapHeight,
  expandedMapHeight = { xs: "78dvh", md: "76vh" },
  defaultExpanded = false,
  containerSx,
  detailsWrapperSx,
  mapWrapperSx,
  buttonOffsetExpanded = 12,
  buttonOffsetCollapsed = -18,
  minMapHeight = 320
}: ExpandableMapPanelProps): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const mapWrapperRef = useRef<HTMLDivElement | null>(null);

  // Fire a single resize event after the height transition completes so the
  // Google Map tiles re-render correctly without spamming resize every frame.
  const handleMapTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== "height") return;
    if (mapWrapperRef.current) {
      const mapEl = mapWrapperRef.current.querySelector("[data-map-shell]") as HTMLElement | null;
      if (mapEl) {
        window.dispatchEvent(new Event("resize"));
      }
    }
  };

  return (
    <>
      <Box
        sx={[
          {
            position: "relative",
            display: "flex",
            flexDirection: "column",
            flex: "0 0 auto"
          },
          ...(Array.isArray(containerSx) ? containerSx : containerSx ? [containerSx] : [])
        ]}
      >
        <Box
          ref={mapWrapperRef}
          onTransitionEnd={handleMapTransitionEnd}
          sx={[
            {
              height: isExpanded ? expandedMapHeight : mapHeight,
              minHeight: { xs: minMapHeight, md: minMapHeight + 32 },
              transition: "height 320ms ease-in-out",
              flex: "0 0 auto"
            },
            ...(Array.isArray(mapWrapperSx) ? mapWrapperSx : mapWrapperSx ? [mapWrapperSx] : [])
          ]}
        >
          {map}
        </Box>

        <Button
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-label={isExpanded ? "Show details panel" : "Expand map"}
          sx={{
            position: "absolute",
            left: "50%",
            bottom: 0,
            transform: `translateX(-50%) translateY(${isExpanded ? `${buttonOffsetExpanded}px` : `${buttonOffsetCollapsed}px`})`,
            zIndex: 14,
            borderRadius: 999,
            px: 1.4,
            py: 0.4,
            minWidth: 0,
            bgcolor: "var(--evz-map-overlay-bg)",
            border: "1px solid var(--evz-map-control-border)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            boxShadow: "0 2px 10px rgba(2,6,23,0.2)",
            // Use transform-only animation — avoids layout reflow on every frame
            transition: "transform 0.3s ease",
            textTransform: "none",
            color: "#334155",
            fontSize: 12,
            fontWeight: 700,
            willChange: "transform",
            "&:hover": { bgcolor: "var(--evz-map-control-bg)" }
          }}
        >
          {isExpanded ? <KeyboardArrowUpRoundedIcon sx={{ mr: 0.3 }} /> : <KeyboardArrowDownRoundedIcon sx={{ mr: 0.3 }} />}
          {isExpanded ? "Show details" : "Extend map"}
        </Button>
      </Box>

      <SmoothHeightCollapse open={!isExpanded} sx={detailsWrapperSx}>
        {details}
      </SmoothHeightCollapse>
    </>
  );
}
