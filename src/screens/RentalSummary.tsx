import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
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
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import { useAppData } from "../contexts/AppDataContext";
import {
  CroppedReferenceImage,
  GradientActionButton,
  cardSx,
  formatInr,
  rentalUi,
  screenShellSx
} from "../components/rental/RentalRedesignUI";
import { buildRentalPricing, getRentalBookingVehicle } from "../features/rental/booking";
import { getVehicleImageFromName } from "../features/rental/uiAssets";

function PaymentIcon({ type }: { type: "wallet" | "card" | "mobile_money" }): React.JSX.Element {
  if (type === "wallet") {
    return <AccountBalanceWalletRoundedIcon sx={{ color: rentalUi.title }} />;
  }
  if (type === "card") {
    return <CreditCardRoundedIcon sx={{ color: rentalUi.title }} />;
  }
  return <PhoneIphoneRoundedIcon sx={{ color: rentalUi.title }} />;
}

export default function RentalSummary(): React.JSX.Element {
  const navigate = useNavigate();
  const { rental, paymentMethods, walletBalance, actions } = useAppData();

  const vehicle = getRentalBookingVehicle(rental.vehicles, rental.booking, rental.selectedVehicleId);
  const pricing = buildRentalPricing(vehicle, rental.booking);

  const paymentOptions = paymentMethods.filter((method) => method.type !== "cash");
  const [paymentMethodId, setPaymentMethodId] = useState(
    rental.booking.paymentMethodId ?? paymentOptions[0]?.id ?? "pm_wallet"
  );
  const [error, setError] = useState<string>("");

  const charges = useMemo(() => {
    const rentalSubtotal = Math.max(pricing.rentalSubtotal, pricing.dailyRate || 3597);
    const insurance = 180;
    const serviceFee = 299;
    const securityDeposit = Math.max(2000, pricing.refundableDeposit);
    const taxes = Math.round((rentalSubtotal + insurance + serviceFee) * 0.18);
    const discount = 481;
    const total = rentalSubtotal + insurance + serviceFee + securityDeposit + taxes - discount;

    return {
      rentalSubtotal,
      insurance,
      serviceFee,
      securityDeposit,
      taxes,
      discount,
      total
    };
  }, [pricing.dailyRate, pricing.refundableDeposit, pricing.rentalSubtotal]);

  const selectedMethod = paymentOptions.find((method) => method.id === paymentMethodId) ?? paymentOptions[0];
  const walletInsufficient = selectedMethod?.type === "wallet" && walletBalance < charges.total;

  if (!vehicle) {
    return (
      <Box sx={screenShellSx}>
        <Typography>No rental booking found.</Typography>
      </Box>
    );
  }

  const vehicleLabel = vehicle.name.includes("Nissan") ? "City EV" : vehicle.name.includes("Kona") ? "Family SUV" : "Executive EV";

  return (
    <Box sx={screenShellSx}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: rentalUi.title }}>
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography sx={{ fontSize: 22, fontWeight: 800 }}>Rental summary</Typography>
      </Stack>

      <Card sx={{ ...cardSx, mb: 1.5 }}>
        <CardContent sx={{ p: 1.45, "&:last-child": { pb: 1.45 } }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.2} alignItems="center" sx={{ mb: 1.15 }}>
            <CroppedReferenceImage
              src={getVehicleImageFromName(vehicle.name)}
              alt={vehicleLabel}
              height={124}
              scale={1}
              sx={{ width: 230, borderRadius: 2.5 }}
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontSize: 58/2, fontWeight: 800 }}>{vehicleLabel}</Typography>
              <Chip
                icon={<DirectionsCarRoundedIcon />}
                label={rental.booking.rentalMode === "chauffeur" ? "Chauffeur" : "Self-drive"}
                sx={{ mt: 0.8, bgcolor: rentalUi.greenSoft, color: rentalUi.greenDeep, fontWeight: 700 }}
              />
            </Box>
          </Stack>

          <Divider sx={{ my: 0.7 }} />
          <Stack spacing={0.85}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarMonthRoundedIcon sx={{ color: rentalUi.green }} />
              <Typography sx={{ width: 90, color: rentalUi.muted }}>Pick-up</Typography>
              <Typography sx={{ fontWeight: 600 }}>{rental.booking.startDate ?? "24 May 2025 • 10:00 AM"}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarMonthRoundedIcon sx={{ color: rentalUi.green }} />
              <Typography sx={{ width: 90, color: rentalUi.muted }}>Return</Typography>
              <Typography sx={{ fontWeight: 600 }}>{rental.booking.endDate ?? "27 May 2025 • 10:00 AM"}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <LocationOnRoundedIcon sx={{ color: rentalUi.green }} />
              <Typography sx={{ width: 90, color: rentalUi.muted }}>Branch</Typography>
              <Typography sx={{ fontWeight: 600 }}>{rental.booking.pickupBranch ?? "EVzone Koramangala"}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ ...cardSx, mb: 1.25 }}>
        <CardContent sx={{ p: 1.45, "&:last-child": { pb: 1.45 } }}>
          <Typography sx={{ fontSize: 34/2, fontWeight: 700, mb: 0.95 }}>Charges breakdown</Typography>
          <Stack spacing={0.65}>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ color: rentalUi.muted }}>Daily rental (3 days × {formatInr(Math.round(charges.rentalSubtotal / 3))})</Typography>
              <Typography>{formatInr(charges.rentalSubtotal)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between"><Typography sx={{ color: rentalUi.muted }}>Insurance</Typography><Typography>{formatInr(charges.insurance)}</Typography></Stack>
            <Stack direction="row" justifyContent="space-between"><Typography sx={{ color: rentalUi.muted }}>Service fee</Typography><Typography>{formatInr(charges.serviceFee)}</Typography></Stack>
            <Stack direction="row" justifyContent="space-between"><Typography sx={{ color: rentalUi.muted }}>Security deposit (refundable)</Typography><Typography>{formatInr(charges.securityDeposit)}</Typography></Stack>
            <Stack direction="row" justifyContent="space-between"><Typography sx={{ color: rentalUi.muted }}>Taxes (18%)</Typography><Typography>{formatInr(charges.taxes)}</Typography></Stack>
            <Stack direction="row" justifyContent="space-between"><Typography sx={{ color: rentalUi.orange }}>Discount (GREEN10)</Typography><Typography sx={{ color: rentalUi.orange }}>- {formatInr(charges.discount)}</Typography></Stack>
            <Divider sx={{ mt: 0.6, mb: 0.2 }} />
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ fontSize: 39/2, fontWeight: 800 }}>Total</Typography>
              <Typography sx={{ fontSize: 50/2, fontWeight: 800, color: rentalUi.greenDeep }}>{formatInr(charges.total)}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ ...cardSx, mb: 1.25 }}>
        <CardContent sx={{ p: 1.35, "&:last-child": { pb: 1.35 } }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center">
              <LocalOfferRoundedIcon sx={{ color: rentalUi.green }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 33/2 }}>Promo code</Typography>
                <Typography sx={{ color: rentalUi.muted, fontSize: 16 }}>Apply code to get discount</Typography>
              </Box>
            </Stack>
            <Typography sx={{ color: rentalUi.green, fontWeight: 700, fontSize: 34/2 }}>Apply</Typography>
          </Stack>
        </CardContent>
      </Card>

      <Typography sx={{ fontSize: 42/2, fontWeight: 700, mb: 0.8 }}>Payment method</Typography>
      <Stack direction="row" spacing={1.1} sx={{ mb: 1.35 }}>
        {paymentOptions.map((method) => {
          const selected = method.id === paymentMethodId;
          const type = method.type as "wallet" | "card" | "mobile_money";
          return (
            <Card
              key={method.id}
              onClick={() => setPaymentMethodId(method.id)}
              sx={{
                ...cardSx,
                flex: 1,
                cursor: "pointer",
                borderColor: selected ? rentalUi.green : rentalUi.border,
                bgcolor: selected ? rentalUi.greenSoft : "#fff"
              }}
            >
              <CardContent sx={{ p: 1.2, "&:last-child": { pb: 1.2 } }}>
                <Stack direction="row" spacing={0.8} alignItems="center" justifyContent="center">
                  <PaymentIcon type={type} />
                  <Typography sx={{ fontWeight: 700 }}>{type === "mobile_money" ? "Mobile money" : method.type === "wallet" ? "Wallet" : "Card"}</Typography>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      {walletInsufficient ? (
        <Alert severity="warning" sx={{ mb: 1.15 }}>
          Wallet balance is lower than this total. Select card/mobile money or top up your wallet.
        </Alert>
      ) : null}
      {error ? <Alert severity="error" sx={{ mb: 1.15 }}>{error}</Alert> : null}

      <GradientActionButton
        label="Proceed to payment"
        onClick={() => {
          setError("");
          if (!selectedMethod) {
            setError("Select a payment method.");
            return;
          }
          if (walletInsufficient) {
            setError("Wallet balance is insufficient for this amount.");
            return;
          }

          const session = actions.initializeRentalPayment({
            paymentMethodId,
            amount: charges.total
          });

          if (!session) {
            setError("Unable to initialize payment. Please try again.");
            return;
          }

          actions.updateRentalBooking({
            paymentMethodId,
            priceEstimate: formatInr(charges.total)
          });

          if (selectedMethod.type === "wallet") {
            navigate("/rental/payment/wallet");
            return;
          }
          if (selectedMethod.type === "card") {
            navigate("/rental/payment/card");
            return;
          }
          navigate("/rental/payment/mobile-money");
        }}
      />

      <Card sx={{ ...cardSx, bgcolor: "#F2FBF6", mt: 1.45 }}>
        <CardContent sx={{ p: 1.35, "&:last-child": { pb: 1.35 } }}>
          <Stack direction="row" spacing={0.95} alignItems="center">
            <CheckCircleRoundedIcon sx={{ color: rentalUi.green }} />
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 19 }}>Secure & trusted payments</Typography>
              <Typography sx={{ color: rentalUi.muted, fontSize: 16.5 }}>
                Your payment details are encrypted and safe with us.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
