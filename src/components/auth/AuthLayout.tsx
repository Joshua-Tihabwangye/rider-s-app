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
        position: "relative",
        minHeight: "100dvh",
        height: "100dvh",
        overflowY: "auto",
        overflowX: "hidden",
        bgcolor: (t) => t.palette.background.default,
        px: { xs: 1.5, sm: 3.5 },
        py: {
          xs: "max(env(safe-area-inset-top), 12px)",
          sm: 4
        },
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 16% 6%, rgba(3,205,140,0.16) 0%, rgba(3,205,140,0.04) 26%, transparent 64%)"
        }
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 440,
          mx: "auto",
          pb: "max(env(safe-area-inset-bottom), 14px)",
          pt: { xs: 1, sm: 2 }
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "var(--evz-radius-lg)",
              bgcolor: uiTokens.colors.brand,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <ElectricCarRoundedIcon sx={{ fontSize: 24, color: "#fff" }} />
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

        <Box
          sx={{
            borderRadius: "var(--evz-radius-xl)",
            bgcolor: "var(--evz-surface-card)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            boxShadow: uiTokens.elevation.card,
            px: { xs: 2, sm: 3.5 },
            py: { xs: 2.25, sm: 3.5 }
          }}
        >
          <Box sx={{ mb: { xs: 2.25, sm: 3 } }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: (t) => t.palette.text.primary,
                mb: 0.5,
                fontSize: { xs: 20, sm: 22 }
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: (t) => t.palette.text.secondary,
                  fontSize: { xs: 12.5, sm: 13 },
                  lineHeight: 1.45
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {children}
        </Box>

        <Typography
          variant="caption"
          sx={{
            mt: { xs: 2, sm: 3 },
            color: (t) => t.palette.text.secondary,
            fontSize: 11,
            textAlign: "center",
            display: "block"
          }}
        >
          © {new Date().getFullYear()} EVzone. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
