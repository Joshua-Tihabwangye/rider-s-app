import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../components/DarkModeToggle";
import { Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button, IconButton } from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import TourRoundedIcon from "@mui/icons-material/TourRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";

import MobileShell from "../components/MobileShell";

function TourBookingConfirmationScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const bookingId = "TOUR-BOOK-2025-10-12-001";

  return (
    <>
    {/* Green Header */}
        <Box sx={{ bgcolor: "#03CD8C", px: 2, pt: 2, pb: 2, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              position: "absolute",
              left: 20,
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
            Tour booked
          </Typography>
        </Box>
        </>


  );
}

export default function RiderScreen81TourBookingConfirmationCanvas_v2() {
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
        <TourBookingConfirmationScreen />
      </MobileShell>
    </Box>
  );
}
