import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import { useAppData } from "../contexts/AppDataContext";
import { getLocationById } from "../features/rental/locations";
import { parseUgx } from "../features/rental/booking";
import type {
  RentalAddOnSelection,
  RentalModeOption,
  RentalVehicle,
  RentalVehiclePreferenceType
} from "../store/types";

type RentalListFilter =
  | "all"
  | "self"
  | "chauffeur"
  | "suv"
  | "sedan"
  | "compact"
  | "luxury";

interface RentalListLocationState {
  mode?: string;
  vehicleType?: RentalVehiclePreferenceType;
  fromCustom?: boolean;
  customFilters?: {
    pickupLocationId?: string;
    dropoffLocationId?: string;
    minimumRangeKm?: number;
    maximumRangeKm?: number;
    requiredSeats?: number;
    requiredLuggageCapacity?: number;
    budgetMin?: number;
    budgetMax?: number;
    driverOption?: RentalModeOption;
  };
}

interface RentalVehicleCardProps {
  vehicle: RentalVehicle;
  onSelect: (id: string) => void;
}

interface CustomFilterState {
  pickupLocationId: string;
  dropoffLocationId: string;
  minimumRangeKm: string;
  maximumRangeKm: string;
  requiredSeats: string;
  requiredLuggageCapacity: string;
  budgetMin: string;
  budgetMax: string;
  driverOption: RentalModeOption | "any";
  vehiclePreference: RentalVehiclePreferenceType | "any";
}

