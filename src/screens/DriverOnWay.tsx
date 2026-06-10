import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography
} from "@mui/material";

import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import MapShell from "../components/maps/MapShell";
import ExpandableMapPanel from "../components/maps/ExpandableMapPanel";
import DriverChatRoom from "../components/DriverChatRoom";
import ScreenScaffold from "../components/ScreenScaffold";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";
import { isRiderBackendEnabled } from "../services/api/riderApi";
import { getApproachPoint, normalizeRoute } from "../utils/mapRoutes";

function DriverAssignedOnTheWayScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { ride, sharedLocationState, actions } = useAppData();
  const { setRideStatus, updateSharedLocationState } = actions;
  const activeTrip = ride.activeTrip;
  const bookedForLabel = useMemo(() => {
    const bookedFor = activeTrip?.bookedFor ?? ride.request.bookedFor;
    if (!bookedFor || bookedFor.source === "self") return "For: You";
    const name = bookedFor.name?.trim() || "Booked rider";
    return `For: ${name}${bookedFor.phone ? ` (${bookedFor.phone})` : ""}`;
  }, [activeTrip?.bookedFor, ride.request.bookedFor]);
  const driver = activeTrip?.driver;
  const vehicle = activeTrip?.vehicle;
  const arrivalWorkflow = ride.workflow.driverArrival;
  const legs = activeTrip?.legs ?? [];
  const currentLegIndex = Math.min(
    Math.max(activeTrip?.currentLegIndex ?? 0, 0),
    Math.max(0, legs.length - 1)
  );
  const currentLeg = legs[currentLegIndex];
  const [arrivalTime, setArrivalTime] = useState(activeTrip?.etaMinutes ?? 5);
  const [chatOpen, setChatOpen] = useState(false);
  const [driverProgress, setDriverProgress] = useState(arrivalWorkflow.initialProgress);
  const hasInitializedOnWayStatusRef = React.useRef(false);
  const backendMode = isRiderBackendEnabled();
  const companyOrange = "#F79009";
  const routePolyline = normalizeRoute(sharedLocationState.routePolyline);
  const driverLocation = getApproachPoint(routePolyline, driverProgress);
  const routeSummary = useMemo(() => {
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
  const selectedRideClass = useMemo(() => {
    const selectedLevelId = ride.request.serviceLevel;
    if (selectedLevelId) {
      const selectedOption = ride.options.find((option) => option.id === selectedLevelId);
      if (selectedOption?.name) {
        return selectedOption.name;
      }
    }
    if (vehicle?.category) {
      return vehicle.category;
    }
    if (ride.request.serviceClass === "premium") {
      return "Premium";
    }
    if (ride.request.serviceClass === "standard") {
      return "Standard";
    }
    return "EV Comfort";
  }, [ride.options, ride.request.serviceClass, ride.request.serviceLevel, vehicle?.category]);
  const vehicleImage = useMemo(() => {
    const model = (vehicle?.model ?? "").toLowerCase();
    if (model.includes("suv")) return "/rides-ui/EV--4.png";
    if (model.includes("van")) return "/rides-ui/EV--4.png";
    if (model.includes("scooter")) return "/rides-ui/EV--1.png";
    return "/rides-ui/EV--3.png";
  }, [vehicle?.model]);
  const callTarget = useMemo(() => {
    const raw = driver?.phone || "+256700000000";
    const cleaned = raw.replace(/[^\d+]/g, "");
    return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
  }, [driver?.phone]);

  useEffect(() => {
    if (hasInitializedOnWayStatusRef.current) {
      return;
    }
    hasInitializedOnWayStatusRef.current = true;
    setRideStatus("driver_on_way");
  }, [setRideStatus]);

  useEffect(() => {
    if (backendMode) {
      return undefined;
    }
    const interval = setInterval(() => {
      setArrivalTime((prev) => {
        if (prev > 0) {
          return prev - 0.0167;
        }
        return 0;
      });
      setDriverProgress((prev) => Math.min(prev + arrivalWorkflow.progressStepPerTick, 1));
    }, arrivalWorkflow.progressTickMs);

    return () => clearInterval(interval);
  }, [arrivalWorkflow.progressStepPerTick, arrivalWorkflow.progressTickMs, backendMode]);

  useEffect(() => {
    const backendTripStatus = activeTrip?.status as string | undefined;
    if (!backendMode || !backendTripStatus) {
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
  }, [activeTrip?.status, backendMode, navigate]);

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

  const handleAccept = () => {
    setRideStatus("driver_arrived");
    navigate("/rides/driver-arrived");
  };

  const handleChange = () => {
    setRideStatus("searching");
    navigate("/rides/searching");
  };

  const handleCall = () => {
    const href = `tel:${callTarget}`;
    try {
      const opened = window.open(href, "_self");
      if (!opened) {
        window.location.href = href;
      }
    } catch {
      window.location.href = href;
    }
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
        mapHeight={{ xs: "52vh", md: "54vh" }}
        expandedMapHeight={{ xs: "86vh", md: "84vh" }}
        buttonOffsetCollapsed={8}
        buttonOffsetExpanded={14}
        detailsWrapperSx={{
          mt: 0.75
        }}
        map={
          <MapShell
            preset="compact"
            sx={{ height: "100%" }}
            showControls={false}
            showRouteInfo={false}
            pickupLocation={sharedLocationState.pickupCoords}
            dropoffLocation={sharedLocationState.destinationCoords}
            driverLocation={driverLocation}
            routePolyline={routePolyline}
            routeAlternativePolylines={sharedLocationState.routeAlternativePolylines}
            routeDistanceKm={sharedLocationState.routeDistanceKm}
            routeDurationMin={sharedLocationState.routeDurationMin}
            canvasSx={{ background: uiTokens.map.canvasEmphasis }}
          />
        }
        details={
          <Stack spacing={0.75}>
            {routeSummary && (
              <Box sx={{ pt: 0.25, pb: 0.6, display: "flex", justifyContent: "flex-start" }}>
                <Box
                  sx={{
                    px: 1.8,
                    py: 0.75,
                    borderRadius: "999px",
                    bgcolor: "#0B1530",
                    border: `1px solid ${companyOrange}`,
                    color: "#F8FAFC",
                    fontWeight: 700,
                    fontSize: 13
                  }}
                >
                  {routeSummary}
                </Box>
              </Box>
            )}
            {legs.length > 1 && (
              <Stack direction="row" spacing={0.8} sx={{ pb: 0.2 }}>
                <Box
                  sx={{
                    px: 1.2,
                    py: 0.45,
                    borderRadius: "999px",
                    bgcolor: "rgba(2,132,199,0.12)",
                    border: "1px solid rgba(2,132,199,0.35)",
                    color: "#0369A1",
                    fontWeight: 700,
                    fontSize: 11
                  }}
                >
                  {`Leg ${currentLegIndex + 1} of ${legs.length}`}
                </Box>
                {Boolean(currentLeg?.isReturnLeg) && (
                  <Box
                    sx={{
                      px: 1.1,
                      py: 0.45,
                      borderRadius: "999px",
                      bgcolor: "rgba(247,144,9,0.13)",
                      border: "1px solid rgba(247,144,9,0.45)",
                      color: "#B45309",
                      fontWeight: 700,
                      fontSize: 11
                    }}
                  >
                    Return leg
                  </Box>
                )}
              </Stack>
            )}
            <Box sx={{ pt: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
                Driver is on the way
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11, color: "#F79009", fontWeight: 700, display: "block" }}>
                {bookedForLabel}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                Your driver is heading to your location now.
              </Typography>
            </Box>

            <Card
              elevation={0}
              sx={{
                borderRadius: uiTokens.radius.sm,
                bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(247,144,9,0.35)"
                    : "1px solid rgba(249,115,22,0.45)"
              }}
            >
              <CardContent sx={{ px: 2, py: 1.8 }}>
                <Stack direction="row" spacing={1.25} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Avatar
                      sx={{
                        width: 46,
                        height: 46,
                        bgcolor: "#03CD8C",
                        color: "#FFFFFF",
                        fontWeight: 700
                      }}
                    >
                      {driver?.avatar ?? driver?.name?.slice(0, 2).toUpperCase() ?? "DR"}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {driver?.name ?? "Driver"}
                      </Typography>
                      <Stack direction="row" spacing={0.4} alignItems="center">
                        <StarRoundedIcon sx={{ fontSize: 14, color: "#F59E0B" }} />
                        <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                          {driver?.rating?.toFixed(1) ?? "4.6"} rating
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={0.5}>
                    <IconButton
                      size="small"
                      onClick={handleCall}
                      component="a"
                      href={`tel:${callTarget}`}
                      sx={{
                        border: `1px solid rgba(247, 144, 9, 0.35)`,
                        color: companyOrange
                      }}
                    >
                      <PhoneRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setChatOpen(true)}
                      sx={{
                        border: "1px solid rgba(3, 205, 140, 0.35)",
                        color: "#03CD8C"
                      }}
                    >
                      <MessageRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                borderRadius: uiTokens.radius.sm,
                bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(3,205,140,0.42)"
                    : "1px solid rgba(16,185,129,0.5)"
              }}
            >
              <CardContent sx={{ px: 2, py: 1.8 }}>
                {currentLeg && (
                  <Typography variant="caption" sx={{ display: "block", color: (t) => t.palette.text.secondary, mb: 0.8 }}>
                    Current leg: {currentLeg.from.label || currentLeg.from.address} → {currentLeg.to.label || currentLeg.to.address}
                  </Typography>
                )}
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                  Vehicle details
                </Typography>
                <Stack direction="row" spacing={1.25} sx={{ mt: 0.8 }} alignItems="center">
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack spacing={0.7}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Number plate: {vehicle?.plate ?? "UAX 278C"}
                      </Typography>
                      <Typography variant="body2">
                        Model: {vehicle?.model ?? "Tesla Model 3"}
                      </Typography>
                      <Typography variant="body2">
                        Color: {vehicle?.color ?? "Pearl White"}
                      </Typography>
                      <Typography variant="body2">
                        Ride class: {selectedRideClass}
                      </Typography>
                    </Stack>
                  </Box>
                  <Box
                    component="img"
                    src={vehicleImage}
                    alt={vehicle?.model ?? "Vehicle"}
                    sx={{
                      width: 84,
                      height: 56,
                      objectFit: "contain",
                      borderRadius: 1.5,
                      bgcolor: "rgba(247, 144, 9, 0.08)",
                      border: "1px solid rgba(247, 144, 9, 0.2)",
                      p: 0.4
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                borderRadius: uiTokens.radius.sm,
                bgcolor: companyOrange,
                border: "1px solid #DC6803",
                overflow: "hidden"
              }}
            >
              <CardContent sx={{ px: 1.75, py: 1.25 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#FFFFFF", fontSize: 13 }}>
                  Driver is arriving in {String(Math.ceil(arrivalTime)).padStart(2, "0")} mins
                </Typography>
              </CardContent>
            </Card>

            <Typography
              variant="caption"
              sx={{ display: "block", fontSize: 12.5, fontWeight: 700, color: (t) => t.palette.text.secondary }}
            >
              OTP will be shown once the driver arrives for pickup verification.
            </Typography>

            <Stack direction="row" spacing={1.5}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleAccept}
                sx={{
                  borderRadius: 5,
                  py: 1.3,
                  fontSize: 15,
                  fontWeight: 600,
                  textTransform: "none",
                  bgcolor: "#22c55e",
                  color: "#FFFFFF",
                  "&:hover": {
                    bgcolor: "#16A34A"
                  }
                }}
              >
                Accept
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleChange}
                sx={{
                  borderRadius: 5,
                  py: 1.3,
                  fontSize: 15,
                  fontWeight: 600,
                  textTransform: "none",
                  bgcolor: (theme) =>
                    theme.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.98)",
                  border: (theme) =>
                    theme.palette.mode === "light"
                      ? "1px solid rgba(209,213,219,0.9)"
                      : "1px solid rgba(51,65,85,0.9)",
                  color: (theme) => theme.palette.text.primary,
                  "&:hover": {
                    bgcolor: (theme) =>
                      theme.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.8)"
                  }
                }}
              >
                Change
              </Button>
            </Stack>
          </Stack>
        }
      />

      <DriverChatRoom
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        driverName={driver?.name}
        driverAvatar={driver?.avatar}
      />
    </ScreenScaffold>
  );
}

export default function RiderScreen23DriverAssignedOnTheWayCanvas_v2() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (theme) => theme.palette.background.default
      }}
    >
      <DriverAssignedOnTheWayScreen />
    </Box>
  );
}
