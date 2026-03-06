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
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import MobileShell from "../components/MobileShell";

const DELIVERING_ORDERS = [
  {
    id: "DLV-2025-10-07-002",
    toName: "John Doe",
    toAddress: "Acacia Mall, Kololo",
    fromAddress: "Kansanga Market, Kampala",
    status: "In transit",
    eta: "25 min"
  },
  {
    id: "DLV-2025-10-08-001",
    toName: "EVzone Warehouse",
    toAddress: "China–Africa Hub, Kampala",
    fromAddress: "Naalya Estates, Kampala",
    status: "Label created",
    eta: "TBD"
  }
];

interface Order {
  id: string;
  toName: string;
  toAddress: string;
  fromAddress: string;
  status: "Out for pickup" | "In transit" | "Label created" | string;
  eta?: string;
}

interface DeliveringOrderRowProps {
  order: Order;
}

function DeliveringOrderRow({ order }: DeliveringOrderRowProps): React.JSX.Element {
  const statusColorMap: { [key: string]: string } = {
    "Out for pickup": "#F97316",
    "In transit": "#16A34A",
    "Label created": "#4B5563"
  };

  const statusColor = statusColorMap[order.status] || "#4B5563";

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
          To: {order.toName}
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
        >
          {order.toAddress}
        </Typography>
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
        >
          {order.status}
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: statusColor, fontWeight: 500 }}
        >
          {order.eta === "TBD" ? "ETA TBD" : `ETA ${order.eta}`}
        </Typography>
      </Box>
    </Box>
  );
}

function DeliveriesDashboardDeliveringV2Screen(): React.JSX.Element {
  const navigate = useNavigate();
  const [segment, setSegment] = useState("today");

  return (
    <>
    {/* Green Header */}
        <Box sx={{ bgcolor: "#03CD8C", px: 2, pt: 2, pb: 2, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              position: "absolute",
              left: 20,
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "#FFFFFF",
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" }
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, letterSpacing: "-0.01em", color: "#FFFFFF" }}
          >
            Deliveries – Sending (v2)
          </Typography>
        </Box>
        <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>


      {/* Summary card */}
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
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Active deliveries
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                {DELIVERING_ORDERS.length}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Chip
                size="small"
                icon={<LocalShippingRoundedIcon sx={{ fontSize: 16 }} />}
                label="Out for pickup"
                sx={{
                  borderRadius: 999,
                  fontSize: 10,
                  height: 24,
                  bgcolor: "rgba(249,115,22,0.12)",
                  color: "#EA580C"
                }}
              />
              <Chip
                size="small"
                icon={<RouteRoundedIcon sx={{ fontSize: 16 }} />}
                label="In transit"
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
              label="Today"
              size="small"
              onClick={() => setSegment("today")}
              sx={{
                height: 26,
                borderRadius: 999,
                fontSize: 11,
                bgcolor: segment === "today" ? "primary.main" : (t) =>
                  t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                color: segment === "today" ? "#020617" : (t) => t.palette.text.primary
              }}
            />
            <Chip
              label="Next 7 days"
              size="small"
              onClick={() => setSegment("week")}
              sx={{
                height: 26,
                borderRadius: 999,
                fontSize: 11,
                bgcolor: segment === "week" ? "primary.main" : (t) =>
                  t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                color: segment === "week" ? "#020617" : (t) => t.palette.text.primary
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Deliveries list (compact rows) */}
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
          {DELIVERING_ORDERS.map((order, index) => (
            <React.Fragment key={order.id}>
              <DeliveringOrderRow order={order} />
              {index < DELIVERING_ORDERS.length - 1 && (
                <Divider sx={{ my: 0.4, borderColor: (t) => t.palette.divider }} />
              )}
            </React.Fragment>
          ))}
        </CardContent>
      </Card>
    </Box>
    </>

  );
}

export default function RiderScreen52DeliveriesDashboardDeliveringV2Canvas_v2() {
      return (
    
      
      <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (t) => t.palette.background.default }}>
        

        <DarkModeToggle />

        

        <MobileShell>
          <DeliveriesDashboardDeliveringV2Screen />
        </MobileShell>
      </Box>
    
  );
}
