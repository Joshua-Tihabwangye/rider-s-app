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
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import StarsRoundedIcon from "@mui/icons-material/StarsRounded";
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

const TIP_AMOUNTS = [2000, 3000, 5000];

function RideRatingTipScreen() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [tip, setTip] = useState(3000);
  const [customTip, setCustomTip] = useState("");
  const [comment, setComment] = useState("");

  const effectiveTip = customTip ? Number(customTip) || 0 : tip;
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
              Rate your driver & add a tip
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              100% of tips go to the driver
            </Typography>
          </Box>
        </Box>
      </Box>

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
              {rating >= 4
                ? "Thanks for the great rating!"
                : rating > 0
                ? "Tell us what could be better."
                : "Tap a star to rate"}
            </Typography>
          </Box>

          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              color: (theme) => theme.palette.text.secondary,
              mb: 1
            }}
          >
            Would you like to tip Bwanbale Kato?
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
            {TIP_AMOUNTS.map((amount) => {
              const active = !customTip && tip === amount;
              return (
                <Chip
                  key={amount}
                  label={`UGX ${amount.toLocaleString()}`}
                  onClick={() => {
                    setTip(amount);
                    setCustomTip("");
                  }}
                  size="small"
                  icon={
                    active ? (
                      <EmojiEventsRoundedIcon sx={{ fontSize: 16 }} />
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
            <Chip
              label="Custom"
              size="small"
              onClick={() => setCustomTip(customTip || "5000")}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 26,
                bgcolor: customTip
                  ? "primary.main"
                  : (theme) =>
                      theme.palette.mode === "light"
                        ? "#F3F4F6"
                        : "rgba(15,23,42,0.96)",
                color: customTip
                  ? "#020617"
                  : (theme) => theme.palette.text.primary
              }}
            />
          </Stack>

          {customTip && (
            <TextField
              fullWidth
              size="small"
              label="Custom tip amount (UGX)"
              value={customTip}
              onChange={(e) => setCustomTip(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 999,
                  bgcolor: (theme) =>
                    theme.palette.mode === "light"
                      ? "#F9FAFB"
                      : "rgba(15,23,42,0.96)",
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
          )}

          <Typography
            variant="caption"
            sx={{
              mt: 1.25,
              display: "block",
              fontSize: 11,
              color: (theme) => theme.palette.text.secondary
            }}
          >
            Your tip will be charged together with your trip, using the same
            payment method.
          </Typography>
        </CardContent>
      </Card>

      {/* Optional comment */}
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
            Leave a note for your driver (optional)
          </Typography>
          <TextField
            multiline
            minRows={2}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Thank you for the ride…"
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

      <Button
        fullWidth
        variant="contained"
        disabled={!canSubmit}
        startIcon={<StarsRoundedIcon sx={{ fontSize: 18 }} />}
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
        Submit rating & tip (UGX {effectiveTip.toLocaleString() || 0})
      </Button>
    </Box>
  );
}

export default function RiderScreen32RideRatingTipCanvas_v2() {
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
          <RideRatingTipScreen />
        </MobileShell>
      </Box>
    
  );
}
