import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, IconButton, InputAdornment, Stack, Typography } from "@mui/material";
import {
  AlternateEmailRounded,
  ArrowForwardRounded,
  LockOutlined,
  PersonOutlineRounded,
  PhoneIphoneRounded,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import AuthFormField from "../../components/auth/AuthFormField";
import SocialAuthButtons from "../../components/auth/SocialAuthButtons";
import { useAuth } from "../../contexts/AuthContext";
import { validateEmail, validatePassword, validateName, validateConfirmPassword, validatePhone } from "../../utils/validation";
import type { AuthProvider } from "../../store/types";
import { saveAuthPrefill } from "../../utils/authPrefill";
import RiderAuthShowcaseLayout from "../../components/auth/RiderAuthShowcaseLayout";

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
    <RiderAuthShowcaseLayout
      title={
        <>
          Create your <Box component="span" sx={{ color: "var(--evz-brand-green)" }}>account</Box>
        </>
      }
      subtitle={
        <>
          Join <Box component="span" sx={{ color: "var(--evz-brand-green)", fontWeight: 600 }}>EVzone</Box>{" "}
          <Box component="span" sx={{ color: "var(--evz-brand-orange)", fontWeight: 600 }}>Rides</Box> for smarter,
          safer city travel.
        </>
      }
      promptText="Already have an account?"
      promptActionLabel="Sign in"
      promptActionTo="/auth/sign-in"
      promptActionColor="var(--evz-brand-green)"
      footerText="Book in seconds, ride with confidence."
      titleBlockMarginTop={-0.35}
      subtitleMarginTop={0.18}
      childrenMarginTop={0.62}
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={{ xs: 0.58, sm: 0.72 }}>
          {error && (
            <Alert severity="error" sx={{ borderRadius: "16px", fontSize: 12.5 }}>
              {error}
            </Alert>
          )}

          <AuthFormField
            id="signup-name"
            placeholder="Full name"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            errorText={fieldErrors.fullName}
            disabled={loading}
            inputProps={{ "aria-label": "Full name" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineRounded sx={{ fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          <AuthFormField
            id="signup-email"
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
            id="signup-phone"
            placeholder="Phone number"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            errorText={fieldErrors.phone}
            disabled={loading}
            inputProps={{ "aria-label": "Phone number" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIphoneRounded sx={{ fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          <AuthFormField
            id="signup-password"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
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

          <AuthFormField
            id="signup-confirm"
            placeholder="Confirm password"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            errorText={fieldErrors.confirmPassword}
            disabled={loading}
            inputProps={{ "aria-label": "Confirm password" }}
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
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    disabled={loading}
                    sx={{ color: "rgba(107,114,128,0.88)" }}
                  >
                    {showConfirmPassword ? (
                      <VisibilityOff sx={{ fontSize: 20 }} />
                    ) : (
                      <Visibility sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Typography
            sx={{
              px: 0.15,
              pt: 0,
              fontSize: 11,
              lineHeight: 1.2,
              color: "#6b7280",
            }}
          >
            By creating an account, you agree to{" "}
            <Box component="span" sx={{ color: "var(--evz-brand-green)", fontWeight: 600 }}>
              Terms &amp; Conditions
            </Box>{" "}
            and{" "}
            <Box component="span" sx={{ color: "var(--evz-brand-orange)", fontWeight: 600 }}>
              Privacy Policy
            </Box>
            .
          </Typography>

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
                background: "linear-gradient(90deg, var(--evz-brand-green-hover) 0%, var(--evz-brand-orange-hover) 100%)",
              },
            }}
          >
            {loading && !socialProvider ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              <>
                Create Account
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

        <Box sx={{ mt: { xs: 0.58, sm: 0.72 } }}>
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
