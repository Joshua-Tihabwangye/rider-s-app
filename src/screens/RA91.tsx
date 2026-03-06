import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Avatar
} from "@mui/material";

import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import TourRoundedIcon from "@mui/icons-material/TourRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";

import MobileShell from "../components/MobileShell";

interface Order {
  id: string;
  type: string;
  title: string;
  date: string;
  from: string;
  to: string;
  status: "Ordered" | "Delivery" | "In Transit" | "Completed" | "Cancelled";
  fare: string;
  driver?: string;
  vehicle?: string;
}

const ALL_ORDERS: Order[] = [
  {
    id: "RIDE-2025-10-01-001",
    type: "Ride",
    title: "EV ride to Bugolobi",
    date: "01 Oct 2025 • 09:20",
    from: "Nsambya",
    to: "Bugolobi",
    status: "Completed",
    fare: "UGX 5,500",
    driver: "Tim Smith",
    vehicle: "Tesla Model Y"
  },
  {
    id: "DLV-2025-10-05-002",
    type: "Delivery",
    title: "Parcel to EVzone Hub",
    date: "05 Oct 2025 • 16:05",
    from: "Kansanga",
    to: "Nsambya EV Hub",
    status: "In Transit",
    fare: "UGX 8,000"
  },
  {
    id: "RENT-2025-10-07-001",
    type: "Rental",
    title: "Nissan Leaf – 3 days",
    date: "07 Oct 2025 • 10:00",
    from: "Nsambya EV Hub",
    to: "Bugolobi EV Hub",
    status: "Delivery",
    fare: "UGX 450,000"
  },
  {
    id: "TOUR-BOOK-2025-10-12-001",
    type: "Tour",
    title: "Kampala City EV Highlights",
    date: "12 Oct 2025 • 14:00",
    from: "Central Kampala",
    to: "City loop",
    status: "Ordered",
    fare: "UGX 120,000"
  },
  {
    id: "AMB-REQ-2025-10-07-001",
    type: "Ambulance",
    title: "Ambulance request",
    date: "07 Oct 2025 • 14:32",
    from: "Nsambya Road 472",
    to: "Nsambya Hospital",
    status: "Completed",
    fare: "UGX 25,000"
  }
];

function getTypeIcon(type: string): React.ReactElement {
  switch (type) {
    case "Ride":
      return <DirectionsCarFilledRoundedIcon sx={{ fontSize: 20 }} />;
    case "Delivery":
      return <LocalShippingRoundedIcon sx={{ fontSize: 20 }} />;
    case "Rental":
      return <ElectricCarRoundedIcon sx={{ fontSize: 20 }} />;
    case "Tour":
      return <TourRoundedIcon sx={{ fontSize: 20 }} />;
    case "Ambulance":
      return <LocalHospitalRoundedIcon sx={{ fontSize: 20 }} />;
    default:
      return <MoreHorizRoundedIcon sx={{ fontSize: 20 }} />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "Completed": return { bg: "rgba(34,197,94,0.12)", text: "#16A34A" };
    case "In Transit": return { bg: "rgba(59,130,246,0.12)", text: "#2563EB" };
    case "Ordered": return { bg: "rgba(245,158,11,0.12)", text: "#D97706" };
    case "Delivery": return { bg: "rgba(139,92,246,0.12)", text: "#7C3AED" };
    default: return { bg: "rgba(148,163,184,0.18)", text: "rgba(148,163,184,1)" };
  }
}

