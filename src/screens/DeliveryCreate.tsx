import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";
import type { DeliveryDraft, RideLocation } from "../store/types";

const CREATION_STEPS = [
  "Pickup & dropoff",
  "Parcel",
  "Recipient",
  "Timing",
  "Payment preview",
  "Confirm"
] as const;

const PARCEL_TYPES = [
  { value: "documents", label: "Documents" },
  { value: "food", label: "Food" },
  { value: "electronics", label: "Electronics" },
  { value: "fashion", label: "Fashion" },
  { value: "fragile", label: "Fragile" },
  { value: "other", label: "Other" }
] as const;

const PARCEL_SIZES = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "x_large", label: "Extra Large" }
] as const;

function toLocation(address: string): RideLocation | null {
  const trimmed = address.trim();
  if (!trimmed) {
    return null;
  }

  return {
    label: trimmed.split(",")[0]?.trim() || trimmed,
    address: trimmed,
    coordinates: { lat: 0.3136, lng: 32.5811 }
  };
}

function formatCurrency(amount: number): string {
  return `UGX ${Math.round(amount).toLocaleString()}`;
}

function canProceed(step: number, draft: DeliveryDraft): boolean {
  if (step === 0) {
    return Boolean(draft.pickup?.address && draft.dropoff?.address);
  }
  if (step === 1) {
    return Boolean(draft.parcel.description.trim()) && draft.parcel.value > 0;
  }
  if (step === 2) {
    return Boolean(draft.recipient?.name && draft.recipient?.phone && draft.recipient?.address);
  }
  if (step === 3) {
    return draft.schedule === "now" || Boolean(draft.scheduleTime);
  }
  if (step === 4) {
    return Boolean(draft.paymentMethodId);
  }
  return true;
}

