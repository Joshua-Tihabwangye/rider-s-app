import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  Divider
} from "@mui/material";

import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";

import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";

function DeliveryDashboardHomeScreen() {
  const [ctaState, setCtaState] = useState("idle");
  const [viewMode, setViewMode] = useState("sending");

  const handleSendParcel = () => {
    setCtaState("send");
  };

  const handleTrackParcel = () => {
    setCtaState("track");
  };

  const handleViewIncoming = () => {
    setViewMode("receiving");
    setCtaState("incoming");
  };

  const handleViewHistory = () => {
    setCtaState("history");
  };

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 999,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FEF3C7" : "rgba(15,23,42,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <LocalShippingRoundedIcon sx={{ fontSize: 22, color: "#EA580C" }} />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Deliveries
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Send parcels, track EV riders, and see incoming packages
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Active summary */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 3,
          bgcolor: (t) =>
            t.palette.mode === "light"
              ? "radial-gradient(circle at top, #FFEDD5, #FFF7ED)"
              : "radial-gradient(circle at top, #7C2D12, #020617)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(248,171,85,0.7)"
              : "1px solid rgba(248,171,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.9, py: 1.9 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1.4 }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Today's deliveries · {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: (t) => t.palette.text.primary
                }}
              >
                3 active • 5 completed
              </Typography>
            </Box>
            <Chip
              size="small"
              icon={<TrackChangesRoundedIcon sx={{ fontSize: 16 }} />}
              label="All EV couriers"
              sx={{
                borderRadius: 999,
                fontSize: 10,
                height: 22,
                bgcolor: (t) =>
                  t.palette.mode === "light"
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(15,23,42,0.96)",
                color: (t) => t.palette.text.primary
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1.25}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Inventory2RoundedIcon sx={{ fontSize: 18 }} />}
              onClick={handleSendParcel}
              sx={{
                borderRadius: 999,
                py: 0.9,
                fontSize: 13,
                fontWeight: 600,
                textTransform: "none",
                bgcolor: "#7C2D12",
                color: "#FFFBEB",
                "&:hover": { bgcolor: "#9A3412" }
              }}
            >
              Send a parcel
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<TrackChangesRoundedIcon sx={{ fontSize: 18 }} />}
              onClick={handleTrackParcel}
              sx={{
                borderRadius: 999,
                py: 0.9,
                fontSize: 13,
                textTransform: "none",
                borderColor: (t) =>
                  t.palette.mode === "light"
                    ? "rgba(120,53,15,0.5)"
                    : "rgba(251,191,36,0.5)",
                color: (t) =>
                  t.palette.mode === "light"
                    ? "rgba(67,20,7,0.9)"
                    : "rgba(251,191,36,0.9)",
                "&:hover": {
                  borderColor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(120,53,15,0.9)"
                      : "rgba(251,191,36,0.9)",
                  bgcolor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(120,53,15,0.06)"
                      : "rgba(251,191,36,0.1)"
                }
              }}
            >
              Track a parcel
            </Button>
          </Stack>

          {ctaState !== "idle" && (
            <Box
              sx={{
                mt: 1.1,
                px: 1.1,
                py: 0.7,
                borderRadius: 2,
                bgcolor: (t) =>
                  t.palette.mode === "light"
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(15,23,42,0.96)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(248,171,85,0.35)"
                    : "1px solid rgba(248,171,85,0.7)"
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
              >
                {ctaState === "send" &&
                  "Next step: open the delivery creation flow with pickup, drop-off and parcel details (RA59)."}
                {ctaState === "track" &&
                  "Next step: open the live tracking view for an active parcel with map, ETA and courier info (RA60–RA63)."}
                {ctaState === "incoming" &&
                  "Switch to incoming view and show parcels that are on the way to you (RA51/RA53/RA54)."}
                {ctaState === "history" &&
                  "Open the full deliveries history, including sent and received parcels (RA50–RA54/RA68)."}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Sending vs Receiving tiles */}
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
        <CardContent sx={{ px: 1.75, py: 1.7 }}>
          <Stack direction="row" spacing={1.3}>
            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor:
                  viewMode === "sending"
                    ? (t) =>
                        t.palette.mode === "light"
                          ? "#FEF3C7"
                          : "rgba(15,23,42,0.96)"
                    : (t) =>
                        t.palette.mode === "light"
                          ? "#F9FAFB"
                          : "rgba(15,23,42,0.96)",
                border:
                  viewMode === "sending"
                    ? (t) =>
                        t.palette.mode === "light"
                          ? "1px solid rgba(245,158,11,0.7)"
                          : "1px solid rgba(251,191,36,0.7)"
                    : (t) =>
                        t.palette.mode === "light"
                          ? "1px solid rgba(209,213,219,0.9)"
                          : "1px solid rgba(51,65,85,0.9)"
              }}
              onClick={() => setViewMode("sending")}
            >
              <CardContent sx={{ px: 1.4, py: 1.3, position: "relative" }}>
                <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.5 }}>
                  <ArrowUpwardRoundedIcon
                    sx={{ fontSize: 16, color: "#F59E0B", transform: "rotate(45deg)" }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                  >
                    Sending
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em", mb: 0.25 }}
                >
                  Next: Bugolobi → Makerere
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
                >
                  ETA 14:32
                </Typography>
                <ArrowForwardIosRoundedIcon
                  sx={{
                    fontSize: 14,
                    color: (t) => t.palette.text.secondary,
                    opacity: 0.5,
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)"
                  }}
                />
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor:
                  viewMode === "receiving"
                    ? (t) =>
                        t.palette.mode === "light"
                          ? "#EFF6FF"
                          : "rgba(15,23,42,0.96)"
                    : (t) =>
                        t.palette.mode === "light"
                          ? "#F9FAFB"
                          : "rgba(15,23,42,0.96)",
                border:
                  viewMode === "receiving"
                    ? (t) =>
                        t.palette.mode === "light"
                          ? "1px solid rgba(59,130,246,0.6)"
                          : "1px solid rgba(59,130,246,0.7)"
                    : (t) =>
                        t.palette.mode === "light"
                          ? "1px solid rgba(209,213,219,0.9)"
                          : "1px solid rgba(51,65,85,0.9)"
              }}
              onClick={handleViewIncoming}
            >
              <CardContent sx={{ px: 1.4, py: 1.3, position: "relative" }}>
                <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.5 }}>
                  <ArrowDownwardRoundedIcon
                    sx={{ fontSize: 16, color: "#3b82f6", transform: "rotate(-45deg)" }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                  >
                    Receiving
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em", mb: 0.25 }}
                >
                  Arriving: Kansanga → City centre
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
                >
                  Arriving today
                </Typography>
                <ArrowForwardIosRoundedIcon
                  sx={{
                    fontSize: 14,
                    color: (t) => t.palette.text.secondary,
                    opacity: 0.5,
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)"
                  }}
                />
              </CardContent>
            </Card>
          </Stack>
        </CardContent>
      </Card>

      {/* Recent deliveries */}
      <Card
        elevation={0}
        sx={{
          mb: 1.5,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.6 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Stack direction="row" spacing={0.75} alignItems="center">
              <LocalMallRoundedIcon
                sx={{ fontSize: 18, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Recent deliveries
              </Typography>
            </Stack>
            <Typography
              variant="caption"
              onClick={handleViewHistory}
              sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary, cursor: "pointer" }}
            >
              View history
            </Typography>
          </Stack>
          <Divider sx={{ mb: 1, borderColor: (t) => t.palette.divider }} />

          {[
            { route: "Nsambya → EV Hub", status: "Delivered", code: "DLV-001", date: "Today • 14:32", type: "sent" },
            { route: "Kampala → Entebbe", status: "In transit", code: "DLV-002", date: "Mon • 11:03", type: "sent" },
            { route: "Makerere → Bugolobi", status: "Delivered", code: "DLV-003", date: "Sun • 09:15", type: "received" }
          ].map((delivery, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 0.6,
                "&:not(:last-of-type)": {
                  borderBottom: (t) => `1px dashed ${t.palette.divider}`
                }
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
                {delivery.type === "sent" ? (
                  <ArrowUpwardRoundedIcon
                    sx={{ fontSize: 16, color: "#F59E0B", transform: "rotate(45deg)" }}
                  />
                ) : (
                  <ArrowDownwardRoundedIcon
                    sx={{ fontSize: 16, color: "#3b82f6", transform: "rotate(-45deg)" }}
                  />
                )}
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.25 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: 12.5, fontWeight: 500, letterSpacing: "-0.01em" }}
                    >
                      {delivery.route}
                    </Typography>
                    <Chip
                      label={delivery.status}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: 9,
                        fontWeight: 600,
                        bgcolor: delivery.status === "Delivered" ? "#D1FAE5" : "#FEF3C7",
                        color: delivery.status === "Delivered" ? "#064E3B" : "#78350F"
                      }}
                    />
                  </Stack>
                  <Typography
                    variant="caption"
                    sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
                  >
                    {delivery.code} • {delivery.date}
                  </Typography>
                </Box>
              </Stack>
              <ArrowForwardIosRoundedIcon
                sx={{ fontSize: 14, color: (t) => t.palette.text.secondary, opacity: 0.5 }}
              />
            </Box>
          ))}
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
      >
        The deliveries dashboard helps you send parcels in a few taps, track EV
        couriers in real time and stay on top of what’s coming to you.
      </Typography>
    </Box>
  );
}

export default function DeliveriesDashboard() {
  return (
    <>
      <DarkModeToggle />
      <MobileShell>
        <DeliveryDashboardHomeScreen />
      </MobileShell>
    </>
  );
}
