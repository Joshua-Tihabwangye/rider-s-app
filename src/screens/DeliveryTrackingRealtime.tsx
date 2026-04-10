import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import DeliveryTrackingMap from "../components/deliveries/DeliveryTrackingMap";
import { useAppData } from "../contexts/AppDataContext";
import { uiTokens } from "../design/tokens";
import {
  formatEtaLabel,
  getDeliveryStatusDescription,
  getDeliveryStatusLabel,
  getNextDeliveryStatus,
  getTimelineView
} from "../features/delivery/stateMachine";

function formatDateTime(value?: string): string {
  if (!value) {
    return "Pending";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("en-UG", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function modeFromPath(pathname: string): string {
  const mode = pathname.split("/").pop();
  return mode ?? "details";
}

export default function DeliveryTrackingRealtime(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId = "" } = useParams<{ orderId: string }>();
  const { delivery, actions } = useAppData();

  const mode = modeFromPath(location.pathname);
  const order = useMemo(
    () => delivery.orders.find((item) => item.id === orderId) ?? delivery.activeOrder,
    [delivery.orders, delivery.activeOrder, orderId]
  );

  const timeline = useMemo(() => (order ? getTimelineView(order.status) : []), [order]);
  const nextStatus = order ? getNextDeliveryStatus(order.status) : null;

  useEffect(() => {
    if (!orderId) {
      return;
    }
    actions.setActiveDeliveryById(orderId);
  }, [actions, orderId]);

  useEffect(() => {
    if (!order || !orderId) {
      return;
    }

    if (order.status === "delivered" && mode !== "delivered") {
      navigate(`/deliveries/tracking/${orderId}/delivered`, { replace: true });
    }
    if (order.status === "cancelled" && mode !== "cancel") {
      navigate(`/deliveries/tracking/${orderId}/cancel`, { replace: true });
    }
  }, [navigate, order, mode, orderId]);

  if (!order) {
    return (
      <ScreenScaffold>
        <SectionHeader
          title="Tracking"
          subtitle="Order not found"
          leadingAction={
            <IconButton size="small" aria-label="Back" onClick={() => navigate(-1)}>
              <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          }
        />
        <Typography variant="body2" sx={{ color: (t) => t.palette.text.secondary }}>
          We could not find this delivery order. Check the tracking code and try again.
        </Typography>
      </ScreenScaffold>
    );
  }

  const etaLabel = formatEtaLabel(order.tracking.etaMinutes);
  const statusLabel = getDeliveryStatusLabel(order.status);

  return (
    <ScreenScaffold>
      <SectionHeader
        title={`Tracking ${order.id}`}
        subtitle={getDeliveryStatusDescription(order.status)}
        leadingAction={
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: uiTokens.radius.xl,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
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
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              size="small"
              label={delivery.websocketConnected ? "Live" : "Polling"}
              sx={{
                height: 22,
                borderRadius: 5,
                fontSize: 10,
                bgcolor: delivery.websocketConnected ? "rgba(34,197,94,0.14)" : "rgba(59,130,246,0.14)",
                color: delivery.websocketConnected ? "#16A34A" : "#1D4ED8"
              }}
            />
          </Stack>
        }
      />

      <DeliveryTrackingMap
        pickupLabel={order.pickup.label}
        dropoffLabel={order.dropoff.label}
        courierPosition={order.tracking.courierPosition}
        etaLabel={etaLabel}
        statusLabel={statusLabel}
      />

      <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl }}>
        <CardContent>
          <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
            <Stack spacing={0.4}>
              <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                Route
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {order.pickup.label} to {order.dropoff.label}
              </Typography>
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
                label={`${order.tracking.distanceKm.toFixed(1)} km`}
                sx={{ borderRadius: 5, fontSize: 11, height: 22 }}
              />
            </Stack>
          </Stack>

          <Divider sx={{ my: uiTokens.spacing.smPlus }} />

          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
            Last sync: {formatDateTime(delivery.lastRealtimeSync ?? order.tracking.updatedAt)}
          </Typography>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: uiTokens.spacing.smPlus }}>
            Status timeline
          </Typography>
          <Stack spacing={1.1}>
            {timeline.map((step) => {
              const timestamp = order.timeline.find((entry) => entry.status === step.status)?.timestamp;
              return (
                <Stack key={step.status} direction="row" spacing={1.25} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      mt: 0.2,
                      bgcolor:
                        step.state === "done"
                          ? "rgba(34,197,94,0.16)"
                          : step.state === "current"
                            ? "rgba(59,130,246,0.14)"
                            : "rgba(148,163,184,0.2)",
                      color:
                        step.state === "done"
                          ? "#16A34A"
                          : step.state === "current"
                            ? "#1D4ED8"
                            : "#64748B",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {step.state === "done" ? <CheckCircleRoundedIcon sx={{ fontSize: 16 }} /> : <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "currentColor" }} />}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: step.state === "current" ? 700 : 500 }}>
                      {step.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                      {step.state === "upcoming" ? "Pending" : formatDateTime(timestamp)}
                    </Typography>
                  </Box>
                </Stack>
              );
            })}
          </Stack>
        </CardContent>
      </Card>

      {(mode === "driver" || mode === "live") && order.courier && (
        <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl }}>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
              <Stack direction="row" spacing={1.2} alignItems="center">
                <Avatar sx={{ bgcolor: uiTokens.colors.brand, color: "#0f172a", fontWeight: 700 }}>
                  {order.courier.name.slice(0, 2).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {order.courier.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                    {order.courier.vehicle} • {order.courier.plate} • {order.courier.rating.toFixed(1)}★
                  </Typography>
                </Box>
              </Stack>
              <Chip size="small" label="Courier" icon={<LocalShippingRoundedIcon sx={{ fontSize: 14 }} />} />
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mt: uiTokens.spacing.smPlus }}>
              <Button fullWidth size="small" variant="outlined" startIcon={<PhoneRoundedIcon sx={{ fontSize: 16 }} />} href={`tel:${order.courier.phone}`} sx={{ textTransform: "none" }}>
                Call
              </Button>
              <Button fullWidth size="small" variant="outlined" startIcon={<MessageRoundedIcon sx={{ fontSize: 16 }} />} sx={{ textTransform: "none" }}>
                Chat
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {(mode === "details" || mode === "received") && (
        <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: uiTokens.spacing.xs }}>
              Parcel and recipient details
            </Typography>
            <Stack spacing={0.6}>
              <Typography variant="body2">Parcel: {order.parcel.description}</Typography>
              <Typography variant="body2">Type: {order.parcel.type.replace("_", " ")} • Size: {order.parcel.size.replace("_", " ")}</Typography>
              <Typography variant="body2">Declared value: UGX {order.parcel.value.toLocaleString()}</Typography>
              <Typography variant="body2">Recipient: {order.recipient.name} • {order.recipient.phone}</Typography>
              <Typography variant="body2">Address: {order.recipient.address}</Typography>
              <Typography variant="body2">Payment estimate: {order.priceEstimate ?? `UGX ${order.costBreakdown.total.toLocaleString()}`}</Typography>
            </Stack>
          </CardContent>
        </Card>
      )}

      {mode === "delivered" && (
        <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl }}>
          <CardContent>
            <Stack spacing={0.8}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#16A34A" }}>
                Delivery completed
              </Typography>
              <Typography variant="body2">Delivered at {formatDateTime(order.deliveredAt ?? order.updatedAt)}</Typography>
              <Typography variant="body2">Total paid: UGX {order.costBreakdown.total.toLocaleString()}</Typography>
            </Stack>
          </CardContent>
        </Card>
      )}

      {mode === "cancel" && (
        <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl }}>
          <CardContent>
            <Stack spacing={0.8}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: uiTokens.colors.danger }}>
                Delivery cancelled
              </Typography>
              <Typography variant="body2">{order.cancelledReason ?? "This order was cancelled before completion."}</Typography>
            </Stack>
          </CardContent>
        </Card>
      )}

      {nextStatus && order.status !== "cancelled" && order.status !== "failed" && (
        <Button
          variant="contained"
          onClick={() => actions.updateDeliveryOrderStatus(order.id, nextStatus, "Stage advanced manually")}
          sx={{ textTransform: "none", fontWeight: 700 }}
        >
          Mark as {getDeliveryStatusLabel(nextStatus)}
        </Button>
      )}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <Button variant="outlined" onClick={() => navigate(`/deliveries/tracking/${order.id}/driver`)} startIcon={<PersonRoundedIcon sx={{ fontSize: 16 }} />} sx={{ textTransform: "none" }}>
          Courier
        </Button>
        <Button variant="outlined" onClick={() => navigate(`/deliveries/tracking/${order.id}/timeline`)} sx={{ textTransform: "none" }}>
          Timeline
        </Button>
        <Button variant="outlined" onClick={() => navigate(`/deliveries/tracking/${order.id}/live`)} sx={{ textTransform: "none" }}>
          Live map
        </Button>
      </Stack>
    </ScreenScaffold>
  );
}
