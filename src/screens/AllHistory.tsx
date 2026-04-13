import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from "@mui/material";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import TourRoundedIcon from "@mui/icons-material/TourRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";
import { getDeliveryStatusLabel } from "../features/delivery/stateMachine";

type OrderType = "Ride" | "Delivery" | "Rental" | "Tour" | "Ambulance";

type PeriodFilter = "Today" | "Week" | "Month" | "Quarter" | "Year";

type QuarterFilter = "Q1" | "Q2" | "Q3" | "Q4";

type TypeFilter = "all" | OrderType;

interface Order {
  id: string;
  type: OrderType;
  historyLabel: string;
  title: string;
  date: string;
  from: string;
  to: string;
  status: string;
  rawDate: string;
  detailsPath: string;
}

function getTypeIcon(type: OrderType): React.ReactElement {
  switch (type) {
    case "Ride":
      return <DirectionsCarFilledRoundedIcon sx={{ fontSize: 20 }} />;
    case "Delivery":
      return <LocalShippingRoundedIcon sx={{ fontSize: 20 }} />;
    case "Rental":
      return <ElectricCarRoundedIcon sx={{ fontSize: 20 }} />;
    case "Tour":
      return <TourRoundedIcon sx={{ fontSize: 20 }} />;
    case "Ambulance":
      return <LocalHospitalRoundedIcon sx={{ fontSize: 20 }} />;
    default:
      return <MoreHorizRoundedIcon sx={{ fontSize: 20 }} />;
  }
}

