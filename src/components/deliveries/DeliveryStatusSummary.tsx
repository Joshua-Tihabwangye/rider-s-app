import React from "react";
import {
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography
} from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import { uiTokens } from "../../design/tokens";

interface DeliveryStatusSummaryProps {
  pickupLabel: string;
  dropoffLabel: string;
  etaLabel: string;
  distanceKm: number;
  lastSyncLabel: string;
  totalStops?: number;
  completedStops?: number;
}

export default function DeliveryStatusSummary({
  pickupLabel,
  dropoffLabel,
  etaLabel,
  distanceKm,
  lastSyncLabel,
  totalStops = 1,
  completedStops = 0
}: DeliveryStatusSummaryProps): React.JSX.Element {
  return (
    <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl }}>
      <CardContent>
        <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack spacing={0.4}>
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Route
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {pickupLabel} to {dropoffLabel}
            </Typography>
            {totalStops > 1 && (
              <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                {completedStops} of {totalStops} stops completed
              </Typography>
            )}
          </Stack>
          <Stack spacing={0.6} alignItems="flex-end">
            <Chip
              size="small"
              icon={<AccessTimeRoundedIcon sx={{ fontSize: 14 }} />}
              label={`ETA ${etaLabel}`}
              sx={{ borderRadius: 5, fontSize: 11, height: 24 }}
            />
            <Chip
              size="small"
              icon={<RouteRoundedIcon sx={{ fontSize: 14 }} />}
              label={`${distanceKm.toFixed(1)} km`}
              sx={{ borderRadius: 5, fontSize: 11, height: 22 }}
            />
          </Stack>
        </Stack>

        <Divider sx={{ my: uiTokens.spacing.smPlus }} />
        <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
          Last sync: {lastSyncLabel}
        </Typography>
      </CardContent>
    </Card>
  );
}
