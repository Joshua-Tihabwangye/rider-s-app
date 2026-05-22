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
import { getApproachPoint, normalizeRoute } from "../utils/mapRoutes";

function SearchingForDriverScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { sharedLocationState, actions } = useAppData();
  const { setRideStatus, updateSharedLocationState } = actions;
  const [dots, setDots] = useState(".");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const [driverProgress, setDriverProgress] = useState(0);
  const companyOrange = "#F79009";
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
  const fallbackRoute = React.useMemo(() => {
    if (routePolyline.length > 1) return routePolyline;
    if (sharedLocationState.pickupCoords && sharedLocationState.destinationCoords) {
      return [sharedLocationState.pickupCoords, sharedLocationState.destinationCoords];
    }
    return [];
  }, [routePolyline, sharedLocationState.destinationCoords, sharedLocationState.pickupCoords]);
  const routeReady =
    Boolean(sharedLocationState.pickupCoords) &&
    Boolean(sharedLocationState.destinationCoords);

  // Calculate driver location along the route
  const driverLocation = React.useMemo(() => {
    return getApproachPoint(fallbackRoute, driverProgress);
  }, [fallbackRoute, driverProgress]);

  useEffect(() => {
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
    if (!routeReady) {
      return undefined;
    }
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 4 ? "." : `${prev}.`));
      setSearchTime((prev) => prev + 1);
      // Simulate driver approaching pickup location
      setDriverProgress((prev) => Math.min(prev + 0.02, 0.8));
    }, 1000);
    return () => clearInterval(interval);
  }, [routeReady]);

  useEffect(() => {
    if (!routeReady) return;
    if (searchTime < 8) return;
    setRideStatus("driver_on_way");
    navigate("/rides/driver-on-way");
  }, [navigate, routeReady, searchTime, setRideStatus]);

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
        mapHeight={{ xs: "52dvh", md: "54vh" }}
        expandedMapHeight={{ xs: "78dvh", md: "76vh" }}
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
            routePolyline={fallbackRoute}
            routeAlternativePolylines={sharedLocationState.routeAlternativePolylines}
            routeDistanceKm={sharedLocationState.routeDistanceKm}
            routeDurationMin={sharedLocationState.routeDurationMin}
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
