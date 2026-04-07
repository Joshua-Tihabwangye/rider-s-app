import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Tabs,
  Tab,
  Button
} from "@mui/material";

import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import { uiTokens } from "../design/tokens";

const UPCOMING_RIDES = [
  {
    id: "UP-2025-10-07-1",
    date: "Tue, 07 Oct 2025",
    time: "07:30 AM",
    from: "Nsambya Road 472, Kampala",
    to: "Bugolobi Village, Kampala",
    type: "Ride later",
    status: "Confirmed"
  },
  {
    id: "UP-2025-10-09-1",
    date: "Thu, 09 Oct 2025",
    time: "05:45 PM",
    from: "Acacia Mall, Kololo",
    to: "Naalya Estates, Kampala",
    type: "Round trip",
    status: "Awaiting driver"
  }
];

interface Ride {
  id: string;
  date: string;
  time: string;
  origin?: string;
  destination?: string;
  from?: string;
  to?: string;
  type?: string;
  status: string;
}

interface UpcomingRideCardProps {
  ride: Ride;
}

function UpcomingRideCard({ ride }: UpcomingRideCardProps): React.JSX.Element {
  const confirmed = ride.status === "Confirmed";
  const statusColor = confirmed ? "#16A34A" : "#CA8A04";
  const statusBg = confirmed
    ? "rgba(34,197,94,0.12)"
    : "rgba(234,179,8,0.12)";
  return (
    <Card
      elevation={0}
      sx={{
        mb: uiTokens.spacing.mdPlus,
        borderRadius: uiTokens.radius.xl,
        bgcolor: (theme) =>
          theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: (theme) =>
          theme.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)"
      }}
    >
      <CardContent sx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.md }}>
        <Box
          sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: uiTokens.spacing.sm }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {ride.date}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {ride.time}
            </Typography>
          </Box>
          <Chip
            label={ride.status}
            size="small"
            sx={{
              borderRadius: uiTokens.radius.xl,
              fontSize: 11,
              height: 24,
              bgcolor: statusBg,
              color: statusColor
            }}
          />
        </Box>

        <Box sx={{ mb: uiTokens.spacing.sm }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.sm }}>
            <PlaceRoundedIcon sx={{ fontSize: 16, color: "#22c55e" }} />
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {ride.from}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.sm, mt: uiTokens.spacing.xs / 2 }}>
            <PlaceRoundedIcon sx={{ fontSize: 16, color: "#03CD8C" }} />
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {ride.to}
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Chip
            size="small"
            icon={<DirectionsCarFilledRoundedIcon sx={{ fontSize: 14 }} />}
            label={ride.type}
            sx={{
              borderRadius: uiTokens.radius.xl,
              fontSize: 10,
              height: 22,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
              color: (t) => t.palette.text.primary
            }}
          />
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              sx={{
                borderRadius: uiTokens.radius.xl,
                fontSize: 11,
                textTransform: "none",
                px: uiTokens.spacing.mdPlus,
                py: uiTokens.spacing.xxs / 2
              }}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="text"
              sx={{
                borderRadius: uiTokens.radius.xl,
                fontSize: 11,
                textTransform: "none",
                color: "#EF4444"
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function RideHistoryUpcomingScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [tab, setTab] = useState("upcoming");

  const handleTabChange = (_e: React.SyntheticEvent, value: string): void => setTab(value);

  return (
    <ScreenScaffold>
      <SectionHeader
        title="Ride history"
        subtitle="Manage your upcoming EV rides"
        leadingAction={
          <IconButton
            size="small"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: uiTokens.radius.xl,
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
              border: (theme) =>
                theme.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        }
      />

      <Box sx={{ mt: uiTokens.spacing.sm }}>
        {/* Tabs – Upcoming focused */}
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            minHeight: 36,
            mb: uiTokens.spacing.lg,
            "& .MuiTab-root": {
              minHeight: 36,
              fontSize: 12,
              textTransform: "none",
              color: "rgba(148,163,184,1)"
            },
            "& .Mui-selected": {
              color: "#111827"
            },
            "& .MuiTabs-indicator": {
              height: 2,
              borderRadius: uiTokens.radius.xl,
              bgcolor: "primary.main"
            }
          }}
        >
          <Tab value="past" label="Past trips" />
          <Tab value="upcoming" label="Upcoming" />
        </Tabs>

        {tab === "upcoming" && (
          <Box>
            {UPCOMING_RIDES.length === 0 ? (
              <Typography
                variant="caption"
                sx={{ mt: uiTokens.spacing.xl, display: "block", textAlign: "center", color: (t) => t.palette.text.secondary }}
              >
                You have no upcoming rides. Scheduled EV rides will appear here.
              </Typography>
            ) : (
              UPCOMING_RIDES.map((ride) => (
                <UpcomingRideCard key={ride.id} ride={ride} />
              ))
            )}
          </Box>
        )}

        {tab === "past" && (
          <Typography
            variant="caption"
            sx={{ mt: uiTokens.spacing.xl, display: "block", textAlign: "center", color: (t) => t.palette.text.secondary }}
          >
            Switch to Past trips to view your completed EV rides.
          </Typography>
        )}
      </Box>
    </ScreenScaffold>
  );
}

export default function RiderScreen34RideHistoryUpcomingCanvas_v2() {
      return (
    
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (theme) => theme.palette.background.default
        }}
      >

          <RideHistoryUpcomingScreen />
        
      </Box>
    
  );
}
