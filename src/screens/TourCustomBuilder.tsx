import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Card, CardContent, Stack, TextField, Button,
  Chip, Divider, IconButton, Snackbar, Alert, Collapse, Slider,
  Autocomplete
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import EditLocationAltRoundedIcon from "@mui/icons-material/EditLocationAltRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import ElectricBoltRoundedIcon from "@mui/icons-material/ElectricBoltRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import NearMeRoundedIcon from "@mui/icons-material/NearMeRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocalTaxiRoundedIcon from "@mui/icons-material/LocalTaxiRounded";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";
import {
  Tour, DestinationInfo, KNOWN_DESTINATIONS, KAMPALA_MAP, CATEGORY_LABELS,
  searchDestinations, findDestination, estimateDuration, calculateTourPrice,
  formatUGX, addCustomTour, buildCustomTour
} from "../data/tours";

/* ── Pickup location options ── */
const PICKUP_LOCATIONS = [
  "Garden City Mall, Kampala",
  "Kampala Serena Hotel",
  "Sheraton Kampala Hotel",
  "Protea Hotel by Marriott Kampala",
  "Entebbe International Airport",
  "Acacia Mall, Kisementi",
  "Forest Mall, Lugogo",
  "Makerere University Main Gate",
  "Nakasero Market, Kampala",
  "Munyonyo Commonwealth Resort",
  "National Theatre, Kampala",
  "Uganda Museum, Kampala",
];

/* ── Helper: generate a map position for a custom destination ── */
function generateMapPosition(name: string, distanceKm: number): { x: number; y: number } {
  // Use a simple hash of the name to determine direction angle
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  // Angle in radians (spread across all directions from Kampala)
  const angle = (Math.abs(hash) % 360) * (Math.PI / 180);
  // Distance on the map scales logarithmically so even very far destinations fit
  const mapDist = 40 + Math.min(distanceKm / 5, 130);
  const x = Math.round(KAMPALA_MAP.x + Math.cos(angle) * mapDist);
  const y = Math.round(KAMPALA_MAP.y + Math.sin(angle) * mapDist);
  // Clamp to SVG viewBox (0..400, 0..280) with padding
  return {
    x: Math.max(30, Math.min(370, x)),
    y: Math.max(25, Math.min(255, y)),
  };
}

function buildCustomDestInfo(name: string, distanceKm: number): DestinationInfo {
  const driveTimeHours = Math.round((distanceKm / 60) * 10) / 10; // ~60 km/h avg
  const pos = generateMapPosition(name, distanceKm);
  return {
    name,
    distanceKm,
    driveTimeHours,
    mapX: pos.x,
    mapY: pos.y,
    category: "adventure",
    description: `Custom destination – ${name}`,
  };
}

const G = "#03CD8C";
const G2 = "#22C55E";

/* ═══════════════════════════════════════════════════════════
   SVG Route Map Component
   ═══════════════════════════════════════════════════════════ */
