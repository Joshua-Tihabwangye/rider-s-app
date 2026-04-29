import React, { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import TourPaymentSummaryCard from "../components/tours/payments/TourPaymentSummaryCard";
import { useAppData } from "../contexts/AppDataContext";
import {
  TourCardFormErrors,
  formatCardNumberInput,
  formatExpiryInput,
  maskCardNumber,
  normalizeDigits,
  resolveCardOutcome,
  validateCardForm
} from "../features/tours/payment";

export default function TourPaymentCard(): React.JSX.Element {
  const navigate = useNavigate();
  const { tours, paymentMethods, actions } = useAppData();
  const activePayment = tours.activePayment;

  const [cardholderName, setCardholderName] = useState(activePayment?.customerName ?? "");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingPhone, setBillingPhone] = useState(activePayment?.customerPhone ?? "");
  const [billingEmail, setBillingEmail] = useState(activePayment?.customerEmail ?? "");
  const [errors, setErrors] = useState<TourCardFormErrors>({});
  const [formError, setFormError] = useState<string>("");
  const showTestHelpers = Boolean((import.meta as ImportMeta).env.DEV);

  const selectedTour = useMemo(
    () => tours.tours.find((entry) => entry.id === tours.booking.tourId) ?? tours.tours[0] ?? null,
    [tours.booking.tourId, tours.tours]
  );

  if (!activePayment) {
    return <Navigate to="/tours" replace />;
  }

  const paymentMethodLabel =
    paymentMethods.find((method) => method.id === activePayment.paymentMethodId)?.label ?? "Bank card";

  const handlePayNow = () => {
    const validationErrors = validateCardForm({ cardholderName, cardNumber, expiry, cvv });
    if (activePayment.customerEmail && !billingEmail.trim()) {
      setFormError("Billing email is required for this account.");
      setErrors(validationErrors);
      return;
    }
    if (activePayment.customerPhone && !billingPhone.trim()) {
      setFormError("Billing phone is required for this account.");
      setErrors(validationErrors);
      return;
    }
    setErrors(validationErrors);
    setFormError("");
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const outcome = resolveCardOutcome(cardNumber);
    if (!outcome) {
      setFormError("Use one of the provided test card numbers for this simulation.");
      return;
    }

    const digits = normalizeDigits(cardNumber);
    actions.updateTourPaymentSession({
      status: "processing",
      gatewayOutcome: outcome,
      cardHolderName: cardholderName.trim(),
      cardLast4: digits.slice(-4),
      maskedCardNumber: maskCardNumber(cardNumber),
      billingPhone: billingPhone.trim() || undefined,
      billingEmail: billingEmail.trim() || undefined,
      failureReason: undefined
    });
    navigate("/tours/payment/processing");
  };

  return (
    <ScreenScaffold>
      <Stack direction="row" spacing={1.2} alignItems="center">
        <IconButton
          size="small"
          aria-label="Back"
          onClick={() => navigate(-1)}
          sx={{
            borderRadius: 5,
            bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(134,239,172,0.2)"),
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
            EVzone Card Gateway
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
            Secure simulated payment
          </Typography>
        </Box>
      </Stack>

      <TourPaymentSummaryCard
        customerName={activePayment.customerName}
        bookingReference={activePayment.bookingReference}
        tourTitle={selectedTour?.title ?? "EV tour"}
        paymentMethodLabel={paymentMethodLabel}
        amount={activePayment.amount}
        date={tours.booking.date}
        guests={tours.booking.guests}
      />

      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)",
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(134,239,172,0.16)")
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Stack spacing={1.2}>
            <Alert severity="info" icon={<LockRoundedIcon fontSize="inherit" />}>
              Secure simulated payment. CVV is never stored.
            </Alert>
            {formError && <Alert severity="error">{formError}</Alert>}

            <TextField
              label="Cardholder name"
              value={cardholderName}
              onChange={(event) => setCardholderName(event.target.value)}
              error={Boolean(errors.cardholderName)}
              helperText={errors.cardholderName}
              fullWidth
            />
            <TextField
              label="Card number"
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(event) => setCardNumber(formatCardNumberInput(event.target.value))}
              error={Boolean(errors.cardNumber)}
              helperText={errors.cardNumber}
              fullWidth
            />
            <Stack direction="row" spacing={1}>
              <TextField
                label="Expiry"
                placeholder="MM/YY"
                value={expiry}
                onChange={(event) => setExpiry(formatExpiryInput(event.target.value))}
                error={Boolean(errors.expiry)}
                helperText={errors.expiry}
                fullWidth
              />
              <TextField
                label="CVV"
                placeholder="123"
                value={cvv}
                onChange={(event) => setCvv(normalizeDigits(event.target.value).slice(0, 4))}
                error={Boolean(errors.cvv)}
                helperText={errors.cvv}
                fullWidth
              />
            </Stack>

            <TextField
              label="Billing phone"
              value={billingPhone}
              onChange={(event) => setBillingPhone(event.target.value)}
              fullWidth
            />
            <TextField
              label="Billing email"
              value={billingEmail}
              onChange={(event) => setBillingEmail(event.target.value)}
              fullWidth
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handlePayNow}
              sx={{
                borderRadius: 5,
                py: 1,
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "primary.main",
                color: "#FFFFFF",
                "&:hover": { bgcolor: "#06e29a" }
              }}
            >
              Pay now
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {showTestHelpers && (
        <Card
          elevation={0}
          sx={{
            borderRadius: 2,
            border: "1px solid rgba(249,115,22,0.35)",
            bgcolor: "rgba(249,115,22,0.07)"
          }}
        >
          <CardContent sx={{ px: 1.75, py: 1.6 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#C2410C", mb: 0.5 }}>
              Test card numbers
            </Typography>
            <Typography variant="caption" sx={{ display: "block", fontSize: 11 }}>
              4242 4242 4242 4242 = successful payment
            </Typography>
            <Typography variant="caption" sx={{ display: "block", fontSize: 11 }}>
              4000 0000 0000 0002 = failed payment
            </Typography>
            <Typography variant="caption" sx={{ display: "block", fontSize: 11 }}>
              4000 0000 0000 9995 = insufficient funds
            </Typography>
            <Typography variant="caption" sx={{ display: "block", fontSize: 11 }}>
              4000 0000 0000 3220 = requires OTP verification
            </Typography>
          </CardContent>
        </Card>
      )}
    </ScreenScaffold>
  );
}
