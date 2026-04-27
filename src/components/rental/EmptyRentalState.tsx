import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { uiTokens } from "../../design/tokens";

interface EmptyRentalStateProps {
  title: string;
  description: string;
  ctaLabel: string;
  onCtaClick: () => void;
}

export default function EmptyRentalState({
  title,
  description,
  ctaLabel,
  onCtaClick
}: EmptyRentalStateProps): React.JSX.Element {
  return (
    <Box
      sx={{
        borderRadius: uiTokens.radius.xl,
        border: "1px dashed rgba(148,163,184,0.6)",
        px: 1.6,
        py: 1.6
      }}
    >
      <Typography variant="body2" sx={{ fontSize: 12.5, fontWeight: 700, mb: 0.2 }}>
        {title}
      </Typography>
      <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
        {description}
      </Typography>
      <Button
        variant="outlined"
        size="small"
        onClick={onCtaClick}
        sx={{
          mt: 1,
          borderRadius: uiTokens.radius.pill,
          textTransform: "none",
          borderColor: "rgba(3,205,140,0.55)",
          color: "#047857",
          "&:hover": {
            borderColor: "rgba(3,205,140,0.95)",
            bgcolor: "rgba(3,205,140,0.08)"
          }
        }}
      >
        {ctaLabel}
      </Button>
    </Box>
  );
}
