import React from "react";
import { Card, CardContent, CircularProgress, Stack, Typography } from "@mui/material";
import type { PaymentMethodType, RentalGatewayOutcome } from "../../../store/types";
import { formatUgxAmount } from "../../../features/rental/payment";

interface PaymentProcessingStateProps {
  bookingReference: string;
  paymentMethodLabel: string;
  amount: number;
  paymentMethodType: PaymentMethodType;
  gatewayOutcome?: RentalGatewayOutcome;
}

export default function PaymentProcessingState({
  bookingReference,
  paymentMethodLabel,
  amount,
  paymentMethodType,
  gatewayOutcome
}: PaymentProcessingStateProps): React.JSX.Element {
  return (
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
          {paymentMethodType === "mobile_money" && (
            <Typography variant="caption" sx={{ fontSize: 11, color: "#C2410C" }}>
              Sending payment prompt, then waiting for your approval.
            </Typography>
          )}
          {paymentMethodType === "card" && gatewayOutcome === "requires_verification" && (
            <Typography variant="caption" sx={{ fontSize: 11, color: "#C2410C" }}>
              Card requires verification. You will be redirected to OTP next.
            </Typography>
          )}
          <Typography variant="caption" sx={{ fontSize: 11 }}>
            Booking: {bookingReference}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11 }}>
            Method: {paymentMethodLabel}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {formatUgxAmount(amount)}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
