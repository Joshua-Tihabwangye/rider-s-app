import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Rating,
  Snackbar,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import StarsRoundedIcon from "@mui/icons-material/StarsRounded";
import SportsMotorsportsRoundedIcon from "@mui/icons-material/SportsMotorsportsRounded";
import { useAppData } from "../contexts/AppDataContext";
import type { RideFeedbackTagId } from "../store/types";

interface FeedbackTag {
  id: RideFeedbackTagId;
  label: string;
  icon: React.ReactNode;
}

const FEEDBACK_TAG_ICONS: Record<RideFeedbackTagId, React.ReactNode> = {
  driving: <SportsMotorsportsRoundedIcon sx={{ fontSize: 22 }} />,
  punctuality: <AccessTimeRoundedIcon sx={{ fontSize: 22 }} />,
  vehicle: <DirectionsCarFilledRoundedIcon sx={{ fontSize: 22 }} />,
  safety: <ShieldRoundedIcon sx={{ fontSize: 22 }} />,
  courtesy: <PersonRoundedIcon sx={{ fontSize: 22 }} />,
  overall: <StarsRoundedIcon sx={{ fontSize: 22 }} />
};

function ratingLabel(value: number): string {
  if (value >= 5) return "Excellent!";
  if (value >= 4) return "Great ride";
  if (value >= 3) return "Good";
  if (value >= 2) return "Could be better";
  if (value >= 1) return "Needs improvement";
  return "Tap a star to rate";
}

function RideRatingFeedbackScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { ride } = useAppData();
  const ratingWorkflow = ride.workflow.rating;
  const feedbackTags = useMemo<FeedbackTag[]>(
    () =>
      ratingWorkflow.feedbackTags.map((tag) => ({
        ...tag,
        icon: FEEDBACK_TAG_ICONS[tag.id]
      })),
    [ratingWorkflow.feedbackTags]
  );

  const driver = ride.activeTrip?.driver;
  const vehicle = ride.activeTrip?.vehicle;

  const driverName =
    (typeof location.state?.driverName === "string" && location.state.driverName) ||
    driver?.name ||
    ratingWorkflow.defaultDriverName;
  const plate = vehicle?.plate || ratingWorkflow.defaultVehiclePlate;
  const initials = useMemo(() => {
    const parts = driverName
      .split(" ")
      .map((part) => part.trim()[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("");
    return parts || "DR";
  }, [driverName]);

  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState("");
  const [selectedTags, setSelectedTags] = useState<RideFeedbackTagId[]>([
    feedbackTags[0]?.id ?? "driving"
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const companyOrange = "#F79009";
  const companyOrangeSoft = "rgba(247,144,9,0.14)";

  const canSubmit = rating > 0 && !isSubmitting;

  const toggleTag = (id: RideFeedbackTagId): void => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (): Promise<void> => {
    if (!canSubmit) return;
    setIsSubmitting(true);

    const payload = {
      ride_id: location.state?.rideId || ride.activeTrip?.id || ratingWorkflow.defaultRideId,
      rating,
      tags: selectedTags,
      message: feedback || null
    };

    try {
      console.log("Submitting feedback:", payload);
      setShowSuccessToast(true);
      const returnTo =
        typeof location.state?.returnTo === "string" && location.state.returnTo.trim()
          ? location.state.returnTo
          : location.state?.tripCompleted
            ? "/rides/trip/completed"
            : "/home";
      setTimeout(() => {
        navigate(returnTo, { replace: true });
      }, ratingWorkflow.submitRedirectDelayMs);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F8FAFC", pb: 1.5 }}>
      <Box
        sx={{
          px: { xs: 2, md: 2.5 },
          pt: { xs: 1.75, md: 2 }
        }}
      >
        <Box sx={{ position: "relative", minHeight: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconButton
            size="small"
            onClick={() => navigate(-1)}
            sx={{
              position: "absolute",
              left: 0,
              width: 40,
              height: 40,
              borderRadius: 999,
              bgcolor: "#FFFFFF",
              border: `1px solid ${companyOrangeSoft}`,
              boxShadow: "0 8px 18px rgba(15,23,42,0.09)",
              color: "#0F172A"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: 20,
              letterSpacing: "-0.01em",
              color: "#111827",
              textDecoration: `underline 2px ${companyOrange}`,
              textUnderlineOffset: "6px",
              textDecorationThickness: "1.5px"
            }}
          >
            Rate your driver
          </Typography>
        </Box>

        <Stack spacing={1.6} sx={{ mt: 1.6 }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ position: "relative" }}>
              <Avatar
                sx={{
                  width: 108,
                  height: 108,
                  bgcolor: "#D1FAE5",
                  color: "#047857",
                  fontSize: 34,
                  fontWeight: 700,
                  border: "3px solid #FFFFFF",
                  boxShadow: "0 8px 18px rgba(15,23,42,0.10), 0 0 0 2px rgba(247,144,9,0.25)"
                }}
              >
                {initials}
              </Avatar>
              <Box
                sx={{
                  position: "absolute",
                  right: 6,
                  bottom: 6,
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  bgcolor: companyOrange,
                  border: "2px solid #FFFFFF"
                }}
              />
            </Box>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827", fontSize: 33 }}>
              {driverName}
            </Typography>
            <Typography variant="h6" sx={{ color: "#64748B", fontWeight: 500, mt: 0.2, fontSize: 17 }}>
              {plate}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 0.25 }}>
            <Rating
              value={rating}
              onChange={(_event, nextValue) => setRating(nextValue ?? 0)}
              size="large"
              sx={{
                "& .MuiRating-iconFilled": { color: "#22C55E" },
                "& .MuiRating-iconEmpty": { color: "rgba(148,163,184,0.75)" },
                "& .MuiRating-icon": { fontSize: 42, mx: 0.02 }
              }}
            />
          </Box>

          <Typography sx={{ textAlign: "center", color: companyOrange, fontWeight: 700, fontSize: 16 }}>
            {ratingLabel(rating)}
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827", mt: 0.1, fontSize: 19 }}>
            What did you like?
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 1
            }}
          >
            {feedbackTags.map((tag) => {
              const active = selectedTags.includes(tag.id);
              return (
                <Card
                  key={tag.id}
                  elevation={0}
                  onClick={() => toggleTag(tag.id)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 2.5,
                    border: active ? `1.5px solid ${companyOrange}` : "1px solid rgba(148,163,184,0.24)",
                    bgcolor: active ? "rgba(247,144,9,0.10)" : "#FFFFFF",
                    boxShadow: active ? "0 8px 16px rgba(247,144,9,0.18)" : "none"
                  }}
                >
                  <CardContent sx={{ px: 0.9, py: 1.2, textAlign: "center", "&:last-child": { pb: 1.2 } }}>
                    <Box sx={{ color: active ? companyOrange : "#64748B", mb: 0.45 }}>{tag.icon}</Box>
                    <Typography sx={{ fontWeight: 500, fontSize: 14, color: active ? "#B45309" : "#475569" }}>
                      {tag.label}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>

          <Card
            elevation={0}
            sx={{
              borderRadius: 2.5,
              border: `1px solid ${companyOrangeSoft}`,
              bgcolor: "#FFFFFF"
            }}
          >
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.1, fontSize: 19 }}>
                Add a comment (optional)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2.5}
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                placeholder="Tell us more about your experience"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "#F8FAFC",
                    fontSize: 14,
                    "& fieldset": { borderColor: "rgba(148,163,184,0.34)" },
                    "&:hover fieldset": { borderColor: companyOrange },
                    "&.Mui-focused fieldset": { borderColor: companyOrange }
                  }
                }}
              />
            </CardContent>
          </Card>

          <Button
            fullWidth
            disabled={!canSubmit}
            variant="contained"
            onClick={handleSubmit}
            sx={{
              mt: 0.3,
              height: 52,
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 700,
              fontSize: 17,
              bgcolor: "#10B981",
              boxShadow: "0 8px 18px rgba(16,185,129,0.3), 0 0 0 2px rgba(247,144,9,0.2)",
              "&:hover": { bgcolor: "#059669" },
              "&.Mui-disabled": {
                bgcolor: "rgba(148,163,184,0.5)",
                color: "#FFFFFF"
              }
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit rating"}
          </Button>
        </Stack>
      </Box>

      <Snackbar
        open={showSuccessToast}
        autoHideDuration={2200}
        onClose={() => setShowSuccessToast(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowSuccessToast(false)}
          severity="success"
          sx={{
            width: "100%",
            bgcolor: "#16A34A",
            color: "#FFFFFF",
            "& .MuiAlert-icon": { color: "#FFFFFF" }
          }}
        >
          Thank you for your feedback!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function RiderScreen35RateDriverAddTipDedicatedCanvas_v2(): React.JSX.Element {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (theme) => theme.palette.background.default
      }}
    >
      <RideRatingFeedbackScreen />
    </Box>
  );
}
