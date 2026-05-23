import React, { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Avatar
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import StraightenRoundedIcon from "@mui/icons-material/StraightenRounded";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";

type DetailStatus = "Upcoming" | "Completed" | "Cancelled" | "Rejected";

interface DetailStop {
  name: string;
  time: string;
  distance: string | null;
  completed: boolean;
}

interface DetailTripData {
  id: string;
  status: DetailStatus;
  title: string;
  pickup: { location: string; timestamp: string };
  dropoff: { location: string; timestamp: string };
  sharedPassengers: Array<{ name: string; initials: string; id: string }>;
  bookedForLabel: string;
  tripStats: { distance: number; distanceCovered: number; totalTime: string };
  booking: { bookedAt: string; travelDate: string; tripDistance: string; fare: string };
  driver: { name: string; vehicle: string; licensePlate: string; rating: number };
  routeStops: DetailStop[];
  tripBreakdown: Array<{ time: string; distance: number }>;
  cancellationNote?: string;
}

type HistoryRouteState = {
  historyType?: "upcoming" | "past";
  rideData?: Record<string, unknown>;
} | null;

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function formatDateLabel(value?: string): string {
  if (!value) return "--";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function formatTimeLabel(value?: string): string {
  if (!value) return "--";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "--";
  return parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function parseDistanceKm(value: string): number {
  const parsed = Number.parseFloat(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeStatusLabel(value: string): DetailStatus {
  const normalized = value.toLowerCase();
  if (normalized.includes("cancel")) return "Cancelled";
  if (normalized.includes("reject")) return "Rejected";
  if (normalized.includes("complete")) return "Completed";
  return "Upcoming";
}

function buildBreakdown(totalDistanceKm: number, forCompleted: boolean): Array<{ time: string; distance: number }> {
  const slots = ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "1:00", "1:30"];
  if (!forCompleted) {
    return slots.map((time) => ({ time, distance: 0 }));
  }
  return slots.map((time, index) => ({
    time,
    distance: Math.round((totalDistanceKm * (index + 1)) / slots.length)
  }));
}

function getStatusChip(status: DetailStatus): { label: string; bg: string; color: string } {
  if (status === "Completed") return { label: "Completed", bg: "#00C851", color: "#FFFFFF" };
  if (status === "Cancelled") return { label: "Cancelled", bg: "#FCA5A5", color: "#991B1B" };
  if (status === "Rejected") return { label: "Rejected", bg: "#FEE2E2", color: "#B91C1C" };
  return { label: "Upcoming", bg: "#DBEAFE", color: "#1D4ED8" };
}

function CompletedTripSummaryScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { rideId } = useParams();
  const { ride } = useAppData();

  const routeState = (location.state as HistoryRouteState) ?? null;
  const rideDataFromState = routeState?.rideData ?? null;
  const historyTrip = ride.history.find((trip) => trip.id === rideId);

  const tripData = useMemo<DetailTripData>(() => {
    if (historyTrip) {
      const status = normalizeStatusLabel(historyTrip.status);
      const pickupLabel = historyTrip.pickup?.address || historyTrip.pickup?.label || "Pickup";
      const dropoffLabel = historyTrip.dropoff?.address || historyTrip.dropoff?.label || "Drop-off";
      const distance = historyTrip.distance || "0 km";
      const distanceKm = parseDistanceKm(distance);
      const startedAt = historyTrip.startedAt;
      const completedAt = historyTrip.completedAt;
      const routeStops = (historyTrip.routePoints?.length
        ? historyTrip.routePoints.map((point, index, arr) => {
            const first = index === 0;
            const last = index === arr.length - 1;
            return {
              name: point.address || point.label,
              time: first
                ? formatTimeLabel(startedAt)
                : last
                  ? formatTimeLabel(completedAt)
                  : "--",
              distance: first ? null : `${Math.max(0, Math.round((distanceKm / Math.max(1, arr.length - 1)) * index))} km`,
              completed: status === "Completed"
            };
          })
        : [
            {
              name: pickupLabel,
              time: formatTimeLabel(startedAt),
              distance: null,
              completed: status !== "Upcoming"
            },
            {
              name: dropoffLabel,
              time: formatTimeLabel(completedAt || startedAt),
              distance,
              completed: status === "Completed"
            }
          ]) as DetailStop[];

      const coveredDistance = status === "Completed" ? distanceKm : 0;

      return {
        id: historyTrip.id,
        status,
        title: "Ride Info",
        pickup: {
          location: pickupLabel,
          timestamp: formatTimeLabel(startedAt)
        },
        dropoff: {
          location: dropoffLabel,
          timestamp: formatTimeLabel(completedAt || startedAt)
        },
        sharedPassengers: [],
        bookedForLabel:
          historyTrip.bookedFor && historyTrip.bookedFor.source !== "self"
            ? `For: ${historyTrip.bookedFor.name || "Booked rider"}${historyTrip.bookedFor.phone ? ` (${historyTrip.bookedFor.phone})` : ""}`
            : "For: You",
        tripStats: {
          distance: distanceKm,
          distanceCovered: coveredDistance,
          totalTime: status === "Completed" ? "Completed" : status === "Cancelled" ? "Cancelled before completion" : "Not started"
        },
        booking: {
          bookedAt: formatTimeLabel(startedAt),
          travelDate: formatDateLabel(startedAt),
          tripDistance: distance,
          fare: historyTrip.fareEstimate || "UGX 0"
        },
        driver: {
          name: historyTrip.driver?.name || "Driver",
          vehicle: historyTrip.vehicle?.model || "EV",
          licensePlate: historyTrip.vehicle?.plate || "--",
          rating: historyTrip.driver?.rating || 4.5
        },
        routeStops,
        tripBreakdown: buildBreakdown(distanceKm, status === "Completed"),
        cancellationNote: status === "Cancelled" ? "This trip was cancelled before completion." : undefined
      };
    }

    if (rideDataFromState) {
      const stateStatus = normalizeStatusLabel(asString(rideDataFromState.status, routeState?.historyType === "upcoming" ? "Upcoming" : "Completed"));
      const hasUpcomingFields = typeof rideDataFromState.origin === "string" || typeof rideDataFromState.destination === "string";
      const pickupLocation = hasUpcomingFields
        ? asString(rideDataFromState.origin, "Pickup")
        : asString((rideDataFromState.pickup as { location?: unknown } | undefined)?.location, "Pickup");
      const dropoffLocation = hasUpcomingFields
        ? asString(rideDataFromState.destination, "Drop-off")
        : asString((rideDataFromState.dropoff as { location?: unknown } | undefined)?.location, "Drop-off");
      const distance = asString(rideDataFromState.distance, hasUpcomingFields ? "--" : "0 km");
      const distanceKm = parseDistanceKm(distance);
      const fare = asString(rideDataFromState.fare, "UGX 0");
      const routeStops: DetailStop[] = [
        {
          name: pickupLocation,
          time: hasUpcomingFields ? "--" : asString((rideDataFromState.pickup as { timestamp?: unknown } | undefined)?.timestamp, "--"),
          distance: null,
          completed: stateStatus === "Completed"
        },
        {
          name: dropoffLocation,
          time: hasUpcomingFields ? "--" : asString((rideDataFromState.dropoff as { timestamp?: unknown } | undefined)?.timestamp, "--"),
          distance,
          completed: stateStatus === "Completed"
        }
      ];

      return {
        id: asString(rideDataFromState.id, rideId || "ride"),
        status: routeState?.historyType === "upcoming" ? "Upcoming" : stateStatus,
        title: "Ride Info",
        pickup: { location: pickupLocation, timestamp: routeStops[0].time },
        dropoff: { location: dropoffLocation, timestamp: routeStops[1].time },
        sharedPassengers: [],
        bookedForLabel:
          (() => {
            const bookedFor = rideDataFromState.bookedFor as { source?: unknown; name?: unknown; phone?: unknown } | undefined;
            if (bookedFor && bookedFor.source !== "self") {
              const name = asString(bookedFor.name, "Booked rider");
              const phone = asString(bookedFor.phone, "");
              return `For: ${name}${phone ? ` (${phone})` : ""}`;
            }
            return "For: You";
          })(),
        tripStats: {
          distance: distanceKm,
          distanceCovered: routeState?.historyType === "upcoming" ? 0 : stateStatus === "Completed" ? distanceKm : 0,
          totalTime: routeState?.historyType === "upcoming" ? "Not started" : stateStatus === "Completed" ? "Completed" : "Cancelled before completion"
        },
        booking: {
          bookedAt: asString(rideDataFromState.bookedAt, "--"),
          travelDate: asString(rideDataFromState.date, "--"),
          tripDistance: distance,
          fare
        },
        driver: {
          name: asString((rideDataFromState.driver as { name?: unknown } | undefined)?.name, "Driver"),
          vehicle: asString((rideDataFromState.driver as { carModel?: unknown } | undefined)?.carModel, "EV"),
          licensePlate: asString((rideDataFromState.driver as { licensePlate?: unknown } | undefined)?.licensePlate, "--"),
          rating: Number((rideDataFromState.driver as { rating?: unknown } | undefined)?.rating ?? 4.5)
        },
        routeStops,
        tripBreakdown: buildBreakdown(distanceKm, stateStatus === "Completed"),
        cancellationNote: stateStatus === "Cancelled" ? "This ride was cancelled by the rider." : undefined
      };
    }

    return {
      id: rideId || "ride_001",
      status: "Upcoming",
      title: "Ride Info",
      pickup: { location: "Pickup", timestamp: "--" },
      dropoff: { location: "Drop-off", timestamp: "--" },
      sharedPassengers: [],
      bookedForLabel: "For: You",
      tripStats: { distance: 0, distanceCovered: 0, totalTime: "Not started" },
      booking: { bookedAt: "--", travelDate: "--", tripDistance: "--", fare: "UGX 0" },
      driver: { name: "Driver", vehicle: "EV", licensePlate: "--", rating: 4.5 },
      routeStops: [
        { name: "Pickup", time: "--", distance: null, completed: false },
        { name: "Drop-off", time: "--", distance: null, completed: false }
      ],
      tripBreakdown: buildBreakdown(0, false)
    };
  }, [historyTrip, rideDataFromState, rideId, routeState?.historyType]);

  const statusChip = getStatusChip(tripData.status);
  const maxDistance = Math.max(1, ...tripData.tripBreakdown.map((d) => d.distance));
  const showCompletedOnlySections = tripData.status === "Completed";

  const handleRateDriver = () => {
    navigate("/rides/rating/driver", {
      state: {
        driverName: tripData.driver.name,
        driverRating: tripData.driver.rating,
        rideId: tripData.id
      }
    });
  };

  return (
    <Box sx={{ px: uiTokens.spacing.xl, pt: uiTokens.spacing.xl, pb: uiTokens.spacing.xxl }}>
      <Box sx={{ mb: uiTokens.spacing.xl }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.mdPlus, mb: uiTokens.spacing.mdPlus }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: uiTokens.radius.xl,
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
              border: (theme) =>
                theme.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.sm, mb: uiTokens.spacing.xxs }}>
              <Chip
                label={statusChip.label}
                size="small"
                sx={{
                  bgcolor: statusChip.bg,
                  color: statusChip.color,
                  fontWeight: 600,
                  fontSize: 11,
                  height: 22,
                  borderRadius: uiTokens.radius.pill,
                  "& .MuiChip-label": { px: uiTokens.spacing.sm }
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
                {tripData.title}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {tripData.status === "Cancelled" && (
        <Card elevation={0} sx={{ mb: uiTokens.spacing.xl, borderRadius: uiTokens.radius.sm, border: "1px solid rgba(239,68,68,0.3)", bgcolor: "rgba(254,226,226,0.5)" }}>
          <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.md }}>
            <Typography variant="subtitle2" sx={{ color: "#991B1B", fontWeight: 700, mb: 0.45 }}>
              Ride cancelled
            </Typography>
            <Typography variant="body2" sx={{ color: "#7F1D1D" }}>
              {tripData.cancellationNote || "This ride was cancelled before it could be completed."}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Card elevation={0} sx={{ mb: uiTokens.spacing.xl, borderRadius: uiTokens.radius.sm, bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)", border: (t) => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)" }}>
        <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.lg }}>
          <Box sx={{ mb: uiTokens.spacing.lg }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: uiTokens.spacing.mdPlus, mb: uiTokens.spacing.mdPlus }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#22c55e", mt: 0.75, flexShrink: 0 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block", mb: 0.25 }}>
                  From
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, letterSpacing: "-0.01em", mb: 0.25 }}>
                  {tripData.pickup.location}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                  {tripData.pickup.timestamp}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: uiTokens.spacing.mdPlus }}>
              <PlaceRoundedIcon sx={{ fontSize: 20, color: "primary.main", mt: 0.5, flexShrink: 0 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block", mb: 0.25 }}>
                  To
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, letterSpacing: "-0.01em", mb: 0.25 }}>
                  {tripData.dropoff.location}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                  {tripData.dropoff.timestamp}
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" sx={{ fontSize: 11, color: "#B45309", fontWeight: 700, display: "block", mt: uiTokens.spacing.sm }}>
              {tripData.bookedForLabel}
            </Typography>
          </Box>

          <Box sx={{ pt: uiTokens.spacing.mdPlus, borderTop: "1px solid", borderColor: (t) => t.palette.divider }}>
            <Stack direction="row" spacing={uiTokens.spacing.lg}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}>
                  Distance
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {tripData.tripStats.distance} Km
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}>
                  Distance Covered
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {tripData.tripStats.distanceCovered} Km
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}>
                  Total Time
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {tripData.tripStats.totalTime}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ mb: uiTokens.spacing.xl, borderRadius: uiTokens.radius.sm, bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)", border: (t) => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)" }}>
        <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.lg }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: uiTokens.spacing.mdPlus, fontSize: 13 }}>
            Booking Summary
          </Typography>
          <Stack spacing={uiTokens.spacing.md}>
            <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.sm }}>
              <CalendarTodayRoundedIcon sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block", mb: uiTokens.spacing.xxs }}>
                  Booking Time
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Booked {tripData.booking.bookedAt}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.sm }}>
              <CalendarTodayRoundedIcon sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block", mb: uiTokens.spacing.xxs }}>
                  Travel Date
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {tripData.booking.travelDate}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.sm }}>
              <StraightenRoundedIcon sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block", mb: uiTokens.spacing.xxs }}>
                  Trip Distance
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {tripData.booking.tripDistance}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.sm }}>
              <ReceiptLongRoundedIcon sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block", mb: uiTokens.spacing.xxs }}>
                  Fare
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#22c55e" }}>
                  {tripData.booking.fare}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ mb: uiTokens.spacing.xl, borderRadius: uiTokens.radius.sm, bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)", border: (t) => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)" }}>
        <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.lg }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: uiTokens.spacing.mdPlus, fontSize: 13 }}>
            Driver
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.mdPlus, mb: uiTokens.spacing.lg }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main", fontSize: 20, fontWeight: 600 }}>
              {tripData.driver.name.substring(0, 2).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: uiTokens.spacing.xxs }}>
                {tripData.driver.name}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 12, color: (t) => t.palette.text.secondary, display: "block" }}>
                {tripData.driver.vehicle} – {tripData.driver.licensePlate}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.xxs, mt: uiTokens.spacing.xxs }}>
                <StarRoundedIcon sx={{ fontSize: 14, color: "#FFC107" }} />
                <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600 }}>
                  {tripData.driver.rating}
                </Typography>
              </Box>
            </Box>
          </Box>
          {showCompletedOnlySections && (
            <Button
              fullWidth
              variant="contained"
              onClick={handleRateDriver}
              sx={{
                bgcolor: "#F77F00",
                color: "#FFFFFF",
                borderRadius: uiTokens.radius.xl,
                py: uiTokens.spacing.md,
                fontSize: 13,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { bgcolor: "#E66A00" }
              }}
            >
              Rate Driver
            </Button>
          )}
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ mb: uiTokens.spacing.xl, borderRadius: uiTokens.radius.sm, bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)", border: (t) => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)" }}>
        <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.lg }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: uiTokens.spacing.mdPlus, fontSize: 13 }}>
            My Route
          </Typography>
          <Box sx={{ position: "relative", pl: 2 }}>
            <Box sx={{ position: "absolute", left: 7, top: 8, bottom: 8, width: 2, bgcolor: (t) => t.palette.mode === "light" ? "#E5E7EB" : "rgba(51,65,85,0.9)" }} />
            <Stack spacing={uiTokens.spacing.lg}>
              {tripData.routeStops.map((stop, index) => (
                <Box key={`${stop.name}-${index}`} sx={{ position: "relative" }}>
                  <Box
                    sx={{
                      position: "absolute",
                      left: -17,
                      top: 4,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: stop.completed ? "#22c55e" : "transparent",
                      border: stop.completed ? "2px solid #22c55e" : "2px solid",
                      borderColor: stop.completed ? "#22c55e" : (t) => t.palette.mode === "light" ? "#D1D5DB" : "#4B5563",
                      zIndex: 1
                    }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: uiTokens.spacing.xxs }}>
                      {stop.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.sm }}>
                      <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                        {stop.time}
                      </Typography>
                      {stop.distance && (
                        <>
                          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                            •
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                            {stop.distance}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {showCompletedOnlySections && (
        <Card elevation={0} sx={{ mb: uiTokens.spacing.xl, borderRadius: uiTokens.radius.sm, bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)", border: (t) => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)" }}>
          <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.lg }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: uiTokens.spacing.lg, fontSize: 13 }}>
              Trip Breakdown
            </Typography>
            <Box sx={{ position: "relative", height: 180, mb: 1 }}>
              <Box sx={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 30, display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", pr: 0.5 }}>
                {[50, 40, 30, 20, 10, 0].map((value) => (
                  <Typography key={value} variant="caption" sx={{ fontSize: 9, color: (t) => t.palette.text.secondary }}>
                    {value}
                  </Typography>
                ))}
              </Box>

              <Box sx={{ ml: 4, height: "100%", display: "flex", alignItems: "flex-end", gap: 0.5, position: "relative" }}>
                {tripData.tripBreakdown.map((data, index) => {
                  const heightPercent = (data.distance / maxDistance) * 100;
                  return (
                    <Box key={`${data.time}-${index}`} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.25 }}>
                      <Box sx={{ width: "100%", height: `${heightPercent}%`, minHeight: data.distance > 0 ? 4 : 0, bgcolor: "#03CD8C", borderRadius: "2px 2px 0 0", transition: "all 0.3s ease" }} />
                      <Typography variant="caption" sx={{ fontSize: 8, color: (t) => t.palette.text.secondary, writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)", height: 40, display: "flex", alignItems: "center" }}>
                        {data.time}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>

              <Typography variant="caption" sx={{ fontSize: 9, color: (t) => t.palette.text.secondary, position: "absolute", left: 12, top: "50%", transform: "rotate(-90deg) translateX(50%)", transformOrigin: "center" }}>
                Distance (KM)
              </Typography>
            </Box>

            <Box sx={{ ml: 4, display: "flex", justifyContent: "space-between", gap: 0.5 }}>
              {tripData.tripBreakdown.map((data, index) => (
                <Typography key={`${data.time}-label-${index}`} variant="caption" sx={{ fontSize: 9, color: (t) => t.palette.text.secondary, flex: 1, textAlign: "center" }}>
                  {data.time}
                </Typography>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {showCompletedOnlySections && (
        <Stack direction="row" spacing={uiTokens.spacing.md} sx={{ mb: uiTokens.spacing.mdPlus }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<ReceiptLongRoundedIcon sx={{ fontSize: 18 }} />}
            sx={{ borderRadius: uiTokens.radius.xl, py: uiTokens.spacing.md, fontSize: 13, textTransform: "none" }}
          >
            Download receipt
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FlagRoundedIcon sx={{ fontSize: 18 }} />}
            sx={{ borderRadius: uiTokens.radius.xl, py: uiTokens.spacing.md, fontSize: 13, textTransform: "none", borderColor: "#F97316", color: "#EA580C", "&:hover": { borderColor: "#EA580C", bgcolor: "rgba(248,153,56,0.06)" } }}
          >
            Report an issue
          </Button>
        </Stack>
      )}

      {tripData.status === "Cancelled" && (
        <Stack sx={{ mb: uiTokens.spacing.mdPlus }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FlagRoundedIcon sx={{ fontSize: 18 }} />}
            sx={{ borderRadius: uiTokens.radius.xl, py: uiTokens.spacing.md, fontSize: 13, textTransform: "none", borderColor: "#F97316", color: "#EA580C" }}
          >
            Contact support
          </Button>
        </Stack>
      )}

      <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
        You can always find this trip again from Rides → History if you need the details later.
      </Typography>
    </Box>
  );
}

export default function RiderScreen37CompletedTripSummaryCanvas_v2() {
  return <CompletedTripSummaryScreen />;
}
