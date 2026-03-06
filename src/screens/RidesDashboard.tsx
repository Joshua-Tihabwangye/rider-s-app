import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Stack,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Autocomplete,
  CircularProgress,
  keyframes
} from "@mui/material";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarHalfRoundedIcon from "@mui/icons-material/StarHalfRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";

// Pulse animation for location marker
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

// Mock service for fetching saved locations from backend
const fetchSavedLocations = async () => {
  // In production, this would be an API call
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    {
      id: "home",
      type: "home",
      label: "Home",
      address: "12, JJ Apartments, New Street, Kampala",
      coordinates: { lat: 0.3476, lng: 32.5825 },
      icon: <HomeRoundedIcon sx={{ fontSize: 20, color: "#F97316" }} />
    },
    {
      id: "office",
      type: "office",
      label: "Office",
      address: "12, JJ Apartments, New Street, Kampala",
      coordinates: { lat: 0.3136, lng: 32.5811 },
      icon: <ApartmentRoundedIcon sx={{ fontSize: 20, color: "#F97316" }} />
    }
  ];
};

// Type definitions
interface Coordinates {
  lat: number;
  lng: number;
}

interface SavedLocation {
  id: string;
  type: string;
  label: string;
  address: string;
  coordinates: Coordinates;
  icon: React.ReactElement;
}

interface PlaceSuggestion {
  description: string;
  placeId: string;
  coordinates: Coordinates;
}

interface RouteData {
  distance: string;
  duration: string;
  polyline: Array<{ x: number; y: number }>;
  fare?: string;
}

interface Commute {
  id: string;
  route: string;
  schedule: string;
  origin: {
    address: string;
    coordinates: Coordinates;
  };
  destination: {
    address: string;
    coordinates: Coordinates;
  };
  distance: string;
  fare: string;
  driver?: {
    name: string;
    rating: number;
  };
  date?: string;
}

interface UpcomingRide {
  id: string;
  time: string;
  route: string;
  status: string;
  vehicle: string;
  origin: {
    address: string;
    coordinates: Coordinates;
  };
  destination: {
    address: string;
    coordinates: Coordinates;
  };
  distance: string;
  fare: string;
}

// Mock Google Places API autocomplete service
const searchPlaces = async (query: string): Promise<PlaceSuggestion[]> => {
  if (!query || query.length < 2) return [];
  
  // In production, this would call Google Places API
  // Mock suggestions based on query
  const mockSuggestions = [
    { description: `${query} Street, Kampala`, placeId: "1", coordinates: { lat: 0.3476, lng: 32.5825 } },
    { description: `${query} Market, Kampala`, placeId: "2", coordinates: { lat: 0.3136, lng: 32.5811 } },
    { description: `${query} Mall, Kampala`, placeId: "3", coordinates: { lat: 0.3200, lng: 32.5900 } },
    { description: `${query} Hospital, Kampala`, placeId: "4", coordinates: { lat: 0.3300, lng: 32.6000 } },
    { description: `${query} Airport, Entebbe`, placeId: "5", coordinates: { lat: 0.0422, lng: 32.4435 } }
  ];
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockSuggestions.filter(s => 
    s.description.toLowerCase().includes(query.toLowerCase())
  );
};

// Mock route calculation service
const calculateRoute = async (_origin: Coordinates, _destination: Coordinates): Promise<RouteData> => {
  // In production, this would use Google Directions API
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    distance: "6.2 km",
    duration: "15 min",
    polyline: [
      { x: 24, y: 60 }, // Start (current location)
      { x: 30, y: 50 },
      { x: 40, y: 40 },
      { x: 50, y: 35 },
      { x: 65, y: 30 },
      { x: 75, y: 26 }  // End (destination)
    ]
  };
};

// Mock service for fetching daily commutes
const fetchDailyCommutes = async () => {
  // In production, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    {
      id: "commute-1",
      route: "Home → Office",
      schedule: "Weekdays · 8:00 AM",
      origin: {
        address: "Home",
        coordinates: { lat: 0.3476, lng: 32.5825 }
      },
      destination: {
        address: "Office",
        coordinates: { lat: 0.3136, lng: 32.5811 }
      },
      distance: "12 km",
      fare: "UGX 20,000"
    }
  ];
};

// Mock service for fetching upcoming rides
const fetchUpcomingRides = async () => {
  // In production, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    {
      id: "upcoming-1",
      time: "Today · 7:30 AM",
      route: "Home → Office",
      status: "Scheduled",
      vehicle: "EV Sedan",
      origin: {
        address: "Home",
        coordinates: { lat: 0.3476, lng: 32.5825 }
      },
      destination: {
        address: "Office",
        coordinates: { lat: 0.3136, lng: 32.5811 }
      },
      distance: "12 km",
      fare: "UGX 20,000"
    }
  ];
};

