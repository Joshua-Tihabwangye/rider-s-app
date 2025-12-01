import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import {
  
  Box,
  Avatar,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Stack
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
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

function WhereToTodayAlternateScreen() {
  const [query, setQuery] = useState("");

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Top bar */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
              fontSize: 18,
              fontWeight: 600,
              color: "#020617"
            }}
          >
            RZ
          </Avatar>
          <Box>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Good afternoon,
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
              Where to today?
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" aria-label="Notifications">
          <NotificationsNoneRoundedIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Box>

      {/* Main search */}
      <TextField
        fullWidth
        size="medium"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter destination, place or address"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon sx={{ fontSize: 22, color: "text.secondary" }} />
            </InputAdornment>
          )
        }}
        sx={{
          mb: 2.5,
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

      {/* Quick shortcuts */}
      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}
      >
        Quick shortcuts
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 2.5, flexWrap: "wrap" }}>
        <Chip
          icon={<HomeRoundedIcon sx={{ fontSize: 16 }} />}
          label="Home"
          sx={{
            borderRadius: 999,
            fontSize: 11,
            height: 28,
            bgcolor: (t) =>
              t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
            color: (t) => t.palette.text.primary
          }}
        />
        <Chip
          icon={<ApartmentRoundedIcon sx={{ fontSize: 16 }} />}
          label="Work"
          sx={{
            borderRadius: 999,
            fontSize: 11,
            height: 28,
            bgcolor: (t) =>
              t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
            color: (t) => t.palette.text.primary
          }}
        />
        <Chip
          icon={<SchoolRoundedIcon sx={{ fontSize: 16 }} />}
          label="School runs"
          sx={{
            borderRadius: 999,
            fontSize: 11,
            height: 28,
            bgcolor: (t) =>
              t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
            color: (t) => t.palette.text.primary
          }}
        />
        <Chip
          icon={<AccessTimeRoundedIcon sx={{ fontSize: 16 }} />}
          label="Recent places"
          sx={{
            borderRadius: 999,
            fontSize: 11,
            height: 28,
            bgcolor: (t) =>
              t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
            color: (t) => t.palette.text.primary
          }}
        />
      </Stack>

      {/* Suggestion text */}
      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.5, display: "block" }}
      >
        Pro tip
      </Typography>
      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}
      >
        Save your home, work and school locations once, and book EV rides even
        faster next time.
      </Typography>
    </Box>
  );
}

export default function RiderScreen44WhereToTodayAlternateCanvas_v2() {
      return (
    
      
      <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (t) => t.palette.background.default }}>
        

        <DarkModeToggle />

        

        <MobileShell>
          <WhereToTodayAlternateScreen />
        </MobileShell>
      </Box>
    
  );
}
