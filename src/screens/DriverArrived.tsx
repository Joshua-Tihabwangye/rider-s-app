import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Chip,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Typography
} from "@mui/material";

import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import MapShell from "../components/maps/MapShell";
import ExpandableMapPanel from "../components/maps/ExpandableMapPanel";
import DriverChatRoom from "../components/DriverChatRoom";
import ScreenScaffold from "../components/ScreenScaffold";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";
import { getApproachPoint, normalizeRoute } from "../utils/mapRoutes";

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function distanceKmBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const earthRadiusKm = 6371;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function DriverHasArrivedScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { ride, sharedLocationState, actions } = useAppData();
  const {
    setRideStatus,
    updateRideTrip,
    updateSharedLocationState
  } = actions;
  const activeTrip = ride.activeTrip;
  const driver = activeTrip?.driver;
  const vehicle = activeTrip?.vehicle;
  const legs = activeTrip?.legs ?? [];
  const currentLegIndex = Math.min(
    Math.max(activeTrip?.currentLegIndex ?? 0, 0),
    Math.max(0, legs.length - 1)
  );
  const currentLeg = legs[currentLegIndex];
  const otp = (activeTrip?.otp?.trim() || "256836").replace(/\s+/g, "").slice(0, 6);
  const [chatOpen, setChatOpen] = useState(false);
  const [arrivalProgress, setArrivalProgress] = useState(0.84);
  const companyOrange = "#F79009";
  const routePolyline = normalizeRoute(sharedLocationState.routePolyline);
  const fallbackRoute = React.useMemo(() => {
    if (routePolyline.length > 1) return routePolyline;
    if (sharedLocationState.pickupCoords && sharedLocationState.destinationCoords) {
      return [sharedLocationState.pickupCoords, sharedLocationState.destinationCoords];
    }
    return [];
  }, [routePolyline, sharedLocationState.destinationCoords, sharedLocationState.pickupCoords]);
  const driverLocation = React.useMemo(() => {
    return (
      getApproachPoint(fallbackRoute, arrivalProgress) ??
      sharedLocationState.driverLocation ??
      sharedLocationState.pickupCoords ??
      null
    );
  }, [arrivalProgress, fallbackRoute, sharedLocationState.driverLocation, sharedLocationState.pickupCoords]);
  const approachDistanceKm = React.useMemo(() => {
    if (!driverLocation || !sharedLocationState.pickupCoords) {
      return sharedLocationState.routeDistanceKm;
    }
    return Math.max(0.05, distanceKmBetween(driverLocation, sharedLocationState.pickupCoords));
  }, [driverLocation, sharedLocationState.pickupCoords, sharedLocationState.routeDistanceKm]);
  const approachDurationMin = React.useMemo(() => {
    if (!approachDistanceKm) {
      return sharedLocationState.routeDurationMin;
    }
    return Math.max(1, Math.round(approachDistanceKm / 0.42));
  }, [approachDistanceKm, sharedLocationState.routeDurationMin]);

  useEffect(() => {
    if (ride.activeTrip?.status !== "driver_arrived") {
      setRideStatus("driver_arrived");
    }
    const verificationTimer = window.setTimeout(() => {
      if (ride.activeTrip?.status === "driver_arrived") {
        updateRideTrip({
          startedAt: ride.activeTrip?.startedAt ?? new Date().toISOString(),
          status: "in_progress"
        });
        setRideStatus("in_progress");
        navigate("/rides/trip", { replace: true, state: { fromDriverVerification: true } });
      }
    }, 15000);

    return () => window.clearTimeout(verificationTimer);
  }, [
    navigate,
    ride.activeTrip?.startedAt,
    ride.activeTrip?.status,
    setRideStatus,
    updateRideTrip
  ]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setArrivalProgress((prev) => Math.min(prev + 0.035, 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

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

  const handleStartTrip = () => {
    updateRideTrip({
      startedAt: activeTrip?.startedAt ?? new Date().toISOString(),
      status: "in_progress"
    });
    setRideStatus("in_progress");
    navigate("/rides/trip", { replace: true, state: { fromDriverVerification: true } });
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

  const handleCall = () => {
    if (driver?.phone) {
      window.location.href = `tel:${driver.phone}`;
    }
  };

  return (
    <ScreenScaffold disableTopPadding>
      <ExpandableMapPanel
        containerSx={topMapBleedSx}
        mapHeight={{ xs: "52dvh", md: "54vh" }}
        expandedMapHeight={{ xs: "78dvh", md: "76vh" }}
        buttonOffsetCollapsed={8}
        buttonOffsetExpanded={14}
        detailsWrapperSx={{ mt: 0.75 }}
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
            routeDistanceKm={approachDistanceKm}
            routeDurationMin={approachDurationMin}
            canvasSx={{ background: uiTokens.map.canvasEmphasis }}
          />
        }
        details={
          <Stack spacing={0.75}>
            {!!approachDistanceKm && !!approachDurationMin && (
              <Box sx={{ pt: 0.15, pb: 0.35, display: "flex", justifyContent: "flex-start" }}>
                <Box
                  sx={{
                    px: 1.25,
                    py: 0.5,
                    borderRadius: "999px",
                    bgcolor: "#0B1530",
                    border: "1px solid rgba(3,205,140,0.55)",
                    color: "#F8FAFC",
                    fontWeight: 700,
                    fontSize: 11
                  }}
                >
                  {`${approachDistanceKm.toFixed(2)} km • ${Math.round(approachDurationMin)} min`}
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
                Driver arrived
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                Verify OTP or QR before starting the trip.
              </Typography>
            </Box>

            <Card
              elevation={0}
              sx={{
                borderRadius: uiTokens.radius.sm,
                bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(247,144,9,0.36)"
                    : "1px solid rgba(249,115,22,0.46)"
              }}
            >
              <CardContent sx={{ px: 2, py: 1.8 }}>
                {currentLeg && (
                  <Typography variant="caption" sx={{ display: "block", color: (t) => t.palette.text.secondary, mb: 0.75 }}>
                    Current leg: {currentLeg.from.label || currentLeg.from.address} → {currentLeg.to.label || currentLeg.to.address}
                  </Typography>
                )}
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
                      <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                        {vehicle?.model ?? "Tesla Model 3"} · {vehicle?.color ?? "Pearl White"}
                      </Typography>
                      <Typography variant="caption" sx={{ display: "block", color: (t) => t.palette.text.secondary }}>
                        Plate: {vehicle?.plate ?? "UAX 278C"}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={0.5}>
                    <IconButton
                      size="small"
                      onClick={handleCall}
                      sx={{ border: "1px solid rgba(247,144,9,0.35)", color: companyOrange }}
                    >
                      <PhoneRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setChatOpen(true)}
                      sx={{ border: "1px solid rgba(3,205,140,0.35)", color: "#03CD8C" }}
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
                <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems="stretch">
                  <Box sx={{ flex: 1, width: "100%" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Box>
                        <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                          Rider OTP
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          Driver can enter this code instead of scanning the QR.
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        label="Use OTP"
                        sx={{
                          height: 24,
                          borderRadius: 1.5,
                          bgcolor: "rgba(3,205,140,0.14)",
                          color: "#047857",
                          fontWeight: 700
                        }}
                      />
                    </Stack>

                    <Stack direction="row" spacing={0.75} sx={{ mb: 1.25, flexWrap: "nowrap" }} useFlexGap>
                      {otp.split("").map((digit, index) => (
                        <Box
                          key={`${digit}-${index}`}
                          sx={{
                            minWidth: 40,
                            height: 48,
                            px: 0.9,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: (t) => (t.palette.mode === "light" ? "#F8FAFC" : "rgba(15,23,42,0.96)"),
                            border: "1px solid rgba(3,205,140,0.28)"
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "0.02em", lineHeight: 1 }}>
                            {digit}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>

                    <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                      Share this OTP with the driver before trip start.
                    </Typography>
                  </Box>

                  <Divider
                    flexItem
                    orientation="vertical"
                    sx={{ display: { xs: "none", md: "block" }, borderColor: "rgba(148,163,184,0.3)" }}
                  />
                  <Divider sx={{ display: { xs: "block", md: "none" }, borderColor: "rgba(148,163,184,0.3)" }}>
                    <Typography variant="caption" sx={{ px: 0.75, color: "text.secondary", fontWeight: 700 }}>
                      OR
                    </Typography>
                  </Divider>

                  <Box
                    sx={{
                      width: { xs: "100%", md: 156 },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Stack spacing={1} alignItems="center">
                      <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                        Or scan QR
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 800,
                          letterSpacing: "0.12em",
                          color: "#0F172A"
                        }}
                      >
                        Scan QR
                      </Typography>
                      <Box
                        sx={{
                          width: 132,
                          height: 132,
                          p: 1.25,
                          borderRadius: 2,
                          border: "1px solid rgba(148,163,184,0.45)",
                          bgcolor: "#FFFFFF",
                          position: "relative"
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 10,
                            backgroundImage:
                              "repeating-linear-gradient(0deg, #111827 0 5px, transparent 5px 10px), repeating-linear-gradient(90deg, #111827 0 5px, transparent 5px 10px)",
                            opacity: 0.24
                          }}
                        />
                        <Box sx={qrCornerSx(14, 14)} />
                        <Box sx={qrCornerSx(undefined, 14, 14)} />
                        <Box sx={qrCornerSx(14, undefined, undefined, 14)} />
                        <QrCode2RoundedIcon
                          sx={{
                            position: "absolute",
                            right: 12,
                            bottom: 12,
                            fontSize: 18,
                            color: "#111827"
                          }}
                        />
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Typography
              variant="caption"
              sx={{
                textAlign: "center",
                color: (t) => t.palette.text.secondary,
                fontSize: 11,
                display: "block"
              }}
            >
              Trip will start automatically once the driver verifies OTP or QR.
            </Typography>

            <Button
              fullWidth
              variant="contained"
              onClick={handleStartTrip}
              sx={{
                borderRadius: 5,
                py: 1.2,
                fontSize: 14,
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "#16A34A",
                boxShadow: "0 10px 22px rgba(247,144,9,0.22)",
                color: "#FFFFFF",
                "&:hover": {
                  bgcolor: "#15803D"
                }
              }}
            >
              Start trip
            </Button>
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

function qrCornerSx(
  left?: number,
  top?: number,
  right?: number,
  bottom?: number
) {
  return {
    position: "absolute",
    left,
    top,
    right,
    bottom,
    width: 26,
    height: 26,
    border: "4px solid #111827",
    bgcolor: "#FFFFFF",
    boxSizing: "border-box"
  } as const;
}

export default function RiderScreen24DriverHasArrivedCanvas_v2() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (theme) => theme.palette.background.default
      }}
    >
      <DriverHasArrivedScreen />
    </Box>
  );
}
