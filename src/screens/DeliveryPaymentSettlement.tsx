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

export default function DeliveryPaymentSettlement(): React.JSX.Element {
  const navigate = useNavigate();
  const { orderId = "" } = useParams<{ orderId: string }>();
  const { delivery, actions } = useAppData();

  const order = useMemo(
    () => delivery.orders.find((item) => item.id === orderId) ?? delivery.activeOrder,
    [delivery.orders, delivery.activeOrder, orderId]
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
            <Chip size="small" label={order.settlement?.status ?? "pending_authorization"} />
          </Stack>
          <Typography variant="body2">Policy: {order.settlement?.policy ?? "cashless_pre_auth"}</Typography>
          <Typography variant="body2">Method: {order.settlement?.methodType ?? "wallet"}</Typography>
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

      <AppCard variant="muted">
        <Stack spacing={1}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Rules
          </Typography>
          <Typography variant="body2">Cashless methods (`wallet`, `card`, `mobile_money`) are pre-authorized and captured at completion.</Typography>
          <Typography variant="body2">`cash` uses cash-on-delivery settlement with cash collection state tracking.</Typography>
          <Typography variant="body2">Receipts are generated from captured settlements, not ride payment routing.</Typography>
        </Stack>
      </AppCard>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <Button
          variant="contained"
          startIcon={<PaymentsRoundedIcon sx={{ fontSize: 16 }} />}
          onClick={() => actions.captureDeliverySettlement(order.id)}
          sx={{ textTransform: "none" }}
        >
          Capture settlement
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
