import React from "react";
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
  Avatar
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

function WalletContent({ onBack }) {
  const balance = 520000; // demo
  const reserved = 180000; // e.g. deposits / holds

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
          mb: 2,
          borderRadius: 3,
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
        <CardContent sx={{ px: 1.9, py: 1.9 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: "rgba(15,23,42,0.7)" }}
              >
                Available balance
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mt: 0.4,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  color: "#022C22"
                }}
              >
                UGX {balance.toLocaleString()}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 10.5, color: "rgba(15,23,42,0.7)", mt: 0.4, display: "block" }}
              >
                Reserved & holds: UGX {reserved.toLocaleString()}
              </Typography>
            </Box>
            <Stack spacing={0.8} alignItems="flex-end">
              <Chip
                size="small"
                icon={<PaymentRoundedIcon sx={{ fontSize: 14 }} />}
                label="EV-first payments"
                sx={{
                  borderRadius: 999,
                  fontSize: 10,
                  height: 22,
                  bgcolor: "rgba(255,255,255,0.85)",
                  color: "#064E3B"
                }}
              />
              <LinearProgress
                variant="determinate"
                value={Math.min(100, (balance / (balance + reserved)) * 100)}
                sx={{
                  mt: 0.3,
                  width: 96,
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
                sx={{ fontSize: 10, color: "rgba(15,23,42,0.7)" }}
              >
                80% free • 20% reserved
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1.25} sx={{ mt: 1.7 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddCircleRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{
                borderRadius: 999,
                py: 0.9,
                fontSize: 13,
                fontWeight: 600,
                textTransform: "none",
                bgcolor: "#022C22",
                color: "#ECFDF5",
                "&:hover": { bgcolor: "#064E3B" }
              }}
            >
              Add money
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ArrowUpwardRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{
                borderRadius: 999,
                py: 0.9,
                fontSize: 13,
                textTransform: "none",
                borderColor: "rgba(15,23,42,0.35)",
                color: "rgba(15,23,42,0.85)",
                "&:hover": {
                  borderColor: "rgba(15,23,42,0.6)",
                  bgcolor: "rgba(15,23,42,0.04)"
                }
              }}
            >
              Withdraw
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Payment methods */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
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
            <Typography
              variant="caption"
              sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary, cursor: "pointer" }}
            >
              Manage
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.3}>
            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 2,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#ECFDF5" : "rgba(15,23,42,0.9)",
                border: "1px solid rgba(52,211,153,0.5)"
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.3 }}>
                <Stack direction="row" spacing={0.85} alignItems="center" sx={{ mb: 0.4 }}>
                  <AccountBalanceWalletRoundedIcon sx={{ fontSize: 18, color: "#047857" }} />
                  <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600 }}>
                    EVzone Wallet
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 10, color: "rgba(22,101,52,0.9)" }}
                >
                  Default for rides & deliveries
                </Typography>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 2,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)"
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.3 }}>
                <Stack direction="row" spacing={0.85} alignItems="center" sx={{ mb: 0.4 }}>
                  <CreditCardRoundedIcon sx={{ fontSize: 18, color: "#1D4ED8" }} />
                  <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600 }}>
                    Cards
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 10, color: (t) => t.palette.text.secondary }}
                >
                  VISA •••• 2451
                </Typography>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 2,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFBEB" : "rgba(15,23,42,0.96)",
                border: "1px solid rgba(245,158,11,0.6)"
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.3 }}>
                <Stack direction="row" spacing={0.85} alignItems="center" sx={{ mb: 0.4 }}>
                  <LocalAtmRoundedIcon sx={{ fontSize: 18, color: "#EA580C" }} />
                  <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600 }}>
                    Mobile money
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 10, color: (t) => t.palette.text.secondary }}
                >
                  MTN / Airtel
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
          mb: 1.5,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.6 }}>
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
              sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary, cursor: "pointer" }}
            >
              View all
            </Typography>
          </Stack>

          <List dense sx={{ mt: 0, py: 0 }}>
            {TRANSACTIONS.map((tx) => (
              <ListItem
                key={tx.id}
                disableGutters
                sx={{
                  py: 0.4,
                  "&:not(:last-of-type)": {
                    borderBottom: (t) => `1px dashed ${t.palette.divider}`
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
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
                      sx={{ fontSize: 11.5, fontWeight: 500 }}
                    >
                      {tx.title}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
                    >
                      {tx.source} • {tx.time}
                    </Typography>
                  }
                />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 11,
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
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
      >
        Your EVzone Wallet is used for rides, deliveries, rentals and tours. You
        can connect more payment methods from the EVzone Pay settings.
      </Typography>
    </Box>
  );
}

export default function Wallet() {
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
