import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import TourRoundedIcon from "@mui/icons-material/TourRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";

import MobileShell from "../components/MobileShell";

function TourDetailsScreen(): React.JSX.Element {
  const navigate = useNavigate();
  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 999,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Kampala City EV Highlights
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Kampala • Half day
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Hero card */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 3,
          bgcolor: (t) =>
            t.palette.mode === "light"
              ? "radial-gradient(circle at top,#DBEAFE,#EEF2FF)"
              : "radial-gradient(circle at top,#020617,#020617)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(191,219,254,0.9)"
              : "1px solid rgba(30,64,175,0.8)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.25 }}>
            <Box
              sx={{
                flex: 1,
                minHeight: 90,
                borderRadius: 2,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "rgba(255,255,255,0.85)" : "rgba(15,23,42,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <TourRoundedIcon
                sx={{
                  fontSize: 48,
                  color: "#1D4ED8",
                  filter: "drop-shadow(0 12px 20px rgba(15,23,42,0.6))"
                }}
              />
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mb: 0.8 }}>
            <Chip
              label="City tour"
              size="small"
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 24,
                bgcolor: "rgba(59,130,246,0.12)",
                color: "#1D4ED8"
              }}
            />
            <Chip
              label="Small groups"
              size="small"
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 24,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                color: (t) => t.palette.text.primary
              }}
            />
            <Chip
              label="EV transport included"
              size="small"
              icon={<ElectricCarRoundedIcon sx={{ fontSize: 14 }} />}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 24,
                bgcolor: "rgba(3,205,140,0.12)",
                color: "#059669"
              }}
            />
          </Stack>

          <Typography
            variant="body2"
            sx={{ fontWeight: 700, letterSpacing: "-0.02em", mt: 0.5 }}
          >
            UGX 180,000 <Typography component="span" variant="caption" sx={{ fontSize: 11 }}>/ person</Typography>
          </Typography>
          <Typography
            variant="caption"
            sx={{ mt: 0.3, fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            Includes EV city transport, guide and bottled water.
          </Typography>
        </CardContent>
      </Card>

      {/* Overview & itinerary */}
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
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.6, display: "block" }}
          >
            Overview
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1.2, display: "block" }}
          >
            Explore Kampala’s highlights with quiet, zero‑emission EV transport.
            Stops typically include Old Taxi Park, Parliament Avenue, a local
            market and sunset views near Ggaba.
          </Typography>

          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.6, display: "block" }}
          >
            Sample itinerary
          </Typography>
          <Stack spacing={0.4}>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              • 14:00 – Pickup from central Kampala hotel or meeting point
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              • 14:30 – Old Taxi Park & downtown EV drive‑through
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              • 15:30 – Local market stop
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              • 17:00 – Ggaba area for lakeside views
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              • 18:30 – Drop‑off at original pickup point
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* Meeting point & duration */}
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
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Stack spacing={0.8}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <PlaceRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Meeting point: Central Kampala (hotel pickup or agreed location)
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <AccessTimeRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Duration: ~4–5 hours
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="contained"
        sx={{
          borderRadius: 999,
          py: 1.1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: "primary.main",
          color: "#020617",
          "&:hover": { bgcolor: "#06e29a" }
        }}
      >
        Select date & guests
      </Button>
    </Box>
  );
}

export default function RiderScreen78TourDetailsCanvas_v2() {
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
          <TourDetailsScreen />
        </MobileShell>
      </Box>
    
  );
}
