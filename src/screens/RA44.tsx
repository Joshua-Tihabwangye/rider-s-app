import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import MobileShell from "../components/MobileShell";

function WhereToTodayAlternateScreen(): JSX.Element {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

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
        <Box sx={{ width: 32 }} />
      </Box>
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
