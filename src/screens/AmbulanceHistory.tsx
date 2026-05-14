import React, { useMemo, useState } from "react";
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
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";
import TransferWithinAStationRoundedIcon from "@mui/icons-material/TransferWithinAStationRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import type { AmbulanceRequest } from "../store/types";
import { useAppData } from "../contexts/AppDataContext";

type HistoryFilter = "all" | "emergency" | "transfer" | "completed";

function formatDateTime(value?: string): { date: string; time: string } {
  if (!value) return { date: "Date pending", time: "--:--" };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { date: "Date pending", time: "--:--" };
  return {
    date: date.toLocaleDateString("en-UG", { day: "2-digit", month: "short", year: "numeric" }),
    time: date.toLocaleTimeString("en-UG", { hour: "2-digit", minute: "2-digit" })
  };
}

function isEmergencyRequest(request: AmbulanceRequest): boolean {
  return request.urgency === "high" || (request.forWhom ?? "me") === "me";
}

function getEventTimestamp(request: AmbulanceRequest): string | undefined {
  return request.completedAt ?? request.cancelledAt ?? request.arrivedAt ?? request.dispatchedAt ?? request.requestedAt;
}

function statusTone(status: string): { bg: string; fg: string } {
  if (status === "completed") return { bg: "rgba(5,150,105,0.14)", fg: "#059669" };
  if (status === "cancelled") return { bg: "rgba(239,68,68,0.14)", fg: "#DC2626" };
  if (status === "assigned" || status === "en_route") return { bg: "rgba(234,88,12,0.14)", fg: "#EA580C" };
  return { bg: "rgba(148,163,184,0.18)", fg: "#475569" };
}

function toStatusLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function AmbulanceHistoryCard({ request, onOpen }: { request: AmbulanceRequest; onOpen: () => void }): React.JSX.Element {
  const tone = statusTone(request.status);
  const timestamp = formatDateTime(getEventTimestamp(request));
  const emergency = isEmergencyRequest(request);

  return (
    <Card
      elevation={0}
      onClick={onOpen}
      sx={{
        borderRadius: 3,
        border: "1px solid var(--evz-border-subtle)",
        p: 1.8,
        cursor: "pointer"
      }}
    >
      <Stack direction="row" spacing={1.4}>
        <Box
          sx={{
            width: 68,
            height: 68,
            borderRadius: "50%",
            bgcolor: emergency ? "rgba(239,68,68,0.1)" : "rgba(5,150,105,0.1)",
            display: "grid",
            placeItems: "center",
            flexShrink: 0
          }}
        >
          {emergency ? (
            <HealthAndSafetyRoundedIcon sx={{ color: "#DC2626", fontSize: 34 }} />
          ) : (
            <TransferWithinAStationRoundedIcon sx={{ color: "#059669", fontSize: 34 }} />
          )}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: 20, lineHeight: 1.15 }}>{request.id}</Typography>
              <Typography sx={{ color: "#334155", fontSize: 16, mt: 0.2 }}>
                {emergency ? "Emergency ambulance" : "Patient transfer"}
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                <DirectionsCarFilledIcon sx={{ color: "#64748B", fontSize: 17 }} />
                <Typography sx={{ color: "#475569", fontSize: 14 }}>
                  {request.assignedUnit ?? "Advanced Life Support"}
                </Typography>
              </Stack>
            </Box>

            <Stack alignItems="flex-end" spacing={0.45}>
              <Chip
                size="small"
                label={toStatusLabel(request.status)}
                sx={{ bgcolor: tone.bg, color: tone.fg, fontWeight: 700, borderRadius: 2, height: 30 }}
              />
              <Typography sx={{ color: "#334155", fontSize: 14 }}>{timestamp.date}</Typography>
              <Typography sx={{ color: "#334155", fontSize: 14 }}>{timestamp.time}</Typography>
            </Stack>
          </Stack>

          {request.status === "cancelled" && (
            <Chip
              icon={<InfoOutlinedIcon sx={{ fontSize: 16 }} />}
              label="Cancelled by user"
              size="small"
              sx={{ mt: 1, bgcolor: "rgba(239,68,68,0.12)", color: "#DC2626", fontWeight: 600 }}
            />
          )}

          {request.status === "completed" && (
            <Button
              size="small"
              startIcon={<ReplayRoundedIcon />}
              sx={{
                mt: 1,
                borderRadius: 2,
                border: "1px solid rgba(5,150,105,0.55)",
                color: "#059669",
                textTransform: "none",
                fontWeight: 700
              }}
            >
              Book again
            </Button>
          )}
        </Box>

        <ChevronRightRoundedIcon sx={{ color: "#64748B", alignSelf: "center", mt: 0.3 }} />
      </Stack>
    </Card>
  );
}

function AmbulanceRequestsHistoryScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { ambulance } = useAppData();
  const [filter, setFilter] = useState<HistoryFilter>("all");

  const requests = useMemo(() => {
    const merged = [ambulance.request, ...ambulance.history].filter(
      (item): item is AmbulanceRequest => Boolean(item?.id)
    );
    const seen = new Map<string, AmbulanceRequest>();
    for (const item of merged) {
      if (!seen.has(item.id)) {
        seen.set(item.id, item);
      }
    }
    return [...seen.values()].sort((left, right) => {
      const leftTime = new Date(getEventTimestamp(left) ?? 0).getTime();
      const rightTime = new Date(getEventTimestamp(right) ?? 0).getTime();
      return rightTime - leftTime;
    });
  }, [ambulance.history, ambulance.request]);

  const stats = useMemo(() => {
    const total = requests.length;
    const completed = requests.filter((request) => request.status === "completed").length;
    const scheduled = requests.filter((request) => request.status === "requested" || request.status === "assigned").length;
    return { total, completed, scheduled };
  }, [requests]);

  const visible = useMemo(() => {
    return requests.filter((request) => {
      if (filter === "completed") return request.status === "completed";
      if (filter === "emergency") return isEmergencyRequest(request);
      if (filter === "transfer") return !isEmergencyRequest(request);
      return true;
    });
  }, [filter, requests]);

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      <Box
        sx={{
          mb: 2,
          display: "grid",
          gridTemplateColumns: "42px 1fr 42px",
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
          Ambulance history
        </Typography>

        <IconButton
          size="small"
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.92)"),
            border: "1px solid var(--evz-border-subtle)"
          }}
        >
          <FilterAltOutlinedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      <Stack direction="row" spacing={1.2} sx={{ mb: 1.8 }}>
        {[
          {
            key: "total",
            label: "Total requests",
            value: stats.total,
            icon: <LocalHospitalRoundedIcon sx={{ color: "#059669", fontSize: 26 }} />, 
            bg: "rgba(5,150,105,0.1)"
          },
          {
            key: "completed",
            label: "Completed",
            value: stats.completed,
            icon: <CheckCircleRoundedIcon sx={{ color: "#059669", fontSize: 26 }} />,
            bg: "rgba(5,150,105,0.1)"
          },
          {
            key: "scheduled",
            label: "Scheduled",
            value: stats.scheduled,
            icon: <CalendarMonthRoundedIcon sx={{ color: "#EA580C", fontSize: 26 }} />,
            bg: "rgba(234,88,12,0.1)"
          }
        ].map((item) => (
          <Card key={item.key} elevation={0} sx={{ flex: 1, borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.4 }}>
            <Box sx={{ width: 52, height: 52, borderRadius: "50%", bgcolor: item.bg, display: "grid", placeItems: "center", mx: "auto", mb: 0.9 }}>
              {item.icon}
            </Box>
            <Typography sx={{ textAlign: "center", fontWeight: 800, fontSize: 24, lineHeight: 1.1, color: item.key === "scheduled" ? "#EA580C" : "#059669" }}>
              {item.value}
            </Typography>
            <Typography sx={{ textAlign: "center", color: "#475569", fontSize: 16 }}>{item.label}</Typography>
          </Card>
        ))}
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 1.8, overflowX: "auto", pb: 0.2 }}>
        {[
          { id: "all", label: "All", icon: <></> },
          { id: "emergency", label: "Emergency", icon: <HealthAndSafetyRoundedIcon sx={{ fontSize: 18 }} /> },
          { id: "transfer", label: "Transfers", icon: <TransferWithinAStationRoundedIcon sx={{ fontSize: 18 }} /> },
          { id: "completed", label: "Completed", icon: <CheckCircleRoundedIcon sx={{ fontSize: 18 }} /> }
        ].map((item) => {
          const active = filter === item.id;
          return (
            <Chip
              key={item.id}
              icon={item.icon}
              label={item.label}
              onClick={() => setFilter(item.id as HistoryFilter)}
              sx={{
                height: 42,
                borderRadius: 6,
                px: 1,
                bgcolor: active ? "#059669" : "#FFFFFF",
                border: active ? "1px solid #059669" : "1px solid var(--evz-border-subtle)",
                color: active ? "#FFFFFF" : "#334155",
                fontWeight: 700,
                fontSize: 15,
                "& .MuiChip-icon": {
                  color: active ? "#FFFFFF" : undefined
                }
              }}
            />
          );
        })}
      </Stack>

      <Stack spacing={1.2}>
        {visible.map((request) => (
          <AmbulanceHistoryCard
            key={request.id}
            request={request}
            onOpen={() =>
              navigate(`/ambulance/history/${request.id}`, {
                state: { requestSnapshot: request }
              })
            }
          />
        ))}

        {visible.length === 0 && (
          <Typography sx={{ textAlign: "center", color: "#64748B", py: 4 }}>No ambulance requests found in this view.</Typography>
        )}
      </Stack>
    </Box>
  );
}

const DirectionsCarFilledIcon = DirectionsCarFilledRoundedIcon;

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
