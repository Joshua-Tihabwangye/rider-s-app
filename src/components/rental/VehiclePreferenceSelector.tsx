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

interface VehiclePreferenceSelectorProps {
  vehiclePreference: RentalVehiclePreferenceType;
  minimumRangeKm: string;
  requiredSeats: string;
  requiredLuggageCapacity: string;
  premiumInterior: boolean;
  fastestCharging: boolean;
  budgetMin: string;
  budgetMax: string;
  onVehiclePreferenceChange: (value: RentalVehiclePreferenceType) => void;
  onMinimumRangeChange: (value: string) => void;
  onRequiredSeatsChange: (value: string) => void;
  onRequiredLuggageChange: (value: string) => void;
  onPremiumInteriorChange: (value: boolean) => void;
  onFastestChargingChange: (value: boolean) => void;
  onBudgetMinChange: (value: string) => void;
  onBudgetMaxChange: (value: string) => void;
}

export default function VehiclePreferenceSelector({
  vehiclePreference,
  minimumRangeKm,
  requiredSeats,
  requiredLuggageCapacity,
  premiumInterior,
  fastestCharging,
  budgetMin,
  budgetMax,
  onVehiclePreferenceChange,
  onMinimumRangeChange,
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
          label="Minimum range (km)"
          size="small"
          type="number"
          value={minimumRangeKm}
          onChange={(event) => onMinimumRangeChange(event.target.value)}
          fullWidth
        />
        <TextField
          label="Seats"
          size="small"
          type="number"
          value={requiredSeats}
          onChange={(event) => onRequiredSeatsChange(event.target.value)}
          fullWidth
        />
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <TextField
          label="Luggage capacity"
          size="small"
          type="number"
          value={requiredLuggageCapacity}
          onChange={(event) => onRequiredLuggageChange(event.target.value)}
          fullWidth
        />
        <TextField
          label="Budget min (UGX)"
          size="small"
          type="number"
          value={budgetMin}
          onChange={(event) => onBudgetMinChange(event.target.value)}
          fullWidth
        />
        <TextField
          label="Budget max (UGX)"
          size="small"
          type="number"
          value={budgetMax}
          onChange={(event) => onBudgetMaxChange(event.target.value)}
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