function formatDateLabel(value?: string): string {
  if (!value) return "Recent";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recent";

  return date.toLocaleString("en-UG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function toStatusLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function inferRideHistoryLabel(routeSummary?: string): string {
  const summary = routeSummary?.toLowerCase() ?? "";
  if (summary.includes("shared") || summary.includes("pool") || summary.includes("split")) {
    return "Shared ride";
  }
  return "Private ride";
}

function getHistoryLabelTone(order: Order): { bg: string; fg: string; border: string } {
  if (order.type === "Delivery") {
    return order.historyLabel === "Incoming delivery"
      ? { bg: "rgba(34,197,94,0.14)", fg: "#166534", border: "rgba(22,163,74,0.36)" }
      : { bg: "rgba(59,130,246,0.14)", fg: "#1D4ED8", border: "rgba(59,130,246,0.36)" };
  }

  if (order.type === "Ride") {
    return order.historyLabel === "Shared ride"
      ? { bg: "rgba(168,85,247,0.14)", fg: "#7E22CE", border: "rgba(147,51,234,0.34)" }
      : { bg: "rgba(148,163,184,0.16)", fg: "#334155", border: "rgba(100,116,139,0.35)" };
  }

  if (order.type === "Ambulance") {
    return { bg: "rgba(248,113,113,0.14)", fg: "#B91C1C", border: "rgba(239,68,68,0.35)" };
  }

  if (order.type === "Rental") {
    return { bg: "rgba(251,191,36,0.18)", fg: "#92400E", border: "rgba(245,158,11,0.35)" };
  }

  return { bg: "rgba(16,185,129,0.14)", fg: "#047857", border: "rgba(16,185,129,0.34)" };
}

function getQuarter(value: Date): QuarterFilter {
  const month = value.getMonth();
  if (month < 3) return "Q1";
  if (month < 6) return "Q2";
  if (month < 9) return "Q3";
  return "Q4";
}

function isSameDate(lhs: Date, rhs: Date): boolean {
  return (
    lhs.getFullYear() === rhs.getFullYear() &&
    lhs.getMonth() === rhs.getMonth() &&
    lhs.getDate() === rhs.getDate()
  );
}

function matchesPeriod(date: Date, period: PeriodFilter, selectedYear: number, selectedQuarter: QuarterFilter): boolean {
  const now = new Date();

  if (period === "Today") {
    return isSameDate(date, now);
  }

  if (period === "Week") {
    const diffMs = Math.abs(now.getTime() - date.getTime());
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    return diffMs <= sevenDaysMs;
  }

  if (period === "Month") {
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }

  if (period === "Quarter") {
    return date.getFullYear() === selectedYear && getQuarter(date) === selectedQuarter;
  }

  if (period === "Year") {
    return date.getFullYear() === selectedYear;
  }

  return true;
}

interface AllOrdersCardProps {
  order: Order;
}

function AllOrdersCard({ order }: AllOrdersCardProps): React.JSX.Element {
  const navigate = useNavigate();
  const labelTone = getHistoryLabelTone(order);

  return (
    <Card
      elevation={0}
      onClick={() => navigate(order.detailsPath)}
      sx={{
        mb: uiTokens.spacing.mdPlus,
        borderRadius: uiTokens.radius.sm,
        cursor: "pointer",
        bgcolor: (t) =>
          t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: (t) =>
          t.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.mdPlus }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: uiTokens.radius.xl,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#E5E7EB" : "rgba(15,23,42,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {getTypeIcon(order.type)}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
              {order.title}
            </Typography>
            <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mt: 0.45 }}>
              <Chip
                size="small"
                label={order.historyLabel}
                sx={{
                  height: 20,
                  borderRadius: uiTokens.radius.xl,
                  fontSize: 10,
                  fontWeight: 700,
                  bgcolor: labelTone.bg,
                  color: labelTone.fg,
                  border: `1px solid ${labelTone.border}`
                }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                {order.type} • {order.date}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={uiTokens.spacing.xs} alignItems="center" sx={{ mt: uiTokens.spacing.xxs }}>
              <PlaceRoundedIcon sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }} />
              <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                {order.from} → {order.to}
              </Typography>
            </Stack>
          </Box>
          <Chip
            size="small"
            label={order.status}
            sx={{
              borderRadius: uiTokens.radius.xl,
              fontSize: 10,
              height: 22,
              bgcolor:
                order.status === "Upcoming"
                  ? "rgba(34,197,94,0.12)"
                  : "rgba(148,163,184,0.18)",
              color:
                order.status === "Upcoming" ? "#16A34A" : "rgba(148,163,184,1)"
            }}
          />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            ID: {order.id}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={(event) => {
              event.stopPropagation();
              navigate(order.detailsPath);
            }}
            sx={{
              borderRadius: uiTokens.radius.xl,
              px: uiTokens.spacing.lg,
              py: uiTokens.spacing.xxs,
              fontSize: 12,
              textTransform: "none"
            }}
          >
            View details
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function AllOrdersCombinedHistoryScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { ride, delivery, rental, tours, ambulance } = useAppData();

  const [filter, setFilter] = useState<TypeFilter>("all");
  const [period, setPeriod] = useState<PeriodFilter>("Month");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedQuarter, setSelectedQuarter] = useState<QuarterFilter>(getQuarter(new Date()));

  const periods: PeriodFilter[] = ["Today", "Week", "Month", "Quarter", "Year"];
  const quarters: QuarterFilter[] = ["Q1", "Q2", "Q3", "Q4"];

  const allOrders = useMemo<Order[]>(() => {
    const nowIso = new Date().toISOString();

    const rideTripCandidates = [ride.activeTrip, ...ride.history].filter(
      (trip): trip is NonNullable<typeof ride.activeTrip> => Boolean(trip?.id)
    );
    const rideTripSeen = new Set<string>();
    const rideOrders: Order[] = rideTripCandidates
      .filter((trip) => {
        if (rideTripSeen.has(trip.id)) return false;
        rideTripSeen.add(trip.id);
        return true;
      })
      .map((trip) => {
        const rawDate = trip.completedAt ?? trip.startedAt ?? nowIso;
        return {
          id: trip.id,
          type: "Ride",
          historyLabel: inferRideHistoryLabel(trip.routeSummary),
          title: trip.routeSummary ? `Ride • ${trip.routeSummary}` : "Ride trip",
          date: formatDateLabel(rawDate),
          from: trip.pickup?.label ?? trip.pickup?.address ?? "Pickup not set",
          to: trip.dropoff?.label ?? trip.dropoff?.address ?? "Dropoff not set",
          status: toStatusLabel(trip.status),
          rawDate,
          detailsPath: `/rides/history/${trip.id}`
        };
      });

    const deliveryOrders: Order[] = delivery.orders.map((order) => {
      const rawDate = order.updatedAt ?? order.createdAt ?? nowIso;
      return {
        id: order.id,
        type: "Delivery",
        historyLabel: order.participantRole === "receiver" ? "Incoming delivery" : "Sent delivery",
        title: order.parcel.description || order.packageName || "Delivery order",
        date: formatDateLabel(rawDate),
        from: order.pickup.label,
        to: order.dropoff.label,
        status: getDeliveryStatusLabel(order.status),
        rawDate,
        detailsPath: `/deliveries/tracking/${order.id}`
      };
    });

    const rentalVehicle = rental.vehicles.find((vehicle) => vehicle.id === rental.booking.vehicleId);
    const rentalRawDate = rental.booking.startDate ?? nowIso;
    const rentalOrders: Order[] = rental.booking.id
      ? [
          {
            id: rental.booking.id,
            type: "Rental",
            historyLabel: "Rental booking",
            title: rentalVehicle ? `${rentalVehicle.name} booking` : "EV rental booking",
            date: formatDateLabel(rentalRawDate),
            from: rental.booking.pickupBranch ?? "Pickup branch not set",
            to: rental.booking.dropoffBranch ?? "Return branch not set",
            status: toStatusLabel(rental.booking.status),
            rawDate: rentalRawDate,
            detailsPath: `/rental/history/${rental.booking.id}`
          }
        ]
      : [];

    const bookedTour = tours.tours.find((tour) => tour.id === tours.booking.tourId) ?? tours.tours[0];
    const tourRawDate = tours.booking.date ?? nowIso;
    const tourOrders: Order[] = tours.booking.id
      ? [
          {
            id: tours.booking.id,
            type: "Tour",
            historyLabel: "Tour booking",
            title: bookedTour?.title ?? "Tour booking",
            date: tours.booking.date ? formatDateLabel(tours.booking.date) : bookedTour?.scheduleLabel ?? "Schedule pending",
            from: bookedTour?.location ?? "Tour location",
            to: bookedTour?.duration ?? "Tour itinerary",
            status: toStatusLabel(tours.booking.status),
            rawDate: tourRawDate,
            detailsPath: bookedTour ? `/tours/${bookedTour.id}` : "/tours/history"
          }
        ]
      : [];

    const ambulanceCandidates = [ambulance.request, ...ambulance.history].filter(
      (request): request is NonNullable<typeof ambulance.request> => Boolean(request?.id)
    );
    const ambulanceSeen = new Set<string>();
    const ambulanceOrders: Order[] = ambulanceCandidates
      .filter((request) => {
        if (ambulanceSeen.has(request.id)) return false;
        ambulanceSeen.add(request.id);
        return true;
      })
      .map((request) => ({
        id: request.id,
        type: "Ambulance",
        historyLabel: "Ambulance request",
        title: "Ambulance request",
        date: formatDateLabel(
          request.completedAt ??
          request.cancelledAt ??
          request.arrivedAt ??
          request.dispatchedAt ??
          request.requestedAt ??
          nowIso
        ),
        from: request.pickup?.label ?? request.pickup?.address ?? "Pickup not set",
        to: request.destination?.label ?? request.destination?.address ?? "Destination not set",
        status: toStatusLabel(request.status),
        rawDate:
          request.completedAt ??
          request.cancelledAt ??
          request.arrivedAt ??
          request.dispatchedAt ??
          request.requestedAt ??
          nowIso,
        detailsPath: `/ambulance/history/${request.id}`
      }));

    return [...rideOrders, ...deliveryOrders, ...rentalOrders, ...tourOrders, ...ambulanceOrders].sort(
      (left, right) => new Date(right.rawDate).getTime() - new Date(left.rawDate).getTime()
    );
  }, [ambulance.history, ambulance.request, delivery.orders, rental.booking, rental.vehicles, ride.activeTrip, ride.history, tours.booking, tours.tours]);

  const years = useMemo(() => {
    const allYears = allOrders
      .map((order) => new Date(order.rawDate).getFullYear())
      .filter((year) => Number.isFinite(year));
    const uniqueYears = Array.from(new Set(allYears)).sort((left, right) => right - left);
    return uniqueYears.length > 0 ? uniqueYears : [new Date().getFullYear()];
  }, [allOrders]);

  useEffect(() => {
    if (!years.includes(selectedYear)) {
      setSelectedYear(years[0]);
    }
  }, [selectedYear, years]);

  const filtered = useMemo(() => {
    return allOrders.filter((order) => {
      const matchesType = filter === "all" || order.type === filter;
      const orderDate = new Date(order.rawDate);
      const matchesTime = Number.isNaN(orderDate.getTime())
        ? true
        : matchesPeriod(orderDate, period, selectedYear, selectedQuarter);
      return matchesType && matchesTime;
    });
  }, [allOrders, filter, period, selectedYear, selectedQuarter]);

  return (
    <Box sx={{ px: uiTokens.spacing.xl, pt: uiTokens.spacing.xl, pb: uiTokens.spacing.xxl }}>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
              All orders
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Rides, deliveries, rentals, tours & ambulance
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mb: uiTokens.spacing.lg, overflowX: "auto", pb: uiTokens.spacing.sm, display: "flex" }}>
        <Stack direction="row" spacing={1}>
          {periods.map((value) => (
            <Chip
              key={value}
              label={value}
              onClick={() => setPeriod(value)}
              size="small"
              sx={{
                borderRadius: uiTokens.radius.xl,
                fontSize: 10,
                height: 24,
                bgcolor: period === value ? "primary.main" : "transparent",
                color: period === value ? "#020617" : "text.secondary",
                border: "1px solid",
                borderColor: period === value ? "primary.main" : "divider",
                fontWeight: period === value ? 600 : 400,
                transition: "all 0.2s ease"
              }}
            />
          ))}
        </Stack>
      </Box>

      {period === "Quarter" && (
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel id="quarter-select-label" sx={{ fontSize: 12 }}>Quarter</InputLabel>
            <Select
              labelId="quarter-select-label"
              value={selectedQuarter}
              label="Quarter"
              onChange={(event) => setSelectedQuarter(event.target.value as QuarterFilter)}
              sx={{ borderRadius: uiTokens.radius.sm, fontSize: 13 }}
            >
              {quarters.map((value) => (
                <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel id="year-select-label" sx={{ fontSize: 12 }}>Year</InputLabel>
            <Select
              labelId="year-select-label"
              value={selectedYear}
              label="Year"
              onChange={(event) => setSelectedYear(Number(event.target.value))}
              sx={{ borderRadius: uiTokens.radius.sm, fontSize: 13 }}
            >
              {years.map((value) => (
                <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      )}

      {period === "Year" && (
        <Box sx={{ mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="year-only-select-label" sx={{ fontSize: 12 }}>Select Year</InputLabel>
            <Select
              labelId="year-only-select-label"
              value={selectedYear}
              label="Select Year"
              onChange={(event) => setSelectedYear(Number(event.target.value))}
              sx={{ borderRadius: uiTokens.radius.sm, fontSize: 13 }}
            >
              {years.map((value) => (
                <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", rowGap: 1 }}>
        {(["all", "Ride", "Delivery", "Rental", "Tour", "Ambulance"] as const).map((value) => {
          const labelMap: Record<TypeFilter, string> = {
            all: "All",
            Ride: "Rides",
            Delivery: "Deliveries",
            Rental: "Rentals",
            Tour: "Tours",
            Ambulance: "Ambulance"
          };
          const selected = filter === value;
          return (
            <Chip
              key={value}
              label={labelMap[value]}
              onClick={() => setFilter(value)}
              size="small"
              sx={{
                borderRadius: uiTokens.radius.xl,
                fontSize: 11,
                height: 26,
                bgcolor: selected ? "primary.main" : (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                color: selected ? "#020617" : (t) => t.palette.text.primary
              }}
            />
          );
        })}
      </Stack>

      {filtered.length === 0 ? (
        <Typography
          variant="caption"
          sx={{ mt: 4, display: "block", textAlign: "center", color: (t) => t.palette.text.secondary }}
        >
          No orders in this view yet.
        </Typography>
      ) : (
        filtered.map((order) => <AllOrdersCard key={`${order.type}-${order.id}`} order={order} />)
      )}
    </Box>
  );
}

export default function AllHistory(): React.JSX.Element {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (t) => t.palette.background.default
      }}
    >
      <AllOrdersCombinedHistoryScreen />
    </Box>
  );
}
