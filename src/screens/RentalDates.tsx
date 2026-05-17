import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  IconButton,
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

function atMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function toDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export default function RentalDates(): React.JSX.Element {
  const navigate = useNavigate();
  const { rental, actions } = useAppData();

  const vehicle = useMemo(
    () => rental.vehicles.find((entry) => entry.id === rental.booking.vehicleId) ?? rental.vehicles[0] ?? null,
    [rental.booking.vehicleId, rental.vehicles]
  );

  const [visibleMonth, setVisibleMonth] = useState(() => new Date(2025, 4, 1));
  const [pickupDate, setPickupDate] = useState(() => atMidnight(new Date(2025, 4, 14)));
  const [returnDate, setReturnDate] = useState(() => atMidnight(new Date(2025, 4, 18)));
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnTime, setReturnTime] = useState("10:00");
  const [selectionMode, setSelectionMode] = useState<"pickup" | "return">("pickup");

  const calendarDays = useMemo(() => {
    const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const startOffset = (monthStart.getDay() + 6) % 7;
    const gridStart = new Date(monthStart);
    gridStart.setDate(monthStart.getDate() - startOffset);

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      return date;
    });
  }, [visibleMonth]);

  const durationDays = useMemo(() => {
    const start = atMidnight(pickupDate).getTime();
    const end = atMidnight(returnDate).getTime();
    const diffDays = Math.floor((end - start) / 86400000) + 1;
    return Math.max(1, diffDays);
  }, [pickupDate, returnDate]);

  const durationLabel = `${durationDays} day${durationDays > 1 ? "s" : ""}`;

  const pickupDateLabel = toDisplayDate(pickupDate);
  const returnDateLabel = toDisplayDate(returnDate);

  const formatTime12h = (time24: string): string => {
    const [rawHour, rawMinute] = time24.split(":");
    const hour = Number(rawHour);
    const minute = Number(rawMinute);
    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      return "10:00 AM";
    }
    const suffix = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${suffix}`;
  };

  const handleDatePick = (picked: Date): void => {
    const day = atMidnight(picked);

    if (selectionMode === "pickup") {
      setPickupDate(day);
      if (day.getTime() > returnDate.getTime()) {
        setReturnDate(day);
      }
      setSelectionMode("return");
      return;
    }

    if (day.getTime() < pickupDate.getTime()) {
      setReturnDate(pickupDate);
    } else {
      setReturnDate(day);
    }
    setSelectionMode("pickup");
  };

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
            <IconButton
              sx={{ color: rentalUi.green }}
              onClick={() => setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
            >
              <ChevronLeftRoundedIcon />
            </IconButton>
            <Typography sx={{ fontSize: 26, fontWeight: 700 }}>
              {visibleMonth.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
            </Typography>
            <IconButton
              sx={{ color: rentalUi.green }}
              onClick={() => setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
            >
              <ChevronRightRoundedIcon />
            </IconButton>
          </Stack>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0,1fr))", gap: 0.7, mb: 1 }}>
            {dayNames.map((name) => (
              <Typography key={name} sx={{ textAlign: "center", color: rentalUi.muted, fontSize: 16 }}>{name}</Typography>
            ))}
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0,1fr))", rowGap: 0.65, columnGap: 0.5 }}>
            {calendarDays.map((day) => {
              const isPickup = isSameDay(day, pickupDate);
              const isReturn = isSameDay(day, returnDate);
              const inRange = day.getTime() > pickupDate.getTime() && day.getTime() < returnDate.getTime();
              const muted = day.getMonth() !== visibleMonth.getMonth();
              return (
                <Box
                  key={day.toISOString()}
                  onClick={() => handleDatePick(day)}
                  sx={{
                    cursor: "pointer",
                    textAlign: "center",
                    py: 0.65,
                    borderRadius: isPickup || isReturn ? "50%" : 0,
                    bgcolor:
                      isPickup ? rentalUi.green : isReturn ? rentalUi.orange : inRange ? "#DFF5EA" : "transparent",
                    color:
                      isPickup || isReturn
                        ? "#fff"
                        : muted
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
                  {day.getDate()}
                </Box>
              );
            })}
          </Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.55, px: 1 }}>
            <Typography sx={{ color: rentalUi.greenDeep, fontWeight: 700, fontSize: 13 }}>
              Pickup: {pickupDate.getDate()}
            </Typography>
            <Typography sx={{ color: rentalUi.orange, fontWeight: 700, fontSize: 13 }}>
              Return: {returnDate.getDate()}
            </Typography>
          </Stack>
          <Typography sx={{ mt: 0.35, fontSize: 11.2, color: rentalUi.muted }}>
            Selecting: {selectionMode === "pickup" ? "pickup date" : "return date"}
          </Typography>
          <Stack direction="row" spacing={1.2} sx={{ mt: 0.45 }}>
            <Typography sx={{ color: rentalUi.greenDeep, fontWeight: 700, fontSize: 12 }}>PICKUP</Typography>
            <Typography sx={{ color: rentalUi.orange, fontWeight: 700, fontSize: 12 }}>RETURN</Typography>
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
                type="time"
                variant="outlined"
                value={pickupTime}
                onChange={(event) => setPickupTime(event.target.value)}
                inputProps={{ step: 300 }}
                sx={{
                  flex: 1,
                  "& .MuiInputBase-input": { fontSize: "14px !important", fontWeight: 700, py: 0.8 },
                  "& .MuiOutlinedInput-root": { borderRadius: 2 }
                }}
              />
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ ...cardSx, flex: 1 }}>
          <CardContent sx={{ p: 1.2, "&:last-child": { pb: 1.2 } }}>
            <Typography sx={{ color: rentalUi.muted, fontSize: 16, mb: 0.5 }}>Return time</Typography>
            <Stack direction="row" spacing={0.7} alignItems="center">
              <AccessTimeRoundedIcon sx={{ color: rentalUi.orange }} />
              <TextField
                type="time"
                variant="outlined"
                value={returnTime}
                onChange={(event) => setReturnTime(event.target.value)}
                inputProps={{ step: 300 }}
                sx={{
                  flex: 1,
                  "& .MuiInputBase-input": { fontSize: "14px !important", fontWeight: 700, py: 0.8 },
                  "& .MuiOutlinedInput-root": { borderRadius: 2 }
                }}
              />
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
              <Typography sx={{ fontSize: 16.5, color: rentalUi.muted }}>{pickupDateLabel} – {returnDateLabel}</Typography>
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
            startDate: `${pickupDateLabel} • ${formatTime12h(pickupTime)}`,
            endDate: `${returnDateLabel} • ${formatTime12h(returnTime)}`
          });
          navigate("/rental/branches");
        }}
      />
    </Box>
  );
}
