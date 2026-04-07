import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Chip,
  Card,
  CardContent,
  Button,
  Stack
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";

import { uiTokens } from "../design/tokens";

interface UpcomingRideCardProps {
  dateLabel: string;
  timeLabel: string;
  from: string;
  to: string;
  status: string;
  statusColor: { bg: string; fg: string };
  vehicle: string;
}

function UpcomingRideCard({ dateLabel, timeLabel, from, to, status, statusColor, vehicle }: UpcomingRideCardProps): React.JSX.Element {
  return (
    <Card
      elevation={0}
      sx={{
        mb: uiTokens.spacing.mdPlus,
        borderRadius: uiTokens.radius.sm,
        bgcolor: (theme) =>
          theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: (theme) =>
          theme.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)"
      }}
    >
      <CardContent sx={{ px: uiTokens.spacing.mdPlus, py: uiTokens.spacing.mdPlus }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.5
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTimeRoundedIcon
              sx={{ fontSize: 18, color: "rgba(148,163,184,1)" }}
            />
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
              >
                {dateLabel}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                {timeLabel}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={status}
            size="small"
            sx={{
              fontSize: 11,
              height: 24,
              borderRadius: uiTokens.radius.xl,
              bgcolor: statusColor.bg,
              color: statusColor.fg
            }}
          />
        </Box>

        <Box sx={{ mb: uiTokens.spacing.smPlus }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: uiTokens.spacing.smPlus }}>
            <PlaceRoundedIcon
              sx={{ fontSize: 18, color: "#22c55e", mt: 0.1 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: (theme) => theme.palette.text.secondary
                }}
              >
                From
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: (theme) => theme.palette.text.primary }}
              >
                {from}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ height: 1, my: 1, bgcolor: "rgba(148,163,184,0.3)" }} />

          <Box sx={{ display: "flex", alignItems: "flex-start", gap: uiTokens.spacing.smPlus }}>
            <PlaceRoundedIcon
              sx={{ fontSize: 18, color: "#03CD8C", mt: 0.1 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: (theme) => theme.palette.text.secondary
                }}
              >
                To
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: (theme) => theme.palette.text.primary }}
              >
                {to}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 0.5
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DirectionsCarFilledRoundedIcon
              sx={{ fontSize: 18, color: "#22c55e" }}
            />
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              {vehicle}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              sx={{
                borderRadius: uiTokens.radius.xl,
                px: 1.8,
                py: 0.2,
                fontSize: 11,
                textTransform: "none"
              }}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="text"
              sx={{
                borderRadius: uiTokens.radius.xl,
                px: 1.6,
                py: 0.2,
                fontSize: 11,
                textTransform: "none",
                color: "#EF4444"
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

function UpcomingRidesScreen(): React.JSX.Element {
  const navigate = useNavigate();
  return (
    <Box sx={{ px: uiTokens.spacing.xl, pt: uiTokens.spacing.xl, pb: uiTokens.spacing.xxl }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.md }}>
          <IconButton
            size="small"
            aria-label="Back"
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
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Upcoming rides
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              View, reschedule or cancel your Ride Later trips
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Filters */}
      <Stack direction="row" spacing={1} sx={{ mb: 2.5 }}>
        <Chip
          label="All"
          size="small"
          sx={{
            height: 26,
            borderRadius: uiTokens.radius.xl,
            bgcolor: "primary.main",
            color: "#020617",
            fontSize: 11
          }}
        />
        <Chip
          label="Today"
          size="small"
          sx={{
            height: 26,
            borderRadius: uiTokens.radius.xl,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (theme) =>
              theme.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            fontSize: 11
          }}
        />
        <Chip
          label="This week"
          size="small"
          sx={{
            height: 26,
            borderRadius: uiTokens.radius.xl,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (theme) =>
              theme.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            fontSize: 11
          }}
        />
      </Stack>

      {/* Upcoming list */}
      <UpcomingRideCard
        dateLabel="Tomorrow • 07 Oct"
        timeLabel="07:30 AM"
        from="New School, JJ Street, Kampala"
        to="Bugolobi Village, Kampala"
        vehicle="Eco EV • Up to 4 passengers"
        status="Confirmed"
        statusColor={{ bg: "rgba(22,163,74,0.12)", fg: "#16A34A" }}
      />
      <UpcomingRideCard
        dateLabel="Thu • 09 Oct"
        timeLabel="05:45 PM"
        from="Acacia Mall, Kololo"
        to="Naalya Estates, Kampala"
        vehicle="EV SUV • Up to 6 passengers"
        status="Waiting driver"
        statusColor={{ bg: "rgba(234,179,8,0.14)", fg: "#CA8A04" }}
      />
      <UpcomingRideCard
        dateLabel="Fri • 10 Oct"
        timeLabel="09:00 AM"
        from="Entebbe Airport"
        to="Nsambya Road, Kampala"
        vehicle="Premium EV • Airport pickup"
        status="Draft"
        statusColor={{ bg: "rgba(148,163,184,0.18)", fg: "#64748B" }}
      />

      <Typography
        variant="caption"
        sx={{
          mt: 1,
          display: "block",
          fontSize: 11,
          color: (theme) => theme.palette.text.secondary
        }}
      >
        You can edit or cancel a Ride Later trip before a driver is assigned.
      </Typography>
    </Box>
  );
}

export default function RiderScreen4UpcomingRidesCanvas_v2() {
      return (
    
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (theme) => theme.palette.background.default
        }}
      >

          <UpcomingRidesScreen />
        
      </Box>
    
  );
}
