import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  MenuItem,
  Divider,
  Snackbar,
  Alert,
  TextField
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import PaymentRoundedIcon from "@mui/icons-material/PaymentRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import LocalAtmRoundedIcon from "@mui/icons-material/LocalAtmRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";
import type { WalletTransaction } from "../store/types";


interface WalletContentProps {
  onBack?: () => void;
}

type Transaction = WalletTransaction;

function getTransactionIcon(type: Transaction["type"]): React.ReactElement {
  switch (type) {
    case "topup":
      return <ArrowDownwardRoundedIcon />;
    case "ride":
      return <DirectionsCarFilledRoundedIcon />;
    case "delivery":
      return <LocalShippingRoundedIcon />;
    case "withdrawal":
      return <ArrowUpwardRoundedIcon />;
    default:
      return <ReceiptLongRoundedIcon />;
  }
}

function WalletContent({ onBack }: WalletContentProps): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { walletBalance, walletReserved, transactions, reminders, actions } = useAppData();
  const dismissReminders = actions.dismissReminders;
  
  const balance = walletBalance;
  const reserved = walletReserved;
  const [showPaymentMethodsDialog, setShowPaymentMethodsDialog] = useState(false);
  const [paymentMethodMenu, setPaymentMethodMenu] = useState<{ open: boolean; anchorEl: HTMLElement | null; method: string | null }>({ open: false, anchorEl: null, method: null });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "warning" | "info" }>({ open: false, message: "", severity: "success" });
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [transactionError, setTransactionError] = useState(false);
  const [clearedTransactionIds, setClearedTransactionIds] = useState<Set<string>>(new Set());
  const [defaultMethod, setDefaultMethod] = useState("wallet");
  const [editMethod, setEditMethod] = useState<{ open: boolean; method: string | null }>({ open: false, method: null });
  const [infoDialog, setInfoDialog] = useState<{ open: boolean; title: string; content: string }>({
    open: false, title: "", content: ""
  });
  
  // For demo purposes - can be toggled to show empty states
  const visibleTransactions = useMemo(
    () => transactions.filter((tx) => !clearedTransactionIds.has(tx.id)),
    [transactions, clearedTransactionIds]
  );
  const hasTransactions = visibleTransactions.length > 0;
  const hasBalance = balance > 0;
  const totalFunds = Math.max(balance + reserved, 0);
  const freePercentage = totalFunds > 0 ? Math.round((balance / totalFunds) * 100) : 0;
  const reservedPercentage = Math.max(0, 100 - freePercentage);
  const walletReminders = useMemo(
    () =>
      reminders.filter(
        (reminder) =>
          reminder.category === "wallet" &&
          !/bus fees overdue/i.test(reminder.title)
      ),
    [reminders]
  );
  const walletAction = searchParams.get("action");

  useEffect(() => {
    if (walletAction !== "topup") {
      return;
    }
    navigate("/wallet/add-money", { replace: true });
    const next = new URLSearchParams(searchParams);
    next.delete("action");
    setSearchParams(next, { replace: true });
  }, [navigate, walletAction, searchParams, setSearchParams]);

  useEffect(() => {
    const walletFlowResult = (location.state as { walletFlowResult?: { flow: "add-money" | "withdraw"; amount?: string; methodTitle?: string } } | null)?.walletFlowResult;
    if (!walletFlowResult) {
      return;
    }

    setSnackbar({
      open: true,
      message:
        walletFlowResult.flow === "add-money"
          ? `${walletFlowResult.amount ?? "Funds"} added via ${walletFlowResult.methodTitle ?? "wallet funding"} simulation.`
          : `${walletFlowResult.amount ?? "Funds"} withdrawal via ${walletFlowResult.methodTitle ?? "wallet payout"} simulation submitted.`,
      severity: "success"
    });

    if (walletFlowResult.flow === "add-money") {
      const resolvedReminderIds = reminders
        .filter(
          (reminder) =>
            reminder.category === "wallet" &&
            (reminder.actionRoute.includes("/wallet?action=topup") || /wallet balance low/i.test(reminder.title))
        )
        .map((reminder) => reminder.id);
      if (resolvedReminderIds.length > 0) {
        dismissReminders(resolvedReminderIds);
      }
    }

    navigate("/wallet", { replace: true });
  }, [dismissReminders, location.state, navigate, reminders]);

  const handleAddMoney = () => {
    navigate("/wallet/add-money");
  };

  const handleWithdraw = () => {
    navigate("/wallet/withdraw");
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRetryTransactions = () => {
    setLoadingTransactions(true);
    setTransactionError(false);
    // Simulate API call
    setTimeout(() => {
      setLoadingTransactions(false);
      setSnackbar({
        open: true,
        message: "Transactions loaded successfully!",
        severity: "success"
      });
    }, 1000);
  };

  const handleClearHistory = () => {
    if (visibleTransactions.length === 0) return;
    setClearedTransactionIds((prev) => {
      const next = new Set(prev);
      visibleTransactions.forEach((tx) => next.add(tx.id));
      return next;
    });
    setSnackbar({
      open: true,
      message: "Recent activity cleared.",
      severity: "success"
    });
  };

  const handleManagePaymentMethods = () => {
    setShowPaymentMethodsDialog(true);
  };

  const handleViewAllTransactions = () => {
    // Navigate to full transaction history mapping to All History
    navigate("/history/all?type=transactions");
  };

  const handlePaymentMethodClick = (event: React.MouseEvent<HTMLElement>, method: string): void => {
    setPaymentMethodMenu({
      open: true,
      anchorEl: event.currentTarget,
      method: method
    });
  };

  const handlePaymentMethodMenuClose = () => {
    setPaymentMethodMenu({ open: false, anchorEl: null, method: null });
  };

  const handleSetAsDefault = () => {
    // Set payment method as default
    if (paymentMethodMenu.method) {
      setDefaultMethod(paymentMethodMenu.method);
      setSnackbar({
        open: true,
        message: `${paymentMethodMenu.method === "wallet" ? "EVzone Wallet" : paymentMethodMenu.method === "cards" ? "Card" : "Mobile Money"} set as default.`,
        severity: "success"
      });
    }
    handlePaymentMethodMenuClose();
  };

  const handleEditPaymentMethod = (method?: string | null): void => {
    // Edit payment method
    const methodToEdit = method || paymentMethodMenu.method;
    handlePaymentMethodMenuClose();
    setEditMethod({ open: true, method: methodToEdit });
  };

  const handleRemovePaymentMethod = () => {
    // Remove payment method
    console.log("Remove:", paymentMethodMenu.method);
    handlePaymentMethodMenuClose();
    // Could show confirmation dialog first
  };

  const handleTransactionClick = (transaction: Transaction): void => {
    // Navigate to transaction details
    if (transaction.type === "ride") {
      navigate(`/rides/history/${transaction.source.split(" ")[1]}`);
    } else if (transaction.type === "delivery") {
      navigate(`/deliveries/tracking/${transaction.source.split(" ")[1]}`);
    } else {
      // Show transaction details dialog or navigate to transaction detail
      console.log("Transaction details:", transaction);
    }
  };

  return (
    <ScreenScaffold>
      <SectionHeader
        title="Wallet"
        subtitle="EVzone Pay • Rides, deliveries, rentals & tours"
        leadingAction={
          onBack ? (
            <IconButton
              size="small"
              aria-label="Back"
              onClick={onBack}
              sx={{
                borderRadius: uiTokens.radius.xl,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)"
              }}
            >
              <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          ) : null
        }
      />

      {/* Wallet summary strip */}
      <Card
        elevation={0}
        sx={{
          mb: uiTokens.spacing.md,
          borderRadius: uiTokens.radius.sm,
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.md }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={uiTokens.spacing.sm}>
            <Box
              sx={{
                flex: 1,
                p: uiTokens.spacing.smPlus,
                borderRadius: uiTokens.radius.xl,
                bgcolor: (t) => (t.palette.mode === "light" ? "rgba(16,185,129,0.1)" : "rgba(16,185,129,0.16)")
              }}
            >
              <Typography variant="caption" sx={{ fontSize: 10, color: (t) => t.palette.text.secondary }}>
                Free to use
              </Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#047857", letterSpacing: "-0.02em" }}>
                UGX {balance.toLocaleString()}
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                p: uiTokens.spacing.smPlus,
                borderRadius: uiTokens.radius.xl,
                bgcolor: (t) => (t.palette.mode === "light" ? "rgba(249,115,22,0.12)" : "rgba(249,115,22,0.18)")
              }}
            >
              <Typography variant="caption" sx={{ fontSize: 10, color: (t) => t.palette.text.secondary }}>
                Reserved & holds
              </Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#C2410C", letterSpacing: "-0.02em" }}>
                UGX {reserved.toLocaleString()}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Balance card */}
      <Card
        elevation={0}
        sx={{
          mb: uiTokens.spacing.lg,
          borderRadius: uiTokens.radius.sm,
          position: "relative",
          overflow: "hidden",
          bgcolor: (t) =>
            t.palette.mode === "light"
              ? "linear-gradient(145deg, #ECFDF5 0%, #FFF7ED 100%)"
              : "linear-gradient(145deg, #064E3B 0%, #7C2D12 100%)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(148,163,184,0.35)"
              : "1px solid rgba(148,163,184,0.4)"
        }}
      >
        <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.lg, position: "relative" }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "flex-start" }}
            spacing={uiTokens.spacing.lg}
          >
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={uiTokens.spacing.xs} sx={{ mb: uiTokens.spacing.xs }}>
                <Chip
                  size="small"
                  icon={<AccountBalanceWalletRoundedIcon sx={{ fontSize: 14 }} />}
                  label="EVzone Wallet"
                  sx={{
                    height: 22,
                    borderRadius: uiTokens.radius.xl,
                    bgcolor: "rgba(16,185,129,0.18)",
                    color: "#065F46",
                    fontWeight: 700,
                    fontSize: 10
                  }}
                />
                <Chip
                  size="small"
                  icon={<PaymentRoundedIcon sx={{ fontSize: 14 }} />}
                  label="Payments active"
                  sx={{
                    height: 22,
                    borderRadius: uiTokens.radius.xl,
                    bgcolor: "rgba(249,115,22,0.16)",
                    color: "#C2410C",
                    fontWeight: 700,
                    fontSize: 10
                  }}
                />
              </Stack>
              <Typography
                variant="caption"
                sx={{
                  fontSize: { xs: 10, sm: 11 },
                  color: (t) => (t.palette.mode === "light" ? "rgba(15,23,42,0.74)" : "rgba(255,255,255,0.78)")
                }}
              >
                Available balance
              </Typography>
              {hasBalance ? (
                <>
                  <Typography
                    variant="h5"
                    sx={{
                      mt: uiTokens.spacing.xxs,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      color: (t) => (t.palette.mode === "light" ? "#022C22" : "#ECFDF5"),
                      fontSize: { xs: "1.5rem", sm: "1.78rem" }
                    }}
                  >
                    UGX {balance.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: 9.5, sm: 10.5 },
                      color: (t) => (t.palette.mode === "light" ? "rgba(15,23,42,0.66)" : "rgba(255,255,255,0.75)"),
                      mt: uiTokens.spacing.xxs,
                      display: "block"
                    }}
                  >
                    Available for rides, deliveries, rentals & tours
                  </Typography>
                  <Typography
                    variant="caption"
                    onClick={() => {
                      setInfoDialog({
                        open: true,
                        title: "Reserved funds breakdown",
                        content: `• Ongoing trip: UGX 100,000\n• Delivery hold: UGX 80,000\n\nTotal reserved: UGX ${reserved.toLocaleString()}`
                      });
                    }}
                    sx={{
                      fontSize: { xs: 10, sm: 10.5 },
                      color: (t) => (t.palette.mode === "light" ? "#9A3412" : "#FDBA74"),
                      mt: uiTokens.spacing.xs,
                      display: "block",
                      cursor: "pointer",
                      textDecoration: "underline"
                    }}
                  >
                    Reserved & holds: UGX {reserved.toLocaleString()}
                  </Typography>
                </>
              ) : (
                <Box sx={{ mt: 2, textAlign: { xs: "center", sm: "left" } }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: 12, sm: 13 },
                      color: (t) => t.palette.text.secondary,
                      mb: uiTokens.spacing.lg
                    }}
                  >
                    Your wallet is empty. Add money to start booking rides and deliveries.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddCircleRoundedIcon />}
                    onClick={handleAddMoney}
                    sx={{
                      bgcolor: uiTokens.colors.brand,
                      color: uiTokens.colors.ink,
                      borderRadius: uiTokens.radius.xl,
                      px: uiTokens.spacing.xxl,
                      py: uiTokens.spacing.sm,
                      fontSize: { xs: 12, sm: 13 },
                      fontWeight: 700,
                      textTransform: "none",
                      "&:hover": { bgcolor: uiTokens.colors.brandHover }
                    }}
                  >
                    Add money
                  </Button>
                </Box>
              )}
            </Box>
            {hasBalance && (
              <Box
                onClick={() => {
                  setInfoDialog({
                    open: true,
                    title: "Balance breakdown",
                    content: `Free: UGX ${balance.toLocaleString()}\nReserved: UGX ${reserved.toLocaleString()}\n\nReserved funds are held for:\n• Ongoing trips\n• Active deliveries`
                  });
                }}
                sx={{
                  cursor: "pointer",
                  width: { xs: "100%", sm: 180 },
                  p: uiTokens.spacing.smPlus,
                  borderRadius: uiTokens.radius.xl,
                  bgcolor: (t) => (t.palette.mode === "light" ? "rgba(255,255,255,0.68)" : "rgba(2,6,23,0.28)"),
                  border: "1px solid rgba(255,255,255,0.22)"
                }}
              >
                <Stack direction="row" justifyContent="space-between" sx={{ mb: uiTokens.spacing.xxs }}>
                  <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 700, color: "#047857" }}>
                    Free {freePercentage}%
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 700, color: "#C2410C" }}>
                    Reserved {reservedPercentage}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, freePercentage)}
                  sx={{
                    width: "100%",
                    height: 6,
                    borderRadius: uiTokens.radius.xl,
                    bgcolor: "rgba(249,115,22,0.26)",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: uiTokens.radius.xl,
                      bgcolor: "#059669"
                    }
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 10,
                    color: (t) => (t.palette.mode === "light" ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.78)"),
                    display: "block",
                    mt: uiTokens.spacing.xs
                  }}
                >
                  Tap to view detailed holds
                </Typography>
              </Box>
            )}
          </Stack>

          {hasBalance && (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={uiTokens.spacing.mdPlus}
              sx={{ mt: uiTokens.spacing.lg }}
            >
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddCircleRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                onClick={handleAddMoney}
                sx={{
                  borderRadius: uiTokens.radius.xl,
                  py: uiTokens.spacing.md,
                  fontSize: { xs: 12, sm: 13 },
                  fontWeight: 700,
                  textTransform: "none",
                  bgcolor: uiTokens.colors.brand,
                  color: uiTokens.colors.ink,
                  "&:hover": { bgcolor: uiTokens.colors.brandHover }
                }}
              >
                Add money
              </Button>
              <Button
                fullWidth
                variant="contained"
                startIcon={<ArrowUpwardRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                onClick={handleWithdraw}
                sx={{
                  borderRadius: uiTokens.radius.xl,
                  py: uiTokens.spacing.md,
                  fontSize: { xs: 12, sm: 13 },
                  fontWeight: 700,
                  textTransform: "none",
                  bgcolor: uiTokens.colors.accent,
                  color: "#FFFFFF",
                  "&:hover": { bgcolor: uiTokens.colors.accentHover }
                }}
              >
                Withdraw
              </Button>
            </Stack>
          )}
        </CardContent>
      </Card>

      <Card
        elevation={0}
        sx={{
          mb: uiTokens.spacing.lg,
          borderRadius: uiTokens.radius.md,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)",
          boxShadow: "0 10px 24px rgba(15,23,42,0.06)"
        }}
      >
        <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.lg }}>
          <Stack
            direction="row"
            spacing={uiTokens.spacing.xs}
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: uiTokens.spacing.md }}
          >
            <Stack direction="row" spacing={uiTokens.spacing.xs} alignItems="center">
              <NotificationsRoundedIcon sx={{ fontSize: 18, color: "#F97316" }} />
              <Typography variant="subtitle2" sx={{ fontSize: 13, fontWeight: 700 }}>
                Wallet reminders
              </Typography>
            </Stack>
            <Chip
              label={`${walletReminders.length} active`}
              size="small"
              sx={{
                height: 22,
                borderRadius: uiTokens.radius.xl,
                fontSize: 10,
                fontWeight: 700,
                bgcolor: "rgba(16,185,129,0.12)",
                color: "#047857"
              }}
            />
          </Stack>

          {walletReminders.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ fontSize: 12, color: (t) => t.palette.text.secondary }}
            >
              No payment reminders right now.
            </Typography>
          ) : (
            <Stack spacing={uiTokens.spacing.smPlus}>
              {walletReminders.map((reminder) => (
                <Box
                  key={reminder.id}
                  sx={{
                    p: uiTokens.spacing.smPlus,
                    borderRadius: uiTokens.radius.xl,
                    border: /wallet balance low/i.test(reminder.title)
                      ? "1px solid rgba(16,185,129,0.35)"
                      : "1px solid rgba(249,115,22,0.35)",
                    bgcolor: (t) =>
                      t.palette.mode === "light"
                        ? /wallet balance low/i.test(reminder.title)
                          ? "rgba(16,185,129,0.08)"
                          : "rgba(249,115,22,0.08)"
                        : "rgba(15,23,42,0.9)"
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={uiTokens.spacing.sm}
                    justifyContent="space-between"
                    alignItems={{ sm: "center" }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {reminder.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                      >
                        {reminder.description}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(reminder.actionRoute)}
                      sx={{
                        textTransform: "none",
                        whiteSpace: "nowrap",
                        borderColor: /wallet balance low/i.test(reminder.title)
                          ? "rgba(16,185,129,0.45)"
                          : "rgba(249,115,22,0.5)",
                        color: /wallet balance low/i.test(reminder.title) ? "#047857" : "#C2410C",
                        "&:hover": {
                          borderColor: /wallet balance low/i.test(reminder.title)
                            ? "rgba(16,185,129,0.7)"
                            : "rgba(249,115,22,0.75)",
                          bgcolor: /wallet balance low/i.test(reminder.title)
                            ? "rgba(16,185,129,0.08)"
                            : "rgba(249,115,22,0.08)"
                        }
                      }}
                    >
                      {reminder.ctaLabel ?? "Review"}
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      <Card
        elevation={0}
        sx={{
          mb: uiTokens.spacing.lg,
          borderRadius: uiTokens.radius.md,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)",
          boxShadow: "0 10px 24px rgba(15,23,42,0.06)"
        }}
      >
        <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.lg }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: uiTokens.spacing.mdPlus }}
          >
            <Stack direction="row" spacing={uiTokens.spacing.xs} alignItems="center">
              <PaymentRoundedIcon sx={{ fontSize: 18, color: "#F97316" }} />
              <Typography variant="subtitle2" sx={{ fontSize: 13, fontWeight: 700 }}>
                Payment methods
              </Typography>
            </Stack>
            <Button
              variant="text"
              size="small"
              onClick={handleManagePaymentMethods}
              sx={{ 
                fontSize: 10.5,
                fontWeight: 600,
                color: "#C2410C",
                textTransform: "none",
                minWidth: "auto",
                px: uiTokens.spacing.smPlus,
                py: uiTokens.spacing.xs,
                borderRadius: uiTokens.radius.xl,
                bgcolor: "rgba(249,115,22,0.08)",
                "&:hover": {
                  color: "#9A3412",
                  bgcolor: "rgba(249,115,22,0.14)"
                }
              }}
            >
              Manage
            </Button>
          </Stack>
          <Typography
            variant="caption"
            sx={{ display: "block", mb: uiTokens.spacing.sm, fontSize: 10.5, color: (t) => t.palette.text.secondary }}
          >
            Tap a method card to set it as default for your next checkout.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: uiTokens.spacing.smPlus, sm: uiTokens.spacing.mdPlus }}
          >
            <Card
              elevation={0}
              onClick={(e) => handlePaymentMethodClick(e, "wallet")}
              sx={{
                flex: 1,
                width: "100%",
                minHeight: { xs: 74, sm: 90 },
                borderRadius: uiTokens.radius.xl,
                cursor: "pointer",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#ECFDF5" : "rgba(15,23,42,0.9)",
                border:
                  defaultMethod === "wallet"
                    ? "2px solid rgba(52,211,153,0.9)"
                    : "1px solid rgba(52,211,153,0.45)",
                boxShadow:
                  defaultMethod === "wallet"
                    ? "0 0 0 3px rgba(16,185,129,0.18)"
                    : "0 0 0 1px rgba(16,185,129,0.08)",
                transition: "all 0.15s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                }
              }}
            >
              <CardContent
                sx={{
                  px: { xs: uiTokens.spacing.md, sm: uiTokens.spacing.mdPlus },
                  py: { xs: uiTokens.spacing.smPlus, sm: uiTokens.spacing.mdPlus }
                }}
              >
                <Stack
                  direction="row"
                  spacing={uiTokens.spacing.xs}
                  alignItems="center"
                  sx={{ mb: uiTokens.spacing.xxs }}
                >
                  <AccountBalanceWalletRoundedIcon sx={{ fontSize: 18, color: "#047857" }} />
                  <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600, color: (t) => t.palette.text.primary }}>
                    EVzone Wallet
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 10, color: (t) => defaultMethod === "wallet" ? "rgba(22,101,52,0.9)" : t.palette.text.secondary }}
                >
                  {defaultMethod === "wallet" ? "Default for rides & deliveries" : "Secondary payment method"}
                </Typography>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              onClick={(e) => handlePaymentMethodClick(e, "cards")}
              sx={{
                flex: 1,
                width: "100%",
                minHeight: { xs: 74, sm: 90 },
                borderRadius: uiTokens.radius.xl,
                border:
                  defaultMethod === "cards"
                    ? "2px solid rgba(59,130,246,0.9)"
                    : "1px solid rgba(148,163,184,0.35)",
                boxShadow:
                  defaultMethod === "cards"
                    ? "0 0 0 3px rgba(59,130,246,0.16)"
                    : "0 0 0 1px rgba(148,163,184,0.08)",
                transition: "all 0.15s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                }
              }}
            >
              <CardContent
                sx={{
                  px: { xs: uiTokens.spacing.md, sm: uiTokens.spacing.mdPlus },
                  py: { xs: uiTokens.spacing.smPlus, sm: uiTokens.spacing.mdPlus }
                }}
              >
                <Stack direction="row" spacing={0.85} alignItems="center" sx={{ mb: 0.4 }}>
                  <CreditCardRoundedIcon sx={{ fontSize: 18, color: "#1D4ED8" }} />
                  <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600, color: (t) => t.palette.text.primary }}>
                    Cards
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 10, color: (t) => defaultMethod === "cards" ? "rgba(29,78,216,0.9)" : t.palette.text.secondary }}
                >
                  {defaultMethod === "cards" ? "Default for rides & deliveries" : "VISA •••• 2451"}
                </Typography>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              onClick={(e) => handlePaymentMethodClick(e, "mobile")}
              sx={{
                flex: 1,
                width: "100%",
                minHeight: { xs: 74, sm: 90 },
                borderRadius: uiTokens.radius.xl,
                border:
                  defaultMethod === "mobile"
                    ? "2px solid rgba(234,88,12,0.9)"
                    : "1px solid rgba(148,163,184,0.35)",
                boxShadow:
                  defaultMethod === "mobile"
                    ? "0 0 0 3px rgba(234,88,12,0.16)"
                    : "0 0 0 1px rgba(148,163,184,0.08)",
                transition: "all 0.15s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                }
              }}
            >
              <CardContent
                sx={{
                  px: { xs: uiTokens.spacing.md, sm: uiTokens.spacing.mdPlus },
                  py: { xs: uiTokens.spacing.smPlus, sm: uiTokens.spacing.mdPlus }
                }}
              >
                <Stack direction="row" spacing={0.85} alignItems="center" sx={{ mb: 0.4 }}>
                  <LocalAtmRoundedIcon sx={{ fontSize: 18, color: "#EA580C" }} />
                  <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600, color: (t) => t.palette.text.primary }}>
                    Mobile money
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 10, color: (t) => defaultMethod === "mobile" ? "rgba(234,88,12,0.9)" : t.palette.text.secondary }}
                >
                  {defaultMethod === "mobile" ? "Default for rides & deliveries" : "MTN Mobile Money"}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </CardContent>
      </Card>

      {/* Recent activity */}
      <Card
        elevation={0}
        sx={{
          mb: uiTokens.spacing.lg,
          borderRadius: uiTokens.radius.md,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)",
          boxShadow: "0 10px 24px rgba(15,23,42,0.06)"
        }}
      >
        <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.lg }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: uiTokens.spacing.md }}
          >
            <Stack direction="row" spacing={uiTokens.spacing.xs} alignItems="center">
              <ReceiptLongRoundedIcon
                sx={{ fontSize: 18, color: "#047857" }}
              />
              <Typography variant="subtitle2" sx={{ fontSize: 13, fontWeight: 700 }}>
                Recent activity
              </Typography>
              <Chip
                label="Credits"
                size="small"
                sx={{
                  height: 20,
                  borderRadius: uiTokens.radius.xl,
                  fontSize: 9.5,
                  bgcolor: "rgba(16,185,129,0.12)",
                  color: "#047857"
                }}
              />
              <Chip
                label="Debits"
                size="small"
                sx={{
                  height: 20,
                  borderRadius: uiTokens.radius.xl,
                  fontSize: 9.5,
                  bgcolor: "rgba(249,115,22,0.12)",
                  color: "#C2410C"
                }}
              />
            </Stack>
            <Stack direction="row" spacing={uiTokens.spacing.xs} alignItems="center" sx={{ flexShrink: 0 }}>
              <Button
                size="small"
                variant="text"
                onClick={handleViewAllTransactions}
                sx={{
                  borderRadius: uiTokens.radius.xl,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  fontSize: 11.5,
                  fontWeight: 800,
                  minWidth: "auto",
                  px: uiTokens.spacing.smPlus,
                  color: (t) => t.palette.text.primary,
                  transition: "all 0.18s ease",
                  "&:hover": {
                    color: "#C2410C",
                    bgcolor: (t) => (t.palette.mode === "light" ? "rgba(249,115,22,0.12)" : "rgba(249,115,22,0.2)"),
                    transform: "translateY(-1px)"
                  }
                }}
              >
                View all
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={handleClearHistory}
                disabled={visibleTransactions.length === 0}
                sx={{
                  borderRadius: uiTokens.radius.xl,
                  textTransform: "none",
                  fontSize: 10.5,
                  minWidth: "auto",
                  px: uiTokens.spacing.smPlus,
                  borderColor: "rgba(249,115,22,0.55)",
                  color: "#C2410C",
                  "&:hover": {
                    borderColor: "rgba(249,115,22,0.8)",
                    bgcolor: "rgba(249,115,22,0.08)"
                  }
                }}
              >
                Clear
              </Button>
            </Stack>
          </Stack>

          {transactionError ? (
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: 12, sm: 13 }, color: (t) => t.palette.text.secondary, mb: 2 }}
              >
                We couldn't load your recent activity. Try again.
              </Typography>
              <Button
                variant="outlined"
                onClick={handleRetryTransactions}
                sx={{
                  textTransform: "none",
                  borderRadius: uiTokens.radius.xl,
                  px: 3,
                  py: 0.75,
                  fontSize: { xs: 11, sm: 12 }
                }}
              >
                Try again
              </Button>
            </Box>
          ) : loadingTransactions ? (
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: 12, sm: 13 }, color: (t) => t.palette.text.secondary }}
              >
                Loading transactions...
              </Typography>
            </Box>
          ) : hasTransactions ? (
          <List dense sx={{ mt: 0, py: 0 }}>
            {visibleTransactions.map((tx) => (
              <ListItem
                key={tx.id}
                disableGutters
                onClick={() => handleTransactionClick(tx)}
                sx={{
                    py: uiTokens.spacing.sm,
                  cursor: "pointer",
                  borderRadius: uiTokens.radius.xl,
                  transition: "background-color 0.15s ease",
                  "&:hover": {
                    bgcolor: (t) => t.palette.mode === "light" ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)"
                  },
                  "&:not(:last-of-type)": {
                    borderBottom: (t) => `1px dashed ${t.palette.divider}`
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                        width: { xs: 28, sm: 30 },
                        height: { xs: 28, sm: 30 },
                      bgcolor:
                        tx.type === "topup"
                          ? "rgba(22,163,74,0.12)"
                          : tx.type === "ride"
                          ? "rgba(37,99,235,0.12)"
                          : "rgba(234,88,12,0.12)",
                      color:
                        tx.type === "topup"
                          ? "#16A34A"
                          : tx.type === "ride"
                          ? "#1D4ED8"
                          : "#EA580C"
                    }}
                  >
                    {getTransactionIcon(tx.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="caption"
                        sx={{ fontSize: { xs: 11, sm: 11.5 }, fontWeight: 500 }}
                    >
                      {tx.title}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                        sx={{ fontSize: { xs: 10, sm: 10.5 }, color: (t) => t.palette.text.secondary }}
                    >
                      {tx.source} • {tx.time}
                    </Typography>
                  }
                />
                <Typography
                  variant="caption"
                  sx={{
                      fontSize: { xs: 10.5, sm: 11 },
                    fontWeight: 600,
                    color:
                      tx.type === "topup"
                        ? "#16A34A"
                        : "rgba(15,23,42,0.85)"
                  }}
                >
                  {tx.amount}
                </Typography>
              </ListItem>
            ))}
          </List>
          ) : (
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: 12, sm: 13 }, color: (t) => t.palette.text.secondary, mb: 2 }}
              >
                No recent activity. Add money or take a ride to see transactions here.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="center">
                <Button
                  variant="contained"
                  startIcon={<AddCircleRoundedIcon />}
                  onClick={handleAddMoney}
                  sx={{
                    textTransform: "none",
                    borderRadius: uiTokens.radius.xl,
                    px: 3,
                    py: 0.75,
                    fontSize: { xs: 11, sm: 12 },
                    bgcolor: "#022C22",
                    color: "#ECFDF5",
                    "&:hover": { bgcolor: "#064E3B" }
                  }}
                >
                  Add money
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/rides/enter")}
                  sx={{
                    textTransform: "none",
                    borderRadius: uiTokens.radius.xl,
                    px: 3,
                    py: 0.75,
                    fontSize: { xs: 11, sm: 12 }
                  }}
                >
                  Take a ride
                </Button>
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
      >
        Your EVzone Wallet is used for rides, deliveries, rentals and tours. You
        can connect more payment methods from the EVzone Pay settings.
      </Typography>

      {/* Payment Methods Management Dialog */}
      <Dialog
        open={showPaymentMethodsDialog}
        onClose={() => setShowPaymentMethodsDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: uiTokens.radius.xl,
            bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
            maxWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Payment Methods</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            {/* EVzone Wallet */}
            <Card
              elevation={0}
              sx={{
                borderRadius: uiTokens.radius.xl,
                bgcolor: (t) => t.palette.mode === "light" ? "#ECFDF5" : "rgba(15,23,42,0.9)",
                border: "1px solid rgba(52,211,153,0.5)"
              }}
            >
              <CardContent sx={{ px: 2, py: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <AccountBalanceWalletRoundedIcon sx={{ fontSize: 24, color: "#047857" }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        EVzone Wallet
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: 11, color: "rgba(22,101,52,0.9)" }}>
                        Default for rides & deliveries
                      </Typography>
                    </Box>
                  </Stack>
                  <CheckCircleRoundedIcon sx={{ fontSize: 20, color: "#047857" }} />
                </Stack>
              </CardContent>
            </Card>

            {/* Cards */}
            <Card
              elevation={0}
              sx={{
                borderRadius: uiTokens.radius.xl,
                bgcolor: (t) => t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                border: (t) => t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
              }}
            >
              <CardContent sx={{ px: 2, py: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CreditCardRoundedIcon sx={{ fontSize: 24, color: "#1D4ED8" }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        VISA •••• 2451
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                        Expires 08/28
                      </Typography>
                    </Box>
                  </Stack>
                  <IconButton size="small" onClick={() => handleEditPaymentMethod("cards")}>
                    <EditRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>

            {/* Mobile Money */}
            <Card
              elevation={0}
              sx={{
                borderRadius: uiTokens.radius.xl,
                bgcolor: (t) => t.palette.mode === "light" ? "#FFFBEB" : "rgba(15,23,42,0.96)",
                border: "1px solid rgba(245,158,11,0.6)"
              }}
            >
              <CardContent sx={{ px: 2, py: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <LocalAtmRoundedIcon sx={{ fontSize: 24, color: "#EA580C" }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Mobile money
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                        MTN / Airtel
                      </Typography>
                    </Box>
                  </Stack>
                  <IconButton size="small" onClick={() => handleEditPaymentMethod("mobile")}>
                    <EditRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>

            <Divider sx={{ my: 1 }} />

            {/* Add New Payment Method */}
            <Button
              variant="outlined"
              fullWidth
              startIcon={<AddRoundedIcon />}
              onClick={() => {
                setShowPaymentMethodsDialog(false);
                // Navigate to add payment method screen or show dialog
                navigate("/settings");
              }}
              sx={{
                textTransform: "none",
                borderRadius: uiTokens.radius.xl,
                py: 1.2,
                borderStyle: "dashed"
              }}
            >
              Add payment method
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button
            onClick={() => setShowPaymentMethodsDialog(false)}
            sx={{ textTransform: "none" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Method Context Menu */}
      <Menu
        anchorEl={paymentMethodMenu.anchorEl}
        open={paymentMethodMenu.open}
        onClose={handlePaymentMethodMenuClose}
        PaperProps={{
          sx: {
            borderRadius: uiTokens.radius.xl,
            minWidth: 200,
            bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"
          }
        }}
      >
        {paymentMethodMenu.method &&
          paymentMethodMenu.method !== defaultMethod && (
            <MenuItem onClick={handleSetAsDefault}>
              <CheckCircleRoundedIcon sx={{ fontSize: 18, mr: 1.5 }} />
              Set as default
            </MenuItem>
          )}
        <MenuItem onClick={() => handleEditPaymentMethod()}>
          <EditRoundedIcon sx={{ fontSize: 18, mr: 1.5 }} />
          Edit
        </MenuItem>
        {paymentMethodMenu.method !== "wallet" && (
          <>
            <Divider />
            <MenuItem onClick={handleRemovePaymentMethod} sx={{ color: "#EF4444" }}>
              <DeleteRoundedIcon sx={{ fontSize: 18, mr: 1.5 }} />
              Remove
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Success/Error Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: uiTokens.radius.xl,
            bgcolor: (t) =>
              snackbar.severity === "success"
                ? t.palette.mode === "light"
                  ? "#D1FAE5"
                  : "rgba(22,163,74,0.2)"
                : t.palette.mode === "light"
                ? "#FEE2E2"
                : "rgba(220,38,38,0.2)",
            color: (t) => t.palette.text.primary
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Edit Payment Method Dialog */}
      <Dialog
        open={editMethod.open}
        onClose={() => setEditMethod({ open: false, method: null })}
        PaperProps={{
          sx: {
            borderRadius: uiTokens.radius.xl,
            bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
            maxWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Edit {editMethod.method === "wallet" ? "EVzone Wallet" : editMethod.method === "cards" ? "Card" : "Mobile Money"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Account Name"
              defaultValue={editMethod.method === "wallet" ? "Stewart Robinson" : editMethod.method === "cards" ? "S ROBINSON" : "Stewart Robinson"}
              size="small"
            />
            {editMethod.method === "cards" && (
              <>
                <TextField
                  fullWidth
                  label="Card Number"
                  defaultValue="•••• •••• •••• 2451"
                  size="small"
                />
                <Stack direction="row" spacing={1.5}>
                  <TextField
                    fullWidth
                    label="Expiry"
                    defaultValue="08/28"
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="CVV"
                    defaultValue="123"
                    size="small"
                  />
                </Stack>
              </>
            )}
            {editMethod.method === "mobile" && (
              <TextField
                fullWidth
                label="Phone Number"
                defaultValue="+256 772 000 000"
                size="small"
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button onClick={() => setEditMethod({ open: false, method: null })} sx={{ textTransform: "none" }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setEditMethod({ open: false, method: null });
              setSnackbar({ open: true, message: "Changes saved successfully!", severity: "success" });
            }}
            sx={{
              textTransform: "none",
              bgcolor: uiTokens.colors.brand,
              color: uiTokens.colors.ink,
              "&:hover": { bgcolor: uiTokens.colors.brandHover }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Wallet Info Dialog (replaces alert() calls) */}
      <Dialog
        open={infoDialog.open}
        onClose={() => setInfoDialog({ ...infoDialog, open: false })}
        PaperProps={{
          sx: {
            borderRadius: uiTokens.radius.xl,
            bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
            minWidth: 280
          }
        }}
      >
        <DialogTitle sx={{ fontSize: 16, fontWeight: 600 }}>{infoDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: 13, whiteSpace: "pre-line", color: (t) => t.palette.text.secondary }}>
            {infoDialog.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button
            onClick={() => setInfoDialog({ ...infoDialog, open: false })}
            sx={{
              textTransform: "none",
              color: uiTokens.colors.brand,
              fontWeight: 600
            }}
          >
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </ScreenScaffold>
  );
}

export default function Wallet(): React.JSX.Element {
  const navigate = useNavigate();

  return <WalletContent onBack={() => navigate(-1)} />;
}
