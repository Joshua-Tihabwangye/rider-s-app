import React, { useState, useEffect } from "react";
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

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import StraightenRoundedIcon from "@mui/icons-material/StraightenRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import Button from "@mui/material/Button";
import MobileShell from "../components/MobileShell";
import SharedPassengersModal from "../components/SharedPassengersModal";

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
    distance: "12 km",
    fare: "UGX 20,000",
    origin: "New School, JJ Street, Kampala",
    destination: "New School, JJ Street, Kampala",
    status: "Confirmed"
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
    distance: "15 km",
    fare: "UGX 25,000",
    origin: "Acacia Mall, Kololo",
    destination: "Naalya Estates, Kampala",
    status: "Awaiting driver"
  }
];

function UpcomingRideCard({ ride, onCancel, onChangeDate, onClick }) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  
  const handleCancelClick = (e) => {
    e.stopPropagation(); // Prevent card click
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    setCancelDialogOpen(false);
    if (onCancel) {
      onCancel(ride.id);
    }
  };

  const handleCancelClose = () => {
    setCancelDialogOpen(false);
  };

  const handleChangeDateClick = (e) => {
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
          mb: 2,
          borderRadius: 2,
          cursor: "pointer",
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)"
          }
        }}
      >
        <CardContent sx={{ px: 2, py: 2 }}>
          {/* Driver Info */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: "#2196F3",
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
                  mb: 0.25,
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
                  mb: 0.25
                }}
              >
                {ride.driver.carModel} – {ride.driver.licensePlate}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
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

          {/* Trip Details - Origin and Destination with dotted line */}
          <Box sx={{ mb: 2, position: "relative", pl: 2 }}>
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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

          <Divider sx={{ my: 1.5 }} />

          {/* Ride Summary Row */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
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

          {/* Action Buttons */}
          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              variant="contained"
              size="small"
              onClick={handleChangeDateClick}
              sx={{
                borderRadius: 2,
                fontSize: 13,
                fontWeight: 600,
                textTransform: "none",
                py: 1,
                bgcolor: "#2196F3",
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
                borderRadius: 2,
                fontSize: 13,
                fontWeight: 600,
                textTransform: "none",
                py: 1,
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
            borderRadius: 2,
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
        <DialogActions sx={{ px: 2, pb: 2 }}>
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

function RideHistoryCard({ ride, onClick, onSharedPassengersClick }) {
  // Status tag colors
  const getStatusColor = (status) => {
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
        mb: 2,
        borderRadius: 2,
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
      <CardContent sx={{ px: 2, py: 2 }}>
        {/* Driver Info Row */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: "#2196F3",
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
                  mb: 0.25,
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
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25 }}>
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
              borderRadius: 1
            }}
          />
        </Box>

        {/* Trip Route Details */}
        <Box sx={{ mb: 2, position: "relative", pl: 2 }}>
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
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 1.5 }}>
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
            mb: ride.sharedPassengers && ride.sharedPassengers.length > 0 ? 1.5 : 0
          }}
        >
          Booked {ride.bookedAt}
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
                {ride.sharedPassengers.map((passenger, index) => (
                  <Avatar
                    key={index}
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "#2196F3",
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

function RideHistoryPastTripsScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("upcoming"); // Default to Upcoming tab
  const [pastRides, setPastRides] = useState([]);
  const [upcomingRides, setUpcomingRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sharedPassengersModalOpen, setSharedPassengersModalOpen] = useState(false);
  const [selectedRideForPassengers, setSelectedRideForPassengers] = useState(null);

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
          setPastRides(PAST_RIDES);
        } else if (tab === "upcoming") {
          // API endpoint: GET /user/rides?status=upcoming
          // In production:
          // const response = await fetch('/api/user/rides?status=upcoming');
          // const data = await response.json();
          // setUpcomingRides(data);
          setUpcomingRides(UPCOMING_RIDES);
        }
      } catch (error) {
        console.error("Error fetching rides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [tab]);

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    // No navigation - just switch tabs on the same screen
  };

  const handleRideClick = (rideId) => {
    // Navigate to Ride Details Screen
    navigate(`/rides/history/${rideId}`);
  };

  const handleCancelRide = async (rideId) => {
    try {
      // API endpoint: /ride/cancel/:ride_id
      // In production:
      // await fetch(`/api/ride/cancel/${rideId}`, { method: 'POST' });
      
      console.log("Cancelling ride:", rideId);
      
      // Update list dynamically - remove cancelled ride
      setUpcomingRides(prev => prev.filter(ride => ride.id !== rideId));
      
      // Show success message (optional)
      // You could add a snackbar here
    } catch (error) {
      console.error("Error cancelling ride:", error);
    }
  };

  const handleChangeDate = (ride) => {
    // Navigate to schedule screen to change date/time
    navigate("/rides/schedule", {
      state: {
        rideId: ride.id,
        existingRide: ride
      }
    });
  };

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header Section */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5
        }}
      >
        <IconButton
          size="small"
          aria-label="Back"
          onClick={() => navigate(-1)}
          sx={{
            borderRadius: 999,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
            border: (theme) =>
              theme.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)"
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            letterSpacing: "-0.01em",
            flex: 1,
            textAlign: "center",
            color: (theme) => theme.palette.text.primary
          }}
        >
          Ride History
        </Typography>
        <Box sx={{ width: 40 }} /> {/* Spacer for centering */}
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          minHeight: 40,
          mb: 2.5,
          "& .MuiTab-root": {
            minHeight: 40,
            fontSize: 14,
            fontWeight: 500,
            textTransform: "none",
            color: (theme) =>
              theme.palette.mode === "light" ? "#6B7280" : "#9CA3AF"
          },
          "& .Mui-selected": {
            color: "#2196F3", // Blue for active tab
            fontWeight: 600
          },
          "& .MuiTabs-indicator": {
            height: 3,
            borderRadius: 999,
            bgcolor: "#2196F3" // Blue underline
          }
        }}
      >
        <Tab value="upcoming" label="Upcoming" />
        <Tab value="past" label="Past" />
      </Tabs>

      {/* Ride Cards (Scrollable List) */}
      <Box sx={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
        {loading ? (
          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              color: (theme) => theme.palette.text.secondary,
              py: 4
            }}
          >
            Loading rides...
          </Typography>
        ) : tab === "past" ? (
          pastRides.length === 0 ? (
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: (theme) => theme.palette.text.secondary,
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
                onClick={() => handleRideClick(ride.id)}
                onSharedPassengersClick={(passengerData) => {
                  setSelectedRideForPassengers(passengerData);
                  setSharedPassengersModalOpen(true);
                }}
              />
            ))
          )
        ) : (
          upcomingRides.length === 0 ? (
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: (theme) => theme.palette.text.secondary,
                py: 4
              }}
            >
              No upcoming rides
            </Typography>
          ) : (
            upcomingRides.map((ride) => (
              <UpcomingRideCard
                key={ride.id}
                ride={ride}
                onCancel={handleCancelRide}
                onChangeDate={handleChangeDate}
                onClick={() => handleRideClick(ride.id)}
              />
            ))
          )
        )}
      </Box>

      {/* Shared Passengers Modal */}
      <SharedPassengersModal
        open={sharedPassengersModalOpen}
        onClose={() => {
          setSharedPassengersModalOpen(false);
          setSelectedRideForPassengers(null);
        }}
        rideData={selectedRideForPassengers}
      />
    </Box>
  );
}

export default function RiderScreen33RideHistoryPastTripsCanvas_v2() {
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
        <RideHistoryPastTripsScreen />
      </MobileShell>
    </Box>
  );
}
