import React, { useState } from "react";
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
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

const UPCOMING_TOURS = [
  {
    id: "TOUR-BOOK-2025-10-12-001",
    title: "Kampala City EV Highlights",
    date: "Sat, 12 Oct 2025",
    time: "Afternoon (14:00)",
    location: "Kampala",
    guests: "2 adults, 1 child",
    status: "Upcoming"
  }
];

const PAST_TOURS = [
  {
    id: "TOUR-BOOK-2025-09-01-002",
    title: "EV Day Trip – Jinja Source of the Nile",
    date: "Sat, 01 Sep 2025",
    time: "Full day",
    location: "Jinja",
    guests: "3 adults",
    status: "Completed"
  }
];

interface Booking {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  guests: string;
  status: string;
}

interface TourBookingCardProps {
  booking: Booking;
}

function TourBookingCard({ booking }: TourBookingCardProps): React.JSX.Element {
  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.75,
        borderRadius: 2,
        bgcolor: (t) =>
          t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: (t) =>
          t.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)"
      }}
    >
      <CardContent sx={{ px: 1.75, py: 1.6 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 5,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#DBEAFE" : "rgba(15,23,42,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TourRoundedIcon sx={{ fontSize: 22, color: "#1D4ED8" }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              {booking.title}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {booking.location} • {booking.guests}
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.4 }}>
              <CalendarMonthRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                {booking.date} • {booking.time}
              </Typography>
            </Stack>
          </Box>
          <Chip
            size="small"
            label={booking.status}
            sx={{
              borderRadius: 5,
              fontSize: 10,
              height: 22,
              bgcolor:
                booking.status === "Upcoming"
                  ? "rgba(34,197,94,0.12)"
                  : "rgba(148,163,184,0.18)",
              color:
                booking.status === "Upcoming" ? "#16A34A" : "rgba(148,163,184,1)"
            }}
          />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            ID: {booking.id}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            sx={{
              borderRadius: 5,
              px: 2,
              py: 0.4,
              fontSize: 12,
              textTransform: "none"
            }}
          >
            View details
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function TourBookingsUpcomingHistoryScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [tab, setTab] = useState("upcoming");
  const bookings = tab === "upcoming" ? UPCOMING_TOURS : PAST_TOURS;

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
              My tours
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Upcoming and past EV tours
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tabs */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Chip
          label="Upcoming"
          onClick={() => setTab("upcoming")}
          size="small"
          sx={{
            borderRadius: 5,
            fontSize: 11,
            height: 26,
            bgcolor: tab === "upcoming" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
            color: tab === "upcoming" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
        <Chip
          label="History"
          onClick={() => setTab("history")}
          size="small"
          sx={{
            borderRadius: 5,
            fontSize: 11,
            height: 26,
            bgcolor: tab === "history" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
            color: tab === "history" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
      </Stack>

      {bookings.length === 0 ? (
        <Typography
          variant="caption"
          sx={{ mt: 4, display: "block", textAlign: "center", color: (t) => t.palette.text.secondary }}
        >
          No tours in this view yet.
        </Typography>
      ) : (
        bookings.map((booking) => (
          <TourBookingCard key={booking.id} booking={booking} />
        ))
      )}
    </Box>
  );
}

export default function RiderScreen82TourBookingsUpcomingHistoryCanvas_v2() {
      return (
    
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (t) => t.palette.background.default
        }}
      >

          <TourBookingsUpcomingHistoryScreen />
        
      </Box>
    
  );
}
