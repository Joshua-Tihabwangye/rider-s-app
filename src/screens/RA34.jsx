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
  Tabs,
  Tab,
  Button
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
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
          background: {
            default: "#F3F4F6",
            paper: "#FFFFFF"
          },
          text: {
            primary: "#0F172A",
            secondary: "#6B7280"
          },
          divider: "rgba(148,163,184,0.4)"
        }
      : {
          background: {
            default: "#020617",
            paper: "#020617"
          },
          text: {
            primary: "#F9FAFB",
            secondary: "#A6A6A6"
          },
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
        bgcolor: (theme) => theme.palette.background.default
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
          bgcolor: (theme) => theme.palette.background.default,
          backgroundImage: (theme) =>
            theme.palette.mode === "light"
              ? "radial-gradient(circle at top, #E0F2FE 0, #F3F4F6 55%, #F3F4F6 100%)"
              : "radial-gradient(circle at top, #020617 0, #020617 60%, #020617 100%)"
        }}
      >
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            color: (theme) => theme.palette.text.primary
          }}
        >
          <Box sx={{ flex: 1, overflowY: "auto", paddingBottom: "88px" }}>
            {children}
          </Box>

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
                bgcolor: (theme) =>
                  theme.palette.mode === "light"
                    ? "rgba(255,255,255,0.98)"
                    : "rgba(15,23,42,0.96)",
                backdropFilter: "blur(22px)",
                borderTop: (theme) =>
                  theme.palette.mode === "light"
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
                    color: (theme) =>
                      theme.palette.mode === "light"
                        ? "#9CA3AF"
                        : "rgba(148,163,184,0.9)",
                    minWidth: 0,
                    paddingY: 0.5,
                    paddingX: 0.5,
                    maxWidth: 90
                  },
                  "& .Mui-selected": {
                    color: "#03CD8C"
                  },
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

const UPCOMING_RIDES = [
  {
    id: "UP-2025-10-07-1",
    date: "Tue, 07 Oct 2025",
    time: "07:30 AM",
    from: "Nsambya Road 472, Kampala",
    to: "Bugolobi Village, Kampala",
    type: "Ride later",
    status: "Confirmed"
  },
  {
    id: "UP-2025-10-09-1",
    date: "Thu, 09 Oct 2025",
    time: "05:45 PM",
    from: "Acacia Mall, Kololo",
    to: "Naalya Estates, Kampala",
    type: "Round trip",
    status: "Awaiting driver"
  }
];

function UpcomingRideCard({ ride }) {
  const confirmed = ride.status === "Confirmed";
  const statusColor = confirmed ? "#16A34A" : "#CA8A04";
  const statusBg = confirmed
    ? "rgba(34,197,94,0.12)"
    : "rgba(234,179,8,0.12)";
  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.75,
        borderRadius: 2,
        bgcolor: (theme) =>
          theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: (theme) =>
          theme.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)"
      }}
    >
      <CardContent sx={{ px: 1.75, py: 1.6 }}>
        <Box
          sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {ride.date}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {ride.time}
            </Typography>
          </Box>
          <Chip
            label={ride.status}
            size="small"
            sx={{
              borderRadius: 999,
              fontSize: 11,
              height: 24,
              bgcolor: statusBg,
              color: statusColor
            }}
          />
        </Box>

        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PlaceRoundedIcon sx={{ fontSize: 16, color: "#22c55e" }} />
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {ride.from}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.3 }}>
            <PlaceRoundedIcon sx={{ fontSize: 16, color: "#3b82f6" }} />
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {ride.to}
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Chip
            size="small"
            icon={<DirectionsCarFilledRoundedIcon sx={{ fontSize: 14 }} />}
            label={ride.type}
            sx={{
              borderRadius: 999,
              fontSize: 10,
              height: 22,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
              color: (t) => t.palette.text.primary
            }}
          />
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              sx={{
                borderRadius: 999,
                fontSize: 11,
                textTransform: "none",
                px: 1.8,
                py: 0.3
              }}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="text"
              sx={{
                borderRadius: 999,
                fontSize: 11,
                textTransform: "none",
                color: "#EF4444"
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function RideHistoryUpcomingScreen() {
  const [tab, setTab] = useState("upcoming");

  const handleTabChange = (e, value) => setTab(value);

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 1.5,
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
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
              border: (theme) =>
                theme.palette.mode === "light"
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
              Ride history
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Manage your upcoming EV rides
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tabs – Upcoming focused */}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          minHeight: 36,
          mb: 2,
          "& .MuiTab-root": {
            minHeight: 36,
            fontSize: 12,
            textTransform: "none",
            color: "rgba(148,163,184,1)"
          },
          "& .Mui-selected": {
            color: "#111827"
          },
          "& .MuiTabs-indicator": {
            height: 2,
            borderRadius: 999,
            bgcolor: "primary.main"
          }
        }}
      >
        <Tab value="past" label="Past trips" />
        <Tab value="upcoming" label="Upcoming" />
      </Tabs>

      {tab === "upcoming" && (
        <Box>
          {UPCOMING_RIDES.length === 0 ? (
            <Typography
              variant="caption"
              sx={{ mt: 4, display: "block", textAlign: "center", color: (t) => t.palette.text.secondary }}
            >
              You have no upcoming rides. Scheduled EV rides will appear here.
            </Typography>
          ) : (
            UPCOMING_RIDES.map((ride) => (
              <UpcomingRideCard key={ride.id} ride={ride} />
            ))
          )}
        </Box>
      )}

      {tab === "past" && (
        <Typography
          variant="caption"
          sx={{ mt: 4, display: "block", textAlign: "center", color: (t) => t.palette.text.secondary }}
        >
          Switch to Past trips to view your completed EV rides.
        </Typography>
      )}
    </Box>
  );
}

export default function RiderScreen34RideHistoryUpcomingCanvas_v2() {
  const [mode, setMode] = useState("light");
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (theme) => theme.palette.background.default
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
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (theme) =>
              theme.palette.mode === "light"
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
          <RideHistoryUpcomingScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
