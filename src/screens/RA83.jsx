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
  Button,
  Chip
} from "@mui/material";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import PhoneEnabledRoundedIcon from "@mui/icons-material/PhoneEnabledRounded";

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

function AmbulanceHomeRequestTypeScreen() {
  return (
    <Box sx={{ px: 2.5, pt: 3, pb: 3 }}>
      {/* Critical banner */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FEF2F2" : "rgba(127,29,29,0.85)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid #FCA5A5"
              : "1px solid rgba(254,202,202,0.6)"
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
                  t.palette.mode === "light" ? "#FEE2E2" : "rgba(248,113,113,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <LocalHospitalRoundedIcon sx={{ fontSize: 24, color: "#DC2626" }} />
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}
              >
                For emergencies
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                If this is life‑threatening, call your local emergency number
                immediately before using this app.
              </Typography>
            </Box>
          </Stack>
          <Button
            fullWidth
            variant="contained"
            startIcon={<PhoneEnabledRoundedIcon sx={{ fontSize: 18 }} />}
            sx={{
              borderRadius: 999,
              py: 1,
              fontSize: 14,
              fontWeight: 600,
              textTransform: "none",
              bgcolor: "#DC2626",
              color: "#FEF2F2",
              "&:hover": { bgcolor: "#B91C1C" }
            }}
          >
            Call emergency services
          </Button>
        </CardContent>
      </Card>

      {/* Request type card */}
      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}
      >
        Choose ambulance request type
      </Typography>

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
          <Stack spacing={1.5}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                Immediate ambulance
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                For urgent but non‑life‑threatening situations. We will connect
                you to the nearest available ambulance.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 1,
                  borderRadius: 999,
                  py: 1,
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: "none",
                  bgcolor: "primary.main",
                  color: "#020617",
                  "&:hover": { bgcolor: "#06e29a" }
                }}
              >
                Request ambulance now
              </Button>
            </Box>

            <Box sx={{ mt: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                Scheduled transfer
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                For planned hospital transfers or clinic referrals at a later
                time.
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  mt: 1,
                  borderRadius: 999,
                  py: 1,
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: "none"
                }}
              >
                Schedule a transfer
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
      >
        Ambulance requests from this app are coordinated via partner hospitals
        and providers. Availability may vary by location.
      </Typography>
    </Box>
  );
}

export default function RiderScreen83AmbulanceHomeRequestTypeCanvas_v2() {
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
          <AmbulanceHomeRequestTypeScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
