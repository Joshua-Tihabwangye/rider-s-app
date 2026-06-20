import type { AuthProvider, AuthResponse, SignInCredentials, SignUpPayload, User } from "./types";
import { SEED_USER } from "./seedData";
import { authRateLimiter, checkRateLimit } from "../utils/rateLimit";
import {
  backendFetchSession,
  backendForgotPassword,
  backendLogin,
  backendRegister,
  backendVerifyOtp,
  backendResetPassword,
  isBackendAuthEnabled,
  saveRiderBackendTokens,
} from "../services/api/authApi";
import { ALLOW_DEV_AUTH_FALLBACK } from "../services/api/config";
import { ApiRequestError } from "../services/api/httpClient";
import { normalizeEmail, validateRiderSignUpInput } from "../utils/validation";

function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
  }
  return (parts[0]?.substring(0, 2) ?? "??").toUpperCase();
}

function mapBackendUserToRider(
  input: { id?: string; riderId?: string; email: string },
  fullName?: string,
  provider: AuthProvider = "email",
): User {
  const resolvedName = fullName?.trim() || input.email.split("@")[0] || SEED_USER.fullName;
  return {
    ...SEED_USER,
    id: input.riderId || input.id || SEED_USER.id,
    fullName: resolvedName,
    email: input.email,
    provider,
    role: "rider",
    initials: computeInitials(resolvedName),
  };
}

function createDevAuthResponse(emailInput: string, fullName?: string): AuthResponse {
  const email = normalizeEmail(emailInput);
  const fallbackEmail = email || `dev-${Date.now()}@example.com`;
  const user = mapBackendUserToRider({ email: fallbackEmail }, fullName, "email");
  const nonce = Date.now().toString(36);

  return {
    user,
    token: `dev_access_${nonce}_${user.id}`,
    refreshToken: `dev_refresh_${nonce}_${user.id}`,
  };
}

function ensureDevFallbackAllowed(featureName: string): void {
  if (!ALLOW_DEV_AUTH_FALLBACK) {
    throw new Error(
      `${featureName} requires backend authentication. Set VITE_BACKEND_ENABLED=true and configure VITE_BACKEND_BASE_URL. For non-production local auth simulation, set VITE_ALLOW_DEV_AUTH_FALLBACK=true.`,
    );
  }
}

export async function signIn(credentials: SignInCredentials): Promise<AuthResponse> {
  const normalizedEmail = normalizeEmail(credentials.email);

  if (!isBackendAuthEnabled()) {
    ensureDevFallbackAllowed("Sign in");
    return createDevAuthResponse(normalizedEmail);
  }

  const limiterKey = `sign-in:${normalizedEmail || "anonymous"}`;
  if (!checkRateLimit(authRateLimiter, limiterKey, "sign-in")) {
    throw new Error("Too many sign in attempts. Please wait a few minutes.");
  }

  try {
    const backend = await backendLogin({
      email: normalizedEmail,
      password: credentials.password,
    });
    saveRiderBackendTokens(backend.accessToken, backend.refreshToken);
    const session = await backendFetchSession();
    return {
      user: mapBackendUserToRider(
        {
          id: session.user.id || backend.user.id,
          riderId: backend.user.riderId || session.profile.riderProfileId || undefined,
          email: session.user.email || backend.user.email,
        },
      ),
      token: backend.accessToken,
      refreshToken: backend.refreshToken,
    };
  } catch (error) {
    const msg =
      error instanceof ApiRequestError && error.status === 401
        ? "Incorrect email or password."
        : error instanceof Error
          ? error.message
          : "Sign in failed.";
    throw new Error(msg);
  }
}

export async function signUp(payload: SignUpPayload): Promise<AuthResponse> {
  const sanitized = validateRiderSignUpInput(payload);

  if (!isBackendAuthEnabled()) {
    ensureDevFallbackAllowed("Sign up");
    return createDevAuthResponse(sanitized.email, sanitized.fullName);
  }

  const limiterKey = `sign-up:${sanitized.email || "anonymous"}`;
  if (!checkRateLimit(authRateLimiter, limiterKey, "sign-up")) {
    throw new Error("Too many sign up attempts. Please wait a few minutes.");
  }

  try {
    const backend = await backendRegister({
      fullName: sanitized.fullName,
      email: sanitized.email,
      phone: sanitized.phone,
      password: sanitized.password,
      riderProfile: {
        fullName: sanitized.fullName,
        phone: sanitized.phone,
        city: sanitized.city,
        country: sanitized.country,
        preferredCurrency: sanitized.preferredCurrency,
      },
    });
    return {
      user: mapBackendUserToRider(
        {
          id: backend.user.id,
          riderId: backend.user.riderId,
          email: backend.user.email,
        },
        sanitized.fullName,
        "email",
      ),
      token: backend.accessToken,
      refreshToken: backend.refreshToken,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Sign up failed.";
    throw new Error(msg);
  }
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  const normalizedEmail = normalizeEmail(email);

  if (!isBackendAuthEnabled()) {
    ensureDevFallbackAllowed("Forgot password");
    return { message: "Development mode: password reset is simulated locally." };
  }

  const limiterKey = `forgot-password:${normalizedEmail || "anonymous"}`;
  if (!checkRateLimit(authRateLimiter, limiterKey, "forgot-password")) {
    throw new Error("Too many reset requests. Please wait a few minutes.");
  }

  try {
    await backendForgotPassword({ email: normalizedEmail });
    return { message: "If an account exists for this email, we've sent a password reset link." };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to send reset link.";
    throw new Error(msg);
  }
}

export async function verifyOtp(email: string, otp: string): Promise<{ verified: boolean; resetRequired?: boolean }> {
  if (!isBackendAuthEnabled()) {
    ensureDevFallbackAllowed("OTP verification");
    return { verified: true, resetRequired: true };
  }
  try {
    return await backendVerifyOtp({ email: normalizeEmail(email), otp });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "OTP verification failed.";
    throw new Error(msg);
  }
}

export async function resetPassword(email: string, otp: string, newPassword: string): Promise<{ reset: boolean }> {
  if (!isBackendAuthEnabled()) {
    ensureDevFallbackAllowed("Password reset");
    return { reset: true };
  }
  try {
    return await backendResetPassword({ email: normalizeEmail(email), otp, newPassword });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Password reset failed.";
    throw new Error(msg);
  }
}

export async function socialSignIn(provider: AuthProvider): Promise<AuthResponse> {
  ensureDevFallbackAllowed("Social sign in");

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  await delay(1500);

  const providerNames: Record<AuthProvider, string> = {
    evzone: "EV Zone",
    google: "Google",
    apple: "Apple",
    email: "Email",
  };

  return {
    user: {
      ...SEED_USER,
      provider,
      fullName: `${providerNames[provider]} User`,
      initials: providerNames[provider].substring(0, 2).toUpperCase(),
    },
    token: "mock_social_token",
  };
}
