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
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import AccessibleRoundedIcon from "@mui/icons-material/AccessibleRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import MobileShell from "../components/MobileShell";

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

interface PreferenceOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactElement;
}

interface PreferenceChipProps {
  option: PreferenceOption;
  active: boolean;
  onToggle: (id: string) => void;
}

function PreferenceChip({ option, active, onToggle }: PreferenceChipProps): React.JSX.Element {
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

function RidePreferencesScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [activePrefs, setActivePrefs] = useState(["quiet", "ac"]);

  const togglePref = (id: string): void => {
    setActivePrefs((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const hasPrefs = activePrefs.length > 0;

  return (
    <>
    {/* Green Header */}
        <Box sx={{ bgcolor: "#03CD8C", px: 2.5, pt: 2, pb: 2, display: "flex", alignItems: "center", justifyContent: "flex-end", position: "relative" }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              position: "absolute",
              left: 20,
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "#FFFFFF",
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" }
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, letterSpacing: "-0.01em", color: "#FFFFFF" }}
          >
            Ride preferences
          </Typography>
        </Box>
        <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>


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
    </>

  );
}

export default function RiderScreen16RidePreferencesCanvas_v2() {
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
          <RidePreferencesScreen />
        </MobileShell>
      </Box>
    
  );
}
