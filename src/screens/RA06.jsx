import React from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
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

function PickDestinationMapScreen() {
  const navigate = useNavigate();
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
              Confirm drop location
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              Drag the map to fine-tune where your driver will drop you
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Map area */}
      <Box
        sx={{
          position: "relative",
          borderRadius: 3,
          overflow: "hidden",
          height: 360,
          mb: 2.5,
          background: (theme) =>
            theme.palette.mode === "light"
              ? "radial-gradient(circle at top, #BAE6FD 0, #E5E7EB 55%, #CBD5F5 100%)"
              : "radial-gradient(circle at top, rgba(15,118,205,0.5), #020617 60%, #020617 100%)"
        }}
      >
        {/* Grid overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.22,
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.5) 1px, transparent 1px)",
            backgroundSize: "34px 34px"
          }}
        />

        {/* Accuracy circle */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "46%",
            transform: "translate(-50%, -50%)",
            width: 140,
            height: 140,
            borderRadius: "999px",
            border: "1px dashed rgba(59,130,246,0.6)",
            bgcolor: "rgba(59,130,246,0.08)"
          }}
        />

        {/* Center pin */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "40%",
            transform: "translate(-50%, -100%)"
          }}
        >
          <PlaceRoundedIcon
            sx={{
              fontSize: 34,
              color: "primary.main",
              filter: "drop-shadow(0 8px 16px rgba(15,23,42,0.8))"
            }}
          />
        </Box>

        {/* Current location icon bottom-left */}
        <Box
          sx={{
            position: "absolute",
            left: 16,
            bottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            bgcolor: (theme) =>
              theme.palette.mode === "light"
                ? "rgba(255,255,255,0.96)"
                : "rgba(15,23,42,0.96)",
            borderRadius: 999,
            px: 1.2,
            py: 0.4,
            boxShadow: "0 10px 30px rgba(15,23,42,0.4)"
          }}
        >
          <MyLocationRoundedIcon sx={{ fontSize: 18, color: "#3b82f6" }} />
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
          >
            Recenter
          </Typography>
        </Box>
      </Box>

      {/* Bottom sheet with address + CTA */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
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
              mb: 0.75
            }}
          >
            Drop-off location
          </Typography>

          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
          >
            New School, JJ Street, Kampala
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              color: (theme) => theme.palette.text.secondary,
              mb: 1.5,
              display: "block"
            }}
          >
            Drag the map if you need the driver to drop you slightly ahead or
            behind this point.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 0.5,
              borderRadius: 999,
              py: 1,
              fontSize: 15,
              fontWeight: 600,
              textTransform: "none",
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "#06e29a" }
            }}
          >
            Confirm drop location
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default function RiderScreen6PickDestinationMapCanvas_v2() {
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
          <PickDestinationMapScreen />
        </MobileShell>
      </Box>
    
  );
}
