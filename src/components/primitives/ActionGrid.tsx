import React from "react";
import { Box, SxProps, Theme } from "@mui/material";
import { uiTokens } from "../../design/tokens";

interface ActionGridProps {
  children: React.ReactNode;
  minWidth?: number;
  sx?: SxProps<Theme>;
}

export default function ActionGrid({
  children,
  minWidth = 250,
  sx
}: ActionGridProps): React.JSX.Element {
  return (
    <Box
      sx={[
        {
          display: "grid",
          gap: uiTokens.spacing.md,
          gridTemplateColumns: {
            xs: "1fr",
            sm: `repeat(2, minmax(${Math.max(220, minWidth - 30)}px, 1fr))`,
            lg: `repeat(2, minmax(${minWidth}px, 1fr))`
          },
          alignItems: "stretch",
          "& > *": {
            height: "100%"
          }
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      {children}
    </Box>
  );
}
