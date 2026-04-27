import React from "react";
import {
  Alert,
  Box,
  Chip,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography
} from "@mui/material";
import type { RentalModeOption } from "../../store/types";
import { RENTAL_DRIVER_LANGUAGE_OPTIONS } from "../../features/rental/custom";
import { uiTokens } from "../../design/tokens";

function blockInvalidNumberKey(event: React.KeyboardEvent<HTMLInputElement>): void {
  if (["-", "+", "e", "E"].includes(event.key)) {
    event.preventDefault();
  }
}

interface DriverOptionSelectorProps {
  driverOption: RentalModeOption;
  additionalDriver: boolean;
  passengerCount: string;
  luggageQuantity: string;
  preferredDriverLanguage: string;
  chauffeurWaitingTimeHours: string;
  routeNotes: string;
  errors?: Partial<Record<"passengerCount" | "luggageQuantity" | "chauffeurWaitingTimeHours", string>>;
  onDriverOptionChange: (value: RentalModeOption) => void;
  onAdditionalDriverChange: (value: boolean) => void;
  onPassengerCountChange: (value: string) => void;
  onLuggageQuantityChange: (value: string) => void;
  onPreferredDriverLanguageChange: (value: string) => void;
  onChauffeurWaitingTimeHoursChange: (value: string) => void;
  onRouteNotesChange: (value: string) => void;
}

export default function DriverOptionSelector({
  driverOption,
  additionalDriver,
  passengerCount,
  luggageQuantity,
  preferredDriverLanguage,
  chauffeurWaitingTimeHours,
  routeNotes,
  errors,
  onDriverOptionChange,
  onAdditionalDriverChange,
  onPassengerCountChange,
  onLuggageQuantityChange,
  onPreferredDriverLanguageChange,
  onChauffeurWaitingTimeHoursChange,
  onRouteNotesChange
}: DriverOptionSelectorProps): React.JSX.Element {
  return (
    <Stack spacing={1.2}>
      <Stack direction="row" spacing={0.8}>
        <Chip
          label="Self-drive"
          onClick={() => onDriverOptionChange("self_drive")}
          sx={{
            borderRadius: uiTokens.radius.pill,
            fontSize: 12,
            height: 28,
            bgcolor: driverOption === "self_drive" ? "primary.main" : "transparent",
            border: "1px solid rgba(209,213,219,0.9)",
            color: driverOption === "self_drive" ? "#022C22" : "text.primary"
          }}
        />
        <Chip
          label="Chauffeur included"
          onClick={() => onDriverOptionChange("chauffeur")}
          sx={{
            borderRadius: uiTokens.radius.pill,
            fontSize: 12,
            height: 28,
            bgcolor: driverOption === "chauffeur" ? "primary.main" : "transparent",
            border: "1px solid rgba(209,213,219,0.9)",
            color: driverOption === "chauffeur" ? "#022C22" : "text.primary"
          }}
        />
      </Stack>

      {driverOption === "self_drive" ? (
        <Stack spacing={1}>
          <Alert severity="info" sx={{ borderRadius: uiTokens.radius.lg }}>
            Valid driver&apos;s licence and National ID or Passport are required for self-drive verification.
          </Alert>
          <FormControlLabel
            control={
              <Switch
                checked={additionalDriver}
                onChange={(event) => onAdditionalDriverChange(event.target.checked)}
              />
            }
            label={
              <Typography variant="caption" sx={{ fontSize: 11.5 }}>
                Add an additional verified driver
              </Typography>
            }
          />
        </Stack>
      ) : (
        <Stack spacing={1}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField
              id="passengerCount"
              label="Passengers"
              size="small"
              type="number"
              required
              value={passengerCount}
              onChange={(event) => onPassengerCountChange(event.target.value)}
              error={Boolean(errors?.passengerCount)}
              helperText={errors?.passengerCount}
              inputProps={{ min: 1, step: 1 }}
              onKeyDown={blockInvalidNumberKey}
              fullWidth
            />
            <TextField
              id="luggageQuantity"
              label="Luggage quantity"
              size="small"
              type="number"
              required
              value={luggageQuantity}
              onChange={(event) => onLuggageQuantityChange(event.target.value)}
              error={Boolean(errors?.luggageQuantity)}
              helperText={errors?.luggageQuantity}
              inputProps={{ min: 0, step: 1 }}
              onKeyDown={blockInvalidNumberKey}
              fullWidth
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField
              label="Preferred driver language"
              size="small"
              select
              value={preferredDriverLanguage}
              onChange={(event) => onPreferredDriverLanguageChange(event.target.value)}
              fullWidth
            >
              {RENTAL_DRIVER_LANGUAGE_OPTIONS.map((language) => (
                <MenuItem key={language} value={language}>
                  {language}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="chauffeurWaitingTimeHours"
              label="Chauffeur waiting (hours)"
              size="small"
              type="number"
              value={chauffeurWaitingTimeHours}
              onChange={(event) => onChauffeurWaitingTimeHoursChange(event.target.value)}
              error={Boolean(errors?.chauffeurWaitingTimeHours)}
              helperText={errors?.chauffeurWaitingTimeHours}
              inputProps={{ min: 0, step: 1 }}
              onKeyDown={blockInvalidNumberKey}
              fullWidth
            />
          </Stack>
          <TextField
            label="Route notes / special instructions"
            size="small"
            value={routeNotes}
            onChange={(event) => onRouteNotesChange(event.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
        </Stack>
      )}
    </Stack>
  );
}
