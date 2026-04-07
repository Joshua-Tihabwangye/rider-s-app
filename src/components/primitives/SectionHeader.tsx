import React from "react";
import { Box, Typography } from "@mui/material";
import { uiTokens } from "../../design/tokens";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  leadingAction?: React.ReactNode;
  action?: React.ReactNode;
  compact?: boolean;
  centered?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  leadingAction,
  action,
  compact = false,
  centered = false
}: SectionHeaderProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: centered ? "column" : "row",
        alignItems: centered ? "center" : (compact ? "center" : "flex-start"),
        justifyContent: centered ? "center" : "space-between",
        gap: centered ? uiTokens.spacing.sm : uiTokens.spacing.md,
        textAlign: centered ? "center" : "left"
      }}
    >
      {leadingAction && !centered && <Box sx={{ flexShrink: 0, mr: uiTokens.spacing.xxs, mt: compact ? 0 : uiTokens.spacing.xxs }}>{leadingAction}</Box>}
      <Box sx={{ minWidth: 0, flex: centered ? "none" : 1 }}>
        {eyebrow && (
          <Typography
            variant="caption"
            sx={{
              ...uiTokens.text.eyebrow,
              color: (t) => t.palette.text.secondary,
              display: "block",
              mb: compact ? uiTokens.spacing.xxs / 5 : uiTokens.spacing.xs / 3
            }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography
          variant="h6"
          sx={{
            ...uiTokens.text.sectionTitle,
            mt: eyebrow ? uiTokens.spacing.xxs / 10 : 0,
            lineHeight: compact ? 1.25 : 1.3
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              ...uiTokens.text.itemBody,
              fontSize: 11.5,
              color: (t) => t.palette.text.secondary,
              mt: uiTokens.spacing.xs / 2,
              display: "block"
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ flexShrink: 0, alignSelf: compact ? "center" : "flex-start" }}>{action}</Box>}
    </Box>
  );
}
