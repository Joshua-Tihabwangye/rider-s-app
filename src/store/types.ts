/** Auth provider used during sign-in / sign-up */
export type AuthProvider = "email" | "evzone" | "google" | "apple";

/** Authenticated user profile */
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  provider: AuthProvider;
  role: "rider" | "admin";
  initials: string;
}

/** Auth slice state */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

/** Sign-in credentials */
export interface SignInCredentials {
  email: string;
  password: string;
}

/** Sign-up payload */
export interface SignUpPayload {
  fullName: string;
  email: string;
  password: string;
}

/** Auth service response */
export interface AuthResponse {
  user: User;
  token: string;
}

/** Payment method types */
export type PaymentMethodType = "wallet" | "card" | "mobile_money" | "cash";

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string;
  detail: string;
  isDefault: boolean;
}

/** Wallet transaction */
export interface WalletTransaction {
  id: string;
  title: string;
  source: string;
  amount: string;
  time: string;
  type: "topup" | "ride" | "delivery" | "rental" | "withdrawal";
}

/** App-wide reminder */
export interface Reminder {
  id: number;
  title: string;
  description: string;
  actionRoute: string;
}

/** Centralized app data */
export interface AppData {
  walletBalance: number;
  walletReserved: number;
  paymentMethods: PaymentMethod[];
  transactions: WalletTransaction[];
  reminders: Reminder[];
}

/** Saved place for quick access */
export interface SavedPlace {
  id: string;
  label: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  icon?: string;
}

/** Settings & preferences */
export interface NotificationPreferences {
  rideUpdates: boolean;
  deliveryUpdates: boolean;
  rentalUpdates: boolean;
  tourUpdates: boolean;
  safetyAlerts: boolean;
  promotions: boolean;
}

export interface PrivacyPreferences {
  shareTripStatus: boolean;
  shareLocation: boolean;
  allowContactBySupport: boolean;
}

export interface RidePreferences {
  quietRide: boolean;
  temperature: "Cool" | "Normal" | "Warm";
  luggageAssistance: boolean;
  accessibilityNeeds: boolean;
}

export interface DeliveryPreferences {
  callBeforeDropoff: boolean;
  leaveAtDoor: boolean;
  fragileHandling: boolean;
}

export interface SettingsState {
  language: string;
  region: string;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  ride: RidePreferences;
  delivery: DeliveryPreferences;
}

/** Emergency contacts */
export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isDefault: boolean;
  notifyOnSOS: boolean;
}

/** Ride workflow */
export type RideStatus =
  | "idle"
  | "searching"
  | "driver_assigned"
  | "driver_on_way"
  | "driver_arrived"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface RideLocation {
  label: string;
  address: string;
  coordinates?: { lat: number; lng: number };
}

export interface RideRequest {
  origin: RideLocation | null;
  destination: RideLocation | null;
  stops: RideLocation[];
  passengers: number;
  schedule: "now" | "later";
  scheduleTime?: string;
  tripType: "One Way" | "Round Trip" | "Multi-stop";
  rideType: "Personal" | "Business";
  serviceLevel?: string;
  serviceClass?: "standard" | "premium";
  riderType?: "personal" | "contact";
  riderContact?: { name: string; phone: string } | null;
  notes?: string;
}

export interface DriverProfile {
  id: string;
  name: string;
  phone: string;
  rating: number;
  avatar: string;
}

export interface VehicleProfile {
  model: string;
  color: string;
  plate: string;
  category: string;
}

export interface RideTrip {
  id: string;
  status: RideStatus;
  otp: string;
  etaMinutes: number;
  fareEstimate: string;
  distance: string;
  routeSummary: string;
  pickup: RideLocation | null;
  dropoff: RideLocation | null;
  driver: DriverProfile | null;
  vehicle: VehicleProfile | null;
  lastKnownLocation?: RideLocation | null;
  startedAt?: string;
  completedAt?: string;
}

export interface RideOption {
  id: string;
  name: string;
  description: string;
  eta: string;
  fare: string;
  capacity?: number;
}

export interface RideState {
  request: RideRequest;
  activeTrip: RideTrip | null;
  history: RideTrip[];
  savedPlaces: SavedPlace[];
  options: RideOption[];
}

