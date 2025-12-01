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
  Stack
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
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



function RideLaterSummaryScreen() {
  const navigate = useNavigate();
  const [summary] = useState({
    pickup: "New School, JJ Street, Kampala",
    dropoff: "Bugolobi Village, Kampala",
    date: "Tue, 07 Oct 2025",
    time: "07:30 AM",
    passengers: 2,
    tripType: "Round trip",
    tripNote: "Driver will wait 45 minutes before return"
  });

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
              Ride later summary
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              Review details before you confirm
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Trip summary card */}
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
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          {/* From / To */}
          <Box sx={{ mb: 1.75 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.2 }}>
              <PlaceRoundedIcon
                sx={{ fontSize: 18, color: "#22c55e", mt: 0.2 }}
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
                  sx={{
                    fontWeight: 500,
                    color: (theme) => theme.palette.text.primary
                  }}
                >
                  {summary.pickup}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                my: 1,
                height: 1,
                bgcolor: (theme) =>
                  theme.palette.mode === "light"
                    ? "#E5E7EB"
                    : "rgba(30,64,175,0.45)"
              }}
            />

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.2 }}>
              <PlaceRoundedIcon
                sx={{ fontSize: 18, color: "#3b82f6", mt: 0.2 }}
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
                  sx={{
                    fontWeight: 500,
                    color: (theme) => theme.palette.text.primary
                  }}
                >
                  {summary.dropoff}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Date and time */}
          <Box sx={{ mb: 1.75 }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: (theme) => theme.palette.text.secondary,
                mb: 0.75
              }}
            >
              When
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap" }}>
              <Chip
                icon={<EventRoundedIcon sx={{ fontSize: 16 }} />}
                label={summary.date}
                size="small"
                sx={{
                  borderRadius: 999,
                  fontSize: 11,
                  bgcolor: (theme) =>
                    theme.palette.mode === "light" ? "#EFF6FF" : "rgba(15,23,42,1)",
                  color: (theme) => theme.palette.text.primary
                }}
              />
              <Chip
                icon={<AccessTimeRoundedIcon sx={{ fontSize: 16 }} />}
                label={summary.time}
                size="small"
                sx={{
                  borderRadius: 999,
                  fontSize: 11,
                  bgcolor: (theme) =>
                    theme.palette.mode === "light" ? "#ECFEFF" : "rgba(15,23,42,1)",
                  color: (theme) => theme.palette.text.primary
                }}
              />
            </Stack>
          </Box>

          {/* Passengers and trip type */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: (theme) => theme.palette.text.secondary,
                mb: 0.75
              }}
            >
              Trip details
            </Typography>

            <Stack spacing={1.25}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                <GroupsRoundedIcon
                  sx={{ fontSize: 18, color: "primary.main" }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
                >
                  {summary.passengers} passengers
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                <AutorenewRoundedIcon
                  sx={{ fontSize: 18, color: "#0EA5E9" }}
                />
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 11,
                      color: (theme) => theme.palette.text.secondary
                    }}
                  >
                    {summary.tripType}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 11,
                      color: (theme) => theme.palette.text.secondary,
                      display: "block"
                    }}
                  >
                    {summary.tripNote}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{
          mb: 1.5,
          display: "block",
          fontSize: 11,
          color: (theme) => theme.palette.text.secondary
        }}
      >
        You can edit or cancel this Ride Later trip from Upcoming rides before a driver is assigned.
      </Typography>

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
          "&:hover": { bgcolor: "#06e29a" }
        }}
      >
        Confirm Ride Later
      </Button>
    </Box>
  );
}

export default function RiderScreen9RideLaterSummaryCanvas_v2() {
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
          <RideLaterSummaryScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
