import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import AppCard from "../components/primitives/AppCard";
import ListSection from "../components/primitives/ListSection";
import { useAppData } from "../contexts/AppDataContext";
import { uiTokens } from "../design/tokens";

function formatDateTime(value: string): string {
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

export default function DeliveryNotifications(): React.JSX.Element {
  const navigate = useNavigate();
  const { delivery, actions } = useAppData();
  const unreadCount = delivery.notifications.filter((item) => !item.read).length;

  return (
    <ScreenScaffold>
      <SectionHeader
        title="Notification center"
        subtitle="Delivery updates, proof, payment and issue alerts"
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
          <Button onClick={actions.markDeliveryNotificationsRead} size="small" sx={{ textTransform: "none" }}>
            Mark all read
          </Button>
        }
      />

      <AppCard variant="muted">
        <Stack direction="row" spacing={1.2} alignItems="center">
          <NotificationsActiveRoundedIcon sx={{ color: uiTokens.colors.brand }} />
          <Typography variant="body2">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "All notifications are read"}
          </Typography>
        </Stack>
      </AppCard>

      <ListSection>
        {delivery.notifications.length === 0 ? (
          <AppCard variant="muted">
            <Typography variant="body2" sx={{ color: (t) => t.palette.text.secondary }}>
              No delivery notifications yet.
            </Typography>
          </AppCard>
        ) : (
          delivery.notifications.map((notification) => (
            <AppCard key={notification.id} variant={notification.read ? "muted" : "default"}>
              <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {notification.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                    {notification.body}
                  </Typography>
                  <Typography variant="caption" sx={{ display: "block", mt: 0.4, color: (t) => t.palette.text.secondary }}>
                    {formatDateTime(notification.createdAt)} • {notification.orderId}
                  </Typography>
                </Box>
                <Chip size="small" label={notification.category} />
              </Stack>
            </AppCard>
          ))
        )}
      </ListSection>
    </ScreenScaffold>
  );
}
