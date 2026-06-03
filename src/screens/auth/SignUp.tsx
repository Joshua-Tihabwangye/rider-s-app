import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, IconButton, InputAdornment, Stack, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthFormField from "../../components/auth/AuthFormField";
import SocialAuthButtons from "../../components/auth/SocialAuthButtons";
import { useAuth } from "../../contexts/AuthContext";
import { validateEmail, validatePassword, validateName, validateConfirmPassword, validatePhone } from "../../utils/validation";
import type { AuthProvider } from "../../store/types";
import { saveAuthPrefill } from "../../utils/authPrefill";

export default function SignUp(): React.JSX.Element {
  const navigate = useNavigate();
  const { signUp, socialSignIn, loading, error, clearError, isAuthenticated } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [socialProvider, setSocialProvider] = useState<AuthProvider | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    clearError();

    const nameErr = validateName(fullName);
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(password, confirmPassword);

    if (nameErr || emailErr || phoneErr || passErr || confirmErr) {
      setFieldErrors({
        fullName: nameErr || undefined,
        email: emailErr || undefined,
        phone: phoneErr || undefined,
        password: passErr || undefined,
        confirmPassword: confirmErr || undefined,
      });
      return;
    }
    setFieldErrors({});

    try {
      const normalizedEmail = email.trim().toLowerCase();
      await signUp({ fullName, email: normalizedEmail, phone, password, preferredCurrency: "UGX" });
      saveAuthPrefill({ email: normalizedEmail, password, identity: normalizedEmail });
      navigate("/auth/sign-in", { replace: true });
    } catch {
      // Error message is already set by AuthContext
    }
  };

  const handleSocial = async (provider: AuthProvider): Promise<void> => {
    clearError();
    setSocialProvider(provider);
    await socialSignIn(provider);
    setSocialProvider(null);
  };

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
            id="signup-phone"
            label="Phone number"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            errorText={fieldErrors.phone}
            disabled={loading}
          />

          <AuthFormField
            id="signup-password"
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorText={fieldErrors.password}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    edge="end"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <AuthFormField
            id="signup-confirm"
            label="Confirm password"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            errorText={fieldErrors.confirmPassword}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    edge="end"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
              "&:hover": { bgcolor: "var(--evz-brand-green-hover)" },
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
                "&:hover": { textDecoration: "underline" },
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
