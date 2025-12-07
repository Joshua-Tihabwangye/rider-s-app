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
  LinearProgress,
  Avatar
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import MobileShell from "../components/MobileShell";

function TripInProgressExpandedDetailsScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(40); // 40% of trip completed
  const [eta, setEta] = useState({ hours: 1, minutes: 30 });
  const [distanceCovered, setDistanceCovered] = useState(22);
  const totalDistance = 54;
  const totalTime = "2 hr 20 mins";
  const totalFare = "20,565";
  const destination = "Ndeeba town";
  const destinationLabel = "Acacia Mall";
  const userName = "Rider User";

  // Route stops with timestamps
  const routeStops = [
    { name: "Entebbe International Airport", type: "Departure point", time: "12:10 PM", completed: true },
    { name: "Kampala Road", type: "Waypoint", time: "12:45 PM", completed: true },
    { name: "Ndeeba town", type: "Destination", time: "1:30 PM", completed: false }
  ];

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

  const handleShare = () => {
    console.log("Share live trip location or status");
    // In production: Share live trip updates or location
  };

  const handleLuggage = () => {
    console.log("Open trip details/luggage");
    // In production: Open trip details, luggage, or booking summary
  };

  const handleRateDriver = () => {
    navigate("/rides/rating/driver");
  };

  const handlePayNow = () => {
    navigate("/rides/payment");
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (theme) => theme.palette.background.default }}>
      {/* Map Section - Full width at top */}
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

        {/* Back arrow (top left) */}
        <IconButton
          size="small"
          aria-label="Back"
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            bgcolor: "#03CD8C",
            color: "#FFFFFF",
            width: 40,
            height: 40,
            "&:hover": {
              bgcolor: "#1976D2"
            }
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>

        {/* Route line */}
        <Box
          sx={{
            position: "absolute",
            top: "55%",
            left: "20%",
            width: "60%",
            height: 4,
            bgcolor: "#1E3A5F",
            borderRadius: 2,
            transform: "rotate(-20deg)",
            transformOrigin: "left center"
          }}
        />

        {/* Pickup location marker (green) */}
        <Box
          sx={{
            position: "absolute",
            left: "20%",
            bottom: "30%",
            width: 16,
            height: 16,
            borderRadius: "50%",
            bgcolor: "#22c55e",
            border: "3px solid white",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
          }}
        />

        {/* Moving car icon showing current driver position */}
        <Box
          sx={{
            position: "absolute",
            left: `${20 + (progress / 100) * 60}%`,
            top: `${55 - (progress / 100) * 20}%`,
            transform: "translate(-50%, -50%)",
            animation: "moveCar 2s ease-in-out infinite",
            "@keyframes moveCar": {
              "0%, 100%": { transform: "translate(-50%, -50%) translateX(0)" },
              "50%": { transform: "translate(-50%, -50%) translateX(3px)" }
            }
          }}
        >
          <DirectionsCarFilledRoundedIcon
            sx={{
              fontSize: 32,
              color: "#03CD8C",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
            }}
          />
        </Box>

        {/* Destination marker (red) */}
        <Box
          sx={{
            position: "absolute",
            right: "20%",
            top: "35%",
            width: 16,
            height: 16,
            borderRadius: "50%",
            bgcolor: "#FF5722",
            border: "3px solid white",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
          }}
        />

        {/* Destination label with ETA */}
        <Box
          sx={{
            position: "absolute",
            right: "20%",
            top: "28%",
            transform: "translateX(50%)",
            bgcolor: "rgba(255,255,255,0.95)",
            px: 1.5,
            py: 0.75,
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: (theme) => theme.palette.text.primary,
              whiteSpace: "nowrap"
            }}
          >
            {destinationLabel} – {eta.hours} hr {eta.minutes} mins remaining
          </Typography>
        </Box>

        {/* Floating luggage icon (bottom right) */}
        <IconButton
          onClick={handleLuggage}
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            bgcolor: "#03CD8C",
            color: "#FFFFFF",
            width: 48,
            height: 48,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(33,150,243,0.3)",
            "&:hover": {
              bgcolor: "#1976D2",
              boxShadow: "0 6px 16px rgba(33,150,243,0.4)"
            }
          }}
        >
          <LuggageRoundedIcon sx={{ fontSize: 24 }} />
        </IconButton>
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
                  color: "#03CD8C"
                }}
              >
                <ShareRoundedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>

            {/* Vehicle Details */}
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
                  fontSize: 13
                }}
              >
                Dual Motor AWD 100 kWh (670 Hp)
              </Typography>
            </Box>

            {/* Trip Progress Section */}
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

              {/* Progress bar */}
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
                      bgcolor: "#03CD8C"
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
                      color: "#03CD8C",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                    }}
                  />
                </Box>
              </Box>
              {/* Destination tag */}
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

            {/* Progress metrics */}
            <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", mb: 2 }}>
              <Box sx={{ textAlign: "center", flex: 1 }}>
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
              <Box sx={{ textAlign: "center", flex: 1 }}>
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
              <Box sx={{ textAlign: "center", flex: 1 }}>
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
                  Total Trip Time
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Driver Section */}
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
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "#03CD8C",
                    fontSize: 20,
                    fontWeight: 600
                  }}
                >
                  TS
                </Avatar>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, letterSpacing: "-0.01em", mb: 0.25 }}
                  >
                    Tim Smith
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <StarRoundedIcon sx={{ fontSize: 16, color: "#FFC107" }} />
                    <Typography
                      variant="caption"
                      sx={{ fontSize: 12, fontWeight: 600, color: (theme) => theme.palette.text.primary }}
                    >
                      4.8
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Button
                variant="outlined"
                onClick={handleRateDriver}
                sx={{
                  borderRadius: 999,
                  px: 2,
                  py: 0.75,
                  fontSize: 13,
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
                Rate Driver
              </Button>
            </Box>
            {/* User name display */}
            <Box
              sx={{
                mt: 1.5,
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

        {/* My Route Section */}
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
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 1.5,
                color: (theme) => theme.palette.text.primary
              }}
            >
              My Route
            </Typography>
            <Stack spacing={1.5}>
              {routeStops.map((stop, index) => (
                <Box key={index}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    {/* Timeline indicator */}
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 0.5 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: stop.completed ? "#22c55e" : "#E5E7EB",
                          border: stop.completed ? "2px solid #22c55e" : "2px solid #D1D5DB",
                          mb: 0.5
                        }}
                      />
                      {index < routeStops.length - 1 && (
                        <Box
                          sx={{
                            width: 2,
                            height: 40,
                            bgcolor: stop.completed ? "#22c55e" : "#E5E7EB"
                          }}
                        />
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: (theme) => theme.palette.text.primary,
                          mb: 0.25
                        }}
                      >
                        {stop.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: 11,
                          color: (theme) => theme.palette.text.secondary,
                          display: "block",
                          mb: 0.5
                        }}
                      >
                        {stop.type}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AccessTimeRoundedIcon sx={{ fontSize: 14, color: (theme) => theme.palette.text.secondary }} />
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: 11,
                            color: (theme) => theme.palette.text.secondary,
                            fontWeight: 500
                          }}
                        >
                          {stop.time}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
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

export default function RiderScreen27TripInProgressExpandedDetailsCanvas_v2() {
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
        <TripInProgressExpandedDetailsScreen />
      </MobileShell>
    </Box>
  );
}
