import React from "react";
import { Box, SxProps, Theme } from "@mui/material";
import { uiTokens } from "../design/tokens";

interface ScreenScaffoldProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  disableTopPadding?: boolean;
  disableBottomPadding?: boolean;
  contentSx?: SxProps<Theme>;
}

export default function ScreenScaffold({
  header,
  children,
  disableTopPadding = false,
  disableBottomPadding = false,
  contentSx
}: ScreenScaffoldProps): React.JSX.Element {
  const defaultPxXs = `${uiTokens.spacing.xl * 8}px`;
  const defaultPxMd = `${uiTokens.spacing.xxl * 8}px`;
  const defaultPtXs = `${uiTokens.spacing.xl * 8}px`;
  const defaultPtMd = `${uiTokens.spacing.xxl * 8}px`;
  const defaultPbXs = `${uiTokens.spacing.xxl * 8}px`;
  const defaultPbMd = `${uiTokens.spacing.xxl * 8 + 4}px`;
  const defaultGap = `${uiTokens.spacing.lg * 8}px`;

  return (
    <Box
      sx={[
        {
          px: {
            xs: `var(--rider-shell-content-px-xs, ${defaultPxXs})`,
            md: `var(--rider-shell-content-px-md, ${defaultPxMd})`
          },
          pt: disableTopPadding
            ? 0
            : {
                xs: `var(--rider-scaffold-pt-xs, ${defaultPtXs})`,
                md: `var(--rider-scaffold-pt-md, ${defaultPtMd})`
              },
          pb: disableBottomPadding
            ? 0
            : {
                xs: `var(--rider-scaffold-pb-xs, ${defaultPbXs})`,
                md: `var(--rider-scaffold-pb-md, ${defaultPbMd})`
              },
          display: "flex",
          flexDirection: "column",
          gap: `var(--rider-shell-section-gap, ${defaultGap})`
        },
        ...(Array.isArray(contentSx) ? contentSx : contentSx ? [contentSx] : [])
      ]}
    >
      {header}
      {children}
    </Box>
  );
}
