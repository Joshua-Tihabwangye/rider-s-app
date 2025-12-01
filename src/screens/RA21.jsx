import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Divider
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MobileShell from "../components/MobileShell";

const PAYMENT_METHODS = [
  {
    id: "wallet",
    type: "Wallet",
    name: "EVzone Wallet",
    icon: <AccountBalanceWalletRoundedIcon sx={{ fontSize: 22 }} />,
    line1: "Balance: UGX 52,300",
    line2: "Use wallet first",
    tag: "Recommended"
  },
  {
    id: "card",
    type: "Card",
    name: "Visa •••• 4242",
    icon: <CreditCardRoundedIcon sx={{ fontSize: 22 }} />,
    line1: "Expires 08/28",
    line2: "Tap to change or add new",
    tag: "Saved card"
  },
  {
    id: "mobile",
    type: "Mobile money",
    name: "MTN / Airtel Mobile Money",
    icon: <SmartphoneRoundedIcon sx={{ fontSize: 22 }} />,
    line1: "Enter number at checkout",
    line2: "Carrier fees may apply",
    tag: null
  },
  {
    id: "cash",
    type: "Cash",
    name: "Cash (where allowed)",
    icon: <PaymentsRoundedIcon sx={{ fontSize: 22 }} />,
    line1: "Pay driver in cash",
    line2: "Subject to city rules",
    tag: "Limited availability"
  }
];

function PaymentMethodCard({ method, selected, onSelect }) {
  const isActive = selected === method.id;
  return (
    <Card
      elevation={0}
      onClick={() => onSelect(method.id)}
      sx={{
        mb: 1.75,
        borderRadius: 2,
        cursor: "pointer",
        transition: "all 0.15s ease",
        bgcolor: (theme) =>
          theme.palette.mode === "light"
            ? isActive
              ? "#ECFDF5"
              : "#FFFFFF"
            : isActive
            ? "rgba(15,118,110,0.32)"
            : "rgba(15,23,42,0.98)",
        border: (theme) =>
          isActive
            ? "1px solid #03CD8C"
            : theme.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)"
      }}
    >
      <CardContent sx={{ px: 1.75, py: 1.6 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 999,
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {method.icon}
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                {method.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
              >
                {method.line1}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 10.5, color: (theme) => theme.palette.text.secondary }}
              >
                {method.line2}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            {method.tag && (
              <Chip
                label={method.tag}
                size="small"
                sx={{
                  borderRadius: 999,
                  fontSize: 10,
                  height: 22,
                  bgcolor: isActive ? "primary.main" : "rgba(59,130,246,0.12)",
                  color: isActive ? "#020617" : "#1D4ED8"
                }}
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function PaymentMethodSelectionScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("wallet");

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
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
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
              border: (theme) =>
                theme.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Choose how you’ll pay
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              Secure payments powered by EVzone Pay
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Amount summary */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
              >
                Estimated fare
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                UGX 14,500
              </Typography>
            </Box>
            <Chip
              label="EV ride • 0g CO₂"
              size="small"
              sx={{
                borderRadius: 999,
                fontSize: 10,
                height: 24,
                bgcolor: "rgba(34,197,94,0.1)",
                color: "#16A34A"
              }}
            />
          </Box>
          <Divider
            sx={{ my: 1.2, borderColor: (theme) => theme.palette.divider }}
          />
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
          >
            Final fare may change slightly based on route and waiting time.
          </Typography>
        </CardContent>
      </Card>

      {/* Payment list */}
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

      {/* Extra actions */}
      <Stack direction="row" spacing={1.25} sx={{ mb: 1.5 }}>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            borderRadius: 999,
            py: 0.9,
            fontSize: 13,
            textTransform: "none"
          }}
        >
          Add new card
        </Button>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            borderRadius: 999,
            py: 0.9,
            fontSize: 13,
            textTransform: "none"
          }}
        >
          Manage methods
        </Button>
      </Stack>

      <Box
        sx={{
          mb: 1.5,
          display: "flex",
          alignItems: "flex-start",
          gap: 1
        }}
      >
        <InfoOutlinedIcon
          sx={{ fontSize: 18, color: (theme) => theme.palette.text.secondary }}
        />
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
        >
          We never share your full card details with drivers. For mobile money,
          you may see a pop-up from your provider to confirm payment.
        </Typography>
      </Box>

      <Button
        fullWidth
        variant="contained"
        sx={{
          borderRadius: 999,
          py: 1.1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: "primary.main",
          color: "#020617",
          "&:hover": { bgcolor: "#06e29a" }
        }}
      >
        Confirm payment method
      </Button>
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
