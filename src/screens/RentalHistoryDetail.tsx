import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";

import { useAppData } from "../contexts/AppDataContext";
import {
  GradientActionButton,
  cardSx,
  formatInr,
  rentalUi,
  screenShellSx
} from "../components/rental/RentalRedesignUI";
import {
  buildRentalPricing,
  getRentalBookingVehicle,
  getRentalStatusLabel
} from "../features/rental/booking";

export default function RiderScreen90RentalBookingDetailViewCanvas_v2(): React.JSX.Element {
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
    <Box sx={screenShellSx}>
      <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 1.7 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ border: `1px solid ${rentalUi.border}`, bgcolor: "#fff" }}>
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography sx={{ fontSize: "20px !important", fontWeight: 800 }}>Rental history details</Typography>
      </Stack>

      <Card sx={{ ...cardSx, mb: 1.35 }}>
        <CardContent sx={{ p: 1.35, "&:last-child": { pb: 1.35 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
            <Typography sx={{ fontWeight: 700, fontSize: "15px !important" }}>
              {vehicle ? `${vehicle.name} • ${vehicle.type}` : "EV rental"}
            </Typography>
            <Chip
              label={status}
              sx={{
                height: 28,
                bgcolor: status === "Upcoming" ? rentalUi.greenSoft : "#F3F4F6",
                color: status === "Upcoming" ? rentalUi.greenDeep : rentalUi.muted,
                fontWeight: 700
              }}
            />
          </Stack>

          <Stack spacing={0.75}>
            <Stack direction="row" spacing={0.8} alignItems="center">
              <CalendarMonthRoundedIcon sx={{ color: rentalUi.green }} />
              <Typography sx={{ color: rentalUi.muted, minWidth: 90 }}>Dates</Typography>
              <Typography sx={{ fontWeight: 600 }}>{booking.startDate ?? "-"}  •  {booking.endDate ?? "-"}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.8} alignItems="center">
              <LocationOnRoundedIcon sx={{ color: rentalUi.green }} />
              <Typography sx={{ color: rentalUi.muted, minWidth: 90 }}>Branches</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {booking.pickupBranch ?? "Pickup pending"}  →  {booking.dropoffBranch ?? "Return pending"}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.8} alignItems="center">
              <DirectionsCarRoundedIcon sx={{ color: rentalUi.green }} />
              <Typography sx={{ color: rentalUi.muted, minWidth: 90 }}>Mode</Typography>
              <Typography sx={{ fontWeight: 600 }}>{vehicle?.mode ?? "Self-drive"}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ ...cardSx, mb: 1.45 }}>
        <CardContent sx={{ p: 1.35, "&:last-child": { pb: 1.35 } }}>
          <Typography sx={{ fontWeight: 700, fontSize: "15px !important", mb: 0.8 }}>Payment summary</Typography>
          <Stack spacing={0.55}>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ color: rentalUi.muted }}>Rental ({pricing.durationDays} day{pricing.durationDays === 1 ? "" : "s"})</Typography>
              <Typography>{formatInr(pricing.rentalSubtotal)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ color: rentalUi.muted }}>Refundable deposit</Typography>
              <Typography>{formatInr(pricing.refundableDeposit)}</Typography>
            </Stack>
            <Divider sx={{ my: 0.5 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={0.6} alignItems="center">
                <PaymentsRoundedIcon sx={{ color: rentalUi.green }} />
                <Typography sx={{ fontWeight: 700 }}>Total paid</Typography>
              </Stack>
              <Typography sx={{ fontWeight: 800, color: rentalUi.greenDeep, fontSize: "21px !important" }}>
                {booking.priceEstimate ?? formatInr(pricing.dueNow)}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <GradientActionButton
        label="Back to home"
        onClick={() => {
          actions.resetRentalPayment();
          navigate("/home");
        }}
      />
    </Box>
  );
}
