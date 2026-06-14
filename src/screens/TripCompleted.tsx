import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography
} from "@mui/material";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import MapShell from "../components/maps/MapShell";
import ExpandableMapPanel from "../components/maps/ExpandableMapPanel";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";
import { useLiveLocation } from "../contexts/LiveLocationContext";
import { normalizeRoute } from "../utils/mapRoutes";

function TripCompletedArrivalSummaryScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { ride, sharedLocationState, actions } = useAppData();
  const { riderLocation } = useLiveLocation();
  const activeTrip = ride.activeTrip;
  const routePolyline = normalizeRoute(sharedLocationState.routePolyline);
  const bookedForLabel = React.useMemo(() => {
    const bookedFor = activeTrip?.bookedFor ?? ride.request.bookedFor;
    if (!bookedFor || bookedFor.source === "self") return "For: You";
    const name = bookedFor.name?.trim() || "Booked rider";
    return `For: ${name}${bookedFor.phone ? ` (${bookedFor.phone})` : ""}`;
  }, [activeTrip?.bookedFor, ride.request.bookedFor]);

  const routeState = (location.state as Record<string, unknown> | null) ?? null;

  const rawFare =
    (typeof routeState?.totalFare === "string" && routeState.totalFare) ||
    (typeof routeState?.fare === "string" && routeState.fare) ||
    activeTrip?.fareEstimate ||
    "UGX 0";
  const fareDisplay = rawFare.toUpperCase().includes("UGX") ? rawFare : `UGX ${rawFare}`;

  const rawDistance =
    (typeof routeState?.distance === "string" && routeState.distance) ||
    activeTrip?.distance ||
    "0 km";
  const distanceDisplay = /km/i.test(rawDistance) ? rawDistance : `${rawDistance} km`;

  const estimatedMinutesFromLegs = activeTrip?.legs?.reduce((sum, leg) => sum + Math.max(0, leg.etaMinutes ?? 0), 0) ?? 0;
  const durationDisplay =
    (typeof routeState?.estimatedTime === "string" && routeState.estimatedTime) ||
    (typeof routeState?.duration === "string" && routeState.duration) ||
    (estimatedMinutesFromLegs > 0
      ? estimatedMinutesFromLegs < 60
        ? `${estimatedMinutesFromLegs} mins`
        : `${Math.floor(estimatedMinutesFromLegs / 60)} hr ${estimatedMinutesFromLegs % 60} mins`
      : "—");

  const departurePoint =
    activeTrip?.pickup?.address ||
    ride.request.origin?.address ||
    "Pickup location";

  const destination =
    activeTrip?.dropoff?.address ||
    ride.request.destination?.address ||
    "Destination";

  const requestStops = ride.request.stops
    .map((stop) => stop.address || stop.label)
    .filter((value): value is string => Boolean(value && value.trim().length > 0));
  const activeTripStops = (activeTrip?.routePoints ?? [])
    .slice(1, Math.max(1, (activeTrip?.routePoints ?? []).length - 1))
    .map((stop) => stop.address || stop.label)
    .filter((value): value is string => Boolean(value && value.trim().length > 0));

  const stateStops = Array.isArray(routeState?.stops)
    ? (routeState.stops as unknown[])
        .map((stop) => {
          if (typeof stop === "string") return stop;
          if (!stop || typeof stop !== "object") return "";
          const maybeStop = stop as { value?: unknown; label?: unknown; address?: unknown };
          if (typeof maybeStop.value === "string") return maybeStop.value;
          if (typeof maybeStop.label === "string") return maybeStop.label;
          if (typeof maybeStop.address === "string") return maybeStop.address;
          return "";
        })
        .filter((value): value is string => value.trim().length > 0)
    : [];

  const stopovers = Array.from(
    new Set([...activeTripStops, ...requestStops, ...stateStops].map((value) => value.trim()).filter(Boolean))
  ).filter((stop) => stop !== departurePoint && stop !== destination);

  const driverName = activeTrip?.driver?.name ?? "Driver";
  const driverRating = activeTrip?.driver?.rating ?? 0;

  React.useEffect(() => {
    actions.setRideStatus("completed");
  }, [actions.setRideStatus]);

  const handleRateDriver = () => {
    navigate("/rides/rating/driver", {
      state: {
        tripCompleted: true,
        returnTo: "/rides/trip/completed",
        driverName,
        driverRating
      }
    });
  };

  const handlePayNow = () => {
    navigate("/rides/payment", {
      state: {
        from: "/rides/trip/completed",
        fare: fareDisplay,
        tripId: activeTrip?.id
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
        mapHeight={{ xs: "44dvh", md: "52vh" }}
        expandedMapHeight={{ xs: "78dvh", md: "76vh" }}
        buttonOffsetCollapsed={8}
        buttonOffsetExpanded={14}
        detailsWrapperSx={{ mt: 0.65 }}
        map={
          <MapShell
            showControls={false}
            showRouteInfo={false}
            sx={{ height: "100%" }}
            pickupLocation={sharedLocationState.pickupCoords}
            dropoffLocation={sharedLocationState.destinationCoords}
            driverLocation={sharedLocationState.destinationCoords}
            riderLocation={riderLocation}
            routePolyline={routePolyline}
            routeAlternativePolylines={sharedLocationState.routeAlternativePolylines}
            routeDistanceKm={sharedLocationState.routeDistanceKm}
            routeDurationMin={sharedLocationState.routeDurationMin}
            canvasSx={{
              background:
                "linear-gradient(160deg, #D6E9FF 0%, #E5F3FF 22%, #F5EED9 22%, #F5EED9 100%)"
            }}
          />
        }
        details={
          <Stack spacing={1.1}>
            <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.sm,
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)",
          bgcolor: (theme) => (theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)")
        }}
      >
        <CardContent sx={{ px: 2, py: 1.6 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.25 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
                Trip Completed
              </Typography>
              <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                Final summary
              </Typography>
              <Typography variant="caption" sx={{ color: "#B45309", fontWeight: 700, display: "block" }}>
                {bookedForLabel}
              </Typography>
            </Box>
            <Button
              size="small"
              variant="outlined"
              onClick={handleRateDriver}
              startIcon={<StarRoundedIcon sx={{ fontSize: 15 }} />}
              sx={{
                borderRadius: uiTokens.radius.lg,
                textTransform: "none",
                fontWeight: 600,
                borderColor: "rgba(247,144,9,0.45)",
                color: "#B45309",
                px: 1.2
              }}
            >
              Rate driver
            </Button>
          </Box>

          <Stack direction="row" spacing={1} sx={{ mb: 1.25, flexWrap: "wrap" }}>
            <Chip
              label={`Distance: ${distanceDisplay}`}
              size="small"
              sx={{
                bgcolor: "rgba(247,144,9,0.12)",
                border: "1px solid rgba(247,144,9,0.34)",
                color: "#B45309",
                fontWeight: 600
              }}
            />
            <Chip
              label={`Time: ${durationDisplay}`}
              size="small"
              sx={{
                bgcolor: "rgba(247,144,9,0.12)",
                border: "1px solid rgba(247,144,9,0.34)",
                color: "#B45309",
                fontWeight: 600
              }}
            />
            {activeTrip?.tripMode === "round_trip" && (
              <Chip
                label="Round trip"
                size="small"
                sx={{
                  bgcolor: "rgba(3,205,140,0.12)",
                  border: "1px solid rgba(3,205,140,0.34)",
                  color: "#047857",
                  fontWeight: 600
                }}
              />
            )}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
            <Box
              sx={{
                flex: 1,
                px: 1.35,
                py: 1.15,
                borderRadius: uiTokens.radius.xl,
                border: "1px solid rgba(22,163,74,0.35)",
                bgcolor: "rgba(22,163,74,0.08)"
              }}
            >
              <Typography variant="caption" sx={{ color: (theme) => theme.palette.text.secondary, fontSize: 11 }}>
                Amount
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.01em", color: "#166534" }}>
                {fareDisplay}
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={handlePayNow}
              sx={{
                minWidth: 150,
                py: 1.2,
                borderRadius: uiTokens.radius.xl,
                textTransform: "none",
                fontWeight: 700,
                bgcolor: "#22c55e",
                "&:hover": { bgcolor: "#16A34A" }
              }}
            >
              Pay now
            </Button>
          </Stack>
        </CardContent>
            </Card>

            <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.sm,
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)",
          bgcolor: (theme) => (theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)")
        }}
      >
        <CardContent sx={{ px: 2, py: 1.6 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.1 }}>
            Route details
          </Typography>

          <Stack spacing={1.1}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <PlaceRoundedIcon sx={{ fontSize: 18, color: "#22C55E", mt: 0.15 }} />
              <Box>
                <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                  Pickup
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {departurePoint}
                </Typography>
              </Box>
            </Box>

            {stopovers.map((stop, index) => (
              <Box key={`${stop}-${index}`} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <RadioButtonUncheckedRoundedIcon sx={{ fontSize: 18, color: "#0EA5E9", mt: 0.15 }} />
                <Box>
                  <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                    Stopover {index + 1}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {stop}
                  </Typography>
                </Box>
              </Box>
            ))}

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <FlagRoundedIcon sx={{ fontSize: 18, color: "#F97316", mt: 0.15 }} />
              <Box>
                <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                  Destination
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {destination}
                </Typography>
              </Box>
            </Box>

            {(activeTrip?.legs?.length ?? 0) > 1 && (
              <Box
                sx={{
                  mt: 0.45,
                  p: 1.1,
                  borderRadius: 1.5,
                  bgcolor: "rgba(2,132,199,0.08)",
                  border: "1px solid rgba(2,132,199,0.2)"
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#0369A1" }}>
                  Multi-leg summary
                </Typography>
                <Typography variant="caption" sx={{ display: "block", color: (t) => t.palette.text.secondary, mt: 0.35 }}>
                  {activeTrip?.legs?.filter((leg) => leg.status === "completed").length ?? 0} / {activeTrip?.legs?.length ?? 0} legs completed
                </Typography>
              </Box>
            )}
          </Stack>

          <Box sx={{ mt: 1.6, display: "flex", alignItems: "center", gap: 0.6 }}>
            <AccessTimeRoundedIcon sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }} />
            <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
              Total trip time: {durationDisplay}
            </Typography>
          </Box>
        </CardContent>
            </Card>

            <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.sm,
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)",
          bgcolor: (theme) => (theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)")
        }}
      >
        <CardContent sx={{ px: 2, py: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: "#03CD8C", fontWeight: 700 }}>
                {driverName.slice(0, 2).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {driverName}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <StarRoundedIcon sx={{ fontSize: 14, color: "#FFC107" }} />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {driverRating}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {fareDisplay}
            </Typography>
          </Box>
        </CardContent>
            </Card>
          </Stack>
        }
      />
    </ScreenScaffold>
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
