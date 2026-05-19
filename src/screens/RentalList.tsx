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
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";
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

type FilterKey = "all" | "self" | "chauffeur";

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

export default function RentalList(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { rental, actions } = useAppData();
  const routeState = location.state as RentalListLocationState | null;

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>(
    routeState?.mode === "chauffeur" ? "chauffeur" : routeState?.mode === "self" ? "self" : "all"
  );
  const [seatFilter, setSeatFilter] = useState(false);
  const [suvFilter, setSuvFilter] = useState(false);
  const [lowPriceFilter, setLowPriceFilter] = useState(false);

  const filteredVehicles = useMemo(() => {
    return rental.vehicles.filter((vehicle) => {
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
      if (seatFilter && vehicle.seats !== 4) {
        return false;
      }
      if (suvFilter) {
        const vehicleKey = `${vehicle.name} ${vehicle.type}`.toLowerCase();
        if (!vehicleKey.includes("suv") && !vehicleKey.includes("kona")) {
          return false;
        }
      }
      if (lowPriceFilter && parseUgx(vehicle.dailyPrice) > 2500) {
        return false;
      }
      return true;
    });
  }, [activeFilter, lowPriceFilter, query, rental.vehicles, seatFilter, suvFilter]);

  const displayedVehicles = useMemo(() => filteredVehicles.slice(0, 4), [filteredVehicles]);

  return (
    <Box sx={{ ...screenShellSx, pb: { xs: 13, sm: 8 } }}>
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

      <Stack direction="row" spacing={0.5} sx={{ mb: 1.55, overflowX: "auto", pb: 0.2 }}>
        <Chip
          icon={<DirectionsCarRoundedIcon />}
          label="Self-drive"
          onClick={() => setActiveFilter("self")}
          sx={{
            borderRadius: 99,
            height: 40,
            flexShrink: 0,
            bgcolor: activeFilter === "self" ? rentalUi.greenSoft : "#fff",
            color: activeFilter === "self" ? rentalUi.greenDeep : rentalUi.title,
            border: `1px solid ${activeFilter === "self" ? rentalUi.green : rentalUi.border}`,
            "& .MuiChip-label": { px: 0.9, fontSize: "11.8px !important", fontWeight: 600 },
            "& .MuiChip-icon": { fontSize: 15, ml: 0.9, mr: -0.2 }
          }}
        />
        <Chip
          icon={<SupportAgentRoundedIcon />}
          label="Chauffeur"
          onClick={() => setActiveFilter("chauffeur")}
          sx={{
            borderRadius: 99,
            height: 40,
            flexShrink: 0,
            bgcolor: activeFilter === "chauffeur" ? rentalUi.greenSoft : "#fff",
            color: activeFilter === "chauffeur" ? rentalUi.greenDeep : rentalUi.title,
            border: `1px solid ${activeFilter === "chauffeur" ? rentalUi.green : rentalUi.border}`,
            "& .MuiChip-label": { px: 0.9, fontSize: "11.8px !important", fontWeight: 600 },
            "& .MuiChip-icon": { fontSize: 15, ml: 0.9, mr: -0.2 }
          }}
        />
        <Chip
          icon={<PersonOutlineRoundedIcon />}
          label="4 seats"
          onClick={() => setSeatFilter((prev) => !prev)}
          sx={{
            borderRadius: 99,
            height: 40,
            flexShrink: 0,
            border: `1px solid ${seatFilter ? rentalUi.green : rentalUi.border}`,
            bgcolor: seatFilter ? rentalUi.greenSoft : "#fff",
            color: seatFilter ? rentalUi.greenDeep : rentalUi.title,
            "& .MuiChip-label": { px: 0.9, fontSize: "11.8px !important", fontWeight: seatFilter ? 600 : 500 },
            "& .MuiChip-icon": { fontSize: 15, ml: 0.9, mr: -0.2 }
          }}
        />
        <Chip
          icon={<DirectionsCarRoundedIcon />}
          label="SUV"
          onClick={() => setSuvFilter((prev) => !prev)}
          sx={{
            borderRadius: 99,
            height: 40,
            flexShrink: 0,
            border: `1px solid ${suvFilter ? rentalUi.green : rentalUi.border}`,
            bgcolor: suvFilter ? rentalUi.greenSoft : "#fff",
            color: suvFilter ? rentalUi.greenDeep : rentalUi.title,
            "& .MuiChip-label": { px: 0.9, fontSize: "11.8px !important", fontWeight: suvFilter ? 600 : 500 },
            "& .MuiChip-icon": { fontSize: 15, ml: 0.9, mr: -0.2 }
          }}
        />
        <Chip
          icon={<LocalOfferRoundedIcon />}
          label="Low price"
          onClick={() => setLowPriceFilter((prev) => !prev)}
          sx={{
            borderRadius: 99,
            height: 40,
            flexShrink: 0,
            border: `1px solid ${lowPriceFilter ? rentalUi.green : rentalUi.border}`,
            bgcolor: lowPriceFilter ? rentalUi.greenSoft : "#fff",
            color: lowPriceFilter ? rentalUi.greenDeep : rentalUi.title,
            "& .MuiChip-label": { px: 0.9, fontSize: "11.8px !important", fontWeight: lowPriceFilter ? 600 : 500 },
            "& .MuiChip-icon": { fontSize: 15, ml: 0.9, mr: -0.2 }
          }}
        />
      </Stack>

      <Stack spacing={1.45}>
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
            <Card key={vehicle.id} sx={{ ...cardSx, borderRadius: 3.2 }}>
              <CardContent sx={{ p: 1.25, "&:last-child": { pb: 1.25 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.62 }}>
                  <Chip
                    label="Available"
                    sx={{
                      bgcolor: rentalUi.greenSoft,
                      color: rentalUi.greenDeep,
                      fontWeight: 700,
                      height: 34,
                      "& .MuiChip-label": { px: 1.05, fontSize: "11.4px !important" }
                    }}
                  />
                  <Typography sx={{ color: rentalUi.greenDeep, fontSize: "20px !important", fontWeight: 800 }}>
                    {formatInr(dailyPrice)}
                    <Typography component="span" sx={{ color: rentalUi.muted, fontWeight: 500, fontSize: "11.5px !important" }}>
                      {" "}/ day
                    </Typography>
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1.15} alignItems="flex-start">
                  <Box sx={{ width: 132, flexShrink: 0, pt: 0.2 }}>
                    <CroppedReferenceImage
                      src={getVehicleImageFromName(vehicle.name)}
                      alt={vehicle.name}
                      height={108}
                      scale={1}
                      fit="contain"
                    />
                  </Box>

                  <Box sx={{ minWidth: 0, flex: 1, pt: 0.1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 0.18 }}>
                      <Typography sx={{ fontSize: "22px !important", fontWeight: 800, lineHeight: 1.1 }}>{displayLabel}</Typography>
                      <Stack direction="row" alignItems="center" spacing={0.35} sx={{ ml: 1 }}>
                        <StarRoundedIcon sx={{ color: "#F59E0B", fontSize: 18 }} />
                        <Typography sx={{ color: rentalUi.muted, fontSize: "11.4px !important" }}>{ratingForIndex(index)}</Typography>
                      </Stack>
                    </Stack>
                    <Typography sx={{ color: rentalUi.muted, fontSize: "11.6px !important", mb: 0.55 }}>{vehicleTypeLabel}</Typography>

                    <Stack direction="row" spacing={1.15} sx={{ mb: 0.42 }}>
                      <Stack direction="row" spacing={0.36} alignItems="center">
                        <PersonOutlineRoundedIcon sx={{ fontSize: 16, color: rentalUi.muted }} />
                        <Typography sx={{ color: rentalUi.muted, fontSize: "11.4px !important" }}>{vehicle.seats} seats</Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.36} alignItems="center">
                        <DescriptionOutlinedIcon sx={{ fontSize: 16, color: rentalUi.muted }} />
                        <Typography sx={{ color: rentalUi.muted, fontSize: "11.4px !important" }}>~ {parseUgx(vehicle.range)} km</Typography>
                      </Stack>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={0.36} sx={{ mb: 0.75 }}>
                      <CircleOutlinedIcon sx={{ color: rentalUi.muted, fontSize: 16 }} />
                      <Typography sx={{ color: rentalUi.muted, fontSize: "11.4px !important" }}>Automatic</Typography>
                    </Stack>

                    <Button
                      variant="outlined"
                      endIcon={<ArrowForwardRoundedIcon />}
                      onClick={() => {
                        actions.selectRentalVehicle(vehicle.id);
                        navigate(`/rental/vehicle/${vehicle.id}`);
                      }}
                      sx={{
                        borderRadius: 99,
                        textTransform: "none",
                        borderColor: "#BEEAD2",
                        color: rentalUi.greenDeep,
                        px: 1.65,
                        py: 0.42,
                        minWidth: 132,
                        height: 36,
                        fontWeight: 600,
                        fontSize: "11.8px !important",
                        ml: "auto",
                        display: "flex"
                      }}
                    >
                      View details
                    </Button>
                  </Box>
                </Stack>
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
