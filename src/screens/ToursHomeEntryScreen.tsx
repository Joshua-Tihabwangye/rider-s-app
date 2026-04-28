import React, { useMemo, useState } from "react";
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

import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";

interface TourCardView {
  id: string;
  title: string;
  location: string;
  duration: string;
  price: string;
  category: "city" | "day" | "safari" | "all";
  tag?: string;
  summary: string;
}

interface TourCardProps {
  tour: TourCardView;
  onClick: () => void;
}

function TourCard({ tour, onClick }: TourCardProps): React.JSX.Element {
  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        mb: uiTokens.spacing.mdPlus,
        borderRadius: uiTokens.radius.sm,
        cursor: "pointer",
        bgcolor: (t) =>
          t.palette.mode === "light"
            ? "linear-gradient(135deg,#FFFFFF,#F9FAFB)"
            : "linear-gradient(135deg,#020617,#020617)",
        border: (t) =>
          t.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)",
        transition: "transform 0.12s ease, box-shadow 0.12s ease",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: 3
        }
      }}
    >
      <CardContent sx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.mdPlus }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 1 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: uiTokens.radius.xl,
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
                    borderRadius: uiTokens.radius.xl,
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
                  borderRadius: uiTokens.radius.xl,
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
  const { tours, actions } = useAppData();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const availableTours = useMemo<TourCardView[]>(
    () =>
      tours.tours.map((tour) => {
        const title = tour.title.trim();
        const location = tour.location.trim();
        const duration = tour.duration.trim();
        const summary = tour.description.trim() || tour.highlights[0] || "EV tour";
        const lowered = `${title} ${location} ${duration} ${summary} ${tour.highlights.join(" ")}`.toLowerCase();

        let category: TourCardView["category"] = "all";
        if (lowered.includes("safari")) {
          category = "safari";
        } else if (duration.toLowerCase().includes("day")) {
          category = "day";
        } else if (location.toLowerCase().includes("kampala") || duration.toLowerCase().includes("hour")) {
          category = "city";
        }

        return {
          id: tour.id,
          title,
          location,
          duration,
          price: tour.pricePerPerson,
          summary,
          category,
          tag: tour.seatsLeft > 0 ? `${tour.seatsLeft} spots left` : "Fully booked"
        };
      }),
    [tours.tours]
  );

  const searchText = search.trim().toLowerCase();
  const filteredTours = availableTours.filter((tour) => {
    if (filter === "city") return tour.category === "city";
    if (filter === "day") return tour.category === "day";
    if (filter === "safari") return tour.category === "safari";
    return true;
  }).filter((tour) => {
    if (!searchText) return true;
    return (
      tour.title.toLowerCase().includes(searchText) ||
      tour.location.toLowerCase().includes(searchText) ||
      tour.summary.toLowerCase().includes(searchText)
    );
  });

  return (
    <Box sx={{ px: uiTokens.spacing.xl, pt: uiTokens.spacing.xl, pb: uiTokens.spacing.xxl }}>
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
              borderRadius: uiTokens.radius.xl,
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
              EV tours & charters
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Browse and book tours with electric transport
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Search + date */}
      <Stack spacing={uiTokens.spacing.smPlus} sx={{ mb: uiTokens.spacing.xl }}>
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
              borderRadius: uiTokens.radius.xl,
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
              borderRadius: uiTokens.radius.xl,
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
              borderRadius: uiTokens.radius.xl,
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
              borderRadius: uiTokens.radius.xl,
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
              borderRadius: uiTokens.radius.xl,
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
          <TourCard
            key={tour.id}
            tour={tour}
            onClick={() => {
              actions.selectTour(tour.id);
              navigate(`/tours/${tour.id}`);
            }}
          />
        ))
      )}
    </Box>
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

          <ToursHomeBrowseScreen />
        
      </Box>
    
  );
}
