import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../components/DarkModeToggle";
import { Box,
  Typography,
  Card,
  CardContent,
  Stack, IconButton } from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import MobileShell from "../components/MobileShell";

function PickUpConfirmedOrderDetailsScreen(): React.JSX.Element {
  const navigate = useNavigate();

  const trackingId = "DLV-2025-10-07-001";
  const pickedAt = "Today • 15:20";

  return (
    <>
    {/* Green Header */}
        <Box sx={{ bgcolor: "#03CD8C", px: 2.5, pt: 2, pb: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "#FFFFFF",
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" }
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, letterSpacing: "-0.01em", color: "#FFFFFF" }}
          >
            Pick-up confirmed
          </Typography>
        </Box>
        </>


  );
}

export default function RiderScreen66PickUpConfirmedOrderDetailsCanvas_v2() {
      return (
    
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (t) => t.palette.background.default
        }}
      >
        

        <DarkModeToggle />

        

        <MobileShell>
          <PickUpConfirmedOrderDetailsScreen />
        </MobileShell>
      </Box>
    
  );
}
