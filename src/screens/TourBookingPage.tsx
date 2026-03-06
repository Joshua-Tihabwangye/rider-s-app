import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Card, CardContent, Stack, Chip, Button, TextField,
  IconButton, Divider, Checkbox, FormControlLabel, Stepper, Step,
  StepLabel, CircularProgress, Snackbar, Alert, Select, MenuItem,
  FormControl, InputLabel, Skeleton, Autocomplete
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import PhoneAndroidRoundedIcon from "@mui/icons-material/PhoneAndroidRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
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
  Tour, Addon, TourDate, TimeSlot, fetchTourBySlug, createBooking,
  formatUGX, getGradientForTour
} from "../data/tours";

const G = "#03CD8C";
const G2 = "#22C55E";
const STEPS = ["Date & guests", "Add-ons", "Details", "Payment"];

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

/* ═══════════════════════════════════════════════════════════
   Booking Page Screen
   ═══════════════════════════════════════════════════════════ */
function TourBookingScreen() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Tour data
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  // Stepper
  const [step, setStep] = useState(0);

  // Step 1: Date, duration & guests
  const [selectedDate, setSelectedDate] = useState<TourDate | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [pickedDate, setPickedDate] = useState<Dayjs | null>(null);
  const [pickedStartTime, setPickedStartTime] = useState<Dayjs | null>(null);
  const [pickedEndTime, setPickedEndTime] = useState<Dayjs | null>(null);
  const [tourDays, setTourDays] = useState(1);      // number of days for the tour
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Pickup location
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupInputValue, setPickupInputValue] = useState("");

  // Step 2: Add-ons
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // Step 3: Contact details
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [country, setCountry] = useState("Uganda");
  const [specialRequests, setSpecialRequests] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Step 4: Payment
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!slug) return;
    let c = false;
    fetchTourBySlug(slug).then(t => { if (!c) { setTour(t); setLoading(false); } });
    return () => { c = true; };
  }, [slug]);

  // Derive the default / base number of days from the tour data
  const tourBaseDays = useMemo(() => {
    if (!tour) return 1;
    const h = tour.durationHours;
    if (h <= 12) return 1;           // "4 hours", "Full day" → 1 day
    return Math.max(1, Math.round(h / 24));
  }, [tour]);

  // Initialise tourDays from tour data once loaded
  useEffect(() => {
    if (tour) setTourDays(tourBaseDays);
  }, [tour, tourBaseDays]);

  // Sync date/time pickers → internal selectedDate/selectedSlot for booking submission
  useEffect(() => {
    if (!tour || !pickedDate) { setSelectedDate(null); return; }
    const dateStr = pickedDate.format("YYYY-MM-DD");
    // Find matching available date or create a synthetic one
    const matched = tour.availableDates.find(d => d.date === dateStr);
    if (matched) {
      setSelectedDate(matched);
    } else {
      // Allow any picked date – create a synthetic TourDate
      setSelectedDate({
        date: dateStr,
        timeSlots: [{ id: "custom-slot", startTime: "08:00", endTime: "18:00", spotsLeft: 10 }]
      });
    }
  }, [tour, pickedDate]);

  useEffect(() => {
    if (!pickedStartTime || !pickedEndTime) { setSelectedSlot(null); return; }
    setSelectedSlot({
      id: "picked-slot",
      startTime: pickedStartTime.format("HH:mm"),
      endTime: pickedEndTime.format("HH:mm"),
      spotsLeft: 10
    });
  }, [pickedStartTime, pickedEndTime]);

  // Available date range for the picker
  const minDate = useMemo(() => dayjs(), []);
  const maxDate = useMemo(() => dayjs().add(90, "day"), []);

  // Daily rate per person (tour price ÷ default days so scaling stays fair)
  const dailyRate = useMemo(() => {
    if (!tour) return 0;
    return Math.round(tour.pricePerPerson / tourBaseDays);
  }, [tour, tourBaseDays]);

  // Cost calculation
  const cost = useMemo(() => {
    if (!tour) return { base: 0, addonsCost: 0, promo: 0, taxes: 0, total: 0 };
    const perPerson = dailyRate * tourDays;
    const base = perPerson * adults + perPerson * children * 0.5;
    const addonsCost = tour.addons
      .filter(a => selectedAddons.includes(a.id))
      .reduce((sum, a) => sum + a.price * (adults + children), 0);
    const promo = promoApplied ? promoDiscount : 0;
    const subtotal = base + addonsCost - promo;
    const taxes = Math.round(subtotal * 0.05);
    return { base, addonsCost, promo, taxes, total: subtotal + taxes, perPerson };
  }, [tour, adults, children, tourDays, dailyRate, selectedAddons, promoApplied, promoDiscount]);

  // Validation
  const validateStep = (s: number): boolean => {
    const errs: Record<string, string> = {};
    if (s === 0) {
      if (!pickedDate) errs.date = "Please select a date";
      if (!pickedStartTime) errs.slot = "Please select a start time";
      if (adults < 1) errs.adults = "At least 1 adult required";
      if (tour && adults + children > tour.maxGroupSize) errs.group = `Max group size is ${tour.maxGroupSize}`;
    }
    if (s === 2) {
      if (!contactName.trim()) errs.name = "Name is required";
      if (!contactEmail.trim() || !contactEmail.includes("@")) errs.email = "Valid email required";
      if (!contactPhone.trim()) errs.phone = "Phone number required";
    }
    if (s === 3) {
      if (!agreedTerms) errs.terms = "Please agree to terms";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < STEPS.length - 1) setStep(step + 1);
      else handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === "RIDER10" || code === "ADVENTURE10") {
      setPromoDiscount(Math.round(cost.base * 0.1));
      setPromoApplied(true);
    } else if (code === "WELCOME") {
      setPromoDiscount(50000);
      setPromoApplied(true);
    } else {
      setErrors(p => ({ ...p, promo: "Invalid promo code" }));
    }
  };

  const handleSubmit = async () => {
    if (!tour || !selectedDate || !selectedSlot) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const booking = await createBooking({
        tourSlug: tour.slug,
        tourTitle: tour.title,
        tourImage: tour.images[0],
        destination: tour.destination,
        date: selectedDate.date,
        timeSlot: `${selectedSlot.startTime} – ${selectedSlot.endTime}`,
        tourDays,
        adults,
        children,
        addons: selectedAddons.map(id => tour.addons.find(a => a.id === id)?.name || id),
        addonsCost: cost.addonsCost,
        baseCost: cost.base,
        taxes: cost.taxes,
        totalCost: cost.total,
        currency: "UGX",
        contactName,
        contactEmail,
        contactPhone,
        country,
        specialRequests,
        promoCode: promoApplied ? promoCode : "",
        promoDiscount: cost.promo,
        paymentMethod: paymentMethod === "momo" ? "Mobile Money" : paymentMethod === "card" ? "Card" : "Wallet",
        cancellationPolicy: tour.cancellationPolicy,
        cancellationDeadline: ""
      });
      navigate(`/bookings/${booking.id}`, { state: { justBooked: true } });
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  if (loading) return (
    <Box sx={{ px: 2.5, pt: 3 }}>
      <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1 }} />
      <Skeleton variant="rounded" height={60} sx={{ borderRadius: 2, mb: 2 }} />
      <Skeleton variant="rounded" height={200} sx={{ borderRadius: 2, mb: 2 }} />
      <Skeleton variant="rounded" height={100} sx={{ borderRadius: 2 }} />
    </Box>
  );

  if (!tour) return (
    <Box sx={{ mx: 7, px: 2.5, pt: 4, textAlign: "center" }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Tour not found</Typography>
      <Button variant="contained" onClick={() => navigate("/tours")}
        sx={{ borderRadius: 999, bgcolor: G, color: "#020617", textTransform: "none" }}>Browse tours</Button>
    </Box>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box>
      {/* Green Header */}
      <Box sx={{ bgcolor: "#03CD8C", px: 2, pt: 2, pb: 2, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <IconButton
          onClick={() => step > 0 ? handleBack() : navigate(-1)}
          size="small"
          sx={{
            position: "absolute",
            left: 20,
            borderRadius: 999,
            bgcolor: "rgba(255,255,255,0.2)",
            color: "#FFFFFF",
            "&:hover": { bgcolor: "rgba(255,255,255,0.3)" }
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <Box sx={{ mx: 7, textAlign: "center", maxWidth: '70%' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em", color: "#FFFFFF" }}>Book your tour</Typography>
          <Typography variant="caption" sx={{ fontSize: 11, color: "rgba(255,255,255,0.85)", display: "block" }}>{tour.title}</Typography>
        </Box>
      </Box>

    <Box sx={{ px: 2, pt: 2, pb: 3 }}>

      {/* Stepper */}
      <Stepper activeStep={step} alternativeLabel sx={{ mb: 2.5, "& .MuiStepIcon-root.Mui-active": { color: G }, "& .MuiStepIcon-root.Mui-completed": { color: G }, "& .MuiStepLabel-label": { fontSize: 10 } }}>
        {STEPS.map(label => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      {/* ── Step 1: Date & Guests ────────────────────── */}
      {step === 0 && (
        <Box>
          {/* Date picker */}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 14, mb: 1 }}>Select a date</Typography>
          <DatePicker
            label="Tour date"
            value={pickedDate}
            onChange={v => setPickedDate(v)}
            minDate={minDate}
            maxDate={maxDate}
            slotProps={{
              textField: {
                fullWidth: true, size: "small",
                error: !!errors.date, helperText: errors.date,
                sx: {
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&.Mui-focused fieldset": { borderColor: G }
                  }
                }
              }
            }}
          />

          {/* Time pickers */}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 14, mb: 1 }}>Select time</Typography>
          <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
            <TimePicker
              label="Start time"
              value={pickedStartTime}
              onChange={v => setPickedStartTime(v)}
              slotProps={{
                textField: {
                  fullWidth: true, size: "small",
                  error: !!errors.slot, helperText: errors.slot,
                  sx: {
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused fieldset": { borderColor: G }
                    }
                  }
                }
              }}
            />
            <TimePicker
              label="End time"
              value={pickedEndTime}
              onChange={v => setPickedEndTime(v)}
              slotProps={{
                textField: {
                  fullWidth: true, size: "small",
                  sx: {
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused fieldset": { borderColor: G }
                    }
                  }
                }
              }}
            />
          </Stack>

          {/* Tour duration */}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 14, mb: 1 }}>Tour duration</Typography>
          <Card elevation={0} sx={{
            borderRadius: 2, mb: 2,
            bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
            border: t => `1px solid ${t.palette.mode === "light" ? "rgba(209,213,219,0.9)" : "rgba(51,65,85,0.7)"}`
          }}>
            <CardContent sx={{ px: 1.5, py: 1.2 }}>
              <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1.2 }}>
                <AccessTimeRoundedIcon sx={{ fontSize: 16, color: G }} />
                <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>
                  How many days would you like to spend?
                </Typography>
              </Stack>

              {/* Quick-pick chips */}
              <Stack direction="row" spacing={0.75} sx={{ mb: 1.2, flexWrap: "wrap", gap: 0.75 }}>
                {[1, 2, 3, 5, 7, 14].map(d => (
                  <Chip key={d} label={d === 1 ? "1 day" : `${d} days`}
                    size="small"
                    onClick={() => setTourDays(d)}
                    sx={{
                      borderRadius: 999, fontSize: 11, height: 28, fontWeight: tourDays === d ? 700 : 400,
                      bgcolor: tourDays === d ? "rgba(3,205,140,0.15)" : undefined,
                      border: tourDays === d ? `1.5px solid ${G}` : "1px solid transparent",
                      color: tourDays === d ? G : undefined,
                      cursor: "pointer", transition: "all 0.15s",
                      "&:hover": { borderColor: G }
                    }}
                  />
                ))}
              </Stack>

              {/* +/- fine-tune control */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>
                    {tourDays} day{tourDays !== 1 ? "s" : ""}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: 10, color: t => t.palette.text.secondary }}>
                    {formatUGX(dailyRate)} per person / day
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton size="small" onClick={() => setTourDays(Math.max(1, tourDays - 1))}
                    sx={{ border: t => `1px solid ${t.palette.divider}`, width: 30, height: 30 }}>
                    <RemoveRoundedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <Typography sx={{ mx: 7, fontWeight: 700, fontSize: 15, minWidth: 20, textAlign: "center" }}>{tourDays}</Typography>
                  <IconButton size="small" onClick={() => setTourDays(Math.min(30, tourDays + 1))}
                    sx={{ border: t => `1px solid ${t.palette.divider}`, width: 30, height: 30 }}>
                    <AddRoundedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Travelers */}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 14, mb: 1 }}>Travelers</Typography>
          <Card elevation={0} sx={{
            borderRadius: 2, mb: 1,
            bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
            border: t => `1px solid ${t.palette.mode === "light" ? "rgba(209,213,219,0.9)" : "rgba(51,65,85,0.7)"}`
          }}>
            <CardContent sx={{ px: 1.5, py: 1 }}>
              {/* Adults */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.5 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>Adults</Typography>
                  <Typography variant="caption" sx={{ fontSize: 10, color: t => t.palette.text.secondary }}>Age 13+</Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton size="small" onClick={() => setAdults(Math.max(1, adults - 1))}
                    sx={{ border: t => `1px solid ${t.palette.divider}`, width: 30, height: 30 }}>
                    <RemoveRoundedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <Typography sx={{ mx: 7, fontWeight: 700, fontSize: 15, minWidth: 20, textAlign: "center" }}>{adults}</Typography>
                  <IconButton size="small" onClick={() => setAdults(Math.min(tour.maxGroupSize - children, adults + 1))}
                    sx={{ border: t => `1px solid ${t.palette.divider}`, width: 30, height: 30 }}>
                    <AddRoundedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Stack>
              </Stack>
              <Divider sx={{ my: 0.5 }} />
              {/* Children */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.5 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>Children</Typography>
                  <Typography variant="caption" sx={{ fontSize: 10, color: t => t.palette.text.secondary }}>Age 5–12 (50% off)</Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton size="small" onClick={() => setChildren(Math.max(0, children - 1))}
                    sx={{ border: t => `1px solid ${t.palette.divider}`, width: 30, height: 30 }}>
                    <RemoveRoundedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <Typography sx={{ mx: 7, fontWeight: 700, fontSize: 15, minWidth: 20, textAlign: "center" }}>{children}</Typography>
                  <IconButton size="small" onClick={() => setChildren(Math.min(tour.maxGroupSize - adults, children + 1))}
                    sx={{ border: t => `1px solid ${t.palette.divider}`, width: 30, height: 30 }}>
                    <AddRoundedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
          {errors.adults && <Typography variant="caption" sx={{ color: "#EF4444", fontSize: 11 }}>{errors.adults}</Typography>}
          {errors.group && <Typography variant="caption" sx={{ color: "#EF4444", fontSize: 11 }}>{errors.group}</Typography>}

          {/* Pickup location */}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 14, mb: 1, mt: 2 }}>Pickup location</Typography>
          <Card elevation={0} sx={{
            borderRadius: 2, mb: 1,
            bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
            border: t => `1px solid ${t.palette.mode === "light" ? "rgba(209,213,219,0.9)" : "rgba(51,65,85,0.7)"}`
          }}>
            <CardContent sx={{ px: 1.5, py: 1.2 }}>
              <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
                <LocalTaxiRoundedIcon sx={{ fontSize: 16, color: G }} />
                <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>
                  Where should we pick you up?
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
              />
              {tour.meetingPoint && (
                <Typography variant="caption" sx={{ fontSize: 10, color: t => t.palette.text.secondary, mt: 0.75, display: "block" }}>
                  Default: {tour.meetingPoint}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* ── Step 2: Add-ons ──────────────────────────── */}
      {step === 1 && (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 14, mb: 0.5 }}>Enhance your experience</Typography>
          <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary, mb: 1.5, display: "block" }}>
            Optional add-ons to make your tour even better.
          </Typography>

          <Stack spacing={1}>
            {tour.addons.map(addon => {
              const selected = selectedAddons.includes(addon.id);
              return (
                <Card key={addon.id} elevation={0} onClick={() => toggleAddon(addon.id)}
                  sx={{
                    borderRadius: 2, cursor: "pointer",
                    bgcolor: selected ? "rgba(3,205,140,0.06)" : (t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)"),
                    border: selected ? `2px solid ${G}` : (t => `1px solid ${t.palette.mode === "light" ? "rgba(209,213,219,0.9)" : "rgba(51,65,85,0.7)"}`),
                    transition: "all 0.15s", "&:hover": { borderColor: G }
                  }}>
                  <CardContent sx={{ px: 1.5, py: 1.2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ flex: 1, mr: 1 }}>
                      <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>{addon.name}</Typography>
                      <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary, lineHeight: 1.4 }}>
                        {addon.description}
                      </Typography>
                    </Box>
                    <Stack alignItems="flex-end" spacing={0.25}>
                      <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 700, color: G }}>
                        +{formatUGX(addon.price)}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: 9, color: t => t.palette.text.secondary }}>per person</Typography>
                      {selected && <CheckCircleRoundedIcon sx={{ fontSize: 18, color: G }} />}
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </Box>
      )}

      {/* ── Step 3: Contact details ──────────────────── */}
      {step === 2 && (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 14, mb: 1.5 }}>Contact details</Typography>
          <Stack spacing={1.5}>
            <TextField fullWidth size="small" label="Full name" value={contactName} onChange={e => setContactName(e.target.value)}
              error={!!errors.name} helperText={errors.name}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            <TextField fullWidth size="small" label="Email" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)}
              error={!!errors.email} helperText={errors.email}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            <TextField fullWidth size="small" label="Phone number" value={contactPhone} onChange={e => setContactPhone(e.target.value)}
              error={!!errors.phone} helperText={errors.phone}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            <FormControl fullWidth size="small">
              <InputLabel>Country</InputLabel>
              <Select value={country} onChange={e => setCountry(e.target.value)} label="Country"
                sx={{ borderRadius: 2 }}>
                {["Uganda", "Kenya", "Tanzania", "Rwanda", "United States", "United Kingdom", "Other"].map(c => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField fullWidth size="small" label="Special requests (optional)" multiline rows={2}
              value={specialRequests} onChange={e => setSpecialRequests(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />

            {/* Promo code */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 13, mt: 1 }}>Promo code</Typography>
            <Stack direction="row" spacing={1}>
              <TextField fullWidth size="small" placeholder="Enter code" value={promoCode}
                onChange={e => { setPromoCode(e.target.value); setPromoApplied(false); setErrors(p => ({ ...p, promo: "" })); }}
                error={!!errors.promo} helperText={errors.promo}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              <Button variant="outlined" onClick={applyPromo} disabled={!promoCode.trim() || promoApplied}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, borderColor: G, color: G, minWidth: 80 }}>
                {promoApplied ? "Applied ✓" : "Apply"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}

      {/* ── Step 4: Payment ──────────────────────────── */}
      {step === 3 && (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 14, mb: 1.5 }}>Payment method</Typography>
          <Stack spacing={1} sx={{ mb: 2 }}>
            {[
              { id: "momo", label: "Mobile Money", icon: <PhoneAndroidRoundedIcon sx={{ fontSize: 20 }} />, desc: "MTN MoMo, Airtel Money" },
              { id: "card", label: "Credit / Debit Card", icon: <CreditCardRoundedIcon sx={{ fontSize: 20 }} />, desc: "Visa, Mastercard" },
              { id: "wallet", label: "EVzone Wallet", icon: <AccountBalanceWalletRoundedIcon sx={{ fontSize: 20 }} />, desc: "Pay from wallet balance" }
            ].map(pm => (
              <Card key={pm.id} elevation={0} onClick={() => setPaymentMethod(pm.id)}
                sx={{
                  borderRadius: 2, cursor: "pointer",
                  bgcolor: paymentMethod === pm.id ? "rgba(3,205,140,0.06)" : (t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)"),
                  border: paymentMethod === pm.id ? `2px solid ${G}` : (t => `1px solid ${t.palette.mode === "light" ? "rgba(209,213,219,0.9)" : "rgba(51,65,85,0.7)"}`),
                  transition: "all 0.15s"
                }}>
                <CardContent sx={{ px: 1.5, py: 1.2, display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ color: paymentMethod === pm.id ? G : undefined }}>{pm.icon}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>{pm.label}</Typography>
                    <Typography variant="caption" sx={{ fontSize: 10, color: t => t.palette.text.secondary }}>{pm.desc}</Typography>
                  </Box>
                  {paymentMethod === pm.id && <CheckCircleRoundedIcon sx={{ fontSize: 20, color: G }} />}
                </CardContent>
              </Card>
            ))}
          </Stack>

          {/* Terms */}
          <FormControlLabel
            control={<Checkbox checked={agreedTerms} onChange={e => setAgreedTerms(e.target.checked)} sx={{ color: G, "&.Mui-checked": { color: G } }} />}
            label={
              <Typography variant="caption" sx={{ fontSize: 11, lineHeight: 1.5 }}>
                I agree to the <Typography component="span" sx={{ color: G, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>Terms & Conditions</Typography> and the cancellation policy.
              </Typography>
            }
          />
          {errors.terms && <Typography variant="caption" sx={{ color: "#EF4444", fontSize: 11, display: "block" }}>{errors.terms}</Typography>}

          {/* Trust */}
          <Stack direction="row" spacing={1.5} sx={{ mt: 1.5, mb: 1 }}>
            <Stack direction="row" spacing={0.3} alignItems="center">
              <SecurityRoundedIcon sx={{ fontSize: 14, color: G }} />
              <Typography variant="caption" sx={{ fontSize: 10, color: t => t.palette.text.secondary }}>Secure checkout</Typography>
            </Stack>
            <Stack direction="row" spacing={0.3} alignItems="center">
              <VerifiedRoundedIcon sx={{ fontSize: 14, color: G }} />
              <Typography variant="caption" sx={{ fontSize: 10, color: t => t.palette.text.secondary }}>Verified operator</Typography>
            </Stack>
          </Stack>
        </Box>
      )}

      {/* ── Booking summary ──────────────────────────── */}
      <Card elevation={0} sx={{
        mt: 2.5, borderRadius: 2.5, overflow: "hidden",
        bgcolor: t => t.palette.mode === "light" ? "#fff" : "rgba(15,23,42,0.98)",
        border: t => `1px solid ${t.palette.mode === "light" ? "rgba(209,213,219,0.9)" : "rgba(51,65,85,0.7)"}`
      }}>
        <CardContent sx={{ px: 1.8, py: 1.5 }}>
          {/* Tour mini-card */}
          <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1.5 }}>
            <Box sx={{
              width: 56, height: 56, borderRadius: 2, flexShrink: 0,
              background: getGradientForTour(tour.slug),
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Typography sx={{ color: "rgba(255,255,255,0.3)", fontSize: 20, fontWeight: 800 }}>
                {tour.destination.charAt(0)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 13 }}>{tour.title}</Typography>
              <Typography variant="caption" sx={{ fontSize: 10.5, color: t => t.palette.text.secondary }}>
                {pickedDate ? pickedDate.format("ddd, D MMM YYYY") : "Select a date"}
                {pickedStartTime ? ` • ${pickedStartTime.format("HH:mm")}` : ""}
                {pickedEndTime ? ` – ${pickedEndTime.format("HH:mm")}` : ""}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 10.5, color: t => t.palette.text.secondary, display: "block" }}>
                {tourDays} day{tourDays !== 1 ? "s" : ""} • {adults} adult{adults !== 1 ? "s" : ""}{children > 0 ? `, ${children} child${children !== 1 ? "ren" : ""}` : ""}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 1.2 }} />

          {/* Price breakdown */}
          <Stack spacing={0.5}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>
                Base ({tourDays}d × {adults} adult{adults !== 1 ? "s" : ""}{children > 0 ? ` + ${children} child${children !== 1 ? "ren" : ""} 50%` : ""})
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>{formatUGX(cost.base)}</Typography>
            </Stack>
            {cost.addonsCost > 0 && (
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>
                  Add-ons ({selectedAddons.length})
                </Typography>
                <Typography variant="caption" sx={{ fontSize: 11 }}>{formatUGX(cost.addonsCost)}</Typography>
              </Stack>
            )}
            {cost.promo > 0 && (
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" sx={{ fontSize: 11, color: G }}>Promo discount</Typography>
                <Typography variant="caption" sx={{ fontSize: 11, color: G }}>−{formatUGX(cost.promo)}</Typography>
              </Stack>
            )}
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontSize: 11, color: t => t.palette.text.secondary }}>Taxes & fees (5%)</Typography>
              <Typography variant="caption" sx={{ fontSize: 11 }}>{formatUGX(cost.taxes)}</Typography>
            </Stack>
            <Divider sx={{ my: 0.5 }} />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ fontWeight: 800, fontSize: 14 }}>Total</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, fontSize: 14, color: G }}>{formatUGX(cost.total)}</Typography>
            </Stack>
          </Stack>

          {/* Cancellation badge */}
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1.2 }}>
            <EventAvailableRoundedIcon sx={{ fontSize: 14, color: G }} />
            <Typography variant="caption" sx={{ fontSize: 10, color: G, fontWeight: 600 }}>
              Free cancellation up to {tour.cancellationHours}h before
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* ── Navigation buttons ───────────────────────── */}
      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        {step > 0 && (
          <Button fullWidth variant="outlined" onClick={handleBack}
            sx={{ borderRadius: 999, py: 1, textTransform: "none", fontWeight: 600, borderColor: t => t.palette.divider }}>
            Back
          </Button>
        )}
        <Button fullWidth variant="contained" onClick={handleNext} disabled={submitting}
          sx={{
            borderRadius: 999, py: 1, textTransform: "none", fontWeight: 700, fontSize: 14,
            bgcolor: G, color: "#020617", "&:hover": { bgcolor: G2 }, "&:disabled": { bgcolor: "rgba(3,205,140,0.5)" }
          }}>
          {submitting ? <CircularProgress size={22} sx={{ color: "#020617" }} /> : step === STEPS.length - 1 ? "Confirm & pay" : "Continue"}
        </Button>
      </Stack>

      {/* Error snackbar */}
      <Snackbar open={!!submitError} autoHideDuration={4000} onClose={() => setSubmitError(null)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="error" variant="filled">{submitError}</Alert>
      </Snackbar>
      </Box>
    </Box>
    </LocalizationProvider>
  );
}

/* ═══════════════════════════════════════════════════════════
   Export
   ═══════════════════════════════════════════════════════════ */
export default function TourBookingPage() {
  return (
    <>
      <DarkModeToggle />
      <MobileShell>
        <TourBookingScreen />
      </MobileShell>
    </>
  );
}
