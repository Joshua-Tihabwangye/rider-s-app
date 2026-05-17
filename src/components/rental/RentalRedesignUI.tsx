import React from "react";
import { Box, Button, SxProps, Theme, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

export const rentalUi = {
  pageBg: "#F7F9FB",
  cardBg: "#FFFFFF",
  border: "#E3E8EF",
  title: "#0E1320",
  muted: "#6B7486",
  green: "#11B86A",
  greenDeep: "#0F9B5D",
  greenSoft: "#E8F8F0",
  orange: "#FF8A00",
  orangeSoft: "#FFF2E6",
  gradient: "linear-gradient(93deg, #08B86B 0%, #78B833 53%, #FF8A00 100%)"
} as const;

export const screenShellSx: SxProps<Theme> = {
  minHeight: "100vh",
  bgcolor: rentalUi.pageBg,
  px: { xs: 2, sm: 2.5 },
  pt: { xs: 2, sm: 2.5 },
  pb: { xs: 3.5, sm: 4 },
  color: rentalUi.title,
  // Keep rental workflow text compact and fully visible on narrow/mobile widths.
  "& .MuiTypography-root": {
    fontSize: "12.2px !important",
    lineHeight: 1.35
  },
  "& .MuiInputBase-input": {
    fontSize: "12.6px !important"
  },
  "& .MuiInputBase-input::placeholder": {
    fontSize: "12.6px !important",
    opacity: 1
  },
  "& .MuiFormHelperText-root": {
    fontSize: "11px !important"
  },
  "& .MuiChip-label": {
    fontSize: "12.2px !important"
  },
  "& .MuiButton-root": {
    fontSize: "14px !important"
  },
  "& .MuiMenuItem-root": {
    fontSize: "12.4px !important"
  }
};

export const cardSx: SxProps<Theme> = {
  bgcolor: rentalUi.cardBg,
  border: `1px solid ${rentalUi.border}`,
  borderRadius: 3,
  boxShadow: "0 1px 0 rgba(12, 18, 28, 0.02)"
};

export function CroppedReferenceImage({
  src,
  alt,
  height,
  position = "center",
  scale = 1.12,
  fit = "cover",
  sx
}: {
  src: string;
  alt: string;
  height: number | string;
  position?: string;
  scale?: number;
  fit?: "cover" | "contain";
  sx?: SxProps<Theme>;
}): React.JSX.Element {
  return (
    <Box
      sx={[
        {
          position: "relative",
          overflow: "hidden",
          borderRadius: 3,
          bgcolor: "#fff"
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          width: "100%",
          height,
          objectFit: fit,
          objectPosition: position,
          transform: `scale(${scale})`,
          transformOrigin: "center",
          display: "block"
        }}
      />
    </Box>
  );
}

export function GradientActionButton({
  label,
  onClick,
  disabled,
  fullWidth = true,
  sx
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
}): React.JSX.Element {
  return (
    <Button
      fullWidth={fullWidth}
      variant="contained"
      disabled={disabled}
      onClick={onClick}
      endIcon={
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.9)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
        </Box>
      }
      sx={[
        {
          py: 1.25,
          borderRadius: 99,
          textTransform: "none",
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          color: "#FFFFFF",
          bgcolor: disabled ? "#B7C2D2" : rentalUi.gradient,
          boxShadow: "none",
          "&:hover": {
            bgcolor: disabled ? "#B7C2D2" : rentalUi.gradient,
            boxShadow: "none"
          },
          "& .MuiButton-endIcon": {
            marginLeft: 2.25
          }
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      {label}
    </Button>
  );
}

export function SectionTitle({
  title,
  action,
  onAction
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}): React.JSX.Element {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.25 }}>
      <Typography sx={{ fontSize: 24, fontWeight: 700, color: rentalUi.title, letterSpacing: "-0.02em" }}>
        {title}
      </Typography>
      {action ? (
        <Typography
          component="button"
          onClick={onAction}
          sx={{
            border: 0,
            p: 0,
            bgcolor: "transparent",
            color: rentalUi.green,
            fontSize: 18,
            fontWeight: 600,
            cursor: onAction ? "pointer" : "default"
          }}
        >
          {action}
        </Typography>
      ) : null}
    </Box>
  );
}

export function formatInr(amount: number): string {
  return `₹ ${Math.round(amount).toLocaleString("en-IN")}`;
}
