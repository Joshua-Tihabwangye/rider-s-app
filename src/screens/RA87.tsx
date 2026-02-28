import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  Divider,
  Avatar,
  LinearProgress
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PhoneEnabledRoundedIcon from "@mui/icons-material/PhoneEnabledRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StraightenRoundedIcon from "@mui/icons-material/StraightenRounded";
import NavigationRoundedIcon from "@mui/icons-material/NavigationRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";

import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";

interface RequestData {
  id: string;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  status: string;
  type: string;
  requester: {
    name: string;
    phone: string;
    forWhom: string;
    reason: string;
    notes?: string;
  };
  driver: {
    name: string;
    phone: string;
    vehiclePlate: string;
    vehicleType: string;
    rating: number;
  };
}

function AmbulanceLiveTrackingScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const request = (location.state as { request?: RequestData })?.request;

  if (!request) {
    return (
      <Box sx={{ px: 2.5, pt: 2.5, pb: 3, textAlign: "center" }}>
        <ErrorRoundedIcon sx={{ fontSize: 64, color: "#EF4444", mb: 2, mt: 4 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Request not found
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Could not load tracking data. Please go back and try again.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/ambulance")}
          sx={{
            borderRadius: 999,
            px: 4,
            textTransform: "none",
            fontWeight: 600,
            bgcolor: "#B91C1C",
            color: "#FEF2F2",
            "&:hover": { bgcolor: "#991B1B" }
          }}
        >
          Back to dashboard
        </Button>
      </Box>
    );
  }

  const eta = request.status === "In Transit" ? "6 min" : "Awaiting dispatch";
  const remainingDistance = request.status === "In Transit" ? "3.2 km" : "—";
  const progressPercent = request.status === "In Transit" ? 62 : 0;
  const hospitalPhone = "+256 414 270 531";

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
              Track ambulance
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {request.id}
            </Typography>
          </Box>
        </Box>
        <Chip
          size="small"
          label={request.status}
          sx={{
            borderRadius: 999,
            fontSize: 10,
            height: 22,
            fontWeight: 600,
            bgcolor:
              request.status === "In Transit"
                ? "rgba(245,158,11,0.15)"
                : "rgba(59,130,246,0.15)",
            color:
              request.status === "In Transit" ? "#F59E0B" : "#3B82F6"
          }}
        />
      </Box>

      {/* Map area */}
      <Box
        sx={{
          position: "relative",
          borderRadius: 3,
          overflow: "hidden",
          height: 240,
          mb: 2,
          background: (t) =>
            t.palette.mode === "light"
              ? "linear-gradient(135deg, #FEF2F2 0%, #F3F4F6 40%, #ECFDF5 100%)"
              : "linear-gradient(135deg, rgba(127,29,29,0.4) 0%, #020617 40%, rgba(6,78,59,0.3) 100%)"
        }}
      >
        {/* Grid overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.5) 1px, transparent 1px)",
            backgroundSize: "30px 30px"
          }}
        />

        {/* Route path line */}
        <Box
          sx={{
            position: "absolute",
            left: "18%",
            bottom: "28%",
            width: "64%",
            height: 3,
            bgcolor: "#DC2626",
            opacity: 0.4,
            borderRadius: 2,
            transform: "rotate(-18deg)",
            transformOrigin: "left center"
          }}
        />
        {/* Completed portion of route */}
        {request.status === "In Transit" && (
          <Box
            sx={{
              position: "absolute",
              left: "18%",
              bottom: "28%",
              width: `${progressPercent * 0.64}%`,
              height: 3,
              bgcolor: "#16A34A",
              borderRadius: 2,
              transform: "rotate(-18deg)",
              transformOrigin: "left center"
            }}
          />
        )}

        {/* Pickup marker */}
        <Box
          sx={{
            position: "absolute",
            left: "15%",
            bottom: "22%",
            transform: "translate(-50%, 0)",
            textAlign: "center"
          }}
        >
          <PlaceRoundedIcon
            sx={{ fontSize: 28, color: "#DC2626", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))" }}
          />
          <Typography
            variant="caption"
            sx={{
              display: "block",
              fontSize: 8,
              fontWeight: 700,
              color: (t) => t.palette.text.primary,
              bgcolor: (t) => t.palette.mode === "light" ? "rgba(255,255,255,0.9)" : "rgba(15,23,42,0.9)",
              px: 0.5,
              borderRadius: 0.5,
              mt: 0.25
            }}
          >
            Pickup
          </Typography>
        </Box>

        {/* Ambulance marker (moving) */}
        {request.status === "In Transit" && (
          <Box
            sx={{
              position: "absolute",
              left: "48%",
              top: "46%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              animation: "pulse 2s ease-in-out infinite",
              "@keyframes pulse": {
                "0%, 100%": { transform: "translate(-50%, -50%) scale(1)" },
                "50%": { transform: "translate(-50%, -50%) scale(1.15)" }
              }
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 999,
                bgcolor: "rgba(249,115,22,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #F97316"
              }}
            >
              <DirectionsCarRoundedIcon
                sx={{ fontSize: 22, color: "#F97316" }}
              />
            </Box>
          </Box>
        )}

        {/* Hospital marker */}
        <Box
          sx={{
            position: "absolute",
            right: "12%",
            top: "20%",
            transform: "translate(50%, 0)",
            textAlign: "center"
          }}
        >
          <LocalHospitalRoundedIcon
            sx={{ fontSize: 28, color: "#16A34A", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))" }}
          />
          <Typography
            variant="caption"
            sx={{
              display: "block",
              fontSize: 8,
              fontWeight: 700,
              color: (t) => t.palette.text.primary,
              bgcolor: (t) => t.palette.mode === "light" ? "rgba(255,255,255,0.9)" : "rgba(15,23,42,0.9)",
              px: 0.5,
              borderRadius: 0.5,
              mt: 0.25
            }}
          >
            Hospital
          </Typography>
        </Box>

        {/* ETA & distance chips */}
        <Stack direction="row" spacing={0.75} sx={{ position: "absolute", left: 10, top: 10 }}>
          <Chip
            size="small"
            icon={<AccessTimeRoundedIcon sx={{ fontSize: 13 }} />}
            label={`ETA: ${eta}`}
            sx={{
              borderRadius: 999,
              fontSize: 10,
              height: 24,
              bgcolor: "rgba(15,23,42,0.85)",
              color: "#F9FAFB",
              fontWeight: 600,
              "& .MuiChip-icon": { color: "#F9FAFB" }
            }}
          />
          <Chip
            size="small"
            icon={<StraightenRoundedIcon sx={{ fontSize: 13 }} />}
            label={`${remainingDistance} remaining`}
            sx={{
              borderRadius: 999,
              fontSize: 10,
              height: 24,
              bgcolor: "rgba(15,23,42,0.85)",
              color: "#F9FAFB",
              fontWeight: 600,
              "& .MuiChip-icon": { color: "#F9FAFB" }
            }}
          />
        </Stack>
      </Box>

      {/* Progress bar */}
      {request.status === "In Transit" && (
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <NavigationRoundedIcon sx={{ fontSize: 14, color: "#F59E0B" }} />
              <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600 }}>
                En route to hospital
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary" }}>
              {progressPercent}% complete
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: (t) => t.palette.mode === "light" ? "#FEE2E2" : "rgba(127,29,29,0.3)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 3,
                bgcolor: "#DC2626"
              }
            }}
          />
        </Box>
      )}

      {/* Route summary */}
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
        <CardContent sx={{ px: 1.75, py: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 24, height: 24, borderRadius: 999, bgcolor: "rgba(220,38,38,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PlaceRoundedIcon sx={{ fontSize: 14, color: "#DC2626" }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: 10, color: "text.secondary" }}>Pickup</Typography>
                <Typography variant="body2" sx={{ fontSize: 12.5, fontWeight: 600 }}>{request.pickup}</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 24, height: 24, borderRadius: 999, bgcolor: "rgba(22,163,74,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FlagRoundedIcon sx={{ fontSize: 14, color: "#16A34A" }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: 10, color: "text.secondary" }}>Destination</Typography>
                <Typography variant="body2" sx={{ fontSize: 12.5, fontWeight: 600 }}>{request.destination}</Typography>
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Call buttons */}
      <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
        <Button
          fullWidth
          size="small"
          variant="outlined"
          onClick={() => {
            if (request.driver.phone !== "—") {
              window.location.href = `tel:${request.driver.phone.replace(/\s/g, "")}`;
            }
          }}
          disabled={request.driver.phone === "—"}
          startIcon={<PhoneIphoneRoundedIcon sx={{ fontSize: 16 }} />}
          sx={{
            borderRadius: 999,
            py: 0.75,
            fontSize: 12,
            textTransform: "none",
            fontWeight: 600,
            borderColor: "#F59E0B",
            color: "#F59E0B",
            "&:hover": {
              borderColor: "#D97706",
              bgcolor: "rgba(245,158,11,0.08)"
            },
            "&.Mui-disabled": {
              borderColor: (t: any) => t.palette.divider,
              color: (t: any) => t.palette.text.disabled
            }
          }}
        >
          Call ambulance
        </Button>
        <Button
          fullWidth
          size="small"
          variant="outlined"
          onClick={() => window.location.href = `tel:${hospitalPhone}`}
          startIcon={<PhoneEnabledRoundedIcon sx={{ fontSize: 16 }} />}
          sx={{
            borderRadius: 999,
            py: 0.75,
            fontSize: 12,
            textTransform: "none",
            fontWeight: 600,
            borderColor: "#16A34A",
            color: "#16A34A",
            "&:hover": {
              borderColor: "#15803D",
              bgcolor: "rgba(22,163,74,0.08)"
            }
          }}
        >
          Call hospital
        </Button>
      </Stack>

      {/* Driver details card */}
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
        <CardContent sx={{ px: 1.75, py: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1 }}>
            <DirectionsCarRoundedIcon sx={{ fontSize: 16, color: "#F59E0B" }} />
            <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700 }}>
              Driver details
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Driver avatar */}
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FEF2F2" : "rgba(127,29,29,0.4)",
                border: "2px solid",
                borderColor: request.driver.name === "Pending assignment" ? "#9CA3AF" : "#F59E0B"
              }}
              src={
                request.driver.name !== "Pending assignment"
                  ? `https://ui-avatars.com/api/?name=${encodeURIComponent(request.driver.name)}&background=F59E0B&color=fff&size=112&bold=true`
                  : undefined
              }
            >
              <PersonRoundedIcon sx={{ fontSize: 28, color: "#9CA3AF" }} />
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 13.5, mb: 0.25 }}>
                {request.driver.name}
              </Typography>

              {request.driver.rating > 0 && (
                <Stack direction="row" spacing={0.3} alignItems="center" sx={{ mb: 0.5 }}>
                  <StarRoundedIcon sx={{ fontSize: 14, color: "#F59E0B" }} />
                  <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600 }}>
                    {request.driver.rating}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: 10, color: "text.secondary" }}>
                    rating
                  </Typography>
                </Stack>
              )}

              <Stack direction="row" spacing={0.5} alignItems="center">
                <PhoneIphoneRoundedIcon sx={{ fontSize: 13, color: "text.secondary" }} />
                <Typography variant="caption" sx={{ fontSize: 11 }}>
                  {request.driver.phone}
                </Typography>
              </Stack>
            </Box>
          </Stack>

          <Divider sx={{ my: 1.2 }} />

          <Stack spacing={0.6}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <BadgeRoundedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography variant="caption" sx={{ fontSize: 11.5 }}>
                {request.driver.vehicleType}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <DirectionsCarRoundedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography variant="caption" sx={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.05em" }}>
                {request.driver.vehiclePlate}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Requester details card */}
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
        <CardContent sx={{ px: 1.75, py: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1 }}>
            <PersonRoundedIcon sx={{ fontSize: 16, color: "#3B82F6" }} />
            <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700 }}>
              Requester details
            </Typography>
          </Stack>

          <Stack spacing={0.6}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <PersonRoundedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography variant="caption" sx={{ fontSize: 11.5 }}>
                {request.requester.name}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <PhoneIphoneRoundedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography variant="caption" sx={{ fontSize: 11.5 }}>
                {request.requester.phone}
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary", pl: 2.5 }}>
              For: {request.requester.forWhom}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary", pl: 2.5 }}>
              Reason: {request.requester.reason}
            </Typography>
            {request.requester.notes && (
              <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary", pl: 2.5, fontStyle: "italic" }}>
                Notes: {request.requester.notes}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}
      >
        If the patient's condition changes, use the contact options above to
        update the ambulance crew or hospital directly.
      </Typography>
    </Box>
  );
}

export default function RiderScreen87AmbulanceLiveTrackingCanvas_v2() {
  return (
    <>
      <DarkModeToggle />
      <MobileShell>
        <AmbulanceLiveTrackingScreen />
      </MobileShell>
    </>
  );
}
