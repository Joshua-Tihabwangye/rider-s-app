import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import WalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import RentalAnalyticsCard from "../components/rental/RentalAnalyticsCard";
import UpcomingRentalCard from "../components/rental/UpcomingRentalCard";
import EmptyRentalState from "../components/rental/EmptyRentalState";
import { useAppData } from "../contexts/AppDataContext";
import {
  formatRentalDateRange,
  formatUgx,
  getRentalBookingVehicle
} from "../features/rental/booking";
import { uiTokens } from "../design/tokens";

const ORANGE_ACCENT = "#F97316";

function parseRangeKm(rangeValue: string): number {
  const digits = Number(rangeValue.replace(/[^\d]/g, ""));
  return Number.isFinite(digits) ? digits : 0;
}

function RentalDashboardHomeScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { rental, ride, walletBalance, actions } = useAppData();

  const upcomingBookings = useMemo(
    () => rental.bookings.filter((booking) => booking.status === "confirmed"),
    [rental.bookings]
  );
  const nextBooking = upcomingBookings[0] ?? null;
  const nextVehicle = getRentalBookingVehicle(
    rental.vehicles,
    nextBooking,
    rental.selectedVehicleId
  );
  const showNextRentalCard = Boolean(nextBooking && nextVehicle);

  const analytics = useMemo(() => {
    const availableEvs = rental.vehicles.length;
    const selfDriveCount = rental.vehicles.filter((vehicle) =>
      vehicle.mode.toLowerCase().includes("self")
    ).length;
    const chauffeurCount = rental.vehicles.filter((vehicle) =>
      vehicle.mode.toLowerCase().includes("chauffeur")
    ).length;
    const averageRangeKm =
      rental.vehicles.length > 0
        ? Math.round(
            rental.vehicles.reduce((sum, vehicle) => sum + parseRangeKm(vehicle.range), 0) /
              rental.vehicles.length
          )
        : 0;
    const completedThisMonth = rental.bookings.filter(
      (booking) => booking.status === "completed"
    ).length;

    return [
      {
        key: "available",
        title: "Available EVs today",
        value: String(availableEvs),
        helperText: "Live from current fleet data",
        icon: <ElectricCarRoundedIcon sx={{ fontSize: 18 }} />,
        accent: "green" as const
      },
      {
        key: "upcoming",
        title: "Upcoming rentals",
        value: String(upcomingBookings.length),
        helperText: "Confirmed future bookings",
        icon: <CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />,
        accent: "orange" as const
      },
      {
        key: "wallet",
        title: "Wallet balance",
        value: formatUgx(walletBalance),
        helperText: "Ready for rental payments",
        icon: <WalletRoundedIcon sx={{ fontSize: 18 }} />,
        accent: "green" as const
      },
      {
        key: "saved-locations",
        title: "Saved locations",
        value: String(ride.savedPlaces.length),
        helperText: "Quick pickup and return points",
        icon: <LocationOnRoundedIcon sx={{ fontSize: 18 }} />,
        accent: "orange" as const
      },
      {
        key: "avg-range",
        title: "Average EV range",
        value: `${averageRangeKm} km`,
        helperText: "Across currently listed EVs",
        icon: <RouteRoundedIcon sx={{ fontSize: 18 }} />,
        accent: "green" as const
      },
      {
        key: "modes",
        title: "Mode availability",
        value: `${selfDriveCount} self • ${chauffeurCount} chauffeur`,
        helperText: `${completedThisMonth} completed rentals in history`,
        icon: <LocalOfferRoundedIcon sx={{ fontSize: 18 }} />,
        accent: "orange" as const
      }
    ];
  }, [
    rental.bookings,
    rental.vehicles,
    ride.savedPlaces.length,
    upcomingBookings.length,
    walletBalance
  ]);

  const handleBrowseRentals = () => {
    actions.beginRentalBooking();
    navigate("/rental/list");
  };

  const handleCreateCustomRental = () => {
    actions.beginRentalBooking();
    navigate("/rental/custom");
  };

  return (
    <ScreenScaffold>
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.2}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
            <IconButton
              size="small"
              aria-label="Back"
              onClick={() => navigate(-1)}
              sx={{
                borderRadius: uiTokens.radius.xl,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)"
              }}
            >
              <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: uiTokens.radius.xl,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#DCFCE7" : "rgba(15,23,42,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              <ElectricCarRoundedIcon sx={{ fontSize: 22, color: "#059669" }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ ...uiTokens.text.sectionTitle, lineHeight: 1.25 }}>
                EV rentals
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  ...uiTokens.text.itemBody,
                  fontSize: 12,
                  color: (t) => t.palette.text.secondary,
                  display: "block",
                  mt: 0.3
                }}
              >
                Book self-drive or chauffeur EVs for your trips
              </Typography>
            </Box>
          </Stack>

          <Chip
            icon={<LocalOfferRoundedIcon sx={{ fontSize: 14 }} />}
            label="Clean electric rides"
            size="small"
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              borderRadius: uiTokens.radius.pill,
              fontSize: 10.5,
              height: 24,
              bgcolor: "rgba(249,115,22,0.14)",
              color: ORANGE_ACCENT,
              border: "1px solid rgba(249,115,22,0.35)"
            }}
          />
        </Stack>
        <Chip
          icon={<LocalOfferRoundedIcon sx={{ fontSize: 14 }} />}
          label="Clean electric rides"
          size="small"
          sx={{
            display: { xs: "inline-flex", sm: "none" },
            mt: 0.7,
            borderRadius: uiTokens.radius.pill,
            fontSize: 10.5,
            height: 24,
            bgcolor: "rgba(249,115,22,0.14)",
            color: ORANGE_ACCENT,
            border: "1px solid rgba(249,115,22,0.35)"
          }}
        />
      </Box>

      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          overflow: "hidden",
          bgcolor: (t) =>
            t.palette.mode === "light"
              ? "linear-gradient(145deg,#FFFFFF,#F8FAFC)"
              : "linear-gradient(145deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)",
          boxShadow: (t) =>
            t.palette.mode === "light"
              ? "0 10px 24px rgba(15,23,42,0.08)"
              : "0 10px 24px rgba(2,6,23,0.28)"
        }}
      >
        <Box sx={{ height: 4, bgcolor: "primary.main" }} />
        <CardContent sx={{ px: { xs: 1.8, sm: 2.1 }, py: { xs: 1.8, sm: 2.1 } }}>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.01em", mb: 0.35 }}>
            Ready to book your next EV?
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              fontSize: 11.5,
              color: (t) => t.palette.text.secondary,
              mb: 1.4
            }}
          >
            Browse available EVs near you or build a tailored custom request.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.1}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleBrowseRentals}
              sx={{
                borderRadius: uiTokens.radius.xl,
                py: 1.2,
                fontSize: 14,
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "primary.main",
                color: "#022C22",
                "&:hover": { bgcolor: "#06e29a" },
                "&:focus-visible": {
                  outline: "2px solid rgba(3,205,140,0.75)",
                  outlineOffset: 2
                }
              }}
            >
              Browse available EVs
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleCreateCustomRental}
              sx={{
                borderRadius: uiTokens.radius.xl,
                py: 0.9,
                fontSize: 13,
                textTransform: "none",
                borderColor: "rgba(249,115,22,0.45)",
                color: ORANGE_ACCENT,
                "&:hover": {
                  borderColor: "rgba(249,115,22,0.9)",
                  bgcolor: "rgba(249,115,22,0.08)"
                }
              }}
            >
              Create custom rental
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(3, minmax(0, 1fr))" },
          gap: 1
        }}
      >
        {analytics.map((item) => (
          <RentalAnalyticsCard
            key={item.key}
            title={item.title}
            value={item.value}
            helperText={item.helperText}
            icon={item.icon}
            accent={item.accent}
          />
        ))}
      </Box>

      {showNextRentalCard && nextBooking && nextVehicle && (
        <Card
          elevation={0}
          sx={{
            position: "relative",
            borderRadius: uiTokens.radius.xl,
            overflow: "hidden",
            bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)"
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              bgcolor: "rgba(249,115,22,0.85)"
            }}
          />
          <CardContent sx={{ px: { xs: 1.8, sm: 2 }, py: { xs: 1.7, sm: 1.9 }, pl: { xs: 2.1, sm: 2.3 } }}>
            <Typography variant="body2" sx={{ fontSize: 12, color: ORANGE_ACCENT, fontWeight: 700, mb: 0.4 }}>
              Your next rental
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body1" sx={{ fontWeight: 700, letterSpacing: "-0.015em", mb: 0.2 }}>
                  {nextVehicle.name}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                  {nextVehicle.mode}
                </Typography>
              </Box>
              <Chip
                label="Confirmed"
                size="small"
                sx={{
                  borderRadius: uiTokens.radius.pill,
                  height: 22,
                  fontSize: 10.5,
                  bgcolor: "rgba(22,163,74,0.15)",
                  color: "#15803D",
                  border: "1px solid rgba(22,163,74,0.35)"
                }}
              />
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.8 }}>
              <CalendarMonthRoundedIcon sx={{ fontSize: 15, color: ORANGE_ACCENT }} />
              <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                {formatRentalDateRange(nextBooking.startDate, nextBooking.endDate)}
              </Typography>
            </Stack>
            <Typography
              variant="caption"
              sx={{ mt: 0.35, mb: 1.2, display: "block", fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {`${nextBooking.pickupBranch ?? "Pickup pending"} to ${nextBooking.dropoffBranch ?? "Return pending"}`}
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.1}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate(`/rental/history/${nextBooking.id}`)}
                sx={{
                  borderRadius: uiTokens.radius.xl,
                  py: 0.9,
                  fontSize: 13,
                  fontWeight: 600,
                  textTransform: "none",
                  bgcolor: "primary.main",
                  color: "#022C22",
                  "&:hover": { bgcolor: "#06e29a" }
                }}
              >
                View rental details
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  actions.beginRentalBooking(nextBooking.vehicleId);
                  actions.updateRentalBooking({
                    ...nextBooking,
                    status: "draft"
                  });
                  navigate("/rental/dates");
                }}
                sx={{
                  borderRadius: uiTokens.radius.xl,
                  py: 0.9,
                  fontSize: 13,
                  textTransform: "none",
                  borderColor: "rgba(22,163,74,0.55)",
                  color: "#15803D",
                  "&:hover": {
                    borderColor: "rgba(22,163,74,0.95)",
                    bgcolor: "rgba(22,163,74,0.08)"
                  }
                }}
              >
                Extend rental
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: { xs: 1.8, sm: 2 }, py: { xs: 1.7, sm: 1.9 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.7 }}>
            <Box>
              <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 700 }}>
                Upcoming rentals
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                Your scheduled EV bookings
              </Typography>
            </Box>
            <Button
              variant="text"
              size="small"
              onClick={() => navigate("/rental/history")}
              sx={{ fontSize: 11, textTransform: "none", minWidth: "auto", px: 0.4 }}
            >
              View all
            </Button>
          </Stack>
          <Divider sx={{ mb: 1.15, borderColor: (t) => t.palette.divider }} />

          {upcomingBookings.length > 0 ? (
            <Stack spacing={1}>
              {upcomingBookings.slice(0, 3).map((booking) => (
                <UpcomingRentalCard
                  key={booking.id}
                  booking={booking}
                  vehicle={getRentalBookingVehicle(rental.vehicles, booking)}
                  onClick={() => navigate(`/rental/history/${booking.id}`)}
                />
              ))}
            </Stack>
          ) : (
            <EmptyRentalState
              title="No upcoming rentals yet"
              description="Browse available EVs to book your next trip."
              ctaLabel="Browse EVs"
              onCtaClick={handleBrowseRentals}
            />
          )}
        </CardContent>
      </Card>

      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) =>
            t.palette.mode === "light"
              ? "linear-gradient(145deg,#FFFFFF,#FFF7ED)"
              : "linear-gradient(145deg,rgba(15,23,42,0.98),rgba(30,41,59,0.98))",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(249,115,22,0.28)"
              : "1px solid rgba(249,115,22,0.45)"
        }}
      >
        <CardContent sx={{ px: { xs: 1.8, sm: 2 }, py: { xs: 1.5, sm: 1.75 } }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.45 }}>
            <SupportAgentRoundedIcon sx={{ fontSize: 18, color: ORANGE_ACCENT }} />
            <Typography variant="body2" sx={{ fontSize: 12.8, fontWeight: 600 }}>
              Need a custom EV rental plan?
            </Typography>
          </Stack>
          <Typography
            variant="caption"
            sx={{ display: "block", fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1 }}
          >
            Configure a custom trip and continue directly into vehicle selection and checkout.
          </Typography>
          <Button
            variant="outlined"
            size="small"
            endIcon={<ArrowForwardIosRoundedIcon sx={{ fontSize: 12 }} />}
            onClick={handleCreateCustomRental}
            sx={{
              borderRadius: uiTokens.radius.pill,
              textTransform: "none",
              borderColor: "rgba(249,115,22,0.5)",
              color: ORANGE_ACCENT,
              "&:hover": {
                borderColor: "rgba(249,115,22,0.9)",
                bgcolor: "rgba(249,115,22,0.08)"
              }
            }}
          >
            Create custom rental
          </Button>
        </CardContent>
      </Card>
    </ScreenScaffold>
  );
}

export default function RentalDashboard(): React.JSX.Element {
  return <RentalDashboardHomeScreen />;
}
