import React from "react";
import { Card, CardContent, CardProps, SxProps, Theme } from "@mui/material";
import { uiTokens } from "../../design/tokens";

type AppCardVariant = "default" | "brand" | "warning" | "muted";

interface AppCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: AppCardVariant;
  sx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
  cardProps?: Omit<CardProps, "children" | "onClick" | "sx" | "variant">;
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

const AppCard = React.forwardRef<HTMLDivElement, AppCardProps>(function AppCard(
  {
    children,
    onClick,
    variant = "default",
    sx,
    contentSx,
    cardProps
  },
  ref
): React.JSX.Element {
  const interactive = Boolean(onClick);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (!onClick) {
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      ref={ref}
      {...cardProps}
      elevation={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      sx={[
        {
          borderRadius: uiTokens.radius.xl,
          overflow: "hidden",
          boxShadow: uiTokens.elevation.card,
          transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
          textAlign: "left",
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none"
          },
          ...(interactive && {
            cursor: "pointer",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: uiTokens.elevation.raised
            },
            "&:active": {
              transform: "translateY(0)"
            },
            "&:focus-visible": {
              outline: "none",
              boxShadow: `${uiTokens.focus.ring}, ${uiTokens.elevation.raised}`
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
});

export default AppCard;
