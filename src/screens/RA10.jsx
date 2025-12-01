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
  Button,
  Stack
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import MobileShell from "../components/MobileShell";
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

function SwitchRiderChooserScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("me");

  const options = [
    {
      id: "me",
      label: "Ride for me",
      description: "Use my account and details",
      icon: <PersonRoundedIcon sx={{ fontSize: 26 }} />,
      chip: "Default"
    },
    {
      id: "contact",
      label: "Ride for contact",
      description: "Pick someone from my contacts",
      icon: <GroupRoundedIcon sx={{ fontSize: 26 }} />,
      chip: "Family & friends"
    },
    {
      id: "other",
      label: "Ride for someone else",
      description: "Enter name & phone manually",
      icon: <PhoneIphoneRoundedIcon sx={{ fontSize: 26 }} />,
      chip: "One-off"
    }
  ];

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
            onClick={() => navigate(-1)}
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
              Who is this ride for?
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              Choose the rider before you confirm your trip
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Options */}
      <Stack spacing={1.75} sx={{ mb: 2.5 }}>
        {options.map((opt) => {
          const isActive = selected === opt.id;
          return (
            <Card
              key={opt.id}
              elevation={0}
              onClick={() => setSelected(opt.id)}
              sx={{
                borderRadius: 2,
                cursor: "pointer",
                transition: "all 0.15s ease",
                bgcolor: (theme) =>
                  theme.palette.mode === "light"
                    ? isActive
                      ? "#ECFDF5"
                      : "#FFFFFF"
                    : isActive
                    ? "rgba(15,118,110,0.32)"
                    : "rgba(15,23,42,0.98)",
                border: (theme) =>
                  isActive
                    ? "1px solid #03CD8C"
                    : theme.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)"
              }}
            >
              <CardContent sx={{ px: 1.75, py: 1.6 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1.5
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 999,
                        bgcolor: (theme) =>
                          theme.palette.mode === "light"
                            ? "#F3F4F6"
                            : "rgba(15,23,42,1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {opt.icon}
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
                      >
                        {opt.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: 11,
                          color: (theme) => theme.palette.text.secondary
                        }}
                      >
                        {opt.description}
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    label={opt.chip}
                    size="small"
                    sx={{
                      borderRadius: 999,
                      fontSize: 10,
                      height: 22,
                      bgcolor: isActive
                        ? "primary.main"
                        : (theme) =>
                            theme.palette.mode === "light"
                              ? "#F3F4F6"
                              : "rgba(15,23,42,1)",
                      color: isActive ? "#020617" : "rgba(107,114,128,1)"
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      {/* Current selection */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px dashed rgba(148,163,184,0.9)"
              : "1px dashed rgba(71,85,105,1)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.4 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: (theme) => theme.palette.text.secondary,
              mb: 0.5
            }}
          >
            Selected rider
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, color: (theme) => theme.palette.text.primary }}
          >
            {selected === "me"
              ? "Me (my EVzone profile)"
              : selected === "contact"
              ? "From my saved contacts"
              : "Someone else (manual details)"}
          </Typography>
        </CardContent>
      </Card>

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
        Continue
      </Button>
    </Box>
  );
}

export default function RiderScreen10SwitchRiderChooserCanvas_v2() {
      return (
    
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (theme) => theme.palette.background.default
        }}
      >
        

        <DarkModeToggle />

        

        <MobileShell>
          <SwitchRiderChooserScreen />
        </MobileShell>
      </Box>
    
  );
}
