import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Chip,
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
import MapShell from "../components/maps/MapShell";
import ScreenScaffold from "../components/ScreenScaffold";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";

const TRIP_SIMULATION_DURATION_MS = 90_000;
const AUTO_ADD_STOP_TRIGGER_MS = 15_000;
const START_PROGRESS_PERCENT = 40;
const START_DISTANCE_KM = 22;

function formatElapsedDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => value.toString().padStart(2, "0")).join(":");
}

function formatRemainingDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function TripInProgressBasicScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { ride, actions } = useAppData();
  const activeTrip = ride.activeTrip;
  const temporaryStop = ride.temporaryStop;
  const safetyCheck = ride.safetyCheck;
  const [clockNowMs, setClockNowMs] = useState(() => Date.now());
  const [showContinueTripDialog, setShowContinueTripDialog] = useState(false);
  const [hasAutoSimulatedStopRequest, setHasAutoSimulatedStopRequest] = useState(false);
  const totalDistance = 54;
  const totalFare = activeTrip?.fareEstimate ?? "UGX 20,565";
  const totalFareDisplay = totalFare.trim().toUpperCase().startsWith("UGX ") ? totalFare : `UGX ${totalFare}`;
  const isTripPaused = temporaryStop?.timerPaused || activeTrip?.status === "paused_at_stop";
  const isAddStopRequested = temporaryStop?.status === "add_stop_requested";

  useEffect(() => {
    if (!activeTrip?.startedAt) {
      actions.updateRideTrip({ startedAt: new Date().toISOString() });
      return;
    }
    if (activeTrip.status === "paused_at_stop" || activeTrip.status === "add_stop_requested") {
      return;
    }
    if (activeTrip.status !== "ongoing") {
      actions.setRideStatus("ongoing");
    }
  }, [actions, activeTrip?.startedAt, activeTrip?.status]);

  useEffect(() => {
    if (isTripPaused) return undefined;
    const interval = window.setInterval(() => {
      setClockNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isTripPaused]);

  useEffect(() => {
    setHasAutoSimulatedStopRequest(false);
  }, [activeTrip?.id]);

  useEffect(() => {
    setClockNowMs(Date.now());
  }, [isTripPaused, temporaryStop?.totalPausedDurationMs, activeTrip?.startedAt]);

  const tripStartMs = useMemo(() => {
    if (!activeTrip?.startedAt) return clockNowMs;
    const parsed = new Date(activeTrip.startedAt).getTime();
    return Number.isFinite(parsed) ? parsed : clockNowMs;
  }, [activeTrip?.startedAt, clockNowMs]);

  const tripElapsedMs = useMemo(() => {
    const pausedTotalMs = temporaryStop?.totalPausedDurationMs ?? 0;
    if (isTripPaused && temporaryStop?.pauseStartedAt) {
      const pauseStartMs = new Date(temporaryStop.pauseStartedAt).getTime();
      if (Number.isFinite(pauseStartMs)) {
        return Math.max(0, pauseStartMs - tripStartMs - pausedTotalMs);
      }
    }
    return Math.max(0, clockNowMs - tripStartMs - pausedTotalMs);
  }, [clockNowMs, isTripPaused, temporaryStop?.pauseStartedAt, temporaryStop?.totalPausedDurationMs, tripStartMs]);

  const tripElapsedLabel = formatElapsedDuration(tripElapsedMs);
  const simProgressRatio = Math.min(1, tripElapsedMs / TRIP_SIMULATION_DURATION_MS);
  const progress = START_PROGRESS_PERCENT + simProgressRatio * (100 - START_PROGRESS_PERCENT);
  const distanceCovered = START_DISTANCE_KM + simProgressRatio * (totalDistance - START_DISTANCE_KM);
  const remainingSimulationMs = Math.max(0, TRIP_SIMULATION_DURATION_MS - tripElapsedMs);
  const remainingSimulationLabel = formatRemainingDuration(remainingSimulationMs);

  useEffect(() => {
    if (!activeTrip?.id) return;
    if (hasAutoSimulatedStopRequest) return;
    if (temporaryStop?.status !== "idle") return;
    if (tripElapsedMs < AUTO_ADD_STOP_TRIGGER_MS) return;
    actions.simulateDriverAddStopRequest("Your driver has requested to add a temporary stop.");
    setHasAutoSimulatedStopRequest(true);
  }, [actions, activeTrip?.id, hasAutoSimulatedStopRequest, temporaryStop?.status, tripElapsedMs]);

  useEffect(() => {
    if (!activeTrip?.id) return;
    if (isTripPaused || isAddStopRequested) return;
    if (tripElapsedMs < TRIP_SIMULATION_DURATION_MS) return;
    navigate("/rides/trip/completed", {
      replace: true,
      state: {
        duration: "1 min 30 sec",
        estimatedTime: "1 min 30 sec",
        totalFare: totalFareDisplay,
        fare: totalFareDisplay,
        distance: `${totalDistance} km`
      }
    });
  }, [activeTrip?.id, isAddStopRequested, isTripPaused, navigate, totalDistance, totalFareDisplay, tripElapsedMs]);

  useEffect(() => {
    if (!isTripPaused) {
      setShowContinueTripDialog(false);
      return undefined;
    }
    const dueAt = temporaryStop?.continuePromptDueAt;
    if (!dueAt || temporaryStop?.continuePromptShownAt) return undefined;

    const dueMs = new Date(dueAt).getTime();
    if (!Number.isFinite(dueMs)) return undefined;

    const timeoutId = window.setTimeout(() => {
      setShowContinueTripDialog(true);
      actions.markTemporaryStopContinuePromptShown();
    }, Math.max(0, dueMs - Date.now()));

    return () => window.clearTimeout(timeoutId);
  }, [
    actions,
    isTripPaused,
    temporaryStop?.continuePromptDueAt,
    temporaryStop?.continuePromptShownAt
  ]);

  const handleRating = () => {
    navigate("/rides/rating");
  };

  const handleShare = () => {
    navigate("/rides/trip/share");
  };

  const handleMapRecenter = () => undefined;

  const handleContinueTrip = () => {
    actions.resumeTripAfterTemporaryStop();
    setShowContinueTripDialog(false);
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
          preset="full"
          sx={{ height: { xs: "56dvh", md: "60vh" } }}
          showControls={false}
          canvasSx={{ background: uiTokens.map.canvasEmphasis }}
          onRecenter={handleMapRecenter}
        >
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

        {/* Vehicle icon moving along route with white circle below */}
        <Box
          sx={{
            position: "absolute",
            left: `${18 + (progress / 100) * 64}%`,
            bottom: `${25 - (progress / 100) * 47}%`,
            transform: "translate(-50%, 50%)",
            animation: isTripPaused ? "none" : "moveCar 2s ease-in-out infinite",
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
        {isTripPaused && (
          <Box
            sx={{
              mt: 1.25,
              p: 1.5,
              borderRadius: uiTokens.radius.sm,
              bgcolor: "#FEF3C7",
              border: "1px solid #F59E0B"
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <Chip
                size="small"
                label="Paused at stop"
                sx={{ bgcolor: "#F59E0B", color: "#FFFFFF", fontWeight: 700 }}
              />
            </Stack>
            <Typography variant="body2" sx={{ fontSize: 13, color: "#78350F", mb: 1 }}>
              Trip paused at stop. Waiting for the driver to continue the ride.
            </Typography>
          </Box>
        )}
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
                  Estimated remaining trip simulation time: {remainingSimulationLabel}
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
                  Trip Timer
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                  {tripElapsedLabel}
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
                  {totalFareDisplay}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: (theme) => theme.palette.text.secondary }}>
                Payment will be available after trip completion.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Add Stop Request Dialog */}
      <Dialog open={isAddStopRequested} PaperProps={{ sx: { borderRadius: uiTokens.radius.lg, p: 1 } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PauseCircleIcon sx={{ color: "#F59E0B" }} />
          <Typography variant="h6" fontWeight="bold">Driver requested a stop</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            {temporaryStop?.requestNote ||
              "Your driver has requested to add a temporary stop. If you confirm, your trip timer will pause until you continue the trip."}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            If you confirm, your timer and trip progress will pause immediately.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => actions.respondToTemporaryStopRequest("decline")}
            sx={{ color: "#B45309", textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => actions.respondToTemporaryStopRequest("confirm")}
            variant="contained"
            sx={{ borderRadius: uiTokens.radius.xl, textTransform: "none", bgcolor: "#22c55e", "&:hover": { bgcolor: "#16A34A" } }}
          >
            Confirm stop
          </Button>
        </DialogActions>
      </Dialog>

      {/* Continue Trip Request Dialog */}
      <Dialog
        open={showContinueTripDialog && isTripPaused}
        onClose={() => setShowContinueTripDialog(false)}
        PaperProps={{ sx: { borderRadius: uiTokens.radius.lg, p: 1 } }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">Driver requested to continue trip</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>Your driver is ready to continue the trip. Do you want to continue now?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowContinueTripDialog(false)} sx={{ color: "#B45309", textTransform: "none" }}>
            Not continuing
          </Button>
          <Button
            onClick={handleContinueTrip}
            variant="contained"
            sx={{ borderRadius: uiTokens.radius.xl, textTransform: "none", bgcolor: "#22c55e", "&:hover": { bgcolor: "#16A34A" } }}
          >
            Continue trip
          </Button>
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
