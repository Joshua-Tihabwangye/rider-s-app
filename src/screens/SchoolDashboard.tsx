import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  CircularProgress,
  Grid
} from "@mui/material";

import ScreenScaffold from "../components/ScreenScaffold";
import { uiTokens } from "../design/tokens";

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { IconButton } from "@mui/material";
import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";

function SchoolDashboardHomeScreen(): React.JSX.Element {
  const navigate = useNavigate();

  const handleBookTransport = () => {
    navigate("/school/book");
  };

  const handleManageStudents = () => {
    navigate("/school/manage");
  };

  const handleViewSchedules = () => {
    navigate("/school/schedules");
  };

  const handleAccessManagementSystem = () => {
    navigate("/school/management-system");
  };

  const actionCards = [
    {
      title: "Book School Transport",
      description: "Reserve shuttle services for students and staff",
      icon: <DirectionsBusRoundedIcon sx={{ fontSize: 24, color: "#22C55E" }} />,
      bg: "#DCFCE7",
      onClick: handleBookTransport,
      primary: true
    },
    {
      title: "Manage Students",
      description: "Add, update, and organize student profiles",
      icon: <PeopleRoundedIcon sx={{ fontSize: 24, color: "#3B82F6" }} />,
      bg: "#DBEAFE",
      onClick: handleManageStudents
    },
    {
      title: "View Schedules",
      description: "Check routes, timings, and transport history",
      icon: <ScheduleRoundedIcon sx={{ fontSize: 24, color: "#F59E0B" }} />,
      bg: "#FEF3C7",
      onClick: handleViewSchedules
    },
    {
      title: "Management System",
      description: "Access comprehensive school transport tools",
      icon: <AdminPanelSettingsRoundedIcon sx={{ fontSize: 24, color: "#8B5CF6" }} />,
      bg: "#EDE9FE",
      onClick: handleAccessManagementSystem
    }
  ];

  return (
    <ScreenScaffold>
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.2}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
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
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: uiTokens.radius.xl,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#DCFCE7" : "rgba(15,23,42,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              <SchoolRoundedIcon sx={{ fontSize: 22, color: "#059669" }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ ...uiTokens.text.sectionTitle, lineHeight: 1.25 }}>
                School Transport
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  ...uiTokens.text.itemBody,
                  fontSize: 12,
                  color: (t) => t.palette.text.secondary,
                  display: "block",
                  mt: 0.3
                }}
              >
                Manage student transportation and school shuttles
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>

      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          overflow: "hidden",
          bgcolor: (t) =>
            t.palette.mode === "light"
              ? "linear-gradient(145deg,#FFFFFF,#F8FAFC)"
              : "linear-gradient(145deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)",
          boxShadow: (t) =>
            t.palette.mode === "light"
              ? "0 10px 24px rgba(15,23,42,0.08)"
              : "0 10px 24px rgba(2,6,23,0.28)"
        }}
      >
        <Box sx={{ height: 4, bgcolor: "primary.main" }} />
        <CardContent sx={{ px: { xs: 1.8, sm: 2.1 }, py: { xs: 1.8, sm: 2.1 } }}>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.01em", mb: 0.35 }}>
            Welcome to School Transport
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              fontSize: 11.5,
              color: (t) => t.palette.text.secondary,
              mb: 1.4
            }}
          >
            Book safe, reliable EV-powered transportation for your students and staff.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            onClick={handleBookTransport}
            sx={{
              borderRadius: uiTokens.radius.xl,
              py: 1.2,
              fontSize: 14,
              fontWeight: 700,
              textTransform: "none",
              bgcolor: "primary.main",
              color: "#022C22",
              "&:hover": { bgcolor: "#06e29a" },
              "&:focus-visible": {
                outline: "2px solid rgba(3,205,140,0.75)",
                outlineOffset: 2
              }
            }}
          >
            Book School Transport
          </Button>
        </CardContent>
      </Card>

      <Grid container spacing={1.5}>
        {actionCards.map((card, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card
              elevation={0}
              onClick={card.onClick}
              sx={{
                borderRadius: uiTokens.radius.xl,
                cursor: "pointer",
                bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: (t) =>
                    t.palette.mode === "light"
                      ? "0 8px 24px rgba(15,23,42,0.12)"
                      : "0 8px 24px rgba(2,6,23,0.32)"
                }
              }}
            >
              <CardContent sx={{ px: 2, py: 2 }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: uiTokens.radius.xl,
                      bgcolor: card.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        mb: 0.5,
                        color: (t) => t.palette.text.primary
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: 12,
                        color: (t) => t.palette.text.secondary,
                        lineHeight: 1.4
                      }}
                    >
                      {card.description}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) =>
            t.palette.mode === "light"
              ? "linear-gradient(145deg,#FFFFFF,#FFF7ED)"
              : "linear-gradient(145deg,rgba(15,23,42,0.98),rgba(30,41,59,0.98))",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(249,115,22,0.28)"
              : "1px solid rgba(249,115,22,0.45)"
        }}
      >
        <CardContent sx={{ px: { xs: 1.8, sm: 2 }, py: { xs: 1.5, sm: 1.75 } }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.45 }}>
            <AdminPanelSettingsRoundedIcon sx={{ fontSize: 18, color: "#F97316" }} />
            <Typography variant="body2" sx={{ fontSize: 12.8, fontWeight: 600 }}>
              Advanced School Management
            </Typography>
          </Stack>
          <Typography
            variant="caption"
            sx={{ display: "block", fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1 }}
          >
            Access our comprehensive management system for route planning, student tracking, and parent communication.
          </Typography>
          <Button
            variant="outlined"
            size="small"
            endIcon={<LaunchRoundedIcon sx={{ fontSize: 12 }} />}
            onClick={handleAccessManagementSystem}
            sx={{
              borderRadius: uiTokens.radius.pill,
              textTransform: "none",
              borderColor: "rgba(249,115,22,0.5)",
              color: "#F97316",
              "&:hover": {
                borderColor: "rgba(249,115,22,0.9)",
                bgcolor: "rgba(249,115,22,0.08)"
              }
            }}
          >
            Access Management System
          </Button>
        </CardContent>
      </Card>
    </ScreenScaffold>
  );
}

export default function SchoolDashboard(): React.JSX.Element {
  return <SchoolDashboardHomeScreen />;
}
