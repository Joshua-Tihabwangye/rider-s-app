import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, IconButton, InputAdornment, Stack, Typography } from "@mui/material";
import { AlternateEmailRounded, ArrowForwardRounded, LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import AuthFormField from "../../components/auth/AuthFormField";
import SocialAuthButtons from "../../components/auth/SocialAuthButtons";
import { useAuth } from "../../contexts/AuthContext";
import { validateEmail, validatePassword } from "../../utils/validation";
import type { AuthProvider } from "../../store/types";
import { clearAuthPrefillPassword, readAuthPrefill, saveAuthPrefill } from "../../utils/authPrefill";
import RiderAuthShowcaseLayout from "../../components/auth/RiderAuthShowcaseLayout";

export default function SignIn(): React.JSX.Element {
  const navigate = useNavigate();
  const { signIn, socialSignIn, loading, error, clearError } = useAuth();

  const prefill = React.useMemo(() => readAuthPrefill(), []);
  const [email, setEmail] = useState(prefill.email || prefill.identity || "");
  const [password, setPassword] = useState(prefill.password || "");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [socialProvider, setSocialProvider] = useState<AuthProvider | null>(null);

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

    const normalizedEmail = email.trim().toLowerCase();
    await signIn({ email: normalizedEmail, password });
    saveAuthPrefill({ email: normalizedEmail, identity: normalizedEmail });
    clearAuthPrefillPassword();
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
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <RiderAuthShowcaseLayout
      title={
        <>
          Welcome <Box component="span" sx={{ color: "var(--evz-brand-green)" }}>back</Box>
        </>
      }
      subtitle="Sign in to book rides, track trips, and manage your account."
      promptText="Don’t have an account?"
      promptActionLabel="Sign up"
      promptActionTo="/auth/sign-up"
      promptActionColor="var(--evz-brand-orange)"
      footerText="Safe, secure, and cashless rides."
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={{ xs: 0.92, sm: 1.1 }}>
          {error && (
            <Alert severity="error" sx={{ borderRadius: "16px", fontSize: 12.5 }}>
              {error}
            </Alert>
          )}

          <AuthFormField
            id="signin-email"
            placeholder="Email address"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            errorText={fieldErrors.email}
            disabled={loading}
            inputProps={{ "aria-label": "Email address" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AlternateEmailRounded sx={{ fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          <AuthFormField
            id="signin-password"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorText={fieldErrors.password}
            disabled={loading}
            inputProps={{ "aria-label": "Password" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    edge="end"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={loading}
                    sx={{ color: "rgba(107,114,128,0.88)" }}
                  >
                    {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ textAlign: "right" }}>
            <Typography
              component={RouterLink}
              to="/auth/forgot-password"
              variant="caption"
              sx={{
                color: "var(--evz-brand-green)",
                fontSize: 12,
                fontWeight: 700,
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
              position: "relative",
              py: 1.05,
              fontSize: 13.25,
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "16px",
              background: "linear-gradient(90deg, var(--evz-brand-green) 0%, var(--evz-brand-orange) 100%)",
              color: "#fff",
              boxShadow: "0 10px 20px rgba(247,127,0,0.14)",
              "&:hover": {
                background: "linear-gradient(90deg, var(--evz-brand-green-hover) 0%, var(--evz-brand-orange-hover) 100%)"
              }
            }}
          >
            {loading && !socialProvider ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              <>
                Sign In
                <Box
                  component="span"
                  sx={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    border: "1.5px solid rgba(255,255,255,0.42)",
                    bgcolor: "rgba(255,255,255,0.08)",
                  }}
                >
                  <ArrowForwardRounded sx={{ fontSize: 15 }} />
                </Box>
              </>
            )}
          </Button>
        </Stack>

        <Box sx={{ mt: { xs: 0.85, sm: 1.05 } }}>
          <SocialAuthButtons
            onProvider={handleSocial}
            loading={loading}
            disabledProvider={socialProvider}
          />
        </Box>
      </Box>
    </RiderAuthShowcaseLayout>
  );
}
