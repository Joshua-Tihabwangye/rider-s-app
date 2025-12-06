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
  TextField,
  InputAdornment,
  Button,
  Stack,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Alert
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import MobileShell from "../components/MobileShell";

const MAX_STOPS = 5; // Maximum for RA39, navigate to RA40 for 6 stops

function EnterDestinationMultipleStopsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const initialState = location.state || {};

  const [pickup, setPickup] = useState(initialState.pickup || "Entebbe International Airport");
  const [stops, setStops] = useState(initialState.stops || [
    { id: "A", value: "Abayita Ababiri, Lyamu..." },
    { id: "B", value: "Belle Vue Rooftop" },
    { id: "C", value: "Freedom City Mall" }
  ]);
  const [rideType, setRideType] = useState(initialState.rideType || "Personal");
  const [tripDirection, setTripDirection] = useState(initialState.tripDirection || "Multi-stop");
  const [passengers, setPassengers] = useState(initialState.passengers || 1);
  const [schedule] = useState(initialState.schedule || "Now");
  const [showError, setShowError] = useState(false);

  // Theme-aware colors
  const headerBg = "#0B1E3A"; // Deep navy
  const headerText = "#FFFFFF";
  const contentBg = theme.palette.mode === "light" ? "#FFFFFF" : theme.palette.background.paper;
  const accentBlue = "#00B7FF"; // Teal/blue
  const lightBlue = "#E3F2FD"; // Light blue for active passenger

  const passengerOptions = [1, 2, 3, 4, 5, 6];

  // Re-index stops alphabetically when one is removed
  const reindexStops = (stopsList) => {
    return stopsList.map((stop, index) => ({
      ...stop,
      id: String.fromCharCode(65 + index) // A, B, C, D, E
    }));
  };

  const handleRemoveStop = (stopId) => {
    const newStops = stops.filter(stop => stop.id !== stopId);
    setStops(reindexStops(newStops));
  };

  const handleAddStop = () => {
    if (stops.length < MAX_STOPS) {
      const nextLetter = String.fromCharCode(65 + stops.length); // A, B, C, D, E
      setStops([...stops, { id: nextLetter, value: "" }]);
    } else {
      // Navigate to Maximum Stops screen (RA40) when 5-stop limit is reached
      navigate("/rides/enter/multi-stops/max", {
        state: {
          pickup,
          stops,
          rideType,
          tripDirection,
          passengers,
          schedule
        }
      });
    }
  };

  const handleStopChange = (stopId, value) => {
    setStops(stops.map(stop => 
      stop.id === stopId ? { ...stop, value } : stop
    ));
  };

  const handleLocateOnMap = () => {
    navigate("/rides/enter/preferences", {
      state: {
        pickup,
        stops,
        rideType,
        tripDirection,
        passengers,
        schedule,
        isMultiStop: true
      }
    });
  };

  const handleContinue = () => {
    // Validation: pickup and at least one stop with value required
    const hasValidStops = stops.some(stop => stop.value.trim() !== "");
    
    if (!pickup.trim() || !hasValidStops) {
      setShowError(true);
      return;
    }

    navigate("/rides/options", {
      state: {
        pickup,
        stops: stops.filter(stop => stop.value.trim() !== ""),
        rideType,
        tripDirection,
        passengers,
        schedule,
        isMultiStop: true
      }
    });
  };

  const canContinue = pickup.trim() !== "" && stops.some(stop => stop.value.trim() !== "");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.mode === "light" ? "#F3F4F6" : "#0B1E3A",
        paddingBottom: { 
          xs: "calc(100px + env(safe-area-inset-bottom))", 
          sm: "120px"
        }
      }}
    >
      {/* Header Section - Deep Navy */}
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
              bgcolor: "rgba(255,255,255,0.1)",
              color: headerText,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.2)"
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

        {/* Route Setup Card */}
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
              {/* Pickup Point - Non-deletable */}
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          bgcolor: "#4CAF50",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "#FFFFFF"
                          }}
                        />
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

              {/* Stops A, B, C, etc. */}
              {stops.map((stop, index) => {
                const isSquare = stop.id === "B"; // Stop B is square per spec, others are circular
                return (
                  <Box key={stop.id} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={stop.value}
                      onChange={(e) => handleStopChange(stop.id, e.target.value)}
                      placeholder={`Stop ${stop.id}`}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: isSquare ? 1 : "50%", // Square for B, circular for others
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
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveStop(stop.id)}
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
                  onClick={handleAddStop}
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

              {/* Date & Time Selector */}
              <Button
                variant="outlined"
                startIcon={<CalendarTodayRoundedIcon sx={{ fontSize: 18 }} />}
                endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: 18 }} />}
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  borderColor: theme.palette.mode === "light"
                    ? "rgba(0,0,0,0.15)"
                    : "rgba(255,255,255,0.2)",
                  color: theme.palette.text.primary,
                  bgcolor: theme.palette.mode === "light"
                    ? "rgba(0,0,0,0.05)"
                    : "rgba(255,255,255,0.05)",
                  "&:hover": {
                    borderColor: accentBlue,
                    bgcolor: `${accentBlue}10`
                  },
                  justifyContent: "flex-start"
                }}
              >
                {schedule}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Lower Section */}
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
            Please provide pickup location and at least one destination.
          </Alert>
        )}

        {/* Trip Type Section */}
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
                  value={rideType}
                  onChange={(e) => setRideType(e.target.value)}
                  renderValue={(value) => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonRoundedIcon sx={{ fontSize: 18, color: accentBlue }} />
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
                  value={tripDirection}
                  onChange={(e) => setTripDirection(e.target.value)}
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
        </Stack>

        {/* Passenger Selection */}
        <Card
          elevation={0}
          sx={{
            mb: 2.5,
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
                      ? lightBlue
                      : theme.palette.mode === "light"
                        ? "rgba(0,0,0,0.05)"
                        : "rgba(255,255,255,0.05)",
                    color: passengers === pax
                      ? accentBlue
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
                        ? lightBlue
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
      </Box>

      {/* Fixed Bottom Section */}
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
    </Box>
  );
}

export default function RiderScreen39EnterDestinationMultipleStopsCanvas_v2() {
  return (
    <Box
      sx={{ position: "relative", minHeight: "100vh", bgcolor: (t) => t.palette.background.default }}
    >
      <DarkModeToggle />
      <MobileShell>
        <EnterDestinationMultipleStopsScreen />
      </MobileShell>
    </Box>
  );
}
