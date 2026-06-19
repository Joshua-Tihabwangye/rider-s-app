import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
	Box,
	Alert,
	IconButton,
	Typography,
	Card,
	CardContent,
	Button,
	Avatar,
	Divider,
	CircularProgress,
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";
import {
	createRiderTripRequest,
	mapApiTripToRideTrip,
	isRiderBackendEnabled,
} from "../services/api/riderApi";
import { ApiRequestError } from "../services/api/httpClient";
import { createRiderSocket } from "../services/riderSocket";
import { RiderClientEvents } from "../services/api/events";

function RideDetailsScreen(): React.JSX.Element {
	const navigate = useNavigate();
	const location = useLocation();
	const theme = useTheme();
	const { ride, actions, sharedLocationState } = useAppData();

	// Get trip data from navigation state or use defaults
	const tripData = location.state || {};
	const rideRequestError =
		typeof tripData.rideRequestError === "string" &&
		tripData.rideRequestError.trim().length > 0
			? tripData.rideRequestError.trim()
			: null;

	const activeTrip = ride.activeTrip;
	const resolvePublicImagePath = (value: unknown): string | null => {
		if (typeof value !== "string") return null;
		const trimmed = value.trim();
		if (!trimmed.startsWith("/")) return null;
		return trimmed;
	};
	const hasAssignedDriver = Boolean(tripData.driver?.name && tripData.driver?.licensePlate);

	const rideDetails = {
		dateLabel:
			tripData.dateLabel ||
			(ride.request.schedule === "later" ? "Scheduled" : "Today"),
		origin: {
			name:
				tripData.origin?.name || ride.request.origin?.label || "Pickup",
			address:
				tripData.origin?.address ||
				ride.request.origin?.address ||
				"Pickup location",
			time: tripData.origin?.time || ride.request.scheduleTime || "Now",
		},
		destination: {
			name:
				tripData.destination?.name ||
				ride.request.destination?.label ||
				"Destination",
			address:
				tripData.destination?.address ||
				ride.request.destination?.address ||
				"Destination address",
			time: tripData.destination?.time || "—",
		},
		duration: tripData.duration || `${activeTrip?.etaMinutes ?? 0} mins`,
		passengers: tripData.passengers || ride.request.passengers || 1,
		fare:
			tripData.fare ||
			activeTrip?.fareEstimate ||
			ride.options.find(
				(option) => option.id === ride.request.serviceLevel,
			)?.fare ||
			ride.options[0]?.fare ||
			"UGX 0",
		driver: hasAssignedDriver
			? {
					name: tripData.driver?.name || "Driver",
					vehicle: tripData.driver?.vehicle || "EV",
					licensePlate: tripData.driver?.licensePlate || "—",
					rating: tripData.driver?.rating || 0,
					totalRatings: tripData.driver?.totalRatings || 0,
					rides: tripData.driver?.rides || "—",
					experience: tripData.driver?.experience || "—",
					photo: tripData.driver?.photo || "DR",
				}
			: null,
		vehicleImage: resolvePublicImagePath(tripData.vehicleImage), // Serve only from public assets.
	};
	const [bookingError, setBookingError] = React.useState<string | null>(null);
	const resolvedError = bookingError ?? rideRequestError;

	const handleBack = () => {
		navigate(-1);
	};

	const handleCallDriver = () => {
		// In production: Open phone dialer
		if (activeTrip?.driver?.phone) {
			window.location.href = `tel:${activeTrip.driver.phone}`;
		}
	};

	const handleMessageDriver = () => {
		navigate("/help");
	};

	const handleViewDriverProfile = () => {
		if (!rideDetails.driver) return;
		// Navigate to driver profile screen (RA28)
		navigate("/rides/trip/driver-profile", {
			state: {
				driver: rideDetails.driver,
				fromRideDetails: true,
			},
		});
	};

	const [isBooking, setIsBooking] = React.useState(false);
	const handleBookTrip = async () => {
		if (isBooking) return;
		setIsBooking(true);
		setBookingError(null);

		if (isRiderBackendEnabled()) {
			try {
				// Get pickup and dropoff from shared location state or request
				const request = ride.request;

				const payload = {
					pickupLabel:
						request.origin?.label || rideDetails.origin.name,
					pickupAddress:
						request.origin?.address || rideDetails.origin.address,
					pickupLat: sharedLocationState.pickupCoords?.lat || 0,
					pickupLng: sharedLocationState.pickupCoords?.lng || 0,
					dropoffLabel:
						request.destination?.label ||
						rideDetails.destination.name,
					dropoffAddress:
						request.destination?.address ||
						rideDetails.destination.address,
					dropoffLat: sharedLocationState.destinationCoords?.lat || 0,
					dropoffLng: sharedLocationState.destinationCoords?.lng || 0,
					distanceKm: sharedLocationState.routeDistanceKm || 0,
					durationMinutes: sharedLocationState.routeDurationMin || 0,
					bookedFor: request.bookedFor,
					tripMode: request.tripMode,
					returnToOrigin: request.returnToOrigin,
					routeMode: request.routeMode,
					waypoints: request.stops?.map((stop: any) => ({
						label: stop.label,
						address: stop.address,
						lat: stop.coordinates?.lat,
						lng: stop.coordinates?.lng,
					})),
					vehicleCategoryId: request.serviceLevel,
				};

				const apiTrip = await createRiderTripRequest(payload);
				const trip = mapApiTripToRideTrip(apiTrip);
				actions.setActiveTrip(trip);
				actions.setRideStatus(trip.status);

				// Navigate directly to searching screen
				navigate("/rides/searching-driver", { replace: true });
			} catch (error) {
				console.error("Failed to create trip request", error);
				const message =
					error instanceof ApiRequestError && error.message.trim().length > 0
						? error.message
						: "Failed to create trip request. Please try again.";
				setBookingError(message);
			} finally {
				setIsBooking(false);
			}
		} else {
			// Keep existing simulation if backend disabled
			actions.setRideStatus("searching");
			navigate("/rides/searching-driver", { replace: true });
			setIsBooking(false);
		}
	};

	const handleNotificationClick = () => {
		navigate("/settings");
	};

	// Calculate star rating display
	const fullStars = Math.floor(rideDetails.driver?.rating ?? 0);
	const hasHalfStar = (rideDetails.driver?.rating ?? 0) % 1 >= 0.5;

	const contentBg =
		theme.palette.mode === "light"
			? "#FFFFFF"
			: theme.palette.background.paper;
	const accentGreen = "#03CD8C";

	return (
		<Box
			sx={{
				position: "relative",
				minHeight: "100vh",
				bgcolor: theme.palette.background.default,
			}}
		>
			{/* Header Bar */}
			<Box
				sx={{
					position: "sticky",
					top: 0,
					zIndex: 100,
					bgcolor: contentBg,
					borderBottom:
						theme.palette.mode === "light"
							? "1px solid rgba(0,0,0,0.1)"
							: "1px solid rgba(255,255,255,0.1)",
					px: uiTokens.spacing.xl,
					py: uiTokens.spacing.mdPlus,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: uiTokens.spacing.mdPlus,
					}}
				>
					<IconButton
						size="small"
						onClick={handleBack}
						sx={{
							borderRadius: uiTokens.radius.xl,
							bgcolor:
								theme.palette.mode === "light"
									? "#F3F4F6"
									: "rgba(15,23,42,0.9)",
							"&:hover": {
								bgcolor:
									theme.palette.mode === "light"
										? "#E5E7EB"
										: "rgba(15,23,42,1)",
							},
						}}
					>
						<ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
					</IconButton>
					<Typography
						variant="h6"
						sx={{
							fontWeight: 600,
							letterSpacing: "-0.01em",
							color: theme.palette.text.primary,
						}}
					>
						Ride Details.
					</Typography>
				</Box>
				<IconButton
					size="small"
					onClick={handleNotificationClick}
					sx={{
						borderRadius: uiTokens.radius.xl,
						bgcolor:
							theme.palette.mode === "light"
								? "#F3F4F6"
								: "rgba(15,23,42,0.9)",
						"&:hover": {
							bgcolor:
								theme.palette.mode === "light"
									? "#E5E7EB"
									: "rgba(15,23,42,1)",
						},
					}}
				>
					<NotificationsRoundedIcon sx={{ fontSize: 20 }} />
				</IconButton>
			</Box>

			<Box
				sx={{
					px: uiTokens.spacing.xl,
					pt: uiTokens.spacing.lg,
					pb: "calc(96px + env(safe-area-inset-bottom, 0px))",
				}}
			>
				{/* Trip Summary Section */}
				<Card
					elevation={0}
					sx={{
						mb: uiTokens.spacing.xl,
						borderRadius: uiTokens.radius.sm,
						bgcolor: contentBg,
						border:
							theme.palette.mode === "light"
								? "1px solid rgba(0,0,0,0.1)"
								: "1px solid rgba(255,255,255,0.1)",
					}}
				>
					<CardContent
						sx={{
							px: uiTokens.spacing.mdPlus,
							py: uiTokens.spacing.mdPlus,
						}}
					>
						{/* Date Label */}
						<Typography
							variant="caption"
							sx={{
								fontSize: 11,
								fontWeight: 600,
								textTransform: "uppercase",
								letterSpacing: "0.08em",
								color: theme.palette.text.secondary,
								mb: uiTokens.spacing.lg,
								display: "block",
							}}
						>
							{rideDetails.dateLabel}
						</Typography>

						{/* Origin */}
						<Box sx={{ mb: 2.5, position: "relative", pl: 3 }}>
							<Box
								sx={{
									position: "absolute",
									left: 0,
									top: 0,
									width: 12,
									height: 12,
									borderRadius: "50%",
									bgcolor: "#22C55E",
									border: "2px solid #FFFFFF",
									boxShadow: "0 2px 8px rgba(34,197,94,0.4)",
								}}
							/>
							<Typography
								variant="body1"
								sx={{
									fontWeight: 600,
									letterSpacing: "-0.01em",
									mb: 0.5,
									color: theme.palette.text.primary,
								}}
							>
								{rideDetails.origin.name}
							</Typography>
							<Typography
								variant="caption"
								sx={{
									fontSize: 11,
									color: theme.palette.text.secondary,
									display: "block",
									mb: 0.5,
								}}
							>
								{rideDetails.origin.address}
							</Typography>
							<Typography
								variant="caption"
								sx={{
									fontSize: 11,
									fontWeight: 500,
									color: theme.palette.text.secondary,
								}}
							>
								{rideDetails.origin.time}
							</Typography>
						</Box>

						{/* Duration Indicator */}
						<Box
							sx={{
								position: "absolute",
								left: "50%",
								transform: "translateX(-50%)",
								mt: -1,
								bgcolor: contentBg,
								px: 1,
								zIndex: 1,
							}}
						>
							<Typography
								variant="caption"
								sx={{
									fontSize: 11,
									fontWeight: 600,
									color: theme.palette.text.secondary,
								}}
							>
								{rideDetails.duration}
							</Typography>
						</Box>

						{/* Visual Route Line (Dotted) */}
						<Box
							sx={{
								position: "absolute",
								left: 5,
								top: 48,
								bottom: 48,
								width: 2,
								borderLeft: `2px dashed ${theme.palette.mode === "light" ? "#D1D5DB" : "#4B5563"}`,
								zIndex: 0,
							}}
						/>

						{/* Destination */}
						<Box sx={{ position: "relative", pl: 3 }}>
							<Box
								sx={{
									position: "absolute",
									left: 0,
									top: 0,
									width: 12,
									height: 12,
									borderRadius: "50%",
									bgcolor: "#FF9800",
									border: "2px solid #FFFFFF",
									boxShadow: "0 2px 8px rgba(255,152,0,0.4)",
								}}
							/>
							<PlaceRoundedIcon
								sx={{
									position: "absolute",
									left: -2,
									top: -2,
									fontSize: 16,
									color: "#FF9800",
								}}
							/>
							<Typography
								variant="body1"
								sx={{
									fontWeight: 600,
									letterSpacing: "-0.01em",
									mb: 0.5,
									color: theme.palette.text.primary,
								}}
							>
								{rideDetails.destination.name}
							</Typography>
							<Typography
								variant="caption"
								sx={{
									fontSize: 11,
									color: theme.palette.text.secondary,
									display: "block",
									mb: 0.5,
								}}
							>
								{rideDetails.destination.address}
							</Typography>
							<Typography
								variant="caption"
								sx={{
									fontSize: 11,
									fontWeight: 500,
									color: theme.palette.text.secondary,
								}}
							>
								{rideDetails.destination.time}
							</Typography>
						</Box>
					</CardContent>
				</Card>

				{/* Fare & Passenger Info */}
				<Card
					elevation={0}
					sx={{
						mb: uiTokens.spacing.xl,
						borderRadius: uiTokens.radius.sm,
						bgcolor: contentBg,
						border:
							theme.palette.mode === "light"
								? "1px solid rgba(0,0,0,0.1)"
								: "1px solid rgba(255,255,255,0.1)",
					}}
				>
					<CardContent
						sx={{
							px: uiTokens.spacing.mdPlus,
							py: uiTokens.spacing.md,
						}}
					>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<Typography
								variant="body2"
								sx={{
									fontSize: 13,
									color: theme.palette.text.secondary,
								}}
							>
								Passengers: {rideDetails.passengers}{" "}
								{rideDetails.passengers === 1
									? "Passenger"
									: "Passengers"}
							</Typography>
							<Typography
								variant="h6"
								sx={{
									fontWeight: 700,
									letterSpacing: "-0.02em",
									color: "#22C55E",
								}}
							>
								{rideDetails.fare}
							</Typography>
						</Box>
					</CardContent>
				</Card>

				{/* Driver Information Card */}
				<Card
					elevation={0}
					sx={{
						mb: uiTokens.spacing.xl,
						borderRadius: uiTokens.radius.sm,
						bgcolor: contentBg,
						border:
							theme.palette.mode === "light"
								? "1px solid rgba(0,0,0,0.1)"
								: "1px solid rgba(255,255,255,0.1)",
					}}
				>
					<CardContent
						sx={{
							px: uiTokens.spacing.mdPlus,
							py: uiTokens.spacing.mdPlus,
						}}
					>
						{resolvedError ? (
							<Alert severity="error" sx={{ mb: 2, borderRadius: uiTokens.radius.sm }}>
								{resolvedError}
							</Alert>
						) : null}
						{/* Profile Section */}
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1.5,
								mb: 2,
							}}
						>
							<Avatar
								sx={{
									width: 64,
									height: 64,
									bgcolor: accentGreen,
									fontSize: 24,
									fontWeight: 600,
									color: "#FFFFFF",
									}}
								>
									{rideDetails.driver?.photo ?? "DR"}
								</Avatar>
								<Box sx={{ flex: 1 }}>
									<Typography
									variant="body1"
									sx={{
										fontWeight: 600,
										letterSpacing: "-0.01em",
										mb: 0.5,
										color: theme.palette.text.primary,
										}}
									>
										{rideDetails.driver?.name ?? "Driver will be assigned after booking"}
									</Typography>
									<Typography
										variant="caption"
									sx={{
										fontSize: 11,
										color: theme.palette.text.secondary,
										display: "block",
										mb: 0.5,
										}}
									>
										{rideDetails.driver
											? `${rideDetails.driver.vehicle} – ${rideDetails.driver.licensePlate}`
											: "Vehicle pending"}
									</Typography>
									<Box
										sx={{
										display: "flex",
										alignItems: "center",
										gap: 0.5,
									}}
								>
									{Array.from({ length: fullStars }).map(
										(_, i) => (
											<StarRoundedIcon
												key={i}
												sx={{
													fontSize: 14,
													color: "#FFC107",
												}}
											/>
										),
									)}
									{hasHalfStar && (
										<StarRoundedIcon
											sx={{
												fontSize: 14,
												color: "#FFC107",
												opacity: 0.5,
											}}
										/>
									)}
									{Array.from({
										length:
											5 -
											fullStars -
											(hasHalfStar ? 1 : 0),
									}).map((_, i) => (
										<StarRoundedIcon
											key={`empty-${i}`}
											sx={{
												fontSize: 14,
												color: "#D1D5DB",
											}}
										/>
										))}
										<Typography
											variant="caption"
											sx={{
												fontSize: 11,
												ml: 0.5,
												color: theme.palette.text.secondary,
											}}
										>
											{rideDetails.driver
												? `${rideDetails.driver.rating} (${rideDetails.driver.totalRatings} ratings)`
												: "Driver not assigned yet"}
										</Typography>
									</Box>
								</Box>
						</Box>

						{/* Driver Stats */}
						<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
							<Box>
								<Typography
									variant="caption"
									sx={{
										fontSize: 11,
										color: theme.palette.text.secondary,
										display: "block",
									}}
								>
									Rides
								</Typography>
									<Typography
										variant="body2"
										sx={{
											fontWeight: 600,
											color: theme.palette.text.primary,
										}}
									>
										{rideDetails.driver?.rides ?? "Pending"}
									</Typography>
								</Box>
							<Box>
								<Typography
									variant="caption"
									sx={{
										fontSize: 11,
										color: theme.palette.text.secondary,
										display: "block",
									}}
								>
									Experience
								</Typography>
									<Typography
										variant="body2"
										sx={{
											fontWeight: 600,
											color: theme.palette.text.primary,
										}}
									>
										{rideDetails.driver?.experience ?? "Pending"}
									</Typography>
								</Box>
							</Box>

						<Divider sx={{ my: 1.5 }} />

						{/* Action Buttons */}
						<Box sx={{ display: "flex", gap: 1 }}>
								<Button
									variant="outlined"
									startIcon={
										<PhoneRoundedIcon sx={{ fontSize: 18 }} />
									}
									onClick={handleCallDriver}
									disabled={!rideDetails.driver}
									sx={{
									flex: 1,
									borderRadius: uiTokens.radius.xl,
									textTransform: "none",
									borderColor:
										theme.palette.mode === "light"
											? "rgba(0,0,0,0.15)"
											: "rgba(255,255,255,0.2)",
									color: theme.palette.text.primary,
									"&:hover": {
										borderColor: accentGreen,
										bgcolor: "rgba(3,205,140,0.1)",
									},
								}}
							>
								Call
							</Button>
								<Button
									variant="outlined"
									startIcon={
										<MessageRoundedIcon sx={{ fontSize: 18 }} />
									}
									onClick={handleMessageDriver}
									disabled={!rideDetails.driver}
									sx={{
									flex: 1,
									borderRadius: uiTokens.radius.xl,
									textTransform: "none",
									borderColor:
										theme.palette.mode === "light"
											? "rgba(0,0,0,0.15)"
											: "rgba(255,255,255,0.2)",
									color: theme.palette.text.primary,
									"&:hover": {
										borderColor: accentGreen,
										bgcolor: "rgba(3,205,140,0.1)",
									},
								}}
							>
								Message
							</Button>
								<IconButton
									onClick={handleViewDriverProfile}
									disabled={!rideDetails.driver}
									sx={{
									borderRadius: uiTokens.radius.xl,
									border:
										theme.palette.mode === "light"
											? "1px solid rgba(0,0,0,0.15)"
											: "1px solid rgba(255,255,255,0.2)",
									"&:hover": {
										bgcolor:
											theme.palette.mode === "light"
												? "rgba(0,0,0,0.05)"
												: "rgba(255,255,255,0.05)",
									},
								}}
							>
								<ChevronRightRoundedIcon
									sx={{ fontSize: 20 }}
								/>
							</IconButton>
						</Box>
					</CardContent>
				</Card>

				{/* Vehicle Preview Section */}
				<Card
					elevation={0}
					sx={{
						mb: uiTokens.spacing.xl,
						borderRadius: uiTokens.radius.sm,
						bgcolor: contentBg,
						border:
							theme.palette.mode === "light"
								? "1px solid rgba(0,0,0,0.1)"
								: "1px solid rgba(255,255,255,0.1)",
						overflow: "hidden",
					}}
				>
					<Box
						sx={{
							height: 180,
							bgcolor:
								theme.palette.mode === "light"
									? "#F3F4F6"
									: "rgba(15,23,42,0.5)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							position: "relative",
						}}
					>
						{rideDetails.vehicleImage && rideDetails.driver ? (
							<Box
								component="img"
								src={rideDetails.vehicleImage}
								alt={rideDetails.driver.vehicle}
								sx={{
									width: "100%",
									height: "100%",
									objectFit: "cover",
								}}
							/>
						) : (
							<Box
								sx={{
									textAlign: "center",
									color: theme.palette.text.secondary,
								}}
							>
								<PlaceRoundedIcon
									sx={{ fontSize: 48, mb: 1, opacity: 0.5 }}
								/>
									<Typography
										variant="caption"
										sx={{ fontSize: 11, display: "block" }}
									>
										{rideDetails.driver?.vehicle ?? "Vehicle pending"}
									</Typography>
								</Box>
							)}
					</Box>
				</Card>

				{/* Book Trip Button */}
				<Button
					fullWidth
					variant="contained"
					disabled={isBooking}
					onClick={handleBookTrip}
					sx={{
						borderRadius: uiTokens.radius.xl,
						py: uiTokens.spacing.md,
						fontSize: 16,
						fontWeight: 600,
						textTransform: "none",
						bgcolor: accentGreen,
						color: "#FFFFFF",
						"&:hover": {
							bgcolor: "#22C55E",
						},
						"&:disabled": {
							bgcolor: accentGreen,
							opacity: 0.7,
						},
					}}
				>
					{isBooking ? (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
							}}
						>
							<CircularProgress
								size={20}
								sx={{ color: "#FFFFFF" }}
							/>
							<Typography sx={{ color: "#FFFFFF" }}>
								Booking...
							</Typography>
						</Box>
					) : (
						"Book Trip"
					)}
				</Button>
			</Box>

			{/* Bottom Navigation Bar */}
			<Box
				sx={{
					position: "fixed",
					bottom: "env(safe-area-inset-bottom, 0px)",
					left: 0,
					right: 0,
					bgcolor: contentBg,
					borderTop:
						theme.palette.mode === "light"
							? "1px solid rgba(0,0,0,0.1)"
							: "1px solid rgba(255,255,255,0.1)",
					display: "flex",
					justifyContent: "space-around",
					py: 1,
					zIndex: 100,
				}}
			>
				<IconButton
					onClick={() => navigate("/")}
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
					<HomeRoundedIcon sx={{ fontSize: 24 }} />
				</IconButton>
				<IconButton
					onClick={() => navigate("/rides/history/past")}
					sx={{
						color: accentGreen,
						"&:hover": {
							bgcolor: "rgba(3,205,140,0.1)",
						},
					}}
				>
					<CalendarTodayRoundedIcon sx={{ fontSize: 24 }} />
				</IconButton>
				<IconButton
					onClick={() => navigate("/wallet")}
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
					<AccountBalanceWalletRoundedIcon sx={{ fontSize: 24 }} />
				</IconButton>
				<IconButton
					onClick={() => navigate("/settings")}
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
					<SettingsRoundedIcon sx={{ fontSize: 24 }} />
				</IconButton>
			</Box>
		</Box>
	);
}

export default function RiderScreen47RideDetailsCanvas_v2() {
	return (
		<Box
			sx={{
				position: "relative",
				minHeight: "100vh",
				bgcolor: (theme) => theme.palette.background.default,
			}}
		>
			<RideDetailsScreen />
		</Box>
	);
}
