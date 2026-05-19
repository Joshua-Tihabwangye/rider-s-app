import React, { useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

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
import { formatRentalDateTime } from "../features/rental/booking";

export default function RentalPaymentSuccess(): React.JSX.Element {
  const navigate = useNavigate();
  const { rental, actions } = useAppData();
  const booking = rental.booking;
  const activePayment = rental.activePayment;

  const transaction = useMemo(() => {
    if (!booking.transactionId) {
      return rental.paymentTransactions[0] ?? null;
    }
    return rental.paymentTransactions.find((item) => item.transactionId === booking.transactionId) ?? null;
  }, [booking.transactionId, rental.paymentTransactions]);

  if (!activePayment || !transaction) {
    return <Navigate to="/rental/summary" replace />;
  }

  const vehicleName = transaction.vehicleName.includes("Kona") ? "Family SUV" : transaction.vehicleName;
  const pickupDateDisplay = formatRentalDateTime(transaction.startDate ?? booking.startDate);
  const pickupBranchDisplay = transaction.pickupBranch ?? booking.pickupBranch ?? "Nsambya EV Hub, Uganda";

  return (
    <Box sx={screenShellSx}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.4 }}>
        <Box sx={{ width: 64 }} />
        <Typography sx={{ fontSize: 22, fontWeight: 800 }}>Rental success</Typography>
        <Typography
          component="button"
          type="button"
          onClick={() => {
            actions.resetRentalPayment();
            navigate("/rental");
          }}
          sx={{ border: 0, p: 0, bgcolor: "transparent", color: rentalUi.green, fontWeight: 600, fontSize: 21/1.2, cursor: "pointer" }}
        >
          Close
        </Typography>
      </Stack>

      <Divider sx={{ mb: 1.4 }} />

      <CroppedReferenceImage
        src={RENTAL_UI_ASSETS.banners.successHero}
        alt="Rental success"
        height={{ xs: 214, sm: 300 }}
        fit="contain"
        scale={1}
        sx={{ mb: 1.6, bgcolor: "transparent" }}
      />

      <Typography sx={{ textAlign: "center", fontSize: "52px !important", fontWeight: 900, lineHeight: 1.02, mb: 0.65 }}>
        <Box component="span" sx={{ color: rentalUi.greenDeep }}>Payment</Box> successful
      </Typography>
      <Typography sx={{ textAlign: "center", color: rentalUi.muted, fontSize: "16px !important", mb: 1.95, lineHeight: 1.45 }}>
        Your rental is confirmed and all set to go.
        <br />
        We’ve sent the details to your email.
      </Typography>

      <Card sx={{ ...cardSx, mb: 1.4 }}>
        <CardContent sx={{ p: 1.4, "&:last-child": { pb: 1.4 } }}>
          <Stack spacing={0.95}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={0.8} alignItems="center">
                <ConfirmationNumberOutlinedIcon sx={{ color: rentalUi.green }} />
                <Typography sx={{ color: rentalUi.muted }}>Booking reference</Typography>
              </Stack>
              <Typography sx={{ color: rentalUi.greenDeep, fontWeight: 800, fontSize: 34/2 }}>{transaction.bookingReference}</Typography>
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={0.8} alignItems="center">
                <DirectionsCarRoundedIcon sx={{ color: rentalUi.green }} />
                <Typography sx={{ color: rentalUi.muted }}>Vehicle</Typography>
              </Stack>
              <Typography sx={{ fontWeight: 700, fontSize: 36/2 }}>{vehicleName}</Typography>
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={0.8} alignItems="center">
                <CalendarMonthRoundedIcon sx={{ color: rentalUi.green }} />
                <Typography sx={{ color: rentalUi.muted }}>Pickup date & time</Typography>
              </Stack>
              <Typography sx={{ fontWeight: 700 }}>{pickupDateDisplay}</Typography>
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={0.8} alignItems="center">
                <LocationOnRoundedIcon sx={{ color: rentalUi.green }} />
                <Typography sx={{ color: rentalUi.muted }}>Pickup branch</Typography>
              </Stack>
              <Typography sx={{ fontWeight: 700 }}>{pickupBranchDisplay}</Typography>
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={0.8} alignItems="center">
                <AccountBalanceWalletRoundedIcon sx={{ color: rentalUi.green }} />
                <Typography sx={{ color: rentalUi.muted }}>Total paid</Typography>
              </Stack>
              <Typography sx={{ fontWeight: 800, color: rentalUi.greenDeep, fontSize: 44/2 }}>
                {formatInr(transaction.amountPaid)}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ ...cardSx, bgcolor: "#F2FBF6", mb: 1.45 }}>
        <CardContent sx={{ p: 1.35, "&:last-child": { pb: 1.35 } }}>
          <Typography sx={{ color: rentalUi.greenDeep, fontWeight: 800, fontSize: 40/2, mb: 0.7 }}>What’s next?</Typography>
          <Stack spacing={0.7}>
            <Stack direction="row" spacing={0.7} alignItems="center">
              <BadgeOutlinedIcon sx={{ color: rentalUi.green }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 36/2 }}>Bring your driving license</Typography>
                <Typography sx={{ color: rentalUi.muted }}>Original license is required at pickup.</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={0.7} alignItems="center">
              <AccessTimeRoundedIcon sx={{ color: rentalUi.green }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 36/2 }}>Arrive 15 minutes early</Typography>
                <Typography sx={{ color: rentalUi.muted }}>Help us get you on the road faster.</Typography>
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <GradientActionButton
        label="View confirmation"
        onClick={() => navigate(`/rental/history/${booking.id}`)}
        sx={{ mb: 1.1 }}
      />

      <Card
        sx={{
          ...cardSx,
          borderRadius: 99,
          borderColor: rentalUi.green,
          mb: 1.05,
          cursor: "pointer"
        }}
        onClick={() => navigate(`/rental/payment/receipt/${transaction.transactionId}`)}
      >
        <CardContent sx={{ py: 1.1, "&:last-child": { pb: 1.1 } }}>
          <Stack direction="row" spacing={0.8} alignItems="center" justifyContent="center">
            <CheckCircleRoundedIcon sx={{ color: rentalUi.green }} />
            <Typography sx={{ color: rentalUi.greenDeep, fontWeight: 700, fontSize: 40/2 }}>Download receipt</Typography>
          </Stack>
        </CardContent>
      </Card>

      <Typography
        component="button"
        type="button"
        onClick={() => {
          navigate("/history/all?type=rental");
        }}
        sx={{
          border: 0,
          bgcolor: "transparent",
          color: rentalUi.greenDeep,
          fontWeight: 700,
          fontSize: 20,
          mx: "auto",
          display: "block",
          cursor: "pointer",
          transition: "color 160ms ease, text-decoration-color 160ms ease",
          textDecoration: "underline",
          textDecorationColor: "transparent",
          "&:hover": {
            color: rentalUi.green,
            textDecorationColor: rentalUi.green
          }
        }}
      >
        Rental history
      </Typography>
    </Box>
  );
}
