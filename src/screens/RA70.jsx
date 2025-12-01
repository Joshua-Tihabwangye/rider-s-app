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
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";

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

const RENTAL_VEHICLES = [
  {
    id: "EV-RENT-01",
    name: "Nissan Leaf",
    type: "Hatchback",
    dailyPrice: "UGX 180,000",
    mode: "Self-drive",
    seats: 5,
    range: "220 km",
    tag: "Most popular"
  },
  {
    id: "EV-RENT-02",
    name: "Hyundai Kona EV",
    type: "SUV",
    dailyPrice: "UGX 230,000",
    mode: "Self-drive",
    seats: 5,
    range: "300 km",
    tag: "Family friendly"
  },
  {
    id: "EV-RENT-03",
    name: "Tesla Model 3",
    type: "Sedan",
    dailyPrice: "UGX 320,000",
    mode: "With chauffeur",
    seats: 4,
    range: "400 km",
    tag: "Premium"
  }
];

function RentalVehicleCard({ vehicle }) {
  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.75,
        borderRadius: 2,
        bgcolor: (t) =>
          t.palette.mode === "light"
            ? "linear-gradient(135deg,#FFFFFF,#F9FAFB)"
            : "linear-gradient(135deg,#020617,#020617)",
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
              width: 64,
              height: 40,
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#E0F2FE" : "rgba(15,23,42,0.9)"
            }}
          >
            <ElectricCarRoundedIcon sx={{ fontSize: 28, color: "primary.main" }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  {vehicle.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  {vehicle.type} • {vehicle.mode}
                </Typography>
              </Box>
              {vehicle.tag && (
                <Chip
                  label={vehicle.tag}
                  size="small"
                  sx={{
                    borderRadius: 999,
                    fontSize: 10,
                    height: 20,
                    bgcolor: "rgba(34,197,94,0.12)",
                    color: "#16A34A"
                  }}
                />
              )}
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <PeopleAltRoundedIcon
                  sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  {vehicle.seats} seats
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <BatteryChargingFullRoundedIcon
                  sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  {vehicle.range}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
          >
            {vehicle.dailyPrice} <Typography component="span" variant="caption" sx={{ fontSize: 11 }}>/ day</Typography>
          </Typography>
          <Button
            size="small"
            variant="contained"
            sx={{
              borderRadius: 999,
              px: 2,
              py: 0.5,
              fontSize: 12,
              textTransform: "none",
              bgcolor: "primary.main",
              color: "#020617",
              "&:hover": { bgcolor: "#06e29a" }
            }}
          >
            Select
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function RentalVehicleListScreen() {
  const [filter, setFilter] = useState("all");

  const filteredVehicles = RENTAL_VEHICLES.filter((v) => {
    if (filter === "all") return true;
    if (filter === "self") return v.mode === "Self-drive";
    if (filter === "chauffeur") return v.mode === "With chauffeur";
    if (filter === "suv") return v.type === "SUV";
    return true;
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
              Choose your EV rental
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Results for Nsambya • Today 10:00 → Tomorrow 10:00
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
              t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
            color: filter === "all" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
        <Chip
          label="Self-drive"
          onClick={() => setFilter("self")}
          size="small"
          sx={{
            borderRadius: 999,
            fontSize: 11,
            height: 26,
            bgcolor: filter === "self" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
            color: filter === "self" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
        <Chip
          label="With chauffeur"
          onClick={() => setFilter("chauffeur")}
          size="small"
          sx={{
            borderRadius: 999,
            fontSize: 11,
            height: 26,
            bgcolor: filter === "chauffeur" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
            color: filter === "chauffeur" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
        <Chip
          label="SUVs"
          onClick={() => setFilter("suv")}
          size="small"
          sx={{
            borderRadius: 999,
            fontSize: 11,
            height: 26,
            bgcolor: filter === "suv" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
            color: filter === "suv" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
      </Stack>

      {/* Vehicle list */}
      {filteredVehicles.length === 0 ? (
        <Typography
          variant="caption"
          sx={{ mt: 4, display: "block", textAlign: "center", color: (t) => t.palette.text.secondary }}
        >
          No EV rentals match your filters. Try adjusting your dates or location.
        </Typography>
      ) : (
        filteredVehicles.map((vehicle) => (
          <RentalVehicleCard key={vehicle.id} vehicle={vehicle} />
        ))
      )}
    </Box>
  );
}

export default function RiderScreen70RentalVehicleListCanvas_v2() {
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
          <RentalVehicleListScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
