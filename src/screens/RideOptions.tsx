import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  ToggleButton
} from "@mui/material";

import TwoWheelerRoundedIcon from "@mui/icons-material/TwoWheelerRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import MapShell from "../components/maps/MapShell";
import ScreenScaffold from "../components/ScreenScaffold";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";
import type { RideOption } from "../store/types";

interface RideOptionCardProps {
  option: RideOption;
  selected: string;
  onSelect: (id: string) => void;
}

function getRideOptionIcon(id: string): React.ReactElement {
  if (id === "scooter") {
    return <TwoWheelerRoundedIcon sx={{ fontSize: 28 }} />;
  }
  return <DirectionsCarRoundedIcon sx={{ fontSize: 28 }} />;
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
          {getRideOptionIcon(option.id)}
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
  const { ride, actions } = useAppData();
  const [selectedRide, setSelectedRide] = useState(ride.request.serviceLevel ?? ride.options[0]?.id ?? "");
  const [rideType, setRideType] = useState(ride.request.serviceClass ?? "standard");

  useEffect(() => {
    if (ride.request.serviceLevel && ride.request.serviceLevel !== selectedRide) {
      setSelectedRide(ride.request.serviceLevel);
    }
  }, [ride.request.serviceLevel, selectedRide]);
  
  const handleRideTypeSelect = (newType: string): void => {
    setRideType(newType);
    actions.updateRideRequest({ serviceClass: newType });
  };

  const handleSelectRide = (id: string): void => {
    setSelectedRide(id);
    const selectedOption = ride.options.find((opt) => opt.id === id);
    actions.updateRideRequest({ serviceLevel: id });
    if (selectedOption) {
      const etaMinutes = Number.parseInt(selectedOption.eta.replace(/[^0-9]/g, ""), 10) || 0;
      actions.updateRideTrip({ fareEstimate: selectedOption.fare, etaMinutes });
    }
  };
  
  const handleConfirm = () => {
    // Get trip data from location state
    const tripData = location.state || {};
    const selectedRideOption = ride.options.find((opt) => opt.id === selectedRide);
    const fare = selectedRideOption?.fare || ride.activeTrip?.fareEstimate || "UGX 40,365";
    const estimatedEtaMinutes =
      Number.parseInt(selectedRideOption?.eta.replace(/[^0-9]/g, ""), 10) || ride.activeTrip?.etaMinutes || 0;
    
    actions.updateRideTrip({
      fareEstimate: fare,
      etaMinutes: estimatedEtaMinutes,
      distance: tripData.distance || ride.activeTrip?.distance || "—"
    });
    actions.setRideStatus("searching");
    if (typeof window !== "undefined") {
      window.localStorage.setItem("evz_has_ordered_ride", "true");
    }

    // Directly continue to driver search after ride confirmation
    navigate("/rides/searching", {
      state: {
        ...tripData,
        selectedRide,
        rideType,
        fare,
        distance: tripData.distance || ride.activeTrip?.distance || "—",
        estimatedTime: tripData.estimatedTime || `${ride.activeTrip?.etaMinutes ?? 0} mins`,
        fromRideOptions: true
      }
    });
  };
  
  const contentBg = theme.palette.mode === "light" 
    ? "#FFFFFF" 
    : theme.palette.background.paper || "rgba(15,23,42,0.98)";

  const topMapBleedSx = {
    position: "relative",
    width: {
      xs: "calc(100% + (var(--rider-shell-content-px-xs, 20px) * 2))",
      md: "calc(100% + (var(--rider-shell-content-px-md, 24px) * 2))"
    },
    ml: {
      xs: "calc(var(--rider-shell-content-px-xs, 20px) * -1)",
      md: "calc(var(--rider-shell-content-px-md, 24px) * -1)"
    },
    mr: {
      xs: "calc(var(--rider-shell-content-px-xs, 20px) * -1)",
      md: "calc(var(--rider-shell-content-px-md, 24px) * -1)"
    },
    overflow: "hidden"
  } as const;
  
  return (
    <ScreenScaffold disableTopPadding>
      <Box sx={topMapBleedSx}>
        <MapShell
          showControls={false}
          sx={{ height: { xs: "62dvh", md: "55vh" } }}
          canvasSx={{
            background: theme.palette.mode === "light"
              ? "#F5F5DC"
              : "linear-gradient(135deg, #0f1e2e 0%, #1a2d3e 50%, #0f1e2e 100%)"
          }}
        >
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
        </MapShell>
      </Box>

      <Box sx={{ px: 0.5 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, letterSpacing: "-0.01em", mb: 0.25 }}
        >
          Select your ride
        </Typography>
      </Box>

      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: contentBg,
          border: theme.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 2, py: 1.75 }}>
          <Box>
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
            
            <Box sx={{ display: "flex", gap: 1.25 }}>
              <ToggleButton
                value="standard"
                selected={rideType === "standard"}
                onClick={() => handleRideTypeSelect("standard")}
                aria-label="Standard Ride"
                sx={{
                  flex: 1,
                  py: 1.2,
                  px: 2,
                  border: theme.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  color: rideType === "standard" ? "#FFFFFF" : theme.palette.text.secondary,
                  bgcolor: rideType === "standard"
                    ? "#FFD8A8"
                    : "#DFF7E2",
                  "&:hover": {
                    bgcolor: rideType === "standard"
                      ? "#FFC98F"
                      : "#CDEFD2"
                  }
                }}
              >
                Standard Ride
              </ToggleButton>
              <ToggleButton
                value="premium"
                selected={rideType === "premium"}
                onClick={() => handleRideTypeSelect("premium")}
                aria-label="Premium Ride"
                sx={{
                  flex: 1,
                  py: 1.2,
                  px: 2,
                  border: theme.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  color: rideType === "premium" ? "#FFFFFF" : theme.palette.text.secondary,
                  bgcolor: rideType === "premium"
                    ? "#FFD8A8"
                    : "#DFF7E2",
                  "&:hover": {
                    bgcolor: rideType === "premium"
                      ? "#FFC98F"
                      : "#CDEFD2"
                  }
                }}
              >
                Premium Ride
              </ToggleButton>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box>
        {ride.options.map((option) => (
          <RideOptionCard
            key={option.id}
            option={option}
            selected={selectedRide}
            onSelect={handleSelectRide}
          />
        ))}
      </Box>

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
          bgcolor: "#000000",
          color: "#FFFFFF",
          "&:hover": {
            bgcolor: "#000000"
          },
          "&.Mui-disabled": {
            bgcolor: "#000000",
            color: "#FFFFFF",
            opacity: 1
          }
        }}
      >
        Confirm your Ride
      </Button>
    </ScreenScaffold>
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
