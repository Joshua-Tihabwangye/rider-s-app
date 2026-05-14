import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import KeyboardVoiceRoundedIcon from "@mui/icons-material/KeyboardVoiceRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";
import TransferWithinAStationRoundedIcon from "@mui/icons-material/TransferWithinAStationRounded";
import { useAppData } from "../contexts/AppDataContext";

interface HospitalOption {
  id: string;
  name: string;
  distance: string;
  eta: string;
}

interface AmbulanceOption {
  id: string;
  label: string;
  subtitle: string;
  crew: string;
  eta: string;
  price: string;
}

const hospitals: HospitalOption[] = [
  { id: "city-general", name: "City General Hospital", distance: "1.2 km", eta: "6 min" },
  { id: "st-mary", name: "St. Mary's Medical Center", distance: "2.4 km", eta: "9 min" },
  { id: "green-cross", name: "Green Cross Clinic", distance: "3.1 km", eta: "12 min" }
];

const ambulanceOptions: AmbulanceOption[] = [
  {
    id: "basic",
    label: "Basic ambulance",
    subtitle: "Basic equipment",
    crew: "2 Crew",
    eta: "8 min",
    price: "UGX 1,599"
  },
  {
    id: "als",
    label: "Advanced life support",
    subtitle: "Advanced equipment",
    crew: "2 Crew",
    eta: "12 min",
    price: "UGX 2,699"
  },
  {
    id: "icu",
    label: "ICU ambulance",
    subtitle: "ICU equipment",
    crew: "3 Crew",
    eta: "15 min",
    price: "UGX 3,999"
  }
];

function AmbulanceDestinationHospitalSelectionScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { ambulance, actions } = useAppData();
  const pickupAddress = ambulance.request.pickup?.address ?? "12, MG Road, Indiranagar";
  const patientName = ambulance.request.patientName ?? "Rohit Sharma";
  const age = ambulance.request.patientAge ?? 32;

  const [query, setQuery] = useState(ambulance.request.destination?.address ?? "");
  const [selectedHospital, setSelectedHospital] = useState<HospitalOption>(hospitals[0]);
  const [selectedAmbulance, setSelectedAmbulance] = useState<AmbulanceOption>(ambulanceOptions[0]);
  const [transferType, setTransferType] = useState<"emergency" | "patient" | "inter_hospital">("emergency");

  const visibleHospitals = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return hospitals;
    return hospitals.filter((hospital) => hospital.name.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 16 }}>
      <Box
        sx={{
          mb: 2,
          display: "grid",
          gridTemplateColumns: "42px 1fr 42px",
          alignItems: "center",
          gap: 1
        }}
      >
        <IconButton
          size="small"
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

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 700, fontSize: 20 }}>
            Destination
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: 13 }}>Step 2 of 4</Typography>
        </Box>

        <IconButton
          size="small"
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.92)"),
            border: "1px solid var(--evz-border-subtle)"
          }}
        >
          <NotificationsNoneRoundedIcon sx={{ fontSize: 21 }} />
        </IconButton>
      </Box>

      <Card elevation={0} sx={{ mb: 2, borderRadius: 3, border: "1px solid var(--evz-border-subtle)", p: 2 }}>
        <Stack direction="row" spacing={1.5}>
          <Stack alignItems="center" sx={{ pt: 0.2 }}>
            <PlaceRoundedIcon sx={{ color: "#059669", fontSize: 26 }} />
            <Box sx={{ width: 2, height: 24, borderLeft: "2px dashed rgba(5,150,105,0.45)" }} />
            <PersonOutlineRoundedIcon sx={{ color: "#059669", fontSize: 25, opacity: 0.85 }} />
          </Stack>

          <Stack spacing={1.1} sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box>
                <Typography sx={{ color: "#059669", fontWeight: 600, fontSize: 14 }}>Pickup location</Typography>
                <Typography sx={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>{pickupAddress}</Typography>
                <Typography sx={{ color: "#64748B", fontSize: 13 }}>Bengaluru, Karnataka 560038</Typography>
              </Box>
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate("/ambulance/location")}
                sx={{ borderRadius: 2, textTransform: "none", borderColor: "rgba(5,150,105,0.4)", color: "#059669" }}
              >
                Edit pickup
              </Button>
            </Box>

            <Box>
              <Typography sx={{ color: "#059669", fontWeight: 600, fontSize: 14 }}>Patient</Typography>
              <Typography sx={{ fontSize: 17, fontWeight: 700, lineHeight: 1.2 }}>{patientName}</Typography>
              <Typography sx={{ color: "#475569", fontSize: 13 }}>Male • {age} years</Typography>
            </Box>
          </Stack>
        </Stack>
      </Card>

      <TextField
        fullWidth
        placeholder="Hospital or destination"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Stack direction="row" spacing={0.6} alignItems="center">
                <KeyboardVoiceRoundedIcon sx={{ color: "#64748B" }} />
                <Box sx={{ width: 1, height: 18, bgcolor: "rgba(148,163,184,0.4)" }} />
                <MyLocationRoundedIcon sx={{ color: "#059669" }} />
              </Stack>
            </InputAdornment>
          )
        }}
        sx={{
          mb: 1.8,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2.5,
            bgcolor: "#FFFFFF"
          }
        }}
      />

      <Box sx={{ mb: 1.2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography sx={{ fontWeight: 700, fontSize: 20 }}>Suggested hospitals</Typography>
        <Button size="small" sx={{ color: "#059669", textTransform: "none", fontWeight: 700 }}>
          View all
        </Button>
      </Box>

      <Stack spacing={1} sx={{ mb: 1.8 }}>
        {visibleHospitals.map((hospital) => {
          const selected = selectedHospital.id === hospital.id;
          return (
            <Card
              key={hospital.id}
              elevation={0}
              onClick={() => setSelectedHospital(hospital)}
              sx={{
                borderRadius: 2.5,
                border: selected ? "1px solid rgba(5,150,105,0.45)" : "1px solid var(--evz-border-subtle)",
                px: 1.4,
                py: 1.2,
                cursor: "pointer"
              }}
            >
              <Stack direction="row" spacing={1.4} alignItems="center">
                <Box
                  sx={{
                    width: 54,
                    height: 54,
                    borderRadius: 2,
                    bgcolor: selected ? "rgba(5,150,105,0.08)" : "rgba(148,163,184,0.12)",
                    display: "grid",
                    placeItems: "center"
                  }}
                >
                  <LocalHospitalRoundedIcon sx={{ color: selected ? "#059669" : "#64748B", fontSize: 30 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 17 }}>{hospital.name}</Typography>
                  <Stack direction="row" spacing={1.4} alignItems="center" sx={{ color: "#475569", fontSize: 13, mt: 0.2 }}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <RoomOutlinedIcon sx={{ fontSize: 16 }} />
                      <Typography sx={{ fontSize: 13 }}>{hospital.distance}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <AccessTimeRoundedIcon sx={{ fontSize: 16 }} />
                      <Typography sx={{ fontSize: 13 }}>{hospital.eta}</Typography>
                    </Stack>
                  </Stack>
                </Box>
                <Button sx={{ color: "#059669", textTransform: "none", fontWeight: 700, minWidth: 64 }}>
                  Select
                </Button>
                <ChevronRightRoundedIcon sx={{ color: "#64748B" }} />
              </Stack>
            </Card>
          );
        })}
      </Stack>

      <Typography sx={{ fontWeight: 700, fontSize: 20, mb: 0.9 }}>Transfer type</Typography>
      <Card elevation={0} sx={{ mb: 1.8, borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 0.6 }}>
        <Stack direction="row" spacing={0.6}>
          <Chip
            icon={<HealthAndSafetyRoundedIcon sx={{ fontSize: 17 }} />}
            label="Emergency"
            onClick={() => setTransferType("emergency")}
            sx={{
              flex: 1,
              height: 42,
              borderRadius: 2,
              bgcolor: transferType === "emergency" ? "rgba(239,68,68,0.12)" : "transparent",
              border: transferType === "emergency" ? "1px solid rgba(239,68,68,0.35)" : "1px solid transparent",
              color: transferType === "emergency" ? "#DC2626" : "#334155",
              fontWeight: 600
            }}
          />
          <Chip
            icon={<PersonOutlineRoundedIcon sx={{ fontSize: 17 }} />}
            label="Patient transfer"
            onClick={() => setTransferType("patient")}
            sx={{
              flex: 1,
              height: 42,
              borderRadius: 2,
              bgcolor: transferType === "patient" ? "rgba(5,150,105,0.1)" : "transparent",
              color: transferType === "patient" ? "#059669" : "#334155",
              fontWeight: 600
            }}
          />
          <Chip
            icon={<TransferWithinAStationRoundedIcon sx={{ fontSize: 17 }} />}
            label="Inter-hospital transfer"
            onClick={() => setTransferType("inter_hospital")}
            sx={{
              flex: 1,
              height: 42,
              borderRadius: 2,
              bgcolor: transferType === "inter_hospital" ? "rgba(5,150,105,0.1)" : "transparent",
              color: transferType === "inter_hospital" ? "#059669" : "#334155",
              fontWeight: 600
            }}
          />
        </Stack>
      </Card>

      <Typography sx={{ fontWeight: 700, fontSize: 20, mb: 0.9 }}>Ambulance options</Typography>
      <Stack direction="row" spacing={1.25} sx={{ mb: 3, overflowX: "auto", pb: 0.2 }}>
        {ambulanceOptions.map((option) => {
          const selected = selectedAmbulance.id === option.id;
          return (
            <Card
              key={option.id}
              elevation={0}
              onClick={() => setSelectedAmbulance(option)}
              sx={{
                minWidth: 232,
                borderRadius: 2.5,
                border: selected ? "2px solid rgba(5,150,105,0.55)" : "1px solid var(--evz-border-subtle)",
                p: 1.3,
                cursor: "pointer"
              }}
            >
              <Box
                sx={{
                  height: 86,
                  borderRadius: 2,
                  bgcolor: "#F8FAFC",
                  border: "1px solid var(--evz-border-subtle)",
                  display: "grid",
                  placeItems: "center",
                  mb: 1
                }}
              >
                <LocalHospitalRoundedIcon sx={{ fontSize: 50, color: selected ? "#059669" : "#64748B" }} />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: 18 }}>{option.label}</Typography>
              <Typography sx={{ color: "#475569", fontSize: 13 }}>{option.subtitle}</Typography>
              <Typography sx={{ color: "#475569", fontSize: 13, mb: 1 }}>{option.crew}</Typography>
              <Box sx={{ borderTop: "1px dashed var(--evz-border-subtle)", pt: 1, display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography sx={{ color: "#64748B", fontSize: 12 }}>ETA</Typography>
                  <Typography sx={{ fontWeight: 700, color: "#059669", fontSize: 18 }}>{option.eta}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: "#64748B", fontSize: 12 }}>Est. price</Typography>
                  <Typography sx={{ fontWeight: 700, color: "#EA580C", fontSize: 18 }}>{option.price}</Typography>
                </Box>
              </Box>
            </Card>
          );
        })}
      </Stack>

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
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ color: "#334155", fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              From: {pickupAddress}
            </Typography>
            <Typography sx={{ color: "#0F172A", fontWeight: 700, fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              To: {selectedHospital.name}
            </Typography>
            <Typography sx={{ color: "#475569", fontSize: 13 }}>
              Distance: {selectedHospital.distance} • ETA: {selectedHospital.eta}
            </Typography>
          </Box>

          <Button
            variant="contained"
            endIcon={<ChevronRightRoundedIcon />}
            onClick={() => {
              actions.updateAmbulanceRequest({
                destination: { label: selectedHospital.name, address: selectedHospital.name },
                urgency: transferType === "emergency" ? "high" : transferType === "patient" ? "medium" : "low",
                assignedUnit: selectedAmbulance.id.toUpperCase(),
                notes: `${selectedAmbulance.label} | ${selectedAmbulance.price}`,
                status: "requested"
              });
              navigate("/ambulance/confirmation");
            }}
            sx={{
              minWidth: 220,
              borderRadius: 3,
              py: 1.5,
              fontWeight: 700,
              fontSize: 16,
              color: "#FFFFFF",
              background: "linear-gradient(90deg, #059669 0%, #EA580C 100%)",
              "&:hover": {
                background: "linear-gradient(90deg, #047857 0%, #C2410C 100%)"
              }
            }}
          >
            Find ambulances
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}

export default function RiderScreen85AmbulanceDestinationHospitalSelectionCanvas_v2(): React.JSX.Element {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (t) => t.palette.background.default
      }}
    >
      <AmbulanceDestinationHospitalSelectionScreen />
    </Box>
  );
}
