import React, { useEffect, useMemo, useRef, useState } from "react";
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
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import ScreenScaffold from "../components/ScreenScaffold";
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
  createDefaultRentalAddOns,
  getAddOnIdsForTripPurpose
} from "../features/rental/custom";
import {
  EVZONE_RENTAL_LOCATIONS,
  getLocationById,
  getPickupLocations,
  getReturnLocations
} from "../features/rental/locations";
import { formatUgx, getRentalBookingVehicle, parseUgx } from "../features/rental/booking";
import type {
  RentalContactPreference,
  RentalModeOption,
  RentalTripPurpose,
  RentalUploadedDocument,
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

const ACCEPTED_DOCUMENT_TYPES = ".pdf,image/*";
const ORANGE_ACCENT = "#C2410C";
const FORM_CONTENT_SX = {
  px: 1.7,
  py: 1.7,
  "& .MuiFormLabel-root": { fontSize: 14 },
  "& .MuiInputLabel-root.MuiInputLabel-shrink": { fontSize: 12.5 },
  "& .MuiInputBase-input, & .MuiSelect-select": { fontSize: 15 },
  "& .MuiFormHelperText-root": { fontSize: 11 }
};

type ValidationErrors = Record<string, string>;

function toInputDateTimeValue(date: Date): string {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(date.getTime() - offsetMs);
  return localDate.toISOString().slice(0, 16);
}

function sanitizeIntegerString(value: string): string {
  if (!value.trim()) {
    return "";
  }
  const sanitized = value.replace(/[^\d]/g, "");
  if (!sanitized) {
    return "";
  }
  return String(Math.max(0, Math.round(Number(sanitized))));
}

function parseNumberValue(value: string, min: number): number | undefined {
  if (!value.trim()) {
    return undefined;
  }
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return undefined;
  }
  return Math.max(min, Math.round(numeric));
}

function toUploadedDocument(
  kind: RentalUploadedDocument["kind"],
  file: File
): RentalUploadedDocument {
  return {
    kind,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    lastModified: file.lastModified
  };
}

function isAllowedDocumentType(file: File): boolean {
  return file.type === "application/pdf" || file.type.startsWith("image/");
}

