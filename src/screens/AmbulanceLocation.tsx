import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import AddAlertRoundedIcon from "@mui/icons-material/AddAlertRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import MonitorHeartRoundedIcon from "@mui/icons-material/MonitorHeartRounded";
import AccessibleRoundedIcon from "@mui/icons-material/AccessibleRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useAppData } from "../contexts/AppDataContext";

const mobilityOptions = [
  "Wheelchair assistance",
  "Stretcher required",
  "Walking assisted",
  "No special support"
];

function formatRequestType(urgency: "low" | "medium" | "high"): string {
  if (urgency === "high") return "Emergency ambulance";
  if (urgency === "medium") return "Priority ambulance";
  return "Standard ambulance";
}

function toAgeValue(value?: number): string {
  if (!value || value <= 0) return "";
  return String(value);
}

function AmbulanceLocationPatientDetailsScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { ambulance, actions } = useAppData();
  const request = ambulance.request;

  const [pickupAddress, setPickupAddress] = useState(
    request.pickup?.address ?? "12 Riverside Ave, Indiranagar, Bengaluru"
  );
  const [patientName, setPatientName] = useState(request.patientName ?? "Mary Atieno");
  const [patientAge, setPatientAge] = useState(toAgeValue(request.patientAge) || "63");
  const [condition, setCondition] = useState(request.patientCondition ?? "Chest pain");
  const [mobilityNeeds, setMobilityNeeds] = useState("Wheelchair assistance");

  const canContinue =
    pickupAddress.trim().length > 0 &&
    patientName.trim().length > 0 &&
    patientAge.trim().length > 0 &&
    condition.trim().length > 0;

  const parsedAge = useMemo(() => {
    const value = Number.parseInt(patientAge, 10);
    return Number.isFinite(value) ? value : undefined;
  }, [patientAge]);

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 16 }}>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1
        }}
      >
        <IconButton
          size="small"
          aria-label="Back"
          onClick={() => navigate(-1)}
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.92)"),
            border: "1px solid var(--evz-border-subtle)"
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>

        <Typography variant="h5" sx={{ fontWeight: 700, fontSize: 20, letterSpacing: "-0.01em" }}>
          Pickup location
        </Typography>

        <Chip
          icon={<AddAlertRoundedIcon sx={{ fontSize: 16 }} />}
          label="Emergency"
          size="small"
          sx={{
            height: 36,
            borderRadius: 2,
            px: 0.6,
            bgcolor: "rgba(239,68,68,0.12)",
            color: "#DC2626",
            border: "1px solid rgba(239,68,68,0.2)",
            fontWeight: 600
          }}
        />
      </Box>

      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 3,
          border: "1px solid var(--evz-border-subtle)",
          overflow: "hidden"
        }}
      >
        <Box
          sx={{
            position: "relative",
            height: 286,
            bgcolor: "#EEF2F7",
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.18) 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.6
            }}
          >
            <Box
              sx={{
                width: 58,
                height: 58,
                borderRadius: "50%",
                bgcolor: "rgba(220,38,38,0.12)",
                display: "grid",
                placeItems: "center"
              }}
            >
              <LocalHospitalRoundedIcon sx={{ color: "#DC2626", fontSize: 34 }} />
            </Box>
            <PlaceRoundedIcon sx={{ color: "#DC2626", fontSize: 34 }} />
          </Box>

          <IconButton
            size="small"
            sx={{
              position: "absolute",
              left: 16,
              bottom: 16,
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.96)",
              border: "1px solid var(--evz-border-subtle)"
            }}
          >
            <MyLocationRoundedIcon sx={{ color: "#059669" }} />
          </IconButton>

          <Box
            sx={{
              position: "absolute",
              right: 26,
              bottom: 26,
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: "rgba(59,130,246,0.18)",
              display: "grid",
              placeItems: "center"
            }}
          >
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                bgcolor: "#2563EB",
                border: "3px solid #FFFFFF"
              }}
            />
          </Box>
        </Box>
      </Card>

      <Card
        elevation={0}
        sx={{ mb: 2, borderRadius: 3, border: "1px solid var(--evz-border-subtle)", p: 2 }}
      >
        <Typography variant="h6" sx={{ fontSize: 20, fontWeight: 700, mb: 1.4 }}>
          Patient pickup location
        </Typography>

        <TextField
          fullWidth
          value={pickupAddress}
          onChange={(event) => setPickupAddress(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PlaceRoundedIcon sx={{ color: "#059669" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <CheckCircleRoundedIcon sx={{ color: "#059669" }} />
              </InputAdornment>
            )
          }}
          sx={{
            mb: 1.5,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "#FFFFFF"
            }
          }}
        />

        <Stack direction="row" spacing={1}>
          {[
            { icon: <MyLocationRoundedIcon />, label: "Use current location" },
            { icon: <MapRoundedIcon />, label: "Choose on map" },
            { icon: <EditRoundedIcon />, label: "Enter manually" }
          ].map((action) => (
            <Button
              key={action.label}
              fullWidth
              variant="outlined"
              startIcon={action.icon}
              sx={{
                borderRadius: 2,
                py: 1,
                borderColor: "var(--evz-border-subtle)",
                color: "#334155",
                fontSize: 12,
                lineHeight: 1.2
              }}
            >
              {action.label}
            </Button>
          ))}
        </Stack>
      </Card>

      <Card
        elevation={0}
        sx={{ mb: 2, borderRadius: 3, border: "1px solid var(--evz-border-subtle)", p: 2 }}
      >
        <Typography variant="h6" sx={{ fontSize: 20, fontWeight: 700, mb: 1.4 }}>
          Patient details
        </Typography>

        <Stack direction="row" spacing={1.25} sx={{ mb: 1.2 }}>
          <TextField
            fullWidth
            label="Patient name"
            value={patientName}
            onChange={(event) => setPatientName(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineRoundedIcon sx={{ color: "#059669" }} />
                </InputAdornment>
              )
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
          <TextField
            fullWidth
            label="Age"
            value={patientAge}
            onChange={(event) => setPatientAge(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonthRoundedIcon sx={{ color: "#059669" }} />
                </InputAdornment>
              )
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
        </Stack>

        <Stack direction="row" spacing={1.25} sx={{ mb: 1.4 }}>
          <TextField
            fullWidth
            label="Condition"
            value={condition}
            onChange={(event) => setCondition(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MonitorHeartRoundedIcon sx={{ color: "#EA580C" }} />
                </InputAdornment>
              )
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
          <TextField
            fullWidth
            select
            label="Mobility needs"
            value={mobilityNeeds}
            onChange={(event) => setMobilityNeeds(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccessibleRoundedIcon sx={{ color: "#EA580C" }} />
                </InputAdornment>
              )
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          >
            {mobilityOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Box
          sx={{
            borderRadius: 2,
            border: "1px solid rgba(239,68,68,0.18)",
            bgcolor: "rgba(239,68,68,0.06)",
            px: 1.5,
            py: 1.2,
            display: "flex",
            alignItems: "center",
            gap: 1
          }}
        >
          <AddAlertRoundedIcon sx={{ color: "#DC2626" }} />
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 18 }}>Priority dispatch enabled</Typography>
            <Typography sx={{ fontSize: 13, color: "#475569" }}>
              Closest ambulance will be assigned to your request.
            </Typography>
          </Box>
        </Box>
      </Card>

      <Card
        elevation={8}
        sx={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: "calc(72px + env(safe-area-inset-bottom, 0px))",
          mx: "auto",
          maxWidth: { xs: "100%", md: "768px", lg: "1024px" },
          borderRadius: 0,
          borderTop: "1px solid var(--evz-border-subtle)",
          px: 2,
          py: 1.5,
          zIndex: 1100
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 2,
                bgcolor: "rgba(239,68,68,0.08)",
                display: "grid",
                placeItems: "center"
              }}
            >
              <LocalHospitalRoundedIcon sx={{ color: "#DC2626" }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 12, color: "#64748B" }}>Request type</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 16 }}>{formatRequestType(request.urgency)}</Typography>
              <Typography sx={{ color: "#DC2626", fontSize: 12, whiteSpace: "nowrap" }}>
                Priority dispatch • Immediate response
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            disabled={!canContinue}
            onClick={() => {
              actions.updateAmbulanceRequest({
                pickup: { label: pickupAddress, address: pickupAddress },
                patientName,
                patientAge: parsedAge,
                patientCondition: condition,
                patientPhone: request.patientPhone ?? request.callerPhone ?? "+256700000000",
                notes: mobilityNeeds,
                status: "requested"
              });
              navigate("/ambulance/destination");
            }}
            endIcon={<ChevronRightRoundedIcon />}
            sx={{
              minWidth: 248,
              borderRadius: 3,
              py: 1.5,
              fontSize: 15,
              fontWeight: 700,
              color: "#FFFFFF",
              background: "linear-gradient(90deg, #059669 0%, #EA580C 100%)",
              "&:hover": {
                background: "linear-gradient(90deg, #047857 0%, #C2410C 100%)"
              },
              "&.Mui-disabled": {
                color: "#E2E8F0",
                background: "#94A3B8"
              }
            }}
          >
            Continue to destination
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}

export default function RiderScreen84AmbulanceLocationPatientDetailsCanvas_v2(): React.JSX.Element {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (t) => t.palette.background.default
      }}
    >
      <AmbulanceLocationPatientDetailsScreen />
    </Box>
  );
}