function RouteMap({ destination }: { destination: DestinationInfo }) {
  const origin = KAMPALA_MAP;
  const dest = { x: destination.mapX, y: destination.mapY };

  // Curved path control points
  const dx = dest.x - origin.x;
  const dy = dest.y - origin.y;
  const midX = (origin.x + dest.x) / 2;
  const midY = (origin.y + dest.y) / 2;
  // Offset perpendicular to the line for a nice curve
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const perpX = -dy / len * 30;
  const perpY = dx / len * 30;
  const cx = midX + perpX;
  const cy = midY + perpY;

  const pathD = `M ${origin.x} ${origin.y} Q ${cx} ${cy}, ${dest.x} ${dest.y}`;

  // Midpoint of the quadratic bezier
  const midBX = 0.25 * origin.x + 0.5 * cx + 0.25 * dest.x;
  const midBY = 0.25 * origin.y + 0.5 * cy + 0.25 * dest.y;

  return (
    <Box sx={{
      borderRadius: 2.5, overflow: "hidden", position: "relative",
      maxHeight: 160,
      background: t => t.palette.mode === "light"
        ? "linear-gradient(180deg, #E8F5F0 0%, #D5EDE5 40%, #C8E6D8 100%)"
        : "linear-gradient(180deg, #0A1628 0%, #0D1F2D 40%, #0A1628 100%)",
      border: t => t.palette.mode === "light"
        ? "1px solid rgba(3,205,140,0.2)"
        : "1px solid rgba(3,205,140,0.15)"
    }}>
      <svg viewBox="0 0 400 280" style={{ width: "100%", display: "block" }}>
        {/* Grid lines */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={280}
            stroke="currentColor" strokeWidth={0.3} opacity={0.08} />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 46.67} x2={400} y2={i * 46.67}
            stroke="currentColor" strokeWidth={0.3} opacity={0.08} />
        ))}

        {/* Lake Victoria approximation */}
        <ellipse cx={220} cy={210} rx={65} ry={45} fill="#38BDF8" opacity={0.08} />
        <text x={220} y={215} textAnchor="middle" fill="#38BDF8" fontSize={7} opacity={0.25} fontStyle="italic">
          L. Victoria
        </text>

        {/* Route path — dashed */}
        <path d={pathD} fill="none" stroke={G} strokeWidth={2.5} strokeDasharray="8 5" opacity={0.6} />

        {/* Route path — animated dot */}
        <circle r={4} fill={G} opacity={0.9}>
          <animateMotion dur="3s" repeatCount="indefinite" path={pathD} />
        </circle>

        {/* Distance badge on route */}
        <rect x={midBX - 32} y={midBY - 11} width={64} height={22} rx={11}
          fill="rgba(0,0,0,0.65)" />
        <text x={midBX} y={midBY + 4} textAnchor="middle" fill="white" fontSize={9.5} fontWeight={600}>
          {destination.distanceKm} km
        </text>

        {/* Kampala origin marker */}
        <circle cx={origin.x} cy={origin.y} r={8} fill={G} opacity={0.2} />
        <circle cx={origin.x} cy={origin.y} r={5} fill={G} />
        <circle cx={origin.x} cy={origin.y} r={2.5} fill="#020617" />
        <rect x={origin.x + 10} y={origin.y - 8} width={54} height={16} rx={8} fill="rgba(3,205,140,0.15)" />
        <text x={origin.x + 37} y={origin.y + 3} textAnchor="middle" fill={G} fontSize={9} fontWeight={700}>
          Kampala
        </text>

        {/* Destination marker */}
        <circle cx={dest.x} cy={dest.y} r={10} fill="#F59E0B" opacity={0.2} />
        <circle cx={dest.x} cy={dest.y} r={6} fill="#F59E0B" />
        <circle cx={dest.x} cy={dest.y} r={3} fill="#020617" />
        {/* Destination label */}
        {(() => {
          const labelW = Math.min(destination.name.length * 6.5 + 12, 130);
          const labelX = dest.x < 200 ? dest.x - labelW - 6 : dest.x + 10;
          return (
            <>
              <rect x={labelX} y={dest.y - 8} width={labelW} height={16} rx={8}
                fill="rgba(245,158,11,0.15)" />
              <text x={labelX + labelW / 2} y={dest.y + 3} textAnchor="middle"
                fill="#F59E0B" fontSize={9} fontWeight={700}>
                {destination.name.length > 18 ? destination.name.slice(0, 18) + "…" : destination.name}
              </text>
            </>
          );
        })()}

        {/* Compass */}
        <text x={370} y={25} textAnchor="middle" fill="currentColor" fontSize={10} opacity={0.15} fontWeight={700}>
          N ↑
        </text>
      </svg>

      {/* Overlay badges */}
      <Stack direction="row" spacing={0.5} sx={{
        position: "absolute", bottom: 6, left: 8, right: 8
      }}>
        <Chip
          icon={<NearMeRoundedIcon sx={{ fontSize: 10, color: `${G} !important` }} />}
          label={`~${destination.driveTimeHours}h drive`}
          size="small"
          sx={{
            bgcolor: "rgba(0,0,0,0.55)", color: "#fff", backdropFilter: "blur(6px)",
            fontSize: 9, height: 20, fontWeight: 600, borderRadius: 999
          }}
        />
        <Chip
          icon={<ElectricBoltRoundedIcon sx={{ fontSize: 10, color: `${G} !important` }} />}
          label="EV powered"
          size="small"
          sx={{
            bgcolor: "rgba(0,0,0,0.55)", color: "#fff", backdropFilter: "blur(6px)",
            fontSize: 9, height: 20, fontWeight: 600, borderRadius: 999
          }}
        />
      </Stack>
    </Box>
  );
}

/* ═══════════════════════════════════════════════════════════
   Custom Tour Builder Screen
   ═══════════════════════════════════════════════════════════ */
