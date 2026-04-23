import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import LocalAtmRoundedIcon from "@mui/icons-material/LocalAtmRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import { uiTokens } from "../design/tokens";

type WalletFlowType = "add-money" | "withdraw";
type WalletFlowMethod = "wallet" | "mobile" | "card" | "bank";

interface WalletFlowMethodConfig {
  id: WalletFlowMethod;
  title: string;
  description: string;
  accent: string;
  icon: React.ReactElement;
  headline: string;
  submitLabel: string;
}

const FLOW_METHODS: Record<WalletFlowType, WalletFlowMethodConfig[]> = {
  "add-money": [
    {
      id: "wallet",
      title: "EVzone Wallet",
      description: "Receive a transfer from another EVzone Wallet or rewards balance",
      accent: "#10B981",
      icon: <AccountBalanceWalletRoundedIcon sx={{ fontSize: 22 }} />,
      headline: "EVzone Wallet transfer",
      submitLabel: "Simulate wallet transfer"
    },
    {
      id: "mobile",
      title: "Mobile Money (MTN / Airtel)",
      description: "Push prompt top-up from a Uganda mobile money account",
      accent: "#F59E0B",
      icon: <SmartphoneRoundedIcon sx={{ fontSize: 22 }} />,
      headline: "Mobile money top-up",
      submitLabel: "Send top-up prompt"
    },
    {
      id: "card",
      title: "Credit/Debit Card",
      description: "Fund your wallet with Visa, Mastercard, or virtual card",
      accent: "#2563EB",
      icon: <CreditCardRoundedIcon sx={{ fontSize: 22 }} />,
      headline: "Card funding",
      submitLabel: "Authorize card top-up"
    }
  ],
  withdraw: [
    {
      id: "mobile",
      title: "Mobile Money (MTN / Airtel)",
      description: "Send funds from your EVzone Wallet to a mobile money line",
      accent: "#F59E0B",
      icon: <LocalAtmRoundedIcon sx={{ fontSize: 22 }} />,
      headline: "Withdraw to mobile money",
      submitLabel: "Submit withdrawal"
    },
    {
      id: "bank",
      title: "Bank Account",
      description: "Transfer money from your EVzone Wallet to your bank account",
      accent: "#475569",
      icon: <AccountBalanceRoundedIcon sx={{ fontSize: 22 }} />,
      headline: "Withdraw to bank",
      submitLabel: "Request bank transfer"
    }
  ]
};

function getFlowLabel(flow: WalletFlowType): string {
  return flow === "add-money" ? "Add money" : "Withdraw";
}

function getMethod(flow: WalletFlowType, method: string | undefined): WalletFlowMethodConfig | null {
  return FLOW_METHODS[flow].find((item) => item.id === method) ?? null;
}

function getTransactionReference(prefix: string): string {
  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
}

function parseWalletAmount(value: string, fallback: string): string {
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return trimmed.toUpperCase().includes("UGX") ? trimmed : `UGX ${trimmed}`;
}

export function WalletTransferSelectionScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const params = useParams();
  const flow = (params.flowType === "withdraw" ? "withdraw" : "add-money") as WalletFlowType;
  const methods = FLOW_METHODS[flow];

  return (
    <ScreenScaffold>
      <SectionHeader
        title={getFlowLabel(flow)}
        subtitle={
          flow === "add-money"
            ? "Choose how you want to fund your EVzone Wallet."
            : "Choose where you want your EVzone Wallet funds sent."
        }
        leadingAction={
          <IconButton
            size="small"
            onClick={() => navigate("/wallet")}
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
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 2, py: 2 }}>
          <Stack spacing={1.25}>
            {methods.map((method) => (
              <Button
                key={method.id}
                variant="outlined"
                fullWidth
                onClick={() => navigate(`/wallet/${flow}/${method.id}`)}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  borderRadius: 2.5,
                  p: 1.25,
                  borderColor: `${method.accent}55`
                }}
              >
                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ textAlign: "left" }}>
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2,
                      bgcolor: `${method.accent}16`,
                      color: method.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {method.icon}
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
                      {method.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {method.description}
                    </Typography>
                  </Box>
                </Stack>
              </Button>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </ScreenScaffold>
  );
}

