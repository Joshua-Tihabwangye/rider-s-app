import React from "react";
import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import type { RentalPaymentReceipt, RentalPaymentTransaction } from "../../../store/types";
import { formatUgxAmount } from "../../../features/rental/payment";

interface ReceiptCardProps {
  receipt: RentalPaymentReceipt;
  transaction: RentalPaymentTransaction;
}

export default function ReceiptCard({ receipt, transaction }: ReceiptCardProps): React.JSX.Element {
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
      <CardContent sx={{ px: 1.75, py: 1.8 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.2 }}>
          EVzone Rental Receipt
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
          <Typography variant="caption" sx={{ fontSize: 11 }}>Vehicle: {receipt.vehicleName}</Typography>
          <Typography variant="caption" sx={{ fontSize: 11 }}>Duration: {receipt.rentalDurationLabel}</Typography>
          <Typography variant="caption" sx={{ fontSize: 11 }}>Pickup: {receipt.pickupBranch ?? "Pending"}</Typography>
          <Typography variant="caption" sx={{ fontSize: 11 }}>Return: {receipt.dropoffBranch ?? "Pending"}</Typography>
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
          <Typography variant="caption" sx={{ fontSize: 11 }}>Rental subtotal: {formatUgxAmount(receipt.rentalSubtotal)}</Typography>
          <Typography variant="caption" sx={{ fontSize: 11 }}>Chauffeur fee: {formatUgxAmount(receipt.chauffeurFee)}</Typography>
          <Typography variant="caption" sx={{ fontSize: 11 }}>Add-ons: {formatUgxAmount(receipt.addOnsTotal)}</Typography>
          <Typography variant="caption" sx={{ fontSize: 11 }}>One-way fee: {formatUgxAmount(receipt.oneWayFee)}</Typography>
          <Typography variant="caption" sx={{ fontSize: 11 }}>Refundable deposit: {formatUgxAmount(receipt.refundableDeposit)}</Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
            Amount paid: {formatUgxAmount(receipt.amountPaid)}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11 }}>
            Payment status: {receipt.paymentStatus} • Booking status: {receipt.bookingStatus}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
