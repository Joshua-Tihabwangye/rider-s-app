import React, { useState, useEffect } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Typography,
  Chip,
  Card,
  CardContent,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  Menu,
  CircularProgress,
  Alert
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import ContactPhoneRoundedIcon from "@mui/icons-material/ContactPhoneRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import Avatar from "@mui/material/Avatar";
import MobileShell from "../components/MobileShell";
import SwitchRiderModal from "../components/SwitchRiderModal";
import TripTypeModal from "../components/TripTypeModal";
import AddStopModal from "../components/AddStopModal";

// Mock service for location search
const searchLocations = async (query) => {
  if (!query || query.length < 3) return [];
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const mockResults = [
    {
      id: "1",
      name: `${query} City`,
      subtext: `${query}, Uganda`,
      distance: "2.3 km",
      type: "recent",
      coordinates: { lat: 0.3476, lng: 32.5825 }
    },
    {
      id: "2",
      name: `${query} Market`,
      subtext: `${query}, Uganda`,
      distance: "3.3 km",
      type: "location",
      coordinates: { lat: 0.3136, lng: 32.5811 }
    },
    {
      id: "3",
      name: `${query} Street`,
      subtext: `${query}, Uganda`,
      distance: "5.1 km",
      type: "location",
      coordinates: { lat: 0.3200, lng: 32.5900 }
    }
  ];
  
  return mockResults.filter(r => 
    r.name.toLowerCase().includes(query.toLowerCase()) ||
    r.subtext.toLowerCase().includes(query.toLowerCase())
  );
};

// Mock recent searches
const getRecentSearches = () => [
  {
    id: "recent-1",
    name: "Kampala City",
    subtext: "Kampala, Uganda",
    distance: "2.3 km",
    type: "recent",
    coordinates: { lat: 0.3476, lng: 32.5825 }
  },
  {
    id: "recent-2",
    name: "Entebbe International Airport",
    subtext: "Entebbe, Uganda",
    distance: "35.2 km",
    type: "recent",
    coordinates: { lat: 0.0422, lng: 32.4435 }
  }
];

function EnterDestinationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  // Get initial values from navigation state
  const initialState = location.state || {};
  
  const [pickup, setPickup] = useState(initialState.pickup || "Current location");
  const [destination, setDestination] = useState(initialState.destination || "");
  const [passengers, setPassengers] = useState(initialState.passengers || 1);
  const [customPassengers, setCustomPassengers] = useState("");
  const [rideType, setRideType] = useState(initialState.rideType || "Personal");
  const [tripType, setTripType] = useState(initialState.tripType || "One Way");
  const [schedule, setSchedule] = useState(initialState.schedule || "Now");
  const [scheduleTime, setScheduleTime] = useState(initialState.scheduleTime || "");
  const [isScheduled, setIsScheduled] = useState(initialState.isScheduled || false);
  const [returnDate, setReturnDate] = useState(initialState.returnDate || null);
  const [returnTime, setReturnTime] = useState(initialState.returnTime || null);
  const [returnDateTime, setReturnDateTime] = useState(initialState.returnDateTime || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [scheduleMenuAnchor, setScheduleMenuAnchor] = useState(null);
  const [showError, setShowError] = useState(false);
  const [showSwitchRiderModal, setShowSwitchRiderModal] = useState(false);
  const [showTripTypeModal, setShowTripTypeModal] = useState(false);
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(initialState.selectedContact || null);
  const [riderType, setRiderType] = useState(initialState.riderType || "personal");
  const [stops, setStops] = useState(initialState.stops || []);
  const [isMultiStopMode, setIsMultiStopMode] = useState(initialState.isMultiStopMode || tripType === "Multi-stop");
  const MAX_STOPS = 6; // Allow up to 6 stops in multi-stop mode

  // Update destination when returning from map screen
  useEffect(() => {
    if (initialState.fromMap && initialState.destination) {
      setDestination(initialState.destination);
      setSearchQuery("");
      setShowSearchResults(false);
    }
  }, [initialState.fromMap, initialState.destination]);

  // Update schedule when returning from schedule screen
  useEffect(() => {
    if (initialState.schedule) {
      setSchedule(initialState.schedule);
      setScheduleTime(initialState.scheduleTime || "");
      setIsScheduled(initialState.isScheduled || false);
    }
  }, [initialState.schedule, initialState.scheduleTime, initialState.isScheduled]);

  // Update selected contact when returning from Switch Rider modal
  useEffect(() => {
    if (initialState.selectedContact) {
      setSelectedContact(initialState.selectedContact);
      setRiderType(initialState.riderType || "contact");
    } else if (initialState.riderType === "personal") {
      setSelectedContact(null);
      setRiderType("personal");
    }
  }, [initialState.selectedContact, initialState.riderType]);

  const passengerOptions = [1, 2, 3, 4, 5, 6];
  const scheduleOptions = ["Now", "Schedule for later"];

  const canContinue = isMultiStopMode
    ? pickup.trim() !== "" && stops.some(stop => stop.value.trim() !== "") &&
      (tripType !== "Round Trip" || (returnDate && returnTime))
    : pickup.trim() !== "" && destination.trim() !== "" &&
      (tripType !== "Round Trip" || (returnDate && returnTime));

  // Load recent searches on mount
  useEffect(() => {
    const recent = getRecentSearches();
    setSearchResults(recent);
  }, []);

  // Search locations when query changes
  useEffect(() => {
    if (searchQuery.length >= 3) {
      setLoadingSearch(true);
      searchLocations(searchQuery).then(results => {
        setSearchResults(results);
        setLoadingSearch(false);
        setShowSearchResults(true);
      });
    } else if (searchQuery.length === 0) {
      setSearchResults(getRecentSearches());
      setShowSearchResults(false);
    } else {
      setSearchResults(getRecentSearches());
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  const handleDestinationSelect = (result) => {
    setDestination(result.name);
    setSearchQuery("");
    setShowSearchResults(false);
    setShowError(false);
  };

  const handleSwitchLocations = () => {
    const tempPickup = pickup;
    setPickup(destination);
    setDestination(tempPickup);
  };

  const handleScheduleSelect = (option) => {
    if (option === "Schedule for later") {
      navigate("/rides/schedule", {
        state: {
          pickup,
          destination,
          passengers,
          rideType,
          tripType,
          schedule,
          scheduleTime,
          isScheduled
        }
      });
    } else {
      setSchedule(option);
      setScheduleTime("");
      setIsScheduled(false);
    }
    setScheduleMenuAnchor(null);
  };

  const handleScheduleClick = (e) => {
    // If scheduled, reopen the scheduling modal
    if (isScheduled) {
      navigate("/rides/schedule", {
        state: {
          pickup,
          destination,
          passengers,
          rideType,
          tripType,
          schedule,
          scheduleTime,
          isScheduled
        }
      });
    } else {
      // Otherwise open the menu
      setScheduleMenuAnchor(e.currentTarget);
    }
  };

  const handleLocateOnMap = () => {
    // Create a clean, serializable state object
    const mapState = {
      pickup,
      destination,
      passengers,
      rideType,
      tripType,
      schedule,
      riderType,
      // Ensure selectedContact is a plain object
      selectedContact: selectedContact 
        ? {
            id: selectedContact.id,
            name: selectedContact.name,
            relation: selectedContact.relation,
            phone: selectedContact.phone,
            initials: selectedContact.initials
          }
        : null
    };
    
    navigate("/rides/enter/preferences", {
      state: mapState
    });
  };

  const handleContinue = (riderData = null) => {
    if (!canContinue) {
      setShowError(true);
      return;
    }
    
    // Validate scheduled date/time hasn't expired
    if (isScheduled && initialState.scheduledDateTime) {
      // Handle both Date objects and ISO strings
      const scheduledDate = initialState.scheduledDateTime instanceof Date 
        ? initialState.scheduledDateTime 
        : new Date(initialState.scheduledDateTime);
      if (scheduledDate <= new Date()) {
        setShowError(true);
        alert("The scheduled date and time has expired. Please select a new time.");
        return;
      }
    }
    
    // Use rider data from modal if provided, otherwise use current state
    const baseState = riderData || {
      pickup,
      destination,
      passengers,
      rideType,
      tripType,
      schedule: schedule === "Now" ? null : schedule,
      scheduleTime,
      isScheduled,
      selectedContact,
      riderType,
      returnDate,
      returnTime,
      returnDateTime
    };
    
    // Create a clean, serializable state object
    // Convert Date objects to ISO strings for serialization
    const tripState = {
      ...baseState,
      scheduledDateTime: initialState.scheduledDateTime 
        ? (initialState.scheduledDateTime instanceof Date 
          ? initialState.scheduledDateTime.toISOString() 
          : initialState.scheduledDateTime)
        : null,
      // Ensure selectedContact is a plain object (not containing any non-serializable data)
      selectedContact: baseState.selectedContact 
        ? {
            id: baseState.selectedContact.id,
            name: baseState.selectedContact.name,
            relation: baseState.selectedContact.relation,
            phone: baseState.selectedContact.phone,
            initials: baseState.selectedContact.initials
          }
        : null,
      // Include return trip data for Round Trip
      returnDate: baseState.returnDate || null,
      returnTime: baseState.returnTime || null,
      returnDateTime: baseState.returnDateTime || null,
      // Include stops data if in multi-stop mode
      stops: isMultiStopMode ? stops.filter(stop => stop.value.trim() !== "") : [],
      isMultiStopMode: isMultiStopMode
    };
    
    navigate("/rides/options", {
      state: tripState
    });
  };

  const handleSwitchRiderContinue = (riderData) => {
    // Handle continue from Switch Rider modal
    // Update local state with selected contact
    if (riderData.selectedContact) {
      setSelectedContact(riderData.selectedContact);
      setRiderType(riderData.riderType || "contact");
    } else if (riderData.riderType === "personal") {
      setSelectedContact(null);
      setRiderType("personal");
    }
    // Continue with the trip
    handleContinue(riderData);
  };

  const getTripData = () => {
    // Return a clean, serializable object
    return {
      pickup,
      destination,
      passengers,
      rideType,
      tripType,
      schedule,
      scheduleTime,
      isScheduled,
      // Convert Date to ISO string if it exists
      scheduledDateTime: initialState.scheduledDateTime 
        ? (initialState.scheduledDateTime instanceof Date 
          ? initialState.scheduledDateTime.toISOString() 
          : initialState.scheduledDateTime)
        : null,
      // Ensure selectedContact is a plain object
      selectedContact: selectedContact 
        ? {
            id: selectedContact.id,
            name: selectedContact.name,
            relation: selectedContact.relation,
            phone: selectedContact.phone,
            initials: selectedContact.initials
          }
        : null,
      riderType
    };
  };

  // Theme-aware colors
  const headerBg = "#0B1E3A"; // Deep navy as per spec
  const headerText = "#FFFFFF";
  const contentBg = theme.palette.mode === "light" ? "#FFFFFF" : theme.palette.background.paper;
  const accentBlue = "#007BFF";
  const lightBlue = "#E3F2FD"; // Light blue for active passenger selection

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.mode === "light" ? "#F3F4F6" : "#1E2A47",
        paddingBottom: { 
          xs: "calc(100px + env(safe-area-inset-bottom))", 
          sm: "120px"
        }
      }}
    >
      {/* Header Section - Dark Blue */}
      <Box
        sx={{
          px: 2.5,
          pt: 2.5,
          pb: 2,
          bgcolor: headerBg
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 999,
              bgcolor: theme.palette.mode === "light"
                ? "rgba(255,255,255,0.1)"
                : "rgba(255,255,255,0.1)",
              color: headerText,
              "&:hover": {
                bgcolor: theme.palette.mode === "light"
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(255,255,255,0.2)"
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
              color: headerText 
            }}
          >
            Enter Destination
          </Typography>
        </Box>

        {/* Trip Setup Card - White/Light Background */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 2,
            bgcolor: contentBg,
            border: theme.palette.mode === "light"
              ? "1px solid rgba(0,0,0,0.1)"
              : "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <CardContent sx={{ px: 2, py: 2 }}>
            <Stack spacing={2}>
              {/* Origin Field with Green Pin */}
              <Box sx={{ position: "relative" }}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PlaceRoundedIcon sx={{ fontSize: 20, color: "#4CAF50" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={handleSwitchLocations}
                          sx={{
                            color: theme.palette.text.secondary,
                            "&:hover": {
                              bgcolor: theme.palette.mode === "light"
                                ? "rgba(0,0,0,0.05)"
                                : "rgba(255,255,255,0.05)"
                            }
                          }}
                        >
                          <SwapVertRoundedIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 999,
                      bgcolor: theme.palette.mode === "light"
                        ? "rgba(0,0,0,0.05)"
                        : "rgba(255,255,255,0.05)",
                      color: theme.palette.text.primary,
                      "& fieldset": {
                        borderColor: theme.palette.mode === "light"
                          ? "rgba(0,0,0,0.15)"
                          : "rgba(255,255,255,0.2)"
                      },
                      "&:hover fieldset": {
                        borderColor: accentBlue
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: accentBlue
                      }
                    }
                  }}
                />
              </Box>

              {/* Single Destination Mode */}
              {!isMultiStopMode && (
                <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder="Abayita Ababiri, Lyamu..."
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      setSearchQuery(e.target.value);
                      setShowError(false);
                    }}
                    onFocus={() => {
                      if (searchQuery.length === 0) {
                        setSearchResults(getRecentSearches());
                      }
                      setShowSearchResults(true);
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              bgcolor: theme.palette.mode === "light" ? "#9E9E9E" : "#757575",
                              color: "#FFFFFF",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                              fontWeight: 600
                            }}
                          >
                            A
                          </Box>
                        </InputAdornment>
                      ),
                      endAdornment: destination && (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setDestination("");
                              setSearchQuery("");
                              setShowSearchResults(false);
                            }}
                            sx={{
                              color: theme.palette.text.secondary,
                              "&:hover": {
                                bgcolor: theme.palette.mode === "light"
                                  ? "rgba(0,0,0,0.05)"
                                  : "rgba(255,255,255,0.05)"
                              }
                            }}
                          >
                            <CloseRoundedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 999,
                        bgcolor: theme.palette.mode === "light"
                          ? "rgba(0,0,0,0.05)"
                          : "rgba(255,255,255,0.05)",
                        color: theme.palette.text.primary,
                        "& fieldset": {
                          borderColor: theme.palette.mode === "light"
                            ? "rgba(0,0,0,0.15)"
                            : "rgba(255,255,255,0.2)"
                        },
                        "&:hover fieldset": {
                          borderColor: accentBlue
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: accentBlue
                        }
                      }
                    }}
                  />
                  {/* Date & Time Selector beside destination */}
                  <Button
                    variant="outlined"
                    onClick={handleScheduleClick}
                    startIcon={<CalendarTodayRoundedIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      minWidth: 100,
                      borderRadius: 999,
                      textTransform: "none",
                      borderColor: theme.palette.mode === "light"
                        ? "rgba(0,0,0,0.15)"
                        : "rgba(255,255,255,0.2)",
                      color: isScheduled ? "#4CAF50" : theme.palette.text.primary,
                      bgcolor: theme.palette.mode === "light"
                        ? "rgba(0,0,0,0.05)"
                        : "rgba(255,255,255,0.05)",
                      "&:hover": {
                        borderColor: isScheduled ? "#4CAF50" : accentBlue,
                        bgcolor: `${accentBlue}10`
                      },
                      fontSize: 12,
                      px: 1.5
                    }}
                  >
                    {isScheduled ? scheduleTime : schedule}
                  </Button>
                </Box>
              )}

              {/* Multi-Stop Mode - Show multiple stop fields */}
              {isMultiStopMode && (
                <>
                  {/* Stops A-F */}
                  {stops.map((stop, index) => {
                    const isLast = index === stops.length - 1;
                    const isSquare = stop.id === "B"; // Stop B is square per spec
                    return (
                      <Box key={stop.id} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <TextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          value={stop.value}
                          onChange={(e) => {
                            const newStops = [...stops];
                            newStops[index].value = e.target.value;
                            setStops(newStops);
                          }}
                          placeholder={`Stop ${stop.id}`}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                {isLast ? (
                                  // Orange pin icon for final stop
                                  <PlaceRoundedIcon sx={{ fontSize: 20, color: "#FF9800" }} />
                                ) : (
                                  // Letter badge for other stops
                                  <Box
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      borderRadius: isSquare ? 1 : "50%",
                                      bgcolor: "rgba(15,23,42,0.9)",
                                      color: "#F9FAFB",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: 12,
                                      fontWeight: 600
                                    }}
                                  >
                                    {stop.id}
                                  </Box>
                                )}
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                  <DragIndicatorRoundedIcon 
                                    sx={{ 
                                      fontSize: 18, 
                                      color: theme.palette.text.secondary,
                                      cursor: "grab",
                                      "&:active": { cursor: "grabbing" }
                                    }} 
                                  />
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      const newStops = stops.filter((_, i) => i !== index);
                                      // Re-index stops
                                      const reindexed = newStops.map((s, idx) => ({
                                        ...s,
                                        id: String.fromCharCode(65 + idx)
                                      }));
                                      setStops(reindexed);
                                    }}
                                    sx={{
                                      color: theme.palette.text.secondary,
                                      "&:hover": {
                                        bgcolor: theme.palette.mode === "light"
                                          ? "rgba(0,0,0,0.05)"
                                          : "rgba(255,255,255,0.05)"
                                      }
                                    }}
                                  >
                                    <CloseRoundedIcon sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </Box>
                              </InputAdornment>
                            )
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 999,
                              bgcolor: theme.palette.mode === "light"
                                ? "rgba(0,0,0,0.05)"
                                : "rgba(255,255,255,0.05)",
                              color: theme.palette.text.primary,
                              "& fieldset": {
                                borderColor: theme.palette.mode === "light"
                                  ? "rgba(0,0,0,0.15)"
                                  : "rgba(255,255,255,0.2)"
                              },
                              "&:hover fieldset": {
                                borderColor: accentBlue
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: accentBlue
                              }
                            }
                          }}
                        />
                      </Box>
                    );
                  })}

                  {/* Add Stop Field */}
                  {stops.length < MAX_STOPS && (
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      placeholder="Add stop."
                      onClick={() => {
                        if (stops.length < MAX_STOPS) {
                          setShowAddStopModal(true);
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PlaceRoundedIcon sx={{ fontSize: 20, color: "#FF9800" }} />
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 999,
                          bgcolor: theme.palette.mode === "light"
                            ? "rgba(0,0,0,0.05)"
                            : "rgba(255,255,255,0.05)",
                          color: theme.palette.text.primary,
                          cursor: "pointer",
                          "& fieldset": {
                            borderColor: theme.palette.mode === "light"
                              ? "rgba(0,0,0,0.15)"
                              : "rgba(255,255,255,0.2)"
                          },
                          "&:hover fieldset": {
                            borderColor: "#FF9800"
                          }
                        }
                      }}
                    />
                  )}

                  {/* Date & Time Selector for Multi-Stop Mode */}
                  <Button
                    variant="outlined"
                    onClick={handleScheduleClick}
                    startIcon={<CalendarTodayRoundedIcon sx={{ fontSize: 18 }} />}
                    endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: 18 }} />}
                    sx={{
                      borderRadius: 999,
                      textTransform: "none",
                      borderColor: theme.palette.mode === "light"
                        ? "rgba(0,0,0,0.15)"
                        : "rgba(255,255,255,0.2)",
                      color: isScheduled ? "#4CAF50" : theme.palette.text.primary,
                      bgcolor: theme.palette.mode === "light"
                        ? "rgba(0,0,0,0.05)"
                        : "rgba(255,255,255,0.05)",
                      "&:hover": {
                        borderColor: isScheduled ? "#4CAF50" : accentBlue,
                        bgcolor: `${accentBlue}10`
                      },
                      justifyContent: "flex-start"
                    }}
                  >
                    {isScheduled ? `${schedule} – ${scheduleTime}` : schedule}
                  </Button>
                </>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Lower Section - White/Light Background */}
      <Box
        sx={{
          px: 2.5,
          pt: 2,
          bgcolor: contentBg,
          minHeight: "calc(100vh - 200px)"
        }}
      >
        {/* Error Alert */}
        {showError && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            onClose={() => setShowError(false)}
          >
            Please select a destination before continuing.
          </Alert>
        )}

        {/* Trip Type Options */}
        <Stack spacing={1.5} sx={{ mb: 2 }}>
          {/* Ride Type Dropdown */}
          <Card
            elevation={0}
            sx={{
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
                    if (newValue === "Personal" || newValue === "Business" || newValue === "Group" || newValue === "Delivery") {
                      setRideType(newValue);
                      setSelectedContact(null);
                      setRiderType("personal");
                    } else if (newValue === "add-contact" || newValue === "manual") {
                      setShowSwitchRiderModal(true);
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
                        <PersonRoundedIcon sx={{ fontSize: 18, color: accentBlue }} />
                        <Typography>{rideType}</Typography>
                      </Box>
                    );
                  }}
                  sx={{
                    borderRadius: 999,
                    bgcolor: theme.palette.mode === "light"
                      ? "rgba(0,0,0,0.05)"
                      : "rgba(255,255,255,0.05)",
                    color: theme.palette.text.primary,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.mode === "light"
                        ? "rgba(0,0,0,0.15)"
                        : "rgba(255,255,255,0.2)"
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: accentBlue
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: accentBlue
                    }
                  }}
                >
                  {selectedContact && (
                    <MenuItem value={`contact-${selectedContact.id}`} disabled>
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
                    </MenuItem>
                  )}
                  <MenuItem value="Personal">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonRoundedIcon sx={{ fontSize: 18 }} />
                      Personal
                    </Box>
                  </MenuItem>
                  <MenuItem value="Business">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <DirectionsCarRoundedIcon sx={{ fontSize: 18 }} />
                      Business
                    </Box>
                  </MenuItem>
                  <MenuItem value="Group">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <GroupRoundedIcon sx={{ fontSize: 18 }} />
                      Group
                    </Box>
                  </MenuItem>
                  <MenuItem value="Delivery">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <DirectionsCarRoundedIcon sx={{ fontSize: 18 }} />
                      Delivery
                    </Box>
                  </MenuItem>
                  <MenuItem 
                    value="add-contact"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowSwitchRiderModal(true);
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <ContactPhoneRoundedIcon sx={{ fontSize: 18 }} />
                      Add Contact
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          {/* Trip Direction Dropdown */}
          <Card
            elevation={0}
            sx={{
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
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue === "One Way" || newValue === "Round Trip") {
                      setTripType(newValue);
                      setIsMultiStopMode(false);
                      if (newValue === "One Way") {
                        setReturnDate(null);
                        setReturnTime(null);
                        setReturnDateTime(null);
                      }
                    } else if (newValue === "Multi-stop") {
                      setTripType("Multi-stop");
                      setIsMultiStopMode(true);
                      // Initialize stops if empty - convert current destination to first stop
                      if (stops.length === 0) {
                        if (destination.trim()) {
                          setStops([{ id: "A", value: destination }]);
                          setDestination("");
                        } else {
                          setStops([{ id: "A", value: "" }]);
                        }
                      }
                    }
                  }}
                  renderValue={(value) => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <DirectionsCarRoundedIcon sx={{ fontSize: 18, color: accentBlue }} />
                      <Typography>{value}</Typography>
                    </Box>
                  )}
                  sx={{
                    borderRadius: 999,
                    bgcolor: theme.palette.mode === "light"
                      ? "rgba(0,0,0,0.05)"
                      : "rgba(255,255,255,0.05)",
                    color: theme.palette.text.primary,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.mode === "light"
                        ? "rgba(0,0,0,0.15)"
                        : "rgba(255,255,255,0.2)"
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: accentBlue
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: accentBlue
                    }
                  }}
                >
                  <MenuItem value="One Way">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <DirectionsCarRoundedIcon sx={{ fontSize: 18 }} />
                      One Way
                    </Box>
                  </MenuItem>
                  <MenuItem value="Round Trip">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <DirectionsCarRoundedIcon sx={{ fontSize: 18 }} />
                      Round Trip
                    </Box>
                  </MenuItem>
                  <MenuItem value="Multi-stop">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <DirectionsCarRoundedIcon sx={{ fontSize: 18 }} />
                      Multi-stop
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          {/* Return Date & Time Section - Only shown when Round Trip is selected */}
          {tripType === "Round Trip" && (
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                bgcolor: contentBg,
                border: theme.palette.mode === "light"
                  ? "1px solid rgba(0,0,0,0.1)"
                  : "1px solid rgba(255,255,255,0.1)"
              }}
            >
              <CardContent sx={{ px: 2, py: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ 
                        fontWeight: 600, 
                        mb: 0.5, 
                        color: theme.palette.text.primary 
                      }}
                    >
                      Drop Date & Time
                    </Typography>
                    {returnDate && returnTime ? (
                      <Typography
                        variant="body2"
                        sx={{ 
                          color: theme.palette.text.secondary,
                          fontSize: 14
                        }}
                      >
                        {(() => {
                          // Parse return date string (e.g., "Wed, 26 Sep 2024")
                          const dateMatch = returnDate.match(/(\w+),\s*(\d+)\s*(\w+)\s*(\d+)/);
                          if (dateMatch) {
                            const [, , day, month, year] = dateMatch;
                            // Format as "26 Sep 2024"
                            return `${day} ${month} ${year}`;
                          }
                          return returnDate;
                        })()}, {(() => {
                          // Format time to remove leading zero from hour if present
                          if (returnTime && returnTime.includes(':')) {
                            const [timePart, period] = returnTime.split(' ');
                            const [hour, minute] = timePart.split(':');
                            const hourNum = parseInt(hour);
                            return `${hourNum}:${minute} ${period}`;
                          }
                          return returnTime;
                        })()}
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ 
                          color: theme.palette.text.secondary,
                          fontSize: 14,
                          fontStyle: "italic"
                        }}
                      >
                        Select return date & time
                      </Typography>
                    )}
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => setShowTripTypeModal(true)}
                    sx={{
                      borderRadius: 999,
                      bgcolor: theme.palette.mode === "light"
                        ? "rgba(0,0,0,0.05)"
                        : "rgba(255,255,255,0.05)",
                      color: accentBlue,
                      "&:hover": {
                        bgcolor: `${accentBlue}15`
                      }
                    }}
                  >
                    <CalendarTodayRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Passenger Selection */}
          <Card
            elevation={0}
            sx={{
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
              <Stack 
                direction="row" 
                spacing={1} 
                sx={{ 
                  flexWrap: "nowrap",
                  overflowX: "auto",
                  "&::-webkit-scrollbar": { display: "none" },
                  scrollbarWidth: "none",
                  mb: 1.5
                }}
              >
                {passengerOptions.map((pax) => (
                  <Chip
                    key={pax}
                    label={pax}
                    size="small"
                    onClick={() => {
                      setPassengers(pax);
                      setCustomPassengers("");
                    }}
                    sx={{
                      minWidth: 48,
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      fontSize: 14,
                      fontWeight: 600,
                      flexShrink: 0,
                      bgcolor: passengers === pax && !customPassengers
                        ? lightBlue
                        : theme.palette.mode === "light"
                          ? "rgba(0,0,0,0.05)"
                          : "rgba(255,255,255,0.05)",
                      color: passengers === pax && !customPassengers
                        ? accentBlue
                        : theme.palette.text.primary,
                      border: passengers === pax && !customPassengers
                        ? "none"
                        : theme.palette.mode === "light"
                          ? "1px solid rgba(0,0,0,0.15)"
                          : "1px solid rgba(255,255,255,0.2)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: passengers === pax && !customPassengers
                          ? lightBlue
                          : theme.palette.mode === "light"
                            ? "rgba(0,0,0,0.1)"
                            : "rgba(255,255,255,0.1)"
                      }
                    }}
                  />
                ))}
              </Stack>
              <TextField
                fullWidth
                type="number"
                placeholder="Enter number of passengers (more than 6)"
                value={customPassengers}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || (parseInt(value) > 6 && parseInt(value) <= 50)) {
                    setCustomPassengers(value);
                    if (value !== "") {
                      setPassengers(parseInt(value));
                    }
                  }
                }}
                onFocus={() => {
                  setPassengers(customPassengers ? parseInt(customPassengers) : 1);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonRoundedIcon 
                        sx={{ 
                          fontSize: 18, 
                          color: theme.palette.text.secondary 
                        }} 
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: theme.palette.mode === "light"
                      ? "rgba(0,0,0,0.02)"
                      : "rgba(255,255,255,0.05)",
                    "& fieldset": {
                      borderColor: theme.palette.mode === "light"
                        ? "rgba(0,0,0,0.15)"
                        : "rgba(255,255,255,0.2)"
                    },
                    "&:hover fieldset": {
                      borderColor: theme.palette.mode === "light"
                        ? "rgba(0,0,0,0.3)"
                        : "rgba(255,255,255,0.3)"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: accentBlue
                    }
                  },
                  "& .MuiInputBase-input": {
                    fontSize: 14,
                    py: 1.25
                  }
                }}
              />
            </CardContent>
          </Card>
        </Stack>

        {/* Search Results */}
        {showSearchResults && searchResults.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 1.5,
                color: theme.palette.text.primary,
                fontSize: 14
              }}
            >
              Search results
            </Typography>
            <Stack spacing={1}>
              {searchResults.map((result) => (
                <Card
                  key={result.id}
                  elevation={0}
                  onClick={() => handleDestinationSelect(result)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: theme.palette.mode === "light" ? "#FFFFFF" : contentBg,
                    border: theme.palette.mode === "light"
                      ? "1px solid rgba(0,0,0,0.1)"
                      : "1px solid rgba(255,255,255,0.1)",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: theme.palette.mode === "light"
                        ? "#F5F5F5"
                        : "rgba(255,255,255,0.05)"
                    }
                  }}
                >
                  <CardContent sx={{ px: 2, py: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 80 }}>
                        {result.type === "recent" ? (
                          <AccessTimeRoundedIcon
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: 20
                            }}
                          />
                        ) : (
                          <PlaceRoundedIcon
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: 20
                            }}
                          />
                        )}
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: 12
                          }}
                        >
                          {result.distance}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mb: 0.25
                          }}
                        >
                          {result.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          {result.subtext}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
            {loadingSearch && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Fixed Bottom Section with Locate on Map and Continue Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: "calc(64px + env(safe-area-inset-bottom))", sm: 64 },
          left: 0,
          right: 0,
          bgcolor: contentBg,
          borderTop: theme.palette.mode === "light"
            ? "1px solid rgba(0,0,0,0.1)"
            : "1px solid rgba(255,255,255,0.1)",
          px: 2.5,
          py: 2,
          zIndex: 999,
          maxWidth: { lg: 600, xl: 600 },
          margin: { lg: "0 auto", xl: "0 auto" }
        }}
      >
        {/* Locate on Map Button */}
        <Button
          fullWidth
          onClick={handleLocateOnMap}
          sx={{
            mb: 1.5,
            color: accentBlue,
            textTransform: "none",
            fontSize: 14,
            fontWeight: 500,
            "&:hover": {
              bgcolor: `${accentBlue}10`
            }
          }}
          startIcon={<MapRoundedIcon />}
        >
          Locate on Map
        </Button>

        {/* Test Navigation to Sharing Passengers Screen - Remove in production */}
        <Button
          fullWidth
          onClick={() => navigate("/rides/trip/sharing")}
          sx={{
            mb: 1.5,
            color: accentBlue,
            textTransform: "none",
            fontSize: 14,
            fontWeight: 500,
            border: `1px solid ${accentBlue}`,
            "&:hover": {
              bgcolor: `${accentBlue}10`
            }
          }}
          startIcon={<GroupRoundedIcon />}
        >
          View Sharing Passengers (Test)
        </Button>

        {/* Continue Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={(e) => {
            e.preventDefault();
            handleContinue();
          }}
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

      {/* Schedule Menu */}
      <Menu
        anchorEl={scheduleMenuAnchor}
        open={Boolean(scheduleMenuAnchor)}
        onClose={() => setScheduleMenuAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            mt: 1,
            minWidth: 200,
            bgcolor: contentBg
          }
        }}
      >
        {scheduleOptions.map((option) => (
          <MenuItem
            key={option}
            onClick={() => handleScheduleSelect(option)}
            sx={{
              "&:hover": {
                bgcolor: `${accentBlue}15`
              }
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>

      {/* Switch Rider Modal */}
      <SwitchRiderModal
        open={showSwitchRiderModal}
        onClose={() => setShowSwitchRiderModal(false)}
        tripData={getTripData()}
        onContinue={handleSwitchRiderContinue}
      />

      {/* Trip Type Modal */}
      <TripTypeModal
        open={showTripTypeModal}
        onClose={() => setShowTripTypeModal(false)}
        currentTripType={tripType}
        departureDate={isScheduled && schedule ? new Date(initialState.scheduledDateTime || new Date()) : new Date()}
        departureTime={isScheduled && scheduleTime ? scheduleTime : null}
        existingReturnDate={returnDate}
        existingReturnTime={returnTime}
        onSelect={(data) => {
          setTripType(data.tripType);
          if (data.tripType === "Round Trip") {
            setReturnDate(data.returnDate);
            setReturnTime(data.returnTime);
            setReturnDateTime(data.returnDateTime);
          } else {
            setReturnDate(null);
            setReturnTime(null);
            setReturnDateTime(null);
          }
        }}
      />

      {/* Add Stop Modal */}
      <AddStopModal
        open={showAddStopModal}
        onClose={() => setShowAddStopModal(false)}
        onSelectStop={(stop) => {
          // Re-index existing stops and add new one
          const reindexed = stops.map((s, idx) => ({
            ...s,
            id: String.fromCharCode(65 + idx)
          }));
          setStops([...reindexed, stop]);
        }}
        currentStopCount={stops.length}
      />
    </Box>
  );
}

export default function RiderScreen5TripSetupCanvas_v2() {
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
        <EnterDestinationScreen />
      </MobileShell>
    </Box>
  );
}
