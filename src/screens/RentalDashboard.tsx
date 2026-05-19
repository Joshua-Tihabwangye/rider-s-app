import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MicNoneRoundedIcon from "@mui/icons-material/MicNoneRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import AirlineSeatReclineNormalRoundedIcon from "@mui/icons-material/AirlineSeatReclineNormalRounded";
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

import { useAppData } from "../contexts/AppDataContext";
import {
  CroppedReferenceImage,
  GradientActionButton,
  cardSx,
  formatInr,
  rentalUi,
  screenShellSx
} from "../components/rental/RentalRedesignUI";
import { parseUgx } from "../features/rental/booking";
import { RENTAL_UI_ASSETS, getVehicleImageFromName } from "../features/rental/uiAssets";

interface QuickOption {
  label: string;
  subtitle: string;
  icon: React.ReactNode;
}

const quickOptions: QuickOption[] = [
  { label: "Self-drive", subtitle: "Drive on your own", icon: <DirectionsCarRoundedIcon /> },
  { label: "Chauffeur", subtitle: "Sit back and relax", icon: <SupportAgentRoundedIcon /> },
  { label: "By day", subtitle: "Flexible daily rentals", icon: <CalendarMonthRoundedIcon /> },
  { label: "Airport pickup", subtitle: "Pickup from airport", icon: <FlightTakeoffRoundedIcon sx={{ color: rentalUi.orange }} /> }
];

