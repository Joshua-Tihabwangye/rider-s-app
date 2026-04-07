import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  Button
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import { uiTokens } from "../design/tokens";

const TIMELINE_STEPS = [
  { id: 1, label: "Order placed", time: "Mon, 06 Oct • 09:12", status: "done" },
  { id: 2, label: "Picked up", time: "Mon, 06 Oct • 11:45", status: "done" },
  { id: 3, label: "In transit", time: "Today • 14:20", status: "current" },
  { id: 4, label: "Out for delivery", time: "ETA • 17:30", status: "upcoming" },
  { id: 5, label: "Delivered", time: "Pending", status: "upcoming" }
];

interface Step {
  id: number;
  label: string;
  time: string;
  status: "done" | "current" | "upcoming" | string;
}

interface TimelineRowProps {
  step: Step;
  isLast: boolean;
}

function TimelineRow({ step, isLast }: TimelineRowProps): React.JSX.Element {
  const isDone = step.status === "done";
  const isCurrent = step.status === "current";
  const dotColor = isDone ? "#22c55e" : isCurrent ? "#03CD8C" : "rgba(3,205,140,0.1)";

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", mb: isLast ? 0 : uiTokens.spacing.md }}>
      <Box sx={{ mr: uiTokens.spacing.md, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: uiTokens.radius.xl,
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
                borderRadius: uiTokens.radius.xl,
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

function OrderDeliveryDetailedViewScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const trackingId = "DLV-2025-10-07-001";

  return (
    <ScreenScaffold
      header={
        <Box
          sx={{
            mb: uiTokens.spacing.lg,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.md }}>
            <IconButton
              size="small"
              aria-label="Back"
              onClick={() => navigate(-1)}
              sx={{
                borderRadius: uiTokens.radius.xl,
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
            <Box>
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
                Pickup confirmed, items & full timeline
              </Typography>
            </Box>
          </Box>
        </Box>
      }
    >
      {/* Tracking + status card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.mdPlus }}>
          <Stack direction="row" spacing={uiTokens.spacing.md} alignItems="center" sx={{ mb: uiTokens.spacing.smPlus }}>
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

          <Stack direction="row" spacing={uiTokens.spacing.md} alignItems="center">
            <Chip
              size="small"
              icon={<LocalShippingRoundedIcon sx={{ fontSize: 14 }} />}
              label="EV courier"
              sx={{
                borderRadius: uiTokens.radius.xl,
                fontSize: 11,
                height: 24,
                bgcolor: "rgba(34,197,94,0.12)",
                color: "#16A34A"
              }}
            />
            <Chip
              size="small"
              icon={<CheckCircleRoundedIcon sx={{ fontSize: 14 }} />}
              label="Pickup confirmed"
              sx={{
                borderRadius: uiTokens.radius.xl,
                fontSize: 11,
                height: 24,
                bgcolor: "rgba(22,163,74,0.12)",
                color: "#16A34A"
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Items card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.mdPlus }}>
          <Stack direction="row" spacing={uiTokens.spacing.sm} alignItems="center" sx={{ mb: uiTokens.spacing.smPlus }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Items in this delivery
            </Typography>
          </Stack>
          <Stack spacing={uiTokens.spacing.xs}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                1 × EV charger cable
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                UGX 120,000
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                2 × Wheel caps
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                UGX 60,000
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                1 × Charging adaptor
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                UGX 45,000
              </Typography>
            </Stack>
          </Stack>
          <Divider sx={{ my: uiTokens.spacing.smPlus, borderColor: (t) => t.palette.divider }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography
              variant="caption"
              sx={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}
            >
              Total
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              UGX 225,000
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* Addresses card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.mdPlus }}>
          <Box sx={{ mb: uiTokens.spacing.smPlus }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              From (pickup)
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, letterSpacing: "-0.01em" }}
            >
              EVzone Marketplace – China–Africa Hub Warehouse
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              To (drop-off)
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, letterSpacing: "-0.01em" }}
            >
              Nsambya Road 472, Kampala
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Timeline card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.mdPlus }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: uiTokens.spacing.smPlus, display: "block" }}
          >
            Timeline
          </Typography>
          {TIMELINE_STEPS.map((step, index) => (
            <TimelineRow
              key={step.id}
              step={step}
              isLast={index === TIMELINE_STEPS.length - 1}
            />
          ))}
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="outlined"
        sx={{
          borderRadius: uiTokens.radius.xl,
          py: uiTokens.spacing.smPlus,
          fontSize: 14,
          fontWeight: 600,
          textTransform: "none"
        }}
      >
        Download order summary
      </Button>

      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block", textAlign: "center" }}
      >
        Use this detailed view when you need to check what was sent, where it is
        headed and every step it has gone through.
      </Typography>
    </ScreenScaffold>
  );
}

export default function RiderScreen68OrderDeliveryDetailedViewCanvas_v2() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: "background.default"
      }}
    >
      <OrderDeliveryDetailedViewScreen />
    </Box>
  );
}

