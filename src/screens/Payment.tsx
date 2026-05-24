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
  Chip,
  Stack
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import FlashOnRoundedIcon from "@mui/icons-material/FlashOnRounded";

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
        mb: uiTokens.spacing.sm,
        borderRadius: uiTokens.radius.md,
        cursor: "pointer",
        transition: "all 0.2s ease",
        bgcolor: theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: isActive
          ? `1.5px solid ${method.accent}`
          : theme.palette.mode === "light"
          ? "1px solid rgba(209,213,219,0.9)"
          : "1px solid rgba(51,65,85,0.9)",
        boxShadow: isActive ? "0 14px 28px rgba(15,23,42,0.12)" : "none",
        transform: isActive ? "translateY(-1px)" : "none"
      }}
    >
      <CardContent sx={{ px: uiTokens.spacing.md, py: uiTokens.spacing.smPlus }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: uiTokens.spacing.smPlus }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.smPlus }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: uiTokens.radius.sm,
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
              <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.xs }}>
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 14 }}>
                  {method.name}
                </Typography>
                {method.id === "wallet" && (
                  <Chip
                    label="Recommended"
                    size="small"
                    sx={{
                      height: 19,
                      borderRadius: uiTokens.radius.pill,
                      fontSize: 9.5,
                      fontWeight: 700,
                      bgcolor: "rgba(247,144,9,0.14)",
                      color: "#B45309"
                    }}
                  />
                )}
              </Box>
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
  const companyOrange = uiTokens.colors.accent;
  const companyGreen = uiTokens.colors.brand;
  const rideData = ((location.state as Record<string, unknown> | null) ?? {});

  const [selected, setSelected] = useState<PaymentMethodId | null>(PAYMENT_METHODS[0]?.id ?? null);
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
      <Stack spacing={uiTokens.spacing.md}>
        <SectionHeader
          title="Trip payment"
          subtitle="Choose how you want to pay"
          action={
            <Box sx={{ textAlign: "right" }}>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: theme.palette.text.secondary, display: "block" }}
              >
                Total fare
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

        <Card
          elevation={0}
          sx={{
            position: "relative",
            borderRadius: uiTokens.radius.xl,
            overflow: "hidden",
            border: "1px solid rgba(3,205,140,0.28)",
            background:
              theme.palette.mode === "light"
                ? "linear-gradient(140deg, #111827 0%, #1F2937 58%, #065F46 145%)"
                : "linear-gradient(140deg, #0B1120 0%, #111827 55%, #064E3B 145%)"
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -46,
              right: -54,
              width: 160,
              height: 160,
              borderRadius: "50%",
              bgcolor: "rgba(3,205,140,0.22)"
            }}
          />
          <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.lg, position: "relative" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
                gap: uiTokens.spacing.md,
                alignItems: "center"
              }}
            >
              <Box>
                <Stack direction="row" spacing={uiTokens.spacing.sm} alignItems="center" sx={{ mb: uiTokens.spacing.sm }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: uiTokens.radius.sm,
                      bgcolor: companyGreen,
                      display: "grid",
                      placeItems: "center"
                    }}
                  >
                    <FlashOnRoundedIcon sx={{ fontSize: 18, color: "#FFFFFF" }} />
                  </Box>
                  <Typography sx={{ color: "#FFFFFF", fontWeight: 800, letterSpacing: "0.02em" }}>
                    EVzone Pay
                  </Typography>
                </Stack>
                <Typography sx={{ color: "#FFFFFF", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>
                  Secure ride checkout
                </Typography>
                <Typography sx={{ color: "rgba(241,245,249,0.86)", fontSize: 12.5, mt: uiTokens.spacing.xs }}>
                  Protected gateway with encrypted transaction flow for your trip payment.
                </Typography>

                <Stack direction="row" spacing={uiTokens.spacing.xs} sx={{ mt: uiTokens.spacing.md }}>
                  <Chip
                    icon={<LockRoundedIcon sx={{ fontSize: 14 }} />}
                    label="Encrypted"
                    size="small"
                    sx={{
                      height: 24,
                      borderRadius: uiTokens.radius.pill,
                      bgcolor: "rgba(3,205,140,0.18)",
                      color: "#86EFAC"
                    }}
                  />
                  <Chip
                    icon={<VerifiedUserRoundedIcon sx={{ fontSize: 14 }} />}
                    label="EVzone verified"
                    size="small"
                    sx={{
                      height: 24,
                      borderRadius: uiTokens.radius.pill,
                      bgcolor: "rgba(255,255,255,0.10)",
                      color: "#E2E8F0"
                    }}
                  />
                </Stack>
              </Box>

              <Box
                component="img"
                src="/rides-ui/payment.avif"
                alt="EVzone payment"
                sx={{
                  width: { xs: 84, sm: 96 },
                  maxWidth: { xs: 84, sm: 96 },
                  justifySelf: { xs: "start", sm: "end" },
                  borderRadius: uiTokens.radius.md,
                  objectFit: "cover",
                  border: "1px solid rgba(255,255,255,0.14)",
                  boxShadow: "0 12px 24px rgba(2,6,23,0.45)"
                }}
              />
            </Box>
          </CardContent>
        </Card>

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
              px: uiTokens.spacing.lg,
              py: uiTokens.spacing.md,
              borderBottom: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(229,231,235,0.9)"
                  : "1px solid rgba(51,65,85,0.8)",
              background: (t) =>
                t.palette.mode === "light"
                  ? "linear-gradient(180deg, rgba(255,247,237,0.95) 0%, rgba(255,255,255,1) 100%)"
                  : "linear-gradient(180deg, rgba(124,45,18,0.22) 0%, rgba(15,23,42,0.98) 100%)"
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: 14.5 }}>
              Choose a payment method
            </Typography>
            <Typography sx={{ fontSize: 12, color: (t) => t.palette.text.secondary }}>
              Select one option to continue to the secure gateway.
            </Typography>
          </Box>

          <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.md }}>
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
                mt: uiTokens.spacing.md,
                minHeight: 48,
                borderRadius: uiTokens.radius.md,
                textTransform: "none",
                fontWeight: 800,
                letterSpacing: "0.01em",
                bgcolor: companyGreen,
                boxShadow: "0 10px 22px rgba(3,205,140,0.32)",
                "&:hover": {
                  bgcolor: uiTokens.colors.brandHover,
                  boxShadow: "0 12px 24px rgba(2,179,119,0.34)"
                },
                "&:disabled": {
                  bgcolor: "rgba(148,163,184,0.8)",
                  color: "#FFFFFF"
                }
              }}
            >
              Continue to secure payment
            </Button>
          </CardContent>
        </Card>
      </Stack>
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
