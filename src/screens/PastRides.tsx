import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Tabs,
  Tab,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";

import StarRoundedIcon from "@mui/icons-material/StarRounded";
import Button from "@mui/material/Button";
import SharedPassengersModal from "../components/SharedPassengersModal";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import StraightenRoundedIcon from "@mui/icons-material/StraightenRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";

// Mock data - would come from API: GET /user/rides?status=past
const PAST_RIDES = [
  {
    id: "ride_001",
    driver: {
      name: "Bwanbale",
      photo: "BW",
      rating: 4.5,
      carModel: "Tesla Model X",
      licensePlate: "LPL 630"
    },
    status: "Completed", // Completed, Cancelled, Rejected
    pickup: {
      location: "Entebbe International Airport",
      timestamp: "12:10 PM"
    },
    dropoff: {
      location: "Ndeeba town",
      timestamp: "2:30 PM"
    },
    date: "Oct 16",
    distance: "12 km",
    fare: "UGX 20,000",
    bookedAt: "05:15 PM, Oct 14",
    sharedPassengers: [
      { name: "John", initials: "JD" },
      { name: "Mary", initials: "MK" }
    ]
  },
  {
    id: "ride_002",
    driver: {
      name: "Tim Smith",
      photo: "TS",
      rating: 4.8,
      carModel: "Tesla Model Y",
      licensePlate: "UPS 256"
    },
    status: "Cancelled",
    pickup: {
      location: "Kampala Road",
      timestamp: "10:00 AM"
    },
    dropoff: {
      location: "Acacia Mall",
      timestamp: "10:25 AM"
    },
    date: "Oct 14",
    distance: "8 km",
    fare: "UGX 15,000",
    bookedAt: "09:30 AM, Oct 14",
    sharedPassengers: []
  },
  {
    id: "ride_003",
    driver: {
      name: "David Kato",
      photo: "DK",
      rating: 4.2,
      carModel: "Nissan Leaf",
      licensePlate: "KLA 123"
    },
    status: "Rejected",
    pickup: {
      location: "Makerere University",
      timestamp: "3:00 PM"
    },
    dropoff: {
      location: "Kololo",
      timestamp: "3:45 PM"
    },
    date: "Oct 12",
    distance: "10 km",
    fare: "UGX 18,000",
    bookedAt: "02:00 PM, Oct 12",
    sharedPassengers: [
      { name: "Sarah", initials: "SA" }
    ]
  },
  {
    id: "ride_004",
    driver: {
      name: "Bwanbale",
      photo: "BW",
      rating: 4.5,
      carModel: "Tesla Model X",
      licensePlate: "LPL 630"
    },
    status: "Completed",
    pickup: {
      location: "Nsambya",
      timestamp: "8:00 AM"
    },
    dropoff: {
      location: "Bugolobi",
      timestamp: "8:30 AM"
    },
    date: "Oct 10",
    distance: "6 km",
    fare: "UGX 12,000",
    bookedAt: "07:45 AM, Oct 10",
    sharedPassengers: []
  }
];

// Mock data for upcoming rides - would come from API: GET /user/rides?status=upcoming
const UPCOMING_RIDES = [
  {
    id: "UP-2025-10-07-1",
    driver: {
      name: "Bwanbale",
      photo: "BW",
      rating: 4.0,
      carModel: "Tesla Model X",
      licensePlate: "UPL 630"
    },
    date: "Tomorrow",
    bookedAt: "Today, 05:15 PM",
    pickupTime: "08:30 AM",
    distance: "12 km",
    fare: "UGX 20,000",
    origin: "New School, JJ Street, Kampala",
    destination: "New School, JJ Street, Kampala",
    status: "Confirmed",
    rideType: "XL",
    carModel: "Tesla Model X",
    plateColor: "White",
    vehicleImage: "/rides-ui/hero-scooter.svg"
  },
  {
    id: "UP-2025-10-09-1",
    driver: {
      name: "Tim Smith",
      photo: "TS",
      rating: 4.8,
      carModel: "Tesla Model Y",
      licensePlate: "UPS 256"
    },
    date: "Thu, 09 Oct 2025",
    bookedAt: "Wed, 08 Oct 2025 · 09:30 AM",
    pickupTime: "10:00 AM",
    distance: "15 km",
    fare: "UGX 25,000",
    origin: "Acacia Mall, Kololo",
    destination: "Naalya Estates, Kampala",
    status: "Awaiting driver",
    rideType: "Mini",
    carModel: "Tesla Model Y",
    plateColor: "Silver",
    vehicleImage: "/rides-ui/hero-car-mid.svg"
  }
];

