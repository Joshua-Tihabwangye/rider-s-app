import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import type { User, AuthState, SignInCredentials, SignUpPayload, AuthProvider as AuthProviderType } from "../store/types";
import * as authService from "../store/authService";
import { BACKEND_FLAG_EVENT } from "../services/api/config";
import {
  clearRiderBackendTokens,
  RIDER_BACKEND_REFRESH_TOKEN_KEY,
  saveRiderBackendTokens,
} from "../services/api/authApi";
import { getRiderProfile, isRiderBackendEnabled } from "../services/api/riderApi";
import { verifyOtp, resetPassword } from "../store/authService";

// ─── Storage keys ────────────────────────────────────────────────────
const STORAGE_KEY_USER = "evzone_auth_user";
const STORAGE_KEY_TOKEN = "evzone_auth_token";
const STORAGE_KEY_REFRESH_TOKEN = RIDER_BACKEND_REFRESH_TOKEN_KEY;

// ─── Context value shape ─────────────────────────────────────────────
interface AuthContextValue extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<void>;
  signOut: () => void;
  forgotPassword: (email: string) => Promise<string>;
  verifyOtp: (email: string, otp: string) => Promise<{ verified: boolean; resetRequired?: boolean }>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<{ reset: boolean }>;
  socialSignIn: (provider: AuthProviderType) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Helpers ─────────────────────────────────────────────────────────
function persistSession(user: User, token: string, refreshToken?: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
    if (refreshToken) {
      localStorage.setItem(STORAGE_KEY_REFRESH_TOKEN, refreshToken);
      saveRiderBackendTokens(token, refreshToken);
    }
  } catch (error) {
    console.error("Failed to persist session:", error);
  }
}

function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_REFRESH_TOKEN);
    clearRiderBackendTokens();
  } catch (error) {
    console.error("Failed to clear session:", error);
  }
}

