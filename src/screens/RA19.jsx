import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
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
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import AccessibleRoundedIcon from "@mui/icons-material/AccessibleRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MobileShell from "../components/MobileShell";

const PREF_GROUPS = [
  {
    id: "conversation",
    title: "Conversation",
    prefs: [
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
      }
    ]
  },
  {
    id: "comfort",
    title: "Comfort",
    prefs: [
      {
        id: "ac",
        label: "AC on",
        description: "Prefer a cooler cabin",
        icon: <AcUnitRoundedIcon sx={{ fontSize: 18 }} />
      },
      {
        id: "music",
        label: "Soft music",
        description: "Low volume preferred",
        icon: <MusicNoteRoundedIcon sx={{ fontSize: 18 }} />
      }
    ]
  },
  {
    id: "special",
    title: "Special needs",
    prefs: [
      {
        id: "luggage",
        label: "Luggage",
        description: "I often travel with bags",
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
      }
    ]
  }
];

function PrefBadge({ pref, active }) {
  return (
    <Chip
      icon={pref.icon}
      label={pref.label}
      size="small"
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
}

function DriverPreferencesScreen() {
  const navigate = useNavigate();
  const [activePrefs] = useState(["quiet", "ac", "luggage"]);

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
              My driver preferences
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              These defaults are applied to all rides on this profile
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Summary card */}
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
              mb: 1
            }}
          >
            Active defaults
          </Typography>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {PREF_GROUPS.flatMap((g) => g.prefs).map((pref) => (
              <PrefBadge
                key={pref.id}
                pref={pref}
                active={activePrefs.includes(pref.id)}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Grouped view */}
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
          <Stack spacing={2.25}>
            {PREF_GROUPS.map((group) => (
              <Box key={group.id}>
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
                  {group.title}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  {group.prefs.map((p) => (
                    <PrefBadge
                      key={p.id}
                      pref={p}
                      active={activePrefs.includes(p.id)}
                    />
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Info + actions */}
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
                Drivers will see these preferences when they accept your trips.
                They are not strict rules, but they help us match you with the
                best possible experience.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

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
          Reset to default
        </Button>
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
            "&:hover": {
              bgcolor: "#06e29a"
            }
          }}
        >
          Edit preferences
        </Button>
      </Stack>
    </Box>
  );
}

export default function RiderScreen19DriverPreferencesCanvas_v2() {
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
          <DriverPreferencesScreen />
        </MobileShell>
      </Box>
    
  );
}
