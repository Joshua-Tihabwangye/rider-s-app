import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";

import ScreenScaffold from "../components/ScreenScaffold";
import PageHeader from "../components/PageHeader";
import PageState from "../components/PageState";
import { useAppData } from "../contexts/AppDataContext";

interface ScheduleLocationState {
  schedule?: string;
  scheduleTime?: string;
  scheduledDate?: string;
  scheduledDateTime?: string | Date;
  isScheduled?: boolean;
  pickup?: string;
  destination?: string;
}

function formatScheduledAt(value: string | Date | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("en-UG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ScheduleSummary(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { ride } = useAppData();
  const routeState = (location.state as ScheduleLocationState | null) ?? {};

  const pickup = routeState.pickup ?? ride.request.origin?.address ?? ride.request.origin?.label ?? "";
  const destination = routeState.destination ?? ride.request.destination?.address ?? ride.request.destination?.label ?? "";
  const scheduledAt = useMemo(
    () =>
      formatScheduledAt(routeState.scheduledDateTime) ??
      formatScheduledAt(ride.request.scheduleTime) ??
      routeState.scheduledDate ??
      routeState.schedule ??
      null,
    [ride.request.scheduleTime, routeState.schedule, routeState.scheduledDate, routeState.scheduledDateTime]
  );
  const fare =
    ride.options.find((option) => option.id === ride.request.serviceLevel)?.fare ??
    ride.options.find((option) => option.fare)?.fare ??
    "Fare shown on payment";

  if (!pickup || !destination) {
    return (
      <ScreenScaffold header={<PageHeader title="Ride later summary" subtitle="Review details before confirmation" onBack={() => navigate(-1)} />}>
        <PageState
          kind="empty"
          title="No scheduled ride loaded"
          message="Set your pickup, destination, and schedule first."
          actionLabel="Schedule ride"
          onAction={() => navigate("/rides/schedule")}
        />
      </ScreenScaffold>
    );
  }

  return (
    <ScreenScaffold header={<PageHeader title="Ride later summary" subtitle="Review details before you confirm" onBack={() => navigate(-1)} />}>
      <Stack spacing={2} sx={{ px: 2.5, pb: 3 }}>
        <Card elevation={0} sx={{ borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
          <CardContent sx={{ px: 2, py: 1.75 }}>
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="caption" color="text.secondary">Pickup</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{pickup}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Destination</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{destination}</Typography>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip size="small" label={scheduledAt ?? "Schedule pending"} />
                <Chip size="small" label={`${ride.request.passengers || 1} passenger${ride.request.passengers === 1 ? "" : "s"}`} />
                <Chip size="small" label={ride.request.tripMode === "round_trip" ? "Round trip" : "One way"} />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
          <CardContent sx={{ px: 2, py: 1.75 }}>
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">Estimated fare</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>{fare}</Typography>
              <Typography variant="body2" color="text.secondary">
                This summary is populated from your current rider request state and will continue into checkout.
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
          <Button fullWidth variant="outlined" onClick={() => navigate(-1)} sx={{ textTransform: "none", borderRadius: 999 }}>
            Edit schedule
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() =>
              navigate("/rides/payment", {
                state: {
                  pickup,
                  destination,
                  schedule: scheduledAt,
                  fareEstimate: fare,
                },
              })
            }
            sx={{ textTransform: "none", borderRadius: 999 }}
          >
            Continue to payment
          </Button>
        </Stack>
      </Stack>
    </ScreenScaffold>
  );
}
