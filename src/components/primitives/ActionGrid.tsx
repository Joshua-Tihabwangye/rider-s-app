import React from "react";
import { Box, SxProps, Theme } from "@mui/material";

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
          gap: 1.5,
          gridTemplateColumns: {
            xs: "1fr",
            md: `repeat(2, minmax(${minWidth}px, 1fr))`
          }
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      {children}
    </Box>
  );
}