export default function DeliveryCreate(): React.JSX.Element {
  const navigate = useNavigate();
  const { delivery, paymentMethods, actions } = useAppData();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [submitError, setSubmitError] = useState<string>("");

  const draft = delivery.draft;
  const subtotal = draft.deliveryFee + draft.serviceFee + draft.insuranceFee;

  const selectedPaymentMethod = useMemo(
    () => paymentMethods.find((method) => method.id === draft.paymentMethodId) ?? paymentMethods[0] ?? null,
    [paymentMethods, draft.paymentMethodId]
  );

  const updateDraft = (patch: Partial<DeliveryDraft>): void => {
    actions.updateDeliveryDraft({
      ...patch,
      priceEstimate: formatCurrency(subtotal)
    });
  };

  const handleNext = (): void => {
    if (!canProceed(activeStep, draft)) {
      setSubmitError("Complete required fields before continuing.");
      return;
    }
    setSubmitError("");
    setActiveStep((prev) => Math.min(prev + 1, CREATION_STEPS.length - 1));
  };

  const handleBack = (): void => {
    setSubmitError("");
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleConfirm = (): void => {
    setSubmitError("");
    const order = actions.createDeliveryOrder();
    if (!order) {
      setSubmitError("Pickup, dropoff, parcel and recipient details are required.");
      return;
    }
    actions.setActiveDeliveryById(order.id);
    navigate(`/deliveries/tracking/${order.id}/details`);
  };

  return (
    <ScreenScaffold>
      <SectionHeader
        title="New delivery"
        subtitle="Create, price, and confirm a parcel delivery"
        leadingAction={
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: uiTokens.radius.xl,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
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
          <Stepper activeStep={activeStep} alternativeLabel>
            {CREATION_STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ borderRadius: uiTokens.radius.xl }}>
        <CardContent sx={{ display: "grid", gap: uiTokens.spacing.md }}>
          {activeStep === 0 && (
            <>
              <Stack direction="row" spacing={1} alignItems="center">
                <PlaceRoundedIcon sx={{ fontSize: 18, color: uiTokens.colors.brand }} />
                <Typography variant="subtitle2">Route details</Typography>
              </Stack>
              <TextField
                label="Pickup location"
                value={draft.pickup?.address ?? ""}
                onChange={(event) => updateDraft({ pickup: toLocation(event.target.value) })}
                placeholder="e.g. Plot 14, Nakasero Rd, Kampala"
                size="small"
                fullWidth
              />
              <TextField
                label="Dropoff location"
                value={draft.dropoff?.address ?? ""}
                onChange={(event) => updateDraft({ dropoff: toLocation(event.target.value) })}
                placeholder="e.g. 12, JJ Apartments, New Street, Kampala"
                size="small"
                fullWidth
              />
            </>
          )}

          {activeStep === 1 && (
            <>
              <Stack direction="row" spacing={1} alignItems="center">
                <Inventory2RoundedIcon sx={{ fontSize: 18, color: uiTokens.colors.brand }} />
                <Typography variant="subtitle2">Parcel details</Typography>
              </Stack>
              <TextField
                select
                label="Parcel type"
                size="small"
                value={draft.parcel.type}
                onChange={(event) =>
                  updateDraft({ parcel: { ...draft.parcel, type: event.target.value as DeliveryDraft["parcel"]["type"] } })
                }
                fullWidth
              >
                {PARCEL_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Parcel size"
                size="small"
                value={draft.parcel.size}
                onChange={(event) =>
                  updateDraft({ parcel: { ...draft.parcel, size: event.target.value as DeliveryDraft["parcel"]["size"] } })
                }
                fullWidth
              >
                {PARCEL_SIZES.map((size) => (
                  <MenuItem key={size.value} value={size.value}>
                    {size.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Parcel description"
                value={draft.parcel.description}
                onChange={(event) => updateDraft({ parcel: { ...draft.parcel, description: event.target.value } })}
                placeholder="e.g. Laptop & charger"
                size="small"
                fullWidth
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                <TextField
                  label="Declared value (UGX)"
                  type="number"
                  value={draft.parcel.value}
                  onChange={(event) =>
                    updateDraft({ parcel: { ...draft.parcel, value: Number(event.target.value) || 0 } })
                  }
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Weight (kg)"
                  type="number"
                  value={draft.parcel.weightKg ?? 0}
                  onChange={(event) =>
                    updateDraft({ parcel: { ...draft.parcel, weightKg: Number(event.target.value) || 0 } })
                  }
                  size="small"
                  fullWidth
                />
              </Stack>
            </>
          )}

          {activeStep === 2 && (
            <>
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonRoundedIcon sx={{ fontSize: 18, color: uiTokens.colors.brand }} />
                <Typography variant="subtitle2">Recipient contact</Typography>
              </Stack>
              <TextField
                label="Recipient name"
                value={draft.recipient?.name ?? ""}
                onChange={(event) =>
                  updateDraft({
                    recipient: {
                      name: event.target.value,
                      phone: draft.recipient?.phone ?? "",
                      address: draft.recipient?.address ?? ""
                    }
                  })
                }
                size="small"
                fullWidth
              />
              <TextField
                label="Recipient phone"
                value={draft.recipient?.phone ?? ""}
                onChange={(event) =>
                  updateDraft({
                    recipient: {
                      name: draft.recipient?.name ?? "",
                      phone: event.target.value,
                      address: draft.recipient?.address ?? ""
                    }
                  })
                }
                size="small"
                fullWidth
              />
              <TextField
                label="Recipient address"
                value={draft.recipient?.address ?? draft.dropoff?.address ?? ""}
                onChange={(event) =>
                  updateDraft({
                    recipient: {
                      name: draft.recipient?.name ?? "",
                      phone: draft.recipient?.phone ?? "",
                      address: event.target.value
                    }
                  })
                }
                size="small"
                fullWidth
              />
            </>
          )}

          {activeStep === 3 && (
            <>
              <Stack direction="row" spacing={1} alignItems="center">
                <ScheduleRoundedIcon sx={{ fontSize: 18, color: uiTokens.colors.brand }} />
                <Typography variant="subtitle2">Delivery timing</Typography>
              </Stack>
              <TextField
                select
                label="When should we deliver?"
                size="small"
                value={draft.schedule}
                onChange={(event) =>
                  updateDraft({ schedule: event.target.value as DeliveryDraft["schedule"] })
                }
                fullWidth
              >
                <MenuItem value="now">Now</MenuItem>
                <MenuItem value="scheduled">Schedule for later</MenuItem>
              </TextField>
              {draft.schedule === "scheduled" && (
                <TextField
                  label="Scheduled date & time"
                  type="datetime-local"
                  size="small"
                  value={draft.scheduleTime ?? ""}
                  onChange={(event) => updateDraft({ scheduleTime: event.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              )}
              <TextField
                label="Extra instructions"
                value={draft.notes ?? ""}
                onChange={(event) => updateDraft({ notes: event.target.value })}
                size="small"
                fullWidth
                multiline
                minRows={2}
              />
            </>
          )}

          {activeStep === 4 && (
            <>
              <Stack direction="row" spacing={1} alignItems="center">
                <PaymentsRoundedIcon sx={{ fontSize: 18, color: uiTokens.colors.brand }} />
                <Typography variant="subtitle2">Payment preview</Typography>
              </Stack>

              <TextField
                select
                label="Payment method"
                size="small"
                value={draft.paymentMethodId ?? selectedPaymentMethod?.id ?? ""}
                onChange={(event) => updateDraft({ paymentMethodId: event.target.value })}
                fullWidth
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method.id} value={method.id}>
                    {method.label} • {method.detail}
                  </MenuItem>
                ))}
              </TextField>

              <Stack spacing={0.8}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Delivery fee</Typography>
                  <Typography variant="body2">{formatCurrency(draft.deliveryFee)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Service fee</Typography>
                  <Typography variant="body2">{formatCurrency(draft.serviceFee)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Insurance</Typography>
                  <Typography variant="body2">{formatCurrency(draft.insuranceFee)}</Typography>
                </Stack>
                <Divider />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Total
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {formatCurrency(subtotal)}
                  </Typography>
                </Stack>
              </Stack>
            </>
          )}

          {activeStep === 5 && (
            <>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Confirm delivery request
              </Typography>
              <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                <Chip label={draft.parcel.type.replace("_", " ")} size="small" />
                <Chip label={draft.parcel.size.replace("_", " ")} size="small" />
                <Chip label={draft.schedule === "now" ? "Immediate" : "Scheduled"} size="small" />
              </Stack>
              <Typography variant="body2">
                <strong>Route:</strong> {draft.pickup?.address} to {draft.dropoff?.address}
              </Typography>
              <Typography variant="body2">
                <strong>Parcel:</strong> {draft.parcel.description} ({formatCurrency(draft.parcel.value)})
              </Typography>
              <Typography variant="body2">
                <strong>Recipient:</strong> {draft.recipient?.name} • {draft.recipient?.phone}
              </Typography>
              <Typography variant="body2">
                <strong>Timing:</strong> {draft.schedule === "now" ? "Now" : draft.scheduleTime}
              </Typography>
              <Typography variant="body2">
                <strong>Payment:</strong> {selectedPaymentMethod?.label} • {formatCurrency(subtotal)}
              </Typography>
            </>
          )}

          {submitError && (
            <Typography variant="caption" sx={{ color: uiTokens.colors.danger }}>
              {submitError}
            </Typography>
          )}

          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={activeStep === 0 ? () => navigate(-1) : handleBack}
              sx={{ textTransform: "none" }}
            >
              {activeStep === 0 ? "Cancel" : "Back"}
            </Button>

            {activeStep < CREATION_STEPS.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleConfirm}
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                Confirm delivery
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </ScreenScaffold>
  );
}
