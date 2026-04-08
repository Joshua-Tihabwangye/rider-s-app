import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  useTheme
} from "@mui/material";

import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import PageHeader from "../components/PageHeader";
import { uiTokens } from "../design/tokens";

// Mock driver preferences data (would come from API)
const DRIVER_PREFERENCES = [
  {
    id: "communication",
    category: "Communication Style",
    color: "#4CAF50", // Green
    icon: <VolumeOffRoundedIcon sx={{ fontSize: 20, color: "#FFFFFF" }} />,
    value: "Silent (prefers minimal conversation)"
  },
  {
    id: "cultural",
    category: "Cultural Background",
    color: "#03CD8C", // Blue
    icon: <PublicRoundedIcon sx={{ fontSize: 20, color: "#FFFFFF" }} />,
    value: "Cultural Background"
  },
  {
    id: "languages",
    category: "Languages",
    color: "#FF9800", // Orange
    icon: <LanguageRoundedIcon sx={{ fontSize: 20, color: "#FFFFFF" }} />,
    value: "English, Swahili, Mandarin and Spain."
  },
  {
    id: "hobbies",
    category: "Hobbies",
    color: "#9C27B0", // Purple
    icon: <CameraAltRoundedIcon sx={{ fontSize: 20, color: "#FFFFFF" }} />,
    value: "Photography, Sports, Writing"
  },
  {
    id: "professional",
    category: "Professional Background",
    color: "#FFC107", // Yellow
    icon: <BusinessRoundedIcon sx={{ fontSize: 20, color: "#FFFFFF" }} />,
    value: "Business"
  },
  {
    id: "driving",
    category: "Driving Style",
    color: "#F44336", // Red
    icon: <SpeedRoundedIcon sx={{ fontSize: 20, color: "#FFFFFF" }} />,
    value: "Fast & Efficient"
  }
];

interface Preference {
  id: string;
  category: string;
  label?: string;
  color: string;
  value: string;
  icon?: React.ReactElement;
}

interface PreferenceCardProps {
  preference: Preference;
  onClick: (preference: Preference) => void;
}

function PreferenceCard({ preference, onClick }: PreferenceCardProps): React.JSX.Element {
  const theme = useTheme();
  
  // Convert hex color to rgba with opacity for light background
  const hexToRgba = (hex: string, opacity: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  
  const lightBgColor = hexToRgba(preference.color, 0.15);
  const darkBgColor = hexToRgba(preference.color, 0.25);
  
  return (
    <Card
      elevation={0}
      onClick={() => onClick(preference)}
      sx={{
        borderRadius: uiTokens.radius.xl,
        bgcolor: theme.palette.mode === "light" ? lightBgColor : darkBgColor,
        border: theme.palette.mode === "light" 
          ? `1px solid ${hexToRgba(preference.color, 0.2)}`
          : `1px solid ${hexToRgba(preference.color, 0.3)}`,
        boxShadow: uiTokens.elevation.card,
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: uiTokens.elevation.cardHover,
          bgcolor: theme.palette.mode === "light" 
            ? hexToRgba(preference.color, 0.2)
            : hexToRgba(preference.color, 0.3)
        }
      }}
    >
      <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.mdPlus }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: uiTokens.spacing.mdPlus }}>
          {/* Colored square icon */}
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: uiTokens.radius.lg,
              bgcolor: preference.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: theme.palette.mode === "light"
                ? "0 2px 4px rgba(0,0,0,0.1)"
                : "0 2px 4px rgba(0,0,0,0.3)"
            }}
          >
            {preference.icon}
          </Box>
          
          {/* Text content - VALUE is main text, CATEGORY is sub-text */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: theme.palette.text.primary,
                fontSize: 14,
                mb: uiTokens.spacing.xxs,
                lineHeight: 1.4
              }}
            >
              {preference.value}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: 12,
                color: theme.palette.text.secondary,
                fontWeight: 400
              }}
            >
              {preference.category}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DriverPreferences(): React.JSX.Element {
  const navigate = useNavigate();
  
  return (
    <ScreenScaffold
      header={
        <PageHeader
          title="Driver Preferences"
          subtitle="Shared preferences"
          onBack={() => navigate(-1)}
        />
      }
      contentSx={{ pt: { xs: 2.5, md: 3 } }}
    >
      <Typography variant="body2" sx={{ mb: uiTokens.spacing.lg, px: uiTokens.spacing.xxs, color: (t) => t.palette.text.secondary }}>
        These preferences are shared by your driver to ensure a comfortable and personalized trip experience.
      </Typography>
      
      <Stack spacing={uiTokens.spacing.mdPlus}>
        {DRIVER_PREFERENCES.map((preference) => (
          <PreferenceCard
            key={preference.id}
            preference={preference}
            onClick={() => {
              // Handle card click - could show details etc.
              console.log("Preference clicked:", preference.category);
            }}
          />
        ))}
      </Stack>
      
      <Box sx={{ mt: uiTokens.spacing.xxl, px: uiTokens.spacing.xxs }}>
        <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
          Note: These settings are provided by the driver. You can also set your own trip preferences in the main app settings.
        </Typography>
      </Box>
    </ScreenScaffold>
  );
}
