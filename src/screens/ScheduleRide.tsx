import React, { useMemo, useState } from "react";
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
  Paper,
  TextField
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";

const toInputDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function ScheduleRideScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  const initialState = location.state || {};
  const [isOpen, setIsOpen] = useState(true);
  const [rideLater, setRideLater] = useState(true);
  
  // Get current date/time or default
  const now = new Date();
  // Round minutes to nearest 5 and ensure future time
  const currentMinutes = now.getMinutes();
  const roundedMinutes = Math.ceil(currentMinutes / 5) * 5;
  const futureMinutes = roundedMinutes >= 60 ? 0 : roundedMinutes;
  const futureHour = roundedMinutes >= 60 ? (now.getHours() + 1) % 24 : now.getHours();
  const [selectedDate, setSelectedDate] = useState<string>(toInputDate(now));
  const [selectedTime, setSelectedTime] = useState<string>(
    `${String(futureHour).padStart(2, "0")}:${String(futureMinutes).padStart(2, "0")}`,
  );
  const minDate = useMemo(() => toInputDate(now), [now]);
  
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
    if (!selectedDate || !selectedTime) {
      alert("Please select a date.");
      return;
    }
    
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
    
    if (selectedDateTime <= new Date()) {
      alert("Please select a future date and time.");
      return;
    }
    
    // Format time for display
    const timeString = selectedDateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    
    // Format date with day name: "Mon, 30 Sep 2024"
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayName = dayNames[selectedDateTime.getDay()];
    const dateString = `${dayName}, ${selectedDateTime.getDate()} ${monthNames[selectedDateTime.getMonth()]} ${selectedDateTime.getFullYear()}`;
    
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
  
  const canDone = !rideLater || Boolean(selectedDate && selectedTime);
  
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
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
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
                  borderRadius: 5,
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
              <Box sx={{ display: "grid", gap: 2.25, mb: 3 }}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: theme.palette.text.primary
                    }}
                  >
                    Date
                  </Typography>
                  <TextField
                    fullWidth
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    inputProps={{ min: minDate }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2
                      }
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: theme.palette.text.primary
                    }}
                  >
                    Time
                  </Typography>
                  <TextField
                    fullWidth
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    inputProps={{ step: 300 }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2
                      }
                    }}
                  />
                </Box>
              </Box>
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

        <ScheduleRideScreen />
      
    </Box>
  );
}
