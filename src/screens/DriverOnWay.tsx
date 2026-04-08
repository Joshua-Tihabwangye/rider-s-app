import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Avatar,
  Divider
} from "@mui/material";

import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import MapShell from "../components/maps/MapShell";
import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";

function DriverAssignedOnTheWayScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { ride, actions } = useAppData();
  const activeTrip = ride.activeTrip;
  const driver = activeTrip?.driver;
  const [arrivalTime, setArrivalTime] = useState(activeTrip?.etaMinutes ?? 5); // minutes
  const otp = activeTrip?.otp ?? "—";

  // Simulate countdown timer
  useEffect(() => {
    actions.setRideStatus("driver_on_way");
    const interval = setInterval(() => {
      setArrivalTime((prev) => {
        if (prev > 0) {
          return prev - 0.0167; // Decrease by 1 second (0.0167 minutes)
        }
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [actions.setRideStatus]);

  const handleAccept = () => {
    // Proceed to waiting state / driver arrived screen
    actions.setRideStatus("driver_arrived");
    navigate("/rides/driver-arrived");
  };

  const handleChange = () => {
    // Cancel current driver and restart search
    actions.setRideStatus("searching");
    navigate("/rides/searching");
  };

  const handleCall = () => {
    // Initiate call to driver
    if (activeTrip?.driver?.phone) {
      window.location.href = `tel:${activeTrip.driver.phone}`;
    }
  };

  const handleMessage = () => {
    navigate("/help");
  };

  return (
    <ScreenScaffold>
      <SectionHeader
        title="Driver on the Way"
        subtitle="Your driver is heading to your location"
        leadingAction={
          <IconButton
            size="small"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 5,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        }
        action={
          <Button
            size="small"
            variant="contained"
            onClick={() => navigate("/rides/sos")}
            sx={{
              bgcolor: "var(--evz-danger)",
              color: "#fff",
              textTransform: "none",
              px: 2,
              "&:hover": { bgcolor: "var(--evz-danger-hover)" }
            }}
          >
            SOS
          </Button>
        }
      />

      <Box sx={{ position: "relative", minHeight: "55vh", bgcolor: (theme) => theme.palette.background.default, borderRadius: uiTokens.radius.xl, overflow: 'hidden' }}>
      <MapShell
        preset="compact"
        height="55vh"
        onBack={() => navigate(-1)}
        showBackButton
        canvasSx={{ background: uiTokens.map.canvasEmphasis }}
      >

        {/* Map Labels */}
        <Typography
          sx={{
            position: "absolute",
            bottom: "30%",
            left: "25%",
            fontSize: 10,
            fontWeight: 600,
            color: "#03CD8C"
          }}
        >
          Faz 41
        </Typography>

        <Typography
          sx={{
            position: "absolute",
            bottom: "25%",
            left: "30%",
            fontSize: 10,
            fontWeight: 600,
            color: "#03CD8C"
          }}
        >
          BUGONGA
        </Typography>

        <Typography
          sx={{
            position: "absolute",
            bottom: "20%",
            right: "20%",
            fontSize: 10,
            fontWeight: 500,
            color: "#03CD8C"
          }}
        >
          aero beach
        </Typography>

        {/* Landmark Icons */}
        {/* Faz 41 - Green circular marker */}
        <Box
          sx={{
            position: "absolute",
            bottom: "28%",
            left: "23%",
            width: 20,
            height: 20,
            borderRadius: "50%",
            bgcolor: "#22c55e",
            border: "2px solid white",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
          }}
        />

        {/* BUGONGA - Orange icon with fork/knife */}
        <Box
          sx={{
            position: "absolute",
            bottom: "23%",
            left: "28%",
            width: 28,
            height: 28,
            borderRadius: "50%",
            bgcolor: "#F59E0B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
          }}
        >
          <RestaurantRoundedIcon sx={{ fontSize: 16, color: "#FFFFFF" }} />
        </Box>

        {/* Route line */}
        <Box
          sx={{
            position: "absolute",
            top: "55%",
            left: "25%",
            width: "50%",
            height: 3,
            bgcolor: "#1E3A5F",
            borderRadius: 2,
            transform: "rotate(-15deg)",
            transformOrigin: "left center"
          }}
        />

        {/* Pickup location marker (green pin) */}
        <Box
          sx={{
            position: "absolute",
            left: "25%",
            bottom: "35%",
            width: 18,
            height: 18,
            borderRadius: "50%",
            bgcolor: "#22c55e",
            border: "3px solid white",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
          }}
        />

        {/* Driver's car (white car icon on map) */}
        <Box
          sx={{
            position: "absolute",
            left: "45%",
            top: "52%",
            transform: "translate(-50%, -50%)",
            animation: "moveCar 3s ease-in-out infinite",
            "@keyframes moveCar": {
              "0%, 100%": { transform: "translate(-50%, -50%) translateX(0)" },
              "50%": { transform: "translate(-50%, -50%) translateX(10px)" }
            }
          }}
        >
          <DirectionsCarFilledRoundedIcon
            sx={{
              fontSize: 32,
              color: "#FFFFFF",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
            }}
          />
        </Box>
      </MapShell>

      {/* Content below map */}
      <Box sx={{ px: 2.5, pt: 0, pb: 3 }}>
        {/* Driver Profile Section - Avatar slightly overlapping map */}
        <Box sx={{ textAlign: "center", mb: 2.5, mt: -5 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              mx: "auto",
              mb: 1.5,
              bgcolor: "#03CD8C",
              fontSize: 36,
              fontWeight: 600,
              border: "4px solid white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
            }}
          >
            {driver?.avatar ?? driver?.name?.split(" ").map((part) => part[0]).join("").slice(0, 2) ?? "DR"}
          </Avatar>
          
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 0.5, letterSpacing: "-0.01em" }}
          >
            {driver?.name ?? "Driver"}
          </Typography>
          
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 2 }}>
            <StarRoundedIcon sx={{ fontSize: 18, color: "#FFC107" }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {driver?.rating?.toFixed(1) ?? "4.6"}
            </Typography>
            <Typography variant="caption" sx={{ color: (theme) => theme.palette.text.secondary, ml: 0.5 }}>
              157 ratings
            </Typography>
          </Box>

          {/* Performance Stats Box */}
          <Card
            elevation={0}
            sx={{
              mx: "auto",
              maxWidth: 280,
              borderRadius: 2,
              bgcolor: "#1E3A5F",
              mb: 2
            }}
          >
            <CardContent sx={{ px: 2, py: 1.5 }}>
              <Stack direction="row" spacing={3} justifyContent="center">
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#FFFFFF", mb: 0.3 }}
                  >
                    200+
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}
                  >
                    Rides
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#FFFFFF", mb: 0.3 }}
                  >
                    4+
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}
                  >
                    Experience
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Status Bar with Arrival Time and Contact Buttons */}
        <Card
          elevation={0}
          sx={{
            mb: 2,
            borderRadius: 2,
            bgcolor: "#1E3A5F",
            overflow: "hidden"
          }}
        >
          <CardContent sx={{ px: 2, py: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: "#FFFFFF",
                  fontSize: 13
                }}
              >
                Driver is arriving in {String(Math.ceil(arrivalTime)).padStart(2, '0')} mins
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton
                  size="small"
                  onClick={handleCall}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.15)",
                    color: "#22c55e",
                    width: 36,
                    height: 36,
                    "&:hover": {
                      bgcolor: "rgba(34,197,94,0.2)"
                    }
                  }}
                >
                  <PhoneRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleMessage}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.15)",
                    color: "#22c55e",
                    width: 36,
                    height: 36,
                    "&:hover": {
                      bgcolor: "rgba(34,197,94,0.2)"
                    }
                  }}
                >
                  <MessageRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* OTP Section */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            mb: 2,
            borderRadius: 2,
            py: 1.5,
            fontSize: 15,
            fontWeight: 600,
            textTransform: "none",
            bgcolor: "#03CD8C",
            color: "#FFFFFF",
            "&:hover": {
              bgcolor: "#1976D2"
            }
          }}
        >
          Your OTP : {otp}
        </Button>

        {/* Vehicle Preview - Simple red car icon (no license plate in this view) */}
        <Card
          elevation={0}
          sx={{
            mb: 2.5,
            borderRadius: 2,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
            border: (theme) =>
              theme.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            overflow: "hidden"
          }}
        >
          <Box
            sx={{
              height: 100,
              width: "100%",
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#F3F4F6" : "rgba(51,65,85,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative"
            }}
          >
            {/* Red car icon (front-side angle, no license plate visible) */}
            <DirectionsCarFilledRoundedIcon
              sx={{
                fontSize: 64,
                color: "#DC2626",
                opacity: 0.9
              }}
            />
          </Box>
        </Card>

        {/* Action Buttons */}
        <Stack direction="row" spacing={1.5}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleAccept}
            sx={{
              borderRadius: 5,
              py: 1.3,
              fontSize: 15,
              fontWeight: 600,
              textTransform: "none",
              bgcolor: "#22c55e",
              color: "#FFFFFF",
              "&:hover": {
                bgcolor: "#16A34A"
              }
            }}
          >
            Accept
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleChange}
            sx={{
              borderRadius: 5,
              py: 1.3,
              fontSize: 15,
              fontWeight: 600,
              textTransform: "none",
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.98)",
              border: (theme) =>
                theme.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)",
              color: (theme) => theme.palette.text.primary,
              "&:hover": {
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.8)"
              }
            }}
          >
            Change
          </Button>
        </Stack>
      </Box>
      </Box>
    </ScreenScaffold>
  );
}

export default function RiderScreen23DriverAssignedOnTheWayCanvas_v2() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (theme) => theme.palette.background.default
      }}
    >

        <DriverAssignedOnTheWayScreen />
      
    </Box>
  );
}
