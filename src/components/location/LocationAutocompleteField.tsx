import React, { useMemo } from "react";
import {
  Autocomplete,
  CircularProgress,
  InputAdornment,
  TextField,
  type SxProps,
  type TextFieldProps,
  type Theme
} from "@mui/material";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useLocationAutocomplete } from "../../hooks/useLocationAutocomplete";
import type { Coordinates, PlaceSuggestion } from "../../services/maps";

export interface LocationSelection {
  label: string;
  address: string;
  coordinates: Coordinates;
  placeId?: string;
}

interface LocationAutocompleteFieldProps {
  value: string;
  onValueChange: (value: string) => void;
  onSelectLocation: (selection: LocationSelection) => void;
  placeholder?: string;
  label?: string;
  nearbyCoordinates?: Coordinates | null;
  minQueryLength?: number;
  debounceMs?: number;
  limit?: number;
  disabled?: boolean;
  sx?: SxProps<Theme>;
  textFieldProps?: Partial<TextFieldProps>;
}

function toLocationSelection(option: PlaceSuggestion): LocationSelection {
  return {
    label: option.description.split(",")[0]?.trim() || option.description,
    address: option.description,
    coordinates: option.coordinates,
    placeId: option.placeId
  };
}

export default function LocationAutocompleteField({
  value,
  onValueChange,
  onSelectLocation,
  placeholder = "Search location",
  label,
  nearbyCoordinates = null,
  minQueryLength = 2,
  debounceMs = 320,
  limit = 8,
  disabled = false,
  sx,
  textFieldProps
}: LocationAutocompleteFieldProps): React.JSX.Element {
  const { suggestions, loading } = useLocationAutocomplete({
    query: value,
    near: nearbyCoordinates,
    minQueryLength,
    debounceMs,
    limit,
    enabled: !disabled
  });

  const optionMap = useMemo(() => new Map(suggestions.map((item) => [item.placeId, item])), [suggestions]);
  const customStartAdornment = textFieldProps?.InputProps?.startAdornment;
  const customEndAdornment = textFieldProps?.InputProps?.endAdornment;

  return (
    <Autocomplete
      freeSolo
      disablePortal={false}
      blurOnSelect
      clearOnBlur={false}
      disableClearable={Boolean(customEndAdornment)}
      includeInputInList={false}
      disabled={disabled}
      options={suggestions}
      loading={loading}
      inputValue={value}
      value={null}
      getOptionLabel={(option) => (typeof option === "string" ? option : option.description)}
      isOptionEqualToValue={(option, selected) =>
        typeof selected !== "string" && option.placeId === selected.placeId
      }
      filterOptions={(optionsToRender) => optionsToRender}
      onInputChange={(_event, nextValue, reason) => {
        if (reason === "reset") return;
        onValueChange(nextValue);
      }}
      onChange={(_event, selected) => {
        if (!selected || typeof selected === "string") return;
        const option = optionMap.get(selected.placeId) ?? selected;
        const selection = toLocationSelection(option);
        onValueChange(selection.address);
        onSelectLocation(selection);
      }}
      slotProps={{
        popper: {
          sx: { zIndex: 2000 }
        },
        paper: {
          sx: {
            mt: 0.5,
            borderRadius: 2,
            border: "1px solid rgba(148,163,184,0.35)",
            boxShadow: "0 10px 24px rgba(15,23,42,0.16)"
          }
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          {...textFieldProps}
          label={label}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            ...textFieldProps?.InputProps,
            startAdornment: (
              <>
                <InputAdornment position="start" sx={{ mr: 0.5 }}>
                  {customStartAdornment ?? (
                    <SearchRoundedIcon sx={{ fontSize: 19, color: "text.secondary" }} />
                  )}
                </InputAdornment>
                {!customStartAdornment ? params.InputProps.startAdornment : null}
              </>
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={18} /> : null}
                {customEndAdornment}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option.placeId}>
          <PlaceRoundedIcon sx={{ fontSize: 18, color: "text.secondary", mr: 1 }} />
          <span>{option.description}</span>
        </li>
      )}
      sx={sx}
    />
  );
}
