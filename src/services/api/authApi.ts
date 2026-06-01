import { getBackendEnabled } from "./config";
import { request, configureHttpClientAuth, type TokenRefreshResult } from "./httpClient";

export const RIDER_BACKEND_ACCESS_TOKEN_KEY = "evzone_auth_token";
export const RIDER_BACKEND_REFRESH_TOKEN_KEY = "evzone_auth_refresh_token";
const RIDER_AUTH_USER_STORAGE_KEY = "evzone_auth_user";
const RIDER_LOGIN_PATH = "/auth/sign-in";

interface BackendAuthUser {
  id: string;
  email: string;
  riderId?: string;
  roles?: string[];
}

interface BackendAuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
  user: BackendAuthUser;
}

export interface BackendRegisterInput {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  riderProfile?: {
    fullName?: string;
    phone?: string;
    city?: string;
    country?: string;
    preferredCurrency?: string;
  };
}

export interface BackendLoginInput {
  email: string;
  password: string;
}

export interface BackendForgotPasswordInput {
  email: string;
}

export function readRiderBackendAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(RIDER_BACKEND_ACCESS_TOKEN_KEY);
}

export function readRiderBackendRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(RIDER_BACKEND_REFRESH_TOKEN_KEY);
}

export function saveRiderBackendTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RIDER_BACKEND_ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(RIDER_BACKEND_REFRESH_TOKEN_KEY, refreshToken);
}

export function clearRiderBackendTokens(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(RIDER_BACKEND_ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(RIDER_BACKEND_REFRESH_TOKEN_KEY);
}

function clearRiderSession(): void {
  if (typeof window === "undefined") return;
  clearRiderBackendTokens();
  window.localStorage.removeItem(RIDER_AUTH_USER_STORAGE_KEY);
}

async function refreshRiderBackendTokens(refreshToken: string): Promise<TokenRefreshResult> {
  const payload = await request<BackendAuthResponse>("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
    retryOnUnauthorized: false,
  });

  return {
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
  };
}

configureHttpClientAuth({
  getAccessToken: readRiderBackendAccessToken,
  getRefreshToken: readRiderBackendRefreshToken,
  setTokens: saveRiderBackendTokens,
  clearSession: clearRiderSession,
  refresh: refreshRiderBackendTokens,
  onUnauthorized: () => {
    if (typeof window === "undefined") return;
    if (window.location.pathname !== RIDER_LOGIN_PATH) {
      window.location.assign(RIDER_LOGIN_PATH);
    }
  },
});

export function isBackendAuthEnabled(): boolean {
  return getBackendEnabled();
}

export async function backendRegister(input: BackendRegisterInput): Promise<BackendAuthResponse> {
  return request<BackendAuthResponse>("/auth/register", {
    method: "POST",
    body: {
      ...input,
      roles: ["rider"],
    },
  });
}

export async function backendLogin(input: BackendLoginInput): Promise<BackendAuthResponse> {
  return request<BackendAuthResponse>("/auth/login", {
    method: "POST",
    body: input,
  });
}

export async function backendForgotPassword(input: BackendForgotPasswordInput): Promise<{ sent: boolean }> {
  return request<{ sent: boolean }>("/auth/forgot-password", {
    method: "POST",
    body: input,
  });
}

export interface BackendVerifyOtpInput {
  email: string;
  otp: string;
}

export interface BackendVerifyOtpResult {
  verified: boolean;
  resetRequired?: boolean;
}

export async function backendVerifyOtp(input: BackendVerifyOtpInput): Promise<BackendVerifyOtpResult> {
  return request<BackendVerifyOtpResult>("/auth/verify-otp", {
    method: "POST",
    body: input,
  });
}

export interface BackendResetPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}

export interface BackendResetPasswordResult {
  reset: boolean;
}

export async function backendResetPassword(input: BackendResetPasswordInput): Promise<BackendResetPasswordResult> {
  return request<BackendResetPasswordResult>("/auth/reset-password", {
    method: "POST",
    body: input,
  });
}
