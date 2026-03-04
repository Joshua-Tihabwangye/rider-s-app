import React, { useState, useEffect } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  LinearProgress
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import NavigationRoundedIcon from "@mui/icons-material/NavigationRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import BeachAccessRoundedIcon from "@mui/icons-material/BeachAccessRounded";
import MobileShell from "../components/MobileShell";

function TripInProgressBasicScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(40); // 40% of trip completed
  const [eta, setEta] = useState({ hours: 1, minutes: 20 });
  const [distanceCovered, setDistanceCovered] = useState(22);
  const totalDistance = 54;
  const totalTime = "2 hr 20 mins";
  const totalFare = "20,565";

  // Simulate trip progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 95) {
          return prev + 0.5;
        }
        return prev;
      });
      setDistanceCovered((prev) => {
        if (prev < totalDistance) {
          return prev + 0.2;
        }
        return prev;
      });
      // Update ETA
      setEta((prev) => {
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59 };
        }
        return prev;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleEmergency = () => {
    navigate("/emergency");
  };

  const handleNavigation = () => {
    navigate("/rides/trip/route");
  };

  const handleCamera = () => {
    console.log("Open camera/dash cam");
    // In production: Open camera or dash cam view
  };

  const handleGroup = () => {
    navigate("/rides/trip/sharing");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  const handleRating = () => {
    navigate("/rides/rating");
  };

  const handleShare = () => {
    navigate("/rides/trip/sharing");
  };

  const handlePayNow = () => {
    // Navigate to payment screen
    navigate("/rides/payment");
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (theme) => theme.palette.background.default }}>
      {/* Live Map View - Full width at top */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "50vh",
          background: (theme) =>
            theme.palette.mode === "light"
              ? "#F5F5F5" // Light grey/white map background
              : "linear-gradient(135deg, rgba(15,118,205,0.3), #020617 60%, #020617 100%)",
          overflow: "hidden"
        }}
      >
        {/* Grid overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.3) 1px, transparent 1px)",
            backgroundSize: "30px 30px"
          }}
        />

        {/* Map Labels - Landmarks */}
        <Typography
          sx={{
            position: "absolute",
            top: "12%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 11,
            fontWeight: 600,
            color: "#03CD8C"
          }}
        >
          Lake Victoria Hotel
        </Typography>

        <Typography
          sx={{
            position: "absolute",
            top: "8%",
            left: "15%",
            fontSize: 10,
            fontWeight: 500,
            color: "#03CD8C"
          }}
        >
          Entebbe
        </Typography>

        <Typography
          sx={{
            position: "absolute",
            bottom: "25%",
            right: "20%",
            fontSize: 9,
            fontWeight: 500,
            color: "#03CD8C"
          }}
        >
          aero beach
        </Typography>

        {/* Landmark Icons */}
        <Box
          sx={{
            position: "absolute",
            top: "15%",
            right: "18%",
            width: 28,
            height: 28,
            borderRadius: "50%",
            bgcolor: "#EC4899",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
          }}
        >
          <HotelRoundedIcon sx={{ fontSize: 16, color: "#FFFFFF" }} />
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: "30%",
            left: "25%",
            width: 24,
            height: 24,
            borderRadius: "50%",
            bgcolor: "#F59E0B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
          }}
        >
          <RestaurantRoundedIcon sx={{ fontSize: 14, color: "#FFFFFF" }} />
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: "22%",
            right: "22%",
            width: 24,
            height: 24,
            borderRadius: "50%",
            bgcolor: "#06B6D4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
          }}
        >
          <BeachAccessRoundedIcon sx={{ fontSize: 14, color: "#FFFFFF" }} />
        </Box>

        {/* Pickup location marker (green) */}
        <Box
          sx={{
            position: "absolute",
            left: "18%",
            bottom: "25%",
            width: 16,
            height: 16,
            borderRadius: "50%",
            bgcolor: "#22c55e",
            border: "3px solid white",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            zIndex: 2
          }}
        />

        {/* Destination marker (orange dot) */}
        <Box
          sx={{
            position: "absolute",
            right: "18%",
            top: "28%",
            width: 16,
            height: 16,
            borderRadius: "50%",
            bgcolor: "#F59E0B",
            border: "2px solid white",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            zIndex: 2
          }}
        />

        {/* Route line - connecting pickup to destination */}
        <Box
          sx={{
            position: "absolute",
            left: "18%",
            bottom: "25%",
            width: "64%",
            height: 4,
            bgcolor: "#1E3A5F",
            borderRadius: 2,
            transform: "rotate(-25deg)",
            transformOrigin: "left center",
            zIndex: 1
          }}
        />

        {/* Vehicle icon moving along route with white circle below */}
        <Box
          sx={{
            position: "absolute",
            left: `${18 + (progress / 100) * 64}%`,
            bottom: `${25 - (progress / 100) * 47}%`,
            transform: "translate(-50%, 50%)",
            animation: "moveCar 2s ease-in-out infinite",
            "@keyframes moveCar": {
              "0%, 100%": { transform: "translate(-50%, 50%) translateX(0)" },
              "50%": { transform: "translate(-50%, 50%) translateX(3px)" }
            },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 3
          }}
        >
          <DirectionsCarFilledRoundedIcon
            sx={{
              fontSize: 32,
              color: "#03CD8C",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
            }}
          />
          {/* White circle below car */}
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "#FFFFFF",
              mt: 0.5,
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
            }}
          />
        </Box>

        {/* Emergency Button - Prominently displayed */}
        <Button
          variant="contained"
          startIcon={<LocalFireDepartmentRoundedIcon />}
          onClick={handleEmergency}
          sx={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            borderRadius: 999,
            px: 3,
            py: 1,
            fontSize: 14,
            fontWeight: 700,
            textTransform: "none",
            bgcolor: "#DC2626",
            color: "#FFFFFF",
            boxShadow: "0 4px 12px rgba(220,38,38,0.4)",
            "&:hover": {
              bgcolor: "#B91C1C",
              boxShadow: "0 6px 16px rgba(220,38,38,0.5)"
            }
          }}
        >
          Emergency
        </Button>

        {/* Floating Action Buttons (right side) - Light blue */}
        <Stack
          spacing={1.5}
          sx={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10
          }}
        >
          <IconButton
            onClick={handleNavigation}
            sx={{
              bgcolor: "rgba(3,205,140,0.15)",
              color: "#03CD8C",
              width: 48,
              height: 48,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              "&:hover": {
                bgcolor: "#93C5FD",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
              }
            }}
          >
            <NavigationRoundedIcon />
          </IconButton>
          <IconButton
            onClick={handleCamera}
            sx={{
              bgcolor: "rgba(3,205,140,0.15)",
              color: "#03CD8C",
              width: 48,
              height: 48,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              "&:hover": {
                bgcolor: "#93C5FD",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
              }
            }}
          >
            <CameraAltRoundedIcon />
          </IconButton>
          <IconButton
            onClick={handleGroup}
            sx={{
              bgcolor: "rgba(3,205,140,0.15)",
              color: "#03CD8C",
              width: 48,
              height: 48,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              "&:hover": {
                bgcolor: "#93C5FD",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
              }
            }}
          >
            <GroupRoundedIcon />
          </IconButton>
          <IconButton
            onClick={handleSettings}
            sx={{
              bgcolor: "rgba(3,205,140,0.15)",
              color: "#03CD8C",
              width: 48,
              height: 48,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              "&:hover": {
                bgcolor: "#93C5FD",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
              }
            }}
          >
            <SettingsRoundedIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* Trip Info Section (Bottom Card) */}
      <Box sx={{ px: 2.5, pt: 2, pb: 2 }}>
        <Card
          elevation={0}
          sx={{
            mb: 2,
            borderRadius: 2,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
            border: (theme) =>
              theme.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)"
          }}
        >
          <CardContent sx={{ px: 2, py: 1.5 }}>
            {/* Header with Rating and Share icons */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: (theme) => theme.palette.text.primary
                }}
              >
                Trip Info
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton
                  size="small"
                  onClick={handleRating}
                  sx={{
                    bgcolor: (theme) =>
                      theme.palette.mode === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
                    color: "#FFC107"
                  }}
                >
                  <StarRoundedIcon sx={{ fontSize: 20 }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleShare}
                  sx={{
                    bgcolor: (theme) =>
                      theme.palette.mode === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
                    color: "#03CD8C"
                  }}
                >
                  <ShareRoundedIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Stack>
            </Box>

            {/* Progress Summary Box - Light green */}
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                borderRadius: 2,
                bgcolor: "#DCFCE7" // Light green background
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#22c55e",
                  mb: 0.5,
                  fontSize: 14
                }}
              >
                You're about to get there...
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: (theme) => theme.palette.text.secondary,
                  fontSize: 13,
                  mb: 1.5
                }}
              >
                You will reach your destination in {eta.hours} hr and {eta.minutes} mins.
              </Typography>

              {/* Progress bar with car icon */}
              <Box sx={{ position: "relative", mb: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 8,
                    borderRadius: 999,
                    bgcolor: (theme) =>
                      theme.palette.mode === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 999,
                      bgcolor: "#22c55e"
                    }
                  }}
                />
                {/* Car icon on progress bar */}
                <Box
                  sx={{
                    position: "absolute",
                    left: `${progress}%`,
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    transition: "left 0.5s ease"
                  }}
                >
                  <DirectionsCarFilledRoundedIcon
                    sx={{
                      fontSize: 20,
                      color: "#22c55e",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Trip Metrics */}
            <Stack spacing={1.5}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body2" sx={{ color: (theme) => theme.palette.text.secondary, fontSize: 13 }}>
                  Distance
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                  {totalDistance} Km total
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body2" sx={{ color: (theme) => theme.palette.text.secondary, fontSize: 13 }}>
                  Distance Covered
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                  {Math.round(distanceCovered)} Km completed
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body2" sx={{ color: (theme) => theme.palette.text.secondary, fontSize: 13 }}>
                  Total Time
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                  {totalTime}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Fare Summary Section */}
        <Card
          elevation={0}
          sx={{
            mb: 2,
            borderRadius: 2,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
            border: (theme) =>
              theme.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)"
          }}
        >
          <CardContent sx={{ px: 2, py: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: (theme) => theme.palette.text.secondary, fontSize: 11, display: "block", mb: 0.5 }}
                >
                  Total Fare
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    color: (theme) => theme.palette.text.primary
                  }}
                >
                  UGX {totalFare}
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={handlePayNow}
                sx={{
                  borderRadius: 999,
                  px: 3,
                  py: 1,
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: "none",
                  bgcolor: "#22c55e",
                  color: "#FFFFFF",
                  "&:hover": {
                    bgcolor: "#16A34A"
                  }
                }}
              >
                Pay Now
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default function RiderScreen25TripInProgressBasicCanvas_v2() {
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
        {/* Green Header */}
        <Box sx={{ bgcolor: "#03CD8C", px: 2.5, pt: 2, pb: 2, display: "flex", alignItems: "center", gap: 1.5, position: "relative", zIndex: 2 }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => window.history.back()}
            sx={{ borderRadius: 999, bgcolor: "rgba(255,255,255,0.2)", color: "#FFFFFF", "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: "-0.01em", color: "#FFFFFF" }}>
            Trip in progress
          </Typography>
        </Box>
        <TripInProgressBasicScreen />
      </MobileShell>
    </Box>
  );
}
