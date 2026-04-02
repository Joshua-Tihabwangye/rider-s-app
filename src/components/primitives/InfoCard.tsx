import React from "react";
import { Box, Typography } from "@mui/material";
import AppCard from "./AppCard";
import { uiTokens } from "../../design/tokens";

interface InfoCardProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  variant?: "default" | "brand" | "warning" | "muted";
}

export default function InfoCard({
  title,
  description,
  action,
  children,
  variant = "default"
}: InfoCardProps): React.JSX.Element {
  return (
    <AppCard variant={variant}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {(title || action) && (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
            {title && (
              <Typography variant="subtitle2" sx={uiTokens.text.itemTitle}>
                {title}
              </Typography>
            )}
            {action && <Box>{action}</Box>}
          </Box>
        )}
        {description && (
          <Typography variant="caption" sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary }}>
            {description}
          </Typography>
        )}
        {children}
      </Box>
    </AppCard>
  );
}

