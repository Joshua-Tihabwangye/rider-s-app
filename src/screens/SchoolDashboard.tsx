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

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { IconButton } from "@mui/material";

function SchoolGatewayScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  const handleAccessSchoolSystem = () => {
    setIsRedirecting(true);

    // Simulate connection to external School management system
    // In a real implementation, this would redirect to the school system
    // or open it in a new window/tab with proper authentication tokens

    setTimeout(() => {
      // For demo purposes, show an alert. In production, this would redirect to the actual School system
      alert("Redirecting to School Management System...\n\nIn a production environment, this would open the dedicated School management system with your EVzone authentication.");

      // Reset loading state
      setIsRedirecting(false);
    }, 2000);
  };

  return (
    <ScreenScaffold>
      <SectionHeader
        title="School Management Gateway"
        subtitle="Access your dedicated School management system"
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
                  t.palette.mode === "light" ? "#DBEAFE" : "rgba(134,239,172,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <SchoolRoundedIcon sx={{ fontSize: 22, color: "#1D4ED8" }} />
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
              ? "linear-gradient(145deg, #DBEAFE 0%, #EEF2FF 55%, #FFFFFF 100%)"
              : "linear-gradient(160deg, #1D4ED8 0%, #1D4ED8 55%, #1D4ED8 100%)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(37,99,235,0.8)"
              : "1px solid rgba(37,99,235,0.6)",
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
            EVzone School Management
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mb: uiTokens.spacing.lg,
              color: (t) => t.palette.text.secondary,
              lineHeight: 1.5
            }}
          >
            Access our dedicated School management system for comprehensive school transport management,
            student tracking, route planning, and parent communication tools.
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
                ✨ What you can manage in the School system:
              </Typography>
              <Stack spacing={0.5}>
                <Typography variant="body2" sx={{ fontSize: 13, color: (t) => t.palette.text.secondary }}>
                  • Student profiles and transportation needs
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 13, color: (t) => t.palette.text.secondary }}>
                  • Shuttle routes and scheduling
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 13, color: (t) => t.palette.text.secondary }}>
                  • Real-time bus tracking and notifications
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 13, color: (t) => t.palette.text.secondary }}>
                  • Fee management and payment processing
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 13, color: (t) => t.palette.text.secondary }}>
                  • Parent communication and alerts
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
            🚀 Ready to manage school transport?
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mb: uiTokens.spacing.lg,
              color: (t) => t.palette.text.secondary,
              lineHeight: 1.5
            }}
          >
            Your EVzone account will be automatically linked to the School management system,
            giving you seamless access to all school transport management tools and real-time updates.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            onClick={handleAccessSchoolSystem}
            disabled={isRedirecting}
            startIcon={isRedirecting ? <CircularProgress size={16} /> : <LaunchRoundedIcon />}
            sx={{
              borderRadius: uiTokens.radius.xl,
              py: 1.2,
              fontSize: 14,
              fontWeight: 600,
              textTransform: "none",
              bgcolor: "#1D4ED8",
              color: "#FFFFFF",
              boxShadow: "0 8px 24px rgba(29,78,216,0.3)",
              "&:hover": {
                bgcolor: "#1E40AF",
                boxShadow: "0 12px 32px rgba(29,78,216,0.4)"
              },
              "&:disabled": {
                bgcolor: "#94A3B8",
                color: "#FFFFFF"
              }
            }}
          >
            {isRedirecting ? "Connecting..." : "Access School Management System"}
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
        The School dashboard serves as your gateway to comprehensive school transport management.
        All student data, routes, and communications are handled securely within the dedicated School management system.
      </Typography>
    </ScreenScaffold>
  );
}

export default function SchoolDashboard(): React.JSX.Element {
  return <SchoolGatewayScreen />;
}
