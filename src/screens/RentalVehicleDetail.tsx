import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
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

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";

import MobileShell from "../components/MobileShell";

function RentalVehicleDetailsScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [modeSelection, setModeSelection] = useState("self");

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 999,
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
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Nissan Leaf • EV hatchback
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Self-drive or chauffeur, 220 km range
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Hero vehicle card */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 3,
          bgcolor: (t) =>
            t.palette.mode === "light"
              ? "radial-gradient(circle at top,#E0F2FE,#EEF2FF)"
              : "radial-gradient(circle at top,#020617,#020617)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(191,219,254,0.9)"
              : "1px solid rgba(30,64,175,0.8)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.2 }}>
            <Box
              sx={{
                flex: 1,
                minHeight: 80,
                borderRadius: 2,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "rgba(255,255,255,0.7)" : "rgba(15,23,42,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <ElectricCarRoundedIcon
                sx={{
                  fontSize: 48,
                  color: "primary.main",
                  filter: "drop-shadow(0 10px 18px rgba(15,23,42,0.45))"
                }}
              />
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Chip
              label="Self-drive"
              size="small"
              onClick={() => setModeSelection("self")}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 24,
                bgcolor:
                  modeSelection === "self"
                    ? "primary.main"
                    : "rgba(255,255,255,0.85)",
                color: modeSelection === "self" ? "#020617" : "#111827"
              }}
            />
            <Chip
              label="With chauffeur"
              size="small"
              onClick={() => setModeSelection("chauffeur")}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 24,
                bgcolor:
                  modeSelection === "chauffeur"
                    ? "primary.main"
                    : "rgba(255,255,255,0.85)",
                color: modeSelection === "chauffeur" ? "#020617" : "#111827"
              }}
            />
            <Chip
              label="100% electric"
              size="small"
              icon={<BatteryChargingFullRoundedIcon sx={{ fontSize: 14 }} />}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 24,
                bgcolor: "rgba(34,197,94,0.12)",
                color: "#16A34A"
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PeopleAltRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                5 seats
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <LuggageRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                2–3 suitcases
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <BatteryChargingFullRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                220 km range
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Pricing & terms */}
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
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1.2 }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                From
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                UGX 180,000 <Typography component="span" variant="caption" sx={{ fontSize: 11 }}>/ day</Typography>
              </Typography>
            </Box>
            <Chip
              size="small"
              icon={<ShieldRoundedIcon sx={{ fontSize: 14 }} />}
              label="Insurance & roadside support"
              sx={{
                borderRadius: 999,
                fontSize: 10,
                height: 24,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                color: (t) => t.palette.text.primary
              }}
            />
          </Stack>

          <Divider sx={{ my: 1.2, borderColor: (t) => t.palette.divider }} />

          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.5, display: "block" }}
          >
            Includes
          </Typography>
          <Stack spacing={0.4}>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              • EV charger cable & adapter (where applicable)
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              • Standard daily mileage allowance (150 km / day)
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              • 24/7 roadside support
            </Typography>
          </Stack>

          <Typography
            variant="caption"
            sx={{ mt: 1.2, fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            A refundable deposit and valid driver’s license are required for
            self‑drive. Additional terms may apply.
          </Typography>
        </CardContent>
      </Card>

      {/* Continue CTA */}
      <Button
        fullWidth
        variant="contained"
        sx={{
          borderRadius: 999,
          py: 1.1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: "primary.main",
          color: "#020617",
          "&:hover": { bgcolor: "#06e29a" }
        }}
      >
        Continue to dates & pickup
      </Button>
    </Box>
  );
}

export default function RiderScreen71RentalVehicleDetailsCanvas_v2() {
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
          <RentalVehicleDetailsScreen />
        </MobileShell>
      </Box>
    
  );
}
