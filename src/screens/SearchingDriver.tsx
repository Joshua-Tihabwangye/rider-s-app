import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography
} from "@mui/material";

import LocalTaxiRoundedIcon from "@mui/icons-material/LocalTaxiRounded";
import MapShell from "../components/maps/MapShell";
import ExpandableMapPanel from "../components/maps/ExpandableMapPanel";
import ScreenScaffold from "../components/ScreenScaffold";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";
import { isRiderBackendEnabled } from "../services/api/riderApi";
import { getApproachPoint, normalizeRoute } from "../utils/mapRoutes";

function SearchingForDriverScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { ride, sharedLocationState, actions } = useAppData();
  const { setRideStatus, updateSharedLocationState } = actions;
  const [dots, setDots] = useState(".");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const [driverProgress, setDriverProgress] = useState(0);
  const hasInitializedSearchStatusRef = React.useRef(false);
  const hasTransitionedToOnWayRef = React.useRef(false);
  const companyOrange = "#F79009";
  const tripWorkflow = ride.workflow.tripSimulation;
  const backendMode = isRiderBackendEnabled();

  // Phase 5.3 — pan map to rider's current GPS position on button tap
  const handleLocateMe = React.useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        updateSharedLocationState({ riderLocation: coords });
      },
      undefined,
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, [updateSharedLocationState]);
  const routeSummary = React.useMemo(() => {
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
  const routePolyline = normalizeRoute(sharedLocationState.routePolyline);
  const routeReady =
    (Boolean(sharedLocationState.pickupCoords) &&
      Boolean(sharedLocationState.destinationCoords)) ||
    Boolean(ride.activeTrip?.pickup && ride.activeTrip?.dropoff) ||
    Boolean(ride.request.origin && ride.request.destination);
  const bookedForLabel = React.useMemo(() => {
    const bookedFor = ride.activeTrip?.bookedFor ?? ride.request.bookedFor;
    if (!bookedFor || bookedFor.source === "self") return "For: You";
    const name = bookedFor.name?.trim() || "Booked rider";
    return `For: ${name}${bookedFor.phone ? ` (${bookedFor.phone})` : ""}`;
  }, [ride.activeTrip?.bookedFor, ride.request.bookedFor]);

  // Calculate driver location along the route
  const driverLocation = React.useMemo(() => {
    return getApproachPoint(routePolyline, driverProgress);
  }, [driverProgress, routePolyline]);

  useEffect(() => {
    if (hasInitializedSearchStatusRef.current) {
      return;
    }
    hasInitializedSearchStatusRef.current = true;
    setRideStatus("searching");
  }, [setRideStatus]);

  useEffect(() => {
    const previous = sharedLocationState.driverLocation;
    const next = driverLocation;
    if (
      (!previous && !next) ||
      (previous &&
        next &&
        previous.lat === next.lat &&
        previous.lng === next.lng)
    ) {
      return;
    }
    updateSharedLocationState({ driverLocation });
  }, [driverLocation, sharedLocationState.driverLocation, updateSharedLocationState]);

  useEffect(() => {
    console.debug("[SearchingDriver] mounted", location.pathname);
    return () => {
      console.debug("[SearchingDriver] unmounted", location.pathname);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (backendMode) {
      return undefined;
    }
    if (!routeReady) {
      return undefined;
    }
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 4 ? "." : `${prev}.`));
      setSearchTime((prev) => prev + 1);
      setDriverProgress((prev) =>
        Math.min(prev + tripWorkflow.searchingDriverProgressPerTick, tripWorkflow.searchingDriverProgressCap)
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [backendMode, routeReady, tripWorkflow.searchingDriverProgressCap, tripWorkflow.searchingDriverProgressPerTick]);

  useEffect(() => {
    const backendTripStatus = ride.activeTrip?.status as string | undefined;
    if (!backendMode || !backendTripStatus) {
      return;
    }

    if (backendTripStatus === "driver_assigned" || backendTripStatus === "driver_arriving") {
      navigate("/rides/driver-on-way", { replace: true });
      return;
    }

    if (backendTripStatus === "arrived") {
      navigate("/rides/driver-arrived", { replace: true });
      return;
    }

    if (backendTripStatus === "in_progress") {
      navigate("/rides/trip", { replace: true, state: { fromDriverVerification: true } });
      return;
    }

    if (backendTripStatus === "completed") {
      navigate("/rides/trip/completed", { replace: true });
    }
  }, [backendMode, navigate, ride.activeTrip?.status]);

  useEffect(() => {
    if (hasTransitionedToOnWayRef.current) return;
    if (!routeReady) return;
    if (searchTime < tripWorkflow.searchingToOnWayDelaySec) return;
    hasTransitionedToOnWayRef.current = true;
    setRideStatus("driver_on_way");
    navigate("/rides/driver-on-way");
  }, [navigate, routeReady, searchTime, setRideStatus, tripWorkflow.searchingToOnWayDelaySec]);

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
    overflow: "visible"
  } as const;

  return (
    <ScreenScaffold disableTopPadding>
      <ExpandableMapPanel
        containerSx={topMapBleedSx}
        mapHeight={{ xs: "52vh", md: "54vh" }}
        expandedMapHeight={{ xs: "78vh", md: "76vh" }}
        buttonOffsetCollapsed={-18}
        buttonOffsetExpanded={14}
        detailsWrapperSx={{ mt: 1.2 }}
        map={
          <MapShell
            preset="compact"
            sx={{ height: "100%" }}
            showControls={false}
            showRouteInfo={false}
            pickupLocation={sharedLocationState.pickupCoords}
            dropoffLocation={sharedLocationState.destinationCoords}
            driverLocation={driverLocation}
            riderLocation={sharedLocationState.riderLocation}
            routePolyline={routePolyline}
            routeAlternativePolylines={sharedLocationState.routeAlternativePolylines}
            routeDistanceKm={sharedLocationState.routeDistanceKm}
            routeDurationMin={sharedLocationState.routeDurationMin}
            onRecenter={handleLocateMe}
            canvasSx={{ background: uiTokens.map.canvasEmphasis }}
          />
        }
        details={
          <Stack spacing={1.25}>
            {routeSummary && (
              <Box sx={{ pt: 0.25, pb: 0.2, display: "flex", justifyContent: "flex-start" }}>
                <Box
                  sx={{
                    px: 1.25,
                    py: 0.45,
                    borderRadius: "999px",
                    bgcolor: "#0B1530",
                    border: "1px solid rgba(247,144,9,0.45)",
                    color: "#F8FAFC",
                    fontWeight: 700,
                    fontSize: 11
                  }}
                >
                  {routeSummary}
                </Box>
              </Box>
            )}
            <Box sx={{ pt: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
                Searching for driver{dots}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11, color: "#F79009", fontWeight: 700, display: "block" }}>
                {bookedForLabel}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: routeReady ? "#047857" : (t) => t.palette.text.secondary, fontWeight: routeReady ? 600 : 500 }}
              >
                {routeReady
                  ? "Matching you with the nearest available EV driver."
                  : "Select pickup and destination first."}
              </Typography>
            </Box>

            <Card
              elevation={0}
              sx={{
                borderRadius: uiTokens.radius.sm,
                bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(247,144,9,0.38)"
                    : "1px solid rgba(249,115,22,0.48)"
              }}
            >
              <CardContent sx={{ px: 1.75, py: 2 }}>
                <Stack direction="row" spacing={1.3} alignItems="center">
                  <CircularProgress size={20} thickness={5} sx={{ color: companyOrange }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {routeReady ? "Searching nearby drivers" : "Route unavailable"}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: 11, color: routeReady ? "#B45309" : (t) => t.palette.text.secondary, fontWeight: routeReady ? 600 : 500 }}>
                      {routeReady
                        ? "Hold on while we find the closest available driver."
                        : "Go back and confirm both pickup and destination coordinates."}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Button
              fullWidth
              variant={routeReady ? "outlined" : "contained"}
              size="small"
              onClick={() => (routeReady ? setShowCancelDialog(true) : navigate("/rides/enter/details"))}
              sx={{
                borderRadius: uiTokens.radius.xl,
                py: 0.9,
                fontSize: 12,
                textTransform: "none",
                borderColor: routeReady ? "rgba(247,144,9,0.55)" : undefined,
                color: routeReady ? companyOrange : undefined,
                "&:hover": routeReady
                  ? {
                      borderColor: companyOrange,
                      bgcolor: "rgba(247,144,9,0.08)"
                    }
                  : undefined
              }}
            >
              {routeReady ? "Cancel request" : "Back to trip setup"}
            </Button>
          </Stack>
        }
      />

      <Dialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: uiTokens.radius.lg,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>Cancel ride request?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: (theme) => theme.palette.text.secondary }}>
            You can request another ride any time.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: uiTokens.spacing.xl, pb: uiTokens.spacing.lg }}>
          <Button onClick={() => setShowCancelDialog(false)} sx={{ textTransform: "none" }}>
            Keep searching
          </Button>
          <Button
            onClick={() => navigate("/rides/enter/details")}
            variant="contained"
            sx={{ textTransform: "none", bgcolor: "#EF4444", "&:hover": { bgcolor: "#DC2626" } }}
          >
            Cancel request
          </Button>
        </DialogActions>
      </Dialog>

    </ScreenScaffold>
  );
}

export default function RiderScreen22SearchingForDriverCanvas_v2() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (theme) => theme.palette.background.default
      }}
    >
      <SearchingForDriverScreen />
    </Box>
  );
}
