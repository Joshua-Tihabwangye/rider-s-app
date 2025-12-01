import React, { useState, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  Box,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  IconButton,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  Divider
} from "@mui/material";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import TourRoundedIcon from "@mui/icons-material/TourRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: { main: "#03CD8C" },
    secondary: { main: "#F77F00" },
    ...(mode === "light"
      ? {
          background: { default: "#F3F4F6", paper: "#FFFFFF" },
          text: { primary: "#0F172A", secondary: "#6B7280" },
          divider: "rgba(148,163,184,0.4)"
        }
      : {
          background: { default: "#020617", paper: "#020617" },
          text: { primary: "#F9FAFB", secondary: "#A6A6A6" },
          divider: "rgba(148,163,184,0.24)"
        })
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    button: { textTransform: "none", fontWeight: 600 },
    h6: { fontWeight: 600 }
  }
});

const NAV_TABS = [
  { value: "home", label: "Home", icon: <HomeOutlinedIcon /> },
  { value: "rides", label: "Rides", icon: <DirectionsCarFilledRoundedIcon /> },
  { value: "deliveries", label: "Deliveries", icon: <LocalShippingRoundedIcon /> },
  { value: "wallet", label: "Wallet", icon: <ShoppingCartRoundedIcon /> },
  { value: "more", label: "More", icon: <MoreHorizRoundedIcon /> }
];

function MobileShell({ children, activeTab = "rides", onTabChange }) {
  const [navValue, setNavValue] = useState(activeTab);

  const handleChange = (event, newValue) => {
    setNavValue(newValue);
    if (onTabChange) onTabChange(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        bgcolor: (t) => t.palette.background.default
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 430,
          minHeight: "100vh",
          borderRadius: { xs: 0, sm: 2 },
          overflow: "hidden",
          bgcolor: (t) => t.palette.background.default,
          backgroundImage: (t) =>
            t.palette.mode === "light"
              ? "radial-gradient(circle at top, #E0F2FE 0, #F3F4F6 55%, #F3F4F6 100%)"
              : "radial-gradient(circle at top, #020617 0, #020617 60%, #020617 100%)"
        }}
      >
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            color: (t) => t.palette.text.primary
          }}
        >
          <Box sx={{ flex: 1, overflowY: "auto", paddingBottom: "88px" }}>{children}</Box>
          <Box
            sx={{
              position: "fixed",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: 0,
              width: "100%",
              maxWidth: 430
            }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px 16px 0 0",
                overflow: "hidden",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "rgba(255,255,255,0.98)" : "rgba(15,23,42,0.96)",
                backdropFilter: "blur(22px)",
                borderTop: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(229,231,235,1)"
                    : "1px solid rgba(30,64,175,0.6)",
                boxShadow:
                  "0 -14px 40px rgba(15,23,42,0.26), 0 -1px 0 rgba(148,163,184,0.38)"
              }}
            >
              <BottomNavigation
                value={navValue}
                onChange={handleChange}
                sx={{
                  bgcolor: "transparent",
                  py: 0.3,
                  px: 1,
                  "& .MuiBottomNavigationAction-root": {
                    color: (t) =>
                      t.palette.mode === "light" ? "#9CA3AF" : "rgba(148,163,184,0.9)",
                    minWidth: 0,
                    paddingY: 0.5,
                    paddingX: 0.5,
                    maxWidth: 90
                  },
                  "& .Mui-selected": { color: "#03CD8C" },
                  "& .MuiBottomNavigationAction-label": {
                    fontSize: 11,
                    fontWeight: 500,
                    "&.Mui-selected": { fontSize: 12, fontWeight: 600 }
                  }
                }}
              >
                {NAV_TABS.map((tab) => (
                  <BottomNavigationAction
                    key={tab.value}
                    value={tab.value}
                    label={tab.label}
                    icon={tab.icon}
                  />
                ))}
              </BottomNavigation>
            </Paper>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

