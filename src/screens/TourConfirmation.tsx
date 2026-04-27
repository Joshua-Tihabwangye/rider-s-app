import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useNavigate, useParams } from "react-router-dom";
import { Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button, IconButton } from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import TourRoundedIcon from "@mui/icons-material/TourRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import { useAppData } from "../contexts/AppDataContext";


function TourBookingConfirmationScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { tourId } = useParams();
  const { tours, actions } = useAppData();
  const selectTour = actions.selectTour;
  const selectedTour =
    tours.tours.find((tour) => tour.id === tourId) ??
    tours.tours.find((tour) => tour.id === tours.booking.tourId) ??
    tours.tours[0];
  const bookingId = tours.booking.id;

  React.useEffect(() => {
    if (tourId) {
      selectTour(tourId);
    }
  }, [tourId, selectTour]);

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
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
        <Box sx={{ width: 32 }} />
      </Box>
      {/* Success banner */}
      <Box sx={{ textAlign: "center", mb: 2.5 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: "5px",
            bgcolor: "rgba(34,197,94,0.12)",
            mb: 1.5
          }}
        >
          <CheckCircleRoundedIcon sx={{ fontSize: 40, color: "#22c55e" }} />
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, letterSpacing: "-0.02em", mb: 0.4 }}
        >
          Tour booked
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}
        >
          Your spot is confirmed for {selectedTour?.title ?? "your EV tour"}.
        </Typography>
      </Box>

      {/* Summary card */}
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
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 5,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#DBEAFE" : "rgba(15,23,42,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <TourRoundedIcon sx={{ fontSize: 26, color: "#1D4ED8" }} />
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Booking ID
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                {bookingId}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                {(selectedTour?.title ?? "EV Tour")} • {tours.booking.guests} {tours.booking.guests === 1 ? "guest" : "guests"}
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={0.6}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <CalendarMonthRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                {tours.booking.date ?? "Date to be confirmed"} • Afternoon (14:00)
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <PlaceRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Meeting point: Central Kampala (hotel pickup / agreed spot)
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Actions */}
      <Stack direction="row" spacing={1.25} sx={{ mb: 1.5 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate("/tours/history")}
          sx={{
            borderRadius: 5,
            py: 1,
            fontSize: 14,
            textTransform: "none"
          }}
        >
          Add to calendar
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={() => navigate("/home")}
          sx={{
            borderRadius: 5,
            py: 1,
            fontSize: 14,
            fontWeight: 600,
            textTransform: "none",
            bgcolor: "primary.main",
            color: "#020617",
            "&:hover": { bgcolor: "#06e29a" }
          }}
        >
          Back to home
        </Button>
      </Stack>

      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
      >
        You can view this booking under Rides → Tours → Upcoming. Please arrive
        at the meeting point 10–15 minutes early.
      </Typography>
    </Box>
  );
}

export default function RiderScreen81TourBookingConfirmationCanvas_v2() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (t) => t.palette.background.default
      }}
    >

        <TourBookingConfirmationScreen />
      
    </Box>
  );
}
