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
  Button
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import MobileShell from "../components/MobileShell";

const DELIVERING_ORDERS = [
  {
    id: "DLV-2025-10-07-002",
    toName: "John Doe",
    toAddress: "Acacia Mall, Kololo",
    fromAddress: "Kansanga Market, Kampala",
    status: "In transit",
    eta: "25 min"
  }
];

function DeliveringOrderCard({ order }): JSX.Element {
  const isOutForPickup = order.status === "Out for pickup";
  const statusColor = isOutForPickup ? "#F97316" : "#16A34A";
  const statusBg = isOutForPickup
    ? "rgba(249,115,22,0.12)"
    : "rgba(34,197,94,0.12)";

  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.75,
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
        <Box
          sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {order.id}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, letterSpacing: "-0.01em" }}
            >
              To: {order.toName}
            </Typography>
          </Box>
          <Chip
            label={order.status}
            size="small"
            sx={{
              borderRadius: 999,
              fontSize: 11,
              height: 24,
              bgcolor: statusBg,
              color: statusColor
            }}
          />
        </Box>

        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocalShippingRoundedIcon sx={{ fontSize: 18, color: "primary.main" }} />
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              From: {order.fromAddress}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.3 }}>
            <Inventory2RoundedIcon sx={{ fontSize: 18, color: "#6B7280" }} />
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              To: {order.toAddress}
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={0.75} alignItems="center">
            <AccessTimeRoundedIcon
              sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
            />
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              ETA {order.eta}
            </Typography>
          </Stack>
          <Button
            size="small"
            variant="text"
            sx={{
              borderRadius: 999,
              fontSize: 11,
              textTransform: "none",
              color: (t) => t.palette.text.secondary
            }}
          >
            View tracking
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function DeliveriesDashboardDeliveringScreen(): JSX.Element {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const filteredOrders = DELIVERING_ORDERS.filter((order) => {
    if (filter === "all") return true;
    if (filter === "pickup") return order.status === "Out for pickup";
    if (filter === "transit") return order.status === "In transit";
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
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
              Deliveries – Sending
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Parcels you are currently sending
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Filters */}
      <Stack direction="row" spacing={1} sx={{ mb: 2.5, flexWrap: "wrap" }}>
        <Chip
          label="All"
          onClick={() => setFilter("all")}
          size="small"
          sx={{
            height: 26,
            borderRadius: 999,
            fontSize: 11,
            bgcolor: filter === "all" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
            color: filter === "all" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
        <Chip
          label="Out for pickup"
          onClick={() => setFilter("pickup")}
          size="small"
          sx={{
            height: 26,
            borderRadius: 999,
            fontSize: 11,
            bgcolor: filter === "pickup" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
            color: filter === "pickup" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
        <Chip
          label="In transit"
          onClick={() => setFilter("transit")}
          size="small"
          sx={{
            height: 26,
            borderRadius: 999,
            fontSize: 11,
            bgcolor: filter === "transit" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
            color: filter === "transit" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
      </Stack>

      {filteredOrders.length === 0 ? (
        <Typography
          variant="caption"
          sx={{ mt: 4, display: "block", textAlign: "center", color: (t) => t.palette.text.secondary }}
        >
          You have no active deliveries in this view.
        </Typography>
      ) : (
        filteredOrders.map((order) => <DeliveringOrderCard key={order.id} order={order} />)
      )}
    </Box>
  );
}

export default function RiderScreen50DeliveriesDashboardDeliveringCanvas_v2() {
      return (
    
      
      <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (t) => t.palette.background.default }}>
        

        <DarkModeToggle />

        

        <MobileShell>
          <DeliveriesDashboardDeliveringScreen />
        </MobileShell>
      </Box>
    
  );
}
