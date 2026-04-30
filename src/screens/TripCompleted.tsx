import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import MapShell from "../components/maps/MapShell";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";

function TripCompletedArrivalSummaryScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { ride, actions } = useAppData();
  const activeTrip = ride.activeTrip;

  const routeState = (location.state as Record<string, unknown> | null) ?? null;

  const rawFare =
    (typeof routeState?.totalFare === "string" && routeState.totalFare) ||
    (typeof routeState?.fare === "string" && routeState.fare) ||
    activeTrip?.fareEstimate ||
    "UGX 20,565";
  const fareDisplay = rawFare.toUpperCase().includes("UGX") ? rawFare : `UGX ${rawFare}`;

  const rawDistance =
    (typeof routeState?.distance === "string" && routeState.distance) ||
    activeTrip?.distance ||
    "54 km";
  const distanceDisplay = /km/i.test(rawDistance) ? rawDistance : `${rawDistance} km`;

  const durationDisplay =
    (typeof routeState?.estimatedTime === "string" && routeState.estimatedTime) ||
    (typeof routeState?.duration === "string" && routeState.duration) ||
    "2 hr 20 mins";

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
    new Set([...requestStops, ...stateStops].map((value) => value.trim()).filter(Boolean))
  ).filter((stop) => stop !== departurePoint && stop !== destination);

  const driverName = activeTrip?.driver?.name ?? "Driver";
  const driverRating = activeTrip?.driver?.rating ?? 4.6;

  React.useEffect(() => {
    actions.setRideStatus("completed");
  }, [actions.setRideStatus]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Trip Completed",
          text: `Trip completed from ${departurePoint} to ${destination}`,
          url: window.location.href
        })
        .catch(() => undefined);
    }
  };

  const handleRateDriver = () => {
    navigate("/rides/rating/driver", {
      state: {
        tripCompleted: true,
        driverName,
        driverRating
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
      <Box sx={topMapBleedSx}>
        <MapShell
          showControls={false}
          sx={{ height: { xs: "44dvh", md: "52vh" } }}
          canvasSx={{
            background:
              "linear-gradient(160deg, #D6E9FF 0%, #E5F3FF 22%, #F5EED9 22%, #F5EED9 100%)"
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "58%",
              left: "18%",
              width: 18,
              height: 18,
              borderRadius: "50%",
              bgcolor: "#22C55E",
              border: "3px solid rgba(255,255,255,0.95)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.22)",
              transform: "translate(-50%, -50%)"
            }}
          />

          <Box
            sx={{
              position: "absolute",
              top: "33%",
              right: "15%",
              width: 20,
              height: 20,
              borderRadius: "50%",
              bgcolor: "#F97316",
              border: "3px solid rgba(255,255,255,0.95)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.22)",
              transform: "translate(50%, -50%)"
            }}
          />

          {stopovers.map((_, index) => {
            const ratio = (index + 1) / (stopovers.length + 1);
            return (
              <Box
                key={`stop-marker-${index}`}
                sx={{
                  position: "absolute",
                  left: `${22 + ratio * 48}%`,
                  top: `${56 - ratio * 20}%`,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: "#0EA5E9",
                  border: "2px solid rgba(255,255,255,0.95)",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
                  transform: "translate(-50%, -50%)"
                }}
              />
            );
          })}

          <Box
            sx={{
              position: "absolute",
              left: "44%",
              top: "47%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 3
            }}
          >
            <DirectionsCarFilledRoundedIcon
              sx={{
                fontSize: 30,
                color: "#03CD8C",
                filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.24))"
              }}
            />
          </Box>
        </MapShell>
      </Box>

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
            </Box>
            <IconButton
              size="small"
              onClick={handleShare}
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.08)",
                color: "#03CD8C"
              }}
            >
              <ShareRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          <Stack direction="row" spacing={1} sx={{ mb: 1.2, flexWrap: "wrap" }}>
            <Chip label={`Distance: ${distanceDisplay}`} size="small" />
            <Chip label={`Time: ${durationDisplay}`} size="small" />
            <Chip label={`Amount: ${fareDisplay}`} size="small" color="success" />
          </Stack>

          <Button
            variant="outlined"
            onClick={handleRateDriver}
            startIcon={<StarRoundedIcon sx={{ fontSize: 17 }} />}
            sx={{
              borderRadius: uiTokens.radius.xl,
              textTransform: "none",
              fontWeight: 600,
              borderColor: (theme) =>
                theme.palette.mode === "light" ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.24)",
              color: (theme) => theme.palette.text.primary
            }}
          >
            Rate driver
          </Button>
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
