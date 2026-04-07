import React, { useState } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";

import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import TourRoundedIcon from "@mui/icons-material/TourRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";

import { uiTokens } from "../design/tokens";


const ALL_ORDERS = [
  {
    id: "RIDE-2025-10-01-001",
    type: "Ride",
    title: "EV ride to Bugolobi",
    date: "01 Oct 2025 • 09:20",
    from: "Nsambya",
    to: "Bugolobi",
    status: "Completed"
  },
  {
    id: "DLV-2025-10-05-002",
    type: "Delivery",
    title: "Parcel to EVzone Hub",
    date: "05 Oct 2025 • 16:05",
    from: "Kansanga",
    to: "Nsambya EV Hub",
    status: "Completed"
  },
  {
    id: "RENT-2025-10-07-001",
    type: "Rental",
    title: "Nissan Leaf – 3 days",
    date: "07 Oct 2025 • 10:00",
    from: "Nsambya EV Hub",
    to: "Bugolobi EV Hub",
    status: "Upcoming"
  },
  {
    id: "TOUR-BOOK-2025-10-12-001",
    type: "Tour",
    title: "Kampala City EV Highlights",
    date: "12 Oct 2025 • 14:00",
    from: "Central Kampala",
    to: "City loop",
    status: "Upcoming"
  },
  {
    id: "AMB-REQ-2025-10-07-001",
    type: "Ambulance",
    title: "Ambulance request",
    date: "07 Oct 2025 • 14:32",
    from: "Nsambya Road 472",
    to: "Nsambya Hospital",
    status: "Completed"
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

interface Order {
  id: string;
  type: string;
  title: string;
  date: string;
  from: string;
  to: string;
  status: string;
}

interface AllOrdersCardProps {
  order: Order;
}

function AllOrdersCard({ order }: AllOrdersCardProps): React.JSX.Element {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    // Navigate based on order type according to routing guide
    if (order.type === "Ride") {
      // Ride → /rides/history/:rideId (RA37)
      navigate(`/rides/history/${order.id}`);
    } else if (order.type === "Delivery") {
      // Delivery → /deliveries/tracking/:orderId/details (RA68)
      navigate(`/deliveries/tracking/${order.id}/details`);
    } else if (order.type === "Rental") {
      // Rental → /rental/history/:rentalId (RA90)
      navigate(`/rental/history/${order.id}`);
    } else if (order.type === "Tour") {
      // Tour → /tours/history (RA82) then specific tour
      navigate("/tours/history");
    } else if (order.type === "Ambulance") {
      // Ambulance → /ambulance/history (RA88) and tracking
      navigate("/ambulance/history");
    }
  };
  
  return (
    <Card
      elevation={0}
      onClick={handleViewDetails}
      sx={{
        mb: uiTokens.spacing.mdPlus,
        borderRadius: uiTokens.radius.sm,
        cursor: "pointer",
        bgcolor: (t) =>
          t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: (t) =>
          t.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.mdPlus }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: uiTokens.radius.xl,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#E5E7EB" : "rgba(15,23,42,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {getTypeIcon(order.type)}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              {order.title}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {order.type} • {order.date}
            </Typography>
            <Stack direction="row" spacing={uiTokens.spacing.xs} alignItems="center" sx={{ mt: uiTokens.spacing.xxs }}>
              <PlaceRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                {order.from} → {order.to}
              </Typography>
            </Stack>
          </Box>
          <Chip
            size="small"
            label={order.status}
            sx={{
              borderRadius: uiTokens.radius.xl,
              fontSize: 10,
              height: 22,
              bgcolor:
                order.status === "Upcoming"
                  ? "rgba(34,197,94,0.12)"
                  : "rgba(148,163,184,0.18)",
              color:
                order.status === "Upcoming" ? "#16A34A" : "rgba(148,163,184,1)"
            }}
          />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            ID: {order.id}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            sx={{
              borderRadius: uiTokens.radius.xl,
              px: uiTokens.spacing.lg,
              py: uiTokens.spacing.xxs,
              fontSize: 12,
              textTransform: "none"
            }}
          >
            View details
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function AllOrdersCombinedHistoryScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [period, setPeriod] = useState("Month");
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedQuarter, setSelectedQuarter] = useState("Q4");

  const periods = ["Today", "Week", "Month", "Quarter", "Year"];
  const years = [2023, 2024, 2025];
  const quarters = ["Q1", "Q2", "Q3", "Q4"];

  const filtered = ALL_ORDERS.filter((order) => {
    // Type Filter
    const matchesType = filter === "all" || order.type === filter;
    
    // Period Filter logic
    let matchesPeriod = true;
    if (period === "Today") {
      matchesPeriod = order.date.includes("01 Oct 2025");
    } else if (period === "Week") {
      matchesPeriod = ["01", "05", "07"].some(d => order.date.includes(`${d} Oct`));
    } else if (period === "Month") {
      matchesPeriod = order.date.includes("Oct 2025");
    } else if (period === "Quarter") {
      const isYearMatch = order.date.includes(selectedYear.toString());
      let isQuarterMatch = false;
      if (selectedQuarter === "Q4") {
        isQuarterMatch = ["Oct", "Nov", "Dec"].some(m => order.date.includes(m));
      } else if (selectedQuarter === "Q3") {
        isQuarterMatch = ["Jul", "Aug", "Sep"].some(m => order.date.includes(m));
      } else if (selectedQuarter === "Q2") {
        isQuarterMatch = ["Apr", "May", "Jun"].some(m => order.date.includes(m));
      } else if (selectedQuarter === "Q1") {
        isQuarterMatch = ["Jan", "Feb", "Mar"].some(m => order.date.includes(m));
      }
      matchesPeriod = isYearMatch && isQuarterMatch;
    } else if (period === "Year") {
      matchesPeriod = order.date.includes(selectedYear.toString());
    }

    return matchesType && matchesPeriod;
  });

  return (
    <Box sx={{ px: uiTokens.spacing.xl, pt: uiTokens.spacing.xl, pb: uiTokens.spacing.xxl }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
              All orders
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Rides, deliveries, rentals, tours & ambulance
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Period Selection */}
      <Box sx={{ mb: uiTokens.spacing.lg, overflowX: "auto", pb: uiTokens.spacing.sm, display: 'flex' }}>
        <Stack direction="row" spacing={1}>
          {periods.map((p) => (
            <Chip
              key={p}
              label={p}
              onClick={() => setPeriod(p)}
              size="small"
              sx={{
                borderRadius: uiTokens.radius.xl,
                fontSize: 10,
                height: 24,
                bgcolor: period === p ? "primary.main" : "transparent",
                color: period === p ? "#020617" : "text.secondary",
                border: '1px solid',
                borderColor: period === p ? 'primary.main' : 'divider',
                fontWeight: period === p ? 600 : 400,
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Granular Period Selectors */}
      {period === "Quarter" && (
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel id="quarter-select-label" sx={{ fontSize: 12 }}>Quarter</InputLabel>
            <Select
              labelId="quarter-select-label"
              value={selectedQuarter}
              label="Quarter"
              onChange={(e) => setSelectedQuarter(e.target.value as string)}
              sx={{ borderRadius: uiTokens.radius.sm, fontSize: 13 }}
            >
              {quarters.map(q => <MenuItem key={q} value={q} sx={{ fontSize: 13 }}>{q}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel id="year-select-label" sx={{ fontSize: 12 }}>Year</InputLabel>
            <Select
              labelId="year-select-label"
              value={selectedYear}
              label="Year"
              onChange={(e) => setSelectedYear(e.target.value as number)}
              sx={{ borderRadius: uiTokens.radius.sm, fontSize: 13 }}
            >
              {years.map(y => <MenuItem key={y} value={y} sx={{ fontSize: 13 }}>{y}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>
      )}

      {period === "Year" && (
        <Box sx={{ mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="year-only-select-label" sx={{ fontSize: 12 }}>Select Year</InputLabel>
            <Select
              labelId="year-only-select-label"
              value={selectedYear}
              label="Select Year"
              onChange={(e) => setSelectedYear(e.target.value as number)}
              sx={{ borderRadius: uiTokens.radius.sm, fontSize: 13 }}
            >
              {years.map(y => <MenuItem key={y} value={y} sx={{ fontSize: 13 }}>{y}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Filters */}
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", rowGap: 1 }}>
        <Chip
          label="All"
          onClick={() => setFilter("all")}
          size="small"
          sx={{
            borderRadius: uiTokens.radius.xl,
            fontSize: 11,
            height: 26,
            bgcolor: filter === "all" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            color: filter === "all" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
        <Chip
          label="Rides"
          onClick={() => setFilter("Ride")}
          size="small"
          sx={{
            borderRadius: uiTokens.radius.xl,
            fontSize: 11,
            height: 26,
            bgcolor: filter === "Ride" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            color: filter === "Ride" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
        <Chip
          label="Deliveries"
          onClick={() => setFilter("Delivery")}
          size="small"
          sx={{
            borderRadius: uiTokens.radius.xl,
            fontSize: 11,
            height: 26,
            bgcolor: filter === "Delivery" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            color: filter === "Delivery" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
        <Chip
          label="Rentals"
          onClick={() => setFilter("Rental")}
          size="small"
          sx={{
            borderRadius: uiTokens.radius.xl,
            fontSize: 11,
            height: 26,
            bgcolor: filter === "Rental" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            color: filter === "Rental" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
        <Chip
          label="Tours"
          onClick={() => setFilter("Tour")}
          size="small"
          sx={{
            borderRadius: uiTokens.radius.xl,
            fontSize: 11,
            height: 26,
            bgcolor: filter === "Tour" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            color: filter === "Tour" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
        <Chip
          label="Ambulance"
          onClick={() => setFilter("Ambulance")}
          size="small"
          sx={{
            borderRadius: uiTokens.radius.xl,
            fontSize: 11,
            height: 26,
            bgcolor: filter === "Ambulance" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            color: filter === "Ambulance" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
      </Stack>

      {filtered.length === 0 ? (
        <Typography
          variant="caption"
          sx={{ mt: 4, display: "block", textAlign: "center", color: (t) => t.palette.text.secondary }}
        >
          No orders in this view yet.
        </Typography>
      ) : (
        filtered.map((order) => <AllOrdersCard key={order.id} order={order} />)
      )}
    </Box>
  );
}

export default function RiderScreen91AllOrdersCombinedHistoryCanvas_v2() {
      return (
    
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (t) => t.palette.background.default
        }}
      >

          <AllOrdersCombinedHistoryScreen />
        
      </Box>
    
  );
}