/** Delivery workflow */
export type DeliveryStatus =
  | "draft"
  | "requested"
  | "accepted"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "failed";

export type DeliveryParcelType =
  | "documents"
  | "food"
  | "electronics"
  | "fashion"
  | "fragile"
  | "other";

export type DeliveryParcelSize = "small" | "medium" | "large" | "x_large";

export type DeliveryTiming = "now" | "scheduled";

export type DeliveryProofMethod = "photo" | "signature" | "pin" | "otp";

export interface DeliveryProofOfDelivery {
  methods: DeliveryProofMethod[];
  recipientName: string;
  deliveredAt: string;
  location: {
    label: string;
    lat?: number;
    lng?: number;
  };
  photoUrl?: string;
  signatureName?: string;
  pinCode?: string;
  otpCode?: string;
  verifiedBy: "courier" | "recipient" | "system";
}

export type DeliveryExceptionType =
  | "missing_item"
  | "damaged_item"
  | "delayed_courier"
  | "failed_handoff"
  | "return_to_sender"
  | "dispute_refund";

export interface DeliveryException {
  id: string;
  type: DeliveryExceptionType;
  status: "open" | "resolved";
  note: string;
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
  requestedRefundAmount?: number;
}

export type DeliveryContactType = "call" | "chat" | "support";

export interface DeliveryContactEvent {
  type: DeliveryContactType;
  timestamp: string;
}

export type DeliverySettlementPolicy = "cashless_pre_auth" | "cash_on_delivery";

export type DeliverySettlementStatus =
  | "pending_authorization"
  | "authorized"
  | "capture_pending"
  | "captured"
  | "refund_requested"
  | "refunded"
  | "voided"
  | "cash_due"
  | "cash_collected";

export interface DeliverySettlement {
  id: string;
  policy: DeliverySettlementPolicy;
  methodType: PaymentMethodType;
  status: DeliverySettlementStatus;
  authorizedAmount: number;
  capturedAmount: number;
  refundedAmount: number;
  cancellationFeeCharged: number;
  authorizedAt?: string;
  capturedAt?: string;
  refundedAt?: string;
  note?: string;
}

export interface DeliveryReceipt {
  id: string;
  orderId: string;
  issuedAt: string;
  lineItems: Array<{
    label: string;
    amount: number;
  }>;
  total: number;
  currency: string;
  settlementStatus: DeliverySettlementStatus;
}

export interface DeliveryRating {
  score: number;
  tags: string[];
  comment?: string;
  submittedAt: string;
}

export type DeliverySchedulePolicyStage =
  | "requested"
  | "accepted"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery";

export interface DeliverySchedulePolicyRule {
  stage: DeliverySchedulePolicyStage;
  feePercent: number;
  minimumFee: number;
  description: string;
}

export interface DeliverySchedulePolicy {
  currency: string;
  rescheduleCutoffMinutes: number;
  rules: DeliverySchedulePolicyRule[];
}

export interface DeliveryNotification {
  id: string;
  orderId: string;
  title: string;
  body: string;
  category: "status" | "proof" | "payment" | "exception" | "schedule" | "system";
  createdAt: string;
  read: boolean;
}

export interface DeliveryParty {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface DeliveryParcel {
  type: DeliveryParcelType;
  size: DeliveryParcelSize;
  description: string;
  value: number;
  weightKg?: number;
  fragile?: boolean;
  notes?: string;
}

export interface DeliveryTrackingSnapshot {
  etaMinutes: number;
  distanceKm: number;
  progress: number;
  courierPosition: number;
  updatedAt: string;
}

export interface DeliveryStatusLog {
  status: DeliveryStatus;
  timestamp: string;
  note?: string;
  source?: "system" | "driver" | "rider" | "websocket";
}

export interface DeliveryDraft {
  pickup: RideLocation | null;
  dropoff: RideLocation | null;
  parcel: DeliveryParcel;
  recipient: DeliveryParty | null;
  schedule: DeliveryTiming;
  scheduleTime?: string;
  paymentMethodId?: string;
  deliveryFee: number;
  serviceFee: number;
  insuranceFee: number;
  priceEstimate?: string;
  notes?: string;
}

export interface DeliveryCourier {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicle: string;
  plate: string;
}

export interface DeliveryOrder {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: DeliveryStatus;
  pickup: RideLocation;
  dropoff: RideLocation;
  parcel: DeliveryParcel;
  recipient: DeliveryParty;
  schedule: DeliveryTiming;
  scheduleTime?: string;
  paymentMethodId: string;
  costBreakdown: {
    deliveryFee: number;
    serviceFee: number;
    insuranceFee: number;
    total: number;
    currency: string;
  };
  tracking: DeliveryTrackingSnapshot;
  timeline: DeliveryStatusLog[];
  courier?: DeliveryCourier;
  cancelledReason?: string;
  deliveredAt?: string;
  proofOfDelivery?: DeliveryProofOfDelivery | null;
  exceptions?: DeliveryException[];
  contactEvents?: DeliveryContactEvent[];
  settlement?: DeliverySettlement;
  receipt?: DeliveryReceipt | null;
  rating?: DeliveryRating | null;
  schedulePolicy?: DeliverySchedulePolicy;
  estimatedDropoffAt?: string;

