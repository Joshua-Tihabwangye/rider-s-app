import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import ScreenScaffold from "../components/ScreenScaffold";
import DeliveryCard from "../components/deliveries/DeliveryCard";
import AppCard from "../components/primitives/AppCard";
import InlineStat from "../components/primitives/InlineStat";
import ListSection from "../components/primitives/ListSection";
import PrimarySection from "../components/primitives/PrimarySection";
import SectionHeader from "../components/primitives/SectionHeader";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";
import type { DeliveryOrder } from "../store/types";
import { getDeliveryStatusLabel } from "../features/delivery/stateMachine";
import { calculateDeliveryKpis } from "../features/delivery/analytics";

const DELIVERY_TERMINAL_STATUSES = ["delivered", "cancelled", "failed"] as const;

function formatDateLabel(value: string): string {
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

function statusTone(status: DeliveryOrder["status"]): { bg: string; fg: string } {
  if (status === "delivered") {
    return { bg: "rgba(34,197,94,0.14)", fg: "#15803D" };
  }
  if (status === "cancelled" || status === "failed") {
    return { bg: "rgba(248,113,113,0.16)", fg: "#B91C1C" };
  }
  return { bg: "rgba(148,163,184,0.18)", fg: "#475569" };
}

function DeliveryDashboardHomeScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { delivery } = useAppData();
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [menuAnchor, setMenuAnchor] = useState<{
    open: boolean;
    anchorEl: HTMLElement | null;
    orderId: string | null;
  }>({
    open: false,
    anchorEl: null,
    orderId: null
  });
  const [shareSnackbar, setShareSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const unreadNotifications = delivery.notifications.filter((item) => !item.read).length;
  const sendingOrders = delivery.orders.filter((order) => order.participantRole === "sender");
  const receivingOrders = delivery.orders.filter((order) => order.participantRole === "receiver");

  const deliveringOrders: DeliveryOrder[] = sendingOrders.filter(
    (order) => !DELIVERY_TERMINAL_STATUSES.includes(order.status as (typeof DELIVERY_TERMINAL_STATUSES)[number])
  );
  const incomingOrders: DeliveryOrder[] = receivingOrders.filter(
    (order) =>
      !DELIVERY_TERMINAL_STATUSES.includes(order.status as (typeof DELIVERY_TERMINAL_STATUSES)[number]) ||
      Boolean(order.needsPayment)
  );

  const pendingDeliveriesCount = deliveringOrders.filter((order) => order.status === "requested").length;
  const incomingPendingCount = incomingOrders.filter((order) => order.status === "requested" || order.needsPayment).length;
  const completedDeliveriesCount = delivery.orders.filter((order) =>
    DELIVERY_TERMINAL_STATUSES.includes(order.status as (typeof DELIVERY_TERMINAL_STATUSES)[number])
  ).length;

  const kpis = useMemo(() => calculateDeliveryKpis(delivery.orders), [delivery.orders]);

  const historyRows = useMemo(
    () =>
      [...delivery.orders]
        .filter((order) => DELIVERY_TERMINAL_STATUSES.includes(order.status as (typeof DELIVERY_TERMINAL_STATUSES)[number]))
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 3),
    [delivery.orders]
  );

  useEffect(() => {
    setIsLoading(true);
    const timer = window.setTimeout(() => setIsLoading(false), 220);
    return () => window.clearTimeout(timer);
  }, [delivery.orders.length]);

  const handleTrackShipment = (): void => {
    if (trackingNumber.trim()) {
      navigate(`/deliveries/tracking/${trackingNumber.trim()}`, {
        state: { trackingNumber: trackingNumber.trim() }
      });
    }
  };

  return (
    <ScreenScaffold>
      <SectionHeader
        title="Deliveries"
        subtitle="Command center for sending, receiving, and delivery history"
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
          <IconButton
            size="small"
            aria-label="Open delivery notifications"
            onClick={() => navigate("/deliveries/notifications")}
            sx={{
              borderRadius: uiTokens.radius.xl,
              bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)"),
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <Badge color="error" badgeContent={unreadNotifications} max={9}>
              <NotificationsRoundedIcon sx={{ fontSize: 18 }} />
            </Badge>
          </IconButton>
        }
      />

      <PrimarySection variant="warning">
        <SectionHeader
          eyebrow="Operations"
          title="Delivery command"
          subtitle="Monitor live sending workload and dispatch quickly."
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
            gap: uiTokens.spacing.sm
          }}
        >
          <InlineStat label="Active" value={`${deliveringOrders.length}`} />
          <InlineStat label="Incoming" value={`${incomingOrders.length}`} />
          <InlineStat label="Completed" value={`${completedDeliveriesCount}`} />
          <InlineStat label="Pending" value={`${pendingDeliveriesCount}`} />
          <InlineStat label="Awaiting me" value={`${incomingPendingCount}`} />
          <InlineStat label="Unread" value={`${unreadNotifications}`} />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
            gap: uiTokens.spacing.sm
          }}
          aria-label="Delivery KPI metrics"
        >
          <InlineStat label="On-time %" value={`${kpis.onTimePercent}%`} />
          <InlineStat label="Cancel %" value={`${kpis.cancelPercent}%`} />
          <InlineStat label="Failed handoff %" value={`${kpis.failedHandoffPercent}%`} />
          <InlineStat label="Support contact %" value={`${kpis.supportContactRate}%`} />
        </Box>

        <Box sx={{ display: "grid", gap: uiTokens.spacing.smPlus, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
          <Button
            variant="contained"
            startIcon={<Inventory2RoundedIcon sx={{ fontSize: 18 }} />}
            onClick={() => navigate("/deliveries/new")}
            sx={{
              bgcolor: uiTokens.colors.warningDeep,
              color: uiTokens.colors.warningInk,
              py: uiTokens.spacing.sm,
              fontSize: 13,
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { bgcolor: uiTokens.colors.warningDeepHover }
            }}
          >
            Create new delivery
          </Button>
          <Button
            variant="outlined"
            startIcon={<TrackChangesRoundedIcon sx={{ fontSize: 18 }} />}
            onClick={() => {
              const el = document.getElementById("tracking-field");
              if (el) el.focus();
            }}
            sx={{
              py: uiTokens.spacing.sm,
              fontSize: 13,
              fontWeight: 600,
              textTransform: "none",
              borderColor: uiTokens.borders.warning,
              color: (t) =>
                t.palette.mode === "light" ? uiTokens.colors.warningTextLight : uiTokens.colors.warningTextDark
            }}
          >
            Track shipment
          </Button>
        </Box>
      </PrimarySection>

      <AppCard variant="muted">
        <SectionHeader eyebrow="Quick lookup" title="Track by order ID" compact />
        <TextField
          fullWidth
          id="tracking-field"
          size="small"
          placeholder="Order ID"
          value={trackingNumber}
          onChange={(event) => setTrackingNumber(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleTrackShipment();
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Inventory2RoundedIcon sx={{ fontSize: 20, color: (t) => t.palette.text.secondary }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleTrackShipment}
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: uiTokens.colors.brand,
                    color: uiTokens.colors.white,
                    "&:hover": { bgcolor: uiTokens.colors.brandHover }
                  }}
                >
                  <SearchRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            mt: uiTokens.spacing.sm,
            "& .MuiOutlinedInput-root": {
              bgcolor: uiTokens.surfaces.card,
              "& fieldset": { border: uiTokens.borders.subtle }
            }
          }}
        />
      </AppCard>

      <Box
        sx={{
          display: "grid",
          gap: uiTokens.spacing.lg,
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.3fr) minmax(0, 0.9fr)" },
          alignItems: "start"
        }}
      >
        <AppCard id="incoming-deliveries-section">
          <SectionHeader
            eyebrow="Receiving"
            title="Incoming deliveries to me"
            subtitle="Track parcels where you are the recipient."
            action={
              <Badge badgeContent={incomingOrders.length} color="warning">
                <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, color: (t) => t.palette.text.secondary }}>
                  Incoming
                </Typography>
              </Badge>
            }
            compact
          />

          <ListSection>
            {isLoading ? (
              <Stack spacing={1.2}>
                <Skeleton variant="rounded" height={132} sx={{ borderRadius: uiTokens.radius.xl }} />
                <Skeleton variant="rounded" height={132} sx={{ borderRadius: uiTokens.radius.xl }} />
              </Stack>
            ) : incomingOrders.length === 0 ? (
              <AppCard variant="muted">
                <Typography variant="body2" sx={{ color: (t) => t.palette.text.secondary }}>
                  No incoming deliveries yet. Shared and gifted parcels will appear here automatically.
                </Typography>
              </AppCard>
            ) : (
              incomingOrders.map((order) => (
                <DeliveryCard
                  key={order.id}
                  order={order}
                  variant="received"
                  onAccept={(orderId) =>
                    actions.updateDeliveryOrderStatus(orderId, "accepted", "Recipient confirmed incoming delivery")
                  }
                  onReject={(orderId) =>
                    actions.updateDeliveryOrderStatus(orderId, "cancelled", "Recipient declined incoming delivery")
                  }
                  onMakePayment={(orderId) => navigate(`/deliveries/settlement/${orderId}`)}
                  onClick={(id) => navigate(`/deliveries/tracking/${id}`)}
                />
              ))
            )}
          </ListSection>
        </AppCard>

        <AppCard>
          <SectionHeader
            eyebrow="Sending"
            title="Active sending orders"
            action={
              <Badge badgeContent={deliveringOrders.length} color="error">
                <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, color: (t) => t.palette.text.secondary }}>
                  Active
                </Typography>
              </Badge>
            }
            compact
          />

          <ListSection>
            {isLoading ? (
              <Stack spacing={1.2}>
                <Skeleton variant="rounded" height={132} sx={{ borderRadius: uiTokens.radius.xl }} />
                <Skeleton variant="rounded" height={132} sx={{ borderRadius: uiTokens.radius.xl }} />
              </Stack>
            ) : deliveringOrders.length === 0 ? (
              <AppCard variant="muted">
                <Typography variant="body2" sx={{ color: (t) => t.palette.text.secondary }}>
                  No active sending deliveries right now. Closed deliveries automatically move to history.
                </Typography>
              </AppCard>
            ) : (
              deliveringOrders.map((order) => (
                <DeliveryCard
                  key={order.id}
                  order={order}
                  variant="delivering"
                  onMenuClick={(event, orderId) =>
                    setMenuAnchor({ open: true, anchorEl: event.currentTarget, orderId })
                  }
                  onClick={(id) => navigate(`/deliveries/tracking/${id}`)}
                />
              ))
            )}
          </ListSection>
        </AppCard>

        <AppCard>
          <SectionHeader
            eyebrow="History"
            title="Recent closed orders"
            action={
              <Button
                size="small"
                onClick={() => navigate("/history/all")}
                sx={{ fontSize: 11, textTransform: "none", color: (t) => t.palette.text.secondary }}
              >
                View all
              </Button>
            }
            compact
          />

          <ListSection sx={{ mt: uiTokens.spacing.sm }}>
            {historyRows.length === 0 ? (
              <Typography variant="body2" sx={{ color: (t) => t.palette.text.secondary }}>
                Completed and cancelled deliveries will appear here once available.
              </Typography>
            ) : (
              historyRows.map((order, index) => {
                const tone = statusTone(order.status);
                return (
                  <Box key={order.id}>
                    <Box sx={{ display: "grid", gridTemplateColumns: "16px 1fr auto", gap: 1, alignItems: "start", py: 0.6 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 0.25 }}>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: tone.fg
                          }}
                        />
                        {index < historyRows.length - 1 && (
                          <Box sx={{ width: 2, flex: 1, minHeight: 24, bgcolor: "rgba(148,163,184,0.35)", mt: 0.4 }} />
                        )}
                      </Box>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {order.sender.city} to {order.receiver.city}
                        </Typography>
                        <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                          {order.id} • {formatDateLabel(order.updatedAt)}
                        </Typography>
                        <Stack direction="row" spacing={0.6} sx={{ mt: 0.35 }}>
                          {order.proofOfDelivery && (
                            <Typography variant="caption" sx={{ color: "#15803D", fontWeight: 600 }}>
                              Proof ready
                            </Typography>
                          )}
                          {order.receipt && (
                            <Typography variant="caption" sx={{ color: "#1D4ED8", fontWeight: 600 }}>
                              Receipt ready
                            </Typography>
                          )}
                        </Stack>
                      </Box>

                      <Box sx={{ textAlign: "right" }}>
                        <Typography
                          variant="caption"
                          sx={{
                            px: 1,
                            py: 0.3,
                            borderRadius: 4,
                            bgcolor: tone.bg,
                            color: tone.fg,
                            fontWeight: 700,
                            display: "inline-block"
                          }}
                        >
                          {getDeliveryStatusLabel(order.status)}
                        </Typography>
                        <Box sx={{ mt: 0.4 }}>
                          <Button
                            size="small"
                            onClick={() => navigate(`/deliveries/tracking/${order.id}`)}
                            sx={{ textTransform: "none", fontSize: 11, minWidth: 0, px: 0 }}
                          >
                            Open
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                    {index < historyRows.length - 1 && <Divider sx={{ my: 0.6 }} />}
                  </Box>
                );
              })
            )}
          </ListSection>

          <Box
            sx={{
              mt: uiTokens.spacing.sm,
              px: uiTokens.spacing.sm,
              py: uiTokens.spacing.xs,
              borderRadius: uiTokens.radius.md,
              bgcolor: (t) => (t.palette.mode === "light" ? "rgba(15,23,42,0.03)" : "rgba(148,163,184,0.08)")
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <LocalShippingRoundedIcon sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }} />
              <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                History quality: on-time {kpis.onTimePercent}% • support contact {kpis.supportContactRate}%
              </Typography>
            </Stack>
          </Box>
        </AppCard>
      </Box>

      <Menu
        anchorEl={menuAnchor.anchorEl}
        open={menuAnchor.open}
        onClose={() => setMenuAnchor({ open: false, anchorEl: null, orderId: null })}
        PaperProps={{ sx: { minWidth: 160, mt: uiTokens.spacing.xxs } }}
      >
        <MenuItem
          onClick={() => {
            const orderId = menuAnchor.orderId;
            const shareUrl = `${window.location.origin}/deliveries/tracking/${orderId}`;
            const shareData = {
              title: "EVzone Delivery Tracking",
              text: `Track delivery ${orderId}`,
              url: shareUrl
            };
            if (navigator.share) {
              navigator.share(shareData).catch(() => {});
            } else if (navigator.clipboard) {
              navigator.clipboard
                .writeText(shareUrl)
                .then(() => {
                  setShareSnackbar(true);
                })
                .catch(() => {});
            }
            setMenuAnchor({ open: false, anchorEl: null, orderId: null });
          }}
          sx={{ py: uiTokens.spacing.smPlus }}
        >
          <ShareRoundedIcon sx={{ fontSize: 18, mr: uiTokens.spacing.md, color: uiTokens.colors.brand }} />
          <Typography variant="body2" sx={{ fontSize: 13 }}>
            Share
          </Typography>
        </MenuItem>
      </Menu>

      <Snackbar
        open={shareSnackbar}
        autoHideDuration={3000}
        onClose={() => setShareSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShareSnackbar(false)}
          severity="success"
          sx={{ borderRadius: uiTokens.radius.xl, width: "100%" }}
        >
          Tracking link copied to clipboard!
        </Alert>
      </Snackbar>
    </ScreenScaffold>
  );
}

export default function DeliveryDashboard(): React.JSX.Element {
  return <DeliveryDashboardHomeScreen />;
}
