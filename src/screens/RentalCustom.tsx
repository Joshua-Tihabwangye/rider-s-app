import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import CustomRentalStepIndicator from "../components/rental/CustomRentalStepIndicator";
import VehiclePreferenceSelector from "../components/rental/VehiclePreferenceSelector";
import DriverOptionSelector from "../components/rental/DriverOptionSelector";
import RentalAddOnsSelector from "../components/rental/RentalAddOnsSelector";
import RentalEstimateCard from "../components/rental/RentalEstimateCard";
import { useAppData } from "../contexts/AppDataContext";
import {
  DEFAULT_BASE_DAILY_RATE,
  RENTAL_CONTACT_PREFERENCE_OPTIONS,
  RENTAL_TRIP_PURPOSE_OPTIONS,
  buildCustomRentalEstimate,
  buildRentalDurationLabel,
  createDefaultRentalAddOns
} from "../features/rental/custom";
import { formatUgx, getRentalBookingVehicle, parseUgx } from "../features/rental/booking";
import type {
  RentalContactPreference,
  RentalModeOption,
  RentalTripPurpose,
  RentalVehiclePreferenceType
} from "../store/types";
import { uiTokens } from "../design/tokens";

const CUSTOM_RENTAL_STEPS = [
  "Trip details",
  "Vehicle preference",
  "Driver option",
  "Add-ons",
  "Review estimate"
];

function toInputDateTimeValue(date: Date): string {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(date.getTime() - offsetMs);
  return localDate.toISOString().slice(0, 16);
}

function parseOptionalNumber(value: string): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

function getInitialDropoff(
  differentDropoff: boolean,
  customDropoff: string | undefined,
  bookingDropoff: string | undefined,
  pickup: string
): string {
  if (!differentDropoff) {
    return pickup;
  }

  return customDropoff ?? bookingDropoff ?? pickup;
}

