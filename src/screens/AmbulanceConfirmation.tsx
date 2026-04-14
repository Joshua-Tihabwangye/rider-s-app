import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Chip
} from "@mui/material";

import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PhoneEnabledRoundedIcon from "@mui/icons-material/PhoneEnabledRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import ScreenScaffold from "../components/ScreenScaffold";
import MapShell from "../components/maps/MapShell";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";


function AmbulanceRequestConfirmationETAScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { ambulance, actions } = useAppData();
  const requestId = ambulance.request.id;
  const eta = "8 min";
  const destinationLabel =
    ambulance.request.destination?.label?.trim() ||
    ambulance.request.destination?.address?.trim() ||
    "Destination hospital pending";

  React.useEffect(() => {
    actions.updateAmbulanceRequest({ status: "assigned" });
  }, [actions.updateAmbulanceRequest]);

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
          sx={{ height: { xs: "42dvh", md: "44vh" } }}
          onBack={() => navigate(-1)}
          showBackButton
          canvasSx={{ background: uiTokens.map.canvasEmphasis }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              opacity: 0.2,
              backgroundImage:
                "linear-gradient(to right, rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.5) 1px, transparent 1px)",
              backgroundSize: "32px 32px"
            }}
          />
          <Box
            sx={{
              position: "absolute",
              left: "16%",
              bottom: "20%",
              transform: "translate(-50%, -50%)"
            }}
          >
            <PlaceRoundedIcon sx={{ fontSize: 30, color: "#DC2626" }} />
          </Box>
          <Box
            sx={{
              position: "absolute",
              right: "16%",
              top: "25%",
              transform: "translate(50%, -50%)"
            }}
          >
            <LocalHospitalRoundedIcon sx={{ fontSize: 30, color: "#16A34A" }} />
          </Box>
          <Box
            sx={{
              position: "absolute",
              left: "22%",
              top: "55%",
              width: "56%",
              height: 4,
              borderRadius: 2,
              bgcolor: "rgba(15,23,42,0.65)",
              transform: "rotate(-18deg)",
              transformOrigin: "left center"
            }}
          />
          <Box
            sx={{
              position: "absolute",
              left: "42%",
              top: "54%",
              transform: "translate(-50%, -50%)",
              animation: "ambulanceMove 2.6s ease-in-out infinite",
              "@keyframes ambulanceMove": {
                "0%, 100%": { transform: "translate(-50%, -50%) translateX(-8px)" },
                "50%": { transform: "translate(-50%, -50%) translateX(10px)" }
              }
            }}
          >
            <DirectionsCarFilledRoundedIcon sx={{ fontSize: 30, color: "#F97316" }} />
          </Box>
          <Box sx={{ position: "absolute", top: 14, left: 70 }}>
            <Chip
              size="small"
              icon={<AccessTimeRoundedIcon sx={{ fontSize: 14 }} />}
              label={`ETA ${eta}`}
              sx={{
                borderRadius: 5,
                fontSize: 11,
                height: 24,
                bgcolor: "rgba(15,23,42,0.82)",
                color: "#F9FAFB"
              }}
            />
          </Box>
        </MapShell>
      </Box>

      <Box sx={{ pt: 0.5 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
        >
          Ambulance on the way
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
        >
          We’ve shared your details with the response team
        </Typography>
      </Box>

      {/* Confirmation card */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(254,202,202,0.9)"
              : "1px solid rgba(127,29,29,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 5,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FEE2E2" : "rgba(127,29,29,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <LocalHospitalRoundedIcon sx={{ fontSize: 26, color: "#DC2626" }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Request ID
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                {requestId}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                The nearest available ambulance has accepted your request.
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={0.6}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <AccessTimeRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Estimated arrival: {eta}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <PlaceRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Destination: {destinationLabel}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Contact options */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}
          >
            Need to talk to someone?
          </Typography>
          <Stack direction="row" spacing={1.25}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PhoneEnabledRoundedIcon sx={{ fontSize: 18 }} />}
              onClick={() => navigate("/help")}
              sx={{
                borderRadius: 5,
                py: 0.9,
                fontSize: 13,
                textTransform: "none"
              }}
            >
              Call control room
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PhoneIphoneRoundedIcon sx={{ fontSize: 18 }} />}
              onClick={() => {
                window.location.href = "tel:+256700000000";
              }}
              sx={{
                borderRadius: 5,
                py: 0.9,
                fontSize: 13,
                textTransform: "none"
              }}
            >
              Call ambulance
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
      >
        If the patient’s condition changes or you move from this location, use
        these contact options to update the response team immediately.
      </Typography>
    </ScreenScaffold>
  );
}

export default function RiderScreen86AmbulanceRequestConfirmationETACanvas_v2() {
      return (
    
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (t) => t.palette.background.default
        }}
      >

          <AmbulanceRequestConfirmationETAScreen />
        
      </Box>
    
  );
}
