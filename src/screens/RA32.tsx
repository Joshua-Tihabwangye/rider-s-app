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
  Rating,
  TextField,
  Avatar,
  Snackbar,
  Alert
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import MobileShell from "../components/MobileShell";

// Tip options as per specification
const TIP_OPTIONS = [
  { label: "UGX 1,000", value: 1000 },
  { label: "Top Tipped", value: 1500, isTopTipped: true },
  { label: "UGX 2,000", value: 2000 }
];

function RideRatingTipScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  // Get driver data from navigation state or use defaults
  const driverData = location.state?.driverData || {
    name: "Tim Smith",
    initials: "TS"
  };
  
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Prevent submission if no star rating is selected
  const canSubmit = rating > 0 && !isSubmitting;

  // Calculate effective tip amount
  const effectiveTip = customTip 
    ? (parseInt(customTip.replace(/[^0-9]/g, "")) || 0)
    : (selectedTip || 0);

  const handleTipSelect = (tipValue: number): void => {
    setSelectedTip(tipValue);
    setCustomTip(""); // Clear custom tip when selecting preset
    setShowCustomInput(false); // Hide custom input
  };

  const handleCustomTipClick = () => {
    setSelectedTip(null);
    setShowCustomInput(true); // Show custom input field
    if (!customTip) {
      setCustomTip(""); // Initialize empty
    }
  };

  const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // Only allow positive integers
    const value = e.target.value.replace(/[^0-9]/g, "");
    setCustomTip(value);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    
    setIsSubmitting(true);
    
    // API endpoint: /ride/feedback/submit
    // Required: ride_id, rating
    // Optional: feedback_message, tip_amount
    const feedbackData = {
      ride_id: location.state?.rideId || "trip_123",
      rating: rating,
      feedback_message: feedback || null,
      tip_amount: effectiveTip > 0 ? effectiveTip : null
    };
    
    try {
      // In production: API call
      // await fetch('/api/ride/feedback/submit', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(feedbackData)
      // });
      
      console.log("Submitting feedback:", feedbackData);
      
      // Display thank-you confirmation toast
      setShowSuccessToast(true);
      
      // Redirect to Home screen after brief delay
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setIsSubmitting(false);
    }
  };

  const handleCloseToast = () => {
    setShowSuccessToast(false);
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (theme) => theme.palette.background.default }}>
      {/* Background - Faded map view showing last known position */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "45vh",
          background: (theme) =>
            theme.palette.mode === "light"
              ? "#F5F5F5"
              : "linear-gradient(135deg, rgba(15,23,42,0.3), #020617 60%, #020617 100%)",
          overflow: "hidden",
          opacity: 0.6
        }}
      >
        {/* Grid overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: theme.palette.mode === "light" ? 0.08 : 0.15,
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.4) 1px, transparent 1px)",
            backgroundSize: "32px 32px"
        }}
        />

        {/* Faded route line */}
        <Box
          sx={{
            position: "absolute",
            left: "15%",
            bottom: "25%",
            width: "60%",
            height: 3,
            bgcolor: "#1E3A5F",
            borderRadius: 2,
            transform: "rotate(-35deg)",
            transformOrigin: "left center",
            opacity: 0.4,
            zIndex: 2
          }}
        />

        {/* Driver's last known position marker */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 5
          }}
        >
          <DirectionsCarFilledRoundedIcon
            sx={{
              fontSize: 32,
              color: "#03CD8C",
              opacity: 0.5,
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))"
            }}
          />
        </Box>

        {/* Back Arrow - Top left */}
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
            position: "absolute",
            top: 16,
            left: 16,
            bgcolor: "rgba(3,205,140,0.15)",
            color: "#03CD8C",
            width: 40,
            height: 40,
            "&:hover": {
              bgcolor: "#93C5FD"
            },
            zIndex: 10
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
      </Box>

      {/* Content Section - Modal overlay with rounded white container */}
      <Box sx={{ px: 2.5, pt: 3, pb: 2 }}>
      <Card
        elevation={0}
        sx={{
            mb: 2,
            borderRadius: 3,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}
      >
          <CardContent sx={{ px: 2.5, py: 2.5 }}>
            {/* Driver Details - Profile image at top center */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "#03CD8C",
                  fontSize: 32,
                  fontWeight: 700,
                  mb: 2,
                  border: "4px solid",
                  borderColor: (theme) =>
                    theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                }}
              >
                {driverData.initials}
              </Avatar>
            <Typography
                variant="h6"
                sx={{fontWeight: 600,
                  letterSpacing: "-0.01em",
                  textAlign: "center",
                  mb: 0.5,
                  color: (theme) => theme.palette.text.primary
                }}
            >
                How was your ride with <strong>{driverData.name}</strong>?
            </Typography>
          </Box>

            {/* Star Rating System - Five-star horizontal layout */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Rating
                value={rating}
                onChange={(e, newValue) => {
                  if (newValue !== null) {
                    setRating(newValue);
                  }
                  }}
                size="large"
                  sx={{
                  "& .MuiRating-iconFilled": {
                    color: "#FFC107" // Yellow/gold for selected stars
                  },
                  "& .MuiRating-iconEmpty": {
                    color: (theme) =>
                      theme.palette.mode === "light" ? "#D1D5DB" : "#4B5563" // Grey for unselected
                  },
                  "& .MuiRating-icon": {
                    fontSize: 40
                    }
                  }}
                />
            </Box>

            {/* Feedback Input Box */}
            <Box sx={{ mb: 3 }}>
            <TextField
                multiline
                rows={3}
              fullWidth
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write your message here…"
              sx={{
                "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  bgcolor: (theme) =>
                      theme.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                  "& fieldset": {
                    borderColor: (theme) =>
                      theme.palette.mode === "light"
                        ? "rgba(209,213,219,0.9)"
                        : "rgba(51,65,85,0.9)"
                  },
                  "&:hover fieldset": {
                      borderColor: "#03CD8C"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#03CD8C"
                  }
                }
              }}
            />
            </Box>

            {/* Tip Selection Section */}
            <Box sx={{ mb: 3 }}>
          <Typography
                variant="body2"
            sx={{
                  fontWeight: 600,
                  mb: 1.5,
                  color: (theme) => theme.palette.text.primary
            }}
          >
                Add a tip to the driver
          </Typography>
              
              {/* Four button options displayed horizontally */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  flexWrap: "wrap",
                  mb: customTip ? 1.5 : 0
                }}
              >
                {TIP_OPTIONS.map((option) => {
                  const isSelected = selectedTip === option.value && !customTip;
                  return (
                    <Button
                      key={option.value}
                      variant={isSelected ? "contained" : "outlined"}
                      onClick={() => handleTipSelect(option.value)}
                      sx={{
                        flex: 1,
                        minWidth: "80px",
                        borderRadius: 2,
                        py: 1,
                        fontSize: 13,
                        fontWeight: 600,
                        textTransform: "none",
                        bgcolor: isSelected
                          ? "#22c55e" // Green when selected
                          : "transparent",
                        color: isSelected
                          ? "#FFFFFF"
                          : (theme) => theme.palette.text.primary,
                        borderColor: isSelected
                          ? "#22c55e"
                          : (theme) =>
                              theme.palette.mode === "light"
                                ? "rgba(209,213,219,0.9)"
                                : "rgba(51,65,85,0.9)",
                        "&:hover": {
                          bgcolor: isSelected
                            ? "#16A34A"
                            : (theme) =>
                                theme.palette.mode === "light"
                                  ? "rgba(0,0,0,0.05)"
                                  : "rgba(255,255,255,0.05)",
                          borderColor: isSelected ? "#16A34A" : "#22c55e"
                        }
                      }}
                    >
                      {option.label}
                    </Button>
                  );
                })}
                
                {/* Custom button */}
                <Button
                  variant={customTip ? "contained" : "outlined"}
                  onClick={handleCustomTipClick}
        sx={{
                    flex: 1,
                    minWidth: "80px",
          borderRadius: 2,
                    py: 1,
                    fontSize: 13,
                    fontWeight: 600,
                    textTransform: "none",
                    bgcolor: customTip
                      ? "#22c55e" // Green when custom is active
                      : "transparent",
                    color: customTip
                      ? "#FFFFFF"
                      : (theme) => theme.palette.text.primary,
                    borderColor: customTip
                      ? "#22c55e"
                      : (theme) =>
                          theme.palette.mode === "light"
                            ? "rgba(209,213,219,0.9)"
                            : "rgba(51,65,85,0.9)",
                    "&:hover": {
                      bgcolor: customTip
                        ? "#16A34A"
                        : (theme) =>
            theme.palette.mode === "light"
                              ? "rgba(0,0,0,0.05)"
                              : "rgba(255,255,255,0.05)",
                      borderColor: customTip ? "#16A34A" : "#22c55e"
                    }
        }}
      >
                  Custom
                </Button>
              </Box>

              {/* Custom tip input field - appears when Custom button is clicked */}
              {showCustomInput && (
                <TextField
                  fullWidth
                  size="small"
                  value={customTip}
                  onChange={handleCustomTipChange}
                  placeholder="Enter amount"
                  InputProps={{
                    startAdornment: (
          <Typography
                        sx={{
                          mr: 1,
                          color: (theme) => theme.palette.text.secondary,
                          fontWeight: 500
                        }}
          >
                        UGX
          </Typography>
                    )
                  }}
            sx={{
                    mt: 1.5,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (theme) =>
                    theme.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": {
                        borderColor: "#22c55e"
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#22c55e"
                }
              }
            }}
          />
              )}
            </Box>

            {/* Submit Button - Prominent black button */}
      <Button
        fullWidth
        variant="contained"
        disabled={!canSubmit}
              onClick={handleSubmit}
        sx={{
                borderRadius: 2,
                py: 1.5,
                fontSize: 16,
          fontWeight: 600,
          textTransform: "none",
                bgcolor: canSubmit ? "#000000" : "rgba(0,0,0,0.3)",
                color: "#FFFFFF",
                boxShadow: "none",
          "&:hover": {
                  bgcolor: canSubmit ? "#333333" : "rgba(0,0,0,0.4)",
                  boxShadow: "none"
                },
                "&.Mui-disabled": {
                  bgcolor: "rgba(0,0,0,0.3)",
                  color: "#FFFFFF",
                  opacity: 1
          }
        }}
      >
              {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
          </CardContent>
        </Card>
      </Box>

      {/* Success Toast - Thank you confirmation */}
      <Snackbar
        open={showSuccessToast}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity="success"
          sx={{
            width: "100%",
            bgcolor: "#22c55e",
            color: "#FFFFFF",
            "& .MuiAlert-icon": {
              color: "#FFFFFF"
            }
          }}
        >
          Thank you for your feedback!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function RiderScreen32RideRatingTipCanvas_v2() {
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
          <RideRatingTipScreen />
        </MobileShell>
      </Box>
  );
}
