import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  IconButton,
  Typography,
  Button,
  Stack,
  Avatar
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutline";
import MobileShell from "../components/MobileShell";

function RideBookingConfirmationScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  // Get trip data from navigation state
  const tripData = location.state || {};
  
  // Check if this was a cash payment
  const isCashPayment = tripData.cashPayment === true || tripData.paymentMethod === "cash";
  
  // Mock driver data - would come from API
  const driverData = {
    name: tripData.driver?.name || "Tim Smith",
    phone: tripData.driver?.phone || "+256700000000",
    photo: tripData.driver?.photo || "TS",
    driverId: tripData.driverId || "driver_001"
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleNotifications = () => {
    // Navigate to notifications screen
    navigate("/notifications");
  };

  const handleCallDriver = () => {
    // In production: Open phone dialer
    window.location.href = `tel:${driverData.phone}`;
  };

  const handleMessageDriver = () => {
    // Navigate to chat with driver
    navigate("/rides/chat", {
      state: {
        driverId: driverData.driverId,
        driverName: driverData.name
      }
    });
  };

  const handlePayNow = () => {
    // Navigate to payment simulation gateway
    navigate("/payment/process", {
      state: {
        paymentMethod: "wallet",
        amount: tripData.fare || tripData.rideDetails?.fare || "UGX 121,400",
        description: `EV Ride – ${tripData.rideDetails?.origin?.name || "Pickup"} → ${tripData.rideDetails?.destination?.name || "Destination"}`,
        returnPath: "/rides/booking/thank-you",
        cancelPath: "/rides/booking/confirmation",
        serviceName: "Ride",
        extraData: { ...tripData }
      }
    });
  };

  const handleDone = () => {
    // Navigate to home screen
    navigate("/home");
  };

  const headerBg = "#22C55E"; // Green header
  const headerText = "#FFFFFF";
  const contentBg = theme.palette.mode === "light" ? "#FFFFFF" : theme.palette.background.paper;
  const greenAccent = "#03CD8C";

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: theme.palette.background.default }}>
      <DarkModeToggle />
      
      {/* Header Bar */}
      <Box
        sx={{
          bgcolor: "#03CD8C",
          px: 7,
          pt: 2,
          pb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative"
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

        <Box sx={{ position: "absolute", right: 20 }}>
          <IconButton
            size="small"
            onClick={handleNotifications}
            sx={{
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
          {/* Notification dot */}
          <Box
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "#EF4444",
              border: "1.5px solid #FFFFFF"
            }}
          />
        </Box>
      </Box>

      <MobileShell>
        <Box sx={{ px: 2.5, pt: 3, pb: 3 }}>
          {/* Confirmation Illustration */}
          <Box 
            sx={{ 
              textAlign: "center", 
              mb: 4,
              "@keyframes fadeIn": {
                from: {
                  opacity: 0,
                  transform: "translateY(10px)"
                },
                to: {
                  opacity: 1,
                  transform: "translateY(0)"
                }
              },
              animation: "fadeIn 0.6s ease-in"
            }}
          >
            <Box
              sx={{
                position: "relative",
                display: "inline-block",
                mb: 2
              }}
            >
              {/* Illustration Container */}
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 320,
                  height: 200,
                  position: "relative",
                  mx: "auto",
                  mb: 2
                }}
              >
                {/* Background buildings (subtle) */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 20,
                    left: 0,
                    right: 0,
                    height: 40,
                    opacity: 0.1,
                    background: "linear-gradient(to right, transparent, rgba(0,0,0,0.1) 20%, rgba(0,0,0,0.1) 80%, transparent)",
                    borderRadius: 1
                  }}
                />

                {/* Green Car (SUV) - Center */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 30,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 140,
                    height: 90,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: greenAccent,
                    borderRadius: 3,
                    boxShadow: "0 4px 12px rgba(34,197,94,0.3)"
                  }}
                >
                  <DirectionsCarFilledRoundedIcon
                    sx={{
                      fontSize: 70,
                      color: "#FFFFFF"
                    }}
                  />
                </Box>
                
                {/* Person on Left (Woman in green jacket) */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 50,
                    left: "15%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: greenAccent,
                      fontSize: 16,
                      border: "2px solid #FFFFFF",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                    }}
                  >
                    <PersonRoundedIcon sx={{ fontSize: 24 }} />
                  </Avatar>
                  {/* Waving hand indication */}
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      bgcolor: greenAccent,
                      opacity: 0.3
                    }}
                  />
                </Box>

                {/* Person on Right (Man in dark shirt) */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 50,
                    right: "15%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "#1F2937",
                      fontSize: 16,
                      border: "2px solid #FFFFFF",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                    }}
                  >
                    <PersonRoundedIcon sx={{ fontSize: 24, color: "#FFFFFF" }} />
                  </Avatar>
        </Box>

                {/* Large Green Checkmark - Above car */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    bgcolor: greenAccent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(34,197,94,0.5)",
                    zIndex: 10
                  }}
                >
                  <CheckCircleRoundedIcon
                    sx={{
                      fontSize: 36,
                      color: "#FFFFFF"
                    }}
                  />
                </Box>

                {/* Dotted lines from checkmark to location pins */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 42,
                    left: "20%",
                    width: "60%",
                    height: 2,
                    borderTop: "2px dashed rgba(34,197,94,0.4)",
                    zIndex: 1
                  }}
                />

                {/* Location Pin - Left */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 35,
                    left: "10%",
                    zIndex: 5
                  }}
                >
                  <PlaceRoundedIcon
                    sx={{
                      fontSize: 28,
                      color: "#6B7280"
                    }}
                  />
                  {/* Speech bubble */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -8,
                      left: 20,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: "rgba(107,114,128,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 14, color: "#6B7280" }} />
                  </Box>
                </Box>

                {/* Location Pin - Right */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 35,
                    right: "10%",
                    zIndex: 5
                  }}
                >
                  <PlaceRoundedIcon
                    sx={{
                      fontSize: 28,
                      color: "#6B7280"
                    }}
                  />
                  {/* Speech bubble */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: 20,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: "rgba(107,114,128,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 14, color: "#6B7280" }} />
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Confirmation Message */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: theme.palette.text.primary,
                fontSize: { xs: 22, sm: 24 }
              }}
            >
              Thank You
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                fontSize: 15,
                color: theme.palette.text.secondary,
                lineHeight: 1.6,
                maxWidth: 320,
                mx: "auto"
              }}
            >
              Your booking has been successfully placed and sent to{" "}
              <Typography
                component="span"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary
                }}
            >
                {driverData.name}
              </Typography>
              .
            </Typography>
        </Box>

          {/* Communication Buttons */}
          <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PhoneRoundedIcon sx={{ color: greenAccent }} />}
              onClick={handleCallDriver}
              sx={{
                borderRadius: 2,
                py: 1.25,
                fontSize: 14,
                fontWeight: 600,
                textTransform: "none",
                borderColor: "rgba(3,205,140,0.3)",
                color: greenAccent,
                "&:hover": {
                  borderColor: greenAccent,
                  bgcolor: "rgba(3,205,140,0.1)"
                }
              }}
            >
              Call
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              startIcon={<MessageRoundedIcon sx={{ color: greenAccent }} />}
              onClick={handleMessageDriver}
              sx={{
                borderRadius: 2,
                py: 1.25,
                fontSize: 14,
                fontWeight: 600,
                textTransform: "none",
                borderColor: "rgba(3,205,140,0.3)",
                color: greenAccent,
                "&:hover": {
                  borderColor: greenAccent,
                  bgcolor: "rgba(3,205,140,0.1)"
                }
              }}
            >
              Message
            </Button>
          </Stack>

          {/* Cash payment notice */}
          {isCashPayment && (
            <Box
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: theme.palette.mode === "light" ? "#FFF3E0" : "rgba(255,152,0,0.1)",
                border: "1px solid rgba(255,152,0,0.3)",
                textAlign: "center"
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#E65100", mb: 0.5 }}>
                Cash Payment
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 12, color: theme.palette.text.secondary }}>
                Please pay <strong>{tripData.fare || tripData.rideDetails?.fare || "the fare"}</strong> in cash to your {tripData.vehicleType === "motorbike" || tripData.selectedRide === "scooter" ? "rider" : "driver"} at the end of the trip.
              </Typography>
            </Box>
          )}

          {/* Payment and Completion Actions */}
          <Stack spacing={1.5}>
            {!isCashPayment && (
            <Button
              fullWidth
              variant="contained"
              onClick={handlePayNow}
              sx={{
                borderRadius: 999,
                py: 1.4,
                fontSize: 15,
                fontWeight: 600,
                textTransform: "none",
                bgcolor: greenAccent,
                color: "#FFFFFF",
                "&:hover": {
                  bgcolor: "#16A34A"
                }
              }}
            >
              Pay Now
            </Button>
            )}
            
            <Button
              fullWidth
              variant="contained"
              onClick={handleDone}
              sx={{
                borderRadius: 999,
                py: 1.4,
                fontSize: 15,
                fontWeight: 600,
                textTransform: "none",
                bgcolor: isCashPayment ? greenAccent : "#1F2937",
                color: "#FFFFFF",
                "&:hover": {
                  bgcolor: isCashPayment ? "#16A34A" : "#111827"
                }
              }}
            >
              Done
            </Button>
          </Stack>
        </Box>
      </MobileShell>
    </Box>
  );
}

export default function RiderScreen49BookingConfirmation(): React.JSX.Element {
  return <RideBookingConfirmationScreen />;
}
