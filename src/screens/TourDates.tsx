import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  Button
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import { useAppData } from "../contexts/AppDataContext";


function TourDateGuestsScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { tourId } = useParams();
  const { tours, actions } = useAppData();
  const selectTour = actions.selectTour;
  const updateTourBooking = actions.updateTourBooking;
  const selectedTour = tours.tours.find((tour) => tour.id === tourId) ?? tours.tours[0];
  const [date, setDate] = useState(tours.booking.date ?? "");
  const [timeSlot, setTimeSlot] = useState("Afternoon (14:00)");
  const [adults, setAdults] = useState(tours.booking.guests ?? 2);
  const [children, setChildren] = useState(0);

  const canContinue = Boolean(date.trim() && timeSlot.trim() && adults > 0);

  useEffect(() => {
    if (tourId) {
      selectTour(tourId);
    }
  }, [tourId, selectTour]);

  const adjust = (setter: React.Dispatch<React.SetStateAction<number>>, delta: number, min = 0, max = 10): void => {
    setter((prev: number) => {
      const next = prev + delta;
      if (next < min) return min;
      if (next > max) return max;
      return next;
    });
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
              Date & guests
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {selectedTour?.title ?? "EV Tour"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Date & time card */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
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
            sx={{
              fontSize: 11,
              color: (t) => t.palette.text.secondary,
              mb: 0.5,
              display: "block"
            }}
          >
            Date
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonthRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                </InputAdornment>
              )
            }}
            sx={{
              mb: 1.6,
              "& .MuiOutlinedInput-root": {
                borderRadius: 5,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
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

          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              color: (t) => t.palette.text.secondary,
              mb: 0.5,
              display: "block"
            }}
          >
            Time slot
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {[
              "Morning (09:00)",
              "Afternoon (14:00)",
              "Evening (17:00)"
            ].map((slot) => (
              <Chip
                key={slot}
                label={slot}
                size="small"
                onClick={() => setTimeSlot(slot)}
                sx={{
                  borderRadius: 5,
                  fontSize: 11,
                  height: 26,
                  bgcolor:
                    timeSlot === slot
                      ? "primary.main"
                      : (t) =>
                          t.palette.mode === "light"
                            ? "#F3F4F6"
                            : "rgba(15,23,42,0.96)",
                  color:
                    timeSlot === slot ? "#020617" : (t) => t.palette.text.primary
                }}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Guests card */}
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
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
            <PeopleAltRoundedIcon
              sx={{ fontSize: 18, color: (t) => t.palette.text.secondary }}
            />
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Guests
            </Typography>
          </Stack>

          <Stack spacing={1.2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 500 }}>
                  Adults
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  18+ years
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => adjust(setAdults, -1, 1)}
                  sx={{
                    minWidth: 32,
                    borderRadius: 5,
                    px: 0,
                    fontSize: 16,
                    lineHeight: 1
                  }}
                >
                  –
                </Button>
                <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 600 }}>
                  {adults}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => adjust(setAdults, 1, 1)}
                  sx={{
                    minWidth: 32,
                    borderRadius: 5,
                    px: 0,
                    fontSize: 16,
                    lineHeight: 1
                  }}
                >
                  +
                </Button>
              </Stack>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 500 }}>
                  Children
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  3–17 years
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => adjust(setChildren, -1, 0)}
                  sx={{
                    minWidth: 32,
                    borderRadius: 5,
                    px: 0,
                    fontSize: 16,
                    lineHeight: 1
                  }}
                >
                  –
                </Button>
                <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 600 }}>
                  {children}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => adjust(setChildren, 1, 0)}
                  sx={{
                    minWidth: 32,
                    borderRadius: 5,
                    px: 0,
                    fontSize: 16,
                    lineHeight: 1
                  }}
                >
                  +
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="contained"
        disabled={!canContinue}
        onClick={() => {
          if (!selectedTour) return;
          const guests = adults + children;
          const estimate = `${selectedTour.pricePerPerson} × ${guests}`;
          updateTourBooking({
            tourId: selectedTour.id,
            date,
            guests,
            priceEstimate: estimate
          });
          selectTour(selectedTour.id);
          navigate(`/tours/${selectedTour.id}/summary`, { state: { date, timeSlot, adults, children } });
        }}
        sx={{
          borderRadius: 5,
          py: 1.1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: canContinue ? "primary.main" : "#9CA3AF",
          color: canContinue ? "#020617" : "#E5E7EB",
          "&:hover": {
            bgcolor: canContinue ? "#06e29a" : "#9CA3AF"
          }
        }}
      >
        Continue to payment
      </Button>
    </Box>
  );
}

export default function RiderScreen79TourDateGuestsCanvas_v2() {
      return (
    
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (t) => t.palette.background.default
        }}
      >

          <TourDateGuestsScreen />
        
      </Box>
    
  );
}
