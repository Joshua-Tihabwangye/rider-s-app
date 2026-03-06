import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Avatar
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import StraightenRoundedIcon from "@mui/icons-material/StraightenRounded";
import MobileShell from "../components/MobileShell";

function CompletedTripSummaryScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { rideId } = useParams();

  // Mock trip data - would come from API: GET /completed_rides/{ride_id}
  const tripData = {
    id: rideId || "ride_001",
    status: "Completed",
    title: "Ride Info",
    pickup: {
      location: "New School, JJ Street, Kampala",
      timestamp: "02:30 PM"
    },
    dropoff: {
      location: "New School, JJ Street, Kampala",
      timestamp: "03:15 PM"
    },
    sharedPassengers: [
      { name: "John", initials: "JD", id: "p1" },
      { name: "Mary", initials: "MK", id: "p2" },
      { name: "David", initials: "DK", id: "p3" },
      { name: "Sarah", initials: "SA", id: "p4" }
    ],
    tripStats: {
      distance: 54,
      distanceCovered: 54,
      totalTime: "2 hr 20 mins"
    },
    booking: {
      bookedAt: "05:15 PM, Oct 14",
      travelDate: "Oct 16",
      tripDistance: "12 km",
      fare: "UGX 20,000"
    },
    driver: {
      name: "Bwanbale",
      vehicle: "Tesla Model X",
      licensePlate: "UPL 630",
      rating: 4.5
    },
    routeStops: [
      { name: "Entebbe International Airport", time: "12:10 PM", distance: null, completed: true },
      { name: "Akright City", time: "12:40 PM", distance: "8 km", completed: true },
      { name: "Kitende", time: "1:10 PM", distance: "10 km", completed: true },
      { name: "Kampala City", time: "1:30 PM", distance: null, completed: false }
    ],
    tripBreakdown: [
      { time: "10:00 AM", distance: 0 },
      { time: "10:30 AM", distance: 8 },
      { time: "11:00 AM", distance: 15 },
      { time: "11:30 AM", distance: 22 },
      { time: "12:00 PM", distance: 30 },
      { time: "12:30 PM", distance: 38 },
      { time: "1:00 PM", distance: 45 },
      { time: "1:30 PM", distance: 50 }
    ]
  };

  const handleRateDriver = () => {
    navigate("/rides/rating/driver", {
      state: {
        driverName: tripData.driver.name,
        driverRating: tripData.driver.rating,
        rideId: tripData.id
      }
    });
  };

  const maxDistance = Math.max(...tripData.tripBreakdown.map(d => d.distance));

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header with Status Tag and Title */}
      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 999,
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
              border: (theme) =>
                theme.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <Chip
                label="Completed"
                size="small"
                sx={{
                  bgcolor: "#00C851",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: 11,
                  height: 22,
                  "& .MuiChip-label": {
                    px: 1
                  }
                }}
              />
            <Typography
                variant="h6"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
                {tripData.title}
            </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Trip Overview Card */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 2, py: 2 }}>
          {/* Pickup & Drop-off Points */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1.5 }}>
        <Box
          sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#22c55e",
                  mt: 0.75,
                  flexShrink: 0
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block", mb: 0.25 }}
                >
                  From
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, letterSpacing: "-0.01em", mb: 0.25 }}
                >
                  {tripData.pickup.location}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  {tripData.pickup.timestamp}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
              <PlaceRoundedIcon
            sx={{
                  fontSize: 20,
                  color: "primary.main",
                  mt: 0.5,
                  flexShrink: 0
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block", mb: 0.25 }}
                >
                  To
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, letterSpacing: "-0.01em", mb: 0.25 }}
                >
                  {tripData.dropoff.location}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  {tripData.dropoff.timestamp}
                </Typography>
              </Box>
            </Box>
        </Box>

          {/* Shared Passengers */}
          {tripData.sharedPassengers && tripData.sharedPassengers.length > 0 && (
            <Box sx={{ mb: 2, pt: 1.5, borderTop: "1px solid", borderColor: (t) => t.palette.divider }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Shared Passengers
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  {tripData.sharedPassengers.slice(0, 5).map((passenger, index) => (
                    <Avatar
                      key={passenger.id || index}
          sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "primary.main",
                        fontSize: 12,
                        fontWeight: 600,
                        border: "2px solid",
                        borderColor: (t) => t.palette.background.default
          }}
        >
                      {passenger.initials}
                    </Avatar>
                  ))}
                  {tripData.sharedPassengers.length > 5 && (
                    <Avatar
            sx={{
                        width: 32,
                        height: 32,
                        bgcolor: (t) => t.palette.mode === "light" ? "#F3F4F6" : "rgba(51,65,85,0.9)",
                        fontSize: 11,
                        fontWeight: 600,
                        color: (t) => t.palette.text.primary,
                        border: "2px solid",
                        borderColor: (t) => t.palette.background.default
                      }}
                    >
                      +{tripData.sharedPassengers.length - 5}
                    </Avatar>
                  )}
                </Box>
        </Box>
      </Box>
          )}

          {/* Trip Stats */}
          <Box sx={{ pt: 1.5, borderTop: "1px solid", borderColor: (t) => t.palette.divider }}>
            <Stack direction="row" spacing={2}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}
                >
                  Distance
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {tripData.tripStats.distance} Km
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}
                >
                  Distance Covered
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {tripData.tripStats.distanceCovered} Km
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}
                >
                  Total Time
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {tripData.tripStats.totalTime}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Booking Summary */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 2, py: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, mb: 1.5, fontSize: 13 }}
          >
            Booking Summary
          </Typography>
          <Stack spacing={1.25}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarTodayRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}
              >
                  Booking Time
              </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Booked {tripData.booking.bookedAt}
              </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarTodayRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}
                >
                  Travel Date
              </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {tripData.booking.travelDate}
              </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <StraightenRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}
                >
                  Trip Distance
              </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {tripData.booking.tripDistance}
              </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ReceiptLongRoundedIcon
                sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, display: "block" }}
                >
                  Fare
              </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#22c55e" }}>
                  {tripData.booking.fare}
              </Typography>
            </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Driver Section */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 2, py: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, mb: 1.5, fontSize: 13 }}
          >
            Driver
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: "primary.main",
                fontSize: 20,
                fontWeight: 600
              }}
            >
              {tripData.driver.name.substring(0, 2).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.25 }}>
                {tripData.driver.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 12, color: (t) => t.palette.text.secondary, display: "block" }}
              >
                {tripData.driver.vehicle} – {tripData.driver.licensePlate}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25 }}>
                <StarRoundedIcon sx={{ fontSize: 14, color: "#FFC107" }} />
                <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600 }}>
                  {tripData.driver.rating}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Button
            fullWidth
            variant="contained"
            onClick={handleRateDriver}
            sx={{
              bgcolor: "#F77F00",
              color: "#FFFFFF",
              borderRadius: 999,
              py: 0.9,
              fontSize: 13,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                bgcolor: "#E66A00"
              }
            }}
          >
            Rate Driver
          </Button>
        </CardContent>
      </Card>

      {/* Route Details (My Route) */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 2, py: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, mb: 1.5, fontSize: 13 }}
          >
            My Route
          </Typography>
          <Box sx={{ position: "relative", pl: 2 }}>
            {/* Vertical progress line */}
            <Box
              sx={{
                position: "absolute",
                left: 7,
                top: 8,
                bottom: 8,
                width: 2,
                bgcolor: (t) => t.palette.mode === "light" ? "#E5E7EB" : "rgba(51,65,85,0.9)"
              }}
            />
            <Stack spacing={2}>
              {tripData.routeStops.map((stop, index) => (
                <Box key={index} sx={{ position: "relative" }}>
                  {/* Dot marker */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: -17,
                      top: 4,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: stop.completed ? "#22c55e" : "transparent",
                      border: stop.completed ? "2px solid #22c55e" : "2px solid",
                      borderColor: stop.completed ? "#22c55e" : (t) => t.palette.mode === "light" ? "#D1D5DB" : "#4B5563",
                      zIndex: 1
                    }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.25 }}>
                      {stop.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                      >
                        {stop.time}
                      </Typography>
                      {stop.distance && (
                        <>
            <Typography
              variant="caption"
                            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
                            •
            </Typography>
            <Typography
                            variant="caption"
                            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
                            {stop.distance}
            </Typography>
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Trip Breakdown (Graph) */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 2, py: 2 }}>
            <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, mb: 2, fontSize: 13 }}
          >
            Trip Breakdown
          </Typography>
          
          {/* Bar Chart */}
          <Box sx={{ position: "relative", height: 180, mb: 1 }}>
            {/* Y-Axis labels */}
            <Box
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 30,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-end",
                pr: 0.5
              }}
            >
              {[50, 40, 30, 20, 10, 0].map((value) => (
                <Typography
                  key={value}
                  variant="caption"
                  sx={{ fontSize: 9, color: (t) => t.palette.text.secondary }}
            >
                  {value}
            </Typography>
              ))}
            </Box>

            {/* Chart area */}
            <Box
              sx={{
                ml: 4,
                height: "100%",
                display: "flex",
                alignItems: "flex-end",
                gap: 0.5,
                position: "relative"
              }}
            >
              {tripData.tripBreakdown.map((data, index) => {
                const heightPercent = (data.distance / maxDistance) * 100;
                return (
                  <Box
                    key={index}
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 0.25
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: `${heightPercent}%`,
                        minHeight: data.distance > 0 ? 4 : 0,
                        bgcolor: "#03CD8C",
                        borderRadius: "2px 2px 0 0",
                        transition: "all 0.3s ease"
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: 8,
                        color: (t) => t.palette.text.secondary,
                        writingMode: "vertical-rl",
                        textOrientation: "mixed",
                        transform: "rotate(180deg)",
                        height: 40,
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      {data.time}
            </Typography>
          </Box>
                );
              })}
            </Box>

            {/* Y-Axis label */}
            <Typography
              variant="caption"
              sx={{
                fontSize: 9,
                color: (t) => t.palette.text.secondary,
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "rotate(-90deg) translateX(50%)",
                transformOrigin: "center"
              }}
            >
              Distance (KM)
            </Typography>
          </Box>

          {/* X-Axis labels (horizontal) */}
          <Box
            sx={{
              ml: 4,
              display: "flex",
              justifyContent: "space-between",
              gap: 0.5
            }}
              >
            {tripData.tripBreakdown.map((data, index) => (
              <Typography
                key={index}
                variant="caption"
                sx={{fontSize: 9,
                  color: (t) => t.palette.text.secondary,
                  flex: 1,
                  textAlign: "center"
                }}
              >
                {data.time.split(" ")[0]}
              </Typography>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Receipt & issue actions */}
      <Stack direction="row" spacing={1.25} sx={{ mb: 1.5 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<ReceiptLongRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{
            borderRadius: 999,
            py: 0.9,
            fontSize: 13,
            textTransform: "none"
          }}
        >
          Download receipt
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<FlagRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{
            borderRadius: 999,
            py: 0.9,
            fontSize: 13,
            textTransform: "none",
            borderColor: "#F97316",
            color: "#EA580C",
            "&:hover": {
              borderColor: "#EA580C",
              bgcolor: "rgba(248,153,56,0.06)"
            }
          }}
        >
          Report an issue
        </Button>
      </Stack>

      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
      >
        You can always find this trip again from Rides → History if you need
        the details later.
      </Typography>
    </Box>
  );
}

export default function RiderScreen37CompletedTripSummaryCanvas_v2() {
      return (
      <Box
        sx={{ position: "relative", minHeight: "100vh", bgcolor: (t) => t.palette.background.default }}
      >
        <DarkModeToggle />
        <MobileShell>
          <CompletedTripSummaryScreen />
        </MobileShell>
      </Box>
  );
}
