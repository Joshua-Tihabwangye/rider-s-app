import { createContext, useContext, useMemo, ReactNode, useReducer, useCallback, useEffect, useRef, useState } from "react";
import type {
  AppData,
  PaymentMethod,
  PaymentMethodType,
  WalletTransaction,
  Reminder,
  SettingsState,
  NotificationPreferences,
  PrivacyPreferences,
  RidePreferences,
  DeliveryPreferences,
  EmergencyContact,
  RideState,
  RideRequest,
  RideTrip,
  RideLocation,
  RideTripLeg,
  RideStatus,
  RideOption,
  DeliveryState,
  DeliveryDraft,
  DeliveryOrder,
  DeliveryOrderModeConfig,
  DeliveryStatus,
  DeliverySettlement,
  DeliverySettlementStatus,
  DeliveryExceptionType,
  DeliveryProofOfDelivery,
  DeliveryContactType,
  RentalState,
  RentalBooking,
  RentalPaymentSession,
  RentalPaymentStatus,
  RentalPaymentTransaction,
  RentalPaymentReceipt,
  ToursState,
  TourBooking,
  TourPaymentSession,
  TourPaymentStatus,
  TourPaymentTransaction,
  TourPaymentReceipt,
  AmbulanceState,
  AmbulanceRequest,
  AmbulanceStatus,
  SosState,
  SosStatus,
  SosEvent,
  SharedLocationState
} from "../store/types";
import { ALLOW_CACHE_FALLBACK, API_BASE_URL, BACKEND_FLAG_EVENT } from "../services/api/config";
import { useAuth } from "./AuthContext";
import type { DeliveryRealtimePatch } from "../features/delivery/realtime";
import {
  getDeliveryStatusProgress,
  getDeliveryStatusLabel
} from "../features/delivery/stateMachine";
import { applyRealtimePatch, simulateDeliveryPollTick } from "../features/delivery/realtime";
import { DEFAULT_DELIVERY_SCHEDULE_POLICY, calculateScheduledCancellationFee } from "../features/delivery/schedulePolicy";
import {
  applySettlementForDeliveryStatus,
  generateDeliveryReceipt,
  initializeDeliverySettlement,
  isReceiptEligible,
  requestSettlementRefund
} from "../features/delivery/payment";
import { createAutoProofOfDelivery, createSenderSignatureProof } from "../features/delivery/proof";
import {
  createDeliveryException,
  DELIVERY_EXCEPTION_LABELS,
  getStatusFromException,
  resolveDeliveryException
} from "../features/delivery/exceptions";
import { createDeliveryNotification } from "../features/delivery/notifications";
import {
  buildOrderStops,
  calculateDraftPricing,
  createEmptyDeliveryDraftStop,
  deriveDraftStops,
  deriveLegacyFieldsFromStops,
  deriveOrderLegacyFields,
  summarizeRoute
} from "../features/delivery/multiStop";
import {
  buildRentalPricing,
  estimateRentalDays,
  getRentalBookingVehicle
} from "../features/rental/booking";
import {
  SEED_PAYMENT_METHODS,
  SEED_TRANSACTIONS,
  SEED_REMINDERS,
  SEED_WALLET_BALANCE,
  SEED_WALLET_RESERVED,
  SEED_SETTINGS,
  SEED_EMERGENCY_CONTACTS,
  SEED_RIDE_STATE,
  SEED_DELIVERY_STATE,
  SEED_RENTAL_STATE,
  SEED_TOURS_STATE,
  SEED_AMBULANCE_STATE,
  SEED_SOS_STATE,
  SEED_SHARED_LOCATION_STATE
} from "../store/seedData";
import {
  createRiderAmbulance,
  createRiderRental,
  createRiderTour,
  createRiderTripRequest,
  createRiderDelivery,
  type RiderAmbulanceApi,
  type RiderDeliveryApi,
  type RiderEmergencyContactApi,
  type RiderPaymentMethodApi,
  type RiderPreferencesApi,
  type RiderWalletApi,
  type RiderWalletTransactionApi,
  getRiderActiveTrip,
  getRiderDelivery,
  getRiderPreferences,
  getRiderWallet,
  listRiderDeliveries,
  listRiderEmergencyContacts,
  listRiderPaymentMethods,
  listRiderAmbulances,
  getRiderNotifications,
  listRiderRentals,
  listRiderWalletTransactions,
  listRiderTours,
  getRiderTripHistory,
  isRiderBackendEnabled,
  mapApiTripToRideTrip,
  updateRiderAmbulance,
  updateRiderTripTracking,
} from "../services/api/riderApi";
import { createRiderSocket } from "../services/riderSocket";
import { DEFAULT_ROUND_TRIP_RETURN_PATTERN, RIDE_MAX_STOPS } from "../features/rides/constants";

interface AppState extends AppData {
  settings: SettingsState;
  emergencyContacts: EmergencyContact[];
  ride: RideState;
  delivery: DeliveryState;
  rental: RentalState;
  tours: ToursState;
  ambulance: AmbulanceState;
  sos: SosState;
}

const AUTO_SENDER_CONFIRMATION_FETCH_DELAY_MS = 45000;
const APP_DATA_STORAGE_KEY = "evzone_app_data_v1";

interface AppActions {
  updateSettings: (patch: Partial<SettingsState>) => void;
  updateNotifications: (patch: Partial<NotificationPreferences>) => void;
  updatePrivacy: (patch: Partial<PrivacyPreferences>) => void;
  updateRidePreferences: (patch: Partial<RidePreferences>) => void;
  updateDeliveryPreferences: (patch: Partial<DeliveryPreferences>) => void;
  updateRideRequest: (patch: Partial<RideRequest>) => void;
  updateRideTrip: (patch: Partial<RideTrip>) => void;
  refreshRideOptionPricing: (distanceKm?: number | null) => void;
  updateRideSharing: (patch: Partial<RideState["sharing"]>) => void;
  setRideStatus: (status: RideStatus) => void;
  setActiveTrip: (trip: RideTrip | null) => void;
  updateDeliveryDraft: (patch: Partial<DeliveryDraft>) => void;
  resetDeliveryDraft: () => void;
  syncDeliveryOrders: (orders: DeliveryOrder[], activeOrder?: DeliveryOrder | null) => void;
  createDeliveryOrder: (draftOverride?: DeliveryDraft) => DeliveryOrder | null;
  setActiveDelivery: (order: DeliveryOrder | null) => void;
  setActiveDeliveryById: (orderId: string) => void;
  updateDeliveryOrderStatus: (orderId: string, status: DeliveryStatus, note?: string) => void;
  logDeliveryContactEvent: (orderId: string, contactType: DeliveryContactType) => void;
  reportDeliveryException: (params: {
    orderId: string;
    type: DeliveryExceptionType;
    note: string;
    requestedRefundAmount?: number;
  }) => void;
  resolveDeliveryException: (orderId: string, exceptionId: string, resolution: string) => void;
  submitProofOfDelivery: (orderId: string, proof: DeliveryProofOfDelivery) => void;
  receiveSenderDeliveryConfirmation: (orderId: string) => void;
  closeSenderDelivery: (orderId: string) => void;
  updateScheduledDelivery: (orderId: string, scheduleTime: string) => void;
  cancelScheduledDelivery: (orderId: string, reason: string) => void;
  submitDeliveryRating: (orderId: string, payload: { score: number; tags: string[]; comment?: string }) => void;
  selectDeliverySettlementMethod: (orderId: string, paymentMethodId: string) => void;
  captureDeliverySettlement: (orderId: string) => void;
  markDeliveryNotificationsRead: () => void;
  applyDeliveryRealtimePatch: (patch: DeliveryRealtimePatch) => void;
  beginRentalBooking: (vehicleId?: string) => void;
  updateRentalBooking: (patch: Partial<RentalBooking>) => void;
  selectRentalVehicle: (vehicleId: string) => void;
  initializeRentalPayment: (params: {
    paymentMethodId: string;
    amount: number;
  }) => RentalPaymentSession | null;
  updateRentalPaymentSession: (patch: Partial<RentalPaymentSession>) => void;
  completeRentalPayment: (params: {
    paymentMethodLabel: string;
    maskedCardNumber?: string;
    provider?: "MTN Mobile Money" | "Airtel Money";
    mobileMoneyPhone?: string;
    cardHolderName?: string;
    cardLast4?: string;
    billingEmail?: string;
    billingPhone?: string;
  }) => RentalPaymentTransaction | null;
  failRentalPayment: (params: {
    status: Exclude<RentalPaymentStatus, "pending" | "processing" | "successful" | "requires_verification">;
    reason: string;
  }) => void;
  resetRentalPayment: () => void;
  initializeTourPayment: (params: {
    paymentMethodId: string;
    amount: number;
  }) => TourPaymentSession | null;
  updateTourPaymentSession: (patch: Partial<TourPaymentSession>) => void;
  completeTourPayment: (params: {
    paymentMethodLabel: string;
    maskedCardNumber?: string;
    provider?: "MTN Mobile Money" | "Airtel Money";
    mobileMoneyPhone?: string;
    cardHolderName?: string;
    cardLast4?: string;
    billingEmail?: string;
    billingPhone?: string;
  }) => TourPaymentTransaction | null;
  failTourPayment: (params: {
    status: Exclude<TourPaymentStatus, "pending" | "processing" | "successful" | "requires_verification">;
    reason: string;
  }) => void;
  resetTourPayment: () => void;
  updateTourBooking: (patch: Partial<TourBooking>) => void;
  selectTour: (tourId: string) => void;
  updateAmbulanceRequest: (patch: Partial<AmbulanceRequest>) => void;
  addEmergencyContact: (contact: Omit<EmergencyContact, "id">) => void;
  updateEmergencyContact: (contact: EmergencyContact) => void;
  removeEmergencyContact: (id: string) => void;
  setDefaultEmergencyContact: (id: string) => void;
  startSos: (context: SosEvent["context"]) => string;
  updateSosStatus: (id: string, status: SosStatus, note?: string) => void;
  resolveSos: (id: string, note?: string) => void;
  dismissReminder: (id: number) => void;
  dismissReminders: (ids: number[]) => void;
  simulateDriverAddStopRequest: (requestNote?: string) => void;
  simulateDriverContinueTripRequest: (requestNote?: string) => void;
  resetTemporaryStopState: () => void;
  respondToTemporaryStopRequest: (decision: "confirm" | "decline") => void;
  resumeTripAfterTemporaryStop: () => void;
  markTemporaryStopContinuePromptShown: () => void;
  respondToSafetyCheck: (action: "okay" | "sos") => void;
  updateSharedLocationState: (patch: Partial<SharedLocationState>) => void;
}

