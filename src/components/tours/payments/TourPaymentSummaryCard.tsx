import React from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import TourRoundedIcon from "@mui/icons-material/TourRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import { formatUgxAmount } from "../../../features/tours/payment";

interface TourPaymentSummaryCardProps {
  customerName: string;
  bookingReference: string;
  tourTitle: string;
  paymentMethodLabel: string;
  amount: number;
  date?: string;
  guests?: number;
}

export default function TourPaymentSummaryCard({
  customerName,
  bookingReference,
  tourTitle,
  paymentMethodLabel,
  amount,
  date,
  guests
}: TourPaymentSummaryCardProps): React.JSX.Element {
  return (
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
      <CardContent sx={{ px: 1.75, py: 1.7 }}>
        <Stack spacing={0.8}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ConfirmationNumberRoundedIcon sx={{ fontSize: 16, color: "#475569" }} />
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Booking ref: {bookingReference}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <TourRoundedIcon sx={{ fontSize: 16, color: "primary.main" }} />
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Tour: {tourTitle}
            </Typography>
          </Stack>
          {guests ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <PeopleAltRoundedIcon sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }} />
              <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                Guests: {guests}
              </Typography>
            </Stack>
          ) : null}
          {date ? (
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Date: {date}
            </Typography>
          ) : null}
        </Stack>

        <Box sx={{ mt: 1.15 }}>
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
            Customer
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {customerName}
          </Typography>
        </Box>

        <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mt: 1.2 }}>
          <Box>
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Payment method
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {paymentMethodLabel}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Amount
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
              {formatUgxAmount(amount)}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
