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
  Chip
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
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

function TripInProgressBasicScreen() {
  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 1.75,
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
              Trip in progress
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              Sit back and enjoy your electric ride
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
          height: 260,
          mb: 2.5,
          background: (theme) =>
            theme.palette.mode === "light"
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

        {/* Route start */}
        <Box
          sx={{
            position: "absolute",
            left: "18%",
            bottom: "20%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: "999px",
              bgcolor: "#22c55e",
              border: "2px solid white",
              boxShadow: "0 6px 14px rgba(15,23,42,0.6)"
            }}
          />
        </Box>

        {/* EV car position */}
        <Box
          sx={{
            position: "absolute",
            left: "42%",
            top: "46%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <DirectionsCarFilledRoundedIcon
            sx={{ fontSize: 28, color: "primary.main" }}
          />
        </Box>

        {/* Destination pin */}
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
      </Box>

      {/* Basic ETA only */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.5 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
          >
            Estimated arrival
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
          >
            12 minutes
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
          >
            Approximately 7.4 km remaining
          </Typography>
        </CardContent>
      </Card>

      <Chip
        label="All EVzone rides are 100% electric – quieter, cleaner trips for your city."
        icon={<DirectionsCarFilledRoundedIcon sx={{ fontSize: 16 }} />}
        sx={{
          borderRadius: 999,
          fontSize: 11,
          height: 28,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#E0F2FE" : "rgba(15,23,42,0.96)",
          color: (theme) => theme.palette.text.primary
        }}
      />
    </Box>
  );
}

export default function RiderScreen25TripInProgressBasicCanvas_v2() {
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
          <TripInProgressBasicScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
