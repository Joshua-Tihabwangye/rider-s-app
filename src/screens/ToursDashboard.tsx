import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  CircularProgress
} from "@mui/material";

import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import { uiTokens } from "../design/tokens";

import TourRoundedIcon from "@mui/icons-material/TourRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { IconButton } from "@mui/material";

function ToursGatewayScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  const handleAccessTourApp = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      navigate("/tours");
      setIsRedirecting(false);
    }, 2000);
  };

  return (
    <ScreenScaffold>
      <SectionHeader
        title="Tour & Travel Gateway"
        subtitle="Access your dedicated Tour and Travel experience"
        leadingAction={
          <Stack direction="row" spacing={uiTokens.spacing.sm} alignItems="center">
            <IconButton
              size="small"
              aria-label="Back"
              onClick={() => navigate(-1)}
              sx={{
                borderRadius: uiTokens.radius.xl,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(134,239,172,0.2)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)"
              }}
            >
              <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18, color: "#FB923C" }} />
            </IconButton>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: uiTokens.radius.xl,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#DCFCE7" : "rgba(134,239,172,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <TourRoundedIcon sx={{ fontSize: 22, color: "#22C55E" }} />
            </Box>
          </Stack>
        }
      />

      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) =>
            t.palette.mode === "light"
              ? "linear-gradient(145deg, #E0F2FE 0%, #EEF2FF 55%, #FFFFFF 100%)"
              : "linear-gradient(160deg, #22C55E 0%, #22C55E 55%, #22C55E 100%)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(125,211,252,0.8)"
              : "1px solid rgba(56,189,248,0.6)",
          mb: uiTokens.spacing.lg
        }}
      >
        <CardContent sx={{ px: { xs: 2, sm: 2.5 }, py: { xs: 2, sm: 2.5 } }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.02em",
              mb: uiTokens.spacing.md,
              fontSize: { xs: 20, sm: 22 }
            }}
          >
            EVzone Tour & Travel
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mb: uiTokens.spacing.lg,
              color: (t) => t.palette.text.secondary,
              lineHeight: 1.5
            }}
          >
            Access our dedicated Tour and Travel application for comprehensive EV-powered travel experiences.
            Book guided tours, day trips, safaris, and custom charters with seamless integration to your EVzone account.
          </Typography>

          <Stack spacing={uiTokens.spacing.md}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  mb: uiTokens.spacing.xs,
                  color: (t) => t.palette.text.primary
                }}
              >
                ✨ What you can do in the Tour app:
              </Typography>
              <Stack spacing={0.5}>
                <Typography variant="body2" sx={{ fontSize: 13, color: (t) => t.palette.text.secondary }}>
                  • Browse curated EV tours and experiences
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 13, color: (t) => t.palette.text.secondary }}>
                  • Book private charters and group tours
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 13, color: (t) => t.palette.text.secondary }}>
                  • Manage your bookings and itineraries
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 13, color: (t) => t.palette.text.secondary }}>
                  • Access exclusive EV travel deals
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(134,239,172,0.16)"),
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(203,213,225,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: { xs: 2, sm: 2.5 }, py: { xs: 2, sm: 2.5 } }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: 14,
              fontWeight: 600,
              mb: uiTokens.spacing.md,
              color: (t) => t.palette.text.primary
            }}
          >
            🚀 Ready to explore?
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mb: uiTokens.spacing.lg,
              color: (t) => t.palette.text.secondary,
              lineHeight: 1.5
            }}
          >
            Your EVzone account will be automatically linked to the Tour and Travel app,
            giving you seamless access to all your preferences and payment methods.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            onClick={handleAccessTourApp}
            disabled={isRedirecting}
            startIcon={isRedirecting ? <CircularProgress size={16} /> : <LaunchRoundedIcon />}
            sx={{
              borderRadius: uiTokens.radius.xl,
              py: 1.2,
              fontSize: 14,
              fontWeight: 600,
              textTransform: "none",
              bgcolor: "#22C55E",
              color: "#FFFFFF",
              boxShadow: "0 8px 24px rgba(34,197,94,0.3)",
              "&:hover": {
                bgcolor: "#16A34A",
                boxShadow: "0 12px 32px rgba(34,197,94,0.4)"
              },
              "&:disabled": {
                bgcolor: "#94A3B8",
                color: "#FFFFFF"
              }
            }}
          >
            {isRedirecting ? "Connecting..." : "Access Tour & Travel App"}
          </Button>
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{
          fontSize: 10.5,
          color: (t) => t.palette.text.secondary,
          mt: uiTokens.spacing.md,
          display: "block",
          textAlign: "center"
        }}
      >
        The Tours dashboard serves as your gateway to comprehensive EV-powered travel experiences.
        All bookings and preferences are synchronized with your EVzone account.
      </Typography>
    </ScreenScaffold>
  );
}

export default function ToursDashboard(): React.JSX.Element {
  return <ToursGatewayScreen />;
}
