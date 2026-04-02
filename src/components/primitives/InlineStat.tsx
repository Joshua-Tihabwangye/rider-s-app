import React from "react";
import { Box, Typography } from "@mui/material";
import { uiTokens } from "../../design/tokens";

interface InlineStatProps {
  label: string;
  value: string;
  align?: "left" | "right";
}

export default function InlineStat({
  label,
  value,
  align = "left"
}: InlineStatProps): React.JSX.Element {
  return (
    <Box sx={{ textAlign: align }}>
      <Typography
        variant="caption"
        sx={{ ...uiTokens.text.statLabel, color: (t) => t.palette.text.secondary }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 700, mt: 0.25 }}>
        {value}
      </Typography>
    </Box>
  );
}

