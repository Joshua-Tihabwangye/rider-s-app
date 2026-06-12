import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Box } from "@mui/material";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps): React.JSX.Element {
  const { isAuthenticated, hydrated, user } = useAuth();
  const location = useLocation();

  if (!hydrated) {
    return (
      <Box
        aria-hidden
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default"
        }}
      />
    );
  }

  if (!isAuthenticated || user?.role !== "rider") {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
