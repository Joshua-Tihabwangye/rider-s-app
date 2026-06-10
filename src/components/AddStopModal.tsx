import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  Divider
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { useLocationAutocomplete } from "../hooks/useLocationAutocomplete";

interface Coordinates {
  lat: number;
  lng: number;
}

interface Location {
  id: string;
  name?: string;
  address?: string;
  subtext?: string;
  value?: string;
  distance?: string;
  coordinates: Coordinates;
  timestamp?: Date;
}

interface Stop {
  id: string;
  value: string;
  coordinates: Coordinates;
  address: string;
}

interface AddStopModalProps {
  open: boolean;
  onClose: () => void;
  onSelectStop: (stop: Stop) => void;
  currentStopCount: number;
}

const getRecentSearches = (): Location[] => [];

function AddStopModal({ open, onClose, onSelectStop, currentStopCount }: AddStopModalProps): React.JSX.Element {
  const [query, setQuery] = useState<string>("");
  const [recentSearches, setRecentSearches] = useState<Location[]>([]);
  const { suggestions, loading } = useLocationAutocomplete({
    query,
    minQueryLength: 3,
    debounceMs: 280,
    enabled: open
  });
  const searchResults: Location[] = suggestions.map((result, index) => ({
    id: `${result.placeId}-${index}`,
    name: result.description.split(",")[0]?.trim() || result.description,
    address: result.description,
    distance: "GPS location",
    coordinates: result.coordinates
  }));

  useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches());
      setQuery("");
    }
  }, [open]);

  const handleSelectLocation = (location: Location): void => {
    // Save to recent searches (would be done via API/localStorage)
    const stopValue = location.name || location.address || location.value || "";
    onSelectStop({
      id: String.fromCharCode(65 + currentStopCount), // Next letter (A-F)
      value: stopValue,
      coordinates: location.coordinates,
      address: location.address || location.subtext || stopValue
    });
    onClose();
  };

  const handleClose = (): void => {
    setQuery("");
    onClose();
  };

  const showRecentSearches = query.length === 0 && recentSearches.length > 0;
  const showSearchResults = query.length >= 2 && searchResults.length > 0;
  const showEmptyState = query.length >= 2 && searchResults.length === 0 && !loading;

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          maxHeight: "85vh",
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"
        }
      }}
      ModalProps={{
        keepMounted: false
      }}
    >
      <Box sx={{ px: 2.5, pt: 1.5, pb: 3 }}>
        {/* Drag handle indicator */}
        <Box
          sx={{
            width: 40,
            height: 4,
            borderRadius: 2,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#D1D5DB" : "#4B5563",
            mx: "auto",
            mb: 2.5
          }}
        />

        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: (theme) => theme.palette.text.primary
            }}
          >
            Add Stop.
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#F3F4F6" : "rgba(51,65,85,0.9)",
              "&:hover": {
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#E5E7EB" : "rgba(51,65,85,1)"
              }
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        {/* Search Input Field */}
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Where to?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ fontSize: 20, color: (theme) => theme.palette.text.secondary }} />
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setQuery("")}
                  sx={{
                    color: (theme) => theme.palette.text.secondary,
                    "&:hover": {
                      bgcolor: (theme) =>
                        theme.palette.mode === "light"
                          ? "rgba(0,0,0,0.05)"
                          : "rgba(255,255,255,0.05)"
                    }
                  }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 5,
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
              "& fieldset": {
                borderColor: (theme) =>
                  theme.palette.mode === "light" ? "rgba(209,213,219,0.9)" : "rgba(51,65,85,0.9)"
              },
              "&:hover fieldset": {
                borderColor: "primary.main"
              },
              "&.Mui-focused fieldset": {
                borderColor: "primary.main"
              }
            }
          }}
        />

        {/* Recent Searches Section */}
        {showRecentSearches && (
          <>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 1.5,
                fontSize: 13,
                color: (theme) => theme.palette.text.primary
              }}
            >
              Recent Searches
            </Typography>
            <List disablePadding>
              {recentSearches.map((search, index) => (
                <React.Fragment key={search.id}>
                  <ListItemButton
                    onClick={() => handleSelectLocation(search)}
                    sx={{
                      px: 0,
                      py: 1.25,
                      borderRadius: 1,
                      "&:hover": {
                        bgcolor: (theme) =>
                          theme.palette.mode === "light"
                            ? "rgba(0,0,0,0.05)"
                            : "rgba(255,255,255,0.05)"
                      }
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                      <AccessTimeRoundedIcon
                        sx={{
                          fontSize: 20,
                          color: (theme) => theme.palette.text.secondary,
                          flexShrink: 0
                        }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            letterSpacing: "-0.01em",
                            mb: 0.25,
                            color: (theme) => theme.palette.text.primary
                          }}
                        >
                          {search.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: 11,
                            color: (theme) => theme.palette.text.secondary,
                            display: "block"
                          }}
                        >
                          {search.address}
                        </Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: 11,
                          color: (theme) => theme.palette.text.secondary,
                          flexShrink: 0
                        }}
                      >
                        {search.distance}
                      </Typography>
                    </Box>
                  </ListItemButton>
                  {index < recentSearches.length - 1 && (
                    <Divider sx={{ my: 0.5, borderColor: (theme) => theme.palette.divider }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </>
        )}

        {/* Search Results */}
        {showSearchResults && (
          <List disablePadding>
            {searchResults.map((result, index) => (
              <React.Fragment key={result.id}>
                <ListItemButton
                  onClick={() => handleSelectLocation(result)}
                  sx={{
                    px: 0,
                    py: 1.25,
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: (theme) =>
                        theme.palette.mode === "light"
                          ? "rgba(0,0,0,0.05)"
                          : "rgba(255,255,255,0.05)"
                    }
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                    <PlaceRoundedIcon
                      sx={{
                        fontSize: 20,
                        color: "primary.main",
                        flexShrink: 0
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          letterSpacing: "-0.01em",
                          mb: 0.25,
                          color: (theme) => theme.palette.text.primary
                        }}
                      >
                        {result.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: 11,
                          color: (theme) => theme.palette.text.secondary,
                          display: "block"
                        }}
                      >
                        {result.address}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: 11,
                        color: (theme) => theme.palette.text.secondary,
                        flexShrink: 0
                      }}
                    >
                      {result.distance}
                    </Typography>
                  </Box>
                </ListItemButton>
                {index < searchResults.length - 1 && (
                  <Divider sx={{ my: 0.5, borderColor: (theme) => theme.palette.divider }} />
                )}
              </React.Fragment>
            ))}
          </List>
        )}

        {/* Empty State */}
        {showEmptyState && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography
              variant="body2"
              sx={{
                color: (theme) => theme.palette.text.secondary,
                fontSize: 13
              }}
            >
              No results found. Try another location name.
            </Typography>
          </Box>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography
              variant="body2"
              sx={{
                color: (theme) => theme.palette.text.secondary,
                fontSize: 13
              }}
            >
              Searching...
            </Typography>
          </Box>
        )}

        {/* No Recent Searches State */}
        {query.length === 0 && recentSearches.length === 0 && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography
              variant="body2"
              sx={{
                color: (theme) => theme.palette.text.secondary,
                fontSize: 13
              }}
            >
              No recent locations yet.
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}

export default AddStopModal;
