import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Modal,
  Backdrop,
  Fade,
  Paper,
  Stack
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";

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

interface MapBackgroundProps {
  onMenuClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// Map background component with route visualization
function MapBackground({ onMenuClick }: MapBackgroundProps): React.JSX.Element {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "40vh",
        background: theme.palette.mode === "light"
          ? "linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 50%, #1e3a5f 100%)"
          : "linear-gradient(135deg, #0f1e2e 0%, #1a2d3e 50%, #0f1e2e 100%)",
        zIndex: 0,
        overflow: "hidden"
      }}
    >
      {/* Route line - diagonal from bottom-left to top-right */}
      <Box
        sx={{
          position: "absolute",
          top: "60%",
          left: "15%",
          width: "70%",
          height: 2.5,
          bgcolor: "#000000",
          borderRadius: 2,
          transform: "rotate(-25deg)",
          transformOrigin: "left center",
          zIndex: 1
        }}
      />
      
      {/* Start marker (green) - positioned at start of route */}
      <Box
        sx={{
          position: "absolute",
          top: "58%",
          left: "18%",
          width: 18,
          height: 18,
          borderRadius: "50%",
          bgcolor: "#4CAF50",
          border: "3px solid #FFFFFF",
          boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
          zIndex: 2,
          transform: "translate(-50%, -50%)"
        }}
      />
      
      {/* Time label - positioned above the start marker */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "22%",
          bgcolor: "rgba(0,0,0,0.7)",
          borderRadius: 1.5,
          px: 1.2,
          py: 0.6,
          zIndex: 2,
          transform: "translateX(-50%)"
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: 10,
            fontWeight: 600,
            color: "#FFFFFF",
            whiteSpace: "nowrap"
          }}
        >
          1 hr 30 mins
        </Typography>
      </Box>
      
      {/* Destination label - positioned at end of route */}
      <Box
        sx={{
          position: "absolute",
          top: "42%",
          left: "78%",
          zIndex: 2,
          transform: "translateX(-50%)"
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: 11,
            fontWeight: 500,
            color: "#FFFFFF",
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            whiteSpace: "nowrap"
          }}
        >
          Acacia Mall
        </Typography>
      </Box>
      
      {/* Floating menu icon on map (right side) */}
      <IconButton
        size="small"
        onClick={onMenuClick}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          bgcolor: "rgba(255,255,255,0.25)",
          color: "#FFFFFF",
          zIndex: 10,
          width: 40,
          height: 40,
          "&:hover": {
            bgcolor: "rgba(255,255,255,0.35)"
          }
        }}
      >
        <MenuRoundedIcon sx={{ fontSize: 22 }} />
      </IconButton>
    </Box>
  );
}

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
        mb: 1.5,
        borderRadius: 2,
        bgcolor: theme.palette.mode === "light" ? lightBgColor : darkBgColor,
        border: theme.palette.mode === "light" 
          ? `1px solid ${hexToRgba(preference.color, 0.2)}`
          : `1px solid ${hexToRgba(preference.color, 0.3)}`,
        boxShadow: theme.palette.mode === "light" 
          ? "0 1px 3px rgba(0,0,0,0.1)"
          : "0 1px 3px rgba(0,0,0,0.3)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.palette.mode === "light"
            ? "0 4px 8px rgba(0,0,0,0.15)"
            : "0 4px 8px rgba(0,0,0,0.4)",
          bgcolor: theme.palette.mode === "light" 
            ? hexToRgba(preference.color, 0.2)
            : hexToRgba(preference.color, 0.3)
        }
      }}
    >
      <CardContent sx={{ px: 2, py: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          {/* Colored square icon */}
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
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
                mb: 0.5,
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

function DriverPreferencesScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  // Check if opened as modal (from driver profile) or standalone
  // Default to modal view (true) unless explicitly set to false
  const [isOpen, setIsOpen] = useState(location.state?.isModal !== false);
  
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      navigate(-1);
    }, 300);
  };
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    // Don't close if clicking on navigation or navigation-related elements
    const target = e.target as HTMLElement;
    const isNavigationClick = target.closest('[role="navigation"]') || 
                             target.closest('.MuiBottomNavigation-root') ||
                             target.closest('[data-nav="true"]') ||
                             (target.classList && target.classList.contains('MuiBottomNavigationAction-root'));
    
    if (isNavigationClick) {
      e.stopPropagation();
      return;
    }
    
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
  
  const contentBg = theme.palette.mode === "light" 
    ? "#FFFFFF" 
    : theme.palette.background.paper || "rgba(15,23,42,0.98)";
  
  // If opened as modal, render modal version
  if (isOpen) {
    return (
      <>
<Modal
          open={isOpen}
          onClose={(event: object, reason: string) => {
            // Don't close if clicking on navigation
            if (reason === 'backdropClick') {
              const target = (event as { target?: HTMLElement })?.target;
              const isNavigationClick = target?.closest('[role="navigation"]') || 
                                       target?.closest('.MuiBottomNavigation-root') ||
                                       target?.closest('[data-nav="true"]') ||
                                       (target?.classList && target.classList.contains('MuiBottomNavigationAction-root'));
              if (isNavigationClick) {
                return; // Don't close
              }
            }
            handleClose();
          }}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 300,
            sx: {
              backgroundColor: (theme) => theme.palette.mode === "light" 
                ? 'rgba(0, 0, 0, 0.3)' 
                : 'rgba(0, 0, 0, 0.5)',
              zIndex: 1200 // Below navigation (2000)
            },
            onClick: (e: React.MouseEvent<HTMLDivElement>) => {
              // Check if click is in navigation area
              const navHeight = window.innerWidth < 600 ? 80 : 64;
              const clickY = e.clientY;
              const target = e.target as HTMLElement;
              const isNavigationClick = target?.closest('[role="navigation"]') || 
                                       target?.closest('.MuiBottomNavigation-root') ||
                                       target?.closest('[data-nav="true"]') ||
                                       (target?.classList && target.classList.contains('MuiBottomNavigationAction-root')) ||
                                       (clickY && clickY > window.innerHeight - navHeight);
              
              if (isNavigationClick) {
                e.stopPropagation();
                return;
              }
              handleBackdropClick(e);
            }
          }}
          sx={{
            zIndex: 1200 // Modal container
          }}
        >
          <Fade in={isOpen}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: { xs: "calc(64px + env(safe-area-inset-bottom))", sm: "64px" },
                display: 'flex',
                flexDirection: 'column',
                outline: 'none',
                pointerEvents: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Map Background - visible at top */}
              <MapBackground onMenuClick={handleClose} />
              
              {/* Preferences Modal - slides up from bottom */}
              <Paper
                sx={{
                  position: 'absolute',
                  bottom: { xs: "calc(64px + env(safe-area-inset-bottom))", sm: "64px" },
                  left: 0,
                  right: 0,
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  bgcolor: contentBg,
                  maxHeight: { xs: 'calc(100vh - 40vh - 64px - env(safe-area-inset-bottom))', sm: 'calc(100vh - 40vh - 64px)' },
                  overflow: 'auto',
                  outline: 'none',
                  boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
                  zIndex: 1201, // Above backdrop but navigation (1000) can still be clicked
                  pointerEvents: 'auto'
                }}
              >
              {/* Header */}
              <Box
                sx={{
                  px: 2.5,
                  pt: 2.5,
                  pb: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  position: "sticky",
                  top: 0,
                  bgcolor: contentBg,
                  zIndex: 10,
                  borderBottom: theme.palette.mode === "light"
                    ? "1px solid rgba(0,0,0,0.05)"
                    : "1px solid rgba(255,255,255,0.05)"
                }}
              >
                <IconButton
                  size="small"
                  aria-label="Back"
                  onClick={handleClose}
                  sx={{
                    borderRadius: 999,
                    bgcolor: theme.palette.mode === "light"
                      ? "rgba(0,0,0,0.05)"
                      : "rgba(255,255,255,0.05)",
                    border: theme.palette.mode === "light"
                      ? "1px solid rgba(0,0,0,0.1)"
                      : "1px solid rgba(255,255,255,0.1)"
                  }}
                >
                  <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
                
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    color: theme.palette.text.primary,
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)"
                  }}
                >
                  Preferences
                </Typography>
                
                {/* Spacer for centering */}
                <Box sx={{ width: 40 }} />
              </Box>

              {/* Preference Cards */}
              <Box sx={{ px: 2.5, pb: 2 }}>
                <Stack spacing={0}>
                  {DRIVER_PREFERENCES.map((preference) => (
                    <PreferenceCard
                      key={preference.id}
                      preference={preference}
                      onClick={() => {
                        // Handle card click - could show details, navigate, etc.
                        console.log("Preference clicked:", preference.category);
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Modal>
      </>
    );
  }
  
  // Standalone version (if accessed directly)
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        overflow: "hidden"
      }}
    >
      {/* Map Background */}
      <MapBackground onMenuClick={() => navigate(-1)} />
      
      {/* Preferences Panel */}
      <Paper
        sx={{
          position: 'absolute',
          bottom: { xs: "calc(64px + env(safe-area-inset-bottom))", sm: "64px" },
          left: 0,
          right: 0,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          bgcolor: contentBg,
          maxHeight: { xs: 'calc(100vh - 40vh - 64px - env(safe-area-inset-bottom))', sm: 'calc(100vh - 40vh - 64px)' },
          overflow: 'auto',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.15)'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2.5,
            pt: 2.5,
            pb: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            bgcolor: contentBg,
            zIndex: 10,
            borderBottom: theme.palette.mode === "light"
              ? "1px solid rgba(0,0,0,0.05)"
              : "1px solid rgba(255,255,255,0.05)"
          }}
        >
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 999,
              bgcolor: theme.palette.mode === "light"
                ? "rgba(0,0,0,0.05)"
                : "rgba(255,255,255,0.05)",
              border: theme.palette.mode === "light"
                ? "1px solid rgba(0,0,0,0.1)"
                : "1px solid rgba(255,255,255,0.1)"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: theme.palette.text.primary,
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)"
            }}
          >
            Preferences
          </Typography>
          
          {/* Spacer for centering */}
          <Box sx={{ width: 40 }} />
        </Box>

        {/* Preference Cards */}
        <Box sx={{ px: 2.5, pb: 2 }}>
          <Stack spacing={0}>
            {DRIVER_PREFERENCES.map((preference) => (
              <PreferenceCard
                key={preference.id}
                preference={preference}
                onClick={() => {
                  // Handle card click - could show details, navigate, etc.
                  console.log("Preference clicked:", preference.category);
                }}
              />
            ))}
          </Stack>
        </Box>
      </Paper>
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

        <DriverPreferencesScreen />
      
    </Box>
  );
}
