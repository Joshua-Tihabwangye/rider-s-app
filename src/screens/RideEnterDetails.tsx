import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
	Box,
	IconButton,
	TextField,
	InputAdornment,
	Typography,
	Chip,
	Card,
	CardContent,
	Button,
	Stack,
	Select,
	MenuItem,
		FormControl,
		Menu,
		Alert,
	} from "@mui/material";

import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
	import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import ScreenScaffold from "../components/ScreenScaffold";
import MapShell from "../components/maps/MapShell";
import SwitchRiderModal from "../components/SwitchRiderModal";
import TripTypeModal from "../components/TripTypeModal";
import AddStopModal from "../components/AddStopModal";
import PhoneBookPickerButton from "../components/PhoneBookPickerButton";
import LocationAutocompleteField from "../components/location/LocationAutocompleteField";
import RideTypeCard, { type RideTypeCardData } from "../components/rides/RideTypeCard";
import { useAppData } from "../contexts/AppDataContext";
import { calculateRouteThroughPoints } from "../services/maps";
import { getLocationPermissionState, watchLiveLocation } from "../services/location";
import {
	DEFAULT_ROUND_TRIP_RETURN_PATTERN,
	type RoundTripReturnPattern,
	RIDE_MAX_STOPS
} from "../features/rides/constants";

const DESTINATION_INPUT_DEBOUNCE_MS = 550;
const KAMPALA_CENTER = { lat: 0.3476, lng: 32.5825 };

interface Stop {
	id: string;
	value: string;
	coordinates?: { lat: number; lng: number };
	address?: string;
}

type RouteModeOption = "single_stop" | "multi_stop";
type TripModeOption = "one_way" | "round_trip";
type RouteModeSelectionValue = "__choose_route__" | RouteModeOption | "round_trip";
type RequiredFieldKey =
	| "pickup"
	| "destination"
	| "stops"
	| "tripOwner"
	| "routeMode"
	| "returnDateTime";

function inferRouteMode(value: unknown): RouteModeOption {
	if (value === "multi_stop" || value === "Multi-stop") {
		return "multi_stop";
	}
	return "single_stop";
}

function inferTripMode(value: unknown): TripModeOption {
	if (value === "round_trip" || value === "Round Trip") {
		return "round_trip";
	}
	return "one_way";
}

function deriveTripTypeLabel(routeMode: RouteModeOption, tripMode: TripModeOption): "One Way" | "Round Trip" | "Multi-stop" {
	if (routeMode === "multi_stop") {
		return "Multi-stop";
	}
	return tripMode === "round_trip" ? "Round Trip" : "One Way";
}

function cleanStopAddress(value: string): string {
	return value.trim().replace(/\s+/g, " ");
}

function removeConsecutiveDuplicateStops(stops: Stop[]): Stop[] {
	return stops.reduce<Stop[]>((acc, stop) => {
		const normalized = cleanStopAddress(stop.address || stop.value);
		if (!normalized) return acc;
		const previous = acc[acc.length - 1];
		if (previous) {
			const previousAddress = cleanStopAddress(previous.address || previous.value).toLowerCase();
			if (previousAddress === normalized.toLowerCase()) {
				return acc;
			}
		}
		acc.push({ ...stop, value: normalized, address: normalized });
		return acc;
	}, []);
}

