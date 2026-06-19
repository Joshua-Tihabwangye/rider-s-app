import React from "react";
import { Box, Button, Stack, Typography, Divider, CircularProgress } from "@mui/material";
import type { AuthProvider } from "../../store/types";

interface SocialAuthButtonsProps {
  onProvider: (provider: AuthProvider) => void;
  loading?: boolean;
  disabledProvider?: AuthProvider | null;
}

/** EVZone brand icon (simple EV bolt mark) */
function EvzoneIcon(): React.JSX.Element {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#03cd8c" />
      <path d="M13 4L7 13h4l-1 7 6-9h-4l1-7z" fill="#fff" />
    </svg>
  );
}

/** Google icon */
function GoogleIcon(): React.JSX.Element {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

const SOCIAL_BUTTONS: { provider: AuthProvider; label: string; icon: React.JSX.Element }[] = [
  { provider: "evzone", label: "Continue with EVzone", icon: <EvzoneIcon /> },
  { provider: "google", label: "Continue with Google", icon: <GoogleIcon /> },
];

export default function SocialAuthButtons({
  onProvider,
  loading = false,
  disabledProvider = null
}: SocialAuthButtonsProps): React.JSX.Element {
  const topRowButtons = SOCIAL_BUTTONS.filter(({ provider }) => provider === "evzone" || provider === "google");
  const lowerButtons = SOCIAL_BUTTONS.filter(({ provider }) => provider !== "evzone" && provider !== "google");

  const renderButton = (
    provider: AuthProvider,
    label: string,
    icon: React.JSX.Element,
    compact = false
  ): React.JSX.Element => {
    const isLoading = loading && disabledProvider === provider;

    return (
      <Button
        key={provider}
        fullWidth
        variant="outlined"
        disabled={loading}
        onClick={() => onProvider(provider)}
        startIcon={isLoading ? <CircularProgress size={16} /> : icon}
        sx={{
          py: compact ? { xs: 0.6, sm: 0.68 } : { xs: 0.68, sm: 0.78 },
          minHeight: compact ? 38 : 40,
          fontSize: compact ? { xs: 11.25, sm: 11.75 } : { xs: 12.5, sm: 13 },
          fontWeight: 500,
          lineHeight: 1.15,
          whiteSpace: "normal",
          textTransform: "none",
          borderRadius: compact ? "14px" : "15px",
          justifyContent: compact ? "center" : "flex-start",
          pl: compact ? 1.1 : 1.45,
          pr: compact ? 1.1 : 1.25,
          borderColor: "rgba(229,231,235,0.96)",
          bgcolor: "rgba(255,255,255,0.96)",
          boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
          color: "#111827",
          "&:hover": {
            borderColor: "rgba(209,213,219,1)",
            bgcolor: "#fff"
          },
          "& .MuiButton-startIcon": {
            mr: compact ? 0.65 : 1.05
          }
        }}
      >
        {label}
      </Button>
    );
  };

  return (
    <Stack spacing={{ xs: 0.72, sm: 0.9 }}>
      <Divider sx={{ my: { xs: 0.05, sm: 0.2 }, "&::before, &::after": { borderColor: "rgba(209,213,219,0.78)" } }}>
        <Typography
          variant="caption"
          sx={{ color: "#6b7280", fontSize: 10.5, px: 0.9, lineHeight: 1 }}
        >
          or
        </Typography>
      </Divider>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 0.75,
        }}
      >
        {topRowButtons.map(({ provider, label, icon }) => renderButton(provider, label, icon, true))}
      </Box>

      {lowerButtons.map(({ provider, label, icon }) => renderButton(provider, label, icon))}
    </Stack>
  );
}
