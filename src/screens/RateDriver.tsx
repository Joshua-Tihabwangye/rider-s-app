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
  Rating,
  TextField,
  Avatar,
  Snackbar,
  Alert
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";
import LeafletMapView from "../components/maps/LeafletMapView";

function RideRatingFeedbackScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { ride } = useAppData();
  
  // Get driver data from navigation state or use defaults
  const driver = ride.activeTrip?.driver;
  const driverData = location.state?.driverData || {
    name: driver?.name ?? "Driver",
    initials: driver?.avatar ?? driver?.name?.split(" ").map((part: string) => part[0]).join("").slice(0, 2) ?? "DR"
  };
  
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [tipAmount, setTipAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Prevent submission without selecting at least one star
  const canSubmit = rating > 0 && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    
    setIsSubmitting(true);
    
    // API endpoint: /ride/feedback/submit
    // Required fields: ride_id, rating
    // Optional fields: message, tip_amount
    const feedbackData = {
      ride_id: location.state?.rideId || ride.activeTrip?.id || "trip_123",
      rating: rating,
      message: feedback || null,
      tip_amount: tipAmount ? parseFloat(tipAmount.replace(/,/g, "")) : null
    };
    
    try {
      // In production: API call
      // await fetch('/api/ride/feedback/submit', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(feedbackData)
      // });
      
      console.log("Submitting feedback:", feedbackData);
      
      // Show confirmation toast
      setShowSuccessToast(true);
      
      // After submission, redirect to Home screen
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
      {/* Map Background - Faded map showing driver's last known position */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: "62vh", md: "55vh" },
          overflow: "hidden",
          opacity: 0.6
        }}
      >
        <LeafletMapView
          center={{ lat: 0.3476, lng: 32.5825 }}
          zoom={12}
          routePolyline={[
            { lat: 0.336, lng: 32.56 },
            { lat: 0.345, lng: 32.575 },
            { lat: 0.356, lng: 32.59 }
          ]}
        />
        {/* Grid overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: theme.palette.mode === "light" ? 0.08 : 0.15,
            pointerEvents: "none",
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
            zIndex: 2,
            pointerEvents: "none"
          }}
        />

        {/* Driver's last known position marker */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 5,
            pointerEvents: "none"
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
            top: uiTokens.spacing.lg,
            left: uiTokens.spacing.lg,
            bgcolor: "rgba(3,205,140,0.15)",
            color: "#03CD8C",
            width: 40,
            height: 40,
            borderRadius: uiTokens.radius.xl,
            "&:hover": {
              bgcolor: "#93C5FD"
            },
            zIndex: 10
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
      </Box>

      {/* Content Section - White rounded card over faded map */}
      <Box sx={{ px: uiTokens.spacing.xl, pt: uiTokens.spacing.xxl, pb: uiTokens.spacing.lg }}>
      <Card
        elevation={0}
        sx={{
            mb: uiTokens.spacing.lg,
            borderRadius: uiTokens.radius.sm,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}
      >
          <CardContent sx={{ px: uiTokens.spacing.xl, py: uiTokens.spacing.xl }}>
            {/* Driver Section - Profile image centered at top */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: uiTokens.spacing.xl }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "#03CD8C",
                  fontSize: 32,
                  fontWeight: 700,
                  mb: uiTokens.spacing.lg,
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
                sx={{
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  textAlign: "center",
                  mb: uiTokens.spacing.xs,
                  color: (theme) => theme.palette.text.primary
                }}
            >
                How was your ride with <strong>{driverData.name}</strong>?
            </Typography>
          </Box>

            {/* Rating Bar - 5-star horizontal rating system */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: uiTokens.spacing.xl }}>
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
                    color: "#FFC107" // Gold/yellow for selected stars
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

            {/* Feedback Input Field */}
            <Box sx={{ mb: uiTokens.spacing.xl }}>
              <TextField
                multiline
                rows={4}
                fullWidth
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write your message here…"
                  sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: uiTokens.radius.md,
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

            {/* Tip Section */}
            <Box sx={{ mb: uiTokens.spacing.xl }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  mb: uiTokens.spacing.mdPlus,
                  color: (theme) => theme.palette.text.primary
                }}
              >
                Add a tip to the driver
              </Typography>
              <TextField
                fullWidth
              size="small"
                value={tipAmount}
                onChange={(e) => {
                  // Allow only numbers and commas
                  const value = e.target.value.replace(/[^0-9,]/g, "");
                  setTipAmount(value);
                }}
                placeholder="0"
                InputProps={{
                  startAdornment: (
                    <Typography
                      sx={{
                        mr: uiTokens.spacing.sm,
                        color: (theme) => theme.palette.text.secondary,
                        fontWeight: 500
                      }}
                    >
                      UGX
                    </Typography>
                  )
                }}
              sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: uiTokens.radius.md,
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
          <Typography
            variant="caption"
            sx={{
                  mt: uiTokens.spacing.smPlus,
              display: "block",
              fontSize: 11,
              color: (theme) => theme.palette.text.secondary
            }}
          >
                Optional - The tip will be added to the driver's payment
          </Typography>
            </Box>

            {/* Submit Button - Large black button */}
      <Button
        fullWidth
        variant="contained"
        disabled={!canSubmit}
        onClick={handleSubmit}
        sx={{
                borderRadius: uiTokens.radius.md,
                py: uiTokens.spacing.mdPlus,
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

      {/* Success Toast/Snackbar */}
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

export default function RiderScreen35RateDriverAddTipDedicatedCanvas_v2() {
      return (
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (theme) => theme.palette.background.default
        }}
      >

        <RideRatingFeedbackScreen />
        
      </Box>
  );
}
