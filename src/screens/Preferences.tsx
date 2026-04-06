import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Select,
  MenuItem,
  FormControl,
  Avatar
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

// Route preference categories
const ROUTE_PREFERENCES = [
  {
    category: "Urban Areas",
    options: [
      { id: "downtown", label: "Downtown" },
      { id: "city-centre", label: "City Centre" },
      { id: "shopping-malls", label: "Shopping Malls" },
      { id: "stadiums", label: "Stadiums" }
    ]
  },
  {
    category: "Suburban Areas",
    options: [
      { id: "gated-communities", label: "Gated Communities" },
      { id: "suburbs", label: "Suburbs" },
      { id: "airports", label: "Airports" },
      { id: "train-stations", label: "Train Stations" }
    ]
  },
  {
    category: "Rural & Scenic",
    options: [
      { id: "countryside", label: "Countryside" },
      { id: "scenic-routes", label: "Scenic Routes" },
      { id: "mountain-passes", label: "Mountain Passes" },
      { id: "coastal-roads", label: "Coastal Roads" }
    ]
  }
];

function PreferenceSelectionScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  // Get trip data from navigation state
  const tripData = location.state || {};
  
  const [selectedPreferences, setSelectedPreferences] = useState(
    tripData.routePreferences || []
  );
  const [passengers, setPassengers] = useState(tripData.passengers || 1);
  const [rideType, setRideType] = useState(tripData.rideType || "Personal");
  const [tripType, setTripType] = useState(tripData.tripType || "One Way");
  const [selectedContact, setSelectedContact] = useState(tripData.selectedContact || null);
  
  const accentGreen = "#03CD8C";
  const contentBg = theme.palette.mode === "light" ? "#FFFFFF" : theme.palette.background.paper;
  const passengerOptions = [1, 2, 3, 4, 5, 6];
  
  // Format date/time display
  const formatDateTime = () => {
    if (tripData.isScheduled && tripData.schedule && tripData.scheduleTime) {
      return `${tripData.schedule} – ${tripData.scheduleTime}`;
    }
    return "Now";
  };
  
  const togglePreference = (prefId: string): void => {
    setSelectedPreferences((prev: string[]) =>
      prev.includes(prefId)
        ? prev.filter((id: string) => id !== prefId)
        : [...prev, prefId]
    );
  };
  
  const handleContinue = () => {
    if (selectedPreferences.length === 0) {
      return; // Button should be disabled, but just in case
    }
    
    // Navigate to map screen with all trip data including preferences
    navigate("/rides/enter/map", {
      state: {
        ...tripData,
        passengers,
        rideType,
        tripType,
        routePreferences: selectedPreferences
      }
    });
  };
  
  const canContinue = selectedPreferences.length > 0;
  
  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 5,
              bgcolor: contentBg,
              border: theme.palette.mode === "light"
                ? "1px solid rgba(0,0,0,0.1)"
                : "1px solid rgba(255,255,255,0.1)"
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
            Enter Destination
          </Typography>
        </Box>
        <IconButton
          size="small"
          aria-label="Setup Preferences"
          onClick={() => navigate("/rides/preferences/setup")}
          sx={{
            borderRadius: 5,
            bgcolor: contentBg,
            border: theme.palette.mode === "light"
              ? "1px solid rgba(0,0,0,0.1)"
              : "1px solid rgba(255,255,255,0.1)",
            color: accentGreen
          }}
        >
          <SettingsRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Trip Details Section */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: contentBg,
          border: theme.palette.mode === "light"
            ? "1px solid rgba(0,0,0,0.1)"
            : "1px solid rgba(255,255,255,0.1)"
        }}
      >
        <CardContent sx={{ px: 2, py: 1.5 }}>
          <Stack spacing={1.5}>
            {/* Pickup */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PlaceRoundedIcon
                sx={{ fontSize: 18, color: "#4CAF50" }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: 14
                }}
              >
                {tripData.pickup || "Entebbe International Airport"}
              </Typography>
            </Box>
            
            {/* Drop-off */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PlaceRoundedIcon
                sx={{ fontSize: 18, color: "#FF5722" }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: 14
                }}
              >
                {tripData.destination || "Kampala City"}
              </Typography>
            </Box>
            
            {/* Date & Time */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarTodayRoundedIcon
                  sx={{ fontSize: 18, color: theme.palette.text.secondary }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: 14
                  }}
                >
                  {formatDateTime()}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => {
                  // Navigate to schedule screen to edit date/time
                  navigate("/rides/schedule", {
                    state: {
                      ...tripData,
                      passengers,
                      rideType,
                      tripType,
                      routePreferences: selectedPreferences
                    }
                  });
                }}
                sx={{
                  borderRadius: 5,
                  bgcolor: theme.palette.mode === "light"
                    ? "rgba(0,0,0,0.05)"
                    : "rgba(255,255,255,0.05)",
                  color: accentGreen,
                  "&:hover": {
                    bgcolor: "rgba(3,205,140,0.15)"
                  }
                }}
              >
                <CalendarTodayRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Rider & Trip Type Row */}
      <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
        {/* Rider Type */}
        <Card
          elevation={0}
          sx={{
            flex: 1,
            borderRadius: 2,
            bgcolor: contentBg,
            border: theme.palette.mode === "light"
              ? "1px solid rgba(0,0,0,0.1)"
              : "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <CardContent sx={{ px: 2, py: 1.5 }}>
            <FormControl fullWidth size="small">
              <Select
                value={selectedContact ? `contact-${selectedContact.id}` : rideType}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue === "Personal" || newValue === "Business" || newValue === "Family") {
                    setRideType(newValue);
                    setSelectedContact(null);
                  }
                }}
                renderValue={(value) => {
                  if (selectedContact) {
                    return (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: "#4CAF50",
                            color: "#FFFFFF",
                            fontSize: 12,
                            fontWeight: 600
                          }}
                        >
                          {selectedContact.initials}
                        </Avatar>
                        <Typography>{selectedContact.name}</Typography>
                      </Box>
                    );
                  }
                  return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonRoundedIcon sx={{ fontSize: 18, color: accentGreen }} />
                      <Typography>{rideType}</Typography>
                    </Box>
                  );
                }}
                sx={{
                  borderRadius: 5,
                  bgcolor: theme.palette.mode === "light"
                    ? "rgba(0,0,0,0.05)"
                    : "rgba(255,255,255,0.05)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none"
                  }
                }}
              >
                <MenuItem value="Personal">Personal</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
                <MenuItem value="Family">Family</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>

        {/* Trip Type */}
        <Card
          elevation={0}
          sx={{
            flex: 1,
            borderRadius: 2,
            bgcolor: contentBg,
            border: theme.palette.mode === "light"
              ? "1px solid rgba(0,0,0,0.1)"
              : "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <CardContent sx={{ px: 2, py: 1.5 }}>
            <FormControl fullWidth size="small">
              <Select
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                renderValue={(value) => (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DirectionsCarRoundedIcon sx={{ fontSize: 18, color: accentGreen }} />
                    <Typography>{value}</Typography>
                  </Box>
                )}
                sx={{
                  borderRadius: 5,
                  bgcolor: theme.palette.mode === "light"
                    ? "rgba(0,0,0,0.05)"
                    : "rgba(255,255,255,0.05)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none"
                  }
                }}
              >
                <MenuItem value="One Way">One Way</MenuItem>
                <MenuItem value="Round Trip">Round Trip</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </Stack>

      {/* Passengers Section */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: contentBg,
          border: theme.palette.mode === "light"
            ? "1px solid rgba(0,0,0,0.1)"
            : "1px solid rgba(255,255,255,0.1)"
        }}
      >
        <CardContent sx={{ px: 2, py: 1.5 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              mb: 1.5,
              color: theme.palette.text.primary
            }}
          >
            Passengers
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {passengerOptions.map((pax) => (
              <Chip
                key={pax}
                label={pax}
                size="small"
                onClick={() => setPassengers(pax)}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  fontSize: 14,
                  fontWeight: 600,
                  bgcolor: passengers === pax
                    ? accentGreen
                    : theme.palette.mode === "light"
                      ? "rgba(0,0,0,0.05)"
                      : "rgba(255,255,255,0.05)",
                  color: passengers === pax
                    ? "#FFFFFF"
                    : theme.palette.text.primary,
                  border: passengers === pax
                    ? "none"
                    : theme.palette.mode === "light"
                      ? "1px solid rgba(0,0,0,0.15)"
                      : "1px solid rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: passengers === pax
                      ? accentGreen
                      : theme.palette.mode === "light"
                        ? "rgba(0,0,0,0.1)"
                        : "rgba(255,255,255,0.1)"
                  }
                }}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Preference Selection Section */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: contentBg,
          border: theme.palette.mode === "light"
            ? "1px solid rgba(0,0,0,0.1)"
            : "1px solid rgba(255,255,255,0.1)"
        }}
      >
        <CardContent sx={{ px: 2, py: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 0.5,
              color: theme.palette.text.primary
            }}
          >
            Select Your Preferences
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 2.5,
              color: theme.palette.text.secondary,
              fontSize: 14
            }}
          >
            Choose your preferences to refine your search.
          </Typography>

          <Stack spacing={3}>
            {ROUTE_PREFERENCES.map((category) => (
              <Box key={category.category}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    mb: 1.5,
                    color: theme.palette.text.primary,
                    fontSize: 13
                  }}
                >
                  {category.category}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  {category.options.map((option) => {
                    const isSelected = selectedPreferences.includes(option.id);
                    return (
                      <Chip
                        key={option.id}
                        label={option.label}
                        onClick={() => togglePreference(option.id)}
                        size="medium"
                        sx={{
                          borderRadius: 2,
                          px: 1.5,
                          py: 0.5,
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: "pointer",
                          bgcolor: isSelected
                            ? "rgba(3,205,140,0.15)"
                            : theme.palette.mode === "light"
                              ? "#FFFFFF"
                              : "rgba(255,255,255,0.05)",
                          color: isSelected
                            ? accentGreen
                            : theme.palette.text.primary,
                          border: isSelected
                            ? "2px solid #03CD8C"
                            : theme.palette.mode === "light"
                              ? "1px solid #E0E0E0"
                              : "1px solid rgba(255,255,255,0.2)",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            borderColor: accentGreen,
                            bgcolor: isSelected
                              ? "rgba(3,205,140,0.15)"
                              : theme.palette.mode === "light"
                                ? "rgba(0,0,0,0.05)"
                                : "rgba(255,255,255,0.1)"
                          }
                        }}
                      />
                    );
                  })}
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <Button
        fullWidth
        variant="contained"
        onClick={handleContinue}
        disabled={!canContinue}
        sx={{
          borderRadius: 2,
          py: 1.5,
          fontSize: 16,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: canContinue ? "#000000" : "rgba(0,0,0,0.2)",
          color: "#FFFFFF",
          boxShadow: "none",
          "&:hover": {
            bgcolor: canContinue ? "#333333" : "rgba(0,0,0,0.3)",
            boxShadow: "none"
          },
          "&.Mui-disabled": {
            bgcolor: "rgba(0,0,0,0.2)",
            color: "#FFFFFF",
            opacity: 1
          }
        }}
      >
        Continue
      </Button>
    </Box>
  );
}

export default function RiderScreen59PreferenceSelectionCanvas_v2() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (theme) => theme.palette.background.default
      }}
    >

        <PreferenceSelectionScreen />
      
    </Box>
  );
}
