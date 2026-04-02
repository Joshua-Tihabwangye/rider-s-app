import React from "react";
import { Box, SxProps, Theme } from "@mui/material";
import { uiTokens } from "../design/tokens";

interface ScreenScaffoldProps {
  children: React.ReactNode;
  contentSx?: SxProps<Theme>;
}

export default function ScreenScaffold({
  children,
  contentSx
}: ScreenScaffoldProps): React.JSX.Element {
  return (
    <Box
      sx={[
        {
          px: { xs: uiTokens.spacing.xl, md: uiTokens.spacing.xxl },
          pt: { xs: uiTokens.spacing.xl, md: uiTokens.spacing.xxl },
          pb: `calc(${uiTokens.spacing.xxl * 8}px + env(safe-area-inset-bottom))`,
          display: "flex",
          flexDirection: "column",
          gap: uiTokens.spacing.lg
        },
        ...(Array.isArray(contentSx) ? contentSx : contentSx ? [contentSx] : [])
      ]}
    >
      {children}
    </Box>
  );
}
