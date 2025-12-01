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
  Chip,
  Stack,
  Button
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import MarkunreadMailboxRoundedIcon from "@mui/icons-material/MarkunreadMailboxRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

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

function MobileShell({ children, activeTab = "deliveries", onTabChange }) {
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
                boxShadow: "0 -14px 40px rgba(15,23,42,0.26), 0 -1px 0 rgba(148,163,184,0.38)"
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

// v3 variant – focusing on delivered history only, with a more timeline-style layout

const RECEIVED_ORDERS_V3 = [
  {
    id: "RCV-2025-10-06-003",
    fromName: "EVzone Marketplace",
    toAddress: "Nsambya Road 472, Kampala",
    deliveredAt: "Today • 11:20 AM",
    label: "EV accessories"
  },
  {
    id: "RCV-2025-10-05-001",
    fromName: "John Doe",
    toAddress: "Bugolobi Village, Kampala",
    deliveredAt: "Yesterday • 02:10 PM",
    label: "Documents"
  }
];

function ReceivedHistoryRow({ order }) {
  return (
    <Box sx={{ display: "flex", gap: 1.5, py: 1.1 }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: 999,
            bgcolor: "primary.main",
            mb: 0.5
          }}
        />
        <Box
          sx={{
            flex: 1,
            width: 2,
            bgcolor: (t) =>
              t.palette.mode === "light" ? "#E5E7EB" : "rgba(51,65,85,1)",
            minHeight: 26
          }}
        />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
        >
          {order.deliveredAt}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.01em" }}
        >
          From: {order.fromName}
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}
        >
          To: {order.toAddress}
        </Typography>
        <Chip
          size="small"
          label={order.label}
          icon={<Inventory2RoundedIcon sx={{ fontSize: 14 }} />}
          sx={{
            mt: 0.5,
            borderRadius: 999,
            fontSize: 10,
            height: 22,
            bgcolor: (t) =>
              t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
            color: (t) => t.palette.text.primary
          }}
        />
      </Box>
    </Box>
  );
}

function DeliveriesDashboardReceivedV3Screen() {
  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            size="small"
            aria-label="Back"
            sx={{
              borderRadius: 999,
              bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)"),
              border: (t) =>
                t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
              Deliveries – History (v3)
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Delivered parcels in timeline view
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Summary */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
          border: (t) =>
            t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Delivered this week
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                {RECEIVED_ORDERS_V3.length}
              </Typography>
            </Box>
            <Chip
              size="small"
              icon={<MarkunreadMailboxRoundedIcon sx={{ fontSize: 16 }} />}
              label="Received"
              sx={{
                borderRadius: 999,
                fontSize: 10,
                height: 24,
                bgcolor: "rgba(34,197,94,0.12)",
                color: "#16A34A"
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Timeline list */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
          border: (t) =>
            t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          {RECEIVED_ORDERS_V3.length === 0 ? (
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                display: "block",
                textAlign: "center",
                fontSize: 11,
                color: (t) => t.palette.text.secondary
              }}
            >
              No delivered parcels in this period.
            </Typography>
          ) : (
            RECEIVED_ORDERS_V3.map((order) => <ReceivedHistoryRow key={order.id} order={order} />)
          )}
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{
          mt: 1.5,
          display: "block",
          fontSize: 11,
          color: (t) => t.palette.text.secondary
        }}
      >
        Use this view to quickly confirm delivery times and items you’ve
        received from senders.
      </Typography>
    </Box>
  );
}

export default function RiderScreen54DeliveriesDashboardReceivedV3Canvas_v2() {
  const [mode, setMode] = useState("light");
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (t) => t.palette.background.default }}>
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

        <MobileShell activeTab="deliveries">
          <DeliveriesDashboardReceivedV3Screen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
