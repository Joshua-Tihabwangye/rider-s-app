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

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

const MAX_STOPS = 6; // A-F

function EnterDestinationMaxStopsScreen(): React.JSX.Element {
	const navigate = useNavigate();
	const location = useLocation();
	const theme = useTheme();
	const initialState = location.state || {};

	interface Stop {
		id: string;
		value: string;
	}

	const [pickup] = useState(
		initialState.pickup || "Entebbe International Airport",
	);
	const [stops, setStops] = useState<Stop[]>(
		initialState.stops || [
			{ id: "A", value: "Abayita Ababiri, Lyamu..." },
			{ id: "B", value: "Belle Vue Rooftop" },
			{ id: "C", value: "Freedom City Mall" },
			{ id: "D", value: "Kampala City" },
			{ id: "E", value: "Kampala City" },
			{ id: "F", value: "Kampala City" },
		],
	);
	const [ridePurpose, setRidePurpose] = useState(
		initialState.ridePurpose || "Personal",
	);
	const [tripDirection, setTripDirection] = useState(
		initialState.tripDirection || "One Way",
	);
	const [passengers, setPassengers] = useState(initialState.passengers || 1);
	const [customPassengers, setCustomPassengers] = useState("");
	const [schedule] = useState(initialState.schedule || "Now");
	const [showError, setShowError] = useState(false);
	const [showMaxStopsMessage, setShowMaxStopsMessage] = useState(false);

	// Theme-aware colors
	const headerBg = "#03CD8C"; // Green header
	const headerText = "#FFFFFF";
	const contentBg =
		theme.palette.mode === "light"
			? "#FFFFFF"
			: theme.palette.background.paper;
	const accentGreen = "#03CD8C"; // Green
	const lightGreen = "rgba(3,205,140,0.1)"; // Light green for active passenger

	const passengerOptions = [1, 2, 3, 4, 5, 6];

	// Re-index stops alphabetically when one is removed
	const reindexStops = (stopsList: Stop[]): Stop[] => {
		return stopsList.map((stop: Stop, index: number) => ({
			...stop,
			id: String.fromCharCode(65 + index), // A, B, C, D, E, F
		}));
	};

	const handleRemoveStop = (stopId: string): void => {
		const newStops = stops.filter((stop: Stop) => stop.id !== stopId);
		setStops(reindexStops(newStops));
		setShowMaxStopsMessage(false);
	};

	const handleAddStop = () => {
		if (stops.length < MAX_STOPS) {
			const nextLetter = String.fromCharCode(65 + stops.length); // A-F
			setStops([...stops, { id: nextLetter, value: "" }]);
			setShowMaxStopsMessage(false);
		} else {
			setShowMaxStopsMessage(true);
			setTimeout(() => setShowMaxStopsMessage(false), 3000);
		}
	};

	const handleStopChange = (stopId: string, value: string): void => {
		setStops(
			stops.map((stop: Stop) =>
				stop.id === stopId ? { ...stop, value } : stop,
			),
		);
	};

	const handleLocateOnMap = () => {
		navigate("/rides/enter/preferences", {
			state: {
				pickup,
				stops,
				ridePurpose,
				tripDirection,
				passengers,
				schedule,
				isMaxStops: true,
			},
		});
	};

	const handleContinue = () => {
		// Validation: pickup and at least one stop with value required
		const hasValidStops = stops.some(
			(stop: Stop) => stop.value.trim() !== "",
		);

		// Check for duplicate addresses
		const addresses = stops
			.map((s: Stop) => s.value.trim().toLowerCase())
			.filter((a: string) => a !== "");
		const hasDuplicates = addresses.length !== new Set(addresses).size;

		if (!pickup.trim() || !hasValidStops) {
			setShowError(true);
			return;
		}

		if (hasDuplicates) {
			setShowError(true);
			return;
		}

		navigate("/rides/options", {
			state: {
				pickup,
				stops: stops.filter((stop: Stop) => stop.value.trim() !== ""),
				ridePurpose,
				tripDirection,
				passengers,
				schedule,
				isMaxStops: true,
			},
		});
	};

	const canContinue =
		pickup.trim() !== "" &&
		stops.some((stop: Stop) => stop.value.trim() !== "");

	return (
		<Box
			sx={{
				minHeight: "100vh",
				bgcolor: theme.palette.mode === "light" ? "#F3F4F6" : "#03CD8C",
				paddingBottom: {
					xs: "calc(100px + env(safe-area-inset-bottom))",
					sm: "120px",
				},
			}}
		>
			{/* Header Section - Deep Navy */}
			<Box
				sx={{
					px: 2.5,
					pt: 2.5,
					pb: 2,
					bgcolor: headerBg,
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1.5,
						mb: 2,
					}}
				>
					<IconButton
						size="small"
						aria-label="Back"
						onClick={() => navigate(-1)}
						sx={{
							borderRadius: 999,
							bgcolor: "rgba(255,255,255,0.1)",
							color: headerText,
							"&:hover": {
								bgcolor: "rgba(255,255,255,0.2)",
							},
						}}
					>
						<ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
					</IconButton>
					<Typography
						variant="subtitle1"
						sx={{
							fontWeight: 600,
							letterSpacing: "-0.01em",
							color: headerText,
						}}
					>
						Enter Destination
					</Typography>
				</Box>

				{/* Route Setup Card */}
				<Card
					elevation={0}
					sx={{
						borderRadius: 2,
						bgcolor: contentBg,
						border:
							theme.palette.mode === "light"
								? "1px solid rgba(0,0,0,0.1)"
								: "1px solid rgba(255,255,255,0.1)",
						maxHeight: "60vh",
						overflowY: "auto",
					}}
				>
					<CardContent sx={{ px: 2, py: 2 }}>
						<Stack spacing={2}>
							{/* Pickup Point - Locked with Green Dot Marker */}
							<TextField
								fullWidth
								size="small"
								variant="outlined"
								value={pickup}
								disabled
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Box
												sx={{
													width: 12,
													height: 12,
													borderRadius: "50%",
													bgcolor: "#4CAF50",
													border: "2px solid white",
													boxShadow:
														"0 2px 4px rgba(0,0,0,0.2)",
												}}
											/>
										</InputAdornment>
									),
								}}
								sx={{
									"& .MuiOutlinedInput-root": {
										borderRadius: 999,
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
										"&.Mui-disabled": {
											bgcolor:
												theme.palette.mode === "light"
													? "rgba(0,0,0,0.03)"
													: "rgba(255,255,255,0.03)",
											color: theme.palette.text.secondary,
										},
									},
								}}
							/>

							{/* Destination Fields A-F */}
							{stops.map((stop: Stop, index: number) => {
								const isLast = index === stops.length - 1;
								return (
									<Box
										key={stop.id}
										sx={{
											display: "flex",
											gap: 1,
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
														{isLast ? (
															// Orange pin icon for final stop
															<PlaceRoundedIcon
																sx={{
																	fontSize: 20,
																	color: "#FF9800",
																}}
															/>
														) : (
															// Letter badge for other stops
															<Box
																sx={{
																	width: 24,
																	height: 24,
																	borderRadius:
																		"50%",
																	bgcolor:
																		"rgba(15,23,42,0.9)",
																	color: "#F9FAFB",
																	display:
																		"flex",
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
														)}
													</InputAdornment>
												),
												endAdornment: (
													<InputAdornment position="end">
														<Box
															sx={{
																display: "flex",
																alignItems:
																	"center",
																gap: 0.5,
															}}
														>
															<DragIndicatorRoundedIcon
																sx={{
																	fontSize: 18,
																	color: theme
																		.palette
																		.text
																		.secondary,
																	cursor: "grab",
																	"&:active":
																		{
																			cursor: "grabbing",
																		},
																}}
															/>
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
														</Box>
													</InputAdornment>
												),
											}}
											sx={{
												"& .MuiOutlinedInput-root": {
													borderRadius: 999,
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

							{/* Add Stop Button */}
							{stops.length < MAX_STOPS && (
								<Button
									fullWidth
									size="small"
									onClick={handleAddStop}
									startIcon={
										<AddRoundedIcon sx={{ fontSize: 18 }} />
									}
									sx={{
										borderRadius: 999,
										textTransform: "none",
										fontSize: 12,
										bgcolor:
											theme.palette.mode === "light"
												? "rgba(0,0,0,0.05)"
												: "rgba(255,255,255,0.05)",
										color: theme.palette.text.primary,
										border:
											theme.palette.mode === "light"
												? "1px solid rgba(0,0,0,0.15)"
												: "1px solid rgba(255,255,255,0.2)",
										"&:hover": {
											bgcolor:
												theme.palette.mode === "light"
													? "rgba(0,0,0,0.1)"
													: "rgba(255,255,255,0.1)",
											borderColor: accentGreen,
										},
									}}
								>
									Add Stop
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
									borderRadius: 999,
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
			</Box>

			{/* Lower Section */}
			<Box
				sx={{
					px: 2.5,
					pt: 2,
					bgcolor: contentBg,
					minHeight: "calc(100vh - 200px)",
				}}
			>
				{/* Error Alert */}
				{showError && (
					<Alert
						severity="error"
						sx={{ mb: 2 }}
						onClose={() => setShowError(false)}
					>
						Please provide pickup location and at least one
						destination. Duplicate addresses are not allowed.
					</Alert>
				)}

				{/* Maximum Stops Message */}
				{showMaxStopsMessage && (
					<Alert
						severity="info"
						sx={{ mb: 2 }}
						onClose={() => setShowMaxStopsMessage(false)}
					>
						Maximum number of stops reached.
					</Alert>
				)}

				{/* Trip Type Section */}
				<Stack spacing={1.5} sx={{ mb: 2 }}>
					{/* Ride Purpose Dropdown */}
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
								<Select
									value={ridePurpose}
									onChange={(e) =>
										setRidePurpose(e.target.value)
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
										borderRadius: 999,
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
									<MenuItem value="Shared Ride">
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
											Shared Ride
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
										borderRadius: 999,
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

				{/* Passenger Count Selector */}
				<Card
					elevation={0}
					sx={{
						mb: 2.5,
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
						<Stack
							direction="row"
							spacing={1}
							sx={{
								flexWrap: "nowrap",
								overflowX: "auto",
								"&::-webkit-scrollbar": { display: "none" },
								scrollbarWidth: "none",
								mb: 1.5,
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
										borderRadius: 2,
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
			</Box>

			{/* Fixed Bottom Section */}
			<Box
				sx={{
					position: "fixed",
					bottom: {
						xs: "calc(64px + env(safe-area-inset-bottom))",
						sm: 64,
					},
					left: 0,
					right: 0,
					bgcolor: contentBg,
					borderTop:
						theme.palette.mode === "light"
							? "1px solid rgba(0,0,0,0.1)"
							: "1px solid rgba(255,255,255,0.1)",
					px: 2.5,
					py: 2,
					zIndex: 999,
					width: "100%",
					maxWidth: "100%",
					margin: 0,
				}}
			>
				{/* Locate on Map Button */}
				<Button
					fullWidth
					onClick={handleLocateOnMap}
					sx={{
						mb: 1.5,
						color: accentGreen,
						textTransform: "none",
						fontSize: 14,
						fontWeight: 500,
						"&:hover": {
							bgcolor: "rgba(3,205,140,0.1)",
						},
					}}
					startIcon={<MapRoundedIcon />}
				>
					Locate on Map
				</Button>

				{/* Continue Button */}
				<Button
					fullWidth
					variant="contained"
					onClick={handleContinue}
					disabled={!canContinue}
					sx={{
						borderRadius: 2,
						py: 1.5,
						fontSize: 16,
						fontWeight: 600,
						textTransform: "none",
						bgcolor: canContinue ? "#000000" : "rgba(0,0,0,0.2)",
						color: "#FFFFFF",
						boxShadow: "none",
						"&:hover": {
							bgcolor: canContinue
								? "#333333"
								: "rgba(0,0,0,0.3)",
							boxShadow: "none",
						},
						"&.Mui-disabled": {
							bgcolor: "rgba(0,0,0,0.2)",
							color: "#FFFFFF",
							opacity: 1,
						},
					}}
				>
					Continue
				</Button>
			</Box>
		</Box>
	);
}

export default function RiderScreen40EnterDestinationMaxStopsCanvas_v2() {
	return (
		<Box
			sx={{
				position: "relative",
				minHeight: "100vh",
				bgcolor: (t) => t.palette.background.default,
			}}
		>

				<EnterDestinationMaxStopsScreen />
			
		</Box>
	);
}
