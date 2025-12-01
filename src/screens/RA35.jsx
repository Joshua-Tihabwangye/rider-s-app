import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Rating
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import StarsRoundedIcon from "@mui/icons-material/StarsRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

import MobileShell from "../components/MobileShell";
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



const TIP_AMOUNTS = [2000, 3000, 5000, 8000];

function RateDriverAddTipDedicatedScreen() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [tip, setTip] = useState(3000);

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
            onClick={() => navigate(-1)}
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
              Thank your driver
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              Rate the experience and add a small tip
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Rating focus */}
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
                ? "Amazing! A small tip goes a long way."
                : rating > 0
                ? "Thanks for the feedback."
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
            Choose a tip amount (optional)
          </Typography>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {TIP_AMOUNTS.map((amount) => {
              const active = tip === amount;
              return (
                <Chip
                  key={amount}
                  label={`UGX ${amount.toLocaleString()}`}
                  onClick={() => setTip(amount)}
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
              label="No tip this time"
              size="small"
              onClick={() => setTip(0)}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 26,
                bgcolor: tip === 0
                  ? "primary.main"
                  : (theme) =>
                      theme.palette.mode === "light"
                        ? "#F3F4F6"
                        : "rgba(15,23,42,0.96)",
                color: tip === 0
                  ? "#020617"
                  : (theme) => theme.palette.text.primary
              }}
            />
          </Stack>

          <Typography
            variant="caption"
            sx={{
              mt: 1.3,
              display: "block",
              fontSize: 11,
              color: (theme) => theme.palette.text.secondary
            }}
          >
            Tips are completely optional and go directly to your driver.
          </Typography>
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
        Confirm rating & tip {tip ? `(UGX ${tip.toLocaleString()})` : ""}
      </Button>
    </Box>
  );
}

export default function RiderScreen35RateDriverAddTipDedicatedCanvas_v2() {
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

        <MobileShell>
          <RateDriverAddTipDedicatedScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
