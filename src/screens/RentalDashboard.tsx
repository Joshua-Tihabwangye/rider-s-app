import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Divider
} from "@mui/material";

import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import ActionGrid from "../components/primitives/ActionGrid";
import { uiTokens } from "../design/tokens";

import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";


function RentalDashboardHomeScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [modeSelection, setModeSelection] = useState("self");

  const handleBrowseRentals = () => {
    navigate("/rental/list");
  };

  const handleBookSelfDrive = () => {
    setModeSelection("self");
    navigate("/rental/list");
  };

  const handleBookChauffeur = () => {
    setModeSelection("chauffeur");
    navigate("/rental/list");
  };

  const handleViewRentalHistory = () => {
    navigate("/rental/history");
  };

  return (
    <ScreenScaffold>
      <SectionHeader
        title="EV rentals"
        subtitle="Self-drive and chauffeur EV rentals for your trips"
        leadingAction={
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: uiTokens.radius.xl,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#DCFCE7" : "rgba(15,23,42,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <ElectricCarRoundedIcon sx={{ fontSize: 22, color: "#059669" }} />
          </Box>
        }
      />

      {/* Upcoming rental summary */}
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
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
        <CardContent sx={{ px: { xs: 1.5, sm: 1.9 }, py: { xs: 1.5, sm: 1.9 } }}>
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

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate("/rental/history/1")}
              sx={{
                borderRadius: uiTokens.radius.xl,
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
              onClick={() => navigate("/rental/dates")}
              sx={{
                borderRadius: uiTokens.radius.xl,
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
        </CardContent>
      </Card>

      {/* Rental modes & quick actions */}
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: { xs: 1.5, sm: 1.75 }, py: { xs: 1.5, sm: 1.7 } }}>
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

          <ActionGrid minWidth={160} sx={{ mb: 1.5 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: uiTokens.radius.xl,
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
                borderRadius: uiTokens.radius.xl,
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
          </ActionGrid>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleBrowseRentals}
              sx={{
                borderRadius: uiTokens.radius.xl,
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
              onClick={() => navigate("/rental/list", { state: { mode: "custom" } })}
              sx={{
                borderRadius: uiTokens.radius.xl,
                py: 0.85,
                fontSize: 13,
                textTransform: "none"
              }}
            >
              Custom rental request
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Upcoming rentals list */}
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: { xs: 1.5, sm: 1.75 }, py: { xs: 1.5, sm: 1.7 } }}>
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
              onClick={() => navigate("/rental/history/1")}
              sx={{
                cursor: "pointer",
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
        sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary, mt: 1, display: "block" }}
      >
        The rental dashboard gives you a quick overview of active and upcoming EV
        rentals, and lets you jump into self-drive or chauffeur booking flows in
        a few taps.
      </Typography>
    </ScreenScaffold>
  );
}

export default function RentalDashboard(): React.JSX.Element {
  return (
    <>

        <RentalDashboardHomeScreen />
      
    </>
  );
}
