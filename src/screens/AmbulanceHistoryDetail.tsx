import React, { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import type { AmbulanceRequest, AmbulanceStatus } from "../store/types";
import { useAppData } from "../contexts/AppDataContext";

interface LegacySnapshot {
  id: string;
  date?: string;
  from?: string;
  to?: string;
  status?: string;
}

type RequestSnapshot = (Partial<AmbulanceRequest> & { id: string }) | LegacySnapshot;

const VALID_STATUSES: AmbulanceStatus[] = [
  "idle",
  "requested",
  "assigned",
  "en_route",
  "arrived",
  "completed",
  "cancelled"
];

function normalizeStatus(value?: string): AmbulanceStatus {
  const normalized = value?.toLowerCase().replace(/\s+/g, "_") as AmbulanceStatus | undefined;
  return normalized && VALID_STATUSES.includes(normalized) ? normalized : "requested";
}

function toStatusLabel(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function getLocationLabel(location?: AmbulanceRequest["pickup"] | null): string {
  if (!location) return "Not set";
  return location.label ?? location.address ?? "Not set";
}

function formatDate(value?: string): string {
  if (!value) return "Date pending";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Date pending";
  return parsed.toLocaleDateString("en-UG", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function formatTime(value?: string): string {
  if (!value) return "--:--";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "--:--";
  return parsed.toLocaleTimeString("en-UG", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function buildSnapshot(snapshot?: RequestSnapshot): (Partial<AmbulanceRequest> & { id: string }) | null {
  if (!snapshot) return null;
  if ("pickup" in snapshot || "destination" in snapshot || "urgency" in snapshot) {
    return {
      ...snapshot,
      status: normalizeStatus(snapshot.status),
      urgency: snapshot.urgency ?? "medium"
    };
  }

  const legacy = snapshot as LegacySnapshot;
  return {
    id: legacy.id,
    status: normalizeStatus(legacy.status),
    urgency: "medium",
    requestedAt: legacy.date,
    pickup: legacy.from
      ? {
          label: legacy.from,
          address: legacy.from
        }
      : null,
    destination: legacy.to
      ? {
          label: legacy.to,
          address: legacy.to
        }
      : null
  };
}

export default function AmbulanceHistoryDetail(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { requestId = "" } = useParams<{ requestId: string }>();
  const { ambulance } = useAppData();

  const routeState = location.state as { requestSnapshot?: RequestSnapshot } | null;
  const snapshot = useMemo(() => buildSnapshot(routeState?.requestSnapshot), [routeState?.requestSnapshot]);

  const request = useMemo(() => {
    const all = [ambulance.request, ...ambulance.history];
    return all.find((item) => item.id === requestId) ?? null;
  }, [ambulance.history, ambulance.request, requestId]);

  const detail = request ?? snapshot;

  if (!detail) {
    return (
      <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2 }}>
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
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography sx={{ fontWeight: 700, fontSize: 22 }}>Request details</Typography>
        </Stack>
        <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid var(--evz-border-subtle)", p: 2 }}>
          <Typography sx={{ color: "#475569", mb: 1.2 }}>We could not find this ambulance request.</Typography>
          <Button onClick={() => navigate("/ambulance/history")} variant="outlined" sx={{ textTransform: "none" }}>
            Back to history
          </Button>
        </Card>
      </Box>
    );
  }

  const status = detail.status ?? "requested";
  const statusComplete = status === "completed";
  const emergency = detail.urgency === "high";

  const priceRows = [
    { label: "Base fare", amount: "UGX 1,800" },
    { label: "Distance charge (14.3 km)", amount: "UGX 700" },
    { label: "Medical equipment & supplies", amount: "UGX 500" },
    { label: "Taxes & fees", amount: "UGX 214" }
  ];

  const totalPaid = "UGX 3,214";

  const timeline = [
    { label: "Request received", at: detail.requestedAt },
    { label: "Ambulance assigned", at: detail.dispatchedAt },
    { label: "En route", at: detail.dispatchedAt },
    { label: "Patient picked up", at: detail.arrivedAt },
    { label: "Arrived at destination", at: detail.completedAt ?? detail.arrivedAt },
    { label: "Completed", at: detail.completedAt }
  ];

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 4 }}>
      <Box
        sx={{
          mb: 2,
          display: "grid",
          gridTemplateColumns: { xs: "42px 1fr", sm: "42px 1fr auto" },
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
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>

        <Typography variant="h5" sx={{ textAlign: "center", fontWeight: 700, fontSize: 20 }}>
          Request details
        </Typography>

        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Chip
            size="small"
            label={detail.id}
            sx={{
              height: 34,
              borderRadius: 2,
              bgcolor: "rgba(5,150,105,0.12)",
              color: "#047857",
              fontWeight: 700,
              fontSize: 13
            }}
          />
        </Box>
      </Box>
      <Box sx={{ mb: 1.2, display: { xs: "block", sm: "none" } }}>
        <Chip
          size="small"
          label={detail.id}
          sx={{
            height: 30,
            borderRadius: 2,
            bgcolor: "rgba(5,150,105,0.12)",
            color: "#047857",
            fontWeight: 700,
            fontSize: 12
          }}
        />
      </Box>

      <Card elevation={0} sx={{ mb: 1.6, borderRadius: 3, border: "1px solid var(--evz-border-subtle)", p: 1.6 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} alignItems={{ xs: "flex-start", sm: "center" }} sx={{ mb: 1.2 }}>
          <Box
            sx={{
              width: 66,
              height: 66,
              borderRadius: "50%",
              bgcolor: emergency ? "rgba(239,68,68,0.12)" : "rgba(5,150,105,0.12)",
              display: "grid",
              placeItems: "center"
            }}
          >
            <HealthAndSafetyRoundedIcon sx={{ color: emergency ? "#DC2626" : "#059669", fontSize: 34 }} />
          </Box>

          <Box sx={{ flex: 1, width: "100%" }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={0.8} alignItems={{ xs: "flex-start", sm: "center" }} sx={{ mb: 0.35 }}>
              <Chip
                size="small"
                label={emergency ? "Emergency" : "Transfer"}
                sx={{
                  bgcolor: emergency ? "rgba(239,68,68,0.12)" : "rgba(5,150,105,0.12)",
                  color: emergency ? "#DC2626" : "#059669",
                  fontWeight: 700
                }}
              />
              <Typography sx={{ fontWeight: 700, fontSize: { xs: 16, sm: 17 } }}>
                {emergency ? "Emergency ambulance" : "Patient transfer"}
              </Typography>
            </Stack>
            <Typography sx={{ color: "#475569", fontSize: 14 }}>Request type</Typography>
          </Box>

          <Stack alignItems={{ xs: "flex-start", sm: "flex-end" }} sx={{ width: { xs: "100%", sm: "auto" } }}>
            <Chip
              icon={<CheckCircleRoundedIcon sx={{ fontSize: 16 }} />}
              label={toStatusLabel(status)}
              sx={{
                bgcolor: statusComplete ? "rgba(5,150,105,0.14)" : "rgba(148,163,184,0.16)",
                color: statusComplete ? "#059669" : "#475569",
                fontWeight: 700,
                maxWidth: "100%",
                "& .MuiChip-label": {
                  px: 1,
                  whiteSpace: "nowrap"
                }
              }}
            />
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.6 }}>
              <CalendarTodayRoundedIcon sx={{ fontSize: 16, color: "#64748B" }} />
              <Typography sx={{ color: "#334155", fontSize: 13 }}>{formatDate(getEventTimestamp(detail))}</Typography>
            </Stack>
            <Typography sx={{ color: "#334155", fontSize: 13 }}>{formatTime(getEventTimestamp(detail))}</Typography>
          </Stack>
        </Stack>

        <Box sx={{ borderTop: "1px solid var(--evz-border-subtle)", pt: 1.2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Stack direction="row" spacing={1.1} alignItems="center">
            <Box
              sx={{
                width: 84,
                height: 46,
                borderRadius: 1.5,
                bgcolor: "#F8FAFC",
                border: "1px solid var(--evz-border-subtle)",
                display: "grid",
                placeItems: "center"
              }}
            >
              <LocalHospitalRoundedIcon sx={{ color: "#DC2626", fontSize: 30 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 17 }}>{detail.assignedUnit ?? "ALS Ambulance 04"}</Typography>
              <Typography sx={{ color: "#475569", fontSize: 14 }}>Selected ambulance</Typography>
            </Box>
          </Stack>

          <Button
            size="small"
            endIcon={<ChevronRightRoundedIcon sx={{ fontSize: 18 }} />}
            onClick={() => navigate("/ambulance/tracking")}
            sx={{ bgcolor: "rgba(5,150,105,0.1)", color: "#059669", textTransform: "none", fontWeight: 700, borderRadius: 2, px: 1.5 }}
          >
            View details
          </Button>
        </Box>
      </Card>

      <Card elevation={0} sx={{ mb: 1.2, borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.5 }}>
        <Stack direction="row" spacing={1.1}>
          <Stack alignItems="center" sx={{ pt: 0.15 }}>
            <PlaceRoundedIcon sx={{ color: "#059669", fontSize: 24 }} />
            <Box sx={{ width: 2, height: 26, borderLeft: "2px dashed rgba(5,150,105,0.4)" }} />
            <LocalHospitalRoundedIcon sx={{ color: "#EA580C", fontSize: 24 }} />
          </Stack>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" justifyContent="space-between" spacing={1}>
              <Box>
                <Typography sx={{ color: "#059669", fontWeight: 700, fontSize: 14 }}>Pickup location</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: 17 }}>{getLocationLabel(detail.pickup)}</Typography>
                <Typography sx={{ color: "#475569", fontSize: 14 }}>{detail.pickup?.address ?? "Kampala"}</Typography>
              </Box>
              <Typography sx={{ color: "#334155", fontSize: 15 }}>{formatTime(detail.requestedAt)}</Typography>
            </Stack>

            <Box sx={{ borderTop: "1px solid var(--evz-border-subtle)", my: 1 }} />

            <Stack direction="row" justifyContent="space-between" spacing={1}>
              <Box>
                <Typography sx={{ color: "#EA580C", fontWeight: 700, fontSize: 14 }}>Destination</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: 17 }}>{getLocationLabel(detail.destination)}</Typography>
                <Typography sx={{ color: "#475569", fontSize: 14 }}>{detail.destination?.address ?? "Kampala"}</Typography>
              </Box>
              <Typography sx={{ color: "#334155", fontSize: 15 }}>{formatTime(detail.completedAt ?? detail.arrivedAt)}</Typography>
            </Stack>
          </Box>
        </Stack>
      </Card>

      {[
        {
          title: "Patient details",
          value: `${detail.patientName ?? "Rahul Sharma"} • ${detail.patientAge ?? 38} years • Male`,
          subtitle: `Condition: ${detail.patientCondition ?? "Chest pain & breathlessness"}`,
          icon: <PersonRoundedIcon sx={{ color: "#059669" }} />,
          onView: () => navigate("/ambulance/location")
        },
        {
          title: "Crew details",
          value: `${detail.driverName ?? "Dr. Arjun Mehta"} (Paramedic)`,
          subtitle: `${detail.hospitalContactName ?? "Rohit Kumar"} (EMT)`,
          icon: <GroupsRoundedIcon sx={{ color: "#059669" }} />,
          onView: () => navigate("/ambulance/tracking")
        }
      ].map((item) => (
        <Card key={item.title} elevation={0} sx={{ mb: 1.2, borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.4 }}>
          <Stack direction="row" spacing={1.1} alignItems="center">
            <Box sx={{ width: 48, height: 48, borderRadius: "50%", bgcolor: "rgba(5,150,105,0.1)", display: "grid", placeItems: "center" }}>
              {item.icon}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 17 }}>{item.title}</Typography>
              <Typography sx={{ fontSize: 17 }}>{item.value}</Typography>
              <Typography sx={{ color: "#475569", fontSize: 14 }}>{item.subtitle}</Typography>
            </Box>
            <Button
              size="small"
              endIcon={<ChevronRightRoundedIcon sx={{ fontSize: 18 }} />}
              onClick={item.onView}
              sx={{ bgcolor: "rgba(5,150,105,0.1)", color: "#059669", textTransform: "none", fontWeight: 700, borderRadius: 2, px: 1.5 }}
            >
              View details
            </Button>
          </Stack>
        </Card>
      ))}

      <Card elevation={0} sx={{ mb: 1.2, borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.4 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 22, mb: 1.2 }}>Journey timeline</Typography>
        <Stack spacing={0.7}>
          {timeline.map((item, index) => (
            <Stack key={item.label} direction="row" spacing={1.1} alignItems="center" sx={{ pb: 0.6, borderBottom: index === timeline.length - 1 ? "none" : "1px dashed rgba(148,163,184,0.35)" }}>
              <CheckCircleRoundedIcon sx={{ color: "#059669", fontSize: 18 }} />
              <Typography sx={{ flex: 1, fontSize: 16 }}>{item.label}</Typography>
              <Typography sx={{ color: "#475569", fontSize: 15 }}>
                {formatDate(item.at)} • {formatTime(item.at)}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Card>

      <Card elevation={0} sx={{ mb: 1.6, borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.4 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 22, mb: 1.2 }}>Payment summary</Typography>
        <Stack spacing={0.8}>
          {priceRows.map((row) => (
            <Stack key={row.label} direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ color: "#334155", fontSize: 17 }}>{row.label}</Typography>
              <Typography sx={{ color: "#0F172A", fontSize: 17 }}>{row.amount}</Typography>
            </Stack>
          ))}
        </Stack>

        <Box sx={{ borderTop: "1px solid var(--evz-border-subtle)", mt: 1.1, pt: 1.1, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "rgba(5,150,105,0.08)", borderRadius: 2, px: 1.3, py: 1 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 20, color: "#047857" }}>Total paid</Typography>
          <Typography sx={{ fontWeight: 900, fontSize: 30, color: "#059669", lineHeight: 1 }}>{totalPaid}</Typography>
        </Box>
      </Card>

      <Stack direction="row" spacing={1.2}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<ReceiptLongRoundedIcon />}
          onClick={() => navigate("/wallet")}
          sx={{
            borderRadius: 2.5,
            py: 1.2,
            textTransform: "none",
            fontWeight: 700,
            bgcolor: "rgba(5,150,105,0.12)",
            color: "#059669",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "rgba(5,150,105,0.2)",
              boxShadow: "none"
            }
          }}
        >
          View receipt
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<SupportAgentRoundedIcon />}
          onClick={() => navigate("/help")}
          sx={{
            borderRadius: 2.5,
            py: 1.2,
            textTransform: "none",
            fontWeight: 700,
            color: "#059669",
            borderColor: "rgba(5,150,105,0.5)"
          }}
        >
          Contact support
        </Button>
      </Stack>
    </Box>
  );
}

function getEventTimestamp(detail: Partial<AmbulanceRequest> & { id: string }): string | undefined {
  return detail.completedAt ?? detail.cancelledAt ?? detail.arrivedAt ?? detail.dispatchedAt ?? detail.requestedAt;
}
