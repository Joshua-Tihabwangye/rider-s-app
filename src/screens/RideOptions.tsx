import React, { useEffect, useMemo, useState } from "react";
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
  passengers: number;
  onSelect: (id: string) => void;
}

interface RideOptionPricing {
  id: string;
  fareAmount: number;
  fareLabel: string;
}

function parseUGXAmount(value: string): number {
  const numeric = Number.parseInt(value.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatUGX(amount: number): string {
  return `UGX ${Math.max(0, Math.round(amount)).toLocaleString("en-US")}`;
}

function computePassengerAwareFare(baseFare: number, passengers: number, serviceClass: "standard" | "premium"): number {
  const safePassengers = Math.max(1, Math.floor(passengers));
  const passengerMultiplier = 1 + (safePassengers - 1) * 0.18;
  const serviceMultiplier = serviceClass === "premium" ? 1.2 : 1;
  const computed = baseFare * passengerMultiplier * serviceMultiplier;
  return Math.round(computed / 100) * 100;
}

function getRideOptionIcon(id: string): React.ReactElement {
  if (id === "scooter") {
    return <TwoWheelerRoundedIcon sx={{ fontSize: 28 }} />;
  }
  return <DirectionsCarRoundedIcon sx={{ fontSize: 28 }} />;
}

function RideOptionCard({ option, selected, passengers, onSelect }: RideOptionCardProps): React.JSX.Element {
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
            <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: theme.palette.text.secondary }}>
              for {passengers} {passengers === 1 ? "passenger" : "passengers"}
            </Typography>
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
  const { ride, sharedLocationState, actions } = useAppData();
  const { updateRideRequest, updateRideTrip, setRideStatus } = actions;
  type ServiceClass = "standard" | "premium";
  const tripData = (location.state as Record<string, unknown> | null) ?? {};
  const passengerCount = Math.max(
    1,
    Number.isFinite(Number(tripData.passengers))
      ? Number(tripData.passengers)
      : ride.request.passengers || 1
  );
  const [selectedRide, setSelectedRide] = useState(ride.request.serviceLevel ?? ride.options[0]?.id ?? "");
  const [rideType, setRideType] = useState<ServiceClass>(ride.request.serviceClass ?? "standard");
  const [selectionError, setSelectionError] = useState("");
  const ridePricing = useMemo<Record<string, RideOptionPricing>>(() => {
    return ride.options.reduce<Record<string, RideOptionPricing>>((acc, option) => {
      const baseFareAmount = parseUGXAmount(option.fare);
      const adjustedFareAmount = computePassengerAwareFare(baseFareAmount, passengerCount, rideType);
      acc[option.id] = {
        id: option.id,
        fareAmount: adjustedFareAmount,
        fareLabel: formatUGX(adjustedFareAmount)
      };
      return acc;
    }, {});
  }, [passengerCount, ride.options, rideType]);
  const rideOptionsWithPricing = useMemo<RideOption[]>(
    () =>
      ride.options.map((option) => ({
        ...option,
        fare: ridePricing[option.id]?.fareLabel ?? option.fare
      })),
    [ride.options, ridePricing]
  );

  useEffect(() => {
    if (ride.request.serviceLevel && ride.request.serviceLevel !== selectedRide) {
      setSelectedRide(ride.request.serviceLevel);
    }
  }, [ride.request.serviceLevel, selectedRide]);

  useEffect(() => {
    if (!selectedRide && rideOptionsWithPricing.length > 0) {
      const firstOption = rideOptionsWithPricing[0];
      if (!firstOption) return;
      setSelectedRide(firstOption.id);
      updateRideRequest({ serviceLevel: firstOption.id });
      const etaMinutes = Number.parseInt(firstOption.eta.replace(/[^0-9]/g, ""), 10) || 0;
      updateRideTrip({ fareEstimate: firstOption.fare, etaMinutes });
    }
  }, [rideOptionsWithPricing, selectedRide, updateRideRequest, updateRideTrip]);

  useEffect(() => {
    if (ride.request.passengers === passengerCount) return;
    updateRideRequest({ passengers: passengerCount });
  }, [passengerCount, ride.request.passengers, updateRideRequest]);

  useEffect(() => {
    console.debug("[RideOptions] mounted", location.pathname);
    return () => {
      console.debug("[RideOptions] unmounted", location.pathname);
    };
  }, [location.pathname]);
  
  const handleRideTypeSelect = (newType: ServiceClass): void => {
    setRideType(newType);
    updateRideRequest({ serviceClass: newType });
  };

  const handleSelectRide = (id: string): void => {
    setSelectedRide(id);
    const selectedOption = rideOptionsWithPricing.find((opt) => opt.id === id);
    updateRideRequest({ serviceLevel: id });
    if (selectedOption) {
      const etaMinutes = Number.parseInt(selectedOption.eta.replace(/[^0-9]/g, ""), 10) || 0;
      updateRideTrip({ fareEstimate: selectedOption.fare, etaMinutes });
    }
  };
  
  const handleConfirm = () => {
    if (!sharedLocationState.pickupCoords || !sharedLocationState.destinationCoords) {
      setSelectionError("Select pickup and destination first.");
      return;
    }
    const effectiveSelectedRide = selectedRide || rideOptionsWithPricing[0]?.id || "";
    if (!effectiveSelectedRide) return;
    const selectedRideOption = rideOptionsWithPricing.find((opt) => opt.id === effectiveSelectedRide);
    const fare = selectedRideOption?.fare || ride.activeTrip?.fareEstimate || "UGX 40,365";
    const estimatedEtaMinutes =
      Number.parseInt(selectedRideOption?.eta?.replace(/[^0-9]/g, "") ?? "", 10) || ride.activeTrip?.etaMinutes || 0;
    const distanceLabel =
      typeof tripData.distance === "string" ? tripData.distance : ride.activeTrip?.distance || "—";
    const estimatedTimeLabel =
      typeof tripData.estimatedTime === "string"
        ? tripData.estimatedTime
        : `${ride.activeTrip?.etaMinutes ?? 0} mins`;
    
    updateRideTrip({
      pickup: ride.request.origin,
      dropoff: ride.request.destination,
      fareEstimate: fare,
      etaMinutes: estimatedEtaMinutes,
      distance: distanceLabel,
      routeSummary: `${ride.request.origin?.label ?? "Pickup"} → ${ride.request.destination?.label ?? "Destination"}`
    });
    actions.updateSharedLocationState({
      riderLocation: sharedLocationState.pickupCoords,
      driverLocation: null
    });
    setRideStatus("searching");
    if (typeof window !== "undefined") {
      window.localStorage.setItem("evz_has_ordered_ride", "true");
    }
    console.debug("[RideOptions] confirm", {
      from: location.pathname,
      to: "/rides/searching",
      selectedRide: effectiveSelectedRide,
      passengers: passengerCount
    });

    // Directly continue to driver search after ride confirmation
    navigate("/rides/searching", {
      state: {
        ...tripData,
        selectedRide: effectiveSelectedRide,
        rideType,
        fare,
        passengers: passengerCount,
        distance: distanceLabel,
        estimatedTime: estimatedTimeLabel,
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
          pickupLocation={sharedLocationState.pickupCoords}
          dropoffLocation={sharedLocationState.destinationCoords}
          routePolyline={sharedLocationState.routePolyline}
          canvasSx={{
            background: theme.palette.mode === "light"
              ? "#F5F5DC"
              : "linear-gradient(135deg, #0f1e2e 0%, #1a2d3e 50%, #0f1e2e 100%)"
          }}
        />
      </Box>

      <Box sx={{ px: 0.5 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, letterSpacing: "-0.01em", mb: 0.25 }}
        >
          Select your ride
        </Typography>
        {selectionError ? (
          <Typography variant="caption" sx={{ color: "#DC2626", display: "block" }}>
            {selectionError}
          </Typography>
        ) : null}
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
              Choose the type of ride service that fits your needs. Pricing adapts to {passengerCount}{" "}
              {passengerCount === 1 ? "passenger" : "passengers"}.
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
                  border: "1px solid rgba(209,213,219,0.95)",
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  bgcolor: "transparent",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "transparent"
                  },
                  "&.Mui-selected": {
                    border: "3px solid #F77F00",
                    boxShadow: "0 0 0 1px rgba(247,127,0,0.45)",
                    bgcolor: "transparent",
                    color: theme.palette.text.primary
                  },
                  "&.Mui-selected:hover": {
                    bgcolor: "transparent"
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
                  border: "1px solid rgba(209,213,219,0.95)",
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  bgcolor: "transparent",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "transparent"
                  },
                  "&.Mui-selected": {
                    border: "3px solid #F77F00",
                    boxShadow: "0 0 0 1px rgba(247,127,0,0.45)",
                    bgcolor: "transparent",
                    color: theme.palette.text.primary
                  },
                  "&.Mui-selected:hover": {
                    bgcolor: "transparent"
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
        {rideOptionsWithPricing.map((option) => (
          <RideOptionCard
            key={option.id}
            option={option}
            selected={selectedRide}
            passengers={passengerCount}
            onSelect={handleSelectRide}
          />
        ))}
      </Box>

      <Button
        fullWidth
        variant="contained"
        onClick={handleConfirm}
        disabled={rideOptionsWithPricing.length === 0}
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
