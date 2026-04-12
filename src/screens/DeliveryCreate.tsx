import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
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
  Typography,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
import { DEFAULT_DELIVERY_SCHEDULE_POLICY } from "../features/delivery/schedulePolicy";

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
    if (draft.schedule === "now") {
      return true;
    }
    if (!draft.scheduleTime) {
      return false;
    }
    const scheduleDate = new Date(draft.scheduleTime);
    return !Number.isNaN(scheduleDate.getTime()) && scheduleDate.getTime() > Date.now();
  }
  if (step === 4) {
    return Boolean(draft.paymentMethodId);
  }
  return true;
}

function getStepValidationHint(step: number, draft: DeliveryDraft, paymentMethodCount: number): string {
  if (step === 0) {
    if (!draft.pickup?.address?.trim()) return "Pickup location is required.";
    if (!draft.dropoff?.address?.trim()) return "Dropoff location is required.";
  }
  if (step === 1) {
    if (!draft.parcel.description.trim()) return "Parcel description is required.";
    if (draft.parcel.value <= 0) return "Declared value must be greater than zero.";
  }
  if (step === 2) {
    if (!draft.recipient?.name?.trim()) return "Recipient name is required.";
    if (!draft.recipient?.phone?.trim()) return "Recipient phone is required.";
    if (!draft.recipient?.address?.trim()) return "Recipient address is required.";
  }
  if (step === 3) {
    if (draft.schedule === "scheduled" && !draft.scheduleTime) return "Scheduled date & time is required.";
    if (draft.schedule === "scheduled" && draft.scheduleTime) {
      const scheduleDate = new Date(draft.scheduleTime);
      if (Number.isNaN(scheduleDate.getTime()) || scheduleDate.getTime() <= Date.now()) {
        return "Choose a future schedule date & time.";
      }
    }
  }
  if (step === 4) {
    if (paymentMethodCount === 0) return "Add a payment method in Wallet before continuing.";
    if (!draft.paymentMethodId) return "Payment method is required.";
  }
  return "Complete required fields before continuing.";
}

