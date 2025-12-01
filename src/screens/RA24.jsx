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
  Button,
  Chip,
  Stack,
  Avatar
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
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
              ? "radial-gradient(circle at top, #DCFCE7 0, #F3F4F6 55%, #F3F4F6 100%)"
              : "radial-gradient(circle at top, #022c22 0, #020617 60%, #020617 100%)"
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

function DriverHasArrivedScreen() {
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
              Your driver has arrived
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              Please meet near the pin and check the plate before boarding
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
          background: (theme) =>
            theme.palette.mode === "light"
              ? "radial-gradient(circle at top, #BBF7D0 0, #DCFCE7 55%, #F0FDF4 100%)"
              : "radial-gradient(circle at top, rgba(34,197,94,0.45), #022c22 60%, #020617 100%)"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.18,
            backgroundImage:
              "linear-gradient(to right, rgba(15,23,42,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.25) 1px, transparent 1px)",
            backgroundSize: "30px 30px"
          }}
        />

        {/* Drop pin */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "35%",
            transform: "translate(-50%, -100%)"
          }}
        >
          <PlaceRoundedIcon
            sx={{
              fontSize: 32,
              color: "primary.main",
              filter: "drop-shadow(0 8px 16px rgba(15,23,42,0.8))"
            }}
          />
        </Box>

        {/* EV car parked near pin */}
        <Box
          sx={{
            position: "absolute",
            left: "56%",
            top: "52%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <DirectionsCarFilledRoundedIcon
            sx={{ fontSize: 30, color: "#22c55e" }}
          />
        </Box>
      </Box>

      {/* Driver & vehicle summary */}
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
        <CardContent sx={{ px: 1.75, py: 1.6 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: "primary.main",
                  color: "#020617",
                  fontSize: 18,
                  fontWeight: 600
                }}
              >
                BK
              </Avatar>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  Bwanbale Kato
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
                >
                  Tesla Model 3 • UBL 630X
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
                >
                  4.9 ★ • 230 trips
                </Typography>
              </Box>
            </Box>
            <Chip
              icon={<CheckCircleRoundedIcon sx={{ fontSize: 16 }} />}
              label="Arrived"
              size="small"
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 26,
                bgcolor: "rgba(34,197,94,0.12)",
                color: "#16A34A"
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Actions */}
      <Stack direction="row" spacing={1.25} sx={{ mb: 1.75 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<PhoneRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{
            borderRadius: 999,
            py: 0.9,
            fontSize: 13,
            textTransform: "none"
          }}
        >
          Call
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<MessageRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{
            borderRadius: 999,
            py: 0.9,
            fontSize: 13,
            textTransform: "none"
          }}
        >
          Chat
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<ShareRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{
            borderRadius: 999,
            py: 0.9,
            fontSize: 13,
            textTransform: "none"
          }}
        >
          Share trip
        </Button>
      </Stack>

      {/* Start trip CTA */}
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
          mb: 1.25,
          "&:hover": { bgcolor: "#06e29a" }
        }}
      >
        I’m in – start trip
      </Button>

      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
      >
        If you can’t see your driver, call or chat first. Only tap “I’m in –
        start trip” once you are inside the EV.
      </Typography>
    </Box>
  );
}

export default function RiderScreen24DriverHasArrivedCanvas_v2() {
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
          <DriverHasArrivedScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
