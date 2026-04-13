import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import { useAppData } from "../contexts/AppDataContext";
import type { AmbulanceRequest } from "../store/types";

type HistoryTab = "all" | "open" | "completed" | "cancelled";

interface DetailLineProps {
  label: string;
  value: string;
}

interface AmbulanceRequestCardProps {
  request: AmbulanceRequest;
  onViewDetails: (request: AmbulanceRequest) => void;
}

function toStatusLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getLocationLabel(location?: AmbulanceRequest["pickup"]): string {
  if (!location) return "Not set";
  return location.label ?? location.address ?? "Not set";
}

function getEventTimestamp(request: AmbulanceRequest): string | undefined {
  return (
    request.completedAt ??
    request.cancelledAt ??
    request.arrivedAt ??
    request.dispatchedAt ??
    request.requestedAt
  );
}

function formatDateTime(value?: string): string {
  if (!value) return "Date not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not recorded";
  return date.toLocaleString("en-UG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function DetailLine({ label, value }: DetailLineProps): React.JSX.Element {
  return (
    <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
      <Box component="span" sx={{ color: (t) => t.palette.text.primary, fontWeight: 600 }}>
        {label}: 
      </Box>
      {value}
    </Typography>
  );
}

function AmbulanceRequestCard({ request, onViewDetails }: AmbulanceRequestCardProps): React.JSX.Element {
  const statusLabel = toStatusLabel(request.status);
  const isCompleted = request.status === "completed";
  const isCancelled = request.status === "cancelled";
  const patientAge = request.patientAge ? `${request.patientAge} years` : "Not provided";
  const patientGender = request.patientGender ? toStatusLabel(request.patientGender) : "Not provided";

  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.75,
        borderRadius: 2,
        bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
        border: (t) =>
          t.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)"
      }}
    >
      <CardContent sx={{ px: 1.75, py: 1.6 }}>
        <Stack direction="row" spacing={1.4} alignItems="flex-start" sx={{ mb: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 5,
              bgcolor: (t) => (t.palette.mode === "light" ? "#FEE2E2" : "rgba(127,29,29,0.9)"),
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <LocalHospitalRoundedIcon sx={{ fontSize: 22, color: "#DC2626" }} />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
              <Typography variant="body2" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
                Ambulance request
              </Typography>
              <Chip
                size="small"
                label={statusLabel}
                sx={{
                  borderRadius: 5,
                  fontSize: 10,
                  height: 22,
                  bgcolor: isCompleted
                    ? "rgba(34,197,94,0.12)"
                    : isCancelled
                      ? "rgba(248,113,113,0.12)"
                      : "rgba(59,130,246,0.14)",
                  color: isCompleted ? "#16A34A" : isCancelled ? "#B91C1C" : "#1D4ED8"
                }}
              />
            </Stack>

            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              {formatDateTime(getEventTimestamp(request))}
            </Typography>

            <Stack spacing={0.4} sx={{ mt: 0.6 }}>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <PlaceRoundedIcon sx={{ fontSize: 15, color: (t) => t.palette.text.secondary }} />
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                  {getLocationLabel(request.pickup)} to {getLocationLabel(request.destination)}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={0.75} alignItems="center">
                <PersonRoundedIcon sx={{ fontSize: 15, color: (t) => t.palette.text.secondary }} />
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                  {request.patientName ?? "Unknown patient"} | {request.patientPhone ?? "No phone"}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={0.75} alignItems="center">
                <DirectionsCarFilledRoundedIcon sx={{ fontSize: 15, color: (t) => t.palette.text.secondary }} />
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                  {request.assignedUnit ?? "Unit pending"} | {request.ambulancePlateNumber ?? "Plate pending"}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={0.75} alignItems="center">
                <CallRoundedIcon sx={{ fontSize: 15, color: (t) => t.palette.text.secondary }} />
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                  Driver: {request.driverName ?? "Pending"} | {request.driverPhone ?? "No contact"}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ mb: 1.1 }} />

        <Stack spacing={0.25} sx={{ mb: 1.25 }}>
          <DetailLine label="ID" value={request.id} />
          <DetailLine label="Urgency" value={toStatusLabel(request.urgency)} />
          <DetailLine label="Patient age" value={patientAge} />
          <DetailLine label="Patient gender" value={patientGender} />
          <DetailLine label="Condition" value={request.patientCondition ?? "Not provided"} />
          <DetailLine label="Caller" value={`${request.callerName ?? "Not provided"} ${request.callerPhone ? `(${request.callerPhone})` : ""}`.trim()} />
          <DetailLine label="Notes" value={request.notes ?? "No additional notes"} />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Button
            size="small"
            variant="outlined"
            onClick={() => onViewDetails(request)}
            sx={{
              borderRadius: 5,
              px: 2,
              py: 0.4,
              fontSize: 12,
              textTransform: "none"
            }}
          >
            View full details
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function AmbulanceRequestsHistoryScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { ambulance } = useAppData();
  const [tab, setTab] = useState<HistoryTab>("all");

  const requests = useMemo(() => {
    const records = [ambulance.request, ...ambulance.history].filter(
      (item): item is AmbulanceRequest => Boolean(item?.id)
    );

    const byId = new Map<string, AmbulanceRequest>();
    records.forEach((item) => {
      if (!byId.has(item.id)) {
        byId.set(item.id, item);
      }
    });

    return [...byId.values()].sort((left, right) => {
      const leftTime = new Date(getEventTimestamp(left) ?? 0).getTime();
      const rightTime = new Date(getEventTimestamp(right) ?? 0).getTime();
      return rightTime - leftTime;
    });
  }, [ambulance.history, ambulance.request]);

  const filtered = requests.filter((request) => {
    if (tab === "all") return true;
    if (tab === "open") {
      return request.status !== "completed" && request.status !== "cancelled";
    }
    return request.status === tab;
  });

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 5,
              bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)"),
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
              Ambulance requests
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Full patient, route, driver and vehicle records
            </Typography>
          </Box>
        </Box>
      </Box>

      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
        {([
          { key: "all", label: "All" },
          { key: "open", label: "In progress" },
          { key: "completed", label: "Completed" },
          { key: "cancelled", label: "Cancelled" }
        ] as Array<{ key: HistoryTab; label: string }>).map((item) => (
          <Chip
            key={item.key}
            label={item.label}
            onClick={() => setTab(item.key)}
            size="small"
            sx={{
              borderRadius: 5,
              fontSize: 11,
              height: 26,
              bgcolor:
                tab === item.key
                  ? "primary.main"
                  : (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)"),
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)",
              color: tab === item.key ? "#020617" : (t) => t.palette.text.primary
            }}
          />
        ))}
      </Stack>

      {filtered.length === 0 ? (
        <Typography
          variant="caption"
          sx={{ mt: 4, display: "block", textAlign: "center", color: (t) => t.palette.text.secondary }}
        >
          No ambulance requests in this view yet.
        </Typography>
      ) : (
        filtered.map((request) => (
          <AmbulanceRequestCard
            key={request.id}
            request={request}
            onViewDetails={(selectedRequest) =>
              navigate(`/ambulance/history/${selectedRequest.id}`, {
                state: { requestSnapshot: selectedRequest }
              })
            }
          />
        ))
      )}
    </Box>
  );
}

export default function RiderScreen88AmbulanceRequestsHistoryCanvas_v2(): React.JSX.Element {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (t) => t.palette.background.default
      }}
    >
      <AmbulanceRequestsHistoryScreen />
    </Box>
  );
}
