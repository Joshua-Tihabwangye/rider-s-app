import React, { useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useNavigate, useParams } from "react-router-dom";
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
import { useAppData } from "../contexts/AppDataContext";


function TourDetailsScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { tourId } = useParams();
  const { tours, actions } = useAppData();
  const selectTour = actions.selectTour;
  const selectedTour = tours.tours.find((tour) => tour.id === tourId) ?? tours.tours[0];

  useEffect(() => {
    if (tourId) {
      selectTour(tourId);
    }
  }, [tourId, selectTour]);

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
              borderRadius: 5,
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
              {selectedTour?.title ?? "EV Tour"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {selectedTour ? `${selectedTour.location} • ${selectedTour.duration}` : "Tour details"}
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
                borderRadius: 5,
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
                borderRadius: 5,
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
                borderRadius: 5,
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
            UGX 250,000 <Typography component="span" variant="caption" sx={{ fontSize: 11 }}>/ person</Typography>
          </Typography>
          <Typography
            variant="caption"
            sx={{ mt: 0.3, fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            Includes EV transport to Jinja, guide and bottled water.
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
            Explore Jinja, the adventure capital of East Africa and the true source of the Nile River, with quiet, zero‑emission EV transport. Stops typically include Sezibwa Falls, Mabira Forest, and the Source of the Nile.
          </Typography>

          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.6, display: "block" }}
          >
            Sample itinerary
          </Typography>
          <Stack spacing={0.4}>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              • 08:00 – Pickup from central Kampala hotel or meeting point
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              • 09:30 – Stop at Sezibwa Falls for a short nature walk
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              • 11:30 – Drive through Mabira Forest
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              • 13:00 – Arrive in Jinja & visit the Source of the Nile
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              • 15:30 – Depart Jinja for Kampala
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              • 19:00 – Drop‑off at original pickup point
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
                Duration: ~10–11 hours
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="contained"
        onClick={() => {
          if (selectedTour) {
            actions.selectTour(selectedTour.id);
            navigate(`/tours/${selectedTour.id}/dates`);
          }
        }}
        sx={{
          borderRadius: 5,
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

          <TourDetailsScreen />
        
      </Box>
    
  );
}
