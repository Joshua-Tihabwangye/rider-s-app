import type {
  User,
  PaymentMethod,
  WalletTransaction,
  Reminder,
  EmergencyContact,
  SettingsState,
  RideState,
  RideTrip,
  RideRequest,
  DeliveryState,
  DeliveryOrder,
  RentalState,
  RentalVehicle,
  ToursState,
  Tour,
  AmbulanceState,
  AmbulanceRequest,
  SosState,
  RideOption
} from "./types";

/**
 * Default mock user returned after successful authentication.
 * All user-facing components should read from the auth context rather
 * than embedding these values directly.
 */
export const SEED_USER: User = {
  id: "usr_001",
  fullName: "Rachel Zoe",
  email: "rachel@example.com",
  phone: "+256 777 777 777",
  avatarUrl: null,
  provider: "email",
  role: "rider",
  initials: "RZ"
};

/** Mock auth token */
export const SEED_TOKEN = "mock_jwt_token_evzone_rider_001";

/** Centralized payment methods (replaces hardcoded values in Wallet.tsx) */
export const SEED_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm_wallet",
    type: "wallet",
    label: "EVzone Wallet",
    detail: "Default for rides & deliveries",
    isDefault: true
  },
  {
    id: "pm_card_1",
    type: "card",
    label: "VISA •••• 2451",
    detail: "Expires 08/28",
    isDefault: false
  },
  {
    id: "pm_momo_1",
    type: "mobile_money",
    label: "MTN Mobile Money",
    detail: "", // phone is derived from user profile
    isDefault: false
  }
];

/** Centralized reminders (replaces REMINDERS in Home.tsx) */
export const SEED_REMINDERS: Reminder[] = [
  {
    id: 1,
    title: "Student Bus Fees",
    description: "John Doe - Expires in 5 days. Grace period: 2 days remaining.",
    actionRoute: "/school-handoff/fees"
  },
  {
    id: 2,
    title: "Ride Promotion",
    description: "Get 20% off your next ride. Valid until end of month.",
    actionRoute: "/rides/promotions"
  },
  {
    id: 3,
    title: "Payment Alert",
    description: "Your wallet balance is low. Add funds to continue booking.",
    actionRoute: "/wallet"
  }
];

/** Centralized wallet transactions (replaces TRANSACTIONS in Wallet.tsx) */
export const SEED_TRANSACTIONS: WalletTransaction[] = [
  {
    id: "tx_1",
    title: "Wallet top-up",
    source: "Mobile Money",
    amount: "+UGX 200,000",
    time: "Today 09:41",
    type: "topup"
  },
  {
    id: "tx_2",
    title: "Trip payment",
    source: "Ride #4821",
    amount: "-UGX 12,500",
    time: "Yesterday 18:22",
    type: "ride"
  },
  {
    id: "tx_3",
    title: "Delivery fee",
    source: "Order #9102",
    amount: "-UGX 8,000",
    time: "Apr 4 14:05",
    type: "delivery"
  },
  {
    id: "tx_4",
    title: "Wallet top-up",
    source: "VISA •••• 2451",
    amount: "+UGX 500,000",
    time: "Apr 3 11:30",
    type: "topup"
  },
  {
    id: "tx_5",
    title: "Trip payment",
    source: "Ride #4819",
    amount: "-UGX 15,000",
    time: "Apr 2 08:15",
    type: "ride"
  }
];

/** Default wallet balance */
export const SEED_WALLET_BALANCE = 1_245_000;

/** Default wallet reserved amount */
export const SEED_WALLET_RESERVED = 180_000;

/** Emergency contacts */
export const SEED_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: "ec_001",
    name: "Amina Okello",
    phone: "+256 701 123 456",
    relationship: "Sister",
    isDefault: true,
    notifyOnSOS: true
  },
  {
    id: "ec_002",
    name: "David Kato",
    phone: "+256 772 445 210",
    relationship: "Friend",
    isDefault: false,
    notifyOnSOS: true
  }
];

/** Settings */
export const SEED_SETTINGS: SettingsState = {
  language: "English (UG)",
  region: "Uganda",
  notifications: {
    rideUpdates: true,
    deliveryUpdates: true,
    rentalUpdates: false,
    tourUpdates: false,
    safetyAlerts: true,
    promotions: false
  },
  privacy: {
    shareTripStatus: true,
    shareLocation: true,
    allowContactBySupport: true
  },
  ride: {
    quietRide: false,
    temperature: "Normal",
    luggageAssistance: true,
    accessibilityNeeds: false
  },
  delivery: {
    callBeforeDropoff: true,
    leaveAtDoor: false,
    fragileHandling: true
  }
};

