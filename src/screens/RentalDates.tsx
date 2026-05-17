import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useAppData } from "../contexts/AppDataContext";
import {
  CroppedReferenceImage,
  GradientActionButton,
  cardSx,
  rentalUi,
  screenShellSx
} from "../components/rental/RentalRedesignUI";
import { getVehicleImageFromName } from "../features/rental/uiAssets";

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const gridDays = [
  28, 29, 30, 1, 2, 3, 4,
  5, 6, 7, 8, 9, 10, 11,
  12, 13, 14, 15, 16, 17, 18,
  19, 20, 21, 22, 23, 24, 25,
  26, 27, 28, 29, 30, 31, 1
];

function isMuted(index: number): boolean {
  return index <= 2 || index === gridDays.length - 1;
}

function isInRange(day: number): boolean {
  return day >= 14 && day <= 18;
}

export default function RentalDates(): React.JSX.Element {
  const navigate = useNavigate();
  const { rental, actions } = useAppData();

  const vehicle = useMemo(
    () => rental.vehicles.find((entry) => entry.id === rental.booking.vehicleId) ?? rental.vehicles[0] ?? null,
    [rental.booking.vehicleId, rental.vehicles]
  );

  const [pickupDate] = useState("Wed, 14 May 2025");
  const [returnDate] = useState("Sun, 18 May 2025");
  const [pickupTime, setPickupTime] = useState("10:00 AM");
  const [returnTime, setReturnTime] = useState("10:00 AM");

  const durationLabel = "5 days";

  if (!vehicle) {
    return (
      <Box sx={screenShellSx}>
        <Typography>No rental vehicle available.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={screenShellSx}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ border: `1px solid ${rentalUi.border}`, bgcolor: "#fff" }}>
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography sx={{ fontSize: 22, fontWeight: 800 }}>Select dates</Typography>
      </Stack>

      <Card sx={{ ...cardSx, mb: 1.4 }}>
        <CardContent sx={{ p: 1.4, "&:last-child": { pb: 1.4 } }}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <CroppedReferenceImage
              src={getVehicleImageFromName(vehicle.name)}
              alt={vehicle.name}
              height={100}
              scale={1}
              sx={{ width: 136, borderRadius: 2.5 }}
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontSize: 20, fontWeight: 800 }}>City EV</Typography>
              <Typography sx={{ color: rentalUi.muted, fontSize: 14 }}>Electric • Automatic • {vehicle.seats} Seats</Typography>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                <DirectionsCarRoundedIcon sx={{ color: rentalUi.green }} />
                <Typography sx={{ color: rentalUi.greenDeep, fontWeight: 700, fontSize: 14 }}>Self-drive</Typography>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ ...cardSx, mb: 1.4 }}>
        <CardContent sx={{ p: 1.4, "&:last-child": { pb: 1.4 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.1 }}>
            <IconButton sx={{ color: rentalUi.green }}>
              <ChevronLeftRoundedIcon />
            </IconButton>
            <Typography sx={{ fontSize: 26, fontWeight: 700 }}>May 2025</Typography>
            <IconButton sx={{ color: rentalUi.green }}>
              <ChevronRightRoundedIcon />
            </IconButton>
          </Stack>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0,1fr))", gap: 0.7, mb: 1 }}>
            {dayNames.map((name) => (
              <Typography key={name} sx={{ textAlign: "center", color: rentalUi.muted, fontSize: 16 }}>{name}</Typography>
            ))}
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0,1fr))", rowGap: 0.65, columnGap: 0.5 }}>
            {gridDays.map((day, index) => {
              const isPickup = day === 14;
              const isReturn = day === 18;
              const inRange = isInRange(day);
              return (
                <Box
                  key={`${day}-${index}`}
                  sx={{
                    textAlign: "center",
                    py: 0.65,
                    borderRadius: isPickup || isReturn ? "50%" : 0,
                    bgcolor:
                      isPickup ? rentalUi.green : isReturn ? rentalUi.orange : inRange ? "#DFF5EA" : "transparent",
                    color:
                      isPickup || isReturn
                        ? "#fff"
                        : isMuted(index)
                          ? "#B5BECB"
                          : rentalUi.title,
                    width: isPickup || isReturn ? 42 : "auto",
                    height: isPickup || isReturn ? 42 : "auto",
                    mx: "auto",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: isPickup || isReturn ? 700 : 500,
                    fontSize: 17
                  }}
                >
                  {day}
                </Box>
              );
            })}
          </Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5, px: 4.3 }}>
            <Typography sx={{ color: rentalUi.greenDeep, fontWeight: 700, fontSize: 16 }}>PICKUP</Typography>
            <Typography sx={{ color: rentalUi.orange, fontWeight: 700, fontSize: 16 }}>RETURN</Typography>
          </Stack>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={1.1} sx={{ mb: 1.3 }}>
        <Card sx={{ ...cardSx, flex: 1 }}>
          <CardContent sx={{ p: 1.2, "&:last-child": { pb: 1.2 } }}>
            <Typography sx={{ color: rentalUi.muted, fontSize: 16, mb: 0.5 }}>Pickup time</Typography>
            <Stack direction="row" spacing={0.7} alignItems="center">
              <AccessTimeRoundedIcon sx={{ color: rentalUi.green }} />
              <TextField
                select
                variant="standard"
                value={pickupTime}
                onChange={(event) => setPickupTime(event.target.value)}
                sx={{ flex: 1, "& .MuiInputBase-input": { fontSize: 42/2, fontWeight: 700 } }}
              >
                {"08:00 AM,09:00 AM,10:00 AM,11:00 AM,12:00 PM".split(",").map((slot) => (
                  <MenuItem key={slot} value={slot}>{slot}</MenuItem>
                ))}
              </TextField>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ ...cardSx, flex: 1 }}>
          <CardContent sx={{ p: 1.2, "&:last-child": { pb: 1.2 } }}>
            <Typography sx={{ color: rentalUi.muted, fontSize: 16, mb: 0.5 }}>Return time</Typography>
            <Stack direction="row" spacing={0.7} alignItems="center">
              <AccessTimeRoundedIcon sx={{ color: rentalUi.orange }} />
              <TextField
                select
                variant="standard"
                value={returnTime}
                onChange={(event) => setReturnTime(event.target.value)}
                sx={{ flex: 1, "& .MuiInputBase-input": { fontSize: 42/2, fontWeight: 700 } }}
              >
                {"08:00 AM,09:00 AM,10:00 AM,11:00 AM,12:00 PM".split(",").map((slot) => (
                  <MenuItem key={slot} value={slot}>{slot}</MenuItem>
                ))}
              </TextField>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Card sx={{ ...cardSx, mb: 1.2 }}>
        <CardContent sx={{ p: 1.4, "&:last-child": { pb: 1.4 } }}>
          <Stack direction="row" spacing={0.95} alignItems="center">
            <Box sx={{ width: 52, height: 52, borderRadius: 2, bgcolor: rentalUi.greenSoft, color: rentalUi.green, display: "grid", placeItems: "center" }}>
              <CalendarMonthRoundedIcon />
            </Box>
            <Box>
              <Typography sx={{ color: rentalUi.muted, fontSize: 17 }}>Total duration</Typography>
              <Typography sx={{ fontSize: 32/2, fontWeight: 700 }}>{durationLabel}</Typography>
              <Typography sx={{ fontSize: 16.5, color: rentalUi.muted }}>{pickupDate} – {returnDate}</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ ...cardSx, bgcolor: "#F2FBF6", mb: 1.55 }}>
        <CardContent sx={{ p: 1.15, "&:last-child": { pb: 1.15 } }}>
          <Stack direction="row" spacing={0.8}>
            <InfoOutlinedIcon sx={{ color: rentalUi.green, mt: 0.1 }} />
            <Typography sx={{ fontSize: 16.5, color: rentalUi.muted }}>
              Please return to the same branch. A late fee may apply for delays beyond the return time.
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <GradientActionButton
        label="Choose branches"
        onClick={() => {
          actions.updateRentalBooking({
            vehicleId: vehicle.id,
            startDate: `${pickupDate} • ${pickupTime}`,
            endDate: `${returnDate} • ${returnTime}`
          });
          navigate("/rental/branches");
        }}
      />
    </Box>
  );
}
