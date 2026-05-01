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
  try {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
  } catch (error) {
    console.error("Failed to persist session:", error);
  }
}

function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  } catch (error) {
    console.error("Failed to clear session:", error);
  }
}

function isValidJWT(token: string): boolean {
  try {
    // Basic JWT structure validation (header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) {
      // For development, allow non-standard tokens that start with our mock prefix
      if (token.startsWith('mock_jwt_token_')) {
        console.log("Allowing development mock token");
        return true;
      }
      console.log("Invalid JWT structure - not 3 parts");
      return false;
    }

    // Check if header and payload are valid base64 and JSON
    let header, payload;
    try {
      header = JSON.parse(atob(parts[0]));
      payload = JSON.parse(atob(parts[1]));
    } catch (decodeError) {
      console.log("Invalid JWT base64 encoding:", decodeError);
      return false;
    }

    // Check if token has not expired (with 5 minute grace period)
    if (payload.exp && payload.exp * 1000 < (Date.now() - 300000)) {
      console.log("JWT token expired");
      return false;
    }

    // Basic structure validation
    if (!header.alg || !payload.iat) {
      console.log("Missing required JWT fields");
      return false;
    }

    return true;
  } catch (error) {
    console.log("JWT validation error:", error);
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

  // Hydrate auth session from localStorage on app load.
  useEffect(() => {
    const hydrateAuth = async () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEY_USER);
        const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN);

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

        // Validate token format and expiration
        if (!isValidJWT(storedToken)) {
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
    if (token) {
      persistSession(user, token);
    }
  }, [loading, user]);

  const handleAuthSuccess = useCallback((authUser: User, token: string) => {
    setUser(authUser);
    setError(null);
    persistSession(authUser, token);
    setLoading(false);
  }, []);

  const signIn = useCallback(async (credentials: SignInCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.signIn(credentials);
      handleAuthSuccess(response.user, response.token);
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
      const response = await authService.signUp(payload);
      handleAuthSuccess(response.user, response.token);
    } catch (err) {
      // Sanitize error messages to prevent information leakage
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage.length > 100 ? "Sign up failed. Please try again." : errorMessage);
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
