import type { User, PaymentMethod, WalletTransaction, Reminder } from "./types";

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
