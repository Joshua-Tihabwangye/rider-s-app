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
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PhoneEnabledRoundedIcon from "@mui/icons-material/PhoneEnabledRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";

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
              ? "radial-gradient(circle at top, #FEE2E2 0, #F3F4F6 55%, #F3F4F6 100%)"
              : "radial-gradient(circle at top, #450a0a 0, #020617 60%, #020617 100%)"
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

function AmbulanceLiveTrackingScreen() {
  const requestId = "AMB-REQ-2025-10-07-001";
  const eta = "6 min";

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
              Live ambulance tracking
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Watch the ambulance as it approaches your location
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Map area */}
      <Box
        sx={{
          position: "relative",
          borderRadius: 3,
          overflow: "hidden",
          height: 220,
          mb: 2.5,
          background: (t) =>
            t.palette.mode === "light"
              ? "radial-gradient(circle at top, #FECACA 0, #F3F4F6 55%, #CBD5F5 100%)"
              : "radial-gradient(circle at top, rgba(185,28,28,0.7), #020617 60%, #020617 100%)"
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

        {/* Patient location marker */}
        <Box
          sx={{
            position: "absolute",
            left: "18%",
            bottom: "20%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <PlaceRoundedIcon
            sx={{ fontSize: 26, color: "#DC2626", filter: "drop-shadow(0 6px 12px rgba(15,23,42,0.7))" }}
          />
        </Box>

        {/* Ambulance marker */}
        <Box
          sx={{
            position: "absolute",
            left: "46%",
            top: "50%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <DirectionsCarRoundedIcon
            sx={{ fontSize: 28, color: "#F97316", filter: "drop-shadow(0 8px 16px rgba(15,23,42,0.9))" }}
          />
        </Box>

        {/* Hospital marker */}
        <Box
          sx={{
            position: "absolute",
            right: "16%",
            top: "26%",
            transform: "translate(50%, -50%)"
          }}
        >
          <LocalHospitalRoundedIcon
            sx={{ fontSize: 26, color: "#16A34A", filter: "drop-shadow(0 8px 16px rgba(15,23,42,0.9))" }}
          />
        </Box>

        {/* ETA chip */}
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
              bgcolor: "rgba(15,23,42,0.8)",
              color: "#F9FAFB"
            }}
          />
        </Box>
      </Box>

      {/* Request + contact summary */}
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
          <Stack spacing={0.6} sx={{ mb: 1.2 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Request ID: {requestId}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Destination hospital: Nsambya Hospital (triage may adjust based on
              condition)
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.25}>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              startIcon={<PhoneEnabledRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{
                borderRadius: 999,
                py: 0.8,
                fontSize: 13,
                textTransform: "none"
              }}
            >
              Call control room
            </Button>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              startIcon={<PhoneIphoneRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{
                borderRadius: 999,
                py: 0.8,
                fontSize: 13,
                textTransform: "none"
              }}
            >
              Call ambulance
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
      >
        If you move from this location or the patient’s condition changes, use
        the contact options above to update the team.
      </Typography>
    </Box>
  );
}

export default function RiderScreen87AmbulanceLiveTrackingCanvas_v2() {
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
          <AmbulanceLiveTrackingScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
