import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useNavigate } from "react-router-dom";
import { Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack, IconButton } from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { uiTokens } from "../design/tokens";

function ThankYouRideConfirmedScreen(): React.JSX.Element {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ px: uiTokens.spacing.xl, pt: uiTokens.spacing.xl, pb: uiTokens.spacing.xxl }}>
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
            borderRadius: uiTokens.radius.xl,
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
        <Box sx={{ width: uiTokens.spacing.xl }} />
      </Box>
      {/* Centered success icon & message */}
      <Box sx={{ textAlign: "center", mb: uiTokens.spacing.xl }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: uiTokens.radius.xl,
            bgcolor: "rgba(3,205,140,0.12)",
            mb: uiTokens.spacing.mdPlus
          }}
        >
          <CheckCircleRoundedIcon sx={{ fontSize: 40, color: "primary.main" }} />
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, letterSpacing: "-0.02em", mb: 0.5 }}
        >
          Thank you! Your EV ride is confirmed
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}
        >
          We’re assigning the best available EV driver for your trip. You’ll get
          a notification once they accept.
        </Typography>
      </Box>

      {/* Booking summary */}
      <Card
        elevation={0}
        sx={{
          mb: uiTokens.spacing.xl,
          borderRadius: uiTokens.radius.sm,
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
          border: (t) =>
            t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.lg }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: uiTokens.spacing.xs, display: "block" }}
          >
            Next up
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, letterSpacing: "-0.01em", mb: uiTokens.spacing.smPlus }}
          >
            Pickup at Nsambya Road 472, Kampala at 07:30 PM
          </Typography>
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
              icon={<AccessTimeRoundedIcon sx={{ fontSize: 14 }} />}
              label="Arrives around 07:25 PM"
              sx={{
                borderRadius: uiTokens.radius.xl,
                fontSize: 11,
                height: 24,
                bgcolor: "rgba(59,130,246,0.12)",
                color: "#1D4ED8"
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Guidance + CTAs */}
      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: uiTokens.spacing.lg, display: "block" }}
      >
        You can view and manage this ride any time from Rides → Upcoming.
      </Typography>

      <Stack direction="row" spacing={uiTokens.spacing.mdPlus}>
        <Button
          fullWidth
          variant="outlined"
          sx={{
            borderRadius: uiTokens.radius.xl,
            py: uiTokens.spacing.md,
            fontSize: 14,
            textTransform: "none"
          }}
        >
          View upcoming ride
        </Button>
        <Button
          fullWidth
          variant="contained"
          sx={{
            borderRadius: uiTokens.radius.xl,
            py: uiTokens.spacing.mdPlus,
            fontSize: 15,
            fontWeight: 600,
            textTransform: "none",
            bgcolor: "primary.main",
            color: "#020617",
            "&:hover": { bgcolor: "#06e29a" }
          }}
        >
          Back to home
        </Button>
      </Stack>
    </Box>
  );
}

export default function RiderScreen48ThankYouRideConfirmedCanvas_v2() {
      return (
    
      
      <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (t) => t.palette.background.default }}>

          <ThankYouRideConfirmedScreen />
        
      </Box>
    
  );
}
