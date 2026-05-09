import { USE_BACKEND } from "./config";
import { request } from "./httpClient";

interface BackendAuthUser {
  id: string;
  email: string;
  driverId?: string;
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
}

export interface BackendLoginInput {
  email: string;
  password: string;
}

export interface BackendForgotPasswordInput {
  email: string;
}

export function isBackendAuthEnabled(): boolean {
  return USE_BACKEND;
}

export async function backendRegister(input: BackendRegisterInput): Promise<BackendAuthResponse> {
  return request<BackendAuthResponse>("/auth/register", {
    method: "POST",
    body: input,
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