function renderUploadedFileLabel(file: File | null): string {
  if (!file) {
    return "No file selected";
  }
  const sizeKb = Math.max(1, Math.round(file.size / 1024));
  return `${file.name} (${sizeKb} KB)`;
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

  const pickupLocations = useMemo(() => getPickupLocations(), []);
  const returnLocations = useMemo(() => getReturnLocations(), []);

  const initialPickupLocationId =
    existingCustomRequest?.pickupLocationId ??
    EVZONE_RENTAL_LOCATIONS.find(
      (location) => location.displayName === rental.booking.pickupBranch
    )?.id ??
    pickupLocations[0]?.id ??
    "";

  const initialDifferentDropoff = existingCustomRequest?.differentDropoff ?? false;
  const initialReturnLocationId =
    existingCustomRequest?.dropoffLocationId ??
    EVZONE_RENTAL_LOCATIONS.find(
      (location) => location.displayName === rental.booking.dropoffBranch
    )?.id ??
    initialPickupLocationId;

  const [pickupLocationId, setPickupLocationId] = useState(initialPickupLocationId);
  const [differentDropoff, setDifferentDropoff] = useState(initialDifferentDropoff);
  const [returnLocationId, setReturnLocationId] = useState(initialReturnLocationId);
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
    existingCustomRequest?.chauffeurWaitingTimeHours?.toString() ?? "0"
  );
  const [routeNotes, setRouteNotes] = useState(existingCustomRequest?.routeNotes ?? "");

  const [vehiclePreference, setVehiclePreference] = useState<RentalVehiclePreferenceType>(
    existingCustomRequest?.vehiclePreference ?? "any"
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

  const [driverLicenseFile, setDriverLicenseFile] = useState<File | null>(null);
  const [idDocumentFile, setIdDocumentFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const driverLicenseInputRef = useRef<HTMLInputElement | null>(null);
  const idDocumentInputRef = useRef<HTMLInputElement | null>(null);
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

  const visibleAddOnIds = useMemo(() => getAddOnIdsForTripPurpose(tripPurpose), [tripPurpose]);
  const visibleAddOns = useMemo(
    () => addOns.filter((addOn) => visibleAddOnIds.includes(addOn.id)),
    [addOns, visibleAddOnIds]
  );

  useEffect(() => {
    if (!differentDropoff) {
      setReturnLocationId(pickupLocationId);
    }
  }, [differentDropoff, pickupLocationId]);

  useEffect(() => {
    setAddOns((previous) =>
      previous.map((addOn) =>
        visibleAddOnIds.includes(addOn.id)
          ? addOn
          : { ...addOn, selected: false, quantity: 1 }
      )
    );
  }, [visibleAddOnIds]);

  const selectedPickupLocation = getLocationById(pickupLocationId);
  const selectedReturnLocation = getLocationById(
    differentDropoff ? returnLocationId : pickupLocationId
  );

  const baseDailyRate = useMemo(() => {
    const selectedVehicleRate = parseUgx(selectedVehicle?.dailyPrice);
    if (selectedVehicleRate > 0) {
      return selectedVehicleRate;
    }

    const maxBudget = parseNumberValue(budgetMax, 0);
    if (maxBudget && maxBudget > 0) {
      return maxBudget;
    }

    const minBudget = parseNumberValue(budgetMin, 0);
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

  const activeStep = useMemo(() => {
    if (!pickupLocationId || !pickupDateTime || !returnDateTime) {
      return 0;
    }
    if (!requiredSeats) {
      return 1;
    }
    if (driverOption === "chauffeur" && (!passengerCount || !luggageQuantity)) {
      return 2;
    }
    return 4;
  }, [
    driverOption,
    luggageQuantity,
    passengerCount,
    pickupDateTime,
    pickupLocationId,
    requiredSeats,
    returnDateTime
  ]);

  const registerFieldRef =
    (field: string) =>
    (element: HTMLElement | null): void => {
      fieldRefs.current[field] = element;
    };

  const focusFirstError = (validationErrors: ValidationErrors): void => {
    const fieldOrder = [
      "pickupLocationId",
      "returnLocationId",
      "pickupDateTime",
      "returnDateTime",
      "tripPurpose",
      "requiredSeats",
      "budgetMax",
      "passengerCount",
      "luggageQuantity",
      "chauffeurWaitingTimeHours",
      "drivers_license",
      "id_or_passport"
    ];
    const firstInvalidField = fieldOrder.find((field) => validationErrors[field]);
    if (!firstInvalidField) {
      return;
    }

    if (firstInvalidField === "drivers_license" && driverLicenseInputRef.current) {
      driverLicenseInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      driverLicenseInputRef.current.focus();
      return;
    }
    if (firstInvalidField === "id_or_passport" && idDocumentInputRef.current) {
      idDocumentInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      idDocumentInputRef.current.focus();
      return;
    }

    const element = fieldRefs.current[firstInvalidField];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      if ("focus" in element) {
        element.focus();
      }
    }
  };

  const handleToggleAddOn = (addOnId: string): void => {
    setAddOns((previous) =>
      previous.map((addOn) =>
        addOn.id === addOnId ? { ...addOn, selected: !addOn.selected } : addOn
      )
    );
  };

  const handleAddOnQuantityChange = (addOnId: string, quantity: number): void => {
    const safeQuantity = Math.max(1, Math.round(quantity));
    setAddOns((previous) =>
      previous.map((addOn) =>
        addOn.id === addOnId ? { ...addOn, quantity: safeQuantity } : addOn
      )
    );
  };

  const validateForm = (): ValidationErrors => {
    const nextErrors: ValidationErrors = {};
    if (!pickupLocationId) {
      nextErrors.pickupLocationId = "Pickup location is required.";
    }
    const resolvedReturnLocationId = differentDropoff ? returnLocationId : pickupLocationId;
    if (!resolvedReturnLocationId) {
      nextErrors.returnLocationId = "Return location is required.";
    }
    if (!pickupDateTime) {
      nextErrors.pickupDateTime = "Pickup date & time is required.";
    }
    if (!returnDateTime) {
      nextErrors.returnDateTime = "Return date & time is required.";
    }

    const pickupDate = new Date(pickupDateTime);
    const dropoffDate = new Date(returnDateTime);
    if (
      pickupDateTime &&
      returnDateTime &&
      (!Number.isFinite(pickupDate.getTime()) ||
        !Number.isFinite(dropoffDate.getTime()) ||
        dropoffDate <= pickupDate)
    ) {
      nextErrors.returnDateTime = "Return date & time must be after pickup date & time.";
    }

    if (!requiredSeats.trim()) {
      nextErrors.requiredSeats = "Seats are required.";
    }

    const parsedSeats = parseNumberValue(requiredSeats, 1);
    if (requiredSeats.trim() && parsedSeats === undefined) {
      nextErrors.requiredSeats = "Seats must be a positive number.";
    }

    const parsedBudgetMin = parseNumberValue(budgetMin, 0);
    const parsedBudgetMax = parseNumberValue(budgetMax, 0);
    if (
      parsedBudgetMin !== undefined &&
      parsedBudgetMax !== undefined &&
      parsedBudgetMax < parsedBudgetMin
    ) {
      nextErrors.budgetMax = "Budget max must be greater than or equal to budget min.";
    }

    if (driverOption === "chauffeur") {
      const parsedPassengers = parseNumberValue(passengerCount, 1);
      const parsedLuggage = parseNumberValue(luggageQuantity, 0);
      if (!passengerCount.trim()) {
        nextErrors.passengerCount = "Passengers are required for chauffeur trips.";
      } else if (parsedPassengers === undefined) {
        nextErrors.passengerCount = "Passengers must be at least 1.";
      }
      if (!luggageQuantity.trim()) {
        nextErrors.luggageQuantity = "Luggage quantity is required for chauffeur trips.";
      } else if (parsedLuggage === undefined) {
        nextErrors.luggageQuantity = "Luggage quantity cannot be negative.";
      }
    }

    const parsedWaitingHours = parseNumberValue(chauffeurWaitingTimeHours, 0);
    if (
      chauffeurWaitingTimeHours.trim() &&
      parsedWaitingHours === undefined
    ) {
      nextErrors.chauffeurWaitingTimeHours = "Waiting time cannot be negative.";
    }

    if (driverOption === "self_drive") {
      if (!driverLicenseFile) {
        nextErrors.drivers_license = "Driver's licence upload is required for self-drive.";
      }
      if (!idDocumentFile) {
        nextErrors.id_or_passport = "National ID or Passport upload is required for self-drive.";
      }
    }

    return nextErrors;
  };

  const handleContinueToRentalOrder = (): void => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      focusFirstError(validationErrors);
      return;
    }

    setErrors({});
    const resolvedReturnLocationId = differentDropoff ? returnLocationId : pickupLocationId;
    const pickupLocation = getLocationById(pickupLocationId);
    const dropoffLocation = getLocationById(resolvedReturnLocationId);
    const normalizedAddOns = addOns.map((addOn) => ({
      ...addOn,
      quantity: Math.max(1, Math.round(addOn.quantity || 1))
    }));
    const vehicleId =
      rental.booking.vehicleId ??
      rental.selectedVehicleId ??
      rental.vehicles[0]?.id ??
      "EV-RENT-01";

    const documents: RentalUploadedDocument[] = [];
    if (driverLicenseFile) {
      documents.push(toUploadedDocument("drivers_license", driverLicenseFile));
    }
    if (idDocumentFile) {
      documents.push(toUploadedDocument("id_or_passport", idDocumentFile));
    }

    const parsedSeats = parseNumberValue(requiredSeats, 1);
    const parsedLuggageCapacity = parseNumberValue(requiredLuggageCapacity, 0);
    const parsedBudgetMin = parseNumberValue(budgetMin, 0);
    const parsedBudgetMax = parseNumberValue(budgetMax, 0);
    const parsedPassengers = parseNumberValue(passengerCount, 1);
    const parsedLuggageQty = parseNumberValue(luggageQuantity, 0);
    const parsedWaitingHours = parseNumberValue(chauffeurWaitingTimeHours, 0);

    actions.updateRentalBooking({
      vehicleId,
      startDate: pickupDateTime,
      endDate: returnDateTime,
      pickupBranch: pickupLocation?.displayName,
      dropoffBranch: dropoffLocation?.displayName,
      rentalMode: driverOption,
      customRequest: {
        pickupLocationId,
        dropoffLocationId: resolvedReturnLocationId,
        pickupLocation: pickupLocation?.displayName ?? "",
        dropoffLocation: dropoffLocation?.displayName ?? "",
        differentDropoff,
        pickupDateTime,
        returnDateTime,
        rentalDurationLabel: buildRentalDurationLabel(estimate.durationDays),
        tripPurpose,
        driverOption,
        additionalDriver,
        passengerCount: parsedPassengers,
        luggageQuantity: parsedLuggageQty,
        preferredDriverLanguage: preferredDriverLanguage.trim() || undefined,
        chauffeurWaitingTimeHours: parsedWaitingHours,
        routeNotes: routeNotes.trim() || undefined,
        vehiclePreference,
        requiredSeats: parsedSeats,
        requiredLuggageCapacity: parsedLuggageCapacity,
        premiumInterior,
        fastestCharging,
        budgetMin: parsedBudgetMin,
        budgetMax: parsedBudgetMax,
        addOns: normalizedAddOns,
        specialInstructions: specialInstructions.trim() || undefined,
        preferredVehicleModel: preferredVehicleModel.trim() || undefined,
        accessibilityNeeds: accessibilityNeeds.trim() || undefined,
        contactPreference,
        documents,
        pricing: estimate
      },
      priceEstimate: formatUgx(estimate.totalEstimated)
    });

    navigate("/rental/list", {
      state: {
        mode: driverOption === "chauffeur" ? "chauffeur" : "self",
        vehicleType: vehiclePreference,
        fromCustom: true,
        customFilters: {
          pickupLocationId,
          dropoffLocationId: resolvedReturnLocationId,
          requiredSeats: parsedSeats,
          requiredLuggageCapacity: parsedLuggageCapacity,
          budgetMin: parsedBudgetMin,
          budgetMax: parsedBudgetMax,
          driverOption
        }
      }
    });
  };

  const handleDocumentUpload = (
    kind: RentalUploadedDocument["kind"],
    file: File | null
  ): void => {
    if (!file) {
      if (kind === "drivers_license") {
        setDriverLicenseFile(null);
      } else {
        setIdDocumentFile(null);
      }
      return;
    }

    if (!isAllowedDocumentType(file)) {
      setErrors((previous) => ({
        ...previous,
        [kind]: "Only image or PDF files are allowed."
      }));
      return;
    }

    setErrors((previous) => {
      const next = { ...previous };
      delete next[kind];
      return next;
    });

    if (kind === "drivers_license") {
      setDriverLicenseFile(file);
      return;
    }
    setIdDocumentFile(file);
  };

  return (
    <ScreenScaffold>
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.2}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
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
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ ...uiTokens.text.sectionTitle, lineHeight: 1.25 }}>
                Custom EV rental
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  ...uiTokens.text.itemBody,
                  fontSize: 12,
                  color: (t) => t.palette.text.secondary,
                  display: "block",
                  mt: 0.3
                }}
              >
                Build your request, review your estimate, then continue to vehicle selection.
              </Typography>
            </Box>
          </Stack>
          <Box
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              borderRadius: uiTokens.radius.pill,
              px: 1,
              py: 0.45,
              bgcolor: "rgba(249,115,22,0.14)",
              border: "1px solid rgba(249,115,22,0.4)",
              color: ORANGE_ACCENT,
              alignItems: "center",
              gap: 0.5
            }}
          >
            <LocalOfferRoundedIcon sx={{ fontSize: 13 }} />
            <Typography variant="caption" sx={{ fontSize: 10.5, fontWeight: 700 }}>
              Custom builder
            </Typography>
          </Box>
        </Stack>
        <Box
          sx={{
            display: { xs: "inline-flex", sm: "none" },
            mt: 0.7,
            borderRadius: uiTokens.radius.pill,
            px: 1,
            py: 0.45,
            bgcolor: "rgba(249,115,22,0.14)",
            border: "1px solid rgba(249,115,22,0.4)",
            color: ORANGE_ACCENT,
            alignItems: "center",
            gap: 0.5
          }}
        >
          <LocalOfferRoundedIcon sx={{ fontSize: 13 }} />
          <Typography variant="caption" sx={{ fontSize: 10.5, fontWeight: 700 }}>
            Custom builder
          </Typography>
        </Box>
      </Box>

      <CustomRentalStepIndicator steps={CUSTOM_RENTAL_STEPS} activeStep={activeStep} />

      {Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ borderRadius: uiTokens.radius.lg }}>
          Please fix the highlighted fields before continuing.
        </Alert>
      )}

      <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl, border: uiTokens.borders.subtle }}>
        <CardContent sx={FORM_CONTENT_SX}>
          <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
            Step 1: Trip details
          </Typography>
          <Stack spacing={1}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <TextField
                id="pickupLocationId"
                label="Pickup location"
                size="small"
                select
                required
                value={pickupLocationId}
                onChange={(event) => setPickupLocationId(event.target.value)}
                error={Boolean(errors.pickupLocationId)}
                helperText={errors.pickupLocationId}
                inputRef={registerFieldRef("pickupLocationId")}
                fullWidth
              >
                {pickupLocations.map((location) => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.displayName} • {location.address}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="returnLocationId"
                label="Return location"
                size="small"
                select
                required
                value={differentDropoff ? returnLocationId : pickupLocationId}
                onChange={(event) => setReturnLocationId(event.target.value)}
                error={Boolean(errors.returnLocationId)}
                helperText={
                  errors.returnLocationId ??
                  (!differentDropoff ? "Matches pickup location." : "")
                }
                inputRef={registerFieldRef("returnLocationId")}
                disabled={!differentDropoff}
                fullWidth
              >
                {returnLocations.map((location) => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.displayName} • {location.address}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Switch
                checked={differentDropoff}
                onChange={(event) => setDifferentDropoff(event.target.checked)}
              />
              <Typography variant="caption" sx={{ fontSize: 11.5 }}>
                Return to a different location
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <TextField
                id="pickupDateTime"
                label="Pickup date & time"
                size="small"
                fullWidth
                required
                type="datetime-local"
                value={pickupDateTime}
                onChange={(event) => setPickupDateTime(event.target.value)}
                error={Boolean(errors.pickupDateTime)}
                helperText={errors.pickupDateTime}
                inputRef={registerFieldRef("pickupDateTime")}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                id="returnDateTime"
                label="Return date & time"
                size="small"
                fullWidth
                required
                type="datetime-local"
                value={returnDateTime}
                onChange={(event) => setReturnDateTime(event.target.value)}
                error={Boolean(errors.returnDateTime)}
                helperText={errors.returnDateTime}
                inputRef={registerFieldRef("returnDateTime")}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <TextField
                id="tripPurpose"
                label="Trip purpose"
                size="small"
                select
                required
                fullWidth
                value={tripPurpose}
                onChange={(event) => setTripPurpose(event.target.value as RentalTripPurpose)}
                inputRef={registerFieldRef("tripPurpose")}
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
        <CardContent sx={FORM_CONTENT_SX}>
          <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
            Step 2: Vehicle preference
          </Typography>
          <VehiclePreferenceSelector
            vehiclePreference={vehiclePreference}
            requiredSeats={requiredSeats}
            requiredLuggageCapacity={requiredLuggageCapacity}
            premiumInterior={premiumInterior}
            fastestCharging={fastestCharging}
            budgetMin={budgetMin}
            budgetMax={budgetMax}
            errors={{
              requiredSeats: errors.requiredSeats,
              requiredLuggageCapacity: errors.requiredLuggageCapacity,
              budgetMin: errors.budgetMin,
              budgetMax: errors.budgetMax
            }}
            onVehiclePreferenceChange={setVehiclePreference}
            onRequiredSeatsChange={(value) => setRequiredSeats(sanitizeIntegerString(value))}
            onRequiredLuggageChange={(value) =>
              setRequiredLuggageCapacity(sanitizeIntegerString(value))
            }
            onPremiumInteriorChange={setPremiumInterior}
            onFastestChargingChange={setFastestCharging}
            onBudgetMinChange={(value) => setBudgetMin(sanitizeIntegerString(value))}
            onBudgetMaxChange={(value) => setBudgetMax(sanitizeIntegerString(value))}
          />
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl, border: uiTokens.borders.subtle }}>
        <CardContent sx={FORM_CONTENT_SX}>
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
            errors={{
              passengerCount: errors.passengerCount,
              luggageQuantity: errors.luggageQuantity,
              chauffeurWaitingTimeHours: errors.chauffeurWaitingTimeHours
            }}
            onDriverOptionChange={setDriverOption}
            onAdditionalDriverChange={setAdditionalDriver}
            onPassengerCountChange={(value) => setPassengerCount(sanitizeIntegerString(value))}
            onLuggageQuantityChange={(value) => setLuggageQuantity(sanitizeIntegerString(value))}
            onPreferredDriverLanguageChange={setPreferredDriverLanguage}
            onChauffeurWaitingTimeHoursChange={(value) =>
              setChauffeurWaitingTimeHours(sanitizeIntegerString(value))
            }
            onRouteNotesChange={setRouteNotes}
          />

          {driverOption === "self_drive" && (
            <Stack spacing={1} sx={{ mt: 1.2 }}>
              <Divider />
              <Typography variant="caption" sx={{ fontSize: 11.5, fontWeight: 700 }}>
                Required verification documents
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 10.8, color: (t) => t.palette.text.secondary }}>
                Upload image or PDF files. These are mandatory for self-drive verification.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Box sx={{ flex: 1 }}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadFileRoundedIcon />}
                    sx={{ textTransform: "none", borderRadius: uiTokens.radius.lg }}
                    fullWidth
                  >
                    Upload driver&apos;s licence
                    <input
                      ref={driverLicenseInputRef}
                      hidden
                      type="file"
                      accept={ACCEPTED_DOCUMENT_TYPES}
                      onChange={(event) =>
                        handleDocumentUpload(
                          "drivers_license",
                          event.target.files?.[0] ?? null
                        )
                      }
                    />
                  </Button>
                  <Typography variant="caption" sx={{ mt: 0.35, display: "block", fontSize: 10.8 }}>
                    {renderUploadedFileLabel(driverLicenseFile)}
                  </Typography>
                  {driverLicenseFile && (
                    <Button
                      size="small"
                      startIcon={<DeleteOutlineRoundedIcon />}
                      onClick={() => setDriverLicenseFile(null)}
                      sx={{ mt: 0.2, textTransform: "none", fontSize: 11 }}
                    >
                      Remove
                    </Button>
                  )}
                  {errors.drivers_license && (
                    <Typography variant="caption" color="error" sx={{ display: "block", fontSize: 10.5 }}>
                      {errors.drivers_license}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadFileRoundedIcon />}
                    sx={{ textTransform: "none", borderRadius: uiTokens.radius.lg }}
                    fullWidth
                  >
                    Upload National ID / Passport
                    <input
                      ref={idDocumentInputRef}
                      hidden
                      type="file"
                      accept={ACCEPTED_DOCUMENT_TYPES}
                      onChange={(event) =>
                        handleDocumentUpload(
                          "id_or_passport",
                          event.target.files?.[0] ?? null
                        )
                      }
                    />
                  </Button>
                  <Typography variant="caption" sx={{ mt: 0.35, display: "block", fontSize: 10.8 }}>
                    {renderUploadedFileLabel(idDocumentFile)}
                  </Typography>
                  {idDocumentFile && (
                    <Button
                      size="small"
                      startIcon={<DeleteOutlineRoundedIcon />}
                      onClick={() => setIdDocumentFile(null)}
                      sx={{ mt: 0.2, textTransform: "none", fontSize: 11 }}
                    >
                      Remove
                    </Button>
                  )}
                  {errors.id_or_passport && (
                    <Typography variant="caption" color="error" sx={{ display: "block", fontSize: 10.5 }}>
                      {errors.id_or_passport}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Stack>
          )}
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl, border: uiTokens.borders.subtle }}>
        <CardContent sx={FORM_CONTENT_SX}>
          <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 700, mb: 0.3 }}>
            Step 4: Add-ons and amenities
          </Typography>
          <Typography variant="caption" sx={{ display: "block", fontSize: 10.8, color: (t) => t.palette.text.secondary, mb: 1 }}>
            Showing add-ons for {tripPurpose.replace(/_/g, " ")} trips.
          </Typography>
          <RentalAddOnsSelector
            addOns={visibleAddOns}
            onToggleAddOn={handleToggleAddOn}
            onQuantityChange={handleAddOnQuantityChange}
          />
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl, border: uiTokens.borders.subtle }}>
        <CardContent sx={FORM_CONTENT_SX}>
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

      <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl, border: uiTokens.borders.subtle }}>
        <CardContent sx={FORM_CONTENT_SX}>
          <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
            Final review
          </Typography>
          <Stack spacing={0.5}>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              Pickup: {selectedPickupLocation?.displayName ?? "Not selected"}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              Return: {selectedReturnLocation?.displayName ?? "Not selected"}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              Dates: {pickupDateTime || "Pending"} to {returnDateTime || "Pending"}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              Trip purpose: {tripPurpose.replace(/_/g, " ")}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              Vehicle: {vehiclePreference.replace(/_/g, " ")} • Seats {requiredSeats || "Not set"}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              Driver option: {driverOption === "chauffeur" ? "With chauffeur" : "Self-drive"}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              Selected add-ons:{" "}
              {addOns.filter((addOn) => addOn.selected).length > 0
                ? addOns
                    .filter((addOn) => addOn.selected)
                    .map((addOn) => `${addOn.name} x${Math.max(1, addOn.quantity)}`)
                    .join(", ")
                : "None"}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontSize: 15, fontWeight: 700, mt: 0.5 }}>
              Estimated total: {formatUgx(estimate.totalEstimated)}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

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
    </ScreenScaffold>
  );
}
