import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
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

function SearchingForDriverScreen() {
  const navigate = useNavigate();
  const [dots, setDots] = useState("...");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length === 3 ? "." : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 1.5,
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
              Searching for an EV driver{dots}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              Matching you with the nearest electric vehicle
            </Typography>
          </Box>
        </Box>
      </Box>

      <LinearProgress
        sx={{
          mb: 2.5,
          borderRadius: 999,
          height: 5,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#E5E7EB" : "rgba(15,23,42,1)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 999,
            bgcolor: "primary.main"
          }
        }}
      />

      {/* Map area */}
      <Box
        sx={{
          position: "relative",
          borderRadius: 3,
          overflow: "hidden",
          height: 260,
          mb: 2.5,
          background: (theme) =>
            theme.palette.mode === "light"
              ? "radial-gradient(circle at top, #BAE6FD 0, #E5E7EB 55%, #CBD5F5 100%)"
              : "radial-gradient(circle at top, rgba(15,118,205,0.5), #020617 60%, #020617 100%)"
        }}
      >
        {/* Grid */}
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

        {/* Pickup pin */}
        <Box
          sx={{
            position: "absolute",
            left: "20%",
            bottom: "24%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: "999px",
              bgcolor: "#22c55e",
              border: "2px solid white",
              boxShadow: "0 6px 14px rgba(15,23,42,0.6)"
            }}
          />
        </Box>

        {/* Destination pin */}
        <Box
          sx={{
            position: "absolute",
            right: "18%",
            top: "30%",
            transform: "translate(50%, -50%)"
          }}
        >
          <PlaceRoundedIcon
            sx={{
              fontSize: 30,
              color: "primary.main",
              filter: "drop-shadow(0 8px 16px rgba(15,23,42,0.8))"
            }}
          />
        </Box>

        {/* Dummy EVs circling area */}
        <Box
          sx={{
            position: "absolute",
            left: "30%",
            top: "40%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            gap: 1.5
          }}
        >
          <DirectionsCarFilledRoundedIcon
            sx={{ fontSize: 22, color: "#22c55e" }}
          />
          <DirectionsCarFilledRoundedIcon
            sx={{ fontSize: 20, color: "#22c55e", opacity: 0.7 }}
          />
        </Box>
      </Box>

      {/* Trip summary + cancel */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.5 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
          >
            Pickup in
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
          >
            Nsambya Road 472, Kampala
          </Typography>

          <Typography
            variant="caption"
            sx={{ mt: 0.75, fontSize: 11, color: (theme) => theme.palette.text.secondary }}
          >
            Destination
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, letterSpacing: "-0.01em" }}
          >
            Bugolobi Village, Kampala
          </Typography>
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="outlined"
        startIcon={<CancelRoundedIcon sx={{ fontSize: 18 }} />}
        sx={{
          borderRadius: 999,
          py: 1,
          fontSize: 14,
          fontWeight: 500,
          textTransform: "none",
          borderColor: "#EF4444",
          color: "#EF4444",
          mb: 1.5,
          "&:hover": {
            borderColor: "#DC2626",
            bgcolor: "rgba(248,113,113,0.06)"
          }
        }}
      >
        Cancel request
      </Button>

      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
      >
        You can cancel without a fee within the first 60 seconds, after which a
        small cancellation charge may apply.
      </Typography>
    </Box>
  );
}

export default function RiderScreen22SearchingForDriverCanvas_v2() {
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
          <SearchingForDriverScreen />
        </MobileShell>
      </Box>
    
  );
}
