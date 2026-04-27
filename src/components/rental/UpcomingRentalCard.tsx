import React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography
} from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import {
  estimateRentalDays,
  formatRentalDateRange,
  getRentalModeLabel
} from "../../features/rental/booking";
import type { RentalBooking, RentalVehicle } from "../../store/types";
import { uiTokens } from "../../design/tokens";

interface UpcomingRentalCardProps {
  booking: RentalBooking;
  vehicle: RentalVehicle | null;
  onClick: () => void;
}

export default function UpcomingRentalCard({
  booking,
  vehicle,
  onClick
}: UpcomingRentalCardProps): React.JSX.Element {
  const durationDays = estimateRentalDays(booking.startDate, booking.endDate);
  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        cursor: "pointer",
        borderRadius: uiTokens.radius.xl,
        border: "1px solid rgba(226,232,240,0.9)",
        bgcolor: (t) => (t.palette.mode === "light" ? "#F8FAFC" : "rgba(15,23,42,0.96)")
      }}
    >
      <CardContent sx={{ px: 1.35, py: 1.2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontSize: 12.8, fontWeight: 700 }}>
              {vehicle ? `${vehicle.name} • ${getRentalModeLabel(booking)}` : "EV rental"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 10.6, color: (t) => t.palette.text.secondary }}
            >
              {formatRentalDateRange(booking.startDate, booking.endDate)}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.6} alignItems="center">
            <Chip
              size="small"
              label={booking.status === "confirmed" ? "Upcoming" : "Booked"}
              sx={{
                borderRadius: uiTokens.radius.pill,
                height: 20,
                fontSize: 10,
                bgcolor:
                  booking.status === "confirmed"
                    ? "rgba(249,115,22,0.15)"
                    : "rgba(22,163,74,0.16)",
                color: booking.status === "confirmed" ? "#C2410C" : "#15803D"
              }}
            />
            <ArrowForwardIosRoundedIcon sx={{ fontSize: 13, color: "#F97316" }} />
          </Stack>
        </Stack>
        <Stack direction="row" spacing={0.7} alignItems="center" sx={{ mt: 0.6 }}>
          <PlaceRoundedIcon sx={{ fontSize: 14, color: "#F97316" }} />
          <Typography variant="caption" sx={{ fontSize: 10.6, color: (t) => t.palette.text.secondary }}>
            {`${booking.pickupBranch ?? "Pickup pending"} to ${booking.dropoffBranch ?? "Return pending"}`}
          </Typography>
        </Stack>
        <Typography
          variant="caption"
          sx={{ mt: 0.4, display: "block", fontSize: 10.6, color: (t) => t.palette.text.secondary }}
        >
          {durationDays} day{durationDays === 1 ? "" : "s"} • {booking.priceEstimate ?? "Price pending"}
        </Typography>
      </CardContent>
    </Card>
  );
}
