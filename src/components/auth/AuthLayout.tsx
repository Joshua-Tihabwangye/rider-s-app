import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import { uiTokens } from "../../design/tokens";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: (t) => t.palette.background.default,
        px: { xs: 2.5, sm: 4 },
        py: { xs: 4, sm: 6 }
      }}
    >
      {/* Logo / Brand */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 4 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "var(--evz-radius-lg)",
            bgcolor: uiTokens.colors.brand,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ElectricCarRoundedIcon sx={{ fontSize: 26, color: "#fff" }} />
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: (t) => t.palette.text.primary
          }}
        >
          EVzone
        </Typography>
      </Stack>

      {/* Auth card */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: "var(--evz-radius-xl)",
          bgcolor: "var(--evz-surface-card)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)",
          boxShadow: uiTokens.elevation.card,
          px: { xs: 2.5, sm: 3.5 },
          py: { xs: 3, sm: 4 }
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: (t) => t.palette.text.primary,
              mb: 0.5
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: (t) => t.palette.text.secondary,
                fontSize: 13
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {children}
      </Box>

      {/* Footer */}
      <Typography
        variant="caption"
        sx={{
          mt: 4,
          color: (t) => t.palette.text.secondary,
          fontSize: 11,
          textAlign: "center"
        }}
      >
        © {new Date().getFullYear()} EVzone. All rights reserved.
      </Typography>
    </Box>
  );
}
