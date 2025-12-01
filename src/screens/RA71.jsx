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
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";

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

function RentalVehicleDetailsScreen() {
  const [modeSelection, setModeSelection] = useState("self");

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
              Nissan Leaf • EV hatchback
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Self-drive or chauffeur, 220 km range
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Hero vehicle card */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 3,
          bgcolor: (t) =>
            t.palette.mode === "light"
              ? "radial-gradient(circle at top,#E0F2FE,#EEF2FF)"
              : "radial-gradient(circle at top,#020617,#020617)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(191,219,254,0.9)"
              : "1px solid rgba(30,64,175,0.8)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.2 }}>
            <Box
              sx={{
                flex: 1,
                minHeight: 80,
                borderRadius: 2,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "rgba(255,255,255,0.7)" : "rgba(15,23,42,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <ElectricCarRoundedIcon
                sx={{
                  fontSize: 48,
                  color: "primary.main",
                  filter: "drop-shadow(0 10px 18px rgba(15,23,42,0.45))"
                }}
              />
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Chip
              label="Self-drive"
              size="small"
              onClick={() => setModeSelection("self")}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 24,
                bgcolor:
                  modeSelection === "self"
                    ? "primary.main"
                    : "rgba(255,255,255,0.85)",
                color: modeSelection === "self" ? "#020617" : "#111827"
              }}
            />
            <Chip
              label="With chauffeur"
              size="small"
              onClick={() => setModeSelection("chauffeur")}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 24,
                bgcolor:
                  modeSelection === "chauffeur"
                    ? "primary.main"
                    : "rgba(255,255,255,0.85)",
                color: modeSelection === "chauffeur" ? "#020617" : "#111827"
              }}
            />
            <Chip
              label="100% electric"
              size="small"
              icon={<BatteryChargingFullRoundedIcon sx={{ fontSize: 14 }} />}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 24,
                bgcolor: "rgba(34,197,94,0.12)",
                color: "#16A34A"
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PeopleAltRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                5 seats
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <LuggageRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                2–3 suitcases
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
                220 km range
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Pricing & terms */}
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
            spacing={1.5}
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1.2 }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                From
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                UGX 180,000 <Typography component="span" variant="caption" sx={{ fontSize: 11 }}>/ day</Typography>
              </Typography>
            </Box>
            <Chip
              size="small"
              icon={<ShieldRoundedIcon sx={{ fontSize: 14 }} />}
              label="Insurance & roadside support"
              sx={{
                borderRadius: 999,
                fontSize: 10,
                height: 24,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                color: (t) => t.palette.text.primary
              }}
            />
          </Stack>

          <Divider sx={{ my: 1.2, borderColor: (t) => t.palette.divider }} />

          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.5, display: "block" }}
          >
            Includes
          </Typography>
          <Stack spacing={0.4}>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              • EV charger cable & adapter (where applicable)
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              • Standard daily mileage allowance (150 km / day)
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              • 24/7 roadside support
            </Typography>
          </Stack>

          <Typography
            variant="caption"
            sx={{ mt: 1.2, fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            A refundable deposit and valid driver’s license are required for
            self‑drive. Additional terms may apply.
          </Typography>
        </CardContent>
      </Card>

      {/* Continue CTA */}
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
        Continue to dates & pickup
      </Button>
    </Box>
  );
}

export default function RiderScreen71RentalVehicleDetailsCanvas_v2() {
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
          <RentalVehicleDetailsScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
