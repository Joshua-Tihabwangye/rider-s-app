import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import PaymentStatusPage from "../components/rental/payments/PaymentStatusPage";
import { useAppData } from "../contexts/AppDataContext";
import { formatUgxAmount } from "../features/rental/payment";

export default function RentalPaymentFailed(): React.JSX.Element {
  const navigate = useNavigate();
  const { rental, paymentMethods } = useAppData();
  const booking = rental.booking;
  const activePayment = rental.activePayment;

  if (!activePayment) {
    return <Navigate to="/rental/summary" replace />;
  }

  const paymentMethodLabel =
    paymentMethods.find((method) => method.id === booking.paymentMethodId)?.label ?? "Payment";

  const retryRoute =
    booking.paymentMethodType === "card"
      ? "/rental/payment/card"
      : booking.paymentMethodType === "mobile_money"
        ? "/rental/payment/mobile-money"
        : "/rental/summary";

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
            Payment failed
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
            Your booking is not confirmed yet
          </Typography>
        </Box>
      </Stack>

      <PaymentStatusPage
        type="failed"
        title="Payment was not completed"
        subtitle="Retry this payment or choose a different method."
        bookingReference={booking.bookingReference ?? activePayment.bookingReference}
        paymentMethodLabel={paymentMethodLabel}
        amountLabel={formatUgxAmount(activePayment.amount)}
        reason={booking.paymentFailureReason ?? activePayment.failureReason ?? "Payment was not approved."}
        primaryLabel="Try again"
        secondaryLabel="Choose another payment method"
        tertiaryLabel="Contact support"
        onPrimaryClick={() => navigate(retryRoute)}
        onSecondaryClick={() => navigate("/rental/summary")}
        onTertiaryClick={() => navigate("/help")}
      />
    </ScreenScaffold>
  );
}
