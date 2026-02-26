import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";

function AmbulanceDashboardHomeScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [forWhom, setForWhom] = useState("me");

  const handleRequestNow = () => {
    navigate("/ambulance/location", { state: { mode: "urgent", forWhom } });
  };

  const handlePlanTransfer = () => {
    navigate("/ambulance/book-transfer", { state: { forWhom } });
  };

  const handleViewHistory = () => {
    navigate("/ambulance/history");
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
              borderRadius: 999,
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
                borderRadius: 999,
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
                borderRadius: 999,
                py: 0.9,
                fontSize: 13,
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "#B91C1C",
                color: "#FEF2F2",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#991B1B",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(185,28,28,0.4)"
                },
                "&:active": { transform: "translateY(0)" }
              }}
            >
              Request ambulance now
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={handlePlanTransfer}
              sx={{
                borderRadius: 999,
                py: 0.9,
                fontSize: 13,
                fontWeight: 600,
                textTransform: "none",
                borderColor: (t) =>
                  t.palette.mode === "light"
                    ? "rgba(127,29,29,0.6)"
                    : "rgba(239,68,68,0.5)",
                color: (t) =>
                  t.palette.mode === "light"
                    ? "rgba(88,28,28,0.95)"
                    : "rgba(239,68,68,0.9)",
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  borderColor: "#DC2626",
                  bgcolor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(220,38,38,0.08)"
                      : "rgba(239,68,68,0.15)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(220,38,38,0.2)"
                },
                "&:active": { transform: "translateY(0)" }
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
            {[
              { id: "me", label: "Me" },
              { id: "family", label: "Family / friend" },
              { id: "facility", label: "Clinic / hospital" }
            ].map((opt) => (
              <Chip
                key={opt.id}
                label={opt.label}
                size="small"
                onClick={() => setForWhom(opt.id)}
                sx={{
                  borderRadius: 999,
                  fontSize: 11,
                  height: 26,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  bgcolor:
                    forWhom === opt.id
                      ? "rgba(239,68,68,0.15)"
                      : (t) =>
                          t.palette.mode === "light"
                            ? "#F9FAFB"
                            : "rgba(15,23,42,0.96)",
                  border:
                    forWhom === opt.id
                      ? "1px solid #DC2626"
                      : (t) =>
                          t.palette.mode === "light"
                            ? "1px solid rgba(209,213,219,0.9)"
                            : "1px solid rgba(51,65,85,0.9)",
                  color: (t) => t.palette.text.primary,
                  "&:hover": {
                    bgcolor: forWhom === opt.id
                      ? "rgba(239,68,68,0.2)"
                      : (t) =>
                          t.palette.mode === "light"
                            ? "rgba(239,68,68,0.06)"
                            : "rgba(239,68,68,0.08)"
                  }
                }}
              />
            ))}
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
              sx={{
                fontSize: 10.5,
                color: (t) => t.palette.text.secondary,
                cursor: "pointer",
                transition: "color 0.15s ease",
                "&:hover": { color: "#DC2626", textDecoration: "underline" }
              }}
            >
              View history
            </Typography>
          </Stack>
          <Divider sx={{ mb: 1, borderColor: (t) => t.palette.divider }} />

          {[
            {
              id: "AMB-REQ-2025-10-07-001",
              route: "Nsambya Road 472 → Nsambya Hospital",
              time: "Today • 14:32 • Completed"
            },
            {
              id: "AMB-REQ-2025-09-25-004",
              route: "Bugolobi Clinic → Mulago",
              time: "Last week • 22:15 • Completed"
            }
          ].map((req, i) => (
            <Box
              key={req.id}
              onClick={() => navigate(`/ambulance/tracking/${req.id}`)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 0.6,
                cursor: "pointer",
                borderRadius: 1,
                px: 0.5,
                transition: "all 0.15s ease",
                "&:hover": {
                  bgcolor: (t) => t.palette.action.hover,
                  transform: "translateX(2px)"
                },
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
                  {req.route}
                </Typography>
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <AccessTimeRoundedIcon
                    sx={{ fontSize: 15, color: (t) => t.palette.text.secondary }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
                  >
                    {req.time}
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
    </Box>
  );
}

export default function AmbulanceDashboard(): React.JSX.Element {
  return (
    <>
      <DarkModeToggle />
      <MobileShell>
        <AmbulanceDashboardHomeScreen />
      </MobileShell>
    </>
  );
}
