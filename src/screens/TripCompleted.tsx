import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

function TripCompletedArrivalSummaryScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Trip data - would come from backend/API
  // Display summary using final trip data (total distance, time, fare) from backend trip logs
  // Ensure accurate synchronization before payment prompt
  const totalDistance = 54;
  const distanceCovered = 54; // Full distance covered - matches total distance
  const totalTime = "2 hr 20 mins";
  const totalFare = "20,565";
  const destination = "Ndeeba town";
  const departurePoint = "Entebbe International Airport";
  const departureTime = "12:10 PM";
  const driverName = "Tim Smith";
  const driverRating = 4.8;
  const progress = 100; // Trip completed - 100%
  
  // Status Update Logic:
  // Trip status should automatically update to Completed once arrival is detected via GPS
  // Trigger arrival message and progress bar to 100%
  // Map State: Disable further route animation upon trip completion
  // Center map around final destination marker

  const handleShare = () => {
    console.log("Share trip completion details");
    // In production: Share trip completion info
    if (navigator.share) {
      navigator.share({
        title: "Trip Completed",
        text: `Completed trip from ${departurePoint} to ${destination}`,
        url: window.location.href
      }).catch(console.error);
    }
  };

  const handleRateDriver = () => {
    // Opens modal or full screen for feedback (stars + comments)
    // Post submission, disable or replace with "Thank You" message
    navigate("/rides/rating/driver", {
      state: {
        tripCompleted: true,
        driverName: driverName,
        driverRating: driverRating
      }
    });
  };

  const handlePayNow = () => {
    // Connects to payment API (supports multiple methods: card, wallet, cash confirmation)
    // On successful payment, mark trip as Paid in backend
    navigate("/rides/payment", {
      state: {
        tripCompleted: true,
        totalFare: totalFare,
        tripId: "trip_123" // Would come from backend
      }
    });
  };

  const handleLuggage = () => {
    console.log("Open trip summary/luggage details");
    // In production: Open trip details, luggage, or booking summary
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
              ? "#F5F5F5"
              : "linear-gradient(135deg, rgba(15,23,42,0.3), #020617 60%, #020617 100%)",
          overflow: "hidden"
        }}
      >
        {/* Grid overlay */}
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

        {/* Back Button - Top left */}
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
            position: "absolute",
            top: 16,
            left: 16,
            bgcolor: "rgba(3,205,140,0.15)",
            color: "#03CD8C",
            width: 40,
            height: 40,
            "&:hover": {
              bgcolor: "#93C5FD"
            },
            zIndex: 10
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>

        {/* Route line - showing completed journey path (from bottom-left to center) */}
        <Box
          sx={{
            position: "absolute",
            left: "15%",
            bottom: "20%",
            width: "35%",
            height: 4,
            bgcolor: "#1E3A5F",
            borderRadius: 2,
            transform: "rotate(-40deg)",
            transformOrigin: "left center",
            opacity: 0.6,
            zIndex: 2
          }}
        />

        {/* Destination marker (orange) - centered at destination */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 20,
            height: 20,
            borderRadius: "50%",
            bgcolor: "#F59E0B",
            border: "3px solid white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            zIndex: 5
          }}
        />

        {/* Vehicle icon at destination - centered and positioned above marker */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 6,
            mt: -4
          }}
        >
          <DirectionsCarFilledRoundedIcon
            sx={{
              fontSize: 36,
              color: "#03CD8C",
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))"
            }}
          />
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              bgcolor: "#FFFFFF",
              mt: 0.5,
              boxShadow: "0 2px 6px rgba(0,0,0,0.25)"
            }}
          />
        </Box>

        {/* Floating Luggage Icon - for trip summary or additional options */}
        <IconButton
          onClick={handleLuggage}
          sx={{
            position: "absolute",
            right: 14,
            top: "30%",
            bgcolor: "rgba(3,205,140,0.15)",
            color: "#03CD8C",
            width: 52,
            height: 52,
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            "&:hover": {
              bgcolor: "#93C5FD",
              transform: "scale(1.08)",
              transition: "transform 0.2s ease",
              boxShadow: "0 6px 16px rgba(0,0,0,0.3)"
            },
            zIndex: 10
          }}
        >
          <LuggageRoundedIcon sx={{ fontSize: 26 }} />
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

            {/* Trip Status Section - Green banner */}
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                borderRadius: 2,
                bgcolor: "#22c55e",
                background: "linear-gradient(135deg, #22c55e 0%, #16A34A 100%)"
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: "#FFFFFF",
                  mb: 0.5,
                  fontSize: 15
                }}
              >
                Arrive at Destination
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.95)",
                  fontSize: 12,
                  mb: 1.5
                }}
              >
                You've arrived at your destination... Thank you for riding with us!
              </Typography>

              {/* Progress bar - Full completion (100%) */}
              <Box sx={{ position: "relative", mb: 0.5 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 10,
                    borderRadius: 999,
                    bgcolor: "rgba(255,255,255,0.3)",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 999,
                      bgcolor: "#FFFFFF",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                    }
                  }}
                />
                {/* Car icon at end of progress bar (100%) */}
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
                      fontSize: 22,
                      color: "#FFFFFF",
                      filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))"
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
                  fontWeight: 600
                }}
              >
                {destination}
              </Typography>
            </Box>

            {/* Journey Metrics - displayed below progress bar */}
            <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
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
                  {distanceCovered} Km
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
                  Total Time
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

        {/* Driver Information Section */}
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
                    {driverName}
            </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <StarRoundedIcon sx={{ fontSize: 16, color: "#FFC107" }} />
            <Typography
              variant="caption"
                      sx={{ fontSize: 12, fontWeight: 600, color: (theme) => theme.palette.text.primary }}
            >
                      {driverRating}
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
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: (theme) => theme.palette.text.primary
                }}
              >
                My Route
              </Typography>
        <Button
                size="small"
                startIcon={<AddRoundedIcon sx={{ fontSize: 16 }} />}
          sx={{
            borderRadius: 999,
                  px: 1.5,
                  py: 0.5,
                  fontSize: 11,
                  fontWeight: 500,
            textTransform: "none",
                  color: "#03CD8C",
            "&:hover": {
                    bgcolor: "rgba(33,150,243,0.1)"
                  }
                }}
              >
                Add Stop
              </Button>
            </Box>

            {/* Departure Point */}
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1.5 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mt: 0.5
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: "#22c55e",
                    border: "2px solid white",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                  }}
                />
                <Box
                  sx={{
                    width: 2,
                    height: 40,
                    bgcolor: (theme) =>
                      theme.palette.mode === "light" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)",
                    mt: 0.5
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    mb: 0.25,
                    color: (theme) => theme.palette.text.primary
                  }}
                >
                  {departurePoint}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AccessTimeRoundedIcon
                    sx={{ fontSize: 14, color: (theme) => theme.palette.text.secondary }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 11,
                      color: (theme) => theme.palette.text.secondary
          }}
        >
                    Departure at {departureTime}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Destination Point */}
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mt: 0.5
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: "#F59E0B",
                    border: "2px solid white",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    mb: 0.25,
                    color: (theme) => theme.palette.text.primary
                  }}
                >
                  {destination}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 11,
                    color: (theme) => theme.palette.text.secondary
                  }}
                >
                  Destination
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Payment Section */}
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

export default function RiderScreen29TripCompletedArrivalSummaryCanvas_v2() {
      return (
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (theme) => theme.palette.background.default
        }}
      >

          <TripCompletedArrivalSummaryScreen />
        
      </Box>
  );
}
