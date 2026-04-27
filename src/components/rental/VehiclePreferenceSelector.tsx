import React from "react";
import {
  Box,
  Chip,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography
} from "@mui/material";
import type { RentalVehiclePreferenceType } from "../../store/types";
import { RENTAL_VEHICLE_PREFERENCE_OPTIONS } from "../../features/rental/custom";
import { uiTokens } from "../../design/tokens";

function blockInvalidNumberKey(event: React.KeyboardEvent<HTMLInputElement>): void {
  if (["-", "+", "e", "E"].includes(event.key)) {
    event.preventDefault();
  }
}

interface VehiclePreferenceSelectorProps {
  vehiclePreference: RentalVehiclePreferenceType;
  requiredSeats: string;
  requiredLuggageCapacity: string;
  premiumInterior: boolean;
  fastestCharging: boolean;
  budgetMin: string;
  budgetMax: string;
  errors?: Partial<Record<
    | "requiredSeats"
    | "requiredLuggageCapacity"
    | "budgetMin"
    | "budgetMax",
    string
  >>;
  onVehiclePreferenceChange: (value: RentalVehiclePreferenceType) => void;
  onRequiredSeatsChange: (value: string) => void;
  onRequiredLuggageChange: (value: string) => void;
  onPremiumInteriorChange: (value: boolean) => void;
  onFastestChargingChange: (value: boolean) => void;
  onBudgetMinChange: (value: string) => void;
  onBudgetMaxChange: (value: string) => void;
}

export default function VehiclePreferenceSelector({
  vehiclePreference,
  requiredSeats,
  requiredLuggageCapacity,
  premiumInterior,
  fastestCharging,
  budgetMin,
  budgetMax,
  errors,
  onVehiclePreferenceChange,
  onRequiredSeatsChange,
  onRequiredLuggageChange,
  onPremiumInteriorChange,
  onFastestChargingChange,
  onBudgetMinChange,
  onBudgetMaxChange
}: VehiclePreferenceSelectorProps): React.JSX.Element {
  return (
    <Stack spacing={1.2}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
        {RENTAL_VEHICLE_PREFERENCE_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            onClick={() => onVehiclePreferenceChange(option.value)}
            size="small"
            sx={{
              borderRadius: uiTokens.radius.pill,
              height: 27,
              fontSize: 11,
              bgcolor:
                vehiclePreference === option.value
                  ? "primary.main"
                  : (t) =>
                      t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)",
              color:
                vehiclePreference === option.value
                  ? "#022C22"
                  : (t) => t.palette.text.primary
            }}
          />
        ))}
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <TextField
          id="requiredSeats"
          label="Seats"
          size="small"
          type="number"
          required
          value={requiredSeats}
          onChange={(event) => onRequiredSeatsChange(event.target.value)}
          error={Boolean(errors?.requiredSeats)}
          helperText={errors?.requiredSeats}
          inputProps={{ min: 1, step: 1 }}
          onKeyDown={blockInvalidNumberKey}
          fullWidth
        />
        <TextField
          id="requiredLuggageCapacity"
          label="Luggage capacity"
          size="small"
          type="number"
          value={requiredLuggageCapacity}
          onChange={(event) => onRequiredLuggageChange(event.target.value)}
          error={Boolean(errors?.requiredLuggageCapacity)}
          helperText={errors?.requiredLuggageCapacity}
          inputProps={{ min: 0, step: 1 }}
          onKeyDown={blockInvalidNumberKey}
          fullWidth
        />
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <TextField
          id="budgetMin"
          label="Budget min (UGX)"
          size="small"
          type="number"
          value={budgetMin}
          onChange={(event) => onBudgetMinChange(event.target.value)}
          error={Boolean(errors?.budgetMin)}
          helperText={errors?.budgetMin}
          inputProps={{ min: 0, step: 1000 }}
          onKeyDown={blockInvalidNumberKey}
          fullWidth
        />
        <TextField
          id="budgetMax"
          label="Budget max (UGX)"
          size="small"
          type="number"
          value={budgetMax}
          onChange={(event) => onBudgetMaxChange(event.target.value)}
          error={Boolean(errors?.budgetMax)}
          helperText={errors?.budgetMax}
          inputProps={{ min: 0, step: 1000 }}
          onKeyDown={blockInvalidNumberKey}
          fullWidth
        />
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <FormControlLabel
          control={
            <Switch
              checked={premiumInterior}
              onChange={(event) => onPremiumInteriorChange(event.target.checked)}
            />
          }
          label={
            <Typography variant="caption" sx={{ fontSize: 11.5 }}>
              Premium interior
            </Typography>
          }
        />
        <FormControlLabel
          control={
            <Switch
              checked={fastestCharging}
              onChange={(event) => onFastestChargingChange(event.target.checked)}
            />
          }
          label={
            <Typography variant="caption" sx={{ fontSize: 11.5 }}>
              Fastest charging
            </Typography>
          }
        />
      </Stack>
    </Stack>
  );
}
