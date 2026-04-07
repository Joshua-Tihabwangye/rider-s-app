import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  Divider
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { uiTokens } from "../design/tokens";

function RideDetailsScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  // Get trip data from navigation state or use defaults
  const tripData = location.state || {};
  
  // Mock data - would come from API
  const rideDetails = {
    dateLabel: tripData.dateLabel || "Today",
    origin: {
      name: tripData.origin?.name || "Mbarara",
      address: tripData.origin?.address || "Former Horizon Bus Terminal, Mbarara, Uganda",
      time: tripData.origin?.time || "03:00 pm"
    },
    destination: {
      name: tripData.destination?.name || "Kampala City",
      address: tripData.destination?.address || "Kafu Bus Terminal, Kampala, Uganda",
      time: tripData.destination?.time || "08:15 pm"
    },
    duration: tripData.duration || "5h 15min",
    passengers: tripData.passengers || 1,
    fare: tripData.fare || "UGX 121,400",
    driver: {
      name: tripData.driver?.name || "Tim Smith",
      vehicle: tripData.driver?.vehicle || "Tesla Model X",
      licensePlate: tripData.driver?.licensePlate || "UPL 630",
      rating: tripData.driver?.rating || 4.6,
      totalRatings: tripData.driver?.totalRatings || 157,
      rides: tripData.driver?.rides || "200+",
      experience: tripData.driver?.experience || "4+ years",
      photo: tripData.driver?.photo || "TS"
    },
    vehicleImage: tripData.vehicleImage || null // Would be a URL in production
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCallDriver = () => {
    // In production: Open phone dialer
    window.location.href = `tel:+256700000000`;
  };

  const handleMessageDriver = () => {
    // In production: Open in-app chat
    navigate("/rides/chat", {
      state: {
        driverId: tripData.driverId || "driver_001",
        driverName: rideDetails.driver.name
      }
    });
  };

  const handleViewDriverProfile = () => {
    // Navigate to driver profile screen (RA28)
    navigate("/rides/trip/driver-profile", {
      state: {
        driver: rideDetails.driver,
        fromRideDetails: true
      }
    });
  };

  const handleBookTrip = () => {
    // Navigate to booking confirmation screen (RA49) first
    navigate("/rides/booking/confirmation", {
      state: {
        ...tripData,
        rideDetails,
        fromRideDetails: true,
        selectedRide: tripData.selectedRide,
        rideType: tripData.rideType,
        fare: rideDetails.fare,
        distance: tripData.distance,
        estimatedTime: tripData.estimatedTime
      }
    });
  };

  const handleNotificationClick = () => {
    // In production: Open notifications
    navigate("/notifications");
  };

  // Calculate star rating display
  const fullStars = Math.floor(rideDetails.driver.rating);
  const hasHalfStar = rideDetails.driver.rating % 1 >= 0.5;

  const contentBg = theme.palette.mode === "light" ? "#FFFFFF" : theme.palette.background.paper;
  const accentGreen = "#03CD8C";

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: theme.palette.background.default }}>
      {/* Header Bar */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          bgcolor: contentBg,
          borderBottom: theme.palette.mode === "light"
            ? "1px solid rgba(0,0,0,0.1)"
            : "1px solid rgba(255,255,255,0.1)",
          px: uiTokens.spacing.xl,
          py: uiTokens.spacing.mdPlus,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.mdPlus }}>
          <IconButton
            size="small"
            onClick={handleBack}
            sx={{
              borderRadius: uiTokens.radius.xl,
              bgcolor: theme.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.9)",
              "&:hover": {
                bgcolor: theme.palette.mode === "light" ? "#E5E7EB" : "rgba(15,23,42,1)"
              }
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
            <Typography
            variant="h6"
        sx={{
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: theme.palette.text.primary
            }}
                >
            Ride Details.
                </Typography>
              </Box>
        <IconButton
              size="small"
          onClick={handleNotificationClick}
              sx={{
                borderRadius: uiTokens.radius.xl,
            bgcolor: theme.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.9)",
            "&:hover": {
              bgcolor: theme.palette.mode === "light" ? "#E5E7EB" : "rgba(15,23,42,1)"
            }
              }}
        >
          <NotificationsRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      <Box sx={{ px: uiTokens.spacing.xl, pt: uiTokens.spacing.lg, pb: uiTokens.spacing.xxl }}>
        {/* Trip Summary Section */}
      <Card
        elevation={0}
        sx={{
            mb: uiTokens.spacing.xl,
          borderRadius: uiTokens.radius.sm,
            bgcolor: contentBg,
            border: theme.palette.mode === "light"
              ? "1px solid rgba(0,0,0,0.1)"
              : "1px solid rgba(255,255,255,0.1)"
        }}
      >
          <CardContent sx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.mdPlus }}>
            {/* Date Label */}
            <Typography
              variant="caption"
              sx={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: theme.palette.text.secondary,
                mb: uiTokens.spacing.lg,
                display: "block"
              }}
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
            <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  mb: 0.5,
                  color: theme.palette.text.primary
                }}
            >
                {rideDetails.origin.name}
            </Typography>
            <Typography
              variant="caption"
                sx={{
                  fontSize: 11,
                  color: theme.palette.text.secondary,
                  display: "block",
                  mb: 0.5
                }}
            >
                {rideDetails.origin.address}
            </Typography>
            <Typography
                variant="caption"
                sx={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: theme.palette.text.secondary
                }}
            >
                {rideDetails.origin.time}
            </Typography>
          </Box>

            {/* Duration Indicator */}
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                mt: -1,
                bgcolor: contentBg,
                px: 1,
                zIndex: 1
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: theme.palette.text.secondary
                }}
              >
                {rideDetails.duration}
              </Typography>
            </Box>

            {/* Visual Route Line (Dotted) */}
            <Box
              sx={{
                position: "absolute",
                left: 5,
                top: 48,
                bottom: 48,
                width: 2,
                borderLeft: `2px dashed ${theme.palette.mode === "light" ? "#D1D5DB" : "#4B5563"}`,
                zIndex: 0
              }}
            />

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
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  mb: 0.5,
                  color: theme.palette.text.primary
                }}
              >
                {rideDetails.destination.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 11,
                  color: theme.palette.text.secondary,
                  display: "block",
                  mb: 0.5
                }}
              >
                {rideDetails.destination.address}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: theme.palette.text.secondary
                }}
              >
                {rideDetails.destination.time}
              </Typography>
            </Box>
        </CardContent>
      </Card>

        {/* Fare & Passenger Info */}
      <Card
        elevation={0}
        sx={{
            mb: uiTokens.spacing.xl,
          borderRadius: uiTokens.radius.sm,
            bgcolor: contentBg,
            border: theme.palette.mode === "light"
              ? "1px solid rgba(0,0,0,0.1)"
              : "1px solid rgba(255,255,255,0.1)"
        }}
      >
          <CardContent sx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.md }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: 13,
                  color: theme.palette.text.secondary
                }}
              >
                Passengers: {rideDetails.passengers} {rideDetails.passengers === 1 ? "Passenger" : "Passengers"}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#22C55E"
                }}
              >
                {rideDetails.fare}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Driver Information Card */}
        <Card
          elevation={0}
          sx={{
            mb: uiTokens.spacing.xl,
            borderRadius: uiTokens.radius.sm,
            bgcolor: contentBg,
            border: theme.palette.mode === "light"
              ? "1px solid rgba(0,0,0,0.1)"
              : "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <CardContent sx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.mdPlus }}>
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
                  sx={{
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    mb: 0.5,
                    color: theme.palette.text.primary
                  }}
                >
                  {rideDetails.driver.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 11,
                    color: theme.palette.text.secondary,
                    display: "block",
                    mb: 0.5
                  }}
                >
                  {rideDetails.driver.vehicle} – {rideDetails.driver.licensePlate}
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
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 11,
                      ml: 0.5,
                      color: theme.palette.text.secondary
                    }}
                  >
                    {rideDetails.driver.rating} ({rideDetails.driver.totalRatings} ratings)
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Driver Stats */}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 11,
                    color: theme.palette.text.secondary,
                    display: "block"
                  }}
                >
                  Rides
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary
                  }}
                >
                  {rideDetails.driver.rides}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="caption"
                  sx={{
                    fontSize: 11,
                    color: theme.palette.text.secondary,
                    display: "block"
                  }}
              >
                  Experience
              </Typography>
              <Typography
                variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary
                  }}
                >
                  {rideDetails.driver.experience}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<PhoneRoundedIcon sx={{ fontSize: 18 }} />}
                onClick={handleCallDriver}
                sx={{
                  flex: 1,
                  borderRadius: uiTokens.radius.xl,
                  textTransform: "none",
                  borderColor: theme.palette.mode === "light"
                    ? "rgba(0,0,0,0.15)"
                    : "rgba(255,255,255,0.2)",
                  color: theme.palette.text.primary,
                  "&:hover": {
                    borderColor: accentGreen,
                    bgcolor: "rgba(3,205,140,0.1)"
                  }
                }}
              >
                Call
              </Button>
              <Button
                variant="outlined"
                startIcon={<MessageRoundedIcon sx={{ fontSize: 18 }} />}
                onClick={handleMessageDriver}
                sx={{
                  flex: 1,
                  borderRadius: uiTokens.radius.xl,
                  textTransform: "none",
                  borderColor: theme.palette.mode === "light"
                    ? "rgba(0,0,0,0.15)"
                    : "rgba(255,255,255,0.2)",
                  color: theme.palette.text.primary,
                  "&:hover": {
                    borderColor: accentGreen,
                    bgcolor: "rgba(3,205,140,0.1)"
                  }
                }}
              >
                Message
              </Button>
              <IconButton
                onClick={handleViewDriverProfile}
                sx={{
                  borderRadius: uiTokens.radius.xl,
                  border: theme.palette.mode === "light"
                    ? "1px solid rgba(0,0,0,0.15)"
                    : "1px solid rgba(255,255,255,0.2)",
                  "&:hover": {
                    bgcolor: theme.palette.mode === "light"
                      ? "rgba(0,0,0,0.05)"
                      : "rgba(255,255,255,0.05)"
                  }
                }}
              >
                <ChevronRightRoundedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
        </CardContent>
      </Card>

        {/* Vehicle Preview Section */}
        <Card
          elevation={0}
          sx={{
            mb: uiTokens.spacing.xl,
            borderRadius: uiTokens.radius.sm,
            bgcolor: contentBg,
            border: theme.palette.mode === "light"
              ? "1px solid rgba(0,0,0,0.1)"
              : "1px solid rgba(255,255,255,0.1)",
            overflow: "hidden"
          }}
        >
          <Box
            sx={{
              height: 180,
              bgcolor: theme.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative"
            }}
          >
            {rideDetails.vehicleImage ? (
              <Box
                component="img"
                src={rideDetails.vehicleImage}
                alt={rideDetails.driver.vehicle}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  color: theme.palette.text.secondary
                }}
              >
                <PlaceRoundedIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                <Typography variant="caption" sx={{ fontSize: 11, display: "block" }}>
                  {rideDetails.driver.vehicle}
                </Typography>
              </Box>
            )}
          </Box>
        </Card>

        {/* Book Trip Button */}
      <Button
        fullWidth
        variant="contained"
          onClick={handleBookTrip}
        sx={{
          borderRadius: uiTokens.radius.xl,
            py: uiTokens.spacing.md,
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
          Book Trip
        </Button>
      </Box>

      {/* Bottom Navigation Bar */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: contentBg,
          borderTop: theme.palette.mode === "light"
            ? "1px solid rgba(0,0,0,0.1)"
            : "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          justifyContent: "space-around",
          py: 1,
          zIndex: 100
        }}
      >
        <IconButton
          onClick={() => navigate("/")}
          sx={{
            color: theme.palette.text.secondary,
            "&:hover": {
              bgcolor: theme.palette.mode === "light"
                ? "rgba(0,0,0,0.05)"
                : "rgba(255,255,255,0.05)"
            }
          }}
        >
          <HomeRoundedIcon sx={{ fontSize: 24 }} />
        </IconButton>
        <IconButton
          onClick={() => navigate("/rides/history")}
          sx={{
            color: accentGreen,
            "&:hover": {
              bgcolor: "rgba(3,205,140,0.1)"
            }
          }}
        >
          <CalendarTodayRoundedIcon sx={{ fontSize: 24 }} />
        </IconButton>
        <IconButton
          onClick={() => navigate("/wallet")}
          sx={{
            color: theme.palette.text.secondary,
            "&:hover": {
              bgcolor: theme.palette.mode === "light"
                ? "rgba(0,0,0,0.05)"
                : "rgba(255,255,255,0.05)"
            }
          }}
        >
          <AccountBalanceWalletRoundedIcon sx={{ fontSize: 24 }} />
        </IconButton>
        <IconButton
          onClick={() => navigate("/settings")}
          sx={{
            color: theme.palette.text.secondary,
            "&:hover": {
              bgcolor: theme.palette.mode === "light"
                ? "rgba(0,0,0,0.05)"
                : "rgba(255,255,255,0.05)"
            }
        }}
      >
          <SettingsRoundedIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </Box>
    </Box>
  );
}

export default function RiderScreen47RideDetailsCanvas_v2() {
      return (
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (theme) => theme.palette.background.default }}>

        <RideDetailsScreen />
        
      </Box>
  );
}
