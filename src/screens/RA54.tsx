import React from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import MarkunreadMailboxRoundedIcon from "@mui/icons-material/MarkunreadMailboxRounded";
import MobileShell from "../components/MobileShell";

// v3 variant – focusing on delivered history only, with a more timeline-style layout

const RECEIVED_ORDERS_V3 = [
  {
    id: "RCV-2025-10-06-003",
    fromName: "EVzone Marketplace",
    toAddress: "Nsambya Road 472, Kampala",
    deliveredAt: "Today • 11:20 AM",
    label: "EV accessories"
  },
  {
    id: "RCV-2025-10-05-001",
    fromName: "John Doe",
    toAddress: "Bugolobi Village, Kampala",
    deliveredAt: "Yesterday • 02:10 PM",
    label: "Documents"
  }
];

function ReceivedHistoryRow({ order }): JSX.Element {
  return (
    <Box sx={{ display: "flex", gap: 1.5, py: 1.1 }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: 999,
            bgcolor: "primary.main",
            mb: 0.5
          }}
        />
        <Box
          sx={{
            flex: 1,
            width: 2,
            bgcolor: (t) =>
              t.palette.mode === "light" ? "#E5E7EB" : "rgba(51,65,85,1)",
            minHeight: 26
          }}
        />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
        >
          {order.deliveredAt}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.01em" }}
        >
          From: {order.fromName}
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}
        >
          To: {order.toAddress}
        </Typography>
        <Chip
          size="small"
          label={order.label}
          icon={<Inventory2RoundedIcon sx={{ fontSize: 14 }} />}
          sx={{
            mt: 0.5,
            borderRadius: 999,
            fontSize: 10,
            height: 22,
            bgcolor: (t) =>
              t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
            color: (t) => t.palette.text.primary
          }}
        />
      </Box>
    </Box>
  );
}

function DeliveriesDashboardReceivedV3Screen(): JSX.Element {
  const navigate = useNavigate();
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
              Deliveries – History (v3)
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Delivered parcels in timeline view
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Summary */}
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
                Delivered this week
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                {RECEIVED_ORDERS_V3.length}
              </Typography>
            </Box>
            <Chip
              size="small"
              icon={<MarkunreadMailboxRoundedIcon sx={{ fontSize: 16 }} />}
              label="Received"
              sx={{
                borderRadius: 999,
                fontSize: 10,
                height: 24,
                bgcolor: "rgba(34,197,94,0.12)",
                color: "#16A34A"
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Timeline list */}
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
          {RECEIVED_ORDERS_V3.length === 0 ? (
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
              No delivered parcels in this period.
            </Typography>
          ) : (
            RECEIVED_ORDERS_V3.map((order) => <ReceivedHistoryRow key={order.id} order={order} />)
          )}
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{
          mt: 1.5,
          display: "block",
          fontSize: 11,
          color: (t) => t.palette.text.secondary
        }}
      >
        Use this view to quickly confirm delivery times and items you’ve
        received from senders.
      </Typography>
    </Box>
  );
}

export default function RiderScreen54DeliveriesDashboardReceivedV3Canvas_v2() {
      return (
    
      
      <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (t) => t.palette.background.default }}>
        

        <DarkModeToggle />

        

        <MobileShell>
          <DeliveriesDashboardReceivedV3Screen />
        </MobileShell>
      </Box>
    
  );
}
