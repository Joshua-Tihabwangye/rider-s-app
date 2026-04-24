import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  Divider
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";

import { useAppData } from "../contexts/AppDataContext";
import {
  buildRentalPricing,
  formatRentalDateRange,
  formatUgx,
  getRentalBookingVehicle,
  getRentalStatusLabel
} from "../features/rental/booking";

function RentalBookingDetailViewScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { rentalId } = useParams();
  const { rental, actions } = useAppData();

  const booking =
    rental.bookings.find((entry) => entry.id === rentalId) ??
    (rental.booking.id === rentalId ? rental.booking : rental.bookings[0] ?? rental.booking);
  const vehicle = getRentalBookingVehicle(rental.vehicles, booking, rental.selectedVehicleId);
  const pricing = buildRentalPricing(vehicle, booking);
  const status = getRentalStatusLabel(booking.status);

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
              Rental booking details
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {vehicle ? `${vehicle.name} • ${vehicle.mode}` : "EV rental"}
            </Typography>
          </Box>
        </Box>
        <Chip
          size="small"
          label={status}
          sx={{
            borderRadius: 5,
            fontSize: 10,
            height: 22,
            bgcolor:
              status === "Upcoming"
                ? "rgba(34,197,94,0.12)"
                : status === "Cancelled"
                  ? "rgba(248,113,113,0.18)"
                  : "rgba(148,163,184,0.18)",
            color:
              status === "Upcoming"
                ? "#16A34A"
                : status === "Cancelled"
                  ? "#DC2626"
                  : "rgba(148,163,184,1)"
          }}
        />
      </Box>

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
                  t.palette.mode === "light" ? "#E0F2FE" : "rgba(15,23,42,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <ElectricCarRoundedIcon sx={{ fontSize: 26, color: "primary.main" }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                {vehicle ? `${vehicle.name} • ${vehicle.type}` : "EV rental"}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                {vehicle ? `${vehicle.mode} • ${vehicle.seats} seats • ${vehicle.range}` : "Vehicle details pending"}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  mt: 0.4,
                  fontSize: 11,
                  color: (t) => t.palette.text.secondary
                }}
              >
                ID: {booking.id}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 1.2, borderColor: (t) => t.palette.divider }} />

          <Stack spacing={0.6}>
            <Stack direction="row" spacing={0.75} alignItems="center">
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
            <Stack direction="row" spacing={0.75} alignItems="center">
              <PlaceRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Pickup: {booking.pickupBranch ?? "Pickup pending"} • Return: {booking.dropoffBranch ?? "Return pending"}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

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
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}
          >
            Price breakdown
          </Typography>
          <Stack spacing={0.4}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                Rental ({pricing.durationDays} day{pricing.durationDays === 1 ? "" : "s"} × {formatUgx(pricing.dailyRate)})
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                {formatUgx(pricing.rentalSubtotal)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                One-way drop-off fee
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                {pricing.oneWayFee > 0 ? formatUgx(pricing.oneWayFee) : "UGX 0"}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                Insurance & roadside support
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                Included
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                Refundable deposit
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                {formatUgx(pricing.refundableDeposit)}
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ my: 1.2, borderColor: (t) => t.palette.divider }} />

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}
              >
                Total paid
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                {booking.priceEstimate ?? formatUgx(pricing.dueNow)}
              </Typography>
            </Box>
            <Chip
              size="small"
              icon={<ShieldRoundedIcon sx={{ fontSize: 14 }} />}
              label="Covered by EVzone Pay"
              sx={{
                borderRadius: 5,
                fontSize: 10,
                height: 24,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                color: (t) => t.palette.text.primary
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={1.25} sx={{ mb: 1.5 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => {
            actions.beginRentalBooking(booking.vehicleId);
            actions.updateRentalBooking({
              vehicleId: booking.vehicleId,
              startDate: booking.startDate,
              endDate: booking.endDate,
              pickupBranch: booking.pickupBranch,
              dropoffBranch: booking.dropoffBranch,
              priceEstimate: booking.priceEstimate
            });
            navigate("/rental/dates");
          }}
          sx={{
            borderRadius: 5,
            py: 1,
            fontSize: 14,
            textTransform: "none"
          }}
        >
          Modify booking
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => {
            actions.updateRentalBooking({
              ...booking,
              status: "cancelled"
            });
            navigate("/rental/history");
          }}
          sx={{
            borderRadius: 5,
            py: 1,
            fontSize: 14,
            textTransform: "none",
            borderColor: "#EF4444",
            color: "#EF4444",
            "&:hover": {
              borderColor: "#DC2626",
              bgcolor: "rgba(248,113,113,0.06)"
            }
          }}
        >
          Cancel rental
        </Button>
      </Stack>

      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
      >
        Cancellation fees may apply depending on how close you are to the start
        time. Check your rental terms for more details.
      </Typography>
    </Box>
  );
}

export default function RiderScreen90RentalBookingDetailViewCanvas_v2() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (t) => t.palette.background.default
      }}
    >
      <RentalBookingDetailViewScreen />
    </Box>
  );
}
