import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
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
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import AppCard from "../components/primitives/AppCard";
import PhoneBookPickerButton from "../components/PhoneBookPickerButton";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";
import type { DeliveryDraft, DeliveryOrderMode, RideLocation } from "../store/types";
import { DEFAULT_DELIVERY_SCHEDULE_POLICY } from "../features/delivery/schedulePolicy";
import { createEmptyDeliveryDraftStop, deriveDraftStops } from "../features/delivery/multiStop";
import {
  DELIVERY_ORDER_MODE_OPTIONS,
  getDeliveryOrderModeLabel,
  getDeliveryOrderModeSummary,
  getDeliveryOrderModeTone
} from "../features/delivery/orderMode";

const CREATION_STEPS = [
  "Pickup & dropoff",
  "Parcel",
  "Recipient",
  "Order mode",
  "Timing",
  "Payment",
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
  const stops = deriveDraftStops(draft);
  if (step === 0) {
    return Boolean(draft.pickup?.address) && stops.every((stop) => Boolean(stop.location?.address?.trim()));
  }
  if (step === 1) {
    return Boolean(draft.parcel.description.trim()) && draft.parcel.value > 0;
  }
  if (step === 2) {
    return stops.every(
      (stop) =>
        Boolean(
          stop.recipient?.name?.trim() &&
            stop.recipient?.phone?.trim() &&
            (stop.recipient?.address?.trim() || stop.location?.address?.trim())
        )
    );
  }
  if (step === 3) {
    if (draft.orderMode === "individual") {
      return true;
    }
    if (draft.orderMode === "family") {
      const payer = draft.orderModeConfig.family?.payer ?? "sender";
      if (payer === "member") {
        return Boolean(draft.orderModeConfig.family?.memberName?.trim());
      }
      return true;
    }
    if (draft.orderMode === "business") {
      return Boolean(draft.orderModeConfig.business?.costCenter?.trim());
    }
    if (draft.orderMode === "company") {
      return Boolean(
        draft.orderModeConfig.company?.requesterName?.trim() &&
          draft.orderModeConfig.company?.delegateName?.trim()
      );
    }
    return true;
  }
  if (step === 4) {
    if (draft.schedule === "now") {
      return true;
    }
    if (!draft.scheduleTime) {
      return false;
    }
    const scheduleDate = new Date(draft.scheduleTime);
    return !Number.isNaN(scheduleDate.getTime()) && scheduleDate.getTime() > Date.now();
  }
  if (step === 5) {
    if (draft.paymentOption === "payment_on_delivery") {
      return true;
    }
    return Boolean(draft.paymentMethodId) && draft.paymentPrepaid;
  }
  return true;
}

function getStepValidationHint(step: number, draft: DeliveryDraft, onlinePaymentMethodCount: number): string {
  const stops = deriveDraftStops(draft);
  if (step === 0) {
    if (!draft.pickup?.address?.trim()) return "Pickup location is required.";
    if (stops.some((stop) => !stop.location?.address?.trim())) return "Every destination needs an address.";
  }
  if (step === 1) {
    if (!draft.parcel.description.trim()) return "Parcel description is required.";
    if (draft.parcel.value <= 0) return "Declared value must be greater than zero.";
  }
  if (step === 2) {
    if (stops.some((stop) => !stop.recipient?.name?.trim())) return "Every stop needs a recipient name.";
    if (stops.some((stop) => !stop.recipient?.phone?.trim())) return "Every stop needs a recipient phone.";
    if (stops.some((stop) => !(stop.recipient?.address?.trim() || stop.location?.address?.trim()))) {
      return "Every stop needs a recipient address.";
    }
  }
  if (step === 3) {
    if (draft.orderMode === "family" && draft.orderModeConfig.family?.payer === "member" && !draft.orderModeConfig.family?.memberName?.trim()) {
      return "Family member name is required when payer is member.";
    }
    if (draft.orderMode === "business" && !draft.orderModeConfig.business?.costCenter?.trim()) {
      return "Cost center is required for business orders.";
    }
    if (draft.orderMode === "company" && !draft.orderModeConfig.company?.requesterName?.trim()) {
      return "Requester name is required for company orders.";
    }
    if (draft.orderMode === "company" && !draft.orderModeConfig.company?.delegateName?.trim()) {
      return "Delegate name is required for company orders.";
    }
  }
  if (step === 4) {
    if (draft.schedule === "scheduled" && !draft.scheduleTime) return "Scheduled date & time is required.";
    if (draft.schedule === "scheduled" && draft.scheduleTime) {
      const scheduleDate = new Date(draft.scheduleTime);
      if (Number.isNaN(scheduleDate.getTime()) || scheduleDate.getTime() <= Date.now()) {
        return "Choose a future schedule date & time.";
      }
    }
  }
  if (step === 5) {
    if (draft.paymentOption === "payment_on_delivery") {
      return "Payment will be collected at delivery handoff.";
    }
    if (onlinePaymentMethodCount === 0) return "Add an online payment method in Wallet before continuing.";
    if (!draft.paymentMethodId) return "Payment method is required.";
    if (!draft.paymentPrepaid) return "Complete online payment before continuing.";
  }
  return "Complete required fields before continuing.";
}