export function WalletTransferMethodScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const flow = (params.flowType === "withdraw" ? "withdraw" : "add-money") as WalletFlowType;
  const method = getMethod(flow, params.method);

  const defaultAmount = flow === "add-money" ? "UGX 25,000" : "UGX 120,000";
  const [amount, setAmount] = useState(defaultAmount);
  const [walletId, setWalletId] = useState("EVZ-UG-778201");
  const [senderPhone, setSenderPhone] = useState("+256 772 000 000");
  const [provider, setProvider] = useState("MTN Mobile Money");
  const [mobilePhone, setMobilePhone] = useState("+256 772 000 000");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardName, setCardName] = useState("S ROBINSON");
  const [cardExpiry, setCardExpiry] = useState("08/29");
  const [cardCvv, setCardCvv] = useState("123");
  const [bankName, setBankName] = useState("Stanbic Bank Uganda");
  const [accountName, setAccountName] = useState("Stewart Robinson");
  const [accountNumber, setAccountNumber] = useState("010345678921");

  const isValid = useMemo(() => {
    if (!method) return false;
    if (method.id === "wallet") return amount.trim().length > 0 && walletId.trim().length > 4 && senderPhone.trim().length > 8;
    if (method.id === "mobile") return amount.trim().length > 0 && mobilePhone.trim().length > 8 && provider.trim().length > 0;
    if (method.id === "card") {
      return amount.trim().length > 0 && cardNumber.trim().length >= 12 && cardName.trim().length >= 4 && cardExpiry.trim().length >= 4 && cardCvv.trim().length >= 3;
    }
    return amount.trim().length > 0 && bankName.trim().length > 2 && accountName.trim().length > 2 && accountNumber.trim().length >= 8;
  }, [accountName, accountNumber, amount, bankName, cardCvv, cardExpiry, cardName, cardNumber, method, mobilePhone, provider, senderPhone, walletId]);

  if (!method) {
    navigate(`/wallet/${flow}`, { replace: true });
    return <Box />;
  }

  const summaryAmount = parseWalletAmount(amount, defaultAmount);

  const handleContinue = (): void => {
    const referencePrefix = flow === "add-money" ? "TOPUP" : "WDR";
    navigate(`/wallet/${flow}/${method.id}/success`, {
      state: {
        fromWalletFlow: true,
        amount: summaryAmount,
        methodTitle: method.title,
        reference: getTransactionReference(referencePrefix),
        flow
      }
    });
  };

  return (
    <ScreenScaffold>
      <SectionHeader
        title={method.headline}
        subtitle={method.description}
        leadingAction={
          <IconButton
            size="small"
            onClick={() => navigate(`/wallet/${flow}`)}
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
        action={<Chip label={flow === "add-money" ? "Deposit simulation" : "Withdrawal simulation"} size="small" sx={{ borderRadius: 2 }} />}
      />

      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          bgcolor: `${method.accent}10`,
          border: `1px solid ${method.accent}22`
        }}
      >
        <CardContent sx={{ px: 2, py: 1.75 }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Transaction amount
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "-0.03em", mt: 0.2 }}>
            {summaryAmount}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.75, color: "text.secondary" }}>
            {flow === "add-money"
              ? "This simulated page mirrors a typical EV wallet funding flow."
              : "This simulated page mirrors a typical wallet withdrawal request flow."}
          </Typography>
        </CardContent>
      </Card>

      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 2, py: 2 }}>
          <Stack spacing={1.5}>
            <Alert severity={flow === "add-money" ? "success" : "info"}>
              {flow === "add-money"
                ? `Funds will be credited to your EVzone Wallet after ${method.title.toLowerCase()} approval.`
                : `Your ${method.title.toLowerCase()} payout request will be queued after submission.`}
            </Alert>

            <TextField
              label={flow === "add-money" ? "Amount to add" : "Amount to withdraw"}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              fullWidth
              size="small"
            />

            {method.id === "wallet" && (
              <>
                <TextField
                  label="Source EVzone Wallet ID"
                  value={walletId}
                  onChange={(event) => setWalletId(event.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Sender phone number"
                  value={senderPhone}
                  onChange={(event) => setSenderPhone(event.target.value)}
                  fullWidth
                  size="small"
                />
              </>
            )}

            {method.id === "mobile" && (
              <>
                <TextField
                  select
                  label="Provider"
                  value={provider}
                  onChange={(event) => setProvider(event.target.value)}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="MTN Mobile Money">MTN Mobile Money</MenuItem>
                  <MenuItem value="Airtel Money">Airtel Money</MenuItem>
                </TextField>
                <TextField
                  label={flow === "add-money" ? "Phone number to charge" : "Phone number to receive funds"}
                  value={mobilePhone}
                  onChange={(event) => setMobilePhone(event.target.value)}
                  fullWidth
                  size="small"
                />
              </>
            )}

            {method.id === "card" && (
              <>
                <TextField
                  label="Card number"
                  value={cardNumber}
                  onChange={(event) => setCardNumber(event.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Cardholder name"
                  value={cardName}
                  onChange={(event) => setCardName(event.target.value)}
                  fullWidth
                  size="small"
                />
                <Stack direction="row" spacing={1.25}>
                  <TextField
                    label="Expiry"
                    value={cardExpiry}
                    onChange={(event) => setCardExpiry(event.target.value)}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="CVV"
                    value={cardCvv}
                    onChange={(event) => setCardCvv(event.target.value)}
                    fullWidth
                    size="small"
                  />
                </Stack>
              </>
            )}

            {method.id === "bank" && (
              <>
                <TextField
                  label="Bank name"
                  value={bankName}
                  onChange={(event) => setBankName(event.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Account name"
                  value={accountName}
                  onChange={(event) => setAccountName(event.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Account number"
                  value={accountNumber}
                  onChange={(event) => setAccountNumber(event.target.value)}
                  fullWidth
                  size="small"
                />
              </>
            )}

            <Divider />

            <Button
              fullWidth
              variant="contained"
              disabled={!isValid}
              onClick={handleContinue}
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
          </Stack>
        </CardContent>
      </Card>
    </ScreenScaffold>
  );
}

export function WalletTransferSuccessScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const flow = (params.flowType === "withdraw" ? "withdraw" : "add-money") as WalletFlowType;
  const routeState =
    ((location.state as {
      amount?: string;
      methodTitle?: string;
      reference?: string;
      flow?: WalletFlowType;
    } | null) ?? {});

  return (
    <ScreenScaffold>
      <SectionHeader
        title={flow === "add-money" ? "Deposit submitted" : "Withdrawal submitted"}
        subtitle={
          flow === "add-money"
            ? "Your EVzone Wallet funding simulation was completed."
            : "Your EVzone Wallet withdrawal simulation was completed."
        }
      />

      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          overflow: "hidden",
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
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
            {routeState.amount ?? "UGX 0"} {flow === "add-money" ? "queued for deposit" : "queued for payout"}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.75, opacity: 0.9 }}>
            {routeState.methodTitle ?? "Wallet transfer"} simulation completed.
          </Typography>
        </Box>

        <CardContent sx={{ px: 2, py: 2 }}>
          <Stack spacing={1.25}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Reference: <strong>{routeState.reference ?? "SIM-000000"}</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {flow === "add-money"
                ? "In production, the next step would be confirmation from the external payment rail and balance refresh."
                : "In production, the next step would be payout review, fraud checks, and transfer settlement."}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              onClick={() =>
                navigate("/wallet", {
                  state: {
                    walletFlowResult: {
                      flow,
                      amount: routeState.amount,
                      methodTitle: routeState.methodTitle
                    }
                  }
                })
              }
              sx={{
                mt: 1,
                minHeight: 48,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 700,
                bgcolor: "#03CD8C",
                color: "#020617",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#02b377",
                  boxShadow: "none"
                }
              }}
            >
              Back to wallet
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </ScreenScaffold>
  );
}
