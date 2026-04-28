import React from "react";
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

interface PaymentStatusPageProps {
  type: "success" | "failed";
  title: string;
  subtitle: string;
  bookingReference: string;
  paymentMethodLabel: string;
  amountLabel: string;
  transactionId?: string;
  reason?: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
  tertiaryLabel?: string;
  onTertiaryClick?: () => void;
}

export default function PaymentStatusPage({
  type,
  title,
  subtitle,
  bookingReference,
  paymentMethodLabel,
  amountLabel,
  transactionId,
  reason,
  primaryLabel,
  secondaryLabel,
  onPrimaryClick,
  onSecondaryClick,
  tertiaryLabel,
  onTertiaryClick
}: PaymentStatusPageProps): React.JSX.Element {
  const isSuccess = type === "success";

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
      <CardContent sx={{ px: 1.75, py: 2 }}>
        <Stack spacing={1.2} alignItems="center" textAlign="center">
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: isSuccess ? "rgba(34,197,94,0.16)" : "rgba(239,68,68,0.16)"
            }}
          >
            {isSuccess ? (
              <CheckCircleRoundedIcon sx={{ fontSize: 40, color: "#16A34A" }} />
            ) : (
              <ErrorOutlineRoundedIcon sx={{ fontSize: 40, color: "#DC2626" }} />
            )}
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
            {title}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
            {subtitle}
          </Typography>

          <Stack spacing={0.45} sx={{ width: "100%", textAlign: "left", mt: 0.4 }}>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              Booking: {bookingReference}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              Method: {paymentMethodLabel}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              Amount: {amountLabel}
            </Typography>
            {transactionId && (
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                Transaction ID: {transactionId}
              </Typography>
            )}
            {reason && (
              <Typography variant="caption" sx={{ fontSize: 11, color: "#DC2626" }}>
                Reason: {reason}
              </Typography>
            )}
          </Stack>

          <Stack spacing={1} sx={{ width: "100%", mt: 0.7 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={onPrimaryClick}
              sx={{
                borderRadius: 5,
                py: 1,
                textTransform: "none",
                bgcolor: isSuccess ? "primary.main" : "#DC2626",
                color: isSuccess ? "#022C22" : "#FFFFFF",
                "&:hover": {
                  bgcolor: isSuccess ? "#06e29a" : "#B91C1C"
                }
              }}
            >
              {primaryLabel}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={onSecondaryClick}
              sx={{ borderRadius: 5, py: 1, textTransform: "none" }}
            >
              {secondaryLabel}
            </Button>
            {tertiaryLabel && onTertiaryClick && (
              <Button
                fullWidth
                variant="text"
                onClick={onTertiaryClick}
                sx={{ borderRadius: 5, py: 0.9, textTransform: "none" }}
              >
                {tertiaryLabel}
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
