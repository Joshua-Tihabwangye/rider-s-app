import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import type { Dayjs } from "dayjs";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";

import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";

const HOSPITALS = [
  "Mulago National Referral Hospital",
  "Nsambya Hospital",
  "Case Hospital",
  "International Hospital Kampala (IHK)",
  "Mengo Hospital",
  "Rubaga Hospital"
];

function BookTransferScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const passedForWhom = (location.state as { forWhom?: string })?.forWhom || "me";

  const [timingMode, setTimingMode] = useState<"now" | "schedule">("now");
  const [pickupLocation, setPickupLocation] = useState("");
  const [destinationHospital, setDestinationHospital] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [transferDate, setTransferDate] = useState<Dayjs | null>(null);
  const [transferTime, setTransferTime] = useState<Dayjs | null>(null);
  const [forWhom, setForWhom] = useState(passedForWhom);
  const [transferReason, setTransferReason] = useState("");
  const [notes, setNotes] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const canSubmit =
    pickupLocation.trim().length > 0 &&
    destinationHospital.trim().length > 0 &&
    patientName.trim().length > 0 &&
    patientPhone.trim().length > 0 &&
    (timingMode === "now" ||
      (transferDate !== null && transferTime !== null));

  const handleSubmit = () => {
    setShowSuccess(true);
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        navigate("/ambulance");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
              Request ambulance
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Get an ambulance now or schedule one in advance
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Pickup Location */}
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
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.5, display: "block" }}
          >
            Pickup location
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter pickup address or current location"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PlaceRoundedIcon sx={{ fontSize: 18, color: "#DC2626" }} />
                </InputAdornment>
              )
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 999,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFF7F7" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(248,113,113,0.9)"
                      : "rgba(127,29,29,0.9)"
                },
                "&:hover fieldset": { borderColor: "#DC2626" }
              }
            }}
          />
        </CardContent>
      </Card>

      {/* When do you need the ambulance? */}
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
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
            <AccessTimeRoundedIcon sx={{ fontSize: 18, color: (t) => t.palette.text.secondary }} />
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              When do you need the ambulance?
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.25}>
            <Button
              fullWidth
              variant={timingMode === "now" ? "contained" : "outlined"}
              onClick={() => setTimingMode("now")}
              startIcon={<BoltRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{
                borderRadius: 999,
                py: 1,
                fontSize: 13,
                fontWeight: timingMode === "now" ? 700 : 600,
                textTransform: "none",
                ...(timingMode === "now"
                  ? {
                      bgcolor: "#B91C1C",
                      color: "#FEF2F2",
                      "&:hover": {
                        bgcolor: "#991B1B",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(185,28,28,0.4)"
                      }
                    }
                  : {
                      borderColor: (t: any) =>
                        t.palette.mode === "light"
                          ? "rgba(209,213,219,0.9)"
                          : "rgba(51,65,85,0.9)",
                      color: (t: any) => t.palette.text.primary,
                      "&:hover": {
                        borderColor: "#DC2626",
                        bgcolor: (t: any) =>
                          t.palette.mode === "light"
                            ? "rgba(220,38,38,0.06)"
                            : "rgba(239,68,68,0.1)"
                      }
                    }),
                transition: "all 0.2s ease",
                "&:active": { transform: "translateY(0)" }
              }}
            >
              Now
            </Button>
            <Button
              fullWidth
              variant={timingMode === "schedule" ? "contained" : "outlined"}
              onClick={() => setTimingMode("schedule")}
              startIcon={<ScheduleRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{
                borderRadius: 999,
                py: 1,
                fontSize: 13,
                fontWeight: timingMode === "schedule" ? 700 : 600,
                textTransform: "none",
                ...(timingMode === "schedule"
                  ? {
                      bgcolor: "#B91C1C",
                      color: "#FEF2F2",
                      "&:hover": {
                        bgcolor: "#991B1B",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(185,28,28,0.4)"
                      }
                    }
                  : {
                      borderColor: (t: any) =>
                        t.palette.mode === "light"
                          ? "rgba(209,213,219,0.9)"
                          : "rgba(51,65,85,0.9)",
                      color: (t: any) => t.palette.text.primary,
                      "&:hover": {
                        borderColor: "#DC2626",
                        bgcolor: (t: any) =>
                          t.palette.mode === "light"
                            ? "rgba(220,38,38,0.06)"
                            : "rgba(239,68,68,0.1)"
                      }
                    }),
                transition: "all 0.2s ease",
                "&:active": { transform: "translateY(0)" }
              }}
            >
              Schedule
            </Button>
          </Stack>

          {timingMode === "now" && (
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                fontSize: 11,
                color: "#B91C1C",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                fontWeight: 600
              }}
            >
              <BoltRoundedIcon sx={{ fontSize: 14 }} />
              An ambulance will be dispatched immediately after confirmation
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Destination Hospital */}
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
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.75 }}>
            <LocalHospitalRoundedIcon sx={{ fontSize: 18, color: (t) => t.palette.text.secondary }} />
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Destination hospital
            </Typography>
          </Stack>

          <FormControl fullWidth size="small" sx={{ mb: 1.25 }}>
            <Select
              displayEmpty
              value={destinationHospital}
              onChange={(e) => setDestinationHospital(e.target.value)}
              renderValue={(val) => val || "Select a hospital"}
              sx={{
                borderRadius: 999,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": { borderColor: "primary.main" }
              }}
            >
              {HOSPITALS.map((h) => (
                <MenuItem key={h} value={h}>{h}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", gap: 0.5 }}>
            {HOSPITALS.slice(0, 4).map((h) => (
              <Chip
                key={h}
                label={h}
                size="small"
                onClick={() => setDestinationHospital(h)}
                sx={{
                  borderRadius: 999,
                  fontSize: 10,
                  height: 24,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  bgcolor:
                    destinationHospital === h
                      ? "rgba(220,38,38,0.12)"
                      : (t) =>
                          t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                  border: destinationHospital === h ? "1px solid #DC2626" : "none",
                  color: (t) => t.palette.text.primary,
                  "&:hover": { bgcolor: "rgba(220,38,38,0.08)" }
                }}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Patient & Schedule Details */}
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
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
            <PersonRoundedIcon sx={{ fontSize: 18, color: (t) => t.palette.text.secondary }} />
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Patient & schedule details
            </Typography>
          </Stack>

          <TextField
            fullWidth
            size="small"
            placeholder="Patient full name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                </InputAdornment>
              )
            }}
            sx={{
              mb: 1.2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 999,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": { borderColor: "primary.main" }
              }
            }}
          />

          <TextField
            fullWidth
            size="small"
            placeholder="Contact phone number"
            value={patientPhone}
            onChange={(e) => setPatientPhone(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIphoneRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                </InputAdornment>
              )
            }}
            sx={{
              mb: 1.2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 999,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": { borderColor: "primary.main" }
              }
            }}
          />

          {timingMode === "schedule" && (
            <Stack direction="row" spacing={1.25} sx={{ mb: 1.2 }}>
              <DatePicker
                label="Select date"
                value={transferDate}
                onChange={(val) => setTransferDate(val)}
                disablePast
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 999,
                        bgcolor: (t: any) =>
                          t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                        "& fieldset": {
                          borderColor: (t: any) =>
                            t.palette.mode === "light"
                              ? "rgba(209,213,219,0.9)"
                              : "rgba(51,65,85,0.9)"
                        },
                        "&:hover fieldset": { borderColor: "primary.main" }
                      }
                    }
                  }
                }}
              />
              <TimePicker
                label="Select time"
                value={transferTime}
                onChange={(val) => setTransferTime(val)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 999,
                        bgcolor: (t: any) =>
                          t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                        "& fieldset": {
                          borderColor: (t: any) =>
                            t.palette.mode === "light"
                              ? "rgba(209,213,219,0.9)"
                              : "rgba(51,65,85,0.9)"
                        },
                        "&:hover fieldset": { borderColor: "primary.main" }
                      }
                    }
                  }
                }}
              />
            </Stack>
          )}

          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.5, display: "block" }}>
            This request is for
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 1.2, flexWrap: "wrap" }}>
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
                          t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
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
                      : "rgba(239,68,68,0.06)"
                  }
                }}
              />
            ))}
          </Stack>

          <FormControl fullWidth size="small" sx={{ mb: 1.2 }}>
            <Select
              displayEmpty
              value={transferReason}
              onChange={(e) => setTransferReason(e.target.value)}
              renderValue={(val) => val || "Reason for transfer (optional)"}
              sx={{
                borderRadius: 999,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": { borderColor: "primary.main" }
              }}
            >
              <MenuItem value="Clinic referral">Clinic referral</MenuItem>
              <MenuItem value="Specialist appointment">Specialist appointment</MenuItem>
              <MenuItem value="Surgery / procedure">Surgery / procedure</MenuItem>
              <MenuItem value="Follow-up visit">Follow-up visit</MenuItem>
              <MenuItem value="Dialysis / chemotherapy">Dialysis / chemotherapy</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder="Additional notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DescriptionRoundedIcon sx={{ fontSize: 18, color: "text.secondary", mt: 0.5 }} />
                </InputAdornment>
              )
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": { borderColor: "primary.main" }
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Submit */}
      <Button
        fullWidth
        variant="contained"
        disabled={!canSubmit}
        onClick={handleSubmit}
        sx={{
          borderRadius: 999,
          py: 1.1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: canSubmit ? "#B91C1C" : "#9CA3AF",
          color: canSubmit ? "#FEF2F2" : "#E5E7EB",
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: canSubmit ? "#991B1B" : "#9CA3AF",
            transform: canSubmit ? "translateY(-1px)" : "none",
            boxShadow: canSubmit ? "0 4px 12px rgba(185,28,28,0.4)" : "none"
          },
          "&:active": { transform: "translateY(0)" }
        }}
      >
        {timingMode === "now" ? "Request ambulance now" : "Schedule transfer"}
      </Button>

      <Typography
        variant="caption"
        sx={{ mt: 1.2, fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}
      >
        {timingMode === "now"
          ? "An ambulance will be dispatched to your pickup location immediately. You'll receive the driver's details shortly."
          : "A partner ambulance will be assigned closer to your scheduled time. You'll receive a confirmation with the driver's details."}
      </Typography>

      {/* Success Dialog — auto-redirects after 2.5s */}
      <Dialog
        open={showSuccess}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: 340,
            textAlign: "center",
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ pb: 0.5 }}>
          <CheckCircleRoundedIcon sx={{ fontSize: 48, color: "#16A34A", mb: 0.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
            {timingMode === "now" ? "Ambulance requested" : "Transfer scheduled"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: 13 }}>
            {timingMode === "now" ? (
              <>
                Your ambulance to <strong>{destinationHospital}</strong> has been
                requested and is being dispatched now. You'll receive the driver's
                details shortly.
              </>
            ) : (
              <>
                Your ambulance transfer to <strong>{destinationHospital}</strong> has
                been scheduled for <strong>{transferDate?.format("DD MMM YYYY")}</strong> at{" "}
                <strong>{transferTime?.format("hh:mm A")}</strong>. You'll receive a confirmation
                notification shortly.
              </>
            )}
          </DialogContentText>
          <Typography
            variant="caption"
            sx={{ mt: 1.5, fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}
          >
            Redirecting to dashboard...
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
    </LocalizationProvider>
  );
}

export default function AmbulanceBookTransfer(): React.JSX.Element {
  return (
    <>
      <DarkModeToggle />
      <MobileShell>
        <BookTransferScreen />
      </MobileShell>
    </>
  );
}
