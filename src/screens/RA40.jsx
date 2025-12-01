import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Button
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MobileShell from "../components/MobileShell";
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: { main: "#03CD8C" },
    secondary: { main: "#F77F00" },
    ...(mode === "light"
      ? {
          background: { default: "#F3F4F6", paper: "#FFFFFF" },
          text: { primary: "#0F172A", secondary: "#6B7280" },
          divider: "rgba(148,163,184,0.4)"
        }
      : {
          background: { default: "#020617", paper: "#020617" },
          text: { primary: "#F9FAFB", secondary: "#A6A6A6" },
          divider: "rgba(148,163,184,0.24)"
        })
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    button: { textTransform: "none", fontWeight: 600 },
    h6: { fontWeight: 600 }
  }
});

const MAX_STOPS = 5;

const INITIAL_STOPS_MAX = [
  { id: "A", label: "Stop A", value: "Nsambya Road 472, Kampala" },
  { id: "B", label: "Stop B", value: "Bugolobi Village, Kampala" },
  { id: "C", label: "Stop C", value: "Kansanga Market" },
  { id: "D", label: "Stop D", value: "Munyonyo" },
  { id: "E", label: "Stop E", value: "Entebbe Airport" }
];

function StopRow({ stop, index }) {
  const isFirst = index === 0;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.25 }}>
      <Box
        sx={{
          width: 26,
          height: 26,
          borderRadius: 999,
          bgcolor: isFirst ? "primary.main" : "rgba(15,23,42,0.9)",
          color: isFirst ? "#020617" : "#F9FAFB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 600
        }}
      >
        {stop.id}
      </Box>
      <TextField
        fullWidth
        size="small"
        defaultValue={stop.value}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PlaceRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            </InputAdornment>
          )
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 999,
            bgcolor: (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.96)",
            "& fieldset": {
              borderColor: (t) =>
                t.palette.mode === "light" ? "rgba(209,213,219,0.9)" : "rgba(51,65,85,0.9)"
            },
            "&:hover fieldset": { borderColor: "primary.main" }
          }
        }}
      />
      <DragIndicatorRoundedIcon sx={{ fontSize: 20, color: "text.secondary" }} />
    </Box>
  );
}

function EnterDestinationMaxStopsScreen() {
  const navigate = useNavigate();
  const [stops] = useState(INITIAL_STOPS_MAX);
  const canAddMore = stops.length < MAX_STOPS;

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 999,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)" (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)")}}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
              Add multiple stops
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              You have reached the maximum of {MAX_STOPS} stops for this trip
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Pickup */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
          border: (t) =>
            t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.5, display: "block" }}
          >
            Pickup
          </Typography>
          <TextField
            fullWidth
            size="small"
            defaultValue="Current location"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MyLocationRoundedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                </InputAdornment>
              )
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 999,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (t) =>
                    t.palette.mode === "light" ? "rgba(209,213,219,0.9)" : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": { borderColor: "primary.main" }
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Stops list */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
          border: (t) =>
            t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}
          >
            Stops (max {MAX_STOPS})
          </Typography>

          {stops.map((stop, index) => (
            <StopRow key={stop.id} stop={stop} index={index} />
          ))}

          <Button
            size="small"
            disabled={!canAddMore}
            startIcon={<AddRoundedIcon sx={{ fontSize: 18 }} />}
            sx={{
              mt: 0.75,
              borderRadius: 999,
              textTransform: "none",
              fontSize: 12,
              bgcolor: "rgba(15,23,42,0.02)",
              color: "#9CA3AF",
              "&:disabled": { opacity: 1 }
            }}
          >
            Maximum stops reached
          </Button>
          <Typography
            variant="caption"
            sx={{ mt: 0.75, display: "block", fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            To edit your stops, remove one of the existing destinations before adding a new one.
          </Typography>
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="contained"
        sx={{
          borderRadius: 999,
          py: 1.1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: "primary.main",
          color: "#020617",
          "&:hover": { bgcolor: "#06e29a" }
        }}
      >
        Continue
      </Button>
    </Box>
  );
}

export default function RiderScreen40EnterDestinationMaxStopsCanvas_v2() {
      return (
    
      
      <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (t) => t.palette.background.default }}>
        

        <DarkModeToggle />

        

        <MobileShell>
          <EnterDestinationMaxStopsScreen />
        </MobileShell>
      </Box>
    
  );
}
