import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Divider
} from "@mui/material";

import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";


function RentalDashboardHomeScreen(): React.JSX.Element {
  const [ctaState, setCtaState] = useState("idle");
  const [modeSelection, setModeSelection] = useState("self");

  const handleBrowseRentals = () => {
    setCtaState("browse");
  };

  const handleBookSelfDrive = () => {
    setModeSelection("self");
    setCtaState("selfdrive");
  };

  const handleBookChauffeur = () => {
    setModeSelection("chauffeur");
    setCtaState("chauffeur");
  };

  const handleViewRentalHistory = () => {
    setCtaState("history");
  };

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 999,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#DCFCE7" : "rgba(15,23,42,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <ElectricCarRoundedIcon sx={{ fontSize: 22, color: "#059669" }} />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              EV rentals
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Self-drive and chauffeur EV rentals for your trips
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Upcoming rental summary */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 3,
          bgcolor: (t) =>
            t.palette.mode === "light"
              ? "radial-gradient(circle at top, #BBF7D0, #ECFDF5)"
              : "radial-gradient(circle at top, #052E16, #020617)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(22,163,74,0.45)"
              : "1px solid rgba(22,163,74,0.8)"
        }}
      >
        <CardContent sx={{ px: 1.9, py: 1.9 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.4, display: "block" }}
          >
            Your next rental
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: 700, letterSpacing: "-0.02em", mb: 0.1, color: (t) => t.palette.text.primary }}
          >
            Nissan Leaf • Self-drive
          </Typography>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.4 }}>
            <CalendarMonthRoundedIcon sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }} />
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Thu 10 Oct → Sun 13 Oct • 3 days
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
            <PlaceRoundedIcon sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }} />
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Pickup: Nsambya EV Hub • Return: Bugolobi EV Hub
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.25}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                borderRadius: 999,
                py: 0.9,
                fontSize: 13,
                fontWeight: 600,
                textTransform: "none",
                bgcolor: "#022C22",
                color: "#ECFDF5",
                "&:hover": { bgcolor: "#064E3B" }
              }}
            >
              View rental details
            </Button>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                borderRadius: 999,
                py: 0.9,
                fontSize: 13,
                textTransform: "none",
                borderColor: (t) =>
                  t.palette.mode === "light"
                    ? "rgba(22,101,52,0.4)"
                    : "rgba(16,185,129,0.5)",
                color: (t) =>
                  t.palette.mode === "light"
                    ? "rgba(22,101,52,0.9)"
                    : "rgba(16,185,129,0.9)",
                "&:hover": {
                  borderColor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(22,101,52,0.9)"
                      : "rgba(16,185,129,0.9)",
                  bgcolor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(22,101,52,0.06)"
                      : "rgba(16,185,129,0.1)"
                }
              }}
            >
              Extend rental
            </Button>
          </Stack>

          {ctaState === "extend" && (
            <Box
              sx={{
                mt: 0.9,
                px: 1.1,
                py: 0.7,
                borderRadius: 2,
                bgcolor: (t) =>
                  t.palette.mode === "light"
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(15,23,42,0.96)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(22,163,74,0.5)"
                    : "1px solid rgba(16,185,129,0.5)"
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
              >
                Next step: open the rental extension flow with new end date and updated pricing.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Rental modes & quick actions */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.7 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Choose rental mode
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
            >
              {modeSelection === "self" ? "Self-drive" : "With chauffeur"}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.3} sx={{ mb: 1.5 }}>
            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor:
                  modeSelection === "self"
                    ? (t) =>
                        t.palette.mode === "light"
                          ? "#ECFDF5"
                          : "rgba(15,23,42,0.96)"
                    : (t) =>
                        t.palette.mode === "light"
                          ? "#F9FAFB"
                          : "rgba(15,23,42,0.96)",
                border:
                  modeSelection === "self"
                    ? "1px solid rgba(22,163,74,0.8)"
                    : (t) =>
                        t.palette.mode === "light"
                          ? "1px solid rgba(209,213,219,0.9)"
                          : "1px solid rgba(51,65,85,0.9)"
              }}
              onClick={handleBookSelfDrive}
            >
              <CardContent sx={{ px: 1.4, py: 1.3 }}>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.4 }}
                >
                  Self-drive
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  You drive the EV
                </Typography>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor:
                  modeSelection === "chauffeur"
                    ? (t) =>
                        t.palette.mode === "light"
                          ? "#FEF3C7"
                          : "rgba(15,23,42,0.96)"
                    : (t) =>
                        t.palette.mode === "light"
                          ? "#F9FAFB"
                          : "rgba(15,23,42,0.96)",
                border:
                  modeSelection === "chauffeur"
                    ? "1px solid rgba(245,158,11,0.8)"
                    : (t) =>
                        t.palette.mode === "light"
                          ? "1px solid rgba(209,213,219,0.9)"
                          : "1px solid rgba(51,65,85,0.9)"
              }}
              onClick={handleBookChauffeur}
            >
              <CardContent sx={{ px: 1.4, py: 1.3 }}>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.4 }}
                >
                  With chauffeur
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  Driver included
                </Typography>
              </CardContent>
            </Card>
          </Stack>

          <Stack direction="row" spacing={1.25}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleBrowseRentals}
              sx={{
                borderRadius: 999,
                py: 0.85,
                fontSize: 13,
                fontWeight: 600,
                textTransform: "none",
                bgcolor: "primary.main",
                color: (t) => (t.palette.mode === "light" ? "#020617" : "#FFFFFF"),
                "&:hover": { bgcolor: "#06e29a" }
              }}
            >
              Browse available EVs
            </Button>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                borderRadius: 999,
                py: 0.85,
                fontSize: 13,
                textTransform: "none"
              }}
            >
              Custom rental request
            </Button>
          </Stack>

          {ctaState !== "idle" && (
            <Box
              sx={{
                mt: 1,
                px: 1.1,
                py: 0.7,
                borderRadius: 2,
                bgcolor: (t) =>
                  t.palette.mode === "light"
                    ? "#F9FAFB"
                    : "rgba(15,23,42,0.96)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.8)"
                    : "1px solid rgba(51,65,85,0.9)"
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
              >
                {ctaState === "browse" &&
                  "Next step: open the EV rental list for the selected mode with filters for dates, price and vehicle type."}
                {ctaState === "selfdrive" &&
                  "Self-drive selected. Show EVs suitable for self-drive, with deposits, mileage limits and requirements."}
                {ctaState === "chauffeur" &&
                  "Chauffeur selected. Show EVs with driver included, pricing per day and available time slots."}
                {ctaState === "history" &&
                  "Open the rental history view with past and upcoming bookings (RA76/RA90)."}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Upcoming rentals list */}
      <Card
        elevation={0}
        sx={{
          mb: 1.5,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.7 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Upcoming rentals
            </Typography>
            <Typography
              variant="caption"
              onClick={handleViewRentalHistory}
              sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary, cursor: "pointer" }}
            >
              View all
            </Typography>
          </Stack>
          <Divider sx={{ mb: 1, borderColor: (t) => t.palette.divider }} />

          {[0, 1].map((i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 0.6,
                "&:not(:last-of-type)": {
                  borderBottom: (t) => `1px dashed ${t.palette.divider}`
                }
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontSize: 12.5, fontWeight: 500, letterSpacing: "-0.01em" }}
                >
                  {i === 0
                    ? "Nissan Leaf • Self-drive"
                    : "Hyundai Kona EV • With chauffeur"}
                </Typography>
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <CalendarMonthRoundedIcon
                    sx={{ fontSize: 15, color: (t) => t.palette.text.secondary }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
                  >
                    {i === 0
                      ? "10–13 Oct • 3 days"
                      : "20–22 Oct • 2 days"}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <PlaceRoundedIcon
                    sx={{ fontSize: 15, color: (t) => t.palette.text.secondary }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
                  >
                    Pickup: Nsambya EV Hub
                  </Typography>
                </Stack>
              </Box>
              <ArrowForwardIosRoundedIcon
                sx={{ fontSize: 14, color: (t) => t.palette.text.secondary }}
              />
            </Box>
          ))}
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
      >
        The rental dashboard gives you a quick overview of active and upcoming EV
        rentals, and lets you jump into self-drive or chauffeur booking flows in
        a few taps.
      </Typography>
    </Box>
  );
}

export default function RentalDashboard(): React.JSX.Element {
  return (
    <>

        <RentalDashboardHomeScreen />
      
    </>
  );
}
