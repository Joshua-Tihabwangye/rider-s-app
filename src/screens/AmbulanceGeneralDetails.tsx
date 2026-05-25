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
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import type { AmbulanceRequest, AmbulanceStatus } from "../store/types";
import { useAppData } from "../contexts/AppDataContext";
import {
  ambulanceCompactTypographySx,
  ambulanceContainedButtonSx
} from "../components/ambulance/ambulanceTypography";

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
    pickup: legacy.from ? { label: legacy.from, address: legacy.from } : null,
    destination: legacy.to ? { label: legacy.to, address: legacy.to } : null
  };
}

function formatDateTime(value?: string): string {
  if (!value) return "Pending";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Pending";
  return parsed.toLocaleString("en-UG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatStatusLabel(status?: string): string {
  return (status ?? "requested").replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function AmbulanceGeneralDetails(): React.JSX.Element {
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
      <Box sx={[{ px: 2.5, pt: 2.5, pb: 3 }, ambulanceCompactTypographySx]}>
        <Button onClick={() => navigate("/ambulance/history")} sx={{ textTransform: "none" }}>
          Back to history
        </Button>
        <Typography sx={{ mt: 1, color: "#475569" }}>Request not found.</Typography>
      </Box>
    );
  }

  const emergency = detail.urgency === "high";
  const status = detail.status ?? "requested";

  return (
    <Box sx={[{ px: 2.5, pt: 2.5, pb: 4 }, ambulanceCompactTypographySx]}>
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
        <Typography sx={{ fontWeight: 700, fontSize: 20 }}>General request details</Typography>
      </Stack>

      <Card elevation={0} sx={{ mb: 1.2, borderRadius: 3, border: "1px solid var(--evz-border-subtle)", p: 1.5 }}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              bgcolor: emergency ? "rgba(239,68,68,0.12)" : "rgba(5,150,105,0.12)",
              display: "grid",
              placeItems: "center"
            }}
          >
            <HealthAndSafetyRoundedIcon sx={{ color: emergency ? "#DC2626" : "#059669", fontSize: 30 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
              {emergency ? "Emergency ambulance request" : "Patient transfer request"}
            </Typography>
            <Typography sx={{ color: "#475569" }}>Request ID: {detail.id}</Typography>
          </Box>
          <Chip
            label={formatStatusLabel(status)}
            sx={{ bgcolor: "rgba(5,150,105,0.12)", color: "#047857", fontWeight: 700 }}
          />
        </Stack>
      </Card>

      <Card elevation={0} sx={{ mb: 1.2, borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.4 }}>
        <Typography sx={{ fontWeight: 700, mb: 0.8 }}>Request timeline</Typography>
        <Stack spacing={0.6}>
          <Typography sx={{ color: "#334155" }}>Requested: {formatDateTime(detail.requestedAt)}</Typography>
          <Typography sx={{ color: "#334155" }}>Dispatched: {formatDateTime(detail.dispatchedAt)}</Typography>
          <Typography sx={{ color: "#334155" }}>Arrived: {formatDateTime(detail.arrivedAt)}</Typography>
          <Typography sx={{ color: "#334155" }}>Completed: {formatDateTime(detail.completedAt)}</Typography>
          <Typography sx={{ color: "#334155" }}>Cancelled: {formatDateTime(detail.cancelledAt)}</Typography>
        </Stack>
      </Card>

      <Card elevation={0} sx={{ mb: 1.2, borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.4 }}>
        <Typography sx={{ fontWeight: 700, mb: 0.8 }}>Locations</Typography>
        <Stack spacing={0.7}>
          <Stack direction="row" spacing={0.8} alignItems="center">
            <PlaceRoundedIcon sx={{ color: "#059669", fontSize: 18 }} />
            <Typography sx={{ color: "#334155", flex: 1 }}>
              Pickup: {detail.pickup?.label ?? detail.pickup?.address ?? "Not set"}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.8} alignItems="center">
            <LocalHospitalRoundedIcon sx={{ color: "#EA580C", fontSize: 18 }} />
            <Typography sx={{ color: "#334155", flex: 1 }}>
              Destination: {detail.destination?.label ?? detail.destination?.address ?? "Not set"}
            </Typography>
          </Stack>
        </Stack>
      </Card>

      <Card elevation={0} sx={{ mb: 1.2, borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.4 }}>
        <Typography sx={{ fontWeight: 700, mb: 0.8 }}>Patient & caller details</Typography>
        <Stack spacing={0.6}>
          <Stack direction="row" spacing={0.8} alignItems="center">
            <PersonRoundedIcon sx={{ color: "#059669", fontSize: 18 }} />
            <Typography sx={{ color: "#334155", flex: 1 }}>
              Patient: {detail.patientName ?? "Not provided"} • {detail.patientAge ?? "-"} yrs • {detail.patientGender ?? "-"}
            </Typography>
          </Stack>
          <Typography sx={{ color: "#334155" }}>Patient phone: {detail.patientPhone ?? "Not provided"}</Typography>
          <Typography sx={{ color: "#334155" }}>Patient ID: {detail.patientIdNumber ?? "Not provided"}</Typography>
          <Typography sx={{ color: "#334155" }}>Condition: {detail.patientCondition ?? "Not provided"}</Typography>
          <Typography sx={{ color: "#334155" }}>Requested for: {detail.forWhom ?? "Not provided"}</Typography>
          <Typography sx={{ color: "#334155" }}>Caller: {detail.callerName ?? "Not provided"}</Typography>
          <Typography sx={{ color: "#334155" }}>Caller phone: {detail.callerPhone ?? "Not provided"}</Typography>
        </Stack>
      </Card>

      <Card elevation={0} sx={{ mb: 1.2, borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.4 }}>
        <Typography sx={{ fontWeight: 700, mb: 0.8 }}>Crew members</Typography>
        <Stack spacing={1}>
          <Card elevation={0} sx={{ borderRadius: 2, border: "1px solid var(--evz-border-subtle)", p: 1.1 }}>
            <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 0.5 }}>
              <GroupsRoundedIcon sx={{ color: "#059669", fontSize: 18 }} />
              <Typography sx={{ fontWeight: 700 }}>Lead crew (driver/paramedic)</Typography>
            </Stack>
            <Typography sx={{ color: "#334155" }}>Name: {detail.driverName ?? "Not provided"}</Typography>
            <Typography sx={{ color: "#334155" }}>Phone: {detail.driverPhone ?? "Not provided"}</Typography>
            <Typography sx={{ color: "#334155" }}>License: {detail.driverLicenseNumber ?? "Not provided"}</Typography>
          </Card>

          <Card elevation={0} sx={{ borderRadius: 2, border: "1px solid var(--evz-border-subtle)", p: 1.1 }}>
            <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 0.5 }}>
              <LocalPhoneRoundedIcon sx={{ color: "#059669", fontSize: 18 }} />
              <Typography sx={{ fontWeight: 700 }}>Support crew / hospital contact</Typography>
            </Stack>
            <Typography sx={{ color: "#334155" }}>Name: {detail.hospitalContactName ?? "Not provided"}</Typography>
            <Typography sx={{ color: "#334155" }}>Phone: {detail.hospitalContactPhone ?? "Not provided"}</Typography>
          </Card>

          <Card elevation={0} sx={{ borderRadius: 2, border: "1px solid var(--evz-border-subtle)", p: 1.1 }}>
            <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 0.5 }}>
              <DirectionsCarRoundedIcon sx={{ color: "#059669", fontSize: 18 }} />
              <Typography sx={{ fontWeight: 700 }}>Vehicle / unit details</Typography>
            </Stack>
            <Typography sx={{ color: "#334155" }}>Assigned unit: {detail.assignedUnit ?? "Not provided"}</Typography>
            <Typography sx={{ color: "#334155" }}>Plate number: {detail.ambulancePlateNumber ?? "Not provided"}</Typography>
          </Card>
        </Stack>
      </Card>

      <Card elevation={0} sx={{ mb: 1.4, borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.4 }}>
        <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 0.5 }}>
          <BadgeRoundedIcon sx={{ color: "#059669", fontSize: 18 }} />
          <Typography sx={{ fontWeight: 700 }}>Operational notes</Typography>
        </Stack>
        <Typography sx={{ color: "#334155" }}>{detail.notes ?? "No notes provided."}</Typography>
      </Card>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<ReceiptLongRoundedIcon />}
          onClick={() => navigate(`/ambulance/history/${detail.id}/receipt`)}
          sx={{ borderRadius: 2.5, py: 1.1, textTransform: "none", fontWeight: 700, ...ambulanceContainedButtonSx }}
        >
          View receipt
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<CalendarTodayRoundedIcon />}
          onClick={() => navigate(`/ambulance/history/${detail.id}`)}
          sx={{ borderRadius: 2.5, py: 1.1, textTransform: "none", fontWeight: 700, color: "#059669", borderColor: "rgba(5,150,105,0.5)" }}
        >
          Back to request summary
        </Button>
      </Stack>
    </Box>
  );
}

