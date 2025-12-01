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
  Chip,
  Stack,
  Button
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
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



const INCOMING_TRACKING_REQUESTS = [
  {
    id: "TRK-REQ-001",
    fromName: "Mary Immaculate",
    description: "Groceries from Nsambya Market",
    eta: "Today • 05:30 PM",
    createdAt: "Today • 03:05 PM"
  },
  {
    id: "TRK-REQ-002",
    fromName: "John Doe",
    description: "Documents from Kansanga",
    eta: "Today • 07:10 PM",
    createdAt: "Today • 01:20 PM"
  },
  {
    id: "TRK-REQ-003",
    fromName: "EVzone Marketplace",
    description: "EV accessories shipment",
    eta: "Tomorrow • 10:00 AM",
    createdAt: "Yesterday • 04:45 PM"
  }
];

function TrackingRequestCard({ request }) {
  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.75,
        borderRadius: 2,
        bgcolor: (t) =>
          t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: (t) =>
          t.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)"
      }}
    >
      <CardContent sx={{ px: 1.75, py: 1.6 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 999,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#E5F9F1" : "rgba(15,23,42,0.96)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <PersonRoundedIcon sx={{ fontSize: 18, color: "primary.main" }} />
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.01em" }}
              >
                {request.fromName}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Shared a tracking link with you
              </Typography>
            </Box>
          </Stack>
          <Chip
            size="small"
            icon={<AccessTimeRoundedIcon sx={{ fontSize: 14 }} />}
            label="Active"
            sx={{
              borderRadius: 999,
              fontSize: 10,
              height: 22,
              bgcolor: "rgba(34,197,94,0.1)",
              color: "#16A34A"
            }}
          />
        </Stack>

        <Box sx={{ mt: 1 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            {request.description}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1.1 }}>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <LocalShippingRoundedIcon
              sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
            />
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              ETA {request.eta}
            </Typography>
          </Stack>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            Shared {request.createdAt}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.25} sx={{ mt: 1.4 }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<ShareRoundedIcon sx={{ fontSize: 16 }} />}
            sx={{
              borderRadius: 999,
              fontSize: 12,
              textTransform: "none",
              py: 0.6,
              bgcolor: "primary.main",
              color: "#020617",
              "&:hover": { bgcolor: "#06e29a" }
            }}
          >
            View tracking
          </Button>
          <Button
            size="small"
            variant="text"
            sx={{
              borderRadius: 999,
              fontSize: 12,
              textTransform: "none",
              color: (t) => t.palette.text.secondary
            }}
          >
            Remove
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function IncomingTrackingRequestsScreen() {
  const navigate = useNavigate();
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
              Incoming tracking requests
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Others have shared their parcel tracking with you
            </Typography>
          </Box>
        </Box>
      </Box>

      {INCOMING_TRACKING_REQUESTS.length === 0 ? (
        <Typography
          variant="caption"
          sx={{ mt: 4, display: "block", textAlign: "center", color: (t) => t.palette.text.secondary }}
        >
          You have no incoming tracking requests.
        </Typography>
      ) : (
        INCOMING_TRACKING_REQUESTS.map((req) => (
          <TrackingRequestCard key={req.id} request={req} />
        ))
      )}
    </Box>
  );
}

export default function RiderScreen56IncomingTrackingRequestsCanvas_v2() {
  const [mode, setMode] = useState("light");
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (t) => t.palette.background.default }}>
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
          <IncomingTrackingRequestsScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
