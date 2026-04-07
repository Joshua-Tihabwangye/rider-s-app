import type { AuthProvider, AuthResponse, SignInCredentials, SignUpPayload } from "./types";
import { SEED_USER, SEED_TOKEN } from "./seedData";

/**
 * Simulated network delay to give realistic UX feedback.
 * Replace the body of each method with real API calls when backend is ready.
 */
const simulateDelay = (ms = 1200): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Compute initials from a full name string.
 */
function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
  }
  return (parts[0]?.substring(0, 2) ?? "??").toUpperCase();
}

// ─── Public API ──────────────────────────────────────────────────────

/**
 * Authenticate with email + password.
 * TODO: Replace with real POST /auth/sign-in
 */
export async function signIn(credentials: SignInCredentials): Promise<AuthResponse> {
  await simulateDelay();

  // Mock: accept any valid-looking email with any password ≥ 6 chars
  if (!credentials.email || credentials.password.length < 6) {
    throw new Error("Invalid email or password.");
  }

  return {
    user: { ...SEED_USER, email: credentials.email },
    token: SEED_TOKEN
  };
}

/**
 * Create a new account.
 * TODO: Replace with real POST /auth/sign-up
 */
export async function signUp(payload: SignUpPayload): Promise<AuthResponse> {
  await simulateDelay();

  if (!payload.fullName.trim()) {
    throw new Error("Full name is required.");
  }

  const user = {
    ...SEED_USER,
    id: `usr_${Date.now()}`,
    fullName: payload.fullName,
    email: payload.email,
    initials: computeInitials(payload.fullName),
    provider: "email" as const
  };

  return { user, token: SEED_TOKEN };
}

/**
 * Request password reset email.
 * TODO: Replace with real POST /auth/forgot-password
 */
export async function forgotPassword(email: string): Promise<{ message: string }> {
  await simulateDelay();

  if (!email) {
    throw new Error("Please enter your email address.");
  }

  return { message: "If an account exists for this email, we've sent a password reset link." };
}

/**
 * Authenticate via social / third-party provider.
 * TODO: Replace with real OAuth flow per provider
 */
export async function socialSignIn(provider: AuthProvider): Promise<AuthResponse> {
  await simulateDelay(1500);

  const providerNames: Record<AuthProvider, string> = {
    evzone: "EV Zone",
    google: "Google",
    apple: "Apple",
    email: "Email"
  };

  // Mock: return seed user tagged with the selected provider
  return {
    user: {
      ...SEED_USER,
      provider,
      fullName: `${providerNames[provider]} User`,
      initials: providerNames[provider].substring(0, 2).toUpperCase()
    },
    token: SEED_TOKEN
  };
}
