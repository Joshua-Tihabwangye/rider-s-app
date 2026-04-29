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
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import TourPaymentSummaryCard from "../components/tours/payments/TourPaymentSummaryCard";
import { useAppData } from "../contexts/AppDataContext";
import { formatUgxAmount } from "../features/tours/payment";

export default function TourPaymentWallet(): React.JSX.Element {
  const navigate = useNavigate();
  const { tours, paymentMethods, walletBalance, actions } = useAppData();
  const activePayment = tours.activePayment;
  const [error, setError] = useState<string>("");

  const selectedTour = useMemo(
    () => tours.tours.find((entry) => entry.id === tours.booking.tourId) ?? tours.tours[0] ?? null,
    [tours.booking.tourId, tours.tours]
  );

  if (!activePayment) {
    return <Navigate to="/tours" replace />;
  }

  if (activePayment.paymentMethodType !== "wallet") {
    return <Navigate to="/tours" replace />;
  }

  const paymentMethodLabel =
    paymentMethods.find((method) => method.id === activePayment.paymentMethodId)?.label ?? "EVzone Wallet";

  const walletInsufficient = walletBalance < activePayment.amount;

  const handleWalletPay = () => {
    setError("");
    if (walletInsufficient) {
      setError("Insufficient wallet balance. Top up or choose another payment method.");
      return;
    }

    actions.updateTourPaymentSession({
      status: "processing",
      gatewayOutcome: "success",
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
            EVzone Wallet Payment
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
            Simulated wallet checkout
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
          <Stack spacing={1.1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <AccountBalanceWalletRoundedIcon sx={{ fontSize: 20, color: "primary.main" }} />
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Wallet balance: {formatUgxAmount(walletBalance)}
              </Typography>
            </Stack>

            <Typography variant="caption" sx={{ fontSize: 11 }}>
              Amount to pay: {formatUgxAmount(activePayment.amount)}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              Tour: {selectedTour?.title ?? "EV tour"}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              Schedule: {tours.booking.date ?? selectedTour?.scheduleLabel ?? "Pending"}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              By continuing, this simulated wallet payment will debit your wallet and confirm the booking.
            </Typography>

            {walletInsufficient && (
              <Alert severity="warning">
                Wallet balance is not enough for this payment. Choose another method or top up your wallet.
              </Alert>
            )}
            {error && <Alert severity="error">{error}</Alert>}

            <Button
              fullWidth
              variant="contained"
              onClick={handleWalletPay}
              disabled={walletInsufficient}
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
              Pay with EVzone Wallet
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() =>
                navigate(
                  tours.booking.tourId ? `/tours/${tours.booking.tourId}/summary` : "/tours"
                )
              }
              sx={{ borderRadius: 5, py: 1, textTransform: "none" }}
            >
              Choose another payment method
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </ScreenScaffold>
  );
}
