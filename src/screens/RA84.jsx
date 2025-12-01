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
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

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

function AmbulanceLocationPatientDetailsScreen() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("Nsambya Road 472, Kampala");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [forWhom, setForWhom] = useState("me");
  const [notes, setNotes] = useState("");

  const canContinue =
    location.trim().length > 0 && patientPhone.trim().length > 0 && patientName.trim().length > 0;

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
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
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Confirm location & patient
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              We’ll use this to dispatch the nearest ambulance
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Location card */}
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
            Current location
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PlaceRoundedIcon sx={{ fontSize: 18, color: "#DC2626" }} />
                </InputAdornment>
              )
            }}
            sx={{
              mb: 1.25,
              "& .MuiOutlinedInput-root": {
                borderRadius: 999,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFF7F7" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(248,113,113,0.9)"
                      : "rgba(127,29,29,0.9)"
                },
                "&:hover fieldset": { borderColor: "#DC2626" }
              }
            }}
          />
          <Stack direction="row" spacing={1}>
            <Chip
              label="Use current GPS location"
              size="small"
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 26,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                color: (t) => t.palette.text.primary
              }}
            />
            <Chip
              label="Share live location"
              size="small"
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 26,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                color: (t) => t.palette.text.primary
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Patient details card */}
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
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
            <PersonRoundedIcon
              sx={{ fontSize: 18, color: (t) => t.palette.text.secondary }}
            />
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Patient details
            </Typography>
          </Stack>

          <TextField
            fullWidth
            size="small"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Patient full name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                </InputAdornment>
              )
            }}
            sx={{
              mb: 1.2,
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

          <TextField
            fullWidth
            size="small"
            value={patientPhone}
            onChange={(e) => setPatientPhone(e.target.value)}
            placeholder="Contact phone number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIphoneRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                </InputAdornment>
              )
            }}
            sx={{
              mb: 1.4,
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
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.5, display: "block" }}
          >
            This request is for
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 1.4, flexWrap: "wrap" }}>
            <Chip
              label="Me"
              size="small"
              onClick={() => setForWhom("me")}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 26,
                bgcolor:
                  forWhom === "me"
                    ? "primary.main"
                    : (t) =>
                        t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                color: forWhom === "me" ? "#020617" : (t) => t.palette.text.primary
              }}
            />
            <Chip
              label="Family / friend"
              size="small"
              onClick={() => setForWhom("other")}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 26,
                bgcolor:
                  forWhom === "other"
                    ? "primary.main"
                    : (t) =>
                        t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                color: forWhom === "other" ? "#020617" : (t) => t.palette.text.primary
              }}
            />
            <Chip
              label="Clinic / hospital"
              size="small"
              onClick={() => setForWhom("facility")}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 26,
                bgcolor:
                  forWhom === "facility"
                    ? "primary.main"
                    : (t) =>
                        t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                color:
                  forWhom === "facility" ? "#020617" : (t) => t.palette.text.primary
              }}
            />
          </Stack>

          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.5, display: "block" }}
          >
            Brief notes (optional)
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g. breathing difficulties, severe pain, pregnancy, etc."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DescriptionRoundedIcon
                    sx={{ fontSize: 18, color: "text.secondary", mt: 0.5 }}
                  />
                </InputAdornment>
              )
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
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
        Confirm location & find ambulance
      </Button>

      <Typography
        variant="caption"
        sx={{ mt: 1.2, fontSize: 11, color: (t) => t.palette.text.secondary }}
      >
        Only share enough information to help responders understand urgency.
        Detailed medical history can be shared directly with medical staff.
      </Typography>
    </Box>
  );
}

export default function RiderScreen84AmbulanceLocationPatientDetailsCanvas_v2() {
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
          <AmbulanceLocationPatientDetailsScreen />
        </MobileShell>
      </Box>
    
  );
}
