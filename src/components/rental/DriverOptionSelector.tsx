import React from "react";
import {
  Alert,
  Box,
  Chip,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography
} from "@mui/material";
import type { RentalModeOption } from "../../store/types";
import { RENTAL_DRIVER_LANGUAGE_OPTIONS } from "../../features/rental/custom";
import { uiTokens } from "../../design/tokens";

interface DriverOptionSelectorProps {
  driverOption: RentalModeOption;
  additionalDriver: boolean;
  passengerCount: string;
  luggageQuantity: string;
  preferredDriverLanguage: string;
  chauffeurWaitingTimeHours: string;
  routeNotes: string;
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
            Valid driver&apos;s license and ID verification are required for self-drive rentals.
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
              label="Passengers"
              size="small"
              type="number"
              value={passengerCount}
              onChange={(event) => onPassengerCountChange(event.target.value)}
              fullWidth
            />
            <TextField
              label="Luggage quantity"
              size="small"
              type="number"
              value={luggageQuantity}
              onChange={(event) => onLuggageQuantityChange(event.target.value)}
              fullWidth
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField
              label="Preferred driver language"
              size="small"
              value={preferredDriverLanguage}
              onChange={(event) => onPreferredDriverLanguageChange(event.target.value)}
              fullWidth
              helperText={`Suggested: ${RENTAL_DRIVER_LANGUAGE_OPTIONS.join(", ")}`}
            />
            <TextField
              label="Chauffeur waiting (hours)"
              size="small"
              type="number"
              value={chauffeurWaitingTimeHours}
              onChange={(event) =>
                onChauffeurWaitingTimeHoursChange(event.target.value)
              }
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
