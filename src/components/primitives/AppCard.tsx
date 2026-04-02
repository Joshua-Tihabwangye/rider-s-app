import React from "react";
import { Card, CardContent, SxProps, Theme } from "@mui/material";
import { uiTokens } from "../../design/tokens";

type AppCardVariant = "default" | "brand" | "warning" | "muted";

interface AppCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: AppCardVariant;
  sx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
}

function getVariantSx(variant: AppCardVariant): SxProps<Theme> {
  switch (variant) {
    case "brand":
      return {
        bgcolor: uiTokens.surfaces.brandSoft,
        border: uiTokens.borders.brand
      };
    case "warning":
      return {
        bgcolor: uiTokens.surfaces.warningSoft,
        border: uiTokens.borders.warning
      };
    case "muted":
      return {
        bgcolor: uiTokens.surfaces.cardMuted,
        border: uiTokens.borders.subtle
      };
    default:
      return {
        bgcolor: uiTokens.surfaces.card,
        border: uiTokens.borders.subtle
      };
  }
}

export default function AppCard({
  children,
  onClick,
  variant = "default",
  sx,
  contentSx
}: AppCardProps): React.JSX.Element {
  const interactive = Boolean(onClick);

  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={[
        {
          borderRadius: 0,
          overflow: "hidden",
          transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
          ...(interactive && {
            cursor: "pointer",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: uiTokens.elevation.card
            }
          })
        },
        getVariantSx(variant),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <CardContent
        sx={[
          { px: 2, py: 1.75 },
          ...(Array.isArray(contentSx) ? contentSx : contentSx ? [contentSx] : [])
        ]}
      >
        {children}
      </CardContent>
    </Card>
  );
}