interface UpcomingRide {
  id: string;
  driver: {
    name: string;
    photo: string;
    rating: number;
    carModel: string;
    licensePlate: string;
  };
  date: string;
  bookedAt: string;
  pickupTime: string;
  distance: string;
  fare: string;
  origin: string;
  destination: string;
  status: string;
  rideType: string;
  carModel: string;
  plateColor: string;
  vehicleImage: string;
  bookedFor?: {
    source: "self" | "contact" | "manual";
    name?: string;
    phone?: string;
  } | null;
}

function formatShortDateTime(value?: string): { date: string; time: string } {
  if (!value) {
    return { date: "Upcoming", time: "--" };
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return { date: value, time: "--" };
  }
  return {
    date: parsed.toLocaleDateString([], { weekday: "short", day: "2-digit", month: "short", year: "numeric" }),
    time: parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  };
}

function initials(name: string): string {
  const parts = name
    .split(" ")
    .map((part) => part.trim()[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return parts || "DR";
}

function mapRideTypeLabel(serviceLevel?: string, category?: string): string {
  const value = `${serviceLevel || ""} ${category || ""}`.toLowerCase();
  if (value.includes("xl")) return "XL";
  if (value.includes("scooter") || value.includes("lite")) return "Scooter";
  if (value.includes("mini") || value.includes("comfort") || value.includes("mid") || value.includes("sedan")) return "Mini";
  return "Mini";
}

function mapVehicleImage(rideType: string, model?: string): string {
  const normalized = `${rideType} ${model || ""}`.toLowerCase();
  if (normalized.includes("xl")) return "/rides-ui/hero-car-large.svg";
  if (normalized.includes("scooter")) return "/rides-ui/hero-scooter.svg";
  return "/rides-ui/hero-car-mid.svg";
}

interface UpcomingRideCardProps {
  ride: UpcomingRide;
  onCancel?: (rideId: string) => void;
  onChangeDate?: (ride: UpcomingRide) => void;
  onClick?: () => void;
}

function UpcomingRideCard({ ride, onCancel, onChangeDate, onClick }: UpcomingRideCardProps): React.JSX.Element {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  
  const handleCancelClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation(); // Prevent card click
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = (): void => {
    setCancelDialogOpen(false);
    if (onCancel) {
      onCancel(ride.id);
    }
  };

  const handleCancelClose = (): void => {
    setCancelDialogOpen(false);
  };

  const handleChangeDateClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation(); // Prevent card click
    if (onChangeDate) {
      onChangeDate(ride);
    }
  };

  // Calculate star rating display
  const fullStars = Math.floor(ride.driver.rating);
  const hasHalfStar = ride.driver.rating % 1 !== 0;

  return (
    <>
      <Card
        elevation={0}
        onClick={onClick}
        sx={{
          mb: uiTokens.spacing.lg,
          borderRadius: uiTokens.radius.xl,
          cursor: "pointer",
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)",
          boxShadow: uiTokens.elevation.card,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)"
          }
        }}
      >
        <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.lg }}>
          {/* Driver Info */}
          <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.md, mb: uiTokens.spacing.lg }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: "#03CD8C",
                fontSize: 18,
                fontWeight: 600,
                color: "#FFFFFF"
              }}
            >
              {ride.driver.photo}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  mb: uiTokens.spacing.xxs / 2,
                  color: (theme) => theme.palette.text.primary
                }}
              >
                {ride.driver.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 11,
                  color: (theme) => theme.palette.text.secondary,
                  display: "block",
                  mb: uiTokens.spacing.xxs / 2
                }}
              >
                {ride.driver.carModel} – {ride.driver.licensePlate}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.xxs }}>
                {Array.from({ length: fullStars }).map((_, i) => (
                  <StarRoundedIcon key={i} sx={{ fontSize: 14, color: "#FFC107" }} />
                ))}
                {hasHalfStar && (
                  <StarRoundedIcon sx={{ fontSize: 14, color: "#FFC107", opacity: 0.5 }} />
                )}
                {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
                  <StarRoundedIcon key={`empty-${i}`} sx={{ fontSize: 14, color: "#D1D5DB" }} />
                ))}
              </Box>
            </Box>
          </Box>
          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              color: "#B45309",
              fontWeight: 700,
              display: "block",
              mb: uiTokens.spacing.md
            }}
          >
            {ride.bookedFor?.source && ride.bookedFor.source !== "self"
              ? `For: ${ride.bookedFor.name || "Booked rider"}${ride.bookedFor.phone ? ` (${ride.bookedFor.phone})` : ""}`
              : "For: You"}
          </Typography>

          <Card
            elevation={0}
            sx={{
              borderRadius: uiTokens.radius.lg,
              border: "1px solid",
              borderColor: (theme) => (theme.palette.mode === "light" ? "#E5E7EB" : "#334155"),
              bgcolor: (theme) => (theme.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.75)"),
              mb: uiTokens.spacing.lg
            }}
          >
            <CardContent sx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.md, "&:last-child": { pb: uiTokens.spacing.md } }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: uiTokens.spacing.sm }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#F97316",
                      display: "block",
                      mb: 0.4
                    }}
                  >
                    Vehicle details
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, color: (theme) => theme.palette.text.primary }}>
                    {ride.rideType} • {ride.carModel}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}>
                    Plate {ride.driver.licensePlate} • {ride.plateColor}
                  </Typography>
                </Box>
                <Box
                  component="img"
                  src={ride.vehicleImage}
                  alt={ride.rideType}
                  sx={{ width: 82, height: 54, objectFit: "contain", borderRadius: 1.5, bgcolor: "#EEF2F7", p: 0.4 }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Trip Details - Origin and Destination with dotted line */}
          <Box sx={{ mb: uiTokens.spacing.lg, position: "relative", pl: uiTokens.spacing.lg }}>
            {/* Vertical dotted line */}
            <Box
              sx={{
                position: "absolute",
                left: 7,
                top: 8,
                bottom: 8,
                width: 2,
                borderLeft: "2px dotted",
                borderColor: (theme) =>
                  theme.palette.mode === "light" ? "#D1D5DB" : "#4B5563"
              }}
            />
            
            {/* Origin */}
            <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.sm, mb: uiTokens.spacing.mdPlus }}>
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  bgcolor: "#22c55e",
                  border: "2px solid",
                  borderColor: (theme) => theme.palette.background.default,
                  zIndex: 1,
                  position: "relative"
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: (theme) => theme.palette.text.primary
                }}
              >
                {ride.origin}
              </Typography>
            </Box>

            {/* Destination */}
            <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.sm }}>
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  bgcolor: "#F59E0B",
                  border: "2px solid",
                  borderColor: (theme) => theme.palette.background.default,
                  zIndex: 1,
                  position: "relative"
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: (theme) => theme.palette.text.primary
                }}
              >
                {ride.destination}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: uiTokens.spacing.mdPlus }} />

          {/* Ride Summary Row */}
          <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.lg, mb: uiTokens.spacing.md }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <CalendarTodayRoundedIcon
                sx={{ fontSize: 16, color: (theme) => theme.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 12, color: (theme) => theme.palette.text.primary }}
              >
                {ride.date}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <AccessTimeRoundedIcon
                sx={{ fontSize: 16, color: (theme) => theme.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 12, color: (theme) => theme.palette.text.primary }}
              >
                {ride.pickupTime}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <StraightenRoundedIcon
                sx={{ fontSize: 16, color: (theme) => theme.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 12, color: (theme) => theme.palette.text.primary }}
              >
                {ride.distance}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <AccountBalanceWalletRoundedIcon
                sx={{ fontSize: 16, color: (theme) => theme.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 12, fontWeight: 600, color: (theme) => theme.palette.text.primary }}
              >
                {ride.fare}
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              fontWeight: 600,
              color: (theme) => theme.palette.text.secondary,
              display: "block",
              mb: uiTokens.spacing.lg
            }}
          >
            Booked: {ride.bookedAt}
          </Typography>

          {/* Action Buttons */}
          <Stack direction="row" spacing={uiTokens.spacing.sm}>
            <Button
              fullWidth
              variant="contained"
              size="small"
              onClick={handleChangeDateClick}
              sx={{
                borderRadius: uiTokens.radius.xl,
                fontSize: 13,
                fontWeight: 600,
                textTransform: "none",
                py: uiTokens.spacing.smPlus,
                bgcolor: "#03CD8C",
                color: "#FFFFFF",
                "&:hover": {
                  bgcolor: "#1976D2"
                }
              }}
            >
              Change Date
            </Button>
            <Button
              fullWidth
              variant="contained"
              size="small"
              onClick={handleCancelClick}
              sx={{
                borderRadius: uiTokens.radius.xl,
                fontSize: 13,
                fontWeight: 600,
                textTransform: "none",
                py: uiTokens.spacing.smPlus,
                bgcolor: "#EF4444",
                color: "#FFFFFF",
                "&:hover": {
                  bgcolor: "#DC2626"
                }
              }}
            >
              Cancel Ride
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCancelClose}
        PaperProps={{
          sx: {
            borderRadius: uiTokens.radius.xl,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"
  }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Cancel Ride</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this ride? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: uiTokens.spacing.lg, pb: uiTokens.spacing.lg }}>
          <Button
            onClick={handleCancelClose}
            sx={{
              textTransform: "none",
              color: (theme) => theme.palette.text.secondary
            }}
          >
            Keep Ride
          </Button>
          <Button
            onClick={handleCancelConfirm}
            variant="contained"
            sx={{
              textTransform: "none",
              bgcolor: "#EF4444",
              "&:hover": {
                bgcolor: "#DC2626"
              }
            }}
          >
            Cancel Ride
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

