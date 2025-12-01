import React, { useState, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  Box,
  Paper,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Chip,
  Stack
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: { main: "#03CD8C" },
    secondary: { main: "#F77F00" },
    ...(mode === "light"
      ? {
          background: { default: "rgba(15,23,42,0.25)", paper: "#FFFFFF" },
          text: { primary: "#0F172A", secondary: "#6B7280" },
          divider: "rgba(148,163,184,0.4)"
        }
      : {
          background: { default: "rgba(15,23,42,0.75)", paper: "#020617" },
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

const MOCK_RESULTS = [
  {
    primary: "Bugolobi Village",
    secondary: "Spring Road, Kampala"
  },
  {
    primary: "Acacia Mall",
    secondary: "Kisakye Road, Kololo"
  },
  {
    primary: "Nsambya Hospital",
    secondary: "Nsambya Road, Kampala"
  },
  {
    primary: "Kansanga Market",
    secondary: "Ggaba Road, Kampala"
  }
];

function AddStopSearchResultsScreen() {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);

  const filtered = !query
    ? MOCK_RESULTS
    : MOCK_RESULTS.filter((r) =>
        r.primary.toLowerCase().includes(query.toLowerCase()) ||
        r.secondary.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        bgcolor: (t) => t.palette.background.default
      }}
    >
      {/* Dimmed backdrop */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          bgcolor: (t) =>
            t.palette.mode === "light"
              ? "rgba(15,23,42,0.35)"
              : "rgba(15,23,42,0.75)",
          backdropFilter: "blur(6px)"
        }}
      />

      {/* Bottom sheet */}
      <Paper
        elevation={8}
        sx={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 430,
          borderRadius: "18px 18px 0 0",
          bgcolor: (t) => t.palette.background.paper,
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Handle bar */}
        <Box sx={{ pt: 1.25, pb: 0.75, display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              width: 40,
              height: 4,
              borderRadius: 999,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#E5E7EB" : "rgba(148,163,184,0.5)"
            }}
          />
        </Box>

        {/* Header */}
        <Box
          sx={{
            px: 2.5,
            pb: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Add a stop
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.2 }}>
              <Chip
                size="small"
                label="Stop C"
                sx={{
                  borderRadius: 999,
                  fontSize: 10,
                  height: 22,
                  bgcolor: "primary.main",
                  color: "#020617"
                }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Tap a location below to set as Stop C
              </Typography>
            </Stack>
          </Box>
          <IconButton size="small" aria-label="Close">
            <CloseRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        {/* Search */}
        <Box sx={{ px: 2.5, pb: 1.5 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search for a location"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ fontSize: 20, color: "text.secondary" }} />
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
                    t.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": { borderColor: "primary.main" }
              }
            }}
          />
        </Box>

        {/* Results list */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {filtered.length === 0 ? (
            <Typography
              variant="caption"
              sx={{
                px: 2.5,
                pb: 2,
                display: "block",
                fontSize: 11,
                color: (t) => t.palette.text.secondary
              }}
            >
              No results found. Try another location name.
            </Typography>
          ) : (
            <List disablePadding>
              {filtered.map((r, index) => {
                const isSelected = selectedIndex === index;
                return (
                  <ListItemButton
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    sx={{
                      px: 2.5,
                      py: 1.1,
                      bgcolor: isSelected
                        ? "rgba(3,205,140,0.12)"
                        : "transparent"
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <PlaceRoundedIcon
                            sx={{
                              fontSize: 18,
                              color: isSelected ? "primary.main" : "text.secondary"
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: 13,
                              fontWeight: 500,
                              letterSpacing: "-0.01em"
                            }}
                          >
                            {r.primary}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                        >
                          {r.secondary}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                );
              })}
            </List>
          )}
        </Box>

        {/* Footer hint */}
        <Box sx={{ px: 2.5, py: 1.25 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            Once selected, this stop will be added to your route as Stop C in
            the multi-stop planner.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default function RiderScreen43AddStopSearchResultsCanvas_v2() {
  const [mode, setMode] = useState("light");
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ position: "relative", minHeight: "100vh" }}>
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

        <AddStopSearchResultsScreen />
      </Box>
    </ThemeProvider>
  );
}
