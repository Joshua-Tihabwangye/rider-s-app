import React, { useState } from "react";
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
  TextField,
  InputAdornment
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import TourRoundedIcon from "@mui/icons-material/TourRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import MobileShell from "../components/MobileShell";

const TOURS = [
  {
    id: "TOUR-01",
    title: "Kampala City EV Highlights",
    location: "Kampala",
    duration: "Half day",
    price: "UGX 180,000",
    tag: "Most popular",
    summary: "Old Taxi Park, Parliament, Ggaba Beach with EV city tour"
  },
  {
    id: "TOUR-02",
    title: "EV Day Trip – Jinja Source of the Nile",
    location: "Jinja",
    duration: "Full day",
    price: "UGX 350,000",
    tag: "Day trip",
    summary: "EV drive to Jinja, boat ride and lunch"
  },
  {
    id: "TOUR-03",
    title: "Weekend EV Safari – Lake Mburo",
    location: "Lake Mburo",
    duration: "2 days",
    price: "UGX 950,000",
    tag: "Safari",
    summary: "EV transfer, game drive and overnight stay"
  }
];

interface Tour {
  id: string;
  title: string;
  location: string;
  duration: string;
  price: string;
  tag?: string;
  summary: string;
}

interface TourCardProps {
  tour: Tour;
  onSelect?: (tourId: string) => void;
}

function TourCard({ tour, onSelect }: TourCardProps): React.JSX.Element {
  return (
    <Card
      elevation={0}
      onClick={() => onSelect?.(tour.id)}
      sx={{
        mb: 1.75,
        borderRadius: 2,
        cursor: "pointer",
        bgcolor: (t) =>
          t.palette.mode === "light"
            ? "linear-gradient(135deg,#FFFFFF,#F9FAFB)"
            : "linear-gradient(135deg,#020617,#020617)",
        border: (t) =>
          t.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)",
        "&:hover": { borderColor: "primary.main" }
      }}
    >
      <CardContent sx={{ px: 1.75, py: 1.6 }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 1 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 999,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#DBEAFE" : "rgba(15,23,42,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TourRoundedIcon sx={{ fontSize: 26, color: "#1D4ED8" }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  {tour.title}
                </Typography>
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <PlaceRoundedIcon
                    sx={{ fontSize: 14, color: (t) => t.palette.text.secondary }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                  >
                    {tour.location} • {tour.duration}
                  </Typography>
                </Stack>
              </Box>
              {tour.tag && (
                <Chip
                  label={tour.tag}
                  size="small"
                  sx={{
                    borderRadius: 999,
                    fontSize: 10,
                    height: 22,
                    bgcolor: "rgba(34,197,94,0.12)",
                    color: "#16A34A"
                  }}
                />
              )}
            </Stack>
            <Typography
              variant="caption"
              sx={{
                mt: 0.6,
                fontSize: 11,
                color: (t) => t.palette.text.secondary
              }}
            >
              {tour.summary}
            </Typography>

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.1 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                {tour.price}
              </Typography>
              <Chip
                label="EV transport included"
                size="small"
                sx={{
                  borderRadius: 999,
                  fontSize: 10,
                  height: 22,
                  bgcolor: "rgba(3,205,140,0.12)",
                  color: "#059669"
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function ToursHomeBrowseScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredTours = TOURS.filter((tour) => {
    if (filter === "city") return tour.duration === "Half day";
    if (filter === "day") return tour.tag === "Day trip";
    if (filter === "safari") return tour.tag === "Safari";
    return true;
  }).filter((tour) => {
    if (!search.trim()) return true;
    return (
      tour.title.toLowerCase().includes(search.toLowerCase()) ||
      tour.location.toLowerCase().includes(search.toLowerCase())
    );
  });

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
            EV tours & charters
          </Typography>
        </Box>
        <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>


      {/* Search + date */}
      <Stack spacing={1.25} sx={{ mb: 2.2 }}>
        <TextField
          fullWidth
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by city or tour name"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              </InputAdornment>
            )
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 999,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.96)",
              "& fieldset": {
                borderColor: (t) =>
                  t.palette.mode === "light"
                    ? "rgba(209,213,219,0.9)"
                    : "rgba(51,65,85,0.9)"
              },
              "&:hover fieldset": { borderColor: "primary.main" }
            }
          }}
        />

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          <Chip
            label="All"
            onClick={() => setFilter("all")}
            size="small"
            sx={{
              borderRadius: 999,
              fontSize: 11,
              height: 26,
              bgcolor: filter === "all" ? "primary.main" : (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)",
              color: filter === "all" ? "#020617" : (t) => t.palette.text.primary
            }}
          />
          <Chip
            label="City tours"
            onClick={() => setFilter("city")}
            size="small"
            sx={{
              borderRadius: 999,
              fontSize: 11,
              height: 26,
              bgcolor: filter === "city" ? "primary.main" : (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)",
              color: filter === "city" ? "#020617" : (t) => t.palette.text.primary
            }}
          />
          <Chip
            label="Day trips"
            onClick={() => setFilter("day")}
            size="small"
            sx={{
              borderRadius: 999,
              fontSize: 11,
              height: 26,
              bgcolor: filter === "day" ? "primary.main" : (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)",
              color: filter === "day" ? "#020617" : (t) => t.palette.text.primary
            }}
          />
          <Chip
            label="Safaris"
            onClick={() => setFilter("safari")}
            size="small"
            sx={{
              borderRadius: 999,
              fontSize: 11,
              height: 26,
              bgcolor: filter === "safari" ? "primary.main" : (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)",
              color: filter === "safari" ? "#020617" : (t) => t.palette.text.primary
            }}
          />
        </Stack>
      </Stack>

      {/* Tours list */}
      {filteredTours.length === 0 ? (
        <Typography
          variant="caption"
          sx={{ mt: 4, display: "block", textAlign: "center", color: (t) => t.palette.text.secondary }}
        >
          No tours match your search. Try a different date, city or category.
        </Typography>
      ) : (
        filteredTours.map((tour) => (
          <TourCard key={tour.id} tour={tour} onSelect={(id) => navigate(`/tours/${id}`)} />
        ))
      )}
    </Box>
    </>

  );
}

export default function RiderScreen77ToursHomeBrowseCanvas_v2() {
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
          <ToursHomeBrowseScreen />
        </MobileShell>
      </Box>
    
  );
}
