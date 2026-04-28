import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, CircularProgress, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import TourPaymentSummaryCard from "../components/tours/payments/TourPaymentSummaryCard";
import { useAppData } from "../contexts/AppDataContext";
import { resolveGatewayFailure } from "../features/tours/payment";

export default function TourPaymentProcessing(): React.JSX.Element {
  const navigate = useNavigate();
  const { tours, paymentMethods, actions } = useAppData();
  const activePayment = tours.activePayment;

  const selectedTour = useMemo(
    () => tours.tours.find((entry) => entry.id === tours.booking.tourId) ?? tours.tours[0] ?? null,
    [tours.booking.tourId, tours.tours]
  );

  const paymentMethodLabel =
    paymentMethods.find((method) => method.id === activePayment?.paymentMethodId)?.label ?? "Payment";

  useEffect(() => {
    if (!activePayment) {
      navigate("/tours", { replace: true });
      return;
    }

    const timer = window.setTimeout(() => {
      const outcome = activePayment.gatewayOutcome ?? "success";

      if (outcome === "requires_verification") {
        actions.updateTourPaymentSession({ status: "requires_verification" });
        navigate("/tours/payment/verify", { replace: true });
        return;
      }

      if (outcome === "success") {
        const tx = actions.completeTourPayment({
          paymentMethodLabel,
          maskedCardNumber: activePayment.maskedCardNumber,
          provider: activePayment.provider,
          mobileMoneyPhone: activePayment.mobileMoneyPhone,
          billingEmail: activePayment.billingEmail,
          billingPhone: activePayment.billingPhone
        });
        if (tx) {
          navigate(`/tours/${tx.tourId}/confirmation`, { replace: true });
        } else {
          navigate("/tours/payment/failed", { replace: true });
        }
        return;
      }

      const failure = resolveGatewayFailure(outcome);
      actions.failTourPayment({ status: failure.status, reason: failure.reason });
      navigate("/tours/payment/failed", { replace: true });
    }, 1500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [actions, activePayment, navigate, paymentMethodLabel]);

  if (!activePayment) {
    return <Box sx={{ minHeight: "100vh", bgcolor: (t) => t.palette.background.default }} />;
  }

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
            EVzone Secure Payment
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
            Gateway processing in progress
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
        <CardContent sx={{ px: 1.75, py: 2.2 }}>
          <Stack spacing={1.2} alignItems="center" textAlign="center">
            <CircularProgress size={34} thickness={4.8} sx={{ color: "#F97316" }} />
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              Processing your payment
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Do not close this page while we confirm your transaction.
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              Booking: {activePayment.bookingReference}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </ScreenScaffold>
  );
}