// Star rating component
interface StarRatingProps {
  rating: number;
}

function StarRating({ rating }: StarRatingProps): React.JSX.Element {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <StarRoundedIcon key={`full-${i}`} sx={{ fontSize: 16, color: "#facc15" }} />
      ))}
      {hasHalfStar && (
        <StarHalfRoundedIcon sx={{ fontSize: 16, color: "#facc15" }} />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <StarBorderRoundedIcon key={`empty-${i}`} sx={{ fontSize: 16, color: "#d1d5db" }} />
      ))}
    </Box>
  );
}

// Upcoming ride card component
interface UpcomingRideCardProps {
  ride: UpcomingRide;
  onCancel: (ride: UpcomingRide) => void;
  onChangeDate: (ride: UpcomingRide) => void;
  onSelect: () => void;
}

function UpcomingRideCard({ ride, onCancel, onChangeDate, onSelect }: UpcomingRideCardProps): React.JSX.Element {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const handleCancelClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = (): void => {
    setCancelDialogOpen(false);
    onCancel(ride);
  };

  const handleChangeDateClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    onChangeDate(ride);
  };

  return (
    <>
      <Card
        elevation={0}
        onClick={onSelect}
        sx={{
          mb: 2,
          borderRadius: 2.5,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          cursor: "pointer",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          "&:hover": {
            boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
            transform: "translateY(-1.5px)",
            borderColor: "#03CD8C"
          }
        }}
      >
        <Box sx={{ bgcolor: ride.status === "Scheduled" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", px: 2, py: 0.75, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <AccessTimeRoundedIcon sx={{ fontSize: 13, color: ride.status === "Scheduled" ? "#059669" : "#D97706" }} />
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 10.5, color: ride.status === "Scheduled" ? "#059669" : "#D97706", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {ride.status}
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600, color: "text.secondary" }}>
            {ride.vehicle}
          </Typography>
        </Box>

        <CardContent sx={{ px: 2, py: 2 }}>
          <Stack spacing={1.75}>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ 
                  fontSize: 14.5, 
                  fontWeight: 700, 
                  letterSpacing: "-0.01em", 
                  mb: 0.5,
                  color: "text.primary"
                }}
              >
                {ride.time}
              </Typography>
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#03CD8C", flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ fontSize: 12.5, fontWeight: 500, color: "text.secondary" }}>
                    {ride.origin.address}
                  </Typography>
                </Stack>
                <Box sx={{ width: 2, height: 12, bgcolor: "rgba(0,0,0,0.1)", ml: 0.75 }} />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#F97316", flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ fontSize: 12.5, fontWeight: 600, color: "text.primary" }}>
                    {ride.destination.address}
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <Stack direction="row" spacing={1.5}>
              <Button
                fullWidth
                size="small"
                variant="outlined"
                onClick={handleChangeDateClick}
                sx={{ 
                  borderRadius: 2, 
                  fontSize: 11, 
                  fontWeight: 600, 
                  textTransform: "none",
                  py: 0.75,
                  borderColor: "rgba(0,0,0,0.12)",
                  color: "text.secondary",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.03)", borderColor: "rgba(0,0,0,0.2)" }
                }}
              >
                Change Date
              </Button>
              <Button
                fullWidth
                size="small"
                variant="outlined"
                onClick={handleCancelClick}
                sx={{ 
                  borderRadius: 2, 
                  fontSize: 11, 
                  fontWeight: 600, 
                  textTransform: "none",
                  py: 0.75,
                  borderColor: "rgba(239,68,68,0.2)",
                  color: "#EF4444",
                  "&:hover": { bgcolor: "rgba(239,68,68,0.05)", borderColor: "#EF4444" }
                }}
              >
                Cancel Ride
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 300,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ fontSize: 18, fontWeight: 700, pb: 1 }}>
          Cancel scheduled ride?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.6 }}>
            Are you sure you want to cancel your ride for <strong>{ride.time}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setCancelDialogOpen(false)}
            fullWidth
            sx={{ 
              textTransform: "none", 
              color: "text.secondary",
              fontWeight: 600,
              borderRadius: 2
            }}
          >
            Keep Ride
          </Button>
          <Button
            onClick={handleCancelConfirm}
            fullWidth
            variant="contained"
            sx={{
              textTransform: "none",
              bgcolor: "#EF4444",
              color: "white",
              fontWeight: 600,
              borderRadius: 2,
              "&:hover": {
                bgcolor: "#DC2626"
              }
            }}
          >
            Cancel Ride
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// Commute card component
interface CommuteCardProps {
  commute: Commute;
  onRequest: () => void;
  onSelect: () => void;
}

