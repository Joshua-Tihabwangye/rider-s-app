import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  TextField,
  Rating
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import InsertEmoticonRoundedIcon from "@mui/icons-material/InsertEmoticonRounded";
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import MobileShell from "../components/MobileShell";
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: { main: "#03CD8C" },
    secondary: { main: "#F77F00" },
    ...(mode === "light"
      ? {
          background: {
            default: "#F3F4F6",
            paper: "#FFFFFF"
          },
          text: {
            primary: "#0F172A",
            secondary: "#6B7280"
          },
          divider: "rgba(148,163,184,0.4)"
        }
      : {
          background: {
            default: "#020617",
            paper: "#020617"
          },
          text: {
            primary: "#F9FAFB",
            secondary: "#A6A6A6"
          },
          divider: "rgba(148,163,184,0.24)"
        })
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    button: { textTransform: "none", fontWeight: 600 },
    h6: { fontWeight: 600 }
  }
});

const TAGS = [
  "Clean vehicle",
  "Friendly driver",
  "Smooth driving",
  "Felt safe",
  "On time",
  "Great music",
  "AC comfort",
  "Route choice"
];

function RideRatingFeedbackScreen() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState("");

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const canSubmit = rating > 0;

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 999,
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
              border: (theme) =>
                theme.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              How was your EV ride?
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              Your feedback helps keep EVzone safe and high quality
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Rating card */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.8 }}>
          <Box sx={{ textAlign: "center", mb: 1.5 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              Rate your driver
            </Typography>
            <Rating
              value={rating}
              onChange={(e, value) => setRating(value)}
              precision={1}
              size="large"
              sx={{ mt: 0.5 }}
            />
            <Typography
              variant="caption"
              sx={{ mt: 0.5, display: "block", fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              {rating === 0 && "Tap a star to rate"}
              {rating >= 4 && "Great! Tell us what went well"}
              {rating > 0 && rating < 4 && "Sorry it wasn’t perfect. What should we improve?"}
            </Typography>
          </Box>

          {/* Tags */}
          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              color: (theme) => theme.palette.text.secondary,
              mb: 1
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
                  icon={
                    active ? (
                      <InsertEmoticonRoundedIcon sx={{ fontSize: 14 }} />
                    ) : undefined
                  }
                  sx={{
                    borderRadius: 999,
                    fontSize: 11,
                    height: 26,
                    bgcolor: active
                      ? "primary.main"
                      : (theme) =>
                          theme.palette.mode === "light"
                            ? "#F3F4F6"
                            : "rgba(15,23,42,0.96)",
                    color: active
                      ? "#020617"
                      : (theme) => theme.palette.text.primary,
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
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.6 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
          >
            Anything else you’d like to share? (optional)
          </Typography>
          <TextField
            multiline
            minRows={3}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your ride, good or bad…"
            sx={{
              mt: 0.75,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (theme) =>
                    theme.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": {
                  borderColor: "primary.main"
                }
              }
            }}
          />
        </CardContent>
      </Card>

      <Stack direction="row" spacing={1.25}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<SentimentDissatisfiedRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{
            borderRadius: 999,
            py: 1,
            fontSize: 14,
            textTransform: "none"
          }}
        >
          Report a serious issue
        </Button>
        <Button
          fullWidth
          variant="contained"
          disabled={!canSubmit}
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
      </Stack>
    </Box>
  );
}

export default function RiderScreen31RideRatingFeedbackCanvas_v2() {
      return (
    
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (theme) => theme.palette.background.default
        }}
      >
        

        <DarkModeToggle />

        

        <MobileShell>
          <RideRatingFeedbackScreen />
        </MobileShell>
      </Box>
    
  );
}