function TourCustomBuilderScreen(): React.JSX.Element {
  const navigate = useNavigate();

  // Destination
  const [destQuery, setDestQuery] = useState("");
  const [selectedDest, setSelectedDest] = useState<DestinationInfo | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Custom destination – user can adjust distance on the map page
  const [isCustomDest, setIsCustomDest] = useState(false);
  const [customDistanceKm, setCustomDistanceKm] = useState(150);

  // Tour details
  const [tourName, setTourName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Tour["category"] | "">("");
  const [description, setDescription] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [notes, setNotes] = useState("");

  // Date & time
  const [departureDate, setDepartureDate] = useState<Dayjs | null>(null);
  const [returnDate, setReturnDate] = useState<Dayjs | null>(null);
  const [departureTime, setDepartureTime] = useState<Dayjs | null>(dayjs().hour(8).minute(0));
  const [returnTime, setReturnTime] = useState<Dayjs | null>(dayjs().hour(17).minute(0));

  // Pickup location
  const [pickupLocation, setPickupLocation] = useState<string>("");
  const [pickupInputValue, setPickupInputValue] = useState("");

  // UI states
  const [toast, setToast] = useState<string | null>(null);
  const [created, setCreated] = useState(false);

  const suggestions = useMemo(() => {
    if (!destQuery.trim() || selectedDest) return [];
    return searchDestinations(destQuery).slice(0, 6);
  }, [destQuery, selectedDest]);

  // Does the typed text match anything?
  const hasMatch = useMemo(() => {
    if (!destQuery.trim()) return true;
    return suggestions.length > 0 || !!findDestination(destQuery);
  }, [destQuery, suggestions]);

  // Auto-populate when destination changes
  useEffect(() => {
    if (selectedDest) {
      if (!tourName.trim()) {
        setTourName(`${selectedDest.name} EV Tour`);
      }
      if (!selectedCategory) {
        setSelectedCategory(selectedDest.category);
      }
      if (!description.trim()) {
        setDescription(`Discover ${selectedDest.name} on an eco-friendly EV-powered tour from Kampala. ${selectedDest.description}. Enjoy a comfortable ride, experienced guide, and unique experiences along the way.`);
      }
    }
  }, [selectedDest]);

  const selectDestination = (dest: DestinationInfo, custom = false) => {
    setSelectedDest(dest);
    setDestQuery(dest.name);
    setShowSuggestions(false);
    setIsCustomDest(custom);
    if (custom) setCustomDistanceKm(dest.distanceKm);
  };

  const clearDestination = () => {
    setSelectedDest(null);
    setDestQuery("");
    setTourName("");
    setSelectedCategory("");
    setDescription("");
    setIsCustomDest(false);
  };

  const handleDestInputChange = (val: string) => {
    setDestQuery(val);
    setShowSuggestions(true);
    if (selectedDest && val !== selectedDest.name) {
      setSelectedDest(null);
      setIsCustomDest(false);
    }
    // Try auto-match
    const found = findDestination(val);
    if (found && val.toLowerCase().trim() === found.name.toLowerCase()) {
      selectDestination(found);
    }
  };

  // Add a custom destination — skip straight to the map
  const addCustomDestination = () => {
    const dest = buildCustomDestInfo(destQuery.trim(), 150); // default 150 km
    selectDestination(dest, true);
  };

  // Update distance for custom destination (called from map section)
  const updateCustomDistance = (newDist: number) => {
    setCustomDistanceKm(newDist);
    const dest = buildCustomDestInfo(destQuery.trim() || selectedDest?.name || "Custom", newDist);
    setSelectedDest(dest);
  };

  // Computed trip days from dates
  const tripDays = useMemo(() => {
    if (!departureDate || !returnDate) return null;
    const diff = returnDate.diff(departureDate, "day");
    return Math.max(1, diff + 1);
  }, [departureDate, returnDate]);

  // Auto-set return date when departure is picked (based on estimated duration)
  useEffect(() => {
    if (departureDate && selectedDest && !returnDate) {
      const est = estimateDuration(selectedDest.distanceKm);
      const days = Math.max(1, Math.ceil(est.durationDays));
      setReturnDate(departureDate.add(days - 1, "day"));
    }
  }, [departureDate, selectedDest]);

  // Price calculation
  const groupSize = adults + children;
  const duration = selectedDest ? estimateDuration(selectedDest.distanceKm) : null;
  const effectiveDays = tripDays ?? (duration ? Math.max(1, Math.ceil(duration.durationDays)) : 1);
  const pricePerPerson = selectedDest
    ? calculateTourPrice(selectedDest.distanceKm, effectiveDays, groupSize)
    : 0;
  const totalCost = pricePerPerson * adults + pricePerPerson * children * 0.5;

  const canCreate = selectedDest && tourName.trim() && selectedCategory && adults >= 1 && departureDate && returnDate && pickupLocation.trim();

  const handleCreate = () => {
    if (!selectedDest || !selectedCategory || !tourName.trim()) return;
    const tour = buildCustomTour(tourName, selectedDest, selectedCategory, description, groupSize, {
      departureDate: departureDate?.format("YYYY-MM-DD"),
      returnDate: returnDate?.format("YYYY-MM-DD"),
      departureTime: departureTime?.format("HH:mm"),
      returnTime: returnTime?.format("HH:mm"),
      pickupLocation: pickupLocation || "Kampala — hotel pickup",
      tripDays: effectiveDays,
    });
    addCustomTour(tour);
    setCreated(true);
    setToast("Tour route created! Redirecting...");
    setTimeout(() => navigate(`/tours/${tour.slug}`), 1500);
  };

  const handleSaveDraft = () => {
    setToast("Draft saved – come back anytime to finish.");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box>
      {/* Green Header */}
      <Box sx={{ bgcolor: "#03CD8C", px: 2.5, pt: 2, pb: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
        <IconButton size="small" onClick={() => navigate(-1)}
          sx={{
            borderRadius: 999,
            bgcolor: "rgba(255,255,255,0.2)",
            color: "#FFFFFF",
            "&:hover": { bgcolor: "rgba(255,255,255,0.3)" }
          }}>
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: "-0.01em", color: "#FFFFFF" }}>
            Add custom destination
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11, color: "rgba(255,255,255,0.85)" }}>
            Create a new EV-powered tour route
          </Typography>
        </Box>
      </Box>

    <Box sx={{ px: 2.5, pt: 2, pb: 4 }}>

      {/* ── Destination Input ───────────────────────────── */}
      <Card elevation={0} sx={{
        mb: 2, borderRadius: 2.5, overflow: "visible", position: "relative",
        bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
        border: t => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
      }}>
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
            <PlaceRoundedIcon sx={{ fontSize: 18, color: "#F59E0B" }} />
            <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: t => t.palette.text.secondary }}>
              Where do you want to go?
            </Typography>
          </Stack>
          <TextField
            fullWidth size="small"
            placeholder="Type a destination e.g. Jinja, Murchison Falls..."
            value={destQuery}
            onChange={e => handleDestInputChange(e.target.value)}
            onFocus={() => { if (!selectedDest) setShowSuggestions(true); }}
            InputProps={{
              startAdornment: (
                <Box component="span" sx={{ mr: 0.5 }}>
                  <MyLocationRoundedIcon sx={{ fontSize: 18, color: selectedDest ? G : "text.secondary" }} />
                </Box>
              ),
              endAdornment: selectedDest ? (
                <Chip
                  label="✓ Located" size="small"
                  sx={{ bgcolor: "rgba(3,205,140,0.12)", color: G, fontSize: 10, height: 22, fontWeight: 600, borderRadius: 999 }}
                />
              ) : null
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&.Mui-focused fieldset": { borderColor: G }
              }
            }}
          />

          {/* Suggestions dropdown */}
          <Collapse in={showSuggestions && suggestions.length > 0 && !selectedDest}>
            <Box sx={{
              mt: 1, borderRadius: 2, overflow: "hidden",
              border: t => `1px solid ${t.palette.mode === "light" ? "rgba(209,213,219,0.9)" : "rgba(51,65,85,0.7)"}`,
              maxHeight: 240, overflowY: "auto"
            }}>
              {suggestions.map(dest => (
                <Box key={dest.name}
                  onClick={() => selectDestination(dest)}
                  sx={{
                    px: 1.5, py: 1.2, cursor: "pointer", display: "flex", alignItems: "center", gap: 1.2,
                    borderBottom: t => `1px solid ${t.palette.divider}`,
                    "&:hover": { bgcolor: "rgba(3,205,140,0.06)" },
                    "&:last-child": { borderBottom: "none" }
                  }}
                >
                  <PlaceRoundedIcon sx={{ fontSize: 18, color: "#F59E0B" }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>{dest.name}</Typography>
                    <Typography variant="caption" sx={{ fontSize: 10.5, color: t => t.palette.text.secondary }}>
                      {dest.distanceKm} km from Kampala • ~{dest.driveTimeHours}h drive
                    </Typography>
                  </Box>
                  <Chip label={CATEGORY_LABELS[dest.category]} size="small"
                    sx={{ fontSize: 9, height: 20, borderRadius: 999 }} />
                </Box>
              ))}
            </Box>
          </Collapse>

          {/* "Add as custom destination" — skip straight to the map */}
          <Collapse in={!selectedDest && destQuery.trim().length >= 2 && !hasMatch}>
            <Box sx={{
              mt: 1, p: 1.5, borderRadius: 2,
              border: t => `1px dashed ${t.palette.mode === "light" ? "rgba(245,158,11,0.5)" : "rgba(245,158,11,0.35)"}`,
              bgcolor: t => t.palette.mode === "light" ? "rgba(245,158,11,0.04)" : "rgba(245,158,11,0.06)",
              textAlign: "center"
            }}>
              <EditLocationAltRoundedIcon sx={{ fontSize: 24, color: "#F59E0B", mb: 0.5 }} />
              <Typography variant="body2" sx={{ fontSize: 12, mb: 0.75 }}>
                <b>"{destQuery.trim()}"</b> isn't in our list yet.
              </Typography>
              <Button
                size="small" variant="contained"
                onClick={addCustomDestination}
                sx={{
                  borderRadius: 999, fontSize: 11, fontWeight: 600, textTransform: "none",
                  bgcolor: "#F59E0B", color: "#020617",
                  "&:hover": { bgcolor: "#EAB308" }
                }}
              >
                Add &amp; view on map
              </Button>
            </Box>
          </Collapse>

          {selectedDest && (
            <Button size="small" onClick={clearDestination}
              sx={{ mt: 0.75, fontSize: 11, textTransform: "none", color: "#EF4444" }}>
              Change destination
            </Button>
          )}
        </CardContent>
      </Card>

      {/* ── GPS Map Visualization ──────────────────────── */}
      <Collapse in={!!selectedDest}>
        {selectedDest && (
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
              <RouteRoundedIcon sx={{ fontSize: 16, color: G }} />
              <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: G }}>
                Route Map
              </Typography>
            </Stack>
            <RouteMap destination={selectedDest} />

            {/* Route stats */}
            <Stack direction="row" spacing={0.75} sx={{ mt: 1 }}>
              <Card elevation={0} sx={{
                flex: 1, borderRadius: 1.5, textAlign: "center",
                bgcolor: "rgba(3,205,140,0.06)", border: "1px solid rgba(3,205,140,0.15)"
              }}>
                <CardContent sx={{ px: 0.75, py: 0.75, "&:last-child": { pb: 0.75 } }}>
                  <Typography variant="caption" sx={{ fontSize: 8, color: t => t.palette.text.secondary, display: "block" }}>Distance</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 800, color: G }}>{selectedDest.distanceKm} km</Typography>
                </CardContent>
              </Card>
              <Card elevation={0} sx={{
                flex: 1, borderRadius: 1.5, textAlign: "center",
                bgcolor: "rgba(3,205,140,0.06)", border: "1px solid rgba(3,205,140,0.15)"
              }}>
                <CardContent sx={{ px: 0.75, py: 0.75, "&:last-child": { pb: 0.75 } }}>
                  <Typography variant="caption" sx={{ fontSize: 8, color: t => t.palette.text.secondary, display: "block" }}>Drive time</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 800, color: G }}>~{selectedDest.driveTimeHours}h</Typography>
                </CardContent>
              </Card>
              <Card elevation={0} sx={{
                flex: 1, borderRadius: 1.5, textAlign: "center",
                bgcolor: "rgba(3,205,140,0.06)", border: "1px solid rgba(3,205,140,0.15)"
              }}>
                <CardContent sx={{ px: 0.75, py: 0.75, "&:last-child": { pb: 0.75 } }}>
                  <Typography variant="caption" sx={{ fontSize: 8, color: t => t.palette.text.secondary, display: "block" }}>Duration</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 800, color: G }}>{duration?.durationStr.split(" (")[0] || "–"}</Typography>
                </CardContent>
              </Card>
            </Stack>

            {/* Distance adjuster — for custom destinations */}
            {isCustomDest && (
              <Card elevation={0} sx={{
                mt: 1.25, borderRadius: 2,
                bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
                border: t => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.7)"
              }}>
                <CardContent sx={{ px: 1.5, py: 1.2 }}>
                  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.75 }}>
                    <RouteRoundedIcon sx={{ fontSize: 14, color: G }} />
                    <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: t => t.palette.text.secondary }}>
                      Adjust distance from Kampala
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Slider
                      value={customDistanceKm}
                      onChange={(_, v) => updateCustomDistance(v as number)}
                      min={10} max={800} step={10}
                      valueLabelDisplay="auto"
                      sx={{
                        color: G, flex: 1,
                        "& .MuiSlider-thumb": { width: 16, height: 16 },
                        "& .MuiSlider-valueLabel": { bgcolor: G, color: "#020617", fontWeight: 700, fontSize: 10 }
                      }}
                    />
                    <TextField
                      size="small" type="number"
                      value={customDistanceKm}
                      onChange={e => {
                        const v = Math.max(10, Math.min(800, Number(e.target.value) || 10));
                        updateCustomDistance(v);
                      }}
                      InputProps={{ endAdornment: <Typography variant="caption" sx={{ fontSize: 9, color: "text.secondary", ml: 0.5 }}>km</Typography> }}
                      sx={{
                        width: 80,
                        "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
                        "& input": { textAlign: "center", fontSize: 12, fontWeight: 600, py: 0.6 }
                      }}
                    />
                  </Stack>
                  <Typography variant="caption" sx={{ fontSize: 9, color: t => t.palette.text.secondary, mt: 0.5, display: "block" }}>
                    Drag the slider or type a distance. The map, drive time, and price update automatically.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      </Collapse>

      {/* ── Tour Details Form ──────────────────────────── */}
      <Collapse in={!!selectedDest}>
        {selectedDest && (
          <>
            {/* Tour name */}
            <TextField
              fullWidth size="small" label="Tour name"
              placeholder="e.g. Weekend Jinja Adventure"
              value={tourName} onChange={e => setTourName(e.target.value)}
              sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            {/* Category */}
            <Card elevation={0} sx={{
              mb: 2, borderRadius: 2,
              bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
              border: t => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
            }}>
              <CardContent sx={{ px: 1.75, py: 1.5 }}>
                <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: t => t.palette.text.secondary, mb: 0.75, display: "block" }}>
                  Category
                </Typography>
                <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", gap: 0.75 }}>
                  {(Object.keys(CATEGORY_LABELS) as Array<Tour["category"]>).map(cat => (
                    <Chip key={cat} label={CATEGORY_LABELS[cat]} size="small"
                      icon={selectedCategory === cat ? <CheckCircleRoundedIcon sx={{ fontSize: 14 }} /> : undefined}
                      onClick={() => setSelectedCategory(cat)}
                      sx={{
                        borderRadius: 999, fontSize: 11, height: 28,
                        bgcolor: selectedCategory === cat ? "rgba(3,205,140,0.15)" : undefined,
                        border: selectedCategory === cat ? `1px solid ${G}` : undefined,
                        color: selectedCategory === cat ? G : undefined,
                        fontWeight: selectedCategory === cat ? 600 : 400
                      }}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* ── Departure & Return Dates ──────────────── */}
            <Card elevation={0} sx={{
              mb: 2, borderRadius: 2,
              bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
              border: t => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
            }}>
              <CardContent sx={{ px: 1.75, py: 1.5 }}>
                <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1.25 }}>
                  <CalendarMonthRoundedIcon sx={{ fontSize: 18, color: G }} />
                  <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: t => t.palette.text.secondary }}>
                    Travel dates
                  </Typography>
                </Stack>

                <Stack spacing={1.5}>
                  <DatePicker
                    label="Departure date"
                    value={departureDate}
                    onChange={v => {
                      setDepartureDate(v);
                      // If return is before new departure, reset it
                      if (v && returnDate && returnDate.isBefore(v)) setReturnDate(null);
                    }}
                    minDate={dayjs().add(1, "day")}
                    maxDate={dayjs().add(180, "day")}
                    slotProps={{
                      textField: {
                        fullWidth: true, size: "small",
                        sx: { "& .MuiOutlinedInput-root": { borderRadius: 2, "&.Mui-focused fieldset": { borderColor: G } } }
                      }
                    }}
                  />
                  <DatePicker
                    label="Return date"
                    value={returnDate}
                    onChange={v => setReturnDate(v)}
                    minDate={departureDate || dayjs().add(1, "day")}
                    maxDate={dayjs().add(180, "day")}
                    slotProps={{
                      textField: {
                        fullWidth: true, size: "small",
                        sx: { "& .MuiOutlinedInput-root": { borderRadius: 2, "&.Mui-focused fieldset": { borderColor: G } } }
                      }
                    }}
                  />
                </Stack>

                {tripDays && (
                  <Chip
                    label={`${tripDays} day${tripDays !== 1 ? "s" : ""} trip`}
                    size="small"
                    sx={{ mt: 1.25, bgcolor: "rgba(3,205,140,0.12)", color: G, fontSize: 11, fontWeight: 600, borderRadius: 999 }}
                  />
                )}
              </CardContent>
            </Card>

            {/* ── Departure & Return Times ─────────────────── */}
            <Card elevation={0} sx={{
              mb: 2, borderRadius: 2,
              bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
              border: t => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
            }}>
              <CardContent sx={{ px: 1.75, py: 1.5 }}>
                <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1.25 }}>
                  <AccessTimeRoundedIcon sx={{ fontSize: 18, color: G }} />
                  <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: t => t.palette.text.secondary }}>
                    Preferred times
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1.5}>
                  <TimePicker
                    label="Departure time"
                    value={departureTime}
                    onChange={v => setDepartureTime(v)}
                    slotProps={{
                      textField: {
                        fullWidth: true, size: "small",
                        sx: { "& .MuiOutlinedInput-root": { borderRadius: 2, "&.Mui-focused fieldset": { borderColor: G } } }
                      }
                    }}
                  />
                  <TimePicker
                    label="Return time"
                    value={returnTime}
                    onChange={v => setReturnTime(v)}
                    slotProps={{
                      textField: {
                        fullWidth: true, size: "small",
                        sx: { "& .MuiOutlinedInput-root": { borderRadius: 2, "&.Mui-focused fieldset": { borderColor: G } } }
                      }
                    }}
                  />
                </Stack>

                <Typography variant="caption" sx={{ fontSize: 10, color: t => t.palette.text.secondary, mt: 1, display: "block" }}>
                  The driver will pick you up at the departure time. Times may be adjusted slightly based on route.
                </Typography>
              </CardContent>
            </Card>

            {/* ── Pickup Location ──────────────────────────── */}
            <Card elevation={0} sx={{
              mb: 2, borderRadius: 2,
              bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
              border: t => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
            }}>
              <CardContent sx={{ px: 1.75, py: 1.5 }}>
                <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1.25 }}>
                  <LocalTaxiRoundedIcon sx={{ fontSize: 18, color: G }} />
                  <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: t => t.palette.text.secondary }}>
                    Pickup location
                  </Typography>
                </Stack>

                <Autocomplete
                  freeSolo
                  options={PICKUP_LOCATIONS}
                  value={pickupLocation}
                  onChange={(_, v) => setPickupLocation(v || "")}
                  inputValue={pickupInputValue}
                  onInputChange={(_, v) => { setPickupInputValue(v); setPickupLocation(v); }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select or type your pickup point..."
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, "&.Mui-focused fieldset": { borderColor: G } } }}
                    />
                  )}
                  sx={{ "& .MuiAutocomplete-option": { fontSize: 12 } }}
                />

                <Typography variant="caption" sx={{ fontSize: 10, color: t => t.palette.text.secondary, mt: 1, display: "block" }}>
                  Choose from popular locations or type your own address. Pickup is included within Kampala.
                </Typography>
              </CardContent>
            </Card>

            {/* Group size */}
            <Card elevation={0} sx={{
              mb: 2, borderRadius: 2,
              bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
              border: t => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
            }}>
              <CardContent sx={{ px: 1.75, py: 1.5 }}>
                <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
                  <GroupRoundedIcon sx={{ fontSize: 18, color: t => t.palette.text.secondary }} />
                  <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: t => t.palette.text.secondary }}>
                    Group size
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>Adults (18+)</Typography>
                      <Typography variant="caption" sx={{ fontSize: 10, color: t => t.palette.text.secondary }}>
                        {formatUGX(pricePerPerson)} / person
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconButton size="small" onClick={() => setAdults(Math.max(1, adults - 1))}
                        sx={{ border: t => `1px solid ${t.palette.divider}`, width: 30, height: 30 }}>
                        <RemoveRoundedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <Typography sx={{ fontWeight: 700, fontSize: 15, minWidth: 20, textAlign: "center" }}>{adults}</Typography>
                      <IconButton size="small" onClick={() => setAdults(Math.min(10, adults + 1))}
                        sx={{ border: t => `1px solid ${t.palette.divider}`, width: 30, height: 30 }}>
                        <AddRoundedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Stack>
                  </Stack>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>Children (5–17)</Typography>
                      <Typography variant="caption" sx={{ fontSize: 10, color: t => t.palette.text.secondary }}>
                        50% off adult price
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconButton size="small" onClick={() => setChildren(Math.max(0, children - 1))}
                        sx={{ border: t => `1px solid ${t.palette.divider}`, width: 30, height: 30 }}>
                        <RemoveRoundedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <Typography sx={{ fontWeight: 700, fontSize: 15, minWidth: 20, textAlign: "center" }}>{children}</Typography>
                      <IconButton size="small" onClick={() => setChildren(Math.min(10, children + 1))}
                        sx={{ border: t => `1px solid ${t.palette.divider}`, width: 30, height: 30 }}>
                        <AddRoundedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            {/* Description */}
            <TextField
              fullWidth size="small" label="Tour description"
              placeholder="Describe the experience you'd like..."
              value={description} onChange={e => setDescription(e.target.value)}
              multiline rows={3}
              sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            {/* Special notes */}
            <TextField
              fullWidth size="small" label="Special requests (optional)"
              placeholder="e.g. Vegan meals, wheelchair accessible vehicle"
              value={notes} onChange={e => setNotes(e.target.value)}
              multiline rows={2}
              sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            {/* ── Price Summary ──────────────────────────── */}
            <Card elevation={0} sx={{
              mb: 2, borderRadius: 2.5, overflow: "hidden",
              bgcolor: "rgba(3,205,140,0.06)",
              border: "1px solid rgba(3,205,140,0.2)"
            }}>
              <CardContent sx={{ px: 1.75, py: 1.5 }}>
                <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1.2 }}>
                  <ElectricBoltRoundedIcon sx={{ fontSize: 16, color: G }} />
                  <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: G }}>
                    Price estimate
                  </Typography>
                </Stack>

                <Stack spacing={0.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>
                      Route: Kampala → {selectedDest.name} ({selectedDest.distanceKm} km)
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>
                      Duration: {tripDays ? `${tripDays} day${tripDays !== 1 ? "s" : ""}` : duration?.durationStr}
                    </Typography>
                  </Stack>
                  {departureDate && returnDate && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>
                        {departureDate.format("D MMM YYYY")} → {returnDate.format("D MMM YYYY")}
                      </Typography>
                    </Stack>
                  )}
                  {pickupLocation && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>
                        Pickup: {pickupLocation}
                      </Typography>
                    </Stack>
                  )}
                  <Divider sx={{ my: 0.5 }} />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>
                      {adults} adult{adults !== 1 ? "s" : ""} × {formatUGX(pricePerPerson)}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600 }}>
                      {formatUGX(pricePerPerson * adults)}
                    </Typography>
                  </Stack>
                  {children > 0 && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>
                        {children} child{children !== 1 ? "ren" : ""} × {formatUGX(Math.round(pricePerPerson * 0.5))}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600 }}>
                        {formatUGX(Math.round(pricePerPerson * children * 0.5))}
                      </Typography>
                    </Stack>
                  )}
                  <Divider sx={{ my: 0.5 }} />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" sx={{ fontWeight: 800, fontSize: 15 }}>
                      Estimated total
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, fontSize: 18, color: G }}>
                      {formatUGX(Math.round(totalCost))}
                    </Typography>
                  </Stack>
                </Stack>

                <Typography variant="caption" sx={{ fontSize: 10, color: t => t.palette.text.secondary, mt: 1, display: "block", lineHeight: 1.5 }}>
                  Price includes EV transport (round-trip {selectedDest.distanceKm * 2} km), guide, bottled water, and hotel pickup. Add-ons like meals and professional photos available during booking.
                </Typography>
              </CardContent>
            </Card>

            {/* ── Action Buttons ──────────────────────────── */}
            <Stack spacing={1.25}>
              <Button
                fullWidth variant="contained"
                disabled={!canCreate || created}
                onClick={handleCreate}
                sx={{
                  borderRadius: 999, py: 1.1, fontSize: 15, fontWeight: 700,
                  textTransform: "none", bgcolor: G, color: "#020617",
                  "&:hover": { bgcolor: G2 },
                  "&:disabled": { bgcolor: "rgba(3,205,140,0.4)" }
                }}
              >
                {created ? "✓ Tour created!" : "Create tour route"}
              </Button>
              <Button
                fullWidth variant="outlined"
                onClick={handleSaveDraft}
                sx={{
                  borderRadius: 999, py: 0.9, fontSize: 13, fontWeight: 600,
                  textTransform: "none", borderColor: t => t.palette.divider
                }}
              >
                Save as draft
              </Button>
            </Stack>
          </>
        )}
      </Collapse>

      {/* ── Popular destinations (when no selection) ─── */}
      {!selectedDest && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: t => t.palette.text.secondary, mb: 1.2, display: "block" }}>
            Popular destinations
          </Typography>
          <Stack spacing={0.75}>
            {Object.values(KNOWN_DESTINATIONS).slice(0, 8).map(dest => (
              <Card key={dest.name} elevation={0}
                onClick={() => selectDestination(dest)}
                sx={{
                  borderRadius: 2, cursor: "pointer",
                  bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
                  border: t => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.7)",
                  transition: "all 0.15s ease",
                  "&:hover": { borderColor: G, bgcolor: "rgba(3,205,140,0.03)" }
                }}
              >
                <CardContent sx={{ px: 1.5, py: 1, display: "flex", alignItems: "center", gap: 1.2, "&:last-child": { pb: 1 } }}>
                  <PlaceRoundedIcon sx={{ fontSize: 20, color: "#F59E0B" }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>{dest.name}</Typography>
                    <Typography variant="caption" sx={{ fontSize: 10.5, color: t => t.palette.text.secondary }}>
                      {dest.description}
                    </Typography>
                  </Box>
                  <Stack alignItems="flex-end" spacing={0.2}>
                    <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 600, color: G }}>
                      {dest.distanceKm} km
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: 9, color: t => t.palette.text.secondary }}>
                      ~{dest.driveTimeHours}h
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>

          {/* Hint: type any place */}
          <Box sx={{
            mt: 2, p: 1.5, borderRadius: 2.5, textAlign: "center",
            border: t => `1px dashed ${t.palette.divider}`,
            bgcolor: t => t.palette.mode === "light" ? "rgba(0,0,0,0.015)" : "rgba(255,255,255,0.02)"
          }}>
            <EditLocationAltRoundedIcon sx={{ fontSize: 22, color: "#F59E0B", mb: 0.5 }} />
            <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600, mb: 0.25 }}>
              Don't see your place?
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary, lineHeight: 1.5 }}>
              Type any destination name above and we'll let you add it as a custom location with distance-based pricing.
            </Typography>
          </Box>
        </Box>
      )}

      {/* ── Snackbar ───────────────────────────────────── */}
      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" variant="filled" sx={{ bgcolor: G, color: "#020617", fontWeight: 600 }}>
          {toast}
        </Alert>
      </Snackbar>
      </Box>
    </Box>
    </LocalizationProvider>
  );
}

/* ═══════════════════════════════════════════════════════════
   Export
   ═══════════════════════════════════════════════════════════ */
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
