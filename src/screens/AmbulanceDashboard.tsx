import React, { useMemo } from "react";
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
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useAppData } from "../contexts/AppDataContext";

function formatDateTime(value?: string): string {
  if (!value) return "Pending";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Pending";
  return date.toLocaleString("en-UG", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function AmbulanceDashboardHomeScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { ambulance } = useAppData();

  const requests = useMemo(() => {
    const combined = [ambulance.request, ...ambulance.history].filter((item) => Boolean(item?.id));
    const byId = new Map<string, (typeof combined)[number]>();
    combined.forEach((item) => {
      if (!item) return;
      if (!byId.has(item.id)) byId.set(item.id, item);
    });
    return [...byId.values()]
      .sort((a, b) => {
        const aTime = new Date(a.completedAt ?? a.cancelledAt ?? a.arrivedAt ?? a.dispatchedAt ?? a.requestedAt ?? 0).getTime();
        const bTime = new Date(b.completedAt ?? b.cancelledAt ?? b.arrivedAt ?? b.dispatchedAt ?? b.requestedAt ?? 0).getTime();
        return bTime - aTime;
      })
      .slice(0, 3);
  }, [ambulance.history, ambulance.request]);

  const totalRequests = requests.length;
  const activeCount = requests.filter((request) => ["requested", "assigned", "en_route", "arrived"].includes(request.status)).length;

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
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
          aria-label="Back"
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
          Ambulance
        </Typography>

        <Chip
          icon={<HealthAndSafetyRoundedIcon sx={{ fontSize: 16 }} />}
          label="Emergency"
          sx={{
            height: 36,
            borderRadius: 2,
            bgcolor: "rgba(239,68,68,0.12)",
            color: "#DC2626",
            border: "1px solid rgba(239,68,68,0.24)",
            fontWeight: 700
          }}
        />
      </Box>

      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid rgba(239,68,68,0.2)",
          background: "linear-gradient(135deg, rgba(239,68,68,0.06) 0%, #FFFFFF 64%)",
          p: 2,
          mb: 1.8
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              bgcolor: "rgba(239,68,68,0.12)",
              display: "grid",
              placeItems: "center",
              flexShrink: 0
            }}
          >
            <LocalHospitalRoundedIcon sx={{ color: "#DC2626", fontSize: 30 }} />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 21, lineHeight: 1.2 }}>
              Request emergency ambulance
            </Typography>
            <Typography sx={{ color: "#475569", fontSize: 14, mt: 0.3 }}>
              Fast dispatch for urgent response and hospital transfer.
            </Typography>
          </Box>
        </Stack>

        <Button
          fullWidth
          variant="contained"
          endIcon={<ChevronRightRoundedIcon />}
          onClick={() => navigate("/ambulance/location")}
          sx={{
            mt: 1.6,
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
          Start ambulance request
        </Button>
      </Card>

      <Stack direction="row" spacing={1.2} sx={{ mb: 1.8 }}>
        <Card elevation={0} sx={{ flex: 1, borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.3 }}>
          <Typography sx={{ color: "#64748B", fontSize: 13 }}>Requests</Typography>
          <Typography sx={{ fontWeight: 800, fontSize: 26, color: "#059669", lineHeight: 1.1 }}>{totalRequests}</Typography>
        </Card>
        <Card elevation={0} sx={{ flex: 1, borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.3 }}>
          <Typography sx={{ color: "#64748B", fontSize: 13 }}>Active</Typography>
          <Typography sx={{ fontWeight: 800, fontSize: 26, color: "#EA580C", lineHeight: 1.1 }}>{activeCount}</Typography>
        </Card>
        <Card elevation={0} sx={{ flex: 1, borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.3 }}>
          <Typography sx={{ color: "#64748B", fontSize: 13 }}>History</Typography>
          <Button
            size="small"
            onClick={() => navigate("/ambulance/history")}
            sx={{ mt: 0.2, p: 0, minWidth: 0, color: "#059669", fontWeight: 700, textTransform: "none" }}
          >
            Open
          </Button>
        </Card>
      </Stack>

      <Card elevation={0} sx={{ borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Stack direction="row" spacing={0.8} alignItems="center">
            <HistoryRoundedIcon sx={{ fontSize: 19, color: "#64748B" }} />
            <Typography sx={{ fontWeight: 700, fontSize: 17 }}>Recent requests</Typography>
          </Stack>
          <Button
            size="small"
            onClick={() => navigate("/ambulance/history")}
            sx={{ color: "#059669", textTransform: "none", fontWeight: 700 }}
          >
            View all
          </Button>
        </Stack>

        <Stack spacing={1}>
          {requests.length === 0 && (
            <Typography sx={{ color: "#64748B", fontSize: 14, py: 1 }}>No ambulance requests yet.</Typography>
          )}
          {requests.map((request) => (
            <Card
              key={request.id}
              elevation={0}
              onClick={() => navigate(`/ambulance/history/${request.id}`, { state: { requestSnapshot: request } })}
              sx={{ borderRadius: 2, border: "1px solid var(--evz-border-subtle)", p: 1.2, cursor: "pointer" }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "rgba(5,150,105,0.1)", display: "grid", placeItems: "center" }}>
                  <LocalHospitalRoundedIcon sx={{ color: "#059669", fontSize: 22 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {request.id}
                  </Typography>
                  <Typography sx={{ color: "#475569", fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {request.pickup?.label ?? request.pickup?.address ?? "Pickup"} → {request.destination?.label ?? request.destination?.address ?? "Destination"}
                  </Typography>
                </Box>
                <Stack alignItems="flex-end" spacing={0.2}>
                  <Chip
                    size="small"
                    label={request.status.replace(/_/g, " ")}
                    sx={{
                      height: 24,
                      borderRadius: 2,
                      bgcolor: request.status === "completed" ? "rgba(5,150,105,0.12)" : "rgba(148,163,184,0.16)",
                      color: request.status === "completed" ? "#059669" : "#475569",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "capitalize"
                    }}
                  />
                  <Stack direction="row" spacing={0.4} alignItems="center">
                    <AccessTimeRoundedIcon sx={{ fontSize: 13, color: "#64748B" }} />
                    <Typography sx={{ color: "#64748B", fontSize: 11 }}>{formatDateTime(request.requestedAt)}</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Card>
    </Box>
  );
}

export default function AmbulanceDashboard(): React.JSX.Element {
  return <AmbulanceDashboardHomeScreen />;
}
