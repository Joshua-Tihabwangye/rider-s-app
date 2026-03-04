import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  TextField,
  Rating
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import MobileShell from "../components/MobileShell";

const TAGS = [
  "On-time delivery",
  "Package handled with care",
  "Clear communication",
  "Easy to find my address",
  "Friendly courier",
  "Would use again"
];

function OrderCompletionRatingPromptScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");

  const toggleTag = (tag: string): void => {
    setSelectedTags((prev: string[]) =>
      prev.includes(tag) ? prev.filter((t: string) => t !== tag) : [...prev, tag]
    );
  };

  const canSubmit = rating > 0;

  return (
    <>
    {/* Green Header */}
        <Box sx={{ bgcolor: "#03CD8C", px: 2.5, pt: 2, pb: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "#FFFFFF",
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" }
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, letterSpacing: "-0.01em", color: "#FFFFFF" }}
          >
            How was your delivery?
          </Typography>
        </Box>
        <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>


      {/* Parcel summary */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.6 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <Inventory2RoundedIcon sx={{ fontSize: 20, color: "primary.main" }} />
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Order
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, letterSpacing: "-0.01em" }}
              >
                EV accessories • DLV-2025-10-07-001
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Chip
              size="small"
              icon={<LocalShippingRoundedIcon sx={{ fontSize: 14 }} />}
              label="EV courier"
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 24,
                bgcolor: "rgba(34,197,94,0.12)",
                color: "#16A34A"
              }}
            />
            <Chip
              size="small"
              icon={<PlaceRoundedIcon sx={{ fontSize: 14 }} />}
              label="Nsambya → Bugolobi"
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 24,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                color: (t) => t.palette.text.primary
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Rating card */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.8 }}>
          <Box sx={{ textAlign: "center", mb: 1.6 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Rate your delivery
            </Typography>
            <Rating
              value={rating}
              onChange={(_e, value) => setRating(value || 0)}
              precision={1}
              size="large"
              sx={{ mt: 0.5 }}
            />
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: "block",
                fontSize: 11,
                color: (t) => t.palette.text.secondary
              }}
            >
              {rating === 0 && "Tap a star to rate"}
              {rating >= 4 && "Great! Tell us what went well"}
              {rating > 0 && rating < 4 && "What could we improve next time?"}
            </Typography>
          </Box>

          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              color: (t) => t.palette.text.secondary,
              mb: 1,
              display: "block"
            }}
          >
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
                    borderRadius: 999,
                    fontSize: 11,
                    height: 26,
                    bgcolor: active
                      ? "primary.main"
                      : (t) =>
                          t.palette.mode === "light"
                            ? "#F3F4F6"
                            : "rgba(15,23,42,0.96)",
                    color: active
                      ? "#020617"
                      : (t) => t.palette.text.primary,
                    "& .MuiChip-icon": {
                      color: active ? "#020617" : "rgba(148,163,184,1)"
                    }
                  }}
                />
              );
            })}
          </Stack>
        </CardContent>
      </Card>

      {/* Comment card */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.6 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            Anything else you’d like to share? (optional)
          </Typography>
          <TextField
            multiline
            minRows={3}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your delivery, good or bad…"
            sx={{
              mt: 0.75,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": { borderColor: "primary.main" }
              }
            }}
          />
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="contained"
        disabled={!canSubmit}
        startIcon={<StarRoundedIcon sx={{ fontSize: 18 }} />}
        sx={{
          borderRadius: 999,
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
    </Box>
    </>

  );
}

export default function RiderScreen67OrderCompletionRatingPromptCanvas_v2() {
  return (
    <>
      <DarkModeToggle />
      <MobileShell>
        <OrderCompletionRatingPromptScreen />
      </MobileShell>
    </>
  );
}
