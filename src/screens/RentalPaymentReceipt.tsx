import React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";

import { useAppData } from "../contexts/AppDataContext";
import {
  CroppedReferenceImage,
  GradientActionButton,
  cardSx,
  formatInr,
  rentalUi,
  screenShellSx
} from "../components/rental/RentalRedesignUI";
import { RENTAL_UI_ASSETS } from "../features/rental/uiAssets";

function ReceiptRow({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={1.2}>
      <Typography sx={{ color: rentalUi.muted }}>{label}</Typography>
      <Typography sx={{ fontWeight: 700, textAlign: "right" }}>{value}</Typography>
    </Stack>
  );
}

export default function RentalPaymentReceipt(): React.JSX.Element {
  const navigate = useNavigate();
  const { transactionId } = useParams();
  const { rental } = useAppData();

  const transaction = rental.paymentTransactions.find((entry) => entry.transactionId === transactionId);
  const receipt = rental.receipts.find((entry) => entry.transactionId === transactionId);

  if (!transactionId || !transaction || !receipt) {
    return <Navigate to="/rental/summary" replace />;
  }

  const handleDownload = (): void => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <Box sx={{ ...screenShellSx, pb: { xs: 13, sm: 6 } }}>
      <Box
        sx={{
          "@media print": {
            "& .no-print": {
              display: "none !important"
            },
            background: "#fff",
            px: 0,
            pt: 0,
            pb: 0,
            minHeight: "auto"
          },
          "@media print and (color)": {
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact"
          }
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 1.6 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ border: `1px solid ${rentalUi.border}`, bgcolor: "#fff" }}
            className="no-print"
          >
            <ArrowBackRoundedIcon />
          </IconButton>
          <Typography sx={{ fontSize: 22, fontWeight: 800 }}>Rental receipt</Typography>
        </Stack>

        <Card
          sx={{
            ...cardSx,
            mb: 1.4,
            position: "relative",
            overflow: "hidden",
            "& .receipt-watermark": {
              position: "absolute",
              right: 16,
              bottom: 20,
              width: 140,
              opacity: 0.08,
              pointerEvents: "none"
            }
          }}
        >
          <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
            <Stack direction="row" justifyContent="space-between" spacing={1.1} alignItems="center" sx={{ mb: 1.1 }}>
              <Stack direction="row" spacing={0.8} alignItems="center">
                <Box
                  component="img"
                  src="/favicon.svg"
                  alt="EVzone"
                  sx={{ width: 32, height: 32, borderRadius: 1.2 }}
                />
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: "15px !important" }}>EVzone</Typography>
                  <Typography sx={{ color: rentalUi.muted, fontSize: "10.8px !important" }}>Electric mobility company</Typography>
                </Box>
              </Stack>
              <Typography sx={{ color: rentalUi.greenDeep, fontWeight: 800 }}>#{receipt.receiptNumber}</Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.1 }}>
              <CroppedReferenceImage
                src={RENTAL_UI_ASSETS.cars.suv}
                alt="Vehicle"
                height={74}
                fit="contain"
                scale={1}
                sx={{ width: 118, borderRadius: 2.2, bgcolor: "#F4FBF7" }}
              />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: "14px !important" }}>{receipt.vehicleName}</Typography>
                <Typography sx={{ color: rentalUi.muted, fontSize: "11px !important" }}>
                  Booking ref: {receipt.bookingReference}
                </Typography>
                <Typography sx={{ color: rentalUi.muted, fontSize: "11px !important" }}>
                  Transaction: {receipt.transactionId}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 1 }} />

            <Stack spacing={0.55} sx={{ mb: 0.95 }}>
              <ReceiptRow label="Customer" value={receipt.customerName} />
              <ReceiptRow label="Pickup" value={receipt.pickupBranch ?? "Pending"} />
              <ReceiptRow label="Return" value={receipt.dropoffBranch ?? "Pending"} />
              <ReceiptRow label="Duration" value={receipt.rentalDurationLabel} />
              <ReceiptRow label="Method" value={receipt.paymentMethodLabel} />
            </Stack>

            <Divider sx={{ mb: 1 }} />

            <Stack spacing={0.5}>
              <ReceiptRow label="Rental subtotal" value={formatInr(receipt.rentalSubtotal)} />
              <ReceiptRow label="Chauffeur fee" value={formatInr(receipt.chauffeurFee)} />
              <ReceiptRow label="Add-ons" value={formatInr(receipt.addOnsTotal)} />
              <ReceiptRow label="One-way fee" value={formatInr(receipt.oneWayFee)} />
              <ReceiptRow label="Cross-border fee" value={formatInr(receipt.crossBorderFee)} />
              <ReceiptRow label="Refundable deposit" value={formatInr(receipt.refundableDeposit)} />
            </Stack>

            <Divider sx={{ my: 1 }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={0.55} alignItems="center">
                <ReceiptLongRoundedIcon sx={{ color: rentalUi.green }} />
                <Typography sx={{ fontWeight: 700 }}>Amount paid</Typography>
              </Stack>
              <Typography sx={{ color: rentalUi.greenDeep, fontWeight: 800, fontSize: "20px !important" }}>
                {formatInr(receipt.amountPaid)}
              </Typography>
            </Stack>

            <Box component="img" src="/favicon.svg" alt="EVzone watermark" className="receipt-watermark" />
          </CardContent>
        </Card>

        <Card sx={{ ...cardSx, bgcolor: "#F2FBF6", mb: 1.3 }}>
          <CardContent sx={{ p: 1.2, "&:last-child": { pb: 1.2 } }}>
            <Stack direction="row" spacing={0.65} alignItems="center">
              <DirectionsCarRoundedIcon sx={{ color: rentalUi.green }} />
              <Typography sx={{ color: rentalUi.muted }}>
                This receipt includes EVzone brand watermark and can be saved as PDF.
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Box className="no-print" sx={{ display: "grid", gap: 1.05 }}>
          <GradientActionButton label="Download receipt PDF" onClick={handleDownload} />

          <Card sx={{ ...cardSx, cursor: "pointer" }} onClick={() => navigate(`/rental/history/${receipt.bookingId}`)}>
            <CardContent sx={{ p: 1.05, "&:last-child": { pb: 1.05 } }}>
              <Stack direction="row" spacing={0.7} alignItems="center" justifyContent="center">
                <DownloadRoundedIcon sx={{ color: rentalUi.green }} />
                <Typography sx={{ color: rentalUi.greenDeep, fontWeight: 700 }}>View rental details</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