export default function RentalCustom(): React.JSX.Element {
  const navigate = useNavigate();
  const { rental, actions } = useAppData();

  const existingCustomRequest = rental.booking.customRequest;
  const selectedVehicle = getRentalBookingVehicle(
    rental.vehicles,
    rental.booking,
    rental.selectedVehicleId
  );
  const now = useMemo(() => new Date(), []);
  const defaultPickupDateTime = useMemo(
    () => toInputDateTimeValue(new Date(now.getTime() + 60 * 60 * 1000)),
    [now]
  );
  const defaultReturnDateTime = useMemo(
    () => toInputDateTimeValue(new Date(now.getTime() + 24 * 60 * 60 * 1000)),
    [now]
  );

  const [pickupLocation, setPickupLocation] = useState(
    existingCustomRequest?.pickupLocation ??
      rental.booking.pickupBranch ??
      "Nsambya EV Hub"
  );
  const [differentDropoff, setDifferentDropoff] = useState(
    existingCustomRequest?.differentDropoff ?? false
  );
  const [returnLocation, setReturnLocation] = useState(
    getInitialDropoff(
      existingCustomRequest?.differentDropoff ?? false,
      existingCustomRequest?.dropoffLocation,
      rental.booking.dropoffBranch,
      existingCustomRequest?.pickupLocation ??
        rental.booking.pickupBranch ??
        "Nsambya EV Hub"
    )
  );
  const [pickupDateTime, setPickupDateTime] = useState(
    existingCustomRequest?.pickupDateTime ?? defaultPickupDateTime
  );
  const [returnDateTime, setReturnDateTime] = useState(
    existingCustomRequest?.returnDateTime ?? defaultReturnDateTime
  );
  const [tripPurpose, setTripPurpose] = useState<RentalTripPurpose>(
    existingCustomRequest?.tripPurpose ?? "personal"
  );

  const [driverOption, setDriverOption] = useState<RentalModeOption>(
    existingCustomRequest?.driverOption ?? rental.booking.rentalMode ?? "self_drive"
  );
  const [additionalDriver, setAdditionalDriver] = useState(
    existingCustomRequest?.additionalDriver ?? false
  );
  const [passengerCount, setPassengerCount] = useState(
    existingCustomRequest?.passengerCount?.toString() ?? ""
  );
  const [luggageQuantity, setLuggageQuantity] = useState(
    existingCustomRequest?.luggageQuantity?.toString() ?? ""
  );
  const [preferredDriverLanguage, setPreferredDriverLanguage] = useState(
    existingCustomRequest?.preferredDriverLanguage ?? "English"
  );
  const [chauffeurWaitingTimeHours, setChauffeurWaitingTimeHours] = useState(
    existingCustomRequest?.chauffeurWaitingTimeHours?.toString() ?? "1"
  );
  const [routeNotes, setRouteNotes] = useState(
    existingCustomRequest?.routeNotes ?? ""
  );

  const [vehiclePreference, setVehiclePreference] = useState<RentalVehiclePreferenceType>(
    existingCustomRequest?.vehiclePreference ?? "any"
  );
  const [minimumRangeKm, setMinimumRangeKm] = useState(
    existingCustomRequest?.minimumRangeKm?.toString() ?? ""
  );
  const [requiredSeats, setRequiredSeats] = useState(
    existingCustomRequest?.requiredSeats?.toString() ?? ""
  );
  const [requiredLuggageCapacity, setRequiredLuggageCapacity] = useState(
    existingCustomRequest?.requiredLuggageCapacity?.toString() ?? ""
  );
  const [premiumInterior, setPremiumInterior] = useState(
    existingCustomRequest?.premiumInterior ?? false
  );
  const [fastestCharging, setFastestCharging] = useState(
    existingCustomRequest?.fastestCharging ?? false
  );
  const [budgetMin, setBudgetMin] = useState(
    existingCustomRequest?.budgetMin?.toString() ?? ""
  );
  const [budgetMax, setBudgetMax] = useState(
    existingCustomRequest?.budgetMax?.toString() ?? ""
  );

  const [addOns, setAddOns] = useState(() => {
    if (existingCustomRequest?.addOns?.length) {
      return existingCustomRequest.addOns;
    }
    return createDefaultRentalAddOns();
  });

  const [specialInstructions, setSpecialInstructions] = useState(
    existingCustomRequest?.specialInstructions ?? ""
  );
  const [preferredVehicleModel, setPreferredVehicleModel] = useState(
    existingCustomRequest?.preferredVehicleModel ?? ""
  );
  const [accessibilityNeeds, setAccessibilityNeeds] = useState(
    existingCustomRequest?.accessibilityNeeds ?? ""
  );
  const [contactPreference, setContactPreference] = useState<RentalContactPreference>(
    existingCustomRequest?.contactPreference ?? "call"
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const baseDailyRate = useMemo(() => {
    const selectedVehicleRate = parseUgx(selectedVehicle?.dailyPrice);
    if (selectedVehicleRate > 0) {
      return selectedVehicleRate;
    }

    const maxBudget = parseOptionalNumber(budgetMax);
    if (maxBudget && maxBudget > 0) {
      return maxBudget;
    }

    const minBudget = parseOptionalNumber(budgetMin);
    if (minBudget && minBudget > 0) {
      return minBudget;
    }

    return DEFAULT_BASE_DAILY_RATE;
  }, [budgetMax, budgetMin, selectedVehicle?.dailyPrice]);

  const estimate = useMemo(
    () =>
      buildCustomRentalEstimate({
        pickupDateTime,
        returnDateTime,
        differentDropoff,
        driverOption,
        addOns,
        chauffeurWaitingTimeHours: Number(chauffeurWaitingTimeHours) || 0,
        baseDailyRate
      }),
    [
      addOns,
      baseDailyRate,
      chauffeurWaitingTimeHours,
      differentDropoff,
      driverOption,
      pickupDateTime,
      returnDateTime
    ]
  );

  const step1Complete = Boolean(
    pickupLocation.trim() &&
      pickupDateTime &&
      returnDateTime &&
      (!differentDropoff || returnLocation.trim())
  );
  const step3Complete =
    driverOption === "self_drive"
      ? true
      : Boolean(passengerCount.trim() && luggageQuantity.trim());
  const activeStep = !step1Complete ? 0 : !step3Complete ? 2 : 4;

  const toggleAddOn = (addOnId: string): void => {
    setAddOns((previous) =>
      previous.map((addOn) =>
        addOn.id === addOnId ? { ...addOn, selected: !addOn.selected } : addOn
      )
    );
  };

  const handleContinueToRentalOrder = (): void => {
    const dropoffLocation = differentDropoff ? returnLocation.trim() : pickupLocation.trim();
    if (!pickupLocation.trim()) {
      setValidationError("Pickup location is required.");
      return;
    }
    if (!dropoffLocation) {
      setValidationError("Return location is required.");
      return;
    }
    if (!pickupDateTime || !returnDateTime) {
      setValidationError("Pickup and return date/time are required.");
      return;
    }

    const pickupDate = new Date(pickupDateTime);
    const dropoffDate = new Date(returnDateTime);
    if (
      Number.isNaN(pickupDate.getTime()) ||
      Number.isNaN(dropoffDate.getTime()) ||
      dropoffDate <= pickupDate
    ) {
      setValidationError("Return date & time must be later than pickup date & time.");
      return;
    }

    if (driverOption === "chauffeur" && (!passengerCount.trim() || !luggageQuantity.trim())) {
      setValidationError("Passengers and luggage quantity are required for chauffeur trips.");
      return;
    }

    setValidationError(null);
    const normalizedAddOns = addOns.map((addOn) => ({ ...addOn }));
    const vehicleId =
      rental.booking.vehicleId ??
      rental.selectedVehicleId ??
      rental.vehicles[0]?.id ??
      "EV-RENT-01";

    actions.updateRentalBooking({
      vehicleId,
      startDate: pickupDateTime,
      endDate: returnDateTime,
      pickupBranch: pickupLocation.trim(),
      dropoffBranch: dropoffLocation,
      rentalMode: driverOption,
      customRequest: {
        pickupLocation: pickupLocation.trim(),
        dropoffLocation,
        differentDropoff,
        pickupDateTime,
        returnDateTime,
        rentalDurationLabel: buildRentalDurationLabel(estimate.durationDays),
        tripPurpose,
        driverOption,
        additionalDriver,
        passengerCount: parseOptionalNumber(passengerCount),
        luggageQuantity: parseOptionalNumber(luggageQuantity),
        preferredDriverLanguage: preferredDriverLanguage.trim() || undefined,
        chauffeurWaitingTimeHours: parseOptionalNumber(chauffeurWaitingTimeHours),
        routeNotes: routeNotes.trim() || undefined,
        vehiclePreference,
        minimumRangeKm: parseOptionalNumber(minimumRangeKm),
        requiredSeats: parseOptionalNumber(requiredSeats),
        requiredLuggageCapacity: parseOptionalNumber(requiredLuggageCapacity),
        premiumInterior,
        fastestCharging,
        budgetMin: parseOptionalNumber(budgetMin),
        budgetMax: parseOptionalNumber(budgetMax),
        addOns: normalizedAddOns,
        specialInstructions: specialInstructions.trim() || undefined,
        preferredVehicleModel: preferredVehicleModel.trim() || undefined,
        accessibilityNeeds: accessibilityNeeds.trim() || undefined,
        contactPreference,
        pricing: estimate
      },
      priceEstimate: formatUgx(estimate.totalEstimated)
    });

    const preferredFilter =
      driverOption === "chauffeur"
        ? "chauffeur"
        : vehiclePreference === "suv"
          ? "suv"
          : vehiclePreference === "sedan"
            ? "sedan"
            : "self";

    navigate("/rental/list", {
      state: {
        mode: preferredFilter,
        vehicleType: vehiclePreference,
        fromCustom: true
      }
    });
  };

  return (
    <ScreenScaffold>
      <SectionHeader
        title="Custom EV rental"
        subtitle="Build your request, review your estimate, then continue to vehicle selection."
        leadingAction={
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: uiTokens.radius.xl,
              bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)"),
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        }
        action={
          <Box
            sx={{
              borderRadius: uiTokens.radius.pill,
              px: 1,
              py: 0.45,
              bgcolor: "rgba(249,115,22,0.14)",
              border: "1px solid rgba(249,115,22,0.4)",
              color: "#C2410C",
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5
            }}
          >
            <LocalOfferRoundedIcon sx={{ fontSize: 13 }} />
            <Typography variant="caption" sx={{ fontSize: 10.5, fontWeight: 700 }}>
              Custom builder
            </Typography>
          </Box>
        }
      />

      <CustomRentalStepIndicator steps={CUSTOM_RENTAL_STEPS} activeStep={activeStep} />

      <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl, border: uiTokens.borders.subtle }}>
        <CardContent sx={{ px: 1.7, py: 1.7 }}>
          <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
            Step 1: Trip details
          </Typography>
          <Stack spacing={1}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <TextField
                label="Pickup location"
                size="small"
                fullWidth
                value={pickupLocation}
                onChange={(event) => setPickupLocation(event.target.value)}
              />
              <TextField
                label="Return location"
                size="small"
                fullWidth
                value={returnLocation}
                onChange={(event) => setReturnLocation(event.target.value)}
                disabled={!differentDropoff}
              />
            </Stack>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Switch
                checked={differentDropoff}
                onChange={(event) => {
                  const nextDifferentDropoff = event.target.checked;
                  setDifferentDropoff(nextDifferentDropoff);
                  if (!nextDifferentDropoff) {
                    setReturnLocation(pickupLocation);
                  }
                }}
              />
              <Typography variant="caption" sx={{ fontSize: 11.5 }}>
                Return to a different location
              </Typography>
            </Box>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <TextField
                label="Pickup date & time"
                size="small"
                fullWidth
                type="datetime-local"
                value={pickupDateTime}
                onChange={(event) => setPickupDateTime(event.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Return date & time"
                size="small"
                fullWidth
                type="datetime-local"
                value={returnDateTime}
                onChange={(event) => setReturnDateTime(event.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <TextField
                label="Trip purpose"
                size="small"
                select
                fullWidth
                value={tripPurpose}
                onChange={(event) => setTripPurpose(event.target.value as RentalTripPurpose)}
              >
                {RENTAL_TRIP_PURPOSE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Rental duration"
                size="small"
                fullWidth
                value={buildRentalDurationLabel(estimate.durationDays)}
                InputProps={{ readOnly: true }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl, border: uiTokens.borders.subtle }}>
        <CardContent sx={{ px: 1.7, py: 1.7 }}>
          <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
            Step 2: Vehicle preference
          </Typography>
          <VehiclePreferenceSelector
            vehiclePreference={vehiclePreference}
            minimumRangeKm={minimumRangeKm}
            requiredSeats={requiredSeats}
            requiredLuggageCapacity={requiredLuggageCapacity}
            premiumInterior={premiumInterior}
            fastestCharging={fastestCharging}
            budgetMin={budgetMin}
            budgetMax={budgetMax}
            onVehiclePreferenceChange={setVehiclePreference}
            onMinimumRangeChange={setMinimumRangeKm}
            onRequiredSeatsChange={setRequiredSeats}
            onRequiredLuggageChange={setRequiredLuggageCapacity}
            onPremiumInteriorChange={setPremiumInterior}
            onFastestChargingChange={setFastestCharging}
            onBudgetMinChange={setBudgetMin}
            onBudgetMaxChange={setBudgetMax}
          />
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl, border: uiTokens.borders.subtle }}>
        <CardContent sx={{ px: 1.7, py: 1.7 }}>
          <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
            Step 3: Driver option
          </Typography>
          <DriverOptionSelector
            driverOption={driverOption}
            additionalDriver={additionalDriver}
            passengerCount={passengerCount}
            luggageQuantity={luggageQuantity}
            preferredDriverLanguage={preferredDriverLanguage}
            chauffeurWaitingTimeHours={chauffeurWaitingTimeHours}
            routeNotes={routeNotes}
            onDriverOptionChange={setDriverOption}
            onAdditionalDriverChange={setAdditionalDriver}
            onPassengerCountChange={setPassengerCount}
            onLuggageQuantityChange={setLuggageQuantity}
            onPreferredDriverLanguageChange={setPreferredDriverLanguage}
            onChauffeurWaitingTimeHoursChange={setChauffeurWaitingTimeHours}
            onRouteNotesChange={setRouteNotes}
          />
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl, border: uiTokens.borders.subtle }}>
        <CardContent sx={{ px: 1.7, py: 1.7 }}>
          <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
            Step 4: Add-ons and amenities
          </Typography>
          <RentalAddOnsSelector addOns={addOns} onToggleAddOn={toggleAddOn} />
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl, border: uiTokens.borders.subtle }}>
        <CardContent sx={{ px: 1.7, py: 1.7 }}>
          <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
            Step 5: Review estimate
          </Typography>
          <RentalEstimateCard estimate={estimate} />
          <Divider sx={{ my: 1.1 }} />
          <Stack spacing={1}>
            <TextField
              label="Special instructions"
              size="small"
              fullWidth
              multiline
              minRows={2}
              value={specialInstructions}
              onChange={(event) => setSpecialInstructions(event.target.value)}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <TextField
                label="Preferred vehicle model"
                size="small"
                fullWidth
                value={preferredVehicleModel}
                onChange={(event) => setPreferredVehicleModel(event.target.value)}
              />
              <TextField
                label="Accessibility needs"
                size="small"
                fullWidth
                value={accessibilityNeeds}
                onChange={(event) => setAccessibilityNeeds(event.target.value)}
              />
            </Stack>
            <TextField
              label="Contact preference"
              size="small"
              select
              value={contactPreference}
              onChange={(event) =>
                setContactPreference(event.target.value as RentalContactPreference)
              }
            >
              {RENTAL_CONTACT_PREFERENCE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ position: "sticky", bottom: 8, zIndex: 2 }}>
        <Card
          elevation={0}
          sx={{
            borderRadius: uiTokens.radius.xl,
            border: "1px solid rgba(209,213,219,0.9)",
            bgcolor: (t) => (t.palette.mode === "light" ? "rgba(255,255,255,0.96)" : "rgba(15,23,42,0.96)"),
            backdropFilter: "blur(8px)"
          }}
        >
          <CardContent sx={{ px: 1.3, py: 1.2 }}>
            {validationError && (
              <Alert severity="error" sx={{ mb: 1, borderRadius: uiTokens.radius.lg }}>
                {validationError}
              </Alert>
            )}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.9 }}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                  Total estimated
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
                  {formatUgx(estimate.totalEstimated)}
                </Typography>
              </Box>
            </Stack>
            <Button
              fullWidth
              variant="contained"
              onClick={handleContinueToRentalOrder}
              sx={{
                borderRadius: uiTokens.radius.xl,
                py: 1.15,
                fontSize: 14,
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "primary.main",
                color: "#022C22",
                "&:hover": { bgcolor: "#06e29a" }
              }}
            >
              Continue to rental order
            </Button>
          </CardContent>
        </Card>
      </Box>
    </ScreenScaffold>
  );
}
