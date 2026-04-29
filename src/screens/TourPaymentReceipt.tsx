import React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Box, Button, Card, CardContent, Divider, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import { useAppData } from "../contexts/AppDataContext";
import { formatUgxAmount } from "../features/tours/payment";

export default function TourPaymentReceipt(): React.JSX.Element {
  const navigate = useNavigate();
  const { transactionId } = useParams();
  const { tours } = useAppData();

  const transaction = tours.paymentTransactions.find((entry) => entry.transactionId === transactionId);
  const receipt = tours.receipts.find((entry) => entry.transactionId === transactionId);

  if (!transactionId || !transaction || !receipt) {
    return <Navigate to="/tours" replace />;
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
            Tour receipt
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
            Transaction {transactionId}
          </Typography>
        </Box>
      </Stack>

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
        <CardContent sx={{ px: 1.75, py: 1.8 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.2 }}>
            EVzone Tour Receipt
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
            Receipt #{receipt.receiptNumber}
          </Typography>

          <Divider sx={{ my: 1.2 }} />

          <Stack spacing={0.5}>
            <Typography variant="caption" sx={{ fontSize: 11 }}>Transaction ID: {receipt.transactionId}</Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>Booking ref: {receipt.bookingReference}</Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>Customer: {receipt.customerName}</Typography>
            {receipt.customerPhone && <Typography variant="caption" sx={{ fontSize: 11 }}>Phone: {receipt.customerPhone}</Typography>}
            {receipt.customerEmail && <Typography variant="caption" sx={{ fontSize: 11 }}>Email: {receipt.customerEmail}</Typography>}
            <Typography variant="caption" sx={{ fontSize: 11 }}>Tour: {receipt.tourTitle}</Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>Location: {receipt.location}</Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>Duration: {receipt.duration}</Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>Date: {receipt.date ?? "Pending"}</Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>Guests: {receipt.guests}</Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              Method: {transaction.provider ? `${receipt.paymentMethodLabel} (${transaction.provider})` : receipt.paymentMethodLabel}
            </Typography>
            {transaction.maskedCardNumber && (
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                Card: {transaction.maskedCardNumber}
              </Typography>
            )}
          </Stack>

          <Divider sx={{ my: 1.2 }} />

          <Stack spacing={0.45}>
            <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
              Amount paid: {formatUgxAmount(receipt.amountPaid)}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              Payment status: {receipt.paymentStatus} • Booking status: {receipt.bookingStatus}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={1}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => navigate(`/tours/${transaction.tourId}/confirmation`)}
          sx={{
            borderRadius: 5,
            py: 1,
            textTransform: "none",
            fontWeight: 700,
            bgcolor: "primary.main",
            color: "#FFFFFF",
            "&:hover": { bgcolor: "#06e29a" }
          }}
        >
          Continue to confirmation
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate(`/tours/${transaction.tourId}`)}
          sx={{
            borderRadius: 5,
            py: 1,
            textTransform: "none",
            fontWeight: 600
          }}
        >
          View tour details
        </Button>
      </Stack>
    </ScreenScaffold>
  );
}
