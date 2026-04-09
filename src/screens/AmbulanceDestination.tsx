import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  Button
} from "@mui/material";

import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PersonPinCircleRoundedIcon from "@mui/icons-material/PersonPinCircleRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import ScreenScaffold from "../components/ScreenScaffold";
import MapShell from "../components/maps/MapShell";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";


const HOSPITALS = [
  "Mulago National Referral Hospital",
  "Nsambya Hospital",
  "Case Hospital",
  "International Hospital Kampala (IHK)"
];

function AmbulanceDestinationHospitalSelectionScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { actions } = useAppData();
  const [destinationMode, setDestinationMode] = useState("nearest");
  const [selectedHospital, setSelectedHospital] = useState("Mulago National Referral Hospital");

  const canContinue =
    destinationMode === "nearest" || (destinationMode === "manual" && selectedHospital.trim().length > 0);

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
              opacity: 0.22,
              backgroundImage:
                "linear-gradient(to right, rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.5) 1px, transparent 1px)",
              backgroundSize: "30px 30px"
            }}
          />
          <Box
            sx={{
              position: "absolute",
              left: "16%",
              bottom: "23%",
              transform: "translate(-50%, -50%)"
            }}
          >
            <PersonPinCircleRoundedIcon sx={{ fontSize: 30, color: "#DC2626" }} />
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
              left: "43%",
              top: "53%",
              transform: "translate(-50%, -50%)"
            }}
          >
            <DirectionsCarFilledRoundedIcon sx={{ fontSize: 28, color: "#F97316" }} />
          </Box>
          <Box
            sx={{
              position: "absolute",
              left: "22%",
              top: "54%",
              width: "54%",
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
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
        >
          Choose destination hospital
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
        >
          We’ll send your ambulance there or to the nearest option
        </Typography>
      </Box>

      {/* Mode selection */}
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
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.5, display: "block" }}
          >
            Destination mode
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: "wrap" }}>
            <Chip
              label="Nearest suitable hospital"
              size="small"
              onClick={() => setDestinationMode("nearest")}
              sx={{
                borderRadius: 5,
                fontSize: 11,
                height: 26,
                bgcolor:
                  destinationMode === "nearest"
                    ? "primary.main"
                    : (t) =>
                        t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                color:
                  destinationMode === "nearest" ? "#020617" : (t) => t.palette.text.primary
              }}
            />
            <Chip
              label="Send to specific hospital"
              size="small"
              onClick={() => setDestinationMode("manual")}
              sx={{
                borderRadius: 5,
                fontSize: 11,
                height: 26,
                bgcolor:
                  destinationMode === "manual"
                    ? "primary.main"
                    : (t) =>
                        t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                color:
                  destinationMode === "manual" ? "#020617" : (t) => t.palette.text.primary
              }}
            />
          </Stack>

          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            If you’re not sure where to go, choose “Nearest suitable hospital” and
            our partners will route you appropriately.
          </Typography>
        </CardContent>
      </Card>

      {/* Hospital selection */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
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
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
            <LocalHospitalRoundedIcon
              sx={{ fontSize: 18, color: (t) => t.palette.text.secondary }}
            />
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Preferred hospital (optional if nearest is selected)
            </Typography>
          </Stack>

          <TextField
            fullWidth
            size="small"
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
            disabled={destinationMode === "nearest"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PlaceRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                </InputAdornment>
              )
            }}
            sx={{
              mb: 1.5,
              "& .MuiOutlinedInput-root": {
                borderRadius: 5,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": { borderColor: "primary.main" },
                "&.Mui-disabled": {
                  bgcolor: (t) =>
                    t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)"
                }
              }
            }}
          />

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {HOSPITALS.map((h) => (
              <Chip
                key={h}
                label={h}
                size="small"
                disabled={destinationMode === "nearest"}
                onClick={() => setSelectedHospital(h)}
                sx={{
                  borderRadius: 5,
                  fontSize: 10,
                  height: 24,
                  bgcolor:
                    selectedHospital === h && destinationMode === "manual"
                      ? "primary.main"
                      : (t) =>
                          t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                  color:
                    selectedHospital === h && destinationMode === "manual"
                      ? "#020617"
                      : (t) => t.palette.text.primary
                }}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="contained"
        onClick={() => {
          const destinationLabel =
            destinationMode === "nearest" ? "Nearest hospital" : selectedHospital.trim();
          actions.updateAmbulanceRequest({
            destination: { label: destinationLabel, address: destinationLabel },
            status: "requested"
          });
          navigate("/ambulance/confirmation");
        }}
        disabled={!canContinue}
        sx={{
          borderRadius: 5,
          py: 1.1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: canContinue ? "primary.main" : "#9CA3AF",
          color: canContinue ? "#020617" : "#E5E7EB",
          "&:hover": {
            bgcolor: canContinue ? "#06e29a" : "#9CA3AF"
          }
        }}
      >
        Continue to request confirmation
      </Button>

      <Typography
        variant="caption"
        sx={{ mt: 1.2, fontSize: 11, color: (t) => t.palette.text.secondary }}
      >
        In some cases, triage teams may redirect you to a different facility
        based on capacity and the patient’s condition.
      </Typography>
    </ScreenScaffold>
  );
}

export default function RiderScreen85AmbulanceDestinationHospitalSelectionCanvas_v2() {
      return (
    
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (t) => t.palette.background.default
        }}
      >

          <AmbulanceDestinationHospitalSelectionScreen />
        
      </Box>
    
  );
}