function isLikelyUsableAccessToken(token: string): boolean {
  try {
    // Accept non-JWT opaque tokens (some backends return opaque bearer tokens).
    // If it's not JWT-shaped but non-empty, defer validation to backend requests.
    if (!token || token.trim().length < 8) {
      return false;
    }

    // Basic JWT structure validation (header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return true;
    }

    // Check if header and payload are valid base64 and JSON
    let header, payload;
    try {
      const encodedHeader = parts[0];
      const encodedPayload = parts[1];
      if (!encodedHeader || !encodedPayload) {
        return false;
      }
      header = JSON.parse(atob(encodedHeader));
      payload = JSON.parse(atob(encodedPayload));
    } catch {
      // If decode fails, still treat as usable and let backend decide.
      return true;
    }

    // Check if token has not expired (with 5 minute grace period).
    // If expired, caller may still keep session when refresh token exists.
    if (payload.exp && payload.exp * 1000 < (Date.now() - 300000)) {
      return false;
    }

    // Basic structure validation
    if (!header.alg) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

// ─── Provider ────────────────────────────────────────────────────────
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // true while hydrating
  const [error, setError] = useState<string | null>(null);
  const [riderBackendEnabled, setRiderBackendEnabled] = useState(() => isRiderBackendEnabled());

  // Hydrate auth session from localStorage on app load.
  useEffect(() => {
    const hydrateAuth = async () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEY_USER);
        const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
        const storedRefreshToken = localStorage.getItem(STORAGE_KEY_REFRESH_TOKEN);

        if (!storedUser || !storedToken) {
          clearSession();
          setUser(null);
          return;
        }

        // Sanitize JSON parsing to prevent prototype pollution
        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser || typeof parsedUser !== "object" || Array.isArray(parsedUser) || !("id" in parsedUser)) {
          clearSession();
          setUser(null);
          return;
        }

        // Validate token format and expiration.
        // If access token is stale but refresh token exists, keep session and allow
        // API layer to refresh transparently.
        if (!isLikelyUsableAccessToken(storedToken) && !storedRefreshToken) {
          clearSession();
          setUser(null);
          return;
        }

        setUser(parsedUser as User);
      } catch (error) {
        console.error("Failed to parse stored auth data:", error);
        clearSession();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    hydrateAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
    if (!storedToken) {
      setUser(null);
      clearSession();
    }
  }, [user]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      clearSession();
      return;
    }
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    const refreshToken = localStorage.getItem(STORAGE_KEY_REFRESH_TOKEN);
    if (token) {
      persistSession(user, token, refreshToken ?? undefined);
    }
  }, [loading, user]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const syncBackendFlag = () => {
      setRiderBackendEnabled(isRiderBackendEnabled());
    };

    window.addEventListener(BACKEND_FLAG_EVENT, syncBackendFlag as EventListener);
    syncBackendFlag();

    return () => {
      window.removeEventListener(BACKEND_FLAG_EVENT, syncBackendFlag as EventListener);
    };
  }, []);

  useEffect(() => {
    const refreshProfileFromBackend = async () => {
      if (!riderBackendEnabled || !user) {
        return;
      }

      if (!localStorage.getItem(STORAGE_KEY_TOKEN)) {
        return;
      }

      try {
        const backendProfile = await getRiderProfile();
        const hasChanges =
          backendProfile.riderId !== user.id ||
          backendProfile.fullName !== user.fullName ||
          backendProfile.email !== user.email ||
          backendProfile.phone !== user.phone;

        if (!hasChanges) {
          return;
        }

        const nextUser: User = {
          id: backendProfile.riderId || user.id,
          fullName: backendProfile.fullName || user.fullName,
          email: backendProfile.email || user.email,
          phone: backendProfile.phone || user.phone,
          avatarUrl: user.avatarUrl,
          provider: user.provider,
          role: "rider",
          initials: user.initials,
        };
        setUser(nextUser);
      } catch (error) {
        console.warn("Rider backend profile fetch failed. Keeping local auth profile.", error);
      }
    };

    void refreshProfileFromBackend();
  }, [riderBackendEnabled, user]);

  const handleAuthSuccess = useCallback((authUser: User, token: string, refreshToken?: string) => {
    setUser(authUser);
    setError(null);
    persistSession(authUser, token, refreshToken);
    setLoading(false);
  }, []);

  const signIn = useCallback(async (credentials: SignInCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.signIn(credentials);
      handleAuthSuccess(response.user, response.token, response.refreshToken);
    } catch (err) {
      // Sanitize error messages to prevent information leakage
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage.length > 100 ? "Sign in failed. Please try again." : errorMessage);
    } finally {
      setLoading(false);
    }
  }, [handleAuthSuccess]);

  const signUp = useCallback(async (payload: SignUpPayload) => {
    setLoading(true);
    setError(null);
    try {
      await authService.signUp(payload);
      setError(null);
    } catch (err) {
      // Sanitize error messages to prevent information leakage
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage.length > 100 ? "Sign up failed. Please try again." : errorMessage);
      throw err instanceof Error ? err : new Error("Sign up failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setError(null);
    clearSession();
  }, []);

  const forgotPassword = useCallback(async (email: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.forgotPassword(email);
      return response.message;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Request failed.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (email: string, otp: string): Promise<{ verified: boolean; resetRequired?: boolean }> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.verifyOtp(email, otp);
      return response;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "OTP verification failed.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email: string, otp: string, newPassword: string): Promise<{ reset: boolean }> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.resetPassword(email, otp, newPassword);
      return response;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Password reset failed.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const socialSignIn = useCallback(async (provider: AuthProviderType) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.socialSignIn(provider);
      handleAuthSuccess(response.user, response.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : `${provider} sign in failed.`);
    } finally {
      setLoading(false);
    }
  }, [handleAuthSuccess]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: !!user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    verifyOtp,
    resetPassword,
    socialSignIn,
    clearError
  }), [user, loading, error, signIn, signUp, signOut, forgotPassword, verifyOtp, resetPassword, socialSignIn, clearError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
