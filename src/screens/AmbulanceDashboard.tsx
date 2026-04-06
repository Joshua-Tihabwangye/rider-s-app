import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  Divider
} from "@mui/material";

import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";


function AmbulanceDashboardHomeScreen(): React.JSX.Element {
  const [ctaState, setCtaState] = useState("idle");
  const [forWhom, setForWhom] = useState("me");

  const handleRequestNow = () => {
    setCtaState("urgent");
  };

  const handlePlanTransfer = () => {
    setCtaState("planned");
  };

  const handleSetForWhom = (value: string): void => {
    setForWhom(value);
    setCtaState(`for-${value}`);
  };

  const handleViewHistory = () => {
    setCtaState("history");
  };

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 5,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FEE2E2" : "rgba(15,23,42,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <LocalHospitalRoundedIcon sx={{ fontSize: 22, color: "#DC2626" }} />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Ambulance & medical transport
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Request urgent help or plan a hospital transfer
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Urgent vs planned card */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 3,
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
        <CardContent sx={{ px: 1.9, py: 1.9 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1.3 }}
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
                  color: (t) => t.palette.text.primary
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
                borderRadius: 5,
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

          <Stack direction="row" spacing={1.25}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleRequestNow}
              sx={{
                borderRadius: 5,
                py: 0.9,
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
                borderRadius: 5,
                py: 0.9,
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

          {ctaState !== "idle" && (
            <Box
              sx={{
                mt: 1,
                px: 1.1,
                py: 0.7,
                borderRadius: 2,
                bgcolor: (t) =>
                  t.palette.mode === "light"
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(15,23,42,0.96)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(220,38,38,0.35)"
                    : "1px solid rgba(220,38,38,0.7)"
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
              >
                {ctaState === "urgent" &&
                  "Next step: open the urgent ambulance request flow with current location, patient details and priority hospital (RA84–RA86)."}
                {ctaState === "planned" &&
                  "Next step: choose date, time and destination hospital for a planned transfer (e.g. RA85 + schedule)."}
                {ctaState === "for-me" &&
                  "Preparing a request for you. Ask a nearby adult to assist if possible and stay reachable on this phone."}
                {ctaState === "for-family" &&
                  "You’re booking for a family member or friend. In the next step you’ll confirm their contact and location."}
                {ctaState === "for-facility" &&
                  "You’re booking from a clinic or hospital. In the next step, confirm ward/bed, referring doctor and destination facility."}
                {ctaState === "history" &&
                  "Open your ambulance request history to see previous calls, outcomes and reference IDs (RA88)."}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Who is this for? */}
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
        <CardContent sx={{ px: 1.75, py: 1.7 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
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

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Chip
              label="Me"
              size="small"
              onClick={() => handleSetForWhom("me")}
              sx={{
                borderRadius: 5,
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
                borderRadius: 5,
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
                borderRadius: 5,
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
          mb: 1.5,
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
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
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
          <Divider sx={{ mb: 1, borderColor: (t) => t.palette.divider }} />

          {[0, 1].map((i) => (
            <Box
              key={i}
              sx={{
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
        sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
      >
        The ambulance dashboard gives you a calm, focused way to request help in
        emergencies or plan medical transfers. From here you jump into the
        detailed flows for location, patient details, hospital selection and live
        tracking.
      </Typography>
    </Box>
  );
}

export default function AmbulanceDashboard(): React.JSX.Element {
  return (
    <>

        <AmbulanceDashboardHomeScreen />
      
    </>
  );
}
