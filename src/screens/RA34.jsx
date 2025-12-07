import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
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

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import MobileShell from "../components/MobileShell";

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

function UpcomingRideCard({ ride }) {
  const confirmed = ride.status === "Confirmed";
  const statusColor = confirmed ? "#16A34A" : "#CA8A04";
  const statusBg = confirmed
    ? "rgba(34,197,94,0.12)"
    : "rgba(234,179,8,0.12)";
  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.75,
        borderRadius: 2,
        bgcolor: (theme) =>
          theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: (theme) =>
          theme.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)"
      }}
    >
      <CardContent sx={{ px: 1.75, py: 1.6 }}>
        <Box
          sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}
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
              borderRadius: 999,
              fontSize: 11,
              height: 24,
              bgcolor: statusBg,
              color: statusColor
            }}
          />
        </Box>

        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PlaceRoundedIcon sx={{ fontSize: 16, color: "#22c55e" }} />
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {ride.from}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.3 }}>
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
              borderRadius: 999,
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
                borderRadius: 999,
                fontSize: 11,
                textTransform: "none",
                px: 1.8,
                py: 0.3
              }}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="text"
              sx={{
                borderRadius: 999,
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

function RideHistoryUpcomingScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("upcoming");

  const handleTabChange = (e, value) => setTab(value);

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 1.5,
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
              borderRadius: 999,
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
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Ride history
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Manage your upcoming EV rides
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tabs – Upcoming focused */}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          minHeight: 36,
          mb: 2,
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
            borderRadius: 999,
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
              sx={{ mt: 4, display: "block", textAlign: "center", color: (t) => t.palette.text.secondary }}
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
          sx={{ mt: 4, display: "block", textAlign: "center", color: (t) => t.palette.text.secondary }}
        >
          Switch to Past trips to view your completed EV rides.
        </Typography>
      )}
    </Box>
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
        

        <DarkModeToggle />

        

        <MobileShell>
          <RideHistoryUpcomingScreen />
        </MobileShell>
      </Box>
    
  );
}
