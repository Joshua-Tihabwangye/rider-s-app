import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Divider
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import { useAppData } from "../contexts/AppDataContext";
import {
  buildRentalPricing,
  formatRentalDateRange,
  formatUgx,
  getRentalBookingVehicle
} from "../features/rental/booking";


function RentalBookingSummaryPaymentScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { rental, actions } = useAppData();
  const vehicle = getRentalBookingVehicle(
    rental.vehicles,
    rental.booking,
    rental.selectedVehicleId
  );
  const pricing = buildRentalPricing(vehicle, rental.booking);
  const [paymentMethod, setPaymentMethod] = useState("wallet");

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
              Review & confirm rental
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {vehicle ? `${vehicle.name} • ${vehicle.mode} • ${rental.booking.startDate ?? "Dates selected"}` : "Rental summary"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Vehicle + dates summary */}
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
            <Box>
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
            </Box>
          </Stack>

          <Stack spacing={0.4} sx={{ mb: 0.8 }}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <CalendarMonthRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                {formatRentalDateRange(rental.booking.startDate, rental.booking.endDate)}
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
                Pickup: {rental.booking.pickupBranch ?? "Pickup pending"} • Return: {rental.booking.dropoffBranch ?? "Return pending"}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Price breakdown */}
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
                Total due now
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                {formatUgx(pricing.dueNow)}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Payment method */}
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
            Payment method
          </Typography>
          <Stack spacing={1}>
            <Card
              elevation={0}
              onClick={() => setPaymentMethod("wallet")}
              sx={{
                borderRadius: 2,
                bgcolor:
                  paymentMethod === "wallet"
                    ? "rgba(3,205,140,0.12)"
                    : (t) =>
                        t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                border:
                  paymentMethod === "wallet"
                    ? "1px solid #03CD8C"
                    : (t) =>
                        t.palette.mode === "light"
                          ? "1px solid rgba(209,213,219,0.9)"
                          : "1px solid rgba(51,65,85,0.9)",
                cursor: "pointer"
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccountBalanceWalletRoundedIcon
                    sx={{ fontSize: 20, color: "primary.main" }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>
                      EVzone Wallet
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                    >
                      Balance: UGX 750,000
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              onClick={() => setPaymentMethod("card")}
              sx={{
                borderRadius: 2,
                bgcolor:
                  paymentMethod === "card"
                    ? "rgba(3,105,161,0.12)"
                    : (t) =>
                        t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                border:
                  paymentMethod === "card"
                    ? "1px solid #03CD8C"
                    : (t) =>
                        t.palette.mode === "light"
                          ? "1px solid rgba(209,213,219,0.9)"
                          : "1px solid rgba(51,65,85,0.9)",
                cursor: "pointer"
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CreditCardRoundedIcon
                    sx={{ fontSize: 20, color: (t) => t.palette.text.secondary }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>
                      Bank card
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                    >
                      Pay with Visa / MasterCard
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              onClick={() => setPaymentMethod("mobile")}
              sx={{
                borderRadius: 2,
                bgcolor:
                  paymentMethod === "mobile"
                    ? "rgba(245,158,11,0.12)"
                    : (t) =>
                        t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                border:
                  paymentMethod === "mobile"
                    ? "1px solid #F59E0B"
                    : (t) =>
                        t.palette.mode === "light"
                          ? "1px solid rgba(209,213,219,0.9)"
                          : "1px solid rgba(51,65,85,0.9)",
                cursor: "pointer"
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneIphoneRoundedIcon
                    sx={{ fontSize: 20, color: (t) => t.palette.text.secondary }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>
                      Mobile money
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                    >
                      MTN / Airtel (where supported)
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="contained"
        onClick={() => {
          actions.updateRentalBooking({
            status: "confirmed",
            priceEstimate: formatUgx(pricing.dueNow)
          });
          navigate("/rental/confirmation");
        }}
        sx={{
          borderRadius: 5,
          py: 1.1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: "primary.main",
          color: "#020617",
          "&:hover": { bgcolor: "#06e29a" }
        }}
      >
        Confirm rental booking
      </Button>

      <Typography
        variant="caption"
        sx={{ mt: 1, display: "block", fontSize: 11, color: (t) => t.palette.text.secondary }}
      >
        By confirming, you agree to the rental terms, deposit conditions and EV
        usage policy.
      </Typography>
    </Box>
  );
}

export default function RiderScreen74RentalBookingSummaryPaymentCanvas_v2() {
      return (
    
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (t) => t.palette.background.default
        }}
      >

          <RentalBookingSummaryPaymentScreen />
        
      </Box>
    
  );
}
