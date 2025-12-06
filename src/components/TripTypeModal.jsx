import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Button,
  Modal,
  Backdrop,
  Fade,
  Paper,
  Card,
  CardContent,
  Stack,
  Alert
} from "@mui/material";

import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

// Generate date options
const generateDateOptions = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 60; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
      monthNum: date.getMonth() + 1,
      year: date.getFullYear(),
      fullDate: date
    });
  }
  return dates;
};

function TripTypeModal({ open, onClose, currentTripType, onSelect, departureDate, departureTime, existingReturnDate, existingReturnTime }) {
  const theme = useTheme();
  const dateScrollRef = useRef(null);
  const timeScrollRef = useRef(null);
  
  const [selectedTripType, setSelectedTripType] = useState(currentTripType || "One Way");
  const [returnDate, setReturnDate] = useState(null);
  const [returnTime, setReturnTime] = useState(null);
  const [validationError, setValidationError] = useState("");
  
  const dateOptions = generateDateOptions();
  
  // Update selectedTripType when currentTripType changes (when modal opens)
  useEffect(() => {
    if (open) {
      if (currentTripType) {
        setSelectedTripType(currentTripType);
      }
      // If Round Trip is already selected and we have existing return date/time, restore them
      if (currentTripType === "Round Trip" && existingReturnDate && existingReturnTime) {
        // Parse existing return date string (e.g., "Wed, 26 Sep 2024")
        const dateMatch = existingReturnDate.match(/(\w+),\s*(\d+)\s*(\w+)\s*(\d+)/);
        if (dateMatch) {
          const [, , day, month, year] = dateMatch;
          const foundDate = dateOptions.find(d => 
            d.day === parseInt(day) && 
            d.month === month && 
            d.year === parseInt(year)
          );
          if (foundDate) {
            setReturnDate(foundDate);
          }
        }
        // Parse existing return time string (e.g., "11:35 PM")
        const timeMatch = existingReturnTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (timeMatch) {
          const [, hour, minute, period] = timeMatch;
          setReturnTime({
            hour: String(parseInt(hour)).padStart(2, '0'),
            minute: minute,
            period: period.toUpperCase()
          });
        }
      } else if (currentTripType === "One Way") {
        // Reset return date/time when switching from Round Trip to One Way
        setReturnDate(null);
        setReturnTime(null);
        setValidationError("");
      }
    } else {
      // Reset state when modal closes
      setValidationError("");
    }
  }, [open, currentTripType, existingReturnDate, existingReturnTime, dateOptions]);
  
  // Initialize return date/time when Round Trip is selected
  useEffect(() => {
    if (open && selectedTripType === "Round Trip" && !returnDate && !existingReturnDate) {
      // Set default return date to tomorrow or same day if departure is in future
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultDate = dateOptions.find(d => 
        d.fullDate.getTime() >= tomorrow.getTime()
      ) || dateOptions[1];
      if (defaultDate) {
        setReturnDate(defaultDate);
      }
      
      // Set default return time (11:35 PM as per spec)
      setReturnTime({
        hour: "11",
        minute: "35",
        period: "PM"
      });
    }
  }, [selectedTripType, open, returnDate, existingReturnDate, dateOptions]);
  
  const accentBlue = "#007BFF";
  const contentBg = theme.palette.mode === "light" ? "#FFFFFF" : theme.palette.background.paper;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Validate return date/time is after departure
  const validateReturnDateTime = () => {
    if (selectedTripType !== "Round Trip") {
      return true;
    }

    if (!returnDate || !returnTime) {
      setValidationError("Please select return date and time");
      return false;
    }

    // Parse departure date/time
    let departureDateTime = null;
    if (departureDate && departureTime) {
      const depDate = departureDate instanceof Date ? departureDate : new Date(departureDate);
      // Handle time format: "05:54 PM" or "11:35 PM"
      const timeMatch = departureTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (timeMatch) {
        const [, depHour, depMinute, depPeriod] = timeMatch;
        const depHour24 = depPeriod.toUpperCase() === 'PM' && parseInt(depHour) !== 12 
          ? parseInt(depHour) + 12 
          : depPeriod.toUpperCase() === 'AM' && parseInt(depHour) === 12
          ? 0
          : parseInt(depHour);
        departureDateTime = new Date(
          depDate.getFullYear(),
          depDate.getMonth(),
          depDate.getDate(),
          depHour24,
          parseInt(depMinute)
        );
      } else {
        // If format doesn't match, use current time
        departureDateTime = new Date();
      }
    } else {
      // If no departure date/time, use current time
      departureDateTime = new Date();
    }

    // Parse return date/time
    const returnHour24 = returnTime.period === 'PM' && parseInt(returnTime.hour) !== 12 
      ? parseInt(returnTime.hour) + 12 
      : returnTime.period === 'AM' && parseInt(returnTime.hour) === 12
      ? 0
      : parseInt(returnTime.hour);
    
    const returnDateTime = new Date(
      returnDate.fullDate.getFullYear(),
      returnDate.fullDate.getMonth(),
      returnDate.fullDate.getDate(),
      returnHour24,
      parseInt(returnTime.minute)
    );

    if (returnDateTime <= departureDateTime) {
      setValidationError("Return date and time must be after departure");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleConfirm = () => {
    if (selectedTripType === "Round Trip") {
      if (!validateReturnDateTime()) {
        return;
      }
      
      // Format return date and time
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[returnDate.fullDate.getDay()];
      const returnDateString = `${dayName}, ${returnDate.day} ${returnDate.month} ${returnDate.year}`;
      const returnTimeString = `${returnTime.hour}:${returnTime.minute} ${returnTime.period}`;
      
      if (onSelect) {
        onSelect({
          tripType: selectedTripType,
          returnDate: returnDateString,
          returnTime: returnTimeString,
          returnDateTime: new Date(
            returnDate.fullDate.getFullYear(),
            returnDate.fullDate.getMonth(),
            returnDate.fullDate.getDate(),
            returnTime.period === 'PM' && parseInt(returnTime.hour) !== 12 
              ? parseInt(returnTime.hour) + 12 
              : returnTime.period === 'AM' && parseInt(returnTime.hour) === 12
              ? 0
              : parseInt(returnTime.hour),
            parseInt(returnTime.minute)
          ).toISOString()
        });
      }
    } else {
      if (onSelect) {
        onSelect({
          tripType: selectedTripType,
          returnDate: null,
          returnTime: null,
          returnDateTime: null
        });
      }
    }
    onClose();
  };

  const canConfirm = selectedTripType === "One Way" || 
    (selectedTripType === "Round Trip" && returnDate && returnTime);

  const tripTypeOptions = [
    { value: "One Way", label: "One Way" },
    { value: "Round Trip", label: "Round Trip" }
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 300,
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }
      }}
      onClick={handleBackdropClick}
    >
      <Fade in={open}>
        <Paper
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            bgcolor: contentBg,
            maxHeight: '90vh',
            overflow: 'auto',
            outline: 'none'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
            {/* Header */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: theme.palette.text.primary,
                mb: 3,
                textAlign: "center"
              }}
            >
              Ride Type
            </Typography>

            {/* Trip Type Options */}
            <Stack spacing={2} sx={{ mb: 3 }}>
              {tripTypeOptions.map((option) => {
                const isSelected = selectedTripType === option.value;
                return (
                  <Card
                    key={option.value}
                    elevation={0}
                    onClick={() => {
                      setSelectedTripType(option.value);
                      setValidationError("");
                      // Initialize return date/time immediately when Round Trip is selected
                      if (option.value === "Round Trip" && !returnDate && !existingReturnDate) {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const defaultDate = dateOptions.find(d => 
                          d.fullDate.getTime() >= tomorrow.getTime()
                        ) || dateOptions[1];
                        if (defaultDate) {
                          setReturnDate(defaultDate);
                        }
                        setReturnTime({
                          hour: "11",
                          minute: "35",
                          period: "PM"
                        });
                      } else if (option.value === "One Way") {
                        setReturnDate(null);
                        setReturnTime(null);
                      }
                    }}
                    sx={{
                      borderRadius: 2,
                      bgcolor: contentBg,
                      border: isSelected
                        ? `2px solid ${accentBlue}`
                        : theme.palette.mode === "light"
                        ? "1px solid rgba(0,0,0,0.15)"
                        : "1px solid rgba(255,255,255,0.2)",
                      cursor: "pointer",
                      opacity: isSelected ? 1 : 0.6,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: theme.palette.mode === "light"
                          ? "rgba(0,0,0,0.02)"
                          : "rgba(255,255,255,0.02)",
                        borderColor: accentBlue
                      }
                    }}
                  >
                    <CardContent sx={{ px: 2, py: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <DirectionsCarRoundedIcon
                          sx={{
                            fontSize: 24,
                            color: isSelected ? accentBlue : theme.palette.text.secondary
                          }}
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: isSelected ? 600 : 500,
                            color: isSelected
                              ? theme.palette.text.primary
                              : theme.palette.text.secondary
                          }}
                        >
                          {option.label}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>

            {/* Return Trip Selector - Only shown when Round Trip is selected */}
            {selectedTripType === "Round Trip" && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: theme.palette.text.primary
                  }}
                >
                  Return Trip
                </Typography>

                {/* Validation Error */}
                {validationError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {validationError}
                  </Alert>
                )}

                {/* Date Picker */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarTodayRoundedIcon sx={{ fontSize: 18, color: accentBlue }} />
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary
                        }}
                      >
                        Date
                      </Typography>
                    </Box>
                    {returnDate && (
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: theme.palette.text.secondary
                        }}
                      >
                        {(() => {
                          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                          const dayName = dayNames[returnDate.fullDate.getDay()];
                          return `${dayName}, ${returnDate.day} ${returnDate.month}`;
                        })()}
                      </Typography>
                    )}
                  </Box>
                  <Box
                    ref={dateScrollRef}
                    sx={{
                      display: "flex",
                      gap: 2,
                      overflowX: "auto",
                      pb: 1,
                      "&::-webkit-scrollbar": {
                        display: "none"
                      },
                      scrollbarWidth: "none"
                    }}
                  >
                    {dateOptions.map((date, index) => {
                      const isSelected = returnDate && 
                        returnDate.day === date.day &&
                        returnDate.month === date.month &&
                        returnDate.year === date.year;
                      
                      return (
                        <Box
                          key={index}
                          onClick={() => {
                            setReturnDate(date);
                            setValidationError("");
                          }}
                          sx={{
                            minWidth: 80,
                            textAlign: "center",
                            p: 1.5,
                            borderRadius: 2,
                            cursor: "pointer",
                            bgcolor: isSelected
                              ? accentBlue
                              : theme.palette.mode === "light"
                                ? "rgba(0,0,0,0.05)"
                                : "rgba(255,255,255,0.05)",
                            border: isSelected
                              ? "none"
                              : `1px solid ${theme.palette.mode === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}`,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              bgcolor: isSelected
                                ? accentBlue
                                : theme.palette.mode === "light"
                                  ? "rgba(0,0,0,0.1)"
                                  : "rgba(255,255,255,0.1)"
                            }
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              fontSize: 11,
                              color: isSelected
                                ? "#FFFFFF"
                                : theme.palette.text.secondary,
                              mb: 0.5
                            }}
                          >
                            {date.month}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: isSelected
                                ? "#FFFFFF"
                                : theme.palette.text.primary
                            }}
                          >
                            {date.day}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              fontSize: 11,
                              color: isSelected
                                ? "#FFFFFF"
                                : theme.palette.text.secondary,
                              mt: 0.5
                            }}
                          >
                            {date.year}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                {/* Time Picker */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTimeRoundedIcon sx={{ fontSize: 18, color: accentBlue }} />
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary
                        }}
                      >
                        Time
                      </Typography>
                    </Box>
                    {returnTime && (
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: theme.palette.text.secondary
                        }}
                      >
                        {returnTime.hour}:{returnTime.minute} {returnTime.period}
                      </Typography>
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center"
                    }}
                  >
                    {/* Hour Selector */}
                    <Box
                      ref={timeScrollRef}
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        maxHeight: 200,
                        overflowY: "auto",
                        "&::-webkit-scrollbar": {
                          width: 4
                        },
                        "&::-webkit-scrollbar-thumb": {
                          bgcolor: accentBlue,
                          borderRadius: 2
                        }
                      }}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => {
                        const hourStr = String(hour).padStart(2, '0');
                        const isSelected = returnTime && returnTime.hour === hourStr;
                        return (
                          <Box
                            key={hour}
                            onClick={() => {
                              if (returnTime) {
                                setReturnTime({ ...returnTime, hour: hourStr });
                                setValidationError("");
                              }
                            }}
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              textAlign: "center",
                              cursor: "pointer",
                              bgcolor: isSelected
                                ? accentBlue
                                : "transparent",
                              color: isSelected
                                ? "#FFFFFF"
                                : theme.palette.text.primary,
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: isSelected
                                  ? accentBlue
                                  : theme.palette.mode === "light"
                                    ? "rgba(0,0,0,0.05)"
                                    : "rgba(255,255,255,0.05)"
                              }
                            }}
                          >
                            <Typography sx={{ fontWeight: 600 }}>
                              {hourStr}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>

                    <Typography sx={{ fontSize: 24, color: theme.palette.text.primary }}>:</Typography>

                    {/* Minute Selector */}
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        maxHeight: 200,
                        overflowY: "auto",
                        "&::-webkit-scrollbar": {
                          width: 4
                        },
                        "&::-webkit-scrollbar-thumb": {
                          bgcolor: accentBlue,
                          borderRadius: 2
                        }
                      }}
                    >
                      {Array.from({ length: 60 }, (_, i) => i).filter((_, i) => i % 5 === 0).map((minute) => {
                        const minuteStr = String(minute).padStart(2, '0');
                        const isSelected = returnTime && returnTime.minute === minuteStr;
                        return (
                          <Box
                            key={minute}
                            onClick={() => {
                              if (returnTime) {
                                setReturnTime({ ...returnTime, minute: minuteStr });
                                setValidationError("");
                              }
                            }}
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              textAlign: "center",
                              cursor: "pointer",
                              bgcolor: isSelected
                                ? accentBlue
                                : "transparent",
                              color: isSelected
                                ? "#FFFFFF"
                                : theme.palette.text.primary,
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: isSelected
                                  ? accentBlue
                                  : theme.palette.mode === "light"
                                    ? "rgba(0,0,0,0.05)"
                                    : "rgba(255,255,255,0.05)"
                              }
                            }}
                          >
                            <Typography sx={{ fontWeight: 600 }}>
                              {minuteStr}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>

                    {/* AM/PM Selector */}
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        maxHeight: 200,
                        overflowY: "auto",
                        "&::-webkit-scrollbar": {
                          width: 4
                        },
                        "&::-webkit-scrollbar-thumb": {
                          bgcolor: accentBlue,
                          borderRadius: 2
                        }
                      }}
                    >
                      {['AM', 'PM'].map((period) => {
                        const isSelected = returnTime && returnTime.period === period;
                        return (
                          <Box
                            key={period}
                            onClick={() => {
                              if (returnTime) {
                                setReturnTime({ ...returnTime, period });
                                setValidationError("");
                              }
                            }}
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              textAlign: "center",
                              cursor: "pointer",
                              bgcolor: isSelected
                                ? accentBlue
                                : "transparent",
                              color: isSelected
                                ? "#FFFFFF"
                                : theme.palette.text.primary,
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: isSelected
                                  ? accentBlue
                                  : theme.palette.mode === "light"
                                    ? "rgba(0,0,0,0.05)"
                                    : "rgba(255,255,255,0.05)"
                              }
                            }}
                          >
                            <Typography sx={{ fontWeight: 600 }}>
                              {period}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Confirm/Continue Button */}
            <Button
              fullWidth
              variant="contained"
              onClick={handleConfirm}
              disabled={!canConfirm}
              sx={{
                borderRadius: 2,
                py: 1.5,
                fontSize: 16,
                fontWeight: 600,
                textTransform: "none",
                bgcolor: canConfirm ? "#000000" : "rgba(0,0,0,0.2)",
                color: "#FFFFFF",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: canConfirm ? "#333333" : "rgba(0,0,0,0.3)",
                  boxShadow: "none"
                },
                "&.Mui-disabled": {
                  bgcolor: "rgba(0,0,0,0.2)",
                  color: "#FFFFFF",
                  opacity: 1
                }
              }}
            >
              {selectedTripType === "Round Trip" ? "Confirm" : "Continue"}
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
}

export default TripTypeModal;

