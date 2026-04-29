import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Divider
} from "@mui/material";

import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";

import TourRoundedIcon from "@mui/icons-material/TourRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";


function ToursDashboardHomeScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { tours, actions } = useAppData();
  const featuredTour = tours.tours[0];
  const upcomingTours = tours.tours.slice(0, 3);

  const handleBookFeatured = () => {
    if (featuredTour) {
      actions.selectTour(featuredTour.id);
      navigate(`/tours/${featuredTour.id}/dates`);
    }
  };

  const handleViewDetails = () => {
    if (featuredTour) {
      actions.selectTour(featuredTour.id);
      navigate(`/tours/${featuredTour.id}`);
    }
  };

  const handleCreateCustom = () => {
    navigate("/tours/new");
  };

  const handleBrowseAllTours = () => {
    navigate("/tours/available");
  };

  return (
    <ScreenScaffold>
      <SectionHeader
        title="Tours & charters"
        subtitle="Browse EV tours, day trips & weekend getaways"
        leadingAction={
          <Stack direction="row" spacing={uiTokens.spacing.sm} alignItems="center">
            <IconButton
              size="small"
              aria-label="Back"
              onClick={() => navigate(-1)}
              sx={{
                borderRadius: uiTokens.radius.xl,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(134,239,172,0.2)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)"
              }}
            >
              <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18, color: "#FB923C" }} />
            </IconButton>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: uiTokens.radius.xl,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#DCFCE7" : "rgba(134,239,172,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <TourRoundedIcon sx={{ fontSize: 22, color: "#22C55E" }} />
            </Box>
          </Stack>
        }
      />

      <Button
        fullWidth
        variant="contained"
        onClick={handleBrowseAllTours}
        endIcon={<ArrowForwardIosRoundedIcon sx={{ fontSize: 14 }} />}
        sx={{
          borderRadius: uiTokens.radius.xl,
          py: 1.2,
          justifyContent: "space-between",
          textTransform: "none",
          fontSize: 14,
          fontWeight: 700,
          bgcolor: "#22C55E",
          color: "#FFFFFF",
          boxShadow: "0 14px 28px rgba(21,128,61,0.22)",
          "&:hover": { bgcolor: "#22C55E" }
        }}
      >
        Browse all tours
      </Button>

      <Box
        sx={{
          display: "grid",
          gap: 1.5,
          gridTemplateColumns: { xs: "1fr", md: "1.35fr 1fr" }
        }}
      >
        <Card
          elevation={0}
          sx={{
            borderRadius: uiTokens.radius.xl,
            bgcolor: (t) =>
              t.palette.mode === "light"
                ? "linear-gradient(145deg, #E0F2FE 0%, #EEF2FF 55%, #FFFFFF 100%)"
                : "linear-gradient(160deg, #22C55E 0%, #22C55E 55%, #22C55E 100%)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(125,211,252,0.8)"
                : "1px solid rgba(56,189,248,0.6)"
          }}
        >
          <CardContent sx={{ px: { xs: 1.5, sm: 1.9 }, py: { xs: 1.5, sm: 1.9 } }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: (t) => t.palette.text.secondary,
                mb: 0.8,
                display: "block"
              }}
            >
              Featured this weekend
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, letterSpacing: "-0.02em", mb: 0.5, fontSize: { xs: 22, sm: 24 } }}
            >
              {featuredTour?.title ?? "EV Day Trip"}
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.75 }}>
              <PlaceRoundedIcon sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }} />
              <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                {featuredTour ? `${featuredTour.location} • ${featuredTour.duration} • EV transport included` : "Tour details"}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1.25 }}>
              <CalendarMonthRoundedIcon sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }} />
              <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                {featuredTour ? `${featuredTour.scheduleLabel} • ${featuredTour.seatsLeft} spots left` : "Schedule"}
              </Typography>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.1}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleBookFeatured}
                sx={{
                  borderRadius: uiTokens.radius.xl,
                  py: 0.95,
                  fontSize: 13,
                  fontWeight: 600,
                  textTransform: "none",
                  bgcolor: "#22C55E",
                  color: "#FFFFFF",
                  "&:hover": { bgcolor: "#22C55E" }
                }}
              >
                Book this tour
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleViewDetails}
                sx={{
                  borderRadius: uiTokens.radius.xl,
                  py: 0.95,
                  fontSize: 13,
                  textTransform: "none"
                }}
              >
                View details
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{
            borderRadius: uiTokens.radius.xl,
            bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(134,239,172,0.16)"),
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(203,213,225,0.9)"
                : "1px solid rgba(51,65,85,0.9)"
          }}
        >
          <CardContent sx={{ px: { xs: 1.5, sm: 1.75 }, py: { xs: 1.5, sm: 1.75 } }}>
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Plan your own trip
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.4, mb: 1.2, fontWeight: 600 }}>
              Custom tour or private charter
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary, mb: 1.2, display: "block" }}
            >
              Build a tailored EV-powered itinerary for your dates, route and group size.
            </Typography>
            <Stack spacing={1}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleCreateCustom}
                sx={{ borderRadius: uiTokens.radius.xl, py: 0.85, fontSize: 13, textTransform: "none" }}
              >
                Build custom tour
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/tours/new", { state: { mode: "quote" } })}
                sx={{
                  borderRadius: uiTokens.radius.xl,
                  py: 0.85,
                  fontSize: 13,
                  textTransform: "none",
                  borderStyle: "dotted"
                }}
              >
                Request quote
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Upcoming tours list */}
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(134,239,172,0.16)",
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
              variant="subtitle2"
              sx={{ fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em" }}
            >
              Your upcoming tours
            </Typography>
            <Button
              onClick={() => navigate("/tours/history")}
              sx={{
                minWidth: "auto",
                px: 0,
                py: 0,
                fontSize: 11,
                textTransform: "none",
                color: (t) => t.palette.text.secondary
              }}
            >
              View all
            </Button>
          </Stack>
          <Divider sx={{ mb: 1, borderColor: (t) => t.palette.divider }} />

          {upcomingTours.map((tour) => (
            <Box
              key={tour.id}
              onClick={() => {
                actions.selectTour(tour.id);
                navigate(`/tours/${tour.id}`);
              }}
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
                  {tour.title}
                </Typography>
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <CalendarMonthRoundedIcon
                    sx={{ fontSize: 15, color: (t) => t.palette.text.secondary }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
                  >
                    {tour.scheduleLabel}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <PeopleAltRoundedIcon
                    sx={{ fontSize: 15, color: (t) => t.palette.text.secondary }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
                  >
                    {tours.booking.guests} guests
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
        Use the tours dashboard to quickly find and manage EV-powered experiences,
        from same-day outings to multi-day safaris, all linked to your EVzone
        account and payment methods.
      </Typography>
    </ScreenScaffold>
  );
}

export default function ToursDashboard(): React.JSX.Element {
  return (
    <>

        <ToursDashboardHomeScreen />
      
    </>
  );
}
