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
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";

import { useAppData } from "../contexts/AppDataContext";
import {
  formatRentalDateRange,
  getRentalBookingVehicle,
  getRentalStatusLabel
} from "../features/rental/booking";
import type { RentalBooking, RentalVehicle } from "../store/types";

interface RentalBookingCardProps {
  booking: RentalBooking;
  vehicle: RentalVehicle | null;
  onViewDetails: (bookingId: string) => void;
}

function RentalBookingCard({
  booking,
  vehicle,
  onViewDetails
}: RentalBookingCardProps): React.JSX.Element {
  const statusLabel = getRentalStatusLabel(booking.status);

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
                t.palette.mode === "light" ? "#E0F2FE" : "rgba(15,23,42,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <ElectricCarRoundedIcon sx={{ fontSize: 22, color: "primary.main" }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              {vehicle ? `${vehicle.name} • ${vehicle.mode}` : "EV rental"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {vehicle ? `${vehicle.type} • ${vehicle.range}` : "Vehicle details pending"}
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.4 }}>
              <CalendarMonthRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                {formatRentalDateRange(booking.startDate, booking.endDate)}
              </Typography>
            </Stack>
          </Box>
          <Chip
            size="small"
            label={statusLabel}
            sx={{
              borderRadius: 5,
              fontSize: 10,
              height: 22,
              bgcolor:
                statusLabel === "Upcoming"
                  ? "rgba(34,197,94,0.12)"
                  : statusLabel === "Pending payment"
                    ? "rgba(249,115,22,0.16)"
                    : statusLabel === "Payment failed"
                      ? "rgba(239,68,68,0.18)"
                  : statusLabel === "Cancelled"
                    ? "rgba(248,113,113,0.18)"
                    : "rgba(148,163,184,0.18)",
              color:
                statusLabel === "Upcoming"
                  ? "#16A34A"
                  : statusLabel === "Pending payment"
                    ? "#C2410C"
                    : statusLabel === "Payment failed"
                      ? "#B91C1C"
                  : statusLabel === "Cancelled"
                    ? "#DC2626"
                    : "rgba(148,163,184,1)"
            }}
          />
        </Stack>

        <Stack spacing={0.4} sx={{ mb: 1 }}>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <PlaceRoundedIcon
              sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
            />
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Pickup: {booking.pickupBranch ?? "Pickup pending"}
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
              Return: {booking.dropoffBranch ?? "Return pending"}
            </Typography>
          </Stack>
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
            onClick={() => onViewDetails(booking.id)}
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

function RentalBookingsUpcomingHistoryScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { rental } = useAppData();
  const [tab, setTab] = useState("upcoming");

  const bookings = useMemo(
    () =>
      rental.bookings.filter((booking) =>
        tab === "upcoming" ? booking.status === "confirmed" : booking.status !== "confirmed"
      ),
    [rental.bookings, tab]
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
              My EV rentals
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Upcoming and past bookings
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
            bgcolor: tab === "upcoming"
              ? "primary.main"
              : (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
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
            bgcolor: tab === "history"
              ? "primary.main"
              : (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            color: tab === "history" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
      </Stack>

      {bookings.length === 0 ? (
        <Typography
          variant="caption"
          sx={{
            mt: 4,
            display: "block",
            textAlign: "center",
            color: (t) => t.palette.text.secondary
          }}
        >
          No rentals in this view yet.
        </Typography>
      ) : (
        bookings.map((booking) => (
          <RentalBookingCard
            key={booking.id}
            booking={booking}
            vehicle={getRentalBookingVehicle(rental.vehicles, booking)}
            onViewDetails={(bookingId) => navigate(`/rental/history/${bookingId}`)}
          />
        ))
      )}
    </Box>
  );
}

export default function RiderScreen76RentalBookingsUpcomingHistoryCanvas_v2() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (t) => t.palette.background.default
      }}
    >
      <RentalBookingsUpcomingHistoryScreen />
    </Box>
  );
}
