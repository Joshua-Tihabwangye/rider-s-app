import React, { useState } from "react";
import {
  
  Box,
  Paper,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  List,
  ListItemText,
  ListItemButton
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";

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
  }
];

function AddStopSearchOverlayScreen(): React.JSX.Element {
  const [query, setQuery] = useState("");

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
          maxHeight: "78vh",
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
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Search for a place to add as stop C
            </Typography>
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
                    t.palette.mode === "light" ? "rgba(209,213,219,0.9)" : "rgba(51,65,85,0.9)"
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
              {filtered.map((r, index) => (
                <ListItemButton key={index} sx={{ px: 2.5 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PlaceRoundedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                        <Typography
                          variant="body2"
                          sx={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.01em" }}
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
              ))}
            </List>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default function RiderScreen41AddStopSearchOverlayCanvas_v2() {
      return (
    
      
      <Box sx={{ position: "relative", minHeight: "100vh" }}>
        

        <AddStopSearchOverlayScreen />
      </Box>
    
  );
}
