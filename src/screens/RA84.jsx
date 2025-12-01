import React, { useState, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  Box,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
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

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

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

const NAV_TABS = [
  { value: "home", label: "Home", icon: <HomeOutlinedIcon /> },
  { value: "rides", label: "Rides", icon: <DirectionsCarFilledRoundedIcon /> },
  { value: "deliveries", label: "Deliveries", icon: <LocalShippingRoundedIcon /> },
  { value: "wallet", label: "Wallet", icon: <ShoppingCartRoundedIcon /> },
  { value: "more", label: "More", icon: <MoreHorizRoundedIcon /> }
];

function MobileShell({ children, activeTab = "home", onTabChange }) {
  const [navValue, setNavValue] = useState(activeTab);

  const handleChange = (event, newValue) => {
    setNavValue(newValue);
    if (onTabChange) onTabChange(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        bgcolor: (t) => t.palette.background.default
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 430,
          minHeight: "100vh",
          borderRadius: { xs: 0, sm: 2 },
          overflow: "hidden",
          bgcolor: (t) => t.palette.background.default,
          backgroundImage: (t) =>
            t.palette.mode === "light"
              ? "radial-gradient(circle at top, #FEE2E2 0, #F3F4F6 55%, #F3F4F6 100%)"
              : "radial-gradient(circle at top, #450a0a 0, #020617 60%, #020617 100%)"
        }}
      >
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            color: (t) => t.palette.text.primary
          }}
        >
          <Box sx={{ flex: 1, overflowY: "auto", paddingBottom: "88px" }}>{children}</Box>
          <Box
            sx={{
              position: "fixed",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: 0,
              width: "100%",
              maxWidth: 430
            }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px 16px 0 0",
                overflow: "hidden",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "rgba(255,255,255,0.98)" : "rgba(15,23,42,0.96)",
                backdropFilter: "blur(22px)",
                borderTop: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(229,231,235,1)"
                    : "1px solid rgba(30,64,175,0.6)",
                boxShadow:
                  "0 -14px 40px rgba(15,23,42,0.26), 0 -1px 0 rgba(148,163,184,0.38)"
              }}
            >
              <BottomNavigation
                value={navValue}
                onChange={handleChange}
                sx={{
                  bgcolor: "transparent",
                  py: 0.3,
                  px: 1,
                  "& .MuiBottomNavigationAction-root": {
                    color: (t) =>
                      t.palette.mode === "light" ? "#9CA3AF" : "rgba(148,163,184,0.9)",
                    minWidth: 0,
                    paddingY: 0.5,
                    paddingX: 0.5,
                    maxWidth: 90
                  },
                  "& .Mui-selected": { color: "#03CD8C" },
                  "& .MuiBottomNavigationAction-label": {
                    fontSize: 11,
                    fontWeight: 500,
                    "&.Mui-selected": { fontSize: 12, fontWeight: 600 }
                  }
                }}
              >
                {NAV_TABS.map((tab) => (
                  <BottomNavigationAction
                    key={tab.value}
                    value={tab.value}
                    label={tab.label}
                    icon={tab.icon}
                  />
                ))}
              </BottomNavigation>
            </Paper>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

function AmbulanceLocationPatientDetailsScreen() {
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
  const [mode, setMode] = useState("light");
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (t) => t.palette.background.default
        }}
      >
        <IconButton
          size="small"
          onClick={() => setMode((prev) => (prev === "light" ? "dark" : "light"))}
          sx={{
            position: "fixed",
            top: 10,
            right: 10,
            zIndex: 50,
            bgcolor: (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(30,64,175,0.7)",
            boxShadow: 3
          }}
          aria-label="Toggle light/dark mode"
        >
          {mode === "light" ? (
            <DarkModeRoundedIcon sx={{ fontSize: 18 }} />
          ) : (
            <LightModeRoundedIcon sx={{ fontSize: 18 }} />
          )}
        </IconButton>

        <MobileShell activeTab="home">
          <AmbulanceLocationPatientDetailsScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
