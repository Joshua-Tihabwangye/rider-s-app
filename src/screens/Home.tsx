import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography
} from "@mui/material";
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import TourRoundedIcon from "@mui/icons-material/TourRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";

import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ScreenScaffold from "../components/ScreenScaffold";
import ActionGrid from "../components/primitives/ActionGrid";
import AppCard from "../components/primitives/AppCard";
import SectionHeader from "../components/primitives/SectionHeader";
import ServiceActionCard from "../components/primitives/ServiceActionCard";
import InlineStat from "../components/primitives/InlineStat";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";

interface ServiceAction {
  title: string;
  description: string;
  route: string;
  icon: React.ReactNode;
  danger?: boolean;
}

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  route: string;
  state?: Record<string, unknown>;
  tone: "green" | "orange";
}

const SERVICE_ACTIONS: ServiceAction[] = [
  {
    title: "Ride",
    description: "Book an electric ride now or later",
    route: "/rides/enter",
    icon: <ElectricCarRoundedIcon sx={{ fontSize: 20 }} />
  },
  {
    title: "Delivery",
    description: "Send or receive parcels with EV couriers",
    route: "/deliveries",
    icon: <LocalShippingRoundedIcon sx={{ fontSize: 20 }} />
  },
  {
    title: "Rental",
    description: "Rent an EV for self-drive or chauffeur",
    route: "/rental",
    icon: <LuggageRoundedIcon sx={{ fontSize: 20 }} />
  },
  {
    title: "Tours",
    description: "Book EV tours, day trips",
    route: "/tours",
    icon: <TourRoundedIcon sx={{ fontSize: 20 }} />
  },
  {
    title: "School",
    description: "Access school transport management",
    route: "/school",
    icon: <SchoolRoundedIcon sx={{ fontSize: 20 }} />
  },
  {
    title: "Ambulance",
    description: "Request an emergency or transfer ambulance",
    route: "/ambulance",
    icon: <LocalHospitalRoundedIcon sx={{ fontSize: 20 }} />,
    danger: true
  }
];

const QUICK_ACTIONS: QuickAction[] = [
  { label: "Book usual route", icon: <RouteRoundedIcon sx={{ fontSize: 16 }} />, route: "/rides/enter", tone: "green" },
  { label: "Go to work", icon: <WorkRoundedIcon sx={{ fontSize: 16 }} />, route: "/rides/enter", tone: "orange" },
  { label: "Rebook last ride", icon: <ElectricCarRoundedIcon sx={{ fontSize: 16 }} />, route: "/rides/enter", state: { rebook: true }, tone: "green" },
  { label: "Track a parcel", icon: <LocalShippingRoundedIcon sx={{ fontSize: 16 }} />, route: "/deliveries", tone: "orange" }
];

function HomeMultiServiceScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { reminders, ride } = useAppData();

  const [currentReminderIndex, setCurrentReminderIndex] = useState(0);
  const promotionalReminders = useMemo(
    () => reminders.filter((reminder) => reminder.category === "promotion"),
    [reminders]
  );

  useEffect(() => {
    if (promotionalReminders.length > 1) {
      const interval = setInterval(() => {
        setCurrentReminderIndex((prev) => (prev + 1) % promotionalReminders.length);
      }, 5000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [promotionalReminders.length]);

  useEffect(() => {
    if (currentReminderIndex >= promotionalReminders.length) {
      setCurrentReminderIndex(0);
    }
  }, [currentReminderIndex, promotionalReminders.length]);

  const activeReminder =
    promotionalReminders[currentReminderIndex] ??
    promotionalReminders[0] ?? {
      id: -1,
      category: "promotion" as const,
      title: "Latest promotions",
      description: "Watch this space for new EVzone ride and delivery offers.",
      actionRoute: "/rides/promotions"
    };
  const lastRide = useMemo(() => ride.activeTrip ?? ride.history[0] ?? null, [ride.activeTrip, ride.history]);
  const lastRideRoute = useMemo(() => {
    if (!lastRide) return "";
    const pickup = lastRide.pickup?.label ?? lastRide.pickup?.address ?? "";
    const dropoff = lastRide.dropoff?.label ?? lastRide.dropoff?.address ?? "";
    if (pickup && dropoff) {
      return `${pickup} \u2192 ${dropoff}`;
    }
    return (lastRide.routeSummary || "Last ride").replace(/\s+/g, " ").trim();
  }, [lastRide]);



  return (
    <ScreenScaffold>
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.md,
          overflow: "hidden",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent
          sx={{
            px: uiTokens.spacing.lg,
            py: uiTokens.spacing.lg,
            background: (t) =>
              t.palette.mode === "light"
                ? "linear-gradient(145deg, rgba(236,253,245,0.95) 0%, rgba(255,247,237,0.94) 100%)"
                : "linear-gradient(145deg, rgba(6,78,59,0.24) 0%, rgba(124,45,18,0.22) 100%)"
          }}
        >
          <Stack spacing={uiTokens.spacing.smPlus}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Chip
                icon={<NotificationsRoundedIcon sx={{ fontSize: 14 }} />}
                label="Live notice"
                size="small"
                sx={{
                  height: 22,
                  borderRadius: uiTokens.radius.xl,
                  fontSize: 10,
                  fontWeight: 700,
                  bgcolor: "rgba(17,184,106,0.14)",
                  color: "#047857"
                }}
              />
              <Chip
                label="Featured"
                size="small"
                sx={{
                  height: 22,
                  borderRadius: uiTokens.radius.xl,
                  fontSize: 10,
                  fontWeight: 700,
                  bgcolor: "rgba(249,115,22,0.16)",
                  color: "#C2410C"
                }}
              />
            </Stack>

            <Typography sx={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1, color: "#0F172A" }}>
              {activeReminder.title}
            </Typography>
            <Typography sx={{ fontSize: 13.5, color: "#475467" }}>
              {activeReminder.description}
            </Typography>

            <Stack direction="row" spacing={uiTokens.spacing.sm}>
              <Button
                variant="contained"
                onClick={() => navigate(activeReminder.actionRoute)}
                endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  bgcolor: uiTokens.colors.brand,
                  color: uiTokens.colors.white,
                  px: uiTokens.spacing.lg,
                  py: uiTokens.spacing.xs,
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "none",
                  borderRadius: uiTokens.radius.xl,
                  "&:hover": { bgcolor: uiTokens.colors.brandHover }
                }}
              >
                Check now
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/rides/promotions")}
                sx={{
                  borderColor: "rgba(249,115,22,0.5)",
                  color: "#C2410C",
                  px: uiTokens.spacing.lg,
                  py: uiTokens.spacing.xs,
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: uiTokens.radius.xl,
                  "&:hover": {
                    borderColor: "rgba(249,115,22,0.8)",
                    bgcolor: "rgba(249,115,22,0.08)"
                  }
                }}
              >
                Explore offers
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {lastRide && (
        <AppCard
          onClick={() => navigate("/rides/enter", { state: { rebook: true } })}
          variant="muted"
          sx={{
            border: "1px solid rgba(16,24,40,0.08)",
            bgcolor: (t) => (t.palette.mode === "light" ? "#F8FAFC" : "rgba(15,23,42,0.92)")
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={uiTokens.spacing.sm}>
            <Typography
              variant="caption"
              sx={{
                ...uiTokens.text.eyebrow,
                color: "#64748B",
                letterSpacing: "0.14em"
              }}
            >
              Your last ride
            </Typography>
            <Stack direction="row" spacing={uiTokens.spacing.xs}>
              <Button
                size="small"
                variant="contained"
                onClick={() => navigate("/rides/enter", { state: { rebook: true } })}
                sx={{
                  bgcolor: uiTokens.colors.brand,
                  color: uiTokens.colors.white,
                  px: uiTokens.spacing.mdPlus,
                  py: uiTokens.spacing.xxs,
                  minWidth: 78,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: uiTokens.radius.md,
                  boxShadow: "0 6px 16px rgba(16,185,129,0.28)",
                  "&:hover": { bgcolor: uiTokens.colors.brandHover }
                }}
              >
                Rebook
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate("/rides/history/past")}
                sx={{
                  borderColor: "rgba(249,115,22,0.45)",
                  color: "#C2410C",
                  px: uiTokens.spacing.mdPlus,
                  py: uiTokens.spacing.xxs,
                  minWidth: 74,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: uiTokens.radius.md,
                  "&:hover": {
                    borderColor: "rgba(249,115,22,0.8)",
                    bgcolor: "rgba(249,115,22,0.08)"
                  }
                }}
              >
                History
              </Button>
            </Stack>
          </Stack>

          <Box
            sx={{
              mt: uiTokens.spacing.xs,
              px: uiTokens.spacing.sm,
              py: uiTokens.spacing.sm,
              borderRadius: uiTokens.radius.md,
              bgcolor: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(148,163,184,0.28)"
            }}
          >
            <Stack direction="row" spacing={uiTokens.spacing.sm} alignItems="center" sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: "rgba(17,184,106,0.12)",
                  color: "#059669",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <PlaceRoundedIcon sx={{ fontSize: 16 }} />
              </Box>
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#0F172A",
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
                title={lastRideRoute}
              >
                {lastRideRoute}
              </Typography>
            </Stack>
          </Box>

          <Stack direction="row" spacing={uiTokens.spacing.lg} sx={{ mt: uiTokens.spacing.sm }}>
            <InlineStat label="Travel time" value={`${Math.max(lastRide.etaMinutes, 1)} min`} />
            <InlineStat label="Fare" value={lastRide.fareEstimate || "UGX 0"} />
          </Stack>
        </AppCard>
      )}

      <Box>
        <SectionHeader
          eyebrow="Services"
          title="EVzone services"
          subtitle="Choose the service you need"
        />
        <ActionGrid sx={{ mt: uiTokens.spacing.smPlus }}>
          {SERVICE_ACTIONS.map((service) => (
            <ServiceActionCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
              danger={service.danger}
              onClick={() => navigate(service.route)}
            />
          ))}
        </ActionGrid>
      </Box>

      <AppCard variant="muted">
        <SectionHeader eyebrow="Shortcuts" title="Quick actions" subtitle="One-tap actions for daily use" compact />
        <ActionGrid minWidth={160} sx={{ mt: uiTokens.spacing.smPlus }}>
          {QUICK_ACTIONS.map((action) => (
            <Chip
              key={action.label}
              icon={action.icon}
              label={action.label}
              size="small"
              onClick={() => navigate(action.route, { state: action.state })}
              sx={{
                height: 40,
                fontSize: 11.5,
                fontWeight: 600,
                bgcolor: action.tone === "green" ? "rgba(17,184,106,0.1)" : "rgba(249,115,22,0.1)",
                border: action.tone === "green" ? "1px solid rgba(17,184,106,0.42)" : "1px solid rgba(249,115,22,0.45)",
                color: action.tone === "green" ? uiTokens.colors.brand : "#C2410C",
                width: "100%",
                "& .MuiChip-label": {
                  width: "100%",
                  textAlign: "center"
                },
                "&:hover": {
                  bgcolor: action.tone === "green" ? "rgba(17,184,106,0.16)" : "rgba(249,115,22,0.16)"
                }
              }}
            />
          ))}
        </ActionGrid>
      </AppCard>
    </ScreenScaffold>
  );
}

export default function RiderScreen01HomeMultiServiceCanvas_v2(): React.JSX.Element {
  return <HomeMultiServiceScreen />;
}
