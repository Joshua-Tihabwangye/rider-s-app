import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Chip,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Typography
} from "@mui/material";

import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import MapShell from "../components/maps/MapShell";
import DriverChatRoom from "../components/DriverChatRoom";
import ScreenScaffold from "../components/ScreenScaffold";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";

function DriverHasArrivedScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { ride, actions } = useAppData();
  const activeTrip = ride.activeTrip;
  const driver = activeTrip?.driver;
  const vehicle = activeTrip?.vehicle;
  const otp = (activeTrip?.otp?.trim() || "256836").replace(/\s+/g, "").slice(0, 6);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    actions.setRideStatus("driver_arrived");
    const verificationTimer = window.setTimeout(() => {
      actions.setRideStatus("in_progress");
      navigate("/rides/trip", { replace: true, state: { fromDriverVerification: true } });
    }, 15000);

    return () => window.clearTimeout(verificationTimer);
  }, [actions.setRideStatus, navigate]);

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

  const handleCall = () => {
    if (driver?.phone) {
      window.location.href = `tel:${driver.phone}`;
    }
  };

  return (
    <ScreenScaffold disableTopPadding>
      <Box sx={topMapBleedSx}>
        <MapShell
          preset="compact"
          sx={{ height: { xs: "52dvh", md: "54vh" } }}
          showControls={false}
          canvasSx={{ background: uiTokens.map.canvasEmphasis }}
        >
          <Box
            sx={{
              position: "absolute",
              left: "18%",
              bottom: "22%",
              transform: "translate(-50%, -50%)"
            }}
          >
            <PlaceRoundedIcon sx={{ fontSize: 28, color: "#22c55e" }} />
          </Box>
          <Box
            sx={{
              position: "absolute",
              left: "42%",
              top: "52%",
              transform: "translate(-50%, -50%)",
              animation: "arrivedPulse 1.8s ease-in-out infinite",
              "@keyframes arrivedPulse": {
                "0%, 100%": { transform: "translate(-50%, -50%) scale(1)" },
                "50%": { transform: "translate(-50%, -50%) scale(1.08)" }
              }
            }}
          >
            <DirectionsCarFilledRoundedIcon sx={{ fontSize: 30, color: "#03CD8C" }} />
          </Box>
          <Box
            sx={{
              position: "absolute",
              left: "22%",
              top: "54%",
              width: "50%",
              height: 4,
              borderRadius: 2,
              bgcolor: "rgba(15,23,42,0.65)",
              transform: "rotate(-18deg)",
              transformOrigin: "left center"
            }}
          />
        </MapShell>
      </Box>

      <Box sx={{ pt: 0.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
          Driver arrived
        </Typography>
        <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
          Verify OTP or QR before starting the trip.
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
                <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                  {vehicle?.model ?? "Tesla Model 3"} · {vehicle?.color ?? "Pearl White"}
                </Typography>
                <Typography variant="caption" sx={{ display: "block", color: (t) => t.palette.text.secondary }}>
                  Plate: {vehicle?.plate ?? "UAX 278C"}
                </Typography>
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
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems="stretch">
            <Box sx={{ flex: 1, width: "100%" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Box>
                  <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                    Rider OTP
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Driver can enter this code instead of scanning the QR.
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label="Use OTP"
                  sx={{
                    height: 24,
                    borderRadius: 1.5,
                    bgcolor: "rgba(3,205,140,0.14)",
                    color: "#047857",
                    fontWeight: 700
                  }}
                />
              </Stack>

              <Stack direction="row" spacing={1} sx={{ mb: 1.25, flexWrap: "wrap" }} useFlexGap>
                {otp.split("").map((digit, index) => (
                  <Box
                    key={`${digit}-${index}`}
                    sx={{
                      minWidth: 44,
                      height: 52,
                      px: 1.1,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: (t) => (t.palette.mode === "light" ? "#F8FAFC" : "rgba(15,23,42,0.96)"),
                      border: "1px solid rgba(3,205,140,0.28)"
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "0.02em", lineHeight: 1 }}>
                      {digit}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                Share this OTP with the driver before trip start.
              </Typography>
            </Box>

            <Divider
              flexItem
              orientation="vertical"
              sx={{ display: { xs: "none", md: "block" }, borderColor: "rgba(148,163,184,0.3)" }}
            />
            <Divider sx={{ display: { xs: "block", md: "none" }, borderColor: "rgba(148,163,184,0.3)" }}>
              <Typography variant="caption" sx={{ px: 0.75, color: "text.secondary", fontWeight: 700 }}>
                OR
              </Typography>
            </Divider>

            <Box
              sx={{
                width: { xs: "100%", md: 156 },
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Stack spacing={1} alignItems="center">
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                  Or scan QR
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    color: "#0F172A"
                  }}
                >
                  OTP {otp}
                </Typography>
                <Box
                  sx={{
                    width: 132,
                    height: 132,
                    p: 1.25,
                    borderRadius: 2,
                    border: "1px solid rgba(148,163,184,0.45)",
                    bgcolor: "#FFFFFF",
                    position: "relative"
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 10,
                      backgroundImage:
                        "repeating-linear-gradient(0deg, #111827 0 5px, transparent 5px 10px), repeating-linear-gradient(90deg, #111827 0 5px, transparent 5px 10px)",
                      opacity: 0.24
                    }}
                  />
                  <Box sx={qrCornerSx(14, 14)} />
                  <Box sx={qrCornerSx(undefined, 14, 14)} />
                  <Box sx={qrCornerSx(14, undefined, undefined, 14)} />
                  <QrCode2RoundedIcon
                    sx={{
                      position: "absolute",
                      right: 12,
                      bottom: 12,
                      fontSize: 18,
                      color: "#111827"
                    }}
                  />
                </Box>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{
          textAlign: "center",
          color: (t) => t.palette.text.secondary,
          fontSize: 11,
          display: "block"
        }}
      >
        Trip will start automatically once the driver verifies OTP or QR.
      </Typography>

      <DriverChatRoom
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        driverName={driver?.name}
        driverAvatar={driver?.avatar}
      />
    </ScreenScaffold>
  );
}

function qrCornerSx(
  left?: number,
  top?: number,
  right?: number,
  bottom?: number
) {
  return {
    position: "absolute",
    left,
    top,
    right,
    bottom,
    width: 26,
    height: 26,
    border: "4px solid #111827",
    bgcolor: "#FFFFFF",
    boxSizing: "border-box"
  } as const;
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
