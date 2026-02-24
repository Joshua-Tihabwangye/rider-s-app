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
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Alert,
  Snackbar,
  Avatar
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import PhoneAndroidRoundedIcon from "@mui/icons-material/PhoneAndroidRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import StraightenRoundedIcon from "@mui/icons-material/StraightenRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import TwoWheelerRoundedIcon from "@mui/icons-material/TwoWheelerRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import MobileShell from "../components/MobileShell";

interface MapBackgroundProps {
  onBackClick?: () => void;
  pickup?: string;
  destination?: string;
  distance?: string;
  estimatedTime?: string;
}

// Map background component with route visualization
function MapBackground({ onBackClick, pickup, destination, distance, estimatedTime }: MapBackgroundProps): React.JSX.Element {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "35vh",
        background: theme.palette.mode === "light"
          ? "#F5F5DC"
          : "linear-gradient(135deg, #0f1e2e 0%, #1a2d3e 50%, #0f1e2e 100%)",
        zIndex: 0,
        overflow: "hidden"
      }}
    >
      {/* Grid overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.15,
          backgroundImage:
            "linear-gradient(to right, rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.3) 1px, transparent 1px)",
          backgroundSize: "30px 30px"
        }}
      />

      {/* Water body on the right */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "5%",
          width: "30%",
          height: "40%",
          bgcolor: "rgba(3,205,140,0.15)",
          borderRadius: "50%",
          opacity: 0.6
        }}
      />
      
      {/* Route line */}
      <Box
        sx={{
          position: "absolute",
          top: "60%",
          left: "15%",
          width: "70%",
          height: 3,
          bgcolor: "#424242",
          borderRadius: 2,
          transform: "rotate(-25deg)",
          transformOrigin: "left center",
          zIndex: 1
        }}
      />
      
      {/* Start marker (green) */}
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
      
      {/* Destination marker (orange) */}
      <Box
        sx={{
          position: "absolute",
          top: "42%",
          left: "82%",
          width: 18,
          height: 18,
          borderRadius: "50%",
          bgcolor: "#FF9800",
          border: "3px solid #FFFFFF",
          boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
          zIndex: 2,
          transform: "translate(-50%, -50%)"
        }}
      />
      
      {/* Route info badge */}
      {distance && estimatedTime && (
        <Box
          sx={{
            position: "absolute",
            top: "48%",
            left: "50%",
            bgcolor: "rgba(0,0,0,0.75)",
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            zIndex: 3,
            transform: "translate(-50%, -50%)",
            display: "flex",
            alignItems: "center",
            gap: 1
          }}
        >
          <StraightenRoundedIcon sx={{ fontSize: 14, color: "#FFFFFF" }} />
          <Typography
            variant="caption"
            sx={{ fontSize: 11, fontWeight: 600, color: "#FFFFFF", whiteSpace: "nowrap" }}
          >
            {distance}
          </Typography>
          <AccessTimeRoundedIcon sx={{ fontSize: 14, color: "#FFFFFF" }} />
          <Typography
            variant="caption"
            sx={{ fontSize: 11, fontWeight: 600, color: "#FFFFFF", whiteSpace: "nowrap" }}
          >
            {estimatedTime}
          </Typography>
        </Box>
      )}

      {/* Origin label */}
      {pickup && (
        <Box
          sx={{
            position: "absolute",
            top: "68%",
            left: "18%",
            bgcolor: "rgba(0,0,0,0.7)",
            borderRadius: 1,
            px: 1,
            py: 0.3,
            zIndex: 2,
            transform: "translateX(-50%)",
            maxWidth: 120
          }}
        >
          <Typography variant="caption" sx={{ fontSize: 9, color: "#FFFFFF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
            {pickup}
          </Typography>
        </Box>
      )}

      {/* Destination label */}
      {destination && (
        <Box
          sx={{
            position: "absolute",
            top: "30%",
            left: "82%",
            bgcolor: "rgba(0,0,0,0.7)",
            borderRadius: 1,
            px: 1,
            py: 0.3,
            zIndex: 2,
            transform: "translateX(-50%)",
            maxWidth: 120
          }}
        >
          <Typography variant="caption" sx={{ fontSize: 9, color: "#FFFFFF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
            {destination}
          </Typography>
        </Box>
      )}

      {/* Back button */}
      {onBackClick && (
        <IconButton
          size="small"
          aria-label="Back"
          onClick={onBackClick}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            bgcolor: theme.palette.mode === "light"
              ? "rgba(255,255,255,0.9)"
              : "rgba(255,255,255,0.25)",
            color: theme.palette.mode === "light" ? "#000000" : "#FFFFFF",
            zIndex: 10,
            width: 40,
            height: 40,
            "&:hover": {
              bgcolor: theme.palette.mode === "light"
                ? "#FFFFFF"
                : "rgba(255,255,255,0.35)"
            }
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      )}
    </Box>
  );
}

// All payment methods matching the wallet options
const PAYMENT_METHODS = [
  {
    id: "wallet",
    name: "EVzone Wallet",
    description: "Balance: UGX 520,000",
    icon: <AccountBalanceWalletRoundedIcon sx={{ fontSize: 24, color: "#047857" }} />
  },
  {
    id: "mobile",
    name: "Mobile Money",
    description: "MTN / Airtel Money",
    icon: <PhoneAndroidRoundedIcon sx={{ fontSize: 24, color: "#FF9800" }} />
  },
  {
    id: "card",
    name: "Credit / Debit Card",
    description: "Visa, MasterCard",
    icon: <CreditCardRoundedIcon sx={{ fontSize: 24, color: "#1976D2" }} />
  },
  {
    id: "cash",
    name: "Cash Payment",
    description: "Pay driver/rider directly",
    icon: <PaymentsRoundedIcon sx={{ fontSize: 24, color: "#4CAF50" }} />
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
          ? "2px solid #03CD8C"
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
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, fontSize: 14 }}
              >
                {method.name}
              </Typography>
              {method.description && (
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: theme.palette.text.secondary, display: "block" }}
                >
                  {method.description}
                </Typography>
              )}
            </Box>
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
  const rideData = location.state || {};
  
  // Default to EVzone Wallet as per spec
  const [selected, setSelected] = useState("wallet");
  const [showCashDialog, setShowCashDialog] = useState(false);
  const [showCashConfirmation, setShowCashConfirmation] = useState(false);
  
  // Get trip info from ride data
  const fare = rideData.fare || "UGX 40,365";
  const pickup = rideData.pickup || rideData.rideDetails?.origin?.name || "Current location";
  const destination = rideData.destination || rideData.rideDetails?.destination?.name || "Destination";
  const distance = rideData.distance || rideData.rideDetails?.distance || "41.5 km";
  const estimatedTime = rideData.estimatedTime || rideData.rideDetails?.estimatedTime || "1 hr";
  const driver = rideData.driver || rideData.rideDetails?.driver || {};
  const vehicleType = rideData.vehicleType || (rideData.selectedRide === "scooter" ? "motorbike" : "car");
  const isMotorbike = vehicleType === "motorbike";
  const driverLabel = isMotorbike ? "Rider" : "Driver";

  const handleConfirm = () => {
    if (selected === "cash") {
      // Cash payment: show confirmation dialog, record amount, but don't process
      setShowCashDialog(true);
      return;
    }

    // For all other payment methods, navigate to the PaymentGateway simulation
    const paymentMethodMap: Record<string, string> = {
      wallet: "wallet",
      mobile: "mobile",
      card: "card"
    };

    navigate("/payment/process", {
      state: {
        paymentMethod: paymentMethodMap[selected] || "wallet",
        amount: fare,
        description: `EV Ride – ${pickup} → ${destination}`,
        returnPath: "/rides/booking/confirmation",
        cancelPath: "/rides/payment",
        serviceName: "Ride",
        extraData: {
          ...rideData,
          paymentMethod: selected,
          paymentMethodName: PAYMENT_METHODS.find(pm => pm.id === selected)?.name || "EVzone Wallet"
        }
      }
    });
  };

  const handleCashConfirm = () => {
    setShowCashDialog(false);
    setShowCashConfirmation(true);

    // Record cash amount in analytics (simulated with console log)
    console.log("[Analytics] Cash payment recorded:", {
      amount: fare,
      pickup,
      destination,
      driver: driver.name || "N/A",
      timestamp: new Date().toISOString(),
      paymentMethod: "cash"
    });

    // After brief confirmation display, navigate to booking confirmation
    setTimeout(() => {
      navigate("/rides/booking/confirmation", {
        state: {
          ...rideData,
          paymentMethod: "cash",
          paymentMethodName: "Cash Payment",
          paymentSuccess: true,
          cashPayment: true,
          cashRecorded: true,
          txnId: `CASH-${Date.now()}`
        }
      });
    }, 2000);
  };

  const handleCashCancel = () => {
    setShowCashDialog(false);
  };
  
  const contentBg = theme.palette.mode === "light" 
    ? "#FFFFFF" 
    : theme.palette.background.paper || "rgba(15,23,42,0.98)";
  const accentGreen = "#03CD8C";
  
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
      <MapBackground
        onBackClick={() => navigate(-1)}
        pickup={pickup}
        destination={destination}
        distance={distance}
        estimatedTime={estimatedTime}
      />
      
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
          maxHeight: { xs: 'calc(100vh - 35vh - 64px - env(safe-area-inset-bottom))', sm: 'calc(100vh - 35vh - 64px)' },
          overflow: "auto",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
          zIndex: 1
        }}
      >
        <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
          {/* Header with Title and Fare Summary */}
          <Box
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Choose Payment Method
            </Typography>
            
            {/* Fare Summary on the right */}
            <Box sx={{ textAlign: "right" }}>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: theme.palette.text.secondary, display: "block" }}
              >
                Total Fare
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, letterSpacing: "-0.02em", fontSize: 18, color: accentGreen }}
              >
                {fare}
              </Typography>
            </Box>
          </Box>

          {/* Driver info mini card */}
          {driver.name && (
            <Card
              elevation={0}
              sx={{
                mb: 2,
                borderRadius: 2,
                bgcolor: theme.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.5)",
                border: theme.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.5)"
                  : "1px solid rgba(51,65,85,0.5)"
              }}
            >
              <CardContent sx={{ px: 2, py: 1.2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: accentGreen,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#FFFFFF"
                    }}
                  >
                    {driver.photo || "D"}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                      {driver.name} • {driverLabel}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      {isMotorbike ? (
                        <TwoWheelerRoundedIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
                      ) : (
                        <DirectionsCarRoundedIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
                      )}
                      <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary }}>
                        {driver.vehicle || (isMotorbike ? "EV Scooter" : "EV Car")} – {driver.licensePlate || "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
          
          {/* Payment Options */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: theme.palette.text.secondary, mb: 1.5, display: "block" }}
            >
              Available Payment Options
            </Typography>
            {PAYMENT_METHODS.map((pm) => (
              <PaymentMethodCard
                key={pm.id}
                method={pm}
                selected={selected}
                onSelect={setSelected}
              />
            ))}
          </Box>

          {/* Cash payment info */}
          {selected === "cash" && (
            <Alert
              severity="info"
              sx={{
                mb: 2,
                borderRadius: 2,
                "& .MuiAlert-icon": { color: "#FF9800" },
                bgcolor: theme.palette.mode === "light" ? "#FFF3E0" : "rgba(255,152,0,0.1)",
                border: "1px solid rgba(255,152,0,0.3)"
              }}
            >
              <Typography variant="caption" sx={{ fontSize: 12 }}>
                With cash payment, you pay <strong>{fare}</strong> directly to the {driverLabel.toLowerCase()} at the end of your trip. The amount will be recorded for your trip history.
              </Typography>
            </Alert>
          )}
          
          {/* Manage Payment Methods Link */}
          <Box sx={{ mb: 2, textAlign: "center" }}>
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
              bgcolor: selected ? accentGreen : "rgba(3,205,140,0.3)",
              color: "#FFFFFF",
              "&:hover": {
                bgcolor: selected ? "#22C55E" : "rgba(3,205,140,0.3)"
              },
              "&.Mui-disabled": {
                bgcolor: "rgba(3,205,140,0.3)",
                color: "rgba(255,255,255,0.5)"
              }
            }}
          >
            {selected === "cash" ? "Confirm Cash Payment" : "Pay Now"}
          </Button>
        </Box>
      </Box>

      {/* Cash Payment Confirmation Dialog */}
      <Dialog
        open={showCashDialog}
        onClose={handleCashCancel}
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: contentBg,
            maxWidth: 380
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
          Cash Payment
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
            You will pay <strong>{fare}</strong> in cash directly to your {driverLabel.toLowerCase()} at the end of your trip.
          </Typography>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              bgcolor: theme.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.5)",
              border: theme.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.5)"
                : "1px solid rgba(51,65,85,0.5)"
            }}
          >
            <CardContent sx={{ px: 2, py: 1.5 }}>
              <Stack spacing={0.8}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" sx={{ fontSize: 12, color: theme.palette.text.secondary }}>Route</Typography>
                  <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 500 }}>{pickup} → {destination}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" sx={{ fontSize: 12, color: theme.palette.text.secondary }}>Distance</Typography>
                  <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 500 }}>{distance}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" sx={{ fontSize: 12, color: theme.palette.text.secondary }}>Amount</Typography>
                  <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 700, color: accentGreen }}>{fare}</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
          <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary, mt: 1.5, display: "block" }}>
            This amount will be recorded in the system for analytics and record-keeping. No digital payment will be processed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button
            onClick={handleCashCancel}
            sx={{ textTransform: "none", color: theme.palette.text.secondary }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCashConfirm}
            variant="contained"
            sx={{
              textTransform: "none",
              bgcolor: accentGreen,
              "&:hover": { bgcolor: "#22C55E" }
            }}
          >
            Confirm Cash
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cash recorded snackbar */}
      <Snackbar
        open={showCashConfirmation}
        autoHideDuration={2000}
        onClose={() => setShowCashConfirmation(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
          icon={<CheckCircleRoundedIcon />}
          sx={{ borderRadius: 2 }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Cash payment of {fare} recorded successfully!
          </Typography>
        </Alert>
      </Snackbar>
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
