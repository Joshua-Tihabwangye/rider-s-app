import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
import { useAppData } from "../contexts/AppDataContext";

function RideDetailsPreConfirmScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { ride } = useAppData();
  const origin = ride.request.origin ?? ride.activeTrip?.pickup;
  const destination = ride.request.destination ?? ride.activeTrip?.dropoff;
  const fareEstimate = ride.activeTrip?.fareEstimate ?? "UGX 14,500";
  return (
    <Box sx={{ px: uiTokens.spacing.xl, pt: uiTokens.spacing.xl, pb: uiTokens.spacing.xxl }}>
      {/* Header */}
      <Box sx={{ mb: uiTokens.spacing.lg, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.mdPlus }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: uiTokens.radius.xl,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"}}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
              Review your EV ride
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Check details before you confirm
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Map snapshot */}
      <Box
        sx={{
          position: "relative",
          borderRadius: uiTokens.radius.lg,
          overflow: "hidden",
          height: 180,
          mb: uiTokens.spacing.xl,
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
              borderRadius: "5px",
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

      {/* Route summary */}
      <Card
        elevation={0}
        sx={{
          mb: uiTokens.spacing.lg,
          borderRadius: uiTokens.radius.sm,
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
          border: (t) =>
            t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.mdPlus }}>
          <Box sx={{ mb: uiTokens.spacing.smPlus }}>
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
              {origin?.address ?? "Select pickup"}
            </Typography>
          </Box>
          <Box sx={{ mb: uiTokens.spacing.smPlus }}>
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
              {destination?.address ?? "Select destination"}
            </Typography>
          </Box>
          <Stack direction="row" spacing={uiTokens.spacing.mdPlus} alignItems="center">
            <Chip
              size="small"
              icon={<DirectionsCarFilledRoundedIcon sx={{ fontSize: 14 }} />}
              label="Eco EV • 1–4 riders"
              sx={{
                borderRadius: uiTokens.radius.xl,
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
                borderRadius: uiTokens.radius.xl,
                fontSize: 11,
                height: 24,
                bgcolor: "rgba(34,197,94,0.1)",
                color: "#16A34A"
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Fare estimate */}
      <Card
        elevation={0}
        sx={{
          mb: uiTokens.spacing.lg,
          borderRadius: uiTokens.radius.sm,
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
          border: (t) =>
            t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.mdPlus }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Wallet • Promo applied
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="caption"
            sx={{ mt: uiTokens.spacing.md, display: "block", fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            Final fare may change slightly based on actual distance and traffic.
          </Typography>
        </CardContent>
      </Card>

      {/* Info + Confirm */}
      <Stack direction="row" spacing={uiTokens.spacing.sm} sx={{ mb: uiTokens.spacing.mdPlus }}>
        <InfoOutlinedIcon
          sx={{ fontSize: 18, color: (t) => t.palette.text.secondary, mt: 0.5 }}
        />
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
        >
          By confirming, you agree to the EVzone Ride terms and the estimated
          fare above. You can cancel before the driver is assigned without a
          fee in most cities.
        </Typography>
      </Stack>

      <Button
        fullWidth
        variant="contained"
        sx={{
          borderRadius: uiTokens.radius.xl,
          py: uiTokens.spacing.smPlus,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: "primary.main",
          color: "#020617",
          "&:hover": { bgcolor: "#06e29a" }
        }}
      >
        Confirm EV ride
      </Button>
    </Box>
  );
}

export default function RiderScreen42RideDetailsPreConfirmCanvas_v2() {
      return (
    
      
      <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (t) => t.palette.background.default }}>

          <RideDetailsPreConfirmScreen />
        
      </Box>
    
  );
}
