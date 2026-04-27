import React, { useMemo, useState } from "react";
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
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import { useAppData } from "../contexts/AppDataContext";
import {
  estimateRentalDays,
  formatRentalDateRange,
  getRentalBookingVehicle
} from "../features/rental/booking";
import { uiTokens } from "../design/tokens";

type RentalModeSelection = "self" | "chauffeur";

const ORANGE_ACCENT = "#F97316";

interface RentalModeOptionProps {
  active: boolean;
  title: string;
  subtitle: string;
  onClick: () => void;
}

function RentalModeOption({
  active,
  title,
  subtitle,
  onClick
}: RentalModeOptionProps): React.JSX.Element {
  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        cursor: "pointer",
        flex: 1,
        borderRadius: uiTokens.radius.xl,
        border: active
          ? "1px solid rgba(3,205,140,0.72)"
          : (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
        bgcolor: active
          ? (t) =>
              t.palette.mode === "light"
                ? "rgba(3,205,140,0.12)"
                : "rgba(16,185,129,0.1)"
          : (t) =>
              t.palette.mode === "light"
                ? "#FFFFFF"
                : "rgba(15,23,42,0.96)"
      }}
    >
      <CardContent sx={{ px: 1.4, py: 1.2 }}>
        <Typography
          variant="caption"
          sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary, mb: 0.25, display: "block" }}
        >
          {subtitle}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}

function RentalDashboardHomeScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { rental, actions } = useAppData();
  const [modeSelection, setModeSelection] = useState<RentalModeSelection>("self");

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

  const handleBrowseRentals = (mode = modeSelection) => {
    actions.beginRentalBooking();
    navigate("/rental/list", { state: { mode } });
  };

  const handleCustomRentalRequest = () => {
    actions.beginRentalBooking();
    navigate("/rental/list", { state: { mode: "custom" } });
  };

  return (
    <ScreenScaffold>
      <SectionHeader
        title="EV rentals"
        subtitle="Book self-drive or chauffeur EVs for your trips"
        leadingAction={
          <Stack direction="row" spacing={uiTokens.spacing.sm} alignItems="center">
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
                justifyContent: "center"
              }}
            >
              <ElectricCarRoundedIcon sx={{ fontSize: 22, color: "#059669" }} />
            </Box>
          </Stack>
        }
        action={
          <Chip
            icon={<LocalOfferRoundedIcon sx={{ fontSize: 14 }} />}
            label="Clean electric rides"
            size="small"
            sx={{
              borderRadius: uiTokens.radius.xl,
              fontSize: 10.5,
              height: 24,
              bgcolor: "rgba(249,115,22,0.14)",
              color: ORANGE_ACCENT,
              border: "1px solid rgba(249,115,22,0.35)"
            }}
          />
        }
      />

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
            Choose your rental mode and browse available cars near you.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.1} sx={{ mb: 1.5 }}>
            <RentalModeOption
              active={modeSelection === "self"}
              title="Self-drive"
              subtitle="Rental mode"
              onClick={() => setModeSelection("self")}
            />
            <RentalModeOption
              active={modeSelection === "chauffeur"}
              title="With chauffeur"
              subtitle="Rental mode"
              onClick={() => setModeSelection("chauffeur")}
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.1}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleBrowseRentals(modeSelection)}
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
              onClick={handleCustomRentalRequest}
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
              Custom rental request
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {showNextRentalCard && nextBooking && nextVehicle && (
        <Card
          elevation={0}
          sx={{
            position: "relative",
            borderRadius: uiTokens.radius.xl,
            overflow: "hidden",
            bgcolor: (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            boxShadow: (t) =>
              t.palette.mode === "light"
                ? "0 8px 20px rgba(15,23,42,0.06)"
                : "0 8px 20px rgba(2,6,23,0.24)"
          }}
        >
          <Box sx={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, bgcolor: "rgba(249,115,22,0.85)" }} />
          <CardContent sx={{ px: { xs: 1.8, sm: 2 }, py: { xs: 1.7, sm: 1.9 }, pl: { xs: 2.1, sm: 2.3 } }}>
            <Typography variant="body2" sx={{ fontSize: 12, color: ORANGE_ACCENT, fontWeight: 600, mb: 0.4 }}>
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
                  borderRadius: uiTokens.radius.xl,
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
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.35, mb: 1.2 }}>
              <PlaceRoundedIcon sx={{ fontSize: 15, color: ORANGE_ACCENT }} />
              <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                {nextBooking.pickupBranch ?? "Pickup pending"} → {nextBooking.dropoffBranch ?? "Return pending"}
              </Typography>
            </Stack>

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
              {nextBooking.status === "confirmed" && (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    actions.beginRentalBooking(nextBooking.vehicleId);
                    actions.updateRentalBooking({
                      vehicleId: nextBooking.vehicleId,
                      startDate: nextBooking.startDate,
                      endDate: nextBooking.endDate,
                      pickupBranch: nextBooking.pickupBranch,
                      dropoffBranch: nextBooking.dropoffBranch,
                      priceEstimate: nextBooking.priceEstimate
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
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

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
        <CardContent sx={{ px: { xs: 1.8, sm: 2 }, py: { xs: 1.7, sm: 1.9 } }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 0.7 }}
          >
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
            upcomingBookings.slice(0, 3).map((booking) => {
              const vehicle = getRentalBookingVehicle(rental.vehicles, booking);
              const durationDays = estimateRentalDays(booking.startDate, booking.endDate);
              return (
                <Card
                  key={booking.id}
                  elevation={0}
                  onClick={() => navigate(`/rental/history/${booking.id}`)}
                  sx={{
                    cursor: "pointer",
                    mb: 1,
                    borderRadius: uiTokens.radius.xl,
                    bgcolor: (t) =>
                      t.palette.mode === "light" ? "#F8FAFC" : "rgba(15,23,42,0.96)",
                    border: (t) =>
                      t.palette.mode === "light"
                        ? "1px solid rgba(226,232,240,0.9)"
                        : "1px solid rgba(51,65,85,0.9)"
                  }}
                >
                  <CardContent sx={{ px: 1.35, py: 1.15 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontSize: 12.8, fontWeight: 600 }}>
                          {vehicle ? `${vehicle.name} • ${vehicle.mode}` : "EV rental"}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}>
                          {formatRentalDateRange(booking.startDate, booking.endDate)}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={0.6} alignItems="center">
                        <Chip
                          size="small"
                          label="Confirmed"
                          sx={{
                            borderRadius: uiTokens.radius.xl,
                            height: 20,
                            fontSize: 10,
                            bgcolor: "rgba(22,163,74,0.16)",
                            color: "#15803D"
                          }}
                        />
                        <ArrowForwardIosRoundedIcon sx={{ fontSize: 13, color: ORANGE_ACCENT }} />
                      </Stack>
                    </Stack>
                    <Stack direction="row" spacing={0.7} alignItems="center" sx={{ mt: 0.55 }}>
                      <PlaceRoundedIcon sx={{ fontSize: 14, color: ORANGE_ACCENT }} />
                      <Typography variant="caption" sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}>
                        {booking.pickupBranch ?? "Pickup pending"} → {booking.dropoffBranch ?? "Return pending"}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="caption"
                      sx={{ mt: 0.45, display: "block", fontSize: 10.5, color: (t) => t.palette.text.secondary }}
                    >
                      {durationDays} day{durationDays === 1 ? "" : "s"} • {booking.priceEstimate ?? "Price pending"}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Box
              sx={{
                borderRadius: uiTokens.radius.xl,
                border: "1px dashed rgba(148,163,184,0.6)",
                px: 1.6,
                py: 1.6
              }}
            >
              <Typography variant="body2" sx={{ fontSize: 12.5, fontWeight: 600, mb: 0.2 }}>
                No upcoming rentals yet
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                Browse available EVs to book your next trip.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleBrowseRentals(modeSelection)}
                sx={{
                  mt: 1,
                  borderRadius: uiTokens.radius.xl,
                  textTransform: "none",
                  borderColor: "rgba(3,205,140,0.55)",
                  color: "#047857",
                  "&:hover": {
                    borderColor: "rgba(3,205,140,0.95)",
                    bgcolor: "rgba(3,205,140,0.08)"
                  }
                }}
              >
                Browse EVs
              </Button>
            </Box>
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
            <Typography
              variant="body2"
              sx={{ fontSize: 12.8, fontWeight: 600, color: (t) => t.palette.text.primary }}
            >
              Need a custom EV rental plan?
            </Typography>
          </Stack>
          <Typography
            variant="caption"
            sx={{ display: "block", fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1 }}
          >
            Tell us your trip needs and we will tailor a rental package for you.
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate("/help")}
            sx={{
              borderRadius: uiTokens.radius.xl,
              textTransform: "none",
              borderColor: "rgba(249,115,22,0.5)",
              color: ORANGE_ACCENT,
              "&:hover": {
                borderColor: "rgba(249,115,22,0.9)",
                bgcolor: "rgba(249,115,22,0.08)"
              }
            }}
          >
            Contact support
          </Button>
        </CardContent>
      </Card>
    </ScreenScaffold>
  );
}

export default function RentalDashboard(): React.JSX.Element {
  return <RentalDashboardHomeScreen />;
}
