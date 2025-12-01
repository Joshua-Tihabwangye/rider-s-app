import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Avatar
} from "@mui/material";

import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import TourRoundedIcon from "@mui/icons-material/TourRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";
import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";

function HomeMultiServiceScreen() {
  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Top bar */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
              fontSize: 18,
              fontWeight: 600,
              color: "#020617"
            }}
          >
            RZ
          </Avatar>
          <Box>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Welcome back,
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              What would you like to do today?
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Primary service picker */}
      <Box sx={{ mb: 2.5 }}>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}
        >
          EVzone services
        </Typography>

        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1.2}>
            {/* Ride */}
            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                transition: "transform 0.12s ease, box-shadow 0.12s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.4 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
                  <ElectricCarRoundedIcon sx={{ fontSize: 20, color: "primary.main" }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
                  >
                    Ride
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Book an electric ride now or later
                </Typography>
              </CardContent>
            </Card>

            {/* Delivery */}
            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                transition: "transform 0.12s ease, box-shadow 0.12s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.4 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
                  <LocalShippingRoundedIcon sx={{ fontSize: 20, color: "primary.main" }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
                  >
                    Delivery
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Send or receive parcels with EV couriers
                </Typography>
              </CardContent>
            </Card>
          </Stack>

          <Stack direction="row" spacing={1.2}>
            {/* Rental */}
            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                transition: "transform 0.12s ease, box-shadow 0.12s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.4 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
                  <LuggageRoundedIcon sx={{ fontSize: 20, color: "primary.main" }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
                  >
                    Rental
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Rent an EV for self-drive or chauffeur
                </Typography>
              </CardContent>
            </Card>

            {/* Tours */}
            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                transition: "transform 0.12s ease, box-shadow 0.12s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.4 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
                  <TourRoundedIcon sx={{ fontSize: 20, color: "primary.main" }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
                  >
                    Tours
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Book EV tours, day trips & charters
                </Typography>
              </CardContent>
            </Card>
          </Stack>

          <Stack direction="row" spacing={1.2}>
            {/* School */}
            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                transition: "transform 0.12s ease, box-shadow 0.12s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.4 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
                  <SchoolRoundedIcon sx={{ fontSize: 20, color: "primary.main" }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
                  >
                    School
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Manage school shuttles via EVzone School
                </Typography>
              </CardContent>
            </Card>

            {/* Ambulance */}
            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                transition: "transform 0.12s ease, box-shadow 0.12s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.4 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
                  <LocalHospitalRoundedIcon sx={{ fontSize: 20, color: "#DC2626" }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
                  >
                    Ambulance
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Request emergency or transfer ambulances
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </Box>

      {/* Quick links / promos */}
      <Box sx={{ mt: 1.5 }}>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}
        >
          Shortcuts
        </Typography>
        <Stack direction="row" spacing={1.25} sx={{ flexWrap: "wrap" }}>
          <Chip
            icon={<ElectricCarRoundedIcon sx={{ fontSize: 16 }} />}
            label="Rebook last ride"
            size="small"
            sx={{
              borderRadius: 999,
              fontSize: 11,
              height: 26,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          />
          <Chip
            icon={<LocalShippingRoundedIcon sx={{ fontSize: 16 }} />}
            label="Track a parcel"
            size="small"
            sx={{
              borderRadius: 999,
              fontSize: 11,
              height: 26,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          />
          <Chip
            icon={<LocalMallRoundedIcon sx={{ fontSize: 16 }} />}
            label="Open EVzone Marketplace"
            size="small"
            sx={{
              borderRadius: 999,
              fontSize: 11,
              height: 26,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          />
        </Stack>
      </Box>
    </Box>
  );
}

export default function RiderScreen01HomeMultiServiceCanvas_v2() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (t) => t.palette.background.default
      }}
    >
      <DarkModeToggle />
      <MobileShell>
        <HomeMultiServiceScreen />
      </MobileShell>
    </Box>
  );
}
