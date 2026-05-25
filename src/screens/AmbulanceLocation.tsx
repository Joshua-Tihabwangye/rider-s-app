import React, { useMemo, useRef, useState } from "react";
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
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import { useAppData } from "../contexts/AppDataContext";
import {
  ambulanceCompactTypographySx,
  ambulanceContainedButtonSx,
  ambulanceGreen
} from "../components/ambulance/ambulanceTypography";

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
    request.pickup?.address ?? "Nakasero Hill Road, Kampala, Uganda"
  );
  const [patientName, setPatientName] = useState(request.patientName ?? "Mary Atieno");
  const [patientAge, setPatientAge] = useState(toAgeValue(request.patientAge) || "63");
  const [condition, setCondition] = useState(request.patientCondition ?? "Chest pain");
  const [mobilityNeeds, setMobilityNeeds] = useState("Wheelchair assistance");
  const [pickupMode, setPickupMode] = useState<"current" | "map" | "manual">("manual");
  const [pickupHint, setPickupHint] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [contentExtendedDown, setContentExtendedDown] = useState(false);
  const pickupInputRef = useRef<HTMLInputElement | null>(null);

  const canContinue =
    pickupAddress.trim().length > 0 &&
    patientName.trim().length > 0 &&
    patientAge.trim().length > 0 &&
    condition.trim().length > 0;

  const parsedAge = useMemo(() => {
    const value = Number.parseInt(patientAge, 10);
    return Number.isFinite(value) ? value : undefined;
  }, [patientAge]);

  const useCurrentLocation = () => {
    setPickupMode("current");
    setPickupHint("");
    if (!("geolocation" in navigator)) {
      setPickupAddress("Current location unavailable on this device");
      setPickupHint("Geolocation is not supported by your browser.");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPickupAddress(
          `Current location: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
        );
        setPickupHint("Live coordinates fetched from your device location.");
        setGeoLoading(false);
      },
      () => {
        setPickupAddress("Kampala, Uganda");
        setPickupHint("Unable to fetch GPS location. Fallback set to Kampala.");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const chooseOnMap = () => {
    setPickupMode("map");
    setContentExtendedDown(true);
    setPickupAddress("Pinned location on map, Kampala, Uganda");
    setPickupHint("Map pin selected. Adjust map and continue.");
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const enterManually = () => {
    setPickupMode("manual");
    setPickupHint("Enter the full street and landmark for faster dispatch.");
    window.requestAnimationFrame(() => {
      pickupInputRef.current?.focus();
      pickupInputRef.current?.select();
    });
  };

  return (
    <Box sx={[{ px: 2.5, pt: 2.5, pb: 4 }, ambulanceCompactTypographySx]}>
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

      <Box
        sx={{
          position: "relative",
          width: "100vw",
          ml: "calc(50% - 50vw)",
          mr: "calc(50% - 50vw)",
          mb: 0.5,
          height: contentExtendedDown ? { xs: "56vh", sm: "52vh" } : { xs: "36vh", sm: "34vh" },
          transition: "height 260ms ease",
          overflow: "hidden"
        }}
      >
        <Box
          sx={{
            position: "relative",
            height: "100%",
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
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
        <Button
          onClick={() => setContentExtendedDown((prev) => !prev)}
          startIcon={contentExtendedDown ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
          sx={{
            minWidth: 0,
            borderRadius: 999,
            px: 2,
            py: 0.5,
            textTransform: "none",
            fontWeight: 700,
            color: "#334155",
            bgcolor: "#F1F5F9",
            border: "1px solid var(--evz-border-subtle)",
            "&:hover": { bgcolor: "#E2E8F0" }
          }}
        >
          {contentExtendedDown ? "Show details" : "Extend map"}
        </Button>
      </Box>

      <Box
        sx={{
          transform: contentExtendedDown ? { xs: "translateY(8vh)", sm: "translateY(6vh)" } : "translateY(0)",
          transition: "transform 260ms ease"
        }}
      >

      <Card
        elevation={0}
        sx={{ mb: 2, borderRadius: 3, border: "1px solid var(--evz-border-subtle)", p: 2 }}
      >
        <Typography variant="h6" sx={{ fontSize: 20, fontWeight: 700, mb: 1.4 }}>
          Patient pickup location
        </Typography>

        <TextField
          fullWidth
          inputRef={pickupInputRef}
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
            {
              key: "current" as const,
              icon: <MyLocationRoundedIcon />,
              label: geoLoading ? "Locating..." : "Use current location",
              onClick: useCurrentLocation
            },
            {
              key: "map" as const,
              icon: <MapRoundedIcon />,
              label: "Choose on map",
              onClick: chooseOnMap
            },
            {
              key: "manual" as const,
              icon: <EditRoundedIcon />,
              label: "Enter manually",
              onClick: enterManually
            }
          ].map((action) => (
            <Button
              key={action.key}
              fullWidth
              variant={pickupMode === action.key ? "contained" : "outlined"}
              startIcon={action.icon}
              onClick={action.onClick}
              disabled={geoLoading && action.key !== "current"}
              sx={{
                borderRadius: 2,
                py: 1,
                borderColor: pickupMode === action.key ? ambulanceGreen : "var(--evz-border-subtle)",
                color: pickupMode === action.key ? "#FFFFFF" : "#334155",
                fontSize: 12,
                lineHeight: 1.2,
                ...(pickupMode === action.key
                  ? {
                      bgcolor: ambulanceGreen,
                      "&:hover": { bgcolor: "#0F9B5D" }
                    }
                  : {})
              }}
            >
              {action.label}
            </Button>
          ))}
        </Stack>
        {pickupHint ? (
          <Typography sx={{ mt: 1, color: "#64748B", fontSize: 11.6 }}>
            {pickupHint}
          </Typography>
        ) : null}
      </Card>

      <Card
        elevation={0}
        sx={{ mb: 2, borderRadius: 3, border: "1px solid var(--evz-border-subtle)", p: 2 }}
      >
        <Typography variant="h6" sx={{ fontSize: 20, fontWeight: 700, mb: 1.4 }}>
          Patient details
        </Typography>

        <Stack spacing={1.2} sx={{ mb: 1.4 }}>
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
      </Box>

      <Card
        elevation={0}
        sx={{
          mt: 1.4,
          borderRadius: 3,
          border: "1px solid var(--evz-border-subtle)",
          px: 2,
          py: 1.5
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 1.5 }} alignItems={{ xs: "stretch", sm: "center" }}>
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
              <Typography sx={{ fontWeight: 700, fontSize: { xs: 14, sm: 16 }, lineHeight: 1.2 }}>
                {formatRequestType(request.urgency)}
              </Typography>
              <Typography sx={{ color: "#DC2626", fontSize: { xs: 11, sm: 12 }, whiteSpace: "nowrap" }}>
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
              minWidth: { xs: "100%", sm: 220, md: 248 },
              borderRadius: 3,
              px: { xs: 1.8, sm: 2.4 },
              py: { xs: 0.95, sm: 1.5 },
              fontSize: { xs: 13, sm: 15 },
              whiteSpace: { xs: "normal", sm: "nowrap" },
              flexShrink: 0,
              fontWeight: 700,
              ...ambulanceContainedButtonSx,
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
