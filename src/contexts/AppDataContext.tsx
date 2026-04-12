import { createContext, useContext, useMemo, ReactNode, useReducer, useCallback, useEffect } from "react";
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
  RideStatus,
  DeliveryState,
  DeliveryDraft,
  DeliveryOrder,
  DeliveryStatus,
  DeliveryExceptionType,
  DeliveryProofOfDelivery,
  DeliveryContactType,
  RentalState,
  RentalBooking,
  ToursState,
  TourBooking,
  AmbulanceState,
  AmbulanceRequest,
  SosState,
  SosStatus,
  SosEvent
} from "../store/types";
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
import { createAutoProofOfDelivery } from "../features/delivery/proof";
import {
  createDeliveryException,
  DELIVERY_EXCEPTION_LABELS,
  getStatusFromException,
  resolveDeliveryException
} from "../features/delivery/exceptions";
import { createDeliveryNotification } from "../features/delivery/notifications";
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
  SEED_SOS_STATE
} from "../store/seedData";

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

interface AppActions {
  updateSettings: (patch: Partial<SettingsState>) => void;
  updateNotifications: (patch: Partial<NotificationPreferences>) => void;
  updatePrivacy: (patch: Partial<PrivacyPreferences>) => void;
  updateRidePreferences: (patch: Partial<RidePreferences>) => void;
  updateDeliveryPreferences: (patch: Partial<DeliveryPreferences>) => void;
  updateRideRequest: (patch: Partial<RideRequest>) => void;
  updateRideTrip: (patch: Partial<RideTrip>) => void;
  setRideStatus: (status: RideStatus) => void;
  setActiveTrip: (trip: RideTrip | null) => void;
  updateDeliveryDraft: (patch: Partial<DeliveryDraft>) => void;
  resetDeliveryDraft: () => void;
  createDeliveryOrder: () => DeliveryOrder | null;
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
  updateScheduledDelivery: (orderId: string, scheduleTime: string) => void;
  cancelScheduledDelivery: (orderId: string, reason: string) => void;
  submitDeliveryRating: (orderId: string, payload: { score: number; tags: string[]; comment?: string }) => void;
  captureDeliverySettlement: (orderId: string) => void;
  markDeliveryNotificationsRead: () => void;
  applyDeliveryRealtimePatch: (patch: DeliveryRealtimePatch) => void;
  updateRentalBooking: (patch: Partial<RentalBooking>) => void;
  selectRentalVehicle: (vehicleId: string) => void;
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
}

interface AppDataContextValue extends AppState {
  /** Mobile money detail string derived from user phone */
  mobileMoneyDetail: string;
  actions: AppActions;
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
  sos: SEED_SOS_STATE
};

type AppAction =
  | { type: "settings/update"; payload: Partial<SettingsState> }
  | { type: "settings/notifications"; payload: Partial<NotificationPreferences> }
  | { type: "settings/privacy"; payload: Partial<PrivacyPreferences> }
  | { type: "settings/ride"; payload: Partial<RidePreferences> }
  | { type: "settings/delivery"; payload: Partial<DeliveryPreferences> }
  | { type: "ride/request"; payload: Partial<RideRequest> }
  | { type: "ride/trip"; payload: Partial<RideTrip> }
  | { type: "ride/status"; payload: RideStatus }
  | { type: "ride/set-active"; payload: RideTrip | null }
  | { type: "delivery/draft"; payload: Partial<DeliveryDraft> }
  | { type: "delivery/reset-draft" }
  | { type: "delivery/create-order"; payload: { orderId: string; senderName: string } }
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
  | { type: "delivery/schedule"; payload: { orderId: string; scheduleTime: string } }
  | { type: "delivery/cancel-scheduled"; payload: { orderId: string; reason: string } }
  | { type: "delivery/rating"; payload: { orderId: string; score: number; tags: string[]; comment?: string } }
  | { type: "delivery/settlement-capture"; payload: { orderId: string } }
  | { type: "delivery/notifications-read" }
  | { type: "delivery/realtime"; payload: DeliveryRealtimePatch }
  | { type: "delivery/poll" }
  | { type: "delivery/ws-connected"; payload: boolean }
  | { type: "rental/booking"; payload: Partial<RentalBooking> }
  | { type: "rental/select"; payload: string }
  | { type: "tours/booking"; payload: Partial<TourBooking> }
  | { type: "tours/select"; payload: string }
  | { type: "ambulance/update"; payload: Partial<AmbulanceRequest> }
  | { type: "emergency/add"; payload: EmergencyContact }
  | { type: "emergency/update"; payload: EmergencyContact }
  | { type: "emergency/remove"; payload: string }
  | { type: "emergency/set-default"; payload: string }
  | { type: "sos/start"; payload: SosEvent }
  | { type: "sos/status"; payload: { id: string; status: SosStatus; note?: string } };

