import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  Button
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";

import MobileShell from "../components/MobileShell";

const HOSPITALS = [
  "Mulago National Referral Hospital",
  "Nsambya Hospital",
  "Case Hospital",
  "International Hospital Kampala (IHK)"
];

function AmbulanceDestinationHospitalSelectionScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [destinationMode, setDestinationMode] = useState("nearest");
  const [selectedHospital, setSelectedHospital] = useState("Mulago National Referral Hospital");

  const canContinue =
    destinationMode === "nearest" || (destinationMode === "manual" && selectedHospital.trim().length > 0);

  return (
    <>
        <Box sx={{ bgcolor: "#03CD8C", px: 2, pt: 2, pb: 2, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              position: "absolute",
              left: 20,
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "#FFFFFF",
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" }
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, letterSpacing: "-0.01em", color: "#FFFFFF" }}
          >
            Choose destination hospital
          </Typography>
        </Box>
        <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>


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
                borderRadius: 999,
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
                borderRadius: 999,
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
                borderRadius: 999,
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
                  borderRadius: 999,
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
        disabled={!canContinue}
        onClick={() => navigate("/ambulance/confirmation", {
          state: { destinationMode, selectedHospital }
        })}
        sx={{
          borderRadius: 999,
          py: 1.1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: canContinue ? "primary.main" : "#9CA3AF",
          color: canContinue ? "#020617" : "#E5E7EB",
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: canContinue ? "#06e29a" : "#9CA3AF",
            transform: canContinue ? "translateY(-1px)" : "none",
            boxShadow: canContinue ? 4 : 0
          },
          "&:active": { transform: "translateY(0)" }
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
    </Box>
    </>

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
        

        <DarkModeToggle />

        

        <MobileShell>
          <AmbulanceDestinationHospitalSelectionScreen />
        </MobileShell>
      </Box>
    
  );
}
