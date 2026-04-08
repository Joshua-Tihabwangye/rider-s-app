import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
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


function ToursDashboardHomeScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { tours, actions } = useAppData();
  const featuredTour = tours.tours[0];
  const [activeCategory, setActiveCategory] = useState("daytrips");

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

  return (
    <ScreenScaffold>
      <SectionHeader
        title="Tours & charters"
        subtitle="Browse EV tours, day trips & weekend getaways"
        leadingAction={
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: uiTokens.radius.xl,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#DBEAFE" : "rgba(15,23,42,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TourRoundedIcon sx={{ fontSize: 22, color: "#1D4ED8" }} />
          </Box>
        }
      />

      {/* Highlight card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) =>
            t.palette.mode === "light"
              ? "radial-gradient(circle at top, #DBEAFE 0, #ECFEFF 45%, #F9FAFB 100%)"
              : "radial-gradient(circle at top, #0F172A 0, #020617 60%, #020617 100%)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(59,130,246,0.4)"
              : "1px solid rgba(56,189,248,0.6)"
        }}
      >
        <CardContent sx={{ px: { xs: 1.5, sm: 1.8 }, py: { xs: 1.5, sm: 1.8 } }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.5, display: "block" }}
          >
            Featured this weekend
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: 700, letterSpacing: "-0.02em", mb: 0.25 }}
          >
            {featuredTour?.title ?? "EV Day Trip"}
          </Typography>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.6 }}>
            <PlaceRoundedIcon
              sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
            />
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {featuredTour ? `${featuredTour.location} • ${featuredTour.duration} • EV transport included` : "Tour details"}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
            <CalendarMonthRoundedIcon
              sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
            />
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {featuredTour ? `${featuredTour.scheduleLabel} • ${featuredTour.seatsLeft} spots left` : "Schedule"}
            </Typography>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleBookFeatured}
              sx={{
                borderRadius: uiTokens.radius.xl,
                py: 0.9,
                fontSize: 13,
                fontWeight: 600,
                textTransform: "none",
                bgcolor: "#020617",
                color: "#FFFFFF",
                "&:hover": { bgcolor: "#1E293B" }
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
                py: 0.9,
                fontSize: 13,
                textTransform: "none"
              }}
            >
              View details
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Quick filters */}
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
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}
          >
            Explore by category
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {[
              { id: "city", label: "City tours" },
              { id: "daytrips", label: "Day trips" },
              { id: "safari", label: "Safaris" },
              { id: "weekend", label: "Weekend getaways" }
            ].map((cat) => (
              <Chip
                key={cat.id}
                label={cat.label}
                size="small"
                onClick={() => setActiveCategory(cat.id)}
                sx={{
                  borderRadius: 5,
                  fontSize: 11,
                  height: 26,
                  bgcolor:
                    activeCategory === cat.id
                      ? "primary.main"
                      : (t) =>
                          t.palette.mode === "light"
                            ? "#F3F4F6"
                            : "rgba(15,23,42,0.96)",
                  color:
                    activeCategory === cat.id
                      ? (t) => (t.palette.mode === "light" ? "#020617" : "#FFFFFF")
                      : (t) => t.palette.text.primary
                }}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Upcoming tours list */}
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
              Your upcoming tours
            </Typography>
            <Typography
              variant="caption"
              onClick={() => navigate("/tours/history")}
              sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary, cursor: "pointer" }}
            >
              View all
            </Typography>
          </Stack>
          <Divider sx={{ mb: 1, borderColor: (t) => t.palette.divider }} />

          {tours.tours.slice(0, 2).map((tour) => (
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

      {/* Custom tour / charter */}
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px dashed rgba(148,163,184,0.9)"
              : "1px dashed rgba(148,163,184,0.8)"
        }}
      >
        <CardContent sx={{ px: { xs: 1.5, sm: 1.75 }, py: { xs: 1.5, sm: 1.6 } }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 0.75 }}
          >
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Custom tour or charter
            </Typography>
          </Stack>

          <Typography
            variant="caption"
            sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary, mb: 0.9, display: "block" }}
          >
            Need something different? Create your own EV-powered tour or private
            charter with custom dates, routes and group size.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleCreateCustom}
              sx={{
                borderRadius: uiTokens.radius.xl,
                py: 0.85,
                fontSize: 13,
                textTransform: "none"
              }}
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
