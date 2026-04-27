import React from "react";
import { Box, Typography } from "@mui/material";
import { uiTokens } from "../../design/tokens";

interface CustomRentalStepIndicatorProps {
  steps: string[];
  activeStep: number;
}

export default function CustomRentalStepIndicator({
  steps,
  activeStep
}: CustomRentalStepIndicatorProps): React.JSX.Element {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isComplete = index < activeStep;

        return (
          <Box
            key={step}
            sx={{
              borderRadius: uiTokens.radius.pill,
              px: 1.05,
              py: 0.55,
              border: isActive
                ? "1px solid rgba(3,205,140,0.55)"
                : isComplete
                  ? "1px solid rgba(22,163,74,0.45)"
                  : "1px solid rgba(209,213,219,0.9)",
              bgcolor: isActive
                ? "rgba(3,205,140,0.12)"
                : isComplete
                  ? "rgba(22,163,74,0.12)"
                  : "transparent"
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: 10.5,
                fontWeight: isActive ? 700 : 600,
                color: isActive
                  ? "#047857"
                  : isComplete
                    ? "#15803D"
                    : (t) => t.palette.text.secondary
              }}
            >
              {`Step ${index + 1}: ${step}`}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
