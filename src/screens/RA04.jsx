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
  Chip,
  Card,
  CardContent,
  Button,
  Stack
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
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
          <Box sx={{ flex: 1, overflowY: "auto", paddingBottom: "80px" }}>
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

function UpcomingRideCard({ dateLabel, timeLabel, from, to, status, statusColor, vehicle }) {
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
      <CardContent sx={{ px: 1.75, py: 1.75 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.5
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTimeRoundedIcon
              sx={{ fontSize: 18, color: "rgba(148,163,184,1)" }}
            />
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
              >
                {dateLabel}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                {timeLabel}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={status}
            size="small"
            sx={{
              fontSize: 11,
              height: 24,
              borderRadius: 999,
              bgcolor: statusColor.bg,
              color: statusColor.fg
            }}
          />
        </Box>

        <Box sx={{ mb: 1.25 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.2 }}>
            <PlaceRoundedIcon
              sx={{ fontSize: 18, color: "#22c55e", mt: 0.1 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: (theme) => theme.palette.text.secondary
                }}
              >
                From
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: (theme) => theme.palette.text.primary }}
              >
                {from}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ height: 1, my: 1, bgcolor: "rgba(148,163,184,0.3)" }} />

          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.2 }}>
            <PlaceRoundedIcon
              sx={{ fontSize: 18, color: "#3b82f6", mt: 0.1 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: (theme) => theme.palette.text.secondary
                }}
              >
                To
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: (theme) => theme.palette.text.primary }}
              >
                {to}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 0.5
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DirectionsCarFilledRoundedIcon
              sx={{ fontSize: 18, color: "#22c55e" }}
            />
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              {vehicle}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              sx={{
                borderRadius: 999,
                px: 1.8,
                py: 0.2,
                fontSize: 11,
                textTransform: "none"
              }}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="text"
              sx={{
                borderRadius: 999,
                px: 1.6,
                py: 0.2,
                fontSize: 11,
                textTransform: "none",
                color: "#EF4444"
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

function UpcomingRidesScreen() {
  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2.5,
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
              Upcoming rides
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              View, reschedule or cancel your Ride Later trips
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Filters */}
      <Stack direction="row" spacing={1} sx={{ mb: 2.5 }}>
        <Chip
          label="All"
          size="small"
          sx={{
            height: 26,
            borderRadius: 999,
            bgcolor: "primary.main",
            color: "#020617",
            fontSize: 11
          }}
        />
        <Chip
          label="Today"
          size="small"
          sx={{
            height: 26,
            borderRadius: 999,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (theme) =>
              theme.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            fontSize: 11
          }}
        />
        <Chip
          label="This week"
          size="small"
          sx={{
            height: 26,
            borderRadius: 999,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (theme) =>
              theme.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            fontSize: 11
          }}
        />
      </Stack>

      {/* Upcoming list */}
      <UpcomingRideCard
        dateLabel="Tomorrow • 07 Oct"
        timeLabel="07:30 AM"
        from="New School, JJ Street, Kampala"
        to="Bugolobi Village, Kampala"
        vehicle="Eco EV • Up to 4 passengers"
        status="Confirmed"
        statusColor={{ bg: "rgba(22,163,74,0.12)", fg: "#16A34A" }}
      />
      <UpcomingRideCard
        dateLabel="Thu • 09 Oct"
        timeLabel="05:45 PM"
        from="Acacia Mall, Kololo"
        to="Naalya Estates, Kampala"
        vehicle="EV SUV • Up to 6 passengers"
        status="Waiting driver"
        statusColor={{ bg: "rgba(234,179,8,0.14)", fg: "#CA8A04" }}
      />
      <UpcomingRideCard
        dateLabel="Fri • 10 Oct"
        timeLabel="09:00 AM"
        from="Entebbe Airport"
        to="Nsambya Road, Kampala"
        vehicle="Premium EV • Airport pickup"
        status="Draft"
        statusColor={{ bg: "rgba(148,163,184,0.18)", fg: "#64748B" }}
      />

      <Typography
        variant="caption"
        sx={{
          mt: 1,
          display: "block",
          fontSize: 11,
          color: (theme) => theme.palette.text.secondary
        }}
      >
        You can edit or cancel a Ride Later trip before a driver is assigned.
      </Typography>
    </Box>
  );
}

export default function RiderScreen4UpcomingRidesCanvas_v2() {
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
          <UpcomingRidesScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
