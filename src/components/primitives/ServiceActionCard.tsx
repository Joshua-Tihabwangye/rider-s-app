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
  return (
    <AppCard onClick={onClick} contentSx={{ px: 1.5, py: 1.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
        <Box sx={{ display: "inline-flex", alignItems: "center", color: danger ? uiTokens.colors.danger : uiTokens.colors.brand }}>
          {icon}
        </Box>
        <Typography variant="subtitle2" sx={{ ...uiTokens.text.itemTitle, flex: 1 }}>
          {title}
        </Typography>
        <ArrowForwardIosRoundedIcon sx={{ fontSize: 12, color: (t) => t.palette.text.secondary, opacity: 0.6 }} />
      </Box>
      <Typography variant="caption" sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary }}>
        {description}
      </Typography>
    </AppCard>
  );
}

