import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  Divider
} from "@mui/material";

import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import { uiTokens } from "../design/tokens";

import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";


function AmbulanceDashboardHomeScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [forWhom, setForWhom] = useState("me");

  const handleRequestNow = () => {
    navigate("/ambulance/location");
  };

  const handlePlanTransfer = () => {
    navigate("/ambulance/destination");
  };

  const handleSetForWhom = (value: string): void => {
    setForWhom(value);
  };

  const handleViewHistory = () => {
    navigate("/ambulance/history");
  };

  return (
    <ScreenScaffold>
      <SectionHeader
        title="Ambulance & medical transport"
        subtitle="Request urgent help or plan a hospital transfer"
        leadingAction={
          <Stack direction="row" spacing={uiTokens.spacing.sm} alignItems="center">
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
                  t.palette.mode === "light" ? "#FEE2E2" : "rgba(15,23,42,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <LocalHospitalRoundedIcon sx={{ fontSize: 22, color: "#DC2626" }} />
            </Box>
          </Stack>
        }
      />

      {/* Urgent vs planned card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.sm,
          bgcolor: (t) =>
            t.palette.mode === "light"
              ? "radial-gradient(circle at top, #FECACA, #FEF2F2)"
              : "radial-gradient(circle at top, #7F1D1D, #020617)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(220,38,38,0.5)"
              : "1px solid rgba(248,113,113,0.8)"
        }}
      >
        <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.lg }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={uiTokens.spacing.sm}
            sx={{ mb: uiTokens.spacing.mdPlus }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Need an ambulance?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: (t) => t.palette.text.primary,
                  fontSize: { xs: 18, sm: 20 }
                }}
              >
                24/7 partner network
              </Typography>
            </Box>
            <Chip
              size="small"
              icon={<NotificationsActiveRoundedIcon sx={{ fontSize: 16 }} />}
              label="Priority line"
              sx={{
                borderRadius: uiTokens.radius.xl,
                fontSize: 10,
                height: 22,
                bgcolor: (t) =>
                  t.palette.mode === "light"
                    ? "rgba(254,242,242,0.95)"
                    : "rgba(15,23,42,0.96)",
                color: (t) => t.palette.text.primary
              }}
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={uiTokens.spacing.mdPlus}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleRequestNow}
              sx={{
                borderRadius: uiTokens.radius.xl,
                py: uiTokens.spacing.md,
                fontSize: 13,
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "#B91C1C",
                color: "#FEF2F2",
                "&:hover": { bgcolor: "#991B1B" }
              }}
            >
              Request ambulance now
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={handlePlanTransfer}
              sx={{
                borderRadius: uiTokens.radius.xl,
                py: uiTokens.spacing.md,
                fontSize: 13,
                textTransform: "none",
                borderColor: (t) =>
                  t.palette.mode === "light"
                    ? "rgba(127,29,29,0.6)"
                    : "rgba(239,68,68,0.5)",
                color: (t) =>
                  t.palette.mode === "light"
                    ? "rgba(88,28,28,0.95)"
                    : "rgba(239,68,68,0.9)",
                "&:hover": {
                  borderColor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(127,29,29,0.9)"
                      : "rgba(239,68,68,0.9)",
                  bgcolor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(127,29,29,0.06)"
                      : "rgba(239,68,68,0.1)"
                }
              }}
            >
              Plan a transfer
            </Button>
          </Stack>

        </CardContent>
      </Card>

      {/* Who is this for? */}
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.sm,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.lg }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: uiTokens.spacing.smPlus }}
          >
            <Stack direction="row" spacing={0.75} alignItems="center">
              <PeopleAltRoundedIcon
                sx={{ fontSize: 18, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                This request is for
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={uiTokens.spacing.sm} sx={{ flexWrap: "wrap" }}>
            <Chip
              label="Me"
              size="small"
              onClick={() => handleSetForWhom("me")}
              sx={{
                borderRadius: uiTokens.radius.xl,
                fontSize: 11,
                height: 26,
                bgcolor:
                  forWhom === "me"
                    ? "rgba(239,68,68,0.15)"
                    : (t) =>
                        t.palette.mode === "light"
                          ? "#F9FAFB"
                          : "rgba(15,23,42,0.96)",
                border:
                  forWhom === "me"
                    ? "1px solid #DC2626"
                    : (t) =>
                        t.palette.mode === "light"
                          ? "1px solid rgba(209,213,219,0.9)"
                          : "1px solid rgba(51,65,85,0.9)",
                color: (t) => t.palette.text.primary
              }}
            />
            <Chip
              label="Family / friend"
              size="small"
              onClick={() => handleSetForWhom("family")}
              sx={{
                borderRadius: uiTokens.radius.xl,
                fontSize: 11,
                height: 26,
                bgcolor:
                  forWhom === "family"
                    ? "rgba(239,68,68,0.15)"
                    : (t) =>
                        t.palette.mode === "light"
                          ? "#F9FAFB"
                          : "rgba(15,23,42,0.96)",
                border:
                  forWhom === "family"
                    ? "1px solid #DC2626"
                    : (t) =>
                        t.palette.mode === "light"
                          ? "1px solid rgba(209,213,219,0.9)"
                          : "1px solid rgba(51,65,85,0.9)",
                color: (t) => t.palette.text.primary
              }}
            />
            <Chip
              label="Clinic / hospital"
              size="small"
              onClick={() => handleSetForWhom("facility")}
              sx={{
                borderRadius: uiTokens.radius.xl,
                fontSize: 11,
                height: 26,
                bgcolor:
                  forWhom === "facility"
                    ? "rgba(239,68,68,0.15)"
                    : (t) =>
                        t.palette.mode === "light"
                          ? "#F9FAFB"
                          : "rgba(15,23,42,0.96)",
                border:
                  forWhom === "facility"
                    ? "1px solid #DC2626"
                    : (t) =>
                        t.palette.mode === "light"
                          ? "1px solid rgba(209,213,219,0.9)"
                          : "1px solid rgba(51,65,85,0.9)",
                color: (t) => t.palette.text.primary
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Recent requests */}
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.sm,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.lg }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: uiTokens.spacing.smPlus }}
          >
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Recent ambulance requests
            </Typography>
            <Typography
              variant="caption"
              onClick={handleViewHistory}
              sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary, cursor: "pointer" }}
            >
              View history
            </Typography>
          </Stack>
          <Divider sx={{ mb: uiTokens.spacing.md, borderColor: (t) => t.palette.divider }} />

          {[0, 1].map((i) => (
              <Box
                key={i}
                onClick={() => navigate("/ambulance/history")}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 0.6,
                  "&:not(:last-of-type)": {
                    borderBottom: (t) => `1px dashed ${t.palette.divider}`
                  }
                }}
              >
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontSize: 12.5, fontWeight: 500, letterSpacing: "-0.01em" }}
                >
                  {i === 0
                    ? "Nsambya Road 472 → Nsambya Hospital"
                    : "Bugolobi Clinic → Mulago"}
                </Typography>
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <AccessTimeRoundedIcon
                    sx={{ fontSize: 15, color: (t) => t.palette.text.secondary }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
                  >
                    {i === 0
                      ? "Today • 14:32 • Completed"
                      : "Last week • 22:15 • Completed"}
                  </Typography>
                </Stack>
              </Box>
              <ArrowForwardIosRoundedIcon
                sx={{ fontSize: 14, color: (t) => t.palette.text.secondary }}
              />
            </Box>
          ))}
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary, mt: 1, display: "block" }}
      >
        The ambulance dashboard gives you a calm, focused way to request help in
        emergencies or plan medical transfers. From here you jump into the
        detailed flows for location, patient details, hospital selection and live
        tracking.
      </Typography>
    </ScreenScaffold>
  );
}

export default function AmbulanceDashboard(): React.JSX.Element {
  return (
    <>

        <AmbulanceDashboardHomeScreen />
      
    </>
  );
}
