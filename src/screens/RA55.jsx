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
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
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

const TRACKING_STEPS = [
  {
    id: 1,
    label: "Order placed",
    description: "Seller confirmed your order",
    time: "Mon, 06 Oct • 09:12 AM",
    status: "completed"
  },
  {
    id: 2,
    label: "Picked up",
    description: "Courier collected the package",
    time: "Mon, 06 Oct • 11:45 AM",
    status: "completed"
  },
  {
    id: 3,
    label: "In transit",
    description: "On the way to Nsambya, Kampala",
    time: "Today • 02:20 PM",
    status: "current"
  },
  {
    id: 4,
    label: "Out for delivery",
    description: "Courier is heading to your address",
    time: "ETA • 05:30 PM",
    status: "upcoming"
  },
  {
    id: 5,
    label: "Delivered",
    description: "Package will be handed over",
    time: "Pending",
    status: "upcoming"
  }
];

function TrackingStepRow({ step, isLast }) {
  const isCompleted = step.status === "completed";
  const isCurrent = step.status === "current";

  const dotColor = isCompleted
    ? "#22c55e"
    : isCurrent
    ? "#03CD8C"
    : "#9CA3AF";

  const icon = isCompleted ? (
    <CheckCircleRoundedIcon sx={{ fontSize: 18, color: dotColor }} />
  ) : (
    <Box
      sx={{
        width: 12,
        height: 12,
        borderRadius: "999px",
        border: `2px solid ${dotColor}`,
        bgcolor: isCurrent ? "rgba(3,205,140,0.12)" : "transparent"
      }}
    />
  );

  return (
    <Box sx={{ display: "flex", gap: 1.5 }}>
      {/* Timeline rail */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {icon}
        {!isLast && (
          <Box
            sx={{
              flex: 1,
              width: 2,
              bgcolor: (t) =>
                t.palette.mode === "light"
                  ? "#E5E7EB"
                  : "rgba(51,65,85,1)",
              mt: 0.3
            }}
          />
        )}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, pb: isLast ? 0 : 1.6 }}>
        <Typography
          variant="body2"
          sx={{
            fontSize: 13,
            fontWeight: isCurrent ? 600 : 500,
            letterSpacing: "-0.01em"
          }}
        >
          {step.label}
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
        >
          {step.description}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontSize: 11,
            color: (t) => t.palette.text.secondary,
            display: "block",
            mt: 0.3
          }}
        >
          {step.time}
        </Typography>
      </Box>
    </Box>
  );
}

function ShipmentTrackingReceivedParcelScreen() {
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
              Tracking – Incoming parcel
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Status timeline for your package
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Parcel summary */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
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
            alignItems="center"
            justifyContent="space-between"
            spacing={1.5}
            sx={{ mb: 1.5 }}
          >
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
                RCV-2025-10-06-003
              </Typography>
            </Box>
            <Chip
              size="small"
              icon={<AccessTimeRoundedIcon sx={{ fontSize: 14 }} />}
              label="Out for delivery today"
              sx={{
                borderRadius: 999,
                fontSize: 10,
                height: 24,
                bgcolor: "rgba(59,130,246,0.12)",
                color: "#1D4ED8"
              }}
            />
          </Stack>

          <Box sx={{ mb: 1.2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Inventory2RoundedIcon sx={{ fontSize: 18, color: "primary.main" }} />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                From: EVzone Marketplace – China–Africa Hub Warehouse
              </Typography>
            </Stack>
          </Box>

          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <PlaceRoundedIcon sx={{ fontSize: 18, color: "#22c55e" }} />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                To: Nsambya Road 472, Kampala
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card
        elevation={0}
        sx={{
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
          <Stack spacing={1.4}>
            {TRACKING_STEPS.map((step, index) => (
              <TrackingStepRow
                key={step.id}
                step={step}
                isLast={index === TRACKING_STEPS.length - 1}
              />
            ))}
          </Stack>
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
        Status updates are provided by the courier. You can share this tracking
        link with friends or family from the deliveries dashboard.
      </Typography>
    </Box>
  );
}

export default function RiderScreen55ShipmentTrackingReceivedParcelCanvas_v2() {
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
          <ShipmentTrackingReceivedParcelScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
