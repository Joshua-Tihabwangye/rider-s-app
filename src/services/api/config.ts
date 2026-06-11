const env = import.meta.env as Record<string, string | undefined>;

function parseBooleanFlag(value: string | undefined, fallback = false): boolean {
  if (!value) return fallback;
  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
}

const DEFAULT_LOCAL_BACKEND_BASE_URL = "http://localhost:3000/api/v1";

function normalizeBaseUrl(value: string | undefined): string {
  const raw = value?.trim();
  if (raw) return raw.replace(/\/+$/, "");
  return IS_NON_PROD ? DEFAULT_LOCAL_BACKEND_BASE_URL : "";
}

function normalizeSocketBaseUrl(value: string | undefined, apiBaseUrl: string): string {
  const raw = value?.trim();
  if (raw) {
    const normalized = raw.replace(/\/+$/, "");
    return normalized.replace(/\/api(?:\/v\d+)?$/, "");
  }
  if (!apiBaseUrl) return "";
  return apiBaseUrl.replace(/\/api(?:\/v\d+)?$/, "");
}

const backendBaseUrlEnv = env.VITE_BACKEND_BASE_URL ?? env.VITE_API_BASE_URL;
const backendEnabledEnv = env.VITE_BACKEND_ENABLED ?? env.VITE_USE_BACKEND;
const IS_NON_PROD = (env.MODE?.trim().toLowerCase() ?? "development") !== "production";

function isInvalidProductionOrigin(value: string): boolean {
  try {
    const parsed = new URL(value);
    return !["http:", "https:"].includes(parsed.protocol) ||
      ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);
  } catch {
    return true;
  }
}

function assertValidProductionOrigin(value: string, name: string): string {
  if (!IS_NON_PROD) {
    if (!value) {
      throw new Error(
        `${name} is missing in production. Set it to the public backend origin before deploying.`,
      );
    }

    if (isInvalidProductionOrigin(value)) {
      throw new Error(
        `${name} must be an absolute public backend origin in production. Set it to something like https://api.evzone.app or https://api.evzone.app/api/v1 before deploying.`,
      );
    }
  }

  return value;
}

export const API_BASE_URL = assertValidProductionOrigin(
  normalizeBaseUrl(backendBaseUrlEnv),
  "VITE_BACKEND_BASE_URL",
);
export const SOCKET_BASE_URL = assertValidProductionOrigin(
  normalizeSocketBaseUrl(env.VITE_SOCKET_BASE_URL, API_BASE_URL),
  "VITE_SOCKET_BASE_URL",
);
export const SOCKET_PATH = (env.VITE_SOCKET_PATH || "/socket.io").trim() || "/socket.io";

export function getApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error(
      "VITE_BACKEND_BASE_URL must be configured to the backend origin, for example https://your-backend-domain.com/api/v1.",
    );
  }
  return API_BASE_URL;
}

export function getSocketBaseUrl(): string {
  return SOCKET_BASE_URL;
}
export const APP_ID = (env.VITE_APP_ID || "rider").trim() || "rider";
export const FRONTEND_ONLY_MODE = parseBooleanFlag(
  env.VITE_FRONTEND_ONLY_MODE,
  false
);
export const USE_BACKEND = parseBooleanFlag(backendEnabledEnv, true) && !FRONTEND_ONLY_MODE;
export const ALLOW_DEV_AUTH_FALLBACK = parseBooleanFlag(
  env.VITE_ALLOW_DEV_AUTH_FALLBACK,
  false,
) && IS_NON_PROD;
export const ALLOW_CACHE_FALLBACK = IS_NON_PROD;
export const ENABLE_COMPAT_BOOTSTRAP = parseBooleanFlag(
  env.VITE_ENABLE_COMPAT_BOOTSTRAP,
  USE_BACKEND
) && USE_BACKEND;
export const BACKEND_FLAG_EVENT = "evzone:backend-flag";
const BACKEND_FLAG_STORAGE_KEY = `evzone_backend_flag_${APP_ID}`;

interface RuntimeFlagEnvelope {
  data?: {
    backendEnabled?: boolean;
    capabilities?: {
      sharedRidesEnabled?: boolean;
    };
  };
  backendEnabled?: boolean;
  capabilities?: {
    sharedRidesEnabled?: boolean;
  };
}

