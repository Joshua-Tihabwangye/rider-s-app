import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import DeliveryTrackingMap from "../components/deliveries/DeliveryTrackingMap";
import DeliveryStatusSummary from "../components/deliveries/DeliveryStatusSummary";
import DeliveryBottomSheet from "../components/deliveries/DeliveryBottomSheet";
import DriverChatRoom from "../components/DriverChatRoom";
import { useAppData } from "../contexts/AppDataContext";
import { uiTokens } from "../design/tokens";
import {
  formatEtaLabel,
  getDeliveryStatusDescription,
  getDeliveryStatusLabel,
  getNextDeliveryStatus,
  getTimelineView
} from "../features/delivery/stateMachine";
import { DELIVERY_EXCEPTION_LABELS } from "../features/delivery/exceptions";
import {
  calculateScheduledCancellationFee,
  canCancelScheduledOrder,
  canEditScheduledOrder
} from "../features/delivery/schedulePolicy";
import { formatProofMethodLabel } from "../features/delivery/proof";
import type { DeliveryExceptionType } from "../store/types";

const EXCEPTION_TYPES: DeliveryExceptionType[] = [
  "missing_item",
  "damaged_item",
  "delayed_courier",
  "failed_handoff",
  "return_to_sender",
  "dispute_refund"
];

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

function formatCurrency(amount: number): string {
  return `UGX ${Math.round(amount).toLocaleString()}`;
}

