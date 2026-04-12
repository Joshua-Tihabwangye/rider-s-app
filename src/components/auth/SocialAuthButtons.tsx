import React from "react";
import { Button, Stack, Typography, Divider, CircularProgress } from "@mui/material";
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

/** Apple icon */
function AppleIcon(): React.JSX.Element {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C4.24 16.74 4.88 10.5 8.7 10.26c1.26.08 2.13.72 2.91.78.99-.2 1.95-.76 3.01-.69 1.29.1 2.25.6 2.87 1.56-2.66 1.6-2.02 5.12.44 6.1-.52 1.37-1.2 2.72-1.88 4.27zM12.75 10.13c-.14-2.32 1.76-4.3 3.94-4.5.3 2.55-2.3 4.65-3.94 4.5z" />
    </svg>
  );
}

const SOCIAL_BUTTONS: { provider: AuthProvider; label: string; icon: React.JSX.Element }[] = [
  { provider: "evzone", label: "Continue with EVzone", icon: <EvzoneIcon /> },
  { provider: "google", label: "Continue with Google", icon: <GoogleIcon /> },
  { provider: "apple", label: "Continue with Apple", icon: <AppleIcon /> }
];

export default function SocialAuthButtons({
  onProvider,
  loading = false,
  disabledProvider = null
}: SocialAuthButtonsProps): React.JSX.Element {
  return (
    <Stack spacing={{ xs: 1.1, sm: 1.5 }}>
      <Divider sx={{ my: { xs: 0.25, sm: 0.5 } }}>
        <Typography
          variant="caption"
          sx={{ color: (t) => t.palette.text.secondary, fontSize: 11, px: 1, lineHeight: 1 }}
        >
          or
        </Typography>
      </Divider>

      {SOCIAL_BUTTONS.map(({ provider, label, icon }) => {
        const isLoading = loading && disabledProvider === provider;
        return (
          <Button
            key={provider}
            fullWidth
            variant="outlined"
            disabled={loading}
            onClick={() => onProvider(provider)}
            startIcon={isLoading ? <CircularProgress size={18} /> : icon}
            sx={{
              py: { xs: 1, sm: 1.15 },
              minHeight: 44,
              fontSize: { xs: 12.5, sm: 13 },
              fontWeight: 600,
              lineHeight: 1.2,
              whiteSpace: "normal",
              textTransform: "none",
              borderRadius: "var(--evz-radius-md)",
              borderColor: (t) =>
                t.palette.mode === "light"
                  ? "rgba(209,213,219,0.9)"
                  : "rgba(51,65,85,0.9)",
              color: (t) => t.palette.text.primary,
              "&:hover": {
                borderColor: (t) =>
                  t.palette.mode === "light"
                    ? "rgba(156,163,175,1)"
                    : "rgba(100,116,139,1)",
                bgcolor: (t) =>
                  t.palette.mode === "light"
                    ? "rgba(0,0,0,0.02)"
                    : "rgba(255,255,255,0.03)"
              }
            }}
          >
            {label}
          </Button>
        );
      })}
    </Stack>
  );
}
