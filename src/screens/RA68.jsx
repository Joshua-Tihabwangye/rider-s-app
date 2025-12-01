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
  Divider,
  Button
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
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

const TIMELINE_STEPS = [
  { id: 1, label: "Order placed", time: "Mon, 06 Oct • 09:12", status: "done" },
  { id: 2, label: "Picked up", time: "Mon, 06 Oct • 11:45", status: "done" },
  { id: 3, label: "In transit", time: "Today • 14:20", status: "current" },
  { id: 4, label: "Out for delivery", time: "ETA • 17:30", status: "upcoming" },
  { id: 5, label: "Delivered", time: "Pending", status: "upcoming" }
];

function TimelineRow({ step, isLast }) {
  const isDone = step.status === "done";
  const isCurrent = step.status === "current";
  const dotColor = isDone ? "#22c55e" : isCurrent ? "#0EA5E9" : "#CBD5F5";

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", mb: isLast ? 0 : 1.4 }}>
      <Box sx={{ mr: 1.5, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: "999px",
            bgcolor: isCurrent ? "rgba(59,130,246,0.12)" : "transparent",
            border: isDone ? "none" : `2px solid ${dotColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {isDone ? (
            <CheckCircleRoundedIcon sx={{ fontSize: 18, color: "#22c55e" }} />
          ) : (
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "999px",
                bgcolor: dotColor
              }}
            />
          )}
        </Box>
        {!isLast && (
          <Box
            sx={{
              flex: 1,
              width: 2,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#E5E7EB" : "rgba(148,163,184,0.5)",
              mt: 0.3
            }}
          />
        )}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            variant="body2"
            sx={{ fontWeight: isCurrent ? 600 : 500, letterSpacing: "-0.01em" }}
          >
            {step.label}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            {step.time}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}

function OrderDeliveryDetailedViewScreen() {
  const trackingId = "DLV-2025-10-07-001";

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
              Order details
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Pickup confirmed, items & full timeline
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tracking + status card */}
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
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.25 }}>
            <Inventory2RoundedIcon sx={{ fontSize: 20, color: "primary.main" }} />
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Tracking ID
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                {trackingId}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Chip
              size="small"
              icon={<LocalShippingRoundedIcon sx={{ fontSize: 14 }} />}
              label="EV courier"
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 24,
                bgcolor: "rgba(34,197,94,0.12)",
                color: "#16A34A"
              }}
            />
            <Chip
              size="small"
              icon={<CheckCircleRoundedIcon sx={{ fontSize: 14 }} />}
              label="Pickup confirmed"
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 24,
                bgcolor: "rgba(22,163,74,0.12)",
                color: "#16A34A"
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Items card */}
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
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.2 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Items in this delivery
            </Typography>
          </Stack>
          <Stack spacing={0.75}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                1 × EV charger cable
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                UGX 120,000
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                2 × Wheel caps
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                UGX 60,000
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                1 × Charging adaptor
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                UGX 45,000
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
              UGX 225,000
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* Addresses card */}
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
          <Box sx={{ mb: 1.1 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              From (pickup)
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, letterSpacing: "-0.01em" }}
            >
              EVzone Marketplace – China–Africa Hub Warehouse
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              To (drop-off)
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, letterSpacing: "-0.01em" }}
            >
              Nsambya Road 472, Kampala
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Timeline card */}
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
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1.3, display: "block" }}
          >
            Timeline
          </Typography>
          {TIMELINE_STEPS.map((step, index) => (
            <TimelineRow
              key={step.id}
              step={step}
              isLast={index === TIMELINE_STEPS.length - 1}
            />
          ))}
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="outlined"
        sx={{
          borderRadius: 999,
          py: 1,
          fontSize: 14,
          textTransform: "none",
          mb: 1
        }}
      >
        Download order summary
      </Button>

      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
      >
        Use this detailed view when you need to check what was sent, where it is
        headed and every step it has gone through.
      </Typography>
    </Box>
  );
}

export default function RiderScreen68OrderDeliveryDetailedViewCanvas_v2() {
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

        <MobileShell activeTab="deliveries">
          <OrderDeliveryDetailedViewScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
