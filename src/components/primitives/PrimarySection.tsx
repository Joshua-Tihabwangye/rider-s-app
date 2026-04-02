import React from "react";
import { Box, SxProps, Theme } from "@mui/material";
import AppCard from "./AppCard";

interface PrimarySectionProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
  variant?: "brand" | "warning";
}

export default function PrimarySection({
  children,
  sx,
  contentSx,
  variant = "brand"
}: PrimarySectionProps): React.JSX.Element {
  return (
    <AppCard
      variant={variant}
      sx={sx}
      contentSx={[
        {
          px: { xs: 2, md: 2.5 },
          py: { xs: 2, md: 2.25 }
        },
        ...(Array.isArray(contentSx) ? contentSx : contentSx ? [contentSx] : [])
      ]}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>{children}</Box>
    </AppCard>
  );
}

