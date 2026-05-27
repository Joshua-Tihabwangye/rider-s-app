import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import AirlineSeatReclineNormalRoundedIcon from "@mui/icons-material/AirlineSeatReclineNormalRounded";
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import EvStationOutlinedIcon from "@mui/icons-material/EvStationOutlined";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { useAppData } from "../contexts/AppDataContext";
import {
  CroppedReferenceImage,
  GradientActionButton,
  cardSx,
  formatInr,
  rentalUi,
  screenShellSx
} from "../components/rental/RentalRedesignUI";
import { getRentalVehicleLabel, parseUgx } from "../features/rental/booking";
import { RENTAL_UI_ASSETS, getVehicleImageFromName } from "../features/rental/uiAssets";

const depositAmount = 10000;

interface FeatureStatProps {
  icon: React.ReactNode;
  label: string;
  helper: string;
}

function FeatureStat({ icon, label, helper }: FeatureStatProps): React.JSX.Element {
  return (
    <Card sx={{ ...cardSx, borderRadius: 1.8, minHeight: 74 }}>
      <CardContent sx={{ p: 0.55, "&:last-child": { pb: 0.55 } }}>
        <Box sx={{ color: rentalUi.green, mb: 0.22, display: "grid", placeItems: "center", "& .MuiSvgIcon-root": { fontSize: 16 } }}>
          {icon}
        </Box>
        <Typography sx={{ fontSize: 11.2, fontWeight: 700, lineHeight: 1.15, textAlign: "center" }}>{label}</Typography>
        <Typography
          sx={{
            fontSize: 9.8,
            color: rentalUi.muted,
            mt: 0.12,
            textAlign: "center",
            lineHeight: 1.2,
            overflowWrap: "anywhere"
          }}
        >
          {helper}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function RentalVehicleDetail(): React.JSX.Element {
  const navigate = useNavigate();
  const { vehicleId } = useParams();
  const { rental, actions } = useAppData();
  const vehicle = useMemo(
    () => rental.vehicles.find((entry) => entry.id === vehicleId) ?? rental.vehicles[0] ?? null,
    [rental.vehicles, vehicleId]
  );

  const [mode, setMode] = useState<"self_drive" | "chauffeur">(
    rental.booking.rentalMode === "chauffeur" ? "chauffeur" : "self_drive"
  );

  useEffect(() => {
    if (vehicle?.id && rental.selectedVehicleId !== vehicle.id) {
      actions.selectRentalVehicle(vehicle.id);
    }
  }, [actions, rental.selectedVehicleId, vehicle?.id]);

  if (!vehicle) {
    return (
      <Box sx={screenShellSx}>
        <Typography>No rental vehicle available.</Typography>
      </Box>
    );
  }

  const price = parseUgx(vehicle.dailyPrice);
  const vehicleLabel = getRentalVehicleLabel(vehicle.name);
  const pickupBranchLabel = rental.booking.pickupBranch ?? "Nsambya EV Hub, Uganda";
  const openPickupBranchSelector = (): void => {
    navigate("/rental/branches", {
      state: { focusPickupBranchLabel: pickupBranchLabel }
    });
  };

  return (
    <Box sx={{ ...screenShellSx, pb: { xs: 13, sm: 6 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.1 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ border: `1px solid ${rentalUi.border}`, bgcolor: "#fff" }}>
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography sx={{ fontSize: "22px !important", fontWeight: 800 }}>Rental vehicle</Typography>
        <Box sx={{ width: 40, height: 40 }} />
      </Stack>

      <CroppedReferenceImage
        src={getVehicleImageFromName(vehicle.name)}
        alt={vehicle.name}
        height={258}
        scale={1}
        fit="contain"
        sx={{ mb: 1.05 }}
      />
      <Stack direction="row" justifyContent="center" spacing={0.8} sx={{ mb: 1.05 }}>
        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: rentalUi.green }} />
        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#D9DEE7" }} />
        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#D9DEE7" }} />
      </Stack>

      <Stack direction="row" justifyContent="space-between" spacing={0.9} alignItems="flex-start" sx={{ mb: 0.45 }}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={{ fontSize: "26px !important", fontWeight: 800, lineHeight: 1.03 }}>
            {vehicleLabel}
          </Typography>
          <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mt: 0.3 }}>
            <StarRoundedIcon sx={{ color: rentalUi.green, fontSize: 18 }} />
            <Typography sx={{ color: rentalUi.muted, fontSize: "11.6px !important" }}>4.6 (128 reviews)</Typography>
            <Typography sx={{ color: rentalUi.greenDeep, fontWeight: 700, fontSize: "11.6px !important" }}>• Available</Typography>
          </Stack>
        </Box>

        <Stack direction="row" spacing={0.7} sx={{ flexShrink: 0, alignSelf: "center" }}>
          <Chip
            icon={<DirectionsCarRoundedIcon />}
            label="Self-drive"
            onClick={() => setMode("self_drive")}
            sx={{
              borderRadius: 2,
              bgcolor: mode === "self_drive" ? rentalUi.greenSoft : "#fff",
              border: `1px solid ${mode === "self_drive" ? rentalUi.green : rentalUi.border}`,
              color: mode === "self_drive" ? rentalUi.greenDeep : rentalUi.muted,
              height: 40,
              "& .MuiChip-label": { fontSize: "11.2px !important", fontWeight: 600, px: 0.8 },
              "& .MuiChip-icon": { fontSize: 16, ml: 0.85, mr: -0.15 }
            }}
          />
          <Chip
            icon={<SupportAgentRoundedIcon />}
            label="Chauffeur"
            onClick={() => setMode("chauffeur")}
            sx={{
              borderRadius: 2,
              bgcolor: mode === "chauffeur" ? rentalUi.greenSoft : "#fff",
              border: `1px solid ${mode === "chauffeur" ? rentalUi.green : rentalUi.border}`,
              color: mode === "chauffeur" ? rentalUi.greenDeep : rentalUi.muted,
              height: 40,
              "& .MuiChip-label": { fontSize: "11.2px !important", fontWeight: 600, px: 0.8 },
              "& .MuiChip-icon": { fontSize: 16, ml: 0.85, mr: -0.15 }
            }}
          />
        </Stack>
      </Stack>

      <Typography sx={{ color: rentalUi.muted, fontSize: "11.8px !important", mb: 1.35 }}>
        Spacious, comfortable, and perfect for family trips. Enjoy long drives with zero emissions.
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 0.55, mb: 1.2 }}>
        <FeatureStat icon={<AirlineSeatReclineNormalRoundedIcon />} label={`${vehicle.seats} Seats`} helper="Spacious cabin" />
        <FeatureStat icon={<BatteryChargingFullRoundedIcon />} label={`${parseUgx(vehicle.range)} km`} helper="ARAI range" />
        <FeatureStat icon={<SettingsSuggestRoundedIcon />} label="Automatic" helper="Transmission" />
        <FeatureStat icon={<LuggageRoundedIcon />} label={`${vehicle.luggageCapacity} Large`} helper="Luggage" />
      </Box>

      <Typography sx={{ fontSize: "18px !important", fontWeight: 700, mb: 0.75 }}>Included</Typography>
      <Card sx={{ ...cardSx, mb: 1.45 }}>
        <CardContent sx={{ p: 1.1, "&:last-child": { pb: 1.1 } }}>
          <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
            <Stack direction="row" spacing={0.6} alignItems="center" sx={{ flex: 1, px: 1 }}>
              <ShieldOutlinedIcon sx={{ color: rentalUi.green, fontSize: 19 }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "11.8px !important", lineHeight: 1.15 }}>Zero dep. insurance</Typography>
                <Typography sx={{ color: rentalUi.muted, fontSize: "10.8px !important", mt: 0.1 }}>Fully covered</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={0.6} alignItems="center" sx={{ flex: 1, px: 1 }}>
              <SupportAgentOutlinedIcon sx={{ color: rentalUi.green, fontSize: 19 }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "11.8px !important", lineHeight: 1.15 }}>Roadside support</Typography>
                <Typography sx={{ color: rentalUi.muted, fontSize: "10.8px !important", mt: 0.1 }}>24x7 assistance</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={0.6} alignItems="center" sx={{ flex: 1, px: 1 }}>
              <EvStationOutlinedIcon sx={{ color: rentalUi.green, fontSize: 19 }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "11.8px !important", lineHeight: 1.15 }}>Home charger</Typography>
                <Typography sx={{ color: rentalUi.muted, fontSize: "10.8px !important", mt: 0.1 }}>Included</Typography>
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Typography sx={{ fontSize: "18px !important", fontWeight: 700, mb: 0.75 }}>Pickup branch</Typography>
      <Card
        sx={{
          ...cardSx,
          mb: 1.45,
          cursor: "pointer",
          borderColor: "#CFE8D9",
          "&:hover": {
            borderColor: rentalUi.green
          }
        }}
        onClick={openPickupBranchSelector}
        onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPickupBranchSelector();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <CardContent sx={{ p: 1.2, "&:last-child": { pb: 1.2 } }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 42, height: 42, borderRadius: "50%", bgcolor: rentalUi.greenSoft, color: rentalUi.green, display: "grid", placeItems: "center" }}>
                <LocationOnRoundedIcon />
              </Box>
              <Box>
                  <Typography sx={{ fontSize: "16px !important", fontWeight: 700 }}>{pickupBranchLabel}</Typography>
                  <Typography sx={{ color: rentalUi.muted, fontSize: "11px !important", mt: 0.1 }}>1.8 km away</Typography>
                  <Typography sx={{ color: rentalUi.greenDeep, fontSize: "11px !important", mt: 0.05 }}>Open until 9:00 PM</Typography>
                  <Typography sx={{ color: rentalUi.greenDeep, fontSize: "10.8px !important", mt: 0.2, fontWeight: 700 }}>
                    Tap to change this branch
                  </Typography>
                </Box>
              </Stack>
            <Stack direction="row" spacing={0.9} alignItems="center">
              <CroppedReferenceImage
                src={RENTAL_UI_ASSETS.banners.branchMap}
                alt="Branch"
                height={60}
                scale={1}
                fit="cover"
                sx={{ width: 110, borderRadius: 1.8 }}
              />
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border: `1px solid ${rentalUi.border}`,
                  color: rentalUi.muted,
                  display: "grid",
                  placeItems: "center"
                }}
              >
                <ChevronRightRoundedIcon sx={{ fontSize: 18 }} />
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ ...cardSx, mb: 1.1 }}>
        <CardContent sx={{ p: 1.15, "&:last-child": { pb: 1.15 } }}>
          <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
            <Box sx={{ flex: 1, px: 1 }}>
              <Typography sx={{ fontSize: "19px !important", fontWeight: 800, color: rentalUi.greenDeep }}>
                {formatInr(price)}
                <Typography component="span" sx={{ color: rentalUi.muted, fontSize: "11px !important", fontWeight: 500 }}>
                  {" "}/ day
                </Typography>
              </Typography>
              <Typography sx={{ fontSize: "11px !important", color: rentalUi.muted }}>Inclusive of taxes</Typography>
            </Box>
            <Box sx={{ flex: 1, px: 1 }}>
              <Typography sx={{ fontSize: "20px !important", fontWeight: 800 }}>{formatInr(depositAmount)}</Typography>
              <Typography sx={{ fontSize: "11px !important", color: rentalUi.muted }}>Security deposit</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <GradientActionButton
        label="Select dates"
        sx={{ mt: 0.15 }}
        onClick={() => {
          actions.updateRentalBooking({
            vehicleId: vehicle.id,
            rentalMode: mode
          });
          navigate("/rental/dates", { state: { vehicleId: vehicle.id } });
        }}
      />
    </Box>
  );
}
