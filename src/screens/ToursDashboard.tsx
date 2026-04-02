import React, { useState } from "react";
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

import TourRoundedIcon from "@mui/icons-material/TourRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";


function ToursDashboardHomeScreen(): React.JSX.Element {
  const [highlightState, setHighlightState] = useState("idle");
  const [activeCategory, setActiveCategory] = useState("daytrips");

  const handleBookFeatured = () => {
    setHighlightState("booking");
  };

  const handleViewDetails = () => {
    setHighlightState("details");
  };

  const handleCreateCustom = () => {
    setHighlightState("custom");
  };

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
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 999,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#DBEAFE" : "rgba(15,23,42,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TourRoundedIcon sx={{ fontSize: 22, color: "#1D4ED8" }} />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Tours & charters
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Browse EV tours, day trips & weekend getaways
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Highlight card */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 3,
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
        <CardContent sx={{ px: 1.8, py: 1.8 }}>
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
            EV Day Trip – Jinja, Source of the Nile
          </Typography>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.6 }}>
            <PlaceRoundedIcon
              sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
            />
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Jinja • Full day • EV transport included
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
              Sat 12 Oct • 08:00 – 19:00 • 4 spots left
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.25} sx={{ mb: highlightState === "idle" ? 0 : 1 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleBookFeatured}
              sx={{
                borderRadius: 999,
                py: 0.9,
                fontSize: 13,
                fontWeight: 600,
                textTransform: "none",
                bgcolor: "primary.main",
                color: "#020617",
                "&:hover": { bgcolor: "#06e29a" }
              }}
            >
              Book this tour
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleViewDetails}
              sx={{
                borderRadius: 999,
                py: 0.9,
                fontSize: 13,
                textTransform: "none"
              }}
            >
              View details
            </Button>
          </Stack>

          {highlightState !== "idle" && (
            <Box
              sx={{
                mt: 0.75,
                px: 1.1,
                py: 0.75,
                borderRadius: 2,
                bgcolor: (t) =>
                  t.palette.mode === "light"
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(15,23,42,0.95)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(59,130,246,0.25)"
                    : "1px solid rgba(59,130,246,0.6)"
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
              >
                {highlightState === "booking"
                  ? "Next step: open the EV Day Trip booking flow (dates & guests)."
                  : highlightState === "details"
                  ? "Next step: open the detailed tour page with full itinerary, inclusions and photos."
                  : "Next step: open the custom tour/charter builder to choose your own dates, destinations and group size."}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Quick filters */}
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
                  borderRadius: 999,
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
              Your upcoming tours
            </Typography>
            <Typography
              variant="caption"
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
                    ? "Kampala City EV Highlights"
                    : "Weekend EV Safari – Lake Mburo"}
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
                      ? "18 Oct • 14:00 – 18:30"
                      : "25–26 Oct • 2 days"}
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
                    {i === 0 ? "2 adults" : "4 guests"}
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
          mb: 1.5,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px dashed rgba(148,163,184,0.9)"
              : "1px dashed rgba(148,163,184,0.8)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.6 }}>
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
            {highlightState === "custom" && (
              <Chip
                size="small"
                label="Started"
                sx={{
                  borderRadius: 999,
                  fontSize: 10,
                  height: 22,
                  bgcolor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(3,205,140,0.12)"
                      : "rgba(16,185,129,0.2)",
                  color: (t) =>
                    t.palette.mode === "light"
                      ? "#059669"
                      : "#10B981"
                }}
              />
            )}
          </Stack>

          <Typography
            variant="caption"
            sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary, mb: 0.9, display: "block" }}
          >
            Need something different? Create your own EV-powered tour or private
            charter with custom dates, routes and group size.
          </Typography>

          <Stack direction="row" spacing={1.25}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleCreateCustom}
              sx={{
                borderRadius: 999,
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
              sx={{
                borderRadius: 999,
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
        sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
      >
        Use the tours dashboard to quickly find and manage EV-powered experiences,
        from same-day outings to multi-day safaris, all linked to your EVzone
        account and payment methods.
      </Typography>
    </Box>
  );
}

export default function ToursDashboard(): React.JSX.Element {
  return (
    <>

        <ToursDashboardHomeScreen />
      
    </>
  );
}
