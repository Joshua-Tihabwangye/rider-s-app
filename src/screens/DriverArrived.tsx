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
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import KeyboardDoubleArrowRightRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowRightRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import MapShell from "../components/maps/MapShell";
import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import DriverChatRoom from "../components/DriverChatRoom";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";

function DriverHasArrivedScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { ride, actions } = useAppData();
  const activeTrip = ride.activeTrip;
  const driver = activeTrip?.driver;
  const vehicle = activeTrip?.vehicle;
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const otp = activeTrip?.otp ?? "—";

  useEffect(() => {
    actions.setRideStatus("driver_arrived");
  }, [actions.setRideStatus]);

  const handleCall = () => {
    if (activeTrip?.driver?.phone) {
      window.location.href = `tel:${activeTrip.driver.phone}`;
    }
  };

  const handleMessage = () => {
    setChatOpen(true);
  };

  const handleSliderStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>): void => {
    setIsSliding(true);
    e.preventDefault();
  };

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>): void => {
    if (!isSliding) return;
    e.preventDefault();
    
    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    const clientX = ('touches' in e && e.touches && e.touches[0]) ? e.touches[0].clientX : ('clientX' in e ? e.clientX : 0);
    const x = clientX - rect.left;
    const maxX = rect.width - 61; // 60px thumb + 1px margin
    
    const newPosition = Math.max(0, Math.min(x, maxX));
    setSliderPosition(newPosition);
    
    // If dragged to the end, start the trip
    if (newPosition >= maxX - 10) {
      handleStartTrip();
    }
  };

  const handleSliderEnd = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>): void => {
    if (!isSliding) return;
    setIsSliding(false);
    e.preventDefault();
    
    // Reset if not completed
    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    const maxX = rect.width - 61;
    if (sliderPosition < maxX - 10) {
      setSliderPosition(0);
    }
  };

  const handleStartTrip = () => {
    // Navigate to trip in progress screen
    actions.setRideStatus("in_progress");
    navigate("/rides/trip");
  };

  const topMapBleedSx = {
    position: "relative",
    width: {
      xs: "calc(100% + (var(--rider-shell-content-px-xs, 20px) * 2))",
      md: "calc(100% + (var(--rider-shell-content-px-md, 24px) * 2))"
    },
    ml: {
      xs: "calc(var(--rider-shell-content-px-xs, 20px) * -1)",
      md: "calc(var(--rider-shell-content-px-md, 24px) * -1)"
    },
    mr: {
      xs: "calc(var(--rider-shell-content-px-xs, 20px) * -1)",
      md: "calc(var(--rider-shell-content-px-md, 24px) * -1)"
    },
    overflow: "hidden"
  } as const;

  return (
    <ScreenScaffold>
      <SectionHeader
        title="Driver Arrived"
        subtitle="Your trip is ready to start"
        leadingAction={
          <IconButton
            size="small"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: uiTokens.radius.xl,
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

      {/* Map Section - Full-bleed top map */}
      <Box sx={topMapBleedSx}>
        <MapShell
          showControls={false}
          sx={{ height: { xs: "56dvh", md: "55vh" } }}
          canvasSx={{
            background: (theme) =>
              theme.palette.mode === "light"
                ? "linear-gradient(135deg, #F5F5DC 0%, #FAFAF0 50%, #FFFFFF 100%)"
                : "linear-gradient(135deg, rgba(15,23,42,0.3), #020617 60%, #020617 100%)"
          }}
        >
          {/* Driver's car icon at pickup point (with pulsating effect) */}
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              animation: "pulse 2s ease-in-out infinite",
              "@keyframes pulse": {
                "0%, 100%": { transform: "translate(-50%, -50%) scale(1)" },
                "50%": { transform: "translate(-50%, -50%) scale(1.1)" }
              }
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: "#03CD8C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: uiTokens.elevation.card
              }}
            >
              <DirectionsCarFilledRoundedIcon
                sx={{
                  fontSize: 24,
                  color: "#FFFFFF",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                }}
              />
            </Box>
          </Box>
        </MapShell>
      </Box>

      {/* Content below map */}
      <Box sx={{ px: uiTokens.spacing.xl, pt: uiTokens.spacing.lg, pb: uiTokens.spacing.xxl }}>
        {/* Driver Profile Section */}
        <Box sx={{ textAlign: "center", mb: uiTokens.spacing.xl }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              mx: "auto",
              mb: uiTokens.spacing.md,
              bgcolor: "#03CD8C",
              fontSize: 36,
              fontWeight: 600
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
          
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: uiTokens.spacing.xxs, mb: uiTokens.spacing.lg }}>
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
              mb: uiTokens.spacing.lg
            }}
          >
            <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.mdPlus }}>
              <Stack direction="row" spacing={uiTokens.spacing.xl} justifyContent="center" sx={{ mb: uiTokens.spacing.mdPlus }}>
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

              {/* Arrival Confirmation Bar */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  pt: 1.5,
                  borderTop: "1px solid rgba(255,255,255,0.2)"
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircleRoundedIcon sx={{ fontSize: 20, color: "#22c55e" }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: "#FFFFFF",
                      fontSize: 13
                    }}
                  >
                    Driver Has Arrived
                  </Typography>
                </Box>
                <Stack direction="row" spacing={0.5}>
                  <IconButton
                    size="small"
                    onClick={handleCall}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.15)",
                      color: "#22c55e",
                      width: 32,
                      height: 32,
                      "&:hover": {
                        bgcolor: "rgba(34,197,94,0.2)"
                      }
                    }}
                  >
                    <PhoneRoundedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleMessage}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.15)",
                      color: "#22c55e",
                      width: 32,
                      height: 32,
                      "&:hover": {
                        bgcolor: "rgba(34,197,94,0.2)"
                      }
                    }}
                  >
                    <MessageRoundedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* OTP Section */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            mb: uiTokens.spacing.lg,
            borderRadius: uiTokens.radius.xl,
            py: uiTokens.spacing.mdPlus,
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

        {/* Vehicle Information Section */}
        <Card
          elevation={0}
          sx={{
            mb: uiTokens.spacing.xl,
            borderRadius: uiTokens.radius.xl,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
            border: (theme) =>
              theme.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            overflow: "hidden"
          }}
        >
          {/* Car Image - High-quality image with blurred outdoor background */}
          <Box
            sx={{
              height: 180,
              width: "100%",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {/* Blurred outdoor background */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage: (theme) =>
                  theme.palette.mode === "light"
                    ? "linear-gradient(135deg, rgba(135,206,235,0.3) 0%, rgba(144,238,144,0.2) 50%, rgba(255,255,255,0.4) 100%), url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJibHVyIj48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI4Ii8+PC9maWx0ZXI+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNGNUY1REMiLz48Y2lyY2xlIGN4PSI1MCUiIGN5PSI0MCUiIHI9IjEwMCIgZmlsbD0icmdiYSgxMzUsMjA2LDIzNSwwLjMpIi8+PHJlY3QgeD0iMjAlIiB5PSI2MCUiIHdpZHRoPSI2MCUiIGhlaWdodD0iMjAlIiBmaWxsPSJyZ2JhKDE0NCwyMzgsMTQ0LDAuMykiLz48L3N2Zz4=')"
                    : "linear-gradient(135deg, rgba(15,23,42,0.6) 0%, rgba(30,58,95,0.4) 50%, rgba(15,23,42,0.6) 100%)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(8px)",
                transform: "scale(1.1)",
                opacity: 0.7
              }}
            />

            {/* Car Image Container - When actual image is added, it will replace this */}
            <Box
              sx={{
                position: "relative",
                width: "90%",
                height: "85%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1
              }}
            >
              {/* Placeholder for actual car image - In production, replace with: <img src={vehicleImageUrl} alt="Tesla Model Y" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> */}
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {/* Red Tesla Model Y car (front-side angle view) */}
                <Box
                  sx={{
                    width: "75%",
                    height: "80%",
                    position: "relative",
                    transform: "perspective(400px) rotateY(-15deg)",
                    transformStyle: "preserve-3d"
                  }}
                >
                  {/* Car body - Red Tesla Model Y */}
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      bgcolor: "#DC2626",
                      borderRadius: "16px 16px 8px 8px",
                      position: "relative",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                      overflow: "hidden"
                    }}
                  >
                    {/* Car windshield/roof area */}
                    <Box
                      sx={{
                        width: "100%",
                        height: "45%",
                        bgcolor: "rgba(0,0,0,0.2)",
                        borderRadius: "16px 16px 0 0",
                        position: "relative"
                      }}
                    >
                      {/* Windshield reflection */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: "20%",
                          left: "10%",
                          width: "40%",
                          height: "30%",
                          bgcolor: "rgba(255,255,255,0.3)",
                          borderRadius: "50%",
                          filter: "blur(4px)"
                        }}
                      />
                    </Box>

                    {/* Car body middle section */}
                    <Box
                      sx={{
                        width: "100%",
                        height: "35%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <DirectionsCarFilledRoundedIcon
                        sx={{
                          fontSize: 56,
                          color: "#FFFFFF",
                          opacity: 0.95,
                          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                        }}
                      />
                    </Box>

                    {/* License Plate on the car (visible on the car image) */}
                    <Box
                      sx={{
                        width: "55%",
                        height: "18%",
                        bgcolor: "#FFFFFF",
                        borderRadius: "6px 6px 4px 4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 0.5,
                        border: "3px solid #03CD8C",
                        boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
                        position: "relative",
                        zIndex: 2
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#03CD8C",
                          letterSpacing: "1px",
                          textAlign: "center"
                        }}
                      >
                        UPS 256 256
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.mdPlus }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 0.5,
                color: (theme) => theme.palette.text.primary
              }}
            >
              {vehicle?.model ?? "EV Vehicle"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: (theme) => theme.palette.text.secondary,
                fontSize: 13
              }}
            >
              Dual Motor AWD 100 kWh (670 Hp)
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: (theme) => theme.palette.text.primary,
                  fontSize: 13,
                  fontWeight: 500
                }}
              >
                License Plate : <Box component="span" sx={{ fontWeight: 700 }}>UPS 256 256</Box>
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  px: 1,
                  py: 0.5,
                  borderRadius: uiTokens.radius.sm,
                  bgcolor: "rgba(34,197,94,0.1)"
                }}
              >
                <VerifiedRoundedIcon sx={{ fontSize: 16, color: "#22c55e" }} />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#22c55e"
                  }}
                >
                  Verified
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Slide to Start Trip Button */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: 56,
            borderRadius: uiTokens.radius.xl,
            bgcolor: "#03CD8C",
            overflow: "hidden",
            cursor: isSliding ? "grabbing" : "grab",
            userSelect: "none"
          }}
          onMouseDown={handleSliderStart}
          onMouseMove={handleSliderMove}
          onMouseUp={handleSliderEnd}
          onMouseLeave={handleSliderEnd}
          onTouchStart={handleSliderStart}
          onTouchMove={handleSliderMove}
          onTouchEnd={handleSliderEnd}
          onTouchCancel={handleSliderEnd}
        >
          {/* Slider Track */}
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              width: `${(sliderPosition / 280) * 100}%`,
              height: "100%",
              bgcolor: "#1976D2",
              transition: isSliding ? "none" : "width 0.3s ease"
            }}
          />

          {/* Slider Thumb */}
          <Box
            sx={{
              position: "absolute",
              left: sliderPosition,
              top: "50%",
              transform: "translateY(-50%)",
              width: 60,
              height: 48,
              borderRadius: uiTokens.radius.lg,
              bgcolor: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              transition: isSliding ? "none" : "left 0.3s ease",
              ml: 0.5
            }}
          >
            <KeyboardDoubleArrowRightRoundedIcon sx={{ fontSize: 24, color: "#03CD8C" }} />
          </Box>

          {/* Text */}
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              gap: 1
            }}
          >
            <Typography
              sx={{
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: 15,
                whiteSpace: "nowrap"
              }}
            >
              Slide to start trip
            </Typography>
          </Box>
        </Box>
      </Box>

      <DriverChatRoom
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        driverName={driver?.name}
        driverAvatar={driver?.avatar}
      />
    </ScreenScaffold>
  );
}

export default function RiderScreen24DriverHasArrivedCanvas_v2() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (theme) => theme.palette.background.default
      }}
    >

        <DriverHasArrivedScreen />
      
    </Box>
  );
}
