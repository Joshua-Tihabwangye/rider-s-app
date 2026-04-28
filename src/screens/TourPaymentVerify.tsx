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

import ScreenScaffold from "../components/ScreenScaffold";
import TourPaymentSummaryCard from "../components/tours/payments/TourPaymentSummaryCard";
import { useAppData } from "../contexts/AppDataContext";

const TEST_OTP = "123456";

export default function TourPaymentVerify(): React.JSX.Element {
  const navigate = useNavigate();
  const { tours, paymentMethods, actions } = useAppData();
  const activePayment = tours.activePayment;
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const selectedTour = useMemo(
    () => tours.tours.find((entry) => entry.id === tours.booking.tourId) ?? tours.tours[0] ?? null,
    [tours.booking.tourId, tours.tours]
  );

  if (!activePayment) {
    return <Navigate to="/tours" replace />;
  }

  if (activePayment.gatewayOutcome !== "requires_verification") {
    return <Navigate to="/tours/payment/processing" replace />;
  }

  const paymentMethodLabel =
    paymentMethods.find((method) => method.id === activePayment.paymentMethodId)?.label ?? "Bank card";

  const handleVerify = () => {
    if (otp.trim() === TEST_OTP) {
      actions.updateTourPaymentSession({ status: "processing" });
      const tx = actions.completeTourPayment({
        paymentMethodLabel,
        maskedCardNumber: activePayment.maskedCardNumber,
        billingPhone: activePayment.billingPhone,
        billingEmail: activePayment.billingEmail
      });
      if (tx) {
        navigate(`/tours/${tx.tourId}/confirmation`, { replace: true });
      } else {
        navigate("/tours/payment/failed", { replace: true });
      }
      return;
    }

    setError("Incorrect OTP. Use test OTP 123456.");
    actions.updateTourPaymentSession({ otpAttempts: activePayment.otpAttempts + 1, status: "requires_verification" });
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
            Verify Card Payment
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
            OTP verification required
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
          border: "1px solid rgba(249,115,22,0.35)",
          bgcolor: "rgba(249,115,22,0.07)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.8 }}>
          <Stack spacing={1.1}>
            <Alert severity="warning">Enter test OTP: 123456</Alert>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="One-time password"
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
              fullWidth
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleVerify}
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
              Verify & complete payment
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </ScreenScaffold>
  );
}
