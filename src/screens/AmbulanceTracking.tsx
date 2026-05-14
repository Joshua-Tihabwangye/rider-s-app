import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useAppData } from "../contexts/AppDataContext";
import MapShell from "../components/maps/MapShell";
import { getApproachPoint, normalizeRoute } from "../utils/mapRoutes";

interface TimelineItem {
  id: string;
  label: string;
  detail: string;
  time: string;
}

function formatTime(value?: string): string {
  if (!value) return "--:--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--:--";
  return date.toLocaleTimeString("en-UG", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getEtaMinutes(status: string): number {
  if (status === "arrived") return 0;
  if (status === "en_route") return 6;
  return 8;
}

function getCurrentStep(status: string): number {
  if (status === "requested") return 0;
  if (status === "assigned") return 1;
  if (status === "en_route") return 2;
  if (status === "arrived") return 3;
  if (status === "completed") return 4;
  return 2;
}

function AmbulanceLiveTrackingScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { ambulance, actions } = useAppData();
  const request = ambulance.request;

  const pickupCoords = request.pickup?.coordinates ?? { lat: 0.3136, lng: 32.5811 };
  const destinationCoords = request.destination?.coordinates ?? { lat: 0.3378, lng: 32.6071 };
  const route = normalizeRoute([pickupCoords, destinationCoords]);

  const [progress, setProgress] = useState(request.status === "arrived" ? 1 : 0.45);
  const etaMinutes = getEtaMinutes(request.status);
  const driverLocation = useMemo(() => getApproachPoint(route, progress) ?? pickupCoords, [progress, route, pickupCoords]);

  useEffect(() => {
    if (request.status !== "en_route") return undefined;
    const interval = window.setInterval(() => {
      setProgress((value) => Math.min(value + 0.05, 1));
    }, 1200);
    return () => window.clearInterval(interval);
  }, [request.status]);

  useEffect(() => {
    if (request.status === "idle" || request.status === "requested" || request.status === "assigned") {
      actions.updateAmbulanceRequest({
        status: "en_route",
        dispatchedAt: request.dispatchedAt ?? new Date().toISOString()
      });
    }
  }, [actions, request.dispatchedAt, request.status]);

  const timeline: TimelineItem[] = [
    {
      id: "requested",
      label: "Request received",
      detail: "Dispatch team accepted your request",
      time: formatTime(request.requestedAt)
    },
    {
      id: "assigned",
      label: "Ambulance assigned",
      detail: "Nearest available crew confirmed",
      time: formatTime(request.dispatchedAt)
    },
    {
      id: "en_route",
      label: "En route to pickup",
      detail: "Ambulance is on the way to pickup location",
      time: etaMinutes > 0 ? formatTime(new Date().toISOString()) : "Now"
    },
    {
      id: "picked",
      label: "Patient picked up",
      detail: "Crew has started transfer",
      time: request.arrivedAt ? formatTime(request.arrivedAt) : "--:--"
    },
    {
      id: "arriving",
      label: "Arriving at destination",
      detail: "Preparing hospital handoff",
      time: request.completedAt ? formatTime(request.completedAt) : "--:--"
    }
  ];

  const currentStep = getCurrentStep(request.status);
  const primaryLabel = request.status === "arrived" ? "Complete emergency trip" : "Mark ambulance arrived";

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 15 }}>
      <Box
        sx={{
          mb: 2,
          display: "grid",
          gridTemplateColumns: "42px 1fr auto",
          alignItems: "center",
          gap: 1
        }}
      >
        <IconButton
          size="small"
          onClick={() => navigate(-1)}
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.92)"),
            border: "1px solid var(--evz-border-subtle)"
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ color: "#059669", fontSize: 18 }} />
        </IconButton>

        <Typography variant="h5" sx={{ textAlign: "center", fontWeight: 700, fontSize: 20 }}>
          Track ambulance
        </Typography>

        <Chip
          icon={<HealthAndSafetyRoundedIcon sx={{ fontSize: 16 }} />}
          label="Emergency"
          sx={{
            height: 36,
            borderRadius: 2,
            bgcolor: "#EF4444",
            color: "#FFFFFF",
            fontWeight: 700
          }}
        />
      </Box>

      <Card elevation={0} sx={{ mb: 1.8, borderRadius: 3, border: "1px solid var(--evz-border-subtle)", overflow: "hidden" }}>
        <Box sx={{ position: "relative", height: 328 }}>
          <MapShell
            preset="compact"
            sx={{ height: "100%" }}
            rounded={false}
            showBackButton={false}
            pickupLocation={pickupCoords}
            dropoffLocation={destinationCoords}
            driverLocation={driverLocation}
            routePolyline={route}
            routeInfoLabel={`ETA ${etaMinutes} min`}
          >
            <Box sx={{ position: "absolute", top: 12, left: 12, right: 12, display: "flex", justifyContent: "space-between" }}>
              <Card elevation={3} sx={{ borderRadius: 2, px: 1.2, py: 0.9, minWidth: 170 }}>
                <Typography sx={{ color: "#059669", fontWeight: 700, fontSize: 14 }}>Pickup location</Typography>
                <Typography sx={{ fontSize: 13, color: "#334155" }}>
                  {request.pickup?.label ?? request.pickup?.address ?? "Pickup"}
                </Typography>
              </Card>

              <Card elevation={3} sx={{ borderRadius: 2, px: 1.2, py: 0.9 }}>
                <Typography sx={{ color: "#64748B", fontSize: 12 }}>ETA</Typography>
                <Typography sx={{ color: "#059669", fontWeight: 800, fontSize: 29, lineHeight: 1 }}>{etaMinutes} min</Typography>
              </Card>
            </Box>

            <Card
              elevation={3}
              sx={{
                position: "absolute",
                right: 12,
                top: 84,
                borderRadius: 2,
                px: 1.2,
                py: 0.9,
                minWidth: 185
              }}
            >
              <Typography sx={{ color: "#DC2626", fontWeight: 700, fontSize: 14 }}>Destination</Typography>
              <Typography sx={{ color: "#334155", fontSize: 13 }}>
                {request.destination?.label ?? request.destination?.address ?? "Destination"}
              </Typography>
            </Card>

            <IconButton
              size="small"
              sx={{
                position: "absolute",
                right: 16,
                bottom: 16,
                width: 46,
                height: 46,
                borderRadius: 2,
                bgcolor: "rgba(255,255,255,0.96)",
                border: "1px solid var(--evz-border-subtle)"
              }}
            >
              <MyLocationRoundedIcon />
            </IconButton>
          </MapShell>
        </Box>
      </Card>

      <Card elevation={0} sx={{ mb: 1.5, borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.4 }}>
        {timeline.map((item, index) => {
          const complete = index < currentStep;
          const active = index === currentStep;
          return (
            <Box key={item.id} sx={{ display: "flex", gap: 1.2, pb: index === timeline.length - 1 ? 0 : 1.2, mb: index === timeline.length - 1 ? 0 : 1.2, borderBottom: index === timeline.length - 1 ? "none" : "1px dashed var(--evz-border-subtle)" }}>
              <Stack alignItems="center">
                {complete ? (
                  <CheckCircleRoundedIcon sx={{ color: "#059669", fontSize: 22 }} />
                ) : active ? (
                  <CheckCircleRoundedIcon sx={{ color: "#059669", fontSize: 25 }} />
                ) : (
                  <RadioButtonUncheckedRoundedIcon sx={{ color: "#94A3B8", fontSize: 22 }} />
                )}
                {index < timeline.length - 1 && <Box sx={{ width: 2, height: 26, bgcolor: complete ? "rgba(5,150,105,0.35)" : "rgba(148,163,184,0.35)" }} />}
              </Stack>

              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: active ? 800 : 600, fontSize: 16, color: active ? "#0F172A" : "#334155" }}>{item.label}</Typography>
                <Typography sx={{ fontSize: 12.5, color: "#64748B" }}>{item.detail}</Typography>
              </Box>
              <Typography sx={{ fontWeight: active ? 700 : 500, color: active ? "#059669" : "#475569" }}>{item.time}</Typography>
            </Box>
          );
        })}
      </Card>

      <Card elevation={0} sx={{ mb: 1.5, borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.4 }}>
        <Stack direction="row" spacing={1.4} alignItems="center" sx={{ mb: 1.2 }}>
          <Box
            sx={{
              width: 88,
              height: 68,
              borderRadius: 2,
              bgcolor: "#F8FAFC",
              border: "1px solid var(--evz-border-subtle)",
              display: "grid",
              placeItems: "center"
            }}
          >
            <LocalHospitalRoundedIcon sx={{ color: "#DC2626", fontSize: 46 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{request.assignedUnit ?? "ALS 04"}</Typography>
            <Typography sx={{ color: "#475569" }}>Advanced Life Support</Typography>
            <Chip size="small" label="ALS" sx={{ mt: 0.6, bgcolor: "rgba(5,150,105,0.1)", color: "#059669", fontWeight: 700 }} />
          </Box>

          <Stack alignItems="center" spacing={0.2}>
            <Typography sx={{ fontSize: 12, color: "#64748B" }}>Driver</Typography>
            <PersonRoundedIcon sx={{ fontSize: 38, color: "#334155" }} />
            <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{request.driverName ?? "Rohit S."}</Typography>
            <Stack direction="row" spacing={0.2} alignItems="center">
              <StarRoundedIcon sx={{ color: "#F59E0B", fontSize: 16 }} />
              <Typography sx={{ fontSize: 13 }}>{request.status === "arrived" ? "4.9" : "4.8"}</Typography>
            </Stack>
          </Stack>

          <Stack alignItems="center" spacing={0.2}>
            <Typography sx={{ fontSize: 12, color: "#64748B" }}>Paramedic</Typography>
            <PersonRoundedIcon sx={{ fontSize: 38, color: "#334155" }} />
            <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Priya M.</Typography>
            <Stack direction="row" spacing={0.2} alignItems="center">
              <StarRoundedIcon sx={{ color: "#F59E0B", fontSize: 16 }} />
              <Typography sx={{ fontSize: 13 }}>4.9</Typography>
            </Stack>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<LocalPhoneRoundedIcon />}
            onClick={() => {
              const phone = request.driverPhone ?? "+256700000000";
              window.location.href = `tel:${phone}`;
            }}
            sx={{ borderRadius: 2, py: 1, textTransform: "none", color: "#059669", borderColor: "rgba(5,150,105,0.4)", fontWeight: 700 }}
          >
            Call ambulance
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<ChatRoundedIcon />}
            onClick={() => navigate("/help")}
            sx={{ borderRadius: 2, py: 1, textTransform: "none", color: "#059669", borderColor: "rgba(5,150,105,0.4)", fontWeight: 700 }}
          >
            Message crew
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<ShareRoundedIcon />}
            sx={{ borderRadius: 2, py: 1, textTransform: "none", color: "#059669", borderColor: "rgba(5,150,105,0.4)", fontWeight: 700 }}
          >
            Share tracking
          </Button>
        </Stack>
      </Card>

      <Stack direction="row" spacing={1.2} sx={{ mb: 1.8 }}>
        <Card elevation={0} sx={{ flex: 1, borderRadius: 2.5, border: "1px solid rgba(249,115,22,0.25)", px: 1.2, py: 1 }}>
          <Typography sx={{ color: "#EA580C", fontWeight: 700, fontSize: 15 }}>Emergency contact</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>{request.callerName ?? "Ravi Sharma"}</Typography>
          <Typography sx={{ color: "#475569", fontSize: 14 }}>{request.callerPhone ?? "+256 777 771 112"}</Typography>
        </Card>

        <Card elevation={0} sx={{ flex: 1, borderRadius: 2.5, border: "1px solid rgba(5,150,105,0.2)", px: 1.2, py: 1 }}>
          <Typography sx={{ color: "#059669", fontWeight: 700, fontSize: 15 }}>Destination</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>{request.destination?.label ?? "City Care Hospital"}</Typography>
          <Typography sx={{ color: "#475569", fontSize: 14 }}>{request.destination?.address ?? "Kampala"}</Typography>
        </Card>
      </Stack>

      <Button
        fullWidth
        variant="contained"
        endIcon={<ChevronRightRoundedIcon />}
        onClick={() => {
          if (request.status === "arrived") {
            const completedAt = new Date().toISOString();
            actions.updateAmbulanceRequest({ status: "completed", completedAt });
            navigate(`/ambulance/history/${request.id}`, {
              state: {
                requestSnapshot: {
                  ...request,
                  status: "completed",
                  completedAt
                }
              }
            });
            return;
          }

          const arrivedAt = new Date().toISOString();
          actions.updateAmbulanceRequest({ status: "arrived", arrivedAt });
          setProgress(1);
        }}
        sx={{
          borderRadius: 3,
          py: 1.3,
          fontWeight: 700,
          fontSize: 16,
          color: "#FFFFFF",
          background: "linear-gradient(90deg, #059669 0%, #EA580C 100%)",
          "&:hover": {
            background: "linear-gradient(90deg, #047857 0%, #C2410C 100%)"
          }
        }}
      >
        {primaryLabel}
      </Button>
    </Box>
  );
}

export default function RiderScreen87AmbulanceLiveTrackingCanvas_v2(): React.JSX.Element {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (t) => t.palette.background.default
      }}
    >
      <AmbulanceLiveTrackingScreen />
    </Box>
  );
}
