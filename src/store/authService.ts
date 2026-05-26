import type { AuthProvider, AuthResponse, SignInCredentials, SignUpPayload, User } from "./types";
import { SEED_USER } from "./seedData";
import { authRateLimiter, checkRateLimit } from "../utils/rateLimit";
import {
  backendForgotPassword,
  backendLogin,
  backendRegister,
  backendVerifyOtp,
  backendResetPassword,
  isBackendAuthEnabled,
} from "../services/api/authApi";
import { ApiRequestError } from "../services/api/httpClient";

const DEV_AUTH_BYPASS_ENABLED = import.meta.env.DEV;

function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
  }
  return (parts[0]?.substring(0, 2) ?? "??").toUpperCase();
}

function mapBackendUserToRider(
  email: string,
  fullName?: string,
  provider: AuthProvider = "email",
): User {
  const resolvedName = fullName?.trim() || email.split("@")[0] || SEED_USER.fullName;
  return {
    ...SEED_USER,
    id: `usr_${Date.now()}`,
    fullName: resolvedName,
    email,
    provider,
    role: "rider",
    initials: computeInitials(resolvedName),
  };
}

function createDevAuthResponse(emailInput: string, fullName?: string): AuthResponse {
  const email = emailInput.trim().toLowerCase();
  const fallbackEmail = email || `dev-${Date.now()}@example.com`;
  const user = mapBackendUserToRider(fallbackEmail, fullName, "email");
  const nonce = Date.now().toString(36);

  return {
    user,
    token: `dev_access_${nonce}_${user.id}`,
    refreshToken: `dev_refresh_${nonce}_${user.id}`,
  };
}

export async function signIn(credentials: SignInCredentials): Promise<AuthResponse> {
  if (!isBackendAuthEnabled()) {
    if (DEV_AUTH_BYPASS_ENABLED) {
      return createDevAuthResponse(credentials.email);
    }
    throw new Error("Authentication service is unavailable.");
  }

  const limiterKey = `sign-in:${credentials.email.trim().toLowerCase() || "anonymous"}`;
  if (!checkRateLimit(authRateLimiter, limiterKey, "sign-in")) {
    throw new Error("Too many sign in attempts. Please wait a few minutes.");
  }

  try {
    const backend = await backendLogin({
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    });
    return {
      user: mapBackendUserToRider(backend.user.email),
      token: backend.accessToken,
      refreshToken: backend.refreshToken,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Sign in failed.";
    throw new Error(msg);
  }
}

export async function signUp(payload: SignUpPayload): Promise<AuthResponse> {
  if (!isBackendAuthEnabled()) {
    if (DEV_AUTH_BYPASS_ENABLED) {
      return createDevAuthResponse(payload.email, payload.fullName.trim());
    }
    throw new Error("Authentication service is unavailable.");
  }

  const limiterKey = `sign-up:${payload.email.trim().toLowerCase() || "anonymous"}`;
  if (!checkRateLimit(authRateLimiter, limiterKey, "sign-up")) {
    throw new Error("Too many sign up attempts. Please wait a few minutes.");
  }

  try {
    const backend = await backendRegister({
      fullName: payload.fullName.trim(),
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    });
    return {
      user: mapBackendUserToRider(backend.user.email, payload.fullName, "email"),
      token: backend.accessToken,
      refreshToken: backend.refreshToken,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Sign up failed.";
    throw new Error(msg);
  }
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  if (!isBackendAuthEnabled()) {
    if (DEV_AUTH_BYPASS_ENABLED) {
      return { message: "Development mode: password reset is simulated locally." };
    }
    throw new Error("Authentication service is unavailable.");
  }

  const limiterKey = `forgot-password:${email.trim().toLowerCase() || "anonymous"}`;
  if (!checkRateLimit(authRateLimiter, limiterKey, "forgot-password")) {
    throw new Error("Too many reset requests. Please wait a few minutes.");
  }

  try {
    await backendForgotPassword({ email: email.trim().toLowerCase() });
    return { message: "If an account exists for this email, we've sent a password reset link." };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to send reset link.";
    throw new Error(msg);
  }
}

export async function verifyOtp(email: string, otp: string): Promise<{ verified: boolean; resetRequired?: boolean }> {
  if (!isBackendAuthEnabled()) {
    if (DEV_AUTH_BYPASS_ENABLED) {
      return { verified: true, resetRequired: true };
    }
    throw new Error("Authentication service is unavailable.");
  }
  try {
    return await backendVerifyOtp({ email: email.trim().toLowerCase(), otp });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "OTP verification failed.";
    throw new Error(msg);
  }
}

export async function resetPassword(email: string, otp: string, newPassword: string): Promise<{ reset: boolean }> {
  if (!isBackendAuthEnabled()) {
    if (DEV_AUTH_BYPASS_ENABLED) {
      return { reset: true };
    }
    throw new Error("Authentication service is unavailable.");
  }
  try {
    return await backendResetPassword({ email: email.trim().toLowerCase(), otp, newPassword });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Password reset failed.";
    throw new Error(msg);
  }
}

export async function socialSignIn(provider: AuthProvider): Promise<AuthResponse> {
  // Social sign-in remains simulated
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
