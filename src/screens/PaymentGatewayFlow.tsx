import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import SimCardRoundedIcon from "@mui/icons-material/SimCardRounded";
import WalletRoundedIcon from "@mui/icons-material/WalletRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import { uiTokens } from "../design/tokens";
import { getPaymentMethodById, PaymentMethodId, resolveRideFare } from "./paymentGatewayData";

interface PaymentRouteState extends Record<string, unknown> {
  totalFare?: string;
  fare?: string;
  fareEstimate?: string;
  paymentMethod?: string;
  paymentMethodName?: string;
  paymentSimulated?: boolean;
  tripCompleted?: boolean;
  paymentReference?: string;
  mobileProvider?: string;
}

function formatReference(prefix: string): string {
  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
}

function CheckoutSummary({
  fare,
  accent,
  label
}: {
  fare: string;
  accent: string;
  label: string;
}): React.JSX.Element {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        bgcolor: `${accent}10`,
        border: `1px solid ${accent}22`
      }}
    >
      <CardContent sx={{ px: 2, py: 1.75 }}>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Ride total
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "-0.03em", mt: 0.2 }}>
          {fare}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.75, color: "text.secondary" }}>
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
}

function PaymentGatewayScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const theme = useTheme();
  const rideData = ((location.state as PaymentRouteState | null) ?? {});
  const method = getPaymentMethodById(params.gatewayId);
  const fare = resolveRideFare(rideData);

  const [walletPin, setWalletPin] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [mobileProvider, setMobileProvider] = useState("MTN MoMo");
  const [mobileNumber, setMobileNumber] = useState("+256 772 000 000");

  const formReady =
    (method.id === "wallet" && walletPin.trim().length >= 4) ||
    (method.id === "card" &&
      cardNumber.trim().length >= 12 &&
      cardName.trim().length >= 4 &&
      cardExpiry.trim().length >= 4 &&
      cardCvv.trim().length >= 3) ||
    (method.id === "mobile" && mobileNumber.trim().length >= 10);

  const handleSubmit = (): void => {
    if (!formReady) return;

    const paymentReference =
      method.id === "wallet"
        ? formatReference("EVW")
        : method.id === "card"
        ? formatReference("CRD")
        : formatReference("MOMO");

    navigate("/rides/payment/success", {
      state: {
        ...rideData,
        totalFare: fare,
        paymentMethod: method.id,
        paymentMethodName: method.name,
        paymentReference,
        paymentSimulated: true,
        mobileProvider: method.id === "mobile" ? mobileProvider : undefined
      } satisfies PaymentRouteState
    });
  };

  return (
    <ScreenScaffold>
      <SectionHeader
        title={method.name}
        subtitle={method.gatewayDescription}
        leadingAction={
          <IconButton
            size="small"
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
        }
        action={
          <Chip
            icon={<LockRoundedIcon sx={{ fontSize: 16 }} />}
            label="Simulated secure checkout"
            size="small"
            sx={{
              height: 28,
              borderRadius: 2,
              bgcolor: theme.palette.mode === "light" ? "#F8FAFC" : "rgba(15,23,42,0.98)"
            }}
          />
        }
      />

      <CheckoutSummary fare={fare} accent={method.accent} label={method.gatewayTitle} />

      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          border:
            theme.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)",
          bgcolor: theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"
        }}
      >
        <CardContent sx={{ px: 2, py: 2 }}>
          {method.id === "wallet" && (
            <Stack spacing={1.5}>
              <Box
                sx={{
                  borderRadius: 3,
                  p: 1.75,
                  color: "#FFFFFF",
                  background: "linear-gradient(135deg, #054A34 0%, #03CD8C 100%)"
                }}
              >
                <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: "0.08em" }}>
                  EVzone wallet
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.4 }}>
                  UGX 128,400
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.75, opacity: 0.88 }}>
                  Available balance after ride: UGX 107,835
                </Typography>
              </Box>

              <Alert severity="success" icon={<WalletRoundedIcon fontSize="inherit" />}>
                This flow simulates an internal wallet debit and approval step.
              </Alert>

              <TextField
                label="Wallet PIN"
                value={walletPin}
                onChange={(event) => setWalletPin(event.target.value.replace(/\D/g, "").slice(0, 6))}
                fullWidth
                type="password"
                inputProps={{ inputMode: "numeric", maxLength: 6 }}
                helperText="Use any 4 to 6 digits for the simulation."
              />
            </Stack>
          )}

          {method.id === "card" && (
            <Stack spacing={1.5}>
              <Box
                sx={{
                  borderRadius: 3,
                  p: 1.75,
                  color: "#FFFFFF",
                  background: "linear-gradient(135deg, #0F172A 0%, #2563EB 100%)"
                }}
              >
                <Typography variant="overline" sx={{ opacity: 0.82, letterSpacing: "0.08em" }}>
                  Secure card processor
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1.2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    VISA / MASTERCARD
                  </Typography>
                  <CreditCardRoundedIcon sx={{ fontSize: 28 }} />
                </Box>
              </Box>

              <Alert severity="info">
                This page mimics a typical payment processor card capture screen using demo-only fields.
              </Alert>

              <TextField
                label="Card number"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(event) => setCardNumber(event.target.value)}
                fullWidth
              />
              <TextField
                label="Name on card"
                placeholder="EVZONE RIDER"
                value={cardName}
                onChange={(event) => setCardName(event.target.value)}
                fullWidth
              />
              <Stack direction="row" spacing={1.25}>
                <TextField
                  label="Expiry"
                  placeholder="08/29"
                  value={cardExpiry}
                  onChange={(event) => setCardExpiry(event.target.value)}
                  fullWidth
                />
                <TextField
                  label="CVV"
                  placeholder="123"
                  value={cardCvv}
                  onChange={(event) => setCardCvv(event.target.value.replace(/\D/g, "").slice(0, 4))}
                  fullWidth
                />
              </Stack>
            </Stack>
          )}

          {method.id === "mobile" && (
            <Stack spacing={1.5}>
              <Box
                sx={{
                  borderRadius: 3,
                  p: 1.75,
                  color: "#111827",
                  background: "linear-gradient(135deg, #FFE4A8 0%, #FDBA74 100%)"
                }}
              >
                <Typography variant="overline" sx={{ opacity: 0.78, letterSpacing: "0.08em" }}>
                  Mobile money push
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1.2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    MTN and Airtel
                  </Typography>
                  <SimCardRoundedIcon sx={{ fontSize: 28 }} />
                </Box>
              </Box>

              <Alert severity="warning">
                This page simulates the usual telecom push-prompt confirmation flow.
              </Alert>

              <TextField
                select
                label="Provider"
                value={mobileProvider}
                onChange={(event) => setMobileProvider(event.target.value)}
                fullWidth
              >
                <MenuItem value="MTN MoMo">MTN MoMo</MenuItem>
                <MenuItem value="Airtel Money">Airtel Money</MenuItem>
              </TextField>
              <TextField
                label="Phone number"
                value={mobileNumber}
                onChange={(event) => setMobileNumber(event.target.value)}
                fullWidth
                helperText="Use your Uganda-format number for the demo prompt."
              />
            </Stack>
          )}

          <Divider sx={{ my: 2 }} />

          <Button
            fullWidth
            variant="contained"
            disabled={!formReady}
            onClick={handleSubmit}
            sx={{
              minHeight: 48,
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 700,
              bgcolor: method.accent,
              boxShadow: "none",
              "&:hover": {
                bgcolor: method.accent,
                filter: "brightness(0.95)",
                boxShadow: "none"
              }
            }}
          >
            {method.submitLabel}
          </Button>
        </CardContent>
      </Card>
    </ScreenScaffold>
  );
}

