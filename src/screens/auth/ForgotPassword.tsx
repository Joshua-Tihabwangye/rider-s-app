import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthFormField from "../../components/auth/AuthFormField";
import { useAuth } from "../../contexts/AuthContext";
import { validateEmail } from "../../utils/validation";

export default function ForgotPassword(): React.JSX.Element {
  const { forgotPassword, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    clearError();
    setSuccessMessage("");

    const err = validateEmail(email);
    if (err) {
      setEmailError(err);
      return;
    }
    setEmailError("");

    try {
      const message = await forgotPassword(email);
      setSuccessMessage(message);
    } catch {
      // Error is handled by the auth context
    }
  };

  return (
    <AuthLayout title="Reset password" subtitle="We'll send you a link to reset your password">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={{ xs: 1.6, sm: 2 }}>
          {error && (
            <Alert severity="error" sx={{ borderRadius: "var(--evz-radius-md)", fontSize: 13 }}>
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert
              severity="success"
              icon={<CheckCircleRoundedIcon sx={{ fontSize: 20 }} />}
              sx={{ borderRadius: "var(--evz-radius-md)", fontSize: 13 }}
            >
              {successMessage}
            </Alert>
          )}

          <AuthFormField
            id="forgot-email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            errorText={emailError}
            disabled={loading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
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
            {loading ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              "Send reset link"
            )}
          </Button>
        </Stack>

        <Box sx={{ mt: { xs: 2.25, sm: 3 }, textAlign: "center" }}>
          <Typography variant="body2" sx={{ fontSize: 13, color: (t) => t.palette.text.secondary }}>
            Remember your password?{" "}
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