function parseRangeKm(rangeValue: string): number {
  const numeric = Number(rangeValue.replace(/[^\d]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function parseIsoDate(value?: string): Date | null {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) {
    return null;
  }
  return date;
}

function dateRangesOverlap(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date
): boolean {
  return startA < endB && startB < endA;
}

function getVehicleModes(vehicle: RentalVehicle): RentalModeOption[] {
  if (vehicle.supportedModes && vehicle.supportedModes.length > 0) {
    return vehicle.supportedModes;
  }
  if (vehicle.mode.toLowerCase().includes("chauffeur")) {
    return ["chauffeur"];
  }
  return ["self_drive"];
}

function isLuxuryVehicle(vehicle: RentalVehicle): boolean {
  const tag = (vehicle.tag ?? "").toLowerCase();
  const type = vehicle.type.toLowerCase();
  return tag.includes("premium") || tag.includes("luxury") || type.includes("luxury");
}

function mapVehiclePreferenceToFilter(
  vehicleType?: RentalVehiclePreferenceType
): RentalListFilter | null {
  switch (vehicleType) {
    case "suv":
      return "suv";
    case "sedan":
      return "sedan";
    case "compact_ev":
      return "compact";
    case "luxury_ev":
      return "luxury";
    default:
      return null;
  }
}

function mapModeToFilter(mode?: string): RentalListFilter | null {
  if (mode === "self") {
    return "self";
  }
  if (mode === "chauffeur") {
    return "chauffeur";
  }
  if (mode === "suv") {
    return "suv";
  }
  if (mode === "sedan") {
    return "sedan";
  }
  return null;
}

function matchesChipFilter(vehicle: RentalVehicle, filter: RentalListFilter): boolean {
  const modeLower = vehicle.mode.toLowerCase();
  const typeLower = vehicle.type.toLowerCase();
  const tagLower = (vehicle.tag ?? "").toLowerCase();

  switch (filter) {
    case "self":
      return modeLower.includes("self");
    case "chauffeur":
      return modeLower.includes("chauffeur");
    case "suv":
      return typeLower.includes("suv");
    case "sedan":
      return typeLower.includes("sedan");
    case "compact":
      return typeLower.includes("hatchback") || typeLower.includes("compact");
    case "luxury":
      return tagLower.includes("premium") || tagLower.includes("luxury");
    case "all":
    default:
      return true;
  }
}

function matchesVehiclePreference(
  vehicle: RentalVehicle,
  vehiclePreference: RentalVehiclePreferenceType | "any"
): boolean {
  if (vehiclePreference === "any") {
    return true;
  }
  if (vehiclePreference === "compact_ev") {
    return vehicle.type.toLowerCase().includes("hatchback");
  }
  if (vehiclePreference === "luxury_ev") {
    return isLuxuryVehicle(vehicle);
  }
  if (vehiclePreference === "van") {
    return vehicle.type.toLowerCase().includes("van");
  }
  return vehicle.type.toLowerCase().includes(vehiclePreference.replace("_ev", ""));
}

function vehicleSupportsSelectedAddOns(
  vehicle: RentalVehicle,
  addOns: RentalAddOnSelection[]
): boolean {
  const selectedAddOns = addOns.filter((addOn) => addOn.selected);
  if (selectedAddOns.length === 0) {
    return true;
  }

  const modes = getVehicleModes(vehicle);
  const requiresChauffeur = selectedAddOns.some((addOn) =>
    ["vip_chauffeur", "chauffeur_waiting", "security_escort"].includes(addOn.id)
  );
  if (requiresChauffeur && !modes.includes("chauffeur")) {
    return false;
  }

  const requiresLuxury = selectedAddOns.some((addOn) =>
    ["luxury_interior", "event_decor"].includes(addOn.id)
  );
  if (requiresLuxury && !isLuxuryVehicle(vehicle)) {
    return false;
  }

  return true;
}

function vehicleMatchesDateAvailability(
  vehicleId: string,
  startDate: string | undefined,
  endDate: string | undefined,
  bookings: ReturnType<typeof useAppData>["rental"]["bookings"]
): boolean {
  const start = parseIsoDate(startDate);
  const end = parseIsoDate(endDate);
  if (!start || !end || end <= start) {
    return true;
  }

  const confirmedBookings = bookings.filter(
    (booking) =>
      booking.status === "confirmed" &&
      booking.vehicleId === vehicleId &&
      booking.startDate &&
      booking.endDate
  );

  return !confirmedBookings.some((booking) => {
    const bookedStart = parseIsoDate(booking.startDate);
    const bookedEnd = parseIsoDate(booking.endDate);
    if (!bookedStart || !bookedEnd || bookedEnd <= bookedStart) {
      return false;
    }
    return dateRangesOverlap(start, end, bookedStart, bookedEnd);
  });
}

function RentalVehicleCard({ vehicle, onSelect }: RentalVehicleCardProps): React.JSX.Element {
  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.75,
        borderRadius: 2,
        bgcolor: (t) =>
          t.palette.mode === "light"
            ? "linear-gradient(135deg,#FFFFFF,#F9FAFB)"
            : "linear-gradient(135deg,#020617,#020617)",
        border: (t) =>
          t.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)"
      }}
    >
      <CardContent sx={{ px: 1.75, py: 1.6 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <Box
            sx={{
              width: 64,
              height: 40,
              borderRadius: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#E0F2FE" : "rgba(15,23,42,0.9)"
            }}
          >
            <ElectricCarRoundedIcon sx={{ fontSize: 28, color: "primary.main" }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
                  {vehicle.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  {vehicle.type} • {vehicle.mode}
                </Typography>
              </Box>
              {vehicle.tag && (
                <Chip
                  label={vehicle.tag}
                  size="small"
                  sx={{
                    borderRadius: 5,
                    fontSize: 10,
                    height: 20,
                    bgcolor: "rgba(34,197,94,0.12)",
                    color: "#16A34A"
                  }}
                />
              )}
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <PeopleAltRoundedIcon sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }} />
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  {vehicle.seats} seats
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <BatteryChargingFullRoundedIcon
                  sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  {vehicle.range}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
            {vehicle.dailyPrice}{" "}
            <Typography component="span" variant="caption" sx={{ fontSize: 11 }}>
              / day
            </Typography>
          </Typography>
          <Button
            size="small"
            variant="contained"
            onClick={() => onSelect(vehicle.id)}
            sx={{
              borderRadius: 5,
              px: 2,
              py: 0.5,
              fontSize: 12,
              textTransform: "none",
              bgcolor: "primary.main",
              color: "#020617",
              "&:hover": { bgcolor: "#06e29a" }
            }}
          >
            Select
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function RentalVehicleListScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { rental, actions } = useAppData();

  const locationState = (location.state as RentalListLocationState | null) ?? null;
  const customRequest = rental.booking.customRequest;
  const hasCustomRequest = Boolean(customRequest);

  const initialFilter = useMemo(() => {
    const byMode = mapModeToFilter(locationState?.mode);
    if (byMode) {
      return byMode;
    }
    const byVehicleType = mapVehiclePreferenceToFilter(locationState?.vehicleType);
    if (byVehicleType) {
      return byVehicleType;
    }
    if (customRequest?.driverOption === "chauffeur") {
      return "chauffeur";
    }
    if (customRequest?.driverOption === "self_drive") {
      return "self";
    }
    return "all";
  }, [customRequest?.driverOption, locationState?.mode, locationState?.vehicleType]);

  const [filter, setFilter] = useState<RentalListFilter>(initialFilter);
  const [showFilterEditor, setShowFilterEditor] = useState(false);
  const [useCustomFilters, setUseCustomFilters] = useState(
    Boolean(locationState?.fromCustom && hasCustomRequest)
  );

  const [customFilters, setCustomFilters] = useState<CustomFilterState>({
    pickupLocationId:
      locationState?.customFilters?.pickupLocationId ?? customRequest?.pickupLocationId ?? "",
    dropoffLocationId:
      locationState?.customFilters?.dropoffLocationId ??
      customRequest?.dropoffLocationId ??
      "",
    minimumRangeKm: String(
      locationState?.customFilters?.minimumRangeKm ??
        customRequest?.minimumRangeKm ??
        ""
    ),
    maximumRangeKm: String(
      locationState?.customFilters?.maximumRangeKm ??
        customRequest?.maximumRangeKm ??
        ""
    ),
    requiredSeats: String(
      locationState?.customFilters?.requiredSeats ??
        customRequest?.requiredSeats ??
        ""
    ),
    requiredLuggageCapacity: String(
      locationState?.customFilters?.requiredLuggageCapacity ??
        customRequest?.requiredLuggageCapacity ??
        ""
    ),
    budgetMin: String(
      locationState?.customFilters?.budgetMin ?? customRequest?.budgetMin ?? ""
    ),
    budgetMax: String(
      locationState?.customFilters?.budgetMax ?? customRequest?.budgetMax ?? ""
    ),
    driverOption:
      locationState?.customFilters?.driverOption ??
      customRequest?.driverOption ??
      "any",
    vehiclePreference: customRequest?.vehiclePreference ?? "any"
  });

  const selectedAddOns = customRequest?.addOns ?? [];

  const filteredVehicles = useMemo(() => {
    const minRange = Number(customFilters.minimumRangeKm) || 0;
    const maxRange = Number(customFilters.maximumRangeKm) || 0;
    const minSeats = Number(customFilters.requiredSeats) || 0;
    const minLuggage = Number(customFilters.requiredLuggageCapacity) || 0;
    const minBudget = Number(customFilters.budgetMin) || 0;
    const maxBudget = Number(customFilters.budgetMax) || 0;
    const pickupLocationId = customFilters.pickupLocationId;
    const dropoffLocationId = customFilters.dropoffLocationId;

    return rental.vehicles.filter((vehicle) => {
      if (!matchesChipFilter(vehicle, filter)) {
        return false;
      }

      if (!useCustomFilters) {
        return true;
      }

      if (vehicle.available === false) {
        return false;
      }

      const rangeKm = parseRangeKm(vehicle.range);
      if (rangeKm < minRange) {
        return false;
      }
      if (maxRange > 0 && rangeKm > maxRange) {
        return false;
      }

      if (minSeats > 0 && vehicle.seats < minSeats) {
        return false;
      }

      if (minLuggage > 0 && vehicle.luggageCapacity < minLuggage) {
        return false;
      }

      const dailyRate = parseUgx(vehicle.dailyPrice);
      if (minBudget > 0 && dailyRate < minBudget) {
        return false;
      }
      if (maxBudget > 0 && dailyRate > maxBudget) {
        return false;
      }

      if (!matchesVehiclePreference(vehicle, customFilters.vehiclePreference)) {
        return false;
      }

      if (customFilters.driverOption !== "any") {
        const vehicleModes = getVehicleModes(vehicle);
        if (!vehicleModes.includes(customFilters.driverOption)) {
          return false;
        }
      }

      if (pickupLocationId || dropoffLocationId) {
        const locationIds = vehicle.availableLocationIds ?? [];
        if (pickupLocationId && !locationIds.includes(pickupLocationId)) {
          return false;
        }
        if (dropoffLocationId && !locationIds.includes(dropoffLocationId)) {
          return false;
        }
      }

      if (
        !vehicleMatchesDateAvailability(
          vehicle.id,
          rental.booking.startDate,
          rental.booking.endDate,
          rental.bookings
        )
      ) {
        return false;
      }

      if (!vehicleSupportsSelectedAddOns(vehicle, selectedAddOns)) {
        return false;
      }

      return true;
    });
  }, [
    customFilters,
    filter,
    rental.booking.endDate,
    rental.booking.startDate,
    rental.bookings,
    rental.vehicles,
    selectedAddOns,
    useCustomFilters
  ]);

  const handleSelectVehicle = (id: string): void => {
    actions.selectRentalVehicle(id);
    navigate(`/rental/vehicle/${id}`);
  };

  const clearCustomFilters = (): void => {
    setUseCustomFilters(false);
    setFilter("all");
  };

  const noMatchingVehicles = filteredVehicles.length === 0;
  const pickupLabel = customFilters.pickupLocationId
    ? getLocationById(customFilters.pickupLocationId)?.displayName
    : undefined;
  const dropoffLabel = customFilters.dropoffLocationId
    ? getLocationById(customFilters.dropoffLocationId)?.displayName
    : undefined;

  return (
    <ScreenScaffold>
      <SectionHeader
        title="Available EVs"
        subtitle={
          useCustomFilters
            ? "Showing EVs that match your custom rental request"
            : "Choose an EV that matches your trip"
        }
        leadingAction={
          <IconButton
            size="small"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 5,
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
        }
      />

      {useCustomFilters && (
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid rgba(249,115,22,0.4)",
            bgcolor: "rgba(249,115,22,0.08)"
          }}
        >
          <CardContent sx={{ px: 1.5, py: 1.2 }}>
            <Typography variant="body2" sx={{ fontSize: 12.5, fontWeight: 700, color: "#C2410C" }}>
              Showing EVs that match your custom rental request
            </Typography>
            <Stack direction="row" spacing={0.6} sx={{ flexWrap: "wrap", mt: 0.6 }}>
              {pickupLabel && <Chip size="small" label={`Pickup: ${pickupLabel}`} sx={{ fontSize: 10.5 }} />}
              {dropoffLabel && <Chip size="small" label={`Return: ${dropoffLabel}`} sx={{ fontSize: 10.5 }} />}
              {customFilters.minimumRangeKm && (
                <Chip size="small" label={`Range >= ${customFilters.minimumRangeKm} km`} sx={{ fontSize: 10.5 }} />
              )}
              {customFilters.maximumRangeKm && (
                <Chip size="small" label={`Range <= ${customFilters.maximumRangeKm} km`} sx={{ fontSize: 10.5 }} />
              )}
              {customFilters.requiredSeats && (
                <Chip size="small" label={`Seats >= ${customFilters.requiredSeats}`} sx={{ fontSize: 10.5 }} />
              )}
              {customFilters.budgetMax && (
                <Chip size="small" label={`Budget <= UGX ${Number(customFilters.budgetMax).toLocaleString()}`} sx={{ fontSize: 10.5 }} />
              )}
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={0.8} sx={{ mt: 0.9 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setShowFilterEditor((previous) => !previous)}
                sx={{ textTransform: "none" }}
              >
                {showFilterEditor ? "Hide filter editor" : "Modify filters"}
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={clearCustomFilters}
                sx={{ textTransform: "none" }}
              >
                Clear custom filters
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {useCustomFilters && showFilterEditor && (
        <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid rgba(209,213,219,0.9)" }}>
          <CardContent sx={{ px: 1.5, py: 1.2 }}>
            <Typography variant="caption" sx={{ display: "block", mb: 0.8, fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Adjust custom filters
            </Typography>
            <Stack spacing={1}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <TextField
                  size="small"
                  label="Minimum range (km)"
                  type="number"
                  value={customFilters.minimumRangeKm}
                  inputProps={{ min: 0, step: 1 }}
                  onChange={(event) =>
                    setCustomFilters((previous) => ({
                      ...previous,
                      minimumRangeKm: event.target.value.replace(/[^\d]/g, "")
                    }))
                  }
                  fullWidth
                />
                <TextField
                  size="small"
                  label="Maximum range (km)"
                  type="number"
                  value={customFilters.maximumRangeKm}
                  inputProps={{ min: 0, step: 1 }}
                  onChange={(event) =>
                    setCustomFilters((previous) => ({
                      ...previous,
                      maximumRangeKm: event.target.value.replace(/[^\d]/g, "")
                    }))
                  }
                  fullWidth
                />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <TextField
                  size="small"
                  label="Seats"
                  type="number"
                  value={customFilters.requiredSeats}
                  inputProps={{ min: 1, step: 1 }}
                  onChange={(event) =>
                    setCustomFilters((previous) => ({
                      ...previous,
                      requiredSeats: event.target.value.replace(/[^\d]/g, "")
                    }))
                  }
                  fullWidth
                />
                <TextField
                  size="small"
                  label="Luggage capacity"
                  type="number"
                  value={customFilters.requiredLuggageCapacity}
                  inputProps={{ min: 0, step: 1 }}
                  onChange={(event) =>
                    setCustomFilters((previous) => ({
                      ...previous,
                      requiredLuggageCapacity: event.target.value.replace(/[^\d]/g, "")
                    }))
                  }
                  fullWidth
                />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <TextField
                  size="small"
                  label="Budget min (UGX)"
                  type="number"
                  value={customFilters.budgetMin}
                  inputProps={{ min: 0, step: 1000 }}
                  onChange={(event) =>
                    setCustomFilters((previous) => ({
                      ...previous,
                      budgetMin: event.target.value.replace(/[^\d]/g, "")
                    }))
                  }
                  fullWidth
                />
                <TextField
                  size="small"
                  label="Budget max (UGX)"
                  type="number"
                  value={customFilters.budgetMax}
                  inputProps={{ min: 0, step: 1000 }}
                  onChange={(event) =>
                    setCustomFilters((previous) => ({
                      ...previous,
                      budgetMax: event.target.value.replace(/[^\d]/g, "")
                    }))
                  }
                  fullWidth
                />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <TextField
                  size="small"
                  label="Rental mode"
                  select
                  value={customFilters.driverOption}
                  onChange={(event) =>
                    setCustomFilters((previous) => ({
                      ...previous,
                      driverOption: event.target.value as CustomFilterState["driverOption"]
                    }))
                  }
                  fullWidth
                >
                  <MenuItem value="any">Any mode</MenuItem>
                  <MenuItem value="self_drive">Self-drive</MenuItem>
                  <MenuItem value="chauffeur">With chauffeur</MenuItem>
                </TextField>
                <TextField
                  size="small"
                  label="Vehicle type"
                  select
                  value={customFilters.vehiclePreference}
                  onChange={(event) =>
                    setCustomFilters((previous) => ({
                      ...previous,
                      vehiclePreference: event.target.value as CustomFilterState["vehiclePreference"]
                    }))
                  }
                  fullWidth
                >
                  <MenuItem value="any">Any vehicle</MenuItem>
                  <MenuItem value="compact_ev">Compact EV</MenuItem>
                  <MenuItem value="sedan">Sedan</MenuItem>
                  <MenuItem value="suv">SUV</MenuItem>
                  <MenuItem value="van">Van / Group transport</MenuItem>
                  <MenuItem value="luxury_ev">Luxury EV</MenuItem>
                </TextField>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
        {[
          { key: "all" as const, label: "All" },
          { key: "self" as const, label: "Self-drive" },
          { key: "chauffeur" as const, label: "With chauffeur" },
          { key: "suv" as const, label: "SUV" },
          { key: "sedan" as const, label: "Sedan" },
          { key: "compact" as const, label: "Compact" },
          { key: "luxury" as const, label: "Luxury" }
        ].map((item) => (
          <Chip
            key={item.key}
            label={item.label}
            onClick={() => setFilter(item.key)}
            size="small"
            sx={{
              borderRadius: 5,
              fontSize: 11,
              height: 26,
              bgcolor:
                filter === item.key
                  ? "primary.main"
                  : (t) =>
                      t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)",
              color: filter === item.key ? "#020617" : (t) => t.palette.text.primary
            }}
          />
        ))}
      </Stack>

      {noMatchingVehicles ? (
        <Card elevation={0} sx={{ borderRadius: 3, border: "1px dashed rgba(148,163,184,0.7)" }}>
          <CardContent sx={{ px: 1.5, py: 1.4 }}>
            <Alert severity="info" sx={{ mb: 1.1 }}>
              No EVs match your custom request
            </Alert>
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Adjust your filters, browse all EVs, or send your custom request to support.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={0.8} sx={{ mt: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowFilterEditor(true)}
                sx={{ textTransform: "none" }}
              >
                Adjust filters
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setUseCustomFilters(false);
                  setFilter("all");
                }}
                sx={{ textTransform: "none" }}
              >
                Browse all EVs
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate("/help")}
                sx={{ textTransform: "none" }}
              >
                Submit custom request
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        filteredVehicles.map((vehicle) => (
          <RentalVehicleCard key={vehicle.id} vehicle={vehicle} onSelect={handleSelectVehicle} />
        ))
      )}
    </ScreenScaffold>
  );
}

export default function RentalList(): React.JSX.Element {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (t) => t.palette.background.default
      }}
    >
      <RentalVehicleListScreen />
    </Box>
  );
}