function uniqueStops(stops: Stop[]): Stop[] {
	const seen = new Set<string>();
	return stops.filter((stop) => {
		const key = cleanStopAddress(stop.address || stop.value).toLowerCase();
		if (!key || seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

function areSameCoordinates(
	a?: { lat: number; lng: number } | null,
	b?: { lat: number; lng: number } | null
): boolean {
	if (!a || !b) return false;
	return Math.abs(a.lat - b.lat) < 0.000001 && Math.abs(a.lng - b.lng) < 0.000001;
}

function toInputDate(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

function toInputTime(date: Date): string {
	const hour = String(date.getHours()).padStart(2, "0");
	const minute = String(date.getMinutes()).padStart(2, "0");
	return `${hour}:${minute}`;
}

function formatScheduleDateLabel(date: Date): string {
	const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	return `${dayNames[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

function formatScheduleTimeLabel(date: Date): string {
	return date.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true
	});
}

type RideTypeOption = "Personal" | "Business";
const VALID_RIDE_TYPES: readonly RideTypeOption[] = ["Personal", "Business"];

function normalizeRideType(value: unknown): RideTypeOption {
	const raw = typeof value === "string" ? value.trim() : "";
	return VALID_RIDE_TYPES.includes(raw as RideTypeOption)
		? (raw as RideTypeOption)
		: "Personal";
}

interface SmoothHeightPanelProps {
	open: boolean;
	children: React.ReactNode;
}

function SmoothHeightPanel({
	open,
	children,
}: SmoothHeightPanelProps): React.JSX.Element {
	return (
		<Box
			sx={{
				height: open ? "auto" : "0px",
				opacity: open ? 1 : 0,
				overflow: open ? "visible" : "hidden",
				transition: "opacity 220ms ease-in-out",
			}}
		>
			<Box>{children}</Box>
		</Box>
	);
}


function EnterDestinationScreen(): React.JSX.Element {
	const navigate = useNavigate();
	const location = useLocation();
	const theme = useTheme();
	const { ride, sharedLocationState, actions } = useAppData();
	const updateSharedLocationStateRef = useRef(actions.updateSharedLocationState);
	const updateRideRequestRef = useRef(actions.updateRideRequest);
	useEffect(() => {
		updateSharedLocationStateRef.current = actions.updateSharedLocationState;
	}, [actions.updateSharedLocationState]);
	useEffect(() => {
		updateRideRequestRef.current = actions.updateRideRequest;
	}, [actions.updateRideRequest]);
	const updateSharedLocationState = useCallback((patch: Parameters<typeof actions.updateSharedLocationState>[0]) => {
		updateSharedLocationStateRef.current(patch);
	}, []);
	const updateRideRequest = useCallback((patch: Parameters<typeof actions.updateRideRequest>[0]) => {
		updateRideRequestRef.current(patch);
	}, []);

	// Get initial values from navigation state
	const initialState = location.state || {};
	const isBookingForSomeone = Boolean(initialState.bookForSomeone);

	const hasInitialPickupLabel =
		typeof initialState.pickup === "string" && initialState.pickup.trim().length > 0;
	const defaultPickupLabel = hasInitialPickupLabel ? initialState.pickup : "Current location";
	const [pickup, setPickup] = useState(defaultPickupLabel);
	const [pickupCoords, setPickupCoords] = useState(
		initialState.pickupCoords ||
			(defaultPickupLabel === "Current location"
				? sharedLocationState.riderLocation || sharedLocationState.pickupCoords
				: sharedLocationState.pickupCoords || ride.request.origin?.coordinates) ||
			null,
	);

	// Keep current-location pickup in sync with live rider coordinates.
	useEffect(() => {
		if (pickup === "Current location" && sharedLocationState.riderLocation) {
			if (!pickupCoords || !areSameCoordinates(pickupCoords, sharedLocationState.riderLocation)) {
				setPickupCoords(sharedLocationState.riderLocation);
				updateSharedLocationState({ pickupCoords: sharedLocationState.riderLocation });
			}
		}
	}, [pickup, pickupCoords, sharedLocationState.riderLocation, updateSharedLocationState]);
	const [destination, setDestination] = useState(
		initialState.destination || ride.request.destination?.label || "",
	);
	const [debouncedDestination, setDebouncedDestination] = useState(
		initialState.destination || ride.request.destination?.label || "",
	);
	const [destinationCoords, setDestinationCoords] = useState(
		initialState.destinationCoords ||
			sharedLocationState.destinationCoords ||
			ride.request.destination?.coordinates ||
			null,
	);
	const [passengers, setPassengers] = useState(initialState.passengers || ride.request.passengers || 1);
	const [customPassengers, setCustomPassengers] = useState("");
	const [rideType, setRideType] = useState(
		normalizeRideType(initialState.rideType || ride.request.rideType),
	);
	const [tripOwnerChosen, setTripOwnerChosen] = useState(false);
	const [routeMode, setRouteMode] = useState<RouteModeOption>(
		inferRouteMode(initialState.routeMode || initialState.tripType),
	);
	const [tripMode, setTripMode] = useState<TripModeOption>(
		inferTripMode(initialState.tripMode || initialState.tripType),
	);
	const [tripConfigChosen, setTripConfigChosen] = useState(false);
	const now = useMemo(() => new Date(), []);
	const initialScheduledDateTime = useMemo(() => {
		if (initialState.scheduledDateTime) {
			const parsed = new Date(initialState.scheduledDateTime);
			if (!Number.isNaN(parsed.getTime())) {
				return parsed;
			}
		}
		if (typeof ride.request.scheduleTime === "string" && ride.request.scheduleTime) {
			const parsed = new Date(ride.request.scheduleTime);
			if (!Number.isNaN(parsed.getTime())) {
				return parsed;
			}
		}
		return null;
	}, [initialState.scheduledDateTime, ride.request.scheduleTime]);
	const [schedule, setSchedule] = useState(initialState.schedule || (ride.request.schedule === "later" ? "Schedule for later" : "Now"));
	const [scheduleTime, setScheduleTime] = useState(
		initialState.scheduleTime || ride.request.scheduleTime || "",
	);
	const [isScheduled, setIsScheduled] = useState(
		initialState.isScheduled || ride.request.schedule === "later" || false,
	);
	const [selectedDate, setSelectedDate] = useState<string>(
		initialScheduledDateTime ? toInputDate(initialScheduledDateTime) : toInputDate(now),
	);
	const [selectedTime, setSelectedTime] = useState<string>(
		initialScheduledDateTime ? toInputTime(initialScheduledDateTime) : toInputTime(new Date(now.getTime() + 30 * 60 * 1000)),
	);
	const [scheduledDateTimeIso, setScheduledDateTimeIso] = useState<string | null>(
		initialScheduledDateTime ? initialScheduledDateTime.toISOString() : null,
	);
	const [returnDate, setReturnDate] = useState(
		initialState.returnDate || null,
	);
	const [returnTime, setReturnTime] = useState(
		initialState.returnTime || null,
	);
	const [returnDateTime, setReturnDateTime] = useState(
		initialState.returnDateTime || null,
	);
	const [returnPattern, setReturnPattern] = useState<RoundTripReturnPattern>(
		initialState.returnPattern ||
			ride.request.roundTripConfig?.returnPattern ||
			DEFAULT_ROUND_TRIP_RETURN_PATTERN,
	);
	const [scheduleMenuAnchor, setScheduleMenuAnchor] =
		useState<HTMLElement | null>(null);
	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [fieldErrors, setFieldErrors] = useState<Partial<Record<RequiredFieldKey, string>>>({});
	const [showSwitchRiderModal, setShowSwitchRiderModal] = useState(false);
	const [routePolyline, setRoutePolyline] = useState<{ lat: number; lng: number }[]>([]);
	const [routeAlternatives, setRouteAlternatives] = useState<Array<{ lat: number; lng: number }[]>>([]);
	const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
	const [isMapExpanded, setIsMapExpanded] = useState(false);
	const [showTripTypeModal, setShowTripTypeModal] = useState(false);
	const [showAddStopModal, setShowAddStopModal] = useState(false);
	const lastRouteQueryRef = useRef<{ key: string; inFlight: boolean } | null>(null);
	const [selectedContact, setSelectedContact] = useState(
		initialState.selectedContact || ride.request.riderContact || null,
	);
	const initialRiderType = initialState.riderType || ride.request.riderType || "personal";
	const [riderType, setRiderType] = useState(
		initialRiderType,
	);
	const [bookedPersonName, setBookedPersonName] = useState(
		initialState.bookedPersonName || ride.request.riderContact?.name || "",
	);
	const [bookedPersonPhone, setBookedPersonPhone] = useState(
		initialState.bookedPersonPhone || ride.request.riderContact?.phone || "",
	);
	const destinationLabelForRequest = useMemo(
		() => (destinationCoords ? destination : debouncedDestination),
		[destinationCoords, destination, debouncedDestination]
	);
	const mapCenter = pickupCoords ?? sharedLocationState.riderLocation ?? ride.request.origin?.coordinates ?? KAMPALA_CENTER;
	const handleUseCurrentLocation = useCallback(() => {
		if (!sharedLocationState.riderLocation) {
			return;
		}
		setPickup("Current location");
		setPickupCoords(sharedLocationState.riderLocation);
		updateSharedLocationState({ pickupCoords: sharedLocationState.riderLocation });
		setShowError(false);
		setErrorMessage("");
		clearFieldError("pickup");
	}, [sharedLocationState.riderLocation, updateSharedLocationState]);

	useEffect(() => {
		if (!destination.trim()) {
			setDebouncedDestination("");
			return;
		}
		const timeoutId = window.setTimeout(() => {
			setDebouncedDestination(destination);
		}, DESTINATION_INPUT_DEBOUNCE_MS);
		return () => window.clearTimeout(timeoutId);
	}, [destination]);
	const [stops, setStops] = useState<Stop[]>(
		initialState.stops ||
			(ride.request.stops?.length
				? ride.request.stops.map((stop) => ({
						id: stop.label,
						value: stop.label,
						coordinates: stop.coordinates,
						address: stop.address,
				  }))
				: []),
	);
	const [selectedRideLevel, setSelectedRideLevel] = useState(
		initialState.serviceLevel || ride.request.serviceLevel || ride.options[0]?.id || "scooter",
	);
	const MAX_STOPS = RIDE_MAX_STOPS;
	const isMultiStopMode = routeMode === "multi_stop";
	const isRoundTripMode = tripMode === "round_trip";
	const tripType = deriveTripTypeLabel(routeMode, tripMode);

	const rideTypeCards = ride.options.slice(0, 3).map((option, index): RideTypeCardData => ({
		id: option.id,
		name:
			index === 0 ? "EV Lite" : index === 1 ? "EV Comfort" : "EV XL",
		capacity: index === 0 ? 1 : index === 1 ? 4 : 7,
		image:
			index === 0
				? "/rides-ui/EV--1.png"
				: index === 1
					? "/rides-ui/EV--3.png"
					: "/rides-ui/EV--4.png",
		objectPosition: "center 36%",
		foregroundPosition: index === 0 ? "center 33%" : index === 1 ? "center 31%" : "center 34%",
		objectFit: "cover",
		price: option.fare.trim()
	}));

	// Calculate route with waypoints for multi-stop and round-trip.
	useEffect(() => {
		const calculateAndSetRoute = async () => {
			if (!pickupCoords) {
				setRoutePolyline([]);
				setRouteAlternatives([]);
				updateSharedLocationState({
					routePolyline: [],
					routeAlternativePolylines: [],
					routeDistanceKm: null,
					routeDurationMin: null
				});
				return;
			}

			const normalizedStops = removeConsecutiveDuplicateStops(stops);
			const coordinateStops = normalizedStops.filter((stop) => Boolean(stop.coordinates));
			const isMultiStop = routeMode === "multi_stop";
			const isRoundTrip = tripMode === "round_trip";
			const routeDestinationCoords =
				isMultiStop
					? coordinateStops[coordinateStops.length - 1]?.coordinates ?? null
					: destinationCoords;
			const waypointCoords = isMultiStop
				? coordinateStops
						.slice(0, Math.max(0, coordinateStops.length - 1))
						.map((stop) => stop.coordinates!)
				: [];
			const baseRoutePoints = [
				pickupCoords,
				...waypointCoords,
				...(routeDestinationCoords ? [routeDestinationCoords] : [])
			];

			const roundTripTail =
				isRoundTrip && routeDestinationCoords
					? returnPattern === "reverse_stops"
						? [...waypointCoords].reverse().concat([pickupCoords])
						: [pickupCoords]
					: [];

			const routePointCandidates = baseRoutePoints.concat(roundTripTail);
			const routePoints = routePointCandidates.filter((point, index, points) => {
				if (!point) return false;
				if (index === 0) return true;
				const previous = points[index - 1];
				if (!previous) return true;
				return (
					Math.abs(previous.lat - point.lat) > 0.000001 ||
					Math.abs(previous.lng - point.lng) > 0.000001
				);
			});

			if (routePoints.length < 2) {
				lastRouteQueryRef.current = null;
				setRoutePolyline([]);
				setRouteAlternatives([]);
				updateSharedLocationState({
					pickupCoords,
					destinationCoords: routeDestinationCoords,
					routePolyline: [],
					routeAlternativePolylines: [],
					routeDistanceKm: null,
					routeDurationMin: null
				});
				return;
			}

			const routeKey = routePoints
				.map((point) => `${point.lat.toFixed(5)},${point.lng.toFixed(5)}`)
				.join("->");
			if (lastRouteQueryRef.current?.key === routeKey && lastRouteQueryRef.current.inFlight) {
				return;
			}
			lastRouteQueryRef.current = { key: routeKey, inFlight: true };
			setIsCalculatingRoute(true);
			try {
				const route = await calculateRouteThroughPoints(routePoints);
				if (route) {
					setRoutePolyline(route.path);
					setRouteAlternatives(route.alternativePaths);
					updateSharedLocationState({
						pickupCoords,
						destinationCoords: routeDestinationCoords,
						routePolyline: route.path,
						routeAlternativePolylines: route.alternativePaths,
						routeDistanceKm: route.distanceKm,
						routeDurationMin: route.durationMin
					});
				} else {
					lastRouteQueryRef.current = null;
					setRoutePolyline([]);
					setRouteAlternatives([]);
					updateSharedLocationState({
						pickupCoords,
						destinationCoords: routeDestinationCoords,
						routePolyline: [],
						routeAlternativePolylines: [],
						routeDistanceKm: null,
						routeDurationMin: null
					});
				}
			} catch (error) {
				console.error("Failed to calculate route:", error);
				setRoutePolyline([]);
				setRouteAlternatives([]);
				updateSharedLocationState({
					pickupCoords,
					destinationCoords: routeDestinationCoords,
					routePolyline: [],
					routeAlternativePolylines: [],
					routeDistanceKm: null,
					routeDurationMin: null
				});
			} finally {
				setIsCalculatingRoute(false);
				if (lastRouteQueryRef.current?.key === routeKey) {
					lastRouteQueryRef.current = { key: routeKey, inFlight: false };
				}
			}
		};

		void calculateAndSetRoute();
	}, [debouncedDestination, destinationCoords, pickupCoords, returnPattern, routeMode, stops, tripMode, updateSharedLocationState]);

	useEffect(() => {
		let mounted = true;
		let dispose = () => {};

		getLocationPermissionState().then((permission) => {
			if (!mounted || pickup !== "Current location") return;
			if (permission === "denied" || permission === "unsupported") return;

			dispose = watchLiveLocation(
				(coords) => {
					setPickupCoords(coords);
					updateSharedLocationState({
						riderLocation: coords,
						pickupCoords: coords
					});
				},
				() => {},
				{
					enableHighAccuracy: false,
					timeoutMs: 10000,
					maximumAgeMs: 15000
				}
			);
		});

		return () => {
			mounted = false;
			dispose();
		};
	}, [pickup, updateSharedLocationState]);

	// Update destination when returning from map screen
	useEffect(() => {
		if (initialState.fromMap && initialState.destination) {
			setDestination(initialState.destination);
			setDestinationCoords(initialState.destinationCoords || null);
			// Update shared state with destination coordinates from map picker
			if (initialState.destinationCoords) {
				updateSharedLocationState({
					destinationCoords: initialState.destinationCoords
				});
			}
		}
	}, [initialState.fromMap, initialState.destination, initialState.destinationCoords, updateSharedLocationState]);

	// Update schedule when returning from schedule screen
	useEffect(() => {
		if (initialState.schedule) {
			setSchedule(initialState.schedule);
			setScheduleTime(initialState.scheduleTime || "");
			setIsScheduled(initialState.isScheduled || false);
		}
		if (initialState.scheduledDateTime) {
			const parsed = new Date(initialState.scheduledDateTime);
			if (!Number.isNaN(parsed.getTime())) {
				setSelectedDate(toInputDate(parsed));
				setSelectedTime(toInputTime(parsed));
				setScheduledDateTimeIso(parsed.toISOString());
			}
		}
		if (initialState.routeMode === "single_stop" || initialState.routeMode === "multi_stop") {
			setRouteMode(initialState.routeMode);
			setTripConfigChosen(true);
		}
		if (initialState.tripMode === "one_way" || initialState.tripMode === "round_trip") {
			setTripMode(initialState.tripMode);
			setTripConfigChosen(true);
		}
		if (initialState.returnPattern === "direct" || initialState.returnPattern === "reverse_stops") {
			setReturnPattern(initialState.returnPattern);
		}
	}, [
		initialState.schedule,
		initialState.scheduleTime,
		initialState.isScheduled,
		initialState.scheduledDateTime,
		initialState.routeMode,
		initialState.tripMode,
		initialState.returnPattern,
	]);

	useEffect(() => {
		if (!isScheduled) {
			setSchedule("Now");
			setScheduleTime("");
			setScheduledDateTimeIso(null);
			return;
		}

		if (!selectedDate || !selectedTime) {
			return;
		}

		const nextScheduledDate = new Date(`${selectedDate}T${selectedTime}:00`);
		if (Number.isNaN(nextScheduledDate.getTime())) {
			return;
		}
		setSchedule(formatScheduleDateLabel(nextScheduledDate));
		setScheduleTime(formatScheduleTimeLabel(nextScheduledDate));
		setScheduledDateTimeIso(nextScheduledDate.toISOString());
	}, [isScheduled, selectedDate, selectedTime]);

	// Update selected contact when returning from Switch Rider modal
	useEffect(() => {
		if (initialState.selectedContact) {
			setSelectedContact(initialState.selectedContact);
			setRiderType(initialState.riderType || "contact");
		} else if (initialState.riderType === "personal") {
			setSelectedContact(null);
			setRiderType("personal");
		}
	}, [initialState.selectedContact, initialState.riderType]);

	useEffect(() => {
		if (!isBookingForSomeone) return;
		setTripOwnerChosen(true);
		if (riderType === "personal") {
			setRiderType("manual");
		}
	}, [isBookingForSomeone, riderType]);

	useEffect(() => {
		const originLocation =
			pickup.trim().length > 0
				? { label: pickup, address: pickup, coordinates: pickupCoords ?? undefined }
				: null;
		const explicitDestinationLocation =
			destinationLabelForRequest.trim().length > 0
				? {
						label: destinationLabelForRequest,
						address: destinationLabelForRequest,
						coordinates: destinationCoords ?? undefined,
				  }
				: null;
		const stopLocations = uniqueStops(removeConsecutiveDuplicateStops(stops))
			.map((stop) => ({
				label: stop.value,
				address: stop.address || stop.value,
				coordinates: stop.coordinates,
			}));
		const normalizedTripMode = tripMode;
		const isRoundTrip = normalizedTripMode === "round_trip";
		const usesStopsAsRoutePoints = routeMode === "multi_stop";
		const destinationLocation =
			usesStopsAsRoutePoints
				? stopLocations[stopLocations.length - 1] ?? null
				: explicitDestinationLocation;
		const intermediateStops =
			usesStopsAsRoutePoints
				? stopLocations.slice(0, Math.max(0, stopLocations.length - 1))
				: [];
		const routePoints = [
			...(originLocation ? [originLocation] : []),
			...intermediateStops,
			...(destinationLocation ? [destinationLocation] : []),
		];
		const normalizedRoutePoints = (() => {
			if (!isRoundTrip || !originLocation || !destinationLocation) {
				return routePoints;
			}
			const reverseStops =
				returnPattern === "reverse_stops"
					? [...intermediateStops].reverse()
					: [];
			return [...routePoints, ...reverseStops, originLocation];
		})();
		const scheduleMode = isScheduled ? "later" : "now";
		const contactName =
			selectedContact?.name ||
			selectedContact?.fullName ||
			selectedContact?.label ||
			"";
		const contactPhone =
			selectedContact?.phone || selectedContact?.phoneNumber || "";
		const manualBookedName = bookedPersonName.trim();
		const manualBookedPhone = bookedPersonPhone.trim();
		const isContactRide =
			isBookingForSomeone || riderType === "contact" || riderType === "manual";
		const bookedForName = isBookingForSomeone
			? manualBookedName
			: riderType === "contact"
				? contactName
				: "";
		const bookedForPhone = isBookingForSomeone
			? manualBookedPhone
			: riderType === "contact"
				? contactPhone
				: "";

		updateRideRequest({
			origin: originLocation,
			destination: destinationLocation,
			stops: intermediateStops,
			routePoints: normalizedRoutePoints,
			passengers,
			tripType,
			tripMode: normalizedTripMode,
			routeMode,
			returnToOrigin: isRoundTrip,
			maxStops: MAX_STOPS,
			roundTripConfig: {
				returnDateTime: returnDateTime || null,
				sameDay: true,
				returnPattern
			},
			rideType,
			serviceLevel: selectedRideLevel,
			schedule: scheduleMode,
			scheduleTime: scheduleMode === "later" ? scheduleTime : "",
			riderType: isContactRide ? "contact" : "personal",
			riderContact:
				isBookingForSomeone
					? manualBookedName || manualBookedPhone
						? { name: manualBookedName, phone: manualBookedPhone }
						: null
					: riderType === "contact" && contactName
						? { name: contactName, phone: contactPhone }
						: null,
			bookedFor: isContactRide
				? {
					source: riderType === "manual" || isBookingForSomeone ? "manual" : "contact",
					name: bookedForName || undefined,
					phone: bookedForPhone || undefined,
					relation: selectedContact?.relation || undefined,
					contactId: selectedContact?.id
				  }
				: { source: "self" },
		});
	}, [
		pickup,
		pickupCoords,
		destinationCoords,
		destinationLabelForRequest,
		stops,
		passengers,
		tripType,
		routeMode,
		tripMode,
		rideType,
		isScheduled,
		schedule,
		scheduleTime,
		returnDateTime,
		returnPattern,
		selectedRideLevel,
		riderType,
		selectedContact,
		bookedPersonName,
		bookedPersonPhone,
		isBookingForSomeone,
			updateRideRequest,
		routeMode,
		tripMode,
		tripType,
		returnDateTime,
		returnPattern,
		MAX_STOPS,
	]);

	const passengerOptions = [1, 2, 3, 4, 5, 6];
	const scheduleOptions = ["Now", "Schedule for later"];
	const normalizedRouteStops = uniqueStops(removeConsecutiveDuplicateStops(stops));
	const hasDuplicateStops =
		normalizedRouteStops.length !== removeConsecutiveDuplicateStops(stops).length;
	const hasStopLimitExceeded = normalizedRouteStops.length > RIDE_MAX_STOPS;

	const hasBookForSomeoneDetails =
		bookedPersonName.trim().length > 1 && bookedPersonPhone.trim().length >= 7;

	const clearFieldError = (field: RequiredFieldKey): void => {
		setFieldErrors((prev) => {
			if (!prev[field]) return prev;
			const next = { ...prev };
			delete next[field];
			return next;
		});
	};

	const clearAllFieldErrors = (): void => {
		setFieldErrors({});
	};

	const routeModeSelectionValue: RouteModeSelectionValue = !tripConfigChosen
		? "__choose_route__"
		: isRoundTripMode
			? "round_trip"
			: routeMode;

	const handleRouteModeSelectionChange = (selected: string): void => {
		setShowError(false);
		setErrorMessage("");
		if (selected === "__choose_route__") {
			setTripConfigChosen(false);
			clearFieldError("routeMode");
			return;
		}

		setTripConfigChosen(true);
		clearFieldError("routeMode");

		if (selected === "round_trip") {
			setRouteMode("single_stop");
			setTripMode("round_trip");
			setShowTripTypeModal(true);
			return;
		}

		if (selected === "multi_stop") {
			setRouteMode("multi_stop");
			setTripMode("one_way");
			setReturnDate(null);
			setReturnTime(null);
			setReturnDateTime(null);
			setReturnPattern(DEFAULT_ROUND_TRIP_RETURN_PATTERN);
			if (stops.length === 0) {
				if (destination.trim()) {
					setStops([
						{
							id: "A",
							value: destination,
							address: destination,
							coordinates: destinationCoords ?? undefined
						}
					]);
					setDestination("");
					setDestinationCoords(null);
				} else {
					setStops([{ id: "A", value: "" }]);
				}
			}
			return;
		}

		if (selected === "single_stop") {
			setRouteMode("single_stop");
			setTripMode("one_way");
			setReturnDate(null);
			setReturnTime(null);
			setReturnDateTime(null);
			setReturnPattern(DEFAULT_ROUND_TRIP_RETURN_PATTERN);
			if (!destination.trim() && stops.length > 0) {
				const fallback = stops[stops.length - 1];
				if (fallback?.value?.trim()) {
					setDestination(fallback.value.trim());
					setDestinationCoords(fallback.coordinates ?? null);
				}
			}
		}
	};

	const getMissingFieldErrors = (): Partial<Record<RequiredFieldKey, string>> => {
		const nextErrors: Partial<Record<RequiredFieldKey, string>> = {};

		if (!pickup.trim() || !pickupCoords) {
			nextErrors.pickup = "Choose pickup location.";
		}

		if (!isBookingForSomeone && !tripOwnerChosen) {
			nextErrors.tripOwner = "Choose trip owner.";
		}

		if (!tripConfigChosen) {
			nextErrors.routeMode = "Choose route mode.";
		}

		if (tripConfigChosen) {
			if (isMultiStopMode) {
				if (normalizedRouteStops.length < 1) {
					nextErrors.stops = "Add at least one stop.";
				}
			} else if (!destination.trim() || !destinationCoords) {
				nextErrors.destination = "Choose destination.";
			}

			if (isRoundTripMode && (!returnDate || !returnTime)) {
				nextErrors.returnDateTime = "Select return date and time.";
			}
		}

		if (isBookingForSomeone && !hasBookForSomeoneDetails) {
			nextErrors.tripOwner = "Complete booked person details.";
		}

		return nextErrors;
	};

	const handleSwitchLocations = () => {
		const tempPickup = pickup;
		const tempPickupCoords = pickupCoords;
		setPickup(destination);
		setPickupCoords(destinationCoords);
		setDestination(tempPickup);
		setDestinationCoords(tempPickupCoords);

		// Update shared state with swapped coordinates
		updateSharedLocationState({
			pickupCoords: destinationCoords,
			destinationCoords: tempPickupCoords
		});
		setShowError(false);
		setErrorMessage("");
		clearAllFieldErrors();
	};

	const handleScheduleSelect = (option: string): void => {
		if (option === "Schedule for later") {
			navigate("/rides/schedule", {
				state: {
					pickup,
					destination,
					passengers,
					rideType,
					tripType,
					routeMode,
					tripMode,
					schedule,
					scheduleTime,
					isScheduled,
					returnPattern,
				},
			});
		} else {
			setSchedule(option);
			setScheduleTime("");
			setIsScheduled(false);
		}
		setScheduleMenuAnchor(null);
	};

	const handleScheduleClick = (
		e: React.MouseEvent<HTMLButtonElement>,
	): void => {
		// If scheduled, reopen the scheduling modal
		if (isScheduled) {
			navigate("/rides/schedule", {
				state: {
					pickup,
					destination,
					passengers,
					rideType,
					tripType,
					routeMode,
					tripMode,
					schedule,
					scheduleTime,
					isScheduled,
					returnPattern,
				},
			});
		} else {
			// Otherwise open the menu
			setScheduleMenuAnchor(e.currentTarget);
		}
	};

	const handleContinue = (
		riderData: {
			riderType?: string;
			selectedContact?: {
				id: number;
				name: string;
				relation: string;
				phone: string;
				initials: string;
			} | null;
			manualPhone?: string;
			passengers?: number;
			[key: string]: unknown;
		} | null = null,
	): void => {
		const missingFieldErrors = getMissingFieldErrors();
		if (Object.keys(missingFieldErrors).length > 0) {
			setFieldErrors(missingFieldErrors);
			setErrorMessage("Please complete all highlighted fields before continuing.");
			setShowError(true);
			return;
		}

		clearAllFieldErrors();
		setShowError(false);
		setErrorMessage("");

		if (hasStopLimitExceeded) {
			setErrorMessage(`You can only add up to ${RIDE_MAX_STOPS} stops.`);
			setShowError(true);
			return;
		}

		if (hasDuplicateStops) {
			setErrorMessage("Please remove duplicate stops before continuing.");
			setShowError(true);
			return;
		}

		if (isMultiStopMode && normalizedRouteStops.length < 1) {
			setErrorMessage("Add at least one stop before continuing.");
			setShowError(true);
			return;
		}

		if (!isMultiStopMode && !destination.trim()) {
			setErrorMessage("Please select a destination before continuing.");
			setShowError(true);
			return;
		}

		// Validate scheduled date/time hasn't expired
		if (isScheduled) {
			if (!scheduledDateTimeIso) {
				setShowError(true);
				setErrorMessage("Please choose a date and time for Ride Later.");
				return;
			}
			const scheduledDate = new Date(scheduledDateTimeIso);
			if (Number.isNaN(scheduledDate.getTime()) || scheduledDate <= new Date()) {
				setShowError(true);
				setErrorMessage("The selected date/time has expired. Please choose a future time.");
				return;
			}
		}

		// Use rider data from modal if provided, otherwise use current state
		const baseState = riderData || {
			pickup,
			pickupCoords,
			destination,
			destinationCoords,
			passengers,
			rideType,
			serviceLevel: selectedRideLevel,
			tripType,
			routeMode,
			tripMode,
			schedule: isScheduled ? schedule : null,
			scheduleTime,
			isScheduled,
			selectedContact,
			riderType,
			bookForSomeone: isBookingForSomeone,
			bookedPersonName: bookedPersonName.trim(),
			bookedPersonPhone: bookedPersonPhone.trim(),
			returnDate,
			returnTime,
			returnDateTime,
			returnPattern,
		};

		// Create a clean, serializable state object
		// Convert Date objects to ISO strings for serialization
		const tripState = {
			...baseState,
			scheduledDateTime: scheduledDateTimeIso ?? undefined,
			// Ensure selectedContact is a plain object (not containing any non-serializable data)
			selectedContact: baseState.selectedContact
				? {
						id: baseState.selectedContact.id,
						name: baseState.selectedContact.name,
						relation: baseState.selectedContact.relation,
						phone: baseState.selectedContact.phone,
						initials: baseState.selectedContact.initials,
					}
				: null,
			// Include return trip data for Round Trip
			returnDate: baseState.returnDate || null,
			returnTime: baseState.returnTime || null,
			returnDateTime: baseState.returnDateTime || null,
			routeMode,
			tripMode,
			returnPattern,
			// Include stops data if in multi-stop mode
			stops: isMultiStopMode
				? normalizedRouteStops
				: [],
			isMultiStopMode: isMultiStopMode,
			bookForSomeone: isBookingForSomeone,
			bookedPersonName: bookedPersonName.trim(),
			bookedPersonPhone: bookedPersonPhone.trim(),
			bookedFor:
				isBookingForSomeone || riderType === "contact" || riderType === "manual"
					? {
						source: riderType === "manual" || isBookingForSomeone ? "manual" : "contact",
						name:
							bookedPersonName.trim() ||
							(baseState.selectedContact?.name as string | undefined) ||
							undefined,
						phone:
							bookedPersonPhone.trim() ||
							(baseState.selectedContact?.phone as string | undefined) ||
							undefined,
						relation: baseState.selectedContact?.relation as string | undefined,
						contactId: baseState.selectedContact?.id as number | undefined
					  }
					: { source: "self" },
		};

		// Always start a fresh ride flow so previous trip legs/status don't leak
		// into a newly selected trip mode (single, round trip, or multi-stop).
		actions.setActiveTrip(null);
			actions.resetTemporaryStopState();
			navigate("/rides/searching", {
				state: tripState,
			});
		};

	const handleSwitchRiderContinue = (riderData: {
		riderType: string;
		selectedContact: {
			id: number;
			name: string;
			relation: string;
			phone: string;
			initials: string;
		} | null;
		manualPhone?: string;
		passengers?: number;
		[key: string]: unknown;
	}): void => {
		// Handle continue from Switch Rider modal
		// Update local state with selected contact
		if (riderData.selectedContact) {
			setSelectedContact(riderData.selectedContact);
			setRiderType(riderData.riderType || "contact");
			setBookedPersonName(riderData.selectedContact.name || "");
			setBookedPersonPhone(riderData.selectedContact.phone || "");
		} else if (riderData.riderType === "manual") {
			setSelectedContact(null);
			setRiderType("manual");
			if (typeof riderData.manualPhone === "string") {
				setBookedPersonPhone(riderData.manualPhone);
			}
		} else if (riderData.riderType === "personal") {
			setSelectedContact(null);
			setRiderType("personal");
			setBookedPersonName("");
			setBookedPersonPhone("");
		}
		// Continue with the trip
		handleContinue(riderData);
	};

	const getTripData = () => {
		// Return a clean, serializable object
		return {
			pickup,
			destination,
			passengers,
			rideType,
			serviceLevel: selectedRideLevel,
			tripType,
			routeMode,
			tripMode,
			schedule,
			scheduleTime,
			isScheduled,
			// Convert Date to ISO string if it exists
			scheduledDateTime: scheduledDateTimeIso ?? undefined,
			// Ensure selectedContact is a plain object
			selectedContact: selectedContact
				? {
						id: selectedContact.id,
						name: selectedContact.name,
						relation: selectedContact.relation,
						phone: selectedContact.phone,
						initials: selectedContact.initials,
					}
				: null,
			riderType,
			bookForSomeone: isBookingForSomeone,
			bookedPersonName: bookedPersonName.trim(),
			bookedPersonPhone: bookedPersonPhone.trim(),
			bookedFor:
				isBookingForSomeone || riderType === "contact" || riderType === "manual"
					? {
						source: riderType === "manual" || isBookingForSomeone ? "manual" : "contact",
						name: bookedPersonName.trim() || selectedContact?.name,
						phone: bookedPersonPhone.trim() || selectedContact?.phone,
						relation: selectedContact?.relation,
						contactId: selectedContact?.id
					  }
					: { source: "self" },
			returnPattern,
		};
	};

	// Theme-aware colors
	const contentBg =
		theme.palette.mode === "light"
			? "#FFFFFF"
			: theme.palette.background.paper;
	const accentGreen = "#03CD8C";
	const lightGreen = "rgba(3,205,140,0.1)"; // Light green for active passenger selection
	const mapNormalHeight = { xs: "38vh", md: "46vh" } as const;
	const mapExpandedHeight = {
		xs: "calc(74vh - env(safe-area-inset-bottom, 0px))",
		md: "80vh",
	} as const;
	const topMapBleedSx = {
		position: "relative",
		width: {
			xs: "calc(100% + (var(--rider-shell-content-px-xs, 20px) * 2))",
			md: "calc(100% + (var(--rider-shell-content-px-md, 24px) * 2))",
		},
		ml: {
			xs: "calc(var(--rider-shell-content-px-xs, 20px) * -1)",
			md: "calc(var(--rider-shell-content-px-md, 24px) * -1)",
		},
		mr: {
			xs: "calc(var(--rider-shell-content-px-xs, 20px) * -1)",
			md: "calc(var(--rider-shell-content-px-md, 24px) * -1)",
		},
			mb: {
				xs: 1.25,
				md: 1.5,
			},
			overflow: "visible",
		} as const;
	const routeSummary = useMemo(() => {
		const distance = sharedLocationState.routeDistanceKm;
		const duration = sharedLocationState.routeDurationMin;
		if (!distance || !duration) {
			return {
				distanceLabel: "—",
				durationLabel: "—"
			};
		}
		const distanceLabel =
			distance >= 100
				? `${Math.round(distance)} km`
				: distance >= 10
					? `${distance.toFixed(1)} km`
					: `${distance.toFixed(2)} km`;
		const durationLabel =
			duration < 60
				? `${Math.max(1, Math.round(duration))} min`
				: `${Math.floor(duration / 60)} hr ${Math.round(duration % 60)} min`;
		return {
			distanceLabel,
			durationLabel
		};
	}, [sharedLocationState.routeDistanceKm, sharedLocationState.routeDurationMin]);

	return (
			<ScreenScaffold
				className="ride-enter-details-page"
				disableTopPadding
				disableBottomPadding
				contentSx={{
					gap: 0,
					pb: {
						xs: "calc(92px + env(safe-area-inset-bottom, 0px))",
						md: "calc(84px + env(safe-area-inset-bottom, 0px))"
					},
				}}
			>
				<Box
					className="ride-enter-details-content"
					sx={{
						...topMapBleedSx,
						display: "flex",
						flexDirection: "column",
						flex: "0 0 auto",
					}}
				>
						<MapShell
								fullBleed={false}
								showControls={false}
								showRouteInfo={false}
								resizeKey={isMapExpanded ? "expanded" : "default"}
								sx={{
									height: isMapExpanded ? mapExpandedHeight : mapNormalHeight,
										minHeight: { xs: 280, md: 330 },
									flex: "0 0 auto",
									transition: "height 320ms ease-in-out"
								}}
								mapCenter={mapCenter}
								onRecenter={handleUseCurrentLocation}
								pickupLocation={pickupCoords}
								dropoffLocation={destinationCoords}
								routePolyline={routePolyline}
								routeAlternativePolylines={routeAlternatives}
								routeDistanceKm={sharedLocationState.routeDistanceKm}
								routeDurationMin={sharedLocationState.routeDurationMin}
								canvasSx={{
									background:
										theme.palette.mode === "light"
										? "linear-gradient(160deg, #F2F4F7 0%, #EEF2F6 68%, #E8F5EE 100%)"
										: "linear-gradient(160deg, #1B2D3E 0%, #223A4F 25%, #1A2533 25%, #1A2533 100%)",
								}}
							/>
						<Button
							onClick={() => setIsMapExpanded(!isMapExpanded)}
							aria-label={isMapExpanded ? "Show details panel" : "Expand map"}
							sx={{
								position: "absolute",
								left: "50%",
								bottom: isMapExpanded ? -16 : -22,
								transform: "translateX(-50%)",
								zIndex: 14,
								borderRadius: 999,
								px: 1.4,
								py: 0.4,
								minWidth: 0,
								bgcolor: "var(--evz-map-overlay-bg)",
								border: "1px solid var(--evz-map-control-border)",
								backdropFilter: "blur(8px)",
								WebkitBackdropFilter: "blur(8px)",
								boxShadow: "0 2px 10px rgba(2,6,23,0.2)",
								transition: "all 0.3s ease",
								textTransform: "none",
								color: "#334155",
								fontSize: 12,
								fontWeight: 700,
								"&:hover": { bgcolor: "var(--evz-map-control-bg)" }
							}}
						>
							{isMapExpanded ? <KeyboardArrowUpRoundedIcon sx={{ mr: 0.3 }} /> : <KeyboardArrowDownRoundedIcon sx={{ mr: 0.3 }} />}
							{isMapExpanded ? "Show details" : "Extend map"}
						</Button>
						<Typography
							sx={{
								position: "absolute",
								top: { xs: 14, md: 18 },
								left: "50%",
								transform: "translateX(-50%)",
								zIndex: 7,
								fontSize: 14,
								fontWeight: 700,
								color: "#FFFFFF",
								bgcolor: "rgba(15,23,42,0.55)",
								px: 1.2,
								py: 0.35,
								borderRadius: 99,
								backdropFilter: "blur(4px)"
							}}
						>
							Ride details
						</Typography>
						</Box>
							<Box
								sx={{
									mt: 1.9,
									mb: 0.45,
									minHeight: 28,
									display: "flex",
									gap: 1,
									alignItems: "center",
									flexWrap: "wrap",
								}}
							>
								<Box
									sx={{
										px: 1.2,
										py: 0.5,
										borderRadius: "999px",
										bgcolor: "#0B1530",
										border: "1px solid rgba(16,185,129,0.35)",
										color: "#F8FAFC",
										fontWeight: 700,
										fontSize: 12,
										boxShadow: "0 6px 14px rgba(2,6,23,0.28)"
									}}
								>
									{`${routeSummary.distanceLabel} • ${routeSummary.durationLabel}`}
								</Box>
						</Box>

						{/* Trip Setup Card - Neutral Background */}
					<SmoothHeightPanel open>
					<Box
						className="ride-enter-details-form"
						sx={{
							pt: 1.25,
							mt: 0,
							bgcolor: "transparent",
							borderTopLeftRadius: 0,
							borderTopRightRadius: 0,
							borderTop: "none",
							px: {
								xs: 0.75,
								md: 1.5,
							},
						}}
					>
				<Card
					elevation={0}
					sx={{
						borderRadius: 4,
						bgcolor: contentBg,
						border: "1px solid #E4E7EC",
						boxShadow: "0 2px 8px rgba(16,24,40,0.06)",
						mb: "5px",
					}}
				>
					<CardContent sx={{ px: 2, py: 2 }}>
						<Stack spacing={2}>
								{/* Origin Field with Green Pin */}
						<Box sx={{ position: "relative" }}>
							<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.75 }}>
								<Typography sx={{ fontSize: 12.5, color: "#667085" }}>
									Pickup location
								</Typography>
								<Button
									size="small"
									startIcon={<MyLocationRoundedIcon sx={{ fontSize: 16 }} />}
									onClick={handleUseCurrentLocation}
									sx={{
										textTransform: "none",
										fontWeight: 700,
										fontSize: 12,
										color: "#12B76A",
										px: 1.2,
										borderRadius: 99,
										border: "1px solid #A6F4C5",
										bgcolor: "#ECFDF3"
									}}
								>
									Use current
								</Button>
							</Stack>
							<TextField
								fullWidth
								size="small"
								variant="outlined"
								value={pickup}
								onChange={(e) => {
									const nextValue = e.target.value;
									setPickup(nextValue);
									if (nextValue.trim() !== "Current location") {
										setPickupCoords(null);
										updateSharedLocationState({
											pickupCoords: null,
											routePolyline: [],
											routeAlternativePolylines: [],
											routeDistanceKm: null,
											routeDurationMin: null
										});
									}
									clearFieldError("pickup");
								}}
								onFocus={() => {
									setShowError(false);
									setErrorMessage("");
									clearFieldError("pickup");
								}}
								error={Boolean(fieldErrors.pickup)}
								helperText={fieldErrors.pickup || " "}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<PlaceRoundedIcon
												sx={{
												fontSize: 20,
												color: "#4CAF50",
											}}
											/>
										</InputAdornment>
									),
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												size="small"
												onClick={handleSwitchLocations}
												sx={{
													color: theme.palette.text.secondary,
													"&:hover": {
														bgcolor:
															theme.palette.mode === "light"
															? "rgba(0,0,0,0.05)"
															: "rgba(255,255,255,0.05)",
													},
												}}
											>
												<SwapVertRoundedIcon sx={{ fontSize: 20 }} />
											</IconButton>
										</InputAdornment>
									),
								}}
								sx={{
									"& .MuiOutlinedInput-root": {
										borderRadius: 5,
										bgcolor:
											theme.palette.mode === "light"
												? "rgba(0,0,0,0.05)"
												: "rgba(255,255,255,0.05)",
										color: theme.palette.text.primary,
										"& fieldset": {
											borderColor:
												theme.palette.mode === "light"
													? "rgba(0,0,0,0.15)"
													: "rgba(255,255,255,0.2)",
										},
										"&:hover fieldset": {
											borderColor: accentGreen,
										},
										"&.Mui-focused fieldset": {
											borderColor: accentGreen,
										},
									},
									"& .MuiFormHelperText-root": {
										mt: 0.7,
										mb: -0.25,
									},
								}}
							/>
						</Box>

{/* Single Destination Mode */}
								{!isMultiStopMode && (
									<Box>
										<Typography sx={{ fontSize: 12.5, color: "#667085", mb: 0.75 }}>
											Destination
										</Typography>
										<LocationAutocompleteField
											value={destination}
											onValueChange={(nextValue) => {
												setDestination(nextValue);
												setShowError(false);
												setErrorMessage("");
												clearFieldError("destination");

												if (!nextValue.trim()) {
													setDestinationCoords(null);
													setRoutePolyline([]);
													setRouteAlternatives([]);
													updateSharedLocationState({
														destinationCoords: null,
														routePolyline: [],
														routeAlternativePolylines: [],
														routeDistanceKm: null,
														routeDurationMin: null
													});
													return;
												}

												if (destinationCoords && nextValue.trim() !== destination.trim()) {
													setDestinationCoords(null);
													setRoutePolyline([]);
													setRouteAlternatives([]);
													updateSharedLocationState({
														destinationCoords: null,
														routePolyline: [],
														routeAlternativePolylines: [],
														routeDistanceKm: null,
														routeDurationMin: null
													});
												}
											}}
											onSelectLocation={(selection) => {
												setDestination(selection.address);
												setDestinationCoords(selection.coordinates);
												clearFieldError("destination");
												setRouteAlternatives([]);
												updateSharedLocationState({
													destinationCoords: selection.coordinates,
													routePolyline: [],
													routeAlternativePolylines: [],
													routeDistanceKm: null,
													routeDurationMin: null
												});
												setShowError(false);
												setErrorMessage("");
											}}
											placeholder="Enter drop-off location"
											nearbyCoordinates={pickupCoords}
											textFieldProps={{
												fullWidth: true,
												size: "small",
												variant: "outlined",
												error: Boolean(fieldErrors.destination),
												helperText: fieldErrors.destination || " ",
												InputProps: {
													startAdornment: (
														<PlaceRoundedIcon sx={{ fontSize: 19, color: "#F79009" }} />
													)
												}
											}}
											sx={{
												flex: 1,
												"& .MuiOutlinedInput-root": {
													borderRadius: 5,
													bgcolor:
														theme.palette.mode === "light"
															? "rgba(0,0,0,0.05)"
															: "rgba(255,255,255,0.05)",
													color: theme.palette.text.primary,
													"& fieldset": {
														borderColor:
															theme.palette.mode === "light"
																? fieldErrors.destination
																	? "#D92D20"
																	: "rgba(0,0,0,0.15)"
																: "rgba(255,255,255,0.2)"
													},
													"&:hover fieldset": {
														borderColor: accentGreen
													},
													"&.Mui-focused fieldset": {
														borderColor: accentGreen
													}
												},
												"& .MuiInputAdornment-positionStart": {
													mr: 0.35
												},
												"& .MuiInputBase-input": {
													pl: 0
												},
												"& .MuiFormHelperText-root": {
													mt: 0.7,
													mb: -0.25
												}
											}}
										/>
									</Box>
								)}

							{/* Multi-Stop Mode - Show multiple stop fields */}
							{isMultiStopMode && (
								<>
									{/* Stops A-F */}
									{stops.map((stop: Stop, index: number) => {
										const isLast =
											index === stops.length - 1;
										const isSquare = stop.id === "B"; // Stop B is square per spec
										return (
						<Box
							key={stop.id}
							sx={{
								display: "flex",
								gap: 1,
								alignItems: "center",
								width: "100%",
							}}
						>
													<LocationAutocompleteField
														value={stop.value}
														onValueChange={(nextValue) => {
															const newStops = [...stops];
															clearFieldError("stops");
															if (newStops[index]) {
																newStops[index] = {
																	...newStops[index],
																	value: nextValue,
																	address: nextValue || undefined,
																	coordinates: undefined
																};
																setStops(newStops);
															}
														}}
														onSelectLocation={(selection) => {
															const newStops = [...stops];
															clearFieldError("stops");
															if (newStops[index]) {
																newStops[index] = {
																	...newStops[index],
																	value: selection.address,
																	address: selection.address,
																	coordinates: selection.coordinates
																};
																setStops(newStops);
															}
														}}
														placeholder={`Stop ${stop.id}`}
														nearbyCoordinates={pickupCoords}
														textFieldProps={{
															fullWidth: true,
															size: "small",
															variant: "outlined",
															error: Boolean(fieldErrors.stops) && !stop.value.trim(),
															helperText:
																Boolean(fieldErrors.stops) && !stop.value.trim()
																	? fieldErrors.stops
																	: " ",
															InputProps: {
																startAdornment: (
																	isLast ? (
																		<PlaceRoundedIcon
																			sx={{ fontSize: 20, color: "#FF9800" }}
																		/>
																	) : (
																		<Box
																			sx={{
																				width: 24,
																				height: 24,
																				borderRadius: isSquare ? 1 : "50%",
																				bgcolor: "rgba(15,23,42,0.9)",
																				color: "#F9FAFB",
																				display: "flex",
																				alignItems: "center",
																				justifyContent: "center",
																				fontSize: 12,
																				fontWeight: 600
																			}}
																		>
																			{stop.id}
																		</Box>
																	)
																),
																endAdornment: (
																	<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
																		<DragIndicatorRoundedIcon
																			sx={{
																				fontSize: 18,
																				color: theme.palette.text.secondary,
																				cursor: "grab",
																				"&:active": {
																					cursor: "grabbing"
																				}
																			}}
																		/>
																		<IconButton
																			size="small"
																			onClick={() => {
																				const newStops = stops.filter((_: Stop, i: number) => i !== index);
																				const reindexed = newStops.map((s: Stop, idx: number) => ({
																					...s,
																					id: String.fromCharCode(65 + idx)
																				}));
																				setStops(reindexed);
																			}}
																			sx={{
																				color: theme.palette.text.secondary,
																				"&:hover": {
																					bgcolor:
																						theme.palette.mode === "light"
																							? "rgba(0,0,0,0.05)"
																							: "rgba(255,255,255,0.05)"
																				}
																			}}
																		>
																			<CloseRoundedIcon sx={{ fontSize: 18 }} />
																		</IconButton>
																	</Box>
																)
															}
														}}
								sx={{
									flex: 1,
									width: "100%",
									"& .MuiOutlinedInput-root": {
																borderRadius: 5,
																bgcolor:
																	theme.palette.mode === "light"
																		? "rgba(0,0,0,0.05)"
																		: "rgba(255,255,255,0.05)",
																color: theme.palette.text.primary,
																"& fieldset": {
																	borderColor:
																		theme.palette.mode === "light"
																			? Boolean(fieldErrors.stops) && !stop.value.trim()
																				? "#D92D20"
																				: "rgba(0,0,0,0.15)"
																			: "rgba(255,255,255,0.2)"
																},
																"&:hover fieldset": {
																	borderColor: accentGreen
																},
																"&.Mui-focused fieldset": {
																	borderColor: accentGreen
																}
															},
															"& .MuiInputAdornment-positionStart": {
																mr: 0.35
															},
															"& .MuiInputBase-input": {
																pl: 0
															},
															"& .MuiFormHelperText-root": {
																mt: 0.7,
																mb: -0.25
															}
														}}
													/>
											</Box>
										);
									})}

									{/* Add Stop Field */}
									{stops.length < MAX_STOPS && (
										<TextField
											fullWidth
											size="small"
											variant="outlined"
											placeholder="Add stop."
											onClick={() => {
												if (stops.length < MAX_STOPS) {
													clearFieldError("stops");
													setShowAddStopModal(true);
												}
											}}
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<PlaceRoundedIcon
															sx={{
																fontSize: 20,
																color: "#FF9800",
															}}
														/>
													</InputAdornment>
												),
											}}
											sx={{
												"& .MuiOutlinedInput-root": {
													borderRadius: 5,
													bgcolor:
														theme.palette.mode ===
														"light"
															? "rgba(0,0,0,0.05)"
															: "rgba(255,255,255,0.05)",
													color: theme.palette.text
														.primary,
													cursor: "pointer",
													"& fieldset": {
														borderColor:
															theme.palette
																.mode ===
															"light"
																? "rgba(0,0,0,0.15)"
																: "rgba(255,255,255,0.2)",
													},
													"&:hover fieldset": {
														borderColor: "#FF9800",
													},
												},
											}}
										/>
									)}

								</>
							)}
						</Stack>
					</CardContent>
				</Card>


			{/* Lower Section Cards */}
				{/* Error Alert */}
				{showError && (
					<Alert
						severity="error"
						sx={{ mb: 2 }}
						onClose={() => setShowError(false)}
					>
						{errorMessage ||
							(isBookingForSomeone
								? "Please complete destination plus person name and phone number before continuing."
								: "Please select a destination before continuing.")}
					</Alert>
				)}

					{/* Trip Type Options */}
						<Stack spacing={1.5} sx={{ mb: 2, mt: "5px" }}>
						<Card
							elevation={0}
							sx={{
								borderRadius: 2,
								bgcolor: contentBg,
								border:
									theme.palette.mode === "light"
										? "1px solid rgba(0,0,0,0.1)"
										: "1px solid rgba(255,255,255,0.1)",
							}}
						>
							<CardContent sx={{ px: 2, py: 1.5 }}>
								<Typography sx={{ fontSize: 12, color: "#667085", mb: 0.8 }}>
									Schedule
								</Typography>
								<Button
									fullWidth
									onClick={handleScheduleClick}
									startIcon={<CalendarTodayRoundedIcon sx={{ fontSize: 17 }} />}
									endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: 18 }} />}
									sx={{
										justifyContent: "space-between",
										textTransform: "none",
										borderRadius: 5,
										py: 0.95,
										px: 1.3,
										fontSize: 13,
										fontWeight: 700,
										color: isScheduled ? "#F79009" : theme.palette.text.primary,
										bgcolor: isScheduled ? "rgba(247,144,9,0.08)" : "rgba(3,205,140,0.08)",
										border: isScheduled ? "1px solid rgba(247,144,9,0.45)" : "1px solid rgba(3,205,140,0.38)",
										"&:hover": {
											bgcolor: isScheduled ? "rgba(247,144,9,0.12)" : "rgba(3,205,140,0.12)"
										}
									}}
								>
									{isScheduled
										? `${schedule}${scheduleTime ? ` • ${scheduleTime}` : ""}`
										: "Now"}
								</Button>
							</CardContent>
						</Card>

						{/* Ride Type Dropdown */}
						{!isBookingForSomeone && (
							<Card
								elevation={0}
								sx={{
									borderRadius: 2,
									bgcolor: contentBg,
									border:
										theme.palette.mode === "light"
											? "1px solid rgba(0,0,0,0.1)"
											: "1px solid rgba(255,255,255,0.1)",
								}}
							>
								<CardContent sx={{ px: 2, py: 1.5 }}>
									<Stack spacing={1.3}>
										<FormControl fullWidth size="small">
											<Typography sx={{ fontSize: 12, color: "#667085", mb: 0.6 }}>
												Choose trip owner
											</Typography>
											<Select
												value={tripOwnerChosen ? rideType : "__choose_owner__"}
												displayEmpty
												onChange={(e) => {
													setShowError(false);
													setErrorMessage("");
													const newValue = e.target.value;
													if (newValue === "__choose_owner__") {
														setTripOwnerChosen(false);
														return;
													}
													if (newValue === "Personal" || newValue === "Business") {
														setRideType(newValue);
														setSelectedContact(null);
														setRiderType("personal");
														setTripOwnerChosen(true);
														clearFieldError("tripOwner");
													}
												}}
												renderValue={(value) => (
													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															gap: 1,
														}}
													>
														<PersonRoundedIcon
															sx={{
																fontSize: 18,
																color: accentGreen,
															}}
														/>
														<Typography sx={{ fontSize: 13.5 }}>
															{tripOwnerChosen ? (value === "Business" ? "Organization" : value) : "Choose"}
														</Typography>
													</Box>
												)}
												sx={{
													borderRadius: 5,
													bgcolor:
														theme.palette.mode === "light"
															? "rgba(0,0,0,0.05)"
															: "rgba(255,255,255,0.05)",
													color: theme.palette.text.primary,
													"& .MuiOutlinedInput-notchedOutline": {
														borderColor:
															theme.palette.mode === "light"
																? fieldErrors.tripOwner
																	? "#D92D20"
																	: "rgba(0,0,0,0.15)"
																: "rgba(255,255,255,0.2)",
													},
													"&:hover .MuiOutlinedInput-notchedOutline":
														{
															borderColor: accentGreen,
														},
													"&.Mui-focused .MuiOutlinedInput-notchedOutline":
														{
															borderColor: accentGreen,
														},
												}}
											>
												<MenuItem value="__choose_owner__" disabled>
													Choose
												</MenuItem>
												<MenuItem value="Personal">
													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															gap: 1,
														}}
													>
														<PersonRoundedIcon
															sx={{ fontSize: 18 }}
														/>
														Personal
													</Box>
												</MenuItem>
												<MenuItem value="Business">
													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															gap: 1,
														}}
													>
														<DirectionsCarRoundedIcon
															sx={{ fontSize: 18 }}
														/>
														Organization
													</Box>
												</MenuItem>
											</Select>
											{fieldErrors.tripOwner && (
												<Typography sx={{ mt: 0.7, fontSize: 12, color: "#D92D20" }}>
													{fieldErrors.tripOwner}
												</Typography>
											)}
										</FormControl>
									</Stack>
								</CardContent>
							</Card>
						)}

					{isBookingForSomeone && (
						<Card
							elevation={0}
							sx={{
								borderRadius: 2,
								bgcolor: contentBg,
								border:
									theme.palette.mode === "light"
										? "1px solid rgba(0,0,0,0.1)"
										: "1px solid rgba(255,255,255,0.1)",
							}}
						>
							<CardContent sx={{ px: 2, py: 1.5 }}>
								<Typography sx={{ fontSize: 12, color: "#667085", mb: 0.8 }}>
									Booked rider details
								</Typography>
								<Stack spacing={1}>
									<TextField
										size="small"
										label="Booked rider name"
										value={bookedPersonName}
										onChange={(event) => {
											setBookedPersonName(event.target.value);
											clearFieldError("tripOwner");
										}}
										error={Boolean(fieldErrors.tripOwner && !bookedPersonName.trim())}
									/>
									<TextField
										size="small"
										label="Booked rider phone"
										value={bookedPersonPhone}
										onChange={(event) => {
											setBookedPersonPhone(event.target.value);
											clearFieldError("tripOwner");
										}}
										error={Boolean(fieldErrors.tripOwner && bookedPersonPhone.trim().length < 7)}
									/>
								</Stack>
							</CardContent>
						</Card>
					)}

					{/* Route + Trip Mode */}
					<Card
						elevation={0}
						sx={{
							borderRadius: 2,
							bgcolor: contentBg,
							border:
								theme.palette.mode === "light"
									? "1px solid rgba(0,0,0,0.1)"
									: "1px solid rgba(255,255,255,0.1)",
						}}
					>
						<CardContent sx={{ px: 2, py: 1.5 }}>
							<FormControl fullWidth size="small">
								<Typography sx={{ fontSize: 12, color: "#667085", mb: 0.6 }}>
									Route mode
								</Typography>
								<Select
									value={routeModeSelectionValue}
									displayEmpty
									onChange={(e) => handleRouteModeSelectionChange(String(e.target.value))}
									renderValue={(value) => (
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												gap: 1,
											}}
										>
												<DirectionsCarRoundedIcon
													sx={{
														fontSize: 18,
														color: accentGreen,
													}}
												/>
											<Typography sx={{ fontSize: 13.5 }}>
												{value === "__choose_route__"
													? "Choose"
													: value === "multi_stop"
														? "Multi-stop"
														: value === "round_trip"
															? "Round trip"
															: "Single destination"}
											</Typography>
										</Box>
									)}
									sx={{
										borderRadius: 5,
										bgcolor:
											theme.palette.mode === "light"
												? "rgba(0,0,0,0.05)"
												: "rgba(255,255,255,0.05)",
										color: theme.palette.text.primary,
										"& .MuiOutlinedInput-notchedOutline": {
											borderColor:
												theme.palette.mode === "light"
													? fieldErrors.routeMode
														? "#D92D20"
														: "rgba(0,0,0,0.15)"
													: "rgba(255,255,255,0.2)",
										},
										"&:hover .MuiOutlinedInput-notchedOutline":
											{
												borderColor: accentGreen,
											},
											"&.Mui-focused .MuiOutlinedInput-notchedOutline":
												{
													borderColor: accentGreen,
												},
										}}
									>
										<MenuItem value="__choose_route__" disabled>
											Choose
										</MenuItem>
										<MenuItem value="single_stop">
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												gap: 1,
											}}
										>
											<DirectionsCarRoundedIcon
												sx={{ fontSize: 18 }}
											/>
											Single destination
										</Box>
									</MenuItem>
									<MenuItem value="multi_stop">
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												gap: 1,
											}}
										>
											<DirectionsCarRoundedIcon
												sx={{ fontSize: 18 }}
											/>
											Multi-stop
										</Box>
									</MenuItem>
									<MenuItem value="round_trip">
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												gap: 1,
											}}
										>
											<DirectionsCarRoundedIcon
												sx={{ fontSize: 18 }}
											/>
											Round trip
										</Box>
									</MenuItem>
								</Select>
								{fieldErrors.routeMode && (
									<Typography sx={{ mt: 0.7, fontSize: 12, color: "#D92D20" }}>
										{fieldErrors.routeMode}
									</Typography>
								)}
							</FormControl>
						</CardContent>
					</Card>

					{/* Return Date & Time Section - Only shown for round trip mode */}
					{isRoundTripMode && (
						<Card
							elevation={0}
							sx={{
								borderRadius: 2,
								bgcolor: contentBg,
								border: fieldErrors.returnDateTime
									? "1px solid #D92D20"
									: theme.palette.mode === "light"
										? "1px solid rgba(0,0,0,0.1)"
										: "1px solid rgba(255,255,255,0.1)",
							}}
						>
							<CardContent sx={{ px: 2, py: 1.5 }}>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<Box>
										<Typography
											variant="subtitle2"
											sx={{
												fontWeight: 600,
												mb: 0.5,
												color: theme.palette.text
													.primary,
											}}
										>
											Drop Date & Time
										</Typography>
										{returnDate && returnTime ? (
											<Typography
												variant="body2"
												sx={{
													color: theme.palette.text
														.secondary,
													fontSize: 14,
												}}
											>
												{(() => {
													// Parse return date string (e.g., "Wed, 26 Sep 2024")
													const dateMatch =
														returnDate.match(
															/(\w+),\s*(\d+)\s*(\w+)\s*(\d+)/,
														);
													if (dateMatch) {
														const [
															,
															,
															day,
															month,
															year,
														] = dateMatch;
														// Format as "26 Sep 2024"
														return `${day} ${month} ${year}`;
													}
													return returnDate;
												})()}
												,{" "}
												{(() => {
													// Format time to remove leading zero from hour if present
													if (
														returnTime &&
														returnTime.includes(":")
													) {
														const [
															timePart,
															period,
														] =
															returnTime.split(
																" ",
															);
														const [hour, minute] =
															timePart.split(":");
														const hourNum =
															parseInt(hour);
														return `${hourNum}:${minute} ${period}`;
													}
													return returnTime;
												})()}
											</Typography>
										) : (
											<Typography
												variant="body2"
												sx={{
													color: theme.palette.text
														.secondary,
													fontSize: 14,
													fontStyle: "italic",
												}}
											>
												Select return date & time
											</Typography>
										)}
									</Box>
									<IconButton
										size="small"
										onClick={() => {
											clearFieldError("returnDateTime");
											setShowTripTypeModal(true);
										}}
										sx={{
											borderRadius: 5,
											bgcolor:
												theme.palette.mode === "light"
													? "rgba(0,0,0,0.05)"
													: "rgba(255,255,255,0.05)",
											color: accentGreen,
											"&:hover": {
												bgcolor: "rgba(3,205,140,0.15)",
											},
										}}
									>
										<CalendarTodayRoundedIcon
											sx={{ fontSize: 18 }}
										/>
									</IconButton>
								</Box>
								{fieldErrors.returnDateTime && (
									<Typography sx={{ mt: 0.9, fontSize: 12, color: "#D92D20" }}>
										{fieldErrors.returnDateTime}
									</Typography>
								)}
								<Stack spacing={0.65} sx={{ mt: 1.25 }}>
									<Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
										Return pattern
									</Typography>
									<Stack direction="row" spacing={1}>
										<Button
											size="small"
											onClick={() => setReturnPattern("direct")}
											variant={returnPattern === "direct" ? "contained" : "outlined"}
											sx={{
												flex: 1,
												textTransform: "none",
												borderRadius: 5,
												fontSize: 12,
												bgcolor: returnPattern === "direct" ? "#F79009" : undefined,
												color: returnPattern === "direct" ? "#FFFFFF" : "#475467",
												borderColor: "rgba(247,144,9,0.5)",
												"&:hover": {
													bgcolor: returnPattern === "direct" ? "#E98607" : "rgba(247,144,9,0.1)"
												}
											}}
										>
											Direct return
										</Button>
										<Button
											size="small"
											onClick={() => setReturnPattern("reverse_stops")}
											variant={returnPattern === "reverse_stops" ? "contained" : "outlined"}
											sx={{
												flex: 1,
												textTransform: "none",
												borderRadius: 5,
												fontSize: 12,
												bgcolor: returnPattern === "reverse_stops" ? "#03CD8C" : undefined,
												color: returnPattern === "reverse_stops" ? "#FFFFFF" : "#475467",
												borderColor: "rgba(3,205,140,0.5)",
												"&:hover": {
													bgcolor: returnPattern === "reverse_stops" ? "#01B77D" : "rgba(3,205,140,0.12)"
												}
											}}
										>
											Reverse stops
										</Button>
									</Stack>
								</Stack>
					</CardContent>
				</Card>
			)}

					{/* Passenger Selection */}
					<Card
						elevation={0}
						sx={{
							borderRadius: 2,
							bgcolor: contentBg,
							border:
								theme.palette.mode === "light"
									? "1px solid rgba(0,0,0,0.1)"
									: "1px solid rgba(255,255,255,0.1)",
						}}
					>
						<CardContent sx={{ px: 2, py: 1.5 }}>
							<Typography
								variant="subtitle2"
								sx={{
									fontWeight: 600,
									mb: 1.5,
									color: theme.palette.text.primary,
								}}
							>
								Passengers
							</Typography>
								<Box
									sx={{
										display: "grid",
										gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
										gap: 1,
										mb: 1.5,
									}}
								>
									{passengerOptions.map((pax: number) => (
										<Chip
										key={pax}
										label={pax}
										size="small"
										onClick={() => {
											setPassengers(pax);
											setCustomPassengers("");
										}}
										sx={{
												width: "100%",
												height: 44,
												borderRadius: 2,
												fontSize: 13,
												fontWeight: 600,
												bgcolor:
												passengers === pax &&
												!customPassengers
													? lightGreen
													: theme.palette.mode ===
														  "light"
														? "rgba(0,0,0,0.05)"
														: "rgba(255,255,255,0.05)",
											color:
												passengers === pax &&
												!customPassengers
													? accentGreen
													: theme.palette.text
															.primary,
											border:
												passengers === pax &&
												!customPassengers
													? "none"
													: theme.palette.mode ===
														  "light"
														? "1px solid rgba(0,0,0,0.15)"
														: "1px solid rgba(255,255,255,0.2)",
											cursor: "pointer",
											transition: "all 0.2s ease",
											"&:hover": {
												bgcolor:
													passengers === pax &&
													!customPassengers
														? lightGreen
														: theme.palette.mode ===
															  "light"
															? "rgba(0,0,0,0.1)"
															: "rgba(255,255,255,0.1)",
												},
											}}
										/>
									))}
								</Box>
							<TextField
								fullWidth
								type="number"
								placeholder="Enter number of passengers (more than 6)"
								value={customPassengers}
								onChange={(e) => {
									const value = e.target.value;
									if (
										value === "" ||
										(parseInt(value) > 6 &&
											parseInt(value) <= 50)
									) {
										setCustomPassengers(value);
										if (value !== "") {
											setPassengers(parseInt(value));
										}
									}
								}}
								onFocus={() => {
									setPassengers(
										customPassengers
											? parseInt(customPassengers)
											: 1,
									);
								}}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<PersonRoundedIcon
												sx={{
													fontSize: 18,
													color: theme.palette.text
														.secondary,
												}}
											/>
										</InputAdornment>
									),
								}}
								sx={{
									"& .MuiOutlinedInput-root": {
										borderRadius: 2,
										bgcolor:
											theme.palette.mode === "light"
												? "rgba(0,0,0,0.02)"
												: "rgba(255,255,255,0.05)",
										"& fieldset": {
											borderColor:
												theme.palette.mode === "light"
													? "rgba(0,0,0,0.15)"
													: "rgba(255,255,255,0.2)",
										},
										"&:hover fieldset": {
											borderColor:
												theme.palette.mode === "light"
													? "rgba(0,0,0,0.3)"
													: "rgba(255,255,255,0.3)",
										},
										"&.Mui-focused fieldset": {
											borderColor: accentGreen,
										},
									},
									"& .MuiInputBase-input": {
										fontSize: 14,
										py: 1.25,
									},
								}}
							/>
						</CardContent>
					</Card>

						<Box className="ride-type-section">
							<Typography sx={{ fontSize: 14, fontWeight: 700, color: "#101828", mb: 0.2 }}>
								Choose ride type
							</Typography>
							<Box className="ride-type-grid">
								{rideTypeCards.map((item) => (
									<RideTypeCard
										key={item.id}
										ride={item}
										selected={selectedRideLevel === item.id}
										onClick={setSelectedRideLevel}
									/>
								))}
							</Box>
						</Box>
				</Stack>

				{/* Inline Action Section */}
				<Box
					sx={{
						mt: 1.5,
						px: 0,
						pt: 0.75,
						pb: 0.4,
					}}
				>
				{/* Continue Button */}
				<Button
					fullWidth
					variant="contained"
					onClick={(e) => {
						e.preventDefault();
						handleContinue();
					}}
					sx={{
						borderRadius: 99,
						py: 1.15,
						fontSize: 16,
						fontWeight: 700,
						textTransform: "none",
						background: "#12B76A",
						color: "#FFFFFF",
						boxShadow: "none",
						"&:hover": {
							background: "#0EA75F",
							boxShadow: "none",
						},
					}}
					endIcon={
						<Box sx={{ width: 28, height: 28, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.95)", display: "grid", placeItems: "center" }}>
							<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
						</Box>
					}
				>
					Continue to options
				</Button>
			</Box>
					</Box>
			</SmoothHeightPanel>

			{/* Schedule Menu */}
			<Menu
				anchorEl={scheduleMenuAnchor}
				open={Boolean(scheduleMenuAnchor)}
				onClose={() => setScheduleMenuAnchor(null)}
				PaperProps={{
					sx: {
						borderRadius: 2,
						mt: 1,
						minWidth: 200,
						bgcolor: contentBg,
					},
				}}
			>
				{scheduleOptions.map((option: string) => (
					<MenuItem
						key={option}
						onClick={() => handleScheduleSelect(option)}
						sx={{
							"&:hover": {
								bgcolor: "rgba(3,205,140,0.15)",
							},
						}}
					>
						{option}
					</MenuItem>
				))}
			</Menu>

			{/* Switch Rider Modal */}
			<SwitchRiderModal
				open={showSwitchRiderModal}
				onClose={() => setShowSwitchRiderModal(false)}
				tripData={getTripData()}
				onContinue={handleSwitchRiderContinue}
			/>

			{/* Trip Type Modal */}
			<TripTypeModal
				open={showTripTypeModal}
				onClose={() => setShowTripTypeModal(false)}
				currentTripType={isRoundTripMode ? "Round Trip" : "One Way"}
				departureDate={
					isScheduled && schedule
						? new Date(initialState.scheduledDateTime || new Date())
						: new Date()
				}
				departureTime={
					isScheduled && scheduleTime ? scheduleTime : null
				}
				existingReturnDate={returnDate}
				existingReturnTime={returnTime}
				onSelect={(data) => {
					setTripMode(data.tripType === "Round Trip" ? "round_trip" : "one_way");
					setTripConfigChosen(true);
					clearFieldError("routeMode");
					clearFieldError("returnDateTime");
					if (data.tripType === "Round Trip") {
						setReturnDate(data.returnDate);
						setReturnTime(data.returnTime);
						setReturnDateTime(data.returnDateTime);
					} else {
						setReturnDate(null);
						setReturnTime(null);
						setReturnDateTime(null);
						setReturnPattern(DEFAULT_ROUND_TRIP_RETURN_PATTERN);
					}
				}}
			/>

			{/* Add Stop Modal */}
			<AddStopModal
				open={showAddStopModal}
				onClose={() => setShowAddStopModal(false)}
				onSelectStop={(stop: {
					id: string;
					value: string;
					coordinates?: { lat: number; lng: number };
					address?: string;
				}) => {
					clearFieldError("stops");
					// Re-index existing stops and add new one
					const reindexed = stops.map((s: Stop, idx: number) => ({
						...s,
						id: String.fromCharCode(65 + idx),
					}));
					setStops([...reindexed, stop]);
				}}
				currentStopCount={stops.length}
			/>
		</ScreenScaffold>
	);
}

export default function RiderScreen5TripSetupCanvas_v2() {
	return (
		<Box
			sx={{
				position: "relative",
					minHeight: "100vh",
				bgcolor: (theme) => theme.palette.background.default,
			}}
		>

				<EnterDestinationScreen />
			
		</Box>
	);
}
