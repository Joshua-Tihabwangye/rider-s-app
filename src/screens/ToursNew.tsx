import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  TextField,
  Chip,
  Snackbar,
  Alert
} from "@mui/material";
import ScreenScaffold from "../components/ScreenScaffold";
import PageHeader from "../components/PageHeader";
import ActionGrid from "../components/primitives/ActionGrid";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";

import TourRoundedIcon from "@mui/icons-material/TourRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import WeekendRoundedIcon from "@mui/icons-material/WeekendRounded";
import NaturePeopleRoundedIcon from "@mui/icons-material/NaturePeopleRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";

const TOUR_TYPES = [
  { id: "city", label: "City tour", icon: <ExploreRoundedIcon sx={{ fontSize: 22, color: "#22C55E" }} />, bg: "#DCFCE7" },
  { id: "daytrip", label: "Day trip", icon: <TourRoundedIcon sx={{ fontSize: 22, color: "#34D399" }} />, bg: "#DCFCE7" },
  { id: "safari", label: "Safari", icon: <NaturePeopleRoundedIcon sx={{ fontSize: 22, color: "#D97706" }} />, bg: "#FEF3C7" },
  { id: "weekend", label: "Weekend", icon: <WeekendRoundedIcon sx={{ fontSize: 22, color: "#7C3AED" }} />, bg: "#EDE9FE" }
];