function CommuteCard({ commute, onRequest, onSelect }: CommuteCardProps): React.JSX.Element {
  return (
    <Card
      elevation={0}
      onClick={onSelect}
      sx={{
        mb: 2,
        borderRadius: 2.5,
        bgcolor: (t) =>
          t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: (t) =>
          t.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        "&:hover": {
          boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
          transform: "translateY(-1.5px)",
          borderColor: "#03CD8C"
        }
      }}
    >
      <Box sx={{ bgcolor: "rgba(3,205,140,0.08)", px: 2, py: 0.75, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 10.5, color: "#03CD8C", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Daily Route
        </Typography>
        <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, color: "#03CD8C" }}>
          {commute.fare}
        </Typography>
      </Box>

      <CardContent sx={{ px: 2, py: 2 }}>
        <Stack spacing={2}>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ 
                fontSize: 14, 
                fontWeight: 700, 
                letterSpacing: "-0.01em", 
                mb: 0.5,
                color: "text.primary"
              }}
            >
              {commute.route}
            </Typography>
            <Typography
              variant="caption"
              sx={{ 
                fontSize: 11.5, 
                color: "text.secondary",
                display: "block",
                mb: 1.5
              }}
            >
              Scheduled: {commute.schedule}
            </Typography>

            <Stack spacing={0.5} sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#03CD8C" }} />
                <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary" }}>
                  {commute.origin.address}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#F97316" }} />
                <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary" }}>
                  {commute.destination.address}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              onRequest();
            }}
            sx={{
              borderRadius: 2,
              py: 1,
              bgcolor: "#03CD8C",
              color: "#FFFFFF",
              fontWeight: 700,
              textTransform: "none",
              fontSize: 13,
              boxShadow: "0 4px 12px rgba(3,205,140,0.2)",
              "&:hover": {
                bgcolor: "#02b57b",
                boxShadow: "0 6px 16px rgba(3,205,140,0.3)"
              }
            }}
          >
            Book this route
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

interface CommonPlaceCardProps {
  icon: React.ReactElement;
  label: string;
  address: string;
  selected?: boolean;
  onSelect?: () => void;
}

