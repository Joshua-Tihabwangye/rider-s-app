import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography
} from "@mui/material";

import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import MapShell from "../components/maps/MapShell";
import DriverChatRoom from "../components/DriverChatRoom";
import ScreenScaffold from "../components/ScreenScaffold";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";

function DriverAssignedOnTheWayScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { ride, actions } = useAppData();
  const activeTrip = ride.activeTrip;
  const driver = activeTrip?.driver;
  const vehicle = activeTrip?.vehicle;
  const [arrivalTime, setArrivalTime] = useState(activeTrip?.etaMinutes ?? 5);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    actions.setRideStatus("driver_on_way");
    const interval = setInterval(() => {
      setArrivalTime((prev) => {
        if (prev > 0) {
          return prev - 0.0167;
        }
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [actions.setRideStatus]);

  const handleAccept = () => {
    actions.setRideStatus("driver_arrived");
    navigate("/rides/driver-arrived");
  };

  const handleChange = () => {
    actions.setRideStatus("searching");
    navigate("/rides/searching");
  };

  const handleCall = () => {
    if (driver?.phone) {
      window.location.href = `tel:${driver.phone}`;
    }
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
    <ScreenScaffold disableTopPadding>
      <Box sx={topMapBleedSx}>
        <MapShell
          preset="compact"
          sx={{ height: { xs: "52dvh", md: "54vh" } }}
          onBack={() => navigate(-1)}
          showBackButton
          canvasSx={{ background: uiTokens.map.canvasEmphasis }}
        >
          <Box
            sx={{
              position: "absolute",
              left: "20%",
              bottom: "24%",
              transform: "translate(-50%, -50%)"
            }}
          >
            <PlaceRoundedIcon sx={{ fontSize: 26, color: "#22c55e" }} />
          </Box>
          <Box
            sx={{
              position: "absolute",
              left: "46%",
              top: "53%",
              transform: "translate(-50%, -50%)",
              animation: "moveCar 2.2s ease-in-out infinite",
              "@keyframes moveCar": {
                "0%, 100%": { transform: "translate(-50%, -50%) translateX(0)" },
                "50%": { transform: "translate(-50%, -50%) translateX(8px)" }
              }
            }}
          >
            <DirectionsCarFilledRoundedIcon sx={{ fontSize: 30, color: "#FFFFFF" }} />
          </Box>
          <Box
            sx={{
              position: "absolute",
              left: "23%",
              top: "56%",
              width: "48%",
              height: 4,
              borderRadius: 2,
              bgcolor: "rgba(15,23,42,0.65)",
              transform: "rotate(-16deg)",
              transformOrigin: "left center"
            }}
          />
          <Button
            size="small"
            variant="contained"
            onClick={() => navigate("/rides/sos")}
            sx={{
              position: "absolute",
              top: 14,
              right: 14,
              minWidth: "auto",
              px: 1.4,
              py: 0.4,
              borderRadius: 5,
              bgcolor: "var(--evz-danger)",
              color: "#fff",
              textTransform: "none",
              fontSize: 11,
              "&:hover": { bgcolor: "var(--evz-danger-hover)" }
            }}
          >
            SOS
          </Button>
        </MapShell>
      </Box>

      <Box sx={{ pt: 0.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
          Driver is on the way
        </Typography>
        <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
          Your driver is heading to your location now.
        </Typography>
      </Box>

      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.sm,
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.5 }}>
          <Stack direction="row" spacing={1.25} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar
                sx={{
                  width: 46,
                  height: 46,
                  bgcolor: "#03CD8C",
                  color: "#FFFFFF",
                  fontWeight: 700
                }}
              >
                {driver?.avatar ?? driver?.name?.slice(0, 2).toUpperCase() ?? "DR"}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {driver?.name ?? "Driver"}
                </Typography>
                <Stack direction="row" spacing={0.4} alignItems="center">
                  <StarRoundedIcon sx={{ fontSize: 14, color: "#F59E0B" }} />
                  <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                    {driver?.rating?.toFixed(1) ?? "4.6"} rating
                  </Typography>
                </Stack>
              </Box>
            </Stack>
            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" onClick={handleCall}>
                <PhoneRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton size="small" onClick={() => setChatOpen(true)}>
                <MessageRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.sm,
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.5 }}>
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
            Vehicle details
          </Typography>
          <Stack spacing={0.7} sx={{ mt: 0.8 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Number plate: {vehicle?.plate ?? "UAX 278C"}
            </Typography>
            <Typography variant="body2">
              Model: {vehicle?.model ?? "Tesla Model 3"}
            </Typography>
            <Typography variant="body2">
              Color: {vehicle?.color ?? "Pearl White"}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.sm,
          bgcolor: "#1E3A5F",
          overflow: "hidden"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.25 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "#FFFFFF", fontSize: 13 }}>
            Driver is arriving in {String(Math.ceil(arrivalTime)).padStart(2, "0")} mins
          </Typography>
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{ display: "block", fontSize: 11, color: (t) => t.palette.text.secondary }}
      >
        OTP will be shown once the driver arrives for pickup verification.
      </Typography>

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

      <DriverChatRoom
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        driverName={driver?.name}
        driverAvatar={driver?.avatar}
      />
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
