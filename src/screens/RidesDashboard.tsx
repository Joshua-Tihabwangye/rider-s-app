import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Stack,
  Chip,
  Avatar,
  Autocomplete,
  CircularProgress
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarHalfRoundedIcon from "@mui/icons-material/StarHalfRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ScreenScaffold from "../components/ScreenScaffold";
import ActionGrid from "../components/primitives/ActionGrid";
import InfoCard from "../components/primitives/InfoCard";
import SectionHeader from "../components/primitives/SectionHeader";
import MapShell from "../components/maps/MapShell";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";
import type { RideState } from "../store/types";
import {
  calculateRoute,
  searchPlaces,
  type Coordinates,
  type PlaceSuggestion
} from "../services/maps";


interface SavedLocation {
  id: string;
  type: string;
  label: string;
  address: string;
  coordinates: Coordinates;
  icon: React.ReactElement;
}

interface RouteData {
  distance: string;
  duration: string;
  path: Coordinates[];
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

interface RideInsightPoint {
  label: string;
  address: string;
  coordinates: Coordinates;
}

interface RideInsightRoute {
  origin: RideInsightPoint;
  destination: RideInsightPoint;
  fare: string;
  distance: string;
  timestamp: string;
}

function normalizeKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function formatCommuteSchedule(index: number): string {
  if (index === 0) return "Weekdays · 8:00 AM";
  if (index === 1) return "Weekdays · 5:30 PM";
  return "Frequent route";
}

function formatUpcomingTime(index: number): string {
  if (index === 0) return "Tomorrow · 7:30 AM";
  if (index === 1) return "Tomorrow · 5:30 PM";
  return "Sat · 10:00 AM";
}

function inferPlaceIcon(label: string, address: string): React.ReactElement {
  const normalized = `${label} ${address}`.toLowerCase();
  if (normalized.includes("home")) {
    return <HomeRoundedIcon sx={{ fontSize: 20, color: "#F97316" }} />;
  }
  if (normalized.includes("office") || normalized.includes("work")) {
    return <ApartmentRoundedIcon sx={{ fontSize: 20, color: "#F97316" }} />;
  }
  return <PlaceRoundedIcon sx={{ fontSize: 20, color: "#F97316" }} />;
}

function deriveRideInsights(activityRoutes: RideInsightRoute[]): {
  commonPlaces: SavedLocation[];
  commutes: Commute[];
  upcoming: UpcomingRide[];
} {
  const locationStats = new Map<
    string,
    { count: number; label: string; address: string; coordinates: Coordinates }
  >();
  const routeStats = new Map<
    string,
    {
      count: number;
      origin: RideInsightPoint;
      destination: RideInsightPoint;
      fare: string;
      distance: string;
      timestamp: string;
    }
  >();

  const addLocation = (location: RideInsightPoint): void => {
    const key = normalizeKey(location.address || location.label);
    const current = locationStats.get(key);
    if (current) {
      current.count += 1;
      return;
    }
    locationStats.set(key, {
      count: 1,
      label: location.label,
      address: location.address,
      coordinates: location.coordinates
    });
  };

  for (const route of activityRoutes) {
    addLocation(route.origin);
    addLocation(route.destination);

    const routeKey = `${normalizeKey(route.origin.address)}->${normalizeKey(route.destination.address)}`;
    const currentRoute = routeStats.get(routeKey);
    if (currentRoute) {
      currentRoute.count += 1;
      if (route.timestamp > currentRoute.timestamp) {
        currentRoute.fare = route.fare;
        currentRoute.distance = route.distance;
        currentRoute.timestamp = route.timestamp;
      }
    } else {
      routeStats.set(routeKey, {
        count: 1,
        origin: route.origin,
        destination: route.destination,
        fare: route.fare,
        distance: route.distance,
        timestamp: route.timestamp
      });
    }
  }

  const commonPlaces = Array.from(locationStats.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 4)
    .map(([key, value], index) => ({
      id: `common-${index + 1}-${key.replace(/[^a-z0-9]+/g, "-")}`,
      type: "common",
      label: value.label,
      address: value.address,
      coordinates: value.coordinates,
      icon: inferPlaceIcon(value.label, value.address)
    }));

  const sortedRoutes = Array.from(routeStats.entries()).sort((a, b) => b[1].count - a[1].count);

  const commutes = sortedRoutes.slice(0, 3).map(([key, route], index) => ({
    id: `commute-${index + 1}-${key.replace(/[^a-z0-9]+/g, "-")}`,
    route: `${route.origin.label} → ${route.destination.label}`,
    schedule: formatCommuteSchedule(index),
    origin: {
      address: route.origin.address,
      coordinates: route.origin.coordinates
    },
    destination: {
      address: route.destination.address,
      coordinates: route.destination.coordinates
    },
    distance: route.distance,
    fare: route.fare
  }));

  const upcoming = commutes.slice(0, 3).map((commute, index) => ({
    id: `upcoming-${index + 1}-${commute.id}`,
    time: formatUpcomingTime(index),
    route: commute.route,
    status: "Scheduled",
    vehicle: "EV Sedan",
    origin: {
      address: commute.origin.address,
      coordinates: commute.origin.coordinates
    },
    destination: {
      address: commute.destination.address,
      coordinates: commute.destination.coordinates
    },
    distance: commute.distance,
    fare: commute.fare
  }));

  return { commonPlaces, commutes, upcoming };
}

const DEFAULT_INSIGHT_COORDINATES: Coordinates = { lat: 0.3476, lng: 32.5825 };

function ensureInsightCoordinates(
  coordinates?: { lat?: number; lng?: number } | null,
  fallback: Coordinates = DEFAULT_INSIGHT_COORDINATES
): Coordinates {
  if (
    coordinates &&
    typeof coordinates.lat === "number" &&
    Number.isFinite(coordinates.lat) &&
    typeof coordinates.lng === "number" &&
    Number.isFinite(coordinates.lng)
  ) {
    return { lat: coordinates.lat, lng: coordinates.lng };
  }
  return fallback;
}

function toIsoTimestamp(timestamp?: string): string {
  if (!timestamp) {
    return new Date().toISOString();
  }
  const parsed = Date.parse(timestamp);
  if (Number.isNaN(parsed)) {
    return new Date().toISOString();
  }
  return new Date(parsed).toISOString();
}

function toInsightPoint(
  location:
    | { label?: string | null; address?: string | null; coordinates?: { lat?: number; lng?: number } }
    | null
    | undefined,
  fallbackAddress: string,
  fallbackCoordinates: Coordinates
): RideInsightPoint {
  const address = location?.address?.trim() || location?.label?.trim() || fallbackAddress;
  const label = location?.label?.trim() || address.split(",")[0]?.trim() || fallbackAddress;
  return {
    label,
    address,
    coordinates: ensureInsightCoordinates(location?.coordinates, fallbackCoordinates)
  };
}

function buildRideInsightRoutes(ride: RideState): RideInsightRoute[] {
  const requestOrigin = ride.request.origin;
  const requestDestination = ride.request.destination;
  const originFallbackCoordinates = ensureInsightCoordinates(requestOrigin?.coordinates);
  const destinationFallbackCoordinates = ensureInsightCoordinates(
    requestDestination?.coordinates,
    { lat: originFallbackCoordinates.lat + 0.01, lng: originFallbackCoordinates.lng + 0.01 }
  );
  const routes: RideInsightRoute[] = [];

  const appendRoute = (params: {
    origin?: { label?: string | null; address?: string | null; coordinates?: { lat?: number; lng?: number } } | null;
    destination?: { label?: string | null; address?: string | null; coordinates?: { lat?: number; lng?: number } } | null;
    fare?: string;
    distance?: string;
    timestamp?: string;
  }): void => {
    if (!params.origin || !params.destination) {
      return;
    }

    const origin = toInsightPoint(params.origin, "Pickup location", originFallbackCoordinates);
    const destination = toInsightPoint(params.destination, "Destination", destinationFallbackCoordinates);

    if (normalizeKey(origin.address) === normalizeKey(destination.address)) {
      return;
    }

    routes.push({
      origin,
      destination,
      fare: params.fare || "UGX 0",
      distance: params.distance || "—",
      timestamp: toIsoTimestamp(params.timestamp)
    });
  };

  ride.history.forEach((trip) => {
    appendRoute({
      origin: trip.pickup,
      destination: trip.dropoff,
      fare: trip.fareEstimate,
      distance: trip.distance,
      timestamp: trip.completedAt || trip.startedAt
    });
  });

  if (ride.activeTrip) {
    appendRoute({
      origin: ride.activeTrip.pickup ?? requestOrigin,
      destination: ride.activeTrip.dropoff ?? requestDestination,
      fare: ride.activeTrip.fareEstimate,
      distance: ride.activeTrip.distance,
      timestamp: ride.activeTrip.startedAt
    });
  }

  if (!routes.length && requestOrigin && requestDestination) {
    appendRoute({
      origin: requestOrigin,
      destination: requestDestination,
      fare: ride.activeTrip?.fareEstimate,
      distance: ride.activeTrip?.distance,
      timestamp: ride.request.scheduleTime
    });
  }

  return routes;
}

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
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            transform: "translateY(-2px)"
          }
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.6 }}>
          {/* Time and Route */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{ 
                  fontSize: 13, 
                  fontWeight: 600, 
                  letterSpacing: "-0.01em", 
                  mb: 0.25
                }}
              >
                {ride.time} – {ride.route}
              </Typography>
              <Typography
                variant="caption"
                sx={{ 
                  fontSize: 10.5, 
                  color: (t) => t.palette.text.secondary
                }}
              >
                {ride.status} · {ride.vehicle}
              </Typography>
            </Box>
            <Chip
              label={ride.status}
              size="small"
              sx={{
                height: 20,
                fontSize: 9,
                fontWeight: 600,
                bgcolor: ride.status === "Scheduled" ? "#D1FAE5" : "#FEF3C7",
                color: ride.status === "Scheduled" ? "#064E3B" : "#78350F",
                flexShrink: 0
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: uiTokens.radius.xl,
            minWidth: 280
          }
        }}
      >
        <DialogTitle sx={{ fontSize: 16, fontWeight: 600 }}>
          Cancel Ride?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ fontSize: 13, color: "text.secondary" }}>
            Are you sure you want to cancel this scheduled ride? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button
            onClick={() => setCancelDialogOpen(false)}
            sx={{ textTransform: "none", color: "text.secondary" }}
          >
            Keep Ride
          </Button>
          <Button
            onClick={handleCancelConfirm}
            sx={{
              textTransform: "none",
              bgcolor: "#FF4C4C",
              color: "white",
              "&:hover": {
                bgcolor: "#E63946"
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
        borderRadius: uiTokens.radius.xl,
        bgcolor: (t) =>
          t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: (t) =>
          t.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          transform: "translateY(-2px)"
        }
      }}
    >
      <CardContent sx={{ px: 1.75, py: 1.6 }}>
        {/* Route Line */}
        <Typography
          variant="subtitle2"
          sx={{ 
            fontSize: 14, 
            fontWeight: 600, 
            letterSpacing: "-0.01em", 
            mb: 0.5,
            color: (t) => t.palette.text.primary
          }}
        >
          {commute.route}
        </Typography>

        {/* Schedule Line */}
        <Typography
          variant="caption"
          sx={{ 
            fontSize: 11, 
            color: (t) => t.palette.text.secondary,
            mb: 1.5,
            display: "block"
          }}
        >
          {commute.schedule}
        </Typography>

        {/* Action Button on Right */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography
              variant="caption"
              sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
            >
              {commute.distance} • {commute.fare}
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onRequest();
            }}
            sx={{
              borderRadius: uiTokens.radius.xl,
              px: 2,
              py: 0.5,
              bgcolor: "#03CD8C",
              color: "#FFFFFF",
              fontWeight: 600,
              textTransform: "none",
              fontSize: 11,
              "&:hover": {
                bgcolor: "#22C55E"
              }
            }}
          >
            Book now
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
        borderRadius: uiTokens.radius.xl,
        cursor: onSelect ? "pointer" : "default",
        bgcolor: (theme) =>
          theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: (theme) =>
          theme.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.8)",
        boxShadow: selected
          ? "0 2px 8px rgba(0,0,0,0.1)"
          : "0 1px 3px rgba(0,0,0,0.08)",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          transform: "translateY(-1px)"
        },
        "&:active": {
          transform: "translateY(0px)"
        }
      }}
    >
      <CardContent sx={{ py: 1.5, px: 1.75, position: "relative" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: uiTokens.radius.xl,
              bgcolor: "rgba(249,115,22,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {icon}
          </Box>
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em", mb: 0.5 }}
            >
              {label}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
              <PlaceRoundedIcon sx={{ fontSize: 14, color: "#F97316" }} />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
              >
                {address}
              </Typography>
            </Box>
          </Box>
        </Box>
        <ArrowForwardIosRoundedIcon
          sx={{
            fontSize: 14,
            color: (theme) => theme.palette.text.secondary,
            opacity: 0.5,
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)"
          }}
        />
      </CardContent>
    </Card>
  );
}

function EnterDestinationMainScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { ride } = useAppData();
  
  // Check if this is a shared ride mode from query parameter
  const searchParams = new URLSearchParams(location.search);
  const isSharedRideMode = searchParams.get("mode") === "share";
  
  const [tab, setTab] = useState("common");
  const [helperState, setHelperState] = useState("idle");
  const [selectedPlace, setSelectedPlace] = useState<string | PlaceSuggestion | null>(null);
  const [whereTo, setWhereTo] = useState("");
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<Coordinates | null>(null);
  const [dismissedUpcomingRideIds, setDismissedUpcomingRideIds] = useState<string[]>([]);

  const insightRoutes = useMemo(() => buildRideInsightRoutes(ride), [ride]);
  const rideInsights = useMemo(() => deriveRideInsights(insightRoutes), [insightRoutes]);
  const savedLocations = rideInsights.commonPlaces;
  const dailyCommutes = rideInsights.commutes;
  const hasRideActivity = insightRoutes.length > 0;

  const upcomingRides = useMemo(
    () => rideInsights.upcoming.filter((rideItem) => !dismissedUpcomingRideIds.includes(rideItem.id)),
    [dismissedUpcomingRideIds, rideInsights.upcoming]
  );

  useEffect(() => {
    setDismissedUpcomingRideIds((previous) =>
      previous.filter((id) => rideInsights.upcoming.some((rideItem) => rideItem.id === id))
    );
  }, [rideInsights.upcoming]);

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
          if (!route) {
            setRouteData(null);
            return;
          }
          setRouteData({
            distance: `${route.distanceKm.toFixed(1)} km`,
            duration: `${Math.max(1, Math.round(route.durationMin))} min`,
            path: route.path
          });
        } catch (error) {
          console.error("Error calculating route:", error);
          setRouteData(null);
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
    setDismissedUpcomingRideIds((previous) =>
      previous.includes(ride.id) ? previous : [...previous, ride.id]
    );
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
    } else if (type === "book-someone") {
      navigate("/rides/enter/details", {
        state: {
          bookForSomeone: true
        }
      });
    } else if (type === "commutes-manage") {
      navigate("/rides/commutes");
    } else if (type === "upcoming-all") {
      navigate("/rides/upcoming");
    } else {
      setHelperState(type);
    }
  };

  const quickActions = [
    { key: "book-someone", label: "Book for someone" }
  ];

  const topMapBleedSx = {
    position: "relative",
    width: {
      xs: "calc(100% + (var(--rider-shell-content-px-xs, 20px) * 2))",
      md: "calc(100% + (var(--rider-shell-content-px-md, 24px) * 2))"
    },
    ml: {
      xs: "calc(var(--rider-shell-content-px-xs, 20px) * -1)",
      md: "calc(var(--rider-shell-content-px-md, 24px) * -1)"
    },
    mr: {
      xs: "calc(var(--rider-shell-content-px-xs, 20px) * -1)",
      md: "calc(var(--rider-shell-content-px-md, 24px) * -1)"
    },
    overflow: "hidden"
  } as const;

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
    let typedCoordinates: Coordinates | null = null;
    if (typeof place === "string") {
      setWhereTo(place);
      const suggestions = await searchPlaces(place);
      const first = suggestions[0];
      typedCoordinates = first?.coordinates ?? { lat: 0.3476, lng: 32.5825 };
      setDestinationCoords(typedCoordinates);
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
          destinationCoords:
            typeof place === "string"
              ? typedCoordinates ?? { lat: 0.3476, lng: 32.5825 }
              : place.coordinates,
          isSharedRide: isSharedRideMode // Pass shared ride mode to details screen
        }
      });
    }, 1000);
  };



  return (
    <ScreenScaffold disableTopPadding>
      {/* Map section */}
      <Box sx={topMapBleedSx}>
        <MapShell
          preset="home"
          rounded={false}
          sx={{ mb: 0, height: { xs: "62dvh", md: "55vh" } }}
          showControls
          canvasSx={{ background: uiTokens.map.canvasEmphasis }}
          mapCenter={destinationCoords ?? currentLocation ?? { lat: 0.3476, lng: 32.5825 }}
          routePolyline={routeData?.path ?? []}
          mapMarkers={[
            ...(currentLocation
              ? [{ id: "current-location", position: currentLocation, label: "Current location" }]
              : []),
            ...(destinationCoords
              ? [{ id: "destination", position: destinationCoords, label: "Destination", color: "#F77F00" }]
              : [])
          ]}
        >
          {/* Route info overlay */}
          {routeData && (
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                left: 8,
                right: 8,
                bgcolor: "var(--evz-map-overlay-bg)",
                border: "1px solid var(--evz-map-overlay-border)",
                borderRadius: "var(--evz-radius-md)",
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
        </MapShell>
      </Box>

      <SectionHeader
        title="Where to today?"
        subtitle={isSharedRideMode ? "Shared ride active" : "Book an electric ride today"}
      />

      <Box
        sx={{
          bgcolor: "transparent",
          px: 0,
          pt: 0,
          pb: 2,
          mb: 0
        }}
      >

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
                  borderRadius: uiTokens.radius.xl,
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
                borderRadius: uiTokens.radius.xl,
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

      <InfoCard title="Quick actions">
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            overflowY: "hidden",
            gap: 1,
            pb: 0.5,
            "&::-webkit-scrollbar": { height: 4 },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: (t) => (t.palette.mode === "light" ? "#D1D5DB" : "#4B5563")
            },
            WebkitOverflowScrolling: "touch"
          }}
        >
          {quickActions.map((action) => (
            <Chip
              key={action.key}
              label={action.label}
              size="small"
              onClick={() => handleQuickAction(action.key)}
              icon={action.icon}
              sx={{
                fontSize: 11,
                height: 28,
                flexShrink: 0,
                bgcolor: uiTokens.surfaces.cardMuted,
                border: uiTokens.borders.subtle,
                cursor: "pointer",
                "&:hover": {
                  bgcolor: (t) => (t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,1)")
                }
              }}
            />
          ))}
        </Box>
      </InfoCard>

      {hasRideActivity && (
        <>
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
            borderRadius: uiTokens.radius.xl,
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
            {savedLocations.length > 0 ? (
	              <ActionGrid minWidth={220}>
	                {savedLocations.map((location) => (
	                  <Box key={location.id}>
	                    <CommonPlaceCard
	                      icon={location.icon}
	                      label={location.label}
                      address={location.address}
                      selected={selectedPlace === location.id}
                      onSelect={() => handleSelectPlace(location.id)}
                    />
	                  </Box>
	                ))}
	              </ActionGrid>
            ) : (
              <Card
                elevation={0}
                sx={{
                  borderRadius: uiTokens.radius.xl,
                  bgcolor: (t) =>
                    t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                  border: (t) =>
                    t.palette.mode === "light"
                      ? "1px solid rgba(209,213,219,0.9)"
                      : "1px solid rgba(51,65,85,0.9)"
                }}
              >
                <CardContent sx={{ py: 3, textAlign: "center" }}>
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

            {dailyCommutes.length > 0 ? (
              <Box>
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
                  borderRadius: uiTokens.radius.xl,
                  bgcolor: (t) =>
                    t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                  border: (t) =>
                    t.palette.mode === "light"
                      ? "1px solid rgba(209,213,219,0.9)"
                      : "1px solid rgba(51,65,85,0.9)"
                }}
              >
                <CardContent sx={{ py: 4, textAlign: "center" }}>
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
            {upcomingRides.length > 0 ? (
              <Box>
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
                  borderRadius: uiTokens.radius.xl,
                  bgcolor: (t) =>
                    t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                  border: (t) =>
                    t.palette.mode === "light"
                      ? "1px solid rgba(209,213,219,0.9)"
                      : "1px solid rgba(51,65,85,0.9)"
                }}
              >
                <CardContent sx={{ py: 4, textAlign: "center" }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", mb: 1, display: "block" }}>
                    No upcoming rides scheduled
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate("/rides/enter")}
                    sx={{
                      mt: 1.5,
                      borderRadius: uiTokens.radius.xl,
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
        </>
      )}

      {/* Helper panel */}
      {helperState !== "idle" && (
        <Card
          elevation={0}
          sx={{
            mb: 1.2,
            borderRadius: uiTokens.radius.xl,
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
              {helperState === "book-someone" &&
                "Next step: open ride details with one-off rider fields so you can enter the person’s name and phone number."}
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

      {/* Route summary card - inline with shell scroll flow */}
      {(selectedPlace || destinationCoords) && routeData && (
        <Box
          sx={{
            pt: 1.5
          }}
        >
          <Card
            elevation={0}
            sx={{
              borderRadius: uiTokens.radius.xl,
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
                        borderRadius: uiTokens.radius.xl,
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
                      borderRadius: uiTokens.radius.xl,
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
      </ScreenScaffold>
  );
}

export default function RidesDashboard(): React.JSX.Element {
  return <EnterDestinationMainScreen />;
}
