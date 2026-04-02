import React from "react";
import { Box, Typography } from "@mui/material";
import { uiTokens } from "../../design/tokens";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  compact?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
  compact = false
}: SectionHeaderProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: compact ? "center" : "flex-start",
        justifyContent: "space-between",
        gap: 1.5
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        {eyebrow && (
          <Typography
            variant="caption"
            sx={{ ...uiTokens.text.eyebrow, color: (t) => t.palette.text.secondary }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h6" sx={{ ...uiTokens.text.sectionTitle, mt: eyebrow ? 0.25 : 0 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mt: 0.4, display: "block" }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Box>
  );
}

