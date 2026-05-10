import type { AuthProvider, AuthResponse, SignInCredentials, SignUpPayload, User } from "./types";
import { SEED_USER, SEED_TOKEN } from "./seedData";
import { authRateLimiter, checkRateLimit } from "../utils/rateLimit";
import {
  backendForgotPassword,
  backendLogin,
  backendRegister,
  isBackendAuthEnabled,
} from "../services/api/authApi";
import { ApiRequestError } from "../services/api/httpClient";

const simulateDelay = (ms = 1200): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
  }
  return (parts[0]?.substring(0, 2) ?? "??").toUpperCase();
}

function shouldFallbackToLocal(error: unknown): boolean {
  if (error instanceof TypeError) return true;
  if (error instanceof ApiRequestError) {
    return error.status >= 500;
  }
  return false;
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

export async function signIn(credentials: SignInCredentials): Promise<AuthResponse> {
  const limiterKey = `sign-in:${credentials.email.trim().toLowerCase() || "anonymous"}`;
  if (!checkRateLimit(authRateLimiter, limiterKey, "sign-in")) {
    throw new Error("Too many sign in attempts. Please wait a few minutes.");
  }

  if (isBackendAuthEnabled()) {
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
      if (!shouldFallbackToLocal(error)) {
        throw error;
      }
      console.warn("Backend sign-in unavailable. Falling back to local auth.", error);
    }
  }

  await simulateDelay();

  if (!credentials.email || credentials.password.length < 6) {
    throw new Error("Invalid email or password.");
  }

  return {
    user: { ...SEED_USER, email: credentials.email },
    token: SEED_TOKEN,
  };
}

export async function signUp(payload: SignUpPayload): Promise<AuthResponse> {
  const limiterKey = `sign-up:${payload.email.trim().toLowerCase() || "anonymous"}`;
  if (!checkRateLimit(authRateLimiter, limiterKey, "sign-up")) {
    throw new Error("Too many sign up attempts. Please wait a few minutes.");
  }

  if (isBackendAuthEnabled()) {
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
      if (!shouldFallbackToLocal(error)) {
        throw error;
      }
      console.warn("Backend sign-up unavailable. Falling back to local auth.", error);
    }
  }

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
    provider: "email" as const,
  };

  return { user, token: SEED_TOKEN };
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  const limiterKey = `forgot-password:${email.trim().toLowerCase() || "anonymous"}`;
  if (!checkRateLimit(authRateLimiter, limiterKey, "forgot-password")) {
    throw new Error("Too many reset requests. Please wait a few minutes.");
  }

  if (isBackendAuthEnabled()) {
    try {
      await backendForgotPassword({ email: email.trim().toLowerCase() });
      return { message: "If an account exists for this email, we've sent a password reset link." };
    } catch (error) {
      if (!shouldFallbackToLocal(error)) {
        throw error;
      }
      console.warn("Backend forgot-password unavailable. Falling back to local auth.", error);
    }
  }

  await simulateDelay();

  if (!email) {
    throw new Error("Please enter your email address.");
  }

  return { message: "If an account exists for this email, we've sent a password reset link." };
}

export async function socialSignIn(provider: AuthProvider): Promise<AuthResponse> {
  if (!checkRateLimit(authRateLimiter, `social-sign-in:${provider}`, "social-sign-in")) {
    throw new Error("Too many authentication attempts. Please wait a few minutes.");
  }

  await simulateDelay(1500);

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
    token: SEED_TOKEN,
  };
}
