import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import { useAppData } from "../contexts/AppDataContext";
import type { RentalVehicle, RentalVehiclePreferenceType } from "../store/types";

type RentalListFilter =
  | "all"
  | "self"
  | "chauffeur"
  | "suv"
  | "sedan"
  | "compact"
  | "luxury";

interface RentalListLocationState {
  mode?: string;
  vehicleType?: RentalVehiclePreferenceType;
  fromCustom?: boolean;
}

interface RentalVehicleCardProps {
  vehicle: RentalVehicle;
  onSelect: (id: string) => void;
}

function RentalVehicleCard({ vehicle, onSelect }: RentalVehicleCardProps): React.JSX.Element {
  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.75,
        borderRadius: 2,
        bgcolor: (t) =>
          t.palette.mode === "light"
            ? "linear-gradient(135deg,#FFFFFF,#F9FAFB)"
            : "linear-gradient(135deg,#020617,#020617)",
        border: (t) =>
          t.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)"
      }}
    >
      <CardContent sx={{ px: 1.75, py: 1.6 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <Box
            sx={{
              width: 64,
              height: 40,
              borderRadius: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#E0F2FE" : "rgba(15,23,42,0.9)"
            }}
          >
            <ElectricCarRoundedIcon sx={{ fontSize: 28, color: "primary.main" }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
                  {vehicle.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  {vehicle.type} • {vehicle.mode}
                </Typography>
              </Box>
              {vehicle.tag && (
                <Chip
                  label={vehicle.tag}
                  size="small"
                  sx={{
                    borderRadius: 5,
                    fontSize: 10,
                    height: 20,
                    bgcolor: "rgba(34,197,94,0.12)",
                    color: "#16A34A"
                  }}
                />
              )}
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <PeopleAltRoundedIcon sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }} />
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  {vehicle.seats} seats
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <BatteryChargingFullRoundedIcon
                  sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  {vehicle.range}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
            {vehicle.dailyPrice}{" "}
            <Typography component="span" variant="caption" sx={{ fontSize: 11 }}>
              / day
            </Typography>
          </Typography>
          <Button
            size="small"
            variant="contained"
            onClick={() => onSelect(vehicle.id)}
            sx={{
              borderRadius: 5,
              px: 2,
              py: 0.5,
              fontSize: 12,
              textTransform: "none",
              bgcolor: "primary.main",
              color: "#020617",
              "&:hover": { bgcolor: "#06e29a" }
            }}
          >
            Select
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function mapVehiclePreferenceToFilter(
  vehicleType?: RentalVehiclePreferenceType
): RentalListFilter | null {
  switch (vehicleType) {
    case "suv":
      return "suv";
    case "sedan":
      return "sedan";
    case "compact_ev":
      return "compact";
    case "luxury_ev":
      return "luxury";
    default:
      return null;
  }
}

function mapModeToFilter(mode?: string): RentalListFilter | null {
  if (mode === "self") {
    return "self";
  }
  if (mode === "chauffeur") {
    return "chauffeur";
  }
  if (mode === "suv") {
    return "suv";
  }
  if (mode === "sedan") {
    return "sedan";
  }
  return null;
}

function matchesFilter(vehicle: RentalVehicle, filter: RentalListFilter): boolean {
  const modeLower = vehicle.mode.toLowerCase();
  const typeLower = vehicle.type.toLowerCase();
  const tagLower = (vehicle.tag ?? "").toLowerCase();

  switch (filter) {
    case "self":
      return modeLower.includes("self");
    case "chauffeur":
      return modeLower.includes("chauffeur");
    case "suv":
      return typeLower.includes("suv");
    case "sedan":
      return typeLower.includes("sedan");
    case "compact":
      return typeLower.includes("hatchback") || typeLower.includes("compact");
    case "luxury":
      return tagLower.includes("premium") || tagLower.includes("luxury");
    case "all":
    default:
      return true;
  }
}

function RentalVehicleListScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { rental, actions } = useAppData();

  const locationState = (location.state as RentalListLocationState | null) ?? null;
  const initialFilter = useMemo(() => {
    const byMode = mapModeToFilter(locationState?.mode);
    if (byMode) {
      return byMode;
    }

    const byVehicleType = mapVehiclePreferenceToFilter(locationState?.vehicleType);
    if (byVehicleType) {
      return byVehicleType;
    }

    if (rental.booking.customRequest?.driverOption === "chauffeur") {
      return "chauffeur";
    }
    if (rental.booking.customRequest?.driverOption === "self_drive") {
      return "self";
    }
    return "all";
  }, [
    locationState?.mode,
    locationState?.vehicleType,
    rental.booking.customRequest?.driverOption
  ]);

  const [filter, setFilter] = useState<RentalListFilter>(initialFilter);

  const filteredVehicles = rental.vehicles.filter((vehicle) => matchesFilter(vehicle, filter));

  const handleSelectVehicle = (id: string): void => {
    actions.selectRentalVehicle(id);
    navigate(`/rental/vehicle/${id}`);
  };

  return (
    <ScreenScaffold>
      <SectionHeader
        title="Available EVs"
        subtitle={
          rental.booking.customRequest
            ? "Custom request active • choose your preferred vehicle"
            : "Choose an EV that matches your trip"
        }
        leadingAction={
          <IconButton
            size="small"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 5,
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
        }
      />

      {locationState?.fromCustom && (
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid rgba(249,115,22,0.4)",
            bgcolor: "rgba(249,115,22,0.08)"
          }}
        >
          <CardContent sx={{ px: 1.5, py: 1.2 }}>
            <Typography variant="body2" sx={{ fontSize: 12.5, fontWeight: 700, color: "#C2410C" }}>
              Custom rental request saved
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Vehicle, dates, trip details and add-ons are ready. Select a vehicle to continue.
            </Typography>
          </CardContent>
        </Card>
      )}

      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
        {[
          { key: "all" as const, label: "All" },
          { key: "self" as const, label: "Self-drive" },
          { key: "chauffeur" as const, label: "With chauffeur" },
          { key: "suv" as const, label: "SUV" },
          { key: "sedan" as const, label: "Sedan" },
          { key: "compact" as const, label: "Compact" },
          { key: "luxury" as const, label: "Luxury" }
        ].map((item) => (
          <Chip
            key={item.key}
            label={item.label}
            onClick={() => setFilter(item.key)}
            size="small"
            sx={{
              borderRadius: 5,
              fontSize: 11,
              height: 26,
              bgcolor:
                filter === item.key
                  ? "primary.main"
                  : (t) =>
                      t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)",
              color: filter === item.key ? "#020617" : (t) => t.palette.text.primary
            }}
          />
        ))}
      </Stack>

      {filteredVehicles.length === 0 ? (
        <Typography
          variant="caption"
          sx={{ mt: 4, display: "block", textAlign: "center", color: (t) => t.palette.text.secondary }}
        >
          No EV rentals match your filters. Try adjusting vehicle mode or type.
        </Typography>
      ) : (
        filteredVehicles.map((vehicle) => (
          <RentalVehicleCard key={vehicle.id} vehicle={vehicle} onSelect={handleSelectVehicle} />
        ))
      )}
    </ScreenScaffold>
  );
}

export default function RentalList(): React.JSX.Element {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (t) => t.palette.background.default
      }}
    >
      <RentalVehicleListScreen />
    </Box>
  );
}
