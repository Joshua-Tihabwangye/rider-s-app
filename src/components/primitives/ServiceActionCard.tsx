import React from "react";
import { Box, Typography } from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import AppCard from "./AppCard";
import { uiTokens } from "../../design/tokens";

interface ServiceActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  danger?: boolean;
}

export default function ServiceActionCard({
  icon,
  title,
  description,
  onClick,
  danger = false
}: ServiceActionCardProps): React.JSX.Element {
  const iconColor = danger ? uiTokens.colors.danger : uiTokens.colors.brand;

  return (
    <AppCard onClick={onClick} contentSx={{ px: 1.75, py: 1.6, justifyContent: "space-between", minHeight: 132 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.1 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "var(--evz-radius-md)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: iconColor,
            bgcolor: danger ? uiTokens.surfaces.dangerTintSoft : uiTokens.surfaces.brandTintSoft
          }}
        >
          {icon}
        </Box>
        <Typography variant="subtitle2" sx={{ ...uiTokens.text.itemTitle, flex: 1, lineHeight: 1.3 }}>
          {title}
        </Typography>
        <ArrowForwardIosRoundedIcon sx={{ fontSize: 12, color: (t) => t.palette.text.secondary, opacity: 0.7 }} />
      </Box>
      <Typography variant="caption" sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary, pr: 0.5 }}>
        {description}
      </Typography>
    </AppCard>
  );
}
