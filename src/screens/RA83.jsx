import React, { useState, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Stack,
  Button
} from "@mui/material";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import PhoneEnabledRoundedIcon from "@mui/icons-material/PhoneEnabledRounded";

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



function AmbulanceHomeRequestTypeScreen() {
  return (
    <Box sx={{ px: 2.5, pt: 3, pb: 3 }}>
      {/* Critical banner */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FEF2F2" : "rgba(127,29,29,0.85)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid #FCA5A5"
              : "1px solid rgba(254,202,202,0.6)"
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
                  t.palette.mode === "light" ? "#FEE2E2" : "rgba(248,113,113,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <LocalHospitalRoundedIcon sx={{ fontSize: 24, color: "#DC2626" }} />
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}
              >
                For emergencies
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                If this is life‑threatening, call your local emergency number
                immediately before using this app.
              </Typography>
            </Box>
          </Stack>
          <Button
            fullWidth
            variant="contained"
            startIcon={<PhoneEnabledRoundedIcon sx={{ fontSize: 18 }} />}
            sx={{
              borderRadius: 999,
              py: 1,
              fontSize: 14,
              fontWeight: 600,
              textTransform: "none",
              bgcolor: "#DC2626",
              color: "#FEF2F2",
              "&:hover": { bgcolor: "#B91C1C" }
            }}
          >
            Call emergency services
          </Button>
        </CardContent>
      </Card>

      {/* Request type card */}
      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}
      >
        Choose ambulance request type
      </Typography>

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
          <Stack spacing={1.5}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                Immediate ambulance
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                For urgent but non‑life‑threatening situations. We will connect
                you to the nearest available ambulance.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 1,
                  borderRadius: 999,
                  py: 1,
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: "none",
                  bgcolor: "primary.main",
                  color: "#020617",
                  "&:hover": { bgcolor: "#06e29a" }
                }}
              >
                Request ambulance now
              </Button>
            </Box>

            <Box sx={{ mt: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                Scheduled transfer
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                For planned hospital transfers or clinic referrals at a later
                time.
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  mt: 1,
                  borderRadius: 999,
                  py: 1,
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: "none"
                }}
              >
                Schedule a transfer
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
      >
        Ambulance requests from this app are coordinated via partner hospitals
        and providers. Availability may vary by location.
      </Typography>
    </Box>
  );
}

export default function RiderScreen83AmbulanceHomeRequestTypeCanvas_v2() {
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
          <AmbulanceHomeRequestTypeScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
