import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  Radio
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import MobileShell from "../components/MobileShell";

interface MapBackgroundProps {
  onBackClick?: () => void;
}

// Map background component with route visualization
function MapBackground({ onBackClick }: MapBackgroundProps): React.JSX.Element {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "40vh",
        background: theme.palette.mode === "light"
          ? "#F5F5DC" // Light beige map background
          : "linear-gradient(135deg, #0f1e2e 0%, #1a2d3e 50%, #0f1e2e 100%)",
        zIndex: 0,
        overflow: "hidden"
      }}
    >
      {/* Water body on the right */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "5%",
          width: "30%",
          height: "40%",
          bgcolor: "rgba(3,205,140,0.15)", // Light green background
          borderRadius: "50%",
          opacity: 0.6
        }}
      />
      
      {/* Route line - diagonal from bottom-left to top-right */}
      <Box
        sx={{
          position: "absolute",
          top: "60%",
          left: "15%",
          width: "70%",
          height: 3,
          bgcolor: "#424242", // Dark grey route line
          borderRadius: 2,
          transform: "rotate(-25deg)",
          transformOrigin: "left center",
          zIndex: 1
        }}
      />
      
      {/* Start marker (green) - positioned at start of route */}
      <Box
        sx={{
          position: "absolute",
          top: "58%",
          left: "18%",
          width: 18,
          height: 18,
          borderRadius: "50%",
          bgcolor: "#4CAF50",
          border: "3px solid #FFFFFF",
          boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
          zIndex: 2,
          transform: "translate(-50%, -50%)"
        }}
      />
      
      {/* Destination marker (red) - positioned at end of route */}
      <Box
        sx={{
          position: "absolute",
          top: "42%",
          left: "82%",
          width: 18,
          height: 18,
          borderRadius: "50%",
          bgcolor: "#F44336",
          border: "3px solid #FFFFFF",
          boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
          zIndex: 2,
          transform: "translate(-50%, -50%)"
        }}
      />
      
      {/* Route info label */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "22%",
          bgcolor: "rgba(0,0,0,0.7)",
          borderRadius: 1.5,
          px: 1.2,
          py: 0.6,
          zIndex: 2,
          transform: "translateX(-50%)"
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: 10,
            fontWeight: 600,
            color: "#FFFFFF",
            whiteSpace: "nowrap"
          }}
        >
          41.5 km • 1 hr
        </Typography>
      </Box>
    </Box>
  );
}

// Simplified payment methods as per spec
const PAYMENT_METHODS = [
  {
    id: "wallet",
    name: "EVzone Pay",
    icon: <AccountBalanceWalletRoundedIcon sx={{ fontSize: 24 }} />
  },
  {
    id: "cash",
    name: "Cash Payment",
    icon: <PaymentsRoundedIcon sx={{ fontSize: 24 }} />
  }
];

interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  icon: React.ReactElement;
}

interface PaymentMethodCardProps {
  method: PaymentMethod;
  selected: string;
  onSelect: (id: string) => void;
}

