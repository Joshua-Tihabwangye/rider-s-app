import React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import ReceiptCard from "../components/rental/payments/ReceiptCard";
import { useAppData } from "../contexts/AppDataContext";

export default function RentalPaymentReceipt(): React.JSX.Element {
  const navigate = useNavigate();
  const { transactionId } = useParams();
  const { rental } = useAppData();

  const transaction = rental.paymentTransactions.find((entry) => entry.transactionId === transactionId);
  const receipt = rental.receipts.find((entry) => entry.transactionId === transactionId);

  if (!transactionId || !transaction || !receipt) {
    return <Navigate to="/rental/summary" replace />;
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
            Rental receipt
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
            Transaction {transactionId}
          </Typography>
        </Box>
      </Stack>

      <ReceiptCard receipt={receipt} transaction={transaction} />

      <Button
        fullWidth
        variant="contained"
        onClick={() => navigate(`/rental/history/${receipt.bookingId}`)}
        sx={{
          borderRadius: 5,
          py: 1,
          textTransform: "none",
          fontWeight: 700,
          bgcolor: "primary.main",
          color: "#022C22",
          "&:hover": { bgcolor: "#06e29a" }
        }}
      >
        View rental details
      </Button>
    </ScreenScaffold>
  );
}
