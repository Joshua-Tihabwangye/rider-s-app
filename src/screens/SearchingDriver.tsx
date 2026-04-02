import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";

function SearchingForDriverScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [dots, setDots] = useState("....");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const [driverFound, setDriverFound] = useState(false);

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 4) return ".";
        return prev + ".";
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Simulate API polling for driver assignment
  useEffect(() => {
    const searchInterval = setInterval(() => {
      setSearchTime((prev) => prev + 1);
      
      // Simulate driver found after 5-10 seconds (for demo purposes)
      if (searchTime >= 5 && Math.random() > 0.7 && !driverFound) {
        setDriverFound(true);
        setTimeout(() => {
          navigate("/rides/driver-on-way");
        }, 1000);
      }
    }, 1000);

    return () => clearInterval(searchInterval);
  }, [searchTime, driverFound, navigate]);

  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const handleCancelConfirm = () => {
    setShowCancelDialog(false);
    navigate("/rides/options");
  };

  const handleCancelClose = () => {
    setShowCancelDialog(false);
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (theme) => theme.palette.background.default }}>
      {/* Map Section - Full width at top */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "40vh",
          background: (theme) =>
            theme.palette.mode === "light"
              ? "linear-gradient(135deg, #E0F2FE 0%, rgba(3,205,140,0.15) 50%, #93C5FD 100%)"
              : "linear-gradient(135deg, rgba(15,118,205,0.3), #020617 60%, #020617 100%)",
          overflow: "hidden"
        }}
      >
        {/* Grid overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.3) 1px, transparent 1px)",
            backgroundSize: "30px 30px"
          }}
        />

        {/* Lake Victoria label */}
        <Typography
          sx={{
            position: "absolute",
            top: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 12,
            fontWeight: 600,
            color: "#03CD8C",
            textShadow: "0 1px 2px rgba(255,255,255,0.8)"
          }}
        >
          Lake Victoria
        </Typography>

        {/* KITORO label */}
        <Typography
          sx={{
            position: "absolute",
            top: "8%",
            left: "10%",
            fontSize: 11,
            fontWeight: 500,
            color: "#03CD8C"
          }}
        >
          KITORO
        </Typography>

        {/* Uganda Hotel Conference label */}
        <Typography
          sx={{
            position: "absolute",
            top: "12%",
            right: "8%",
            fontSize: 10,
            fontWeight: 500,
            color: "#03CD8C",
            maxWidth: "30%",
            textAlign: "right"
          }}
        >
          Ugan Hotel Con
        </Typography>

        {/* Back button on map */}
        <IconButton
          size="small"
          aria-label="Back"
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            bgcolor: "#03CD8C",
            color: "#FFFFFF",
            width: 40,
            height: 40,
            "&:hover": {
              bgcolor: "#1976D2"
            }
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>

        {/* Bus stop icon (blue circle with bus) */}
        <Box
          sx={{
            position: "absolute",
            left: "25%",
            bottom: "35%",
            width: 36,
            height: 36,
            borderRadius: "50%",
            bgcolor: "#03CD8C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
          }}
        >
          <DirectionsBusRoundedIcon sx={{ fontSize: 20, color: "#FFFFFF" }} />
        </Box>

        {/* Hotel icon (pink circle with bed) */}
        <Box
          sx={{
            position: "absolute",
            right: "20%",
            top: "25%",
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: "#EC4899",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
          }}
        >
          <HotelRoundedIcon sx={{ fontSize: 22, color: "#FFFFFF" }} />
        </Box>

        {/* Pickup location marker */}
        <Box
          sx={{
            position: "absolute",
            left: "20%",
            bottom: "20%",
            width: 16,
            height: 16,
            borderRadius: "50%",
            bgcolor: "#22c55e",
            border: "3px solid white",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
          }}
        />
      </Box>

      {/* Content below map */}
      <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>
        {/* Profile placeholder + text placeholders */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
          {/* Large circular placeholder */}
          <Avatar
            sx={{
              width: 70,
              height: 70,
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#E5E7EB" : "rgba(51,65,85,0.5)"
            }}
          >
            <PersonRoundedIcon sx={{ fontSize: 36, color: (theme) => theme.palette.text.secondary }} />
          </Avatar>
          
          {/* Two horizontal rectangular placeholders (different lengths) */}
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                height: 18,
                width: "70%",
                borderRadius: 1,
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#E5E7EB" : "rgba(51,65,85,0.5)",
                mb: 1.2
              }}
            />
            <Box
              sx={{
                height: 14,
                width: "50%",
                borderRadius: 1,
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#E5E7EB" : "rgba(51,65,85,0.5)"
              }}
            />
          </Box>
        </Box>

        {/* Dark blue search box */}
        <Card
          elevation={0}
          sx={{
            mb: 2.5,
            borderRadius: 2,
            bgcolor: "#1E3A5F", // Dark navy
            overflow: "hidden"
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {/* Two filter/search areas at top (separated by white line) */}
            <Box
              sx={{
                display: "flex",
                borderBottom: "1px solid rgba(255,255,255,0.2)",
                px: 2,
                py: 1.5
              }}
            >
              {/* Left filter placeholder */}
              <Box sx={{ flex: 1, pr: 1 }}>
                <Box
                  sx={{
                    height: 14,
                    width: "80%",
                    borderRadius: 1,
                    bgcolor: "rgba(255,255,255,0.2)",
                    mb: 0.8
                  }}
                />
                <Box
                  sx={{
                    height: 12,
                    width: "60%",
                    borderRadius: 1,
                    bgcolor: "rgba(255,255,255,0.15)"
                  }}
                />
              </Box>
              
              {/* White vertical divider */}
              <Box
                sx={{
                  width: 1,
                  bgcolor: "rgba(255,255,255,0.3)",
                  mx: 1
                }}
              />
              
              {/* Right filter placeholder */}
              <Box sx={{ flex: 1, pl: 1 }}>
                <Box
                  sx={{
                    height: 14,
                    width: "80%",
                    borderRadius: 1,
                    bgcolor: "rgba(255,255,255,0.2)",
                    mb: 0.8
                  }}
                />
                <Box
                  sx={{
                    height: 12,
                    width: "60%",
                    borderRadius: 1,
                    bgcolor: "rgba(255,255,255,0.15)"
                  }}
                />
              </Box>
            </Box>

            {/* Searching text with refresh icon */}
            <Box
              sx={{
                px: 2,
                py: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: "#FFFFFF",
                  fontSize: 13
                }}
              >
                Searching{dots}
              </Typography>
              <RefreshRoundedIcon
                sx={{
                  fontSize: 20,
                  color: "#FFFFFF",
                  animation: "spin 2s linear infinite",
                  "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" }
                  }
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* White content container */}
        <Card
          elevation={0}
          sx={{
            mb: 2,
            borderRadius: 2,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
            border: (theme) =>
              theme.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)"
          }}
        >
          <CardContent sx={{ px: 2, py: 2 }}>
            {/* Large rectangular placeholder at top */}
            <Box
              sx={{
                height: 120,
                width: "100%",
                borderRadius: 2,
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#E5E7EB" : "rgba(51,65,85,0.5)",
                mb: 2
              }}
            />

            {/* Two horizontal rectangular placeholders */}
            <Box sx={{ mb: 1.5 }}>
              <Box
                sx={{
                  height: 16,
                  width: "85%",
                  borderRadius: 1,
                  bgcolor: (theme) =>
                    theme.palette.mode === "light" ? "#E5E7EB" : "rgba(51,65,85,0.5)",
                  mb: 1
                }}
              />
              <Box
                sx={{
                  height: 16,
                  width: "75%",
                  borderRadius: 1,
                  bgcolor: (theme) =>
                    theme.palette.mode === "light" ? "#E5E7EB" : "rgba(51,65,85,0.5)"
                }}
              />
            </Box>

            {/* Shorter rounded placeholder (tag/chip) */}
            <Box
              sx={{
                height: 24,
                width: "40%",
                borderRadius: 999,
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#E5E7EB" : "rgba(51,65,85,0.5)"
              }}
            />
          </CardContent>
        </Card>

        {/* Cancel button */}
        <Button
          fullWidth
          variant="outlined"
          onClick={handleCancelClick}
          sx={{
            borderRadius: 999,
            py: 1.2,
            fontSize: 14,
            fontWeight: 500,
            textTransform: "none",
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
            border: (theme) =>
              theme.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            color: (theme) => theme.palette.text.primary,
            "&:hover": {
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.8)"
            }
          }}
        >
          Cancel
        </Button>
      </Box>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={showCancelDialog}
        onClose={handleCancelClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
          Cancel ride request?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: (theme) => theme.palette.text.secondary }}>
            Are you sure you want to cancel this ride request? You can request a new ride at any time.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button
            onClick={handleCancelClose}
            sx={{
              textTransform: "none",
              color: (theme) => theme.palette.text.secondary
            }}
          >
            Keep searching
          </Button>
          <Button
            onClick={handleCancelConfirm}
            variant="contained"
            sx={{
              textTransform: "none",
              bgcolor: "#EF4444",
              "&:hover": {
                bgcolor: "#DC2626"
              }
            }}
          >
            Cancel request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function RiderScreen22SearchingForDriverCanvas_v2() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (theme) => theme.palette.background.default
      }}
    >

        <SearchingForDriverScreen />
      
    </Box>
  );
}