  // Legacy fields still used by existing list cards.
  packageName: string;
  sender: {
    city: string;
    code: string;
    name: string;
    avatar: string;
    address: string;
    profileImage?: string | null;
  };
  receiver: { city: string; code: string };
  date?: Date;
  time?: string;
  progress: number;
  needsPayment?: boolean;
}

export interface DeliveryState {
  draft: DeliveryDraft;
  activeOrder: DeliveryOrder | null;
  orders: DeliveryOrder[];
  notifications: DeliveryNotification[];
  websocketConnected: boolean;
  lastRealtimeSync?: string;
}

/** Rentals */
export interface RentalVehicle {
  id: string;
  name: string;
  type: string;
  dailyPrice: string;
  mode: string;
  seats: number;
  range: string;
  tag?: string;
  image?: string;
  features?: string[];
}

export interface RentalBooking {
  id: string;
  vehicleId: string;
  startDate?: string;
  endDate?: string;
  pickupBranch?: string;
  dropoffBranch?: string;
  priceEstimate?: string;
  status: "draft" | "confirmed" | "completed" | "cancelled";
}

export interface RentalState {
  vehicles: RentalVehicle[];
  selectedVehicleId?: string | null;
  booking: RentalBooking;
}

/** Tours */
export interface Tour {
  id: string;
  title: string;
  location: string;
  duration: string;
  pricePerPerson: string;
  seatsLeft: number;
  description: string;
  highlights: string[];
  scheduleLabel: string;
}

export interface TourBooking {
  id: string;
  tourId: string;
  date?: string;
  guests: number;
  priceEstimate?: string;
  status: "draft" | "confirmed" | "completed" | "cancelled";
}

export interface ToursState {
  tours: Tour[];
  selectedTourId?: string | null;
  booking: TourBooking;
}

/** Ambulance */
export type AmbulanceStatus =
  | "idle"
  | "requested"
  | "assigned"
  | "en_route"
  | "arrived"
  | "completed"
  | "cancelled";

export interface AmbulanceRequest {
  id: string;
  pickup: RideLocation | null;
  destination?: RideLocation | null;
  urgency: "low" | "medium" | "high";
  status: AmbulanceStatus;
  patientName?: string;
  patientPhone?: string;
  forWhom?: "me" | "someone";
  notes?: string;
  assignedUnit?: string;
}

export interface AmbulanceState {
  request: AmbulanceRequest;
  history: AmbulanceRequest[];
}

/** SOS */
export type SosStatus =
  | "initiated"
  | "alert_sent"
  | "contacts_notified"
  | "support_notified"
  | "resolved";

export interface SosLog {
  status: SosStatus;
  timestamp: string;
  note?: string;
}

export interface SosEvent {
  id: string;
  tripId: string;
  status: SosStatus;
  createdAt: string;
  updatedAt: string;
  logs: SosLog[];
  context: {
    passengerName: string;
    passengerPhone: string;
    driverName?: string;
    driverPhone?: string;
    driverRating?: number;
    vehicleModel?: string;
    vehicleColor?: string;
    licensePlate?: string;
    pickup?: string;
    destination?: string;
    routeSummary?: string;
    tripStatus?: RideStatus;
    lastLocation?: string;
  };
}

export interface SosState {
  activeEventId?: string | null;
  events: SosEvent[];
  emergencyServicesNumber: string;
}
