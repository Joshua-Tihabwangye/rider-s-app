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
  Card,
  CardContent,
  Tabs,
  Tab
} from "@mui/material";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
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
              ? "radial-gradient(circle at top, #E0F2FE 0, #F3F4F6 55%, #F3F4F6 100%)"
              : "radial-gradient(circle at top, rgba(15,118,205,0.6), #020617 60%, #020617 100%)"
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
          <Box sx={{ flex: 1, overflowY: "auto", paddingBottom: "80px" }}>
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

function CommonPlaceCard({ icon, label, address }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        bgcolor: (theme) =>
          theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: (theme) =>
          theme.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.8)",
        mb: 1.5
      }}
    >
      <CardContent sx={{ py: 1.5, px: 1.75 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: (theme) =>
                theme.palette.mode === "light"
                  ? "#EFF6FF"
                  : "rgba(248,250,252,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              {label}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              {address}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function EnterDestinationMainScreen() {
  const [tab, setTab] = useState("common");

  const handleTabChange = (event, value) => {
    setTab(value);
  };

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
        <IconButton
          size="small"
          aria-label="Open menu"
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
          <MenuRoundedIcon sx={{ fontSize: 22 }} />
        </IconButton>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
        >
          Where to today?
        </Typography>
        <Box sx={{ width: 32 }} />
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Where to?"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon sx={{ fontSize: 20, color: "text.secondary" }} />
            </InputAdornment>
          )
        }}
        sx={{
          mb: 2,
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

      {/* Map preview */}
      <Box
        sx={{
          mb: 3,
          borderRadius: 3,
          height: 170,
          position: "relative",
          overflow: "hidden",
          background: (theme) =>
            theme.palette.mode === "light"
              ? "radial-gradient(circle at top, #BAE6FD 0, #EFF6FF 55%, #DBEAFE 100%)"
              : "radial-gradient(circle at top, rgba(15,118,205,0.6), rgba(15,23,42,1))"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.18,
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.35) 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: "24%",
            top: "60%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: "999px",
                bgcolor: "#3b82f6",
                border: "2px solid white"
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: -8,
                borderRadius: "999px",
                border: "1px solid rgba(59,130,246,0.5)"
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            position: "absolute",
            right: "18%",
            top: "26%",
            transform: "translate(50%, -50%)"
          }}
        >
          <PlaceRoundedIcon
            sx={{
              fontSize: 28,
              color: "primary.main",
              filter: "drop-shadow(0 4px 8px rgba(15,23,42,0.9))"
            }}
          />
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          minHeight: 36,
          mb: 1.5,
          "& .MuiTab-root": {
            minHeight: 36,
            fontSize: 12,
            textTransform: "none",
            color: "rgba(148,163,184,1)"
          },
          "& .Mui-selected": {
            color: "#111827"
          },
          "& .MuiTabs-indicator": {
            height: 2,
            borderRadius: 999,
            bgcolor: "primary.main"
          }
        }}
      >
        <Tab value="common" label="Common Places" />
        <Tab value="commutes" label="Daily Commutes" />
        <Tab value="upcoming" label="Upcoming Rides" />
      </Tabs>

      {/* Tab content */}
      <Box sx={{ mt: 1 }}>
        {tab === "common" && (
          <>
            <CommonPlaceCard
              icon={<HomeRoundedIcon sx={{ fontSize: 20, color: "#F97316" }} />}
              label="Home"
              address="12, JJ Apartments, New Street, Kampala"
            />
            <CommonPlaceCard
              icon={
                <ApartmentRoundedIcon sx={{ fontSize: 20, color: "#F97316" }} />
              }
              label="Office"
              address="12, JJ Apartments, New Street, Kampala"
            />
          </>
        )}

        {tab === "commutes" && (
          <Typography
            variant="caption"
            sx={{
              mt: 4,
              display: "block",
              textAlign: "center",
              color: (theme) => theme.palette.text.secondary
            }}
          >
            No daily commutes yet. Your frequent EV routes will show here.
          </Typography>
        )}

        {tab === "upcoming" && (
          <Typography
            variant="caption"
            sx={{
              mt: 4,
              display: "block",
              textAlign: "center",
              color: (theme) => theme.palette.text.secondary
            }}
          >
            No upcoming rides scheduled. Tap the search bar above to book.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default function RiderScreen2EnterDestinationCanvas_v2() {
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
          <EnterDestinationMainScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