export default function ToursNew(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { tours, actions } = useAppData();
  const isQuoteMode = (location.state as { mode?: string } | null)?.mode === "quote";

  const [tourType, setTourType] = useState("daytrip");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [groupSize, setGroupSize] = useState(2);
  const [specialRequests, setSpecialRequests] = useState("");
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });

  const handleContinue = () => {
    if (!destination.trim()) {
      setSnackbar({ open: true, message: "Please enter a destination.", severity: "error" });
      return;
    }
    if (!startDate) {
      setSnackbar({ open: true, message: "Please select a start date.", severity: "error" });
      return;
    }

    if (isQuoteMode) {
      setSnackbar({ open: true, message: "Quote request submitted! We'll contact you within 24 hours.", severity: "success" });
    } else {
      const nextTour = tours.tours.find((tour) => tour.id === tours.selectedTourId) ?? tours.tours[0];
      if (!nextTour) {
        setSnackbar({ open: true, message: "No tours are available right now.", severity: "error" });
        return;
      }

      actions.selectTour(nextTour.id);
      navigate(`/tours/${nextTour.id}/dates`, {
        state: {
          tourType,
          destination,
          startDate,
          endDate,
          groupSize,
          specialRequests
        }
      });
    }
  };

  return (
    <ScreenScaffold
      header={
        <PageHeader
          title={isQuoteMode ? "Request a Quote" : "Create New Tour"}
          subtitle={isQuoteMode ? "Get a custom quote for your EV tour" : "Build your custom EV experience"}
        />
      }
    >
      {/* Tour type selector */}
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(134,239,172,0.16)",
          border: (t) => t.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: { xs: 1.5, sm: 1.75 }, py: { xs: 1.5, sm: 1.7 } }}>
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}>
            Tour type
          </Typography>

          <ActionGrid minWidth={140}>
            {TOUR_TYPES.map((type) => (
              <Card
                key={type.id}
                elevation={0}
                onClick={() => setTourType(type.id)}
                sx={{
                  borderRadius: uiTokens.radius.xl,
                  cursor: "pointer",
                  bgcolor: tourType === type.id
                    ? (t) => t.palette.mode === "light" ? type.bg : "rgba(134,239,172,0.14)"
                    : (t) => t.palette.mode === "light" ? "#F9FAFB" : "rgba(134,239,172,0.14)",
                  border: tourType === type.id
                    ? "1.5px solid rgba(3,205,140,0.7)"
                    : (t) => t.palette.mode === "light"
                      ? "1px solid rgba(209,213,219,0.9)"
                      : "1px solid rgba(51,65,85,0.9)",
                  transition: "all 0.15s ease"
                }}
              >
                <CardContent sx={{ px: 1.4, py: 1.3, textAlign: "center" }}>
                  <Box sx={{ mb: 0.4 }}>{type.icon}</Box>
                  <Typography variant="body2" sx={{ fontSize: 12, fontWeight: tourType === type.id ? 600 : 400 }}>
                    {type.label}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </ActionGrid>
        </CardContent>
      </Card>

      {/* Destination & Dates */}
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(134,239,172,0.16)",
          border: (t) => t.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: { xs: 1.5, sm: 1.75 }, py: { xs: 1.5, sm: 1.7 } }}>
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}>
            Trip details
          </Typography>

          <Stack spacing={1.5}>
            <TextField
              fullWidth
              size="small"
              label="Destination"
              placeholder="e.g. Jinja, Source of the Nile"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              InputProps={{
                startAdornment: <PlaceRoundedIcon sx={{ fontSize: 18, color: (t) => t.palette.text.secondary, mr: 0.75 }} />
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: uiTokens.radius.xl, fontSize: 13 } }}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField
                fullWidth
                size="small"
                label="Start date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <CalendarMonthRoundedIcon sx={{ fontSize: 18, color: (t) => t.palette.text.secondary, mr: 0.75 }} />
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: uiTokens.radius.xl, fontSize: 13 } }}
              />
              <TextField
                fullWidth
                size="small"
                label="End date (optional)"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <CalendarMonthRoundedIcon sx={{ fontSize: 18, color: (t) => t.palette.text.secondary, mr: 0.75 }} />
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: uiTokens.radius.xl, fontSize: 13 } }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Group size */}
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(134,239,172,0.16)",
          border: (t) => t.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: { xs: 1.5, sm: 1.75 }, py: { xs: 1.5, sm: 1.7 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}>
                Group size
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.25 }}>
                <PeopleRoundedIcon sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }} />
                <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>
                  {groupSize} {groupSize === 1 ? "guest" : "guests"}
                </Typography>
              </Stack>
            </Box>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Button
                variant="outlined"
                size="small"
                onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                disabled={groupSize <= 1}
                sx={{
                  minWidth: 36, width: 36, height: 36, p: 0,
                  borderRadius: uiTokens.radius.xl
                }}
              >
                <RemoveRoundedIcon sx={{ fontSize: 18 }} />
              </Button>
              <Typography variant="body1" sx={{ fontWeight: 700, fontSize: 16, width: 32, textAlign: "center" }}>
                {groupSize}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setGroupSize(Math.min(20, groupSize + 1))}
                disabled={groupSize >= 20}
                sx={{
                  minWidth: 36, width: 36, height: 36, p: 0,
                  borderRadius: uiTokens.radius.xl
                }}
              >
                <AddRoundedIcon sx={{ fontSize: 18 }} />
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Special requests */}
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) => t.palette.mode === "light" ? "#F9FAFB" : "rgba(134,239,172,0.16)",
          border: (t) => t.palette.mode === "light"
            ? "1px dashed rgba(148,163,184,0.9)"
            : "1px dashed rgba(148,163,184,0.8)"
        }}
      >
        <CardContent sx={{ px: { xs: 1.5, sm: 1.75 }, py: { xs: 1.5, sm: 1.6 } }}>
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.75, display: "block" }}>
            Special requests (optional)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            placeholder="Any special requirements? e.g. wheelchair access, lunch included, specific stops..."
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: uiTokens.radius.xl, fontSize: 13 } }}
          />
        </CardContent>
      </Card>

      {/* Summary chip row */}
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
        <Chip
          size="small"
          icon={<DirectionsCarFilledRoundedIcon sx={{ fontSize: 14 }} />}
          label="EV transport included"
          sx={{ fontSize: 10, height: 24, borderRadius: 5, bgcolor: "rgba(3,205,140,0.12)", color: uiTokens.colors.brand }}
        />
        <Chip
          size="small"
          label={TOUR_TYPES.find((t) => t.id === tourType)?.label ?? "Day trip"}
          sx={{ fontSize: 10, height: 24, borderRadius: 5 }}
        />
        <Chip
          size="small"
          label={`${groupSize} ${groupSize === 1 ? "guest" : "guests"}`}
          sx={{ fontSize: 10, height: 24, borderRadius: 5 }}
        />
      </Stack>

      {/* Action buttons */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleContinue}
          sx={{
            borderRadius: uiTokens.radius.xl,
            py: 1,
            fontSize: 14,
            fontWeight: 600,
            textTransform: "none",
            bgcolor: (t) => t.palette.mode === "light" ? "#22C55E" : "#22C55E",
            color: (t) => t.palette.mode === "light" ? "#FFFFFF" : "#22C55E",
            "&:hover": { bgcolor: (t) => t.palette.mode === "light" ? "#22C55E" : "#02B87A" }
          }}
        >
          {isQuoteMode ? "Submit quote request" : "Continue to dates"}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{
            borderRadius: uiTokens.radius.xl,
            py: 1,
            fontSize: 13,
            textTransform: "none"
          }}
        >
          Cancel
        </Button>
      </Stack>

      <Typography variant="caption" sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary, mt: 0.5, display: "block" }}>
        {isQuoteMode
          ? "Submit your request and our team will send you a detailed quote within 24 hours. All tours include EV transport."
          : "Build your custom EV-powered tour with your preferred dates, destinations, and group size. All tours include electric vehicle transport."
        }
      </Typography>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ borderRadius: uiTokens.radius.xl, width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ScreenScaffold>
  );
}
