import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import ExpandableMapPanel from "../components/maps/ExpandableMapPanel";
import ScreenScaffold from "../components/ScreenScaffold";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";
import { getPointAtProgress, normalizeRoute } from "../utils/mapRoutes";

const TRIP_SIMULATION_DURATION_MS = 90_000;
const AUTO_ADD_STOP_TRIGGER_MS = 15_000;
const AUTO_CONTINUE_REQUEST_TRIGGER_MS = 10_000;
const START_PROGRESS_PERCENT = 40;
const START_DISTANCE_KM = 22;
const SIMULATION_MS_PER_LEG_MIN = 4_500;

function normalizeLegDuration(etaMinutes?: number): number {
  return Math.max(3, Math.round(etaMinutes ?? 6));
}

function areLegsEquivalent(
  current:
    | Array<{ id: string; status: string; startedAt?: string; completedAt?: string }>
    | undefined,
  next:
    | Array<{ id: string; status: string; startedAt?: string; completedAt?: string }>
    | undefined
): boolean {
  if (!current && !next) return true;
  if (!current || !next) return false;
  if (current.length !== next.length) return false;
  return current.every((leg, index) => {
    const target = next[index];
    return (
      leg.id === target.id &&
      leg.status === target.status &&
      leg.startedAt === target.startedAt &&
      leg.completedAt === target.completedAt
    );
  });
}

