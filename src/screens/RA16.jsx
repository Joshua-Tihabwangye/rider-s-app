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
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import AccessibleRoundedIcon from "@mui/icons-material/AccessibleRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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



const PREF_OPTIONS = [
  {
    id: "quiet",
    label: "Quiet ride",
    description: "Minimal conversation",
    icon: <VolumeOffRoundedIcon sx={{ fontSize: 18 }} />
  },
  {
    id: "chatty",
    label: "Happy to chat",
    description: "Light conversation is fine",
    icon: <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 18 }} />
  },
  {
    id: "ac",
    label: "AC on",
    description: "Prefer a cooler cabin",
    icon: <AcUnitRoundedIcon sx={{ fontSize: 18 }} />
  },
  {
    id: "luggage",
    label: "Luggage",
    description: "I have bags or boxes",
    icon: <LuggageRoundedIcon sx={{ fontSize: 18 }} />
  },
  {
    id: "pets",
    label: "Pet friendly",
    description: "I may bring a small pet",
    icon: <PetsRoundedIcon sx={{ fontSize: 18 }} />
  },
  {
    id: "access",
    label: "Accessibility",
    description: "Wheelchair or extra assistance",
    icon: <AccessibleRoundedIcon sx={{ fontSize: 18 }} />
  },
  {
    id: "music",
    label: "Soft music",
    description: "Low volume preferred",
    icon: <MusicNoteRoundedIcon sx={{ fontSize: 18 }} />
  }
];

function PreferenceChip({ option, active, onToggle }) {
  return (
    <Chip
      onClick={() => onToggle(option.id)}
      icon={option.icon}
      label={option.label}
      size="medium"
      sx={{
        justifyContent: "flex-start",
        borderRadius: 999,
        px: 1.4,
        py: 0.4,
        height: 34,
        fontSize: 12,
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
}

function RidePreferencesScreen() {
  const navigate = useNavigate();
  const [activePrefs, setActivePrefs] = useState(["quiet", "ac"]);

  const togglePref = (id) => {
    setActivePrefs((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const hasPrefs = activePrefs.length > 0;

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
              Ride preferences
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              We’ll share this with your driver where possible
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Preferences card */}
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
          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: (theme) => theme.palette.text.secondary,
              mb: 1.25
            }}
          >
            What matters to you?
          </Typography>

          <Stack spacing={1.2}>
            {PREF_OPTIONS.map((opt) => (
              <Box key={opt.id}>
                <PreferenceChip
                  option={opt}
                  active={activePrefs.includes(opt.id)}
                  onToggle={togglePref}
                />
                <Typography
                  variant="caption"
                  sx={{
                    mt: 0.2,
                    ml: 5,
                    fontSize: 10.5,
                    color: (theme) => theme.palette.text.secondary
                  }}
                >
                  {opt.description}
                </Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Info */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid rgba(226,232,240,1)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.4 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <InfoOutlinedIcon
              sx={{ fontSize: 18, color: (theme) => theme.palette.text.secondary }}
            />
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
              >
                We do our best to match your preferences, but they may not always
                be guaranteed depending on vehicle and driver availability.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="contained"
        sx={{
          borderRadius: 999,
          py: 1.1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: hasPrefs ? "primary.main" : "#9CA3AF",
          color: hasPrefs ? "#020617" : "#E5E7EB",
          "&:hover": {
            bgcolor: hasPrefs ? "#06e29a" : "#9CA3AF"
          }
        }}
      >
        Save preferences
      </Button>
    </Box>
  );
}

export default function RiderScreen16RidePreferencesCanvas_v2() {
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
          <RidePreferencesScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
