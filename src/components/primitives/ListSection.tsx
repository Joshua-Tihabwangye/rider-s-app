import React from "react";
import { Box, SxProps, Theme } from "@mui/material";

interface ListSectionProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export default function ListSection({ children, sx }: ListSectionProps): React.JSX.Element {
  return (
    <Box
      sx={[
        {
          display: "flex",
          flexDirection: "column",
          gap: 1
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      {children}
    </Box>
  );
}