function toDateTimeLocalValue(value?: string): string {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}`;
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
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [exceptionDialogOpen, setExceptionDialogOpen] = useState(false);
  const [exceptionType, setExceptionType] = useState<DeliveryExceptionType>("missing_item");
  const [exceptionNote, setExceptionNote] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [scheduleDraft, setScheduleDraft] = useState("");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("Plan changed");

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
    setIsRefreshing(true);
    const timer = window.setTimeout(() => setIsRefreshing(false), 280);
    return () => window.clearTimeout(timer);
  }, [orderId, mode, delivery.lastRealtimeSync]);

  useEffect(() => {
    if (!order || !orderId) {
      return;
    }

    if (order.status === "delivered" && mode !== "delivered" && mode !== "proof" && mode !== "receipt" && mode !== "rating") {
      navigate(`/deliveries/tracking/${orderId}/delivered`, { replace: true });
    }
    if (order.status === "cancelled" && mode !== "cancel") {
      navigate(`/deliveries/tracking/${orderId}/cancel`, { replace: true });
    }
  }, [navigate, order, mode, orderId]);

  useEffect(() => {
    if (!order) {
      return;
    }
    setScheduleDraft(toDateTimeLocalValue(order.scheduleTime));
  }, [order]);

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
  const scheduleCancellation = calculateScheduledCancellationFee(order);
  const canEditSchedule = canEditScheduledOrder(order);
  const canCancelSchedule = canCancelScheduledOrder(order);

  const handleCallCourier = (): void => {
    actions.logDeliveryContactEvent(order.id, "call");
  };

  const handleChatCourier = (): void => {
    actions.logDeliveryContactEvent(order.id, "chat");
    setChatOpen(true);
  };

  const handleSubmitException = (): void => {
    if (!exceptionNote.trim()) {
      return;
    }

    actions.reportDeliveryException({
      orderId: order.id,
      type: exceptionType,
      note: exceptionNote.trim(),
      requestedRefundAmount: exceptionType === "dispute_refund" ? Number(refundAmount) || undefined : undefined
    });
    setExceptionDialogOpen(false);
    setExceptionNote("");
    setRefundAmount("");
  };

  const handleSaveSchedule = (): void => {
    if (!scheduleDraft) {
      return;
    }

    const nextDate = new Date(scheduleDraft);
    if (Number.isNaN(nextDate.getTime()) || nextDate.getTime() <= Date.now()) {
      return;
    }

    actions.updateScheduledDelivery(order.id, nextDate.toISOString());
    setScheduleDialogOpen(false);
  };

  const handleCancelOrder = (): void => {
    if (order.schedule === "scheduled") {
      actions.cancelScheduledDelivery(order.id, cancelReason.trim() || "Cancelled by rider");
    } else {
      actions.updateDeliveryOrderStatus(order.id, "cancelled", cancelReason.trim() || "Cancelled by rider");
    }
    setCancelDialogOpen(false);
  };

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

      {isRefreshing ? (
        <>
          <Skeleton variant="rounded" height={220} sx={{ borderRadius: uiTokens.radius.xl }} />
          <Skeleton variant="rounded" height={98} sx={{ borderRadius: uiTokens.radius.xl }} />
        </>
      ) : (
        <>
          <DeliveryTrackingMap
            pickupLabel={order.pickup.label}
            dropoffLabel={order.dropoff.label}
            courierPosition={order.tracking.courierPosition}
            etaLabel={etaLabel}
            statusLabel={statusLabel}
          />

          <DeliveryStatusSummary
            pickupLabel={order.pickup.label}
            dropoffLabel={order.dropoff.label}
            etaLabel={etaLabel}
            distanceKm={order.tracking.distanceKm}
            lastSyncLabel={formatDateTime(delivery.lastRealtimeSync ?? order.tracking.updatedAt)}
          />
        </>
      )}

      <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl }} aria-live="polite">
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
                    {step.state === "done" ? (
                      <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />
                    ) : (
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "currentColor" }} />
                    )}
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

      {(mode === "driver" || mode === "live" || mode === "details" || mode === "received") && order.courier && (
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
              <Button
                fullWidth
                size="small"
                variant="outlined"
                startIcon={<PhoneRoundedIcon sx={{ fontSize: 16 }} />}
                href={`tel:${order.courier.phone}`}
                onClick={handleCallCourier}
                aria-label="Call courier"
                sx={{ textTransform: "none" }}
              >
                Call
              </Button>
              <Button
                fullWidth
                size="small"
                variant="outlined"
                startIcon={<MessageRoundedIcon sx={{ fontSize: 16 }} />}
                onClick={handleChatCourier}
                aria-label="Chat with courier"
                sx={{ textTransform: "none" }}
              >
                Chat
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {(mode === "details" || mode === "received" || mode === "delivered") && (
        <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: uiTokens.spacing.xs }}>
              Parcel and recipient details
            </Typography>
            <Stack spacing={0.6}>
              <Typography variant="body2">Parcel: {order.parcel.description}</Typography>
              <Typography variant="body2">
                Type: {order.parcel.type.replace("_", " ")} • Size: {order.parcel.size.replace("_", " ")}
              </Typography>
              <Typography variant="body2">Declared value: {formatCurrency(order.parcel.value)}</Typography>
              <Typography variant="body2">Recipient: {order.recipient.name} • {order.recipient.phone}</Typography>
              <Typography variant="body2">Address: {order.recipient.address}</Typography>
              <Typography variant="body2">
                Payment estimate: {order.priceEstimate ?? formatCurrency(order.costBreakdown.total)}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}

      {(mode === "proof" || (mode === "delivered" && order.proofOfDelivery)) && (
        <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#16A34A", mb: 1 }}>
              Proof of delivery
            </Typography>
            {order.proofOfDelivery ? (
              <Stack spacing={0.7}>
                <Typography variant="body2">Recipient: {order.proofOfDelivery.recipientName}</Typography>
                <Typography variant="body2">Delivered: {formatDateTime(order.proofOfDelivery.deliveredAt)}</Typography>
                <Typography variant="body2">Location: {order.proofOfDelivery.location.label}</Typography>
                <Typography variant="body2">
                  Verification: {order.proofOfDelivery.methods.map((method) => formatProofMethodLabel(method)).join(", ")}
                </Typography>
                {order.proofOfDelivery.otpCode && (
                  <Typography variant="body2">OTP: {order.proofOfDelivery.otpCode}</Typography>
                )}
              </Stack>
            ) : (
              <Typography variant="body2" sx={{ color: (t) => t.palette.text.secondary }}>
                Proof is not available yet.
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      {(mode === "receipt" || (mode === "delivered" && order.receipt)) && (
        <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Receipt
            </Typography>
            {order.receipt ? (
              <Stack spacing={0.8}>
                {order.receipt.lineItems.map((line) => (
                  <Stack key={line.label} direction="row" justifyContent="space-between">
                    <Typography variant="body2">{line.label}</Typography>
                    <Typography variant="body2">{formatCurrency(line.amount)}</Typography>
                  </Stack>
                ))}
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Total
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {formatCurrency(order.receipt.total)}
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                  Issued {formatDateTime(order.receipt.issuedAt)} • {order.receipt.settlementStatus}
                </Typography>
              </Stack>
            ) : (
              <Typography variant="body2" sx={{ color: (t) => t.palette.text.secondary }}>
                Receipt is not available yet.
              </Typography>
            )}
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

      <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl }}>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Exceptions and support
            </Typography>
            <Button
              size="small"
              startIcon={<ReportProblemRoundedIcon sx={{ fontSize: 14 }} />}
              onClick={() => setExceptionDialogOpen(true)}
              sx={{ textTransform: "none" }}
            >
              Report issue
            </Button>
          </Stack>

          {(order.exceptions ?? []).length === 0 ? (
            <Typography variant="body2" sx={{ color: (t) => t.palette.text.secondary }}>
              No active exceptions for this order.
            </Typography>
          ) : (
            <Stack spacing={0.8}>
              {(order.exceptions ?? []).map((item) => (
                <Box key={item.id}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {DELIVERY_EXCEPTION_LABELS[item.type]}
                  </Typography>
                  <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                    {item.note} • {item.status}
                  </Typography>
                  {item.status === "open" && (
                    <Box sx={{ mt: 0.5 }}>
                      <Button
                        size="small"
                        onClick={() => actions.resolveDeliveryException(order.id, item.id, "Resolved by support")}
                        sx={{ textTransform: "none" }}
                      >
                        Mark resolved
                      </Button>
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      <DeliveryBottomSheet>
        <Stack spacing={1.1}>
          {nextStatus && order.status !== "cancelled" && order.status !== "failed" && (
            <Button
              variant="contained"
              onClick={() => actions.updateDeliveryOrderStatus(order.id, nextStatus, "Stage advanced manually")}
              sx={{ textTransform: "none", fontWeight: 700 }}
              aria-label={`Mark as ${getDeliveryStatusLabel(nextStatus)}`}
            >
              Mark as {getDeliveryStatusLabel(nextStatus)}
            </Button>
          )}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/deliveries/tracking/${order.id}/proof`)}
              startIcon={<FactCheckRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{ textTransform: "none" }}
            >
              View proof
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/deliveries/tracking/${order.id}/receipt`)}
              startIcon={<ReceiptLongRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{ textTransform: "none" }}
            >
              View receipt
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/deliveries/tracking/${order.id}/rating`)}
              startIcon={<StarRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{ textTransform: "none" }}
            >
              Rate delivery
            </Button>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/deliveries/tracking/${order.id}/driver`)}
              startIcon={<PersonRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{ textTransform: "none" }}
            >
              Courier
            </Button>
            <Button variant="outlined" onClick={() => navigate(`/deliveries/tracking/${order.id}/timeline`)} sx={{ textTransform: "none" }}>
              Timeline
            </Button>
            <Button variant="outlined" onClick={() => navigate(`/deliveries/tracking/${order.id}/live`)} sx={{ textTransform: "none" }}>
              Live map
            </Button>
          </Stack>

          {(order.schedule === "scheduled" || order.status !== "delivered") && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button
                variant="outlined"
                startIcon={<ScheduleRoundedIcon sx={{ fontSize: 16 }} />}
                onClick={() => setScheduleDialogOpen(true)}
                disabled={!canEditSchedule}
                sx={{ textTransform: "none" }}
              >
                Edit schedule
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setCancelDialogOpen(true)}
                disabled={order.status === "cancelled" || order.status === "delivered" || (order.schedule === "scheduled" && !canCancelSchedule)}
                sx={{ textTransform: "none" }}
              >
                Cancel
              </Button>
            </Stack>
          )}

          {order.schedule === "scheduled" && (
            <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
              Cancellation fee policy at {scheduleCancellation.stage.replace("_", " ")}: {scheduleCancellation.feePercent}% (min {formatCurrency(scheduleCancellation.fee)}).
            </Typography>
          )}
        </Stack>
      </DeliveryBottomSheet>

      <Dialog open={exceptionDialogOpen} onClose={() => setExceptionDialogOpen(false)} fullWidth>
        <DialogTitle>Report delivery issue</DialogTitle>
        <DialogContent>
          <Stack spacing={1.2} sx={{ mt: 0.5 }}>
            <TextField
              select
              label="Issue type"
              size="small"
              value={exceptionType}
              onChange={(event) => setExceptionType(event.target.value as DeliveryExceptionType)}
            >
              {EXCEPTION_TYPES.map((item) => (
                <MenuItem key={item} value={item}>
                  {DELIVERY_EXCEPTION_LABELS[item]}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Details"
              size="small"
              multiline
              minRows={3}
              value={exceptionNote}
              onChange={(event) => setExceptionNote(event.target.value)}
            />
            {exceptionType === "dispute_refund" && (
              <TextField
                label="Requested refund (UGX)"
                size="small"
                type="number"
                value={refundAmount}
                onChange={(event) => setRefundAmount(event.target.value)}
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExceptionDialogOpen(false)} sx={{ textTransform: "none" }}>
            Close
          </Button>
          <Button onClick={handleSubmitException} variant="contained" sx={{ textTransform: "none" }}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={scheduleDialogOpen} onClose={() => setScheduleDialogOpen(false)} fullWidth>
        <DialogTitle>Edit scheduled delivery</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: (t) => t.palette.text.secondary, mb: 1.2 }}>
            You can update schedule until {order.schedulePolicy?.rescheduleCutoffMinutes ?? 30} minutes before pickup.
          </Typography>
          <TextField
            fullWidth
            type="datetime-local"
            value={scheduleDraft}
            onChange={(event) => setScheduleDraft(event.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleDialogOpen(false)} sx={{ textTransform: "none" }}>
            Close
          </Button>
          <Button onClick={handleSaveSchedule} variant="contained" sx={{ textTransform: "none" }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} fullWidth>
        <DialogTitle>Cancel delivery</DialogTitle>
        <DialogContent>
          <Stack spacing={1.2} sx={{ mt: 0.5 }}>
            <TextField
              label="Reason"
              size="small"
              value={cancelReason}
              onChange={(event) => setCancelReason(event.target.value)}
              fullWidth
            />
            {order.schedule === "scheduled" && (
              <Typography variant="body2" sx={{ color: (t) => t.palette.text.secondary }}>
                Policy at this stage: {scheduleCancellation.description} Fee now: {formatCurrency(scheduleCancellation.fee)}.
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)} sx={{ textTransform: "none" }}>
            Keep order
          </Button>
          <Button color="error" variant="contained" onClick={handleCancelOrder} sx={{ textTransform: "none" }}>
            Confirm cancel
          </Button>
        </DialogActions>
      </Dialog>

      <DriverChatRoom
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        driverName={order.courier?.name}
        driverAvatar={order.courier?.name.slice(0, 2)}
      />
    </ScreenScaffold>
  );
}
