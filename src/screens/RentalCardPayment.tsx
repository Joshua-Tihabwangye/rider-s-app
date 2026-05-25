import React, { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Checkbox,
  IconButton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

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
import {
  CardFormErrors,
  formatCardNumberInput,
  formatExpiryInput,
  maskCardNumber,
  normalizeDigits,
  resolveCardOutcome,
  validateCardForm
} from "../features/rental/payment";

export default function RentalCardPayment(): React.JSX.Element {
  const navigate = useNavigate();
  const { rental, actions } = useAppData();
  const activePayment = rental.activePayment;
  const vehicle = useMemo(
    () => rental.vehicles.find((entry) => entry.id === rental.booking.vehicleId) ?? rental.vehicles[0] ?? null,
    [rental.booking.vehicleId, rental.vehicles]
  );

  const [cardholderName, setCardholderName] = useState(activePayment?.customerName ?? "");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/27");
  const [cvv, setCvv] = useState("123");
  const [saveCard, setSaveCard] = useState(false);
  const [errors, setErrors] = useState<CardFormErrors>({});
  const [formError, setFormError] = useState("");

  if (!activePayment) {
    return <Navigate to="/rental/summary" replace />;
  }

  if (activePayment.paymentMethodType !== "card") {
    return <Navigate to="/rental/summary" replace />;
  }

  const amountDue = activePayment.amount;

  const handlePay = (): void => {
    const validationErrors = validateCardForm({ cardholderName, cardNumber, expiry, cvv });
    setErrors(validationErrors);
    setFormError("");
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const outcome = resolveCardOutcome(cardNumber);
    if (!outcome) {
      setFormError("Use a valid test card number. Example: 4242 4242 4242 4242.");
      return;
    }

    const digits = normalizeDigits(cardNumber);
    actions.updateRentalPaymentSession({
      status: "processing",
      gatewayOutcome: outcome,
      cardHolderName: cardholderName.trim(),
      cardLast4: digits.slice(-4),
      maskedCardNumber: maskCardNumber(cardNumber),
      failureReason: undefined
    });

    navigate("/rental/payment/processing");
  };

  return (
    <Box sx={screenShellSx}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: rentalUi.title }}>
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography sx={{ fontSize: 22, fontWeight: 800 }}>Card payment</Typography>
      </Stack>

      <Card sx={{ ...cardSx, mb: 1.45 }}>
        <CardContent sx={{ p: 1.55, "&:last-child": { pb: 1.55 } }}>
          <Stack direction="row" justifyContent="space-between" spacing={1.1} alignItems="center">
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ color: rentalUi.muted, fontSize: 19 }}>Amount due</Typography>
              <Typography sx={{ fontSize: 74/2, fontWeight: 800 }}>{formatInr(amountDue)}</Typography>
              <Typography sx={{ color: rentalUi.greenDeep, fontWeight: 700, fontSize: 35/2 }}>View breakdown</Typography>
            </Box>
            <CroppedReferenceImage
              src={RENTAL_UI_ASSETS.banners.cardHero}
              alt={vehicle?.name ?? "Vehicle"}
              height={108}
              scale={1}
              fit="contain"
              sx={{
                width: { xs: 132, sm: 190 },
                borderRadius: 2.4,
                bgcolor: "transparent",
                flexShrink: 0,
                "& img": { objectPosition: "center center" }
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ ...cardSx, mb: 1.35 }}>
        <CardContent sx={{ p: 1.45, "&:last-child": { pb: 1.45 } }}>
          <Typography sx={{ fontSize: 44/2, fontWeight: 700, mb: 0.75 }}>Saved card</Typography>
          <Card sx={{ ...cardSx, borderColor: rentalUi.green, borderWidth: 2 }}>
            <CardContent sx={{ p: 1.2, "&:last-child": { pb: 1.2 } }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                <Stack spacing={0.25}>
                  <Typography sx={{ fontSize: 39/2, fontWeight: 800, color: "#1A4EB1" }}>VISA</Typography>
                  <Typography sx={{ color: rentalUi.title, fontSize: 35/2, fontWeight: 700 }}>•••• •••• •••• 4242</Typography>
                  <Typography sx={{ color: rentalUi.muted }}>Expires 12/27</Typography>
                </Stack>
                <Stack alignItems="center" spacing={0.7}>
                  <Typography sx={{ color: rentalUi.greenDeep, fontWeight: 700, bgcolor: rentalUi.greenSoft, px: 1, borderRadius: 2 }}>Default</Typography>
                  <CheckCircleRoundedIcon sx={{ color: rentalUi.green, fontSize: 28 }} />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card sx={{ ...cardSx, mb: 1.35 }}>
        <CardContent sx={{ p: 1.45, "&:last-child": { pb: 1.45 } }}>
          <Typography sx={{ fontSize: 44/2, fontWeight: 700, mb: 1 }}>New card details</Typography>

          {formError ? <Alert severity="error" sx={{ mb: 1 }}>{formError}</Alert> : null}

          <Typography sx={{ color: rentalUi.muted, mb: 0.35 }}>Card number</Typography>
          <TextField
            fullWidth
            value={cardNumber}
            onChange={(event) => setCardNumber(formatCardNumberInput(event.target.value))}
            placeholder="1234 5678 9012 3456"
            error={Boolean(errors.cardNumber)}
            helperText={errors.cardNumber}
            InputProps={{ startAdornment: <CreditCardRoundedIcon sx={{ color: rentalUi.muted, mr: 1 }} /> }}
            sx={{ mb: 1.2, "& .MuiOutlinedInput-root": { borderRadius: 2.1 } }}
          />

          <Typography sx={{ color: rentalUi.muted, mb: 0.35 }}>Cardholder name</Typography>
          <TextField
            fullWidth
            value={cardholderName}
            onChange={(event) => setCardholderName(event.target.value)}
            placeholder="Name on card"
            error={Boolean(errors.cardholderName)}
            helperText={errors.cardholderName}
            InputProps={{ startAdornment: <PersonOutlineRoundedIcon sx={{ color: rentalUi.muted, mr: 1 }} /> }}
            sx={{ mb: 1.2, "& .MuiOutlinedInput-root": { borderRadius: 2.1 } }}
          />

          <Stack direction="row" spacing={1.1} sx={{ mb: 1.15 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: rentalUi.muted, mb: 0.35 }}>Expiry date</Typography>
              <TextField
                fullWidth
                value={expiry}
                onChange={(event) => setExpiry(formatExpiryInput(event.target.value))}
                placeholder="MM / YY"
                error={Boolean(errors.expiry)}
                helperText={errors.expiry}
                InputProps={{ startAdornment: <CalendarMonthRoundedIcon sx={{ color: rentalUi.muted, mr: 1 }} /> }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.1 } }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: rentalUi.muted, mb: 0.35 }}>CVV</Typography>
              <TextField
                fullWidth
                value={cvv}
                onChange={(event) => setCvv(normalizeDigits(event.target.value).slice(0, 4))}
                placeholder="123"
                error={Boolean(errors.cvv)}
                helperText={errors.cvv}
                InputProps={{
                  startAdornment: <LockRoundedIcon sx={{ color: rentalUi.muted, mr: 1 }} />,
                  endAdornment: <HelpOutlineRoundedIcon sx={{ color: rentalUi.muted }} />
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.1 } }}
              />
            </Box>
          </Stack>

          <Stack direction="row" spacing={0.8} alignItems="center">
            <Checkbox checked={saveCard} onChange={(event) => setSaveCard(event.target.checked)} sx={{ p: 0.5 }} />
            <Box>
              <Typography sx={{ fontSize: 35/2, fontWeight: 600 }}>Save this card securely for faster payments</Typography>
              <Typography sx={{ color: rentalUi.muted }}>Your card details are encrypted and safe.</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ ...cardSx, mb: 1.35 }}>
        <CardContent sx={{ p: 1.35, "&:last-child": { pb: 1.35 } }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={0.9}>
            <Stack direction="row" spacing={0.8} alignItems="center" sx={{ minWidth: 0 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: rentalUi.greenSoft, color: rentalUi.green, display: "grid", placeItems: "center" }}>
                <LocationOnRoundedIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 0.2 }}>Billing address</Typography>
                <Typography sx={{ color: rentalUi.muted, fontSize: 13, lineHeight: 1.35 }}>
                  Plot 12, Nsambya Road, Kampala, Uganda
                </Typography>
              </Box>
            </Stack>
            <ChevronRightRoundedIcon sx={{ color: rentalUi.muted }} />
          </Stack>
        </CardContent>
      </Card>

      <GradientActionButton label={`Pay now ${formatInr(amountDue)}`} onClick={handlePay} />

      <Stack direction="row" spacing={0.65} alignItems="center" justifyContent="center" sx={{ mt: 1.25 }}>
        <CheckCircleRoundedIcon sx={{ color: rentalUi.green }} />
        <Typography sx={{ fontSize: 35/2, fontWeight: 700 }}>Secure encrypted payment</Typography>
      </Stack>
      <Typography sx={{ color: rentalUi.muted, textAlign: "center", fontSize: 16, mt: 0.25 }}>
        Your information is protected with 256-bit SSL encryption
      </Typography>
    </Box>
  );
}
