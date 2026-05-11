import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Alert, CircularProgress } from "@mui/material";
import AuthLayout from "../../components/auth/AuthLayout";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from "../../contexts/AuthContext";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword, loading, error, clearError } = useAuth();

  const flowState = (location.state as { identity?: string; otp?: string } | null) || null;
  const identity = flowState?.identity?.trim() || "";
  const otp = flowState?.otp?.trim() || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      password.trim().length > 0 &&
      confirmPassword.trim().length > 0 &&
      password === confirmPassword
    );
  }, [confirmPassword, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setFormError("Passwords must match.");
      return;
    }
    if (!identity) {
      setFormError("Reset session expired. Start again from forgot password.");
      return;
    }
    setIsSubmitting(true);
    setFormError("");
    clearError();

    try {
      const result = await resetPassword(identity, otp, password);
      if (!result.reset) {
        setFormError("Password reset was not completed. Try again.");
        setIsSubmitting(false);
        return;
      }
      navigate("/auth/sign-in", { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Password reset failed.";
      setFormError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create new password" subtitle="Set a new password for your account">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 2 }}>
          {formError && <Alert severity="error" sx={{ borderRadius: "12px", fontSize: 13 }}>{formError}</Alert>}
          <TextField
            label="New password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            InputProps={{
              startAdornment: <LockOutlinedIcon sx={{ color: "action.active", mr: 1 }} />,
            }}
          />
          <TextField
            label="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            fullWidth
            InputProps={{
              startAdornment: <LockOutlinedIcon sx={{ color: "action.active", mr: 1 }} />,
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting || !canSubmit}
            sx={{
              py: 1.5,
              fontSize: 14,
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "12px",
              bgcolor: "#03cd8c",
              color: "#fff",
              "&:hover": { bgcolor: "#02ba7f" },
            }}
          >
            {isSubmitting ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Reset password"}
          </Button>
        </Box>
      </Box>
    </AuthLayout>
  );
}
