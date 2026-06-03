import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";

import ScreenScaffold from "../components/ScreenScaffold";
import PageHeader from "../components/PageHeader";
import PageState from "../components/PageState";
import { useAppData } from "../contexts/AppDataContext";

type CommuteRoute = {
  id: string;
  originAddress: string;
  destinationAddress: string;
  originCoords?: { lat: number; lng: number };
  destinationCoords?: { lat: number; lng: number };
  fare: string;
  distance: string;
  count: number;
  latestAt: string;
};

function formatSchedule(index: number, count: number): string {
  if (count > 2 && index === 0) return "Frequent route";
  if (index === 0) return "Weekdays · Morning";
  if (index === 1) return "Weekdays · Evening";
  return "Saved commute";
}

export default function Commutes(): React.JSX.Element {
  const navigate = useNavigate();
  const { ride } = useAppData();

  const commutes = useMemo<CommuteRoute[]>(() => {
    const trips = [ride.activeTrip, ...ride.history].filter(
      (trip): trip is NonNullable<typeof trip> =>
        Boolean(trip?.pickup?.address && trip?.dropoff?.address)
    );

    const grouped = new Map<string, CommuteRoute>();
    for (const trip of trips) {
      const originAddress = trip.pickup.address;
      const destinationAddress = trip.dropoff.address;
      const key = `${originAddress.trim().toLowerCase()}->${destinationAddress.trim().toLowerCase()}`;
      const latestAt = trip.completedAt ?? trip.startedAt ?? new Date().toISOString();
      const existing = grouped.get(key);
      if (existing) {
        existing.count += 1;
        if (latestAt > existing.latestAt) {
          existing.latestAt = latestAt;
          existing.fare = trip.fareEstimate || existing.fare;
          existing.distance = trip.distance || existing.distance;
          existing.originCoords = trip.pickup.coordinates ?? existing.originCoords;
          existing.destinationCoords = trip.dropoff.coordinates ?? existing.destinationCoords;
        }
        continue;
      }

      grouped.set(key, {
        id: key.replace(/[^a-z0-9]+/g, "-"),
        originAddress,
        destinationAddress,
        originCoords: trip.pickup.coordinates,
        destinationCoords: trip.dropoff.coordinates,
        fare: trip.fareEstimate || "Fare shown on options",
        distance: trip.distance || "Distance recalculated at booking",
        count: 1,
        latestAt,
      });
    }

    return Array.from(grouped.values())
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return b.latestAt.localeCompare(a.latestAt);
      })
      .slice(0, 4);
  }, [ride.activeTrip, ride.history]);

  const handleRequest = (commute: CommuteRoute): void => {
    navigate("/rides/enter/details", {
      state: {
        pickup: commute.originAddress,
        pickupCoords: commute.originCoords,
        destination: commute.destinationAddress,
        destinationCoords: commute.destinationCoords,
        fare: commute.fare,
        distance: commute.distance,
        commuteId: commute.id,
      },
    });
  };

  return (
    <ScreenScaffold header={<PageHeader title="Daily Commutes" subtitle="Derived from your rider trip history" onBack={() => navigate(-1)} />}>
      <Stack spacing={2} sx={{ px: 2.5, pb: 3 }}>
        {commutes.length === 0 ? (
          <PageState
            kind="empty"
            title="No commute routes yet"
            message="Complete a few trips and your frequent rider routes will show here."
            actionLabel="Book a ride"
            onAction={() => navigate("/rides/enter/details")}
          />
        ) : (
          commutes.map((commute, index) => (
            <Card key={commute.id} elevation={0} sx={{ borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
              <CardContent sx={{ px: 2, py: 1.75 }}>
                <Stack spacing={1.25}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {commute.originAddress}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        to {commute.destinationAddress}
                      </Typography>
                    </Box>
                    <Chip size="small" label={formatSchedule(index, commute.count)} sx={{ borderRadius: 4 }} />
                  </Stack>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip size="small" label={`${commute.count} trip${commute.count === 1 ? "" : "s"}`} />
                    <Chip size="small" label={commute.distance} />
                    <Chip size="small" label={commute.fare} />
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5}>
                    <Typography variant="caption" color="text.secondary">
                      Synced from your latest rider trip activity
                    </Typography>
                    <Button variant="contained" onClick={() => handleRequest(commute)} sx={{ textTransform: "none", borderRadius: 999 }}>
                      Rebook
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </ScreenScaffold>
  );
}
