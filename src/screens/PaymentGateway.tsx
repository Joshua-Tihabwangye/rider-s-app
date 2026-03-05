import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Stack,
  LinearProgress,
  Divider,
  Fade,
  Switch,
  FormControlLabel,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";

import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";

// ─── Types ────────────────────────────────────────────────────────────────────
type PaymentStep = "review" | "input" | "processing" | "3dsecure" | "stkpush" | "result";
type PaymentResult = "success" | "failed" | "pending";
type PaymentMethodType = "wallet" | "card" | "mobile" | "cash";

interface PaymentGatewayState {
  paymentMethod: PaymentMethodType;
  amount: string;
  description: string;
  returnPath: string;       // Where to go on success
  cancelPath: string;       // Where to go on cancel / back
  serviceName: string;      // "Ride" | "Rental" | "Tour" | "Delivery" | "Wallet Top-up" | "Withdrawal"
  extraData?: Record<string, unknown>; // Any extra state to pass forward
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getPaymentIcon(method: PaymentMethodType) {
  switch (method) {
    case "wallet":
      return <AccountBalanceWalletRoundedIcon sx={{ fontSize: 28, color: "#047857" }} />;
    case "card":
      return <CreditCardRoundedIcon sx={{ fontSize: 28, color: "#1D4ED8" }} />;
    case "mobile":
      return <PhoneIphoneRoundedIcon sx={{ fontSize: 28, color: "#EA580C" }} />;
    case "cash":
      return <PaymentsRoundedIcon sx={{ fontSize: 28, color: "#16A34A" }} />;
  }
}

function getPaymentLabel(method: PaymentMethodType, provider?: "mtn" | "airtel") {
  switch (method) {
    case "wallet": return "EVzone Wallet";
    case "card": return "Visa / MasterCard";
    case "mobile": return provider === "airtel" ? "Airtel Money" : "MTN Mobile Money";
    case "cash": return "Cash Payment";
  }
}

function generateTxnId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "TXN-";
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) id += "-";
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// ─── Main Component ───────────────────────────────────────────────────────────
function PaymentGatewayScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // Read state from navigation
  const state = (location.state || {}) as PaymentGatewayState;
  const paymentMethod = state.paymentMethod || "wallet";
  const amount = state.amount || "UGX 0";
  const description = state.description || "Payment";
  const returnPath = state.returnPath || "/home";
  const cancelPath = state.cancelPath || "/home";
  const serviceName = state.serviceName || "Service";
  const extraData = state.extraData || {};

  // Determine if this is a top-up (credit) vs a payment/withdrawal (debit)
  const isTopUp = serviceName === "Wallet Top-up";

  // Step & result state
  const [step, setStep] = useState<PaymentStep>("review");
  const [result, setResult] = useState<PaymentResult>("pending");
  const [progress, setProgress] = useState(0);
  const [txnId] = useState(generateTxnId);

  // Toggle to simulate failure
  const [simulateFailure, setSimulateFailure] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("123");
  const [cardName, setCardName] = useState("John Rider");
  const [cardPin, setCardPin] = useState("");

  // Mobile money state
  const [mobileNumber, setMobileNumber] = useState("+256 777 123 456");
  const [mobileProvider, setMobileProvider] = useState<"mtn" | "airtel">("mtn");
  const [mobilePin, setMobilePin] = useState("");

  // 3D Secure OTP state
  const [otpCode, setOtpCode] = useState("");

  // Wallet state
  const walletBalance = 520000;
  const [walletAccountNumber, setWalletAccountNumber] = useState("EVZ-2025-0042-7891");
  const [walletPin, setWalletPin] = useState("");

  const contentBg = theme.palette.mode === "light"
    ? "#FFFFFF"
    : theme.palette.background.paper || "rgba(15,23,42,0.98)";

  const accentGreen = "#03CD8C";

  // ── Processing simulation ────────────────────────────────────────────────
  const startProcessing = useCallback(() => {
    setStep("processing");
    setProgress(0);
  }, []);

  // Timer effect for processing step
  useEffect(() => {
    if (step !== "processing") return;

    const duration = 3000; // 3 seconds
    const interval = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(timer);
        setResult(simulateFailure ? "failed" : "success");
        setStep("result");
      }
    }, interval);

    return () => clearInterval(timer);
  }, [step, simulateFailure]);

  // Cash doesn't need extra input steps - handled in handleReviewConfirm

  // ── Navigation handlers ──────────────────────────────────────────────────
  const handleBack = () => {
    if (step === "review") {
      navigate(cancelPath, { state: extraData });
    } else if (step === "input") {
      setStep("review");
    } else if (step === "3dsecure") {
      setStep("input");
    } else if (step === "stkpush") {
      setStep("input");
    }
  };

  const handleReviewConfirm = () => {
    if (paymentMethod === "cash") {
      // Cash is accepted by driver, skip to processing
      startProcessing();
    } else if (paymentMethod === "wallet") {
      // Wallet: check balance, then process
      setStep("input");
    } else {
      setStep("input");
    }
  };

  const handleInputSubmit = () => {
    if (paymentMethod === "card") {
      // Card PIN validated, proceed to 3D Secure verification
      if (cardPin.length < 4) return;
      setStep("3dsecure");
    } else if (paymentMethod === "mobile") {
      // Send STK push simulation
      setStep("stkpush");
    } else if (paymentMethod === "wallet") {
      // Wallet number + PIN validated, process wallet transaction
      if (walletPin.length < 4 || !walletAccountNumber.trim()) return;
      startProcessing();
    }
  };

  const handle3DSecureSubmit = () => {
    if (otpCode.length >= 4) {
      setStep("processing");
    }
  };

  const handleStkConfirm = () => {
    if (mobilePin.length >= 4) {
      setStep("processing");
    }
  };

  const handleRetry = () => {
    setResult("pending");
    setProgress(0);
    setWalletPin("");
    setCardPin("");
    setOtpCode("");
    setMobilePin("");
    setStep("review");
  };

  const handleSuccess = () => {
    navigate(returnPath, { state: { ...extraData, paymentSuccess: true, txnId, paymentMethod } });
  };

  // ─── REVIEW STEP ────────────────────────────────────────────────────────
  function renderReview() {
    return (
      <Fade in>
        <Box>
          {/* Payment Summary */}
          <Card
            elevation={0}
            sx={{
              mb: 2,
              borderRadius: 2.5,
              bgcolor: contentBg,
              border: theme.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <CardContent sx={{ px: 2, py: 2 }}>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: theme.palette.text.secondary, mb: 1.5, display: "block", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}
              >
                Payment Summary
              </Typography>

              <Stack spacing={0.8}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ fontSize: 13, color: theme.palette.text.secondary }}>Service</Typography>
                  <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 500 }}>{serviceName}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ fontSize: 13, color: theme.palette.text.secondary }}>Description</Typography>
                  <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 500, maxWidth: "60%", textAlign: "right" }}>{description}</Typography>
                </Stack>
              </Stack>

              <Divider sx={{ my: 1.5 }} />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>Total Amount</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.02em", color: accentGreen }}>{amount}</Typography>
              </Stack>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card
            elevation={0}
            sx={{
              mb: 2,
              borderRadius: 2.5,
              bgcolor: contentBg,
              border: `1px solid ${accentGreen}40`
            }}
          >
            <CardContent sx={{ px: 2, py: 1.5 }}>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: theme.palette.text.secondary, mb: 1, display: "block", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}
              >
                {isTopUp ? "Adding from" : "Paying with"}
              </Typography>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 999,
                    bgcolor: theme.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {getPaymentIcon(paymentMethod)}
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{getPaymentLabel(paymentMethod, mobileProvider)}</Typography>
                  {paymentMethod === "wallet" && (
                    <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary }}>
                      Balance: UGX {walletBalance.toLocaleString()}
                    </Typography>
                  )}
                  {paymentMethod === "cash" && (
                    <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary }}>
                      Pay driver directly upon arrival
                    </Typography>
                  )}
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Simulation Controls */}
          <Card
            elevation={0}
            sx={{
              mb: 2.5,
              borderRadius: 2.5,
              bgcolor: theme.palette.mode === "light" ? "#FFFBEB" : "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.3)"
            }}
          >
            <CardContent sx={{ px: 2, py: 1.5 }}>
              <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600, color: "#D97706", mb: 0.5, display: "block" }}>
                ⚡ Simulation Controls
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={simulateFailure}
                    onChange={(e) => setSimulateFailure(e.target.checked)}
                    size="small"
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": { color: "#EF4444" },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#EF4444" }
                    }}
                  />
                }
                label={
                  <Typography variant="caption" sx={{ fontSize: 12, color: theme.palette.text.secondary }}>
                    Simulate payment failure
                  </Typography>
                }
              />
            </CardContent>
          </Card>

          {/* Security badge */}
          <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
            <LockRoundedIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
            <Typography variant="caption" sx={{ fontSize: 10, color: theme.palette.text.secondary }}>
              256-bit SSL encrypted • PCI DSS Level 1 compliant
            </Typography>
          </Stack>

          <Button
            fullWidth
            variant="contained"
            onClick={handleReviewConfirm}
            sx={{
              borderRadius: 999,
              py: 1.4,
              fontSize: 15,
              fontWeight: 600,
              textTransform: "none",
              bgcolor: accentGreen,
              color: "#FFFFFF",
              "&:hover": { bgcolor: "#02B87A" }
            }}
          >
            {paymentMethod === "cash" ? "Confirm Cash Payment" : isTopUp ? `Add ${amount}` : `Pay ${amount}`}
          </Button>
        </Box>
      </Fade>
    );
  }

  // ─── INPUT STEP: WALLET ─────────────────────────────────────────────────
  function renderWalletInput() {
    const numericAmount = parseInt(amount.replace(/[^0-9]/g, ""), 10) || 0;
    // For top-up: money is coming IN, no balance check needed
    // For payment/withdrawal: money is going OUT, check balance
    const hasSufficientBalance = isTopUp ? true : walletBalance >= numericAmount;
    const balanceAfter = isTopUp
      ? walletBalance + numericAmount
      : walletBalance - numericAmount;

    const isWalletFormValid = walletAccountNumber.trim().length > 0 && walletPin.length >= 4 && hasSufficientBalance;

    return (
      <Fade in>
        <Box>
          <Card
            elevation={0}
            sx={{
              mb: 2,
              borderRadius: 2.5,
              bgcolor: contentBg,
              border: theme.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <CardContent sx={{ px: 2, py: 2 }}>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <AccountBalanceWalletRoundedIcon sx={{ fontSize: 48, color: "#047857", mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>EVzone Wallet</Typography>
                {isTopUp ? (
                  <Typography variant="caption" sx={{ fontSize: 12, color: theme.palette.text.secondary }}>
                    Adding funds to your wallet
                  </Typography>
                ) : (
                  <Typography variant="caption" sx={{ fontSize: 12, color: theme.palette.text.secondary }}>
                    Verify your wallet to authorize this transaction
                  </Typography>
                )}
              </Box>

              {/* Wallet Number & PIN — Security verification */}
              <Stack spacing={2} sx={{ mb: 2.5 }}>
                <TextField
                  fullWidth
                  label="Wallet Account Number"
                  value={walletAccountNumber}
                  onChange={(e) => setWalletAccountNumber(e.target.value)}
                  placeholder="EVZ-XXXX-XXXX-XXXX"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                        <AccountBalanceWalletRoundedIcon sx={{ fontSize: 18, color: "#047857" }} />
                      </Box>
                    ),
                    sx: { borderRadius: 2, fontSize: 14 }
                  }}
                  helperText="Enter your EVzone Wallet account number"
                />
                <TextField
                  fullWidth
                  label="Wallet PIN"
                  value={walletPin}
                  onChange={(e) => setWalletPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 4-6 digit PIN"
                  type="password"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                        <LockRoundedIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                      </Box>
                    ),
                    sx: { borderRadius: 2, fontSize: 18, letterSpacing: "0.3em" }
                  }}
                  inputProps={{ maxLength: 6, style: { textAlign: "center" } }}
                  helperText={
                    walletPin.length > 0 && walletPin.length < 4
                      ? "PIN must be at least 4 digits"
                      : "For simulation, enter any 4+ digit PIN (e.g. 1234)"
                  }
                  error={walletPin.length > 0 && walletPin.length < 4}
                />
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Stack spacing={1} sx={{ mb: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ fontSize: 13, color: theme.palette.text.secondary }}>Current Balance</Typography>
                  <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, color: "#047857" }}>UGX {walletBalance.toLocaleString()}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ fontSize: 13, color: theme.palette.text.secondary }}>
                    {isTopUp ? "Amount to add" : "Amount to deduct"}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, color: isTopUp ? "#16A34A" : undefined }}>
                    {isTopUp ? `+ ${amount}` : amount}
                  </Typography>
                </Stack>
                <Divider />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>Balance after</Typography>
                  <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 700, color: hasSufficientBalance ? "#047857" : "#EF4444" }}>
                    UGX {balanceAfter.toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>

              {!hasSufficientBalance && (
                <Alert severity="error" sx={{ borderRadius: 2, fontSize: 12, mb: 1 }}>
                  Insufficient wallet balance. Please top up your wallet first.
                </Alert>
              )}

              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
                <SecurityRoundedIcon sx={{ fontSize: 12, color: theme.palette.text.secondary }} />
                <Typography variant="caption" sx={{ fontSize: 10, color: theme.palette.text.secondary }}>
                  Your wallet PIN is encrypted and never stored
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Button
            fullWidth
            variant="contained"
            onClick={handleInputSubmit}
            disabled={!isWalletFormValid}
            sx={{
              borderRadius: 999,
              py: 1.4,
              fontSize: 15,
              fontWeight: 600,
              textTransform: "none",
              bgcolor: isWalletFormValid ? accentGreen : "rgba(0,0,0,0.12)",
              color: "#FFFFFF",
              "&:hover": { bgcolor: "#02B87A" },
              "&.Mui-disabled": { bgcolor: "rgba(0,0,0,0.12)", color: "rgba(0,0,0,0.4)" }
            }}
          >
            {isTopUp ? `Add ${amount} to Wallet` : "Authorize Wallet Payment"}
          </Button>
        </Box>
      </Fade>
    );
  }

  // ─── INPUT STEP: CARD ───────────────────────────────────────────────────
  function renderCardInput() {
    const isCardFormValid = !!cardNumber && !!cardExpiry && !!cardCvv && cardPin.length >= 4;

    return (
      <Fade in>
        <Box>
          <Card
            elevation={0}
            sx={{
              mb: 2,
              borderRadius: 2.5,
              bgcolor: contentBg,
              border: theme.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <CardContent sx={{ px: 2, py: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <CreditCardRoundedIcon sx={{ fontSize: 24, color: "#1D4ED8" }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Card Details</Typography>
              </Stack>
              <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary, display: "block", mb: 2 }}>
                Enter your card details and PIN to authorize this transaction
              </Typography>

              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                        <CreditCardRoundedIcon sx={{ fontSize: 18, color: "#1D4ED8" }} />
                      </Box>
                    ),
                    sx: { borderRadius: 2, fontSize: 14 }
                  }}
                />
                <TextField
                  fullWidth
                  label="Cardholder Name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Doe"
                  size="small"
                  InputProps={{
                    sx: { borderRadius: 2, fontSize: 14 }
                  }}
                />
                <Stack direction="row" spacing={1.5}>
                  <TextField
                    label="Expiry"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    size="small"
                    sx={{ flex: 1 }}
                    InputProps={{
                      sx: { borderRadius: 2, fontSize: 14 }
                    }}
                  />
                  <TextField
                    label="CVV"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="123"
                    size="small"
                    type="password"
                    sx={{ flex: 1 }}
                    InputProps={{
                      sx: { borderRadius: 2, fontSize: 14 }
                    }}
                  />
                </Stack>

                <Divider />

                {/* Card PIN — Security verification */}
                <Box
                  sx={{
                    bgcolor: theme.palette.mode === "light" ? "#F8FAFC" : "rgba(15,23,42,0.5)",
                    borderRadius: 2,
                    p: 2,
                    border: theme.palette.mode === "light" ? "1px solid rgba(209,213,219,0.5)" : "1px solid rgba(51,65,85,0.5)"
                  }}
                >
                  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1.5 }}>
                    <SecurityRoundedIcon sx={{ fontSize: 16, color: "#1D4ED8" }} />
                    <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600, color: "#1D4ED8" }}>
                      PIN Verification Required
                    </Typography>
                  </Stack>
                  <TextField
                    fullWidth
                    label="Card PIN"
                    value={cardPin}
                    onChange={(e) => setCardPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter 4-digit PIN"
                    type="password"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                          <LockRoundedIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                        </Box>
                      ),
                      sx: { borderRadius: 2, fontSize: 18, letterSpacing: "0.3em" }
                    }}
                    inputProps={{ maxLength: 6, style: { textAlign: "center" } }}
                    helperText={
                      cardPin.length > 0 && cardPin.length < 4
                        ? "PIN must be at least 4 digits"
                        : "For simulation, enter any 4+ digit PIN (e.g. 1234)"
                    }
                    error={cardPin.length > 0 && cardPin.length < 4}
                  />
                </Box>
              </Stack>

              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1.5 }}>
                <LockRoundedIcon sx={{ fontSize: 12, color: theme.palette.text.secondary }} />
                <Typography variant="caption" sx={{ fontSize: 10, color: theme.palette.text.secondary }}>
                  Your card details and PIN are encrypted and secure
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Button
            fullWidth
            variant="contained"
            onClick={handleInputSubmit}
            disabled={!isCardFormValid}
            sx={{
              borderRadius: 999,
              py: 1.4,
              fontSize: 15,
              fontWeight: 600,
              textTransform: "none",
              bgcolor: isCardFormValid ? accentGreen : "rgba(0,0,0,0.12)",
              color: "#FFFFFF",
              "&:hover": { bgcolor: "#02B87A" },
              "&.Mui-disabled": { bgcolor: "rgba(0,0,0,0.12)", color: "rgba(0,0,0,0.4)" }
            }}
          >
            {isTopUp ? `Deposit ${amount}` : `Pay ${amount}`}
          </Button>
        </Box>
      </Fade>
    );
  }

  // ─── 3D SECURE VERIFICATION ─────────────────────────────────────────────
  function render3DSecure() {
    return (
      <Fade in>
        <Box>
          <Card
            elevation={0}
            sx={{
              mb: 2,
              borderRadius: 2.5,
              bgcolor: contentBg,
              border: "1px solid rgba(29,78,216,0.3)"
            }}
          >
            <CardContent sx={{ px: 2, py: 3 }}>
              <Box sx={{ textAlign: "center", mb: 2.5 }}>
                <SecurityRoundedIcon sx={{ fontSize: 48, color: "#1D4ED8", mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>3D Secure Verification</Typography>
                <Typography variant="caption" sx={{ fontSize: 12, color: theme.palette.text.secondary, display: "block" }}>
                  Your bank sent a one-time verification code to your registered phone number
                </Typography>
              </Box>

              <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary, mb: 0.5, display: "block" }}>
                Code sent to: +256 7XX XXX X56
              </Typography>

              <TextField
                fullWidth
                label="Enter OTP Code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit code"
                size="small"
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { borderRadius: 2, fontSize: 18, letterSpacing: "0.3em", textAlign: "center" }
                }}
                inputProps={{ maxLength: 6, style: { textAlign: "center" } }}
              />

              <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary, display: "block", textAlign: "center" }}>
                For simulation, enter any 4+ digit code (e.g. 123456)
              </Typography>
            </CardContent>
          </Card>

          <Button
            fullWidth
            variant="contained"
            onClick={handle3DSecureSubmit}
            disabled={otpCode.length < 4}
            sx={{
              borderRadius: 999,
              py: 1.4,
              fontSize: 15,
              fontWeight: 600,
              textTransform: "none",
              bgcolor: "#1D4ED8",
              color: "#FFFFFF",
              "&:hover": { bgcolor: "#1E40AF" },
              "&.Mui-disabled": { bgcolor: "rgba(0,0,0,0.12)", color: "rgba(0,0,0,0.4)" }
            }}
          >
            Verify & Pay
          </Button>
        </Box>
      </Fade>
    );
  }

  // ─── MOBILE MONEY STK PUSH ──────────────────────────────────────────────
  function renderStkPush() {
    const isMtn = mobileProvider === "mtn";
    const providerName = isMtn ? "MTN MoMo" : "Airtel Money";
    const providerColor = isMtn ? "#F9A825" : "#E53935";
    const providerBg = isMtn
      ? (theme.palette.mode === "light" ? "#FFFDE7" : "rgba(249,168,37,0.08)")
      : (theme.palette.mode === "light" ? "#FFEBEE" : "rgba(229,57,53,0.08)");
    const providerBorder = isMtn ? "1px solid rgba(249,168,37,0.4)" : "1px solid rgba(229,57,53,0.4)";

    return (
      <Fade in>
        <Box>
          <Card
            elevation={0}
            sx={{
              mb: 2,
              borderRadius: 2.5,
              bgcolor: contentBg,
              border: providerBorder
            }}
          >
            <CardContent sx={{ px: 2, py: 3 }}>
              <Box sx={{ textAlign: "center", mb: 2.5 }}>
                <PhoneIphoneRoundedIcon sx={{ fontSize: 48, color: providerColor, mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Confirm on Your Phone</Typography>
                <Typography variant="caption" sx={{ fontSize: 12, color: theme.palette.text.secondary, display: "block" }}>
                  A {providerName} payment prompt has been sent to <strong>{mobileNumber}</strong>
                </Typography>
              </Box>

              <Card
                elevation={0}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  bgcolor: providerBg,
                  border: providerBorder
                }}
              >
                <CardContent sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600, display: "block", mb: 0.5 }}>
                    📱 Simulated {providerName} STK Push
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary, display: "block", mb: 1.5 }}>
                    Enter your {providerName} PIN to authorize payment of {amount}
                  </Typography>
                  <TextField
                    fullWidth
                    label={`${providerName} PIN`}
                    value={mobilePin}
                    onChange={(e) => setMobilePin(e.target.value.replace(/\D/g, "").slice(0, 5))}
                    placeholder="Enter PIN"
                    type="password"
                    size="small"
                    InputProps={{
                      sx: { borderRadius: 2, fontSize: 18, letterSpacing: "0.3em" }
                    }}
                    inputProps={{ maxLength: 5, style: { textAlign: "center" } }}
                  />
                </CardContent>
              </Card>

              <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary, display: "block", textAlign: "center" }}>
                For simulation, enter any 4+ digit PIN (e.g. 1234)
              </Typography>
            </CardContent>
          </Card>

          <Button
            fullWidth
            variant="contained"
            onClick={handleStkConfirm}
            disabled={mobilePin.length < 4}
            sx={{
              borderRadius: 999,
              py: 1.4,
              fontSize: 15,
              fontWeight: 600,
              textTransform: "none",
              bgcolor: providerColor,
              color: isMtn ? "#000" : "#FFFFFF",
              "&:hover": { bgcolor: isMtn ? "#F57F17" : "#C62828" },
              "&.Mui-disabled": { bgcolor: "rgba(0,0,0,0.12)", color: "rgba(0,0,0,0.4)" }
            }}
          >
            Authorize Payment
          </Button>
        </Box>
      </Fade>
    );
  }

  // ─── INPUT STEP: MOBILE MONEY ───────────────────────────────────────────
  function renderMobileInput() {
    return (
      <Fade in>
        <Box>
          <Card
            elevation={0}
            sx={{
              mb: 2,
              borderRadius: 2.5,
              bgcolor: contentBg,
              border: theme.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <CardContent sx={{ px: 2, py: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <PhoneIphoneRoundedIcon sx={{ fontSize: 24, color: "#EA580C" }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Mobile Money Payment</Typography>
              </Stack>

              <Stack spacing={2}>
                {/* Provider dropdown */}
                <FormControl fullWidth size="small">
                  <InputLabel id="mobile-provider-label">Mobile Money Provider</InputLabel>
                  <Select
                    labelId="mobile-provider-label"
                    value={mobileProvider}
                    label="Mobile Money Provider"
                    onChange={(e) => setMobileProvider(e.target.value as "mtn" | "airtel")}
                    sx={{ borderRadius: 2, fontSize: 14 }}
                  >
                    <MenuItem value="mtn">
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: 1,
                            bgcolor: "#FDD835",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Typography sx={{ fontSize: 10, fontWeight: 800, color: "#000" }}>MTN</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>MTN Mobile Money</Typography>
                      </Stack>
                    </MenuItem>
                    <MenuItem value="airtel">
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: 1,
                            bgcolor: "#E53935",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Typography sx={{ fontSize: 8, fontWeight: 800, color: "#FFF" }}>Airtel</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Airtel Money</Typography>
                      </Stack>
                    </MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder={mobileProvider === "mtn" ? "+256 77X XXX XXX" : "+256 70X XXX XXX"}
                  size="small"
                  InputProps={{
                    sx: { borderRadius: 2, fontSize: 14 }
                  }}
                />
              </Stack>

              <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary, mt: 1.5, display: "block" }}>
                {mobileProvider === "mtn"
                  ? "You'll receive an MTN MoMo payment prompt on your phone"
                  : "You'll receive an Airtel Money payment prompt on your phone"}
              </Typography>
            </CardContent>
          </Card>

          <Button
            fullWidth
            variant="contained"
            onClick={handleInputSubmit}
            disabled={!mobileNumber || !mobileProvider}
            sx={{
              borderRadius: 999,
              py: 1.4,
              fontSize: 15,
              fontWeight: 600,
              textTransform: "none",
              bgcolor: mobileProvider === "mtn" ? "#F9A825" : "#E53935",
              color: mobileProvider === "mtn" ? "#000" : "#FFFFFF",
              "&:hover": { bgcolor: mobileProvider === "mtn" ? "#F57F17" : "#C62828" },
              "&.Mui-disabled": { bgcolor: "rgba(0,0,0,0.12)", color: "rgba(0,0,0,0.4)" }
            }}
          >
            {isTopUp ? "Deposit" : "Send"} {mobileProvider === "mtn" ? "MTN MoMo" : "Airtel Money"} {isTopUp ? "Funds" : "Request"}
          </Button>
        </Box>
      </Fade>
    );
  }

  // ─── PROCESSING STEP ────────────────────────────────────────────────────
  function renderProcessing() {
    return (
      <Fade in>
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: `${accentGreen}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
              animation: "pulse 1.5s ease-in-out infinite",
              "@keyframes pulse": {
                "0%": { transform: "scale(1)", boxShadow: `0 0 0 0 ${accentGreen}40` },
                "50%": { transform: "scale(1.05)", boxShadow: `0 0 0 20px ${accentGreen}00` },
                "100%": { transform: "scale(1)", boxShadow: `0 0 0 0 ${accentGreen}00` }
              }
            }}
          >
            {getPaymentIcon(paymentMethod)}
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            {isTopUp ? "Processing Top-up" : "Processing Payment"}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 13, color: theme.palette.text.secondary, mb: 3 }}>
            {paymentMethod === "wallet" && (isTopUp ? "Adding funds to your EVzone Wallet..." : "Deducting from your EVzone Wallet...")}
            {paymentMethod === "card" && (isTopUp ? "Processing card deposit to your wallet..." : "Verifying your card payment...")}
            {paymentMethod === "mobile" && (isTopUp ? "Waiting for mobile money deposit confirmation..." : "Waiting for mobile money confirmation...")}
            {paymentMethod === "cash" && "Confirming cash payment arrangement..."}
          </Typography>

          <Box sx={{ px: 4, mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 999,
                bgcolor: theme.palette.mode === "light" ? "#E5E7EB" : "rgba(51,65,85,0.5)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 999,
                  bgcolor: accentGreen
                }
              }}
            />
          </Box>

          <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary }}>
            Please do not close this page...
          </Typography>
        </Box>
      </Fade>
    );
  }

  // ─── RESULT STEP ────────────────────────────────────────────────────────
  function renderResult() {
    const isSuccess = result === "success";

    return (
      <Fade in>
        <Box>
          {/* Result Banner */}
          <Box sx={{ textAlign: "center", mb: 3, pt: 2 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: isSuccess ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2
              }}
            >
              {isSuccess ? (
                <CheckCircleRoundedIcon sx={{ fontSize: 48, color: "#22C55E" }} />
              ) : (
                <ErrorRoundedIcon sx={{ fontSize: 48, color: "#EF4444" }} />
              )}
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, letterSpacing: "-0.02em" }}>
              {isSuccess
                ? (isTopUp ? "Top-up Successful!" : "Payment Successful!")
                : (isTopUp ? "Top-up Failed" : "Payment Failed")}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 13, color: theme.palette.text.secondary, maxWidth: 300, mx: "auto" }}>
              {isSuccess
                ? (isTopUp
                    ? `${amount} has been added to your EVzone Wallet successfully.`
                    : `Your ${amount} payment for ${serviceName} has been processed successfully.`)
                : (isTopUp
                    ? "The top-up could not be completed. Please try again or use a different method."
                    : "The payment could not be completed. Please try again or use a different payment method.")
              }
            </Typography>
          </Box>

          {/* Transaction Details */}
          {isSuccess && (
            <Card
              elevation={0}
              sx={{
                mb: 2.5,
                borderRadius: 2.5,
                bgcolor: contentBg,
                border: "1px solid rgba(34,197,94,0.3)"
              }}
            >
              <CardContent sx={{ px: 2, py: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                  <ReceiptLongRoundedIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                  <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: theme.palette.text.secondary }}>
                    Transaction Receipt
                  </Typography>
                </Stack>

                <Stack spacing={0.6}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary }}>Transaction ID</Typography>
                    <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600 }}>{txnId}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary }}>Amount</Typography>
                    <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600 }}>{amount}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary }}>Method</Typography>
                    <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600 }}>{getPaymentLabel(paymentMethod, mobileProvider)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary }}>Status</Typography>
                    <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600, color: "#22C55E" }}>
                      {isTopUp ? "Credited" : "Completed"}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary }}>Date</Typography>
                    <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600 }}>{new Date().toLocaleString()}</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Stack spacing={1.5}>
            {isSuccess ? (
              <Button
                fullWidth
                variant="contained"
                onClick={handleSuccess}
                sx={{
                  borderRadius: 999,
                  py: 1.4,
                  fontSize: 15,
                  fontWeight: 600,
                  textTransform: "none",
                  bgcolor: accentGreen,
                  color: "#FFFFFF",
                  "&:hover": { bgcolor: "#02B87A" }
                }}
              >
                Continue
              </Button>
            ) : (
              <>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ReplayRoundedIcon />}
                  onClick={handleRetry}
                  sx={{
                    borderRadius: 999,
                    py: 1.4,
                    fontSize: 15,
                    fontWeight: 600,
                    textTransform: "none",
                    bgcolor: "#EF4444",
                    color: "#FFFFFF",
                    "&:hover": { bgcolor: "#DC2626" }
                  }}
                >
                  Try Again
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate(cancelPath, { state: extraData })}
                  sx={{
                    borderRadius: 999,
                    py: 1.2,
                    fontSize: 14,
                    fontWeight: 500,
                    textTransform: "none"
                  }}
                >
                  Go Back
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Fade>
    );
  }

  // ─── MAIN RENDER ────────────────────────────────────────────────────────
  const canGoBack = step !== "processing" && step !== "result";

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: theme.palette.background.default }}>
        <Box sx={{ bgcolor: "#03CD8C", px: 2.5, pt: 2, pb: 2, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={handleBack}
            sx={{
              position: "absolute",
              left: 20,
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "#FFFFFF",
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" }
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, letterSpacing: "-0.01em", color: "#FFFFFF" }}
          >
            {step === "review" && (isTopUp ? "Review Top-up" : "Review Payment")}
              {step === "input" && (paymentMethod === "wallet"
                ? (isTopUp ? "Wallet Top-up" : "Wallet Payment")
                : paymentMethod === "card"
                  ? (isTopUp ? "Card Deposit" : "Card Payment")
                  : (isTopUp ? "Mobile Money Deposit" : "Mobile Money"))}
              {step === "3dsecure" && "Bank Verification"}
              {step === "stkpush" && (isTopUp ? "Confirm Deposit" : "Confirm Payment")}
              {step === "processing" && "Processing..."}
              {step === "result" && (result === "success"
                ? (isTopUp ? "Top-up Complete" : "Payment Complete")
                : (isTopUp ? "Top-up Failed" : "Payment Failed"))}
          </Typography>
        </Box>
        <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>


        {/* Step Progress Dots */}
        {step !== "processing" && step !== "result" && (
          <Stack direction="row" spacing={0.75} justifyContent="center" sx={{ mb: 2.5 }}>
            {["review", "input", "verify"].map((s, i) => {
              const stepOrder = ["review", "input", "verify"];
              const currentIdx = step === "3dsecure" || step === "stkpush" ? 2 : stepOrder.indexOf(step);
              return (
                <Box
                  key={s}
                  sx={{
                    width: i <= currentIdx ? 24 : 8,
                    height: 8,
                    borderRadius: 999,
                    bgcolor: i <= currentIdx ? accentGreen : (theme.palette.mode === "light" ? "#E5E7EB" : "rgba(51,65,85,0.5)"),
                    transition: "all 0.3s ease"
                  }}
                />
              );
            })}
          </Stack>
        )}

        {/* Step Content */}
        {step === "review" && renderReview()}

        {step === "input" && paymentMethod === "wallet" && renderWalletInput()}
        {step === "input" && paymentMethod === "card" && renderCardInput()}
        {step === "input" && paymentMethod === "mobile" && renderMobileInput()}

        {step === "3dsecure" && render3DSecure()}
        {step === "stkpush" && renderStkPush()}
        {step === "processing" && renderProcessing()}
        {step === "result" && renderResult()}
      </Box>
    </Box>
  );
}

// ─── Exported page component ──────────────────────────────────────────────────
export default function PaymentGatewayPage(): React.JSX.Element {
  return (
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (t) => t.palette.background.default }}>
      <DarkModeToggle />
      <MobileShell>
        <PaymentGatewayScreen />
      </MobileShell>
    </Box>
  );
}