function CommonPlaceCard({ icon, label, address, selected = false, onSelect }: CommonPlaceCardProps): React.JSX.Element {
  return (
    <Card
      elevation={selected ? 2 : 1}
      onClick={onSelect}
      sx={{
        borderRadius: 2.5,
        cursor: onSelect ? "pointer" : "default",
        bgcolor: (theme) =>
          theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: (theme) =>
          theme.palette.mode === "light"
            ? `1px solid ${selected ? "rgba(3,205,140,0.5)" : "rgba(209,213,219,0.9)"}`
            : `1px solid ${selected ? "rgba(3,205,140,0.6)" : "rgba(51,65,85,0.8)"}`,
        boxShadow: selected
          ? "0 4px 12px rgba(3,205,140,0.15)"
          : "0 1px 3px rgba(0,0,0,0.06)",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
          transform: "translateY(-1.5px)",
          borderColor: "#03CD8C"
        },
        "&:active": {
          transform: "translateY(0px)"
        }
      }}
    >
      <CardContent sx={{ py: 1.75, px: 2, position: "relative" }}>
        <Stack direction="row" spacing={2.25} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              bgcolor: (t) =>
                t.palette.mode === "light"
                  ? "rgba(249,115,22,0.1)"
                  : "rgba(249,115,22,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              border: "1px solid rgba(249,115,22,0.15)"
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, letterSpacing: "-0.01em", mb: 0.25, fontSize: 13.5 }}
            >
              {label}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <PlaceRoundedIcon sx={{ fontSize: 13, color: "#F97316", opacity: 0.8 }} />
              <Typography
                variant="caption"
                sx={{ 
                  fontSize: 11.5, 
                  color: (theme) => theme.palette.text.secondary,
                  lineHeight: 1.4,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {address}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" sx={{ color: (t) => t.palette.text.secondary, opacity: 0.4 }}>
            <ArrowForwardIosRoundedIcon sx={{ fontSize: 12 }} />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
}

function EnterDestinationMainScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if this is a shared ride mode from query parameter
  const searchParams = new URLSearchParams(location.search);
  const isSharedRideMode = searchParams.get("mode") === "share";
  
  const [tab, setTab] = useState("common");
  const [helperState, setHelperState] = useState("idle");
  const [selectedPlace, setSelectedPlace] = useState<string | PlaceSuggestion | null>(null);
  const [whereTo, setWhereTo] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<Coordinates | null>(null);
  const [dailyCommutes, setDailyCommutes] = useState<Commute[]>([]);
  const [loadingCommutes, setLoadingCommutes] = useState(false);
  const [upcomingRides, setUpcomingRides] = useState<UpcomingRide[]>([]);
  const [loadingUpcomingRides, setLoadingUpcomingRides] = useState(false);

  // Fetch saved locations on mount
  useEffect(() => {
    const loadSavedLocations = async () => {
      try {
        setLoadingLocations(true);
        const locations = await fetchSavedLocations();
        setSavedLocations(locations);
      } catch (error) {
        console.error("Error loading saved locations:", error);
      } finally {
        setLoadingLocations(false);
      }
    };
    loadSavedLocations();
  }, []);

  // Fetch daily commutes when Daily Commutes tab is active
  useEffect(() => {
    if (tab === "commutes") {
      const loadCommutes = async () => {
        try {
          setLoadingCommutes(true);
          const commutes = await fetchDailyCommutes();
          setDailyCommutes(commutes);
        } catch (error) {
          console.error("Error loading daily commutes:", error);
        } finally {
          setLoadingCommutes(false);
        }
      };
      loadCommutes();
    }
  }, [tab]);

  // Fetch upcoming rides when Upcoming Rides tab is active
  useEffect(() => {
    if (tab === "upcoming") {
      const loadUpcomingRides = async () => {
        try {
          setLoadingUpcomingRides(true);
          const rides = await fetchUpcomingRides();
          setUpcomingRides(rides);
        } catch (error) {
          console.error("Error loading upcoming rides:", error);
        } finally {
          setLoadingUpcomingRides(false);
        }
      };
      loadUpcomingRides();
    }
  }, [tab]);

  // Get current GPS location
  useEffect(() => {
    // Check if geolocation is available and permission hasn't been permanently denied
    if (navigator.geolocation && navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted' || result.state === 'prompt') {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setCurrentLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
            },
            (error) => {
              // Silently handle geolocation errors
              // Fallback to default location (Kampala)
              setCurrentLocation({ lat: 0.3476, lng: 32.5825 });
            },
            {
              enableHighAccuracy: false,
              timeout: 5000,
              maximumAge: 300000 // Cache for 5 minutes
            }
          );
        } else {
          // Permission denied or blocked - use default location
          setCurrentLocation({ lat: 0.3476, lng: 32.5825 });
        }
      }).catch(() => {
        // Permissions API not supported - try anyway but with error handling
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          () => {
            // Fallback to default location
            setCurrentLocation({ lat: 0.3476, lng: 32.5825 });
          },
          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 300000
          }
        );
      });
    } else if (navigator.geolocation) {
      // Geolocation available but Permissions API not supported
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Fallback to default location
          setCurrentLocation({ lat: 0.3476, lng: 32.5825 });
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 300000
        }
      );
    } else {
      // Fallback to default location
      setCurrentLocation({ lat: 0.3476, lng: 32.5825 });
    }
  }, []);

  // Calculate route when destination is selected
  useEffect(() => {
    if (destinationCoords && currentLocation) {
      const calculateRoutePreview = async () => {
        try {
          const route = await calculateRoute(currentLocation, destinationCoords);
          setRouteData(route);
        } catch (error) {
          console.error("Error calculating route:", error);
        }
      };
      calculateRoutePreview();
    } else {
      setRouteData(null);
    }
  }, [destinationCoords, currentLocation]);


  const handleCommuteRequest = (commute: Commute): void => {
    // Navigate to Enter Destination screen (RA05) with commute data
    navigate("/rides/enter/details", {
      state: {
        pickup: commute.origin.address,
        destination: commute.destination.address,
        destinationCoords: commute.destination.coordinates,
        originCoords: commute.origin.coordinates,
        isCommute: true,
        commute: commute,
        driver: commute.driver,
        fare: commute.fare,
        distance: commute.distance,
        date: commute.date
      }
    });
  };

  const handleCancelRide = (ride: UpcomingRide): void => {
    // In production, this would call API to cancel the ride
    setUpcomingRides(prev => prev.filter((r: UpcomingRide) => r.id !== ride.id));
    // Show success message or notification
  };

  const handleChangeDate = (ride: UpcomingRide): void => {
    // Navigate to schedule screen to change date/time
    navigate("/rides/schedule", {
      state: {
        rideId: ride.id,
        existingRide: ride
      }
    });
  };

  const handleTabChange = (_event: React.SyntheticEvent, value: string): void => {
    setTab(value);
    setHelperState(`tab-${value}`);
  };

  const handleQuickAction = (type: string): void => {
    if (type === "history") {
      navigate("/rides/history/past");
    } else if (type === "schedule") {
      navigate("/rides/schedule");
    } else if (type === "multi-stop") {
      navigate("/rides/enter/multi-stops");
    } else if (type === "book-contact") {
      navigate("/rides/switch-rider");
    } else if (type === "book-someone") {
      navigate("/rides/switch-rider/manual");
    } else if (type === "commutes-manage") {
      navigate("/rides/commutes");
    } else if (type === "upcoming-all") {
      navigate("/rides/upcoming");
    } else {
      setHelperState(type);
    }
  };

  const handleSelectPlace = async (place: string): Promise<void> => {
    const location = savedLocations.find(loc => loc.id === place);
    if (location) {
      setSelectedPlace(place);
      setWhereTo(location.address);
      setDestinationCoords(location.coordinates);
      setHelperState("idle");
      
      // Navigate to Enter Destination screen (RA05) after a brief delay to show route preview
      setTimeout(() => {
        navigate("/rides/enter/details", {
          state: {
            pickup: currentLocation ? "Current location" : "Entebbe International Airport",
            destination: location.address,
            destinationCoords: location.coordinates,
            placeType: place
          }
        });
      }, 1000);
    }
  };

  const handlePlaceSearch = async (query: string): Promise<void> => {
    setWhereTo(query);
    setHelperState("search");
    setSelectedPlace(null);
    
    if (query && query.length >= 2) {
      setLoadingSuggestions(true);
      try {
        const suggestions = await searchPlaces(query);
        setPlaceSuggestions(suggestions);
      } catch (error) {
        console.error("Error searching places:", error);
      } finally {
        setLoadingSuggestions(false);
      }
    } else {
      setPlaceSuggestions([]);
    }
  };

  const handlePlaceSelect = async (place: string | PlaceSuggestion): Promise<void> => {
    if (typeof place === "string") {
      // User typed a custom address
      setWhereTo(place);
      setDestinationCoords({ lat: 0.3476, lng: 32.5825 }); // Default coords
    } else {
      // Selected from autocomplete
      setWhereTo(place.description);
      setDestinationCoords(place.coordinates);
    }
    setPlaceSuggestions([]);
    
    // Navigate to Enter Destination screen (RA05) after route calculation
    setTimeout(() => {
      navigate("/rides/enter/details", {
        state: {
          pickup: currentLocation ? "Current location" : "Entebbe International Airport",
          destination: typeof place === "string" ? place : place.description,
          destinationCoords: typeof place === "string" ? { lat: 0.3476, lng: 32.5825 } : place.coordinates,
          isSharedRide: isSharedRideMode // Pass shared ride mode to details screen
        }
      });
    }, 1000);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleMenuNavigation = (route: string): void => {
    navigate(route);
    setMenuOpen(false);
  };

  const menuItems = [
    {
      icon: <PersonRoundedIcon />,
      label: "Profile",
      description: "View and edit your profile",
      route: "/more"
    },
    {
      icon: <HistoryRoundedIcon />,
      label: "Ride History",
      description: "View past and upcoming rides",
      route: "/rides/history/past"
    },
    {
      icon: <AccountBalanceWalletRoundedIcon />,
      label: "Wallet",
      description: "Manage your payment methods",
      route: "/wallet"
    },
    {
      icon: <HistoryRoundedIcon />,
      label: "All Orders History",
      description: "View all rides, deliveries, rentals",
      route: "/history/all"
    },
    {
      icon: <SettingsRoundedIcon />,
      label: "Settings",
      description: "App preferences and settings",
      route: "/settings"
    },
    {
      icon: <HelpRoundedIcon />,
      label: "Help & Support",
      description: "Get help and contact support",
      route: "/help"
    },
    {
      icon: <InfoRoundedIcon />,
      label: "About",
      description: "App version and information",
      route: "/about"
    }
  ];

  return (
    <Box>
      {/* Navigation Drawer */}
      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Menu
            </Typography>
            <IconButton size="small" onClick={handleMenuClose}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ bgcolor: "#03CD8C", color: "#020617", width: 48, height: 48 }}>
              RZ
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Rider User
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                rider@evzone.com
              </Typography>
            </Box>
          </Box>
        </Box>
        <List sx={{ px: 1, pt: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.route} disablePadding>
              <ListItemButton
                onClick={() => handleMenuNavigation(item.route)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  py: 1.5,
                  "&:hover": {
                    bgcolor: (t) =>
                      t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,1)"
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: "#03CD8C" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item.label}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ fontSize: 11 }}>
                      {item.description}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Header with green background */}
      <Box
        sx={{
          bgcolor: "#03CD8C",
          px: 2,
          pt: 2.5,
          pb: 2.5,
          mb: 0
        }}
      >
        <Box sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", minHeight: 48 }}>
          <IconButton
            size="small"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            sx={{
              position: "absolute",
              left: 20,
              borderRadius: 999,
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
              border: (theme) =>
                theme.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <MenuRoundedIcon sx={{ fontSize: 22 }} />
          </IconButton>
          <Box sx={{ mx: 7, textAlign: "center" }}>
            <Typography
              variant="subtitle1"
              sx={{ 
                fontWeight: 700, 
                fontSize: 18,
                letterSpacing: "-0.01em", 
                color: "#FFFFFF"
              }}
            >
              Where to today?
            </Typography>
          </Box>
        </Box>

        {/* Search with Autocomplete */}
        <Autocomplete
          freeSolo
          options={placeSuggestions}
          getOptionLabel={(option) => 
            typeof option === "string" ? option : option.description
          }
          loading={loadingSuggestions}
          value={whereTo}
          onInputChange={(_event: React.SyntheticEvent, newValue: string) => {
            handlePlaceSearch(newValue);
          }}
          onChange={(_event: React.SyntheticEvent, newValue: string | PlaceSuggestion | null) => {
            if (newValue) {
              handlePlaceSelect(newValue);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              size="small"
              placeholder="Where to?"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      <SearchRoundedIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                ),
                endAdornment: (
                  <>
                    {loadingSuggestions ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 999,
                  bgcolor: (theme) =>
                    theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.96)",
                  "& fieldset": {
                    borderColor: (theme) =>
                      theme.palette.mode === "light"
                        ? "rgba(209,213,219,0.9)"
                        : "rgba(51,65,85,0.9)"
                  },
                  "&:hover fieldset": {
                    borderColor: "primary.main"
                  }
                }
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props} key={typeof option === "string" ? option : option.placeId}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                <PlaceRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                <Typography variant="body2">
                  {typeof option === "string" ? option : option.description}
                </Typography>
              </Box>
            </Box>
          )}
          PaperComponent={(props) => (
            <Box
              {...props}
              sx={{
                mt: 1,
                borderRadius: 2,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                boxShadow: "0 4px 20px rgba(15,23,42,0.15)"
              }}
            />
          )}
        />
      </Box>

      {/* White body section */}
      <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Map preview */}
      <Box
        sx={{
          mb: 2,
          borderRadius: 3,
          height: 170,
          position: "relative",
          overflow: "hidden",
          background: (theme) =>
            theme.palette.mode === "light"
              ? "radial-gradient(circle at top, rgba(3,205,140,0.15) 0, rgba(34,197,94,0.08) 55%, rgba(3,205,140,0.05) 100%)"
              : "radial-gradient(circle at top, rgba(15,118,205,0.6), rgba(15,23,42,1))"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.18,
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.35) 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }}
        />
        
        {/* Route preview line */}
        {routeData && routeData.polyline && (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none"
            }}
          >
            <polyline
              points={routeData.polyline.map((p: { x: number; y: number }) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="#03CD8C"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2,2"
              opacity={0.8}
            />
          </svg>
        )}

        {/* Current location marker (blue pin) */}
        <Box
          sx={{
            position: "absolute",
            left: routeData?.polyline?.[0]?.x ? `${routeData.polyline[0].x}%` : "24%",
            top: routeData?.polyline?.[0]?.y ? `${routeData.polyline[0].y}%` : "60%",
            transform: "translate(-50%, -50%)",
            zIndex: 2
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: "999px",
                bgcolor: "#03CD8C",
                border: "2px solid white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: -8,
                borderRadius: "999px",
                border: "1px solid rgba(59,130,246,0.5)",
                animation: `${pulse} 2s infinite`
              }}
            />
          </Box>
        </Box>

        {/* Destination marker (green pin) - appears when a place is selected */}
        {(selectedPlace || destinationCoords) && routeData && (
          <Box
            sx={{
              position: "absolute",
              left: routeData.polyline && routeData.polyline.length > 0 && routeData.polyline[routeData.polyline.length - 1]?.x 
                ? `${routeData.polyline[routeData.polyline.length - 1]!.x}%` 
                : "75%",
              top: routeData.polyline && routeData.polyline.length > 0 && routeData.polyline[routeData.polyline.length - 1]?.y 
                ? `${routeData.polyline[routeData.polyline.length - 1]!.y}%` 
                : "26%",
              transform: "translate(-50%, -50%)",
              zIndex: 2
            }}
          >
            <PlaceRoundedIcon
              sx={{
                fontSize: 28,
                color: "#10B981",
                filter: "drop-shadow(0 4px 8px rgba(15,23,42,0.9))"
              }}
            />
          </Box>
        )}

        {/* Route info overlay */}
        {routeData && (
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: 8,
              right: 8,
              bgcolor: "rgba(255,255,255,0.95)",
              borderRadius: 1.5,
              px: 1.5,
              py: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >
            <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 600 }}>
              {routeData.distance} • {routeData.duration}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons={false}
        sx={{
          minHeight: 36,
          mb: 1.5,
          "& .MuiTab-root": {
            minHeight: 36,
            fontSize: 12,
            textTransform: "none",
            color: (t) => t.palette.text.secondary,
            fontWeight: 500
          },
          "& .Mui-selected": {
            color: (t) => t.palette.text.primary,
            fontWeight: 600
          },
          "& .MuiTabs-indicator": {
            height: 2,
            borderRadius: 999,
            bgcolor: "#03CD8C"
          }
        }}
      >
        <Tab value="common" label="Common Places" />
        <Tab value="commutes" label="Daily Commutes" />
        <Tab value="upcoming" label="Upcoming Rides" />
      </Tabs>

      <Box sx={{ mt: 1 }}>
        {tab === "common" && (
          <>
            {loadingLocations ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={24} />
              </Box>
            ) : savedLocations.length > 0 ? (
              <Stack direction="column" spacing={1.5}>
                {savedLocations.map((location) => (
                  <Box key={location.id} sx={{ width: "100%" }}>
                    <CommonPlaceCard
                      icon={location.icon}
                      label={location.label}
                      address={location.address}
                      selected={selectedPlace === location.id}
                      onSelect={() => handleSelectPlace(location.id)}
                    />
                  </Box>
                ))}
              </Stack>
            ) : (
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  bgcolor: (t) =>
                    t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                  border: (t) =>
                    t.palette.mode === "light"
                      ? "1px solid rgba(209,213,219,0.9)"
                      : "1px solid rgba(51,65,85,0.9)"
                }}
              >
                <CardContent sx={{py: 3, textAlign: "center" }}>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    No saved locations. Add locations in settings.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {tab === "commutes" && (
          <Box sx={{ mt: 1 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1.5 }}
            >
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Daily commutes
              </Typography>
              <Typography
                variant="caption"
                onClick={() => navigate("/rides/commutes")}
                sx={{
                  fontSize: 10.5,
                  color: (t) => t.palette.text.secondary,
                  cursor: "pointer",
                  "&:hover": {
                    color: (t) => t.palette.primary.main
                  }
                }}
              >
                Manage
              </Typography>
            </Stack>

            {loadingCommutes ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={24} />
              </Box>
            ) : dailyCommutes.length > 0 ? (
              <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
                {dailyCommutes.map((commute) => (
                  <CommuteCard
                    key={commute.id}
                    commute={commute}
                    onSelect={() => {
                      // Update map to show commute route
                      setCurrentLocation(commute.origin.coordinates);
                      setDestinationCoords(commute.destination.coordinates);
                      setWhereTo(commute.destination.address);
                    }}
                    onRequest={() => {
                      handleCommuteRequest(commute);
                    }}
                  />
                ))}
              </Box>
            ) : (
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  bgcolor: (t) =>
                    t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                  border: (t) =>
                    t.palette.mode === "light"
                      ? "1px solid rgba(209,213,219,0.9)"
                      : "1px solid rgba(51,65,85,0.9)"
                }}
              >
                <CardContent sx={{py: 4, textAlign: "center" }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", mb: 1, display: "block" }}>
                    No commutes saved
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary" }}>
                    Create a new scheduled route to get started
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        )}

        {tab === "upcoming" && (
          <Box sx={{ mt: 1 }}>
            {loadingUpcomingRides ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={24} />
              </Box>
            ) : upcomingRides.length > 0 ? (
              <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
                {upcomingRides.map((ride) => (
                  <UpcomingRideCard
                    key={ride.id}
                    ride={ride}
                    onSelect={() => {
                      // Update map to show ride route
                      // Update map to show ride route - coordinates only
                      setDestinationCoords(ride.destination.coordinates);
                      setWhereTo(ride.destination.address);
                    }}
                    onCancel={handleCancelRide}
                    onChangeDate={handleChangeDate}
                  />
                ))}
              </Box>
            ) : (
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  bgcolor: (t) =>
                    t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                  border: (t) =>
                    t.palette.mode === "light"
                      ? "1px solid rgba(209,213,219,0.9)"
                      : "1px solid rgba(51,65,85,0.9)"
                }}
              >
                <CardContent sx={{py: 4, textAlign: "center" }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", mb: 1, display: "block" }}>
                    No upcoming rides scheduled
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate("/rides/enter")}
                    sx={{
                      mt: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      borderColor: "#F77F00",
                      color: "#F77F00"
                    }}
                  >
                    Book a New Ride
                  </Button>
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      </Box>

      {/* Helper panel */}
      {helperState !== "idle" && (
        <Card
          elevation={0}
          sx={{
            mb: 1.2,
            borderRadius: 2,
            bgcolor: (t) =>
              t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)"
          }}
        >
          <CardContent sx={{ px: 1.75, py: 1.1 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
            >
              {helperState === "menu" &&
                "Next step: open the main EVzone menu with access to profile, payment methods and other modules."}
              {helperState === "search" &&
                "Next step: show suggestions and recent destinations as you type, then move to EV type selection (RA14/RA20)."}
              {helperState === "book-now" &&
                "Next step: open the immediate ride flow – pickup now, confirm EV type and payment (RA14 → RA20 → RA21)."}
              {helperState === "schedule" &&
                "Next step: open schedule flow – pick date & time, then EV type and payment (RA08/RA09 + RA20/RA21)."}
              {helperState === "multi-stop" &&
                "Next step: switch to the multi-stop entry screen so you can add A/B/C stops (RA39–RA43)."}
              {helperState === "history" &&
                "Next step: open ride history with past and upcoming EV rides (RA33/RA34/RA49/RA37)."}
              {helperState === "book-contact" &&
                "Next step: open the Switch Rider → Contact flow so you can book a ride for a saved contact (RA10–RA13)."}
              {helperState === "book-someone" &&
                "Next step: open the Switch Rider → Someone else flow to enter name and phone for a one-off rider (RA10–RA13)."}
              {helperState === "commutes-manage" &&
                "Next step: open the full Daily Commutes management view where you can add, edit or remove commute presets (RA03)."}
              {helperState === "book-commute" &&
                "Next step: prefill the route (e.g., Home ↔ Office) and take the rider straight into EV type selection for a quick commute booking."}
              {helperState === "upcoming-all" &&
                "Next step: open the dedicated Upcoming Rides screen to see all scheduled EV rides (RA49/RA34)."}
              {helperState.startsWith("tab-") &&
                "You can use tabs to jump between common places, daily commutes and your upcoming EV rides."}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Sticky Bottom Card - From/To/ETA/Fare/Continue */}
      {(selectedPlace || destinationCoords) && routeData && (
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            bgcolor: (t) => t.palette.background.default,
            borderTop: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
            pt: 1.5,
            pb: 2,
            px: 2.5
          }}
        >
          <Card
            elevation={0}
            sx={{
              borderRadius: 2.5,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <CardContent sx={{ px: 2, py: 1.5 }}>
              <Stack spacing={1.5}>
                {/* From/To */}
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#03CD8C",
                        border: "2px solid white",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: (t) => t.palette.text.secondary
                      }}
                    >
                      From: Current location
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PlaceRoundedIcon
                      sx={{ fontSize: 18, color: "#10B981" }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                        flex: 1
                      }}
                    >
                      To: {typeof selectedPlace === "string" 
                        ? savedLocations.find(loc => loc.id === selectedPlace)?.label || "Selected destination"
                        : selectedPlace?.description || "Selected destination"}
                    </Typography>
                  </Stack>
                </Stack>

                {/* ETA • Fare • Continue */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ pt: 0.5 }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <AccessTimeRoundedIcon
                        sx={{ fontSize: 14, color: (t) => t.palette.text.secondary }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: (t) => t.palette.text.secondary
                        }}
                      >
                        {routeData.duration}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: 11,
                        color: (t) => t.palette.text.secondary
                      }}
                    >
                      •
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <AttachMoneyRoundedIcon
                        sx={{ fontSize: 14, color: (t) => t.palette.text.secondary }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: (t) => t.palette.text.secondary
                        }}
                      >
                        {routeData.fare || "UGX 20,000"}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      navigate("/rides/enter/details", {
                        state: {
                          pickup: "Current location",
                          destination: typeof selectedPlace === "string"
                            ? savedLocations.find(loc => loc.id === selectedPlace)?.address || "Selected destination"
                            : selectedPlace?.description || "Selected destination",
                          pickupCoords: currentLocation,
                          destinationCoords: destinationCoords,
                          routeData: routeData,
                          isSharedRide: isSharedRideMode
                        }
                      });
                    }}
                    sx={{
                      bgcolor: "#03CD8C",
                      color: "#FFFFFF",
                      fontSize: 12,
                      fontWeight: 600,
                      px: 2.5,
                      py: 0.75,
                      borderRadius: 1.5,
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "#22C55E"
                      }
                    }}
                  >
                    Continue
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      )}
      </Box>
    </Box>
  );
}

export default function RidesDashboard(): React.JSX.Element {
  return (
    <>
      <DarkModeToggle />
      <MobileShell>
        <EnterDestinationMainScreen />
      </MobileShell>
    </>
  );
}