function PaymentMethodCard({ method, selected, onSelect }: PaymentMethodCardProps): React.JSX.Element {
  const theme = useTheme();
  const isActive = selected === method.id;
  
  return (
    <Card
      elevation={0}
      onClick={() => onSelect(method.id)}
      sx={{
        mb: 1.5,
        borderRadius: 2,
        cursor: "pointer",
        transition: "all 0.15s ease",
        bgcolor: theme.palette.mode === "light"
          ? "#FFFFFF"
          : "rgba(15,23,42,0.98)",
        border: isActive
          ? "1px solid #03CD8C"
          : theme.palette.mode === "light"
          ? "1px solid rgba(209,213,219,0.9)"
          : "1px solid rgba(51,65,85,0.9)"
      }}
    >
      <CardContent sx={{ px: 2, py: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 999,
                bgcolor: theme.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {method.icon}
            </Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, fontSize: 14 }}
            >
              {method.name}
            </Typography>
          </Box>
          <Radio
            checked={isActive}
            value={method.id}
            sx={{
              color: theme.palette.mode === "light" ? "#9E9E9E" : "#616161",
              "&.Mui-checked": {
                color: "#03CD8C"
              }
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

function PaymentMethodSelectionScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const fromSelectRide = location.state?.fromSelectRide || false;
  const rideData = location.state || {};
  
  // Default to EVzone Pay (wallet) as per spec
  const [selected, setSelected] = useState("wallet");
  
  // Get fare from ride data or use default
  const fare = rideData.fare || "UGX 40,365";
  
  const handleConfirm = () => {
    if (fromSelectRide) {
      // Navigate back to RA20 with selected payment method
      navigate("/rides/options", {
        state: {
          ...rideData,
          paymentMethod: selected,
          paymentMethodName: PAYMENT_METHODS.find(pm => pm.id === selected)?.name || "Cash Payment"
        }
      });
    } else {
      // Normal flow - proceed to driver matching (RA22)
      navigate("/rides/searching", {
        state: {
          ...rideData,
          paymentMethod: selected
        }
      });
    }
  };
  
  const contentBg = theme.palette.mode === "light" 
    ? "#FFFFFF" 
    : theme.palette.background.paper || "rgba(15,23,42,0.98)";
  
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        overflow: "hidden"
      }}
    >
      {/* Map Background */}
      <MapBackground onBackClick={() => navigate(-1)} />
      
      {/* Content Panel - slides up from bottom */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: "calc(64px + env(safe-area-inset-bottom))", sm: "64px" },
          left: 0,
          right: 0,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          bgcolor: contentBg,
          maxHeight: { xs: 'calc(100vh - 40vh - 64px - env(safe-area-inset-bottom))', sm: 'calc(100vh - 40vh - 64px)' },
          overflow: "auto",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
          zIndex: 1
        }}
      >
        <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
          {/* Header with Title and Fare Summary */}
          <Box
            sx={{
              mb: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <IconButton
                size="small"
                aria-label="Back"
                onClick={() => navigate(-1)}
                sx={{
                  borderRadius: 999,
                  bgcolor: theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
                  border: theme.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)"
                }}
              >
                <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                Payment method
              </Typography>
            </Box>
            
            {/* Fare Summary on the right */}
            <Box sx={{ textAlign: "right" }}>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: theme.palette.text.secondary, display: "block" }}
              >
                Total Amount
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, letterSpacing: "-0.02em", fontSize: 18 }}
              >
                {fare}
              </Typography>
            </Box>
          </Box>
          
          {/* Payment Options */}
          <Box sx={{ mb: 2.5 }}>
            {PAYMENT_METHODS.map((pm) => (
              <PaymentMethodCard
                key={pm.id}
                method={pm}
                selected={selected}
                onSelect={setSelected}
              />
            ))}
          </Box>
          
          {/* Manage Payment Methods Link */}
          <Box sx={{ mb: 2.5, textAlign: "center" }}>
            <Button
              variant="text"
              onClick={() => navigate("/wallet")}
              sx={{
                textTransform: "none",
                fontSize: 13,
                color: theme.palette.text.secondary,
                "&:hover": {
                  bgcolor: "transparent",
                  color: theme.palette.text.primary
                }
              }}
            >
              Manage payment methods
            </Button>
          </Box>
          
          {/* Confirm Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleConfirm}
            disabled={!selected}
            sx={{
              borderRadius: 999,
              py: 1.4,
              fontSize: 15,
              fontWeight: 600,
              textTransform: "none",
              bgcolor: selected ? "#000000" : "rgba(0,0,0,0.3)", // Black button
              color: "#FFFFFF",
              "&:hover": {
                bgcolor: selected ? "#1a1a1a" : "rgba(0,0,0,0.3)"
              },
              "&.Mui-disabled": {
                bgcolor: "rgba(0,0,0,0.3)",
                color: "rgba(255,255,255,0.5)"
              }
            }}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default function RiderScreen21PaymentMethodSelectionCanvas_v2() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (theme) => theme.palette.background.default
      }}
    >
      <DarkModeToggle />
      <MobileShell>
        <PaymentMethodSelectionScreen />
      </MobileShell>
    </Box>
  );
}
