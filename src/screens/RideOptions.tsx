import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import TwoWheelerRoundedIcon from "@mui/icons-material/TwoWheelerRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

interface MapBackgroundProps {
  onBackClick: () => void;
}

// Map background component with route visualization
function MapBackground({ onBackClick }: MapBackgroundProps): React.JSX.Element {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "40vh",
        background: theme.palette.mode === "light"
          ? "#F5F5DC" // Light beige map background
          : "linear-gradient(135deg, #0f1e2e 0%, #1a2d3e 50%, #0f1e2e 100%)",
        zIndex: 0,
        overflow: "hidden"
      }}
    >
      {/* Water body on the right */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "5%",
          width: "30%",
          height: "40%",
          bgcolor: "rgba(3,205,140,0.15)", // Light blue water
          borderRadius: "50%",
          opacity: 0.6
        }}
      />
      
      {/* Route line - diagonal from bottom-left to top-right */}
      <Box
        sx={{
          position: "absolute",
          top: "60%",
          left: "15%",
          width: "70%",
          height: 3,
          bgcolor: "#424242", // Dark grey route line
          borderRadius: 2,
          transform: "rotate(-25deg)",
          transformOrigin: "left center",
          zIndex: 1
        }}
      />
      
      {/* Start marker (green) - positioned at start of route */}
      <Box
        sx={{
          position: "absolute",
          top: "58%",
          left: "18%",
          width: 18,
          height: 18,
          borderRadius: "50%",
          bgcolor: "#4CAF50",
          border: "3px solid #FFFFFF",
          boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
          zIndex: 2,
          transform: "translate(-50%, -50%)"
        }}
      />
      
      {/* Back arrow button */}
      <IconButton
        size="small"
        aria-label="Back"
        onClick={onBackClick}
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          bgcolor: theme.palette.mode === "light" 
            ? "rgba(255,255,255,0.9)" 
            : "rgba(255,255,255,0.25)",
          color: theme.palette.mode === "light" ? "#000000" : "#FFFFFF",
          zIndex: 10,
          width: 40,
          height: 40,
          "&:hover": {
            bgcolor: theme.palette.mode === "light" 
              ? "#FFFFFF" 
              : "rgba(255,255,255,0.35)"
          }
        }}
      >
        <ArrowBackIosNewRoundedIcon sx={{ fontSize: 20 }} />
      </IconButton>
    </Box>
  );
}

interface RideOption {
  id: string;
  name: string;
  description: string;
  price?: string;
  eta?: string;
  fare?: string;
  icon: React.ReactElement;
  thumbnail?: string | null;
}

// Ride options data
const RIDE_OPTIONS: RideOption[] = [
  {
    id: "scooter",
    name: "EV Scooter",
    description: "Inter-City Travel",
    icon: <TwoWheelerRoundedIcon sx={{ fontSize: 28 }} />,
    eta: "4 mins",
    fare: "UGX 25,365",
    thumbnail: null // Would be an image in production
  },
  {
    id: "car-mini",
    name: "EV Car Mini",
    description: "Senior Citizen Assistance",
    icon: <DirectionsCarRoundedIcon sx={{ fontSize: 28 }} />,
    eta: "4 mins",
    fare: "UGX 40,365",
    thumbnail: null // Would be an image in production
  }
];

interface RideOptionCardProps {
  option: RideOption;
  selected: string;
  onSelect: (id: string) => void;
}

