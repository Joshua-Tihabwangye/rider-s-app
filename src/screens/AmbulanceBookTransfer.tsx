import React, { useState } from "react";
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
  DialogContentText,
  DialogActions
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

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

  const [pickupLocation, setPickupLocation] = useState("");
  const [destinationHospital, setDestinationHospital] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const [transferTime, setTransferTime] = useState("");
  const [forWhom, setForWhom] = useState(passedForWhom);
  const [transferReason, setTransferReason] = useState("");
  const [notes, setNotes] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const canSubmit =
    pickupLocation.trim().length > 0 &&
    destinationHospital.trim().length > 0 &&
    patientName.trim().length > 0 &&
    patientPhone.trim().length > 0 &&
    transferDate.trim().length > 0 &&
    transferTime.trim().length > 0;

  const handleSubmit = () => {
    setShowSuccess(true);
  };

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
              Book a planned transfer
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Schedule a hospital or clinic transfer in advance
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

          <Stack direction="row" spacing={1.25} sx={{ mb: 1.2 }}>
            <TextField
              fullWidth
              size="small"
              type="date"
              value={transferDate}
              onChange={(e) => setTransferDate(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                  </InputAdornment>
                )
              }}
              sx={{
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
              type="time"
              value={transferTime}
              onChange={(e) => setTransferTime(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccessTimeRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                  </InputAdornment>
                )
              }}
              sx={{
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
          </Stack>

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
        Schedule transfer
      </Button>

      <Typography
        variant="caption"
        sx={{ mt: 1.2, fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}
      >
        A partner ambulance will be assigned closer to your scheduled time.
        You'll receive a confirmation with the driver's details.
      </Typography>

      {/* Success Dialog */}
      <Dialog
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: 340,
            textAlign: "center",
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ pb: 0.5 }}>
          <CheckCircleRoundedIcon sx={{ fontSize: 48, color: "#16A34A", mb: 0.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
            Transfer scheduled
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: 13 }}>
            Your ambulance transfer to <strong>{destinationHospital}</strong> has
            been scheduled for <strong>{transferDate}</strong> at{" "}
            <strong>{transferTime}</strong>. You'll receive a confirmation
            notification shortly.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2, gap: 1 }}>
          <Button
            variant="contained"
            onClick={() => navigate("/ambulance")}
            sx={{
              borderRadius: 999,
              px: 3,
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "#B91C1C",
              color: "#FEF2F2",
              "&:hover": { bgcolor: "#991B1B" }
            }}
          >
            Back to dashboard
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/ambulance/history")}
            sx={{ borderRadius: 999, px: 3, textTransform: "none" }}
          >
            View bookings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
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