export interface CanonicalRouteContract {
  appId: string;
  contractVersion?: string;
  rest: Record<string, string>;
  realtime: {
    namespace: string;
    path: string;
  };
  uiRoutes?: Record<string, string>;
  notes?: string[];
}

interface CanonicalRouteEnvelope {
  data?: CanonicalRouteContract;
}

function readStoredBackendFlag(): boolean | undefined {
  if (typeof window === "undefined") return undefined;
  if (FRONTEND_ONLY_MODE) return false;
  const raw = window.localStorage.getItem(BACKEND_FLAG_STORAGE_KEY);
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw) as { enabled?: boolean };
    return typeof parsed.enabled === "boolean" ? parsed.enabled : undefined;
  } catch {
    return undefined;
  }
}

let runtimeBackendEnabled: boolean | undefined = readStoredBackendFlag();
let runtimeSharedRidesEnabled: boolean | undefined;
let runtimeFlagLoadPromise: Promise<boolean> | null = null;
let runtimeCanonicalContract: CanonicalRouteContract | null = null;
let runtimeCanonicalLoadPromise: Promise<CanonicalRouteContract | null> | null = null;

export function getBackendEnabled(): boolean {
  if (FRONTEND_ONLY_MODE) return false;
  return USE_BACKEND && (runtimeBackendEnabled ?? true);
}

export function setBackendEnabled(enabled: boolean): void {
  if (FRONTEND_ONLY_MODE) {
    runtimeBackendEnabled = false;
    return;
  }
  runtimeBackendEnabled = enabled;
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    BACKEND_FLAG_STORAGE_KEY,
    JSON.stringify({ enabled, updatedAt: Date.now() }),
  );
  window.dispatchEvent(new CustomEvent(BACKEND_FLAG_EVENT, { detail: { appId: APP_ID, enabled } }));
}

export function getSharedRidesEnabled(): boolean {
  return runtimeSharedRidesEnabled ?? false;
}

export async function loadBackendRuntimeFlag(force = false): Promise<boolean> {
  if (FRONTEND_ONLY_MODE) {
    return false;
  }
  if (typeof window === "undefined") {
    return getBackendEnabled();
  }

  if (!force && runtimeFlagLoadPromise) {
    return runtimeFlagLoadPromise;
  }

  runtimeFlagLoadPromise = (async () => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/compat/flags/${APP_ID}`);
      if (!response.ok) {
        throw new Error(`Runtime flag request failed with status ${response.status}`);
      }

      const payload = (await response.json()) as RuntimeFlagEnvelope;
      const enabled = payload.data?.backendEnabled ?? payload.backendEnabled;
      const sharedRidesEnabled =
        payload.data?.capabilities?.sharedRidesEnabled ??
        payload.capabilities?.sharedRidesEnabled;
      if (typeof enabled === "boolean") {
        setBackendEnabled(enabled);
      }
      if (typeof sharedRidesEnabled === "boolean") {
        runtimeSharedRidesEnabled = sharedRidesEnabled;
      }
      return getBackendEnabled();
    } catch {
      return getBackendEnabled();
    }
  })();

  return runtimeFlagLoadPromise;
}

export function getCanonicalRouteContract(): CanonicalRouteContract | null {
  return runtimeCanonicalContract;
}

export async function loadCanonicalRouteContract(force = false): Promise<CanonicalRouteContract | null> {
  if (FRONTEND_ONLY_MODE) {
    return null;
  }
  if (typeof window === "undefined") {
    return runtimeCanonicalContract;
  }

  if (!force && runtimeCanonicalLoadPromise) {
    return runtimeCanonicalLoadPromise;
  }

  runtimeCanonicalLoadPromise = (async () => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/compat/canonical-routes/${APP_ID}`);
      if (!response.ok) {
        throw new Error(`Canonical contract request failed with status ${response.status}`);
      }

      const payload = (await response.json()) as CanonicalRouteEnvelope;
      runtimeCanonicalContract = payload.data ?? null;
      return runtimeCanonicalContract;
    } catch {
      return runtimeCanonicalContract;
    }
  })();

  return runtimeCanonicalLoadPromise;
}

if (typeof window !== "undefined" && ENABLE_COMPAT_BOOTSTRAP) {
  void loadBackendRuntimeFlag().catch(() => undefined);
  void loadCanonicalRouteContract().catch(() => undefined);
}
