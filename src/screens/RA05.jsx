import React, { useState, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  Box,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  IconButton,
  TextField,
  InputAdornment,
  Typography,
  Chip,
  Card,
  CardContent,
  Button,
  Stack
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: { main: "#03CD8C" },
    secondary: { main: "#F77F00" },
    ...(mode === "light"
      ? {
          background: {
            default: "#F3F4F6",
            paper: "#FFFFFF"
          },
          text: {
            primary: "#0F172A",
            secondary: "#6B7280"
          },
          divider: "rgba(148,163,184,0.4)"
        }
      : {
          background: {
            default: "#020617",
            paper: "#020617"
          },
          text: {
            primary: "#F9FAFB",
            secondary: "#A6A6A6"
          },
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

function MobileShell({ children, activeTab = "rides", onTabChange }) {
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
        bgcolor: (theme) => theme.palette.background.default
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
          bgcolor: (theme) => theme.palette.background.default,
          backgroundImage: (theme) =>
            theme.palette.mode === "light"
              ? "radial-gradient(circle at top, #E5F9F1 0, #F3F4F6 55%, #F3F4F6 100%)"
              : "radial-gradient(circle at top, #020617 0, #020617 60%, #020617 100%)"
        }}
      >
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            color: (theme) => theme.palette.text.primary
          }}
        >
          <Box sx={{ flex: 1, overflowY: "auto", paddingBottom: "88px" }}>
            {children}
          </Box>

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
                bgcolor: (theme) =>
                  theme.palette.mode === "light"
                    ? "rgba(255,255,255,0.98)"
                    : "rgba(15,23,42,0.96)",
                backdropFilter: "blur(22px)",
                borderTop: (theme) =>
                  theme.palette.mode === "light"
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
                    color: (theme) =>
                      theme.palette.mode === "light"
                        ? "#9CA3AF"
                        : "rgba(148,163,184,0.9)",
                    minWidth: 0,
                    paddingY: 0.5,
                    paddingX: 0.5,
                    maxWidth: 90
                  },
                  "& .Mui-selected": {
                    color: "#03CD8C"
                  },
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

function TripSetupScreen() {
  const [passengers, setPassengers] = useState(1);
  const [tripType, setTripType] = useState("oneway");

  const passengerOptions = [1, 2, 3, 4];

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2.5,
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
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
              border: (theme) =>
                theme.palette.mode === "light"
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
              Plan your trip
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              Choose pickup, destination, seats and trip type
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Location fields */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: (theme) => theme.palette.text.secondary,
              mb: 1
            }}
          >
            Pickup & destination
          </Typography>

          <TextField
            fullWidth
            size="small"
            variant="outlined"
            defaultValue="Current location"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MyLocationRoundedIcon
                    sx={{ fontSize: 18, color: "primary.main" }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    size="small"
                    sx={{ fontSize: 11, textTransform: "none", px: 0 }}
                  >
                    Change
                  </Button>
                </InputAdornment>
              )
            }}
            sx={{
              mb: 1.5,
              "& .MuiOutlinedInput-root": {
                borderRadius: 999,
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (theme) =>
                    theme.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": {
                  borderColor: "primary.main"
                }
              }
            }}
          />

          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Where to?"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PlaceRoundedIcon
                    sx={{ fontSize: 20, color: "text.secondary" }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <SearchRoundedIcon
                    sx={{ fontSize: 20, color: "text.secondary" }}
                  />
                </InputAdornment>
              )
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 999,
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (theme) =>
                    theme.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": {
                  borderColor: "primary.main"
                }
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Passenger selection */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <GroupsRoundedIcon
                sx={{ fontSize: 20, color: "primary.main" }}
              />
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  Passengers
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
                >
                  Tell us how many people are riding
                </Typography>
              </Box>
            </Box>
          </Box>

          <Stack direction="row" spacing={1} sx={{ mt: 1.75, flexWrap: "wrap" }}>
            {passengerOptions.map((pax) => (
              <Chip
                key={pax}
                label={`${pax} ${pax === 1 ? "Person" : "People"}`}
                size="small"
                onClick={() => setPassengers(pax)}
                sx={{
                  px: 0.5,
                  height: 28,
                  borderRadius: 999,
                  fontSize: 11,
                  bgcolor:
                    passengers === pax
                      ? "primary.main"
                      : (theme) =>
                          theme.palette.mode === "light"
                            ? "#F3F4F6"
                            : "rgba(15,23,42,0.96)",
                  color:
                    passengers === pax
                      ? "#020617"
                      : (theme) => theme.palette.text.primary
                }}
              />
            ))}
            <Chip
              label={"5+"}
              size="small"
              sx={{
                height: 28,
                borderRadius: 999,
                fontSize: 11,
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                color: (theme) => theme.palette.text.primary
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Trip type selection */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: (theme) => theme.palette.text.secondary,
              mb: 1.25
            }}
          >
            Trip type
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 1
            }}
          >
            {[
              { id: "oneway", label: "One-way" },
              { id: "round", label: "Round trip" },
              { id: "later", label: "Ride later" }
            ].map((opt) => {
              const isActive = tripType === opt.id;
              return (
                <Button
                  key={opt.id}
                  variant={isActive ? "contained" : "outlined"}
                  onClick={() => setTripType(opt.id)}
                  sx={{
                    borderRadius: 999,
                    fontSize: 12,
                    py: 0.7,
                    textTransform: "none",
                    bgcolor: isActive
                      ? "primary.main"
                      : (theme) =>
                          theme.palette.mode === "light"
                            ? "#F9FAFB"
                            : "rgba(15,23,42,0.96)",
                    color: isActive
                      ? "#020617"
                      : (theme) => theme.palette.text.primary,
                    borderColor: isActive
                      ? "primary.main"
                      : (theme) =>
                          theme.palette.mode === "light"
                            ? "rgba(209,213,219,0.9)"
                            : "rgba(51,65,85,0.9)"
                  }}
                >
                  {opt.label}
                </Button>
              );
            })}
          </Box>

          <Typography
            variant="caption"
            sx={{
              mt: 1.5,
              fontSize: 11,
              color: (theme) => theme.palette.text.secondary
            }}
          >
            You can set exact date and time on the next step when you choose
            "Ride later".
          </Typography>
        </CardContent>
      </Card>

      {/* Hint + CTA */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <DirectionsCarFilledRoundedIcon
            sx={{ fontSize: 18, color: "primary.main" }}
          />
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
          >
            All options are fully electric vehicles.
          </Typography>
        </Box>
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
          "&:hover": { bgcolor: "#06e29a" }
        }}
      >
        Continue
      </Button>
    </Box>
  );
}

export default function RiderScreen5TripSetupCanvas_v2() {
  const [mode, setMode] = useState("light");
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (theme) => theme.palette.background.default
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
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (theme) =>
              theme.palette.mode === "light"
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

        <MobileShell activeTab="rides">
          <TripSetupScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
