import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import MarkunreadMailboxRoundedIcon from "@mui/icons-material/MarkunreadMailboxRounded";
import MobileShell from "../components/MobileShell";
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: { main: "#03CD8C" },
    secondary: { main: "#F77F00" },
    ...(mode === "light"
      ? {
          background: { default: "#F3F4F6", paper: "#FFFFFF" },
          text: { primary: "#0F172A", secondary: "#6B7280" },
          divider: "rgba(148,163,184,0.4)"
        }
      : {
          background: { default: "#020617", paper: "#020617" },
          text: { primary: "#F9FAFB", secondary: "#A6A6A6" },
          divider: "rgba(148,163,184,0.24)"
        })
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    button: { textTransform: "none", fontWeight: 600 },
    h6: { fontWeight: 600 }
  }
});

const RECEIVED_ORDERS = [
  {
    id: "RCV-2025-10-06-003",
    fromName: "EVzone Marketplace",
    fromAddress: "China–Africa Hub Warehouse",
    toAddress: "Nsambya Road 472, Kampala",
    status: "Out for delivery",
    eta: "Today • 05:30 PM"
  },
  {
    id: "RCV-2025-10-05-001",
    fromName: "John Doe",
    fromAddress: "Kansanga, Kampala",
    toAddress: "Bugolobi Village, Kampala",
    status: "Delivered",
    eta: "Yesterday • 02:10 PM"
  }
];

function ReceivedOrderRow({ order }) {
  const isDelivered = order.status === "Delivered";
  const statusColor = isDelivered ? "#16A34A" : "#1D4ED8";
  const statusBg = isDelivered
    ? "rgba(34,197,94,0.12)"
    : "rgba(59,130,246,0.12)";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 1.2
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
        >
          {order.id}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.01em" }}
        >
          From: {order.fromName}
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
        >
          To: {order.toAddress}
        </Typography>
      </Box>
      <Box sx={{ textAlign: "right" }}>
        <Chip
          label={order.status}
          size="small"
          sx={{
            borderRadius: 999,
            fontSize: 10,
            height: 22,
            bgcolor: statusBg,
            color: statusColor
          }}
        />
        <Typography
          variant="caption"
          sx={{ mt: 0.3, display: "block", fontSize: 11, color: (t) => t.palette.text.secondary }}
        >
          {order.eta}
        </Typography>
      </Box>
    </Box>
  );
}

function DeliveriesDashboardReceivedV2Screen() {
  const navigate = useNavigate();
  const [segment, setSegment] = useState("incoming");

  const filteredOrders = RECEIVED_ORDERS.filter((order) => {
    if (segment === "incoming") return order.status !== "Delivered";
    if (segment === "delivered") return order.status === "Delivered";
    return true;
  });

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 999,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)" (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)")}}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
              Deliveries – Receiving (v2)
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Compact view of parcels coming to you
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Summary + segments */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
          border: (t) =>
            t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Total parcels
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                {RECEIVED_ORDERS.length}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Chip
                size="small"
                icon={<MarkunreadMailboxRoundedIcon sx={{ fontSize: 16 }} />}
                label="Incoming"
                sx={{
                  borderRadius: 999,
                  fontSize: 10,
                  height: 24,
                  bgcolor: "rgba(59,130,246,0.12)",
                  color: "#1D4ED8"
                }}
              />
              <Chip
                size="small"
                icon={<Inventory2RoundedIcon sx={{ fontSize: 16 }} />}
                label="Delivered"
                sx={{
                  borderRadius: 999,
                  fontSize: 10,
                  height: 24,
                  bgcolor: "rgba(34,197,94,0.12)",
                  color: "#16A34A"
                }}
              />
            </Stack>
          </Stack>

          <Divider sx={{ my: 1.4, borderColor: (t) => t.palette.divider }} />

          <Stack direction="row" spacing={1}>
            <Chip
              label="Incoming"
              size="small"
              onClick={() => setSegment("incoming")}
              sx={{
                height: 26,
                borderRadius: 999,
                fontSize: 11,
                bgcolor: segment === "incoming" ? "primary.main" : (t) =>
                  t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                color: segment === "incoming" ? "#020617" : (t) => t.palette.text.primary
              }}
            />
            <Chip
              label="Delivered"
              size="small"
              onClick={() => setSegment("delivered")}
              sx={{
                height: 26,
                borderRadius: 999,
                fontSize: 11,
                bgcolor: segment === "delivered" ? "primary.main" : (t) =>
                  t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                color: segment === "delivered" ? "#020617" : (t) => t.palette.text.primary
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* List */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
          border: (t) =>
            t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          {filteredOrders.length === 0 ? (
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                display: "block",
                textAlign: "center",
                fontSize: 11,
                color: (t) => t.palette.text.secondary
              }}
            >
              No parcels in this segment.
            </Typography>
          ) : (
            filteredOrders.map((order, index) => (
              <React.Fragment key={order.id}>
                <ReceivedOrderRow order={order} />
                {index < filteredOrders.length - 1 && (
                  <Divider sx={{ my: 0.4, borderColor: (t) => t.palette.divider }} />
                )}
              </React.Fragment>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default function RiderScreen53DeliveriesDashboardReceivedV2Canvas_v2() {
      return (
    
      
      <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (t) => t.palette.background.default }}>
        

        <DarkModeToggle />

        

        <MobileShell>
          <DeliveriesDashboardReceivedV2Screen />
        </MobileShell>
      </Box>
    
  );
}
