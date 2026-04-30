import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import type { User, AuthState, SignInCredentials, SignUpPayload, AuthProvider as AuthProviderType } from "../store/types";
import * as authService from "../store/authService";

// ─── Storage keys ────────────────────────────────────────────────────
const STORAGE_KEY_USER = "evzone_auth_user";
const STORAGE_KEY_TOKEN = "evzone_auth_token";

// ─── Context value shape ─────────────────────────────────────────────
interface AuthContextValue extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<void>;
  signOut: () => void;
  forgotPassword: (email: string) => Promise<string>;
  socialSignIn: (provider: AuthProviderType) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Helpers ─────────────────────────────────────────────────────────
function persistSession(user: User, token: string): void {
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  localStorage.setItem(STORAGE_KEY_TOKEN, token);
}

function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY_USER);
  localStorage.removeItem(STORAGE_KEY_TOKEN);
}

// ─── Provider ────────────────────────────────────────────────────────
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // true while hydrating
  const [error, setError] = useState<string | null>(null);

  // Force sign-in as the first page on each fresh app load.
  // We intentionally clear any previously persisted session so users
  // always land on /auth/sign-in before accessing protected screens.
  useEffect(() => {
    clearSession();
    setUser(null);
    setLoading(false);
  }, []);

  const handleAuthSuccess = useCallback((authUser: User, token: string) => {
    setUser(authUser);
    setError(null);
    persistSession(authUser, token);
  }, []);

  const signIn = useCallback(async (credentials: SignInCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.signIn(credentials);
      handleAuthSuccess(response.user, response.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  }, [handleAuthSuccess]);

  const signUp = useCallback(async (payload: SignUpPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.signUp(payload);
      handleAuthSuccess(response.user, response.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed.");
    } finally {
      setLoading(false);
    }
  }, [handleAuthSuccess]);

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
    socialSignIn,
    clearError
  }), [user, loading, error, signIn, signUp, signOut, forgotPassword, socialSignIn, clearError]);

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
