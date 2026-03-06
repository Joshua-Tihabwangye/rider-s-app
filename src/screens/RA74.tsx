import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate, useLocation } from "react-router-dom";
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
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import CorporateFareRoundedIcon from "@mui/icons-material/CorporateFareRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";
import LocalGasStationRoundedIcon from "@mui/icons-material/LocalGasStationRounded";
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";

import MobileShell from "../components/MobileShell";

const formatPrice = (amount: number): string => `UGX ${amount.toLocaleString()}`;

const bookerTypeLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  individual: { label: "Individual", icon: <PersonRoundedIcon sx={{ fontSize: 16 }} /> },
  organization: { label: "Organization", icon: <CorporateFareRoundedIcon sx={{ fontSize: 16 }} /> },
  business: { label: "Business", icon: <BusinessRoundedIcon sx={{ fontSize: 16 }} /> }
};

const fuelIcons: Record<string, React.ReactNode> = {
  EV: <BatteryChargingFullRoundedIcon sx={{ fontSize: 16, color: "#16A34A" }} />,
  Petrol: <LocalGasStationRoundedIcon sx={{ fontSize: 16, color: "#F59E0B" }} />,
  Diesel: <LocalGasStationRoundedIcon sx={{ fontSize: 16, color: "#6366F1" }} />,
  Hybrid: <ElectricCarRoundedIcon sx={{ fontSize: 16, color: "#0EA5E9" }} />
};

function RentalBookingSummaryPaymentScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    vehicle?: any;
    bookerType?: string;
    driverOption?: string;
    rentalPeriod?: string;
    days?: number;
    pickupLocation?: string;
    returnLocation?: string;
    extras?: { addGps?: boolean; addChildSeat?: boolean; addInsurancePlus?: boolean };
    totalCost?: number;
  } | null;

  const vehicle = state?.vehicle;
  const bookerType = state?.bookerType || "individual";
  const driverOption = state?.driverOption || "self";
  const days = state?.days || 3;
  const pickupLocation = state?.pickupLocation || "Nsambya Hub";
  const returnLocation = state?.returnLocation || pickupLocation;
  const extras = state?.extras || {};
  const totalCost = state?.totalCost || 580000;
  const deposit = vehicle?.deposit || 300000;

  const [paymentMethod, setPaymentMethod] = useState("wallet");

  const vehicleName = vehicle?.name || "Nissan Leaf";
  const vehicleCategory = vehicle?.category || "Hatchback";
  const vehicleFuelType = vehicle?.fuelType || "EV";
  const vehicleSeats = vehicle?.seats || 5;
  const vehicleRange = vehicle?.range || "220 km";

  const bt = bookerTypeLabels[bookerType] || bookerTypeLabels.individual;

  return (
    <>
    {/* Green Header */}
        <Box sx={{ bgcolor: "#03CD8C", px: 2.5, pt: 2, pb: 2, display: "flex", alignItems: "center", justifyContent: "flex-end", position: "relative" }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              position: "absolute",
              left: 20,
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "#FFFFFF",
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" }
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, letterSpacing: "-0.01em", color: "#FFFFFF" }}
          >
            Review & confirm rental
          </Typography>
        </Box>
        <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>


      {/* Vehicle + dates summary */}
      <Card
        elevation={0}
        sx={{
          mb: 1.5,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.2 }}>
            {vehicle?.image ? (
              <Box
                component="img"
                src={vehicle.image}
                alt={vehicleName}
                sx={{ width: 60, height: 44, borderRadius: 1.5, objectFit: "cover" }}
              />
            ) : (
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  bgcolor: (t) =>
                    t.palette.mode === "light" ? "#E0F2FE" : "rgba(15,23,42,0.9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <DirectionsCarRoundedIcon sx={{ fontSize: 26, color: "primary.main" }} />
              </Box>
            )}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
                {vehicleName} • {vehicleCategory}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                {fuelIcons[vehicleFuelType]}
                <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary" }}>
                  {vehicleFuelType} • {vehicleSeats} seats • {vehicleRange}
                </Typography>
              </Stack>
            </Box>
          </Stack>

          {/* Booking details */}
          <Stack spacing={0.4}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              {bt.icon}
              <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary" }}>
                Booking type: {bt.label}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <DirectionsCarRoundedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary" }}>
                {driverOption === "with-driver" ? "With professional driver" : "Self-drive (driver's license required)"}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <CalendarMonthRoundedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary" }}>
                {days} {days === 1 ? "day" : "days"} rental
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <PlaceRoundedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary" }}>
                Pickup: {pickupLocation} • Return: {returnLocation}
              </Typography>
            </Stack>
            {extras.addGps && (
              <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary", pl: 2.75 }}>+ GPS navigation</Typography>
            )}
            {extras.addChildSeat && (
              <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary", pl: 2.75 }}>+ Child seat</Typography>
            )}
            {extras.addInsurancePlus && (
              <Stack direction="row" spacing={0.75} alignItems="center">
                <ShieldRoundedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary" }}>Premium insurance</Typography>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Price breakdown */}
      <Card
        elevation={0}
        sx={{
          mb: 1.5,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary", mb: 0.75, display: "block" }}>
            Price breakdown
          </Typography>
          <Stack spacing={0.35}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11 }}>Rental + extras</Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>{formatPrice(totalCost)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11 }}>Refundable deposit</Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>{formatPrice(deposit)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11 }}>Insurance & roadside support</Typography>
              <Typography variant="caption" sx={{ fontSize: 11, color: "#16A34A" }}>Included</Typography>
            </Stack>
          </Stack>

          <Divider sx={{ my: 1.2, borderColor: (t) => t.palette.divider }} />

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>
                Total due now
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
                {formatPrice(totalCost + deposit)}
              </Typography>
            </Box>
            <Chip
              size="small"
              label="Free cancellation 24h"
              sx={{ borderRadius: 999, fontSize: 10, height: 22, bgcolor: "rgba(22,163,74,0.12)", color: "#16A34A", fontWeight: 600 }}
            />
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
        <CardContent sx={{ px: 1.75, py: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary", mb: 0.75, display: "block" }}>
            Payment method
          </Typography>
          <Stack spacing={0.75}>
            {[
              { key: "wallet", label: "EVzone Wallet", sub: "Balance: UGX 750,000", icon: <AccountBalanceWalletRoundedIcon sx={{ fontSize: 20, color: "primary.main" }} />, activeColor: "#03CD8C" },
              { key: "card", label: "Bank card", sub: "Pay with Visa / MasterCard", icon: <CreditCardRoundedIcon sx={{ fontSize: 20, color: "text.secondary" }} />, activeColor: "#03CD8C" },
              { key: "mobile", label: "Mobile money", sub: "MTN / Airtel", icon: <PhoneIphoneRoundedIcon sx={{ fontSize: 20, color: "text.secondary" }} />, activeColor: "#F59E0B" }
            ].map((pm) => (
              <Card
                key={pm.key}
                elevation={0}
                onClick={() => setPaymentMethod(pm.key)}
                sx={{
                  borderRadius: 2,
                  cursor: "pointer",
                  bgcolor: paymentMethod === pm.key
                    ? `rgba(${pm.activeColor === "#F59E0B" ? "245,158,11" : "3,205,140"},0.1)`
                    : (t) => t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                  border: paymentMethod === pm.key
                    ? `1px solid ${pm.activeColor}`
                    : (t) => t.palette.mode === "light"
                      ? "1px solid rgba(209,213,219,0.9)"
                      : "1px solid rgba(51,65,85,0.9)",
                  transition: "all 0.15s ease"
                }}
              >
                <CardContent sx={{ px: 1.4, py: 0.9, "&:last-child": { pb: 0.9 } }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {pm.icon}
                    <Box>
                      <Typography variant="body2" sx={{ fontSize: 12.5, fontWeight: 600 }}>{pm.label}</Typography>
                      <Typography variant="caption" sx={{ fontSize: 10.5, color: "text.secondary" }}>{pm.sub}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="contained"
        onClick={() => {
          navigate("/payment/process", {
            state: {
              paymentMethod,
              amount: formatPrice(totalCost + deposit),
              description: `${vehicleName} • ${driverOption === "with-driver" ? "With driver" : "Self-drive"} • ${days} ${days === 1 ? "day" : "days"} rental`,
              returnPath: "/rental/confirmation",
              cancelPath: "/rental/summary",
              serviceName: "Rental",
              extraData: state || {}
            }
          });
        }}
        sx={{
          borderRadius: 999,
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
        sx={{ mt: 1, display: "block", fontSize: 11, color: "text.secondary" }}
      >
        By confirming, you agree to the rental terms, deposit conditions, EV usage
        policy, and cancellation terms.
      </Typography>
    </Box>
    </>

  );
}

export default function RiderScreen74RentalBookingSummaryPaymentCanvas_v2() {
  return (
    <>
      <DarkModeToggle />
      <MobileShell>
        <RentalBookingSummaryPaymentScreen />
      </MobileShell>
    </>
  );
}
