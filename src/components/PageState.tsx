import React from "react";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { uiTokens } from "../design/tokens";

type PageStateKind = "loading" | "error" | "empty";

interface PageStateProps {
  kind: PageStateKind;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function PageState({ kind, title, message, actionLabel, onAction }: PageStateProps): React.JSX.Element {
  const color =
    kind === "error"
      ? "var(--evz-danger)"
      : kind === "empty"
        ? uiTokens.colors.inkMuted
        : uiTokens.colors.brand;

  return (
    <Box
      sx={{
        minHeight: "40dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: uiTokens.spacing.xl,
      }}
    >
      <Stack
        spacing={uiTokens.spacing.md}
        alignItems="center"
        sx={{
          width: "100%",
          maxWidth: 420,
          textAlign: "center",
          borderRadius: uiTokens.radius.xl,
          bgcolor: "background.paper",
          border: "1px solid rgba(15, 23, 42, 0.08)",
          p: uiTokens.spacing.xl,
          boxShadow: "0 20px 40px rgba(15,23,42,0.08)",
        }}
      >
        {kind === "loading" ? <CircularProgress size={32} sx={{ color }} /> : null}
        <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>{title}</Typography>
        {message ? (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {message}
          </Typography>
        ) : null}
        {actionLabel && onAction ? (
          <Button variant="contained" onClick={onAction} sx={{ borderRadius: uiTokens.radius.lg }}>
            {actionLabel}
          </Button>
        ) : null}
      </Stack>
    </Box>
  );
}
