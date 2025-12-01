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
  Stack,
  Chip
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
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



const STEPS = [
  {
    id: 1,
    label: "Picked up",
    time: "Today • 15:20",
    description: "Courier has collected your parcel",
    status: "done"
  },
  {
    id: 2,
    label: "In transit",
    time: "On the way",
    description: "Your parcel is on its way to the next stop",
    status: "current"
  },
  {
    id: 3,
    label: "Out for delivery",
    time: "Courier is nearby",
    description: "Courier is heading to the drop-off location",
    status: "upcoming"
  },
  {
    id: 4,
    label: "Delivered",
    time: "Pending",
    description: "Parcel will be handed to the recipient",
    status: "upcoming"
  }
];

function StepRow({ step, isLast }) {
  const isDone = step.status === "done";
  const isCurrent = step.status === "current";

  const dotColor = isDone ? "#22c55e" : isCurrent ? "#0EA5E9" : "#CBD5F5";
  const showCheck = isDone;

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", mb: isLast ? 0 : 1.5 }}>
      <Box sx={{ mr: 1.5, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: "999px",
            bgcolor: isCurrent ? "rgba(59,130,246,0.12)" : "transparent",
            border: isDone ? "none" : `2px solid ${dotColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {showCheck ? (
            <CheckCircleRoundedIcon sx={{ fontSize: 18, color: "#22c55e" }} />
          ) : (
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "999px",
                bgcolor: dotColor
              }}
            />
          )}
        </Box>
        {!isLast && (
          <Box
            sx={{
              flex: 1,
              width: 2,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#E5E7EB" : "rgba(148,163,184,0.5)",
              mt: 0.3
            }}
          />
        )}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            variant="body2"
            sx={{ fontWeight: isCurrent ? 600 : 500, letterSpacing: "-0.01em" }}
          >
            {step.label}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            {step.time}
          </Typography>
        </Stack>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
        >
          {step.description}
        </Typography>
      </Box>
    </Box>
  );
}

function DeliveryStatusTimelineScreen() {
  const navigate = useNavigate();
  const trackingId = "DLV-2025-10-07-001";

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
              Delivery status
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Follow your order from pickup to delivery
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Summary card */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            Tracking ID
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
          >
            {trackingId}
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
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
            <Chip
              size="small"
              icon={<PlaceRoundedIcon sx={{ fontSize: 14 }} />}
              label="Nsambya → Bugolobi"
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 24,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                color: (t) => t.palette.text.primary
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Timeline card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1.5, display: "block" }}
          >
            Order progress
          </Typography>
          {STEPS.map((step, index) => (
            <StepRow
              key={step.id}
              step={step}
              isLast={index === STEPS.length - 1}
            />
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}

export default function RiderScreen64DeliveryStatusProgressTimelineCanvas_v2() {
  const [mode, setMode] = useState("light");
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{ position: "relative", minHeight: "100vh", bgcolor: (t) => t.palette.background.default }}
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

        <MobileShell>
          <DeliveryStatusTimelineScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
