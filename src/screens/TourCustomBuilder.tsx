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
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import TourRoundedIcon from "@mui/icons-material/TourRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";

const DESTINATION_OPTIONS = [
  "Kampala City", "Jinja – Source of the Nile", "Lake Mburo National Park",
  "Entebbe – Botanical Gardens", "Ssese Islands", "Murchison Falls",
  "Queen Elizabeth NP", "Bwindi – Gorilla Trekking"
];

function TourCustomBuilderScreen(): React.JSX.Element {
  const navigate = useNavigate();

  const [tourName, setTourName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [estimatedCost, setEstimatedCost] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleDestination = (dest: string) => {
    setSelectedDestinations((prev) =>
      prev.includes(dest) ? prev.filter((d) => d !== dest) : [...prev, dest]
    );
  };

  const adjust = (setter: React.Dispatch<React.SetStateAction<number>>, delta: number, min = 0, max = 20) => {
    setter((prev) => Math.max(min, Math.min(max, prev + delta)));
  };

  const totalGuests = adults + children;
  const daysCount = startDate && endDate
    ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)
    : 0;

  const canEstimate = tourName.trim() && startDate && endDate && selectedDestinations.length > 0 && adults > 0;

  const handleEstimate = () => {
    // Simulated cost: base per person per day × destinations multiplier
    const basePerPersonPerDay = 150000;
    const destMultiplier = 1 + (selectedDestinations.length - 1) * 0.3;
    const cost = Math.round(basePerPersonPerDay * totalGuests * daysCount * destMultiplier);
    setEstimatedCost(`UGX ${cost.toLocaleString()}`);
  };

  const handleSubmit = () => {
    // Navigate to payment gateway with calculated cost
    navigate("/payment/process", {
      state: {
        paymentMethod: "wallet",
        amount: estimatedCost || "UGX 0",
        description: `Custom Tour: ${tourName} • ${totalGuests} guests • ${daysCount} days`,
        returnPath: "/tours",
        cancelPath: "/tours/custom",
        serviceName: "Tour",
        extraData: { tourName, startDate, endDate, adults, children, selectedDestinations, notes }
      }
    });
  };

  const handleSaveAsDraft = () => {
    setShowSuccess(true);
  };

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
        <IconButton
          size="small"
          aria-label="Back"
          onClick={() => navigate(-1)}
          sx={{
            borderRadius: 999,
            bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
            border: (t) => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
            Build custom tour
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
            Design your own EV-powered experience
          </Typography>
        </Box>
      </Box>

      {/* Tour Name */}
      <TextField
        fullWidth
        size="small"
        label="Tour name"
        placeholder="e.g. Weekend Jinja Adventure"
        value={tourName}
        onChange={(e) => setTourName(e.target.value)}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": { borderRadius: 2 }
        }}
      />

      {/* Dates */}
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
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
            <CalendarMonthRoundedIcon sx={{ fontSize: 18, color: (t) => t.palette.text.secondary }} />
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Tour dates
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.5}>
            <TextField
              fullWidth
              size="small"
              label="Start date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              size="small"
              label="End date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Stack>
          {daysCount > 0 && (
            <Typography variant="caption" sx={{ fontSize: 11, color: "primary.main", mt: 0.5, display: "block" }}>
              {daysCount} day{daysCount > 1 ? "s" : ""}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Guests */}
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
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
            <PeopleAltRoundedIcon sx={{ fontSize: 18, color: (t) => t.palette.text.secondary }} />
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Group size
            </Typography>
          </Stack>
          <Stack spacing={1.2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 500 }}>Adults (18+)</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Button size="small" variant="outlined" onClick={() => adjust(setAdults, -1, 1)}
                  sx={{ minWidth: 32, borderRadius: 999, px: 0, fontSize: 16, lineHeight: 1 }}>–</Button>
                <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 600 }}>{adults}</Typography>
                <Button size="small" variant="outlined" onClick={() => adjust(setAdults, 1, 1)}
                  sx={{ minWidth: 32, borderRadius: 999, px: 0, fontSize: 16, lineHeight: 1 }}>+</Button>
              </Stack>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 500 }}>Children (3–17)</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Button size="small" variant="outlined" onClick={() => adjust(setChildren, -1, 0)}
                  sx={{ minWidth: 32, borderRadius: 999, px: 0, fontSize: 16, lineHeight: 1 }}>–</Button>
                <Typography variant="body2" sx={{ fontSize: 14, fontWeight: 600 }}>{children}</Typography>
                <Button size="small" variant="outlined" onClick={() => adjust(setChildren, 1, 0)}
                  sx={{ minWidth: 32, borderRadius: 999, px: 0, fontSize: 16, lineHeight: 1 }}>+</Button>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Destinations */}
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
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
            <RouteRoundedIcon sx={{ fontSize: 18, color: (t) => t.palette.text.secondary }} />
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Choose destinations (select one or more)
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", gap: 0.75 }}>
            {DESTINATION_OPTIONS.map((dest) => (
              <Chip
                key={dest}
                label={dest}
                size="small"
                onClick={() => toggleDestination(dest)}
                icon={selectedDestinations.includes(dest)
                  ? <CheckCircleRoundedIcon sx={{ fontSize: 14 }} />
                  : <PlaceRoundedIcon sx={{ fontSize: 14 }} />
                }
                sx={{
                  borderRadius: 999,
                  fontSize: 11,
                  height: 28,
                  bgcolor: selectedDestinations.includes(dest)
                    ? "rgba(3,205,140,0.15)"
                    : (t) => t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                  border: selectedDestinations.includes(dest)
                    ? "1px solid #03CD8C"
                    : (t) => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
                  color: selectedDestinations.includes(dest)
                    ? "#059669"
                    : (t) => t.palette.text.primary
                }}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Notes */}
      <TextField
        fullWidth
        size="small"
        label="Special requests / notes"
        placeholder="e.g. Vegan meals preferred, wheelchair accessible vehicle needed"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        multiline
        rows={3}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": { borderRadius: 2 }
        }}
      />

      {/* Estimated cost */}
      {estimatedCost && (
        <Card
          elevation={0}
          sx={{
            mb: 2,
            borderRadius: 2,
            bgcolor: "rgba(3,205,140,0.08)",
            border: "1px solid rgba(3,205,140,0.3)"
          }}
        >
          <CardContent sx={{ px: 1.75, py: 1.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                  Estimated total
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
                  {estimatedCost}
                </Typography>
              </Box>
              <TourRoundedIcon sx={{ fontSize: 28, color: "#03CD8C" }} />
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              {totalGuests} guest{totalGuests > 1 ? "s" : ""} • {daysCount} day{daysCount > 1 ? "s" : ""} • {selectedDestinations.length} destination{selectedDestinations.length > 1 ? "s" : ""}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Stack spacing={1.25}>
        {!estimatedCost ? (
          <Button
            fullWidth
            variant="contained"
            disabled={!canEstimate}
            onClick={handleEstimate}
            sx={{
              borderRadius: 999,
              py: 1.1,
              fontSize: 15,
              fontWeight: 600,
              textTransform: "none",
              bgcolor: canEstimate ? "primary.main" : "#9CA3AF",
              color: canEstimate ? "#020617" : "#E5E7EB",
              "&:hover": { bgcolor: canEstimate ? "#06e29a" : "#9CA3AF" }
            }}
          >
            Get estimated cost
          </Button>
        ) : (
          <>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
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
              Proceed to payment
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleSaveAsDraft}
              sx={{
                borderRadius: 999,
                py: 1,
                fontSize: 14,
                textTransform: "none"
              }}
            >
              Save as draft
            </Button>
          </>
        )}
      </Stack>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onClose={() => setShowSuccess(false)}>
        <DialogTitle sx={{ fontWeight: 600 }}>Draft saved</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: 13 }}>
            Your custom tour "{tourName}" has been saved as a draft. You can come back and complete the booking any time from the Tours dashboard.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate("/tours")} sx={{ textTransform: "none", fontWeight: 600 }}>
            Back to Tours
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function TourCustomBuilderPage(): React.JSX.Element {
  return (
    <>
      <DarkModeToggle />
      <MobileShell>
        <TourCustomBuilderScreen />
      </MobileShell>
    </>
  );
}
