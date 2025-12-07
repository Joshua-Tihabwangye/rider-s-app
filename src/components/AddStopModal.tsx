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

// Mock recent searches - would come from API/localStorage
const getRecentSearches = (): Location[] => [
  {
    id: "recent-1",
    name: "Kampala City",
    address: "Kampala, Uganda",
    distance: "1.1 km",
    coordinates: { lat: 0.3476, lng: 32.5825 },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: "recent-2",
    name: "Kampala City",
    address: "Kampala, Uganda",
    distance: "2.3 km",
    coordinates: { lat: 0.3476, lng: 32.5825 },
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
  },
  {
    id: "recent-3",
    name: "Kampala City",
    address: "Kampala, Uganda",
    distance: "3.5 km",
    coordinates: { lat: 0.3476, lng: 32.5825 },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  }
];

// Mock search function - would use location API
const searchLocations = async (query: string): Promise<Location[]> => {
  if (!query || query.length < 2) return [];
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const mockResults: Location[] = [
    {
      id: "search-1",
      name: `${query} City`,
      address: `${query}, Uganda`,
      distance: "2.3 km",
      coordinates: { lat: 0.3476, lng: 32.5825 }
    },
    {
      id: "search-2",
      name: `${query} Market`,
      address: `${query}, Uganda`,
      distance: "3.3 km",
      coordinates: { lat: 0.3136, lng: 32.5811 }
    },
    {
      id: "search-3",
      name: `${query} Street`,
      address: `${query}, Uganda`,
      distance: "5.1 km",
      coordinates: { lat: 0.3200, lng: 32.5900 }
    }
  ];
  
  return mockResults.filter(r => 
    r.name?.toLowerCase().includes(query.toLowerCase()) ||
    r.address?.toLowerCase().includes(query.toLowerCase())
  );
};

function AddStopModal({ open, onClose, onSelectStop, currentStopCount }: AddStopModalProps): JSX.Element {
  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<Location[]>([]);

  useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches());
      setQuery("");
      setSearchResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (query.length >= 2) {
      setLoadingSearch(true);
      searchLocations(query).then(results => {
        setSearchResults(results);
        setLoadingSearch(false);
      });
    } else {
      setSearchResults([]);
    }
  }, [query]);

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
    setSearchResults([]);
    onClose();
  };

  const showRecentSearches = query.length === 0 && recentSearches.length > 0;
  const showSearchResults = query.length >= 2 && searchResults.length > 0;
  const showEmptyState = query.length >= 2 && searchResults.length === 0 && !loadingSearch;

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
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
              borderRadius: 999,
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
        {loadingSearch && (
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