function updateEmergencyContactsDefault(contacts: EmergencyContact[], id: string): EmergencyContact[] {
  return contacts.map((contact) => ({
    ...contact,
    isDefault: contact.id === id
  }));
}

function formatCurrencyUGX(amount: number): string {
  return `UGX ${Math.round(amount).toLocaleString()}`;
}

function getPaymentMethodType(methods: PaymentMethod[], paymentMethodId: string): PaymentMethodType {
  return methods.find((method) => method.id === paymentMethodId)?.type ?? "wallet";
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
    parcel: {
      type: "documents",
      size: "small",
      description: "",
      value: 0,
      weightKg: 0.5,
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
    paymentMethodId: previous?.paymentMethodId ?? "pm_wallet",
    deliveryFee,
    serviceFee,
    insuranceFee,
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

function estimateDistanceKm(pickupAddress: string, dropoffAddress: string): number {
  const fallback = 8.2;
  if (pickupAddress === dropoffAddress) {
    return 1.2;
  }
  const pseudo = Math.abs(
    [...`${pickupAddress}-${dropoffAddress}`].reduce((acc, char) => acc + char.charCodeAt(0), 0)
  );
  return Number(((pseudo % 150) / 10 + fallback).toFixed(1));
}

function createDeliveryOrderFromDraft(
  state: AppState,
  payload: { orderId: string; senderName: string }
): DeliveryOrder | null {
  const { draft } = state.delivery;
  if (!draft.pickup || !draft.dropoff || !draft.recipient || !draft.parcel.description.trim()) {
    return null;
  }

  const now = new Date().toISOString();
  const distanceKm = estimateDistanceKm(draft.pickup.address, draft.dropoff.address);
  const etaMinutes = Math.max(12, Math.round(distanceKm * 2.6));
  const total = draft.deliveryFee + draft.serviceFee + draft.insuranceFee;
  const paymentMethodId = draft.paymentMethodId ?? state.paymentMethods[0]?.id ?? "pm_wallet";
  const estimatedDropoffAt =
    draft.schedule === "scheduled" && draft.scheduleTime
      ? draft.scheduleTime
      : new Date(Date.now() + etaMinutes * 60 * 1000).toISOString();

  const baseOrder: DeliveryOrder = {
    id: payload.orderId,
    createdAt: now,
    updatedAt: now,
    status: "requested",
    pickup: draft.pickup,
    dropoff: draft.dropoff,
    parcel: draft.parcel,
    recipient: draft.recipient,
    orderMode: draft.orderMode,
    orderModeConfig: draft.orderModeConfig,
    schedule: draft.schedule,
    scheduleTime: draft.scheduleTime,
    paymentMethodId,
    costBreakdown: {
      deliveryFee: draft.deliveryFee,
      serviceFee: draft.serviceFee,
      insuranceFee: draft.insuranceFee,
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
      city: getCityLabel(draft.dropoff.address),
      code: "256"
    },
    date: new Date(),
    time: `${etaMinutes} min`,
    progress: getDeliveryStatusProgress("requested"),
    priceEstimate: formatCurrencyUGX(total),
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
    getPaymentMethodType(state.paymentMethods, paymentMethodId),
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
    case "ride/request":
      return { ...state, ride: { ...state.ride, request: { ...state.ride.request, ...action.payload } } };
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
                  driver: null,
                  vehicle: null,
                  ...action.payload
                } as RideTrip)
              : null
        }
      };
    case "ride/status":
      return {
        ...state,
        ride: {
          ...state.ride,
          activeTrip: state.ride.activeTrip
            ? { ...state.ride.activeTrip, status: action.payload }
            : state.ride.activeTrip
        }
      };
    case "ride/set-active":
      return { ...state, ride: { ...state.ride, activeTrip: action.payload } };
    case "delivery/draft":
      return { ...state, delivery: { ...state.delivery, draft: { ...state.delivery.draft, ...action.payload } } };
    case "delivery/reset-draft":
      return {
        ...state,
        delivery: {
          ...state.delivery,
          draft: createDefaultDeliveryDraft(state.delivery.draft)
        }
      };
    case "delivery/create-order": {
      const order = createDeliveryOrderFromDraft(state, action.payload);
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
        const nextProgress = Math.max(order.tracking.progress, getDeliveryStatusProgress(action.payload.status));
        const paymentMethodType = getPaymentMethodType(state.paymentMethods, order.paymentMethodId);
        const currentSettlement = order.settlement ?? initializeDeliverySettlement(order, paymentMethodType, now);
        const nextSettlement = applySettlementForDeliveryStatus(
          currentSettlement,
          order,
          action.payload.status,
          cancellationFee,
          now
        );
        const deliveredAt = action.payload.status === "delivered" ? order.deliveredAt ?? now : order.deliveredAt;
        const proofOfDelivery =
          action.payload.status === "delivered"
            ? order.proofOfDelivery ?? createAutoProofOfDelivery({ ...order, deliveredAt: deliveredAt ?? now })
            : order.proofOfDelivery;
        const candidateOrder = {
          ...order,
          updatedAt: now,
          status: action.payload.status,
          deliveredAt
        };
        const receipt = isReceiptEligible(nextSettlement.status)
          ? generateDeliveryReceipt(candidateOrder, nextSettlement)
          : order.receipt ?? null;

        nextNotifications = appendDeliveryNotification(nextNotifications, {
          orderId: order.id,
          title: `Delivery ${getDeliveryStatusLabel(action.payload.status)}`,
          body:
            action.payload.status === "cancelled" && cancellationFee > 0
              ? `Cancelled with ${formatCurrencyUGX(cancellationFee)} fee at current stage.`
              : action.payload.note ?? `${getDeliveryStatusLabel(action.payload.status)} stage reached.`,
          category: action.payload.status === "cancelled" ? "payment" : "status",
          createdAt: now
        });

        return {
          ...order,
          status: action.payload.status,
          updatedAt: now,
          progress: nextProgress,
          time: order.tracking.etaMinutes > 0 ? `${order.tracking.etaMinutes} min` : "Arrived",
          tracking: {
            ...order.tracking,
            progress: nextProgress,
            etaMinutes: action.payload.status === "delivered" ? 0 : order.tracking.etaMinutes,
            courierPosition:
              action.payload.status === "delivered" ? 1 : order.tracking.courierPosition,
            updatedAt: now
          },
          timeline: order.timeline.some((entry) => entry.status === action.payload.status)
            ? order.timeline
            : [
                ...order.timeline,
                {
                  status: action.payload.status,
                  timestamp: now,
                  note: action.payload.note ?? `${getDeliveryStatusLabel(action.payload.status)} stage reached`,
                  source: "system"
                }
              ],
          deliveredAt,
          cancelledReason:
            action.payload.status === "cancelled"
              ? action.payload.note ??
                (cancellationFee > 0
                  ? `Cancelled by rider. ${formatCurrencyUGX(cancellationFee)} fee applied.`
                  : "Cancelled by rider.")
              : order.cancelledReason,
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
        const nextStatus = getStatusFromException(action.payload.type, order.status);
        const paymentMethodType = getPaymentMethodType(state.paymentMethods, order.paymentMethodId);
        const currentSettlement =
          order.settlement ?? initializeDeliverySettlement(order, paymentMethodType, now);
        const refundedSettlement =
          action.payload.type === "dispute_refund" ? requestSettlementRefund(currentSettlement, now) : currentSettlement;
        const nextSettlement = applySettlementForDeliveryStatus(
          refundedSettlement,
          order,
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
          ...order,
          status: nextStatus,
          updatedAt: now,
          exceptions: [...(order.exceptions ?? []), exception],
          settlement: nextSettlement,
          timeline: [
            ...order.timeline,
            {
              status: nextStatus,
              timestamp: now,
              note: `${DELIVERY_EXCEPTION_LABELS[action.payload.type]} reported`,
              source: "rider"
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
    case "delivery/schedule": {
      const now = new Date().toISOString();
      const updatedOrders = state.delivery.orders.map((order) => {
        if (order.id !== action.payload.orderId) {
          return order;
        }

        return {
          ...order,
          schedule: "scheduled",
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
          status: "cancelled",
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
                status: "cash_collected",
                capturedAmount: order.costBreakdown.total,
                capturedAt: now,
                note: "Cash collected and settled manually."
              }
            : {
                ...currentSettlement,
                status: "captured",
                capturedAmount: order.costBreakdown.total,
                capturedAt: now,
                note: "Captured from delivery settlement console."
              };
        const receipt = generateDeliveryReceipt(order, nextSettlement);

        return {
          ...order,
          updatedAt: now,
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

        const paymentMethodType = getPaymentMethodType(state.paymentMethods, patchedOrder.paymentMethodId);
        const currentSettlement =
          patchedOrder.settlement ?? initializeDeliverySettlement(patchedOrder, paymentMethodType, now);
        const nextSettlement = applySettlementForDeliveryStatus(
          currentSettlement,
          patchedOrder,
          patchedOrder.status,
          0,
          now
        );
        const proofOfDelivery =
          patchedOrder.status === "delivered"
            ? patchedOrder.proofOfDelivery ?? createAutoProofOfDelivery(patchedOrder)
            : patchedOrder.proofOfDelivery;
        const receipt = isReceiptEligible(nextSettlement.status)
          ? generateDeliveryReceipt(patchedOrder, nextSettlement)
          : patchedOrder.receipt ?? null;

        nextNotifications = appendDeliveryNotification(nextNotifications, {
          orderId: patchedOrder.id,
          title: `Realtime update: ${getDeliveryStatusLabel(patchedOrder.status)}`,
          body: action.payload.note ?? "Delivery state changed from live tracking updates.",
          category: "status",
          createdAt: now
        });

        return {
          ...patchedOrder,
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

        const paymentMethodType = getPaymentMethodType(state.paymentMethods, updatedOrder.paymentMethodId);
        const currentSettlement =
          updatedOrder.settlement ?? initializeDeliverySettlement(updatedOrder, paymentMethodType, now);
        const nextSettlement = applySettlementForDeliveryStatus(
          currentSettlement,
          updatedOrder,
          updatedOrder.status,
          0,
          now
        );
        const proofOfDelivery =
          updatedOrder.status === "delivered"
            ? updatedOrder.proofOfDelivery ?? createAutoProofOfDelivery(updatedOrder)
            : updatedOrder.proofOfDelivery;
        const receipt = isReceiptEligible(nextSettlement.status)
          ? generateDeliveryReceipt(updatedOrder, nextSettlement)
          : updatedOrder.receipt ?? null;

        nextNotifications = appendDeliveryNotification(nextNotifications, {
          orderId: updatedOrder.id,
          title: `Tracking update: ${getDeliveryStatusLabel(updatedOrder.status)}`,
          body: "Delivery timeline progressed from polling updates.",
          category: "status",
          createdAt: now
        });

        return {
          ...updatedOrder,
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
    case "rental/booking":
      return { ...state, rental: { ...state.rental, booking: { ...state.rental.booking, ...action.payload } } };
    case "rental/select":
      return {
        ...state,
        rental: {
          ...state.rental,
          selectedVehicleId: action.payload,
          booking: { ...state.rental.booking, vehicleId: action.payload }
        }
      };
    case "tours/booking":
      return { ...state, tours: { ...state.tours, booking: { ...state.tours.booking, ...action.payload } } };
    case "tours/select":
      return {
        ...state,
        tours: {
          ...state.tours,
          selectedTourId: action.payload,
          booking: { ...state.tours.booking, tourId: action.payload }
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
    default:
      return state;
  }
}

interface AppDataProviderProps {
  children: ReactNode;
}

export function AppDataProvider({ children }: AppDataProviderProps): React.JSX.Element {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(appReducer, initialState);

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
    dispatch({ type: "ride/request", payload: patch });
  }, []);

  const updateRideTrip = useCallback((patch: Partial<RideTrip>) => {
    dispatch({ type: "ride/trip", payload: patch });
  }, []);

  const setRideStatus = useCallback((status: RideStatus) => {
    dispatch({ type: "ride/status", payload: status });
  }, []);

  const setActiveTrip = useCallback((trip: RideTrip | null) => {
    dispatch({ type: "ride/set-active", payload: trip });
  }, []);

  const updateDeliveryDraft = useCallback((patch: Partial<DeliveryDraft>) => {
    dispatch({ type: "delivery/draft", payload: patch });
  }, []);

  const resetDeliveryDraft = useCallback(() => {
    dispatch({ type: "delivery/reset-draft" });
  }, []);

  const createDeliveryOrder = useCallback(() => {
    const orderId = `DLV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Date.now()
      .toString()
      .slice(-4)}`;
    const senderName = user?.fullName ?? "Rider";
    const previewOrder = createDeliveryOrderFromDraft(state, { orderId, senderName });
    if (!previewOrder) {
      return null;
    }
    dispatch({ type: "delivery/create-order", payload: { orderId, senderName } });
    return previewOrder;
  }, [state, user?.fullName]);

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

  const captureDeliverySettlement = useCallback((orderId: string) => {
    dispatch({ type: "delivery/settlement-capture", payload: { orderId } });
  }, []);

  const markDeliveryNotificationsRead = useCallback(() => {
    dispatch({ type: "delivery/notifications-read" });
  }, []);

  const applyDeliveryRealtimePatch = useCallback((patch: DeliveryRealtimePatch) => {
    dispatch({ type: "delivery/realtime", payload: patch });
  }, []);

  const updateRentalBooking = useCallback((patch: Partial<RentalBooking>) => {
    dispatch({ type: "rental/booking", payload: patch });
  }, []);

  const selectRentalVehicle = useCallback((vehicleId: string) => {
    dispatch({ type: "rental/select", payload: vehicleId });
  }, []);

  const updateTourBooking = useCallback((patch: Partial<TourBooking>) => {
    dispatch({ type: "tours/booking", payload: patch });
  }, []);

  const selectTour = useCallback((tourId: string) => {
    dispatch({ type: "tours/select", payload: tourId });
  }, []);

  const updateAmbulanceRequest = useCallback((patch: Partial<AmbulanceRequest>) => {
    dispatch({ type: "ambulance/update", payload: patch });
  }, []);

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

  useEffect(() => {
    const interval = window.setInterval(() => {
      dispatch({ type: "delivery/poll" });
    }, 7000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_DELIVERY_WS_URL as string | undefined;
    if (!wsUrl) {
      dispatch({ type: "delivery/ws-connected", payload: false });
      return;
    }

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      dispatch({ type: "delivery/ws-connected", payload: true });
    };
    ws.onclose = () => {
      dispatch({ type: "delivery/ws-connected", payload: false });
    };
    ws.onerror = () => {
      dispatch({ type: "delivery/ws-connected", payload: false });
    };
    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as DeliveryRealtimePatch;
        if (!payload.orderId) {
          return;
        }
        dispatch({ type: "delivery/realtime", payload });
      } catch {
        // Ignore malformed websocket payloads.
      }
    };

    return () => {
      ws.close();
      dispatch({ type: "delivery/ws-connected", payload: false });
    };
  }, []);

  const actions: AppActions = useMemo(
    () => ({
      updateSettings,
      updateNotifications,
      updatePrivacy,
      updateRidePreferences,
      updateDeliveryPreferences,
      updateRideRequest,
      updateRideTrip,
      setRideStatus,
      setActiveTrip,
      updateDeliveryDraft,
      resetDeliveryDraft,
      createDeliveryOrder,
      setActiveDelivery,
      setActiveDeliveryById,
      updateDeliveryOrderStatus,
      logDeliveryContactEvent,
      reportDeliveryException,
      resolveDeliveryException: resolveDeliveryExceptionById,
      submitProofOfDelivery,
      updateScheduledDelivery,
      cancelScheduledDelivery,
      submitDeliveryRating,
      captureDeliverySettlement,
      markDeliveryNotificationsRead,
      applyDeliveryRealtimePatch,
      updateRentalBooking,
      selectRentalVehicle,
      updateTourBooking,
      selectTour,
      updateAmbulanceRequest,
      addEmergencyContact,
      updateEmergencyContact,
      removeEmergencyContact,
      setDefaultEmergencyContact,
      startSos,
      updateSosStatus,
      resolveSos
    }),
    [
      updateSettings,
      updateNotifications,
      updatePrivacy,
      updateRidePreferences,
      updateDeliveryPreferences,
      updateRideRequest,
      updateRideTrip,
      setRideStatus,
      setActiveTrip,
      updateDeliveryDraft,
      resetDeliveryDraft,
      createDeliveryOrder,
      setActiveDelivery,
      setActiveDeliveryById,
      updateDeliveryOrderStatus,
      logDeliveryContactEvent,
      reportDeliveryException,
      resolveDeliveryExceptionById,
      submitProofOfDelivery,
      updateScheduledDelivery,
      cancelScheduledDelivery,
      submitDeliveryRating,
      captureDeliverySettlement,
      markDeliveryNotificationsRead,
      applyDeliveryRealtimePatch,
      updateRentalBooking,
      selectRentalVehicle,
      updateTourBooking,
      selectTour,
      updateAmbulanceRequest,
      addEmergencyContact,
      updateEmergencyContact,
      removeEmergencyContact,
      setDefaultEmergencyContact,
      startSos,
      updateSosStatus,
      resolveSos
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

  const value = useMemo<AppDataContextValue>(
    () => ({
      ...state,
      paymentMethods,
      transactions: state.transactions as WalletTransaction[],
      reminders: state.reminders as Reminder[],
      mobileMoneyDetail,
      actions
    }),
    [state, paymentMethods, mobileMoneyDetail, actions]
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
