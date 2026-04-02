import React from "react";
import { Box, Typography } from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import AppCard from "./AppCard";
import { uiTokens } from "../../design/tokens";

interface RowActionItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  onClick: () => void;
}

export default function RowActionItem({
  icon,
  title,
  description,
  onClick
}: RowActionItemProps): React.JSX.Element {
  return (
    <AppCard onClick={onClick} contentSx={{ px: 1.5, py: 1.4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
        <Box sx={{ minWidth: 36, display: "inline-flex", justifyContent: "center", color: uiTokens.colors.brand }}>
          {icon}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={uiTokens.text.itemTitle}>
            {title}
          </Typography>
          {description && (
            <Typography
              variant="caption"
              sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary, mt: 0.25, display: "block" }}
            >
              {description}
            </Typography>
          )}
        </Box>
        <ArrowForwardIosRoundedIcon sx={{ fontSize: 14, color: (t) => t.palette.text.secondary, opacity: 0.55 }} />
      </Box>
    </AppCard>
  );
}

