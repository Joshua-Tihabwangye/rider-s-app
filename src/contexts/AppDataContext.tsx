import { createContext, useContext, useMemo, ReactNode, useReducer, useCallback } from "react";
import type {
  AppData,
  PaymentMethod,
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
  setActiveDelivery: (order: DeliveryOrder | null) => void;
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
  | { type: "delivery/active"; payload: DeliveryOrder | null }
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
    case "delivery/active":
      return { ...state, delivery: { ...state.delivery, activeOrder: action.payload } };
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

  const setActiveDelivery = useCallback((order: DeliveryOrder | null) => {
    dispatch({ type: "delivery/active", payload: order });
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
      setActiveDelivery,
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
      setActiveDelivery,
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
