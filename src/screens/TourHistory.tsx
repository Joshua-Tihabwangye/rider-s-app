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
  Button
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import TourRoundedIcon from "@mui/icons-material/TourRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import { useAppData } from "../contexts/AppDataContext";
import type { TourBooking } from "../store/types";

interface BookingView {
  booking: TourBooking;
  tourId: string;
  title: string;
  location: string;
  dateLabel: string;
  guestsLabel: string;
  statusLabel: string;
}

interface TourBookingCardProps {
  item: BookingView;
  onViewDetails: (tourId: string) => void;
}

function toStatusLabel(status: TourBooking["status"]): string {
  if (status === "pending_payment") return "Pending payment";
  if (status === "failed_payment") return "Failed payment";
  return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ");
}

function isUpcomingStatus(status: TourBooking["status"]): boolean {
  return status === "pending_payment" || status === "confirmed";
}

function TourBookingCard({ item, onViewDetails }: TourBookingCardProps): React.JSX.Element {
  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.75,
        borderRadius: 2,
        bgcolor: (t) =>
          t.palette.mode === "light" ? "#FFFFFF" : "rgba(134,239,172,0.16)",
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
                t.palette.mode === "light" ? "#DCFCE7" : "rgba(134,239,172,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TourRoundedIcon sx={{ fontSize: 22, color: "#22C55E" }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
              {item.title}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              {item.location} • {item.guestsLabel}
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.4 }}>
              <CalendarMonthRoundedIcon sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }} />
              <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                {item.dateLabel}
              </Typography>
            </Stack>
          </Box>
          <Chip
            size="small"
            label={item.statusLabel}
            sx={{
              borderRadius: 5,
              fontSize: 10,
              height: 22,
              bgcolor: item.booking.status === "confirmed" ? "rgba(34,197,94,0.12)" : "rgba(148,163,184,0.18)",
              color: item.booking.status === "confirmed" ? "#16A34A" : "rgba(148,163,184,1)"
            }}
          />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
            ID: {item.booking.id}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => onViewDetails(item.tourId)}
            sx={{ borderRadius: 5, px: 2, py: 0.4, fontSize: 12, textTransform: "none" }}
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
  const { tours } = useAppData();
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming");

  const bookingItems = useMemo<BookingView[]>(() => {
    const source = tours.bookings.length > 0 ? tours.bookings : [tours.booking];
    return source
      .filter((booking) => Boolean(booking.id))
      .map((booking) => {
        const tour = tours.tours.find((entry) => entry.id === booking.tourId) ?? tours.tours[0];
        return {
          booking,
          tourId: tour?.id ?? booking.tourId,
          title: tour?.title ?? "EV tour",
          location: tour?.location ?? "Kampala",
          dateLabel: booking.date ?? tour?.scheduleLabel ?? "Schedule pending",
          guestsLabel: `${booking.guests} ${booking.guests === 1 ? "guest" : "guests"}`,
          statusLabel: toStatusLabel(booking.status)
        };
      });
  }, [tours.booking, tours.bookings, tours.tours]);

  const bookings = bookingItems.filter((item) =>
    tab === "upcoming" ? isUpcomingStatus(item.booking.status) : !isUpcomingStatus(item.booking.status)
  );

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
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
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(134,239,172,0.2)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18, color: "#FB923C" }} />
          </IconButton>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
              My tours
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Upcoming and past EV tours
            </Typography>
          </Box>
        </Box>
      </Box>

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
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(134,239,172,0.12)",
            border: (t) =>
              t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
            color: tab === "upcoming" ? "#22C55E" : (t) => t.palette.text.primary
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
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(134,239,172,0.12)",
            border: (t) =>
              t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
            color: tab === "history" ? "#22C55E" : (t) => t.palette.text.primary
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
        bookings.map((item) => (
          <TourBookingCard key={item.booking.id} item={item} onViewDetails={(tourId) => navigate(`/tours/${tourId}`)} />
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