type OrderModeConfigPatch = {
  family?: Partial<NonNullable<DeliveryDraft["orderModeConfig"]["family"]>>;
  business?: Partial<NonNullable<DeliveryDraft["orderModeConfig"]["business"]>>;
  company?: Partial<NonNullable<DeliveryDraft["orderModeConfig"]["company"]>>;
};

export default function DeliveryNew(): React.JSX.Element {
  const navigate = useNavigate();
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down("sm"));
  const { delivery, paymentMethods, actions } = useAppData();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [submitError, setSubmitError] = useState<string>("");
  const [showStepValidation, setShowStepValidation] = useState(false);

  const draft = delivery.draft;
  const draftStops = useMemo(() => deriveDraftStops(draft), [draft]);
  const subtotal = draft.deliveryFee + draft.serviceFee + draft.insuranceFee;
  const paymentOnDeliveryMethod = useMemo(
    () => paymentMethods.find((method) => method.type === "cash") ?? null,
    [paymentMethods]
  );
  const onlinePaymentMethods = useMemo(
    () => paymentMethods.filter((method) => method.type !== "cash"),
    [paymentMethods]
  );
  const defaultOnlinePaymentMethod = useMemo(
    () => onlinePaymentMethods.find((method) => method.isDefault) ?? onlinePaymentMethods[0] ?? null,
    [onlinePaymentMethods]
  );

  const selectedPaymentMethod = useMemo(
    () =>
      paymentMethods.find((method) => method.id === draft.paymentMethodId) ??
      (draft.paymentOption === "payment_on_delivery" ? paymentOnDeliveryMethod : defaultOnlinePaymentMethod),
    [paymentMethods, draft.paymentMethodId, draft.paymentOption, paymentOnDeliveryMethod, defaultOnlinePaymentMethod]
  );

  const pickupMissing = showStepValidation && activeStep === 0 && !draft.pickup?.address?.trim();
  const missingRouteStopIndexes = showStepValidation && activeStep === 0
    ? draftStops
        .map((stop, index) => (!stop.location?.address?.trim() ? index : -1))
        .filter((index) => index >= 0)
    : [];
  const parcelDescriptionMissing = showStepValidation && activeStep === 1 && !draft.parcel.description.trim();
  const parcelValueInvalid = showStepValidation && activeStep === 1 && draft.parcel.value <= 0;
  const missingRecipientNameIndexes = showStepValidation && activeStep === 2
    ? draftStops
        .map((stop, index) => (!stop.recipient?.name?.trim() ? index : -1))
        .filter((index) => index >= 0)
    : [];
  const missingRecipientPhoneIndexes = showStepValidation && activeStep === 2
    ? draftStops
        .map((stop, index) => (!stop.recipient?.phone?.trim() ? index : -1))
        .filter((index) => index >= 0)
    : [];
  const missingRecipientAddressIndexes = showStepValidation && activeStep === 2
    ? draftStops
        .map((stop, index) => (!(stop.recipient?.address?.trim() || stop.location?.address?.trim()) ? index : -1))
        .filter((index) => index >= 0)
    : [];
  const familyMemberNameMissing =
    showStepValidation &&
    activeStep === 3 &&
    draft.orderMode === "family" &&
    draft.orderModeConfig.family?.payer === "member" &&
    !draft.orderModeConfig.family?.memberName?.trim();
  const businessCostCenterMissing =
    showStepValidation &&
    activeStep === 3 &&
    draft.orderMode === "business" &&
    !draft.orderModeConfig.business?.costCenter?.trim();
  const companyRequesterMissing =
    showStepValidation &&
    activeStep === 3 &&
    draft.orderMode === "company" &&
    !draft.orderModeConfig.company?.requesterName?.trim();
  const companyDelegateMissing =
    showStepValidation &&
    activeStep === 3 &&
    draft.orderMode === "company" &&
    !draft.orderModeConfig.company?.delegateName?.trim();
  const scheduleMissing = showStepValidation && activeStep === 4 && draft.schedule === "scheduled" && !draft.scheduleTime;
  const scheduleInvalid =
    showStepValidation &&
    activeStep === 4 &&
    draft.schedule === "scheduled" &&
    Boolean(draft.scheduleTime) &&
    new Date(draft.scheduleTime ?? "").getTime() <= Date.now();
  const paymentMethodMissing =
    showStepValidation &&
    activeStep === 5 &&
    draft.paymentOption === "prepayment" &&
    !draft.paymentMethodId;
  const onlinePaymentIncomplete =
    showStepValidation &&
    activeStep === 5 &&
    draft.paymentOption === "prepayment" &&
    !draft.paymentPrepaid;

  const updateDraft = (patch: Partial<DeliveryDraft>): void => {
    actions.updateDeliveryDraft(patch);
  };

  const updateOrderModeConfig = (patch: OrderModeConfigPatch): void => {
    updateDraft({
      orderModeConfig: {
        family: {
          payer: patch.family?.payer ?? draft.orderModeConfig.family?.payer ?? "sender",
          memberName: patch.family?.memberName ?? draft.orderModeConfig.family?.memberName ?? ""
        },
        business: {
          costCenter: patch.business?.costCenter ?? draft.orderModeConfig.business?.costCenter ?? "",
          note: patch.business?.note ?? draft.orderModeConfig.business?.note ?? ""
        },
        company: {
          requesterName: patch.company?.requesterName ?? draft.orderModeConfig.company?.requesterName ?? "",
          delegateName: patch.company?.delegateName ?? draft.orderModeConfig.company?.delegateName ?? "",
          approvalRequired: patch.company?.approvalRequired ?? draft.orderModeConfig.company?.approvalRequired ?? true
        }
      }
    });
  };

  const handleModeChange = (value: DeliveryOrderMode): void => {
    updateDraft({ orderMode: value });
  };

  const updateStop = (
    index: number,
    updater: (stop: DeliveryDraft["stops"][number]) => DeliveryDraft["stops"][number]
  ): void => {
    const nextStops = draftStops.map((stop, stopIndex) =>
      stopIndex === index ? updater(stop) : stop
    );
    updateDraft({ stops: nextStops });
  };

  const addStop = (): void => {
    updateDraft({ stops: [...draftStops, createEmptyDeliveryDraftStop(draftStops.length + 1)], routeMode: "multi_stop" });
  };

  const duplicateStop = (index: number): void => {
    const stop = draftStops[index];
    if (!stop) {
      return;
    }
    const duplicated = {
      ...stop,
      id: createEmptyDeliveryDraftStop(draftStops.length + 1).id,
      location: stop.location ? { ...stop.location } : null,
      recipient: stop.recipient
        ? { ...stop.recipient }
        : null
    };
    const nextStops = [...draftStops];
    nextStops.splice(index + 1, 0, duplicated);
    updateDraft({ stops: nextStops, routeMode: "multi_stop" });
  };

  const removeStop = (index: number): void => {
    const nextStops = draftStops.filter((_, stopIndex) => stopIndex !== index);
    updateDraft({
      routeMode: nextStops.length <= 1 ? "single_stop" : draft.routeMode,
      stops: nextStops.length > 0 ? nextStops : [createEmptyDeliveryDraftStop(1)]
    });
  };

  const moveStop = (index: number, direction: -1 | 1): void => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= draftStops.length) {
      return;
    }
    const nextStops = [...draftStops];
    [nextStops[index], nextStops[targetIndex]] = [nextStops[targetIndex], nextStops[index]];
    updateDraft({ stops: nextStops, routeMode: nextStops.length > 1 ? "multi_stop" : draft.routeMode });
  };

  const handleRouteModeChange = (value: DeliveryDraft["routeMode"]): void => {
    if (value === draft.routeMode) {
      return;
    }
    if (value === "single_stop") {
      updateDraft({
        routeMode: value,
        stops: [draftStops[0] ?? createEmptyDeliveryDraftStop(1)]
      });
      return;
    }
    updateDraft({
      routeMode: value,
      stops: draftStops.length > 0 ? draftStops : [createEmptyDeliveryDraftStop(1)]
    });
  };

  const handlePaymentOptionChange = (option: DeliveryDraft["paymentOption"]): void => {
    if (option === draft.paymentOption) {
      return;
    }

    if (option === "payment_on_delivery") {
      updateDraft({
        paymentOption: option,
        paymentMethodId: paymentOnDeliveryMethod?.id ?? draft.paymentMethodId,
        paymentPrepaid: false
      });
      return;
    }

    updateDraft({
      paymentOption: option,
      paymentMethodId: defaultOnlinePaymentMethod?.id ?? "",
      paymentPrepaid: false
    });
  };

  const handleNext = (): void => {
    if (!canProceed(activeStep, draft)) {
      setShowStepValidation(true);
      setSubmitError(getStepValidationHint(activeStep, draft, onlinePaymentMethods.length));
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
    if (draft.paymentOption === "prepayment" && !draft.paymentPrepaid) {
      setActiveStep(5);
      setShowStepValidation(true);
      setSubmitError("Complete online payment before confirming delivery.");
      return;
    }
    const order = actions.createDeliveryOrder();
    if (!order) {
      setSubmitError("Pickup, destination, parcel, and recipient details are required for every stop.");
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

      <AppCard contentSx={{ display: "block" }}>
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
      </AppCard>

      <AppCard contentSx={{ display: "grid", gap: uiTokens.spacing.md }}>
          {activeStep === 0 && (
            <>
              <Stack direction="row" spacing={1} alignItems="center">
                <PlaceRoundedIcon sx={{ fontSize: 18, color: uiTokens.colors.brand }} />
                <Typography variant="subtitle2">Route details</Typography>
              </Stack>
              <ToggleButtonGroup
                color="primary"
                exclusive
                value={draft.routeMode}
                onChange={(_event, value: DeliveryDraft["routeMode"] | null) => {
                  if (value) {
                    handleRouteModeChange(value);
                  }
                }}
                fullWidth
                aria-label="Delivery route mode selector"
              >
                <ToggleButton value="single_stop" aria-label="Single destination">
                  Single stop
                </ToggleButton>
                <ToggleButton value="multi_stop" aria-label="Multiple destinations">
                  Multi-stop
                </ToggleButton>
              </ToggleButtonGroup>
              <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                {draft.routeMode === "multi_stop"
                  ? "One pickup, many dropoffs. Add, duplicate, remove, and reorder stops before payment."
                  : "Fast path for one recipient and one destination."}
              </Typography>
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
              <Stack spacing={1.2}>
                {draftStops.map((stop, index) => (
                  <AppCard
                    key={stop.id}
                    contentSx={{ display: "grid", gap: uiTokens.spacing.sm }}
                    sx={{ bgcolor: (t) => (t.palette.mode === "light" ? "rgba(248,250,252,0.92)" : "rgba(15,23,42,0.72)") }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip size="small" label={`Stop ${index + 1}`} />
                        {index === 0 && <Chip size="small" label="First dropoff" />}
                      </Stack>
                      <Stack direction="row" spacing={0.6} flexWrap="wrap" useFlexGap>
                        <Button size="small" variant="outlined" onClick={() => moveStop(index, -1)} disabled={index === 0} sx={{ textTransform: "none" }}>
                          Up
                        </Button>
                        <Button size="small" variant="outlined" onClick={() => moveStop(index, 1)} disabled={index === draftStops.length - 1} sx={{ textTransform: "none" }}>
                          Down
                        </Button>
                        <Button size="small" variant="outlined" onClick={() => duplicateStop(index)} sx={{ textTransform: "none" }}>
                          Duplicate
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => removeStop(index)}
                          disabled={draftStops.length === 1}
                          sx={{ textTransform: "none" }}
                        >
                          Remove
                        </Button>
                      </Stack>
                    </Stack>

                    <TextField
                      label={draft.routeMode === "multi_stop" ? `Destination ${index + 1}` : "Dropoff location"}
                      value={stop.location?.address ?? ""}
                      onChange={(event) =>
                        updateStop(index, (currentStop) => ({
                          ...currentStop,
                          location: toLocation(event.target.value),
                          recipient: currentStop.recipient
                            ? {
                                ...currentStop.recipient,
                                address: currentStop.recipient.address || event.target.value
                              }
                            : currentStop.recipient
                        }))
                      }
                      placeholder="e.g. 12, JJ Apartments, New Street, Kampala"
                      size="small"
                      fullWidth
                      required
                      error={missingRouteStopIndexes.includes(index)}
                      helperText={missingRouteStopIndexes.includes(index) ? "Destination address is required." : " "}
                    />
                  </AppCard>
                ))}
              </Stack>

              <Button variant="outlined" onClick={addStop} sx={{ textTransform: "none", fontWeight: 700 }}>
                Add destination
              </Button>
              <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                {draftStops.length} destination{draftStops.length === 1 ? "" : "s"} • route fee updates automatically as you edit the stop list.
              </Typography>
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
                  value={draft.parcel.value > 0 ? draft.parcel.value : ""}
                  onChange={(event) =>
                    updateDraft({
                      parcel: {
                        ...draft.parcel,
                        value: event.target.value === "" ? 0 : Number(event.target.value) || 0
                      }
                    })
                  }
                  placeholder="e.g. 120000"
                  size="small"
                  fullWidth
                  required
                  error={parcelValueInvalid}
                  helperText={parcelValueInvalid ? "Declared value must be greater than zero." : " "}
                />
                <TextField
                  label="Weight (kg)"
                  type="number"
                  value={(draft.parcel.weightKg ?? 0) > 0 ? draft.parcel.weightKg : ""}
                  onChange={(event) =>
                    updateDraft({
                      parcel: {
                        ...draft.parcel,
                        weightKg: event.target.value === "" ? undefined : Number(event.target.value) || undefined
                      }
                    })
                  }
                  placeholder="e.g. 0.5"
                  size="small"
                  fullWidth
                />
              </Stack>
            </>
          )}

          {activeStep === 2 && (
            <>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <PersonRoundedIcon sx={{ fontSize: 18, color: uiTokens.colors.brand }} />
                  <Typography variant="subtitle2">Recipient contact</Typography>
                </Stack>
                <PhoneBookPickerButton
                  size="small"
                  variant="outlined"
                  onContactPicked={(contact) =>
                    updateStop(0, (currentStop) => ({
                      ...currentStop,
                      recipient: {
                        name: contact.name,
                        phone: contact.phone,
                        address: currentStop.recipient?.address ?? currentStop.location?.address ?? "",
                        deliveryNote: currentStop.recipient?.deliveryNote ?? "",
                        allocationNote: currentStop.recipient?.allocationNote ?? ""
                      }
                    }))
                  }
                  sx={{ textTransform: "none", borderRadius: 5 }}
                >
                  Import from phone book
                </PhoneBookPickerButton>
              </Stack>
              <Stack spacing={1.2}>
                {draftStops.map((stop, index) => (
                  <AppCard key={stop.id} contentSx={{ display: "grid", gap: uiTokens.spacing.sm }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip size="small" label={`Stop ${index + 1}`} />
                        <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                          {stop.location?.label ?? "Destination pending"}
                        </Typography>
                      </Stack>
                      <PhoneBookPickerButton
                        size="small"
                        variant="outlined"
                        onContactPicked={(contact) =>
                          updateStop(index, (currentStop) => ({
                            ...currentStop,
                            recipient: {
                              name: contact.name,
                              phone: contact.phone,
                              address: currentStop.recipient?.address ?? currentStop.location?.address ?? "",
                              deliveryNote: currentStop.recipient?.deliveryNote ?? "",
                              allocationNote: currentStop.recipient?.allocationNote ?? ""
                            }
                          }))
                        }
                        sx={{ textTransform: "none", borderRadius: 5 }}
                      >
                        Pick contact
                      </PhoneBookPickerButton>
                    </Stack>

                    <TextField
                      label="Recipient name"
                      value={stop.recipient?.name ?? ""}
                      onChange={(event) =>
                        updateStop(index, (currentStop) => ({
                          ...currentStop,
                          recipient: {
                            name: event.target.value,
                            phone: currentStop.recipient?.phone ?? "",
                            address: currentStop.recipient?.address ?? currentStop.location?.address ?? "",
                            deliveryNote: currentStop.recipient?.deliveryNote ?? "",
                            allocationNote: currentStop.recipient?.allocationNote ?? ""
                          }
                        }))
                      }
                      size="small"
                      fullWidth
                      required
                      error={missingRecipientNameIndexes.includes(index)}
                      helperText={missingRecipientNameIndexes.includes(index) ? "Recipient name is required." : " "}
                    />
                    <TextField
                      label="Recipient phone"
                      value={stop.recipient?.phone ?? ""}
                      onChange={(event) =>
                        updateStop(index, (currentStop) => ({
                          ...currentStop,
                          recipient: {
                            name: currentStop.recipient?.name ?? "",
                            phone: event.target.value,
                            address: currentStop.recipient?.address ?? currentStop.location?.address ?? "",
                            deliveryNote: currentStop.recipient?.deliveryNote ?? "",
                            allocationNote: currentStop.recipient?.allocationNote ?? ""
                          }
                        }))
                      }
                      size="small"
                      fullWidth
                      required
                      error={missingRecipientPhoneIndexes.includes(index)}
                      helperText={missingRecipientPhoneIndexes.includes(index) ? "Recipient phone is required." : " "}
                    />
                    <TextField
                      label="Recipient address"
                      value={stop.recipient?.address ?? stop.location?.address ?? ""}
                      onChange={(event) =>
                        updateStop(index, (currentStop) => ({
                          ...currentStop,
                          recipient: {
                            name: currentStop.recipient?.name ?? "",
                            phone: currentStop.recipient?.phone ?? "",
                            address: event.target.value,
                            deliveryNote: currentStop.recipient?.deliveryNote ?? "",
                            allocationNote: currentStop.recipient?.allocationNote ?? ""
                          }
                        }))
                      }
                      size="small"
                      fullWidth
                      required
                      error={missingRecipientAddressIndexes.includes(index)}
                      helperText={missingRecipientAddressIndexes.includes(index) ? "Recipient address is required." : " "}
                    />
                    <TextField
                      label="Delivery note"
                      value={stop.recipient?.deliveryNote ?? ""}
                      onChange={(event) =>
                        updateStop(index, (currentStop) => ({
                          ...currentStop,
                          recipient: {
                            name: currentStop.recipient?.name ?? "",
                            phone: currentStop.recipient?.phone ?? "",
                            address: currentStop.recipient?.address ?? currentStop.location?.address ?? "",
                            deliveryNote: event.target.value,
                            allocationNote: currentStop.recipient?.allocationNote ?? ""
                          }
                        }))
                      }
                      size="small"
                      fullWidth
                      multiline
                      minRows={2}
                    />
                    <TextField
                      label="Item allocation / note"
                      value={stop.recipient?.allocationNote ?? ""}
                      onChange={(event) =>
                        updateStop(index, (currentStop) => ({
                          ...currentStop,
                          recipient: {
                            name: currentStop.recipient?.name ?? "",
                            phone: currentStop.recipient?.phone ?? "",
                            address: currentStop.recipient?.address ?? currentStop.location?.address ?? "",
                            deliveryNote: currentStop.recipient?.deliveryNote ?? "",
                            allocationNote: event.target.value
                          }
                        }))
                      }
                      size="small"
                      fullWidth
                    />
                  </AppCard>
                ))}
              </Stack>
            </>
          )}

          {activeStep === 3 && (
            <>
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonRoundedIcon sx={{ fontSize: 18, color: uiTokens.colors.brand }} />
                <Typography variant="subtitle2">Order mode</Typography>
              </Stack>

              <ToggleButtonGroup
                color="primary"
                exclusive
                value={draft.orderMode}
                onChange={(_event, value: DeliveryOrderMode | null) => {
                  if (value) {
                    handleModeChange(value);
                  }
                }}
                fullWidth
                aria-label="Order mode selector"
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
                  gap: 1,
                  "& .MuiToggleButtonGroup-grouped": {
                    borderRadius: `${uiTokens.delivery.radius.control}px !important`,
                    border: (t) =>
                      t.palette.mode === "light"
                        ? "1px solid rgba(209,213,219,0.9)"
                        : "1px solid rgba(51,65,85,0.9)",
                    textTransform: "none",
                    fontWeight: 700,
                    py: 0.75
                  }
                }}
              >
                {DELIVERY_ORDER_MODE_OPTIONS.map((modeOption) => (
                  <ToggleButton key={modeOption.value} value={modeOption.value} aria-label={modeOption.label}>
                    {modeOption.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>

              <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                {
                  DELIVERY_ORDER_MODE_OPTIONS.find((option) => option.value === draft.orderMode)
                    ?.description
                }
              </Typography>

              {draft.orderMode === "family" && (
                <>
                  <TextField
                    select
                    label="Who pays?"
                    size="small"
                    value={draft.orderModeConfig.family?.payer ?? "sender"}
                    onChange={(event) =>
                      updateOrderModeConfig({
                        family: {
                          payer: event.target.value as "sender" | "member"
                        }
                      })
                    }
                    fullWidth
                  >
                    <MenuItem value="sender">Sender pays</MenuItem>
                    <MenuItem value="member">Family member pays</MenuItem>
                  </TextField>
                  {draft.orderModeConfig.family?.payer === "member" && (
                    <TextField
                      label="Family member name"
                      size="small"
                      value={draft.orderModeConfig.family?.memberName ?? ""}
                      onChange={(event) =>
                        updateOrderModeConfig({
                          family: {
                            memberName: event.target.value
                          }
                        })
                      }
                      required
                      error={familyMemberNameMissing}
                      helperText={familyMemberNameMissing ? "Family member name is required." : " "}
                      fullWidth
                    />
                  )}
                </>
              )}

              {draft.orderMode === "business" && (
                <>
                  <TextField
                    label="Cost center"
                    size="small"
                    value={draft.orderModeConfig.business?.costCenter ?? ""}
                    onChange={(event) =>
                      updateOrderModeConfig({
                        business: { costCenter: event.target.value }
                      })
                    }
                    required
                    error={businessCostCenterMissing}
                    helperText={businessCostCenterMissing ? "Cost center is required." : " "}
                    fullWidth
                  />
                  <TextField
                    label="Business note"
                    size="small"
                    value={draft.orderModeConfig.business?.note ?? ""}
                    onChange={(event) =>
                      updateOrderModeConfig({
                        business: { note: event.target.value }
                      })
                    }
                    multiline
                    minRows={2}
                    fullWidth
                  />
                </>
              )}

              {draft.orderMode === "company" && (
                <>
                  <TextField
                    label="Requester name"
                    size="small"
                    value={draft.orderModeConfig.company?.requesterName ?? ""}
                    onChange={(event) =>
                      updateOrderModeConfig({
                        company: { requesterName: event.target.value }
                      })
                    }
                    required
                    error={companyRequesterMissing}
                    helperText={companyRequesterMissing ? "Requester name is required." : " "}
                    fullWidth
                  />
                  <TextField
                    label="Delegate name"
                    size="small"
                    value={draft.orderModeConfig.company?.delegateName ?? ""}
                    onChange={(event) =>
                      updateOrderModeConfig({
                        company: { delegateName: event.target.value }
                      })
                    }
                    required
                    error={companyDelegateMissing}
                    helperText={companyDelegateMissing ? "Delegate name is required." : " "}
                    fullWidth
                  />
                  <Chip
                    icon={<VerifiedRoundedIcon sx={{ fontSize: 14 }} />}
                    label={draft.orderModeConfig.company?.approvalRequired ? "Approval required" : "Approval optional"}
                    size="small"
                    sx={{
                      width: "fit-content",
                      bgcolor: "rgba(59,130,246,0.14)",
                      color: "#1E3A8A",
                      border: "1px solid rgba(59,130,246,0.28)"
                    }}
                  />
                </>
              )}
            </>
          )}

          {activeStep === 4 && (
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

          {activeStep === 5 && (
            <>
              <Stack direction="row" spacing={1} alignItems="center">
                <PaymentsRoundedIcon sx={{ fontSize: 18, color: uiTokens.colors.brand }} />
                <Typography variant="subtitle2">Payment</Typography>
              </Stack>

              <ToggleButtonGroup
                color="primary"
                exclusive
                value={draft.paymentOption}
                onChange={(_event, value: DeliveryDraft["paymentOption"] | null) => {
                  if (value) {
                    handlePaymentOptionChange(value);
                  }
                }}
                fullWidth
                aria-label="Payment option selector"
              >
                <ToggleButton value="prepayment" aria-label="Pre-payment">
                  Pre-payment
                </ToggleButton>
                <ToggleButton value="payment_on_delivery" aria-label="Payment on delivery">
                  Payment on delivery
                </ToggleButton>
              </ToggleButtonGroup>

              {draft.paymentOption === "prepayment" ? (
                <>
                  <TextField
                    select
                    label="Online payment method"
                    size="small"
                    value={draft.paymentMethodId ?? defaultOnlinePaymentMethod?.id ?? ""}
                    onChange={(event) =>
                      updateDraft({ paymentMethodId: event.target.value, paymentPrepaid: false })
                    }
                    fullWidth
                    required
                    error={paymentMethodMissing || onlinePaymentMethods.length === 0}
                    helperText={
                      onlinePaymentMethods.length === 0
                        ? "No online payment methods found. Add one in Wallet."
                        : paymentMethodMissing
                          ? "Payment method is required."
                          : " "
                    }
                  >
                    {onlinePaymentMethods.map((method) => (
                      <MenuItem key={method.id} value={method.id}>
                        {method.label} • {method.detail}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1} alignItems={{ sm: "center" }}>
                    <Typography variant="body2" sx={{ color: (t) => t.palette.text.secondary }}>
                      {draft.paymentPrepaid
                        ? "Online payment completed. You can confirm delivery."
                        : "Pay now to continue to confirmation."}
                    </Typography>
                    <Button
                      variant={draft.paymentPrepaid ? "outlined" : "contained"}
                      onClick={() => {
                        updateDraft({ paymentPrepaid: true });
                        setSubmitError("");
                      }}
                      disabled={onlinePaymentMethods.length === 0 || !draft.paymentMethodId}
                      sx={{ textTransform: "none", fontWeight: 700 }}
                    >
                      {draft.paymentPrepaid ? "Paid online" : `Pay ${formatCurrency(subtotal)}`}
                    </Button>
                  </Stack>
                  {onlinePaymentIncomplete && (
                    <Typography variant="caption" sx={{ color: uiTokens.colors.danger }}>
                      Complete online payment before continuing.
                    </Typography>
                  )}
                </>
              ) : (
                <Typography variant="body2" sx={{ color: (t) => t.palette.text.secondary }}>
                  Payment will be collected at handoff. No online payment is required now.
                </Typography>
              )}

              <Stack spacing={0.8}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Base pickup fee</Typography>
                  <Typography variant="body2">{formatCurrency(draft.basePickupFee ?? 0)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">First dropoff fee</Typography>
                  <Typography variant="body2">{formatCurrency(draft.firstDropoffFee ?? 0)}</Typography>
                </Stack>
                {draft.routeMode === "multi_stop" && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Additional stops</Typography>
                    <Typography variant="body2">{formatCurrency(draft.additionalStopFee ?? 0)}</Typography>
                  </Stack>
                )}
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Distance fee</Typography>
                  <Typography variant="body2">{formatCurrency(draft.distanceFee ?? 0)}</Typography>
                </Stack>
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
                <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                  {draft.stopCount ?? draftStops.length} destination{(draft.stopCount ?? draftStops.length) === 1 ? "" : "s"} • {Number(draft.totalDistanceKm ?? 0).toFixed(1)} km total route
                </Typography>
              </Stack>
            </>
          )}

          {activeStep === 6 && (
            <>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Confirm delivery request
              </Typography>
              <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                <Chip label={draft.parcel.type.replace("_", " ")} size="small" />
                <Chip label={draft.parcel.size.replace("_", " ")} size="small" />
                <Chip label={draft.schedule === "now" ? "Immediate" : "Scheduled"} size="small" />
                <Chip label={draft.routeMode === "multi_stop" ? "Multi-stop route" : "Single stop"} size="small" />
                <Chip label={`${draftStops.length} destination${draftStops.length === 1 ? "" : "s"}`} size="small" />
                <Chip
                  label={getDeliveryOrderModeLabel(draft.orderMode)}
                  size="small"
                  sx={{
                    bgcolor: getDeliveryOrderModeTone(draft.orderMode).bg,
                    color: getDeliveryOrderModeTone(draft.orderMode).fg,
                    border: `1px solid ${getDeliveryOrderModeTone(draft.orderMode).border}`
                  }}
                />
              </Stack>
              <Typography variant="body2">
                <strong>Pickup:</strong> {draft.pickup?.address}
              </Typography>
              <Typography variant="body2">
                <strong>Parcel:</strong> {draft.parcel.description} ({formatCurrency(draft.parcel.value)})
              </Typography>
              <Typography variant="body2">
                <strong>Timing:</strong> {draft.schedule === "now" ? "Now" : draft.scheduleTime}
              </Typography>
              <Typography variant="body2">
                <strong>Order mode:</strong>{" "}
                {getDeliveryOrderModeSummary({
                  orderMode: draft.orderMode,
                  orderModeConfig: draft.orderModeConfig
                })}
              </Typography>
              <Typography variant="body2">
                <strong>Payment:</strong>{" "}
                {draft.paymentOption === "payment_on_delivery"
                  ? `Payment on delivery • ${formatCurrency(subtotal)} due at handoff`
                  : `${selectedPaymentMethod?.label ?? "Online payment"} • ${formatCurrency(subtotal)} (paid online)`}
              </Typography>
              <Typography variant="body2">
                <strong>Route estimate:</strong> {Number(draft.totalDistanceKm ?? 0).toFixed(1)} km • {draftStops.length} stop{draftStops.length === 1 ? "" : "s"}
              </Typography>
              <Stack spacing={0.8}>
                {draftStops.map((stop, index) => (
                  <AppCard key={stop.id} variant="muted" contentSx={{ display: "grid", gap: 0.6 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Stop {index + 1} • {stop.recipient?.name || "Recipient pending"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                      {stop.location?.address ?? "Destination pending"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                      {stop.recipient?.phone ?? "Phone pending"}
                    </Typography>
                    {(stop.recipient?.deliveryNote || stop.recipient?.allocationNote) && (
                      <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                        {[stop.recipient?.deliveryNote, stop.recipient?.allocationNote].filter(Boolean).join(" • ")}
                      </Typography>
                    )}
                  </AppCard>
                ))}
              </Stack>
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
                    Edit recipients
                  </Button>
                  <Button size="small" variant="outlined" onClick={() => setActiveStep(3)} sx={{ textTransform: "none" }}>
                    Edit mode
                  </Button>
                  <Button size="small" variant="outlined" onClick={() => setActiveStep(4)} sx={{ textTransform: "none" }}>
                    Edit timing
                  </Button>
                  <Button size="small" variant="outlined" onClick={() => setActiveStep(5)} sx={{ textTransform: "none" }}>
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
                sx={{ textTransform: "none", fontWeight: 700, minHeight: uiTokens.delivery.button.mdHeight }}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleConfirm}
                sx={{ textTransform: "none", fontWeight: 700, minHeight: uiTokens.delivery.button.mdHeight }}
              >
                Confirm delivery
              </Button>
            )}
          </Stack>
      </AppCard>
    </ScreenScaffold>
  );
}
