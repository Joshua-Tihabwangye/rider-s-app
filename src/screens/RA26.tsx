import React, { useState, useEffect } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  LinearProgress,
  Avatar
} from "@mui/material";

import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import NavigationRoundedIcon from "@mui/icons-material/NavigationRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import MobileShell from "../components/MobileShell";

function TripInProgressWithDriverScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const theme = useTheme();
  const [progress, setProgress] = useState(40); // 40% of trip completed
  const [eta, setEta] = useState({ hours: 1, minutes: 20 });
  const [distanceCovered, setDistanceCovered] = useState(22);
  const totalDistance = 54;
  const totalTime = "2 hr 20 mins";
  const totalFare = "20,565";
  const destination = "Ndeeba town";
  const userName = "Rider User"; // Would come from user context/API

  // Calculate car position along the rotated route line
  // Route line: from (15%, 78% from top) to (85%, 18% from top), rotated -40deg
  // Car should be directly ON the route line, positioned based on progress
  const routeAngle = 40 * (Math.PI / 180); // Convert to radians
  const routeLength = 70; // Percentage width
  const carDistance = (progress / 100) * routeLength;
  const carLeft = 15 + carDistance * Math.cos(routeAngle);
  const carTop = 78 - carDistance * Math.sin(routeAngle);

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

  const handleShare = () => {
    navigate("/rides/trip/sharing");
  };

  const handleShareDriverDetails = () => {
    console.log("Share driver and vehicle details");
    // In production: Share driver name, vehicle, route link
    if (navigator.share) {
      navigator.share({
        title: "My EVzone Trip",
        text: `Riding with Tim Smith in Tesla Model Y (UPS 256 256)`,
        url: window.location.href
      }).catch(console.error);
    }
  };

  const handleCallDriver = () => {
    console.log("Call driver");
    // In production: Open system dialer with driver's registered number
    window.location.href = "tel:+256700000000";
  };

  const handleChatDriver = () => {
    console.log("Chat with driver");
    // In production: Open in-app messaging window (one-on-one)
    navigate("/rides/chat/driver");
  };

  const handlePayNow = () => {
    navigate("/rides/payment");
  };

  // Driver data
  const driverData = {
    name: "Tim Smith",
    rating: 4.6,
    totalRatings: 157,
    ridesCompleted: 200,
    yearsExperience: 4,
    phone: "+256700000000"
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (theme) => theme.palette.background.default }}>
      {/* Live Map Section - Full width at top */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "50vh",
          background: (theme) =>
            theme.palette.mode === "light"
              ? "#F5F5F5" // Light grey/white map background
              : "linear-gradient(135deg, rgba(15,23,42,0.3), #020617 60%, #020617 100%)",
          overflow: "hidden"
        }}
      >
        {/* Grid overlay - faint for light background */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: theme.palette.mode === "light" ? 0.12 : 0.2,
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.4) 1px, transparent 1px)",
            backgroundSize: "32px 32px"
          }}
        />

        {/* Back Button - Light blue circular in top-left */}
        <IconButton
          size="small"
          aria-label="Back"
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            bgcolor: "#BAE6FD", // Light blue
            color: "#1E40AF", // Dark blue icon
            width: 40,
            height: 40,
            "&:hover": {
              bgcolor: "#93C5FD"
            }
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>

        {/* Map Labels - Organized with proper z-index */}
        {/* Entebbe - top-left */}
        <Typography
          sx={{
            position: "absolute",
            top: "10%",
            left: "10%",
            fontSize: 10,
            fontWeight: 500,
            color: (theme) => theme.palette.mode === "light" ? "#1E40AF" : "#E2E8F0",
            zIndex: 1,
            textShadow: (theme) => theme.palette.mode === "light" ? "none" : "0 1px 2px rgba(0,0,0,0.3)"
          }}
        >
          Entebbe
        </Typography>

        {/* Lake Victoria Hotel - top-center */}
        <Typography
          sx={{
            position: "absolute",
            top: "7%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 11,
            fontWeight: 600,
            color: (theme) => theme.palette.mode === "light" ? "#1E40AF" : "#E2E8F0",
            zIndex: 1,
            textShadow: (theme) => theme.palette.mode === "light" ? "none" : "0 1px 2px rgba(0,0,0,0.3)"
          }}
        >
          Lake Victoria Hotel
        </Typography>

        {/* Imperial Resort Beach Hotel - below Lake Victoria Hotel */}
        <Typography
          sx={{
            position: "absolute",
            top: "13%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 9,
            fontWeight: 500,
            color: (theme) => theme.palette.mode === "light" ? "#1E40AF" : "#E2E8F0",
            zIndex: 1,
            textShadow: (theme) => theme.palette.mode === "light" ? "none" : "0 1px 2px rgba(0,0,0,0.3)"
          }}
        >
          Imperial Resort Beach Hotel
        </Typography>

        {/* Faze 3 - mid-left */}
        <Typography
          sx={{
            position: "absolute",
            top: "44%",
            left: "18%",
            fontSize: 9,
            fontWeight: 500,
            color: (theme) => theme.palette.mode === "light" ? "#1E40AF" : "#E2E8F0",
            zIndex: 1,
            textShadow: (theme) => theme.palette.mode === "light" ? "none" : "0 1px 2px rgba(0,0,0,0.3)"
          }}
        >
          Faze 3
        </Typography>

        {/* BUGONGA - mid-right */}
        <Typography
          sx={{
            position: "absolute",
            top: "44%",
            right: "18%",
            fontSize: 9,
            fontWeight: 500,
            color: (theme) => theme.palette.mode === "light" ? "#1E40AF" : "#E2E8F0",
            zIndex: 1,
            textShadow: (theme) => theme.palette.mode === "light" ? "none" : "0 1px 2px rgba(0,0,0,0.3)"
          }}
        >
          BUGONGA
        </Typography>

        {/* Uganda W Conserv - top-right */}
        <Typography
          sx={{
            position: "absolute",
            top: "10%",
            right: "10%",
            fontSize: 9,
            fontWeight: 500,
            color: (theme) => theme.palette.mode === "light" ? "#1E40AF" : "#E2E8F0",
            zIndex: 1,
            textShadow: (theme) => theme.palette.mode === "light" ? "none" : "0 1px 2px rgba(0,0,0,0.3)"
          }}
        >
          Uganda W Conserv
        </Typography>

        {/* aero beach - bottom-center, near user location */}
        <Typography
          sx={{
            position: "absolute",
            bottom: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 9,
            fontWeight: 500,
            color: (theme) => theme.palette.mode === "light" ? "#1E40AF" : "#E2E8F0",
            zIndex: 1,
            textShadow: (theme) => theme.palette.mode === "light" ? "none" : "0 1px 2px rgba(0,0,0,0.3)"
          }}
        >
          aero beach
        </Typography>

        {/* Pickup location marker (green) - bottom-left */}
        <Box
          sx={{
            position: "absolute",
            left: "15%",
            bottom: "22%",
            width: 18,
            height: 18,
            borderRadius: "50%",
            bgcolor: "#22c55e",
            border: "3px solid white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            zIndex: 5
          }}
        />

        {/* Destination marker (orange) - top-right */}
        <Box
          sx={{
            position: "absolute",
            right: "15%",
            top: "18%",
            width: 18,
            height: 18,
            borderRadius: "50%",
            bgcolor: "#F59E0B",
            border: "3px solid white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            zIndex: 5
          }}
        />

        {/* Pink Hotel Icon - near Lake Victoria Hotel (top-center) */}
        <Box
          sx={{
            position: "absolute",
            top: "9%",
            left: "47%",
            width: 30,
            height: 30,
            borderRadius: "50%",
            bgcolor: "#EC4899", // Pink
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            zIndex: 4
          }}
        >
          <HotelRoundedIcon sx={{ fontSize: 17, color: "#FFFFFF" }} />
        </Box>

        {/* Pink Hotel Icon - near Imperial Resort Beach Hotel */}
        <Box
          sx={{
            position: "absolute",
            top: "15%",
            left: "47%",
            width: 30,
            height: 30,
            borderRadius: "50%",
            bgcolor: "#EC4899", // Pink
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            zIndex: 4
          }}
        >
          <HotelRoundedIcon sx={{ fontSize: 17, color: "#FFFFFF" }} />
        </Box>

        {/* Yellow Restaurant Icon - near Faze 3 */}
        <Box
          sx={{
            position: "absolute",
            top: "46%",
            left: "21%",
            width: 26,
            height: 26,
            borderRadius: "50%",
            bgcolor: "#FCD34D", // Yellow
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
            zIndex: 4
          }}
        >
          <RestaurantRoundedIcon sx={{ fontSize: 15, color: "#FFFFFF" }} />
        </Box>


        {/* User Location - Blue circular dot near bottom-center, below route line */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            bottom: "14%",
            transform: "translateX(-50%)",
            width: 14,
            height: 14,
            borderRadius: "50%",
            bgcolor: "#2196F3",
            border: "2.5px solid white",
            boxShadow: "0 0 0 4px rgba(33,150,243,0.2), 0 2px 4px rgba(0,0,0,0.2)",
            zIndex: 5
          }}
        >
          <MyLocationRoundedIcon sx={{ fontSize: 9, color: "#FFFFFF" }} />
        </Box>

        {/* Route line - connecting pickup (bottom-left) to destination (top-right) */}
        {/* Line from (15%, 78% from top) to (85%, 18% from top) */}
        <Box
          sx={{
            position: "absolute",
            left: "15%",
            bottom: "22%",
            width: "70%",
            height: 5,
            bgcolor: "#1E3A5F",
            borderRadius: 3,
            transform: "rotate(-40deg)",
            transformOrigin: "left center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
            zIndex: 2
          }}
        />

        {/* Vehicle icon on route line - positioned directly ON the line */}
        <Box
          sx={{
            position: "absolute",
            left: `${carLeft}%`,
            top: `${carTop}%`,
            transform: "translate(-50%, -50%) rotate(-40deg)",
            animation: "moveCar 2s ease-in-out infinite",
            "@keyframes moveCar": {
              "0%, 100%": { transform: "translate(-50%, -50%) rotate(-40deg) translateX(0)" },
              "50%": { transform: "translate(-50%, -50%) rotate(-40deg) translateX(3px)" }
            },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 6
          }}
        >
          <DirectionsCarFilledRoundedIcon
            sx={{
              fontSize: 26,
              color: "#FFFFFF", // White car icon
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))"
            }}
          />
          {/* White circle below car */}
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: "#FFFFFF",
              mt: 0.5,
              boxShadow: "0 2px 6px rgba(0,0,0,0.25)"
            }}
          />
        </Box>

        {/* Floating Action Buttons - Right side (light blue circular) */}
        <Stack
          direction="column"
          spacing={1.25}
          sx={{
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10
          }}
        >
          <IconButton
            sx={{
              bgcolor: "#BAE6FD",
              color: "#1E40AF",
              width: 42,
              height: 42,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              "&:hover": {
                bgcolor: "#93C5FD",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
              }
            }}
          >
            <NavigationRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton
            sx={{
              bgcolor: "#BAE6FD",
              color: "#1E40AF",
              width: 42,
              height: 42,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              "&:hover": {
                bgcolor: "#93C5FD",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
              }
            }}
          >
            <CameraAltRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton
            onClick={() => navigate("/rides/trip/sharing")}
            sx={{
              bgcolor: "#BAE6FD",
              color: "#1E40AF",
              width: 42,
              height: 42,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              "&:hover": {
                bgcolor: "#93C5FD",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
              }
            }}
          >
            <GroupRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton
            sx={{
              bgcolor: "#BAE6FD",
              color: "#1E40AF",
              width: 42,
              height: 42,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              "&:hover": {
                bgcolor: "#93C5FD",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
              }
            }}
          >
            <SettingsRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>

        {/* Floating Driver Icon on Map - Clickable to view driver profile */}
        <Box
          onClick={() => {
            // Scroll to driver section or highlight it
            const driverSection = document.getElementById("driver-profile-section");
            if (driverSection) {
              driverSection.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }}
          sx={{
            position: "absolute",
            left: "50%",
            top: "35%",
            transform: "translateX(-50%)",
            cursor: "pointer",
            zIndex: 7,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5
          }}
        >
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: "#2196F3",
              border: "4px solid white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              fontSize: 22,
              fontWeight: 700,
              "&:hover": {
                transform: "scale(1.1)",
                transition: "transform 0.2s ease"
              }
            }}
          >
            TS
          </Avatar>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              bgcolor: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)"
            }}
          >
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 600,
                color: "#FFFFFF"
              }}
            >
              Driver
            </Typography>
          </Box>
        </Box>

        {/* Emergency Button - Bottom-left (red rectangular) */}
        <Button
          variant="contained"
          startIcon={<LocalFireDepartmentRoundedIcon sx={{ fontSize: 18 }} />}
          onClick={handleEmergency}
          sx={{
            position: "absolute",
            bottom: 14,
            left: 14,
            borderRadius: 2.5,
            px: 3.5,
            py: 1.25,
            fontSize: 14,
            fontWeight: 700,
            textTransform: "none",
            bgcolor: "#DC2626",
            color: "#FFFFFF",
            boxShadow: "0 4px 12px rgba(220,38,38,0.4)",
            "&:hover": {
              bgcolor: "#B91C1C",
              boxShadow: "0 6px 16px rgba(220,38,38,0.5)"
            },
            zIndex: 10
          }}
        >
          Emergency
        </Button>
      </Box>

      {/* Trip Info Card - Overlapping map slightly */}
      <Box sx={{ px: 2.5, pt: 0, pb: 2, mt: -3 }}>
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
                : "1px solid rgba(51,65,85,0.9)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}
        >
          <CardContent sx={{ px: 2, py: 1.5 }}>
            {/* Header with Title and Share Icon */}
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
              <IconButton
                size="small"
                onClick={handleShare}
                sx={{
                  bgcolor: (theme) =>
                    theme.palette.mode === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
                  color: "#2196F3"
                }}
              >
                <ShareRoundedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>

            {/* Vehicle Information */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  color: (theme) => theme.palette.text.primary
                }}
              >
                Tesla Model Y
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: (theme) => theme.palette.text.secondary,
                  fontSize: 13,
                  mb: 0.5
                }}
              >
                Dual Motor AWD 100 kWh (670 Hp)
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: (theme) => theme.palette.text.secondary,
                  fontSize: 12,
                  fontWeight: 600
                }}
              >
                License Plate: UPS 256 256
              </Typography>
            </Box>

            {/* Progress Summary - Dark blue box */}
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                borderRadius: 2,
                bgcolor: "#1E3A5F"
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
                  color: "#FFFFFF",
                  fontSize: 13,
                  mb: 1.5
                }}
              >
                You will reach your destination in {eta.hours} hr and {eta.minutes} mins.
              </Typography>

              {/* Progress bar with car icon */}
              <Box sx={{ position: "relative", mb: 0.5 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 8,
                    borderRadius: 999,
                    bgcolor: "rgba(255,255,255,0.2)",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 999,
                      bgcolor: "#2196F3"
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
                      color: "#2196F3",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                    }}
                  />
                </Box>
              </Box>
              {/* Destination label at end of progress bar */}
              <Typography
                variant="caption"
                sx={{
                  fontSize: 11,
                  color: "#FFFFFF",
                  fontWeight: 500
                }}
              >
                {destination}
              </Typography>
            </Box>

            {/* Trip Metrics - In a row */}
            <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
              <Box sx={{ mx: 7, textAlign: "center", flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: (theme) => theme.palette.text.primary,
                    mb: 0.25
                  }}
                >
                  {totalDistance} Km
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 11,
                    color: (theme) => theme.palette.text.secondary
                  }}
                >
                  Distance
                </Typography>
              </Box>
              <Box sx={{ mx: 7, textAlign: "center", flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: (theme) => theme.palette.text.primary,
                    mb: 0.25
                  }}
                >
                  {Math.round(distanceCovered)} Km
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 11,
                    color: (theme) => theme.palette.text.secondary
                  }}
                >
                  Distance Covered
                </Typography>
              </Box>
              <Box sx={{ mx: 7, textAlign: "center", flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: (theme) => theme.palette.text.primary,
                    mb: 0.25
                  }}
                >
                  {totalTime}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 11,
                    color: (theme) => theme.palette.text.secondary
                  }}
                >
                  Total Time
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Driver Profile Image - Centered above info card */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: -4,
            position: "relative",
            zIndex: 1
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "#2196F3",
              fontSize: 32,
              fontWeight: 700,
              border: "4px solid",
              borderColor: (theme) =>
                theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
            }}
          >
            TS
          </Avatar>
        </Box>

        {/* Driver Section */}
        <Card
          id="driver-profile-section"
          elevation={0}
          sx={{
            mb: 2,
            borderRadius: 2,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
            border: (theme) =>
              theme.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            pt: 5
          }}
        >
          <CardContent sx={{ px: 2, py: 1.5 }}>
            {/* Trip Ongoing Label */}
            <Box
                  sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 0.75,
                  borderRadius: 2,
                  bgcolor: "#1E3A5F",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#22c55e",
                    animation: "pulse 2s ease-in-out infinite",
                    "@keyframes pulse": {
                      "0%, 100%": { opacity: 1 },
                      "50%": { opacity: 0.5 }
                    }
                  }}
                />
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#FFFFFF",
                    letterSpacing: "0.02em"
                  }}
                >
                  TRIP ONGOING
                </Typography>
              </Box>
            </Box>

            {/* Driver Name and Rating */}
            <Box sx={{ mx: 7, textAlign: "center", mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  mb: 0.75,
                  color: (theme) => theme.palette.text.primary
                }}
              >
                {driverData.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 1.5 }}>
                <StarRoundedIcon sx={{ fontSize: 18, color: "#FFC107" }} />
                  <Typography
                    variant="body2"
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: (theme) => theme.palette.text.primary
                  }}
                  >
                  {driverData.rating}
                  </Typography>
                    <Typography
                      variant="caption"
                  sx={{
                    fontSize: 12,
                    color: (theme) => theme.palette.text.secondary
                  }}
                    >
                  based on {driverData.totalRatings} ratings
                    </Typography>
                  </Box>

              {/* Quick Stats */}
              <Stack direction="row" spacing={2} sx={{ justifyContent: "center", mb: 2 }}>
                <Box sx={{ mx: 7, textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: (theme) => theme.palette.text.primary,
                      mb: 0.25
                    }}
                  >
                    {driverData.ridesCompleted}+
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 11,
                      color: (theme) => theme.palette.text.secondary
                    }}
                  >
                    Rides completed
                  </Typography>
                </Box>
                <Box sx={{ mx: 7, textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: (theme) => theme.palette.text.primary,
                      mb: 0.25
                    }}
                  >
                    {driverData.yearsExperience}+
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 11,
                      color: (theme) => theme.palette.text.secondary
                    }}
                  >
                    Years of Experience
                  </Typography>
              </Box>
              </Stack>
            </Box>

            {/* Contact Options - Call and Chat Buttons */}
            <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<PhoneRoundedIcon sx={{ fontSize: 18 }} />}
                onClick={handleCallDriver}
                sx={{
                  borderRadius: 2,
                  py: 1.25,
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
                Call
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<MessageRoundedIcon sx={{ fontSize: 18 }} />}
                onClick={handleChatDriver}
                sx={{
                  borderRadius: 2,
                  py: 1.25,
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: "none",
                  borderColor: (theme) =>
                    theme.palette.mode === "light" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)",
                  color: (theme) => theme.palette.text.primary,
                  "&:hover": {
                    borderColor: (theme) =>
                      theme.palette.mode === "light" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)",
                    bgcolor: (theme) =>
                      theme.palette.mode === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"
                  }
                }}
              >
                Chat
              </Button>
            </Stack>

            {/* Share Driver Details Button */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ShareRoundedIcon sx={{ fontSize: 18 }} />}
              onClick={handleShareDriverDetails}
              sx={{
                borderRadius: 2,
                py: 1,
                  fontSize: 13,
                  fontWeight: 600,
                  textTransform: "none",
                  borderColor: (theme) =>
                    theme.palette.mode === "light" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)",
                  color: (theme) => theme.palette.text.primary,
                mb: 1.5,
                  "&:hover": {
                    borderColor: (theme) =>
                      theme.palette.mode === "light" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)",
                    bgcolor: (theme) =>
                      theme.palette.mode === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"
                  }
                }}
              >
              Share Driver Details
              </Button>

            {/* User name display */}
            <Box
              sx={{
                pt: 1.5,
                borderTop: (theme) =>
                  theme.palette.mode === "light"
                    ? "1px solid rgba(0,0,0,0.1)"
                    : "1px solid rgba(255,255,255,0.1)"
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: 11,
                  color: (theme) => theme.palette.text.secondary,
                  display: "block",
                  mb: 0.25
                }}
              >
                Passenger
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: (theme) => theme.palette.text.primary,
                  fontSize: 13
                }}
              >
                {userName}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Fare and Payment Section */}
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

export default function RiderScreen26TripInProgressWithDriverCanvas_v2() {
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
        <Box sx={{ bgcolor: "#03CD8C", px: 2, pt: 2, pb: 2, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 2 }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => window.history.back()}
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
          <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: "-0.01em", color: "#FFFFFF" }}>
            Trip details
          </Typography>
        </Box>
        <TripInProgressWithDriverScreen />
      </MobileShell>
    </Box>
  );
}
