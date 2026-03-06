import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import RequestQuoteRoundedIcon from "@mui/icons-material/RequestQuoteRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";

function TourQuoteRequestScreen(): React.JSX.Element {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [destination, setDestination] = useState("");
  const [tourType, setTourType] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [budget, setBudget] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const canSubmit = name.trim() && email.trim() && destination.trim() && tourType && groupSize;

  const handleSubmit = () => {
    setShowSuccess(true);
  };

  return (
    <>
    {/* Green Header */}
        <Box sx={{ bgcolor: "#03CD8C", px: 2, pt: 2, pb: 2, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              position: "absolute",
              left: 20,
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "#FFFFFF",
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" }
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, letterSpacing: "-0.01em", color: "#FFFFFF" }}
          >
            Request a quote
          </Typography>
        </Box>
        <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>


      {/* Info banner */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: "rgba(59,130,246,0.08)",
          border: "1px solid rgba(59,130,246,0.25)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.4 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <RequestQuoteRoundedIcon sx={{ fontSize: 22, color: "#1D4ED8" }} />
            <Typography variant="caption" sx={{ fontSize: 11.5, color: (t) => t.palette.text.secondary }}>
              Custom quotes are typically provided within 24 hours. We'll contact you via email or phone.
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1.2, display: "block" }}>
            Your contact details
          </Typography>
          <Stack spacing={1.5}>
            <TextField
              fullWidth size="small" label="Full name" placeholder="John Doe"
              value={name} onChange={(e) => setName(e.target.value)}
              InputProps={{ startAdornment: <PeopleAltRoundedIcon sx={{ fontSize: 18, color: "text.secondary", mr: 1 }} /> }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              fullWidth size="small" label="Email address" placeholder="john@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              InputProps={{ startAdornment: <EmailRoundedIcon sx={{ fontSize: 18, color: "text.secondary", mr: 1 }} /> }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              fullWidth size="small" label="Phone number (optional)" placeholder="+256 7XX XXX XXX"
              value={phone} onChange={(e) => setPhone(e.target.value)}
              InputProps={{ startAdornment: <PhoneRoundedIcon sx={{ fontSize: 18, color: "text.secondary", mr: 1 }} /> }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Tour Preferences */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1.2, display: "block" }}>
            Tour preferences
          </Typography>
          <Stack spacing={1.5}>
            <TextField
              fullWidth size="small" label="Destination / area"
              placeholder="e.g. Jinja, Murchison Falls, Multiple locations"
              value={destination} onChange={(e) => setDestination(e.target.value)}
              InputProps={{ startAdornment: <PlaceRoundedIcon sx={{ fontSize: 18, color: "text.secondary", mr: 1 }} /> }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <FormControl fullWidth size="small">
              <InputLabel>Tour type</InputLabel>
              <Select value={tourType} label="Tour type" onChange={(e) => setTourType(e.target.value)}
                sx={{ borderRadius: 2 }}>
                <MenuItem value="city">City tour</MenuItem>
                <MenuItem value="daytrip">Day trip</MenuItem>
                <MenuItem value="safari">Safari</MenuItem>
                <MenuItem value="weekend">Weekend getaway</MenuItem>
                <MenuItem value="charter">Private charter</MenuItem>
                <MenuItem value="corporate">Corporate / team outing</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth size="small" label="Preferred date"
              type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ startAdornment: <CalendarMonthRoundedIcon sx={{ fontSize: 18, color: "text.secondary", mr: 1 }} /> }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <FormControl fullWidth size="small">
              <InputLabel>Group size</InputLabel>
              <Select value={groupSize} label="Group size" onChange={(e) => setGroupSize(e.target.value)}
                sx={{ borderRadius: 2 }}>
                <MenuItem value="1-2">1–2 people</MenuItem>
                <MenuItem value="3-5">3–5 people</MenuItem>
                <MenuItem value="6-10">6–10 people</MenuItem>
                <MenuItem value="11-20">11–20 people</MenuItem>
                <MenuItem value="20+">20+ people</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth size="small" label="Budget range (optional)"
              placeholder="e.g. UGX 500,000 – 1,000,000"
              value={budget} onChange={(e) => setBudget(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <TextField
        fullWidth size="small" label="Additional notes / requirements"
        placeholder="Special dietary needs, accessibility, preferred activities, etc."
        value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)}
        multiline rows={3}
        sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
      />

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
          bgcolor: canSubmit ? "primary.main" : "#9CA3AF",
          color: canSubmit ? "#020617" : "#E5E7EB",
          "&:hover": { bgcolor: canSubmit ? "#06e29a" : "#9CA3AF" }
        }}
      >
        Submit quote request
      </Button>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onClose={() => setShowSuccess(false)}>
        <DialogTitle sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircleRoundedIcon sx={{ color: "#22C55E" }} />
          Quote request sent
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: 13 }}>
            Thank you, {name}! Your quote request for a{" "}
            <strong>{tourType}</strong> tour to <strong>{destination}</strong> has been submitted.
            Our team will get back to you within 24 hours at <strong>{email}</strong>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate("/tours")} sx={{ textTransform: "none", fontWeight: 600 }}>
            Back to Tours
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </>
  );
}

export default function TourQuoteRequestPage(): React.JSX.Element {
  return (
    <>
      <DarkModeToggle />
      <MobileShell>
        <TourQuoteRequestScreen />
      </MobileShell>
    </>
  );
}
