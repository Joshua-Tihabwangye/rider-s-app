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
  Avatar
} from "@mui/material";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import TourRoundedIcon from "@mui/icons-material/TourRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";

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
              ? "radial-gradient(circle at top, #E5F9F1 0, #F3F4F6 55%, #F3F4F6 100%)"
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

function HomeMultiServiceScreen() {
  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Top bar */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
              fontSize: 18,
              fontWeight: 600,
              color: "#020617"
            }}
          >
            RZ
          </Avatar>
          <Box>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Welcome back,
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              What would you like to do today?
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Primary service picker */}
      <Box sx={{ mb: 2.5 }}>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}
        >
          EVzone services
        </Typography>

        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1.2}>
            {/* Ride */}
            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                transition: "transform 0.12s ease, box-shadow 0.12s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.4 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
                  <ElectricCarRoundedIcon sx={{ fontSize: 20, color: "primary.main" }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
                  >
                    Ride
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Book an electric ride now or later
                </Typography>
              </CardContent>
            </Card>

            {/* Delivery */}
            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                transition: "transform 0.12s ease, box-shadow 0.12s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.4 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
                  <LocalShippingRoundedIcon sx={{ fontSize: 20, color: "primary.main" }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
                  >
                    Delivery
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Send or receive parcels with EV couriers
                </Typography>
              </CardContent>
            </Card>
          </Stack>

          <Stack direction="row" spacing={1.2}>
            {/* Rental */}
            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                transition: "transform 0.12s ease, box-shadow 0.12s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.4 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
                  <LuggageRoundedIcon sx={{ fontSize: 20, color: "primary.main" }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
                  >
                    Rental
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Rent an EV for self-drive or chauffeur
                </Typography>
              </CardContent>
            </Card>

            {/* Tours */}
            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                transition: "transform 0.12s ease, box-shadow 0.12s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.4 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
                  <TourRoundedIcon sx={{ fontSize: 20, color: "primary.main" }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
                  >
                    Tours
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Book EV tours, day trips & charters
                </Typography>
              </CardContent>
            </Card>
          </Stack>

          <Stack direction="row" spacing={1.2}>
            {/* School */}
            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                transition: "transform 0.12s ease, box-shadow 0.12s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.4 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
                  <SchoolRoundedIcon sx={{ fontSize: 20, color: "primary.main" }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
                  >
                    School
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Manage school shuttles via EVzone School
                </Typography>
              </CardContent>
            </Card>

            {/* Ambulance */}
            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                transition: "transform 0.12s ease, box-shadow 0.12s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.4 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
                  <LocalHospitalRoundedIcon sx={{ fontSize: 20, color: "#DC2626" }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
                  >
                    Ambulance
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Request emergency or transfer ambulances
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </Box>

      {/* Quick links / promos */}
      <Box sx={{ mt: 1.5 }}>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}
        >
          Shortcuts
        </Typography>
        <Stack direction="row" spacing={1.25} sx={{ flexWrap: "wrap" }}>
          <Chip
            icon={<ElectricCarRoundedIcon sx={{ fontSize: 16 }} />}
            label="Rebook last ride"
            size="small"
            sx={{
              borderRadius: 999,
              fontSize: 11,
              height: 26,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          />
          <Chip
            icon={<LocalShippingRoundedIcon sx={{ fontSize: 16 }} />}
            label="Track a parcel"
            size="small"
            sx={{
              borderRadius: 999,
              fontSize: 11,
              height: 26,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          />
          <Chip
            icon={<LocalMallRoundedIcon sx={{ fontSize: 16 }} />}
            label="Open EVzone Marketplace"
            size="small"
            sx={{
              borderRadius: 999,
              fontSize: 11,
              height: 26,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          />
        </Stack>
      </Box>
    </Box>
  );
}

export default function RiderScreen01HomeMultiServiceCanvas_v2() {
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
          <HomeMultiServiceScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
