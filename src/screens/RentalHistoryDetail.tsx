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
  CroppedReferenceImage,
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
import { getVehicleImageFromName } from "../features/rental/uiAssets";

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
    <Box sx={{ ...screenShellSx, pb: { xs: 13, sm: 6 } }}>
      <Stack direction="row" alignItems="center" spacing={1.1} sx={{ mb: 1.4 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ border: `1px solid ${rentalUi.border}`, bgcolor: "#fff" }}>
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography sx={{ fontSize: "20px !important", fontWeight: 800 }}>Rental history details</Typography>
      </Stack>

      <Card sx={{ ...cardSx, mb: 1.3, overflow: "hidden" }}>
        <CardContent sx={{ p: 1.2, "&:last-child": { pb: 1.2 } }}>
          <Stack direction="row" spacing={1.05} alignItems="center" sx={{ mb: 0.8 }}>
            <CroppedReferenceImage
              src={getVehicleImageFromName(vehicle?.name ?? "")}
              alt={vehicle?.name ?? "Vehicle"}
              height={92}
              fit="contain"
              scale={1}
              sx={{ width: 128, borderRadius: 2.2, bgcolor: "#F4FBF7" }}
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontWeight: 800, fontSize: "15px !important", lineHeight: 1.2 }}>
                {vehicle ? `${vehicle.name} • ${vehicle.type}` : "EV rental"}
              </Typography>
              <Stack direction="row" spacing={0.6} alignItems="center" sx={{ mt: 0.45 }}>
                <Chip
                  label={status}
                  sx={{
                    height: 26,
                    bgcolor: status === "Upcoming" ? rentalUi.greenSoft : "#F3F4F6",
                    color: status === "Upcoming" ? rentalUi.greenDeep : rentalUi.muted,
                    fontWeight: 700
                  }}
                />
                <Typography sx={{ color: rentalUi.muted }}>Booking {booking.bookingReference ?? booking.id}</Typography>
              </Stack>
            </Box>
          </Stack>

          <Stack spacing={0.7}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <CalendarMonthRoundedIcon sx={{ color: rentalUi.green, fontSize: 17 }} />
              <Typography sx={{ color: rentalUi.muted, minWidth: 72 }}>Dates</Typography>
              <Typography sx={{ fontWeight: 700 }}>{booking.startDate ?? "-"}  •  {booking.endDate ?? "-"}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <LocationOnRoundedIcon sx={{ color: rentalUi.green, fontSize: 17 }} />
              <Typography sx={{ color: rentalUi.muted, minWidth: 72 }}>Branches</Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {booking.pickupBranch ?? "Pickup pending"}  →  {booking.dropoffBranch ?? "Return pending"}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <DirectionsCarRoundedIcon sx={{ color: rentalUi.green, fontSize: 17 }} />
              <Typography sx={{ color: rentalUi.muted, minWidth: 72 }}>Mode</Typography>
              <Typography sx={{ fontWeight: 700 }}>{vehicle?.mode ?? "Self-drive"}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ ...cardSx, mb: 1.35 }}>
        <CardContent sx={{ p: 1.25, "&:last-child": { pb: 1.25 } }}>
          <Typography sx={{ fontWeight: 800, fontSize: "15px !important", mb: 0.7 }}>Payment summary</Typography>
          <Stack spacing={0.5}>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ color: rentalUi.muted }}>Rental ({pricing.durationDays} day{pricing.durationDays === 1 ? "" : "s"})</Typography>
              <Typography>{formatInr(pricing.rentalSubtotal)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ color: rentalUi.muted }}>Refundable deposit</Typography>
              <Typography>{formatInr(pricing.refundableDeposit)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ color: rentalUi.muted }}>Taxes & fees</Typography>
              <Typography>{formatInr(Math.max(0, pricing.totalEstimated - pricing.rentalSubtotal - pricing.refundableDeposit))}</Typography>
            </Stack>
            <Divider sx={{ my: 0.45 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={0.55} alignItems="center">
                <PaymentsRoundedIcon sx={{ color: rentalUi.green, fontSize: 17 }} />
                <Typography sx={{ fontWeight: 800 }}>Total paid</Typography>
              </Stack>
              <Typography sx={{ fontWeight: 800, color: rentalUi.greenDeep, fontSize: "20px !important" }}>
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
