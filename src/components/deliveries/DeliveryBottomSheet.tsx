import React from "react";
import { Box, Paper } from "@mui/material";
import { uiTokens } from "../../design/tokens";

interface DeliveryBottomSheetProps {
  children: React.ReactNode;
}

export default function DeliveryBottomSheet({ children }: DeliveryBottomSheetProps): React.JSX.Element {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: `${uiTokens.radius.xl * 2}px ${uiTokens.radius.xl * 2}px 0 0`,
        border: (t) =>
          t.palette.mode === "light"
            ? "1px solid rgba(203,213,225,0.9)"
            : "1px solid rgba(51,65,85,0.9)",
        bgcolor: (t) =>
          t.palette.mode === "light" ? "rgba(255,255,255,0.98)" : "rgba(15,23,42,0.98)",
        backdropFilter: "blur(10px)"
      }}
    >
      <Box
        sx={{
          mx: "auto",
          width: 44,
          height: 4,
          borderRadius: 999,
          mt: uiTokens.spacing.sm,
          mb: uiTokens.spacing.sm,
          bgcolor: (t) => (t.palette.mode === "light" ? "rgba(100,116,139,0.35)" : "rgba(148,163,184,0.35)")
        }}
      />
      <Box sx={{ px: uiTokens.spacing.mdPlus, pb: uiTokens.spacing.mdPlus }}>{children}</Box>
    </Paper>
  );
}
