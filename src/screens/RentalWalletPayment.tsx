import React, { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";

import { useAppData } from "../contexts/AppDataContext";
import {
  CroppedReferenceImage,
  GradientActionButton,
  cardSx,
  formatInr,
  rentalUi,
  screenShellSx
} from "../components/rental/RentalRedesignUI";
import { RENTAL_UI_ASSETS, getVehicleImageFromName } from "../features/rental/uiAssets";

export default function RentalWalletPayment(): React.JSX.Element {
  const navigate = useNavigate();
  const { rental, walletBalance, actions } = useAppData();
  const activePayment = rental.activePayment;
  const vehicle = useMemo(
    () => rental.vehicles.find((entry) => entry.id === rental.booking.vehicleId) ?? rental.vehicles[0] ?? null,
    [rental.booking.vehicleId, rental.vehicles]
  );

  const [splitPayment, setSplitPayment] = useState(false);
  const [error, setError] = useState("");

  if (!activePayment) {
    return <Navigate to="/rental/summary" replace />;
  }

  if (activePayment.paymentMethodType !== "wallet") {
    return <Navigate to="/rental/summary" replace />;
  }

  const amountDue = activePayment.amount;
  const walletInsufficient = walletBalance < amountDue;
  const vehicleLabel = vehicle?.name.includes("Kona") ? "Family SUV" : vehicle?.name ?? "EV rental";

  return (
    <Box sx={{ ...screenShellSx, pb: { xs: 13, sm: 6 } }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ border: `1px solid ${rentalUi.border}`, bgcolor: "#fff", color: rentalUi.green }}>
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography sx={{ fontSize: 22, fontWeight: 800 }}>Wallet payment</Typography>
      </Stack>

      <Card sx={{ ...cardSx, borderColor: "#BFECD4", bgcolor: "#F4FCF8", mb: 1.4 }}>
        <CardContent sx={{ p: 1.55, "&:last-child": { pb: 1.55 } }}>
          <Stack direction="row" justifyContent="space-between" spacing={1.1} alignItems="center">
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Stack direction="row" spacing={0.65} alignItems="center" sx={{ mb: 0.7 }}>
                <Typography sx={{ fontSize: 22/1.25, fontWeight: 600 }}>EVzone wallet balance</Typography>
                <VisibilityOutlinedIcon sx={{ fontSize: 20, color: rentalUi.muted }} />
              </Stack>
              <Typography sx={{ fontSize: 74/2, fontWeight: 800, color: rentalUi.greenDeep }}>{formatInr(walletBalance)}</Typography>
              <Typography sx={{ color: rentalUi.muted, fontSize: 20/1.2 }}>Available balance</Typography>
            </Box>
            <CroppedReferenceImage
              src={RENTAL_UI_ASSETS.banners.walletHero}
              alt="Wallet"
              height={92}
              scale={1}
              fit="contain"
              sx={{ width: { xs: 110, sm: 150 }, borderRadius: 2.2, bgcolor: "transparent", flexShrink: 0 }}
            />
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ ...cardSx, mb: 1.35 }}>
        <CardContent sx={{ p: 1.55, "&:last-child": { pb: 1.55 } }}>
          <Stack direction="row" justifyContent="space-between" spacing={1.1} alignItems="center">
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontSize: 38/2, fontWeight: 700 }}>Amount due</Typography>
              <Typography sx={{ fontSize: 74/2, fontWeight: 800, mt: 0.25 }}>{formatInr(amountDue)}</Typography>
              <Stack spacing={0.3} sx={{ mt: 0.8 }}>
                <Stack direction="row" spacing={1.2}>
                  <Typography sx={{ color: rentalUi.muted }}>Total rental amount</Typography>
                  <Typography sx={{ color: rentalUi.muted }}>{formatInr(Math.max(0, amountDue - 300))}</Typography>
                </Stack>
                <Stack direction="row" spacing={1.2}>
                  <Typography sx={{ color: rentalUi.muted }}>Refundable deposit</Typography>
                  <Typography sx={{ color: rentalUi.muted }}>{formatInr(300)}</Typography>
                </Stack>
              </Stack>
            </Box>
            <CroppedReferenceImage
              src={RENTAL_UI_ASSETS.banners.walletHero}
              alt="Amount breakdown"
              height={90}
              scale={1}
              fit="contain"
              sx={{ width: { xs: 110, sm: 150 }, borderRadius: 2.2, bgcolor: "transparent", flexShrink: 0 }}
            />
          </Stack>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={1.1} sx={{ mb: 1.3 }}>
        <Card
          onClick={() => setSplitPayment(false)}
          sx={{ ...cardSx, flex: 1, cursor: "pointer", borderColor: !splitPayment ? rentalUi.green : rentalUi.border, bgcolor: !splitPayment ? rentalUi.greenSoft : "#fff" }}
        >
          <CardContent sx={{ p: 1.1, "&:last-child": { pb: 1.1 } }}>
            <Stack direction="row" spacing={0.7} alignItems="center">
              {!splitPayment ? <RadioButtonCheckedRoundedIcon sx={{ color: rentalUi.green }} /> : <RadioButtonUncheckedRoundedIcon sx={{ color: "#C4CEDA" }} />}
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 15, lineHeight: 1.1 }}>Full payment</Typography>
                <Typography sx={{ color: rentalUi.muted, fontSize: 11.2, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  Pay entire amount now
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card
          onClick={() => setSplitPayment(true)}
          sx={{ ...cardSx, flex: 1, cursor: "pointer", borderColor: splitPayment ? rentalUi.green : rentalUi.border, bgcolor: splitPayment ? rentalUi.greenSoft : "#fff" }}
        >
          <CardContent sx={{ p: 1.1, "&:last-child": { pb: 1.1 } }}>
            <Stack direction="row" spacing={0.7} alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={0.7} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                {splitPayment ? <RadioButtonCheckedRoundedIcon sx={{ color: rentalUi.green }} /> : <RadioButtonUncheckedRoundedIcon sx={{ color: "#C4CEDA" }} />}
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 15, lineHeight: 1.1 }}>Split payment</Typography>
                  <Typography sx={{ color: rentalUi.muted, fontSize: 11.2, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    Pay partial now, rest later
                  </Typography>
                </Box>
              </Stack>
              <Chip label="New" sx={{ bgcolor: "#FFF1E3", color: rentalUi.orange, flexShrink: 0 }} />
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Card sx={{ ...cardSx, mb: 1.3 }}>
        <CardContent sx={{ p: 1.3, "&:last-child": { pb: 1.3 } }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.85 }}>
            <CroppedReferenceImage
              src={getVehicleImageFromName(vehicleLabel)}
              alt={vehicleLabel}
              height={74}
              scale={1}
              fit="contain"
              sx={{ width: 112, borderRadius: 2.2 }}
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ color: rentalUi.muted, fontSize: 12 }}>Booking ID</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: 16, lineHeight: 1.2, mb: 0.55, whiteSpace: "nowrap" }}>
                {activePayment.bookingReference}
              </Typography>
              <Typography sx={{ color: rentalUi.muted, fontSize: 12 }}>Vehicle</Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography sx={{ fontWeight: 800, fontSize: 16, lineHeight: 1.2, whiteSpace: "nowrap" }}>{vehicleLabel}</Typography>
                <Chip label="EV" size="small" sx={{ height: 22, bgcolor: rentalUi.greenSoft, color: rentalUi.greenDeep }} />
              </Stack>
            </Box>
          </Stack>

          <Stack direction="row" spacing={0.65} alignItems="center">
            <CalendarMonthRoundedIcon sx={{ color: rentalUi.muted, fontSize: 19 }} />
            <Typography sx={{ color: rentalUi.muted, fontSize: 16.5 }}>
              24 May, 10:00 AM – 26 May, 10:00 AM  •  2 days
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ ...cardSx, mb: 1.35 }}>
        <CardContent sx={{ p: 1.25, "&:last-child": { pb: 1.25 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ fontSize: 34/2, fontWeight: 700 }}>Payment summary</Typography>
            <Typography sx={{ color: rentalUi.greenDeep, fontSize: 38/2, fontWeight: 800 }}>
              You will pay {formatInr(amountDue)}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {error ? <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert> : null}
      {walletInsufficient ? (
        <Alert severity="warning" sx={{ mb: 1 }}>
          Wallet balance is insufficient. Top up your wallet or choose another payment method.
        </Alert>
      ) : null}

      <GradientActionButton
        label="Pay with wallet"
        disabled={walletInsufficient}
        onClick={() => {
          setError("");
          if (walletInsufficient) {
            setError("Insufficient wallet balance.");
            return;
          }

          actions.updateRentalPaymentSession({
            status: "processing",
            gatewayOutcome: "success",
            failureReason: undefined
          });
          navigate("/rental/payment/processing");
        }}
      />

      <Stack direction="row" justifyContent="center" spacing={0.7} alignItems="center" sx={{ mt: 1.2, mb: 1.2 }}>
        <AccountBalanceWalletRoundedIcon sx={{ color: rentalUi.green }} />
        <Typography
          component="button"
          type="button"
          onClick={() => navigate("/wallet?action=topup")}
          sx={{ border: 0, bgcolor: "transparent", color: rentalUi.greenDeep, fontSize: 34/2, fontWeight: 700, cursor: "pointer" }}
        >
          Top up wallet
        </Typography>
      </Stack>

      <Card sx={{ ...cardSx, bgcolor: "#F2FBF6" }}>
        <CardContent sx={{ p: 1.25, "&:last-child": { pb: 1.25 } }}>
          <Stack direction="row" spacing={0.85} alignItems="center">
            <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: rentalUi.green, color: "#fff", display: "grid", placeItems: "center" }}>
              <LockRoundedIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 33/2, fontWeight: 700 }}>Secure & trusted payments</Typography>
              <Typography sx={{ color: rentalUi.muted, fontSize: 16.5 }}>
                Your payment is protected with 256-bit SSL encryption.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
