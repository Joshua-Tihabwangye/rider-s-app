import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import PaymentSummaryCard from "../components/rental/payments/PaymentSummaryCard";
import PaymentProcessingState from "../components/rental/payments/PaymentProcessingState";
import { useAppData } from "../contexts/AppDataContext";
import { resolveGatewayFailure } from "../features/rental/payment";

export default function RentalPaymentProcessing(): React.JSX.Element {
  const navigate = useNavigate();
  const { rental, paymentMethods, actions } = useAppData();
  const activePayment = rental.activePayment;
  const vehicle = useMemo(
    () => rental.vehicles.find((entry) => entry.id === rental.booking.vehicleId) ?? rental.vehicles[0] ?? null,
    [rental.booking.vehicleId, rental.vehicles]
  );

  const paymentMethodLabel =
    paymentMethods.find((method) => method.id === activePayment?.paymentMethodId)?.label ?? "Payment";

  useEffect(() => {
    if (!activePayment) {
      navigate("/rental/summary", { replace: true });
      return;
    }

    const timer = window.setTimeout(() => {
      const outcome = activePayment.gatewayOutcome ?? "success";

      if (outcome === "requires_verification") {
        actions.updateRentalPaymentSession({ status: "requires_verification" });
        navigate("/rental/payment/verify", { replace: true });
        return;
      }

      if (outcome === "success") {
        const tx = actions.completeRentalPayment({
          paymentMethodLabel,
          maskedCardNumber: activePayment.maskedCardNumber,
          provider: activePayment.provider,
          mobileMoneyPhone: activePayment.mobileMoneyPhone,
          billingEmail: activePayment.billingEmail,
          billingPhone: activePayment.billingPhone
        });
        if (tx) {
          navigate("/rental/confirmation", { replace: true });
        } else {
          navigate("/rental/payment/failed", { replace: true });
        }
        return;
      }

      const failure = resolveGatewayFailure(outcome);
      actions.failRentalPayment({ status: failure.status, reason: failure.reason });
      navigate("/rental/payment/failed", { replace: true });
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

      <PaymentSummaryCard
        customerName={activePayment.customerName}
        bookingReference={activePayment.bookingReference}
        vehicleName={vehicle?.name ?? "EV rental"}
        paymentMethodLabel={paymentMethodLabel}
        amount={activePayment.amount}
      />

      <PaymentProcessingState
        bookingReference={activePayment.bookingReference}
        paymentMethodLabel={paymentMethodLabel}
        amount={activePayment.amount}
        paymentMethodType={activePayment.paymentMethodType}
        gatewayOutcome={activePayment.gatewayOutcome}
      />
    </ScreenScaffold>
  );
}
