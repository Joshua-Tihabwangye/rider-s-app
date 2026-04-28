import React, { useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Box, Card, CardContent, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import PaymentStatusPage from "../components/rental/payments/PaymentStatusPage";
import { useAppData } from "../contexts/AppDataContext";
import { formatRentalDateRange } from "../features/rental/booking";
import { formatUgxAmount } from "../features/rental/payment";

export default function RentalPaymentSuccess(): React.JSX.Element {
  const navigate = useNavigate();
  const { rental, paymentMethods, actions } = useAppData();
  const booking = rental.booking;
  const activePayment = rental.activePayment;

  const transaction = useMemo(() => {
    if (!booking.transactionId) {
      return rental.paymentTransactions[0] ?? null;
    }
    return rental.paymentTransactions.find((entry) => entry.transactionId === booking.transactionId) ?? null;
  }, [booking.transactionId, rental.paymentTransactions]);

  const vehicle = useMemo(
    () => rental.vehicles.find((entry) => entry.id === booking.vehicleId) ?? rental.vehicles[0] ?? null,
    [booking.vehicleId, rental.vehicles]
  );

  if (!activePayment || !transaction) {
    return <Navigate to="/rental/summary" replace />;
  }

  const paymentMethodLabel =
    paymentMethods.find((method) => method.id === booking.paymentMethodId)?.label ?? transaction.paymentMethodLabel;

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
            Payment successful
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
            Rental booking confirmed
          </Typography>
        </Box>
      </Stack>

      <PaymentStatusPage
        type="success"
        title="Rental booking confirmed"
        subtitle={`Paid by ${activePayment.customerName}`}
        bookingReference={booking.bookingReference ?? activePayment.bookingReference}
        paymentMethodLabel={paymentMethodLabel}
        amountLabel={formatUgxAmount(transaction.amountPaid)}
        transactionId={transaction.transactionId}
        primaryLabel="View rental details"
        secondaryLabel="Back to rentals"
        tertiaryLabel="Download receipt"
        onPrimaryClick={() => navigate(`/rental/history/${booking.id}`)}
        onSecondaryClick={() => {
          actions.resetRentalPayment();
          navigate("/rental");
        }}
        onTertiaryClick={() => navigate(`/rental/payment/receipt/${transaction.transactionId}`)}
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
        <CardContent sx={{ px: 1.75, py: 1.65 }}>
          <Stack spacing={0.45}>
            <Typography variant="caption" sx={{ fontSize: 11 }}>Customer: {activePayment.customerName}</Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>Vehicle: {vehicle?.name ?? "EV rental"}</Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              Rental dates: {formatRentalDateRange(booking.startDate, booking.endDate)}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              Pickup: {booking.pickupBranch ?? "Pending"} • Return: {booking.dropoffBranch ?? "Pending"}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              Date/time: {new Date(transaction.paidAt).toLocaleString("en-UG")}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </ScreenScaffold>
  );
}
