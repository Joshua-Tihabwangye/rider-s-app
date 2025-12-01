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
  Button
} from "@mui/material";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import TourRoundedIcon from "@mui/icons-material/TourRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";

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

function MobileShell({ children, activeTab = "home", onTabChange }) {
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

const ALL_ORDERS = [
  {
    id: "RIDE-2025-10-01-001",
    type: "Ride",
    title: "EV ride to Bugolobi",
    date: "01 Oct 2025 • 09:20",
    from: "Nsambya",
    to: "Bugolobi",
    status: "Completed"
  },
  {
    id: "DLV-2025-10-05-002",
    type: "Delivery",
    title: "Parcel to EVzone Hub",
    date: "05 Oct 2025 • 16:05",
    from: "Kansanga",
    to: "Nsambya EV Hub",
    status: "Completed"
  },
  {
    id: "RENT-2025-10-07-001",
    type: "Rental",
    title: "Nissan Leaf – 3 days",
    date: "07 Oct 2025 • 10:00",
    from: "Nsambya EV Hub",
    to: "Bugolobi EV Hub",
    status: "Upcoming"
  },
  {
    id: "TOUR-BOOK-2025-10-12-001",
    type: "Tour",
    title: "Kampala City EV Highlights",
    date: "12 Oct 2025 • 14:00",
    from: "Central Kampala",
    to: "City loop",
    status: "Upcoming"
  },
  {
    id: "AMB-REQ-2025-10-07-001",
    type: "Ambulance",
    title: "Ambulance request",
    date: "07 Oct 2025 • 14:32",
    from: "Nsambya Road 472",
    to: "Nsambya Hospital",
    status: "Completed"
  }
];

function getTypeIcon(type) {
  switch (type) {
    case "Ride":
      return <DirectionsCarFilledRoundedIcon sx={{ fontSize: 20 }} />;
    case "Delivery":
      return <LocalShippingRoundedIcon sx={{ fontSize: 20 }} />;
    case "Rental":
      return <ElectricCarRoundedIcon sx={{ fontSize: 20 }} />;
    case "Tour":
      return <TourRoundedIcon sx={{ fontSize: 20 }} />;
    case "Ambulance":
      return <LocalHospitalRoundedIcon sx={{ fontSize: 20 }} />;
    default:
      return <MoreHorizRoundedIcon sx={{ fontSize: 20 }} />;
  }
}

function AllOrdersCard({ order }) {
  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.75,
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
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 999,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#E5E7EB" : "rgba(15,23,42,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {getTypeIcon(order.type)}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              {order.title}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {order.type} • {order.date}
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.4 }}>
              <PlaceRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                {order.from} → {order.to}
              </Typography>
            </Stack>
          </Box>
          <Chip
            size="small"
            label={order.status}
            sx={{
              borderRadius: 999,
              fontSize: 10,
              height: 22,
              bgcolor:
                order.status === "Upcoming"
                  ? "rgba(34,197,94,0.12)"
                  : "rgba(148,163,184,0.18)",
              color:
                order.status === "Upcoming" ? "#16A34A" : "rgba(148,163,184,1)"
            }}
          />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            ID: {order.id}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            sx={{
              borderRadius: 999,
              px: 2,
              py: 0.4,
              fontSize: 12,
              textTransform: "none"
            }}
          >
            View details
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function AllOrdersCombinedHistoryScreen() {
  const [filter, setFilter] = useState("all");

  const filtered = ALL_ORDERS.filter((order) => {
    if (filter === "all") return true;
    return order.type === filter;
  });

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
              All orders
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Rides, deliveries, rentals, tours & ambulance
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Filters */}
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
        <Chip
          label="All"
          onClick={() => setFilter("all")}
          size="small"
          sx={{
            borderRadius: 999,
            fontSize: 11,
            height: 26,
            bgcolor: filter === "all" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            color: filter === "all" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
        <Chip
          label="Rides"
          onClick={() => setFilter("Ride")}
          size="small"
          sx={{
            borderRadius: 999,
            fontSize: 11,
            height: 26,
            bgcolor: filter === "Ride" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            color: filter === "Ride" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
        <Chip
          label="Deliveries"
          onClick={() => setFilter("Delivery")}
          size="small"
          sx={{
            borderRadius: 999,
            fontSize: 11,
            height: 26,
            bgcolor: filter === "Delivery" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            color: filter === "Delivery" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
        <Chip
          label="Rentals"
          onClick={() => setFilter("Rental")}
          size="small"
          sx={{
            borderRadius: 999,
            fontSize: 11,
            height: 26,
            bgcolor: filter === "Rental" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            color: filter === "Rental" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
        <Chip
          label="Tours"
          onClick={() => setFilter("Tour")}
          size="small"
          sx={{
            borderRadius: 999,
            fontSize: 11,
            height: 26,
            bgcolor: filter === "Tour" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            color: filter === "Tour" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
        <Chip
          label="Ambulance"
          onClick={() => setFilter("Ambulance")}
          size="small"
          sx={{
            borderRadius: 999,
            fontSize: 11,
            height: 26,
            bgcolor: filter === "Ambulance" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            color: filter === "Ambulance" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
      </Stack>

      {filtered.length === 0 ? (
        <Typography
          variant="caption"
          sx={{ mt: 4, display: "block", textAlign: "center", color: (t) => t.palette.text.secondary }}
        >
          No orders in this view yet.
        </Typography>
      ) : (
        filtered.map((order) => <AllOrdersCard key={order.id} order={order} />)
      )}
    </Box>
  );
}

export default function RiderScreen91AllOrdersCombinedHistoryCanvas_v2() {
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

        <MobileShell activeTab="home">
          <AllOrdersCombinedHistoryScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
