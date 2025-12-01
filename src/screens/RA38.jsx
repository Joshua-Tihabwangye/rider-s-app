import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  Button
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import MobileShell from "../components/MobileShell";

function EnterDestinationVariantScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("single");
  const [pickup, setPickup] = useState("Current location");
  const [destination, setDestination] = useState("");

  const canContinue = pickup.trim() && destination.trim();

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
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
              Plan your EV route
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Choose a simple trip or add multiple stops
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Single vs Multi toggle */}
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
          <Stack direction="row" spacing={1}>
            <Chip
              label="Single destination"
              onClick={() => setMode("single")}
              icon={<RouteRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 28,
                bgcolor:
                  mode === "single"
                    ? "primary.main"
                    : (t) => (t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)"),
                color: mode === "single" ? "#020617" : (t) => t.palette.text.primary,
                "& .MuiChip-icon": { color: mode === "single" ? "#020617" : "rgba(148,163,184,1)" }
              }}
            />
            <Chip
              label="Multiple stops"
              onClick={() => setMode("multi")}
              icon={<AddRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 28,
                bgcolor:
                  mode === "multi"
                    ? "primary.main"
                    : (t) => (t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)"),
                color: mode === "multi" ? "#020617" : (t) => t.palette.text.primary,
                "& .MuiChip-icon": { color: mode === "multi" ? "#020617" : "rgba(148,163,184,1)" }
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Fields */}
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
          <TextField
            fullWidth
            size="small"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            variant="outlined"
            placeholder="Pickup location"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MyLocationRoundedIcon sx={{ fontSize: 18, color: "primary.main" }} />
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
                    t.palette.mode === "light" ? "rgba(209,213,219,0.9)" : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": { borderColor: "primary.main" }
              }
            }}
          />

          <TextField
            fullWidth
            size="small"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            variant="outlined"
            placeholder="Destination"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PlaceRoundedIcon sx={{ fontSize: 20, color: "text.secondary" }} />
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

          {mode === "multi" && (
            <Box sx={{ mt: 1.75 }}>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.5, display: "block" }}
              >
                You can add extra stops like friends’ pickups or errands.
              </Typography>
              <Button
                size="small"
                startIcon={<AddRoundedIcon sx={{ fontSize: 18 }} />}
                sx={{
                  mt: 0.5,
                  borderRadius: 999,
                  textTransform: "none",
                  fontSize: 12
                }}
              >
                Add a stop
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="contained"
        disabled={!canContinue}
        sx={{
          borderRadius: 999,
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
        Continue
      </Button>
    </Box>
  );
}

export default function RiderScreen38EnterDestinationVariantCanvas_v2() {
      return (
    
      
      <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (t) => t.palette.background.default }}>
        

        <DarkModeToggle />

        

        <MobileShell>
          <EnterDestinationVariantScreen />
        </MobileShell>
      </Box>
    
  );
}
