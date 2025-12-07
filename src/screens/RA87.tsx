import React from "react";
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
  Button
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PhoneEnabledRoundedIcon from "@mui/icons-material/PhoneEnabledRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";

import MobileShell from "../components/MobileShell";

function AmbulanceLiveTrackingScreen(): JSX.Element {
  const navigate = useNavigate();
  const requestId = "AMB-REQ-2025-10-07-001";
  const eta = "6 min";

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
              Live ambulance tracking
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Watch the ambulance as it approaches your location
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Map area */}
      <Box
        sx={{
          position: "relative",
          borderRadius: 3,
          overflow: "hidden",
          height: 220,
          mb: 2.5,
          background: (t) =>
            t.palette.mode === "light"
              ? "radial-gradient(circle at top, #FECACA 0, #F3F4F6 55%, rgba(3,205,140,0.1) 100%)"
              : "radial-gradient(circle at top, rgba(185,28,28,0.7), #020617 60%, #020617 100%)"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.22,
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.5) 1px, transparent 1px)",
            backgroundSize: "34px 34px"
          }}
        />

        {/* Patient location marker */}
        <Box
          sx={{
            position: "absolute",
            left: "18%",
            bottom: "20%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <PlaceRoundedIcon
            sx={{ fontSize: 26, color: "#DC2626", filter: "drop-shadow(0 6px 12px rgba(15,23,42,0.7))" }}
          />
        </Box>

        {/* Ambulance marker */}
        <Box
          sx={{
            position: "absolute",
            left: "46%",
            top: "50%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <DirectionsCarRoundedIcon
            sx={{ fontSize: 28, color: "#F97316", filter: "drop-shadow(0 8px 16px rgba(15,23,42,0.9))" }}
          />
        </Box>

        {/* Hospital marker */}
        <Box
          sx={{
            position: "absolute",
            right: "16%",
            top: "26%",
            transform: "translate(50%, -50%)"
          }}
        >
          <LocalHospitalRoundedIcon
            sx={{ fontSize: 26, color: "#16A34A", filter: "drop-shadow(0 8px 16px rgba(15,23,42,0.9))" }}
          />
        </Box>

        {/* ETA chip */}
        <Box
          sx={{
            position: "absolute",
            left: 12,
            top: 12
          }}
        >
          <Chip
            size="small"
            icon={<AccessTimeRoundedIcon sx={{ fontSize: 14 }} />}
            label={`ETA ${eta}`}
            sx={{
              borderRadius: 999,
              fontSize: 11,
              height: 24,
              bgcolor: "rgba(15,23,42,0.8)",
              color: "#F9FAFB"
            }}
          />
        </Box>
      </Box>

      {/* Request + contact summary */}
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
          <Stack spacing={0.6} sx={{ mb: 1.2 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Request ID: {requestId}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Destination hospital: Nsambya Hospital (triage may adjust based on
              condition)
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.25}>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              startIcon={<PhoneEnabledRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{
                borderRadius: 999,
                py: 0.8,
                fontSize: 13,
                textTransform: "none"
              }}
            >
              Call control room
            </Button>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              startIcon={<PhoneIphoneRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{
                borderRadius: 999,
                py: 0.8,
                fontSize: 13,
                textTransform: "none"
              }}
            >
              Call ambulance
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
      >
        If you move from this location or the patient’s condition changes, use
        the contact options above to update the team.
      </Typography>
    </Box>
  );
}

export default function RiderScreen87AmbulanceLiveTrackingCanvas_v2() {
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
          <AmbulanceLiveTrackingScreen />
        </MobileShell>
      </Box>
    
  );
}