/** Ride state */
const SEED_RIDE_REQUEST: RideRequest = {
  origin: {
    label: "Current location",
    address: "Your current location"
  },
  destination: null,
  stops: [],
  passengers: 1,
  schedule: "now",
  scheduleTime: "",
  tripType: "One Way",
  rideType: "Personal",
  serviceLevel: "car-mini",
  serviceClass: "standard",
  riderType: "personal",
  riderContact: null
};

const SEED_ACTIVE_TRIP: RideTrip = {
  id: "ride_1024",
  status: "driver_on_way",
  otp: "256836",
  etaMinutes: 6,
  fareEstimate: "UGX 12,500",
  distance: "6.2 km",
  routeSummary: "Bugolobi → Nakasero",
  pickup: {
    label: "Bugolobi",
    address: "Bugolobi, Kampala"
  },
  dropoff: {
    label: "Nakasero",
    address: "Nakasero Rd, Kampala"
  },
  driver: {
    id: "drv_001",
    name: "Tim Smith",
    phone: "+256 700 000 000",
    rating: 4.8,
    avatar: "TS"
  },
  vehicle: {
    model: "Tesla Model 3",
    color: "Pearl White",
    plate: "UAX 278C",
    category: "EV Sedan"
  },
  lastKnownLocation: {
    label: "Jinja Rd",
    address: "Jinja Road, Kampala"
  }
};

const SEED_RIDE_OPTIONS: RideOption[] = [
  {
    id: "scooter",
    name: "EV Scooter",
    description: "Fast city trips",
    eta: "4 mins",
    fare: "UGX 25,365",
    capacity: 1
  },
  {
    id: "car-mini",
    name: "EV Car Mini",
    description: "Compact and affordable",
    eta: "4 mins",
    fare: "UGX 40,365",
    capacity: 3
  },
  {
    id: "car-comfort",
    name: "EV Comfort",
    description: "Extra legroom",
    eta: "6 mins",
    fare: "UGX 55,900",
    capacity: 4
  }
];

export const SEED_RIDE_STATE: RideState = {
  request: SEED_RIDE_REQUEST,
  activeTrip: SEED_ACTIVE_TRIP,
  history: [],
  savedPlaces: [
    {
      id: "home",
      label: "Home",
      address: "12, JJ Apartments, New Street, Kampala",
      coordinates: { lat: 0.3476, lng: 32.5825 }
    },
    {
      id: "work",
      label: "Office",
      address: "Plot 14, Nakasero Rd, Kampala",
      coordinates: { lat: 0.3136, lng: 32.5811 }
    }
  ],
  options: SEED_RIDE_OPTIONS
};

/** Delivery state */
const SEED_DELIVERY_ORDERS: DeliveryOrder[] = [
  {
    id: "WC12564897",
    packageName: "The Pair of Sneakers",
    sender: {
      city: "Atlanta",
      code: "5243",
      name: "John Doe",
      avatar: "JD",
      address: "123 Main Street, Atlanta, GA 30309, United States"
    },
    receiver: { city: "Chicago", code: "6342" },
    date: new Date(2024, 1, 7),
    status: "Waiting to accept",
    progress: 20
  },
  {
    id: "WC12564898",
    packageName: "Electronics Package",
    sender: {
      city: "Kampala",
      code: "256",
      name: "Sarah M.",
      avatar: "SM",
      address: "45 Nakasero Road, Kampala, Central Region, Uganda"
    },
    receiver: { city: "Entebbe", code: "256" },
    date: new Date(2024, 1, 8),
    status: "Request accepted",
    progress: 60
  },
  {
    id: "WC12564900",
    packageName: "Gift Box",
    sender: {
      city: "Nairobi",
      code: "254",
      name: "Michael K.",
      avatar: "MK",
      address: "78 Moi Avenue, Nairobi, Kenya"
    },
    receiver: { city: "Kampala", code: "256" },
    date: new Date(2024, 1, 9),
    status: "Waiting to accept",
    progress: 10
  },
  {
    id: "WC12564899",
    packageName: "The Pair of Sneakers",
    sender: {
      city: "Atlanta",
      code: "5243",
      name: "John Doe",
      avatar: "JD",
      address: "Atlanta"
    },
    receiver: { city: "Chicago", code: "6342" },
    time: "2 day – 3 days",
    status: "In transit",
    progress: 80
  }
];

