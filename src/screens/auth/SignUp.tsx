import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthFormField from "../../components/auth/AuthFormField";
import SocialAuthButtons from "../../components/auth/SocialAuthButtons";
import { useAuth } from "../../contexts/AuthContext";
import { validateEmail, validatePassword, validateName, validateConfirmPassword } from "../../utils/validation";
import type { AuthProvider } from "../../store/types";

export default function SignUp(): React.JSX.Element {
  const navigate = useNavigate();
  const { signUp, socialSignIn, loading, error, clearError, isAuthenticated } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [socialProvider, setSocialProvider] = useState<AuthProvider | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    clearError();

    const nameErr = validateName(fullName);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(password, confirmPassword);

    if (nameErr || emailErr || passErr || confirmErr) {
      setFieldErrors({
        fullName: nameErr || undefined,
        email: emailErr || undefined,
        password: passErr || undefined,
        confirmPassword: confirmErr || undefined
      });
      return;
    }
    setFieldErrors({});

    await signUp({ fullName, email, password });
  };

  const handleSocial = async (provider: AuthProvider): Promise<void> => {
    clearError();
    setSocialProvider(provider);
    await socialSignIn(provider);
    setSocialProvider(null);
  };

  // Redirect on success
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <AuthLayout title="Create an account" subtitle="Join EVzone and ride electric">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={{ xs: 1.5, sm: 2 }}>
          {error && (
            <Alert severity="error" sx={{ borderRadius: "var(--evz-radius-md)", fontSize: 13 }}>
              {error}
            </Alert>
          )}

          <AuthFormField
            id="signup-name"
            label="Full name"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            errorText={fieldErrors.fullName}
            disabled={loading}
          />

          <AuthFormField
            id="signup-email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            errorText={fieldErrors.email}
            disabled={loading}
          />

          <AuthFormField
            id="signup-password"
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorText={fieldErrors.password}
            disabled={loading}
          />

          <AuthFormField
            id="signup-confirm"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            errorText={fieldErrors.confirmPassword}
            disabled={loading}
          />

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
              "Create account"
            )}
          </Button>
        </Stack>

        <Box sx={{ mt: { xs: 1.5, sm: 2 } }}>
          <SocialAuthButtons
            onProvider={handleSocial}
            loading={loading}
            disabledProvider={socialProvider}
          />
        </Box>

        <Box sx={{ mt: { xs: 2.1, sm: 3 }, textAlign: "center" }}>
          <Typography variant="body2" sx={{ fontSize: 13, color: (t) => t.palette.text.secondary }}>
            Already have an account?{" "}
            <Typography
              component={RouterLink}
              to="/auth/sign-in"
              variant="body2"
              sx={{
                color: "var(--evz-brand-green)",
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" }
              }}
            >
              Sign in
            </Typography>
          </Typography>
        </Box>
      </Box>
    </AuthLayout>
  );
}