export function PaymentSuccessScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const rideData = ((location.state as PaymentRouteState | null) ?? {});
  const method = getPaymentMethodById(
    typeof rideData.paymentMethod === "string" ? rideData.paymentMethod : undefined
  );
  const fare = resolveRideFare(rideData);

  return (
    <ScreenScaffold>
      <SectionHeader
        title="Payment approved"
        subtitle={method.processingLabel}
        leadingAction={
          <IconButton
            size="small"
            onClick={() => navigate("/rides/payment")}
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
        }
      />

      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          overflow: "hidden",
          border:
            theme.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)",
          bgcolor: theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 3,
            textAlign: "center",
            color: "#FFFFFF",
            background: "linear-gradient(135deg, #0F172A 0%, #03CD8C 100%)"
          }}
        >
          <CheckCircleRoundedIcon sx={{ fontSize: 46 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, mt: 1 }}>
            {fare} received
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.75, opacity: 0.9 }}>
            {method.name} simulation completed successfully.
          </Typography>
        </Box>

        <CardContent sx={{ px: 2, py: 2 }}>
          <Stack spacing={1.5}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 1,
                alignItems: "center"
              }}
            >
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Payment gateway
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {method.name}
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Reference
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {typeof rideData.paymentReference === "string" ? rideData.paymentReference : "SIM-000000"}
              </Typography>

              {method.id === "mobile" && typeof rideData.mobileProvider === "string" && (
                <>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Provider
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {rideData.mobileProvider}
                  </Typography>
                </>
              )}
            </Box>

            <Chip
              label="Demo payment only"
              sx={{
                width: "fit-content",
                borderRadius: 2,
                bgcolor: theme.palette.mode === "light" ? "#ECFDF5" : "rgba(3,205,140,0.18)",
                color: "#047857"
              }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={() =>
                navigate("/rides/trip/completed", {
                  state: {
                    ...rideData,
                    totalFare: fare,
                    paymentMethod: method.id,
                    paymentMethodName: method.name,
                    paymentSimulated: true,
                    tripCompleted: true
                  } satisfies PaymentRouteState
                })
              }
              sx={{
                minHeight: 48,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 700,
                bgcolor: "#03CD8C",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#02b377",
                  boxShadow: "none"
                }
              }}
            >
              Finish trip
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </ScreenScaffold>
  );
}

export default PaymentGatewayScreen;
