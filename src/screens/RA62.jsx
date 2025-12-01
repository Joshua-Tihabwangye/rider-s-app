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
  Stack
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
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

function ActiveDeliveryLivePackageTrackingScreen() {
  const eta = "22 min";
  const distance = "9.6 km";

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
              Live package tracking
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Watch your EV courier move along the route
            </Typography>
          </Box>
        </Box>
        <Chip
          size="small"
          label="In transit"
          sx={{
            borderRadius: 999,
            fontSize: 10,
            height: 22,
            bgcolor: "rgba(34,197,94,0.12)",
            color: "#16A34A"
          }}
        />
      </Box>

      {/* Map focused on path */}
      <Box
        sx={{
          position: "relative",
          borderRadius: 3,
          overflow: "hidden",
          height: 260,
          mb: 2.5,
          background: (t) =>
            t.palette.mode === "light"
              ? "radial-gradient(circle at top, #BAE6FD 0, #E5E7EB 55%, #CBD5F5 100%)"
              : "radial-gradient(circle at top, rgba(15,118,205,0.5), #020617 60%, #020617 100%)"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.22,
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.5) 1px, transparent 1px)",
            backgroundSize: "34px 34px"
          }}
        />

        {/* Pickup marker */}
        <Box
          sx={{
            position: "absolute",
            left: "15%",
            bottom: "18%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <MyLocationRoundedIcon
            sx={{ fontSize: 22, color: "#22c55e", filter: "drop-shadow(0 6px 12px rgba(15,23,42,0.7))" }}
          />
        </Box>

        {/* Courier marker */}
        <Box
          sx={{
            position: "absolute",
            left: "43%",
            top: "47%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <LocalShippingRoundedIcon
            sx={{ fontSize: 26, color: "primary.main", filter: "drop-shadow(0 6px 14px rgba(15,23,42,0.8))" }}
          />
        </Box>

        {/* Destination marker */}
        <Box
          sx={{
            position: "absolute",
            right: "18%",
            top: "26%",
            transform: "translate(50%, -50%)"
          }}
        >
          <PlaceRoundedIcon
            sx={{
              fontSize: 30,
              color: "primary.main",
              filter: "drop-shadow(0 8px 16px rgba(15,23,42,0.8))"
            }}
          />
        </Box>

        {/* Overlay chip on map */}
        <Box
          sx={{
            position: "absolute",
            left: 12,
            top: 12
          }}
        >
          <Chip
            size="small"
            icon={<AccessTimeRoundedIcon sx={{ fontSize: 14 }} />}
            label={`ETA ${eta}`}
            sx={{
              borderRadius: 999,
              fontSize: 11,
              height: 24,
              bgcolor: "rgba(15,23,42,0.72)",
              color: "#F9FAFB"
            }}
          />
        </Box>
      </Box>

      {/* Route summary card */}
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
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.2 }}>
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                From
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, letterSpacing: "-0.01em" }}
              >
                EVzone Marketplace – China–Africa Hub Warehouse
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ mb: 1.2 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              To
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, letterSpacing: "-0.01em" }}
            >
              Nsambya Road 472, Kampala
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Chip
              size="small"
              icon={<RouteRoundedIcon sx={{ fontSize: 14 }} />}
              label={distance}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 24,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                color: (t) => t.palette.text.primary
              }}
            />
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
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default function RiderScreen62ActiveDeliveryLivePackageTrackingCanvas_v2() {
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
          <ActiveDeliveryLivePackageTrackingScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
