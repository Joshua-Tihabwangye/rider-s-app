import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
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
import Button from "@mui/material/Button";
import ScreenScaffold from "../components/ScreenScaffold";
import ActionGrid from "../components/primitives/ActionGrid";
import AppCard from "../components/primitives/AppCard";
import PrimarySection from "../components/primitives/PrimarySection";
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
    description: "Manage your school shuttle rides",
    route: "/school-handoff",
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

const QUICK_ACTIONS = [
  { label: "Book usual route", icon: <RouteRoundedIcon sx={{ fontSize: 16 }} />, route: "/rides/enter" },
  { label: "Go to work", icon: <WorkRoundedIcon sx={{ fontSize: 16 }} />, route: "/rides/enter" },
  { label: "Rebook last ride", icon: <ElectricCarRoundedIcon sx={{ fontSize: 16 }} />, route: "/rides/enter", state: { rebook: true } },
  { label: "Track a parcel", icon: <LocalShippingRoundedIcon sx={{ fontSize: 16 }} />, route: "/deliveries" }
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
    return lastRide.routeSummary || "Last ride";
  }, [lastRide]);



  return (
    <ScreenScaffold>

      <PrimarySection>
        <SectionHeader
          centered
          eyebrow="Reminder"
          title={activeReminder.title}
          subtitle={activeReminder.description}
        />

        <Stack direction="column" alignItems="center" spacing={1.5}>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <NotificationsRoundedIcon sx={{ fontSize: 17, color: uiTokens.colors.brand }} />
            <Typography variant="caption" sx={{ ...uiTokens.text.eyebrow, color: uiTokens.colors.brand }}>
              Live notice
            </Typography>
          </Stack>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate(activeReminder.actionRoute)}
            sx={{
              bgcolor: uiTokens.colors.brand,
              color: uiTokens.colors.white,
              px: uiTokens.spacing.lgPlus,
              py: uiTokens.spacing.xs,
              fontSize: 11,
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { bgcolor: uiTokens.colors.brandHover }
            }}
          >
            Check now
          </Button>
        </Stack>
      </PrimarySection>

      {lastRide && (
        <AppCard onClick={() => navigate("/rides/enter", { state: { rebook: true } })}>
          <SectionHeader
            eyebrow="Your last ride"
            title={lastRideRoute}
            action={
              <Button
                size="small"
                variant="contained"
                onClick={() => navigate("/rides/enter", { state: { rebook: true } })}
                sx={{
                  bgcolor: uiTokens.colors.brand,
                  color: uiTokens.colors.white,
                  px: uiTokens.spacing.mdPlus,
                  py: uiTokens.spacing.xxs,
                  fontSize: 11,
                  textTransform: "none",
                  "&:hover": { bgcolor: uiTokens.colors.brandHover }
                }}
              >
                Rebook
              </Button>
            }
          />
          <Stack direction="row" spacing={uiTokens.spacing.lg} sx={{ mt: uiTokens.spacing.smPlus }}>
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
        <SectionHeader eyebrow="Shortcuts" title="Quick actions" compact />
        <ActionGrid minWidth={160} sx={{ mt: uiTokens.spacing.smPlus }}>
          {QUICK_ACTIONS.map((action) => (
            <Chip
              key={action.label}
              icon={action.icon}
              label={action.label}
              size="small"
              onClick={() => navigate(action.route, { state: (action as any).state })}
              sx={{
                height: 40,
                fontSize: 11.5,
                fontWeight: 600,
                bgcolor: uiTokens.surfaces.card,
                border: uiTokens.borders.brand,
                color: uiTokens.colors.brand,
                width: "100%",
                "& .MuiChip-label": {
                  width: "100%",
                  textAlign: "center"
                },
                "&:hover": {
                  bgcolor: uiTokens.surfaces.brandTintSoft
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
