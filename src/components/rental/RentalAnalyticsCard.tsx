import React from "react";
import { Box, Typography } from "@mui/material";
import AppCard from "../primitives/AppCard";
import { uiTokens } from "../../design/tokens";

interface RentalAnalyticsCardProps {
  title: string;
  value: string;
  helperText: string;
  icon: React.ReactNode;
  accent?: "green" | "orange";
}

export default function RentalAnalyticsCard({
  title,
  value,
  helperText,
  icon,
  accent = "green"
}: RentalAnalyticsCardProps): React.JSX.Element {
  const accentColor = accent === "orange" ? uiTokens.colors.accent : uiTokens.colors.brand;
  const accentSurface = accent === "orange" ? uiTokens.surfaces.accentTintSoft : uiTokens.surfaces.brandTintSoft;

  return (
    <AppCard
      contentSx={{
        px: 1.5,
        py: 1.3,
        gap: 0.8
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: uiTokens.radius.lg,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: accentColor,
            bgcolor: accentSurface,
            flexShrink: 0
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="caption"
          sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary }}
        >
          {title}
        </Typography>
      </Box>

      <Typography
        variant="subtitle2"
        sx={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}
      >
        {value}
      </Typography>

      <Typography
        variant="caption"
        sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary }}
      >
        {helperText}
      </Typography>
    </AppCard>
  );
}
