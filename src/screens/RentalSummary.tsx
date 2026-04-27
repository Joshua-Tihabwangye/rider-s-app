import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Link,
  Stack,
  Typography,
  Button
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
  getRentalBookingVehicle,
  getRentalModeLabel
} from "../features/rental/booking";

function getPaymentIcon(type: "wallet" | "card" | "mobile_money" | "cash"): React.ReactNode {
  if (type === "wallet") {
    return <AccountBalanceWalletRoundedIcon sx={{ fontSize: 20, color: "primary.main" }} />;
  }
  if (type === "mobile_money") {
    return <PhoneIphoneRoundedIcon sx={{ fontSize: 20, color: (t) => t.palette.text.secondary }} />;
  }
  return <CreditCardRoundedIcon sx={{ fontSize: 20, color: (t) => t.palette.text.secondary }} />;
}

function RentalSummaryScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { rental, walletBalance, paymentMethods, actions } = useAppData();
  const vehicle = getRentalBookingVehicle(
    rental.vehicles,
    rental.booking,
    rental.selectedVehicleId
  );
  const pricing = buildRentalPricing(vehicle, rental.booking);
  const customRequest = rental.booking.customRequest;
  const selectedAddOns = useMemo(
    () => customRequest?.addOns.filter((addOn) => addOn.selected) ?? [],
    [customRequest?.addOns]
  );
  const initialPaymentMethodId =
    rental.booking.paymentMethodId ??
    paymentMethods.find((method) => method.isDefault)?.id ??
    paymentMethods[0]?.id ??
    "pm_wallet";
  const [paymentMethodId, setPaymentMethodId] = useState(initialPaymentMethodId);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const selectedPaymentMethod =
    paymentMethods.find((method) => method.id === paymentMethodId) ?? paymentMethods[0];
  const walletInsufficient =
    selectedPaymentMethod?.type === "wallet" && walletBalance < pricing.dueNow;

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
            <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
              Review & confirm rental
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Search • Vehicle • Details • Payment • Confirmation
            </Typography>
          </Box>
        </Box>
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
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
                {vehicle ? `${vehicle.name} • ${vehicle.type}` : "EV rental"}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                {getRentalModeLabel(rental.booking)} • {vehicle?.seats ?? "-"} seats • {vehicle?.range ?? "Range pending"}
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={0.4} sx={{ mb: 0.8 }}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <CalendarMonthRoundedIcon sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }} />
              <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                {formatRentalDateRange(rental.booking.startDate, rental.booking.endDate)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <PlaceRoundedIcon sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }} />
              <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                Pickup: {rental.booking.pickupBranch ?? "Pickup pending"} • Return: {rental.booking.dropoffBranch ?? "Return pending"}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {customRequest && (
        <Card
          elevation={0}
          sx={{
            mb: 2,
            borderRadius: 2,
            bgcolor: "rgba(249,115,22,0.06)",
            border: "1px solid rgba(249,115,22,0.35)"
          }}
        >
          <CardContent sx={{ px: 1.75, py: 1.6 }}>
            <Typography variant="body2" sx={{ fontSize: 12.5, fontWeight: 700, color: "#C2410C", mb: 0.6 }}>
              Custom rental details
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Trip purpose: {customRequest.tripPurpose.replace(/_/g, " ")} • Contact: {customRequest.contactPreference}
            </Typography>
            {selectedAddOns.length > 0 ? (
              <Typography
                variant="caption"
                sx={{ display: "block", mt: 0.5, fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Selected add-ons: {selectedAddOns.map((addOn) => addOn.name).join(", ")}
              </Typography>
            ) : (
              <Typography
                variant="caption"
                sx={{ display: "block", mt: 0.5, fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                No add-ons selected.
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

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
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}>
            Price breakdown
          </Typography>
          <Stack spacing={0.4}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                Rental ({pricing.durationDays} day{pricing.durationDays === 1 ? "" : "s"})
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                {formatUgx(pricing.rentalSubtotal)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                Chauffeur fee
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                {pricing.chauffeurFee > 0 ? formatUgx(pricing.chauffeurFee) : "UGX 0"}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                Add-ons total
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                {pricing.addOnsTotal > 0 ? formatUgx(pricing.addOnsTotal) : "UGX 0"}
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
              <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>
                Total due now
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
                {formatUgx(pricing.dueNow)}
              </Typography>
            </Box>
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
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}>
            Payment method
          </Typography>
          <Stack spacing={1}>
            {paymentMethods
              .filter((method) => method.type !== "cash")
              .map((method) => (
                <Card
                  key={method.id}
                  elevation={0}
                  onClick={() => setPaymentMethodId(method.id)}
                  sx={{
                    borderRadius: 2,
                    bgcolor:
                      paymentMethodId === method.id
                        ? "rgba(3,205,140,0.12)"
                        : (t) =>
                            t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                    border:
                      paymentMethodId === method.id
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
                      {getPaymentIcon(method.type)}
                      <Box>
                        <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>
                          {method.label}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                          {method.type === "wallet"
                            ? `Available balance: ${formatUgx(walletBalance)}`
                            : method.detail || "Payment method available"}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
          </Stack>
          {walletInsufficient && (
            <Alert severity="warning" sx={{ mt: 1.1 }}>
              Your wallet balance is below the total due now. Choose card/mobile money or top up your wallet.
            </Alert>
          )}
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
        <CardContent sx={{ px: 1.75, py: 1.45 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
              />
            }
            label={
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                I agree to the rental terms, deposit policy and vehicle use conditions.
              </Typography>
            }
          />
          <Typography variant="caption" sx={{ display: "block", fontSize: 11, color: (t) => t.palette.text.secondary }}>
            <Link component="button" type="button" underline="hover" sx={{ fontSize: 11 }}>
              View cancellation and refund policy
            </Link>
          </Typography>
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="contained"
        disabled={!acceptedTerms}
        onClick={() => {
          actions.updateRentalBooking({
            status: "confirmed",
            paymentMethodId,
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
          bgcolor: acceptedTerms ? "primary.main" : "#9CA3AF",
          color: acceptedTerms ? "#020617" : "#E5E7EB",
          "&:hover": { bgcolor: acceptedTerms ? "#06e29a" : "#9CA3AF" }
        }}
      >
        Confirm rental
      </Button>
    </Box>
  );
}

export default function RentalSummary(): React.JSX.Element {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (t) => t.palette.background.default
      }}
    >
      <RentalSummaryScreen />
    </Box>
  );
}
