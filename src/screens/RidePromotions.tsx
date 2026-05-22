import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Snackbar,
  Alert
} from "@mui/material";
import ScreenScaffold from "../components/ScreenScaffold";
import PageHeader from "../components/PageHeader";
import { uiTokens } from "../design/tokens";

import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

const PROMOTIONS = [
  {
    id: "promo1",
    code: "EVFIRST25",
    title: "25% off your first EV ride",
    desc: "Valid for new users — first ride only",
    discount: "25%",
    expiry: "31 Dec 2026",
    status: "active" as const,
    maxSaving: "UGX 15,000",
    vehicleImage: "/rides-ui/hero-scooter.svg"
  },
  {
    id: "promo2",
    code: "WEEKEND10",
    title: "10% off weekend rides",
    desc: "Valid Friday 6 PM – Sunday midnight",
    discount: "10%",
    expiry: "30 Jun 2026",
    status: "active" as const,
    maxSaving: "UGX 8,000",
    vehicleImage: "/rides-ui/hero-car-mid.svg"
  },
  {
    id: "promo3",
    code: "GOGREEN50",
    title: "UGX 5,000 off — Go Green campaign",
    desc: "Flat discount on any EV ride over UGX 20,000",
    discount: "UGX 5,000",
    expiry: "15 Mar 2026",
    status: "expired" as const,
    maxSaving: "UGX 5,000",
    vehicleImage: "/rides-ui/hero-car-large.svg"
  }
];

const REFERRAL_CODE = "EVZONE-SR2026";
const REFERRAL_REWARD = "UGX 10,000";