interface PastRide {
  id: string;
  driver: {
    name: string;
    photo: string;
    rating: number;
    carModel: string;
    licensePlate: string;
  };
  status: string;
  pickup: {
    location: string;
    timestamp: string;
  };
  dropoff: {
    location: string;
    timestamp: string;
  };
  date: string;
  distance: string;
  fare: string;
  bookedAt: string;
  bookedFor?: {
    source: "self" | "contact" | "manual";
    name?: string;
    phone?: string;
  } | null;
  sharedPassengers: Array<{
    name: string;
    initials: string;
    fare?: string;
  }>;
}

interface RideHistoryCardProps {
  ride: PastRide;
  onClick?: () => void;
  onSharedPassengersClick?: (data: {
    mainPassenger: {
      name: string;
      initials: string;
      dropOff: string;
      fare: string;
    };
    sharingPassengers: Array<{
      name: string;
      initials: string;
      dropOff: string;
      fare: string;
      rating: number;
    }>;
  }) => void;
}

function RideHistoryCard({ ride, onClick, onSharedPassengersClick }: RideHistoryCardProps): React.JSX.Element {
  // Status tag colors
  const getStatusColor = (status: string): { bg: string; color: string } => {
    switch (status) {
      case "Completed":
        return { bg: "#22c55e", color: "#FFFFFF" };
      case "Cancelled":
        return { bg: "#FCA5A5", color: "#991B1B" }; // Light red
      case "Rejected":
        return { bg: "#EF4444", color: "#FFFFFF" }; // Red
      default:
        return { bg: "#6B7280", color: "#FFFFFF" };
    }
  };

  const statusColor = getStatusColor(ride.status);

  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        mb: uiTokens.spacing.lg,
        borderRadius: uiTokens.radius.xl,
        cursor: "pointer",
        bgcolor: (theme) =>
          theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: (theme) =>
          theme.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }
      }}
    >
      <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.lg }}>
        {/* Driver Info Row */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: uiTokens.spacing.lg }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.md, flex: 1 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: "#03CD8C",
                fontSize: 18,
                fontWeight: 600,
                color: "#FFFFFF"
              }}
            >
              {ride.driver.photo}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  mb: uiTokens.spacing.xxs / 2,
                  color: (theme) => theme.palette.text.primary
                }}
              >
                {ride.driver.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 11,
                  color: (theme) => theme.palette.text.secondary,
                  display: "block"
                }}
              >
                {ride.driver.carModel} – {ride.driver.licensePlate}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.xxs, mt: uiTokens.spacing.xxs / 2 }}>
                <StarRoundedIcon sx={{ fontSize: 14, color: "#FFC107" }} />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: (theme) => theme.palette.text.primary
                  }}
                >
                  {ride.driver.rating}
                </Typography>
              </Box>
            </Box>
          </Box>
          {/* Status Tag */}
          <Chip
            label={ride.status}
            size="small"
            sx={{
              height: 24,
              fontSize: 10,
              fontWeight: 600,
              bgcolor: statusColor.bg,
              color: statusColor.color,
              borderRadius: uiTokens.radius.sm
            }}
          />
        </Box>

        {/* Trip Route Details */}
        <Box sx={{ mb: uiTokens.spacing.lg, position: "relative", pl: uiTokens.spacing.lg }}>
          {/* Vertical dotted line */}
          <Box
            sx={{
              position: "absolute",
              left: 7,
              top: 8,
              bottom: 8,
              width: 2,
              borderLeft: "2px dotted",
              borderColor: (theme) =>
                theme.palette.mode === "light" ? "#D1D5DB" : "#4B5563"
            }}
          />
          
          {/* Pickup Point */}
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: uiTokens.spacing.mdPlus }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, flex: 1 }}>
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  bgcolor: "#22c55e",
                  border: "2px solid",
                  borderColor: (theme) => theme.palette.background.default,
                  mt: 0.25,
                  zIndex: 1,
                  position: "relative"
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: (theme) => theme.palette.text.primary,
                    mb: 0.25
                  }}
                >
                  {ride.pickup.location}
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="caption"
              sx={{
                fontSize: 11,
                color: (theme) => theme.palette.text.secondary,
                ml: 1
              }}
            >
              {ride.pickup.timestamp}
            </Typography>
          </Box>

          {/* Drop-off Point */}
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, flex: 1 }}>
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  bgcolor: "#F59E0B",
                  border: "2px solid",
                  borderColor: (theme) => theme.palette.background.default,
                  mt: 0.25,
                  zIndex: 1,
                  position: "relative"
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: (theme) => theme.palette.text.primary,
                    mb: 0.25
                  }}
                >
                  {ride.dropoff.location}
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="caption"
              sx={{
                fontSize: 11,
                color: (theme) => theme.palette.text.secondary,
                ml: 1
              }}
            >
              {ride.dropoff.timestamp}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Ride Summary Row (Icons + Data) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <CalendarTodayRoundedIcon
              sx={{ fontSize: 16, color: (theme) => theme.palette.text.secondary }}
            />
            <Typography
              variant="caption"
              sx={{ fontSize: 12, color: (theme) => theme.palette.text.primary }}
            >
              {ride.date}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <StraightenRoundedIcon
              sx={{ fontSize: 16, color: (theme) => theme.palette.text.secondary }}
            />
            <Typography
              variant="caption"
              sx={{ fontSize: 12, color: (theme) => theme.palette.text.primary }}
            >
              {ride.distance}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <AccountBalanceWalletRoundedIcon
              sx={{ fontSize: 16, color: (theme) => theme.palette.text.secondary }}
            />
            <Typography
              variant="caption"
              sx={{ fontSize: 12, fontWeight: 600, color: (theme) => theme.palette.text.primary }}
            >
              {ride.fare}
            </Typography>
          </Box>
        </Box>

        {/* Subtext: Booked time */}
        <Typography
          variant="caption"
          sx={{
            fontSize: 11,
            color: (theme) => theme.palette.text.secondary,
            display: "block",
            mb: 0.5
          }}
        >
          Booked {ride.bookedAt}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontSize: 11,
            color: "#B45309",
            fontWeight: 700,
            display: "block",
            mb: ride.sharedPassengers && ride.sharedPassengers.length > 0 ? 1.5 : 0
          }}
        >
          {ride.bookedFor?.source && ride.bookedFor.source !== "self"
            ? `For: ${ride.bookedFor.name || "Booked rider"}${ride.bookedFor.phone ? ` (${ride.bookedFor.phone})` : ""}`
            : "For: You"}
        </Typography>

        {/* Shared Passengers Section (if applicable) */}
        {ride.sharedPassengers && ride.sharedPassengers.length > 0 && (
          <Box
            sx={{
              mt: 1.5,
              pt: 1.5,
              borderTop: "1px solid",
              borderColor: (theme) => theme.palette.divider,
              cursor: "pointer"
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (onSharedPassengersClick) {
                // Prepare passenger data for modal
                // In production, this would come from API: GET /rides/{ride_id}/shared-passengers
                const passengerData = {
                  mainPassenger: {
                    name: "Stewart Robinson", // Would come from API
                    initials: "SR",
                    dropOff: ride.dropoff.location,
                    fare: ride.fare.replace("UGX ", "").replace(/,/g, "")
                  },
                  sharingPassengers: ride.sharedPassengers.map(p => ({
                    name: p.name,
                    initials: p.initials,
                    dropOff: ride.dropoff.location, // Could be different per passenger - would come from API
                    fare: p.fare || ride.fare.replace("UGX ", "").replace(/,/g, ""),
                    rating: 4.5 // Would come from API
                  }))
                };
                onSharedPassengersClick(passengerData);
              }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: (theme) => theme.palette.text.secondary
                }}
              >
                Shared Passengers
              </Typography>
              <Stack direction="row" spacing={-0.75}>
                {ride.sharedPassengers.map((passenger: { name: string; initials: string; fare?: string }, index: number) => (
                  <Avatar
                    key={index}
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "#03CD8C",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#FFFFFF",
                      border: "2px solid",
                      borderColor: (theme) => theme.palette.background.default
                    }}
                  >
                    {passenger.initials}
                  </Avatar>
                ))}
        </Stack>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

function RideHistoryPastTripsScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { ride, sharedLocationState } = useAppData();
  const [tab, setTab] = useState("upcoming"); // Default to Upcoming tab
  const [pastRides, setPastRides] = useState<PastRide[]>([]);
  const [upcomingRides, setUpcomingRides] = useState<UpcomingRide[]>([]);
  const [loading, setLoading] = useState(false);
  const [sharedPassengersModalOpen, setSharedPassengersModalOpen] = useState(false);
  const [selectedRideForPassengers, setSelectedRideForPassengers] = useState<{
    mainPassenger: {
      name: string;
      initials: string;
      dropOff: string;
      fare: string;
    };
    sharingPassengers: Array<{
      name: string;
      initials: string;
      dropOff: string;
      fare: string;
      rating: number;
    }>;
  } | null>(null);

  const dynamicPastRides = useMemo<PastRide[]>(() => {
    return ride.history
      .filter((trip) => trip.status === "completed" || trip.status === "cancelled")
      .map((trip) => {
        const when = formatShortDateTime(trip.completedAt || trip.startedAt);
        const status = trip.status === "completed" ? "Completed" : "Cancelled";
        return {
          id: trip.id,
          driver: {
            name: trip.driver?.name || "Driver",
            photo: initials(trip.driver?.name || "Driver"),
            rating: trip.driver?.rating || 4.5,
            carModel: trip.vehicle?.model || "EV",
            licensePlate: trip.vehicle?.plate || "--"
          },
          status,
          pickup: {
            location: trip.pickup?.address || trip.pickup?.label || "Pickup",
            timestamp: formatShortDateTime(trip.startedAt).time
          },
          dropoff: {
            location: trip.dropoff?.address || trip.dropoff?.label || "Destination",
            timestamp: formatShortDateTime(trip.completedAt || trip.startedAt).time
          },
          date: when.date,
          distance: trip.distance || "0 km",
          fare: trip.fareEstimate || "UGX 0",
          bookedAt: when.time,
          bookedFor: trip.bookedFor ?? null,
          sharedPassengers: []
        };
      });
  }, [ride.history]);

  const dynamicUpcomingRides = useMemo<UpcomingRide[]>(() => {
    const origin = ride.request.origin?.address || ride.request.origin?.label;
    const destination = ride.request.destination?.address || ride.request.destination?.label;
    if (!origin || !destination) {
      return [];
    }
    const routeDistance =
      typeof sharedLocationState.routeDistanceKm === "number"
        ? `${Math.max(1, Math.round(sharedLocationState.routeDistanceKm))} km`
        : "--";
    const scheduleInfo =
      ride.request.schedule === "later"
        ? formatShortDateTime(ride.request.scheduleTime)
        : { date: "Today", time: "Now" };
    const rideType = mapRideTypeLabel(ride.request.serviceLevel, ride.activeTrip?.vehicle?.category);
    return [
      {
        id: `request-${ride.request.scheduleTime || "now"}`,
        driver: {
          name: ride.activeTrip?.driver?.name || "Pending driver",
          photo: initials(ride.activeTrip?.driver?.name || "Pending driver"),
          rating: ride.activeTrip?.driver?.rating || 4.0,
          carModel: ride.activeTrip?.vehicle?.model || "EV",
          licensePlate: ride.activeTrip?.vehicle?.plate || "--"
        },
        date: scheduleInfo.date,
        bookedAt:
          ride.request.schedule === "later"
            ? `Scheduled ${scheduleInfo.date} · ${scheduleInfo.time}`
            : `Booked ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        pickupTime: scheduleInfo.time,
        distance: routeDistance,
        fare: ride.activeTrip?.fareEstimate || ride.options[0]?.fare || "UGX --",
        origin,
        destination,
        status: ride.request.schedule === "later" ? "Confirmed" : "Awaiting driver",
        rideType,
        carModel: ride.activeTrip?.vehicle?.model || "EV",
        plateColor: ride.activeTrip?.vehicle?.color || "White",
        vehicleImage: mapVehicleImage(rideType, ride.activeTrip?.vehicle?.model),
        bookedFor: ride.request.bookedFor ?? null
      }
    ];
  }, [
    ride.activeTrip?.driver?.name,
    ride.activeTrip?.driver?.rating,
    ride.activeTrip?.fareEstimate,
    ride.activeTrip?.vehicle?.model,
    ride.activeTrip?.vehicle?.color,
    ride.activeTrip?.vehicle?.category,
    ride.activeTrip?.vehicle?.plate,
    ride.options,
    ride.request.destination?.address,
    ride.request.destination?.label,
    ride.request.origin?.address,
    ride.request.origin?.label,
    ride.request.schedule,
    ride.request.scheduleTime,
    ride.request.bookedFor,
    sharedLocationState.routeDistanceKm
  ]);

  // Fetch rides from API based on selected tab
  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true);
      try {
        if (tab === "past") {
          // API endpoint: GET /user/rides?status=past
          // In production:
          // const response = await fetch('/api/user/rides?status=past');
          // const data = await response.json();
          // setPastRides(data);
          setPastRides(dynamicPastRides.length > 0 ? dynamicPastRides : PAST_RIDES);
        } else if (tab === "upcoming") {
          // API endpoint: GET /user/rides?status=upcoming
          // In production:
          // const response = await fetch('/api/user/rides?status=upcoming');
          // const data = await response.json();
          // setUpcomingRides(data);
          setUpcomingRides(dynamicUpcomingRides.length > 0 ? dynamicUpcomingRides : UPCOMING_RIDES);
        }
      } catch (error) {
        console.error("Error fetching rides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [tab, dynamicPastRides, dynamicUpcomingRides]);

  const handleTabChange = (_e: React.SyntheticEvent, newValue: string): void => {
    setTab(newValue);
    // No navigation - just switch tabs on the same screen
  };

  const handleRideClick = (rideId: string, source: "upcoming" | "past", rideData: UpcomingRide | PastRide): void => {
    // Navigate to Ride Details Screen
    navigate(`/rides/history/${rideId}`, {
      state: {
        historyType: source,
        rideData
      }
    });
  };

  const handleCancelRide = async (rideId: string): Promise<void> => {
    try {
      // API endpoint: /ride/cancel/:ride_id
      // In production:
      // await fetch(`/api/ride/cancel/${rideId}`, { method: 'POST' });
      
      console.log("Cancelling ride:", rideId);
      
      // Update list dynamically - remove cancelled ride
      setUpcomingRides(prev => prev.filter((ride: UpcomingRide) => ride.id !== rideId));
      
      // Show success message (optional)
      // You could add a snackbar here
    } catch (error) {
      console.error("Error cancelling ride:", error);
    }
  };

  const handleChangeDate = (ride: UpcomingRide): void => {
    // Navigate to schedule screen to change date/time
    navigate("/rides/schedule", {
      state: {
        rideId: ride.id,
        existingRide: ride
      }
    });
  };

  return (
    <ScreenScaffold>
      <SectionHeader
        title="Ride history"
        subtitle="Manage your EV rides"
        leadingAction={
          <IconButton
            size="small"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 5,
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
        }
      />

      <Box sx={{ mt: 1 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            minHeight: 36,
            mb: 2,
            "& .MuiTab-root": {
              minHeight: 36,
              fontSize: 12,
              textTransform: "none",
              color: "rgba(148,163,184,1)"
            },
            "& .Mui-selected": {
              color: (theme) => (theme.palette.mode === "light" ? "#111827" : "#FFFFFF"),
              fontWeight: 600
            },
            "& .MuiTabs-indicator": {
              height: 2,
              borderRadius: 5,
              bgcolor: "primary.main"
            }
          }}
        >
          <Tab value="upcoming" label="Upcoming" />
          <Tab value="past" label="Past trips" />
        </Tabs>

        {loading ? (
          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              color: (t) => t.palette.text.secondary,
              py: 4
            }}
          >
            Loading rides...
          </Typography>
        ) : tab === "past" ? (
          <Box>
            {pastRides.length === 0 ? (
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  color: (t) => t.palette.text.secondary,
                  py: 4
                }}
              >
                No past rides found
              </Typography>
            ) : (
              pastRides.map((ride) => (
                <RideHistoryCard
                  key={ride.id}
                  ride={ride}
                  onClick={() => handleRideClick(ride.id, "past", ride)}
                  onSharedPassengersClick={(passengerData) => {
                    setSelectedRideForPassengers(passengerData);
                    setSharedPassengersModalOpen(true);
                  }}
                />
              ))
            )}
          </Box>
        ) : (
          <Box>
            {upcomingRides.length === 0 ? (
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  color: (t) => t.palette.text.secondary,
                  py: 4
                }}
              >
                You have no upcoming rides. Scheduled EV rides will appear here.
              </Typography>
            ) : (
              upcomingRides.map((ride) => (
                <UpcomingRideCard
                  key={ride.id}
                  ride={ride}
                  onCancel={handleCancelRide}
                  onChangeDate={handleChangeDate}
                  onClick={() => handleRideClick(ride.id, "upcoming", ride)}
                />
              ))
            )}
          </Box>
        )}
      </Box>

      {/* Shared Passengers Modal */}
      <SharedPassengersModal
        open={sharedPassengersModalOpen}
        onClose={() => {
          setSharedPassengersModalOpen(false);
          setSelectedRideForPassengers(null);
        }}
        selectedRideData={selectedRideForPassengers}
      />
    </ScreenScaffold>
  );
}

export default function RiderScreen33RideHistoryPastTripsCanvas_v2() {
  return <RideHistoryPastTripsScreen />;
}
