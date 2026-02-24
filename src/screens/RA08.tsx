import React, { useState, useRef } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  IconButton,
  Typography,
  Button,
  Checkbox,
  Modal,
  Backdrop,
  Fade,
  Paper
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import MobileShell from "../components/MobileShell";

// Generate date options
const generateDateOptions = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
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

function ScheduleRideScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const dateScrollRef = useRef(null);
  const timeScrollRef = useRef(null);
  
  const initialState = location.state || {};
  const [isOpen, setIsOpen] = useState(true);
  const [rideLater, setRideLater] = useState(true);
  
  // Get current date/time or default
  const now = new Date();
  const dateOptionsArray = generateDateOptions();
  const defaultDate = dateOptionsArray[0] || {
    day: now.getDate(),
    month: now.toLocaleString('default', { month: 'short' }),
    monthNum: now.getMonth() + 1,
    year: now.getFullYear(),
    fullDate: now
  };
  
  // Round minutes to nearest 5 and ensure future time
  const currentMinutes = now.getMinutes();
  const roundedMinutes = Math.ceil(currentMinutes / 5) * 5;
  const futureMinutes = roundedMinutes >= 60 ? 0 : roundedMinutes;
  const futureHour = roundedMinutes >= 60 ? (now.getHours() + 1) % 24 : now.getHours();
  
  const defaultTime = {
    hour: futureHour % 12 || 12,
    minute: futureMinutes,
    period: futureHour >= 12 ? 'PM' : 'AM'
  };
  
  const [selectedDate, setSelectedDate] = useState<{
    day: number;
    month: string;
    monthNum: number;
    year: number;
    fullDate: Date;
  }>(defaultDate);
  const [selectedTime, setSelectedTime] = useState({
    hour: String(defaultTime.hour).padStart(2, '0'),
    minute: String(defaultTime.minute).padStart(2, '0'),
    period: defaultTime.period
  });
  
  const dateOptions = generateDateOptions();
  
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      navigate(-1);
    }, 300);
  };
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
  
  const handleDone = () => {
    if (!rideLater) {
      // Return to "Now"
      navigate("/rides/enter/details", {
        state: {
          ...initialState,
          schedule: "Now"
        }
      });
      return;
    }
    
    // Validate future date/time
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }
    
    const selectedDateTime = new Date(
      selectedDate.fullDate.getFullYear(),
      selectedDate.fullDate.getMonth(),
      selectedDate.fullDate.getDate(),
      selectedTime.period === 'PM' && parseInt(selectedTime.hour) !== 12 
        ? parseInt(selectedTime.hour) + 12 
        : selectedTime.period === 'AM' && parseInt(selectedTime.hour) === 12
        ? 0
        : parseInt(selectedTime.hour),
      parseInt(selectedTime.minute)
    );
    
    if (selectedDateTime <= new Date()) {
      alert("Please select a future date and time.");
      return;
    }
    
    // Format time for display
    const timeString = `${selectedTime.hour}:${selectedTime.minute} ${selectedTime.period}`;
    
    // Format date with day name: "Mon, 30 Sep 2024"
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = dayNames[selectedDate.fullDate.getDay()];
    const dateString = `${dayName}, ${selectedDate.day} ${selectedDate.month} ${selectedDate.year}`;
    
    navigate("/rides/enter/details", {
      state: {
        ...initialState,
        schedule: dateString, // Store formatted date
        scheduleTime: timeString, // Store time separately
        scheduledDateTime: selectedDateTime,
        scheduledDate: dateString,
        scheduledTime: timeString,
        isScheduled: true
      }
    });
  };
  
  const canDone = rideLater && selectedDate && selectedTime;
  
  // Theme-aware colors
  const accentGreen = "#03CD8C";
  const contentBg = theme.palette.mode === "light" ? "#FFFFFF" : theme.palette.background.paper;
  
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
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
      <Fade in={isOpen}>
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
            {/* Header Section */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Checkbox
                  checked={rideLater}
                  onChange={(e) => setRideLater(e.target.checked)}
                  icon={<CircleOutlinedIcon sx={{ color: accentGreen }} />}
                  checkedIcon={<CheckCircleRoundedIcon sx={{ color: accentGreen }} />}
                  sx={{ p: 0 }}
                />
                <Typography
                  variant="h6"
                  sx={{ 
                    fontWeight: 600, 
                    letterSpacing: "-0.01em",
                    color: theme.palette.text.primary
                  }}
                >
                  Ride Later
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={handleClose}
                sx={{
                  borderRadius: 999,
                  bgcolor: theme.palette.mode === "light"
                    ? "rgba(0,0,0,0.05)"
                    : "rgba(255,255,255,0.1)",
                  color: theme.palette.text.primary
                }}
              >
                <Typography sx={{ fontSize: 20 }}>×</Typography>
              </IconButton>
            </Box>

            {rideLater && (
              <>
                {/* Date Selector - Scrollable Carousel */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ 
                      fontWeight: 600, 
                      mb: 1.5,
                      color: theme.palette.text.primary
                    }}
                  >
                    Date
                  </Typography>
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
                      const isSelected = 
                        selectedDate.day === date.day &&
                        selectedDate.month === date.month &&
                        selectedDate.year === date.year;
                      
                      return (
                        <Box
                          key={index}
                          onClick={() => setSelectedDate(date)}
                          sx={{
                            minWidth: 80,
                            textAlign: "center",
                            p: 1.5,
                            borderRadius: 2,
                            cursor: "pointer",
                            bgcolor: isSelected
                              ? accentGreen
                              : theme.palette.mode === "light"
                                ? "rgba(0,0,0,0.05)"
                                : "rgba(255,255,255,0.05)",
                            border: isSelected
                              ? "none"
                              : `1px solid ${theme.palette.mode === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}`,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              bgcolor: isSelected
                                ? accentGreen
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

                {/* Time Selector - Scrollable Carousel */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ 
                      fontWeight: 600, 
                      mb: 1.5,
                      color: theme.palette.text.primary
                    }}
                  >
                    Time
                  </Typography>
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
                          bgcolor: accentGreen,
                          borderRadius: 2
                        }
                      }}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => {
                        const hourStr = String(hour).padStart(2, '0');
                        const isSelected = selectedTime.hour === hourStr;
                        return (
                          <Box
                            key={hour}
                            onClick={() => setSelectedTime({ ...selectedTime, hour: hourStr })}
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              textAlign: "center",
                              cursor: "pointer",
                              bgcolor: isSelected
                                ? accentGreen
                                : "transparent",
                              color: isSelected
                                ? "#FFFFFF"
                                : theme.palette.text.primary,
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: isSelected
                                  ? accentGreen
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
                          bgcolor: accentGreen,
                          borderRadius: 2
                        }
                      }}
                    >
                      {Array.from({ length: 60 }, (_, i) => i).filter((_, i) => i % 5 === 0).map((minute) => {
                        const minuteStr = String(minute).padStart(2, '0');
                        const isSelected = selectedTime.minute === minuteStr;
                        return (
                          <Box
                            key={minute}
                            onClick={() => setSelectedTime({ ...selectedTime, minute: minuteStr })}
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              textAlign: "center",
                              cursor: "pointer",
                              bgcolor: isSelected
                                ? accentGreen
                                : "transparent",
                              color: isSelected
                                ? "#FFFFFF"
                                : theme.palette.text.primary,
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: isSelected
                                  ? accentGreen
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
                        gap: 1
                      }}
                    >
                      {['AM', 'PM'].map((period) => {
                        const isSelected = selectedTime.period === period;
                        return (
                          <Box
                            key={period}
                            onClick={() => setSelectedTime({ ...selectedTime, period })}
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              textAlign: "center",
                              cursor: "pointer",
                              bgcolor: isSelected
                                ? accentGreen
                                : "transparent",
                              color: isSelected
                                ? "#FFFFFF"
                                : theme.palette.text.primary,
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: isSelected
                                  ? accentGreen
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
              </>
            )}

            {/* Done Button */}
            <Button
              fullWidth
              variant="contained"
              onClick={handleDone}
              disabled={!canDone}
              sx={{
                borderRadius: 2,
                py: 1.5,
                fontSize: 16,
                fontWeight: 600,
                textTransform: "none",
                bgcolor: canDone ? "#000000" : "rgba(0,0,0,0.2)",
                color: "#FFFFFF",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: canDone ? "#333333" : "rgba(0,0,0,0.3)",
                  boxShadow: "none"
                },
                "&.Mui-disabled": {
                  bgcolor: "rgba(0,0,0,0.2)",
                  color: "#FFFFFF",
                  opacity: 1
                }
              }}
            >
              Done
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
}

export default function RiderScreen8ScheduleRideCanvas_v2() {
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
        <ScheduleRideScreen />
      </MobileShell>
    </Box>
  );
}
