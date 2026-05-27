import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";

import { useAppData } from "../contexts/AppDataContext";
import {
  CroppedReferenceImage,
  cardSx,
  formatInr,
  rentalUi,
  screenShellSx
} from "../components/rental/RentalRedesignUI";
import { parseUgx } from "../features/rental/booking";
import { RENTAL_UI_ASSETS, getVehicleImageFromName } from "../features/rental/uiAssets";
import "../styles/rental-list.css";

type FilterKey = "all" | "self" | "chauffeur" | "seats4" | "suv" | "low_price";

type SeatCategoryKey =
  | "motorcycle_1"
  | "seat_2"
  | "seat_4"
  | "seat_5"
  | "seat_7"
  | "seat_8"
  | "seat_12"
  | "seat_14"
  | "van";

interface RentalListLocationState {
  mode?: string;
}

function ratingForIndex(index: number): string {
  if (index === 0) return "4.6 (128)";
  if (index === 1) return "4.7 (256)";
  if (index === 2) return "4.8 (193)";
  return "4.5 (87)";
}

function displayLabelFromVehicleName(vehicleName: string, vehicleType: string): string {
  const lowerName = vehicleName.toLowerCase();
  const lowerType = vehicleType.toLowerCase();
  if (lowerName.includes("van") || lowerType.includes("van")) return "EV Van";
  if (lowerName.includes("suv") || lowerName.includes("kona") || lowerType.includes("suv")) return "Family SUV";
  if (lowerName.includes("tesla") || lowerType.includes("sedan")) return "Executive EV";
  return "City EV";
}

