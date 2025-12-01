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
  TextField,
  Rating
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import StarsRoundedIcon from "@mui/icons-material/StarsRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
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
              ? "radial-gradient(circle at top, #FEF3C7 0, #F9FAFB 55%, #F3F4F6 100%)"
              : "radial-gradient(circle at top, #451a03 0, #020617 60%, #020617 100%)"
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

const TIP_AMOUNTS = [2000, 3000, 5000];

function RideRatingTipScreen() {
  const [rating, setRating] = useState(5);
  const [tip, setTip] = useState(3000);
  const [customTip, setCustomTip] = useState("");
  const [comment, setComment] = useState("");

  const effectiveTip = customTip ? Number(customTip) || 0 : tip;
  const canSubmit = rating > 0;

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
              Rate your driver & add a tip
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              100% of tips go to the driver
            </Typography>
          </Box>
        </Box>
      </Box>

      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.8 }}>
          <Box sx={{ textAlign: "center", mb: 1.5 }}>
            <Rating
              value={rating}
              onChange={(e, value) => setRating(value)}
              precision={1}
              size="large"
              sx={{ mt: 0.5 }}
            />
            <Typography
              variant="caption"
              sx={{ mt: 0.5, display: "block", fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {rating >= 4
                ? "Thanks for the great rating!"
                : rating > 0
                ? "Tell us what could be better."
                : "Tap a star to rate"}
            </Typography>
          </Box>

          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              color: (theme) => theme.palette.text.secondary,
              mb: 1
            }}
          >
            Would you like to tip Bwanbale Kato?
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
            {TIP_AMOUNTS.map((amount) => {
              const active = !customTip && tip === amount;
              return (
                <Chip
                  key={amount}
                  label={`UGX ${amount.toLocaleString()}`}
                  onClick={() => {
                    setTip(amount);
                    setCustomTip("");
                  }}
                  size="small"
                  icon={
                    active ? (
                      <EmojiEventsRoundedIcon sx={{ fontSize: 16 }} />
                    ) : undefined
                  }
                  sx={{
                    borderRadius: 999,
                    fontSize: 11,
                    height: 26,
                    bgcolor: active
                      ? "primary.main"
                      : (theme) =>
                          theme.palette.mode === "light"
                            ? "#F3F4F6"
                            : "rgba(15,23,42,0.96)",
                    color: active
                      ? "#020617"
                      : (theme) => theme.palette.text.primary,
                    "& .MuiChip-icon": {
                      color: active ? "#020617" : "rgba(148,163,184,1)"
                    }
                  }}
                />
              );
            })}
            <Chip
              label="Custom"
              size="small"
              onClick={() => setCustomTip(customTip || "5000")}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 26,
                bgcolor: customTip
                  ? "primary.main"
                  : (theme) =>
                      theme.palette.mode === "light"
                        ? "#F3F4F6"
                        : "rgba(15,23,42,0.96)",
                color: customTip
                  ? "#020617"
                  : (theme) => theme.palette.text.primary
              }}
            />
          </Stack>

          {customTip && (
            <TextField
              fullWidth
              size="small"
              label="Custom tip amount (UGX)"
              value={customTip}
              onChange={(e) => setCustomTip(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 999,
                  bgcolor: (theme) =>
                    theme.palette.mode === "light"
                      ? "#F9FAFB"
                      : "rgba(15,23,42,0.96)",
                  "& fieldset": {
                    borderColor: (theme) =>
                      theme.palette.mode === "light"
                        ? "rgba(209,213,219,0.9)"
                        : "rgba(51,65,85,0.9)"
                  },
                  "&:hover fieldset": {
                    borderColor: "primary.main"
                  }
                }
              }}
            />
          )}

          <Typography
            variant="caption"
            sx={{
              mt: 1.25,
              display: "block",
              fontSize: 11,
              color: (theme) => theme.palette.text.secondary
            }}
          >
            Your tip will be charged together with your trip, using the same
            payment method.
          </Typography>
        </CardContent>
      </Card>

      {/* Optional comment */}
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
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
          >
            Leave a note for your driver (optional)
          </Typography>
          <TextField
            multiline
            minRows={2}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Thank you for the ride…"
            sx={{
              mt: 0.75,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (theme) =>
                    theme.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": {
                  borderColor: "primary.main"
                }
              }
            }}
          />
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="contained"
        disabled={!canSubmit}
        startIcon={<StarsRoundedIcon sx={{ fontSize: 18 }} />}
        sx={{
          borderRadius: 999,
          py: 1.1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: canSubmit ? "primary.main" : "#9CA3AF",
          color: canSubmit ? "#020617" : "#E5E7EB",
          "&:hover": {
            bgcolor: canSubmit ? "#06e29a" : "#9CA3AF"
          }
        }}
      >
        Submit rating & tip (UGX {effectiveTip.toLocaleString() || 0})
      </Button>
    </Box>
  );
}

export default function RiderScreen32RideRatingTipCanvas_v2() {
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
          <RideRatingTipScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