export default function RidePromotions(): React.JSX.Element {
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState("");
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all");

  const filteredPromos = filter === "all" ? PROMOTIONS : PROMOTIONS.filter((p) => p.status === filter);

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const found = PROMOTIONS.find((p) => p.code.toLowerCase() === promoInput.trim().toLowerCase() && p.status === "active");
    if (found) {
      setSnackbar({ open: true, message: `Promo "${found.code}" applied! ${found.title}`, severity: "success" });
      setPromoInput("");
    } else {
      setSnackbar({ open: true, message: "Invalid or expired promo code. Please try again.", severity: "error" });
    }
  };

  const handleCopyReferral = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(REFERRAL_CODE).then(() => {
        setSnackbar({ open: true, message: "Referral code copied!", severity: "success" });
      }).catch(() => {});
    }
  };

  const handleShareReferral = () => {
    const shareData = {
      title: "Join EVzone",
      text: `Use my referral code ${REFERRAL_CODE} and get ${REFERRAL_REWARD} off your first EV ride!`,
      url: `https://evzone.app/refer/${REFERRAL_CODE}`
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      handleCopyReferral();
    }
  };

  return (
    <ScreenScaffold
      header={<PageHeader title="Ride Promotions" subtitle="Special offers and discounts" />}
    >
      {/* Apply promo code */}
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) => t.palette.mode === "light"
            ? "radial-gradient(circle at top, #BBF7D0 0%, #ECFDF5 70%, #FED7AA 100%)"
            : "radial-gradient(circle at top, #065F46, #052E16)",
          border: (t) => t.palette.mode === "light"
            ? "1px solid rgba(22,163,74,0.45)"
            : "1px solid rgba(22,163,74,0.7)"
        }}
      >
        <CardContent sx={{ px: { xs: 1.5, sm: 1.9 }, py: { xs: 1.5, sm: 1.7 } }}>
          <Typography variant="caption" sx={{ fontSize: 12, color: (t) => t.palette.text.secondary, mb: 0.5, display: "block", fontWeight: 600 }}>
            Have a promo code?
          </Typography>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <TextField
              fullWidth
              size="small"
              placeholder="Enter promo code"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocalOfferRoundedIcon sx={{ fontSize: 18, color: "#F97316" }} />
                  </InputAdornment>
                )
              }}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: uiTokens.radius.xl, fontSize: 14, bgcolor: "rgba(255,255,255,0.78)" }
              }}
            />
            <Button
              variant="contained"
              onClick={handleApplyPromo}
              sx={{
                borderRadius: uiTokens.radius.xl,
                px: 2.5,
                py: 0.9,
                fontSize: 13,
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "#16A34A",
                color: "#FFFFFF",
                whiteSpace: "nowrap",
                "&:hover": { bgcolor: "#15803D" }
              }}
            >
              Apply
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Filter chips */}
      <Stack direction="row" spacing={1}>
        {(["all", "active", "expired"] as const).map((f) => (
          <Chip
            key={f}
            label={f.charAt(0).toUpperCase() + f.slice(1)}
            size="small"
            onClick={() => setFilter(f)}
            sx={{
              borderRadius: 5, fontSize: 12, height: 28,
              border: "1px solid",
              borderColor: filter === f ? "rgba(22,163,74,0.55)" : "rgba(209,213,219,0.85)",
              bgcolor: filter === f ? "rgba(22,163,74,0.12)" : (t) => t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
              color: filter === f ? "#166534" : (t) => t.palette.text.primary,
              fontWeight: filter === f ? 700 : 500
            }}
          />
        ))}
      </Stack>

      {/* Promotions list */}
      <Box>
        <Typography variant="caption" sx={{ fontSize: 12, color: (t) => t.palette.text.secondary, mb: 0.75, display: "block", fontWeight: 600 }}>
          {filter === "all" ? "All promotions" : filter === "active" ? "Active promotions" : "Expired promotions"}
        </Typography>

        {filteredPromos.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              borderRadius: uiTokens.radius.xl,
              bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
              border: (t) => t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <CardContent sx={{ px: { xs: 1.5, sm: 1.75 }, py: 2 }}>
              <Typography variant="body2" sx={{ fontSize: 12, color: (t) => t.palette.text.secondary, textAlign: "center" }}>
                No {filter} promotions available right now.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={1}>
            {filteredPromos.map((promo) => (
              <Card
                key={promo.id}
                elevation={0}
                sx={{
                  borderRadius: uiTokens.radius.xl,
                  bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                  border: (t) => t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                  borderLeft: promo.status === "active" ? "3px solid #16A34A" : "3px solid rgba(148,163,184,0.7)",
                  opacity: promo.status === "expired" ? 0.62 : 1
                }}
              >
                <CardContent sx={{ px: { xs: 1.5, sm: 1.75 }, py: { xs: 1.35, sm: 1.5 } }}>
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={0.75}>
                        <Typography variant="body2" sx={{ fontSize: 13.8, fontWeight: 700, letterSpacing: "-0.01em", pr: 0.5 }}>
                          {promo.title}
                        </Typography>
                        <Chip
                          size="small"
                          label={promo.code}
                          sx={{
                            fontSize: 11,
                            height: 24,
                            borderRadius: 5,
                            fontWeight: 700,
                            bgcolor: promo.status === "active" ? "rgba(249,115,22,0.15)" : "rgba(148,163,184,0.15)",
                            color: promo.status === "active" ? "#C2410C" : (t) => t.palette.text.secondary,
                            border: promo.status === "active" ? "1px solid rgba(249,115,22,0.35)" : "none"
                          }}
                        />
                      </Stack>

                      <Typography variant="caption" sx={{ fontSize: 11.5, color: (t) => t.palette.text.secondary, display: "block", mt: 0.2 }}>
                        {promo.desc}
                      </Typography>

                      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.5 }}>
                        <CalendarMonthRoundedIcon sx={{ fontSize: 15, color: "#F97316" }} />
                        <Typography variant="caption" sx={{ fontSize: 11.2, color: (t) => t.palette.text.secondary }}>
                          {promo.status === "expired" ? "Expired" : `Expires ${promo.expiry}`} • Max saving: {promo.maxSaving}
                        </Typography>
                      </Stack>

                      {promo.status === "active" && (
                        <Button
                          size="small"
                          startIcon={<DirectionsCarFilledRoundedIcon sx={{ fontSize: 14 }} />}
                          onClick={() => navigate("/rides/enter")}
                          sx={{
                            mt: 0.65,
                            textTransform: "none",
                            fontSize: 12.2,
                            fontWeight: 700,
                            color: "#16A34A",
                            px: 0
                          }}
                        >
                          Book a ride with this promo
                        </Button>
                      )}
                    </Box>

                    <Box
                      component="img"
                      src={promo.vehicleImage}
                      alt={promo.title}
                      sx={{
                        width: 88,
                        height: 62,
                        objectFit: "contain",
                        borderRadius: uiTokens.radius.md,
                        bgcolor: (t) => t.palette.mode === "light" ? "#F0FDF4" : "rgba(22,101,52,0.35)",
                        p: 0.4,
                        flexShrink: 0
                      }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>

      {/* Referral section */}
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) => t.palette.mode === "light" ? "#F0FDF4" : "rgba(15,23,42,0.98)",
          border: (t) => t.palette.mode === "light"
            ? "1px dashed rgba(22,163,74,0.55)"
            : "1px dashed rgba(22,163,74,0.7)"
        }}
      >
        <CardContent sx={{ px: { xs: 1.5, sm: 1.75 }, py: { xs: 1.5, sm: 1.6 } }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <PersonAddRoundedIcon sx={{ fontSize: 18, color: "#F97316" }} />
            <Typography variant="caption" sx={{ fontSize: 12, color: (t) => t.palette.text.secondary, fontWeight: 600 }}>
              Refer friends & earn
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ fontSize: 13.5, fontWeight: 700, mb: 0.25 }}>
            Give {REFERRAL_REWARD}, get {REFERRAL_REWARD}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11.2, color: (t) => t.palette.text.secondary, display: "block", mb: 1 }}>
            Share your code. When a friend signs up and completes a ride, you both earn {REFERRAL_REWARD}.
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Chip
              label={REFERRAL_CODE}
              size="small"
              sx={{
                fontSize: 12.8, fontWeight: 700, height: 30, borderRadius: 5,
                bgcolor: "rgba(22,163,74,0.12)", color: "#166534",
                letterSpacing: "0.04em"
              }}
            />
            <Button
              size="small"
              startIcon={<ContentCopyRoundedIcon sx={{ fontSize: 14 }} />}
              onClick={handleCopyReferral}
              sx={{ textTransform: "none", fontSize: 12, minWidth: "auto", color: "#16A34A", fontWeight: 700 }}
            >
              Copy
            </Button>
          </Stack>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<ShareRoundedIcon />}
            onClick={handleShareReferral}
            sx={{
              borderRadius: uiTokens.radius.xl,
              py: 0.85,
              fontSize: 14,
              textTransform: "none",
              borderColor: "rgba(22,163,74,0.6)",
              color: "#166534",
              fontWeight: 700,
              "&:hover": {
                borderColor: "#15803D",
                bgcolor: "rgba(22,163,74,0.08)"
              }
            }}
          >
            Share referral link
          </Button>
        </CardContent>
      </Card>

      <Typography variant="caption" sx={{ fontSize: 11.2, color: (t) => t.palette.text.secondary, mt: 1, display: "block" }}>
        Promotions are applied automatically at checkout. Referral rewards are credited to your EVzone Wallet after your friend completes their first ride.
      </Typography>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ borderRadius: uiTokens.radius.xl, width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ScreenScaffold>
  );
}
