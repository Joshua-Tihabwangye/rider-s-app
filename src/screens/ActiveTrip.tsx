import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import AlertTriangleIcon from "@mui/icons-material/WarningRounded";
import PauseCircleIcon from "@mui/icons-material/PauseCircleRounded";


import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import BeachAccessRoundedIcon from "@mui/icons-material/BeachAccessRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import MapShell from "../components/maps/MapShell";
import ScreenScaffold from "../components/ScreenScaffold";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";

function TripInProgressBasicScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { ride, actions } = useAppData();
  const activeTrip = ride.activeTrip;
  const temporaryStop = ride.temporaryStop;
  const safetyCheck = ride.safetyCheck;
  const [progress, setProgress] = useState(40); // 40% of trip completed
  const [eta, setEta] = useState({ hours: 1, minutes: 20 });
  const [distanceCovered, setDistanceCovered] = useState(22);
  const totalDistance = 54;
  const totalTime = "2 hr 20 mins";
  const totalFare = activeTrip?.fareEstimate ?? "UGX 20,565";

  // Simulate trip progress
  useEffect(() => {
    actions.setRideStatus("in_progress");
    const interval = setInterval(() => {
      if (temporaryStop?.status === "temporarily_stopped") return;
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
  }, [actions.setRideStatus]);

  const handleRating = () => {
    navigate("/rides/rating");
  };

  const handleShare = () => {
    navigate("/rides/trip/share");
  };

  const handlePayNow = () => {
    // Navigate to payment method selection for trip payment simulation
    navigate("/rides/payment", {
      state: {
        from: "/rides/trip",
        fare: totalFare,
        tripId: activeTrip?.id
      }
    });
  };

  const handleMapRecenter = () => {
    setProgress(40);
    setEta({ hours: 1, minutes: 20 });
  };

  const topMapBleedSx = {
    position: "relative",
    width: {
      xs: "calc(100% + (var(--rider-shell-content-px-xs, 20px) * 2))",
      md: "calc(100% + (var(--rider-shell-content-px-md, 24px) * 2))"
    },
    ml: {
      xs: "calc(var(--rider-shell-content-px-xs, 20px) * -1)",
      md: "calc(var(--rider-shell-content-px-md, 24px) * -1)"
    },
    mr: {
      xs: "calc(var(--rider-shell-content-px-xs, 20px) * -1)",
      md: "calc(var(--rider-shell-content-px-md, 24px) * -1)"
    },
    overflow: "hidden"
  } as const;

  return (
    <ScreenScaffold disableTopPadding>
      <Box sx={topMapBleedSx}>
        <MapShell
          onBack={() => navigate(-1)}
          showBackButton
          preset="full"
          sx={{ height: { xs: "56dvh", md: "60vh" } }}
          canvasSx={{ background: uiTokens.map.canvasEmphasis }}
          onRecenter={handleMapRecenter}
        >
          <IconButton
            size="small"
            onClick={() => navigate(-1)}
            sx={{
              position: "absolute",
              top: 14,
              left: 14,
              zIndex: 10,
              bgcolor: "rgba(255,255,255,0.9)",
              color: "#0f172a",
              "&:hover": { bgcolor: "#fff" },
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              width: 40,
              height: 40
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>

          {/* SOS Button over Map */}
          <Button
            size="small"
            variant="contained"
            onClick={() => navigate("/rides/sos")}
            sx={{
              position: "absolute",
              top: 14,
              right: 14,
              zIndex: 10,
              minWidth: "auto",
              px: 1.4,
              py: 0.4,
              borderRadius: 5,
              bgcolor: "var(--evz-danger)",
              color: "#fff",
              textTransform: "none",
              fontSize: 11,
              fontWeight: 700,
              "&:hover": { bgcolor: "var(--evz-danger-hover)" }
            }}
          >
            SOS
          </Button>

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
            borderRadius: uiTokens.radius.sm,
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

        </MapShell>
      </Box>
      <Box sx={{ pt: 2, pb: 1, px: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--evz-text-main, #0f172a)' }}>
          Active Trip
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {activeTrip?.routeSummary ?? "Trip in progress"}
          </Typography>
          <Button
            size="small"
            variant="contained"
            onClick={() => navigate("/rides/sos")}
            sx={{ bgcolor: 'var(--evz-danger)', color: '#fff', px: 2, borderRadius: 2 }}
          >
            SOS
          </Button>
        </Box>
      </Box>


      {/* Trip Info Section (Bottom Card) */}
      <Box sx={{ px: uiTokens.spacing.xl, pt: uiTokens.spacing.lg, pb: uiTokens.spacing.lg }}>
        <Card
          elevation={0}
          sx={{
            mb: uiTokens.spacing.lg,
            borderRadius: uiTokens.radius.sm,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
            border: (theme) =>
              theme.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)"
          }}
        >
          <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.md }}>
            {/* Header with Rating and Share icons */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: uiTokens.spacing.lg }}>
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
                mb: uiTokens.spacing.lg,
                p: uiTokens.spacing.md,
                borderRadius: uiTokens.radius.sm,
                bgcolor: "#DCFCE7" // Light green background
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#22c55e",
                  mb: uiTokens.spacing.xxs,
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
                  mb: uiTokens.spacing.md
                }}
              >
                You will reach your destination in {eta.hours} hr and {eta.minutes} mins.
              </Typography>

              {/* Progress bar with car icon */}
              <Box sx={{ position: "relative", mb: uiTokens.spacing.xxs }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 8,
                    borderRadius: uiTokens.radius.xl,
                    bgcolor: (theme) =>
                      theme.palette.mode === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: uiTokens.radius.xl,
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
            <Stack spacing={uiTokens.spacing.md}>
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
            mb: uiTokens.spacing.lg,
            borderRadius: uiTokens.radius.sm,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
            border: (theme) =>
              theme.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)"
          }}
        >
          <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.md }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: (theme) => theme.palette.text.secondary, fontSize: 11, display: "block", mb: uiTokens.spacing.xxs }}
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
                  borderRadius: uiTokens.radius.xl,
                  px: uiTokens.spacing.xl,
                  py: uiTokens.spacing.sm,
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

      {/* Temporary Stop Confirmation Dialog */}
      <Dialog open={temporaryStop?.status === "stop_requested"} PaperProps={{ sx: { borderRadius: uiTokens.radius.lg, p: 1 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#F00' }}>
          <PauseCircleIcon sx={{ color: '#F59E0B' }}/>
          <Typography variant="h6" fontWeight="bold">Temporary Stop Requested</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>{temporaryStop?.requestNote || "Your driver has requested a brief stop."}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
             Trip timer will be paused automatically if you accept.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => actions.respondToTemporaryStopRequest('decline')} color="inherit">Decline</Button>
          <Button onClick={() => actions.respondToTemporaryStopRequest('confirm')} variant="contained" color="warning" sx={{ borderRadius: uiTokens.radius.xl }}>Confirm Stop</Button>
        </DialogActions>
      </Dialog>
      
      {/* Safety Check Dialog */}
      <Dialog open={safetyCheck?.status === "safety_check_pending"} PaperProps={{ sx: { borderRadius: uiTokens.radius.lg, p: 1 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AlertTriangleIcon sx={{ color: 'var(--evz-danger)' }}/>
          <Typography variant="h6" fontWeight="bold">Are you okay?</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>The vehicle has been stationary for over 20 minutes.</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please confirm your safety. Do you need emergency assistance?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
              actions.respondToSafetyCheck('sos');
              navigate('/rides/sos');
          }} variant="outlined" color="error" sx={{ color: 'var(--evz-danger)', borderColor: 'var(--evz-danger)', borderRadius: uiTokens.radius.xl }}>Help / SOS</Button>
          <Button onClick={() => actions.respondToSafetyCheck('okay')} variant="contained" sx={{ bgcolor: '#22c55e', '&:hover': { bgcolor: '#16A34A' }, borderRadius: uiTokens.radius.xl }}>I'm Okay</Button>
        </DialogActions>
      </Dialog>

    </ScreenScaffold>
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

        <TripInProgressBasicScreen />
      
    </Box>
  );
}
