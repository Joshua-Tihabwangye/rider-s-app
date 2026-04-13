import React, { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Chip,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import AppCard from "../components/primitives/AppCard";
import { useAppData } from "../contexts/AppDataContext";
import { uiTokens } from "../design/tokens";
import type { AmbulanceRequest, AmbulanceStatus } from "../store/types";

interface DetailRowProps {
  label: string;
  value: string;
}

interface LegacySnapshot {
  id: string;
  date?: string;
  from?: string;
  to?: string;
  status?: string;
}

type RequestSnapshot = (Partial<AmbulanceRequest> & { id: string }) | LegacySnapshot;

const VALID_AMBULANCE_STATUSES: AmbulanceStatus[] = [
  "idle",
  "requested",
  "assigned",
  "en_route",
  "arrived",
  "completed",
  "cancelled"
];

function toStatusLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeStatus(value?: string): AmbulanceStatus {
  const normalized = value?.toLowerCase().replace(/\s+/g, "_") as AmbulanceStatus | undefined;
  return normalized && VALID_AMBULANCE_STATUSES.includes(normalized) ? normalized : "requested";
}

function getLocationLabel(location?: AmbulanceRequest["pickup"]): string {
  if (!location) return "Not set";
  return location.label ?? location.address ?? "Not set";
}

function formatDateTime(value?: string): string {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return date.toLocaleString("en-UG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function buildSnapshot(snapshot?: RequestSnapshot): (Partial<AmbulanceRequest> & { id: string }) | null {
  if (!snapshot) return null;

  if ("pickup" in snapshot || "destination" in snapshot || "urgency" in snapshot) {
    return {
      id: snapshot.id,
      ...snapshot,
      status: normalizeStatus(snapshot.status),
      urgency: snapshot.urgency ?? "medium"
    };
  }

  return {
    id: snapshot.id,
    status: normalizeStatus(snapshot.status),
    urgency: "medium",
    requestedAt: snapshot.date,
    pickup: snapshot.from
      ? {
          label: snapshot.from,
          address: snapshot.from
        }
      : null,
    destination: snapshot.to
      ? {
          label: snapshot.to,
          address: snapshot.to
        }
      : null
  };
}

function DetailRow({ label, value }: DetailRowProps): React.JSX.Element {
  return (
    <Typography variant="body2">
      <Typography component="span" variant="body2" sx={{ fontWeight: 700 }}>
        {label}: 
      </Typography>
      {value}
    </Typography>
  );
}

export default function AmbulanceHistoryDetail(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { requestId = "" } = useParams<{ requestId: string }>();
  const { ambulance } = useAppData();

  const routeState = location.state as { requestSnapshot?: RequestSnapshot } | null;
  const snapshot = useMemo(() => buildSnapshot(routeState?.requestSnapshot), [routeState?.requestSnapshot]);

  const request = useMemo(() => {
    const allRequests = [ambulance.request, ...ambulance.history];
    return allRequests.find((item) => item.id === requestId) ?? null;
  }, [ambulance.history, ambulance.request, requestId]);

  const detail = request ?? snapshot;

  if (!detail) {
    return (
      <ScreenScaffold>
        <SectionHeader
          title="Ambulance request"
          subtitle="Request not found"
          leadingAction={
            <IconButton size="small" aria-label="Back" onClick={() => navigate(-1)}>
              <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          }
        />
        <Typography variant="body2" sx={{ color: (t) => t.palette.text.secondary, mb: 1.5 }}>
          We could not find this ambulance request.
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate("/ambulance/history")}
          sx={{ textTransform: "none", width: "fit-content" }}
        >
          Back to ambulance history
        </Button>
      </ScreenScaffold>
    );
  }

  const status = detail.status ?? "requested";
  const urgency = detail.urgency ?? "medium";
  const statusLabel = toStatusLabel(status);
  const urgencyLabel = toStatusLabel(urgency);
  const fromLabel = getLocationLabel(detail.pickup);
  const toLabel = getLocationLabel(detail.destination);

  const statusTone =
    status === "completed"
      ? { bg: "rgba(34,197,94,0.12)", fg: "#15803D" }
      : status === "cancelled"
        ? { bg: "rgba(248,113,113,0.14)", fg: "#B91C1C" }
        : { bg: "rgba(59,130,246,0.14)", fg: "#1D4ED8" };

  const urgencyTone =
    urgency === "high"
      ? { bg: "rgba(248,113,113,0.16)", fg: "#B91C1C" }
      : urgency === "medium"
        ? { bg: "rgba(251,191,36,0.18)", fg: "#92400E" }
        : { bg: "rgba(59,130,246,0.14)", fg: "#1D4ED8" };

  return (
    <ScreenScaffold>
      <SectionHeader
        title={`Ambulance ${detail.id}`}
        subtitle="Full request details"
        leadingAction={
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: uiTokens.radius.xl,
              bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)"),
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        }
      />

      <AppCard>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <LocalHospitalRoundedIcon sx={{ color: "#DC2626", fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Request status
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.8}>
              <Chip size="small" label={statusLabel} sx={{ bgcolor: statusTone.bg, color: statusTone.fg }} />
              <Chip size="small" label={`Urgency: ${urgencyLabel}`} sx={{ bgcolor: urgencyTone.bg, color: urgencyTone.fg }} />
            </Stack>
          </Stack>
          <DetailRow label="From" value={fromLabel} />
          <DetailRow label="To" value={toLabel} />
          <DetailRow label="Request ID" value={detail.id} />
        </Stack>
      </AppCard>

      <AppCard variant="muted">
        <Stack spacing={0.8}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Timeline
          </Typography>
          <DetailRow label="Requested at" value={formatDateTime(detail.requestedAt)} />
          <DetailRow label="Dispatched at" value={formatDateTime(detail.dispatchedAt)} />
          <DetailRow label="Arrived at" value={formatDateTime(detail.arrivedAt)} />
          <DetailRow label="Completed at" value={formatDateTime(detail.completedAt)} />
          <DetailRow label="Cancelled at" value={formatDateTime(detail.cancelledAt)} />
        </Stack>
      </AppCard>

      <AppCard variant="muted">
        <Stack spacing={0.8}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Patient details
          </Typography>
          <DetailRow label="Patient name" value={detail.patientName ?? "Not provided"} />
          <DetailRow label="Patient phone" value={detail.patientPhone ?? "Not provided"} />
          <DetailRow label="Patient age" value={detail.patientAge ? `${detail.patientAge} years` : "Not provided"} />
          <DetailRow label="Patient gender" value={detail.patientGender ? toStatusLabel(detail.patientGender) : "Not provided"} />
          <DetailRow label="Patient ID" value={detail.patientIdNumber ?? "Not provided"} />
          <DetailRow label="Condition" value={detail.patientCondition ?? "Not provided"} />
          <DetailRow label="Request for" value={detail.forWhom ? toStatusLabel(detail.forWhom) : "Not specified"} />
        </Stack>
      </AppCard>

      <AppCard variant="muted">
        <Stack spacing={0.8}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Ambulance and team
          </Typography>
          <DetailRow label="Assigned unit" value={detail.assignedUnit ?? "Pending assignment"} />
          <DetailRow label="Number plate" value={detail.ambulancePlateNumber ?? "Pending assignment"} />
          <DetailRow label="Driver name" value={detail.driverName ?? "Pending assignment"} />
          <DetailRow label="Driver phone" value={detail.driverPhone ?? "Not provided"} />
          <DetailRow label="Driver license" value={detail.driverLicenseNumber ?? "Not provided"} />
          <DetailRow label="Hospital contact" value={detail.hospitalContactName ?? "Not provided"} />
          <DetailRow label="Hospital phone" value={detail.hospitalContactPhone ?? "Not provided"} />
        </Stack>
      </AppCard>

      <AppCard variant="muted">
        <Stack spacing={0.8}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Caller and notes
          </Typography>
          <DetailRow label="Caller name" value={detail.callerName ?? "Not provided"} />
          <DetailRow label="Caller phone" value={detail.callerPhone ?? "Not provided"} />
          <DetailRow label="Notes" value={detail.notes ?? "No additional notes"} />
        </Stack>
      </AppCard>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <Button
          variant="outlined"
          onClick={() => navigate("/ambulance/history")}
          sx={{ textTransform: "none" }}
        >
          Back to history
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/ambulance/location")}
          sx={{ textTransform: "none" }}
        >
          New ambulance request
        </Button>
      </Stack>
    </ScreenScaffold>
  );
}
