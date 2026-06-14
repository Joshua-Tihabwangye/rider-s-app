import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Stack,
  Chip,
  IconButton
} from "@mui/material";

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
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import TwoWheelerRoundedIcon from "@mui/icons-material/TwoWheelerRounded";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ScreenScaffold from "../components/ScreenScaffold";
import RideTypeCard, { type RideTypeCardData } from "../components/rides/RideTypeCard";
import ActionGrid from "../components/primitives/ActionGrid";
import InfoCard from "../components/primitives/InfoCard";
import SectionHeader from "../components/primitives/SectionHeader";
import MapShell from "../components/maps/MapShell";
import LocationAutocompleteField from "../components/location/LocationAutocompleteField";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";
import { useLiveLocation } from "../contexts/LiveLocationContext";
import { useRiderSharedRidesEnabled } from "../contexts/useRiderBackendCapabilities";
import type { RideState } from "../store/types";
import {
  calculateRoute,
  type Coordinates,
  type PlaceSuggestion
} from "../services/maps";
import { getLocationPermissionState, watchLiveLocation, type LocationPermissionState } from "../services/location";


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
  alternatives: Coordinates[][];
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
                sx={{ fontSize: 11, color: "text.secondary" }}
              >
                {address}
              </Typography>
            </Box>
          </Box>
        </Box>
        <ArrowForwardIosRoundedIcon
          sx={{
            fontSize: 14,
            color: "text.secondary",
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
  const sharedRidesEnabled = useRiderSharedRidesEnabled();
  const { ride, sharedLocationState, actions } = useAppData();
  const { riderLocation } = useLiveLocation();
  const { updateRideRequest, updateSharedLocationState } = actions;
  const updateRideRequestRef = useRef(updateRideRequest);
  const updateSharedLocationStateRef = useRef(updateSharedLocationState);
  useEffect(() => {
    updateRideRequestRef.current = updateRideRequest;
  }, [updateRideRequest]);
  useEffect(() => {
    updateSharedLocationStateRef.current = updateSharedLocationState;
  }, [updateSharedLocationState]);
  
  // Check if this is a shared ride mode from query parameter
  const searchParams = new URLSearchParams(location.search);
  const isSharedRideMode = searchParams.get("mode") === "share" && sharedRidesEnabled;
  
  const [tab, setTab] = useState("common");
  const [helperState, setHelperState] = useState("idle");
  const [selectedPlace, setSelectedPlace] = useState<string | PlaceSuggestion | null>(null);
  const [selectedAutocompleteOption, setSelectedAutocompleteOption] = useState<PlaceSuggestion | null>(null);
  const [whereTo, setWhereTo] = useState("");
  const [locationPermission, setLocationPermission] = useState<LocationPermissionState>("prompt");
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(
    riderLocation ?? sharedLocationState.pickupCoords ?? ride.request.origin?.coordinates ?? null
  );
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<Coordinates | null>(null);
  const [dismissedUpcomingRideIds, setDismissedUpcomingRideIds] = useState<string[]>([]);
  const lastRouteQueryRef = useRef<{ key: string; at: number } | null>(null);

  const insightRoutes = useMemo(() => buildRideInsightRoutes(ride), [ride]);
  const rideInsights = useMemo(() => deriveRideInsights(insightRoutes), [insightRoutes]);
  const savedLocations = rideInsights.commonPlaces;
  const dailyCommutes = rideInsights.commutes;
  const hasRideActivity = insightRoutes.length > 0;
  const dashboardWorkflow = ride.workflow.dashboard;

  const recommendedRideTypes = dashboardWorkflow.recommendedRideTypes;
  const dashboardRideTypeCards = useMemo<RideTypeCardData[]>(
    () =>
      recommendedRideTypes.slice(0, 3).map((item, index) => ({
        id: item.id,
        name: item.name,
        capacity: item.capacity,
        image: item.image,
        objectPosition: "center 36%",
        foregroundPosition:
          index === 0 ? "center 33%" : index === 1 ? "center 31%" : "center 34%",
        objectFit: "cover",
        price: item.price
      })),
    [recommendedRideTypes]
  );
  const popularDestinations = useMemo(
    () =>
      dashboardWorkflow.popularDestinations.map((destination) => ({
        ...destination,
        icon:
          destination.icon === "airport" ? (
            <FlightTakeoffRoundedIcon sx={{ fontSize: 24, color: "#11B86A" }} />
          ) : destination.icon === "work" ? (
            <WorkRoundedIcon sx={{ fontSize: 24, color: "#11B86A" }} />
          ) : (
            <HomeRoundedIcon sx={{ fontSize: 24, color: "#11B86A" }} />
          ),
        destination:
          destination.id === "home"
            ? ride.savedPlaces[0]?.address ?? destination.destination
            : destination.destination
      })),
    [dashboardWorkflow.popularDestinations, ride.savedPlaces]
  );

  const upcomingRides = useMemo(
    () => rideInsights.upcoming.filter((rideItem) => !dismissedUpcomingRideIds.includes(rideItem.id)),
    [dismissedUpcomingRideIds, rideInsights.upcoming]
  );

  useEffect(() => {
    setDismissedUpcomingRideIds((previous) => {
      const next = previous.filter((id) => rideInsights.upcoming.some((rideItem) => rideItem.id === id));
      if (next.length === previous.length && next.every((id, index) => id === previous[index])) {
        return previous;
      }
      return next;
    });
  }, [rideInsights.upcoming]);

  // Live rider location with permission awareness and battery-safe watch options.
  useEffect(() => {
    let disposeWatch = () => {};
    let mounted = true;

    getLocationPermissionState()
      .then((permission) => {
        if (!mounted) return;
        setLocationPermission(permission);
        if (permission === "denied" || permission === "unsupported") {
          return;
        }

        disposeWatch = watchLiveLocation(
          (coords) => {
            setCurrentLocation(coords);
          },
          (error) => {
            if (error.code === 1) {
              setLocationPermission("denied");
            }
          },
          {
            enableHighAccuracy: false,
            timeoutMs: 10000,
            maximumAgeMs: 15000
          }
        );
      })
      .catch(() => {
        if (!mounted) return;
        setLocationPermission("prompt");
      });

    return () => {
      mounted = false;
      disposeWatch();
    };
  }, []);

  useEffect(() => {
    if (!currentLocation) {
      return;
    }
    const currentOriginCoords = ride.request.origin?.coordinates;
    const sameOriginCoords =
      Boolean(currentOriginCoords) &&
      currentOriginCoords?.lat === currentLocation.lat &&
      currentOriginCoords?.lng === currentLocation.lng;
    const samePickupCoords =
      Boolean(sharedLocationState.pickupCoords) &&
      sharedLocationState.pickupCoords?.lat === currentLocation.lat &&
      sharedLocationState.pickupCoords?.lng === currentLocation.lng;
    const sameRiderCoords =
      Boolean(riderLocation) &&
      riderLocation?.lat === currentLocation.lat &&
      riderLocation?.lng === currentLocation.lng;

    if (!sameOriginCoords) {
      updateRideRequestRef.current({
        origin: {
          label: ride.request.origin?.label || "Current location",
          address: ride.request.origin?.address || "Your current location",
          coordinates: currentLocation
        }
      });
    }

    if (samePickupCoords && sameRiderCoords) {
      return;
    }
    updateSharedLocationStateRef.current({
      riderLocation: currentLocation,
      pickupCoords: currentLocation
    });
  }, [
    currentLocation,
    ride.request.origin?.address,
    ride.request.origin?.coordinates?.lat,
    ride.request.origin?.coordinates?.lng,
    ride.request.origin?.label,
    sharedLocationState.pickupCoords,
    riderLocation
  ]);

  // Calculate route when destination is selected
  useEffect(() => {
    if (destinationCoords && currentLocation) {
      const routeKey = `${currentLocation.lat.toFixed(5)},${currentLocation.lng.toFixed(5)}->${destinationCoords.lat.toFixed(5)},${destinationCoords.lng.toFixed(5)}`;
      const now = Date.now();
      if (lastRouteQueryRef.current?.key === routeKey && now - lastRouteQueryRef.current.at < 15000) {
        return;
      }
      lastRouteQueryRef.current = { key: routeKey, at: now };
      const calculateRoutePreview = async () => {
        try {
          const route = await calculateRoute(currentLocation, destinationCoords);
          if (!route) {
            setRouteData(null);
            updateSharedLocationStateRef.current({
              pickupCoords: currentLocation,
              destinationCoords,
              routePolyline: [],
              routeAlternativePolylines: [],
              routeDistanceKm: null,
              routeDurationMin: null
            });
            return;
          }
          setRouteData({
            distance: `${route.distanceKm.toFixed(1)} km`,
            duration: `${Math.max(1, Math.round(route.durationMin))} min`,
            path: route.path,
            alternatives: route.alternativePaths
          });
          updateSharedLocationStateRef.current({
            pickupCoords: currentLocation,
            destinationCoords,
            routePolyline: route.path,
            routeAlternativePolylines: route.alternativePaths,
            routeDistanceKm: route.distanceKm,
            routeDurationMin: route.durationMin
          });
        } catch (error) {
          console.error("Error calculating route:", error);
          setRouteData(null);
          updateSharedLocationStateRef.current({
            pickupCoords: currentLocation,
            destinationCoords,
            routePolyline: [],
            routeAlternativePolylines: [],
            routeDistanceKm: null,
            routeDurationMin: null
          });
        }
      };
      calculateRoutePreview();
    } else {
      lastRouteQueryRef.current = null;
      if (routeData !== null) {
        setRouteData(null);
      }
      const hasRouteStateToClear =
        sharedLocationState.routePolyline.length > 0 ||
        sharedLocationState.routeAlternativePolylines.length > 0 ||
        sharedLocationState.routeDistanceKm !== null ||
        sharedLocationState.routeDurationMin !== null;
      if (hasRouteStateToClear) {
        updateSharedLocationStateRef.current({
          routePolyline: [],
          routeAlternativePolylines: [],
          routeDistanceKm: null,
          routeDurationMin: null
        });
      }
    }
  }, [
    currentLocation,
    destinationCoords,
    routeData,
    sharedLocationState.routeAlternativePolylines.length,
    sharedLocationState.routeDistanceKm,
    sharedLocationState.routeDurationMin,
    sharedLocationState.routePolyline.length
  ]);


  const handleCommuteRequest = (commute: Commute): void => {
    // Navigate to Enter Destination screen (RA05) with commute data
    navigate("/rides/enter/details", {
      state: {
        pickup: commute.origin.address,
        pickupCoords: commute.origin.coordinates,
        destination: commute.destination.address,
        destinationCoords: commute.destination.coordinates,
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
          bookForSomeone: true,
          riderType: "manual"
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

  const quickActions: Array<{ key: string; label: string; icon: React.ReactElement }> = [
    {
      key: "book-someone",
      label: "Book for someone",
      icon: <PersonRoundedIcon sx={{ fontSize: 16 }} />
    }
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
      setSelectedAutocompleteOption(null);
      setWhereTo(location.address);
      setDestinationCoords(location.coordinates);
      setHelperState("idle");
      updateRideRequest({
        origin: currentLocation
          ? {
              label: "Current location",
              address: "Your current location",
              coordinates: currentLocation
            }
          : ride.request.origin,
        destination: {
          label: location.label,
          address: location.address,
          coordinates: location.coordinates
        }
      });
      updateSharedLocationState({
        pickupCoords: currentLocation ?? null,
        destinationCoords: location.coordinates,
        routeAlternativePolylines: [],
        riderLocation: currentLocation ?? null
      });
      
      // Navigate to Enter Destination screen (RA05) after a brief delay to show route preview
      setTimeout(() => {
        navigate("/rides/enter/details", {
          state: {
            pickup: currentLocation ? "Current location" : ride.request.origin?.label || "",
            pickupCoords: currentLocation ?? null,
            destination: location.address,
            destinationCoords: location.coordinates,
            placeType: place
          }
        });
      }, dashboardWorkflow.navigateToDetailsDelayMs);
    }
  };

  const handlePlaceSelect = async (place: PlaceSuggestion): Promise<void> => {
    setWhereTo(place.description);
    setSelectedAutocompleteOption(place);
    setSelectedPlace(place);
    setDestinationCoords(place.coordinates);
    const selectedDestination = {
      label: place.description.split(",")[0]?.trim() || place.description,
      address: place.description,
      coordinates: place.coordinates,
      placeId: place.placeId
    };
    updateRideRequest({
      origin: currentLocation
        ? {
            label: "Current location",
            address: "Your current location",
            coordinates: currentLocation
          }
        : ride.request.origin,
      destination: selectedDestination
    });
    updateSharedLocationState({
      pickupCoords: currentLocation ?? null,
      destinationCoords: selectedDestination.coordinates ?? null,
      routeAlternativePolylines: [],
      riderLocation: currentLocation ?? null
    });
    
    // Navigate to Enter Destination screen (RA05) after route calculation
    setTimeout(() => {
      navigate("/rides/enter/details", {
        state: {
          pickup: currentLocation ? "Current location" : ride.request.origin?.label || "",
          pickupCoords: currentLocation ?? null,
          destination: place.description,
          destinationCoords: selectedDestination.coordinates ?? null,
          isSharedRide: isSharedRideMode // Pass shared ride mode to details screen
        }
      });
    }, dashboardWorkflow.navigateToDetailsDelayMs);
  };

  const rentalLikeTypographySx = {
    "& .MuiTypography-root": {
      fontSize: "12.2px !important",
      lineHeight: 1.35
    },
    "& .MuiInputBase-input": {
      fontSize: "12.6px !important"
    },
    "& .MuiInputBase-input::placeholder": {
      fontSize: "12.6px !important",
      opacity: 1
    },
    "& .MuiFormHelperText-root": {
      fontSize: "11px !important"
    },
    "& .MuiChip-label": {
      fontSize: "12.2px !important"
    },
    "& .MuiButton-root": {
      fontSize: "14px !important"
    },
    "& .MuiMenuItem-root": {
      fontSize: "12.4px !important"
    }
  } as const;

  return (
    <ScreenScaffold>
      <Box sx={rentalLikeTypographySx}>
      <Stack spacing={1.4}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #E4E7EC",
            p: 1.45,
            bgcolor: "#F8FBF9"
          }}
        >
          <Stack
            direction="row"
            spacing={1.3}
            alignItems="stretch"
            sx={{
              minHeight: { xs: 176, sm: 198 },
              borderRadius: 2.4,
              backgroundColor: "#F8FBF9"
            }}
          >
            <Box sx={{ flex: "0 0 58%", pt: 1.2, pb: 1, pr: { xs: 0.8, sm: 1.4 }, minWidth: 0 }}>
              <Stack direction="row" spacing={1.1} alignItems="flex-start" sx={{ mb: 0.8 }}>
                <IconButton
                  onClick={() => navigate("/home")}
                  sx={{
                    width: 30,
                    height: 30,
                    color: "#344054",
                    p: 0,
                    flexShrink: 0,
                    bgcolor: "transparent",
                    border: "none",
                    "&:hover": {
                      bgcolor: "transparent"
                    }
                  }}
                >
                  <ArrowBackRoundedIcon sx={{ fontSize: 22 }} />
                </IconButton>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 56 / 2, fontWeight: 700, lineHeight: 1.1, color: "#101828" }}>
                    Book a ride
                  </Typography>
                  <Typography sx={{ fontSize: 56 / 2, fontWeight: 700, lineHeight: 1.1, color: "#F97316", mb: 0.8 }}>
                    in seconds
                  </Typography>
                </Box>
              </Stack>
              <Typography sx={{ fontSize: 16, color: "#475467", mb: 1.5 }}>
                Safe, affordable, and eco-friendly rides across your city.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/rides/enter/details")}
                endIcon={
                  <Box sx={{ width: 28, height: 28, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.95)", display: "grid", placeItems: "center" }}>
                    <ArrowForwardIosRoundedIcon sx={{ fontSize: 14 }} />
                  </Box>
                }
                sx={{
                  textTransform: "none",
                  borderRadius: 99,
                  px: 3.4,
                  py: 1,
                  fontSize: 16,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  color: "#FFFFFF",
                  background: "#11B86A",
                  "&:hover": { background: "#0F9B5D" }
                }}
              >
                Book Now
              </Button>
            </Box>
            <Box
              sx={{
                flex: "0 0 42%",
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "#F8FBF9",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end"
              }}
            >
              <Box
                component="img"
                src="/rides-ui/EV--6.jpg"
                alt="Ride vehicle"
                onError={(event) => {
                  const target = event.currentTarget;
                  if (target.src.includes("/rides-ui/EV--1.png")) return;
                  target.src = "/rides-ui/EV--1.png";
                }}
                sx={{
                  width: "100%",
                  maxWidth: { xs: 210, sm: 280 },
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "right center",
                  filter: "drop-shadow(0 12px 20px rgba(15,23,42,0.22))",
                  display: "block",
                  pointerEvents: "none"
                }}
              />
            </Box>
          </Stack>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E4E7EC", p: 1 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
            {[
              { label: "Ride Now", icon: <TwoWheelerRoundedIcon sx={{ fontSize: 29, color: "#11B86A" }} />, onClick: () => navigate("/rides/enter/details") },
              { label: "Book for someone", icon: <PersonRoundedIcon sx={{ fontSize: 29, color: "#F97316" }} />, onClick: () => navigate("/rides/enter/details", { state: { bookForSomeone: true, riderType: "manual" } }) },
              { label: "Promotions", icon: <LocalOfferRoundedIcon sx={{ fontSize: 29, color: "#11B86A" }} />, onClick: () => navigate("/rides/promotions") },
              { label: "History", icon: <HistoryRoundedIcon sx={{ fontSize: 29, color: "#F97316" }} />, onClick: () => navigate("/rides/history/past") }
            ].map((item, index) => (
              <Box
                key={item.label}
                onClick={item.onClick}
                sx={{
                  cursor: "pointer",
                  py: 1,
                  px: 0.5,
                  textAlign: "center",
                  borderRight: index < 3 ? "1px solid #EAECF0" : "none"
                }}
              >
                <Box sx={{ width: 52, height: 52, borderRadius: "50%", bgcolor: "#F3FAF7", mx: "auto", mb: 0.7, display: "grid", placeItems: "center" }}>
                  {item.icon}
                </Box>
                <Typography sx={{ fontSize: 17, fontWeight: 500 }}>{item.label}</Typography>
              </Box>
            ))}
          </Box>
        </Card>

        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#101828" }}>Popular destinations</Typography>
          </Stack>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 1 }}>
            {popularDestinations.map((item) => (
              <Card
                key={item.id}
                elevation={0}
                onClick={() =>
                  navigate("/rides/enter/details", {
                    state: {
                      pickup: "Current location",
                      destination: item.destination,
                      isSharedRide: isSharedRideMode
                    }
                  })
                }
                sx={{ borderRadius: 2.5, border: "1px solid #E4E7EC", p: 1.1, cursor: "pointer", textAlign: "center" }}
              >
                <Box sx={{ width: 44, height: 44, borderRadius: "50%", bgcolor: "#F3FAF7", display: "grid", placeItems: "center", mb: 0.7, mx: "auto" }}>
                  {item.icon}
                </Box>
                <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{item.title}</Typography>
                <Typography sx={{ fontSize: 14, color: "#667085" }}>{item.subtitle}</Typography>
              </Card>
            ))}
          </Box>
        </Box>

        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#101828" }}>Recommended ride types</Typography>
          </Stack>
          <Box className="ride-type-grid">
            {dashboardRideTypeCards.map((item) => (
              <RideTypeCard
                key={item.id}
                ride={item}
                selected={false}
                interactive={false}
                showMeta={false}
              />
            ))}
          </Box>
        </Box>

        <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #D6EFE4", bgcolor: "#F2FBF7", p: 1.1 }}>
          <Stack direction="row" spacing={1.1} alignItems="center">
            <Box component="img" src="/rides-ui/gift-promo.svg" alt="Gift promo" sx={{ width: 64, height: 44, objectFit: "contain" }} />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 19, fontWeight: 700, color: "#101828" }}>
                Get <Box component="span" sx={{ color: "#F97316" }}>20% off</Box> your next 3 rides
              </Typography>
              <Typography sx={{ fontSize: 15, color: "#667085" }}>Valid till 31 May 2024</Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => navigate("/rides/promotions")}
              sx={{
                textTransform: "none",
                borderRadius: 99,
                borderColor: "#11B86A",
                color: "#11B86A",
                fontWeight: 700,
                px: 2.1
              }}
            >
              Claim Now
            </Button>
          </Stack>
        </Card>
      </Stack>
      </Box>
    </ScreenScaffold>
  );
}

export default function RidesDashboard(): React.JSX.Element {
  return <EnterDestinationMainScreen />;
}
