import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
	Box,
	IconButton,
	Typography,
	Card,
	CardContent,
	TextField,
	InputAdornment,
	Button,
	Stack,
	Chip,
	FormControl,
	Select,
	MenuItem,
	Alert,
} from "@mui/material";

import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ScreenScaffold from "../components/ScreenScaffold";
import PageHeader from "../components/PageHeader";
import AddStopModal from "../components/AddStopModal";
import { uiTokens } from "../design/tokens";

const MAX_STOPS = 5; // Maximum for RA39, navigate to RA40 for 6 stops

function EnterDestinationMultipleStopsScreen(): React.JSX.Element {
	const navigate = useNavigate();
	const location = useLocation();
	const theme = useTheme();
	const initialState = location.state || {};

	interface Stop {
		id: string;
		value: string;
		coordinates?: { lat: number; lng: number };
		address?: string;
	}

	const [pickup, setPickup] = useState(
		initialState.pickup || "Entebbe International Airport",
	);
	const [stops, setStops] = useState<Stop[]>(
		initialState.stops || [
			{ id: "A", value: "Abayita Ababiri, Lyamu..." },
			{ id: "B", value: "Belle Vue Rooftop" },
			{ id: "C", value: "Freedom City Mall" },
		],
	);
	const [rideType, setRideType] = useState(
		initialState.rideType || "Personal",
	);
	const [tripDirection, setTripDirection] = useState(
		initialState.tripDirection || "Multi-stop",
	);
	const [passengers, setPassengers] = useState(initialState.passengers || 1);
	const [customPassengers, setCustomPassengers] = useState("");
	const [schedule] = useState(initialState.schedule || "Now");
	const [showError, setShowError] = useState(false);
	const [showAddStopModal, setShowAddStopModal] = useState(false);

	// Theme-aware colors
	const accentGreen = "#03CD8C"; // Green
	const lightGreen = "rgba(3,205,140,0.1)"; // Light green for active passenger
	const contentBg =
		theme.palette.mode === "light" ? "#FFFFFF" : theme.palette.background.paper;

	const passengerOptions = [1, 2, 3, 4, 5, 6];

	// Re-index stops alphabetically when one is removed
	const reindexStops = (stopsList: Stop[]): Stop[] => {
		return stopsList.map((stop: Stop, index: number) => ({
			...stop,
			id: String.fromCharCode(65 + index), // A, B, C, D, E
		}));
	};

	const handleRemoveStop = (stopId: string): void => {
		const newStops = stops.filter((stop: Stop) => stop.id !== stopId);
		setStops(reindexStops(newStops));
	};

	const handleAddStop = () => {
		if (stops.length < MAX_STOPS) {
			const nextLetter = String.fromCharCode(65 + stops.length); // A, B, C, D, E
			setStops([...stops, { id: nextLetter, value: "" }]);
		} else {
			// Navigate to Maximum Stops screen (RA40) when 5-stop limit is reached
			navigate("/rides/enter/multi-stops/max", {
				state: {
					pickup,
					stops,
					rideType,
					tripDirection,
					passengers,
					schedule,
				},
			});
		}
	};

	const handleStopChange = (stopId: string, value: string): void => {
		setStops(
			stops.map((stop: Stop) =>
				stop.id === stopId
					? { ...stop, value, address: value, coordinates: undefined }
					: stop,
			),
		);
	};

	const handlePickStopOnMap = (stopId: string): void => {
		const stopToEdit = stops.find((stop) => stop.id === stopId);
		navigate("/rides/enter/map", {
			state: {
				pickup,
				destination: stopToEdit?.value || "",
				destinationCoords: stopToEdit?.coordinates,
				stops,
				rideType,
				tripDirection,
				passengers,
				schedule,
				isMultiStop: true,
				returnRoute: "/rides/enter/multi-stops",
				mapPickStopId: stopId,
			},
		});
	};

	const handleLocateOnMap = () => {
		const emptyStop = stops.find((stop: Stop) => !stop.value.trim());
		if (emptyStop) {
			handlePickStopOnMap(emptyStop.id);
			return;
		}

		if (stops.length < MAX_STOPS) {
			const nextLetter = String.fromCharCode(65 + stops.length);
			const expandedStops = [...stops, { id: nextLetter, value: "" }];
			navigate("/rides/enter/map", {
				state: {
					pickup,
					destination: "",
					stops: expandedStops,
					rideType,
					tripDirection,
					passengers,
					schedule,
					isMultiStop: true,
					returnRoute: "/rides/enter/multi-stops",
					mapPickStopId: nextLetter,
				},
			});
			return;
		}

		handlePickStopOnMap(stops[stops.length - 1]?.id || "A");
	};

	const handleContinue = () => {
		// Validation: pickup and at least one stop with value required
		const hasValidStops = stops.some(
			(stop: Stop) => stop.value.trim() !== "",
		);

		if (!pickup.trim() || !hasValidStops) {
			setShowError(true);
			return;
		}

		navigate("/rides/options", {
			state: {
				pickup,
				stops: stops.filter((stop: Stop) => stop.value.trim() !== ""),
				rideType,
				tripDirection,
				passengers,
				schedule,
				isMultiStop: true,
			},
		});
	};

	const canContinue =
		pickup.trim() !== "" && stops.some((stop) => stop.value.trim() !== "");

	return (
		<ScreenScaffold
			header={<PageHeader title="Enter Destination" />}
		>
			{/* Route Setup Card */}
			<Card
				elevation={0}
				sx={{
					borderRadius: uiTokens.radius.md,
					bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : t.palette.background.paper,
					border: theme.palette.mode === "light"
							? "1px solid rgba(0,0,0,0.1)"
							: "1px solid rgba(255,255,255,0.1)",
					boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
				}}
			>
					<CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.lg }}>
						<Stack spacing={uiTokens.spacing.lg}>
							{/* Pickup Point - Non-deletable */}
							<TextField
								fullWidth
								size="small"
								variant="outlined"
								value={pickup}
								onChange={(e) => setPickup(e.target.value)}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Box
												sx={{
													width: 24,
													height: 24,
													borderRadius: "50%",
													bgcolor: "#4CAF50",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												<Box
													sx={{
														width: 8,
														height: 8,
														borderRadius: "50%",
														bgcolor: "#FFFFFF",
													}}
												/>
											</Box>
										</InputAdornment>
									),
								}}
								sx={{
									"& .MuiOutlinedInput-root": {
										borderRadius: uiTokens.radius.xl,
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
								}}
							/>

							{/* Stops A, B, C, etc. */}
							{stops.map((stop: Stop) => {
								const isSquare = stop.id === "B"; // Stop B is square per spec, others are circular
								return (
									<Box
										key={stop.id}
										sx={{
											display: "flex",
											gap: uiTokens.spacing.sm,
											alignItems: "center",
										}}
									>
										<TextField
											fullWidth
											size="small"
											variant="outlined"
											value={stop.value}
											onChange={(e) =>
												handleStopChange(
													stop.id,
													e.target.value,
												)
											}
											placeholder={`Stop ${stop.id}`}
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<Box
															sx={{
																width: 24,
																height: 24,
																borderRadius:
																	isSquare
																		? 1
																		: "50%", // Square for B, circular for others
																bgcolor:
																	"rgba(15,23,42,0.9)",
																color: "#F9FAFB",
																display: "flex",
																alignItems:
																	"center",
																justifyContent:
																	"center",
																fontSize: 12,
																fontWeight: 600,
															}}
														>
															{stop.id}
														</Box>
													</InputAdornment>
												),
												endAdornment: (
													<InputAdornment position="end">
														<Stack direction="row" spacing={0.25}>
															<IconButton
																size="small"
																onClick={() =>
																	handlePickStopOnMap(
																		stop.id,
																	)
																}
																sx={{
																	color: theme
																		.palette
																		.text
																		.secondary,
																	"&:hover": {
																		bgcolor:
																			theme
																				.palette
																				.mode ===
																			"light"
																				? "rgba(0,0,0,0.05)"
																				: "rgba(255,255,255,0.05)",
																	},
																}}
															>
																<MapRoundedIcon
																	sx={{ fontSize: 17 }}
																/>
															</IconButton>
															<IconButton
																size="small"
																onClick={() =>
																	handleRemoveStop(
																		stop.id,
																	)
																}
																sx={{
																	color: theme
																		.palette
																		.text
																		.secondary,
																	"&:hover": {
																		bgcolor:
																			theme
																				.palette
																				.mode ===
																			"light"
																				? "rgba(0,0,0,0.05)"
																				: "rgba(255,255,255,0.05)",
																	},
																}}
															>
																<CloseRoundedIcon
																	sx={{
																		fontSize: 18,
																	}}
																/>
															</IconButton>
														</Stack>
													</InputAdornment>
												),
											}}
											sx={{
												"& .MuiOutlinedInput-root": {
													borderRadius: uiTokens.radius.xl,
													bgcolor:
														theme.palette.mode ===
														"light"
															? "rgba(0,0,0,0.05)"
															: "rgba(255,255,255,0.05)",
													color: theme.palette.text
														.primary,
													"& fieldset": {
														borderColor:
															theme.palette
																.mode ===
															"light"
																? "rgba(0,0,0,0.15)"
																: "rgba(255,255,255,0.2)",
													},
													"&:hover fieldset": {
														borderColor:
															accentGreen,
													},
													"&.Mui-focused fieldset": {
														borderColor:
															accentGreen,
													},
												},
											}}
										/>
									</Box>
								);
							})}

							{/* Add Stop Field */}
							{stops.length < MAX_STOPS && (
								<Stack direction="row" spacing={uiTokens.spacing.sm}>
									<TextField
										fullWidth
										size="small"
										variant="outlined"
										placeholder="Add stop."
										onClick={handleAddStop}
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
												borderRadius: uiTokens.radius.xl,
												bgcolor:
													theme.palette.mode === "light"
														? "rgba(0,0,0,0.05)"
														: "rgba(255,255,255,0.05)",
												color: theme.palette.text.primary,
												cursor: "pointer",
												"& fieldset": {
													borderColor:
														theme.palette.mode ===
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
									<Button
										variant="outlined"
										onClick={() => setShowAddStopModal(true)}
										size="small"
										sx={{
											minWidth: 112,
											borderRadius: uiTokens.radius.xl,
											textTransform: "none",
											fontSize: 12,
										}}
									>
										Search stop
									</Button>
								</Stack>
							)}

							{stops.length >= MAX_STOPS && (
								<Button
									fullWidth
									variant="outlined"
									size="small"
									onClick={() => setShowAddStopModal(true)}
									sx={{
										borderRadius: uiTokens.radius.xl,
										textTransform: "none",
										fontSize: 12
									}}
								>
									Search and replace a stop
								</Button>
							)}

							{/* Date & Time Selector */}
							<Button
								variant="outlined"
								startIcon={
									<CalendarTodayRoundedIcon
										sx={{ fontSize: 18 }}
									/>
								}
								endIcon={
									<KeyboardArrowDownRoundedIcon
										sx={{ fontSize: 18 }}
									/>
								}
								sx={{
									borderRadius: uiTokens.radius.xl,
									textTransform: "none",
									borderColor:
										theme.palette.mode === "light"
											? "rgba(0,0,0,0.15)"
											: "rgba(255,255,255,0.2)",
									color: theme.palette.text.primary,
									bgcolor:
										theme.palette.mode === "light"
											? "rgba(0,0,0,0.05)"
											: "rgba(255,255,255,0.05)",
									"&:hover": {
										borderColor: accentGreen,
										bgcolor: "rgba(3,205,140,0.1)",
									},
									justifyContent: "flex-start",
								}}
							>
								{schedule}
							</Button>
						</Stack>
					</CardContent>
				</Card>

			{/* Lower Section Cards */}
				{/* Error Alert */}
				{showError && (
					<Alert
						severity="error"
						sx={{ mb: uiTokens.spacing.lg }}
						onClose={() => setShowError(false)}
					>
						Please provide pickup location and at least one
						destination.
					</Alert>
				)}

				{/* Trip Type Section */}
				<Stack spacing={uiTokens.spacing.md} sx={{ mb: uiTokens.spacing.lg }}>
					{/* Ride Type Dropdown */}
					<Card
						elevation={0}
						sx={{
							borderRadius: uiTokens.radius.sm,
							bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : t.palette.background.paper,
							border:
								theme.palette.mode === "light"
									? "1px solid rgba(0,0,0,0.1)"
									: "1px solid rgba(255,255,255,0.1)",
						}}
					>
						<CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.md }}>
							<FormControl fullWidth size="small">
								<Select
									value={rideType}
									onChange={(e) =>
										setRideType(e.target.value)
									}
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
											<Typography>{value}</Typography>
										</Box>
									)}
									sx={{
										borderRadius: uiTokens.radius.xl,
										bgcolor:
											theme.palette.mode === "light"
												? "rgba(0,0,0,0.05)"
												: "rgba(255,255,255,0.05)",
										color: theme.palette.text.primary,
										"& .MuiOutlinedInput-notchedOutline": {
											borderColor:
												theme.palette.mode === "light"
													? "rgba(0,0,0,0.15)"
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
											Business
										</Box>
									</MenuItem>
									<MenuItem value="Group">
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												gap: 1,
											}}
										>
											<GroupRoundedIcon
												sx={{ fontSize: 18 }}
											/>
											Group
										</Box>
									</MenuItem>
									<MenuItem value="Delivery">
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
											Delivery
										</Box>
									</MenuItem>
								</Select>
							</FormControl>
						</CardContent>
					</Card>

					{/* Trip Direction Dropdown */}
					<Card
						elevation={0}
						sx={{
							borderRadius: uiTokens.radius.sm,
							bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : t.palette.background.paper,
							border:
								theme.palette.mode === "light"
									? "1px solid rgba(0,0,0,0.1)"
									: "1px solid rgba(255,255,255,0.1)",
						}}
					>
						<CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.md }}>
							<FormControl fullWidth size="small">
								<Select
									value={tripDirection}
									onChange={(e) =>
										setTripDirection(e.target.value)
									}
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
											<Typography>{value}</Typography>
										</Box>
									)}
									sx={{
										borderRadius: uiTokens.radius.xl,
										bgcolor:
											theme.palette.mode === "light"
												? "rgba(0,0,0,0.05)"
												: "rgba(255,255,255,0.05)",
										color: theme.palette.text.primary,
										"& .MuiOutlinedInput-notchedOutline": {
											borderColor:
												theme.palette.mode === "light"
													? "rgba(0,0,0,0.15)"
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
									<MenuItem value="One Way">
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
											One Way
										</Box>
									</MenuItem>
									<MenuItem value="Round Trip">
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
											Round Trip
										</Box>
									</MenuItem>
									<MenuItem value="Multi-stop">
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
								</Select>
							</FormControl>
						</CardContent>
					</Card>
				</Stack>

				{/* Passenger Selection */}
				<Card
					elevation={0}
					sx={{
						mb: uiTokens.spacing.xl,
						borderRadius: uiTokens.radius.sm,
						bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : t.palette.background.paper,
						border:
							theme.palette.mode === "light"
								? "1px solid rgba(0,0,0,0.1)"
								: "1px solid rgba(255,255,255,0.1)",
					}}
				>
					<CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.md }}>
						<Typography
							variant="subtitle2"
							sx={{
								fontWeight: 600,
								mb: uiTokens.spacing.md,
								color: theme.palette.text.primary,
							}}
						>
							Passengers
						</Typography>
						<Stack
							direction="row"
							spacing={1}
							sx={{
								flexWrap: "nowrap",
								overflowX: "auto",
								"&::-webkit-scrollbar": { display: "none" },
								scrollbarWidth: "none",
								mb: uiTokens.spacing.md,
							}}
						>
							{passengerOptions.map((pax) => (
								<Chip
									key={pax}
									label={pax}
									size="small"
									onClick={() => {
										setPassengers(pax);
										setCustomPassengers("");
									}}
									sx={{
										minWidth: 48,
										width: 48,
										height: 48,
										borderRadius: uiTokens.radius.sm,
										fontSize: 14,
										fontWeight: 600,
										flexShrink: 0,
										bgcolor:
											passengers === pax &&
											!customPassengers
												? lightGreen
												: theme.palette.mode === "light"
													? "rgba(0,0,0,0.05)"
													: "rgba(255,255,255,0.05)",
										color:
											passengers === pax &&
											!customPassengers
												? accentGreen
												: theme.palette.text.primary,
										border:
											passengers === pax &&
											!customPassengers
												? "none"
												: theme.palette.mode === "light"
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
						</Stack>
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

			{/* Page Action Section */}
			<Box
				sx={{
					bgcolor: contentBg,
					border:
						theme.palette.mode === "light"
							? "1px solid rgba(0,0,0,0.1)"
							: "1px solid rgba(255,255,255,0.1)",
					borderRadius: uiTokens.radius.sm,
					px: uiTokens.spacing.md,
					py: uiTokens.spacing.md,
				}}
			>
				<Stack direction="row" spacing={uiTokens.spacing.sm}>
					<Button
						fullWidth
						size="small"
						variant="outlined"
						onClick={handleLocateOnMap}
						startIcon={<MapRoundedIcon />}
						sx={{
							borderRadius: uiTokens.radius.xl,
							py: 0.8,
							fontSize: 12,
							textTransform: "none"
						}}
					>
						Pick on map
					</Button>
					<Button
						fullWidth
						size="small"
						variant="contained"
						onClick={handleContinue}
						disabled={!canContinue}
						sx={{
							borderRadius: uiTokens.radius.xl,
							py: 0.8,
							fontSize: 12,
							fontWeight: 600,
							textTransform: "none"
						}}
					>
						Save & continue
					</Button>
				</Stack>
			</Box>

			<AddStopModal
				open={showAddStopModal}
				onClose={() => setShowAddStopModal(false)}
				onSelectStop={(stop) => {
					if (stops.length >= MAX_STOPS) {
						const replacement = [...stops];
						replacement[replacement.length - 1] = {
							id: replacement[replacement.length - 1]?.id || stop.id,
							value: stop.value,
							coordinates: stop.coordinates,
							address: stop.address,
						};
						setStops(reindexStops(replacement));
						return;
					}
					setStops([
						...stops,
						{
							id: String.fromCharCode(65 + stops.length),
							value: stop.value,
							coordinates: stop.coordinates,
							address: stop.address,
						},
					]);
				}}
				currentStopCount={stops.length}
			/>
		</ScreenScaffold>
	);
}

export default function RiderScreen39EnterDestinationMultipleStopsCanvas_v2() {
	return (
		<Box
			sx={{
				position: "relative",
				minHeight: "100vh",
				bgcolor: (t) => t.palette.background.default,
			}}
		>

				<EnterDestinationMultipleStopsScreen />
			
		</Box>
	);
}
