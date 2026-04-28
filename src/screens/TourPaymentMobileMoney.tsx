import React, { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import TourPaymentSummaryCard from "../components/tours/payments/TourPaymentSummaryCard";
import { useAppData } from "../contexts/AppDataContext";
import {
  resolveMobileMoneyOutcome,
  validateMobileMoneyPhone
} from "../features/tours/payment";

const PROVIDERS = ["MTN Mobile Money", "Airtel Money"] as const;

export default function TourPaymentMobileMoney(): React.JSX.Element {
  const navigate = useNavigate();
  const { tours, paymentMethods, actions } = useAppData();
  const activePayment = tours.activePayment;

  const [provider, setProvider] = useState<(typeof PROVIDERS)[number]>(
    activePayment?.provider ?? "MTN Mobile Money"
  );
  const [phoneNumber, setPhoneNumber] = useState(activePayment?.customerPhone ?? "");
  const [formError, setFormError] = useState("");
  const showTestHelpers = Boolean((import.meta as ImportMeta).env.DEV);

  const selectedTour = useMemo(
    () => tours.tours.find((entry) => entry.id === tours.booking.tourId) ?? tours.tours[0] ?? null,
    [tours.booking.tourId, tours.tours]
  );

  if (!activePayment) {
    return <Navigate to="/tours" replace />;
  }

  const paymentMethodLabel =
    paymentMethods.find((method) => method.id === activePayment.paymentMethodId)?.label ?? "Mobile money";

  const handleSendPrompt = () => {
    setFormError("");
    if (!provider) {
      setFormError("Select a provider.");
      return;
    }

    const phoneValidation = validateMobileMoneyPhone(phoneNumber);
    if (phoneValidation) {
      setFormError(phoneValidation);
      return;
    }

    const outcome = resolveMobileMoneyOutcome(phoneNumber);
    if (!outcome) {
      setFormError("Use one of the test numbers to simulate a gateway response.");
      return;
    }

    actions.updateTourPaymentSession({
      status: "processing",
      gatewayOutcome: outcome,
      provider,
      mobileMoneyPhone: phoneNumber.trim(),
      billingPhone: phoneNumber.trim(),
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
            bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)"),
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
            EVzone Mobile Money Gateway
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
            Simulated push prompt checkout
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
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)")
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Stack spacing={1.2}>
            <Alert severity="warning">
              We simulate: sending prompt, waiting approval, then provider response.
            </Alert>
            {formError && <Alert severity="error">{formError}</Alert>}

            <TextField
              select
              label="Provider"
              value={provider}
              onChange={(event) => setProvider(event.target.value as (typeof PROVIDERS)[number])}
              fullWidth
            >
              {PROVIDERS.map((entry) => (
                <MenuItem key={entry} value={entry}>
                  {entry}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Phone number"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              helperText="Use test numbers: 0700000001..0700000004"
              fullWidth
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleSendPrompt}
              sx={{
                borderRadius: 5,
                py: 1,
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "primary.main",
                color: "#022C22",
                "&:hover": { bgcolor: "#06e29a" }
              }}
            >
              Send payment prompt
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
              Test numbers
            </Typography>
            <Typography variant="caption" sx={{ display: "block", fontSize: 11 }}>
              0700000001 = successful payment
            </Typography>
            <Typography variant="caption" sx={{ display: "block", fontSize: 11 }}>
              0700000002 = declined payment
            </Typography>
            <Typography variant="caption" sx={{ display: "block", fontSize: 11 }}>
              0700000003 = timeout
            </Typography>
            <Typography variant="caption" sx={{ display: "block", fontSize: 11 }}>
              0700000004 = insufficient balance
            </Typography>
          </CardContent>
        </Card>
      )}
    </ScreenScaffold>
  );
}
