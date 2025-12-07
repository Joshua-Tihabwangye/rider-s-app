import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Alert
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

import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";

const TRANSACTIONS = [
  {
    id: 1,
    type: "topup",
    title: "Wallet top-up",
    source: "Mobile Money (MTN)",
    amount: "+ UGX 150,000",
    time: "Today • 09:32",
    icon: <ArrowDownwardRoundedIcon />
  },
  {
    id: 2,
    type: "ride",
    title: "EV ride to Bugolobi",
    source: "Trip RIDE-2025-10-01-001",
    amount: "- UGX 18,500",
    time: "Yesterday • 20:14",
    icon: <DirectionsCarFilledRoundedIcon />
  },
  {
    id: 3,
    type: "delivery",
    title: "Parcel to Nsambya Hub",
    source: "Delivery DLV-2025-10-05-002",
    amount: "- UGX 8,000",
    time: "Mon • 11:03",
    icon: <LocalShippingRoundedIcon />
  }
];

interface WalletContentProps {
  onBack?: () => void;
}

interface Transaction {
  id: number;
  type: string;
  title: string;
  source: string;
  amount: string;
  time: string;
  icon: React.ReactElement;
}

function WalletContent({ onBack }: WalletContentProps): React.JSX.Element {
  const navigate = useNavigate();
  
  const balance = 520000; // demo
  const reserved = 180000; // e.g. deposits / holds
  const [showAddMoneyDialog, setShowAddMoneyDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showPaymentMethodsDialog, setShowPaymentMethodsDialog] = useState(false);
  const [paymentMethodMenu, setPaymentMethodMenu] = useState<{ open: boolean; anchorEl: HTMLElement | null; method: string | null }>({ open: false, anchorEl: null, method: null });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "warning" | "info" }>({ open: false, message: "", severity: "success" });
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [transactionError, setTransactionError] = useState(false);
  
  // For demo purposes - can be toggled to show empty states
  const hasTransactions = TRANSACTIONS.length > 0;
  const hasBalance = balance > 0;

  const handleAddMoney = () => {
    setShowAddMoneyDialog(true);
  };

  const handleAddMoneySuccess = () => {
    setShowAddMoneyDialog(false);
    setSnackbar({
      open: true,
      message: "Money added successfully to your wallet!",
      severity: "success"
    });
  };

  const handleWithdraw = () => {
    setShowWithdrawDialog(true);
  };

  const handleWithdrawSuccess = () => {
    setShowWithdrawDialog(false);
    setSnackbar({
      open: true,
      message: "Withdrawal request submitted successfully!",
      severity: "success"
    });
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

  const handleManagePaymentMethods = () => {
    setShowPaymentMethodsDialog(true);
  };

  const handleViewAllTransactions = () => {
    // Navigate to full transaction history (could be a new screen or existing)
    navigate("/wallet/transactions");
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
    console.log("Set as default:", paymentMethodMenu.method);
    handlePaymentMethodMenuClose();
  };

  const handleEditPaymentMethod = (method?: string | null): void => {
    // Edit payment method
    const methodToEdit = method || paymentMethodMenu.method;
    console.log("Edit:", methodToEdit);
    handlePaymentMethodMenuClose();
    // Could navigate to edit screen or show edit dialog
    // For now, navigate to settings
    navigate("/settings");
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
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={onBack}
            sx={{
              borderRadius: 999,
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 999,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#ECFDF5" : "rgba(15,23,42,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <AccountBalanceWalletRoundedIcon
                sx={{ fontSize: 22, color: "#03CD8C" }}
              />
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                Wallet
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                EVzone Pay • Rides, deliveries, rentals & tours
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Balance card */}
      <Card
        elevation={0}
        sx={{
          mb: { xs: 1.5, sm: 2 },
          borderRadius: { xs: 2.5, sm: 3 },
          bgcolor: (t) =>
            t.palette.mode === "light"
              ? "radial-gradient(circle at top, #BBF7D0, #ECFDF5)"
              : "radial-gradient(circle at top, #064E3B, #020617)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(22,163,74,0.35)"
              : "1px solid rgba(22,163,74,0.65)"
        }}
      >
        <CardContent sx={{ px: { xs: 1.5, sm: 1.9 }, py: { xs: 1.5, sm: 1.9 } }}>
          <Stack 
            direction={{ xs: "column", sm: "row" }} 
            justifyContent="space-between" 
            alignItems={{ xs: "flex-start", sm: "flex-start" }}
            spacing={{ xs: 2, sm: 0 }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{ fontSize: { xs: 10, sm: 11 }, color: (t) => t.palette.mode === "light" ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.7)" }}
              >
                Available balance
              </Typography>
              {hasBalance ? (
                <>
              <Typography
                variant="h5"
                sx={{
                  mt: 0.4,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                      color: (t) => t.palette.mode === "light" ? "#022C22" : "#ECFDF5",
                      fontSize: { xs: "1.5rem", sm: "1.75rem" }
                }}
              >
                UGX {balance.toLocaleString()}
              </Typography>
              <Typography
                variant="caption"
                    sx={{ fontSize: { xs: 9.5, sm: 10 }, color: (t) => t.palette.mode === "light" ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.6)", mt: 0.3, display: "block" }}
                  >
                    Available for rides, deliveries, rentals & tours
                  </Typography>
                  <Typography
                    variant="caption"
                    onClick={() => {
                      // Open reserved funds breakdown
                      alert(`Reserved funds breakdown:\n- Ongoing trip: UGX 100,000\n- Delivery hold: UGX 80,000\nTotal: UGX ${reserved.toLocaleString()}`);
                    }}
                    sx={{
                      fontSize: { xs: 10, sm: 10.5 },
                      color: (t) => t.palette.mode === "light" ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.7)",
                      mt: 0.5,
                      display: "block",
                      cursor: "pointer",
                      textDecoration: "underline",
                      "&:hover": {
                        color: (t) => t.palette.mode === "light" ? "rgba(15,23,42,0.9)" : "rgba(255,255,255,0.9)"
                      }
                    }}
              >
                Reserved & holds: UGX {reserved.toLocaleString()}
              </Typography>
                </>
              ) : (
                <Box sx={{ mt: 2, textAlign: { xs: "center", sm: "left" } }}>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: { xs: 12, sm: 13 }, color: (t) => t.palette.text.secondary, mb: 2 }}
                  >
                    Your wallet is empty. Add money to start booking rides and deliveries.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddCircleRoundedIcon />}
                    onClick={handleAddMoney}
                    sx={{
                      bgcolor: (t) => t.palette.mode === "light" ? "#022C22" : "#03CD8C",
                      color: (t) => t.palette.mode === "light" ? "#ECFDF5" : "#020617",
                      borderRadius: 999,
                      px: 3,
                      py: 1,
                      fontSize: { xs: 12, sm: 13 },
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": { bgcolor: (t) => t.palette.mode === "light" ? "#064E3B" : "#02B87A" }
                    }}
                  >
                    Add money
                  </Button>
            </Box>
              )}
            </Box>
            {hasBalance && (
              <Stack 
                spacing={0.8} 
                alignItems={{ xs: "flex-start", sm: "flex-end" }}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
              <Chip
                size="small"
                  icon={<PaymentRoundedIcon sx={{ fontSize: { xs: 12, sm: 14 } }} />}
                label="EV-first payments"
                  onClick={() => {
                    alert(`EV-first payments: part of your balance may be reserved for ongoing trips and deliveries.\n\nFree: UGX ${balance.toLocaleString()}\nReserved: UGX ${reserved.toLocaleString()}`);
                  }}
                sx={{
                  borderRadius: 999,
                    fontSize: { xs: 9, sm: 10 },
                    height: { xs: 20, sm: 22 },
                  bgcolor: "rgba(255,255,255,0.85)",
                    color: "#064E3B",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.95)"
                    }
                }}
              />
                <Box
                  onClick={() => {
                    alert(`Balance breakdown:\nFree: UGX ${balance.toLocaleString()}\nReserved: UGX ${reserved.toLocaleString()}\n\nReserved funds are held for:\n- Ongoing trips\n- Active deliveries`);
                  }}
                  sx={{ cursor: "pointer", width: { xs: "100%", sm: 96 } }}
                >
              <LinearProgress
                variant="determinate"
                value={Math.min(100, (balance / (balance + reserved)) * 100)}
                sx={{
                  mt: 0.3,
                      width: "100%",
                  height: 5,
                  borderRadius: 999,
                  bgcolor: "rgba(15,23,42,0.15)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 999,
                    bgcolor: "#059669"
                  }
                }}
              />
              <Typography
                variant="caption"
                  sx={{
                    fontSize: { xs: 9.5, sm: 10 },
                    color: (t) => t.palette.mode === "light" ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.7)",
                    display: "block",
                    mt: 0.25,
                    textAlign: { xs: "left", sm: "center" }
                  }}
              >
                80% free • 20% reserved
              </Typography>
                </Box>
            </Stack>
            )}
          </Stack>

          {hasBalance && (
            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={1.25} 
              sx={{ mt: 1.7 }}
            >
            <Button
              fullWidth
              variant="contained"
                startIcon={<AddCircleRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
              onClick={handleAddMoney}
              sx={{
                borderRadius: 999,
                  py: { xs: 0.75, sm: 0.9 },
                  fontSize: { xs: 12, sm: 13 },
                fontWeight: 600,
                textTransform: "none",
                  bgcolor: (t) => t.palette.mode === "light" ? "#022C22" : "#03CD8C",
                  color: (t) => t.palette.mode === "light" ? "#ECFDF5" : "#020617",
                  "&:hover": { bgcolor: (t) => t.palette.mode === "light" ? "#064E3B" : "#02B87A" }
              }}
            >
              Add money
            </Button>
            <Button
              fullWidth
              variant="outlined"
                startIcon={<ArrowUpwardRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
              onClick={handleWithdraw}
              sx={{
                borderRadius: 999,
                  py: { xs: 0.75, sm: 0.9 },
                  fontSize: { xs: 12, sm: 13 },
                textTransform: "none",
                  borderColor: (t) => t.palette.mode === "light" ? "rgba(15,23,42,0.35)" : "rgba(255,255,255,0.35)",
                  color: (t) => t.palette.mode === "light" ? "rgba(15,23,42,0.85)" : "rgba(255,255,255,0.85)",
                "&:hover": {
                    borderColor: (t) => t.palette.mode === "light" ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.6)",
                    bgcolor: (t) => t.palette.mode === "light" ? "rgba(15,23,42,0.04)" : "rgba(255,255,255,0.04)"
                }
              }}
            >
              Withdraw
            </Button>
          </Stack>
          )}
        </CardContent>
      </Card>

      {/* Payment methods */}
      <Card
        elevation={0}
        sx={{
          mb: { xs: 1.5, sm: 2 },
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: { xs: 1.5, sm: 1.75 }, py: { xs: 1.5, sm: 1.75 } }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1.2 }}
          >
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Payment methods
            </Typography>
            <Button
              variant="text"
              size="small"
              onClick={handleManagePaymentMethods}
              sx={{ 
                fontSize: 10.5, 
                fontWeight: 600,
                color: (t) => t.palette.text.secondary, 
                textTransform: "none",
                minWidth: "auto",
                px: 1,
                py: 0.25,
                "&:hover": {
                  color: (t) => t.palette.text.primary,
                  bgcolor: "transparent"
                }
              }}
            >
              Manage
            </Button>
          </Stack>

          <Stack 
            direction="row" 
            spacing={1.3}
          >
            <Card
              elevation={0}
              onClick={(e) => handlePaymentMethodClick(e, "wallet")}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#ECFDF5" : "rgba(15,23,42,0.9)",
                border: "1px solid rgba(52,211,153,0.5)",
                transition: "all 0.15s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                }
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.3 }}>
                <Stack direction="row" spacing={0.85} alignItems="center" sx={{ mb: 0.4 }}>
                  <AccountBalanceWalletRoundedIcon sx={{ fontSize: 18, color: "#047857" }} />
                  <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600, color: (t) => t.palette.text.primary }}>
                    EVzone Wallet
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 10, color: (t) => t.palette.mode === "light" ? "rgba(22,101,52,0.9)" : "rgba(236,253,245,0.8)" }}
                >
                  Default for rides & deliveries
                </Typography>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              onClick={(e) => handlePaymentMethodClick(e, "cards")}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                transition: "all 0.15s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                }
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.3 }}>
                <Stack direction="row" spacing={0.85} alignItems="center" sx={{ mb: 0.4 }}>
                  <CreditCardRoundedIcon sx={{ fontSize: 18, color: "#1D4ED8" }} />
                  <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600, color: (t) => t.palette.text.primary }}>
                    Cards
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 10, color: (t) => t.palette.text.secondary }}
                >
                  VISA 768 767 879 2451 • Expires 11/27
                </Typography>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              onClick={(e) => handlePaymentMethodClick(e, "mobile")}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFBEB" : "rgba(15,23,42,0.96)",
                border: "1px solid rgba(245,158,11,0.6)",
                transition: "all 0.15s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                }
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.3 }}>
                <Stack direction="row" spacing={0.85} alignItems="center" sx={{ mb: 0.4 }}>
                  <LocalAtmRoundedIcon sx={{ fontSize: 18, color: "#EA580C" }} />
                  <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600, color: (t) => t.palette.text.primary }}>
                    Mobile money
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 10, color: (t) => t.palette.text.secondary }}
                >
                  MTN Mobile Money • +256777777777
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
          mb: { xs: 1.25, sm: 1.5 },
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: { xs: 1.5, sm: 1.75 }, py: { xs: 1.4, sm: 1.6 } }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1.1 }}
          >
            <Stack direction="row" spacing={0.75} alignItems="center">
              <ReceiptLongRoundedIcon
                sx={{ fontSize: 18, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Recent activity
              </Typography>
            </Stack>
            <Typography
              variant="caption"
              onClick={handleViewAllTransactions}
              sx={{ 
                fontSize: 10.5, 
                color: (t) => t.palette.text.secondary, 
                cursor: "pointer",
                "&:hover": {
                  color: (t) => t.palette.text.primary
                }
              }}
            >
              View all
            </Typography>
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
                  borderRadius: 999,
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
            {TRANSACTIONS.map((tx) => (
              <ListItem
                key={tx.id}
                disableGutters
                onClick={() => handleTransactionClick(tx)}
                sx={{
                    py: { xs: 0.5, sm: 0.4 },
                  cursor: "pointer",
                  borderRadius: 1,
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
                    {tx.icon}
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
                    borderRadius: 999,
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
                    borderRadius: 999,
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

      {/* Add Money Dialog */}
      <Dialog
        open={showAddMoneyDialog}
        onClose={() => setShowAddMoneyDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Add Money to Wallet</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: (t) => t.palette.text.secondary, mb: 2 }}>
            Choose a payment method to add funds to your EVzone Wallet.
          </DialogContentText>
          <Stack spacing={1.5}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<LocalAtmRoundedIcon />}
              onClick={handleAddMoneySuccess}
              sx={{ textTransform: "none", justifyContent: "flex-start" }}
            >
              Mobile Money (MTN / Airtel)
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<CreditCardRoundedIcon />}
              onClick={handleAddMoneySuccess}
              sx={{ textTransform: "none", justifyContent: "flex-start" }}
            >
              Credit/Debit Card
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button
            onClick={() => setShowAddMoneyDialog(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog
        open={showWithdrawDialog}
        onClose={() => setShowWithdrawDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Withdraw Funds</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: (t) => t.palette.text.secondary, mb: 2 }}>
            Transfer funds from your EVzone Wallet to your bank account or mobile money.
          </DialogContentText>
          <Stack spacing={1.5}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<LocalAtmRoundedIcon />}
              onClick={handleWithdrawSuccess}
              sx={{ textTransform: "none", justifyContent: "flex-start" }}
            >
              Mobile Money (MTN / Airtel)
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<CreditCardRoundedIcon />}
              onClick={handleWithdrawSuccess}
              sx={{ textTransform: "none", justifyContent: "flex-start" }}
            >
              Bank Account
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button
            onClick={() => setShowWithdrawDialog(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Methods Management Dialog */}
      <Dialog
        open={showPaymentMethodsDialog}
        onClose={() => setShowPaymentMethodsDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
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
                borderRadius: 2,
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
                borderRadius: 2,
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
                borderRadius: 2,
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
                borderRadius: 2,
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
            borderRadius: 2,
            minWidth: 200,
            bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"
          }
        }}
      >
        {paymentMethodMenu.method !== "wallet" && (
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
            borderRadius: 2,
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
    </Box>
  );
}

export default function Wallet(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (t) => t.palette.background.default
      }}
    >
      <DarkModeToggle />
      <MobileShell>
        <WalletContent onBack={() => navigate(-1)} />
      </MobileShell>
    </Box>
  );
}
