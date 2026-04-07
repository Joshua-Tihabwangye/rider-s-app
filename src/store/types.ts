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
export type PaymentMethodType = "wallet" | "card" | "mobile_money";

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