function AllOrdersCard({ order, onOpenDetail }: { order: Order; onOpenDetail: (o: Order) => void }): React.JSX.Element {
  const statusColors = getStatusColor(order.status);
  
  return (
    <Card
      elevation={0}
      onClick={() => onOpenDetail(order)}
      sx={{
        mb: 1.75,
        borderRadius: 2,
        cursor: "pointer",
        bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: (t) => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
          borderColor: "#03CD8C"
        }
      }}
    >
      <CardContent sx={{ px: 1.75, py: 1.6 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 999,
              bgcolor: (t) => t.palette.mode === "light" ? "#F3F4F6" : "rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#03CD8C"
            }}
          >
            {getTypeIcon(order.type)}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
              {order.title}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary" }}>
              {order.date}
            </Typography>
          </Box>
          <Chip
            size="small"
            label={order.status}
            sx={{ 
              borderRadius: 1, 
              fontSize: 10, 
              fontWeight: 700, 
              height: 22, 
              bgcolor: statusColors.bg, 
              color: statusColors.text 
            }}
          />
        </Stack>

        <Stack direction="row" spacing={0.75} alignItems="flex-start" sx={{ mb: 1.5, pl: 0.5 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 0.5 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#03CD8C" }} />
            <Box sx={{ width: 1, height: 12, bgcolor: "rgba(0,0,0,0.1)" }} />
            <PlaceRoundedIcon sx={{ fontSize: 14, color: "#F77F00", mt: -0.5 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary", display: "block", lineHeight: 1.2 }}>
              {order.from}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600, display: "block", mt: 0.5 }}>
              {order.to}
            </Typography>
          </Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#03CD8C" }}>
            {order.fare}
          </Typography>
        </Stack>
        
        <Divider sx={{ mb: 1.5, opacity: 0.5 }} />
        
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" sx={{ fontSize: 10, color: "text.secondary", fontStyle: "italic" }}>
            {order.id}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, color: "#03CD8C" }}>
            View details
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function AllOrdersCombinedHistoryScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = ALL_ORDERS.filter((order) => {
    if (filter === "all") return true;
    return order.type === filter;
  });

  return (
    <Box>
      <Box sx={{ bgcolor: "#03CD8C", px: 2, pt: 2, pb: 2, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <IconButton
          size="small"
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
        <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: "-0.01em", color: "#FFFFFF" }}>
          All Orders History
        </Typography>
      </Box>

      <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>
        {/* Filters */}
        <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: "auto", pb: 1, "&::-webkit-scrollbar": { display: "none" } }}>
          {["all", "Ride", "Delivery", "Rental", "Tour", "Ambulance"].map((tag) => (
            <Chip
              key={tag}
              label={tag === "all" ? "All" : tag}
              onClick={() => setFilter(tag)}
              size="small"
              sx={{
                borderRadius: 999,
                fontSize: 11,
                fontWeight: filter === tag ? 700 : 500,
                height: 28,
                px: 1,
                bgcolor: filter === tag ? "#03CD8C" : "transparent",
                color: filter === tag ? "#FFFFFF" : "text.secondary",
                border: filter === tag ? "none" : "1px solid rgba(0,0,0,0.1)",
                "&:hover": { bgcolor: filter === tag ? "#02b57b" : "rgba(0,0,0,0.05)" }
              }}
            />
          ))}
        </Stack>

        {filtered.length === 0 ? (
          <Box sx={{ mx: 7, py: 10, textAlign: "center", opacity: 0.5 }}>
            <AccessTimeRoundedIcon sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="body2">No orders found.</Typography>
          </Box>
        ) : (
          filtered.map((order) => (
            <AllOrdersCard key={order.id} order={order} onOpenDetail={setSelectedOrder} />
          ))
        )}
      </Box>

      {/* Detail Dialog */}
      <Dialog 
        open={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Order Details</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontWeight: 700, fontSize: 10 }}>
                Status
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                <Chip 
                  label={selectedOrder?.status} 
                  size="small" 
                  sx={{ 
                    fontWeight: 700, 
                    borderRadius: 1,
                    ...getStatusColor(selectedOrder?.status || "") 
                  }} 
                />
                <Typography variant="caption">{selectedOrder?.date}</Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontWeight: 700, fontSize: 10 }}>
                Service Type
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: "#03CD8C", color: "#FFFFFF" }}>
                  {selectedOrder && getTypeIcon(selectedOrder.type)}
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedOrder?.type}</Typography>
              </Stack>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontWeight: 700, fontSize: 10 }}>
                Route
              </Typography>
              <Box sx={{ mt: 1, position: "relative", pl: 3 }}>
                <Box sx={{ position: "absolute", left: 0, top: 4, bottom: 4, width: 2, bgcolor: "rgba(0,0,0,0.1)", borderRadius: 1 }} />
                <Box sx={{ position: "absolute", left: -3, top: 0, width: 8, height: 8, borderRadius: "50%", bgcolor: "#03CD8C" }} />
                <Box sx={{ position: "absolute", left: -3, bottom: 0, width: 8, height: 8, borderRadius: "50%", bgcolor: "#F77F00" }} />
                
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>{selectedOrder?.from}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedOrder?.to}</Typography>
              </Box>
            </Box>

            {selectedOrder?.driver && (
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontWeight: 700, fontSize: 10 }}>
                  Driver & Vehicle
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                  {selectedOrder.driver} • {selectedOrder.vehicle}
                </Typography>
              </Box>
            )}

            <Box sx={{ bgcolor: (t) => t.palette.mode === "light" ? "#F9FAFB" : "rgba(255,255,255,0.03)", p: 2, borderRadius: 2 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Total Fare</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#03CD8C" }}>{selectedOrder?.fare}</Typography>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
          <Button 
            fullWidth
            onClick={() => setSelectedOrder(null)}
            sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700, color: "text.secondary" }}
          >
            Close
          </Button>
          {(selectedOrder?.status === "In Transit" || selectedOrder?.status === "Ordered") && (
            <Button 
              fullWidth
              variant="contained" 
              sx={{ borderRadius: 999, bgcolor: "#03CD8C", textTransform: "none", fontWeight: 700 }}
              onClick={() => {
                if (selectedOrder.type === "Ride") navigate("/rides/trip/details");
                if (selectedOrder.type === "Delivery") navigate("/deliveries/tracking/123/live");
              }}
            >
              Track Order
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function RiderScreen91AllOrdersCombinedHistoryCanvas_v2() {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <DarkModeToggle />
      <MobileShell>
        <AllOrdersCombinedHistoryScreen />
      </MobileShell>
    </Box>
  );
}
