import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Chip,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import DeliveryCard from "../components/deliveries/DeliveryCard";
import AppCard from "../components/primitives/AppCard";
import ListSection from "../components/primitives/ListSection";
import DeliveryTrackingMap from "../components/deliveries/DeliveryTrackingMap";
import DeliveryBottomSheet from "../components/deliveries/DeliveryBottomSheet";
import { useAppData } from "../contexts/AppDataContext";
import { uiTokens } from "../design/tokens";

const TERMINAL = ["delivered", "cancelled", "failed"] as const;

export default function DeliveryReceivedUnified(): React.JSX.Element {
  const navigate = useNavigate();
  const { delivery } = useAppData();

  const receivedOrders = useMemo(
    () => delivery.orders.filter((order) => TERMINAL.includes(order.status as (typeof TERMINAL)[number])),
    [delivery.orders]
  );
  const activeIncoming = useMemo(
    () => delivery.orders.find((order) => !TERMINAL.includes(order.status as (typeof TERMINAL)[number])) ?? null,
    [delivery.orders]
  );

  return (
    <ScreenScaffold>
      <SectionHeader
        title="Received deliveries"
        subtitle="Unified history and incoming parcel view"
        leadingAction={
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: uiTokens.radius.xl,
              bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)"),
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        }
        action={
          <Badge badgeContent={receivedOrders.length} color="error">
            <Chip size="small" label="History" />
          </Badge>
        }
      />

      {activeIncoming ? (
        <AppCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Latest incoming parcel
          </Typography>
          <DeliveryTrackingMap
            pickupLabel={activeIncoming.pickup.label}
            dropoffLabel={activeIncoming.dropoff.label}
            courierPosition={activeIncoming.tracking.courierPosition}
            etaLabel={`${activeIncoming.tracking.etaMinutes} min`}
            statusLabel={activeIncoming.status.replace(/_/g, " ")}
            height={180}
            rounded
            fullBleed={false}
          />
        </AppCard>
      ) : (
        <AppCard variant="muted">
          <Stack direction="row" spacing={1} alignItems="center">
            <Inventory2RoundedIcon sx={{ color: uiTokens.colors.brand }} />
            <Typography variant="body2" sx={{ color: (t) => t.palette.text.secondary }}>
              No incoming parcels right now.
            </Typography>
          </Stack>
        </AppCard>
      )}

      <ListSection>
        {receivedOrders.length === 0 ? (
          <AppCard variant="muted">
            <Typography variant="body2" sx={{ color: (t) => t.palette.text.secondary }}>
              Completed and cancelled deliveries will appear here.
            </Typography>
          </AppCard>
        ) : (
          receivedOrders.map((order) => (
            <DeliveryCard
              key={order.id}
              order={order}
              variant="received"
              onClick={(id) => navigate(`/deliveries/tracking/${id}/details`)}
              showTruckIcon
            />
          ))
        )}
      </ListSection>

      <DeliveryBottomSheet>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <Chip label="Unified UI variant" color="primary" />
          <Chip label="Reusable map + bottom sheet" />
        </Stack>
      </DeliveryBottomSheet>
    </ScreenScaffold>
  );
}
