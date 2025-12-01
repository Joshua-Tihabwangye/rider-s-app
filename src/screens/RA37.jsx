import React from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Divider
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
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

function CompletedTripSummaryScreen() {
  const navigate = useNavigate();
  const total = 14500;
  const base = 9000;
  const distance = 3500;
  const time = 1500;
  const service = 500;
  const discount = 1500;

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
              Trip details
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Full breakdown for this EV ride
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Map snapshot */}
      <Box
        sx={{
          position: "relative",
          borderRadius: 3,
          overflow: "hidden",
          height: 180,
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

        <Box
          sx={{
            position: "absolute",
            left: "18%",
            bottom: "22%",
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
      </Box>

      {/* Fare breakdown */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
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
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Total paid
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                UGX {total.toLocaleString()}
              </Typography>
            </Box>
            <Chip
              icon={<DirectionsCarFilledRoundedIcon sx={{ fontSize: 16 }} />}
              label="EV ride • 0g CO₂"
              size="small"
              sx={{
                borderRadius: 999,
                fontSize: 10,
                height: 24,
                bgcolor: "rgba(34,197,94,0.1)",
                color: "#16A34A"
              }}
            />
          </Box>

          <Divider sx={{ mb: 1.5, borderColor: (t) => t.palette.divider }} />

          <Stack spacing={0.6}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                Base fare
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                UGX {base.toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                Distance (7.9 km)
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                UGX {distance.toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                Time (22 min)
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                UGX {time.toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                Service fee
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                UGX {service.toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                Promo / discount
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11, color: "#16A34A" }}>
                -UGX {discount.toLocaleString()}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 1.25, borderColor: (t) => t.palette.divider }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}
            >
              Total
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              UGX {total.toLocaleString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Route & time summary */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.6 }}>
          <Box sx={{ mb: 1.1 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              From
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, letterSpacing: "-0.01em" }}
            >
              Nsambya Road 472, Kampala
            </Typography>
          </Box>
          <Box sx={{ mb: 1.1 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              To
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, letterSpacing: "-0.01em" }}
            >
              Bugolobi Village, Kampala
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Stack direction="row" spacing={0.75} alignItems="center">
              <AccessTimeRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                22 min (17:08 – 17:30)
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <RouteRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                7.9 km
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Receipt & issue actions */}
      <Stack direction="row" spacing={1.25} sx={{ mb: 1.5 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<ReceiptLongRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{
            borderRadius: 999,
            py: 0.9,
            fontSize: 13,
            textTransform: "none"
          }}
        >
          Download receipt
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<FlagRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{
            borderRadius: 999,
            py: 0.9,
            fontSize: 13,
            textTransform: "none",
            borderColor: "#F97316",
            color: "#EA580C",
            "&:hover": {
              borderColor: "#EA580C",
              bgcolor: "rgba(248,153,56,0.06)"
            }
          }}
        >
          Report an issue
        </Button>
      </Stack>

      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
      >
        You can always find this trip again from Rides → History if you need
        the details later.
      </Typography>
    </Box>
  );
}

export default function RiderScreen37CompletedTripSummaryCanvas_v2() {
      return (
    
      
      <Box
        sx={{ position: "relative", minHeight: "100vh", bgcolor: (t) => t.palette.background.default }}
      >
        

        <DarkModeToggle />

        

        <MobileShell>
          <CompletedTripSummaryScreen />
        </MobileShell>
      </Box>
    
  );
}
