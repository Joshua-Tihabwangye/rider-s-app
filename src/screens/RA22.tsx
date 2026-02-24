import React, { useState, useEffect } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import TwoWheelerRoundedIcon from "@mui/icons-material/TwoWheelerRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import MobileShell from "../components/MobileShell";

// Simulated nearby drivers/riders database
const NEARBY_DRIVERS = [
  {
    id: "driver_001",
    name: "Tim Smith",
    vehicle: "Tesla Model X",
    vehicleType: "car",
    licensePlate: "UPL 630",
    rating: 4.6,
    totalRatings: 157,
    rides: "200+",
    experience: "4+ years",
    photo: "TS",
    phone: "+256 700 123 456",
    distanceAway: "0.8 km",
    etaMinutes: 3
  },
  {
    id: "driver_002",
    name: "Sarah Nakato",
    vehicle: "Nissan Leaf",
    vehicleType: "car",
    licensePlate: "UAX 482",
    rating: 4.8,
    totalRatings: 312,
    rides: "450+",
    experience: "6+ years",
    photo: "SN",
    phone: "+256 770 456 789",
    distanceAway: "1.2 km",
    etaMinutes: 5
  },
  {
    id: "rider_001",
    name: "James Okello",
    vehicle: "EV Scooter Pro",
    vehicleType: "motorbike",
    licensePlate: "UMC 219",
    rating: 4.5,
    totalRatings: 89,
    rides: "120+",
    experience: "2+ years",
    photo: "JO",
    phone: "+256 780 789 012",
    distanceAway: "0.5 km",
    etaMinutes: 2
  },
  {
    id: "rider_002",
    name: "Grace Apio",
    vehicle: "EV Bike Swift",
    vehicleType: "motorbike",
    licensePlate: "UMC 335",
    rating: 4.7,
    totalRatings: 201,
    rides: "280+",
    experience: "3+ years",
    photo: "GA",
    phone: "+256 750 321 654",
    distanceAway: "0.9 km",
    etaMinutes: 4
  }
];

function SearchingForDriverScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [dots, setDots] = useState("....");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const [driverFound, setDriverFound] = useState(false);
  const [foundDriver, setFoundDriver] = useState<typeof NEARBY_DRIVERS[0] | null>(null);

  // Get trip data from navigation state
  const tripData = location.state || {};
  const vehicleType = tripData.vehicleType || "car";
  const isMotorbike = vehicleType === "motorbike";
  const searchLabel = isMotorbike ? "rider" : "driver";

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 4) return ".";
        return prev + ".";
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Simulate API polling for driver/rider assignment
  useEffect(() => {
    const searchInterval = setInterval(() => {
      setSearchTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(searchInterval);
  }, []);

  // Find a matching driver after 4 seconds
  useEffect(() => {
    if (searchTime >= 4 && !driverFound) {
      // Find nearest matching driver/rider by vehicle type
      const matchingDrivers = NEARBY_DRIVERS.filter(d => d.vehicleType === vehicleType);
      // Pick the nearest one (lowest ETA)
      const nearest = matchingDrivers.sort((a, b) => a.etaMinutes - b.etaMinutes)[0];

      if (nearest) {
        setDriverFound(true);
        setFoundDriver(nearest);

        // Navigate to ride details after brief delay to show "found" state
        setTimeout(() => {
          navigate("/rides/details/confirm", {
            state: {
              ...tripData,
              driver: {
                id: nearest.id,
                name: nearest.name,
                vehicle: nearest.vehicle,
                vehicleType: nearest.vehicleType,
                licensePlate: nearest.licensePlate,
                rating: nearest.rating,
                totalRatings: nearest.totalRatings,
                rides: nearest.rides,
                experience: nearest.experience,
                photo: nearest.photo,
                phone: nearest.phone,
                distanceAway: nearest.distanceAway,
                etaMinutes: nearest.etaMinutes
              }
            }
          });
        }, 1500);
      }
    }
  }, [searchTime, driverFound, vehicleType, navigate, tripData]);

  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const handleCancelConfirm = () => {
    setShowCancelDialog(false);
    navigate("/rides/options", { state: tripData });
  };

  const handleCancelClose = () => {
    setShowCancelDialog(false);
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (theme) => theme.palette.background.default }}>
      {/* Map Section - Full width at top */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "40vh",
          background: (theme) =>
            theme.palette.mode === "light"
              ? "linear-gradient(135deg, #E0F2FE 0%, rgba(3,205,140,0.15) 50%, #93C5FD 100%)"
              : "linear-gradient(135deg, rgba(15,118,205,0.3), #020617 60%, #020617 100%)",
          overflow: "hidden"
        }}
      >
        {/* Grid overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.3) 1px, transparent 1px)",
            backgroundSize: "30px 30px"
          }}
        />

        {/* Route line */}
        <Box
          sx={{
            position: "absolute",
            top: "55%",
            left: "15%",
            width: "70%",
            height: 3,
            bgcolor: "#424242",
            borderRadius: 2,
            transform: "rotate(-20deg)",
            transformOrigin: "left center",
            zIndex: 1
          }}
        />

        {/* Origin label */}
        {tripData.pickup && (
          <Typography
            sx={{
              position: "absolute",
              top: "8%",
              left: "10%",
              fontSize: 11,
              fontWeight: 500,
              color: "#03CD8C"
            }}
          >
            {tripData.pickup}
          </Typography>
        )}

        {/* Destination label */}
        {tripData.destination && (
          <Typography
            sx={{
              position: "absolute",
              top: "12%",
              right: "8%",
              fontSize: 10,
              fontWeight: 500,
              color: "#03CD8C",
              maxWidth: "30%",
              textAlign: "right"
            }}
          >
            {tripData.destination}
          </Typography>
        )}

        {/* Back button on map */}
        <IconButton
          size="small"
          aria-label="Back"
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            bgcolor: "#03CD8C",
            color: "#FFFFFF",
            width: 40,
            height: 40,
            "&:hover": {
              bgcolor: "#22C55E"
            }
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>

        {/* Bus stop icon */}
        <Box
          sx={{
            position: "absolute",
            left: "25%",
            bottom: "35%",
            width: 36,
            height: 36,
            borderRadius: "50%",
            bgcolor: "#03CD8C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
          }}
        >
          <DirectionsBusRoundedIcon sx={{ fontSize: 20, color: "#FFFFFF" }} />
        </Box>

        {/* Hotel icon */}
        <Box
          sx={{
            position: "absolute",
            right: "20%",
            top: "25%",
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: "#EC4899",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
          }}
        >
          <HotelRoundedIcon sx={{ fontSize: 22, color: "#FFFFFF" }} />
        </Box>

        {/* Pickup location marker */}
        <Box
          sx={{
            position: "absolute",
            left: "20%",
            bottom: "20%",
            width: 16,
            height: 16,
            borderRadius: "50%",
            bgcolor: "#22c55e",
            border: "3px solid white",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
          }}
        />

        {/* Destination marker */}
        <Box
          sx={{
            position: "absolute",
            right: "15%",
            top: "35%",
            width: 16,
            height: 16,
            borderRadius: "50%",
            bgcolor: "#FF9800",
            border: "3px solid white",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
          }}
        />

        {/* Nearby driver/rider pulse animation markers */}
        {!driverFound && (
          <>
            <Box
              sx={{
                position: "absolute",
                left: "35%",
                top: "45%",
                width: 24,
                height: 24,
                borderRadius: "50%",
                bgcolor: "rgba(3,205,140,0.3)",
                animation: "pulse 2s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%": { transform: "scale(1)", opacity: 0.5 },
                  "50%": { transform: "scale(1.5)", opacity: 0.2 },
                  "100%": { transform: "scale(1)", opacity: 0.5 }
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {isMotorbike ? (
                <TwoWheelerRoundedIcon sx={{ fontSize: 14, color: "#03CD8C" }} />
              ) : (
                <DirectionsCarRoundedIcon sx={{ fontSize: 14, color: "#03CD8C" }} />
              )}
            </Box>
            <Box
              sx={{
                position: "absolute",
                left: "55%",
                top: "60%",
                width: 24,
                height: 24,
                borderRadius: "50%",
                bgcolor: "rgba(3,205,140,0.3)",
                animation: "pulse 2s ease-in-out infinite 0.5s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {isMotorbike ? (
                <TwoWheelerRoundedIcon sx={{ fontSize: 14, color: "#03CD8C" }} />
              ) : (
                <DirectionsCarRoundedIcon sx={{ fontSize: 14, color: "#03CD8C" }} />
              )}
            </Box>
          </>
        )}
      </Box>

      {/* Content below map */}
      <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>
        {/* Driver/Rider result or skeleton */}
        {driverFound && foundDriver ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
            <Avatar
              sx={{
                width: 70,
                height: 70,
                bgcolor: "#03CD8C",
                fontSize: 24,
                fontWeight: 600,
                color: "#FFFFFF"
              }}
            >
              {foundDriver.photo}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.3 }}>
                {foundDriver.name}
              </Typography>
              <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary, display: "block" }}>
                {foundDriver.vehicle} • {foundDriver.licensePlate}
              </Typography>
              <Typography variant="caption" sx={{ color: "#03CD8C", fontWeight: 600 }}>
                {foundDriver.distanceAway} away • {foundDriver.etaMinutes} min
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
            <Avatar
              sx={{
                width: 70,
                height: 70,
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#E5E7EB" : "rgba(51,65,85,0.5)"
              }}
            >
              <PersonRoundedIcon sx={{ fontSize: 36, color: (theme) => theme.palette.text.secondary }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  height: 18,
                  width: "70%",
                  borderRadius: 1,
                  bgcolor: (theme) =>
                    theme.palette.mode === "light" ? "#E5E7EB" : "rgba(51,65,85,0.5)",
                  mb: 1.2
                }}
              />
              <Box
                sx={{
                  height: 14,
                  width: "50%",
                  borderRadius: 1,
                  bgcolor: (theme) =>
                    theme.palette.mode === "light" ? "#E5E7EB" : "rgba(51,65,85,0.5)"
                }}
              />
            </Box>
          </Box>
        )}

        {/* Search status card */}
        <Card
          elevation={0}
          sx={{
            mb: 2.5,
            borderRadius: 2,
            bgcolor: driverFound ? "#03CD8C" : "#1E3A5F",
            overflow: "hidden",
            transition: "bgcolor 0.3s ease"
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {/* Trip route summary */}
            <Box
              sx={{
                display: "flex",
                borderBottom: "1px solid rgba(255,255,255,0.2)",
                px: 2,
                py: 1.5
              }}
            >
              <Box sx={{ flex: 1, pr: 1 }}>
                <Typography variant="caption" sx={{ fontSize: 10, color: "rgba(255,255,255,0.6)", display: "block" }}>From</Typography>
                <Typography variant="caption" sx={{ fontSize: 12, color: "#FFFFFF", fontWeight: 500, display: "block" }}>
                  {tripData.pickup || "Current location"}
                </Typography>
              </Box>
              <Box sx={{ width: 1, bgcolor: "rgba(255,255,255,0.3)", mx: 1 }} />
              <Box sx={{ flex: 1, pl: 1 }}>
                <Typography variant="caption" sx={{ fontSize: 10, color: "rgba(255,255,255,0.6)", display: "block" }}>To</Typography>
                <Typography variant="caption" sx={{ fontSize: 12, color: "#FFFFFF", fontWeight: 500, display: "block" }}>
                  {tripData.destination || "Destination"}
                </Typography>
              </Box>
            </Box>

            {/* Searching / Found status */}
            <Box
              sx={{
                px: 2,
                py: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#FFFFFF", fontSize: 13 }}
              >
                {driverFound
                  ? `${isMotorbike ? "Rider" : "Driver"} found! Connecting...`
                  : `Searching for nearest ${searchLabel}${dots}`}
              </Typography>
              {!driverFound && (
                <RefreshRoundedIcon
                  sx={{
                    fontSize: 20,
                    color: "#FFFFFF",
                    animation: "spin 2s linear infinite",
                    "@keyframes spin": {
                      "0%": { transform: "rotate(0deg)" },
                      "100%": { transform: "rotate(360deg)" }
                    }
                  }}
                />
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Trip info card */}
        <Card
          elevation={0}
          sx={{
            mb: 2,
            borderRadius: 2,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
            border: (theme) =>
              theme.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)"
          }}
        >
          <CardContent sx={{ px: 2, py: 2 }}>
            {/* Vehicle type icon */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
              {isMotorbike ? (
                <TwoWheelerRoundedIcon sx={{ fontSize: 28, color: "#03CD8C" }} />
              ) : (
                <DirectionsCarRoundedIcon sx={{ fontSize: 28, color: "#03CD8C" }} />
              )}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {tripData.vehicleName || (isMotorbike ? "EV Scooter" : "EV Car Mini")}
                </Typography>
                <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                  {tripData.rideType === "premium" ? "Premium" : "Standard"} • {tripData.fare || "UGX 28,500"}
                </Typography>
              </Box>
            </Box>

            {/* Distance & Time */}
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}>
                  Distance
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {tripData.distance || "41.5 km"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}>
                  Est. Time
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {tripData.estimatedTime || "1 hr"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}>
                  Passengers
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {tripData.passengers || 1}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Cancel button */}
        {!driverFound && (
          <Button
            fullWidth
            variant="outlined"
            onClick={handleCancelClick}
            sx={{
              borderRadius: 999,
              py: 1.2,
              fontSize: 14,
              fontWeight: 500,
              textTransform: "none",
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
              border: (theme) =>
                theme.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)",
              color: (theme) => theme.palette.text.primary,
              "&:hover": {
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.8)"
              }
            }}
          >
            Cancel
          </Button>
        )}
      </Box>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={showCancelDialog}
        onClose={handleCancelClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
          Cancel ride request?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: (theme) => theme.palette.text.secondary }}>
            Are you sure you want to cancel this ride request? You can request a new ride at any time.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button
            onClick={handleCancelClose}
            sx={{
              textTransform: "none",
              color: (theme) => theme.palette.text.secondary
            }}
          >
            Keep searching
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
            Cancel request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function RiderScreen22SearchingForDriverCanvas_v2() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (theme) => theme.palette.background.default
      }}
    >
      <DarkModeToggle />
      <MobileShell>
        <SearchingForDriverScreen />
      </MobileShell>
    </Box>
  );
}
