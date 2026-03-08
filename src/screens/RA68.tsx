import React from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  Button,
  Alert
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import MobileShell from "../components/MobileShell";

// --------------- helpers ---------------

interface TimelineStep {
  id: number;
  label: string;
  time: string;
  status: "done" | "current" | "upcoming";
}

/** Build a dynamic timeline based on order progress / status */
function buildTimeline(progress: number, status: string, dateStr?: string): TimelineStep[] {
  const dateLabel = dateStr
    ? new Date(dateStr).toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short" })
    : "—";

  if (status === "Delivered") {
    return [
      { id: 1, label: "Order placed", time: dateLabel, status: "done" },
      { id: 2, label: "Accepted", time: dateLabel, status: "done" },
      { id: 3, label: "Picked up", time: dateLabel, status: "done" },
      { id: 4, label: "In transit", time: dateLabel, status: "done" },
      { id: 5, label: "Delivered", time: "Completed", status: "done" }
    ];
  }

  if (status === "Waiting to collect" || progress >= 100) {
    return [
      { id: 1, label: "Order placed", time: dateLabel, status: "done" },
      { id: 2, label: "Accepted", time: dateLabel, status: "done" },
      { id: 3, label: "Picked up", time: dateLabel, status: "done" },
      { id: 4, label: "Awaiting collection", time: "Ready", status: "current" },
      { id: 5, label: "Delivered", time: "Pending", status: "upcoming" }
    ];
  }

  if (status === "Request accepted" || progress >= 50) {
    return [
      { id: 1, label: "Order placed", time: dateLabel, status: "done" },
      { id: 2, label: "Accepted", time: dateLabel, status: "done" },
      { id: 3, label: "Pickup in progress", time: "In progress", status: "current" },
      { id: 4, label: "In transit", time: "Pending", status: "upcoming" },
      { id: 5, label: "Delivered", time: "Pending", status: "upcoming" }
    ];
  }

  // Default: waiting to accept
  return [
    { id: 1, label: "Order placed", time: dateLabel, status: "done" },
    { id: 2, label: "Waiting for acceptance", time: "Pending", status: "current" },
    { id: 3, label: "Pickup", time: "Pending", status: "upcoming" },
    { id: 4, label: "In transit", time: "Pending", status: "upcoming" },
    { id: 5, label: "Delivered", time: "Pending", status: "upcoming" }
  ];
}

function statusChipProps(status: string): { label: string; color: string; bgcolor: string; icon: React.ReactElement } {
  switch (status) {
    case "Delivered":
      return { label: "Delivered", color: "#16A34A", bgcolor: "rgba(34,197,94,0.12)", icon: <CheckCircleRoundedIcon sx={{ fontSize: 14 }} /> };
    case "Waiting to collect":
      return { label: "Awaiting collection", color: "#D97706", bgcolor: "rgba(245,158,11,0.12)", icon: <HourglassEmptyRoundedIcon sx={{ fontSize: 14 }} /> };
    case "Request accepted":
      return { label: "Accepted", color: "#2563EB", bgcolor: "rgba(59,130,246,0.12)", icon: <LocalShippingRoundedIcon sx={{ fontSize: 14 }} /> };
    default:
      return { label: status || "Pending", color: "#6B7280", bgcolor: "rgba(107,114,128,0.1)", icon: <HourglassEmptyRoundedIcon sx={{ fontSize: 14 }} /> };
  }
}

// --------------- timeline row ---------------

