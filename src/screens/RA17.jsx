import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
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
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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

const INLINE_PREFS = [
  {
    id: "quiet",
    label: "Quiet ride",
    icon: <VolumeOffRoundedIcon sx={{ fontSize: 18 }} />
  },
  {
    id: "chatty",
    label: "Happy to chat",
    icon: <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 18 }} />
  },
  {
    id: "ac",
    label: "AC on",
    icon: <AcUnitRoundedIcon sx={{ fontSize: 18 }} />
  },
  {
    id: "luggage",
    label: "Luggage",
    icon: <LuggageRoundedIcon sx={{ fontSize: 18 }} />
  }
];

function InlinePreferencePill({ option, active, onToggle }) {
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

function PreferenceSelectionInlineScreen() {
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
              Any preferences for this ride?
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              Optional – your driver will see this when they accept
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Preference pills */}
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
          <Stack spacing={1.2}>
            {INLINE_PREFS.map((opt) => (
              <InlinePreferencePill
                key={opt.id}
                option={opt}
                active={activePrefs.includes(opt.id)}
                onToggle={togglePref}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Info / skip */}
      <Box
        sx={{
          mb: 1.5,
          display: "flex",
          alignItems: "flex-start",
          gap: 1
        }}
      >
        <InfoOutlinedIcon
          sx={{ fontSize: 18, color: (theme) => theme.palette.text.secondary }}
        />
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
        >
          We’ll try to match these, but they may not be guaranteed for every
          ride.
        </Typography>
      </Box>

      <Stack direction="row" spacing={1.25}>
        <Button
          fullWidth
          variant="outlined"
          sx={{
            borderRadius: 999,
            py: 1,
            fontSize: 14,
            fontWeight: 500,
            textTransform: "none"
          }}
        >
          Skip for this ride
        </Button>
        <Button
          fullWidth
          variant="contained"
          sx={{
            borderRadius: 999,
            py: 1,
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
          Apply & continue
        </Button>
      </Stack>
    </Box>
  );
}

export default function RiderScreen17PreferenceSelectionInlineCanvas_v2() {
      return (
    
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (theme) => theme.palette.background.default
        }}
      >
        

        <DarkModeToggle />

        

        <MobileShell>
          <PreferenceSelectionInlineScreen />
        </MobileShell>
      </Box>
    
  );
}
