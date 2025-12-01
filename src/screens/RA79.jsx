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
  TextField,
  InputAdornment,
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
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";

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

function TourDateGuestsScreen() {
  const [date, setDate] = useState("Sat, 12 Oct 2025");
  const [timeSlot, setTimeSlot] = useState("Afternoon (14:00)");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const canContinue = Boolean(date.trim() && timeSlot.trim() && adults > 0);

  const adjust = (setter, delta, min = 0, max = 10) => {
    setter((prev) => {
      const next = prev + delta;
      if (next < min) return min;
      if (next > max) return max;
      return next;
    });
  };

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
              Date & guests
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Kampala City EV Highlights
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Date & time card */}
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
          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              color: (t) => t.palette.text.secondary,
              mb: 0.5,
              display: "block"
            }}
          >
            Date
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonthRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                </InputAdornment>
              )
            }}
            sx={{
              mb: 1.6,
              "& .MuiOutlinedInput-root": {
                borderRadius: 999,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": { borderColor: "primary.main" }
              }
            }}
          />

          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              color: (t) => t.palette.text.secondary,
              mb: 0.5,
              display: "block"
            }}
          >
            Time slot
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {[
              "Morning (09:00)",
              "Afternoon (14:00)",
              "Evening (17:00)"
            ].map((slot) => (
              <Chip
                key={slot}
                label={slot}
                size="small"
                onClick={() => setTimeSlot(slot)}
                sx={{
                  borderRadius: 999,
                  fontSize: 11,
                  height: 26,
                  bgcolor:
                    timeSlot === slot
                      ? "primary.main"
                      : (t) =>
                          t.palette.mode === "light"
                            ? "#F3F4F6"
                            : "rgba(15,23,42,0.96)",
                  color:
                    timeSlot === slot ? "#020617" : (t) => t.palette.text.primary
                }}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Guests card */}
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
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
            <PeopleAltRoundedIcon
              sx={{ fontSize: 18, color: (t) => t.palette.text.secondary }}
            />
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Guests
            </Typography>
          </Stack>

          <Stack spacing={1.2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 500 }}>
                  Adults
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  18+ years
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => adjust(setAdults, -1, 1)}
                  sx={{
                    minWidth: 32,
                    borderRadius: 999,
                    px: 0,
                    fontSize: 16,
                    lineHeight: 1
                  }}
                >
                  –
                </Button>
                <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 600 }}>
                  {adults}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => adjust(setAdults, 1, 1)}
                  sx={{
                    minWidth: 32,
                    borderRadius: 999,
                    px: 0,
                    fontSize: 16,
                    lineHeight: 1
                  }}
                >
                  +
                </Button>
              </Stack>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 500 }}>
                  Children
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  3–17 years
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => adjust(setChildren, -1, 0)}
                  sx={{
                    minWidth: 32,
                    borderRadius: 999,
                    px: 0,
                    fontSize: 16,
                    lineHeight: 1
                  }}
                >
                  –
                </Button>
                <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 600 }}>
                  {children}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => adjust(setChildren, 1, 0)}
                  sx={{
                    minWidth: 32,
                    borderRadius: 999,
                    px: 0,
                    fontSize: 16,
                    lineHeight: 1
                  }}
                >
                  +
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="contained"
        disabled={!canContinue}
        sx={{
          borderRadius: 999,
          py: 1.1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: canContinue ? "primary.main" : "#9CA3AF",
          color: canContinue ? "#020617" : "#E5E7EB",
          "&:hover": {
            bgcolor: canContinue ? "#06e29a" : "#9CA3AF"
          }
        }}
      >
        Continue to payment
      </Button>
    </Box>
  );
}

export default function RiderScreen79TourDateGuestsCanvas_v2() {
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
          <TourDateGuestsScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
