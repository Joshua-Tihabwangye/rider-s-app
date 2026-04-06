import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
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
  FormControlLabel,
  IconButton,
  TextField,
  InputAdornment
} from "@mui/material";

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ContactPhoneRoundedIcon from "@mui/icons-material/ContactPhoneRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import Avatar from "@mui/material/Avatar";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";

interface Contact {
  id: number;
  name: string;
  relation: string;
  phone: string;
  initials: string;
}

interface TripData {
  pickup?: string;
  destination?: string;
  schedule?: string;
  scheduleTime?: string;
  isScheduled?: boolean;
  rideType?: string;
  tripType?: string;
  passengers?: number;
  scheduledDateTime?: Date | string;
  [key: string]: unknown;
}

interface SwitchRiderModalProps {
  open: boolean;
  onClose: () => void;
  tripData?: TripData;
  onContinue?: (data: TripData & {
    riderType: string;
    selectedContact: Contact | null;
    manualPhone?: string;
  }) => void;
}

// Mock saved contacts - in production, this would come from user's saved contacts
const SAVED_CONTACTS: Contact[] = [
  {
    id: 1,
    name: "John Doe",
    relation: "Friend",
    phone: "+256 772 987654",
    initials: "JD"
  }
];

function SwitchRiderModal({ open, onClose, tripData, onContinue }: SwitchRiderModalProps): React.JSX.Element {
  const navigate = useNavigate();
  const theme = useTheme();
  const [riderType, setRiderType] = useState<string>("personal");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [manualPhone, setManualPhone] = useState<string>("");
  const [passengers, setPassengers] = useState<number>(tripData?.passengers || 1);
  
  // Get trip details from props
  const pickup = tripData?.pickup || "Entebbe International Airport";
  const destination = tripData?.destination || "Kampala City";
  const schedule = tripData?.schedule || "";
  const scheduleTime = tripData?.scheduleTime || "";
  const isScheduled = tripData?.isScheduled || false;
  const rideType = tripData?.rideType || "Personal";
  const tripType = tripData?.tripType || "One Way";
  
  const passengerOptions = [1, 2, 3, 4, 5, 6];
  const rideTypeOptions = ["Personal", "Business", "Delivery"];
  
  // Update passengers when tripData changes
  useEffect(() => {
    if (tripData?.passengers) {
      setPassengers(tripData.passengers);
    }
  }, [tripData?.passengers]);
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const handleContactSelect = (contact: Contact): void => {
    setSelectedContact(contact);
    setRiderType(`contact-${contact.id}`);
  };

  const handleContinue = (): void => {
    // Create a clean, serializable data object
    const cleanContact = selectedContact 
      ? {
          id: selectedContact.id,
          name: selectedContact.name,
          relation: selectedContact.relation,
          phone: selectedContact.phone,
          initials: selectedContact.initials
        }
      : null;
    
    const updatedTripData = {
      ...tripData,
      passengers,
      riderType,
      selectedContact: cleanContact,
      manualPhone
    };
    
    // Ensure scheduledDateTime is a string, not a Date object
    if (updatedTripData.scheduledDateTime instanceof Date) {
      updatedTripData.scheduledDateTime = updatedTripData.scheduledDateTime.toISOString();
    }
    
    if (riderType.startsWith("contact-")) {
      // Selected a saved contact - proceed with contact details
      if (onContinue) {
        onContinue({
          ...updatedTripData,
          riderType: "contact",
          selectedContact: cleanContact
        });
      }
      onClose();
    } else if (riderType === "add-contact") {
      // Navigate to add new contact screen
      navigate("/rides/switch-rider/contact", {
        state: updatedTripData
      });
      onClose();
    } else if (riderType === "manual") {
      // Manual entry - validate phone number and proceed
      if (manualPhone.trim().length >= 10) {
        if (onContinue) {
          onContinue({
            ...updatedTripData,
            riderType: "manual",
            manualPhone: manualPhone.trim()
          });
        }
        onClose();
      }
    } else {
      // Personal - call the onContinue callback with rider type and updated passengers
      if (onContinue) {
        onContinue({
          ...updatedTripData,
          riderType: "personal"
        });
      }
      onClose();
    }
  };
  
  // Validation: riderType must be selected
  // For manual, phone number must be valid (at least 10 characters)
  const canContinue = riderType !== "" && (
    riderType === "personal" || 
    riderType.startsWith("contact-") || 
    (riderType === "manual" && manualPhone.trim().length >= 10) || 
    riderType === "add-contact"
  );
  
  // Theme-aware colors
  const accentGreen = "#03CD8C";
  const contentBg = theme.palette.mode === "light" ? "#FFFFFF" : theme.palette.background.paper;
  
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
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
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
                bgcolor: theme.palette.mode === "light" ? "#1E2A47" : "#1E2A47"
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <IconButton
                  size="small"
                  aria-label="Back"
                  onClick={onClose}
                  sx={{
                    borderRadius: 5,
                    bgcolor: "rgba(255,255,255,0.1)",
                    color: "#FFFFFF",
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
                    color: "#FFFFFF" 
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
                          {schedule} – {scheduleTime}
                        </Typography>
                      </Box>
                    )}

                    {/* Ride Purpose Dropdown */}
                    <FormControl fullWidth size="small">
                      <Select
                        value={rideType}
                        renderValue={(value) => (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <PersonRoundedIcon sx={{ fontSize: 18, color: accentGreen }} />
                            <Typography>{value}</Typography>
                          </Box>
                        )}
                        sx={{
                          borderRadius: 5,
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
                            <DirectionsCarRoundedIcon sx={{ fontSize: 18, color: accentGreen }} />
                            <Typography>{value}</Typography>
                          </Box>
                        )}
                        sx={{
                          borderRadius: 5,
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
                onChange={(e) => {
                  const newValue = e.target.value;
                  setRiderType(newValue);
                  // Clear manual phone when switching away from manual
                  if (newValue !== "manual") {
                    setManualPhone("");
                  }
                  // Clear selected contact when switching away from contact
                  if (!newValue.startsWith("contact-")) {
                    setSelectedContact(null);
                  }
                }}
                sx={{ mb: 2 }}
              >
                {/* Personal Option */}
                <FormControlLabel
                  value="personal"
                  control={
                    <Radio
                      icon={<CircleOutlinedIcon sx={{ color: accentGreen }} />}
                      checkedIcon={<CheckCircleRoundedIcon sx={{ color: accentGreen }} />}
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
                        ? "rgba(3,205,140,0.1)"
                        : "rgba(3,205,140,0.2)"
                      : contentBg,
                    border: riderType === "personal"
                      ? "1px solid #03CD8C"
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

                {/* Saved Contacts */}
                {SAVED_CONTACTS.map((contact) => {
                  const contactValue = `contact-${contact.id}`;
                  const isSelected = riderType === contactValue;
                  return (
                    <FormControlLabel
                      key={contact.id}
                      value={contactValue}
                      control={
                        <Radio
                          icon={<CircleOutlinedIcon sx={{ color: accentGreen }} />}
                          checkedIcon={<CheckCircleRoundedIcon sx={{ color: accentGreen }} />}
                        />
                      }
                      onClick={() => handleContactSelect(contact)}
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: 1, flex: 1 }}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: isSelected ? "#4CAF50" : theme.palette.mode === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
                              color: isSelected ? "#FFFFFF" : theme.palette.text.primary,
                              fontSize: 14,
                              fontWeight: 600
                            }}
                          >
                            {contact.initials}
                          </Avatar>
                          <Typography sx={{ color: theme.palette.text.primary, flex: 1 }}>
                            {contact.name}
                          </Typography>
                        </Box>
                      }
                      sx={{
                        mb: 1.5,
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: isSelected
                          ? theme.palette.mode === "light"
                            ? "rgba(3,205,140,0.1)"
                            : "rgba(3,205,140,0.2)"
                          : contentBg,
                        border: isSelected
                          ? "1px solid #03CD8C"
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
                  );
                })}

                {/* Add New Contact Option */}
                <FormControlLabel
                  value="add-contact"
                  control={
                    <Radio
                      icon={<CircleOutlinedIcon sx={{ color: accentGreen }} />}
                      checkedIcon={<CheckCircleRoundedIcon sx={{ color: accentGreen }} />}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, ml: 1, flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <ContactPhoneRoundedIcon sx={{ fontSize: 24, color: theme.palette.text.primary }} />
                        <Typography sx={{ color: theme.palette.text.primary }}>
                          Add New Contact
                        </Typography>
                      </Box>
                      <ArrowForwardIosRoundedIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                    </Box>
                  }
                  sx={{
                    mb: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: riderType === "add-contact"
                      ? theme.palette.mode === "light"
                        ? "rgba(3,205,140,0.1)"
                        : "rgba(3,205,140,0.2)"
                      : contentBg,
                    border: riderType === "add-contact"
                      ? "1px solid #03CD8C"
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
                      icon={<CircleOutlinedIcon sx={{ color: accentGreen }} />}
                      checkedIcon={<CheckCircleRoundedIcon sx={{ color: accentGreen }} />}
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
                        ? "rgba(3,205,140,0.1)"
                        : "rgba(3,205,140,0.2)"
                      : contentBg,
                    border: riderType === "manual"
                      ? "1px solid #03CD8C"
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

              {/* Manual Phone Input Field - Shows when Manual is selected */}
              {riderType === "manual" && (
                <Box sx={{ mb: 2, mt: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="eg. (251) 751 25645893"
                    value={manualPhone}
                    onChange={(e) => {
                      // Allow only numbers, spaces, parentheses, and + sign
                      const value = e.target.value.replace(/[^\d\s()+-]/g, '');
                      setManualPhone(value);
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIphoneRoundedIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 5,
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
                          borderColor: accentGreen
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: accentGreen
                        }
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: theme.palette.text.secondary,
                        opacity: 0.6
                      }
                    }}
                  />
                </Box>
              )}

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

export default SwitchRiderModal;