function parsePriceValue(value: string): number {
  const compact = value.replace(/,/g, "");
  const numeric = Number(compact.replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function matchesSeatCategory(seats: number, vehicleName: string, vehicleType: string, category: SeatCategoryKey): boolean {
  const vehicleKey = `${vehicleName} ${vehicleType}`.toLowerCase();
  switch (category) {
    case "motorcycle_1":
      return seats === 1 || vehicleKey.includes("motorcycle") || vehicleKey.includes("bike");
    case "seat_2":
      return seats === 2;
    case "seat_4":
      return seats === 4;
    case "seat_5":
      return seats === 5;
    case "seat_7":
      return seats === 7;
    case "seat_8":
      return seats === 8;
    case "seat_12":
      return seats === 12;
    case "seat_14":
      return seats === 14;
    case "van":
      return vehicleKey.includes("van");
    default:
      return false;
  }
}

export default function RentalList(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { rental, actions } = useAppData();
  const routeState = location.state as RentalListLocationState | null;

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>(
    routeState?.mode === "chauffeur" ? "chauffeur" : routeState?.mode === "self" ? "self" : "all"
  );
  const [selectedSeatCategory, setSelectedSeatCategory] = useState<SeatCategoryKey>("seat_4");

  const seatOptions: Array<{ value: SeatCategoryKey; label: string }> = [
    { value: "motorcycle_1", label: "1 seater - Motorcycle" },
    { value: "seat_2", label: "2 seater" },
    { value: "seat_4", label: "4 seater" },
    { value: "seat_5", label: "5 seater" },
    { value: "seat_7", label: "7 seater" },
    { value: "seat_8", label: "8 seater" },
    { value: "seat_12", label: "12 seater" },
    { value: "seat_14", label: "14 seater" },
    { value: "van", label: "Van" }
  ];

  const filteredVehicles = useMemo(() => {
    const base = rental.vehicles.filter((vehicle) => {
      const searchable = `${vehicle.name} ${vehicle.type} ${vehicle.mode}`.toLowerCase();
      if (query.trim() && !searchable.includes(query.trim().toLowerCase())) {
        return false;
      }
      if (activeFilter === "self") {
        const supportsSelf = (vehicle.supportedModes ?? ["self_drive"]).includes("self_drive");
        if (!supportsSelf) {
          return false;
        }
      }
      if (activeFilter === "chauffeur") {
        const supportsChauffeur =
          (vehicle.supportedModes ?? []).includes("chauffeur") || vehicle.mode.toLowerCase().includes("chauffeur");
        if (!supportsChauffeur) {
          return false;
        }
      }
      if (activeFilter === "seats4") {
        if (!matchesSeatCategory(vehicle.seats, vehicle.name, vehicle.type, selectedSeatCategory)) {
          return false;
        }
      }
      if (activeFilter === "suv") {
        const vehicleKey = `${vehicle.name} ${vehicle.type}`.toLowerCase();
        if (!vehicleKey.includes("suv") && !vehicleKey.includes("kona")) {
          return false;
        }
      }
      return true;
    });

    if (activeFilter === "low_price") {
      return [...base].sort((a, b) => parsePriceValue(a.dailyPrice) - parsePriceValue(b.dailyPrice));
    }
    return base;
  }, [activeFilter, query, rental.vehicles, selectedSeatCategory]);

  const displayedVehicles = useMemo(() => filteredVehicles, [filteredVehicles]);

  return (
    <Box className="rental-list-page" sx={{ ...screenShellSx, pb: { xs: 13, sm: 8 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.05 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: rentalUi.green, ml: -0.35 }}>
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography sx={{ fontSize: "22px !important", fontWeight: 800 }}>Available rentals</Typography>
        <Box sx={{ width: 36 }} />
      </Stack>

      <TextField
        fullWidth
        placeholder="Search for cars, type or features"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        InputProps={{
          startAdornment: <SearchRoundedIcon sx={{ color: rentalUi.green, mr: 1 }} />
        }}
        sx={{
          mb: 1.55,
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            bgcolor: "#fff",
            minHeight: 52,
            "& fieldset": { borderColor: rentalUi.border }
          },
          "& .MuiInputBase-input": {
            fontSize: "11.8px !important"
          }
        }}
      />

      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          mb: activeFilter === "seats4" ? 0.9 : 1.55,
          pb: 0.2,
          width: "100%",
          display: "grid",
          gridTemplateColumns:
            activeFilter === "all"
              ? "repeat(5, minmax(0, 1fr))"
              : "repeat(6, minmax(0, 1fr))",
          gap: 0.45
        }}
      >
        {[
          { key: "self" as const, label: "Self-drive", icon: <DirectionsCarRoundedIcon /> },
          { key: "chauffeur" as const, label: "Chauffeur", icon: <SupportAgentRoundedIcon /> },
          { key: "seats4" as const, label: "Seats", icon: <PersonOutlineRoundedIcon /> },
          { key: "suv" as const, label: "SUV", icon: <DirectionsCarRoundedIcon /> },
          { key: "low_price" as const, label: "Low Price", icon: <LocalOfferRoundedIcon /> }
        ].map((filter) => {
          const isSelected = activeFilter === filter.key;
          return (
            <Chip
              key={filter.key}
              icon={filter.icon}
              label={isSelected ? filter.label : ""}
              onClick={() => setActiveFilter((prev) => (prev === filter.key ? "all" : filter.key))}
              sx={{
                gridColumn:
                  activeFilter !== "all" && isSelected ? "span 2" : "span 1",
                borderRadius: 99,
                height: 42,
                width: "100%",
                minWidth: 0,
                maxWidth: "100%",
                bgcolor: isSelected ? rentalUi.greenSoft : "#fff",
                color: isSelected ? rentalUi.greenDeep : rentalUi.title,
                border: `1px solid ${isSelected ? rentalUi.green : rentalUi.border}`,
                px: 0.2,
                "& .MuiChip-label": {
                  px: isSelected ? 0.4 : 0,
                  width: isSelected ? "auto" : 0,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  fontSize: "10.6px !important",
                  fontWeight: 700
                },
                "& .MuiChip-icon": {
                  fontSize: 16,
                  ml: isSelected ? 0.45 : 0,
                  mr: isSelected ? -0.05 : 0
                }
              }}
            />
          );
        })}
      </Stack>

      {activeFilter === "seats4" ? (
        <TextField
          select
          fullWidth
          size="small"
          label="Seats"
          value={selectedSeatCategory}
          onChange={(event) => setSelectedSeatCategory(event.target.value as SeatCategoryKey)}
          sx={{
            mb: 1.35,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2.4,
              bgcolor: "#fff",
              "& fieldset": { borderColor: rentalUi.border }
            }
          }}
        >
          {seatOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      ) : null}

      <Stack spacing={1.05}>
        {displayedVehicles.map((vehicle, index) => {
          const dailyPrice = parseUgx(vehicle.dailyPrice);
          const vehicleTypeLabel =
            vehicle.type.toLowerCase().includes("hatch")
              ? "Hatchback"
              : vehicle.type.toLowerCase().includes("sedan")
                ? "Sedan"
                : vehicle.type.toLowerCase().includes("van")
                  ? "Van"
                  : vehicle.type;
          const displayLabel = displayLabelFromVehicleName(vehicle.name, vehicle.type);

          return (
            <Card key={vehicle.id} sx={cardSx} className="rental-card">
              <CardContent sx={{ p: 0 }}>
                <div className="rental-card-top">
                  <div className="rental-image-box">
                    <img
                      src={getVehicleImageFromName(vehicle.name)}
                      alt={vehicle.name}
                      className="rental-image"
                    />
                  </div>

                  <div className="rental-summary">
                    <div className="rental-summary-head">
                      <div className="rental-info-block">
                        <div className="rental-price">
                          {formatInr(dailyPrice)} <span>/ day</span>
                        </div>
                        <h3>{displayLabel}</h3>
                        <p>{vehicleTypeLabel}</p>
                      </div>

                      <div className="rental-status-rating">
                        <span className="available-badge">Available</span>
                        <div className="rental-rating">
                          <StarRoundedIcon sx={{ color: "#F59E0B", fontSize: 14 }} /> {ratingForIndex(index)}
                        </div>
                      </div>
                    </div>

                    <div className="rental-card-body">
                      <div className="rental-specs">
                        <span className="rental-spec-item">
                          <PersonOutlineRoundedIcon sx={{ fontSize: 13 }} /> {vehicle.seats} seats
                        </span>
                        <span className="rental-spec-item">
                          <DescriptionOutlinedIcon sx={{ fontSize: 13 }} /> ~ {parseUgx(vehicle.range)} km
                        </span>
                        <span className="rental-spec-item">
                          <CircleOutlinedIcon sx={{ fontSize: 12 }} /> Automatic
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rental-card-footer">
                  <button
                    type="button"
                    className="view-details-btn"
                    onClick={() => {
                      actions.selectRentalVehicle(vehicle.id);
                      navigate(`/rental/vehicle/${vehicle.id}`);
                    }}
                  >
                    View details <ArrowForwardRoundedIcon sx={{ fontSize: 15 }} />
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      <Card sx={{ ...cardSx, mt: 1.55, bgcolor: "#F2FBF6", overflow: "hidden" }}>
        <CardContent sx={{ p: 1.25, "&:last-child": { pb: 1.25 } }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.2}>
            <Box>
              <Typography sx={{ fontSize: "14px !important", fontWeight: 700 }}>Clean drive. Smart choice.</Typography>
              <Typography sx={{ color: rentalUi.muted, fontSize: "11.6px !important" }}>100% electric. Zero emissions.</Typography>
            </Box>
            <CroppedReferenceImage
              src={RENTAL_UI_ASSETS.banners.eco}
              alt="Green city"
              height={46}
              scale={1}
              fit="contain"
              sx={{ width: 96, borderRadius: 0, bgcolor: "transparent" }}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
