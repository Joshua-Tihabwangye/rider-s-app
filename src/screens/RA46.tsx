import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MobileShell from "../components/MobileShell";

function RideDetailsVariant2Screen(): React.JSX.Element {
  const navigate = useNavigate();
  const fareEstimate = "UGX 14,500";
  const eta = "16 min";
  const distance = "6.2 km";

  // For now, always allow confirming; hook this into validation later if needed
  const canContinue = true;

  return (
    <Box sx={{ px: 2.5, pt: 2.25, pb: 3 }}>
      {/* Green Header */}
        <Box sx={{ bgcolor: "#03CD8C", mx: -2.5, px: 7, mt: -2.5, pt: 2, pb: 2, mb: 2, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              position: "absolute",
              left: 20,
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "#FFFFFF",
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" }
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, letterSpacing: "-0.01em", color: "#FFFFFF" }}
          >
            Ride details
          </Typography>
        </Box>


      {/* Top summary strip */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
          border: (t) =>
            t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.4 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Estimated fare
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                {fareEstimate}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                size="small"
                icon={<DirectionsCarFilledRoundedIcon sx={{ fontSize: 14 }} />}
                label="Eco EV"
                sx={{
                  borderRadius: 999,
                  fontSize: 11,
                  height: 24,
                  bgcolor: (t) =>
                    t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                  color: (t) => t.palette.text.primary
                }}
              />
              <Chip
                size="small"
                icon={<ElectricCarRoundedIcon sx={{ fontSize: 14 }} />}
                label="100% electric"
                sx={{
                  borderRadius: 999,
                  fontSize: 11,
                  height: 24,
                  bgcolor: "rgba(34,197,94,0.1)",
                  color: "#16A34A"
                }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Map snapshot */}
      <Box
        sx={{
          position: "relative",
          borderRadius: 3,
          overflow: "hidden",
          height: 160,
          mb: 2,
          background: (t) =>
            t.palette.mode === "light"
              ? "radial-gradient(circle at top, rgba(3,205,140,0.15) 0, #E5E7EB 55%, rgba(3,205,140,0.1) 100%)"
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

      {/* Route + ETA */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
          border: (t) =>
            t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
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
            <Chip
              size="small"
              label={`${distance} • ${eta}`}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 24,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                color: (t) => t.palette.text.primary
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Info + confirm */}
      <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
        <InfoOutlinedIcon
          sx={{ fontSize: 18, color: (t) => t.palette.text.secondary, mt: 0.5 }}
        />
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
        >
          Final fare may adjust slightly based on real route and traffic. You
          can cancel before a driver is assigned in most cities without a fee.
        </Typography>
      </Stack>

      <Button
        fullWidth
        variant="contained"
        disabled={!canContinue}
        sx={{
          borderRadius: 999,
          py: 1.1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: canContinue ? "primary.main" : "#9CA3AF",
          color: canContinue ? "#020617" : "#E5E7EB",
          "&:hover": {
            bgcolor: canContinue ? "#06e29a" : "#9CA3AF"
          }
        }}
      >
        Confirm details
      </Button>
    </Box>
  );
}

export default function RiderScreen46RideDetailsVariant2Canvas_v2() {
      return (
    
      
      <Box
        sx={{ position: "relative", minHeight: "100vh", bgcolor: (t) => t.palette.background.default }}
      >
        

        <DarkModeToggle />

        

        <MobileShell>
          <RideDetailsVariant2Screen />
        </MobileShell>
      </Box>
    
  );
}
