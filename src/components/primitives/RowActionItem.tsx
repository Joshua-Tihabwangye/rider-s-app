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
    <AppCard
      onClick={onClick}
      contentSx={{
        px: 1.75,
        py: 1.45,
        gap: 0
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.4 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "var(--evz-radius-md)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: uiTokens.colors.brand,
            bgcolor: uiTokens.surfaces.brandTintSoft
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ ...uiTokens.text.itemTitle, lineHeight: 1.28 }}>
            {title}
          </Typography>
          {description && (
            <Typography
              variant="caption"
              sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary, mt: 0.35, display: "block" }}
            >
              {description}
            </Typography>
          )}
        </Box>
        <ArrowForwardIosRoundedIcon sx={{ fontSize: 14, color: (t) => t.palette.text.secondary, opacity: 0.7 }} />
      </Box>
    </AppCard>
  );
}
