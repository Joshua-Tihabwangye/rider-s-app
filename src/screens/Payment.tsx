import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Card,
  CardContent,
  Chip
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import { uiTokens } from "../design/tokens";
import { PAYMENT_METHODS, PaymentMethodId, resolveRideFare } from "./paymentGatewayData";

interface PaymentMethodCardProps {
  method: (typeof PAYMENT_METHODS)[number];
  selected: PaymentMethodId | null;
  onSelect: (id: PaymentMethodId) => void;
}

function PaymentMethodCard({ method, selected, onSelect }: PaymentMethodCardProps): React.JSX.Element {
  const theme = useTheme();
  const isActive = selected === method.id;

  return (
    <Card
      elevation={0}
      onClick={() => onSelect(method.id)}
      sx={{
        mb: 1.25,
        borderRadius: 2,
        cursor: "pointer",
        transition: "all 0.18s ease",
        bgcolor: theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: isActive
          ? `1.5px solid ${method.accent}`
          : theme.palette.mode === "light"
          ? "1px solid rgba(209,213,219,0.9)"
          : "1px solid rgba(51,65,85,0.9)",
        boxShadow: isActive ? "0 8px 20px rgba(15,23,42,0.10)" : "none",
        transform: isActive ? "translateY(-1px)" : "none"
      }}
    >
      <CardContent sx={{ px: 2, py: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.25 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                bgcolor: `${method.accent}1A`,
                color: method.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {method.icon}
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 14 }}>
                {method.name}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11.5, color: theme.palette.text.secondary }}>
                {method.detail}
              </Typography>
            </Box>
          </Box>

          {isActive ? (
            <CheckCircleRoundedIcon sx={{ color: method.accent, fontSize: 22 }} />
          ) : (
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                border:
                  theme.palette.mode === "light"
                    ? "1.5px solid rgba(156,163,175,0.9)"
                    : "1.5px solid rgba(148,163,184,0.8)"
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

function PaymentMethodSelectionScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const rideData = ((location.state as Record<string, unknown> | null) ?? {});

  const [selected, setSelected] = useState<PaymentMethodId | null>(PAYMENT_METHODS[0].id);
  const fare = resolveRideFare(rideData);

  const handleGatewaySelect = (gatewayId: PaymentMethodId): void => {
    setSelected(gatewayId);
  };

  const handleContinue = (): void => {
    if (!selected) return;

    navigate(`/rides/payment/gateway/${selected}`, {
      state: {
        ...rideData,
        totalFare: fare
      }
    });
  };

  return (
    <ScreenScaffold>
      <SectionHeader
        title="Payment"
        subtitle="Choose gateway to complete"
        action={
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: theme.palette.text.secondary, display: "block" }}
            >
              Total
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.02em", fontSize: 18 }}>
              {fare}
            </Typography>
          </Box>
        }
        leadingAction={
          <IconButton
            size="small"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 5,
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

      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          border:
            theme.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)",
          bgcolor: theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          overflow: "hidden"
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.35,
            background:
              theme.palette.mode === "light"
                ? "linear-gradient(135deg, #0B1220 0%, #111827 100%)"
                : "linear-gradient(135deg, #111827 0%, #020617 100%)"
          }}
        >
          <Typography variant="subtitle2" sx={{ color: "#F8FAFC", fontWeight: 700 }}>
            Secure trip checkout
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(241,245,249,0.85)", fontSize: 11.5 }}>
            Tap one gateway below to complete payment and finish this trip.
          </Typography>
        </Box>

        <CardContent sx={{ px: 2, py: 1.5 }}>
          <Box sx={{ mb: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Chip label="Encrypted" size="small" sx={{ height: 24, borderRadius: 1.5 }} />
            <Typography variant="caption" sx={{ fontSize: 11.5, color: theme.palette.text.secondary }}>
              Gateway opens on the next step
            </Typography>
          </Box>

          {PAYMENT_METHODS.map((pm) => (
            <PaymentMethodCard
              key={pm.id}
              method={pm}
              selected={selected}
              onSelect={handleGatewaySelect}
            />
          ))}

          <Button
            fullWidth
            variant="contained"
            onClick={handleContinue}
            disabled={!selected}
            sx={{
              mt: 1,
              minHeight: 46,
              borderRadius: 2.25,
              textTransform: "none",
              fontWeight: 700,
              bgcolor: "#03CD8C",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#02b377",
                boxShadow: "none"
              }
            }}
          >
            Continue to secure payment
          </Button>
        </CardContent>
      </Card>
    </ScreenScaffold>
  );
}

export default function RiderScreen21PaymentMethodSelectionCanvas_v2() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (theme) => theme.palette.background.default
      }}
    >
      <PaymentMethodSelectionScreen />
    </Box>
  );
}
