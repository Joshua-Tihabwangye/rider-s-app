import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import TourRoundedIcon from "@mui/icons-material/TourRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Button from "@mui/material/Button";
import ScreenScaffold from "../components/ScreenScaffold";
import ActionGrid from "../components/primitives/ActionGrid";
import AppCard from "../components/primitives/AppCard";
import PrimarySection from "../components/primitives/PrimarySection";
import SectionHeader from "../components/primitives/SectionHeader";
import ServiceActionCard from "../components/primitives/ServiceActionCard";
import InlineStat from "../components/primitives/InlineStat";
import { uiTokens } from "../design/tokens";

interface Reminder {
  id: number;
  title: string;
  description: string;
  actionRoute: string;
}

interface ServiceAction {
  title: string;
  description: string;
  route: string;
  icon: React.ReactNode;
  danger?: boolean;
}

const REMINDERS: Reminder[] = [
  {
    id: 1,
    title: "Student Bus Fees",
    description: "John Doe - Expires in 5 days. Grace period: 2 days remaining.",
    actionRoute: "/school-handoff/fees"
  },
  {
    id: 2,
    title: "Ride Promotion",
    description: "Get 20% off your next ride. Valid until end of month.",
    actionRoute: "/rides/promotions"
  },
  {
    id: 3,
    title: "Payment Alert",
    description: "Your wallet balance is low. Add funds to continue booking.",
    actionRoute: "/wallet"
  }
];

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
  { label: "Rebook last ride", icon: <ElectricCarRoundedIcon sx={{ fontSize: 16 }} />, route: "/rides/enter" },
  { label: "Track a parcel", icon: <LocalShippingRoundedIcon sx={{ fontSize: 16 }} />, route: "/deliveries" }
];

function HomeMultiServiceScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentReminderIndex, setCurrentReminderIndex] = useState(0);

  useEffect(() => {
    if (REMINDERS.length > 1) {
      const interval = setInterval(() => {
        setCurrentReminderIndex((prev) => (prev + 1) % REMINDERS.length);
      }, 5000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, []);

  const activeReminder: Reminder = REMINDERS[currentReminderIndex] ?? REMINDERS[0]!;

  const handleSearchSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>
  ): void => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate("/rides/enter", { state: { searchQuery: searchQuery.trim() } });
    }
  };

  return (
    <ScreenScaffold>
      <Box component="form" onSubmit={handleSearchSubmit}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <TextField
            fullWidth
            size="small"
            placeholder="Search rides, shops, contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                handleSearchSubmit(e);
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ fontSize: 20, color: (t) => t.palette.text.secondary }} />
                </InputAdornment>
              )
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: uiTokens.surfaces.card,
                "& fieldset": { border: uiTokens.borders.subtle }
              }
            }}
          />
        </Stack>
      </Box>

      <PrimarySection>
        <SectionHeader
          centered
          eyebrow="Reminder"
          title={activeReminder.title}
          subtitle={activeReminder.description}
          action={
            REMINDERS.length > 1 ? (
              <Stack direction="row" spacing={0.4} sx={{ mt: 1 }}>
                <IconButton
                  size="small"
                  onClick={() =>
                    setCurrentReminderIndex((prev) => (prev - 1 + REMINDERS.length) % REMINDERS.length)
                  }
                  sx={{ bgcolor: uiTokens.surfaces.card, border: uiTokens.borders.brand, width: 28, height: 28 }}
                >
                  <ChevronLeftRoundedIcon sx={{ fontSize: 16, color: uiTokens.colors.brand }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => setCurrentReminderIndex((prev) => (prev + 1) % REMINDERS.length)}
                  sx={{ bgcolor: uiTokens.surfaces.card, border: uiTokens.borders.brand, width: 28, height: 28 }}
                >
                  <ChevronRightRoundedIcon sx={{ fontSize: 16, color: uiTokens.colors.brand }} />
                </IconButton>
              </Stack>
            ) : null
          }
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

      <AppCard>
        <SectionHeader
          eyebrow="Your last ride"
          title="Home → Office"
          action={
            <Button
              size="small"
              variant="contained"
              onClick={() => navigate("/rides/enter")}
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
          <InlineStat label="Travel time" value="12 min" />
          <InlineStat label="Fare" value="UGX 5,000" />
        </Stack>
      </AppCard>

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
        <Stack direction="row" spacing={uiTokens.spacing.sm} sx={{ flexWrap: "wrap", mt: uiTokens.spacing.xxs }}>
          {QUICK_ACTIONS.map((action) => (
            <Chip
              key={action.label}
              icon={action.icon}
              label={action.label}
              size="small"
              onClick={() => navigate(action.route)}
              sx={{
                height: 34,
                fontSize: 11.5,
                fontWeight: 600,
                bgcolor: uiTokens.surfaces.card,
                border: uiTokens.borders.brand,
                color: uiTokens.colors.brand,
                "&:hover": {
                  bgcolor: uiTokens.surfaces.brandTintSoft
                }
              }}
            />
          ))}
        </Stack>
      </AppCard>
    </ScreenScaffold>
  );
}

export default function RiderScreen01HomeMultiServiceCanvas_v2(): React.JSX.Element {
  return <HomeMultiServiceScreen />;
}
