import React, { useState, useEffect } from "react";
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
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import TwoWheelerRoundedIcon from "@mui/icons-material/TwoWheelerRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import StraightenRoundedIcon from "@mui/icons-material/StraightenRounded";
import MobileShell from "../components/MobileShell";

interface MapBackgroundProps {
  onBackClick: () => void;
  pickup?: string;
  destination?: string;
  distance?: string;
  estimatedTime?: string;
}

// Map background component with route visualization
function MapBackground({ onBackClick, pickup, destination, distance, estimatedTime }: MapBackgroundProps): React.JSX.Element {
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
          ? "#F5F5DC"
          : "linear-gradient(135deg, #0f1e2e 0%, #1a2d3e 50%, #0f1e2e 100%)",
        zIndex: 0,
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
      
      {/* Water body on the right */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "5%",
          width: "30%",
          height: "40%",
          bgcolor: "rgba(3,205,140,0.15)",
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
          bgcolor: "#424242",
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

      {/* Destination marker (orange) */}
      <Box
        sx={{
          position: "absolute",
          top: "40%",
          left: "82%",
          width: 18,
          height: 18,
          borderRadius: "50%",
          bgcolor: "#FF9800",
          border: "3px solid #FFFFFF",
          boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
          zIndex: 2,
          transform: "translate(-50%, -50%)"
        }}
      />

      {/* Route info badge */}
      <Box
        sx={{
          position: "absolute",
          top: "48%",
          left: "50%",
          bgcolor: "rgba(0,0,0,0.75)",
          borderRadius: 2,
          px: 1.5,
          py: 0.5,
          zIndex: 3,
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          gap: 1
        }}
      >
        <StraightenRoundedIcon sx={{ fontSize: 14, color: "#FFFFFF" }} />
        <Typography
          variant="caption"
          sx={{ fontSize: 11, fontWeight: 600, color: "#FFFFFF", whiteSpace: "nowrap" }}
        >
          {distance || "41.5 km"}
        </Typography>
        <AccessTimeRoundedIcon sx={{ fontSize: 14, color: "#FFFFFF" }} />
        <Typography
          variant="caption"
          sx={{ fontSize: 11, fontWeight: 600, color: "#FFFFFF", whiteSpace: "nowrap" }}
        >
          {estimatedTime || "1 hr"}
        </Typography>
      </Box>

      {/* Origin label */}
      {pickup && (
        <Box
          sx={{
            position: "absolute",
            top: "68%",
            left: "18%",
            bgcolor: "rgba(0,0,0,0.7)",
            borderRadius: 1,
            px: 1,
            py: 0.3,
            zIndex: 2,
            transform: "translateX(-50%)",
            maxWidth: 120
          }}
        >
          <Typography variant="caption" sx={{ fontSize: 9, color: "#FFFFFF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
            {pickup}
          </Typography>
        </Box>
      )}

      {/* Destination label */}
      {destination && (
        <Box
          sx={{
            position: "absolute",
            top: "28%",
            left: "82%",
            bgcolor: "rgba(0,0,0,0.7)",
            borderRadius: 1,
            px: 1,
            py: 0.3,
            zIndex: 2,
            transform: "translateX(-50%)",
            maxWidth: 120
          }}
        >
          <Typography variant="caption" sx={{ fontSize: 9, color: "#FFFFFF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
            {destination}
          </Typography>
        </Box>
      )}
      
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
  fare: string;
  premiumFare: string;
  icon: React.ReactElement;
  thumbnail?: string | null;
}

// Ride options data - with different prices for standard vs premium
const RIDE_OPTIONS: RideOption[] = [
  {
    id: "scooter",
    name: "EV Scooter",
    description: "Quick & affordable motorbike ride",
    icon: <TwoWheelerRoundedIcon sx={{ fontSize: 28 }} />,
    eta: "4 mins",
    fare: "UGX 15,000",
    premiumFare: "UGX 25,365",
    thumbnail: null
  },
  {
    id: "car-mini",
    name: "EV Car Mini",
    description: "Comfortable sedan for up to 4 passengers",
    icon: <DirectionsCarRoundedIcon sx={{ fontSize: 28 }} />,
    eta: "6 mins",
    fare: "UGX 28,500",
    premiumFare: "UGX 40,365",
    thumbnail: null
  }
];

interface RideOptionCardProps {
  option: RideOption;
  selected: string;
  onSelect: (id: string) => void;
  isPremium: boolean;
}

function RideOptionCard({ option, selected, onSelect, isPremium }: RideOptionCardProps): React.JSX.Element {
  const theme = useTheme();
  const isActive = selected === option.id;
  const displayFare = isPremium ? option.premiumFare : option.fare;
  
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
        {/* Premium badge */}
        {isPremium && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "#F77F00",
              borderRadius: 1,
              px: 1,
              py: 0.3
            }}
          >
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#FFFFFF" }}>PREMIUM</Typography>
          </Box>
        )}
      </Box>
      
      <CardContent sx={{ px: 2, py: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1.5 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em", mb: 0.5, fontSize: 14 }}
            >
              {option.name} • {option.eta} away
            </Typography>
            
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
                {displayFare}
              </Typography>
              {isPremium && (
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: theme.palette.text.secondary, textDecoration: "line-through", ml: 0.5 }}
                >
                  {option.fare}
                </Typography>
              )}
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  bgcolor: "#F77F00",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ml: 0.5
                }}
              >
                <Typography
                  sx={{ fontSize: 10, color: "#FFFFFF", fontWeight: 600, lineHeight: 1 }}
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
  const [selectedRide, setSelectedRide] = useState("car-mini");
  const [rideType, setRideType] = useState("standard");

  // Get trip data from location state
  const tripData = location.state || {};
  const pickup = tripData.pickup || "Current location";
  const destination = tripData.destination || "Kampala City";
  const distance = tripData.distance || "41.5 km";
  const estimatedTime = tripData.estimatedTime || "1 hr";
  const passengers = tripData.passengers || 1;
  
  // Restore selections when returning from RA21
  useEffect(() => {
    if (location.state?.selectedRide) {
      setSelectedRide(location.state.selectedRide);
    }
    if (location.state?.rideType) {
      setRideType(location.state.rideType);
    }
  }, [location.state]);
  
  const handleRideTypeChange = (_event: React.SyntheticEvent, newType: string | null): void => {
    if (newType !== null) {
      setRideType(newType);
    }
  };
  
  const isPremium = rideType === "premium";

  const handleConfirm = () => {
    const selectedRideOption = RIDE_OPTIONS.find(opt => opt.id === selectedRide);
    const fare = isPremium
      ? (selectedRideOption?.premiumFare || "UGX 40,365")
      : (selectedRideOption?.fare || "UGX 28,500");

    // Navigate to searching screen (RA22) to find nearest driver/rider
    navigate("/rides/searching", {
      state: {
        ...tripData,
        selectedRide,
        rideType,
        fare,
        distance,
        estimatedTime,
        pickup,
        destination,
        passengers,
        vehicleType: selectedRide === "scooter" ? "motorbike" : "car",
        vehicleName: selectedRideOption?.name || "EV Car Mini",
        origin: {
          name: pickup,
          address: tripData.pickupAddress || pickup,
          time: tripData.scheduleTime || "Now"
        },
        destinationData: {
          name: destination,
          address: tripData.destinationAddress || destination,
          time: tripData.arrivalTime || null
        },
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
      <MapBackground
        onBackClick={() => navigate(-1)}
        pickup={pickup}
        destination={destination}
        distance={distance}
        estimatedTime={estimatedTime}
      />
      
      {/* Content Panel - slides up from bottom */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: "calc(64px + env(safe-area-inset-bottom))", sm: "64px" },
          left: 0,
          right: 0,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          bgcolor: contentBg,
          maxHeight: { xs: 'calc(100vh - 40vh - 64px - env(safe-area-inset-bottom))', sm: 'calc(100vh - 40vh - 64px)' },
          overflow: "auto",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
          zIndex: 1
        }}
      >
        <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
          {/* Header - Ride Summary with distance & ETA */}
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em", mb: 0.5 }}
            >
              Select your ride
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <StraightenRoundedIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                <Typography variant="body2" sx={{ fontSize: 13, color: theme.palette.text.secondary }}>
                  {distance}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <AccessTimeRoundedIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                <Typography variant="body2" sx={{ fontSize: 13, color: theme.palette.text.secondary }}>
                  Est. {estimatedTime}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontSize: 13, color: theme.palette.text.secondary }}>
                • {passengers} {passengers === 1 ? "passenger" : "passengers"}
              </Typography>
            </Box>
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
                      bgcolor: "#E06F00"
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
                isPremium={isPremium}
              />
            ))}
          </Box>
          
          {/* Confirm Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleConfirm}
            disabled={!selectedRide}
            sx={{
              borderRadius: 999,
              py: 1.4,
              fontSize: 15,
              fontWeight: 600,
              textTransform: "none",
              bgcolor: selectedRide ? "#03CD8C" : "rgba(3,205,140,0.3)",
              color: "#FFFFFF",
              "&:hover": {
                bgcolor: selectedRide ? "#22C55E" : "rgba(3,205,140,0.3)"
              },
              "&.Mui-disabled": {
                bgcolor: "rgba(3,205,140,0.3)",
                color: "rgba(255,255,255,0.5)"
              }
            }}
          >
            Search for {selectedRide === "scooter" ? "Rider" : "Driver"}
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
      <DarkModeToggle />
      <MobileShell>
        <SelectYourRideScreen />
      </MobileShell>
    </Box>
  );
}
