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

import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";

import MobileShell from "../components/MobileShell";

function RentalHomeEntryScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [modeSelection, setModeSelection] = useState("self");
  const [pickupLocation, setPickupLocation] = useState("Nsambya Road 472, Kampala");
  const [dateRange, setDateRange] = useState("Today 10:00 → Tomorrow 10:00");

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
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
        <Box sx={{ mx: 7, textAlign: "center" }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, letterSpacing: "-0.01em", color: "#FFFFFF" }}
          >
            EV rentals
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: "rgba(255,255,255,0.8)", display: "block" }}
          >
            Choose self-drive or chauffeur, then set dates
          </Typography>
        </Box>
      </Box>

      {/* Rental mode selection */}
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
          <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
            <Chip
              label="Self-drive"
              onClick={() => setModeSelection("self")}
              icon={<ElectricCarRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 28,
                bgcolor:
                  modeSelection === "self"
                    ? "primary.main"
                    : (t) =>
                        t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                color: modeSelection === "self" ? "#020617" : (t) => t.palette.text.primary,
                "& .MuiChip-icon": {
                  color: modeSelection === "self" ? "#020617" : "rgba(148,163,184,1)"
                }
              }}
            />
            <Chip
              label="With chauffeur"
              onClick={() => setModeSelection("chauffeur")}
              icon={<DirectionsCarFilledRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 28,
                bgcolor:
                  modeSelection === "chauffeur"
                    ? "primary.main"
                    : (t) =>
                        t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                color:
                  modeSelection === "chauffeur" ? "#020617" : (t) => t.palette.text.primary,
                "& .MuiChip-icon": {
                  color:
                    modeSelection === "chauffeur" ? "#020617" : "rgba(148,163,184,1)"
                }
              }}
            />
          </Stack>

          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            You can adjust these later on the summary screen.
          </Typography>
        </CardContent>
      </Card>

      {/* Where & when card */}
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
          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              color: (t) => t.palette.text.secondary,
              mb: 0.5,
              display: "block"
            }}
          >
            Pickup location
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PlaceRoundedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                </InputAdornment>
              )
            }}
            sx={{
              mb: 1.6,
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
                "&:hover fieldset": { borderColor: "primary.main" }
              }
            }}
          />

          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              color: (t) => t.palette.text.secondary,
              mb: 0.5,
              display: "block"
            }}
          >
            Dates & times
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonthRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
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
                    t.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": { borderColor: "primary.main" }
              }
            }}
          />

          <Typography
            variant="caption"
            sx={{ mt: 1.2, fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            You’ll pick your exact EV and confirm pricing on the next step.
          </Typography>
        </CardContent>
      </Card>

      {/* Popular durations */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}
        >
          Quick durations
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          {[
            "Today only",
            "Weekend (2–3 days)",
            "1 week",
            "2 weeks"
          ].map((label) => (
            <Chip
              key={label}
              label={label}
              size="small"
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 26,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)"
              }}
            />
          ))}
        </Stack>
      </Box>

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
        See available EV rentals
      </Button>
    </Box>
  );
}

export default function RiderScreen69RentalHomeEntryCanvas_v2() {
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
          <RentalHomeEntryScreen />
        </MobileShell>
      </Box>
    
  );
}
