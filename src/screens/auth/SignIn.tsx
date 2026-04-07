import React, { useState } from "react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthFormField from "../../components/auth/AuthFormField";
import SocialAuthButtons from "../../components/auth/SocialAuthButtons";
import { useAuth } from "../../contexts/AuthContext";
import { validateEmail, validatePassword } from "../../utils/validation";
import type { AuthProvider } from "../../store/types";

export default function SignIn(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, socialSignIn, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [socialProvider, setSocialProvider] = useState<AuthProvider | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/home";

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    clearError();

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    if (emailErr || passErr) {
      setFieldErrors({ email: emailErr || undefined, password: passErr || undefined });
      return;
    }
    setFieldErrors({});

    await signIn({ email, password });
    // Navigation happens in useEffect below only after isAuthenticated changes
  };

  const handleSocial = async (provider: AuthProvider): Promise<void> => {
    clearError();
    setSocialProvider(provider);
    await socialSignIn(provider);
    setSocialProvider(null);
  };

  // Redirect on success
  const { isAuthenticated } = useAuth();
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your EVzone account">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          {error && (
            <Alert severity="error" sx={{ borderRadius: "var(--evz-radius-md)", fontSize: 13 }}>
              {error}
            </Alert>
          )}

          <AuthFormField
            id="signin-email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            errorText={fieldErrors.email}
            disabled={loading}
          />

          <AuthFormField
            id="signin-password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorText={fieldErrors.password}
            disabled={loading}
          />

          <Box sx={{ textAlign: "right" }}>
            <Typography
              component={RouterLink}
              to="/auth/forgot-password"
              variant="caption"
              sx={{
                color: "var(--evz-brand-green)",
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" }
              }}
            >
              Forgot password?
            </Typography>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading && !socialProvider}
            sx={{
              py: 1.25,
              fontSize: 14,
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "var(--evz-radius-md)",
              bgcolor: "var(--evz-brand-green)",
              color: "#fff",
              "&:hover": { bgcolor: "var(--evz-brand-green-hover)" }
            }}
          >
            {loading && !socialProvider ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              "Sign in"
            )}
          </Button>
        </Stack>

        <SocialAuthButtons
          onProvider={handleSocial}
          loading={loading}
          disabledProvider={socialProvider}
        />

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" sx={{ fontSize: 13, color: (t) => t.palette.text.secondary }}>
            Don't have an account?{" "}
            <Typography
              component={RouterLink}
              to="/auth/sign-up"
              variant="body2"
              sx={{
                color: "var(--evz-brand-green)",
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" }
              }}
            >
              Sign up
            </Typography>
          </Typography>
        </Box>
      </Box>
    </AuthLayout>
  );
}
