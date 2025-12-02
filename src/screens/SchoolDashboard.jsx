import React from "react";
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

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import DirectionsBusFilledRoundedIcon from "@mui/icons-material/DirectionsBusFilled";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";

function SchoolDashboardHomeScreen() {
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
                t.palette.mode === "light" ? "#DBEAFE" : "rgba(15,23,42,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <SchoolRoundedIcon sx={{ fontSize: 22, color: "#1D4ED8" }} />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              EVzone School
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Manage school shuttles and student transport
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* App handoff card */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 3,
          bgcolor: (t) =>
            t.palette.mode === "light"
              ? "radial-gradient(circle at top, #DBEAFE, #EEF2FF)"
              : "radial-gradient(circle at top, #020617, #020617)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(129,140,248,0.7)"
              : "1px solid rgba(129,140,248,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.8, py: 1.8 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.6, display: "block" }}
          >
            School shuttles live in the EVzone School / Parents app.
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em", mb: 1 }}
          >
            Open EVzone School to book or track a bus.
          </Typography>
          <Stack direction="row" spacing={1.25}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<DirectionsBusFilledRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{
                borderRadius: 999,
                py: 0.9,
                fontSize: 13,
                fontWeight: 600,
                textTransform: "none",
                bgcolor: "#1D4ED8",
                color: "#EFF6FF",
                "&:hover": { bgcolor: "#1E40AF" }
              }}
            >
              Open EVzone School app
            </Button>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                borderRadius: 999,
                py: 0.9,
                fontSize: 13,
                textTransform: "none"
              }}
            >
              Get the app
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Children & routes summary */}
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
                Children & routes
              </Typography>
            </Stack>
            <Typography
              variant="caption"
              sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary, cursor: "pointer" }}
            >
              Manage in EVzone School
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
                  {i === 0 ? "Ava Namaganda" : "Noah Kato"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
                >
                  {i === 0 ? "Morning: Kansanga → Greenhill" : "Evening: City centre → Home"}
                </Typography>
              </Box>
              <Chip
                size="small"
                label={i === 0 ? "Onboard" : "Arriving soon"}
                sx={{
                  borderRadius: 999,
                  fontSize: 10,
                  height: 22,
                  bgcolor: (t) =>
                    i === 0
                      ? t.palette.mode === "light"
                        ? "rgba(34,197,94,0.12)"
                        : "rgba(34,197,94,0.2)"
                      : t.palette.mode === "light"
                      ? "rgba(56,189,248,0.12)"
                      : "rgba(56,189,248,0.2)",
                  color: (t) =>
                    i === 0
                      ? t.palette.mode === "light"
                        ? "#16A34A"
                        : "#22C55E"
                      : t.palette.mode === "light"
                      ? "#0284C7"
                      : "#38BDF8"
                }}
              />
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Alerts & notifications */}
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
            <Stack direction="row" spacing={0.75} alignItems="center">
              <NotificationsActiveRoundedIcon
                sx={{ fontSize: 18, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Shuttle notifications
              </Typography>
            </Stack>
            <Typography
              variant="caption"
              sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary, cursor: "pointer" }}
            >
              Open EVzone School
            </Typography>
          </Stack>
          <Divider sx={{ mb: 1, borderColor: (t) => t.palette.divider }} />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 0.4
            }}
          >
            <Box>
              <Typography
                variant="body2"
                sx={{ fontSize: 12.5, fontWeight: 500, letterSpacing: "-0.01em" }}
              >
                Morning shuttle – Greenhill
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
              >
                ETA 10–15 min • Last stop before school
              </Typography>
            </Box>
            <ArrowForwardIosRoundedIcon
              sx={{ fontSize: 14, color: (t) => t.palette.text.secondary }}
            />
          </Box>
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
      >
        EVzone School keeps all child profiles, shuttle routes and transport alerts
        inside the dedicated School / Parents experience. This dashboard just gives
        you a quick overview and a fast way to jump into the School app.
      </Typography>
    </Box>
  );
}

export default function SchoolDashboard() {
  return (
    <>
      <DarkModeToggle />
      <MobileShell>
        <SchoolDashboardHomeScreen />
      </MobileShell>
    </>
  );
}
