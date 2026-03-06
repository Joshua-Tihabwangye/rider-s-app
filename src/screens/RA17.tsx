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
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import MobileShell from "../components/MobileShell";

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

interface PreferenceOption {
  id: string;
  label: string;
  icon: React.ReactElement;
}

interface InlinePreferencePillProps {
  option: PreferenceOption;
  active: boolean;
  onToggle: (id: string) => void;
}

function InlinePreferencePill({ option, active, onToggle }: InlinePreferencePillProps): React.JSX.Element {
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

function PreferenceSelectionInlineScreen(): React.JSX.Element {
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
            Any preferences for this ride?
          </Typography>
        </Box>
        <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>


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
    </>

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
