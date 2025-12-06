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
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Modal,
  Backdrop,
  Fade,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ContactPhoneRoundedIcon from "@mui/icons-material/ContactPhoneRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import MobileShell from "../components/MobileShell";

function SwitchRiderChooserScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  const initialState = location.state || {};
  const [isOpen, setIsOpen] = useState(true);
  const [riderType, setRiderType] = useState("personal");
  
  // Get trip details from state
  const pickup = initialState.pickup || "Entebbe International Airport";
  const destination = initialState.destination || "Kampala City";
  const schedule = initialState.schedule || "";
  const scheduleTime = initialState.scheduleTime || "";
  const isScheduled = initialState.isScheduled || false;
  const rideType = initialState.rideType || "Personal";
  const tripType = initialState.tripType || "One Way";
  const passengers = initialState.passengers || 1;
  
  const passengerOptions = [1, 2, 3, 4, 5, 6];
  const rideTypeOptions = ["Personal", "Business", "Delivery"];
  
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      navigate(-1);
    }, 300);
  };
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
  
  const handleContinue = () => {
    if (riderType === "contact") {
      navigate("/rides/switch-rider/contact", {
        state: {
          ...initialState,
          riderType
        }
      });
    } else if (riderType === "manual") {
      navigate("/rides/switch-rider/manual", {
        state: {
          ...initialState,
          riderType
        }
      });
    } else {
      // Personal - proceed to next step
      navigate("/rides/options", {
        state: {
          ...initialState,
          riderType: "personal"
        }
      });
    }
  };
  
  const canContinue = riderType !== "";
  
  // Theme-aware colors
  const accentBlue = "#007BFF";
  const contentBg = theme.palette.mode === "light" ? "#FFFFFF" : theme.palette.background.paper;
  const headerBg = theme.palette.mode === "light" ? "#1E2A47" : "#1E2A47";
  const headerText = theme.palette.mode === "light" ? "#FFFFFF" : "#FFFFFF";
  
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
            bgcolor: theme.palette.mode === "light" ? "#F3F4F6" : "#1E2A47",
            maxHeight: '95vh',
            overflow: 'auto',
            outline: 'none'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Box>
            {/* Header Section */}
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
                  onClick={handleClose}
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

              {/* Trip Summary Card */}
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
                    {/* Pickup */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <PlaceRoundedIcon sx={{ fontSize: 20, color: "#4CAF50" }} />
                      <Typography
                        variant="body2"
                        sx={{ 
                          color: theme.palette.text.primary,
                          flex: 1
                        }}
                      >
                        {pickup}
                      </Typography>
                    </Box>

                    {/* Drop-off */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <PlaceRoundedIcon sx={{ fontSize: 20, color: "#FF9800" }} />
                      <Typography
                        variant="body2"
                        sx={{ 
                          color: theme.palette.text.primary,
                          flex: 1
                        }}
                      >
                        {destination}
                      </Typography>
                    </Box>

                    {/* Date & Time */}
                    {isScheduled && schedule && scheduleTime && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <CalendarTodayRoundedIcon sx={{ fontSize: 20, color: "#4CAF50" }} />
                        <Typography
                          variant="body2"
                          sx={{ 
                            color: "#4CAF50",
                            flex: 1
                          }}
                        >
                          {schedule} | {scheduleTime}
                        </Typography>
                      </Box>
                    )}

                    {/* Ride Purpose Dropdown */}
                    <FormControl fullWidth size="small">
                      <Select
                        value={rideType}
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
                          }
                        }}
                      >
                        {rideTypeOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <PersonRoundedIcon sx={{ fontSize: 18 }} />
                              {option}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Trip Type Dropdown */}
                    <FormControl fullWidth size="small">
                      <Select
                        value={tripType}
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

                    {/* Passengers Section */}
                    <Box>
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
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                              fontSize: 14,
                              fontWeight: 600,
                              bgcolor: passengers === pax
                                ? accentBlue
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
                                  ? accentBlue
                                  : theme.palette.mode === "light"
                                    ? "rgba(0,0,0,0.1)"
                                    : "rgba(255,255,255,0.1)"
                              }
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>

            {/* Switch Rider Modal Section */}
            <Box
              sx={{
                px: 2.5,
                pt: 2,
                pb: 3,
                bgcolor: contentBg
              }}
            >
              <Typography
                variant="h6"
                sx={{ 
                  fontWeight: 600, 
                  mb: 2,
                  color: theme.palette.text.primary
                }}
              >
                Switch Rider
              </Typography>

              {/* Radio Button Options */}
              <RadioGroup
                value={riderType}
                onChange={(e) => setRiderType(e.target.value)}
                sx={{ mb: 2 }}
              >
                {/* Personal Option */}
                <FormControlLabel
                  value="personal"
                  control={
                    <Radio
                      icon={<CircleOutlinedIcon sx={{ color: accentBlue }} />}
                      checkedIcon={<CheckCircleRoundedIcon sx={{ color: accentBlue }} />}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: 1 }}>
                      <PersonRoundedIcon sx={{ fontSize: 24, color: theme.palette.text.primary }} />
                      <Typography sx={{ color: theme.palette.text.primary }}>
                        Personal
                      </Typography>
                    </Box>
                  }
                  sx={{
                    mb: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: riderType === "personal"
                      ? theme.palette.mode === "light"
                        ? `${accentBlue}10`
                        : `${accentBlue}20`
                      : "transparent",
                    border: riderType === "personal"
                      ? `1px solid ${accentBlue}`
                      : theme.palette.mode === "light"
                        ? "1px solid rgba(0,0,0,0.1)"
                        : "1px solid rgba(255,255,255,0.1)",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: theme.palette.mode === "light"
                        ? "rgba(0,0,0,0.05)"
                        : "rgba(255,255,255,0.05)"
                    }
                  }}
                />

                {/* Add Contact Option */}
                <FormControlLabel
                  value="contact"
                  control={
                    <Radio
                      icon={<CircleOutlinedIcon sx={{ color: accentBlue }} />}
                      checkedIcon={<CheckCircleRoundedIcon sx={{ color: accentBlue }} />}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: 1 }}>
                      <ContactPhoneRoundedIcon sx={{ fontSize: 24, color: theme.palette.text.primary }} />
                      <Typography sx={{ color: theme.palette.text.primary }}>
                        Add Contact
                      </Typography>
                    </Box>
                  }
                  sx={{
                    mb: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: riderType === "contact"
                      ? theme.palette.mode === "light"
                        ? `${accentBlue}10`
                        : `${accentBlue}20`
                      : "transparent",
                    border: riderType === "contact"
                      ? `1px solid ${accentBlue}`
                      : theme.palette.mode === "light"
                        ? "1px solid rgba(0,0,0,0.1)"
                        : "1px solid rgba(255,255,255,0.1)",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: theme.palette.mode === "light"
                        ? "rgba(0,0,0,0.05)"
                        : "rgba(255,255,255,0.05)"
                    }
                  }}
                />

                {/* Manual Option */}
                <FormControlLabel
                  value="manual"
                  control={
                    <Radio
                      icon={<CircleOutlinedIcon sx={{ color: accentBlue }} />}
                      checkedIcon={<CheckCircleRoundedIcon sx={{ color: accentBlue }} />}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: 1 }}>
                      <EditRoundedIcon sx={{ fontSize: 24, color: theme.palette.text.primary }} />
                      <Typography sx={{ color: theme.palette.text.primary }}>
                        Manual
                      </Typography>
                    </Box>
                  }
                  sx={{
                    mb: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: riderType === "manual"
                      ? theme.palette.mode === "light"
                        ? `${accentBlue}10`
                        : `${accentBlue}20`
                      : "transparent",
                    border: riderType === "manual"
                      ? `1px solid ${accentBlue}`
                      : theme.palette.mode === "light"
                        ? "1px solid rgba(0,0,0,0.1)"
                        : "1px solid rgba(255,255,255,0.1)",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: theme.palette.mode === "light"
                        ? "rgba(0,0,0,0.05)"
                        : "rgba(255,255,255,0.05)"
                    }
                  }}
                />
              </RadioGroup>

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
        </Paper>
      </Fade>
    </Modal>
  );
}

export default function RiderScreen10SwitchRiderChooserCanvas_v2() {
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
        <SwitchRiderChooserScreen />
      </MobileShell>
    </Box>
  );
}
