import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";
import type { WalletTransaction } from "../store/types";

type GatewayType = "mobile_money" | "card" | "wallet" | "bank" | "generic";

interface TransactionMeta {
  gatewayName: string;
  gatewayType: GatewayType;
  referenceLabel: string;
  referenceValue: string;
  status: string;
}

function inferGatewayMeta(tx: WalletTransaction): TransactionMeta {
  const source = tx.source.toLowerCase();

  if (source.includes("mobile money") || source.includes("mtn") || source.includes("airtel")) {
    return {
      gatewayName: "EVzone Mobile Money Gateway",
      gatewayType: "mobile_money",
      referenceLabel: "Mobile money channel",
      referenceValue: tx.source,
      status: "Completed"
    };
  }

  if (source.includes("visa") || source.includes("mastercard") || source.includes("card") || source.includes("••••")) {
    return {
      gatewayName: "EVzone Card Gateway",
      gatewayType: "card",
      referenceLabel: "Card source",
      referenceValue: tx.source,
      status: "Completed"
    };
  }

  if (tx.type === "ride" || tx.type === "delivery" || tx.type === "rental" || tx.type === "tour") {
    return {
      gatewayName: "EVzone Wallet Gateway",
      gatewayType: "wallet",
      referenceLabel: "Service reference",
      referenceValue: tx.source,
      status: "Completed"
    };
  }

  if (tx.type === "withdrawal") {
    return {
      gatewayName: "EVzone Payout Gateway",
      gatewayType: "bank",
      referenceLabel: "Payout destination",
      referenceValue: tx.source,
      status: "Processed"
    };
  }

  return {
    gatewayName: "EVzone Payment Gateway",
    gatewayType: "generic",
    referenceLabel: "Source",
    referenceValue: tx.source,
    status: "Completed"
  };
}

function prettyType(value: WalletTransaction["type"]): string {
  switch (value) {
    case "topup":
      return "Wallet top-up";
    case "ride":
      return "Ride payment";
    case "delivery":
      return "Delivery payment";
    case "rental":
      return "Rental payment";
    case "tour":
      return "Tour payment";
    case "withdrawal":
      return "Wallet withdrawal";
    default:
      return "Wallet transaction";
  }
}

function gatewayIcon(type: GatewayType): React.ReactElement {
  switch (type) {
    case "mobile_money":
      return <SmartphoneRoundedIcon sx={{ fontSize: 18 }} />;
    case "card":
      return <CreditCardRoundedIcon sx={{ fontSize: 18 }} />;
    case "wallet":
      return <AccountBalanceWalletRoundedIcon sx={{ fontSize: 18 }} />;
    default:
      return <ReceiptLongRoundedIcon sx={{ fontSize: 18 }} />;
  }
}

function DetailRow({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={uiTokens.spacing.sm}>
      <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
        {label}
      </Typography>
      <Typography variant="caption" sx={{ fontSize: 11.5, fontWeight: 700, textAlign: "right" }}>
        {value}
      </Typography>
    </Stack>
  );
}

export default function WalletTransactionDetail(): React.JSX.Element {
  const navigate = useNavigate();
  const { transactionId } = useParams<{ transactionId: string }>();
  const { transactions } = useAppData();

  const transaction = useMemo(
    () => transactions.find((item) => item.id === transactionId),
    [transactions, transactionId]
  );

  const meta = useMemo(
    () => (transaction ? inferGatewayMeta(transaction) : null),
    [transaction]
  );

  if (!transaction || !meta) {
    return (
      <ScreenScaffold>
        <SectionHeader
          title="Transaction details"
          subtitle="Wallet transaction record"
          leadingAction={
            <IconButton
              size="small"
              aria-label="Back"
              onClick={() => navigate(-1)}
              sx={{
                borderRadius: uiTokens.radius.xl,
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
        <Typography variant="body2" sx={{ color: (t) => t.palette.text.secondary }}>
          Transaction not found.
        </Typography>
      </ScreenScaffold>
    );
  }

  const isCredit = transaction.amount.trim().startsWith("+");

  return (
    <ScreenScaffold>
      <SectionHeader
        title="Transaction details"
        subtitle={transaction.id}
        leadingAction={
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: uiTokens.radius.xl,
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
          borderRadius: uiTokens.radius.md,
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.lg }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: uiTokens.spacing.md }}>
            <Stack direction="row" spacing={uiTokens.spacing.xs} alignItems="center">
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: uiTokens.radius.xl,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: isCredit ? "rgba(16,185,129,0.14)" : "rgba(249,115,22,0.14)",
                  color: isCredit ? "#047857" : "#C2410C"
                }}
              >
                {gatewayIcon(meta.gatewayType)}
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {prettyType(transaction.type)}
              </Typography>
            </Stack>
            <Chip
              size="small"
              label={isCredit ? "Credit" : "Debit"}
              sx={{
                height: 22,
                borderRadius: uiTokens.radius.xl,
                fontSize: 10,
                fontWeight: 700,
                bgcolor: isCredit ? "rgba(16,185,129,0.14)" : "rgba(249,115,22,0.14)",
                color: isCredit ? "#047857" : "#C2410C"
              }}
            />
          </Stack>

          <Typography
            sx={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: isCredit ? "#047857" : "#C2410C",
              mb: uiTokens.spacing.sm
            }}
          >
            {transaction.amount}
          </Typography>

          <Divider sx={{ mb: uiTokens.spacing.smPlus }} />
          <Stack spacing={uiTokens.spacing.sm}>
            <DetailRow label="Transaction title" value={transaction.title} />
            <DetailRow label="Gateway" value={meta.gatewayName} />
            <DetailRow label={meta.referenceLabel} value={meta.referenceValue} />
            <DetailRow label="Time" value={transaction.time} />
            <DetailRow label="Status" value={meta.status} />
            <DetailRow label="Transaction ID" value={transaction.id} />
          </Stack>
        </CardContent>
      </Card>
    </ScreenScaffold>
  );
}