export const SEED_DELIVERY_STATE: DeliveryState = {
  draft: {
    pickup: null,
    dropoff: null,
    parcel: { description: "", notes: "" },
    sender: null,
    recipient: null,
    schedule: "now",
    scheduleTime: "",
    priceEstimate: "UGX 8,000"
  },
  activeOrder: SEED_DELIVERY_ORDERS[0] ?? null,
  orders: SEED_DELIVERY_ORDERS
};

/** Rentals */
const SEED_RENTAL_VEHICLES: RentalVehicle[] = [
  {
    id: "EV-RENT-01",
    name: "Nissan Leaf",
    type: "Hatchback",
    dailyPrice: "UGX 180,000",
    mode: "Self-drive",
    seats: 5,
    range: "220 km",
    tag: "Most popular"
  },
  {
    id: "EV-RENT-02",
    name: "Hyundai Kona EV",
    type: "SUV",
    dailyPrice: "UGX 230,000",
    mode: "Self-drive",
    seats: 5,
    range: "300 km",
    tag: "Family friendly"
  },
  {
    id: "EV-RENT-03",
    name: "Tesla Model 3",
    type: "Sedan",
    dailyPrice: "UGX 320,000",
    mode: "With chauffeur",
    seats: 4,
    range: "400 km",
    tag: "Premium"
  }
];

export const SEED_RENTAL_STATE: RentalState = {
  vehicles: SEED_RENTAL_VEHICLES,
  selectedVehicleId: SEED_RENTAL_VEHICLES[0]?.id ?? null,
  booking: {
    id: "rent_0001",
    vehicleId: SEED_RENTAL_VEHICLES[0]?.id ?? "EV-RENT-01",
    status: "draft",
    priceEstimate: "UGX 180,000 / day"
  }
};

/** Tours */
const SEED_TOURS: Tour[] = [
  {
    id: "tour_001",
    title: "EV Day Trip – Jinja, Source of the Nile",
    location: "Jinja",
    duration: "Full day",
    pricePerPerson: "UGX 185,000",
    seatsLeft: 4,
    description: "A full-day EV tour to the Source of the Nile with guided stops.",
    highlights: ["EV transport included", "Lunch & snacks", "River cruise add-on"],
    scheduleLabel: "Sat 12 Oct • 08:00 – 19:00"
  },
  {
    id: "tour_002",
    title: "Kampala City Night Drive",
    location: "Kampala",
    duration: "3 hours",
    pricePerPerson: "UGX 95,000",
    seatsLeft: 8,
    description: "Night drive through Kampala with city lights and food stops.",
    highlights: ["City skyline views", "Curated food stop"],
    scheduleLabel: "Fri 20 Oct • 19:00 – 22:00"
  },
  {
    id: "tour_003",
    title: "Lake Victoria Sunset Escape",
    location: "Entebbe",
    duration: "Half day",
    pricePerPerson: "UGX 140,000",
    seatsLeft: 6,
    description: "Sunset drive to Lake Victoria with EV transport and guide.",
    highlights: ["Sunset viewing", "Photo stops"],
    scheduleLabel: "Sun 22 Oct • 15:00 – 20:00"
  }
];

export const SEED_TOURS_STATE: ToursState = {
  tours: SEED_TOURS,
  selectedTourId: SEED_TOURS[0]?.id ?? null,
  booking: {
    id: "tour_book_001",
    tourId: SEED_TOURS[0]?.id ?? "tour_001",
    guests: 2,
    status: "draft",
    priceEstimate: "UGX 370,000"
  }
};

/** Ambulance */
const SEED_AMBULANCE_REQUEST: AmbulanceRequest = {
  id: "amb_001",
  pickup: {
    label: "Kololo",
    address: "Kololo, Kampala"
  },
  destination: {
    label: "Case Hospital",
    address: "Case Hospital, Kampala"
  },
  urgency: "high",
  status: "requested",
  patientName: "Rachel Zoe",
  patientPhone: "+256 777 777 777",
  forWhom: "me",
  notes: "Chest discomfort, patient needs urgent transport",
  assignedUnit: "EV-AMB-3"
};

export const SEED_AMBULANCE_STATE: AmbulanceState = {
  request: SEED_AMBULANCE_REQUEST,
  history: []
};

/** SOS */
export const SEED_SOS_STATE: SosState = {
  activeEventId: null,
  events: [],
  emergencyServicesNumber: "112"
};