function parseDistanceKm(value?: string): number {
  const parsed = Number.parseFloat((value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseCurrencyAmount(value?: string): number {
  const parsed = Number.parseFloat((value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrencyUGX(amount: number): string {
  return `UGX ${Math.max(0, Math.round(amount)).toLocaleString()}`;
}

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
  const location = useLocation();
  const { ride, sharedLocationState, actions } = useAppData();
  const {
    markTemporaryStopContinuePromptShown,
    resumeTripAfterTemporaryStop,
    setActiveTrip,
    setRideStatus,
    simulateDriverAddStopRequest,
    updateRideTrip,
    updateSharedLocationState
  } = actions;
  const activeTrip = ride.activeTrip;
  const isFromDriverVerification = Boolean(
    (location.state as { fromDriverVerification?: boolean } | null)?.fromDriverVerification
  );
  const temporaryStop = ride.temporaryStop;
  const safetyCheck = ride.safetyCheck;
  const isSafetyCheckPending = safetyCheck?.status === "safety_check_pending";
  const [clockNowMs, setClockNowMs] = useState(() => Date.now());
  const [showContinueTripDialog, setShowContinueTripDialog] = useState(false);
  const [hasAutoSimulatedStopRequest, setHasAutoSimulatedStopRequest] = useState(false);
  const [driverProgress, setDriverProgress] = useState(0);
  const hasHandledReloadResetRef = useRef(false);
  const continueRequestRetryTimerRef = useRef<number | null>(null);
  const addStopRequestRetryTimerRef = useRef<number | null>(null);
  const routePolyline = normalizeRoute(sharedLocationState.routePolyline);
  const isTripPaused =
    temporaryStop?.status === "paused_at_stop";
  const isAddStopRequested =
    temporaryStop?.status === "add_stop_requested";
  const totalDistance =
    sharedLocationState.routeDistanceKm ??
    parseDistanceKm(activeTrip?.distance) ??
    START_DISTANCE_KM;
  const estimatedFareAmount = useMemo(() => {
    const currentFareAmount = parseCurrencyAmount(activeTrip?.fareEstimate);
    if (currentFareAmount > 0) {
      return currentFareAmount;
    }

    const baseFare = 8000;
    const distanceComponent = Math.max(0, totalDistance) * 2600;
    const roundTripSurcharge = activeTrip?.tripMode === "round_trip" ? 5000 : 0;
    const extraStopCount = Math.max(0, (activeTrip?.routePoints?.length ?? 0) - 2);
    const stopSurcharge = extraStopCount * 3500;
    return baseFare + distanceComponent + roundTripSurcharge + stopSurcharge;
  }, [activeTrip?.fareEstimate, activeTrip?.routePoints?.length, activeTrip?.tripMode, totalDistance]);
  const totalFareDisplay = formatCurrencyUGX(estimatedFareAmount);

  useEffect(() => {
    if (!import.meta.env.DEV || typeof window === "undefined") {
      return;
    }
    if (hasHandledReloadResetRef.current) {
      return;
    }
    // Preserve active trip state when we have an actual trip context,
    // especially when entering from Driver Arrived -> Start trip.
    if (
      isFromDriverVerification ||
      Boolean(activeTrip?.startedAt) ||
      activeTrip?.status === "in_progress" ||
      activeTrip?.status === "ongoing"
    ) {
      return;
    }
    const navigationEntries = window.performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    const isReloadNavigation =
      navigationEntries[0]?.type === "reload" ||
      ((window.performance as Performance & { navigation?: { type?: number } }).navigation?.type === 1);
    if (!isReloadNavigation) {
      return;
    }
    hasHandledReloadResetRef.current = true;

    setActiveTrip(null);
    updateSharedLocationState({
      driverLocation: null,
      routePolyline: [],
      routeAlternativePolylines: [],
      routeDistanceKm: null,
      routeDurationMin: null
    });
    setRideStatus("idle");
    navigate("/rides/enter/details", { replace: true, state: { resetFromRefresh: true } });
  }, [
    activeTrip?.startedAt,
    activeTrip?.status,
    isFromDriverVerification,
    navigate,
    setActiveTrip,
    setRideStatus,
    updateSharedLocationState
  ]);
  const tripLegs = activeTrip?.legs ?? [];
  const legDurationWeight = useMemo(
    () => tripLegs.reduce((sum, leg) => sum + normalizeLegDuration(leg.etaMinutes), 0),
    [tripLegs]
  );
  const tripSimulationDurationMs = useMemo(() => {
    if (tripLegs.length === 0) return TRIP_SIMULATION_DURATION_MS;
    const dynamicDuration = legDurationWeight * SIMULATION_MS_PER_LEG_MIN;
    return Math.max(TRIP_SIMULATION_DURATION_MS, dynamicDuration);
  }, [legDurationWeight, tripLegs.length]);
  const compactRouteLabel = useMemo(() => {
    const distance = sharedLocationState.routeDistanceKm;
    const duration = sharedLocationState.routeDurationMin;
    if (!distance || !duration) return null;
    const distanceLabel =
      distance >= 100
        ? `${Math.round(distance)} km`
        : distance >= 10
          ? `${distance.toFixed(1)} km`
          : `${distance.toFixed(2)} km`;
    const durationLabel =
      duration < 60
        ? `${Math.max(1, Math.round(duration))} min`
        : `${Math.floor(duration / 60)} hr ${Math.round(duration % 60)} min`;
    return `${distanceLabel} • ${durationLabel}`;
  }, [sharedLocationState.routeDistanceKm, sharedLocationState.routeDurationMin]);
  const companyOrange = "#F79009";

  // Calculate driver location along the route
  const driverLocation = React.useMemo(() => {
    return getPointAtProgress(
      routePolyline,
      driverProgress,
      sharedLocationState.pickupCoords ?? null,
      sharedLocationState.destinationCoords ?? null
    );
  }, [driverProgress, routePolyline, sharedLocationState.destinationCoords, sharedLocationState.pickupCoords]);

  useEffect(() => {
    if (!activeTrip) {
      return;
    }
    if (!activeTrip.startedAt) {
      updateRideTrip({ startedAt: new Date().toISOString() });
      return;
    }
    if (activeTrip.status === "paused_at_stop" || activeTrip.status === "add_stop_requested") {
      return;
    }
    if (activeTrip.status !== "ongoing") {
      setRideStatus("ongoing");
    }
  }, [activeTrip?.startedAt, activeTrip?.status, setRideStatus, updateRideTrip]);

  useEffect(() => {
    if (isTripPaused) return undefined;
    const interval = window.setInterval(() => {
      setClockNowMs(Date.now());
      // Simulate driver movement along route (1% progress per second)
      setDriverProgress((prev) => Math.min(prev + 0.01, 1.0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isTripPaused]);

  useEffect(() => {
    const nextDriver = driverLocation;
    const nextRider = driverLocation ?? sharedLocationState.pickupCoords ?? null;
    const prevDriver = sharedLocationState.driverLocation ?? null;
    const prevRider = sharedLocationState.riderLocation ?? null;
    const sameDriver =
      (!prevDriver && !nextDriver) ||
      (prevDriver &&
        nextDriver &&
        prevDriver.lat === nextDriver.lat &&
        prevDriver.lng === nextDriver.lng);
    const sameRider =
      (!prevRider && !nextRider) ||
      (prevRider &&
        nextRider &&
        prevRider.lat === nextRider.lat &&
        prevRider.lng === nextRider.lng);
    if (sameDriver && sameRider) {
      return;
    }
    updateSharedLocationState({
      driverLocation: nextDriver,
      riderLocation: nextRider
    });
  }, [
    driverLocation,
    sharedLocationState.driverLocation,
    sharedLocationState.pickupCoords,
    sharedLocationState.riderLocation,
    updateSharedLocationState
  ]);

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
  const simProgressRatio = Math.min(1, tripElapsedMs / tripSimulationDurationMs);
  const legProgress = useMemo(() => {
    if (tripLegs.length === 0) {
      return {
        activeLegIndex: 0,
        activeLegRatio: simProgressRatio,
        completedLegCount: simProgressRatio >= 1 ? 1 : 0
      };
    }
    const targetWeight = legDurationWeight * simProgressRatio;
    let cumulativeWeight = 0;
    let completedLegCount = 0;
    let activeLegIndex = tripLegs.length - 1;
    let activeLegRatio = simProgressRatio >= 1 ? 1 : 0;

    for (let index = 0; index < tripLegs.length; index += 1) {
      const legWeight = normalizeLegDuration(tripLegs[index]?.etaMinutes);
      const legStartWeight = cumulativeWeight;
      const legEndWeight = cumulativeWeight + legWeight;
      if (targetWeight >= legEndWeight) {
        completedLegCount += 1;
        cumulativeWeight = legEndWeight;
        activeLegIndex = Math.min(index + 1, tripLegs.length - 1);
        activeLegRatio = 0;
        continue;
      }
      activeLegIndex = index;
      activeLegRatio = Math.max(0, Math.min(1, (targetWeight - legStartWeight) / legWeight));
      break;
    }

    if (simProgressRatio >= 1) {
      completedLegCount = tripLegs.length;
      activeLegIndex = Math.max(0, tripLegs.length - 1);
      activeLegRatio = 1;
    }

    return {
      activeLegIndex,
      activeLegRatio,
      completedLegCount
    };
  }, [legDurationWeight, simProgressRatio, tripLegs]);
  const progress = START_PROGRESS_PERCENT + simProgressRatio * (100 - START_PROGRESS_PERCENT);
  const distanceCovered = useMemo(() => {
    if (tripLegs.length === 0) {
      return START_DISTANCE_KM + simProgressRatio * (totalDistance - START_DISTANCE_KM);
    }
    const completedDistance = tripLegs.reduce((sum, leg, index) => {
      if (index < legProgress.completedLegCount) {
        return sum + (leg.distanceKm ?? 0);
      }
      return sum;
    }, 0);
    const activeDistance = tripLegs[legProgress.activeLegIndex]?.distanceKm ?? 0;
    return completedDistance + activeDistance * legProgress.activeLegRatio;
  }, [legProgress.activeLegIndex, legProgress.activeLegRatio, legProgress.completedLegCount, simProgressRatio, totalDistance, tripLegs]);
  const remainingSimulationMs = Math.max(0, tripSimulationDurationMs - tripElapsedMs);
  const remainingSimulationLabel = formatRemainingDuration(remainingSimulationMs);
  const activeLeg = tripLegs[legProgress.activeLegIndex];

  useEffect(() => {
    if (!activeTrip?.id) return;
    if (hasAutoSimulatedStopRequest) return;
    if (temporaryStop?.status !== "idle") return;
    if (tripElapsedMs < AUTO_ADD_STOP_TRIGGER_MS) return;
    simulateDriverAddStopRequest("Your driver has requested to add a temporary stop.");
    setHasAutoSimulatedStopRequest(true);
  }, [
    activeTrip?.id,
    hasAutoSimulatedStopRequest,
    simulateDriverAddStopRequest,
    temporaryStop?.status,
    tripElapsedMs
  ]);

  useEffect(() => {
    if (!activeTrip?.id || tripLegs.length === 0) return;
    const nowIso = new Date().toISOString();
    const allCompleted = simProgressRatio >= 1;
    const nextLegs = tripLegs.map((leg, index) => {
      if (allCompleted || index < legProgress.completedLegCount) {
        return {
          ...leg,
          status: "completed" as const,
          startedAt: leg.startedAt ?? nowIso,
          completedAt: leg.completedAt ?? nowIso
        };
      }
      if (index === legProgress.activeLegIndex) {
        return {
          ...leg,
          status: "in_progress" as const,
          startedAt: leg.startedAt ?? nowIso,
          completedAt: undefined
        };
      }
      return {
        ...leg,
        status: "pending" as const,
        completedAt: undefined
      };
    });
    const nextCurrentLegIndex = allCompleted
      ? Math.max(0, tripLegs.length - 1)
      : legProgress.activeLegIndex;
    const nextRemainingLegs = allCompleted
      ? 0
      : Math.max(1, tripLegs.length - legProgress.completedLegCount);
    const currentLeg = nextLegs[nextCurrentLegIndex];
    const currentRouteSummary =
      currentLeg && !allCompleted
        ? `${currentLeg.from.label || currentLeg.from.address} → ${currentLeg.to.label || currentLeg.to.address} (${nextCurrentLegIndex + 1}/${tripLegs.length})`
        : activeTrip.routeSummary;

    const didLegsChange = !areLegsEquivalent(
      activeTrip.legs?.map((leg) => ({
        id: leg.id,
        status: leg.status,
        startedAt: leg.startedAt,
        completedAt: leg.completedAt
      })),
      nextLegs.map((leg) => ({
        id: leg.id,
        status: leg.status,
        startedAt: leg.startedAt,
        completedAt: leg.completedAt
      }))
    );

    if (
      !didLegsChange &&
      activeTrip.currentLegIndex === nextCurrentLegIndex &&
      activeTrip.remainingLegs === nextRemainingLegs &&
      activeTrip.isReturnLeg === Boolean(currentLeg?.isReturnLeg)
    ) {
      return;
    }

    updateRideTrip({
      legs: nextLegs,
      currentLegIndex: nextCurrentLegIndex,
      remainingLegs: nextRemainingLegs,
      isReturnLeg: Boolean(currentLeg?.isReturnLeg),
      routeSummary: currentRouteSummary
    });
  }, [
    activeTrip?.currentLegIndex,
    activeTrip?.id,
    activeTrip?.isReturnLeg,
    activeTrip?.legs,
    activeTrip?.remainingLegs,
    activeTrip?.routeSummary,
    legProgress.activeLegIndex,
    legProgress.completedLegCount,
    simProgressRatio,
    tripLegs,
    updateRideTrip
  ]);

  useEffect(() => {
    if (!activeTrip?.id) return;
    if (isTripPaused || isAddStopRequested) return;
    if (tripElapsedMs < tripSimulationDurationMs) return;
    updateRideTrip({
      status: "completed",
      completedAt: new Date().toISOString()
    });
    setRideStatus("completed");
    navigate("/rides/trip/completed", {
      replace: true,
      state: {
        duration: "1 min 30 sec",
        estimatedTime: "1 min 30 sec",
        totalFare: totalFareDisplay,
        fare: totalFareDisplay,
        distance: `${totalDistance.toFixed(1)} km`,
        stops: activeTrip?.routePoints ?? []
      }
    });
  }, [
    activeTrip?.id,
    activeTrip?.routePoints,
    isAddStopRequested,
    isTripPaused,
    navigate,
    setRideStatus,
    totalDistance,
    totalFareDisplay,
    tripElapsedMs,
    tripSimulationDurationMs,
    updateRideTrip
  ]);

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
      markTemporaryStopContinuePromptShown();
    }, Math.max(0, dueMs - Date.now()));

    return () => window.clearTimeout(timeoutId);
  }, [
    isTripPaused,
    markTemporaryStopContinuePromptShown,
    temporaryStop?.continuePromptDueAt,
    temporaryStop?.continuePromptShownAt
  ]);

  useEffect(() => {
    if (!isTripPaused) return undefined;
    if (temporaryStop?.continuePromptDueAt || temporaryStop?.continuePromptShownAt) {
      return undefined;
    }
    const pauseStartMs = temporaryStop?.pauseStartedAt
      ? new Date(temporaryStop.pauseStartedAt).getTime()
      : Number.NaN;
    if (!Number.isFinite(pauseStartMs)) return undefined;

    const timeoutId = window.setTimeout(() => {
      actions.simulateDriverContinueTripRequest(
        "Your driver has requested to continue the trip."
      );
    }, Math.max(0, pauseStartMs + AUTO_CONTINUE_REQUEST_TRIGGER_MS - Date.now()));

    return () => window.clearTimeout(timeoutId);
  }, [
    actions,
    isTripPaused,
    temporaryStop?.continuePromptDueAt,
    temporaryStop?.continuePromptShownAt,
    temporaryStop?.pauseStartedAt
  ]);

  useEffect(() => {
    return () => {
      if (continueRequestRetryTimerRef.current !== null) {
        window.clearTimeout(continueRequestRetryTimerRef.current);
      }
      if (addStopRequestRetryTimerRef.current !== null) {
        window.clearTimeout(addStopRequestRetryTimerRef.current);
      }
    };
  }, []);

  const handleRating = () => {
    navigate("/rides/rating");
  };

  const handleShare = () => {
    navigate("/rides/trip/share");
  };

  const handleMapRecenter = () => undefined;

  const handleContinueTrip = () => {
    if (continueRequestRetryTimerRef.current !== null) {
      window.clearTimeout(continueRequestRetryTimerRef.current);
      continueRequestRetryTimerRef.current = null;
    }
    resumeTripAfterTemporaryStop();
    setShowContinueTripDialog(false);
  };

  const handleEndTrip = () => {
    updateRideTrip({
      status: "completed",
      completedAt: new Date().toISOString()
    });
    setRideStatus("completed");
    navigate("/rides/trip/completed", {
      replace: true,
      state: {
        duration: "1 min 30 sec",
        estimatedTime: "1 min 30 sec",
        totalFare: totalFareDisplay,
        fare: totalFareDisplay,
        distance: `${totalDistance.toFixed(1)} km`,
        stops: activeTrip?.routePoints ?? []
      }
    });
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
      <ExpandableMapPanel
        containerSx={topMapBleedSx}
        mapHeight={{ xs: "56dvh", md: "60vh" }}
        expandedMapHeight={{ xs: "82dvh", md: "78vh" }}
        buttonOffsetCollapsed={8}
        buttonOffsetExpanded={14}
        detailsWrapperSx={{ mt: 0.75 }}
        map={
          <MapShell
            preset="full"
            sx={{ height: "100%" }}
            showControls={false}
            showRouteInfo={false}
            pickupLocation={sharedLocationState.pickupCoords}
            dropoffLocation={sharedLocationState.destinationCoords}
            driverLocation={driverLocation}
            riderLocation={driverLocation}
            routePolyline={routePolyline}
            routeAlternativePolylines={sharedLocationState.routeAlternativePolylines}
            routeDistanceKm={sharedLocationState.routeDistanceKm}
            routeDurationMin={sharedLocationState.routeDurationMin}
            canvasSx={{ background: uiTokens.map.canvasEmphasis }}
            onRecenter={handleMapRecenter}
          />
        }
        details={
          <Stack spacing={0.85}>
      {compactRouteLabel && (
        <Box sx={{ pt: 0.1, pb: 0.35, display: "flex", justifyContent: "flex-start" }}>
          <Box
            sx={{
              px: 1.2,
              py: 0.5,
              borderRadius: "999px",
              bgcolor: "#0B1530",
              border: `1px solid ${companyOrange}`,
              color: "#F8FAFC",
              fontWeight: 700,
              fontSize: 11
            }}
          >
            {compactRouteLabel}
          </Box>
        </Box>
      )}

      <Box sx={{ pt: 0.55, pb: 0.2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--evz-text-main, #0f172a)' }}>
          Active Trip
        </Typography>
        <Typography variant="caption" sx={{ color: "#B45309", fontWeight: 600, display: "block", mt: 0.2 }}>
          Green route tracking with orange safety checks.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {activeTrip?.routeSummary ??
              (activeLeg
                ? `${activeLeg.from.label || activeLeg.from.address} → ${activeLeg.to.label || activeLeg.to.address}`
                : routePolyline.length > 1
                  ? "Trip in progress"
                  : "Select pickup and destination first.")}
          </Typography>
          <Stack direction="row" spacing={1}>
            {temporaryStop?.status === "idle" && (
              <Button
                size="small"
                variant="outlined"
                onClick={() =>
                  simulateDriverAddStopRequest(
                    "Your driver has requested to add a temporary stop."
                  )
                }
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                Simulate add stop
              </Button>
            )}
          </Stack>
        </Box>
        {tripLegs.length > 1 && (
          <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.45, display: "block" }}>
            Leg {Math.min(tripLegs.length, legProgress.activeLegIndex + 1)} of {tripLegs.length}
            {activeLeg?.isReturnLeg ? " • Return leg" : ""}
          </Typography>
        )}
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
            <Typography variant="caption" sx={{ color: "#92400E", fontWeight: 600 }}>
              Continue request popup will appear in about 15 seconds.
            </Typography>
          </Box>
        )}
      </Box>


      {/* Trip Info Section (Bottom Card) */}
      <Box sx={{ pt: uiTokens.spacing.lg, pb: uiTokens.spacing.lg }}>
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
                  {tripLegs.length > 1 ? ` • ${Math.max(0, tripLegs.length - legProgress.completedLegCount)} legs left` : ""}
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
                  {totalDistance.toFixed(1)} Km total
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body2" sx={{ color: (theme) => theme.palette.text.secondary, fontSize: 13 }}>
                  Distance Covered
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                  {distanceCovered.toFixed(1)} Km completed
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
            bgcolor: uiTokens.surfaces.accentTintSoft,
            border: `1px solid ${uiTokens.colors.accent}`
          }}
        >
          <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.md }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "auto 1fr" },
                gap: 1.25,
                alignItems: "end"
              }}
            >
              <Box sx={{ minWidth: { sm: 190 } }}>
                <Typography
                  variant="caption"
                  sx={{ color: uiTokens.colors.accent, fontSize: 11, display: "block", mb: uiTokens.spacing.xxs }}
                >
                  Estimated Total Fare
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    color: uiTokens.colors.accent,
                    whiteSpace: "nowrap"
                  }}
                >
                  {totalFareDisplay}
                </Typography>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: (theme) => theme.palette.text.secondary,
                  justifySelf: { sm: "end" },
                  textAlign: { xs: "left", sm: "right" },
                  maxWidth: { sm: 250 }
                }}
              >
                Fare estimate is available during the trip and updates as the ride progresses.
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Button
          fullWidth
          variant="contained"
          onClick={handleEndTrip}
          sx={{
            borderRadius: uiTokens.radius.xl,
            py: 1.15,
            fontSize: 14,
            fontWeight: 700,
            textTransform: "none",
            bgcolor: "#16A34A",
            "&:hover": {
              bgcolor: "#15803D"
            }
          }}
        >
          End trip
        </Button>
      </Box>

          </Stack>
        }
      />

      {/* Add Stop Request Dialog */}
      <Dialog
        open={isAddStopRequested && !isSafetyCheckPending}
        onClose={() => undefined}
        disableEscapeKeyDown
        PaperProps={{ sx: { borderRadius: uiTokens.radius.lg, p: 1 } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PauseCircleIcon sx={{ color: "#F59E0B" }} />
          <Typography fontWeight="bold">Driver requested a stop</Typography>
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
            onClick={() => {
              actions.respondToTemporaryStopRequest("decline");
              if (addStopRequestRetryTimerRef.current !== null) {
                window.clearTimeout(addStopRequestRetryTimerRef.current);
              }
              addStopRequestRetryTimerRef.current = window.setTimeout(() => {
                addStopRequestRetryTimerRef.current = null;
                simulateDriverAddStopRequest(
                  "Your driver has requested to add a temporary stop."
                );
              }, 5000);
            }}
            sx={{ color: "#B45309", textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (addStopRequestRetryTimerRef.current !== null) {
                window.clearTimeout(addStopRequestRetryTimerRef.current);
                addStopRequestRetryTimerRef.current = null;
              }
              actions.respondToTemporaryStopRequest("confirm");
            }}
            variant="contained"
            sx={{ borderRadius: uiTokens.radius.xl, textTransform: "none", bgcolor: "#22c55e", "&:hover": { bgcolor: "#16A34A" } }}
          >
            Confirm stop
          </Button>
        </DialogActions>
      </Dialog>

      {/* Continue Trip Request Dialog */}
      <Dialog
        open={showContinueTripDialog && isTripPaused && !isSafetyCheckPending}
        onClose={() => undefined}
        disableEscapeKeyDown
        PaperProps={{ sx: { borderRadius: uiTokens.radius.lg, p: 1 } }}
      >
        <DialogTitle>
          <Typography fontWeight="bold">Driver requested to continue trip</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>Your driver is ready to continue the trip. Do you want to continue now?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowContinueTripDialog(false);
              if (continueRequestRetryTimerRef.current !== null) {
                window.clearTimeout(continueRequestRetryTimerRef.current);
              }
              continueRequestRetryTimerRef.current = window.setTimeout(() => {
                continueRequestRetryTimerRef.current = null;
                actions.simulateDriverContinueTripRequest(
                  "Your driver has requested to continue the trip."
                );
              }, 10000);
            }}
            sx={{ color: "#B45309", textTransform: "none" }}
          >
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

      {/* Safety Check Dialog - Highest priority, overrides other dialogs */}
      <Dialog open={isSafetyCheckPending} PaperProps={{ sx: { borderRadius: uiTokens.radius.lg, p: 1 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AlertTriangleIcon sx={{ color: 'var(--evz-danger)' }}/>
          <Typography fontWeight="bold">Are you okay?</Typography>
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

export default TripInProgressBasicScreen;
