import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import TwoWheelerRoundedIcon from "@mui/icons-material/TwoWheelerRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import StraightenRoundedIcon from "@mui/icons-material/StraightenRounded";
import MobileShell from "../components/MobileShell";

// Mock chat messages
interface ChatMessage {
  id: string;
  sender: "user" | "driver";
  message: string;
  time: string;
}

function RideDetailsScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  // Get trip data from navigation state or use defaults
  const tripData = location.state || {};
  
  // Chat state
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "driver", message: "Hello! I'm on my way to your pickup location.", time: "Now" },
    { id: "2", sender: "user", message: "Great, thank you!", time: "Now" }
  ]);

  // Vehicle type from trip data
  const vehicleType = tripData.vehicleType || (tripData.selectedRide === "scooter" ? "motorbike" : "car");
  const isMotorbike = vehicleType === "motorbike";
  
  // Mock data - driver info from search results (RA22)
  const rideDetails = {
    dateLabel: tripData.dateLabel || "Today",
    origin: {
      name: tripData.origin?.name || tripData.pickup || "Current location",
      address: tripData.origin?.address || tripData.pickup || "Current location, Uganda",
      time: tripData.origin?.time || "Now"
    },
    destination: {
      name: tripData.destinationData?.name || tripData.destination || "Kampala City",
      address: tripData.destinationData?.address || tripData.destination || "Kampala, Uganda",
      time: tripData.destinationData?.time || null
    },
    distance: tripData.distance || "41.5 km",
    estimatedTime: tripData.estimatedTime || "1 hr",
    duration: tripData.duration || tripData.estimatedTime || "1 hr",
    passengers: tripData.passengers || 1,
    fare: tripData.fare || "UGX 28,500",
    rideType: tripData.rideType || "standard",
    driver: {
      id: tripData.driver?.id || "driver_001",
      name: tripData.driver?.name || "Tim Smith",
      vehicle: tripData.driver?.vehicle || (isMotorbike ? "EV Scooter Pro" : "Tesla Model X"),
      vehicleType: tripData.driver?.vehicleType || vehicleType,
      licensePlate: tripData.driver?.licensePlate || (isMotorbike ? "UMC 219" : "UPL 630"),
      rating: tripData.driver?.rating || 4.6,
      totalRatings: tripData.driver?.totalRatings || 157,
      rides: tripData.driver?.rides || "200+",
      experience: tripData.driver?.experience || "4+ years",
      photo: tripData.driver?.photo || "TS",
      phone: tripData.driver?.phone || "+256 700 123 456",
      distanceAway: tripData.driver?.distanceAway || "0.8 km",
      etaMinutes: tripData.driver?.etaMinutes || 3
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCallDriver = () => {
    window.location.href = `tel:${rideDetails.driver.phone}`;
  };

  const handleMessageDriver = () => {
    setShowChatDialog(true);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const newMsg: ChatMessage = {
      id: String(chatMessages.length + 1),
      sender: "user",
      message: chatMessage,
      time: "Now"
    };
    setChatMessages([...chatMessages, newMsg]);
    setChatMessage("");
    
    // Simulate driver reply after 2 seconds
    setTimeout(() => {
      const driverReply: ChatMessage = {
        id: String(chatMessages.length + 2),
        sender: "driver",
        message: "Got it! I'll be there shortly.",
        time: "Now"
      };
      setChatMessages(prev => [...prev, driverReply]);
    }, 2000);
  };

  const handleViewDriverProfile = () => {
    navigate("/rides/trip/driver-profile", {
      state: {
        driver: rideDetails.driver,
        fromRideDetails: true
      }
    });
  };

  const handleProceedToPayment = () => {
    // Navigate to payment method selection (RA21) with all trip + driver data
    navigate("/rides/payment", {
      state: {
        ...tripData,
        fromRideDetails: true,
        rideDetails,
        fare: rideDetails.fare,
        driver: rideDetails.driver
      }
    });
  };

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  // Calculate star rating display
  const fullStars = Math.floor(rideDetails.driver.rating);
  const hasHalfStar = rideDetails.driver.rating % 1 >= 0.5;

  const contentBg = theme.palette.mode === "light" ? "#FFFFFF" : theme.palette.background.paper;
  const accentGreen = "#03CD8C";
  const driverLabel = isMotorbike ? "Rider" : "Driver";

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: theme.palette.background.default }}>
      {/* Header Bar */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          bgcolor: "#03CD8C",
          px: 2,
          pt: 2,
          pb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <IconButton
          size="small"
          onClick={handleBack}
          sx={{
            position: "absolute",
            left: 20,
            borderRadius: 999,
            bgcolor: "rgba(255,255,255,0.2)",
            color: "#FFFFFF",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.3)"
            }
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
        
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "#FFFFFF"
          }}
        >
          Ride Details
        </Typography>

        <IconButton
          size="small"
          onClick={handleNotificationClick}
          sx={{
            position: "absolute",
            right: 20,
            borderRadius: 999,
            bgcolor: "rgba(255,255,255,0.2)",
            color: "#FFFFFF",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.3)"
            }
          }}
        >
          <NotificationsRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      <Box sx={{ px: 2.5, pt: 2, pb: 10 }}>
        {/* Matched Driver/Rider Card - Highlighted */}
        <Card
          elevation={0}
          sx={{
            mb: 2.5,
            borderRadius: 2,
            bgcolor: contentBg,
            border: `2px solid ${accentGreen}`,
            overflow: "hidden"
          }}
        >
          <Box sx={{ bgcolor: accentGreen, px: 2, py: 0.8 }}>
            <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Your {driverLabel} • {rideDetails.driver.distanceAway} away
            </Typography>
          </Box>
          <CardContent sx={{ px: 2, py: 2 }}>
            {/* Profile Section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: accentGreen,
                  fontSize: 24,
                  fontWeight: 600,
                  color: "#FFFFFF"
                }}
              >
                {rideDetails.driver.photo}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, letterSpacing: "-0.01em", mb: 0.5, color: theme.palette.text.primary }}
                >
                  {rideDetails.driver.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                  {isMotorbike ? (
                    <TwoWheelerRoundedIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                  ) : (
                    <DirectionsCarRoundedIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{ fontSize: 12, color: theme.palette.text.secondary }}
                  >
                    {rideDetails.driver.vehicle} – {rideDetails.driver.licensePlate}
                  </Typography>
                </Box>
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
                  <Typography variant="caption" sx={{ fontSize: 11, ml: 0.5, color: theme.palette.text.secondary }}>
                    {rideDetails.driver.rating} ({rideDetails.driver.totalRatings})
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Driver Stats */}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary, display: "block" }}>
                  Rides
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                  {rideDetails.driver.rides}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary, display: "block" }}>
                  Experience
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                  {rideDetails.driver.experience}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary, display: "block" }}>
                  ETA
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: accentGreen }}>
                  {rideDetails.driver.etaMinutes} min
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            {/* Action Buttons - Call & Chat */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<PhoneRoundedIcon sx={{ fontSize: 18 }} />}
                onClick={handleCallDriver}
                sx={{
                  flex: 1,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: accentGreen,
                  color: accentGreen,
                  "&:hover": {
                    borderColor: accentGreen,
                    bgcolor: "rgba(3,205,140,0.1)"
                  }
                }}
              >
                Call {driverLabel}
              </Button>
              <Button
                variant="outlined"
                startIcon={<MessageRoundedIcon sx={{ fontSize: 18 }} />}
                onClick={handleMessageDriver}
                sx={{
                  flex: 1,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: theme.palette.mode === "light" ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.2)",
                  color: theme.palette.text.primary,
                  "&:hover": {
                    borderColor: accentGreen,
                    bgcolor: "rgba(3,205,140,0.1)"
                  }
                }}
              >
                Chat
              </Button>
              <IconButton
                onClick={handleViewDriverProfile}
                sx={{
                  borderRadius: 999,
                  border: theme.palette.mode === "light" ? "1px solid rgba(0,0,0,0.15)" : "1px solid rgba(255,255,255,0.2)",
                  "&:hover": {
                    bgcolor: theme.palette.mode === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"
                  }
                }}
              >
                <ChevronRightRoundedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </CardContent>
        </Card>

        {/* Trip Summary Section */}
        <Card
          elevation={0}
          sx={{
            mb: 2.5,
            borderRadius: 2,
            bgcolor: contentBg,
            border: theme.palette.mode === "light" ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <CardContent sx={{ px: 2, py: 2 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: theme.palette.text.secondary, mb: 2, display: "block" }}
            >
              {rideDetails.dateLabel}
            </Typography>

            {/* Origin */}
            <Box sx={{ mb: 2.5, position: "relative", pl: 3 }}>
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: "#22C55E",
                  border: "2px solid #FFFFFF",
                  boxShadow: "0 2px 8px rgba(34,197,94,0.4)"
                }}
              />
              <Typography variant="body1" sx={{ fontWeight: 600, letterSpacing: "-0.01em", mb: 0.5 }}>
                {rideDetails.origin.name}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary, display: "block", mb: 0.5 }}>
                {rideDetails.origin.address}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 500, color: theme.palette.text.secondary }}>
                {rideDetails.origin.time}
              </Typography>
            </Box>

            {/* Destination */}
            <Box sx={{ position: "relative", pl: 3 }}>
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: "#FF9800",
                  border: "2px solid #FFFFFF",
                  boxShadow: "0 2px 8px rgba(255,152,0,0.4)"
                }}
              />
              <PlaceRoundedIcon
                sx={{
                  position: "absolute",
                  left: -2,
                  top: -2,
                  fontSize: 16,
                  color: "#FF9800"
                }}
              />
              <Typography variant="body1" sx={{ fontWeight: 600, letterSpacing: "-0.01em", mb: 0.5 }}>
                {rideDetails.destination.name}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary, display: "block", mb: 0.5 }}>
                {rideDetails.destination.address}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Fare, Distance & Passenger Info */}
        <Card
          elevation={0}
          sx={{
            mb: 2.5,
            borderRadius: 2,
            bgcolor: contentBg,
            border: theme.palette.mode === "light" ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <CardContent sx={{ px: 2, py: 1.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontSize: 13, color: theme.palette.text.secondary }}>
                {rideDetails.passengers} {rideDetails.passengers === 1 ? "Passenger" : "Passengers"}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.02em", color: "#22C55E" }}>
                {rideDetails.fare}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <StraightenRoundedIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                <Typography variant="caption" sx={{ fontSize: 12, color: theme.palette.text.secondary }}>
                  {rideDetails.distance}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <AccessTimeRoundedIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                <Typography variant="caption" sx={{ fontSize: 12, color: theme.palette.text.secondary }}>
                  Max {rideDetails.estimatedTime}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ fontSize: 12, color: "#F77F00", fontWeight: 600 }}>
                {rideDetails.rideType === "premium" ? "Premium" : "Standard"}
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* Vehicle Preview Section */}
        <Card
          elevation={0}
          sx={{
            mb: 2.5,
            borderRadius: 2,
            bgcolor: contentBg,
            border: theme.palette.mode === "light" ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.1)",
            overflow: "hidden"
          }}
        >
          <Box
            sx={{
              height: 140,
              bgcolor: theme.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative"
            }}
          >
            <Box sx={{ mx: 7, textAlign: "center", color: theme.palette.text.secondary }}>
              {isMotorbike ? (
                <TwoWheelerRoundedIcon sx={{ fontSize: 56, mb: 1, opacity: 0.7, color: accentGreen }} />
              ) : (
                <DirectionsCarRoundedIcon sx={{ fontSize: 56, mb: 1, opacity: 0.7, color: accentGreen }} />
              )}
              <Typography variant="caption" sx={{ fontSize: 12, display: "block", fontWeight: 500 }}>
                {rideDetails.driver.vehicle}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11, display: "block", color: theme.palette.text.secondary }}>
                {rideDetails.driver.licensePlate}
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Proceed to Payment Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleProceedToPayment}
          sx={{
            borderRadius: 999,
            py: 1.5,
            fontSize: 16,
            fontWeight: 600,
            textTransform: "none",
            bgcolor: accentGreen,
            color: "#FFFFFF",
            "&:hover": {
              bgcolor: "#22C55E"
            }
          }}
        >
          Proceed to Payment
        </Button>
      </Box>

      {/* In-App Chat Dialog */}
      <Dialog
        open={showChatDialog}
        onClose={() => setShowChatDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: contentBg,
            maxHeight: "70vh"
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{ width: 36, height: 36, bgcolor: accentGreen, fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}
          >
            {rideDetails.driver.photo}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{rideDetails.driver.name}</Typography>
            <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary }}>
              {driverLabel} • Online
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 2, pb: 1 }}>
          {/* Chat Messages */}
          <Box sx={{ minHeight: 200, maxHeight: 300, overflow: "auto", mb: 1 }}>
            {chatMessages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  mb: 1
                }}
              >
                <Box
                  sx={{
                    maxWidth: "75%",
                    bgcolor: msg.sender === "user"
                      ? accentGreen
                      : theme.palette.mode === "light" ? "#F3F4F6" : "rgba(51,65,85,0.5)",
                    color: msg.sender === "user" ? "#FFFFFF" : theme.palette.text.primary,
                    borderRadius: 2,
                    px: 1.5,
                    py: 1
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: 13 }}>
                    {msg.message}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: 10, opacity: 0.7, display: "block", textAlign: "right", mt: 0.3 }}>
                    {msg.time}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Message Input */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type a message..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 999
                }
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!chatMessage.trim()}
              sx={{
                bgcolor: accentGreen,
                color: "#FFFFFF",
                "&:hover": { bgcolor: "#22C55E" },
                "&.Mui-disabled": { bgcolor: "rgba(3,205,140,0.3)", color: "rgba(255,255,255,0.5)" }
              }}
            >
              <SendRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button
            onClick={handleCallDriver}
            startIcon={<PhoneRoundedIcon />}
            sx={{ textTransform: "none", color: accentGreen }}
          >
            Call instead
          </Button>
          <Button
            onClick={() => setShowChatDialog(false)}
            sx={{ textTransform: "none" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function RiderScreen47RideDetailsCanvas_v2() {
  return (
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (theme) => theme.palette.background.default }}>
      <DarkModeToggle />
      <MobileShell>
        <RideDetailsScreen />
      </MobileShell>
    </Box>
  );
}