function RideOptionCard({ option, selected, onSelect }: RideOptionCardProps): React.JSX.Element {
  const theme = useTheme();
  const isActive = selected === option.id;
  
  return (
    <Card
      elevation={0}
      onClick={() => onSelect(option.id)}
      sx={{
        mb: 1.5,
        borderRadius: 2,
        cursor: "pointer",
        transition: "all 0.15s ease",
        bgcolor: theme.palette.mode === "light"
          ? "#FFFFFF"
          : "rgba(15,23,42,0.98)",
        border: isActive
          ? "2px solid #03CD8C"
          : theme.palette.mode === "light"
          ? "1px solid rgba(209,213,219,0.9)"
          : "1px solid rgba(51,65,85,0.9)",
        boxShadow: isActive
          ? "0 2px 8px rgba(33,150,243,0.2)"
          : "none",
        overflow: "hidden"
      }}
    >
      {/* Thumbnail image area */}
      <Box
        sx={{
          width: "100%",
          height: 120,
          bgcolor: theme.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Placeholder for vehicle image - in production this would be an actual image */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: theme.palette.mode === "light" ? "#E5E5E5" : "rgba(30,30,30,1)"
          }}
        >
          {option.icon}
        </Box>
      </Box>
      
      <CardContent sx={{ px: 2, py: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1.5 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Vehicle name and ETA on same line */}
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em", mb: 0.5, fontSize: 14 }}
            >
              {option.name} • {option.eta}
            </Typography>
            
            {/* Description */}
            <Typography
              variant="caption"
              sx={{ fontSize: 12, color: theme.palette.text.secondary, display: "block", mb: 0.5 }}
            >
              {option.description}
            </Typography>
            
            {/* Fare with info icon */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: 14 }}
              >
                {option.fare}
              </Typography>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  bgcolor: "#F77F00",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Typography
                  sx={{
                    fontSize: 10,
                    color: "#FFFFFF",
                    fontWeight: 600,
                    lineHeight: 1
                  }}
                >
                  i
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function SelectYourRideScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [selectedRide, setSelectedRide] = useState("car-mini"); // Default to EV Car Mini as per spec
  const [rideType, setRideType] = useState("premium"); // Default to Premium as per spec
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentMethodName, setPaymentMethodName] = useState("Cash payment");
  
  // Get payment method from location state (when returning from RA21)
  useEffect(() => {
    if (location.state?.paymentMethod) {
      setPaymentMethod(location.state.paymentMethod);
      setPaymentMethodName(location.state.paymentMethodName || "Cash payment");
    }
  }, [location.state]);
  
  const handleRideTypeChange = (_event: React.SyntheticEvent, newType: string | null): void => {
    if (newType !== null) {
      setRideType(newType);
    }
  };
  
  const handleConfirm = () => {
    // Get trip data from location state
    const tripData = location.state || {};
    const selectedRideOption = RIDE_OPTIONS.find(opt => opt.id === selectedRide);
    const fare = selectedRideOption?.fare || "UGX 40,365";
    
    // Navigate to Ride Details screen (RA47) before booking
    navigate("/rides/details/confirm", {
      state: {
        ...tripData,
        selectedRide,
        rideType,
        fare,
        distance: tripData.distance || "41.5 km",
        estimatedTime: tripData.estimatedTime || "1 hr",
        origin: tripData.pickup ? {
          name: tripData.pickup,
          address: tripData.pickupAddress || tripData.pickup,
          time: tripData.scheduleTime || "Now"
        } : null,
        destination: tripData.destination ? {
          name: tripData.destination,
          address: tripData.destinationAddress || tripData.destination,
          time: tripData.arrivalTime || null
        } : null,
        passengers: tripData.passengers || 1,
        dateLabel: tripData.isScheduled ? tripData.schedule : "Today"
      }
    });
  };
  
  const contentBg = theme.palette.mode === "light" 
    ? "#FFFFFF" 
    : theme.palette.background.paper || "rgba(15,23,42,0.98)";
  
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        overflow: "hidden"
      }}
    >
      {/* Map Background */}
      <MapBackground onBackClick={() => navigate(-1)} />
      
      {/* Content Panel - slides up from bottom */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: "calc(64px + env(safe-area-inset-bottom))", sm: "64px" },
          left: 0,
          right: 0,
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          bgcolor: contentBg,
          maxHeight: { xs: 'calc(100vh - 40vh - 64px - env(safe-area-inset-bottom))', sm: 'calc(100vh - 40vh - 64px)' },
          overflow: "auto",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
          zIndex: 1
        }}
      >
        <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
          {/* Header - Ride Summary */}
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em", mb: 0.5 }}
            >
              Select your ride
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: 13, color: theme.palette.text.secondary }}
            >
              41.5 km • 1 hr
            </Typography>
          </Box>
          
          {/* Ride Type Section */}
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 0.5, fontSize: 15, color: "#03CD8C" }}
            >
              Ride type
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 12, color: theme.palette.text.secondary, mb: 1.5, display: "block" }}
            >
              Choose the type of ride service that fits your needs:
            </Typography>
            
            <ToggleButtonGroup
              value={rideType}
              exclusive
              onChange={handleRideTypeChange}
              fullWidth
              sx={{
                "& .MuiToggleButton-root": {
                  py: 1.2,
                  px: 2,
                  border: theme.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  "&.Mui-selected": {
                    bgcolor: "#F77F00",
                    color: "#FFFFFF",
                    "&:hover": {
                      bgcolor: "#1976D2"
                    }
                  },
                  "&:not(.Mui-selected)": {
                    bgcolor: theme.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.5)",
                    "&:hover": {
                      bgcolor: theme.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.7)"
                    }
                  }
                }
              }}
            >
              <ToggleButton value="standard" aria-label="Standard Ride">
                Standard Ride
              </ToggleButton>
              <ToggleButton value="premium" aria-label="Premium Ride">
                Premium Ride
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          
          {/* Ride Options Cards */}
          <Box sx={{ mb: 2.5 }}>
            {RIDE_OPTIONS.map((option) => (
              <RideOptionCard
                key={option.id}
                option={option}
                selected={selectedRide}
                onSelect={setSelectedRide}
              />
            ))}
          </Box>
          
          {/* Payment Method Section */}
          <Card
            elevation={0}
            onClick={() => {
              // Get fare from selected ride
              const selectedRideOption = RIDE_OPTIONS.find(opt => opt.id === selectedRide);
              const fare = selectedRideOption?.fare || "UGX 40,365";
              
              // Navigate to payment method selection
              navigate("/rides/payment", {
                state: { 
                  fromSelectRide: true,
                  selectedRide,
                  rideType,
                  distance: "41.5 km",
                  estimatedTime: "1 hr",
                  fare: fare
                }
              });
            }}
            sx={{
              mb: 2.5,
              borderRadius: 2,
              cursor: "pointer",
              bgcolor: theme.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.5)",
              border: theme.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
              transition: "all 0.15s ease",
              "&:hover": {
                bgcolor: theme.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.7)"
              }
            }}
          >
            <CardContent sx={{ px: 2, py: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  {paymentMethod === "cash" && (
                    <PaymentsRoundedIcon 
                      sx={{ 
                        fontSize: 24, 
                        color: "#4CAF50" 
                      }} 
                    />
                  )}
                  {paymentMethod === "wallet" && (
                    <AccountBalanceWalletRoundedIcon 
                      sx={{ 
                        fontSize: 24, 
                        color: "#4CAF50" 
                      }} 
                    />
                  )}
                  {paymentMethod === "card" && (
                    <CreditCardRoundedIcon 
                      sx={{ 
                        fontSize: 24, 
                        color: "#4CAF50" 
                      }} 
                    />
                  )}
                  {paymentMethod === "mobile" && (
                    <SmartphoneRoundedIcon 
                      sx={{ 
                        fontSize: 24, 
                        color: "#4CAF50" 
                      }} 
                    />
                  )}
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, fontSize: 14, textTransform: paymentMethod === "cash" ? "lowercase" : "none" }}
                  >
                    {paymentMethodName}
                  </Typography>
                </Box>
                <ChevronRightRoundedIcon 
                  sx={{ 
                    fontSize: 20, 
                    color: theme.palette.text.secondary 
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
          
          {/* Confirm Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleConfirm}
            disabled={!selectedRide}
            sx={{
              borderRadius: 5,
              py: 1.4,
              fontSize: 15,
              fontWeight: 600,
              textTransform: "none",
              bgcolor: selectedRide ? "#424242" : "rgba(66,66,66,0.3)", // Dark grey instead of black
              color: "#FFFFFF",
              "&:hover": {
                bgcolor: selectedRide ? "#525252" : "rgba(66,66,66,0.3)"
              },
              "&.Mui-disabled": {
                bgcolor: "rgba(66,66,66,0.3)",
                color: "rgba(255,255,255,0.5)"
              }
            }}
          >
            Confirm your Ride
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default function RiderScreen20SelectYourRideCanvas_v2() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (theme) => theme.palette.background.default
      }}
    >

        <SelectYourRideScreen />
      
    </Box>
  );
}