interface AppDataContextValue extends AppState {
  /** Mobile money detail string derived from user phone */
  mobileMoneyDetail: string;
  actions: AppActions;
  // Memoized selectors for performance
  selectors: {
    isAuthenticated: boolean;
    hasActiveTrip: boolean;
    hasActiveDelivery: boolean;
    walletBalanceFormatted: string;
  };
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

const initialState: AppState = {
  walletBalance: SEED_WALLET_BALANCE,
  walletReserved: SEED_WALLET_RESERVED,
  paymentMethods: SEED_PAYMENT_METHODS,
  transactions: SEED_TRANSACTIONS,
  reminders: SEED_REMINDERS,
  settings: SEED_SETTINGS,
  emergencyContacts: SEED_EMERGENCY_CONTACTS,
  ride: SEED_RIDE_STATE,
  delivery: SEED_DELIVERY_STATE,
  rental: SEED_RENTAL_STATE,
  tours: SEED_TOURS_STATE,
  ambulance: SEED_AMBULANCE_STATE,
  sos: SEED_SOS_STATE,
  sharedLocationState: SEED_SHARED_LOCATION_STATE
};

function createBackendNeutralState(baseState: AppState): AppState {
  return {
    ...baseState,
    walletBalance: 0,
    walletReserved: 0,
    paymentMethods: [],
    transactions: [],
    reminders: [],
    emergencyContacts: [],
    ride: {
      ...baseState.ride,
      activeTrip: null,
      history: [],
      sharing: {
        ...baseState.ride.sharing,
        shareUrl: "",
        splitFareEnabled: false,
        invitePhone: "",
        passengers: [],
      },
    },
    delivery: {
      ...baseState.delivery,
      activeOrder: null,
      orders: [],
      notifications: [],
      websocketConnected: false,
      lastRealtimeSync: undefined,
    },
    rental: {
      ...baseState.rental,
      selectedVehicleId: null,
      bookings: [],
      activePayment: null,
      paymentTransactions: [],
      receipts: [],
      booking: {
        ...baseState.rental.booking,
        status: "draft",
        paymentStatus: "pending",
        paymentFailureReason: undefined,
        transactionId: undefined,
        confirmedAt: undefined,
      },
    },
    tours: {
      ...baseState.tours,
      selectedTourId: null,
      bookings: [],
      activePayment: null,
      paymentTransactions: [],
      receipts: [],
      booking: {
        ...baseState.tours.booking,
        status: "draft",
        paymentStatus: "pending",
        paymentFailureReason: undefined,
        transactionId: undefined,
        confirmedAt: undefined,
      },
    },
    ambulance: {
      ...baseState.ambulance,
      history: [],
      request: {
        ...baseState.ambulance.request,
        id: "ambulance_current",
        status: "idle",
      },
    },
    sos: {
      ...baseState.sos,
      activeEventId: null,
      events: [],
    },
    sharedLocationState: {
      pickupCoords: null,
      destinationCoords: null,
      routePolyline: [],
      routeAlternativePolylines: [],
      routeDistanceKm: null,
      routeDurationMin: null,
      riderLocation: null,
      driverLocation: null,
      deliveryPickupCoords: null,
      deliveryDropoffCoords: null,
    },
  };
}

function createInitialState(baseState: AppState): AppState {
  const shouldUseBackendNeutralState = isRiderBackendEnabled();
  const runtimeBaseState = shouldUseBackendNeutralState ? createBackendNeutralState(baseState) : baseState;

  if (typeof window === "undefined" || !ALLOW_CACHE_FALLBACK) {
    return runtimeBaseState;
  }

  try {
    const raw = window.localStorage.getItem(APP_DATA_STORAGE_KEY);
    if (!raw) {
      return baseState;
    }

    const persisted = JSON.parse(raw) as Partial<AppState>;
    const mergedRentalVehicles = (() => {
      const persistedVehicles = persisted.rental?.vehicles ?? [];
      if (!persistedVehicles.length) {
        return runtimeBaseState.rental.vehicles;
      }

      const byId = new Map<string, (typeof baseState.rental.vehicles)[number]>();
      for (const vehicle of runtimeBaseState.rental.vehicles) {
        byId.set(vehicle.id, vehicle);
      }
      for (const vehicle of persistedVehicles) {
        byId.set(vehicle.id, vehicle);
      }
      return Array.from(byId.values());
    })();

    return {
      ...runtimeBaseState,
      // Keep ride setup fresh on every full reload so route mode/trip mode and
      // destination draft selections always return to defaults.
      ride: runtimeBaseState.ride,
      delivery: persisted.delivery ? { ...runtimeBaseState.delivery, ...persisted.delivery } : runtimeBaseState.delivery,
      rental: persisted.rental
        ? { ...runtimeBaseState.rental, ...persisted.rental, vehicles: mergedRentalVehicles }
        : runtimeBaseState.rental,
      tours: persisted.tours ? { ...runtimeBaseState.tours, ...persisted.tours } : runtimeBaseState.tours,
      ambulance: persisted.ambulance
        ? { ...runtimeBaseState.ambulance, ...persisted.ambulance }
        : runtimeBaseState.ambulance,
      sharedLocationState: runtimeBaseState.sharedLocationState
    };
  } catch {
    return runtimeBaseState;
  }
}

function mapBackendPaymentMethod(method: RiderPaymentMethodApi): PaymentMethod {
  const detail =
    typeof method.detail === "string" && method.detail.trim().length > 0
      ? method.detail.trim()
      : method.enabled === false
        ? "Disabled in backend"
        : method.isDefault
          ? "Default backend payment method"
          : "Backend payment method";

  return {
    id: method.id,
    type: method.type,
    label: method.label,
    detail,
    isDefault: method.isDefault,
  };
}

function mapBackendWalletTransaction(transaction: RiderWalletTransactionApi): WalletTransaction {
  const amountPrefix = transaction.amount >= 0 ? "+" : "-";
  return {
    id: transaction.id,
    title: transaction.description || "Wallet activity",
    source: transaction.relatedTripId ? `Trip ${transaction.relatedTripId}` : transaction.type.replace(/_/g, " "),
    amount: `${amountPrefix}${transaction.currency} ${Math.abs(transaction.amount).toLocaleString()}`,
    time: new Date(transaction.createdAt).toLocaleString(),
    type:
      transaction.type === "delivery_payment"
        ? "delivery"
        : transaction.type === "rental_payment"
          ? "rental"
          : transaction.type === "tour_payment"
            ? "tour"
            : transaction.type === "top_up"
              ? "topup"
              : transaction.type === "refund"
                ? "withdrawal"
                : "ride",
  };
}

function mapBackendPreferencesToSettings(
  preferences: RiderPreferencesApi | null,
  fallback: SettingsState,
): SettingsState {
  if (!preferences) {
    return fallback;
  }

  return {
    ...fallback,
    notifications: {
      ...fallback.notifications,
      rideUpdates: preferences.notificationSettings?.push ?? fallback.notifications.rideUpdates,
      deliveryUpdates: preferences.notificationSettings?.push ?? fallback.notifications.deliveryUpdates,
      rentalUpdates: preferences.notificationSettings?.push ?? fallback.notifications.rentalUpdates,
      tourUpdates: preferences.notificationSettings?.push ?? fallback.notifications.tourUpdates,
      safetyAlerts: preferences.notificationSettings?.sms ?? fallback.notifications.safetyAlerts,
      promotions: preferences.notificationSettings?.email ?? fallback.notifications.promotions,
    },
    privacy: {
      ...fallback.privacy,
      shareTripStatus: preferences.privacySettings?.shareRideHistory ?? fallback.privacy.shareTripStatus,
      shareLocation: preferences.privacySettings?.shareLocation ?? fallback.privacy.shareLocation,
      allowContactBySupport: fallback.privacy.allowContactBySupport,
    },
    ride: {
      ...fallback.ride,
      quietRide: preferences.ridePreferences?.comfortLevel === "premium" ? true : fallback.ride.quietRide,
      temperature: fallback.ride.temperature,
      luggageAssistance: fallback.ride.luggageAssistance,
      accessibilityNeeds: fallback.ride.accessibilityNeeds,
      womenDriverPreferred: preferences.ridePreferences?.vehicleType === "car" ? fallback.ride.womenDriverPreferred : fallback.ride.womenDriverPreferred,
    },
    delivery: {
      ...fallback.delivery,
    },
  };
}

function mapBackendEmergencyContact(contact: RiderEmergencyContactApi): EmergencyContact {
  return {
    id: contact.id,
    name: contact.name,
    phone: contact.phone,
    relationship: contact.relationship,
    isDefault: contact.isPrimary,
    notifyOnSOS: true,
  };
}

function mapBackendDeliveryStatus(status: RiderDeliveryApi["status"]): DeliveryStatus {
  switch (status) {
    case "accepted":
      return "accepted";
    case "picked_up":
      return "picked_up";
    case "in_transit":
      return "in_transit";
    case "delivered":
      return "delivered";
    case "cancelled":
      return "cancelled";
    default:
      return "requested";
  }
}

function mapBackendDeliveryApiToOrder(api: RiderDeliveryApi): DeliveryOrder {
  const now = new Date(api.updatedAt || api.requestedAt).toISOString();
  const pickupLabel = api.pickupAddress || "Pickup";
  const dropoffLabel = api.dropoffAddress || "Dropoff";
  const defaultLocation = { label: pickupLabel, address: pickupLabel };

  return {
    id: api.id,
    routeId: api.routeId,
    createdAt: new Date(api.requestedAt).toISOString(),
    updatedAt: new Date(api.updatedAt).toISOString(),
    participantRole: "sender",
    status: mapBackendDeliveryStatus(api.status),
    pickup: {
      label: pickupLabel,
      address: pickupLabel,
      coordinates: undefined,
    },
    dropoff: {
      label: dropoffLabel,
      address: dropoffLabel,
      coordinates: undefined,
    },
    routeMode: "single_stop",
    stops: [],
    routeSummary: {
      totalStops: 0,
      completedStops: 0,
      failedStops: 0,
      skippedStops: 0,
      remainingStops: api.status === "delivered" ? 0 : 1,
      totalDistanceKm: 0,
      totalEtaMinutes: 0,
      nextStopId: api.routeId ? `${api.routeId}_stop_1` : undefined,
      currentStopId: api.routeId ? `${api.routeId}_stop_1` : undefined,
      optimized: false,
      manualOrder: false,
    },
    parcel: {
      type: "other",
      size: "small",
      description: api.itemDescription || "",
      value: 0,
      fragile: false,
      notes: "",
    },
    senderContact: {
      name: "Rider",
      phone: "",
      address: pickupLabel,
    },
    recipient: {
      name: "Recipient",
      phone: "",
      address: dropoffLabel,
    },
    orderMode: "individual",
    orderModeConfig: {
      family: { payer: "sender", memberName: "" },
      business: { costCenter: "" },
      company: { requesterName: "", delegateName: "", approvalRequired: true },
    } satisfies DeliveryOrderModeConfig,
    dropoffMethod: "hand_to_recipient",
    schedule: "now",
    paymentMethodId: "wallet",
    costBreakdown: {
      deliveryFee: 0,
      serviceFee: 0,
      insuranceFee: 0,
      total: 0,
      currency: "UGX",
    },
    tracking: {
      etaMinutes: 0,
      distanceKm: 0,
      progress: api.status === "delivered" ? 100 : api.status === "in_transit" ? 68 : api.status === "picked_up" ? 42 : api.status === "accepted" ? 24 : 12,
      courierPosition: api.status === "delivered" ? 1 : 0,
      updatedAt: now,
    },
    timeline: [
      {
        status: "requested",
        timestamp: new Date(api.requestedAt).toISOString(),
        source: "system",
        note: "Delivery request created",
      },
    ],
    deliveredAt: api.deliveredAt ? new Date(api.deliveredAt).toISOString() : undefined,
    packageName: api.itemDescription || "Delivery",
    sender: {
      city: "",
      code: "",
      name: "Rider",
      avatar: "R",
      address: pickupLabel,
      profileImage: null,
    },
    receiver: { city: "", code: "" },
    progress: api.status === "delivered" ? 100 : api.status === "in_transit" ? 68 : api.status === "picked_up" ? 42 : api.status === "accepted" ? 24 : 12,
    needsPayment: false,
  };
}

function mapBackendAmbulanceApiToRequest(api: RiderAmbulanceApi): AmbulanceRequest {
  const status: AmbulanceStatus =
    api.status === "dispatched"
      ? "assigned"
      : api.status === "in_progress"
        ? "en_route"
        : api.status === "arrived"
          ? "arrived"
          : api.status === "completed"
            ? "completed"
            : api.status === "cancelled"
              ? "cancelled"
              : "requested";

  return {
    id: api.id,
    pickup: {
      label: api.pickupAddress,
      address: api.pickupAddress,
    },
    destination: api.dropoffAddress
      ? {
          label: api.dropoffAddress,
          address: api.dropoffAddress,
        }
      : null,
    urgency:
      api.priority === "emergency"
        ? "high"
        : api.priority === "urgent"
          ? "medium"
          : "low",
    status,
    requestedAt: new Date(api.requestedAt).toISOString(),
    dispatchedAt: api.status !== "requested" ? new Date(api.updatedAt).toISOString() : undefined,
  };
}

function mapRideStatusToBackendStatus(
  status: RideStatus,
): "assigned" | "driver_en_route" | "arrived" | "in_progress" | "completed" | "cancelled" | null {
  switch (status) {
    case "driver_assigned":
      return "assigned";
    case "driver_on_way":
      return "driver_en_route";
    case "driver_arrived":
      return "arrived";
    case "ongoing":
    case "in_progress":
      return "in_progress";
    case "completed":
      return "completed";
    case "cancelled":
      return "cancelled";
    default:
      return null;
  }
}

type AppAction =
  | { type: "settings/update"; payload: Partial<SettingsState> }
  | { type: "settings/notifications"; payload: Partial<NotificationPreferences> }
  | { type: "settings/privacy"; payload: Partial<PrivacyPreferences> }
  | { type: "settings/ride"; payload: Partial<RidePreferences> }
  | { type: "settings/delivery"; payload: Partial<DeliveryPreferences> }
  | { type: "wallet/update"; payload: { walletBalance: number; walletReserved: number; paymentMethods: PaymentMethod[]; transactions: WalletTransaction[]; reminders: Reminder[] } }
  | { type: "ride/request"; payload: Partial<RideRequest> }
  | { type: "ride/trip"; payload: Partial<RideTrip> }
  | { type: "ride/options"; payload: RideOption[] }
  | { type: "ride/sharing"; payload: Partial<RideState["sharing"]> }
  | { type: "ride/history"; payload: RideTrip[] }
  | { type: "ride/status"; payload: RideStatus }
  | { type: "ride/set-active"; payload: RideTrip | null }
  | { type: "delivery/notifications-replace"; payload: DeliveryState["notifications"] }
  | { type: "delivery/draft"; payload: Partial<DeliveryDraft> }
  | { type: "delivery/reset-draft" }
  | { type: "delivery/orders-sync"; payload: { orders: DeliveryOrder[]; activeOrder?: DeliveryOrder | null } }
  | {
      type: "delivery/create-order";
      payload: { orderId: string; senderName: string; senderPhone: string; draftOverride?: DeliveryDraft };
    }
  | { type: "delivery/active"; payload: DeliveryOrder | null }
  | { type: "delivery/active-by-id"; payload: string }
  | { type: "delivery/status"; payload: { orderId: string; status: DeliveryStatus; note?: string } }
  | { type: "delivery/contact"; payload: { orderId: string; contactType: DeliveryContactType } }
  | {
      type: "delivery/exception";
      payload: { orderId: string; type: DeliveryExceptionType; note: string; requestedRefundAmount?: number };
    }
  | { type: "delivery/exception-resolve"; payload: { orderId: string; exceptionId: string; resolution: string } }
  | { type: "delivery/proof"; payload: { orderId: string; proof: DeliveryProofOfDelivery } }
  | { type: "delivery/sender-confirmation"; payload: { orderId: string } }
  | { type: "delivery/sender-close"; payload: { orderId: string } }
  | { type: "delivery/schedule"; payload: { orderId: string; scheduleTime: string } }
  | { type: "delivery/cancel-scheduled"; payload: { orderId: string; reason: string } }
  | { type: "delivery/rating"; payload: { orderId: string; score: number; tags: string[]; comment?: string } }
  | { type: "delivery/settlement-method"; payload: { orderId: string; paymentMethodId: string } }
  | { type: "delivery/settlement-capture"; payload: { orderId: string } }
  | { type: "delivery/notifications-read" }
  | { type: "delivery/realtime"; payload: DeliveryRealtimePatch }
  | { type: "delivery/poll" }
  | { type: "delivery/ws-connected"; payload: boolean }
  | { type: "rental/begin"; payload?: { vehicleId?: string } }
  | { type: "rental/booking"; payload: Partial<RentalBooking> }
  | { type: "rental/select"; payload: string }
  | { type: "rental/payment-init"; payload: RentalPaymentSession }
  | { type: "rental/payment-session"; payload: Partial<RentalPaymentSession> }
  | {
      type: "rental/payment-complete";
      payload: {
        booking: RentalBooking;
        transaction: RentalPaymentTransaction;
        receipt: RentalPaymentReceipt;
        walletDebitAmount: number;
      };
    }
  | {
      type: "rental/payment-fail";
      payload: {
        status: Exclude<RentalPaymentStatus, "pending" | "processing" | "successful" | "requires_verification">;
        reason: string;
      };
    }
  | { type: "rental/payment-reset" }
  | { type: "rental/bookings-sync"; payload: RentalBooking[] }
  | { type: "tours/payment-init"; payload: TourPaymentSession }
  | { type: "tours/payment-session"; payload: Partial<TourPaymentSession> }
  | {
      type: "tours/payment-complete";
      payload: {
        booking: TourBooking;
        transaction: TourPaymentTransaction;
        receipt: TourPaymentReceipt;
        walletDebitAmount: number;
      };
    }
  | {
      type: "tours/payment-fail";
      payload: {
        status: Exclude<TourPaymentStatus, "pending" | "processing" | "successful" | "requires_verification">;
        reason: string;
      };
    }
  | { type: "tours/payment-reset" }
  | { type: "tours/bookings-sync"; payload: TourBooking[] }
  | { type: "tours/booking"; payload: Partial<TourBooking> }
  | { type: "tours/select"; payload: string }
  | { type: "ambulance/update"; payload: Partial<AmbulanceRequest> }
  | { type: "ambulance/request-sync"; payload: AmbulanceRequest }
  | { type: "ambulance/history-sync"; payload: AmbulanceRequest[] }
  | { type: "emergency/add"; payload: EmergencyContact }
  | { type: "emergency/update"; payload: EmergencyContact }
  | { type: "emergency/remove"; payload: string }
  | { type: "emergency/set-default"; payload: string }
  | { type: "emergency/sync"; payload: EmergencyContact[] }
  | { type: "sos/start"; payload: SosEvent }
  | { type: "sos/status"; payload: { id: string; status: SosStatus; note?: string } }
  | { type: "reminder/dismiss"; payload: number }
  | { type: "reminder/dismiss-many"; payload: number[] }
  | { type: "ride/set-temporary-stop"; payload: Partial<import("../store/types").ActiveRideTemporaryStopState> }
  | { type: "ride/set-safety-check"; payload: Partial<import("../store/types").ActiveRideSafetyCheckState> }
  | { type: "location/update"; payload: Partial<SharedLocationState> };
function updateEmergencyContactsDefault(contacts: EmergencyContact[], id: string): EmergencyContact[] {
  return contacts.map((contact) => ({
    ...contact,
    isDefault: contact.id === id
  }));
}

function formatCurrencyUGX(amount: number): string {
  return `UGX ${Math.round(amount).toLocaleString()}`;
}

function parseUGXAmount(value?: string): number {
  if (!value) return 0;
  const parsed = Number.parseFloat(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatRideEtaLabel(minutes: number): string {
  const safe = Math.max(1, Math.round(minutes));
  return `${safe} min${safe === 1 ? "" : "s"}`;
}

function estimateRideLegDistanceKm(from: RideLocation, to: RideLocation): number {
  const fromCoords = from.coordinates;
  const toCoords = to.coordinates;
  if (!fromCoords || !toCoords) {
    return 2.5;
  }
  const latFactor = 111.32;
  const lngFactor = 111.32 * Math.cos(((fromCoords.lat + toCoords.lat) / 2) * (Math.PI / 180));
  const dLat = (toCoords.lat - fromCoords.lat) * latFactor;
  const dLng = (toCoords.lng - fromCoords.lng) * lngFactor;
  return Math.max(0.4, Math.sqrt(dLat * dLat + dLng * dLng));
}

function estimateRideLegDurationMin(distanceKm: number): number {
  // 30-35 km/h city assumptions with buffers for lights/turns.
  return Math.max(3, Math.round(distanceKm * 2.25));
}

function estimateRideRouteDistanceFromRequest(request: RideRequest): number {
  const normalized = normalizeRideRequest(request);
  const points = normalized.routePoints ?? [];
  if (points.length < 2) return 0;
  let total = 0;
  for (let index = 0; index < points.length - 1; index += 1) {
    const from = points[index];
    const to = points[index + 1];
    if (!from || !to) continue;
    total += estimateRideLegDistanceKm(from, to);
  }
  return total;
}

function isRidePricingLocked(rideState: RideState): boolean {
  if (!rideState.activeTrip) return false;
  if (rideState.activeTrip.id === "ride_temp") return false;
  return !["completed", "cancelled"].includes(rideState.activeTrip.status);
}

function areRideOptionPricesEquivalent(current: RideOption[], next: RideOption[]): boolean {
  if (current.length !== next.length) return false;
  return current.every((option, index) => {
    const target = next[index];
    if (!target) return false;
    return option.id === target.id && option.fare === target.fare && option.eta === target.eta;
  });
}

function hasRideRouteCoordinates(request: RideRequest): boolean {
  const points = request.routePoints ?? [];
  if (points.length < 2) return false;
  return points.every((point) => {
    const coords = point.coordinates;
    return Boolean(coords) && Number.isFinite(coords?.lat) && Number.isFinite(coords?.lng);
  });
}

function buildRideRouteSignature(request: RideRequest): string {
  const normalized = normalizeRideRequest(request);
  const points =
    normalized.routePoints?.length
      ? normalized.routePoints
      : [
          ...(normalized.origin ? [normalized.origin] : []),
          ...(normalized.stops ?? []),
          ...(normalized.destination ? [normalized.destination] : [])
        ];
  return points
    .map((point, index) => {
      const label = (point.label || point.address || "").trim().toLowerCase();
      const lat =
        point.coordinates && Number.isFinite(point.coordinates.lat)
          ? point.coordinates.lat.toFixed(5)
          : "";
      const lng =
        point.coordinates && Number.isFinite(point.coordinates.lng)
          ? point.coordinates.lng.toFixed(5)
          : "";
      return `${index}:${label}:${lat},${lng}`;
    })
    .join("|");
}

function computeRideOptionsForDistance(
  rideState: RideState,
  request: RideRequest,
  sharedLocationState: SharedLocationState,
  distanceKmOverride?: number | null
): RideOption[] {
  if (isRidePricingLocked(rideState)) {
    return rideState.options;
  }

  const distanceFromOverride = distanceKmOverride ?? null;
  const distanceFromShared = sharedLocationState.routeDistanceKm ?? null;
  const hasDistanceFromOverride = Number.isFinite(distanceFromOverride ?? Number.NaN) && (distanceFromOverride as number) > 0;
  const hasDistanceFromShared = Number.isFinite(distanceFromShared ?? Number.NaN) && (distanceFromShared as number) > 0;

  if (!hasDistanceFromOverride && !hasDistanceFromShared) {
    return rideState.options.map((option) =>
      option.pricingModel
        ? {
            ...option,
            fare: "",
            eta: "",
          }
        : option
    );
  }

  const effectiveDistanceKm = hasDistanceFromOverride
    ? (distanceFromOverride as number)
    : (distanceFromShared as number);
  const pricingWorkflow = rideState.workflow.tripSimulation.pricing;
  const extraStopCount = Math.max(0, (request.routePoints?.length ?? 0) - 2);
  const stopSurcharge = extraStopCount * pricingWorkflow.extraStopUGX;
  const roundTripSurcharge =
    request.tripMode === "round_trip" ? pricingWorkflow.roundTripSurchargeUGX : 0;
  const routeDurationFromShared =
    Number.isFinite(sharedLocationState.routeDurationMin ?? Number.NaN) && (sharedLocationState.routeDurationMin as number) > 0
      ? (sharedLocationState.routeDurationMin as number)
      : null;

  return rideState.options.map((option) => {
    if (!option.pricingModel) {
      return option;
    }
    const model = option.pricingModel;
    const baseAmount = Math.max(
      model.minFareUGX ?? 0,
      Math.round(model.baseFareUGX + effectiveDistanceKm * model.perKmUGX)
    );
    const totalAmount = baseAmount + stopSurcharge + roundTripSurcharge;
    return {
      ...option,
      fare: formatCurrencyUGX(totalAmount),
      eta: routeDurationFromShared ? formatRideEtaLabel(routeDurationFromShared) : ""
    };
  });
}

function normalizeRideRequest(request: RideRequest): RideRequest {
  const routeMode = request.routeMode ?? (request.tripType === "Multi-stop" ? "multi_stop" : "single_stop");
  const tripMode = request.tripMode ?? (request.tripType === "Round Trip" ? "round_trip" : "one_way");
  const returnPattern = request.roundTripConfig?.returnPattern ?? DEFAULT_ROUND_TRIP_RETURN_PATTERN;
  const validStops = request.stops.filter((stop) => stop.label?.trim() || stop.address?.trim());
  const validStopsByMode = routeMode === "multi_stop" ? validStops : [];
  const routePointsFromRequest = request.routePoints?.filter((point) => point.label?.trim() || point.address?.trim()) ?? [];
  const shouldPreferRoutePointsFromRequest = routeMode === "multi_stop" || tripMode === "round_trip";
  const basePoints =
    shouldPreferRoutePointsFromRequest && routePointsFromRequest.length > 0
      ? routePointsFromRequest
      : [
          ...(request.origin ? [request.origin] : []),
          ...validStopsByMode,
          ...(request.destination ? [request.destination] : [])
        ];
  const routePoints = [...basePoints];
  const returnToOrigin = request.returnToOrigin ?? tripMode === "round_trip";

  if (tripMode === "round_trip" && returnToOrigin && routePoints.length >= 2 && request.origin) {
    if (returnPattern === "reverse_stops" && routePointsFromRequest.length === 0 && validStopsByMode.length > 0) {
      routePoints.push(...[...validStopsByMode].reverse());
    }
    const lastPoint = routePoints[routePoints.length - 1];
    const sameAsOrigin =
      !!lastPoint &&
      ((lastPoint.label && lastPoint.label === request.origin.label) ||
        (lastPoint.address && lastPoint.address === request.origin.address));
    if (!sameAsOrigin) {
      routePoints.push(request.origin);
    }
  }

  const hasRoundTripReturnLeg =
    tripMode === "round_trip" &&
    returnToOrigin &&
    routePoints.length >= 3;
  const normalizedOrigin = routePoints[0] ?? request.origin ?? null;
  const normalizedDestination = hasRoundTripReturnLeg
    ? request.destination ?? routePoints[routePoints.length - 2] ?? null
    : routePoints.length > 1
      ? routePoints[routePoints.length - 1] ?? null
      : request.destination ?? null;
  const normalizedStops = tripMode === "round_trip"
    ? validStopsByMode
    : hasRoundTripReturnLeg
      ? routePoints.slice(1, Math.max(1, routePoints.length - 2))
      : routePoints.slice(1, Math.max(1, routePoints.length - 1));

  return {
    ...request,
    origin: normalizedOrigin,
    destination: normalizedDestination,
    stops: normalizedStops,
    routePoints,
    routeMode,
    tripMode,
    returnToOrigin,
    maxStops: request.maxStops ?? RIDE_MAX_STOPS,
    roundTripConfig: {
      returnDateTime: request.roundTripConfig?.returnDateTime ?? null,
      sameDay: request.roundTripConfig?.sameDay ?? true,
      returnPattern
    },
    bookedFor:
      request.bookedFor ??
      (request.riderType === "contact" && request.riderContact
        ? {
            source: "contact",
            name: request.riderContact.name,
            phone: request.riderContact.phone
          }
        : { source: "self" })
  };
}

function buildRideLegsFromRoutePoints(routePoints: RideLocation[], tripMode: "one_way" | "round_trip"): RideTripLeg[] {
  if (routePoints.length < 2) {
    return [];
  }
  const legs: RideTripLeg[] = [];
  for (let index = 0; index < routePoints.length - 1; index += 1) {
    const from = routePoints[index];
    const to = routePoints[index + 1];
    if (!from || !to) continue;
    const distanceKm = estimateRideLegDistanceKm(from, to);
    const etaMinutes = estimateRideLegDurationMin(distanceKm);
    const lastIndex = routePoints.length - 2;
    legs.push({
      id: `leg_${index + 1}`,
      from,
      to,
      order: index,
      status: index === 0 ? "in_progress" : "pending",
      distanceKm,
      etaMinutes,
      isReturnLeg: tripMode === "round_trip" && index === lastIndex
    });
  }
  return legs;
}

function selectTripSimulationAssignment(state: AppState, request: RideRequest) {
  const assignments = state.ride.workflow.tripSimulation.mockAssignments ?? [];
  if (assignments.length === 0) {
    return null;
  }
  const byServiceLevel =
    assignments.find((assignment) => assignment.serviceLevel === request.serviceLevel) ?? null;
  if (byServiceLevel) {
    return byServiceLevel;
  }
  const byServiceClass =
    request.serviceClass
      ? assignments.find((assignment) => assignment.serviceClass === request.serviceClass) ?? null
      : null;
  return byServiceClass ?? assignments[0] ?? null;
}

function hydrateRideTripWithSimulationDefaults(
  state: AppState,
  trip: RideTrip,
  requestOverride?: RideRequest
): RideTrip;
function hydrateRideTripWithSimulationDefaults(
  state: AppState,
  trip: null,
  requestOverride?: RideRequest
): null;
function hydrateRideTripWithSimulationDefaults(
  state: AppState,
  trip: RideTrip | null,
  requestOverride?: RideRequest
): RideTrip | null {
  if (!trip) return null;
  if (trip.driver && trip.vehicle) return trip;
  const request = requestOverride ?? normalizeRideRequest(state.ride.request);
  const assignment = selectTripSimulationAssignment(state, request);
  if (!assignment) {
    return trip;
  }
  return {
    ...trip,
    driver: trip.driver ?? assignment.driver,
    vehicle: trip.vehicle ?? assignment.vehicle
  };
}

function createRideTripFromRequest(state: AppState): RideTrip | null {
  const request = normalizeRideRequest(state.ride.request);
  if (!request.origin || !request.destination) {
    return null;
  }
  const routePoints = request.routePoints ?? [];
  const legs = buildRideLegsFromRoutePoints(routePoints, request.tripMode ?? "one_way");
  const legsDistanceKm = legs.reduce((sum, leg) => sum + (leg.distanceKm ?? 0), 0);
  const legsEtaMinutes = legs.reduce((sum, leg) => sum + (leg.etaMinutes ?? 0), 0);
  const pricingWorkflow = state.ride.workflow.tripSimulation.pricing;
  const totalDistanceKm =
    Number.isFinite(state.sharedLocationState.routeDistanceKm ?? Number.NaN) && (state.sharedLocationState.routeDistanceKm as number) > 0
      ? (state.sharedLocationState.routeDistanceKm as number)
      : legsDistanceKm;
  const totalEtaMinutes =
    Number.isFinite(state.sharedLocationState.routeDurationMin ?? Number.NaN) && (state.sharedLocationState.routeDurationMin as number) > 0
      ? Math.round(state.sharedLocationState.routeDurationMin as number)
      : legsEtaMinutes;
  const completedStopIds: string[] = [];
  const stopCountSurcharge = Math.max(0, (routePoints.length - 2) * pricingWorkflow.extraStopUGX);
  const roundTripSurcharge =
    request.tripMode === "round_trip" ? pricingWorkflow.roundTripSurchargeUGX : 0;
  const distanceComponent = totalDistanceKm * pricingWorkflow.distancePerKmUGX;
  const baseFare = pricingWorkflow.baseFareUGX;
  const fareTotal = Math.round(baseFare + distanceComponent + stopCountSurcharge + roundTripSurcharge);
  const selectedOption =
    state.ride.options.find((option) => option.id === request.serviceLevel) ??
    state.ride.options[0];
  const selectedFareEstimate = selectedOption?.fare || formatCurrencyUGX(fareTotal);
  const selectedEtaMinutes =
    Number.parseInt((selectedOption?.eta ?? "").replace(/[^\d]/g, ""), 10) ||
    Math.max(4, totalEtaMinutes);
  const assignment = selectTripSimulationAssignment(state, request);
  const originLabel = request.origin.label || request.origin.address || "Pickup";
  const destinationLabel = request.destination.label || request.destination.address || "Destination";

  return {
    id: `ride_${Date.now()}`,
    status: "searching",
    routeMode: request.routeMode ?? "single_stop",
    tripMode: request.tripMode ?? "one_way",
    otp: state.ride.workflow.driverArrival.fallbackOtp,
    etaMinutes: selectedEtaMinutes,
    fareEstimate: selectedFareEstimate,
    distance: `${totalDistanceKm.toFixed(1)} km`,
    routeSummary: `${originLabel} → ${destinationLabel}${routePoints.length > 2 ? ` (${routePoints.length - 2} stops)` : ""}`,
    pickup: request.origin,
    dropoff: request.destination,
    routePoints,
    legs,
    currentLegIndex: legs.length > 0 ? 0 : undefined,
    totalLegs: legs.length,
    remainingLegs: legs.length,
    completedStopIds,
    isReturnLeg: false,
    driver: assignment?.driver ?? null,
    vehicle: assignment?.vehicle ?? null,
    bookedFor: request.bookedFor ?? null
  };
}

function applyRideStatusToLegs(
  legs: RideTripLeg[] | undefined,
  status: RideStatus,
  currentLegIndex: number | undefined
): { legs: RideTripLeg[] | undefined; currentLegIndex: number | undefined; remainingLegs: number | undefined; isReturnLeg: boolean | undefined } {
  if (!legs || legs.length === 0) {
    return { legs, currentLegIndex, remainingLegs: undefined, isReturnLeg: undefined };
  }
  const nextLegs = legs.map((leg) => ({ ...leg }));
  let nextIndex = currentLegIndex ?? 0;

  if (status === "in_progress" || status === "ongoing") {
    const target = nextLegs[nextIndex];
    if (target && target.status === "pending") {
      target.status = "in_progress";
      target.startedAt = target.startedAt ?? new Date().toISOString();
    }
  }

  if (status === "completed") {
    const target = nextLegs[nextIndex];
    if (target) {
      target.status = "completed";
      target.completedAt = target.completedAt ?? new Date().toISOString();
    }
    for (let i = nextIndex + 1; i < nextLegs.length; i += 1) {
      const leg = nextLegs[i];
      if (leg && leg.status === "pending") {
        leg.status = "completed";
        leg.completedAt = leg.completedAt ?? new Date().toISOString();
      }
    }
  }

  const completedCount = nextLegs.filter((leg) => leg.status === "completed").length;
  const remainingLegs = Math.max(0, nextLegs.length - completedCount);
  const safeIndex = Math.min(Math.max(nextIndex, 0), Math.max(0, nextLegs.length - 1));
  const activeLeg = nextLegs[safeIndex];

  return {
    legs: nextLegs,
    currentLegIndex: safeIndex,
    remainingLegs,
    isReturnLeg: activeLeg?.isReturnLeg
  };
}

function getPaymentMethodType(methods: PaymentMethod[], paymentMethodId: string): PaymentMethodType {
  return methods.find((method) => method.id === paymentMethodId)?.type ?? "wallet";
}

function getDefaultPaymentMethodId(methods: PaymentMethod[]): string {
  return methods.find((method) => method.isDefault)?.id ?? methods[0]?.id ?? "pm_wallet";
}

const FINALIZED_DELIVERY_SETTLEMENT_STATUSES: DeliverySettlementStatus[] = [
  "captured",
  "cash_collected",
  "refunded",
  "voided"
];

function isDeliverySettlementFinalized(status?: DeliverySettlementStatus): boolean {
  return Boolean(status && FINALIZED_DELIVERY_SETTLEMENT_STATUSES.includes(status));
}

function requiresIncomingDeliveryPayment(
  participantRole: DeliveryOrder["participantRole"],
  orderStatus: DeliveryStatus,
  settlementStatus?: DeliverySettlementStatus
): boolean {
  if (participantRole !== "receiver" || !["delivered", "partially_completed"].includes(orderStatus) || !settlementStatus) {
    return false;
  }
  return !isDeliverySettlementFinalized(settlementStatus);
}

function enforceIncomingDeliveryPendingPayment(
  settlement: DeliverySettlement,
  participantRole: DeliveryOrder["participantRole"],
  orderStatus: DeliveryStatus,
  totalAmount: number,
  nowIso: string
): DeliverySettlement {
  if (participantRole !== "receiver" || !["delivered", "partially_completed"].includes(orderStatus)) {
    return settlement;
  }

  if (settlement.policy === "cash_on_delivery") {
    return {
      ...settlement,
      status: "cash_due",
      capturedAmount: 0,
      capturedAt: undefined,
      note: "Awaiting recipient payment confirmation."
    };
  }

  return {
    ...settlement,
    status: "authorized",
    authorizedAmount: totalAmount,
    authorizedAt: settlement.authorizedAt ?? nowIso,
    capturedAmount: 0,
    capturedAt: undefined,
    note: "Awaiting recipient payment confirmation."
  };
}

function requiresSenderSignatureConfirmation(order: DeliveryOrder): boolean {
  return (
    order.participantRole === "sender" &&
    order.status === "delivered" &&
    order.dropoffMethod !== "leave_at_door"
  );
}

function hasSenderSignatureImage(order: DeliveryOrder): boolean {
  const proof = order.proofOfDelivery;
  return Boolean(proof?.signatureImageUrl ?? proof?.photoUrl);
}

function getCurrentMutableStopIndex(order: DeliveryOrder): number {
  const arrivingIndex = order.stops.findIndex((stop) => stop.status === "arriving");
  if (arrivingIndex >= 0) {
    return arrivingIndex;
  }
  const queuedIndex = order.stops.findIndex((stop) => stop.status === "queued");
  if (queuedIndex >= 0) {
    return queuedIndex;
  }
  return order.stops.findIndex((stop) => !["delivered", "failed", "skipped", "cancelled"].includes(stop.status));
}

function applyMultiStopStatusUpdate(order: DeliveryOrder, nextStatus: DeliveryStatus, now: string, note?: string): DeliveryOrder {
  if (order.routeMode !== "multi_stop" || order.stops.length <= 1) {
    return order;
  }

  const stops = order.stops.map((stop) => ({ ...stop }));
  const activeIndex = getCurrentMutableStopIndex(order);

  if (activeIndex >= 0) {
    const activeStop = stops[activeIndex];
    if (!activeStop) {
      return order;
    }
    if (nextStatus === "delivered") {
      activeStop.status = "delivered";
      activeStop.completedAt = activeStop.completedAt ?? now;
      activeStop.note = note ?? activeStop.note;
      activeStop.proofOfDelivery =
        activeStop.proofOfDelivery ??
        createAutoProofOfDelivery({
          ...order,
          dropoff: activeStop.location,
          recipient: {
            name: activeStop.recipient.name,
            phone: activeStop.recipient.phone,
            address: activeStop.recipient.address
          },
          deliveredAt: now
        });
    } else if (nextStatus === "failed") {
      activeStop.status = "failed";
      activeStop.failedAt = activeStop.failedAt ?? now;
      activeStop.note = note ?? activeStop.note;
    } else if (nextStatus === "cancelled") {
      activeStop.status = "cancelled";
      activeStop.cancelledAt = activeStop.cancelledAt ?? now;
      activeStop.note = note ?? activeStop.note;
    } else if (nextStatus === "out_for_delivery") {
      activeStop.status = "arriving";
    } else if (nextStatus === "accepted" || nextStatus === "picked_up" || nextStatus === "in_transit") {
      if (!["delivered", "failed", "skipped", "cancelled"].includes(activeStop.status)) {
        activeStop.status = "queued";
      }
    }
  }

  if (nextStatus === "delivered" || nextStatus === "failed") {
    const nextPending = stops.find((stop) => stop.status === "pending");
    if (nextPending) {
      nextPending.status = "queued";
    }
  }

  const routeSummary = summarizeRoute(stops);
  const resolvedStatus: DeliveryStatus =
    routeSummary.remainingStops === 0
      ? routeSummary.failedStops > 0 || routeSummary.skippedStops > 0
        ? "partially_completed"
        : "delivered"
      : nextStatus === "delivered" || nextStatus === "failed"
        ? "in_transit"
        : nextStatus;
  const updatedOrder: DeliveryOrder = {
    ...order,
    status: resolvedStatus,
    stops,
    routeSummary,
    proofOfDelivery:
      routeSummary.remainingStops === 0
        ? stops[stops.length - 1]?.proofOfDelivery ?? order.proofOfDelivery
        : order.proofOfDelivery,
    deliveredAt: routeSummary.remainingStops === 0 ? order.deliveredAt ?? now : order.deliveredAt
  };

  return {
    ...updatedOrder,
    ...deriveOrderLegacyFields(updatedOrder)
  };
}

function appendDeliveryNotification(
  notifications: DeliveryState["notifications"],
  payload: {
    orderId: string;
    title: string;
    body: string;
    category: "status" | "proof" | "payment" | "exception" | "schedule" | "system";
    createdAt?: string;
  }
): DeliveryState["notifications"] {
  const next = createDeliveryNotification(payload);
  return [next, ...notifications].slice(0, 100);
}

function createDefaultDeliveryDraft(previous?: DeliveryDraft): DeliveryDraft {
  const deliveryFee = previous?.deliveryFee ?? 6500;
  const serviceFee = previous?.serviceFee ?? 1200;
  const insuranceFee = previous?.insuranceFee ?? 900;
  return {
    pickup: null,
    dropoff: null,
    routeMode: "single_stop",
    stops: [createEmptyDeliveryDraftStop(1)],
    parcel: {
      type: "documents",
      size: "small",
      description: "",
      value: 0,
      weightKg: undefined,
      fragile: false,
      notes: ""
    },
    recipient: null,
    orderMode: "individual",
    orderModeConfig: {
      family: {
        payer: "sender",
        memberName: ""
      },
      business: {
        costCenter: "",
        note: ""
      },
      company: {
        requesterName: "",
        delegateName: "",
        approvalRequired: true
      }
    },
    schedule: "now",
    scheduleTime: "",
    paymentOption: previous?.paymentOption ?? "prepayment",
    paymentMethodId:
      previous?.paymentOption === "payment_on_delivery"
        ? "pm_cash"
        : previous?.paymentMethodId && previous.paymentMethodId !== "pm_cash"
          ? previous.paymentMethodId
          : "pm_wallet",
    paymentPrepaid: false,
    deliveryFee,
    serviceFee,
    insuranceFee,
    basePickupFee: previous?.basePickupFee ?? 3500,
    firstDropoffFee: previous?.firstDropoffFee ?? 600,
    additionalStopFee: previous?.additionalStopFee ?? 0,
    distanceFee: previous?.distanceFee ?? 0,
    stopCount: previous?.stopCount ?? 1,
    totalDistanceKm: previous?.totalDistanceKm ?? 0,
    priceEstimate: formatCurrencyUGX(deliveryFee + serviceFee + insuranceFee),
    notes: ""
  };
}

function getCityLabel(value: string): string {
  const primary = value.split(",")[0]?.trim();
  if (primary && primary.length > 0) {
    return primary;
  }
  return "Kampala";
}

function createRentalBookingId(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const suffix = String(now.getTime()).slice(-4);
  return `RENT-${date}-${suffix}`;
}

function createTourBookingId(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const suffix = String(now.getTime()).slice(-4);
  return `TOUR-${date}-${suffix}`;
}

function toDateToken(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function createBookingReference(now = new Date()): string {
  const suffix = String(Math.floor(1000 + Math.random() * 9000));
  return `EVR-${toDateToken(now)}-${suffix}`;
}

function createTransactionId(now = new Date()): string {
  const suffix = String(Math.floor(100000 + Math.random() * 900000));
  return `TXN-${toDateToken(now)}-${suffix}`;
}

function createReceiptNumber(now = new Date()): string {
  const suffix = String(Math.floor(100000 + Math.random() * 900000));
  return `RCP-${toDateToken(now)}-${suffix}`;
}

function formatWalletTransactionTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }
  return date.toLocaleString("en-UG", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function createDraftRentalBooking(vehicleId: string): RentalBooking {
  return {
    id: createRentalBookingId(),
    vehicleId,
    rentalMode: "self_drive",
    paymentMethodId: "pm_wallet",
    status: "draft",
    priceEstimate: undefined
  };
}

function createDraftTourBooking(tourId: string, previous?: TourBooking): TourBooking {
  const adults = previous?.adults ?? previous?.guests ?? 2;
  const children = previous?.children ?? 0;
  const guests = Math.max(1, adults + children);
  return {
    id: createTourBookingId(),
    tourId,
    adults,
    children,
    guests,
    timeSlot: previous?.timeSlot,
    date: undefined,
    priceEstimate: undefined,
    status: "draft"
  };
}

function upsertRentalBooking(bookings: RentalBooking[], booking: RentalBooking): RentalBooking[] {
  const existingIndex = bookings.findIndex((entry) => entry.id === booking.id);
  if (existingIndex === -1) {
    return [booking, ...bookings];
  }

  return bookings.map((entry) => (entry.id === booking.id ? booking : entry));
}

function upsertTourBooking(bookings: TourBooking[], booking: TourBooking): TourBooking[] {
  const existingIndex = bookings.findIndex((entry) => entry.id === booking.id);
  if (existingIndex === -1) {
    return [booking, ...bookings];
  }
  return bookings.map((entry) => (entry.id === booking.id ? booking : entry));
}

function createDeliveryOrderFromDraft(
  state: AppState,
  payload: { orderId: string; senderName: string; senderPhone: string },
  draftOverride?: DeliveryDraft
): DeliveryOrder | null {
  const draft = draftOverride ?? state.delivery.draft;
  const draftStops = deriveDraftStops(draft).filter(
    (stop) =>
      stop.location?.address?.trim() &&
      stop.recipient?.name?.trim() &&
      stop.recipient?.phone?.trim()
  );
  const { dropoff, recipient } = deriveLegacyFieldsFromStops(draftStops);
  if (!draft.pickup || !dropoff || !recipient || !draft.parcel.description.trim()) {
    return null;
  }
  if (draft.paymentOption === "prepayment" && !draft.paymentPrepaid) {
    return null;
  }

  const now = new Date().toISOString();
  const pricing = calculateDraftPricing({
    ...draft,
    dropoff,
    recipient,
    stops: draftStops
  });
  const distanceKm = pricing.totalDistanceKm;
  const etaMinutes = Math.max(12, Math.round(distanceKm * 2.6) + Math.max(0, draftStops.length - 1) * 4);
  const total = pricing.total;
  const paymentOnDeliveryMethodId =
    state.paymentMethods.find((method) => method.type === "cash")?.id ?? "pm_cash";
  const defaultOnlinePaymentMethodId =
    state.paymentMethods.find((method) => method.type !== "cash" && method.isDefault)?.id ??
    state.paymentMethods.find((method) => method.type !== "cash")?.id ??
    getDefaultPaymentMethodId(state.paymentMethods);
  const selectedMethodType = draft.paymentMethodId
    ? getPaymentMethodType(state.paymentMethods, draft.paymentMethodId)
    : undefined;
  const paymentMethodId =
    draft.paymentOption === "payment_on_delivery"
      ? paymentOnDeliveryMethodId
      : draft.paymentMethodId && selectedMethodType !== "cash"
        ? draft.paymentMethodId
        : defaultOnlinePaymentMethodId;
  const settlementMethodType: PaymentMethodType =
    draft.paymentOption === "payment_on_delivery"
      ? "cash"
      : getPaymentMethodType(state.paymentMethods, paymentMethodId);
  const estimatedDropoffAt =
    draft.schedule === "scheduled" && draft.scheduleTime
      ? draft.scheduleTime
      : new Date(Date.now() + etaMinutes * 60 * 1000).toISOString();
  const stops = buildOrderStops(payload.orderId, draft.pickup, draftStops);
  const routeSummary = summarizeRoute(stops);

  const baseOrder: DeliveryOrder = {
    id: payload.orderId,
    routeId: payload.orderId,
    createdAt: now,
    updatedAt: now,
    participantRole: "sender",
    status: "requested",
    pickup: draft.pickup,
    dropoff,
    routeMode: draft.routeMode,
    stops,
    routeSummary,
    parcel: draft.parcel,
    senderContact: {
      name: payload.senderName,
      phone: payload.senderPhone,
      address: draft.pickup.address
    },
    recipient,
    orderMode: draft.orderMode,
    orderModeConfig: draft.orderModeConfig,
    dropoffMethod: state.settings.delivery.leaveAtDoor ? "leave_at_door" : "hand_to_recipient",
    schedule: draft.schedule,
    scheduleTime: draft.scheduleTime,
    paymentMethodId,
    costBreakdown: {
      deliveryFee: pricing.deliveryFee,
      serviceFee: pricing.serviceFee,
      insuranceFee: pricing.insuranceFee,
      basePickupFee: pricing.basePickupFee,
      firstDropoffFee: pricing.firstDropoffFee,
      additionalStopFee: pricing.additionalStopFee,
      distanceFee: pricing.distanceFee,
      stopCount: pricing.stopCount,
      totalDistanceKm: pricing.totalDistanceKm,
      total,
      currency: "UGX"
    },
    tracking: {
      etaMinutes,
      distanceKm,
      progress: getDeliveryStatusProgress("requested"),
      courierPosition: 0.08,
      updatedAt: now
    },
    timeline: [
      {
        status: "requested",
        timestamp: now,
        note: "Delivery request submitted",
        source: "rider"
      }
    ],
    courier: {
      id: "drv_delivery_01",
      name: "Bwanbale Kato",
      phone: "+256 700 123 456",
      rating: 4.9,
      vehicle: "EV bike",
      plate: "UBL 630X"
    },
    packageName: draft.parcel.description,
    sender: {
      city: getCityLabel(draft.pickup.address),
      code: "256",
      name: payload.senderName,
      avatar: payload.senderName.slice(0, 2).toUpperCase(),
      address: draft.pickup.address
    },
    receiver: {
      city: getCityLabel(dropoff.address),
      code: "256"
    },
    date: new Date(),
    time: `${etaMinutes} min`,
    progress: getDeliveryStatusProgress("requested"),
    needsPayment: false,
    exceptions: [],
    contactEvents: [],
    settlement: undefined,
    receipt: null,
    rating: null,
    proofOfDelivery: null,
    schedulePolicy: DEFAULT_DELIVERY_SCHEDULE_POLICY,
    estimatedDropoffAt
  };

  const settlement = initializeDeliverySettlement(
    baseOrder,
    settlementMethodType,
    now
  );

  return {
    ...baseOrder,
    settlement
  };
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "settings/update":
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case "settings/notifications":
      return {
        ...state,
        settings: {
          ...state.settings,
          notifications: { ...state.settings.notifications, ...action.payload }
        }
      };
    case "settings/privacy":
      return {
        ...state,
        settings: {
          ...state.settings,
          privacy: { ...state.settings.privacy, ...action.payload }
        }
      };
    case "settings/ride":
      return {
        ...state,
        settings: {
          ...state.settings,
          ride: { ...state.settings.ride, ...action.payload }
        }
      };
    case "settings/delivery":
      return {
        ...state,
        settings: {
          ...state.settings,
          delivery: { ...state.settings.delivery, ...action.payload }
        }
      };
    case "wallet/update":
      return {
        ...state,
        walletBalance: action.payload.walletBalance,
        walletReserved: action.payload.walletReserved,
        paymentMethods: action.payload.paymentMethods,
        transactions: action.payload.transactions,
        reminders: action.payload.reminders,
      };
    case "ride/request": {
      const mergedRequest = normalizeRideRequest({ ...state.ride.request, ...action.payload });
      return { ...state, ride: { ...state.ride, request: mergedRequest } };
    }
    case "ride/trip":
      return {
        ...state,
        ride: {
          ...state.ride,
          activeTrip: state.ride.activeTrip
            ? { ...state.ride.activeTrip, ...action.payload }
            : action.payload
              ? ({
                  id: "ride_temp",
                  status: "searching",
                  otp: "",
                  etaMinutes: 0,
                  fareEstimate: "",
                  distance: "",
                  routeSummary: "",
                  pickup: null,
                  dropoff: null,
                  routePoints: [],
                  routeMode: "single_stop",
                  legs: [],
                  currentLegIndex: 0,
                  totalLegs: 0,
                  remainingLegs: 0,
                  completedStopIds: [],
                  tripMode: "one_way",
                  isReturnLeg: false,
                  driver: null,
                  vehicle: null,
                  ...action.payload
                } as RideTrip)
              : null
        }
      };
    case "ride/options":
      return {
        ...state,
        ride: {
          ...state.ride,
          options: action.payload
        }
      };
    case "ride/sharing":
      return {
        ...state,
        ride: {
          ...state.ride,
          sharing: { ...state.ride.sharing, ...action.payload }
        }
      };
    case "ride/status": {
      if (!state.ride.activeTrip) {
        return state;
      }
      if (state.ride.activeTrip.status === action.payload) {
        return state;
      }
      const activeTrip = { ...state.ride.activeTrip, status: action.payload };
      const legState = applyRideStatusToLegs(activeTrip.legs, action.payload, activeTrip.currentLegIndex);
      const nextTrip: RideTrip = {
        ...activeTrip,
        legs: legState.legs,
        currentLegIndex: legState.currentLegIndex,
        remainingLegs: legState.remainingLegs ?? activeTrip.remainingLegs,
        isReturnLeg: legState.isReturnLeg ?? activeTrip.isReturnLeg
      };
      const shouldArchive = action.payload === "completed" || action.payload === "cancelled";
      const nextHistory = shouldArchive
        ? [
            nextTrip,
            ...state.ride.history.filter((trip) => trip.id !== nextTrip.id)
          ]
        : state.ride.history;
      return {
        ...state,
        ride: {
          ...state.ride,
          activeTrip: nextTrip,
          history: nextHistory
        }
      };
    }
    case "ride/set-active":
      if (state.ride.activeTrip === action.payload) {
        return state;
      }
      return { ...state, ride: { ...state.ride, activeTrip: action.payload } };
    case "ride/history":
      return { ...state, ride: { ...state.ride, history: action.payload } };
    case "delivery/notifications-replace":
      return {
        ...state,
        delivery: {
          ...state.delivery,
          notifications: action.payload
        }
      };
    case "delivery/draft": {
      const mergedDraft = { ...state.delivery.draft, ...action.payload };
      const stops = deriveDraftStops(mergedDraft);
      const legacy = deriveLegacyFieldsFromStops(stops);
      const pricing = calculateDraftPricing({
        ...mergedDraft,
        stops,
        dropoff: legacy.dropoff,
        recipient: legacy.recipient
      });
      return {
        ...state,
        delivery: {
          ...state.delivery,
          draft: {
            ...mergedDraft,
            ...legacy,
            stops,
            deliveryFee: pricing.deliveryFee,
            serviceFee: pricing.serviceFee,
            insuranceFee: pricing.insuranceFee,
            basePickupFee: pricing.basePickupFee,
            firstDropoffFee: pricing.firstDropoffFee,
            additionalStopFee: pricing.additionalStopFee,
            distanceFee: pricing.distanceFee,
            stopCount: pricing.stopCount,
            totalDistanceKm: pricing.totalDistanceKm,
            priceEstimate: formatCurrencyUGX(pricing.total)
          }
        }
      };
    }
    case "delivery/reset-draft":
      return {
        ...state,
        delivery: {
          ...state.delivery,
          draft: createDefaultDeliveryDraft(state.delivery.draft)
        }
      };
    case "delivery/orders-sync":
      return {
        ...state,
        delivery: {
          ...state.delivery,
          orders: action.payload.orders,
          activeOrder:
            action.payload.activeOrder ??
            action.payload.orders.find((order) => order.id === state.delivery.activeOrder?.id) ??
            action.payload.orders[0] ??
            null,
        }
      };
    case "delivery/create-order": {
      const order = createDeliveryOrderFromDraft(state, action.payload, action.payload.draftOverride);
      if (!order) {
        return state;
      }

      return {
        ...state,
        delivery: {
          ...state.delivery,
          draft: createDefaultDeliveryDraft(state.delivery.draft),
          activeOrder: order,
          orders: [order, ...state.delivery.orders],
          notifications: appendDeliveryNotification(state.delivery.notifications, {
            orderId: order.id,
            title: "Delivery request created",
            body: "We are matching your parcel with a courier.",
            category: "status"
          })
        }
      };
    }
    case "delivery/active":
      if (state.delivery.activeOrder === action.payload) {
        return state;
      }
      return { ...state, delivery: { ...state.delivery, activeOrder: action.payload } };
    case "delivery/active-by-id": {
      if (state.delivery.activeOrder?.id === action.payload) {
        return state;
      }
      const activeOrder = state.delivery.orders.find((order) => order.id === action.payload) ?? null;
      if (activeOrder?.id === state.delivery.activeOrder?.id) {
        return state;
      }
      return { ...state, delivery: { ...state.delivery, activeOrder } };
    }
    case "delivery/status": {
      const now = new Date().toISOString();
      let nextNotifications = state.delivery.notifications;
      const updatedOrders = state.delivery.orders.map((order) => {
        if (order.id !== action.payload.orderId) {
          return order;
        }

        const cancellationFee =
          action.payload.status === "cancelled" && order.schedule === "scheduled"
            ? calculateScheduledCancellationFee(order).fee
            : 0;
        const effectivePaymentMethodId =
          order.participantRole === "receiver" && action.payload.status === "delivered"
            ? getDefaultPaymentMethodId(state.paymentMethods)
            : order.paymentMethodId;
        const settlementOrder =
          effectivePaymentMethodId === order.paymentMethodId
            ? order
            : { ...order, paymentMethodId: effectivePaymentMethodId };
        const preStatusOrder = {
          ...settlementOrder,
          updatedAt: now,
          status: action.payload.status,
          deliveredAt: action.payload.status === "delivered" ? order.deliveredAt ?? now : order.deliveredAt
        };
        const candidateOrder = applyMultiStopStatusUpdate(preStatusOrder, action.payload.status, now, action.payload.note);
        const effectiveStatus = candidateOrder.status;
        const paymentMethodType = getPaymentMethodType(state.paymentMethods, effectivePaymentMethodId);
        const currentSettlement =
          (effectivePaymentMethodId === order.paymentMethodId ? order.settlement : undefined) ??
          initializeDeliverySettlement(candidateOrder, paymentMethodType, now);
        let nextSettlement = applySettlementForDeliveryStatus(
          currentSettlement,
          candidateOrder,
          effectiveStatus,
          cancellationFee,
          now
        );
        nextSettlement = enforceIncomingDeliveryPendingPayment(
          nextSettlement,
          order.participantRole,
          effectiveStatus,
          order.costBreakdown.total,
          now
        );
        const deliveredAt = effectiveStatus === "delivered" || effectiveStatus === "partially_completed" ? candidateOrder.deliveredAt ?? now : order.deliveredAt;
        const requiresSenderConfirmationOnDelivery =
          effectiveStatus === "delivered" &&
          order.participantRole === "sender" &&
          order.dropoffMethod !== "leave_at_door";
        const proofOfDelivery =
          effectiveStatus === "delivered"
            ? requiresSenderConfirmationOnDelivery
              ? candidateOrder.proofOfDelivery ?? null
              : candidateOrder.proofOfDelivery ?? createAutoProofOfDelivery({ ...candidateOrder, deliveredAt: deliveredAt ?? now })
            : candidateOrder.proofOfDelivery ?? order.proofOfDelivery;
        const senderClosedAt =
          effectiveStatus === "delivered" &&
          order.participantRole === "sender" &&
          order.dropoffMethod === "leave_at_door"
            ? order.senderClosedAt ?? now
            : order.senderClosedAt;
        const receipt = isReceiptEligible(nextSettlement.status)
          ? generateDeliveryReceipt(candidateOrder, nextSettlement)
          : order.receipt ?? null;

        nextNotifications = appendDeliveryNotification(nextNotifications, {
          orderId: order.id,
          title: `Delivery ${getDeliveryStatusLabel(effectiveStatus)}`,
          body:
            effectiveStatus === "cancelled" && cancellationFee > 0
              ? `Cancelled with ${formatCurrencyUGX(cancellationFee)} fee at current stage.`
              : action.payload.note ?? `${getDeliveryStatusLabel(effectiveStatus)} stage reached.`,
          category: effectiveStatus === "cancelled" ? "payment" : "status",
          createdAt: now
        });

        const needsPayment = requiresIncomingDeliveryPayment(
          order.participantRole,
          effectiveStatus,
          nextSettlement.status
        );
        const resolvedStopsCount = candidateOrder.stops.filter((stop) =>
          ["delivered", "failed", "skipped", "cancelled"].includes(stop.status)
        ).length;
        const multiStopProgress =
          candidateOrder.routeMode === "multi_stop" && candidateOrder.stops.length > 1
            ? effectiveStatus === "delivered" || effectiveStatus === "partially_completed"
              ? 100
              : Math.max(
                  getDeliveryStatusProgress(effectiveStatus),
                  Math.round((resolvedStopsCount / candidateOrder.stops.length) * 100)
                )
            : getDeliveryStatusProgress(effectiveStatus);
        const nextProgress = Math.max(order.tracking.progress, multiStopProgress);

        return {
          ...candidateOrder,
          paymentMethodId: effectivePaymentMethodId,
          updatedAt: now,
          needsPayment,
          progress: nextProgress,
          time: candidateOrder.tracking.etaMinutes > 0 ? `${candidateOrder.tracking.etaMinutes} min` : "Arrived",
          tracking: {
            ...candidateOrder.tracking,
            progress: nextProgress,
            etaMinutes: effectiveStatus === "delivered" || effectiveStatus === "partially_completed" ? 0 : candidateOrder.tracking.etaMinutes,
            courierPosition:
              effectiveStatus === "delivered" || effectiveStatus === "partially_completed" ? 1 : candidateOrder.tracking.courierPosition,
            updatedAt: now
          },
          timeline: candidateOrder.timeline.some((entry) => entry.status === effectiveStatus)
            ? candidateOrder.timeline
            : [
                ...candidateOrder.timeline,
                {
                  status: effectiveStatus,
                  timestamp: now,
                  note: action.payload.note ?? `${getDeliveryStatusLabel(effectiveStatus)} stage reached`,
                  source: "system" as const
                }
              ],
          deliveredAt,
          cancelledReason:
            effectiveStatus === "cancelled"
              ? action.payload.note ??
                (cancellationFee > 0
                  ? `Cancelled by rider. ${formatCurrencyUGX(cancellationFee)} fee applied.`
                  : "Cancelled by rider.")
              : candidateOrder.cancelledReason,
          senderClosedAt,
          settlement: nextSettlement,
          receipt,
          proofOfDelivery
        };
      });

      const activeOrderId = state.delivery.activeOrder?.id;
      const activeOrder = activeOrderId
        ? updatedOrders.find((order) => order.id === activeOrderId) ?? null
        : null;

      return {
        ...state,
        delivery: {
          ...state.delivery,
          orders: updatedOrders,
          activeOrder,
          notifications: nextNotifications
        }
      };
    }
    case "delivery/contact": {
      const now = new Date().toISOString();
      const updatedOrders = state.delivery.orders.map((order) => {
        if (order.id !== action.payload.orderId) {
          return order;
        }

        return {
          ...order,
          contactEvents: [...(order.contactEvents ?? []), { type: action.payload.contactType, timestamp: now }]
        };
      });

      const activeOrderId = state.delivery.activeOrder?.id;
      const activeOrder = activeOrderId
        ? updatedOrders.find((order) => order.id === activeOrderId) ?? null
        : state.delivery.activeOrder;

      return {
        ...state,
        delivery: {
          ...state.delivery,
          orders: updatedOrders,
          activeOrder,
          notifications: appendDeliveryNotification(state.delivery.notifications, {
            orderId: action.payload.orderId,
            title: "Support touchpoint logged",
            body: `Rider used ${action.payload.contactType} for this delivery.`,
            category: "system",
            createdAt: now
          })
        }
      };
    }
    case "delivery/exception": {
      const now = new Date().toISOString();
      let nextNotifications = state.delivery.notifications;
      const updatedOrders = state.delivery.orders.map((order) => {
        if (order.id !== action.payload.orderId) {
          return order;
        }

        const exception = createDeliveryException(
          order.id,
          action.payload.type,
          action.payload.note,
          action.payload.requestedRefundAmount
        );
        const requestedStatus = getStatusFromException(action.payload.type, order.status);
        const nextOrder = applyMultiStopStatusUpdate(order, requestedStatus, now, action.payload.note);
        const nextStatus = nextOrder.status;
        const paymentMethodType = getPaymentMethodType(state.paymentMethods, order.paymentMethodId);
        const currentSettlement =
          order.settlement ?? initializeDeliverySettlement(order, paymentMethodType, now);
        const refundedSettlement =
          action.payload.type === "dispute_refund" ? requestSettlementRefund(currentSettlement, now) : currentSettlement;
        const nextSettlement = applySettlementForDeliveryStatus(
          refundedSettlement,
          nextOrder,
          nextStatus,
          0,
          now
        );

        nextNotifications = appendDeliveryNotification(nextNotifications, {
          orderId: order.id,
          title: DELIVERY_EXCEPTION_LABELS[action.payload.type],
          body: action.payload.note,
          category: "exception",
          createdAt: now
        });

        return {
          ...nextOrder,
          status: nextStatus,
          updatedAt: now,
          exceptions: [...(order.exceptions ?? []), exception],
          settlement: nextSettlement,
          timeline: [
            ...nextOrder.timeline,
            {
              status: nextStatus,
              timestamp: now,
              note: `${DELIVERY_EXCEPTION_LABELS[action.payload.type]} reported`,
              source: "rider" as const
            }
          ]
        };
      });

      const activeOrderId = state.delivery.activeOrder?.id;
      const activeOrder = activeOrderId
        ? updatedOrders.find((order) => order.id === activeOrderId) ?? null
        : state.delivery.activeOrder;

      return {
        ...state,
        delivery: {
          ...state.delivery,
          orders: updatedOrders,
          activeOrder,
          notifications: nextNotifications
        }
      };
    }
    case "delivery/exception-resolve": {
      const now = new Date().toISOString();
      const updatedOrders = state.delivery.orders.map((order) => {
        if (order.id !== action.payload.orderId) {
          return order;
        }

        return {
          ...order,
          updatedAt: now,
          exceptions: (order.exceptions ?? []).map((item) =>
            item.id === action.payload.exceptionId ? resolveDeliveryException(item, action.payload.resolution) : item
          )
        };
      });

      const activeOrderId = state.delivery.activeOrder?.id;
      const activeOrder = activeOrderId
        ? updatedOrders.find((order) => order.id === activeOrderId) ?? null
        : state.delivery.activeOrder;

      return {
        ...state,
        delivery: {
          ...state.delivery,
          orders: updatedOrders,
          activeOrder,
          notifications: appendDeliveryNotification(state.delivery.notifications, {
            orderId: action.payload.orderId,
            title: "Exception resolved",
            body: action.payload.resolution,
            category: "exception",
            createdAt: now
          })
        }
      };
    }
    case "delivery/proof": {
      const now = new Date().toISOString();
      const updatedOrders = state.delivery.orders.map((order) => {
        if (order.id !== action.payload.orderId) {
          return order;
        }

        if (order.routeMode === "multi_stop" && order.stops.length > 1) {
          const stops = order.stops.map((stop) => ({ ...stop }));
          const deliveredStop =
            [...stops]
              .reverse()
              .find((stop) => stop.status === "delivered" && !stop.proofOfDelivery) ??
            [...stops].reverse().find((stop) => stop.status === "delivered");
          if (deliveredStop) {
            deliveredStop.proofOfDelivery = action.payload.proof;
          }
          const nextOrder = {
            ...order,
            updatedAt: now,
            stops,
            proofOfDelivery: action.payload.proof
          };
          return {
            ...nextOrder,
            ...deriveOrderLegacyFields(nextOrder),
            routeSummary: summarizeRoute(stops)
          };
        }

        return {
          ...order,
          updatedAt: now,
          proofOfDelivery: action.payload.proof
        };
      });

      const activeOrderId = state.delivery.activeOrder?.id;
      const activeOrder = activeOrderId
        ? updatedOrders.find((order) => order.id === activeOrderId) ?? null
        : state.delivery.activeOrder;

      return {
        ...state,
        delivery: {
          ...state.delivery,
          orders: updatedOrders,
          activeOrder,
          notifications: appendDeliveryNotification(state.delivery.notifications, {
            orderId: action.payload.orderId,
            title: "Proof of delivery captured",
            body: "Recipient verification is now available in history.",
            category: "proof",
            createdAt: now
          })
        }
      };
    }
    case "delivery/sender-confirmation": {
      const now = new Date().toISOString();
      const updatedOrders = state.delivery.orders.map((order) => {
        if (order.id !== action.payload.orderId) {
          return order;
        }
        if (!requiresSenderSignatureConfirmation(order)) {
          return order;
        }

        const proof = createSenderSignatureProof({
          ...order,
          deliveredAt: order.deliveredAt ?? now,
          updatedAt: now
        });

        return {
          ...order,
          updatedAt: now,
          proofOfDelivery: proof
        };
      });

      const activeOrderId = state.delivery.activeOrder?.id;
      const activeOrder = activeOrderId
        ? updatedOrders.find((order) => order.id === activeOrderId) ?? null
        : state.delivery.activeOrder;

      return {
        ...state,
        delivery: {
          ...state.delivery,
          orders: updatedOrders,
          activeOrder,
          notifications: appendDeliveryNotification(state.delivery.notifications, {
            orderId: action.payload.orderId,
            title: "Recipient signature uploaded",
            body: "Signature confirmation image is now available.",
            category: "proof",
            createdAt: now
          })
        }
      };
    }
    case "delivery/sender-close": {
      const now = new Date().toISOString();
      const updatedOrders = state.delivery.orders.map((order) => {
        if (order.id !== action.payload.orderId) {
          return order;
        }
        if (order.participantRole !== "sender" || order.status !== "delivered") {
          return order;
        }
        if (requiresSenderSignatureConfirmation(order) && !hasSenderSignatureImage(order)) {
          return order;
        }

        return {
          ...order,
          updatedAt: now,
          senderClosedAt: order.senderClosedAt ?? now
        };
      });

      const activeOrderId = state.delivery.activeOrder?.id;
      const activeOrder = activeOrderId
        ? updatedOrders.find((order) => order.id === activeOrderId) ?? null
        : state.delivery.activeOrder;

      return {
        ...state,
        delivery: {
          ...state.delivery,
          orders: updatedOrders,
          activeOrder,
          notifications: appendDeliveryNotification(state.delivery.notifications, {
            orderId: action.payload.orderId,
            title: "Delivery closed",
            body: "You closed this delivery after recipient confirmation.",
            category: "system",
            createdAt: now
          })
        }
      };
    }
    case "delivery/schedule": {
      const now = new Date().toISOString();
      const updatedOrders = state.delivery.orders.map((order) => {
        if (order.id !== action.payload.orderId) {
          return order;
        }

        return {
          ...order,
          schedule: "scheduled" as const,
          scheduleTime: action.payload.scheduleTime,
          estimatedDropoffAt: action.payload.scheduleTime,
          updatedAt: now
        };
      });

      const activeOrderId = state.delivery.activeOrder?.id;
      const activeOrder = activeOrderId
        ? updatedOrders.find((order) => order.id === activeOrderId) ?? null
        : state.delivery.activeOrder;

      return {
        ...state,
        delivery: {
          ...state.delivery,
          orders: updatedOrders,
          activeOrder,
          notifications: appendDeliveryNotification(state.delivery.notifications, {
            orderId: action.payload.orderId,
            title: "Delivery schedule updated",
            body: `New schedule set for ${new Date(action.payload.scheduleTime).toLocaleString("en-UG")}.`,
            category: "schedule",
            createdAt: now
          })
        }
      };
    }
    case "delivery/cancel-scheduled": {
      const now = new Date().toISOString();
      let nextNotifications = state.delivery.notifications;
      const updatedOrders = state.delivery.orders.map((order) => {
        if (order.id !== action.payload.orderId) {
          return order;
        }
        const cancellation = calculateScheduledCancellationFee(order);
        const paymentMethodType = getPaymentMethodType(state.paymentMethods, order.paymentMethodId);
        const currentSettlement =
          order.settlement ?? initializeDeliverySettlement(order, paymentMethodType, now);
        const nextSettlement = applySettlementForDeliveryStatus(
          currentSettlement,
          order,
          "cancelled",
          cancellation.fee,
          now
        );
        const receipt = isReceiptEligible(nextSettlement.status)
          ? generateDeliveryReceipt({ ...order, status: "cancelled", updatedAt: now }, nextSettlement)
          : order.receipt ?? null;

        nextNotifications = appendDeliveryNotification(nextNotifications, {
          orderId: order.id,
          title: "Scheduled delivery cancelled",
          body: `${action.payload.reason}. Fee: ${formatCurrencyUGX(cancellation.fee)} (${cancellation.feePercent}%).`,
          category: "payment",
          createdAt: now
        });

        return {
          ...order,
          status: "cancelled" as const,
          updatedAt: now,
          cancelledReason: `${action.payload.reason}. ${formatCurrencyUGX(cancellation.fee)} fee applied.`,
          settlement: nextSettlement,
          receipt
        };
      });

      const activeOrderId = state.delivery.activeOrder?.id;
      const activeOrder = activeOrderId
        ? updatedOrders.find((order) => order.id === activeOrderId) ?? null
        : state.delivery.activeOrder;

      return {
        ...state,
        delivery: {
          ...state.delivery,
          orders: updatedOrders,
          activeOrder,
          notifications: nextNotifications
        }
      };
    }
    case "delivery/rating": {
      const now = new Date().toISOString();
      const updatedOrders = state.delivery.orders.map((order) => {
        if (order.id !== action.payload.orderId) {
          return order;
        }

        return {
          ...order,
          rating: {
            score: action.payload.score,
            tags: action.payload.tags,
            comment: action.payload.comment,
            submittedAt: now
          }
        };
      });

      const activeOrderId = state.delivery.activeOrder?.id;
      const activeOrder = activeOrderId
        ? updatedOrders.find((order) => order.id === activeOrderId) ?? null
        : state.delivery.activeOrder;

      return {
        ...state,
        delivery: {
          ...state.delivery,
          orders: updatedOrders,
          activeOrder,
          notifications: appendDeliveryNotification(state.delivery.notifications, {
            orderId: action.payload.orderId,
            title: "Thanks for your rating",
            body: "Your delivery feedback has been recorded.",
            category: "system",
            createdAt: now
          })
        }
      };
    }
    case "delivery/settlement-method": {
      const now = new Date().toISOString();
      const selectedMethod = state.paymentMethods.find((method) => method.id === action.payload.paymentMethodId);
      if (!selectedMethod) {
        return state;
      }

      const updatedOrders = state.delivery.orders.map((order) => {
        if (order.id !== action.payload.orderId) {
          return order;
        }
        if (
          order.participantRole !== "receiver" ||
          !["delivered", "partially_completed"].includes(order.status) ||
          isDeliverySettlementFinalized(order.settlement?.status)
        ) {
          return order;
        }

        const nextOrder = {
          ...order,
          paymentMethodId: selectedMethod.id
        };
        let nextSettlement = initializeDeliverySettlement(nextOrder, selectedMethod.type, now);
        if ((nextOrder.status === "delivered" || nextOrder.status === "partially_completed") && nextSettlement.policy !== "cash_on_delivery") {
          nextSettlement = {
            ...nextSettlement,
            status: "authorized",
            capturedAmount: 0,
            capturedAt: undefined,
            note: "Payment method selected. Ready to capture recipient payment."
          };
        }
        const needsPayment = requiresIncomingDeliveryPayment(
          nextOrder.participantRole,
          nextOrder.status,
          nextSettlement.status
        );

        return {
          ...nextOrder,
          updatedAt: now,
          needsPayment,
          settlement: nextSettlement,
          receipt: needsPayment ? null : order.receipt
        };
      });

      const activeOrderId = state.delivery.activeOrder?.id;
      const activeOrder = activeOrderId
        ? updatedOrders.find((order) => order.id === activeOrderId) ?? null
        : state.delivery.activeOrder;

      return {
        ...state,
        delivery: {
          ...state.delivery,
          orders: updatedOrders,
          activeOrder,
          notifications: appendDeliveryNotification(state.delivery.notifications, {
            orderId: action.payload.orderId,
            title: "Payment option updated",
            body: `Settlement will use ${selectedMethod.label}.`,
            category: "payment",
            createdAt: now
          })
        }
      };
    }
    case "delivery/settlement-capture": {
      const now = new Date().toISOString();
      const updatedOrders = state.delivery.orders.map((order) => {
        if (order.id !== action.payload.orderId) {
          return order;
        }

        const paymentMethodType = getPaymentMethodType(state.paymentMethods, order.paymentMethodId);
        const currentSettlement =
          order.settlement ?? initializeDeliverySettlement(order, paymentMethodType, now);
        const nextSettlement =
          currentSettlement.policy === "cash_on_delivery"
            ? {
                ...currentSettlement,
                status: "captured" as const,
                capturedAmount: order.costBreakdown.total,
                capturedAt: now,
                note: "Cash collected and settled manually."
              }
            : {
                ...currentSettlement,
                status: "captured" as const,
                capturedAmount: order.costBreakdown.total,
                capturedAt: now,
                note: "Captured from delivery settlement console."
              };
        const receipt = generateDeliveryReceipt(order, nextSettlement);

        return {
          ...order,
          updatedAt: now,
          needsPayment: false,
          settlement: nextSettlement,
          receipt
        };
      });

      const activeOrderId = state.delivery.activeOrder?.id;
      const activeOrder = activeOrderId
        ? updatedOrders.find((order) => order.id === activeOrderId) ?? null
        : state.delivery.activeOrder;

      return {
        ...state,
        delivery: {
          ...state.delivery,
          orders: updatedOrders,
          activeOrder,
          notifications: appendDeliveryNotification(state.delivery.notifications, {
            orderId: action.payload.orderId,
            title: "Settlement captured",
            body: "Delivery payment has been captured and receipt generated.",
            category: "payment",
            createdAt: now
          })
        }
      };
    }
    case "delivery/notifications-read":
      return {
        ...state,
        delivery: {
          ...state.delivery,
          notifications: state.delivery.notifications.map((item) => ({ ...item, read: true }))
        }
      };
    case "delivery/realtime": {
      const now = new Date().toISOString();
      let nextNotifications = state.delivery.notifications;
      const updatedOrders = state.delivery.orders.map((order) => {
        const patchedOrder = applyRealtimePatch(order, action.payload);
        if (patchedOrder.id !== action.payload.orderId) {
          return patchedOrder;
        }

        if (patchedOrder.status === order.status) {
          return patchedOrder;
        }

        const effectivePaymentMethodId =
          patchedOrder.participantRole === "receiver" && ["delivered", "partially_completed"].includes(patchedOrder.status)
            ? getDefaultPaymentMethodId(state.paymentMethods)
            : patchedOrder.paymentMethodId;
        const settlementOrder =
          effectivePaymentMethodId === patchedOrder.paymentMethodId
            ? patchedOrder
            : { ...patchedOrder, paymentMethodId: effectivePaymentMethodId };
        const paymentMethodType = getPaymentMethodType(state.paymentMethods, effectivePaymentMethodId);
        const currentSettlement =
          (effectivePaymentMethodId === patchedOrder.paymentMethodId ? patchedOrder.settlement : undefined) ??
          initializeDeliverySettlement(settlementOrder, paymentMethodType, now);
        let nextSettlement = applySettlementForDeliveryStatus(
          currentSettlement,
          settlementOrder,
          settlementOrder.status,
          0,
          now
        );
        nextSettlement = enforceIncomingDeliveryPendingPayment(
          nextSettlement,
          settlementOrder.participantRole,
          settlementOrder.status,
          settlementOrder.costBreakdown.total,
          now
        );
        const requiresSenderConfirmation =
          settlementOrder.participantRole === "sender" &&
          settlementOrder.status === "delivered" &&
          settlementOrder.dropoffMethod !== "leave_at_door";
        const proofOfDelivery =
          settlementOrder.status === "delivered" || settlementOrder.status === "partially_completed"
            ? requiresSenderConfirmation
              ? settlementOrder.proofOfDelivery ?? null
              : settlementOrder.proofOfDelivery ?? createAutoProofOfDelivery(settlementOrder)
            : settlementOrder.proofOfDelivery;
        const senderClosedAt =
          settlementOrder.participantRole === "sender" &&
          (settlementOrder.status === "delivered" || settlementOrder.status === "partially_completed") &&
          settlementOrder.dropoffMethod === "leave_at_door"
            ? settlementOrder.senderClosedAt ?? now
            : settlementOrder.senderClosedAt;
        const receipt = isReceiptEligible(nextSettlement.status)
          ? generateDeliveryReceipt(settlementOrder, nextSettlement)
          : settlementOrder.receipt ?? null;
        const needsPayment = requiresIncomingDeliveryPayment(
          settlementOrder.participantRole,
          settlementOrder.status,
          nextSettlement.status
        );

        nextNotifications = appendDeliveryNotification(nextNotifications, {
          orderId: patchedOrder.id,
          title: `Realtime update: ${getDeliveryStatusLabel(patchedOrder.status)}`,
          body: action.payload.note ?? "Delivery state changed from live tracking updates.",
          category: "status",
          createdAt: now
        });

        return {
          ...settlementOrder,
          needsPayment,
          senderClosedAt,
          settlement: nextSettlement,
          proofOfDelivery,
          receipt
        };
      });
      const activeOrderId = state.delivery.activeOrder?.id;
      const activeOrder = activeOrderId
        ? updatedOrders.find((order) => order.id === activeOrderId) ?? null
        : state.delivery.activeOrder;
      return {
        ...state,
        delivery: {
          ...state.delivery,
          orders: updatedOrders,
          activeOrder,
          notifications: nextNotifications,
          lastRealtimeSync: new Date().toISOString()
        }
      };
    }
    case "delivery/poll": {
      const now = new Date().toISOString();
      let nextNotifications = state.delivery.notifications;
      const updatedOrders = state.delivery.orders.map((order) => {
        const updatedOrder = simulateDeliveryPollTick(order);
        if (updatedOrder.status === order.status) {
          return updatedOrder;
        }

        const effectivePaymentMethodId =
          updatedOrder.participantRole === "receiver" && ["delivered", "partially_completed"].includes(updatedOrder.status)
            ? getDefaultPaymentMethodId(state.paymentMethods)
            : updatedOrder.paymentMethodId;
        const settlementOrder =
          effectivePaymentMethodId === updatedOrder.paymentMethodId
            ? updatedOrder
            : { ...updatedOrder, paymentMethodId: effectivePaymentMethodId };
        const paymentMethodType = getPaymentMethodType(state.paymentMethods, effectivePaymentMethodId);
        const currentSettlement =
          (effectivePaymentMethodId === updatedOrder.paymentMethodId ? updatedOrder.settlement : undefined) ??
          initializeDeliverySettlement(settlementOrder, paymentMethodType, now);
        let nextSettlement = applySettlementForDeliveryStatus(
          currentSettlement,
          settlementOrder,
          settlementOrder.status,
          0,
          now
        );
        nextSettlement = enforceIncomingDeliveryPendingPayment(
          nextSettlement,
          settlementOrder.participantRole,
          settlementOrder.status,
          settlementOrder.costBreakdown.total,
          now
        );
        const requiresSenderConfirmation =
          settlementOrder.participantRole === "sender" &&
          settlementOrder.status === "delivered" &&
          settlementOrder.dropoffMethod !== "leave_at_door";
        const proofOfDelivery =
          settlementOrder.status === "delivered" || settlementOrder.status === "partially_completed"
            ? requiresSenderConfirmation
              ? settlementOrder.proofOfDelivery ?? null
              : settlementOrder.proofOfDelivery ?? createAutoProofOfDelivery(settlementOrder)
            : settlementOrder.proofOfDelivery;
        const senderClosedAt =
          settlementOrder.participantRole === "sender" &&
          (settlementOrder.status === "delivered" || settlementOrder.status === "partially_completed") &&
          settlementOrder.dropoffMethod === "leave_at_door"
            ? settlementOrder.senderClosedAt ?? now
            : settlementOrder.senderClosedAt;
        const receipt = isReceiptEligible(nextSettlement.status)
          ? generateDeliveryReceipt(settlementOrder, nextSettlement)
          : settlementOrder.receipt ?? null;
        const needsPayment = requiresIncomingDeliveryPayment(
          settlementOrder.participantRole,
          settlementOrder.status,
          nextSettlement.status
        );

        nextNotifications = appendDeliveryNotification(nextNotifications, {
          orderId: updatedOrder.id,
          title: `Tracking update: ${getDeliveryStatusLabel(updatedOrder.status)}`,
          body: "Delivery timeline progressed from polling updates.",
          category: "status",
          createdAt: now
        });

        return {
          ...settlementOrder,
          needsPayment,
          senderClosedAt,
          settlement: nextSettlement,
          proofOfDelivery,
          receipt
        };
      });
      const activeOrderId = state.delivery.activeOrder?.id;
      const activeOrder = activeOrderId
        ? updatedOrders.find((order) => order.id === activeOrderId) ?? null
        : state.delivery.activeOrder;
      return {
        ...state,
        delivery: {
          ...state.delivery,
          orders: updatedOrders,
          activeOrder,
          notifications: nextNotifications,
          lastRealtimeSync: new Date().toISOString()
        }
      };
    }
    case "delivery/ws-connected":
      return {
        ...state,
        delivery: {
          ...state.delivery,
          websocketConnected: action.payload
        }
      };
    case "rental/begin": {
      const vehicleId =
        action.payload?.vehicleId ??
        state.rental.selectedVehicleId ??
        state.rental.vehicles[0]?.id ??
        "EV-RENT-01";
      return {
        ...state,
        rental: {
          ...state.rental,
          selectedVehicleId: vehicleId,
          booking: createDraftRentalBooking(vehicleId),
          activePayment: null
        }
      };
    }
    case "rental/booking": {
      const nextBooking = { ...state.rental.booking, ...action.payload };
      const nextBookings =
        nextBooking.status === "draft"
          ? state.rental.bookings
          : upsertRentalBooking(state.rental.bookings, nextBooking);
      return {
        ...state,
        rental: {
          ...state.rental,
          booking: nextBooking,
          bookings: nextBookings,
          activePayment: nextBooking.status === "draft" ? null : state.rental.activePayment
        }
      };
    }
    case "rental/select":
      if (state.rental.booking.status !== "draft") {
        return {
          ...state,
          rental: {
            ...state.rental,
            selectedVehicleId: action.payload,
            booking: createDraftRentalBooking(action.payload),
            activePayment: null
          }
        };
      }
      return {
        ...state,
        rental: {
          ...state.rental,
          selectedVehicleId: action.payload,
          booking: { ...state.rental.booking, vehicleId: action.payload }
        }
      };
    case "rental/payment-init": {
      const nextBooking: RentalBooking = {
        ...state.rental.booking,
        bookingReference: action.payload.bookingReference,
        userId: action.payload.userId,
        paymentMethodId: action.payload.paymentMethodId,
        paymentMethodType: action.payload.paymentMethodType,
        paymentStatus: "pending",
        paymentFailureReason: undefined,
        status: "pending_payment"
      };
      return {
        ...state,
        rental: {
          ...state.rental,
          booking: nextBooking,
          bookings: upsertRentalBooking(state.rental.bookings, nextBooking),
          activePayment: action.payload
        }
      };
    }
    case "rental/payment-session": {
      if (!state.rental.activePayment) {
        return state;
      }
      const nextPayment: RentalPaymentSession = {
        ...state.rental.activePayment,
        ...action.payload,
        updatedAt: action.payload.updatedAt ?? new Date().toISOString()
      };
      const nextBooking: RentalBooking = {
        ...state.rental.booking,
        paymentMethodId: nextPayment.paymentMethodId,
        paymentMethodType: nextPayment.paymentMethodType,
        paymentStatus: nextPayment.status,
        paymentFailureReason: nextPayment.failureReason
      };
      return {
        ...state,
        rental: {
          ...state.rental,
          booking: nextBooking,
          bookings: upsertRentalBooking(state.rental.bookings, nextBooking),
          activePayment: nextPayment
        }
      };
    }
    case "rental/payment-fail": {
      if (!state.rental.activePayment) {
        return state;
      }
      const now = new Date().toISOString();
      const nextPayment: RentalPaymentSession = {
        ...state.rental.activePayment,
        status: action.payload.status,
        failureReason: action.payload.reason,
        updatedAt: now
      };
      const nextBooking: RentalBooking = {
        ...state.rental.booking,
        paymentMethodId: nextPayment.paymentMethodId,
        paymentMethodType: nextPayment.paymentMethodType,
        paymentStatus: action.payload.status,
        paymentFailureReason: action.payload.reason,
        status: "failed_payment"
      };
      return {
        ...state,
        rental: {
          ...state.rental,
          booking: nextBooking,
          bookings: upsertRentalBooking(state.rental.bookings, nextBooking),
          activePayment: nextPayment
        }
      };
    }
    case "rental/payment-complete": {
      const now = action.payload.transaction.paidAt;
      const walletTransaction: WalletTransaction = {
        id: `tx_rental_${action.payload.transaction.transactionId}`,
        title: "Rental payment",
        source: action.payload.transaction.bookingReference,
        amount: `-UGX ${Math.round(action.payload.transaction.amountPaid).toLocaleString()}`,
        time: formatWalletTransactionTime(now),
        type: "rental"
      };
      const activePayment = state.rental.activePayment
        ? {
            ...state.rental.activePayment,
            status: "successful" as const,
            transactionId: action.payload.transaction.transactionId,
            updatedAt: now,
            failureReason: undefined
          }
        : null;

      return {
        ...state,
        walletBalance: Math.max(0, state.walletBalance - action.payload.walletDebitAmount),
        transactions: [walletTransaction, ...state.transactions],
        rental: {
          ...state.rental,
          booking: action.payload.booking,
          bookings: upsertRentalBooking(state.rental.bookings, action.payload.booking),
          paymentTransactions: [action.payload.transaction, ...state.rental.paymentTransactions],
          receipts: [action.payload.receipt, ...state.rental.receipts],
          activePayment
        }
      };
    }
    case "rental/payment-reset":
      return {
        ...state,
        rental: {
          ...state.rental,
          activePayment: null
        }
      };
    case "rental/bookings-sync":
      return {
        ...state,
        rental: {
          ...state.rental,
          bookings: action.payload
        }
      };
    case "tours/payment-init": {
      const nextBooking: TourBooking = {
        ...state.tours.booking,
        bookingReference: action.payload.bookingReference,
        userId: action.payload.userId,
        paymentMethodId: action.payload.paymentMethodId,
        paymentMethodType: action.payload.paymentMethodType,
        paymentStatus: "pending",
        paymentFailureReason: undefined,
        status: "pending_payment"
      };
      return {
        ...state,
        tours: {
          ...state.tours,
          booking: nextBooking,
          activePayment: action.payload
        }
      };
    }
    case "tours/payment-session": {
      if (!state.tours.activePayment) {
        return state;
      }
      const nextPayment: TourPaymentSession = {
        ...state.tours.activePayment,
        ...action.payload,
        updatedAt: action.payload.updatedAt ?? new Date().toISOString()
      };
      const nextBooking: TourBooking = {
        ...state.tours.booking,
        paymentMethodId: nextPayment.paymentMethodId,
        paymentMethodType: nextPayment.paymentMethodType,
        paymentStatus: nextPayment.status,
        paymentFailureReason: nextPayment.failureReason
      };
      return {
        ...state,
        tours: {
          ...state.tours,
          booking: nextBooking,
          activePayment: nextPayment
        }
      };
    }
    case "tours/payment-fail": {
      if (!state.tours.activePayment) {
        return state;
      }
      const now = new Date().toISOString();
      const nextPayment: TourPaymentSession = {
        ...state.tours.activePayment,
        status: action.payload.status,
        failureReason: action.payload.reason,
        updatedAt: now
      };
      const nextBooking: TourBooking = {
        ...state.tours.booking,
        paymentMethodId: nextPayment.paymentMethodId,
        paymentMethodType: nextPayment.paymentMethodType,
        paymentStatus: action.payload.status,
        paymentFailureReason: action.payload.reason,
        status: "failed_payment"
      };
      return {
        ...state,
        tours: {
          ...state.tours,
          booking: nextBooking,
          activePayment: nextPayment
        }
      };
    }
    case "tours/payment-complete": {
      const now = action.payload.transaction.paidAt;
      const walletTransaction: WalletTransaction = {
        id: `tx_tour_${action.payload.transaction.transactionId}`,
        title: "Tour payment",
        source: action.payload.transaction.bookingReference,
        amount: `-UGX ${Math.round(action.payload.transaction.amountPaid).toLocaleString()}`,
        time: formatWalletTransactionTime(now),
        type: "tour"
      };
      const activePayment = state.tours.activePayment
        ? {
            ...state.tours.activePayment,
            status: "successful" as const,
            transactionId: action.payload.transaction.transactionId,
            updatedAt: now,
            failureReason: undefined
          }
        : null;

      return {
        ...state,
        walletBalance: Math.max(0, state.walletBalance - action.payload.walletDebitAmount),
        transactions: [walletTransaction, ...state.transactions],
        tours: {
          ...state.tours,
          booking: action.payload.booking,
          bookings: upsertTourBooking(state.tours.bookings, action.payload.booking),
          paymentTransactions: [action.payload.transaction, ...state.tours.paymentTransactions],
          receipts: [action.payload.receipt, ...state.tours.receipts],
          activePayment
        }
      };
    }
    case "tours/payment-reset":
      return {
        ...state,
        tours: {
          ...state.tours,
          activePayment: null
        }
      };
    case "tours/bookings-sync":
      return {
        ...state,
        tours: {
          ...state.tours,
          bookings: action.payload
        }
      };
    case "tours/booking": {
      const nextBooking: TourBooking = { ...state.tours.booking, ...action.payload };
      const nextBookings =
        nextBooking.status === "draft"
          ? state.tours.bookings
          : upsertTourBooking(state.tours.bookings, nextBooking);
      return {
        ...state,
        tours: {
          ...state.tours,
          booking: nextBooking,
          bookings: nextBookings,
          activePayment: nextBooking.status === "draft" ? null : state.tours.activePayment
        }
      };
    }
    case "tours/select":
      if (state.tours.booking.status !== "draft") {
        return {
          ...state,
          tours: {
            ...state.tours,
            selectedTourId: action.payload,
            booking: createDraftTourBooking(action.payload, state.tours.booking),
            activePayment: null
          }
        };
      }
      return {
        ...state,
        tours: {
          ...state.tours,
          selectedTourId: action.payload,
          booking: { ...state.tours.booking, tourId: action.payload },
          activePayment: null
        }
      };
    case "ambulance/update":
      return {
        ...state,
        ambulance: {
          ...state.ambulance,
          request: { ...state.ambulance.request, ...action.payload }
        }
      };
    case "ambulance/request-sync":
      return {
        ...state,
        ambulance: {
          ...state.ambulance,
          request: action.payload
        }
      };
    case "ambulance/history-sync":
      return {
        ...state,
        ambulance: {
          ...state.ambulance,
          history: action.payload
        }
      };
    case "emergency/add":
      return { ...state, emergencyContacts: [...state.emergencyContacts, action.payload] };
    case "emergency/update":
      return {
        ...state,
        emergencyContacts: state.emergencyContacts.map((contact) =>
          contact.id === action.payload.id ? { ...action.payload } : contact
        )
      };
    case "emergency/remove":
      return {
        ...state,
        emergencyContacts: state.emergencyContacts.filter((contact) => contact.id !== action.payload)
      };
    case "emergency/set-default":
      return {
        ...state,
        emergencyContacts: updateEmergencyContactsDefault(state.emergencyContacts, action.payload)
      };
    case "emergency/sync":
      return {
        ...state,
        emergencyContacts: action.payload,
      };
    case "sos/start":
      return {
        ...state,
        sos: {
          ...state.sos,
          activeEventId: action.payload.id,
          events: [action.payload, ...state.sos.events]
        }
      };
    case "sos/status":
      return {
        ...state,
        sos: {
          ...state.sos,
          events: state.sos.events.map((event) => {
            if (event.id !== action.payload.id) return event;
            const updatedAt = new Date().toISOString();
            return {
              ...event,
              status: action.payload.status,
              updatedAt,
              logs: [
                ...event.logs,
                {
                  status: action.payload.status,
                  timestamp: updatedAt,
                  note: action.payload.note
                }
              ]
            };
          })
        }
      };
    case "reminder/dismiss":
      return {
        ...state,
        reminders: state.reminders.filter((reminder) => reminder.id !== action.payload)
      };
    case "reminder/dismiss-many": {
      const ids = new Set(action.payload);
      if (ids.size === 0) {
        return state;
      }
      return {
        ...state,
        reminders: state.reminders.filter((reminder) => !ids.has(reminder.id))
      };
    }

    case "ride/set-temporary-stop":
      return {
        ...state,
        ride: {
          ...state.ride,
          temporaryStop: { ...state.ride.temporaryStop, ...action.payload }
        }
      };
    case "ride/set-safety-check":
      return {
        ...state,
        ride: {
          ...state.ride,
          safetyCheck: { ...state.ride.safetyCheck, ...action.payload }
        }
      };
    case "location/update":
      return {
        ...state,
        sharedLocationState: { ...state.sharedLocationState, ...action.payload }
      };
    default:
      return state;
  }
}

interface AppDataProviderProps {
  children: ReactNode;
}

export function AppDataProvider({ children }: AppDataProviderProps): React.JSX.Element {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(appReducer, initialState, createInitialState);
  const senderConfirmationTimersRef = useRef<Map<string, number>>(new Map());
  const ambulanceCreateInFlightRef = useRef(false);
  const [riderBackendEnabled, setRiderBackendEnabled] = useState(() => isRiderBackendEnabled());

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const syncBackendFlag = () => {
      setRiderBackendEnabled(isRiderBackendEnabled());
    };

    window.addEventListener(BACKEND_FLAG_EVENT, syncBackendFlag as EventListener);
    syncBackendFlag();

    return () => {
      window.removeEventListener(BACKEND_FLAG_EVENT, syncBackendFlag as EventListener);
    };
  }, []);

  const updateSettings = useCallback((patch: Partial<SettingsState>) => {
    dispatch({ type: "settings/update", payload: patch });
  }, []);

  const updateNotifications = useCallback((patch: Partial<NotificationPreferences>) => {
    dispatch({ type: "settings/notifications", payload: patch });
  }, []);

  const updatePrivacy = useCallback((patch: Partial<PrivacyPreferences>) => {
    dispatch({ type: "settings/privacy", payload: patch });
  }, []);

  const updateRidePreferences = useCallback((patch: Partial<RidePreferences>) => {
    dispatch({ type: "settings/ride", payload: patch });
  }, []);

  const updateDeliveryPreferences = useCallback((patch: Partial<DeliveryPreferences>) => {
    dispatch({ type: "settings/delivery", payload: patch });
  }, []);

  const updateRideRequest = useCallback((patch: Partial<RideRequest>) => {
    const nextRequest = normalizeRideRequest({ ...state.ride.request, ...patch });
    dispatch({ type: "ride/request", payload: patch });

    if (buildRideRouteSignature(state.ride.request) !== buildRideRouteSignature(nextRequest) && !hasRideRouteCoordinates(nextRequest)) {
      dispatch({
        type: "location/update",
        payload: {
          routeDistanceKm: null,
          routeDurationMin: null,
        },
      });
    }

    const repricedOptions = computeRideOptionsForDistance(
      state.ride,
      nextRequest,
      state.sharedLocationState,
    );
    if (!areRideOptionPricesEquivalent(state.ride.options, repricedOptions)) {
      dispatch({ type: "ride/options", payload: repricedOptions });
    }
  }, [state.ride, state.sharedLocationState]);

  const updateRideTrip = useCallback((patch: Partial<RideTrip>) => {
    dispatch({ type: "ride/trip", payload: patch });
  }, []);

  const refreshRideOptionPricing = useCallback((distanceKm?: number | null) => {
    const repricedOptions = computeRideOptionsForDistance(
      state.ride,
      state.ride.request,
      state.sharedLocationState,
      distanceKm
    );
    const unchanged = areRideOptionPricesEquivalent(state.ride.options, repricedOptions);
    if (unchanged) return;
    dispatch({ type: "ride/options", payload: repricedOptions });
  }, [state.ride, state.sharedLocationState]);

  const updateRideSharing = useCallback((patch: Partial<RideState["sharing"]>) => {
    dispatch({ type: "ride/sharing", payload: patch });
  }, []);

  const setRideStatus = useCallback((status: RideStatus) => {
    dispatch({ type: "ride/status", payload: status });

    if (status === "searching" && !state.ride.activeTrip && !riderBackendEnabled) {
      const repricedOptions = computeRideOptionsForDistance(
        state.ride,
        state.ride.request,
        state.sharedLocationState
      );
      const optionsChanged = !areRideOptionPricesEquivalent(state.ride.options, repricedOptions);
      if (optionsChanged) {
        dispatch({ type: "ride/options", payload: repricedOptions });
      }
      const snapshotState = {
        ...state,
        ride: {
          ...state.ride,
          options: repricedOptions
        }
      };
      const localTrip = createRideTripFromRequest(snapshotState);
      if (localTrip) {
        dispatch({ type: "ride/set-active", payload: localTrip });
      }
    }

    if (!riderBackendEnabled || typeof window === "undefined") {
      return;
    }

    if (!window.localStorage.getItem("evzone_auth_token")) {
      return;
    }

    if (status === "searching") {
      if (state.ride.activeTrip?.status === "searching") {
        return;
      }
      const requestPayload = normalizeRideRequest(state.ride.request);
      if (!requestPayload.origin || !requestPayload.destination) {
        return;
      }

      const pickupCoords = requestPayload.origin.coordinates ?? { lat: 0, lng: 0 };
      const dropoffCoords = requestPayload.destination.coordinates ?? { lat: 0, lng: 0 };

      void createRiderTripRequest({
        pickupLabel: requestPayload.origin.label,
        pickupAddress: requestPayload.origin.address,
        pickupLat: pickupCoords.lat,
        pickupLng: pickupCoords.lng,
        dropoffLabel: requestPayload.destination.label,
        dropoffAddress: requestPayload.destination.address,
        dropoffLat: dropoffCoords.lat,
        dropoffLng: dropoffCoords.lng,
        routeSummary:
          (requestPayload.routePoints ?? [])
            .map((point) => point.label || point.address)
            .filter(Boolean)
            .join(" -> ") ||
          `${requestPayload.origin.label} -> ${requestPayload.destination.label}`,
        routeMode: requestPayload.routeMode,
        tripType: requestPayload.tripType,
        tripMode: requestPayload.tripMode,
        returnToOrigin: requestPayload.returnToOrigin,
        waypoints: (requestPayload.stops ?? [])
          .map((point) => ({
            label: point.label,
            address: point.address,
            lat: point.coordinates?.lat,
            lng: point.coordinates?.lng
          })),
        bookedFor: requestPayload.bookedFor ?? null
      })
        .then((trip) => {
          const mappedTrip = mapApiTripToRideTrip(trip);
          dispatch({
            type: "ride/set-active",
            payload: {
              ...hydrateRideTripWithSimulationDefaults(state, mappedTrip, requestPayload),
              // Ensure required fields conform to RideTrip type (id must be string)
              id: mappedTrip.id ?? trip.id ?? `local-${Date.now()}`,
              bookedFor: mappedTrip.bookedFor ?? requestPayload.bookedFor ?? null
            }
          });
        })
        .catch((error) => {
          console.warn("Rider backend trip request failed. Keeping local ride flow.", error);
        });
      return;
    }

    const backendStatus = mapRideStatusToBackendStatus(status);
    const tripId = state.ride.activeTrip?.id;
    if (!backendStatus || !tripId) {
      return;
    }

    void updateRiderTripTracking(tripId, { status: backendStatus }).catch((error) => {
      console.warn("Rider backend tracking status update failed. Keeping local ride flow.", error);
    });
  }, [riderBackendEnabled, state, state.ride.activeTrip?.id, state.ride.activeTrip?.status, state.ride.request]);

  const setActiveTrip = useCallback((trip: RideTrip | null) => {
    dispatch({ type: "ride/set-active", payload: trip });
  }, []);

  const updateSharedLocationState = useCallback((patch: Partial<SharedLocationState>) => {
    dispatch({ type: "location/update", payload: patch });
    if (patch.routeDistanceKm !== undefined) {
      const repricedOptions = computeRideOptionsForDistance(
        state.ride,
        state.ride.request,
        { ...state.sharedLocationState, ...patch },
        patch.routeDistanceKm
      );
      const optionsChanged = !areRideOptionPricesEquivalent(state.ride.options, repricedOptions);
      if (optionsChanged) {
        dispatch({ type: "ride/options", payload: repricedOptions });
      }
    }

    if (!riderBackendEnabled || typeof window === "undefined") {
      return;
    }

    const tripId = state.ride.activeTrip?.id;
    if (!window.localStorage.getItem("evzone_auth_token") || !tripId) {
      return;
    }

    const routeSummary =
      (patch.pickupCoords && patch.destinationCoords
        ? `${patch.pickupCoords.lat.toFixed(4)},${patch.pickupCoords.lng.toFixed(4)} -> ${patch.destinationCoords.lat.toFixed(4)},${patch.destinationCoords.lng.toFixed(4)}`
        : undefined);

    void updateRiderTripTracking(tripId, {
      routeSummary,
      etaMinutes:
        patch.routeDurationMin === null || patch.routeDurationMin === undefined
          ? undefined
          : patch.routeDurationMin,
      distance:
        patch.routeDistanceKm === null || patch.routeDistanceKm === undefined
          ? undefined
          : `${patch.routeDistanceKm.toFixed(1)} km`,
    }).catch((error) => {
      console.warn("Rider backend tracking sync failed. Keeping local tracking flow.", error);
    });
  }, [riderBackendEnabled, state.ride, state.ride.activeTrip?.id, state.sharedLocationState]);

  const updateDeliveryDraft = useCallback((patch: Partial<DeliveryDraft>) => {
    dispatch({ type: "delivery/draft", payload: patch });
  }, []);

  const resetDeliveryDraft = useCallback(() => {
    dispatch({ type: "delivery/reset-draft" });
  }, []);

  const syncDeliveryOrders = useCallback((orders: DeliveryOrder[], activeOrder?: DeliveryOrder | null) => {
    dispatch({ type: "delivery/orders-sync", payload: { orders, activeOrder } });
  }, []);

  const simulateDriverAddStopRequest = useCallback((requestNote?: string) => {
    if (riderBackendEnabled) {
      return;
    }

    const nowIso = new Date().toISOString();
    const requestId = `stop_${Date.now()}`;
    dispatch({
      type: "ride/set-temporary-stop",
      payload: {
        status: "add_stop_requested",
        hasAutoAddStopSimulationFired: true,
        requestNote:
          requestNote ?? state.ride.workflow.tripSimulation.messages.addStopRequest,
        requestId,
        requestedAt: nowIso,
        confirmedAt: null,
        resumedAt: null,
        pauseStartedAt: null,
        continuePromptDueAt: null,
        continuePromptShownAt: null,
        timerPaused: false
      }
    });
    dispatch({ type: "ride/status", payload: "add_stop_requested" });
    if (state.ride.activeTrip) {
      setTimeout(() => {
        window.localStorage.setItem(
          "evzone_active_ride_stop_request",
          JSON.stringify({
            tripId: state.ride.activeTrip!.id,
            requestId,
            requestNote,
            ts: Date.now()
          })
        );
      }, 50);
    }
  }, [state.ride.activeTrip, state.ride.workflow.tripSimulation.messages.addStopRequest]);

  const respondToTemporaryStopRequest = useCallback((decision: "confirm" | "decline") => {
    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();
    if (decision === "confirm") {
      dispatch({
        type: "ride/set-temporary-stop",
        payload: {
          status: "paused_at_stop",
          confirmedAt: nowIso,
          resumedAt: null,
          pauseStartedAt: nowIso,
          continuePromptDueAt: null,
          continuePromptShownAt: null,
          timerPaused: true
        }
      });
      dispatch({ type: "ride/status", payload: "paused_at_stop" });
    } else {
      dispatch({
        type: "ride/set-temporary-stop",
        payload: {
          status: "idle",
          requestNote: "",
          continuePromptDueAt: null,
          continuePromptShownAt: null,
          timerPaused: false
        }
      });
      dispatch({ type: "ride/status", payload: "ongoing" });
    }
    if (!riderBackendEnabled && state.ride.activeTrip) {
      setTimeout(() => {
        window.localStorage.setItem(
          "evzone_active_ride_stop_response",
          JSON.stringify({
            tripId: state.ride.activeTrip!.id,
            requestId: state.ride.temporaryStop.requestId,
            decision,
            ts: nowMs
          })
        );
      }, 50);
    }
  }, [riderBackendEnabled, state.ride.activeTrip, state.ride.temporaryStop.requestId]);

  const simulateDriverContinueTripRequest = useCallback((requestNote?: string) => {
    if (riderBackendEnabled) {
      return;
    }

    if (state.ride.temporaryStop.status !== "paused_at_stop") {
      return;
    }

    const nowIso = new Date().toISOString();
    dispatch({
      type: "ride/set-temporary-stop",
      payload: {
        requestNote:
          requestNote ??
          state.ride.temporaryStop.requestNote ??
          state.ride.workflow.tripSimulation.messages.continueTripRequest,
        hasAutoContinueSimulationFired: true,
        continuePromptDueAt: nowIso,
        continuePromptShownAt: null
      }
    });

    if (state.ride.activeTrip) {
      setTimeout(() => {
        window.localStorage.setItem(
          "evzone_active_ride_continue_request",
          JSON.stringify({
            tripId: state.ride.activeTrip!.id,
            requestId: state.ride.temporaryStop.requestId,
            requestNote,
            ts: Date.now()
          })
        );
      }, 50);
    }
  }, [
    riderBackendEnabled,
    state.ride.activeTrip,
    state.ride.temporaryStop.requestId,
    state.ride.temporaryStop.requestNote,
    state.ride.temporaryStop.status,
    state.ride.workflow.tripSimulation.messages.continueTripRequest
  ]);

  const resetTemporaryStopState = useCallback(() => {
    dispatch({
      type: "ride/set-temporary-stop",
      payload: {
        status: "idle",
        hasAutoAddStopSimulationFired: false,
        hasAutoContinueSimulationFired: false,
        requestNote: "",
        requestId: null,
        requestedAt: null,
        confirmedAt: null,
        resumedAt: null,
        pauseStartedAt: null,
        continuePromptDueAt: null,
        continuePromptShownAt: null,
        totalPausedDurationMs: 0,
        timerPaused: false
      }
    });
  }, []);

  const resumeTripAfterTemporaryStop = useCallback(() => {
    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();
    const pauseStartMs = state.ride.temporaryStop.pauseStartedAt
      ? new Date(state.ride.temporaryStop.pauseStartedAt).getTime()
      : Number.NaN;
    const pausedDeltaMs =
      state.ride.temporaryStop.timerPaused && Number.isFinite(pauseStartMs)
        ? Math.max(0, nowMs - pauseStartMs)
        : 0;

    dispatch({
      type: "ride/set-temporary-stop",
      payload: {
        status: "idle",
        requestNote: "",
        resumedAt: nowIso,
        pauseStartedAt: null,
        continuePromptDueAt: null,
        continuePromptShownAt: null,
        totalPausedDurationMs: state.ride.temporaryStop.totalPausedDurationMs + pausedDeltaMs,
        timerPaused: false
      }
    });
    dispatch({ type: "ride/status", payload: "ongoing" });

    if (!riderBackendEnabled && state.ride.activeTrip) {
      setTimeout(() => {
        window.localStorage.setItem(
          "evzone_active_ride_stop_resume",
          JSON.stringify({ tripId: state.ride.activeTrip!.id, ts: nowMs })
        );
      }, 50);
    }
  }, [riderBackendEnabled, state.ride.activeTrip, state.ride.temporaryStop.pauseStartedAt, state.ride.temporaryStop.timerPaused, state.ride.temporaryStop.totalPausedDurationMs]);

  const markTemporaryStopContinuePromptShown = useCallback(() => {
    dispatch({
      type: "ride/set-temporary-stop",
      payload: { continuePromptShownAt: new Date().toISOString() }
    });
  }, []);

  const respondToSafetyCheck = useCallback((action: "okay" | "sos") => {
    dispatch({ type: "ride/set-safety-check", payload: { status: action === "sos" ? "sos_triggered" : "resolved" } });
    if (!riderBackendEnabled && state.ride.activeTrip) {
        setTimeout(() => {
            window.localStorage.setItem('evzone_active_ride_safety_passenger_action', JSON.stringify({ tripId: state.ride.activeTrip!.id, action, ts: Date.now() }));
        }, 50);
    }
  }, [riderBackendEnabled, state.ride.activeTrip]);

  useEffect(() => {
    if (riderBackendEnabled) {
      return;
    }

    const handleStorageEvent = (e: StorageEvent) => {
      if (!e.newValue || !state.ride.activeTrip) return;

      const key = e.key;
      if (!key?.startsWith("evzone_active_ride")) return;

      let parsed: Record<string, unknown> | null = null;
      try {
        parsed = JSON.parse(e.newValue) as Record<string, unknown>;
      } catch {
        return;
      }

      if (parsed.tripId !== state.ride.activeTrip.id) return;

      if (key === "evzone_active_ride_stop_request") {
        const nowIso = new Date().toISOString();
        dispatch({
          type: "ride/set-temporary-stop",
          payload: {
            status: "add_stop_requested",
            hasAutoAddStopSimulationFired: true,
            requestNote:
              typeof parsed.requestNote === "string" && parsed.requestNote.trim()
                ? parsed.requestNote
                : state.ride.workflow.tripSimulation.messages.addStopRequest,
            requestId: typeof parsed.requestId === "string" ? parsed.requestId : `stop_${Date.now()}`,
            requestedAt: nowIso,
            confirmedAt: null,
            resumedAt: null,
            pauseStartedAt: null,
            continuePromptDueAt: null,
            continuePromptShownAt: null,
            timerPaused: false
          }
        });
        dispatch({ type: "ride/status", payload: "add_stop_requested" });
      } else if (key === "evzone_active_ride_continue_request") {
        if (state.ride.temporaryStop.status === "paused_at_stop") {
          dispatch({
            type: "ride/set-temporary-stop",
            payload: {
              requestNote:
                typeof parsed.requestNote === "string" && parsed.requestNote.trim()
                  ? parsed.requestNote
                  : state.ride.temporaryStop.requestNote,
              hasAutoContinueSimulationFired: true,
              continuePromptDueAt: new Date().toISOString(),
              continuePromptShownAt: null
            }
          });
        }
      } else if (key === "evzone_active_ride_stop_resume") {
        const nowMs = Date.now();
        const nowIso = new Date(nowMs).toISOString();
        const pauseStartMs = state.ride.temporaryStop.pauseStartedAt
          ? new Date(state.ride.temporaryStop.pauseStartedAt).getTime()
          : Number.NaN;
        const pausedDeltaMs =
          state.ride.temporaryStop.timerPaused && Number.isFinite(pauseStartMs)
            ? Math.max(0, nowMs - pauseStartMs)
            : 0;

        dispatch({
          type: "ride/set-temporary-stop",
          payload: {
            status: "idle",
            requestNote: "",
            resumedAt: nowIso,
            pauseStartedAt: null,
            continuePromptDueAt: null,
            continuePromptShownAt: null,
            hasAutoContinueSimulationFired: true,
            totalPausedDurationMs: state.ride.temporaryStop.totalPausedDurationMs + pausedDeltaMs,
            timerPaused: false
          }
        });
        dispatch({ type: "ride/status", payload: "ongoing" });
      } else if (key === "evzone_active_ride_safety_check") {
        dispatch({ type: "ride/set-safety-check", payload: { status: "safety_check_pending" } });
      } else if (key === "evzone_active_ride_safety_resume") {
        dispatch({ type: "ride/set-safety-check", payload: { status: "idle" } });
      } else if (key === "evzone_active_ride_safety_driver_okay") {
        dispatch({ type: "ride/set-safety-check", payload: { status: "resolved" } });
      }
    };
    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, [riderBackendEnabled, state.ride.activeTrip, state.ride.temporaryStop.pauseStartedAt, state.ride.temporaryStop.timerPaused, state.ride.temporaryStop.totalPausedDurationMs]);

  const createDeliveryOrder = useCallback((draftOverride?: DeliveryDraft) => {
    const orderId = `DLV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Date.now()
      .toString()
      .slice(-4)}`;
    const senderName = user?.fullName ?? "Rider";
    const senderPhone = user?.phone ?? "+256 700 000 000";
    const previewOrder = createDeliveryOrderFromDraft(state, { orderId, senderName, senderPhone }, draftOverride);
    if (!previewOrder) {
      return null;
    }
    if (riderBackendEnabled && user) {
      const pickupCoords = previewOrder.pickup.coordinates ?? { lat: 0, lng: 0 };
      const dropoffCoords = previewOrder.dropoff.coordinates ?? { lat: 0, lng: 0 };
      dispatch({
        type: "delivery/orders-sync",
        payload: {
          orders: [previewOrder, ...state.delivery.orders.filter((order) => order.id !== previewOrder.id)],
          activeOrder: previewOrder
        }
      });
      void createRiderDelivery({
        pickupAddress: previewOrder.pickup.address,
        pickupLat: pickupCoords.lat,
        pickupLng: pickupCoords.lng,
        dropoffAddress: previewOrder.dropoff.address,
        dropoffLat: dropoffCoords.lat,
        dropoffLng: dropoffCoords.lng,
        itemDescription: previewOrder.parcel.description,
      })
        .then((savedOrder) => {
          const backendOrder = mapBackendDeliveryApiToOrder(savedOrder);
          dispatch({
            type: "delivery/orders-sync",
            payload: {
              orders: [backendOrder, ...state.delivery.orders.filter((order) => order.id !== backendOrder.id)],
              activeOrder: backendOrder
            }
          });
        })
        .catch((error) => {
          console.warn("Rider backend delivery create failed. Keeping optimistic delivery cache in sync.", error);
        });
      return previewOrder;
    }

    dispatch({ type: "delivery/create-order", payload: { orderId, senderName, senderPhone, draftOverride } });
    return previewOrder;
  }, [riderBackendEnabled, state, user, state.delivery.orders, user?.fullName, user?.phone]);

  const setActiveDelivery = useCallback((order: DeliveryOrder | null) => {
    dispatch({ type: "delivery/active", payload: order });
  }, []);

  const setActiveDeliveryById = useCallback((orderId: string) => {
    dispatch({ type: "delivery/active-by-id", payload: orderId });
  }, []);

  const updateDeliveryOrderStatus = useCallback((orderId: string, status: DeliveryStatus, note?: string) => {
    dispatch({ type: "delivery/status", payload: { orderId, status, note } });
  }, []);

  const logDeliveryContactEvent = useCallback((orderId: string, contactType: DeliveryContactType) => {
    dispatch({ type: "delivery/contact", payload: { orderId, contactType } });
  }, []);

  const reportDeliveryException = useCallback(
    (params: { orderId: string; type: DeliveryExceptionType; note: string; requestedRefundAmount?: number }) => {
      dispatch({ type: "delivery/exception", payload: params });
    },
    []
  );

  const resolveDeliveryExceptionById = useCallback(
    (orderId: string, exceptionId: string, resolution: string) => {
      dispatch({ type: "delivery/exception-resolve", payload: { orderId, exceptionId, resolution } });
    },
    []
  );

  const submitProofOfDelivery = useCallback((orderId: string, proof: DeliveryProofOfDelivery) => {
    dispatch({ type: "delivery/proof", payload: { orderId, proof } });
  }, []);

  const receiveSenderDeliveryConfirmation = useCallback((orderId: string) => {
    dispatch({ type: "delivery/sender-confirmation", payload: { orderId } });
  }, []);

  const closeSenderDelivery = useCallback((orderId: string) => {
    dispatch({ type: "delivery/sender-close", payload: { orderId } });
  }, []);

  const updateScheduledDelivery = useCallback((orderId: string, scheduleTime: string) => {
    dispatch({ type: "delivery/schedule", payload: { orderId, scheduleTime } });
  }, []);

  const cancelScheduledDelivery = useCallback((orderId: string, reason: string) => {
    dispatch({ type: "delivery/cancel-scheduled", payload: { orderId, reason } });
  }, []);

  const submitDeliveryRating = useCallback(
    (orderId: string, payload: { score: number; tags: string[]; comment?: string }) => {
      dispatch({ type: "delivery/rating", payload: { orderId, ...payload } });
    },
    []
  );

  const selectDeliverySettlementMethod = useCallback((orderId: string, paymentMethodId: string) => {
    dispatch({ type: "delivery/settlement-method", payload: { orderId, paymentMethodId } });
  }, []);

  const captureDeliverySettlement = useCallback((orderId: string) => {
    dispatch({ type: "delivery/settlement-capture", payload: { orderId } });
  }, []);

  const markDeliveryNotificationsRead = useCallback(() => {
    dispatch({ type: "delivery/notifications-read" });
  }, []);

  const applyDeliveryRealtimePatch = useCallback((patch: DeliveryRealtimePatch) => {
    dispatch({ type: "delivery/realtime", payload: patch });
  }, []);

  const beginRentalBooking = useCallback((vehicleId?: string) => {
    dispatch({ type: "rental/begin", payload: { vehicleId } });
  }, []);

  const updateRentalBooking = useCallback((patch: Partial<RentalBooking>) => {
    dispatch({ type: "rental/booking", payload: patch });
  }, []);

  const selectRentalVehicle = useCallback((vehicleId: string) => {
    dispatch({ type: "rental/select", payload: vehicleId });
  }, []);

  const initializeRentalPayment = useCallback(
    (params: { paymentMethodId: string; amount: number }): RentalPaymentSession | null => {
      const selectedMethod = state.paymentMethods.find((method) => method.id === params.paymentMethodId);
      if (!selectedMethod || selectedMethod.type === "cash") {
        return null;
      }
      const now = new Date().toISOString();
      const bookingReference = state.rental.booking.bookingReference ?? createBookingReference(new Date(now));
      const session: RentalPaymentSession = {
        bookingId: state.rental.booking.id,
        bookingReference,
        userId: user?.id ?? "guest_user",
        customerName: user?.fullName ?? "Guest user",
        customerEmail: user?.email,
        customerPhone: user?.phone,
        paymentMethodId: selectedMethod.id,
        paymentMethodType: selectedMethod.type,
        amount: params.amount,
        status: "pending",
        otpAttempts: 0,
        createdAt: now,
        updatedAt: now
      };
      dispatch({ type: "rental/payment-init", payload: session });
      return session;
    },
    [state.paymentMethods, state.rental.booking.bookingReference, state.rental.booking.id, user]
  );

  const updateRentalPaymentSession = useCallback((patch: Partial<RentalPaymentSession>) => {
    dispatch({ type: "rental/payment-session", payload: patch });
  }, []);

  const completeRentalPayment = useCallback(
    (params: {
      paymentMethodLabel: string;
      maskedCardNumber?: string;
      provider?: "MTN Mobile Money" | "Airtel Money";
      mobileMoneyPhone?: string;
      cardHolderName?: string;
      cardLast4?: string;
      billingEmail?: string;
      billingPhone?: string;
    }): RentalPaymentTransaction | null => {
      const payment = state.rental.activePayment;
      if (!payment) {
        return null;
      }
      const now = new Date().toISOString();
      const vehicle = getRentalBookingVehicle(
        state.rental.vehicles,
        state.rental.booking,
        state.rental.selectedVehicleId
      );
      const pricing = buildRentalPricing(vehicle, state.rental.booking);
      const transactionId = createTransactionId(new Date(now));
      const bookingReference = payment.bookingReference;
      const nextBooking: RentalBooking = {
        ...state.rental.booking,
        bookingReference,
        userId: payment.userId,
        paymentMethodId: payment.paymentMethodId,
        paymentMethodType: payment.paymentMethodType,
        paymentStatus: "successful",
        paymentFailureReason: undefined,
        status: "confirmed",
        transactionId,
        confirmedAt: now,
        priceEstimate: formatCurrencyUGX(payment.amount)
      };

      const transaction: RentalPaymentTransaction = {
        transactionId,
        bookingId: nextBooking.id,
        bookingReference,
        userId: payment.userId,
        customerName: payment.customerName,
        customerEmail: params.billingEmail ?? payment.customerEmail,
        customerPhone: params.billingPhone ?? params.mobileMoneyPhone ?? payment.customerPhone,
        vehicleId: vehicle?.id ?? nextBooking.vehicleId,
        vehicleName: vehicle?.name ?? "EV rental",
        startDate: nextBooking.startDate,
        endDate: nextBooking.endDate,
        pickupBranch: nextBooking.pickupBranch,
        dropoffBranch: nextBooking.dropoffBranch,
        amountPaid: payment.amount,
        refundableDeposit: pricing.refundableDeposit,
        paymentMethodId: payment.paymentMethodId,
        paymentMethodType: payment.paymentMethodType,
        paymentMethodLabel: params.paymentMethodLabel,
        provider: params.provider,
        maskedCardNumber: params.maskedCardNumber,
        status: "successful",
        paidAt: now
      };

      const durationDays = estimateRentalDays(nextBooking.startDate, nextBooking.endDate);
      const receipt: RentalPaymentReceipt = {
        receiptNumber: createReceiptNumber(new Date(now)),
        transactionId,
        bookingId: nextBooking.id,
        bookingReference,
        customerName: payment.customerName,
        customerEmail: params.billingEmail ?? payment.customerEmail,
        customerPhone: params.billingPhone ?? params.mobileMoneyPhone ?? payment.customerPhone,
        vehicleName: vehicle?.name ?? "EV rental",
        rentalDurationLabel: `${durationDays} day${durationDays === 1 ? "" : "s"}`,
        pickupBranch: nextBooking.pickupBranch,
        dropoffBranch: nextBooking.dropoffBranch,
        paymentMethodLabel: params.paymentMethodLabel,
        paymentStatus: "successful",
        bookingStatus: "confirmed",
        amountPaid: payment.amount,
        refundableDeposit: pricing.refundableDeposit,
        rentalSubtotal: pricing.rentalSubtotal,
        chauffeurFee: pricing.chauffeurFee,
        addOnsTotal: pricing.addOnsTotal,
        oneWayFee: pricing.oneWayFee,
        crossBorderFee: pricing.crossBorderFee,
        isOneWayRental: pricing.isOneWayRental,
        isCrossBorderRental: pricing.isCrossBorderRental,
        currency: "UGX",
        createdAt: now
      };

      dispatch({
        type: "rental/payment-complete",
        payload: {
          booking: nextBooking,
          transaction,
          receipt,
          walletDebitAmount: payment.paymentMethodType === "wallet" ? payment.amount : 0
        }
      });
      if (riderBackendEnabled) {
        const fallbackDate = new Date(now).toISOString().slice(0, 10);
        const vehicleId = nextBooking.vehicleId || state.rental.selectedVehicleId || "vehicle_unknown";
        void createRiderRental({
          vehicleId,
          startDate: nextBooking.startDate || fallbackDate,
          endDate: nextBooking.endDate || nextBooking.startDate || fallbackDate,
          pickupLocation: nextBooking.pickupBranch
            ? { lat: 0.3136, lng: 32.5811, address: nextBooking.pickupBranch }
            : undefined,
        }).catch((error) => {
          console.warn("Rider backend rental create failed.", error);
        });
      }
      return transaction;
    },
    [riderBackendEnabled, state.rental, state.rental.activePayment]
  );

  const failRentalPayment = useCallback(
    (params: {
      status: Exclude<RentalPaymentStatus, "pending" | "processing" | "successful" | "requires_verification">;
      reason: string;
    }) => {
      dispatch({ type: "rental/payment-fail", payload: params });
    },
    []
  );

  const resetRentalPayment = useCallback(() => {
    dispatch({ type: "rental/payment-reset" });
  }, []);

  const initializeTourPayment = useCallback(
    (params: { paymentMethodId: string; amount: number }): TourPaymentSession | null => {
      const selectedMethod = state.paymentMethods.find((method) => method.id === params.paymentMethodId);
      if (!selectedMethod || selectedMethod.type === "cash") {
        return null;
      }
      const now = new Date().toISOString();
      const bookingReference = state.tours.booking.bookingReference ?? createBookingReference(new Date(now));
      const session: TourPaymentSession = {
        bookingId: state.tours.booking.id,
        bookingReference,
        userId: user?.id ?? "guest_user",
        customerName: user?.fullName ?? "Guest user",
        customerEmail: user?.email,
        customerPhone: user?.phone,
        paymentMethodId: selectedMethod.id,
        paymentMethodType: selectedMethod.type,
        amount: params.amount,
        status: "pending",
        otpAttempts: 0,
        createdAt: now,
        updatedAt: now
      };
      dispatch({ type: "tours/payment-init", payload: session });
      return session;
    },
    [state.paymentMethods, state.tours.booking.bookingReference, state.tours.booking.id, user]
  );

  const updateTourPaymentSession = useCallback((patch: Partial<TourPaymentSession>) => {
    dispatch({ type: "tours/payment-session", payload: patch });
  }, []);

  const completeTourPayment = useCallback(
    (params: {
      paymentMethodLabel: string;
      maskedCardNumber?: string;
      provider?: "MTN Mobile Money" | "Airtel Money";
      mobileMoneyPhone?: string;
      cardHolderName?: string;
      cardLast4?: string;
      billingEmail?: string;
      billingPhone?: string;
    }): TourPaymentTransaction | null => {
      const payment = state.tours.activePayment;
      if (!payment) {
        return null;
      }
      const now = new Date().toISOString();
      const selectedTour =
        state.tours.tours.find((tour) => tour.id === state.tours.booking.tourId) ??
        state.tours.tours.find((tour) => tour.id === state.tours.selectedTourId) ??
        state.tours.tours[0];
      const transactionId = createTransactionId(new Date(now));
      const bookingReference = payment.bookingReference;
      const nextBooking: TourBooking = {
        ...state.tours.booking,
        bookingReference,
        userId: payment.userId,
        paymentMethodId: payment.paymentMethodId,
        paymentMethodType: payment.paymentMethodType,
        paymentStatus: "successful",
        paymentFailureReason: undefined,
        status: "confirmed",
        transactionId,
        confirmedAt: now,
        priceEstimate: formatCurrencyUGX(payment.amount)
      };

      const transaction: TourPaymentTransaction = {
        transactionId,
        bookingId: nextBooking.id,
        bookingReference,
        userId: payment.userId,
        customerName: payment.customerName,
        customerEmail: params.billingEmail ?? payment.customerEmail,
        customerPhone: params.billingPhone ?? params.mobileMoneyPhone ?? payment.customerPhone,
        tourId: selectedTour?.id ?? nextBooking.tourId,
        tourTitle: selectedTour?.title ?? "EV tour",
        location: selectedTour?.location ?? "Kampala",
        duration: selectedTour?.duration ?? "Tour",
        date: nextBooking.date,
        guests: nextBooking.guests,
        amountPaid: payment.amount,
        paymentMethodId: payment.paymentMethodId,
        paymentMethodType: payment.paymentMethodType,
        paymentMethodLabel: params.paymentMethodLabel,
        provider: params.provider,
        maskedCardNumber: params.maskedCardNumber,
        status: "successful",
        paidAt: now
      };

      const receipt: TourPaymentReceipt = {
        receiptNumber: createReceiptNumber(new Date(now)),
        transactionId,
        bookingId: nextBooking.id,
        bookingReference,
        customerName: payment.customerName,
        customerEmail: params.billingEmail ?? payment.customerEmail,
        customerPhone: params.billingPhone ?? params.mobileMoneyPhone ?? payment.customerPhone,
        tourTitle: selectedTour?.title ?? "EV tour",
        location: selectedTour?.location ?? "Kampala",
        duration: selectedTour?.duration ?? "Tour",
        date: nextBooking.date,
        guests: nextBooking.guests,
        paymentMethodLabel: params.paymentMethodLabel,
        paymentStatus: "successful",
        bookingStatus: "confirmed",
        amountPaid: payment.amount,
        currency: "UGX",
        createdAt: now
      };

      dispatch({
        type: "tours/payment-complete",
        payload: {
          booking: nextBooking,
          transaction,
          receipt,
          walletDebitAmount: payment.paymentMethodType === "wallet" ? payment.amount : 0
        }
      });
      if (riderBackendEnabled) {
        const fallbackDate = nextBooking.date || new Date(now).toISOString().slice(0, 10);
        void createRiderTour({
          tourId: nextBooking.tourId || selectedTour?.id || "tour_unknown",
          scheduledDate: fallbackDate,
          participantsCount: Math.max(1, nextBooking.guests || 1),
          specialRequests: undefined,
        }).catch((error) => {
          console.warn("Rider backend tour create failed.", error);
        });
      }
      return transaction;
    },
    [riderBackendEnabled, state.tours]
  );

  const failTourPayment = useCallback(
    (params: {
      status: Exclude<TourPaymentStatus, "pending" | "processing" | "successful" | "requires_verification">;
      reason: string;
    }) => {
      dispatch({ type: "tours/payment-fail", payload: params });
    },
    []
  );

  const resetTourPayment = useCallback(() => {
    dispatch({ type: "tours/payment-reset" });
  }, []);

  const updateTourBooking = useCallback((patch: Partial<TourBooking>) => {
    dispatch({ type: "tours/booking", payload: patch });
  }, []);

  const selectTour = useCallback((tourId: string) => {
    dispatch({ type: "tours/select", payload: tourId });
  }, []);

  const updateAmbulanceRequest = useCallback((patch: Partial<AmbulanceRequest>) => {
    dispatch({ type: "ambulance/update", payload: patch });

    if (!riderBackendEnabled) {
      return;
    }

    const nextRequest = { ...state.ambulance.request, ...patch };
    const pickup = nextRequest.pickup;
    const priority =
      nextRequest.urgency === "high"
        ? "emergency"
        : nextRequest.urgency === "medium"
          ? "urgent"
          : "normal";

    if (nextRequest.id === "ambulance_current") {
      if (ambulanceCreateInFlightRef.current || !pickup || nextRequest.status === "idle") {
        return;
      }

      ambulanceCreateInFlightRef.current = true;
      void createRiderAmbulance({
        pickupAddress: pickup.address || pickup.label,
        pickupLat: pickup.coordinates?.lat ?? 0.3136,
        pickupLng: pickup.coordinates?.lng ?? 32.5811,
        dropoffAddress: nextRequest.destination?.address || nextRequest.destination?.label,
        hospitalName: nextRequest.hospitalContactName,
        priority,
      })
        .then((created) => {
          dispatch({
            type: "ambulance/request-sync",
            payload: {
              ...nextRequest,
              ...mapBackendAmbulanceApiToRequest(created),
            },
          });
        })
        .catch((error) => {
          console.warn("Rider backend ambulance request create failed.", error);
        })
        .finally(() => {
          ambulanceCreateInFlightRef.current = false;
        });
      return;
    }

    if (nextRequest.id && nextRequest.id !== "ambulance_current") {
      if (nextRequest.status === "idle") {
        return;
      }
      void updateRiderAmbulance(nextRequest.id, {
        status:
          nextRequest.status === "assigned"
            ? "dispatched"
            : (nextRequest.status as
                | "requested"
                | "dispatched"
                | "en_route"
                | "arrived"
                | "in_progress"
                | "completed"
                | "cancelled"),
      })
        .then((updated) => {
          dispatch({
            type: "ambulance/request-sync",
            payload: {
              ...nextRequest,
              ...mapBackendAmbulanceApiToRequest(updated),
            },
          });
        })
        .catch((error) => {
          console.warn("Rider backend ambulance request update failed.", error);
        });
    }
  }, [riderBackendEnabled, state.ambulance.request]);

  const addEmergencyContact = useCallback((contact: Omit<EmergencyContact, "id">) => {
    const id = `ec_${Date.now()}`;
    const payload: EmergencyContact = { ...contact, id };
    dispatch({ type: "emergency/add", payload });
    if (payload.isDefault) {
      dispatch({ type: "emergency/set-default", payload: id });
    }
  }, []);

  const updateEmergencyContact = useCallback((contact: EmergencyContact) => {
    dispatch({ type: "emergency/update", payload: contact });
    if (contact.isDefault) {
      dispatch({ type: "emergency/set-default", payload: contact.id });
    }
  }, []);

  const removeEmergencyContact = useCallback((id: string) => {
    dispatch({ type: "emergency/remove", payload: id });
  }, []);

  const setDefaultEmergencyContact = useCallback((id: string) => {
    dispatch({ type: "emergency/set-default", payload: id });
  }, []);

  const startSos = useCallback(
    (context: SosEvent["context"]) => {
      const now = new Date().toISOString();
      const event: SosEvent = {
        id: `sos_${Date.now()}`,
        tripId: state.ride.activeTrip?.id ?? "ride_unknown",
        status: "initiated",
        createdAt: now,
        updatedAt: now,
        logs: [{ status: "initiated", timestamp: now, note: "SOS initiated" }],
        context
      };
      dispatch({ type: "sos/start", payload: event });
      return event.id;
    },
    [state.ride.activeTrip]
  );

  const updateSosStatus = useCallback((id: string, status: SosStatus, note?: string) => {
    dispatch({ type: "sos/status", payload: { id, status, note } });
  }, []);

  const resolveSos = useCallback((id: string, note?: string) => {
    dispatch({ type: "sos/status", payload: { id, status: "resolved", note } });
  }, []);

  const dismissReminder = useCallback((id: number) => {
    dispatch({ type: "reminder/dismiss", payload: id });
  }, []);

  const dismissReminders = useCallback((ids: number[]) => {
    dispatch({ type: "reminder/dismiss-many", payload: ids });
  }, []);

  useEffect(() => {
    if (riderBackendEnabled) {
      return;
    }

    const interval = window.setInterval(() => {
      dispatch({ type: "delivery/poll" });
    }, 7000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (riderBackendEnabled) {
      return;
    }

    const timers = senderConfirmationTimersRef.current;
    const pendingOrders = state.delivery.orders.filter(
      (order) =>
        requiresSenderSignatureConfirmation(order) &&
        !hasSenderSignatureImage(order) &&
        !order.senderClosedAt
    );
    const pendingOrderIds = new Set(pendingOrders.map((order) => order.id));

    for (const [orderId, timerId] of timers) {
      if (!pendingOrderIds.has(orderId)) {
        window.clearTimeout(timerId);
        timers.delete(orderId);
      }
    }

    for (const order of pendingOrders) {
      if (timers.has(order.id)) {
        continue;
      }

      const deliveredAtMs = new Date(order.deliveredAt ?? order.updatedAt ?? Date.now()).getTime();
      const elapsedMs = Number.isNaN(deliveredAtMs) ? 0 : Date.now() - deliveredAtMs;
      const delayMs = Math.max(0, AUTO_SENDER_CONFIRMATION_FETCH_DELAY_MS - elapsedMs);

      const timerId = window.setTimeout(() => {
        senderConfirmationTimersRef.current.delete(order.id);
        dispatch({ type: "delivery/sender-confirmation", payload: { orderId: order.id } });
      }, delayMs);
      timers.set(order.id, timerId);
    }
  }, [state.delivery.orders]);

  useEffect(
    () => () => {
      for (const timerId of senderConfirmationTimersRef.current.values()) {
        window.clearTimeout(timerId);
      }
      senderConfirmationTimersRef.current.clear();
    },
    []
  );

  useEffect(() => {
    if (!riderBackendEnabled || !user || typeof window === "undefined") {
      return;
    }

    if (!window.localStorage.getItem("evzone_auth_token")) {
      return;
    }

    let cancelled = false;

    const hydrateReadOnlyDomains = async () => {
      try {
        const [
          notifications,
          deliveries,
          wallet,
          walletTransactions,
          paymentMethods,
          preferences,
          contacts,
          history,
          activeTrip,
          rentals,
          tours,
          ambulances,
        ] = await Promise.all([
          getRiderNotifications(),
          listRiderDeliveries(),
          getRiderWallet(),
          listRiderWalletTransactions(),
          listRiderPaymentMethods(),
          getRiderPreferences(),
          listRiderEmergencyContacts(),
          getRiderTripHistory(),
          getRiderActiveTrip(),
          listRiderRentals(),
          listRiderTours(),
          listRiderAmbulances(),
        ]);

        if (cancelled) {
          return;
        }

        dispatch({
          type: "delivery/notifications-replace",
          payload: notifications.map((item) => ({
            id: item.id,
            orderId: "rider-general",
            title: item.title,
            body: item.body,
            category: item.category === "payment" ? "payment" : "system",
            createdAt: new Date(item.createdAt).toISOString(),
            read: item.read,
          })),
        });

        const mappedDeliveries = deliveries.map((delivery) => mapBackendDeliveryApiToOrder(delivery));
        const activeBackendDelivery =
          mappedDeliveries.find((order) => !["delivered", "cancelled", "failed"].includes(order.status)) ?? mappedDeliveries[0] ?? null;
        dispatch({
          type: "delivery/orders-sync",
          payload: {
            orders: mappedDeliveries,
            activeOrder: activeBackendDelivery,
          },
        });

        dispatch({
          type: "wallet/update",
          payload: {
            walletBalance: wallet.balance,
            walletReserved: wallet.pendingAmount,
            paymentMethods: paymentMethods.map(mapBackendPaymentMethod),
            transactions: walletTransactions.map(mapBackendWalletTransaction),
            reminders: state.reminders,
          },
        });

        dispatch({
          type: "settings/update",
          payload: mapBackendPreferencesToSettings(preferences, state.settings),
        });

        dispatch({
          type: "emergency/sync",
          payload: contacts.map(mapBackendEmergencyContact),
        });

        dispatch({
          type: "ride/history",
          payload: history.map((trip) =>
            hydrateRideTripWithSimulationDefaults(state, mapApiTripToRideTrip(trip))
          ).filter((trip): trip is RideTrip => Boolean(trip)),
        });

        dispatch({
          type: "rental/bookings-sync",
          payload: rentals.map((rental) => ({
            id: rental.id,
            vehicleId: rental.vehicleId,
            startDate: rental.startDate,
            endDate: rental.endDate,
            priceEstimate: `UGX ${Math.round(rental.totalAmount).toLocaleString()}`,
            status:
              rental.status === "cancelled"
                ? "cancelled"
                : rental.status === "completed"
                  ? "completed"
                  : "confirmed",
            confirmedAt: new Date(rental.createdAt).toISOString(),
          })),
        });

        dispatch({
          type: "tours/bookings-sync",
          payload: tours.map((tour) => ({
            id: tour.id,
            tourId: tour.tourId,
            date: tour.scheduledDate,
            guests: Math.max(1, tour.participantsCount || 1),
            priceEstimate: `UGX ${Math.round(tour.totalPrice).toLocaleString()}`,
            status:
              tour.status === "cancelled"
                ? "cancelled"
                : tour.status === "completed"
                  ? "completed"
                  : "confirmed",
            confirmedAt: new Date(tour.createdAt).toISOString(),
          })),
        });

        const ambulanceHistory: AmbulanceRequest[] = ambulances.map((ambulance): AmbulanceRequest => ({
          id: ambulance.id,
          pickup: {
            label: ambulance.pickupAddress,
            address: ambulance.pickupAddress,
          },
          destination: ambulance.dropoffAddress
            ? {
                label: ambulance.dropoffAddress,
                address: ambulance.dropoffAddress,
              }
            : null,
          urgency:
            ambulance.priority === "emergency"
              ? "high"
              : ambulance.priority === "urgent"
                ? "medium"
                : "low",
          status:
            ambulance.status === "dispatched"
              ? "assigned"
              : ambulance.status === "in_progress"
                ? "en_route"
                : (ambulance.status as
                    | "requested"
                    | "en_route"
                    | "arrived"
                    | "completed"
                    | "cancelled"),
          requestedAt: new Date(ambulance.requestedAt).toISOString(),
        }));
        dispatch({ type: "ambulance/history-sync", payload: ambulanceHistory });
        const latestAmbulance = ambulanceHistory[0];
        if (latestAmbulance) {
          dispatch({ type: "ambulance/request-sync", payload: latestAmbulance });
        }

        if (activeTrip) {
          dispatch({
            type: "ride/set-active",
            payload: hydrateRideTripWithSimulationDefaults(state, mapApiTripToRideTrip(activeTrip))
          });
        }
      } catch (error) {
        console.warn("Rider backend read-only domain hydration failed. Using local state.", error);
      }
    };

    void hydrateReadOnlyDomains();

    return () => {
      cancelled = true;
    };
  }, [riderBackendEnabled, user]);

  useEffect(() => {
    if (typeof window === "undefined" || !ALLOW_CACHE_FALLBACK) {
      return;
    }

    const persistedState: Partial<AppState> = {
      delivery: state.delivery,
      rental: state.rental,
      tours: state.tours,
      ambulance: state.ambulance
    };

    try {
      window.localStorage.setItem(APP_DATA_STORAGE_KEY, JSON.stringify(persistedState));
    } catch {
      // Ignore persistence failures so workflow interactions keep working.
    }
  }, [
    state.delivery,
    state.rental,
    state.tours,
    state.ambulance
  ]);

  useEffect(() => {
    if (!riderBackendEnabled || typeof window === "undefined") {
      dispatch({ type: "delivery/ws-connected", payload: false });
      return;
    }

    const socket = createRiderSocket();
    let cancelled = false;
    const syncBackendReadOnlyState = async () => {
      try {
        const [deliveries, wallet, walletTransactions, paymentMethods, preferences, contacts, rentals, tours, ambulances] =
          await Promise.all([
            listRiderDeliveries(),
            getRiderWallet(),
            listRiderWalletTransactions(),
            listRiderPaymentMethods(),
            getRiderPreferences(),
            listRiderEmergencyContacts(),
            listRiderRentals(),
            listRiderTours(),
            listRiderAmbulances()
          ]);

        if (cancelled) {
          return;
        }

        const mappedDeliveries = deliveries.map((delivery) => mapBackendDeliveryApiToOrder(delivery));
        dispatch({
          type: "delivery/orders-sync",
          payload: {
            orders: mappedDeliveries,
            activeOrder:
              mappedDeliveries.find((order) => !["delivered", "cancelled", "failed"].includes(order.status)) ??
              mappedDeliveries[0] ??
              null
          }
        });
        dispatch({
          type: "wallet/update",
          payload: {
            walletBalance: wallet.balance,
            walletReserved: wallet.pendingAmount,
            paymentMethods: paymentMethods.map(mapBackendPaymentMethod),
            transactions: walletTransactions.map(mapBackendWalletTransaction),
            reminders: state.reminders
          }
        });
        dispatch({
          type: "settings/update",
          payload: mapBackendPreferencesToSettings(preferences, state.settings)
        });
        dispatch({
          type: "emergency/sync",
          payload: contacts.map(mapBackendEmergencyContact)
        });
        dispatch({
          type: "rental/bookings-sync",
          payload: rentals.map((rental) => ({
            id: rental.id,
            vehicleId: rental.vehicleId,
            startDate: rental.startDate,
            endDate: rental.endDate,
            priceEstimate: `UGX ${Math.round(rental.totalAmount).toLocaleString()}`,
            status:
              rental.status === "cancelled"
                ? "cancelled"
                : rental.status === "completed"
                  ? "completed"
                  : "confirmed",
            confirmedAt: new Date(rental.createdAt).toISOString()
          }))
        });
        dispatch({
          type: "tours/bookings-sync",
          payload: tours.map((tour) => ({
            id: tour.id,
            tourId: tour.tourId,
            date: tour.scheduledDate,
            guests: Math.max(1, tour.participantsCount || 1),
            priceEstimate: `UGX ${Math.round(tour.totalPrice).toLocaleString()}`,
            status:
              tour.status === "cancelled"
                ? "cancelled"
                : tour.status === "completed"
                  ? "completed"
                  : "confirmed",
            confirmedAt: new Date(tour.createdAt).toISOString()
          }))
        });
        dispatch({
          type: "ambulance/history-sync",
          payload: ambulances.map((ambulance): AmbulanceRequest => ({
            id: ambulance.id,
            pickup: {
              label: ambulance.pickupAddress,
              address: ambulance.pickupAddress
            },
            destination: ambulance.dropoffAddress
              ? {
                  label: ambulance.dropoffAddress,
                  address: ambulance.dropoffAddress
                }
              : null,
            urgency:
              ambulance.priority === "emergency"
                ? "high"
                : ambulance.priority === "urgent"
                  ? "medium"
                  : "low",
            status:
              ambulance.status === "dispatched"
                ? "assigned"
                : ambulance.status === "in_progress"
                  ? "en_route"
                  : (ambulance.status as
                      | "requested"
                      | "en_route"
                      | "arrived"
                      | "completed"
                      | "cancelled"),
            requestedAt: new Date(ambulance.requestedAt).toISOString()
          }))
        });
      } catch (error) {
        console.warn("Failed to sync backend read-only state from realtime event.", error);
      }
    };
    const subscribeToActiveRooms = () => {
      if (state.ride.activeTrip?.id) {
        socket.emit("subscribe", { channel: "trip", id: state.ride.activeTrip.id });
      }
      if (state.delivery.activeOrder?.routeId) {
        socket.emit("subscribe", { channel: "delivery-route", id: state.delivery.activeOrder.routeId });
      }
    };
    const syncRiderTripsFromBackend = async () => {
      try {
        const [activeTrip, history] = await Promise.all([
          getRiderActiveTrip(),
          getRiderTripHistory(),
        ]);
        if (cancelled) {
          return;
        }
        dispatch({
          type: "ride/history",
          payload: history.map((trip) =>
            hydrateRideTripWithSimulationDefaults(state, mapApiTripToRideTrip(trip))
          ).filter((trip): trip is RideTrip => Boolean(trip)),
        });
        dispatch({
          type: "ride/set-active",
          payload: activeTrip ? hydrateRideTripWithSimulationDefaults(state, mapApiTripToRideTrip(activeTrip)) : null,
        });
      } catch (error) {
        console.warn("Failed to sync rider trips from realtime event.", error);
      }
    };
    socket.on("connect", () => {
      dispatch({ type: "delivery/ws-connected", payload: true });
      subscribeToActiveRooms();
    });
    socket.on("disconnect", () => {
      dispatch({ type: "delivery/ws-connected", payload: false });
    });
    socket.on("connect_error", () => {
      dispatch({ type: "delivery/ws-connected", payload: false });
    });
    let deliveryPatchEvent = "delivery.patch";
    let deliveryOrderNewEvent = "delivery.order.new";
    let deliveryRouteUpdatedEvent = "delivery.route.updated";
    let serviceRequestNewEvent = "service.request.new";
    let serviceRequestUpdatedEvent = "service.request.updated";
    let tripLocationEvent = "trip.location.updated";
    const defaultTripEvents = [
      "trip.driver.assigned",
      "trip.driver.arriving",
      "trip.arrived",
      "trip.started",
      "trip.completed",
      "trip.cancelled",
    ] as const;
    let tripEvents: string[] = [...defaultTripEvents];

    const handleDeliveryPatch = (payload: DeliveryRealtimePatch) => {
      if (!payload?.orderId) {
        return;
      }
      dispatch({ type: "delivery/realtime", payload });
    };
    const handleTripLocationUpdated = (payload: { latitude: number; longitude: number }) => {
      dispatch({
        type: "location/update",
        payload: {
          driverLocation: {
            lat: payload.latitude,
            lng: payload.longitude,
          },
        },
      });
    };

    const bootstrapRealtime = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/compat/realtime/events`);
        if (response.ok) {
          const payload = await response.json();
          const data = (payload?.data || payload) as { rider?: { server?: Record<string, string | undefined> } };
          const server = data?.rider?.server || {};
          deliveryPatchEvent = server.DELIVERY_PATCH || deliveryPatchEvent;
          deliveryOrderNewEvent = server.DELIVERY_ORDER_NEW || deliveryOrderNewEvent;
          deliveryRouteUpdatedEvent = server.DELIVERY_ROUTE_UPDATED || deliveryRouteUpdatedEvent;
          serviceRequestNewEvent = server.SERVICE_REQUEST_NEW || serviceRequestNewEvent;
          serviceRequestUpdatedEvent = server.SERVICE_REQUEST_UPDATED || serviceRequestUpdatedEvent;
          tripLocationEvent = server.TRIP_LOCATION_UPDATED || tripLocationEvent;
          tripEvents = [
            server.TRIP_DRIVER_ASSIGNED ?? defaultTripEvents[0],
            server.TRIP_DRIVER_ARRIVING ?? defaultTripEvents[1],
            server.TRIP_ARRIVED ?? defaultTripEvents[2],
            server.TRIP_STARTED ?? defaultTripEvents[3],
            server.TRIP_COMPLETED ?? defaultTripEvents[4],
            server.TRIP_CANCELLED ?? defaultTripEvents[5],
          ];
        }
      } catch {
        // fallback to defaults
      }

      if (cancelled) return;
      socket.on(deliveryPatchEvent, handleDeliveryPatch);
      socket.on(tripLocationEvent, handleTripLocationUpdated);
      socket.on(deliveryOrderNewEvent, () => {
        void syncBackendReadOnlyState();
      });
      socket.on(deliveryRouteUpdatedEvent, () => {
        void syncBackendReadOnlyState();
      });
      socket.on(serviceRequestNewEvent, () => {
        void syncBackendReadOnlyState();
      });
      socket.on(serviceRequestUpdatedEvent, () => {
        void syncBackendReadOnlyState();
      });
      tripEvents.forEach((eventName) => {
        socket.on(eventName, () => {
          void syncRiderTripsFromBackend();
        });
      });
      socket.connect();
    };

    void bootstrapRealtime();

    return () => {
      cancelled = true;
      tripEvents.forEach((eventName) => {
        socket.off(eventName);
      });
      socket.off(deliveryPatchEvent, handleDeliveryPatch);
      socket.off(deliveryOrderNewEvent);
      socket.off(deliveryRouteUpdatedEvent);
      socket.off(serviceRequestNewEvent);
      socket.off(serviceRequestUpdatedEvent);
      socket.off(tripLocationEvent, handleTripLocationUpdated);
      socket.disconnect();
      dispatch({ type: "delivery/ws-connected", payload: false });
    };
  }, [riderBackendEnabled, state.delivery.activeOrder?.routeId, state.ride.activeTrip?.id]);

  const actions: AppActions = useMemo(
    () => ({
      updateSettings,
      updateNotifications,
      updatePrivacy,
      updateRidePreferences,
      updateDeliveryPreferences,
      updateRideRequest,
      updateRideTrip,
      refreshRideOptionPricing,
      updateRideSharing,
      setRideStatus,
      setActiveTrip,
      updateDeliveryDraft,
      resetDeliveryDraft,
      syncDeliveryOrders,
      createDeliveryOrder,
      setActiveDelivery,
      setActiveDeliveryById,
      updateDeliveryOrderStatus,
      logDeliveryContactEvent,
      reportDeliveryException,
      resolveDeliveryException: resolveDeliveryExceptionById,
      submitProofOfDelivery,
      receiveSenderDeliveryConfirmation,
      closeSenderDelivery,
      updateScheduledDelivery,
      cancelScheduledDelivery,
      submitDeliveryRating,
      selectDeliverySettlementMethod,
      captureDeliverySettlement,
      markDeliveryNotificationsRead,
      applyDeliveryRealtimePatch,
      beginRentalBooking,
      updateRentalBooking,
      selectRentalVehicle,
      initializeRentalPayment,
      updateRentalPaymentSession,
      completeRentalPayment,
      failRentalPayment,
      resetRentalPayment,
      initializeTourPayment,
      updateTourPaymentSession,
      completeTourPayment,
      failTourPayment,
      resetTourPayment,
      updateTourBooking,
      selectTour,
      updateAmbulanceRequest,
      addEmergencyContact,
      updateEmergencyContact,
      removeEmergencyContact,
      setDefaultEmergencyContact,
      startSos,
      updateSosStatus,
      resolveSos,
      dismissReminder,
      dismissReminders,
      simulateDriverAddStopRequest,
      simulateDriverContinueTripRequest,
      resetTemporaryStopState,
      respondToTemporaryStopRequest,
      resumeTripAfterTemporaryStop,
      markTemporaryStopContinuePromptShown,
      respondToSafetyCheck,
      updateSharedLocationState,
    }),
    [
      updateSettings,
      updateNotifications,
      updatePrivacy,
      updateRidePreferences,
      updateDeliveryPreferences,
      updateRideRequest,
      updateRideTrip,
      refreshRideOptionPricing,
      updateRideSharing,
      setRideStatus,
      setActiveTrip,
      updateDeliveryDraft,
      resetDeliveryDraft,
      syncDeliveryOrders,
      createDeliveryOrder,
      setActiveDelivery,
      setActiveDeliveryById,
      updateDeliveryOrderStatus,
      logDeliveryContactEvent,
      reportDeliveryException,
      resolveDeliveryExceptionById,
      submitProofOfDelivery,
      receiveSenderDeliveryConfirmation,
      closeSenderDelivery,
      updateScheduledDelivery,
      cancelScheduledDelivery,
      submitDeliveryRating,
      selectDeliverySettlementMethod,
      captureDeliverySettlement,
      markDeliveryNotificationsRead,
      applyDeliveryRealtimePatch,
      beginRentalBooking,
      updateRentalBooking,
      selectRentalVehicle,
      initializeRentalPayment,
      updateRentalPaymentSession,
      completeRentalPayment,
      failRentalPayment,
      resetRentalPayment,
      initializeTourPayment,
      updateTourPaymentSession,
      completeTourPayment,
      failTourPayment,
      resetTourPayment,
      updateTourBooking,
      selectTour,
      updateAmbulanceRequest,
      addEmergencyContact,
      updateEmergencyContact,
      removeEmergencyContact,
      setDefaultEmergencyContact,
      startSos,
      updateSosStatus,
      resolveSos,
      dismissReminder,
      dismissReminders,
      simulateDriverAddStopRequest,
      simulateDriverContinueTripRequest,
      resetTemporaryStopState,
      respondToTemporaryStopRequest,
      resumeTripAfterTemporaryStop,
      markTemporaryStopContinuePromptShown,
      respondToSafetyCheck,
      updateSharedLocationState,
    ]
  );

  const mobileMoneyDetail = useMemo(() => {
    const phone = user?.phone ?? "";
    return `MTN Mobile Money • ${phone.replace(/\s/g, "")}`;
  }, [user]);

  const paymentMethods: PaymentMethod[] = useMemo(() => {
    const phone = user?.phone ?? "";
    return state.paymentMethods.map((pm) => {
      if (pm.type === "mobile_money") {
        return { ...pm, detail: `${pm.label} • ${phone.replace(/\s/g, "")}` };
      }
      return pm;
    });
  }, [state.paymentMethods, user]);

  const selectors = useMemo(() => ({
    isAuthenticated: !!user,
    hasActiveTrip: !!state.ride.activeTrip,
    hasActiveDelivery: !!state.delivery.activeOrder,
    walletBalanceFormatted: `UGX ${Math.round(state.walletBalance).toLocaleString()}`
  }), [user, state.ride.activeTrip, state.delivery.activeOrder, state.walletBalance]);

  const value = useMemo<AppDataContextValue>(
    () => ({
      ...state,
      paymentMethods,
      transactions: state.transactions as WalletTransaction[],
      reminders: state.reminders as Reminder[],
      mobileMoneyDetail,
      actions,
      selectors
    }),
    [state, paymentMethods, mobileMoneyDetail, actions, selectors]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return context;
}