function TourBookingSummaryPaymentScreen() {
  const [paymentMethod, setPaymentMethod] = useState("wallet");

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            size="small"
            aria-label="Back"
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
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Review & confirm tour
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Kampala City EV Highlights • 2 adults, 1 child
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tour summary */}
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
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 999,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#DBEAFE" : "rgba(15,23,42,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <TourRoundedIcon sx={{ fontSize: 26, color: "#1D4ED8" }} />
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                Kampala City EV Highlights
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Half day • EV transport included
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={0.6}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <CalendarMonthRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Sat, 12 Oct 2025 • Afternoon (14:00)
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <PlaceRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Meeting point: Central Kampala (hotel pickup / agreed spot)
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <PeopleAltRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                2 adults, 1 child
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Price breakdown */}
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
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}
          >
            Price breakdown
          </Typography>
          <Stack spacing={0.4}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                2 × Adult (UGX 180,000)
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                UGX 360,000
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                1 × Child (UGX 120,000)
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                UGX 120,000
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                Booking fee
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                UGX 15,000
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ my: 1.2, borderColor: (t) => t.palette.divider }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography
              variant="caption"
              sx={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}
            >
              Total
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              UGX 495,000
            </Typography>
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
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}
          >
            Pay with
          </Typography>
          <Stack spacing={1}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) =>
                  paymentMethod === "wallet"
                    ? "rgba(3,205,140,0.16)"
                    : t.palette.mode === "light"
                    ? "#F3F4F6"
                    : "rgba(15,23,42,0.96)",
                border: (t) =>
                  paymentMethod === "wallet"
                    ? "1px solid #03CD8C"
                    : t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)"
              }}
              onClick={() => setPaymentMethod("wallet")}
            >
              <CardContent sx={{ px: 1.75, py: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccountBalanceWalletRoundedIcon
                    sx={{ fontSize: 18, color: "primary.main" }}
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
                    >
                      EVzone Wallet
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                    >
                      Balance: UGX 520,000
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) =>
                  paymentMethod === "card"
                    ? "rgba(59,130,246,0.15)"
                    : t.palette.mode === "light"
                    ? "#F3F4F6"
                    : "rgba(15,23,42,0.96)",
                border: (t) =>
                  paymentMethod === "card"
                    ? "1px solid #3B82F6"
                    : t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)"
              }}
              onClick={() => setPaymentMethod("card")}
            >
              <CardContent sx={{ px: 1.75, py: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CreditCardRoundedIcon
                    sx={{ fontSize: 18, color: (t) => t.palette.text.secondary }}
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
                    >
                      Card (Visa / Mastercard)
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                    >
                      Secure online payment
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) =>
                  paymentMethod === "mobile"
                    ? "rgba(249,115,22,0.15)"
                    : t.palette.mode === "light"
                    ? "#F3F4F6"
                    : "rgba(15,23,42,0.96)",
                border: (t) =>
                  paymentMethod === "mobile"
                    ? "1px solid #F97316"
                    : t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)"
              }}
              onClick={() => setPaymentMethod("mobile")}
            >
              <CardContent sx={{ px: 1.75, py: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneIphoneRoundedIcon
                    sx={{ fontSize: 18, color: (t) => t.palette.text.secondary }}
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
                    >
                      Mobile money
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                    >
                      MTN / Airtel (where available)
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="contained"
        sx={{
          borderRadius: 999,
          py: 1.1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: "primary.main",
          color: "#020617",
          "&:hover": { bgcolor: "#06e29a" }
        }}
      >
        Confirm booking & pay
      </Button>

      <Typography
        variant="caption"
        sx={{ mt: 1.2, fontSize: 11, color: (t) => t.palette.text.secondary }}
      >
        By confirming you agree to the tour operator’s terms, refund policy and
        EV transport guidelines.
      </Typography>
    </Box>
  );
}

export default function RiderScreen80TourBookingSummaryPaymentCanvas_v2() {
  const [mode, setMode] = useState("light");
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (t) => t.palette.background.default
        }}
      >
        <IconButton
          size="small"
          onClick={() => setMode((prev) => (prev === "light" ? "dark" : "light"))}
          sx={{
            position: "fixed",
            top: 10,
            right: 10,
            zIndex: 50,
            bgcolor: (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(30,64,175,0.7)",
            boxShadow: 3
          }}
          aria-label="Toggle light/dark mode"
        >
          {mode === "light" ? (
            <DarkModeRoundedIcon sx={{ fontSize: 18 }} />
          ) : (
            <LightModeRoundedIcon sx={{ fontSize: 18 }} />
          )}
        </IconButton>

        <MobileShell activeTab="rides">
          <TourBookingSummaryPaymentScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
