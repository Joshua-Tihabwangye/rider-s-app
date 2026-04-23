import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Chip,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import AppCard from "../components/primitives/AppCard";
import { useAppData } from "../contexts/AppDataContext";
import { uiTokens } from "../design/tokens";
import {
  getDeliveryOrderModeLabel,
  getDeliveryOrderModeSummary,
  getDeliveryOrderModeTone
} from "../features/delivery/orderMode";
import type { PaymentMethodType } from "../store/types";

function formatAmount(value: number): string {
  return `UGX ${Math.round(value).toLocaleString()}`;
}

function formatDateTime(value?: string): string {
  if (!value) return "Pending";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-UG", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

const FINALIZED_SETTLEMENT_STATUSES = new Set(["captured", "cash_collected", "refunded", "voided"]);

function formatPaymentMethodType(value: PaymentMethodType): string {
  if (value === "mobile_money") return "Mobile money";
  if (value === "card") return "Card";
  if (value === "cash") return "Payment on delivery";
  return "Wallet";
}

export default function DeliverySettlement(): React.JSX.Element {
  const navigate = useNavigate();
  const { orderId = "" } = useParams<{ orderId: string }>();
  const { delivery, paymentMethods, actions } = useAppData();

  const order = useMemo(
    () => delivery.orders.find((item) => item.id === orderId) ?? delivery.activeOrder,
    [delivery.orders, delivery.activeOrder, orderId]
  );
  const selectedMethod = useMemo(
    () => paymentMethods.find((method) => method.id === order?.paymentMethodId) ?? null,
    [paymentMethods, order?.paymentMethodId]
  );

  if (!order) {
    return (
      <ScreenScaffold>
        <SectionHeader
          title="Delivery settlement"
          subtitle="Order not found"
          leadingAction={
            <IconButton size="small" aria-label="Back" onClick={() => navigate(-1)}>
              <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          }
        />
        <Typography variant="body2" sx={{ color: (t) => t.palette.text.secondary }}>
          We could not find this delivery order.
        </Typography>
      </ScreenScaffold>
    );
  }

  const settlementStatus = order.settlement?.status ?? "pending_authorization";
  const settlementFinalized = FINALIZED_SETTLEMENT_STATUSES.has(settlementStatus);
  const isReceiverOrder = order.participantRole === "receiver";
  const isPendingReceiverPayment = isReceiverOrder && (order.status === "delivered" || order.status === "partially_completed");
  const canCaptureSettlement = !settlementFinalized && paymentMethods.length > 0;
  const handleCaptureSettlement = (): void => {
    actions.captureDeliverySettlement(order.id);
    navigate("/deliveries");
  };

  return (
    <ScreenScaffold>
      <SectionHeader
        title={`Settlement ${order.id}`}
        subtitle="Delivery-specific authorization and capture flow"
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
      />

      <AppCard>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Settlement state
            </Typography>
            <Stack direction="row" spacing={0.7}>
              <Chip
                size="small"
                label={getDeliveryOrderModeLabel(order.orderMode)}
                sx={{
                  height: 22,
                  fontSize: 10,
                  fontWeight: 700,
                  bgcolor: getDeliveryOrderModeTone(order.orderMode).bg,
                  color: getDeliveryOrderModeTone(order.orderMode).fg,
                  border: `1px solid ${getDeliveryOrderModeTone(order.orderMode).border}`
                }}
              />
              <Chip size="small" label={order.settlement?.status ?? "pending_authorization"} />
            </Stack>
          </Stack>
          <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
            {getDeliveryOrderModeSummary({
              orderMode: order.orderMode,
              orderModeConfig: order.orderModeConfig
            })}
          </Typography>
          <Typography variant="body2">Policy: {order.settlement?.policy ?? "cashless_pre_auth"}</Typography>
          <Typography variant="body2">
            Method:{" "}
            {selectedMethod
              ? `${selectedMethod.label} (${formatPaymentMethodType(selectedMethod.type)})`
              : formatPaymentMethodType(order.settlement?.methodType ?? "wallet")}
          </Typography>
          <Typography variant="body2">
            Authorized amount: {formatAmount(order.settlement?.authorizedAmount ?? order.costBreakdown.total)}
          </Typography>
          <Typography variant="body2">
            Captured amount: {formatAmount(order.settlement?.capturedAmount ?? 0)}
          </Typography>
          <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
            Authorized at {formatDateTime(order.settlement?.authorizedAt)} • Captured at {formatDateTime(order.settlement?.capturedAt)}
          </Typography>
        </Stack>
      </AppCard>

      {isPendingReceiverPayment ? (
        <AppCard>
          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Choose payment option
            </Typography>
            {paymentMethods.length === 0 ? (
              <Typography variant="body2" sx={{ color: (t) => t.palette.text.secondary }}>
                No payment methods found. Add one in Wallet.
              </Typography>
            ) : (
              <Stack spacing={0.8}>
                {paymentMethods.map((method) => {
                  const isSelected = method.id === order.paymentMethodId;
                  return (
                    <Button
                      key={method.id}
                      variant={isSelected ? "contained" : "outlined"}
                      color={isSelected ? "primary" : "inherit"}
                      onClick={() => actions.selectDeliverySettlementMethod(order.id, method.id)}
                      disabled={settlementFinalized}
                      sx={{ textTransform: "none", justifyContent: "space-between", py: 0.8 }}
                      aria-pressed={isSelected}
                    >
                      <Stack spacing={0.1} alignItems="flex-start" sx={{ textAlign: "left" }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {method.label}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.86 }}>
                          {method.detail || formatPaymentMethodType(method.type)}
                        </Typography>
                      </Stack>
                      <Chip
                        size="small"
                        label={formatPaymentMethodType(method.type)}
                        sx={{ ml: 1, pointerEvents: "none" }}
                      />
                    </Button>
                  );
                })}
              </Stack>
            )}
            {settlementFinalized && (
              <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                Settlement is finalized. Payment option can no longer be changed.
              </Typography>
            )}
          </Stack>
        </AppCard>
      ) : (
        <AppCard>
          <Typography variant="body2" sx={{ color: (t) => t.palette.text.secondary }}>
            Recipient payment options are selected by the recipient at payment time.
          </Typography>
        </AppCard>
      )}

      <AppCard variant="muted">
        <Stack spacing={1}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Rules
          </Typography>
          <Typography variant="body2">Online methods (`wallet`, `card`, `mobile_money`) are pre-authorized and captured at completion.</Typography>
          <Typography variant="body2">`payment on delivery` is settled at handoff with payment collection state tracking.</Typography>
          <Typography variant="body2">Receipts are generated from captured settlements, not ride payment routing.</Typography>
        </Stack>
      </AppCard>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <Button
          variant="contained"
          startIcon={<PaymentsRoundedIcon sx={{ fontSize: 16 }} />}
          onClick={handleCaptureSettlement}
          disabled={!canCaptureSettlement}
          sx={{ textTransform: "none" }}
        >
          {settlementFinalized ? "Settlement finalized" : "Capture settlement"}
        </Button>
        <Button
          variant="outlined"
          startIcon={<ReceiptLongRoundedIcon sx={{ fontSize: 16 }} />}
          onClick={() => navigate(`/deliveries/tracking/${order.id}?tab=receipt`)}
          sx={{ textTransform: "none" }}
        >
          View receipt
        </Button>
      </Stack>
    </ScreenScaffold>
  );
}