export default function DeliveryCreate(): React.JSX.Element {
  const navigate = useNavigate();
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down("sm"));
  const { delivery, paymentMethods, actions } = useAppData();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [submitError, setSubmitError] = useState<string>("");
  const [showStepValidation, setShowStepValidation] = useState(false);

  const draft = delivery.draft;
  const subtotal = draft.deliveryFee + draft.serviceFee + draft.insuranceFee;

  const selectedPaymentMethod = useMemo(
    () => paymentMethods.find((method) => method.id === draft.paymentMethodId) ?? paymentMethods[0] ?? null,
    [paymentMethods, draft.paymentMethodId]
  );

  const pickupMissing = showStepValidation && activeStep === 0 && !draft.pickup?.address?.trim();
  const dropoffMissing = showStepValidation && activeStep === 0 && !draft.dropoff?.address?.trim();
  const parcelDescriptionMissing = showStepValidation && activeStep === 1 && !draft.parcel.description.trim();
  const parcelValueInvalid = showStepValidation && activeStep === 1 && draft.parcel.value <= 0;
  const recipientNameMissing = showStepValidation && activeStep === 2 && !draft.recipient?.name?.trim();
  const recipientPhoneMissing = showStepValidation && activeStep === 2 && !draft.recipient?.phone?.trim();
  const recipientAddressMissing = showStepValidation && activeStep === 2 && !draft.recipient?.address?.trim();
  const scheduleMissing = showStepValidation && activeStep === 3 && draft.schedule === "scheduled" && !draft.scheduleTime;
  const scheduleInvalid =
    showStepValidation &&
    activeStep === 3 &&
    draft.schedule === "scheduled" &&
    Boolean(draft.scheduleTime) &&
    new Date(draft.scheduleTime ?? "").getTime() <= Date.now();
  const paymentMethodMissing = showStepValidation && activeStep === 4 && !draft.paymentMethodId;

  const updateDraft = (patch: Partial<DeliveryDraft>): void => {
    actions.updateDeliveryDraft({
      ...patch,
      priceEstimate: formatCurrency(subtotal)
    });
  };

  const handleNext = (): void => {
    if (!canProceed(activeStep, draft)) {
      setShowStepValidation(true);
      setSubmitError(getStepValidationHint(activeStep, draft, paymentMethods.length));
      return;
    }
    setShowStepValidation(false);
    setSubmitError("");
    setActiveStep((prev) => Math.min(prev + 1, CREATION_STEPS.length - 1));
  };

  const handleBack = (): void => {
    setShowStepValidation(false);
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
    navigate(`/deliveries/tracking/${order.id}`);
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

      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          position: { xs: "sticky", sm: "static" },
          top: { xs: "calc(env(safe-area-inset-top) + 8px)", sm: "auto" },
          zIndex: { xs: 6, sm: 1 }
        }}
      >
        <CardContent>
          <Stack spacing={isPhone ? uiTokens.spacing.sm : 0}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                Progress
              </Typography>
              <Chip
                size="small"
                label={`Step ${activeStep + 1} of ${CREATION_STEPS.length}`}
                sx={{ borderRadius: uiTokens.radius.xl }}
              />
            </Stack>
            <Box sx={{ overflowX: "auto" }}>
              <Stepper
                activeStep={activeStep}
                alternativeLabel={!isPhone}
                orientation={isPhone ? "vertical" : "horizontal"}
                sx={{
                  minWidth: isPhone ? "auto" : 560,
                  "& .MuiStepLabel-label": {
                    fontSize: isPhone ? 12 : undefined,
                    whiteSpace: "normal",
                    lineHeight: 1.25
                  },
                  "& .MuiStepLabel-labelContainer": {
                    overflow: "visible"
                  },
                  "& .MuiStep-root": {
                    pr: isPhone ? 0 : undefined
                  }
                }}
              >
                {CREATION_STEPS.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Stack>
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
                required
                error={pickupMissing}
                helperText={pickupMissing ? "Pickup location is required." : " "}
              />
              <TextField
                label="Dropoff location"
                value={draft.dropoff?.address ?? ""}
                onChange={(event) => updateDraft({ dropoff: toLocation(event.target.value) })}
                placeholder="e.g. 12, JJ Apartments, New Street, Kampala"
                size="small"
                fullWidth
                required
                error={dropoffMissing}
                helperText={dropoffMissing ? "Dropoff location is required." : " "}
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
                required
                error={parcelDescriptionMissing}
                helperText={parcelDescriptionMissing ? "Parcel description is required." : " "}
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
                  required
                  error={parcelValueInvalid}
                  helperText={parcelValueInvalid ? "Declared value must be greater than zero." : " "}
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
                required
                error={recipientNameMissing}
                helperText={recipientNameMissing ? "Recipient name is required." : " "}
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
                required
                error={recipientPhoneMissing}
                helperText={recipientPhoneMissing ? "Recipient phone is required." : " "}
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
                required
                error={recipientAddressMissing}
                helperText={recipientAddressMissing ? "Recipient address is required." : " "}
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
                  required
                  error={scheduleMissing || scheduleInvalid}
                  helperText={
                    scheduleMissing
                      ? "Scheduled date & time is required."
                      : scheduleInvalid
                        ? "Choose a future schedule date & time."
                        : " "
                  }
                />
              )}
              <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                Scheduled orders can be edited until {DEFAULT_DELIVERY_SCHEDULE_POLICY.rescheduleCutoffMinutes} minutes before pickup.
              </Typography>
              <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                Cancellation fee is stage-based: accepted (10%), picked up (35%), in transit (45%), near dropoff (60%).
              </Typography>
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
                required
                error={paymentMethodMissing || paymentMethods.length === 0}
                helperText={
                  paymentMethods.length === 0
                    ? "No payment methods found. Add one in Wallet."
                    : paymentMethodMissing
                      ? "Payment method is required."
                      : " "
                }
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
              <Divider />
              <Stack spacing={0.6}>
                <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                  Need to update something before confirming?
                </Typography>
                <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                  <Button size="small" variant="outlined" onClick={() => setActiveStep(0)} sx={{ textTransform: "none" }}>
                    Edit route
                  </Button>
                  <Button size="small" variant="outlined" onClick={() => setActiveStep(1)} sx={{ textTransform: "none" }}>
                    Edit parcel
                  </Button>
                  <Button size="small" variant="outlined" onClick={() => setActiveStep(2)} sx={{ textTransform: "none" }}>
                    Edit recipient
                  </Button>
                  <Button size="small" variant="outlined" onClick={() => setActiveStep(3)} sx={{ textTransform: "none" }}>
                    Edit timing
                  </Button>
                  <Button size="small" variant="outlined" onClick={() => setActiveStep(4)} sx={{ textTransform: "none" }}>
                    Edit payment
                  </Button>
                </Stack>
              </Stack>
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
