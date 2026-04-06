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
          borderRadius: uiTokens.radius.xl,
          overflow: "hidden",
          boxShadow: uiTokens.elevation.card,
          transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
          textAlign: "left",
          ...(interactive && {
            cursor: "pointer",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: uiTokens.elevation.raised
            },
            "&:active": {
              transform: "translateY(0)"
            }
          })
        },
        getVariantSx(variant),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <CardContent
        sx={[
          {
            px: { xs: uiTokens.spacing.md, md: uiTokens.spacing.lg },
            py: { xs: uiTokens.spacing.md, md: uiTokens.spacing.mdPlus },
            display: "flex",
            flexDirection: "column",
            gap: uiTokens.spacing.sm
          },
          ...(Array.isArray(contentSx) ? contentSx : contentSx ? [contentSx] : [])
        ]}
      >
        {children}
      </CardContent>
    </Card>
  );
}
