import React from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Button
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
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

function ActiveDeliveryWithCancelScreen() {
  const navigate = useNavigate();
  const trackingId = "DLV-2025-10-07-001";
  const eta = "18 min";
  const distance = "8.2 km";

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
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Active delivery
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Track your parcel or cancel if needed
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Map with courier location */}
      <Box
        sx={{
          position: "relative",
          borderRadius: 3,
          overflow: "hidden",
          height: 220,
          mb: 2.5,
          background: (t) =>
            t.palette.mode === "light"
              ? "radial-gradient(circle at top, #BAE6FD 0, #E5E7EB 55%, #CBD5F5 100%)"
              : "radial-gradient(circle at top, rgba(15,118,205,0.5), #020617 60%, #020617 100%)"
        }}
      >
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
            left: "16%",
            bottom: "22%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <MyLocationRoundedIcon
            sx={{ fontSize: 22, color: "#22c55e", filter: "drop-shadow(0 6px 12px rgba(15,23,42,0.7))" }}
          />
        </Box>

        {/* Courier current position */}
        <Box
          sx={{
            position: "absolute",
            left: "46%",
            top: "48%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <LocalShippingRoundedIcon
            sx={{ fontSize: 26, color: "primary.main", filter: "drop-shadow(0 6px 14px rgba(15,23,42,0.8))" }}
          />
        </Box>

        {/* Destination pin */}
        <Box
          sx={{
            position: "absolute",
            right: "18%",
            top: "28%",
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
      </Box>

      {/* Delivery summary */}
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
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1.5}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Tracking ID
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                {trackingId}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Groceries from Nsambya Market
              </Typography>
            </Box>
            <Stack spacing={0.7} alignItems="flex-end">
              <Chip
                size="small"
                icon={<AccessTimeRoundedIcon sx={{ fontSize: 14 }} />}
                label={`ETA ${eta}`}
                sx={{
                  borderRadius: 999,
                  fontSize: 11,
                  height: 24,
                  bgcolor: "rgba(34,197,94,0.12)",
                  color: "#16A34A"
                }}
              />
              <Chip
                size="small"
                label={distance}
                sx={{
                  borderRadius: 999,
                  fontSize: 10,
                  height: 22,
                  bgcolor: (t) =>
                    t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                  color: (t) => t.palette.text.primary
                }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Cancel section */}
      <Button
        fullWidth
        variant="outlined"
        startIcon={<CancelRoundedIcon sx={{ fontSize: 18 }} />}
        sx={{
          borderRadius: 999,
          py: 1,
          fontSize: 14,
          fontWeight: 600,
          textTransform: "none",
          borderColor: "#EF4444",
          color: "#EF4444",
          mb: 1.25,
          "&:hover": {
            borderColor: "#DC2626",
            bgcolor: "rgba(248,113,113,0.06)"
          }
        }}
      >
        Cancel delivery
      </Button>

      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
      >
        You can cancel without a fee until the courier picks up your parcel. If
        the parcel has already been picked up, a small cancellation charge may
        apply.
      </Typography>
    </Box>
  );
}

export default function RiderScreen61ActiveDeliveryWithCancelCanvas_v2() {
      return (
    
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (t) => t.palette.background.default
        }}
      >
        

        <DarkModeToggle />

        

        <MobileShell>
          <ActiveDeliveryWithCancelScreen />
        </MobileShell>
      </Box>
    
  );
}
