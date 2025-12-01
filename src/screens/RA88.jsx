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
  Chip,
  Button
} from "@mui/material";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";

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



const AMBULANCE_REQUESTS = [
  {
    id: "AMB-REQ-2025-10-07-001",
    date: "Today • 14:32",
    from: "Nsambya Road 472, Kampala",
    to: "Nsambya Hospital",
    status: "Completed"
  },
  {
    id: "AMB-REQ-2025-09-25-004",
    date: "25 Sep 2025 • 09:10",
    from: "Bugolobi Village, Kampala",
    to: "Mulago National Referral Hospital",
    status: "Completed"
  },
  {
    id: "AMB-REQ-2025-09-10-002",
    date: "10 Sep 2025 • 18:45",
    from: "Kansanga Market",
    to: "Case Hospital",
    status: "Cancelled"
  }
];

function AmbulanceRequestCard({ req }) {
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
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 999,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FEE2E2" : "rgba(127,29,29,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <LocalHospitalRoundedIcon sx={{ fontSize: 22, color: "#DC2626" }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Ambulance request
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {req.date}
            </Typography>
            <Stack spacing={0.25} sx={{ mt: 0.4 }}>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <PlaceRoundedIcon
                  sx={{ fontSize: 15, color: (t) => t.palette.text.secondary }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  From: {req.from}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <PlaceRoundedIcon
                  sx={{ fontSize: 15, color: (t) => t.palette.text.secondary }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  To: {req.to}
                </Typography>
              </Stack>
            </Stack>
          </Box>
          <Chip
            size="small"
            label={req.status}
            sx={{
              borderRadius: 999,
              fontSize: 10,
              height: 22,
              bgcolor:
                req.status === "Completed"
                  ? "rgba(34,197,94,0.12)"
                  : "rgba(148,163,184,0.18)",
              color:
                req.status === "Completed" ? "#16A34A" : "rgba(148,163,184,1)"
            }}
          />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            ID: {req.id}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            sx={{
              borderRadius: 999,
              px: 2,
              py: 0.4,
              fontSize: 12,
              textTransform: "none"
            }}
          >
            View details
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function AmbulanceRequestsHistoryScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("all");

  const filtered = AMBULANCE_REQUESTS.filter((req) => {
    if (tab === "all") return true;
    return req.status.toLowerCase() === tab;
  });

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
              Ambulance requests
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Completed and cancelled requests
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Filters */}
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
        <Chip
          label="All"
          onClick={() => setTab("all")}
          size="small"
          sx={{
            borderRadius: 999,
            fontSize: 11,
            height: 26,
            bgcolor: tab === "all" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
            color: tab === "all" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
        <Chip
          label="Completed"
          onClick={() => setTab("completed")}
          size="small"
          sx={{
            borderRadius: 999,
            fontSize: 11,
            height: 26,
            bgcolor: tab === "completed" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
            color: tab === "completed" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
        <Chip
          label="Cancelled"
          onClick={() => setTab("cancelled")}
          size="small"
          sx={{
            borderRadius: 999,
            fontSize: 11,
            height: 26,
            bgcolor: tab === "cancelled" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
            color: tab === "cancelled" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
      </Stack>

      {filtered.length === 0 ? (
        <Typography
          variant="caption"
          sx={{ mt: 4, display: "block", textAlign: "center", color: (t) => t.palette.text.secondary }}
        >
          No ambulance requests in this view yet.
        </Typography>
      ) : (
        filtered.map((req) => <AmbulanceRequestCard key={req.id} req={req} />)
      )}
    </Box>
  );
}

export default function RiderScreen88AmbulanceRequestsHistoryCanvas_v2() {
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

        <MobileShell>
          <AmbulanceRequestsHistoryScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