function TimelineRow({ step, isLast }: { step: TimelineStep; isLast: boolean }): React.JSX.Element {
  const isDone = step.status === "done";
  const isCurrent = step.status === "current";
  const dotColor = isDone ? "#22c55e" : isCurrent ? "#03CD8C" : "rgba(3,205,140,0.1)";

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", mb: isLast ? 0 : 1.4 }}>
      <Box sx={{ mr: 1.5, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: "999px",
            bgcolor: isCurrent ? "rgba(59,130,246,0.12)" : "transparent",
            border: isDone ? "none" : `2px solid ${dotColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {isDone ? (
            <CheckCircleRoundedIcon sx={{ fontSize: 18, color: "#22c55e" }} />
          ) : (
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "999px",
                bgcolor: dotColor
              }}
            />
          )}
        </Box>
        {!isLast && (
          <Box
            sx={{
              flex: 1,
              width: 2,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#E5E7EB" : "rgba(148,163,184,0.5)",
              mt: 0.3
            }}
          />
        )}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            variant="body2"
            sx={{ fontWeight: isCurrent ? 600 : 500, letterSpacing: "-0.01em" }}
          >
            {step.label}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            {step.time}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}

// --------------- main screen ---------------

function OrderDeliveryDetailedViewScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams<{ orderId: string }>();

  // Attempt to get order from navigation state
  const stateOrder = (location.state as any)?.order ?? null;
  const trackingId = stateOrder?.id || orderId || "Unknown";

  // If no order data was passed, show not-found state
  if (!stateOrder) {
    return (
      <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", minHeight: 40 }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              position: "absolute",
              left: 0,
              borderRadius: 999,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: "-0.01em", mx: 7, textAlign: "center" }}>
            Tracking result
          </Typography>
        </Box>

        <Alert
          severity="warning"
          icon={<ErrorOutlineRoundedIcon sx={{ fontSize: 22 }} />}
          sx={{ borderRadius: 2, mb: 2 }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            No delivery found
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 12 }}>
            No delivery with tracking ID <strong>{orderId}</strong> was found. Please double-check the ID and try again.
          </Typography>
        </Alert>

        <Button
          fullWidth
          variant="contained"
          onClick={() => navigate("/deliveries")}
          sx={{
            borderRadius: 999,
            py: 1.2,
            fontSize: 14,
            fontWeight: 600,
            textTransform: "none",
            bgcolor: "#03CD8C",
            color: "#FFFFFF",
            "&:hover": { bgcolor: "#22C55E" }
          }}
        >
          Back to Deliveries
        </Button>
      </Box>
    );
  }

  // --------------- extract dynamic data ---------------
  const packageName: string = stateOrder.packageName || "Package";
  const sender = stateOrder.sender || {};
  const receiver = stateOrder.receiver || {};
  const status: string = stateOrder.status || "Unknown";
  const progress: number = stateOrder.progress ?? 0;
  const source: string = stateOrder.source || "incoming"; // "incoming" | "accepted"
  const needsPayment: boolean = stateOrder.needsPayment ?? false;
  const paymentMethod: string | null = stateOrder.paymentMethod ?? null;
  const dateStr: string | undefined = stateOrder.date; // ISO string from delivering orders
  const estimatedTime: string | undefined = stateOrder.time; // from received orders

  const chipInfo = statusChipProps(status);
  const timelineSteps = buildTimeline(progress, status, dateStr);

  // Header subtitle
  const headerSubtitle =
    status === "Delivered"
      ? "Delivery completed"
      : status === "Waiting to collect"
      ? "Ready for collection"
      : status === "Request accepted"
      ? "Pickup in progress"
      : "Awaiting acceptance";

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          minHeight: 48
        }}
      >
        <IconButton
          size="small"
          aria-label="Back"
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            left: 0,
            borderRadius: 999,
            bgcolor: (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)"
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Box sx={{ mx: 7, textAlign: "center" }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
          >
            Order details
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            {headerSubtitle}
          </Typography>
        </Box>
      </Box>

      {/* Tracking + status card */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.25 }}>
            <Inventory2RoundedIcon sx={{ fontSize: 20, color: "primary.main" }} />
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Tracking ID
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                {trackingId}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Chip
              size="small"
              icon={<LocalShippingRoundedIcon sx={{ fontSize: 14 }} />}
              label="EV courier"
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 24,
                bgcolor: "rgba(34,197,94,0.12)",
                color: "#16A34A"
              }}
            />
            <Chip
              size="small"
              icon={chipInfo.icon}
              label={chipInfo.label}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 24,
                bgcolor: chipInfo.bgcolor,
                color: chipInfo.color
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Package & sender/receiver card */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
            <Typography
              variant="subtitle2"
            sx={{ fontWeight: 600, letterSpacing: "-0.01em", mb: 1.2 }}
            >
            Package details
            </Typography>

          <Stack spacing={0.75}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 12, color: (t) => t.palette.text.secondary }}>
                Item
              </Typography>
              <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
                {packageName}
              </Typography>
            </Stack>

            {source === "accepted" && estimatedTime && (
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" sx={{ fontSize: 12, color: (t) => t.palette.text.secondary }}>
                  Est. time
              </Typography>
                <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 500 }}>
                  {estimatedTime}
              </Typography>
            </Stack>
            )}

            {source === "accepted" && (
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" sx={{ fontSize: 12, color: (t) => t.palette.text.secondary }}>
                  Payment
              </Typography>
                <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 500 }}>
                  {needsPayment
                    ? paymentMethod === "cash"
                      ? "Cash (pending)"
                      : "Pending"
                    : paymentMethod === "gateway"
                    ? "Paid (gateway)"
                    : "Paid"}
              </Typography>
            </Stack>
            )}
          </Stack>

          <Divider sx={{ my: 1.2, borderColor: (t) => t.palette.divider }} />

          {/* Sender */}
          <Box sx={{ mb: 1.2 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Sender
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              {sender.name || "Unknown"}
            </Typography>
            {sender.address && (
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                {sender.address}
              </Typography>
            )}
            {!sender.address && sender.city && (
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                {sender.city}
              </Typography>
            )}
          </Box>

          {/* Receiver */}
          <Box>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Receiver
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, letterSpacing: "-0.01em" }}
            >
              {receiver.city || "Unknown"}{receiver.code ? `, ${receiver.code}` : ""}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Progress bar */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.75 }}>
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Progress
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600 }}>
              {progress}%
            </Typography>
          </Stack>
          <Box
            sx={{
              width: "100%",
              height: 8,
              borderRadius: 999,
              bgcolor: (t) => t.palette.mode === "light" ? "#E5E7EB" : "rgba(51,65,85,0.7)",
              overflow: "hidden"
            }}
          >
            <Box
              sx={{
                width: `${progress}%`,
                height: "100%",
                borderRadius: 999,
                bgcolor: progress === 100 ? "#22C55E" : "#03CD8C",
                transition: "width 0.5s ease"
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Timeline card */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1.3, display: "block" }}
          >
            Timeline
          </Typography>
          {timelineSteps.map((step, index) => (
            <TimelineRow
              key={step.id}
              step={step}
              isLast={index === timelineSteps.length - 1}
            />
          ))}
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="contained"
        onClick={() => navigate("/deliveries")}
        sx={{
          borderRadius: 999,
          py: 1.2,
          fontSize: 14,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: "#03CD8C",
          color: "#FFFFFF",
          mb: 1,
          "&:hover": { bgcolor: "#22C55E" }
        }}
      >
        Back to Deliveries
      </Button>

      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
      >
        Details shown reflect the current state of this delivery. Search a different tracking ID to view another order.
      </Typography>
    </Box>
  );
}

export default function RiderScreen68OrderDeliveryDetailedViewCanvas_v2() {
      return (
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (t) => t.palette.background.default
        }}
      >
        <DarkModeToggle />
        <MobileShell>
          <OrderDeliveryDetailedViewScreen />
        </MobileShell>
      </Box>
  );
}
