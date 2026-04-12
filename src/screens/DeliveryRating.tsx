import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Rating,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import { useAppData } from "../contexts/AppDataContext";
import { uiTokens } from "../design/tokens";

const TAGS = [
  "On-time delivery",
  "Package handled with care",
  "Clear communication",
  "Easy to find my address",
  "Friendly courier",
  "Would use again"
];

function formatRoute(orderPickup: string, orderDropoff: string): string {
  return `${orderPickup} -> ${orderDropoff}`;
}

export default function DeliveryRating(): React.JSX.Element {
  const navigate = useNavigate();
  const { orderId = "" } = useParams<{ orderId: string }>();
  const { delivery, actions } = useAppData();

  const order = useMemo(() => delivery.orders.find((item) => item.id === orderId) ?? delivery.activeOrder, [delivery.orders, delivery.activeOrder, orderId]);

  const [rating, setRating] = useState(order?.rating?.score ?? 0);
  const [selectedTags, setSelectedTags] = useState<string[]>(order?.rating?.tags ?? []);
  const [comment, setComment] = useState(order?.rating?.comment ?? "");

  if (!order) {
    return (
      <ScreenScaffold>
        <SectionHeader
          title="Rate delivery"
          subtitle="Order not found"
          leadingAction={
            <IconButton size="small" aria-label="Back" onClick={() => navigate(-1)}>
              <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          }
        />
        <Typography variant="body2" sx={{ color: (t) => t.palette.text.secondary }}>
          We could not find this delivery.
        </Typography>
      </ScreenScaffold>
    );
  }

  const toggleTag = (tag: string): void => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]));
  };

  const handleSubmit = (): void => {
    if (rating <= 0) {
      return;
    }

    actions.submitDeliveryRating(order.id, {
      score: rating,
      tags: selectedTags,
      comment: comment.trim() || undefined
    });

    navigate(`/deliveries/tracking/${order.id}?tab=overview`, { replace: true });
  };

  const canSubmit = rating > 0;

  return (
    <ScreenScaffold>
      <SectionHeader
        title="How was your delivery?"
        subtitle="Rate the courier and delivery experience"
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

      <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl }}>
        <CardContent>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Inventory2RoundedIcon sx={{ fontSize: 20, color: "primary.main" }} />
              <Box>
                <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                  Order
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {order.parcel.description} • {order.id}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Chip
                size="small"
                icon={<LocalShippingRoundedIcon sx={{ fontSize: 14 }} />}
                label="EV courier"
                sx={{ borderRadius: 5, fontSize: 11, height: 24, bgcolor: "rgba(34,197,94,0.12)", color: "#16A34A" }}
              />
              <Chip
                size="small"
                icon={<PlaceRoundedIcon sx={{ fontSize: 14 }} />}
                label={formatRoute(order.pickup.label, order.dropoff.label)}
                sx={{ borderRadius: 5, fontSize: 11, height: 24 }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl }}>
        <CardContent>
          <Box sx={{ textAlign: "center", mb: 1.6 }}>
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Rate your delivery
            </Typography>
            <Rating
              value={rating}
              onChange={(_event, value) => setRating(value || 0)}
              precision={1}
              size="large"
              sx={{ mt: 0.5 }}
              aria-label="Delivery rating"
            />
            <Typography
              variant="caption"
              sx={{ mt: 0.5, display: "block", fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {rating === 0 && "Tap a star to rate"}
              {rating >= 4 && "Great! Tell us what went well"}
              {rating > 0 && rating < 4 && "What could we improve next time?"}
            </Typography>
          </Box>

          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}>
            What stood out?
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {TAGS.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  onClick={() => toggleTag(tag)}
                  icon={active ? <StarRoundedIcon sx={{ fontSize: 14 }} /> : undefined}
                  sx={{
                    borderRadius: 5,
                    fontSize: 11,
                    height: 26,
                    bgcolor: active ? "primary.main" : (t) => (t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)"),
                    color: active ? "#020617" : (t) => t.palette.text.primary,
                    "& .MuiChip-icon": { color: active ? "#020617" : "rgba(148,163,184,1)" }
                  }}
                />
              );
            })}
          </Stack>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl }}>
        <CardContent>
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
            Anything else you'd like to share? (optional)
          </Typography>
          <TextField
            multiline
            minRows={3}
            fullWidth
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Tell us about your delivery, good or bad..."
            sx={{
              mt: 0.75,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: (t) => (t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)")
              }
            }}
          />
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="contained"
        disabled={!canSubmit}
        onClick={handleSubmit}
        startIcon={<StarRoundedIcon sx={{ fontSize: 18 }} />}
        sx={{
          borderRadius: 5,
          py: 1.1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: canSubmit ? "primary.main" : "#9CA3AF",
          color: canSubmit ? "#020617" : "#E5E7EB",
          "&:hover": {
            bgcolor: canSubmit ? "#06e29a" : "#9CA3AF"
          }
        }}
      >
        Submit rating
      </Button>
    </ScreenScaffold>
  );
}