function PopularRentalCard({
  name,
  seats,
  range,
  price,
  image,
  onClick
}: {
  name: string;
  seats: number;
  range: string;
  price: number;
  image: string;
  onClick: () => void;
}): React.JSX.Element {
  return (
    <Card onClick={onClick} sx={{ ...cardSx, cursor: "pointer", overflow: "hidden" }}>
      <CardContent sx={{ p: 0.9, "&:last-child": { pb: 0.9 } }}>
        <CroppedReferenceImage
          src={image}
          alt={name}
          height={{ xs: 84, sm: 92, md: 96 }}
          fit="contain"
          scale={1}
          sx={{ borderRadius: 1.8, mb: 0.65, bgcolor: "#F8FBFF" }}
        />
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: rentalUi.title, lineHeight: 1.15 }}>{name}</Typography>
        <Stack direction="row" spacing={0.8} sx={{ mt: 0.25, mb: 0.6, flexWrap: "wrap" }}>
          <Stack direction="row" spacing={0.3} alignItems="center">
            <AirlineSeatReclineNormalRoundedIcon sx={{ fontSize: 11, color: rentalUi.muted }} />
            <Typography sx={{ fontSize: 10, color: rentalUi.muted }}>{seats} Seats</Typography>
          </Stack>
          <Stack direction="row" spacing={0.3} alignItems="center">
            <BatteryChargingFullRoundedIcon sx={{ fontSize: 11, color: rentalUi.muted }} />
            <Typography sx={{ fontSize: 10, color: rentalUi.muted }}>{range}</Typography>
          </Stack>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontWeight: 700, fontSize: 10.5, color: rentalUi.greenDeep }}>
            {formatInr(price)}
            <Typography component="span" sx={{ color: rentalUi.muted, fontSize: 9.5, fontWeight: 500 }}>
              {" "}/ day
            </Typography>
          </Typography>
          <IconButton size="small" sx={{ border: `1px solid ${rentalUi.border}`, p: 0.45 }}>
            <ArrowForwardIosRoundedIcon sx={{ fontSize: 11, color: rentalUi.muted }} />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function RentalDashboard(): React.JSX.Element {
  const navigate = useNavigate();
  const { rental, actions } = useAppData();
  const vehicles = rental.vehicles.slice(0, 3);

  return (
    <Box sx={screenShellSx}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.8 }}>
        <Avatar sx={{ width: 42, height: 42, bgcolor: "#E6EDF4", color: rentalUi.title, fontWeight: 700 }}>
          R
        </Avatar>
        <Typography sx={{ color: rentalUi.title, fontSize: 18, fontWeight: 800, textAlign: "center", flex: 1 }}>
          Vehicle rentals
        </Typography>
        <Box sx={{ width: 42 }} />
      </Stack>

      <TextField
        fullWidth
        placeholder="Find an EV for self-drive or chauffeur"
        InputProps={{
          startAdornment: <SearchRoundedIcon sx={{ color: rentalUi.green, mr: 1 }} />,
          endAdornment: <MicNoneRoundedIcon sx={{ color: rentalUi.green }} />
        }}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            bgcolor: "#fff",
            fontSize: 16,
            "& fieldset": { borderColor: rentalUi.border }
          }
        }}
      />

      <Card sx={{ ...cardSx, mb: 1.9, overflow: "hidden" }}>
        <CardContent sx={{ p: 1.25, "&:last-child": { pb: 1.25 } }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1.05fr 1fr",
              gap: 1.1,
              alignItems: "center"
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 19, fontWeight: 800, lineHeight: 1.1, mb: 0.55 }}>
                Rent electric.
                <br />
                Drive <Box component="span" sx={{ color: rentalUi.orange }}>your way.</Box>
              </Typography>
              <Typography sx={{ color: rentalUi.muted, fontSize: 11.5, lineHeight: 1.42, mb: 1 }}>
                Self-drive or chauffeur, flexible daily rentals, airport pickup, and seamless city travel.
              </Typography>
              <GradientActionButton
                label="Start rental"
                fullWidth={false}
                onClick={() => {
                  actions.beginRentalBooking();
                  navigate("/rental/custom");
                }}
                sx={{ px: 1.1, py: 0.5, minWidth: 116, fontSize: 12 }}
              />
            </Box>

            <Box
              sx={{
                borderRadius: 2.2,
                bgcolor: "#F3FBF6",
                border: "1px solid #DDF0E5",
                p: 0.5,
                position: "relative"
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: 9,
                  top: 14,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: rentalUi.orange
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  left: 32,
                  top: 48,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: rentalUi.green
                }}
              />
              <CroppedReferenceImage
                src={RENTAL_UI_ASSETS.cars.suv}
                alt="Featured rental"
                height={152}
                fit="contain"
                scale={1}
                sx={{ borderRadius: 1.8, bgcolor: "transparent" }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(2, minmax(0, 1fr))" },
          gap: 0.9,
          mb: 2
        }}
      >
        {quickOptions.map((option) => (
          <Card key={option.label} sx={{ ...cardSx }}>
            <CardContent sx={{ p: 0.9, "&:last-child": { pb: 0.9 }, textAlign: "center" }}>
              <Box sx={{ color: rentalUi.green, mb: 0.25, display: "grid", placeItems: "center" }}>{option.icon}</Box>
              <Typography sx={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.2 }}>{option.label}</Typography>
              <Typography sx={{ fontSize: 10.5, color: rentalUi.muted, mt: 0.2, lineHeight: 1.25 }}>
                {option.subtitle}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700 }}>Popular rentals</Typography>
        <Typography
          component="button"
          type="button"
          onClick={() => navigate("/rental/list")}
          sx={{ border: 0, p: 0, bgcolor: "transparent", color: rentalUi.green, fontWeight: 600, fontSize: 13, cursor: "pointer" }}
        >
          View all
        </Typography>
      </Stack>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))" },
          gap: 0.8,
          mb: 2.1
        }}
      >
        {vehicles.map((vehicle) => (
          <PopularRentalCard
            key={vehicle.id}
            name={vehicle.name.includes("Nissan") ? "City EV" : vehicle.name.includes("Kona") ? "Family SUV" : "Executive EV"}
            seats={vehicle.seats}
            range={`~ ${parseUgx(vehicle.range).toLocaleString()} km`}
            price={parseUgx(vehicle.dailyPrice)}
            image={getVehicleImageFromName(vehicle.name)}
            onClick={() => {
              actions.selectRentalVehicle(vehicle.id);
              navigate(`/rental/vehicle/${vehicle.id}`);
            }}
          />
        ))}
      </Box>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700 }}>Nearby branches</Typography>
        <Typography
          component="button"
          type="button"
          onClick={() => navigate("/rental/branches")}
          sx={{ border: 0, p: 0, bgcolor: "transparent", color: rentalUi.green, fontWeight: 600, fontSize: 13, cursor: "pointer" }}
        >
          View all
        </Typography>
      </Stack>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 0.8, mb: 2 }}>
        <Card sx={cardSx}>
          <CardContent sx={{ p: 0.95, "&:last-child": { pb: 0.95 } }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={0.7}>
              <Stack direction="row" spacing={0.7} alignItems="center" sx={{ minWidth: 0 }}>
                <Avatar sx={{ width: 30, height: 30, bgcolor: rentalUi.greenSoft, color: rentalUi.green }}>
                  <LocationOnRoundedIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 11.5, fontWeight: 700, lineHeight: 1.2 }}>
                    EVzone Koramangala
                  </Typography>
                  <Typography sx={{ fontSize: 10, color: rentalUi.muted }}>1.8 km away</Typography>
                  <Typography sx={{ fontSize: 10, color: rentalUi.greenDeep }}>Open until 9:00 PM</Typography>
                </Box>
              </Stack>
              <ArrowForwardIosRoundedIcon sx={{ fontSize: 12, color: rentalUi.muted }} />
            </Stack>
          </CardContent>
        </Card>

        <Card sx={cardSx}>
          <CardContent sx={{ p: 0.95, "&:last-child": { pb: 0.95 } }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={0.7}>
              <Stack direction="row" spacing={0.7} alignItems="center" sx={{ minWidth: 0 }}>
                <Avatar sx={{ width: 30, height: 30, bgcolor: rentalUi.orangeSoft, color: rentalUi.orange }}>
                  <LocationOnRoundedIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 11.5, fontWeight: 700, lineHeight: 1.2 }}>
                    EVzone Airport T1
                  </Typography>
                  <Typography sx={{ fontSize: 10, color: rentalUi.muted }}>4.6 km away</Typography>
                  <Typography sx={{ fontSize: 10, color: rentalUi.greenDeep }}>Open 24x7</Typography>
                </Box>
              </Stack>
              <ArrowForwardIosRoundedIcon sx={{ fontSize: 12, color: rentalUi.muted }} />
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ ...cardSx, mb: 2.2, bgcolor: "#F2FBF6" }}>
        <CardContent sx={{ p: 0.95, "&:last-child": { pb: 0.95 } }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={0.8} sx={{ flexWrap: "nowrap" }}>
            <Stack direction="row" spacing={0.7} alignItems="center" sx={{ minWidth: 0 }}>
              <CroppedReferenceImage
                src={RENTAL_UI_ASSETS.banners.eco}
                alt="Eco"
                height={44}
                scale={1}
                sx={{ width: 62, borderRadius: 1.6 }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 11.5, lineHeight: 1.2 }}>
                  Eco-friendly rentals for a greener tomorrow
                </Typography>
                <Typography sx={{ color: rentalUi.muted, fontSize: 10 }}>Zero emissions, maximum smiles.</Typography>
              </Box>
            </Stack>
            <Chip
              label="Learn more"
              sx={{
                bgcolor: "#fff",
                color: rentalUi.green,
                border: `1px solid ${rentalUi.green}`,
                fontSize: 10.5,
                height: 28
              }}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
