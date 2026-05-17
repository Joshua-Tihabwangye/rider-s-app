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
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
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
  const [contentExtendedDown, setContentExtendedDown] = useState(false);

  const etaMinutes = getEtaMinutes(request.status);
  const driverLocation = useMemo(
    () => getApproachPoint(route, progress) ?? pickupCoords,
    [progress, route, pickupCoords]
  );

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
          mb: 1.4,
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

      <Box
        sx={{
          position: "relative",
          width: "100vw",
          ml: "calc(50% - 50vw)",
          mr: "calc(50% - 50vw)",
          height: contentExtendedDown
            ? { xs: "min(60vh, calc(100dvh - 220px))", sm: "min(64vh, calc(100dvh - 240px))" }
            : { xs: "min(48vh, calc(100dvh - 300px))", sm: "min(56vh, calc(100dvh - 280px))" },
          borderRadius: 0,
          overflow: "hidden",
          transition: "height 260ms ease"
        }}
      >
        <MapShell
          preset="compact"
          sx={{ height: "100%", width: "100%" }}
          rounded={false}
          showBackButton={false}
          pickupLocation={pickupCoords}
          dropoffLocation={destinationCoords}
          driverLocation={driverLocation}
          routePolyline={route}
        >
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

      <Box sx={{ display: "flex", justifyContent: "center", mt: 0.3, mb: 0.6 }}>
        <Button
          onClick={() => setContentExtendedDown((prev) => !prev)}
          startIcon={contentExtendedDown ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
          sx={{
            minWidth: 0,
            borderRadius: 999,
            px: 2,
            py: 0.5,
            textTransform: "none",
            fontWeight: 700,
            color: "#334155",
            bgcolor: "#F1F5F9",
            border: "1px solid var(--evz-border-subtle)",
            "&:hover": { bgcolor: "#E2E8F0" }
          }}
        >
          {contentExtendedDown ? "Show details" : "Extend map"}
        </Button>
      </Box>

      <Box
        sx={{
          transform: contentExtendedDown ? { xs: "translateY(8vh)", sm: "translateY(6vh)" } : "translateY(0)",
          transition: "transform 260ms ease"
        }}
      >
        <Card elevation={0} sx={{ mb: 1.3, borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.2 }}>
          {timeline.map((item, index) => {
            const complete = index < currentStep;
            const active = index === currentStep;
            return (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  gap: 1,
                  pb: index === timeline.length - 1 ? 0 : 1,
                  mb: index === timeline.length - 1 ? 0 : 1,
                  borderBottom: index === timeline.length - 1 ? "none" : "1px dashed var(--evz-border-subtle)"
                }}
              >
                <Stack alignItems="center">
                  {complete ? (
                    <CheckCircleRoundedIcon sx={{ color: "#059669", fontSize: 20 }} />
                  ) : active ? (
                    <CheckCircleRoundedIcon sx={{ color: "#059669", fontSize: 23 }} />
                  ) : (
                    <RadioButtonUncheckedRoundedIcon sx={{ color: "#94A3B8", fontSize: 20 }} />
                  )}
                  {index < timeline.length - 1 && (
                    <Box sx={{ width: 2, height: 22, bgcolor: complete ? "rgba(5,150,105,0.35)" : "rgba(148,163,184,0.35)" }} />
                  )}
                </Stack>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: active ? 800 : 600, fontSize: 14, color: active ? "#0F172A" : "#334155" }}>
                    {item.label}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#64748B" }}>{item.detail}</Typography>
                </Box>
                <Typography sx={{ fontWeight: active ? 700 : 500, color: active ? "#059669" : "#475569", fontSize: 12.5 }}>
                  {item.time}
                </Typography>
              </Box>
            );
          })}
        </Card>

        <Card elevation={0} sx={{ mb: 1.3, borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.2 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.1} alignItems={{ xs: "flex-start", sm: "center" }}>
            <Stack direction="row" spacing={1.1} alignItems="center" sx={{ width: "100%" }}>
              <Box
                sx={{
                  width: 74,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: "#F8FAFC",
                  border: "1px solid var(--evz-border-subtle)",
                  display: "grid",
                  placeItems: "center"
                }}
              >
                <LocalHospitalRoundedIcon sx={{ color: "#DC2626", fontSize: 36 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 21, fontWeight: 800, lineHeight: 1 }}>{request.assignedUnit ?? "ALS 04"}</Typography>
                <Typography sx={{ color: "#475569", fontSize: 14 }}>Advanced Life Support</Typography>
                <Chip size="small" label="ALS" sx={{ mt: 0.5, bgcolor: "rgba(5,150,105,0.1)", color: "#059669", fontWeight: 700 }} />
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.3} alignItems="center" sx={{ width: { xs: "100%", sm: "auto" } }}>
              <Stack alignItems="center" spacing={0.2} sx={{ minWidth: 82 }}>
                <Typography sx={{ fontSize: 12, color: "#64748B" }}>Driver</Typography>
                <PersonRoundedIcon sx={{ fontSize: 34, color: "#334155" }} />
                <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{request.driverName ?? "Rohit S."}</Typography>
                <Stack direction="row" spacing={0.2} alignItems="center">
                  <StarRoundedIcon sx={{ color: "#F59E0B", fontSize: 15 }} />
                  <Typography sx={{ fontSize: 12.5 }}>{request.status === "arrived" ? "4.9" : "4.8"}</Typography>
                </Stack>
              </Stack>

              <Stack alignItems="center" spacing={0.2} sx={{ minWidth: 82 }}>
                <Typography sx={{ fontSize: 12, color: "#64748B" }}>Paramedic</Typography>
                <PersonRoundedIcon sx={{ fontSize: 34, color: "#334155" }} />
                <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Priya M.</Typography>
                <Stack direction="row" spacing={0.2} alignItems="center">
                  <StarRoundedIcon sx={{ color: "#F59E0B", fontSize: 15 }} />
                  <Typography sx={{ fontSize: 12.5 }}>4.9</Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={0.8} sx={{ mt: 1.1 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<LocalPhoneRoundedIcon />}
              onClick={() => {
                const phone = request.driverPhone ?? "+256700000000";
                window.location.href = `tel:${phone}`;
              }}
              sx={{ borderRadius: 2, py: 0.95, textTransform: "none", color: "#059669", borderColor: "rgba(5,150,105,0.4)", fontWeight: 700 }}
            >
              Call ambulance
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ChatRoundedIcon />}
              onClick={() => navigate("/help")}
              sx={{ borderRadius: 2, py: 0.95, textTransform: "none", color: "#059669", borderColor: "rgba(5,150,105,0.4)", fontWeight: 700 }}
            >
              Message crew
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ShareRoundedIcon />}
              onClick={async () => {
                const text = `Track ambulance request ${request.id}. ETA ${etaMinutes} min.`;
                if (navigator.share) {
                  try {
                    await navigator.share({ text, url: window.location.href });
                    return;
                  } catch {
                    // no-op
                  }
                }
                try {
                  await navigator.clipboard.writeText(`${text} ${window.location.href}`);
                } catch {
                  // no-op
                }
              }}
              sx={{ borderRadius: 2, py: 0.95, textTransform: "none", color: "#059669", borderColor: "rgba(5,150,105,0.4)", fontWeight: 700 }}
            >
              Share tracking
            </Button>
          </Stack>
        </Card>

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
            py: 1.2,
            fontWeight: 700,
            fontSize: 15,
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
