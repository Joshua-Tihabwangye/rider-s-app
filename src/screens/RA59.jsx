import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  Button
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PersonPinCircleRoundedIcon from "@mui/icons-material/PersonPinCircleRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import NotesRoundedIcon from "@mui/icons-material/NotesRounded";
import MobileShell from "../components/MobileShell";
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: { main: "#03CD8C" },
    secondary: { main: "#F77F00" },
    ...(mode === "light"
      ? {
          background: { default: "#F3F4F6", paper: "#FFFFFF" },
          text: { primary: "#0F172A", secondary: "#6B7280" },
          divider: "rgba(148,163,184,0.4)"
        }
      : {
          background: { default: "#020617", paper: "#020617" },
          text: { primary: "#F9FAFB", secondary: "#A6A6A6" },
          divider: "rgba(148,163,184,0.24)"
        })
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    button: { textTransform: "none", fontWeight: 600 },
    h6: { fontWeight: 600 }
  }
});

function OrderDeliveryAddressParcelSetupScreen() {
  const navigate = useNavigate();
  const [fromAddress, setFromAddress] = useState("Nsambya Road 472, Kampala");
  const [toAddress, setToAddress] = useState("");
  const [parcelType, setParcelType] = useState("documents");
  const [parcelSize, setParcelSize] = useState("small");
  const [instructions, setInstructions] = useState("");

  const canContinue = fromAddress.trim() && toAddress.trim() && parcelType && parcelSize;

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2,
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
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
              border: (t) =>
                t.palette.mode === "light"
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
              Order a delivery
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Set pickup & drop-off, then describe your parcel
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* From / To addresses */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.5, display: "block" }}
          >
            From (pickup)
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={fromAddress}
            onChange={(e) => setFromAddress(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonPinCircleRoundedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                </InputAdornment>
              )
            }}
            sx={{
              mb: 1.6,
              "& .MuiOutlinedInput-root": {
                borderRadius: 999,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": { borderColor: "primary.main" }
              }
            }}
          />

          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.5, display: "block" }}
          >
            To (drop-off)
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="Enter drop-off address"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PlaceRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                </InputAdornment>
              )
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 999,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": { borderColor: "primary.main" }
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Parcel details */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <Inventory2RoundedIcon sx={{ fontSize: 20, color: "primary.main" }} />
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Parcel details
            </Typography>
          </Stack>

          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.5, display: "block" }}
          >
            Type of parcel
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: "wrap" }}>
            {["documents", "groceries", "electronics", "other"].map((type) => {
              const label =
                type === "documents"
                  ? "Documents"
                  : type === "groceries"
                  ? "Groceries & food"
                  : type === "electronics"
                  ? "Electronics"
                  : "Other";
              const active = parcelType === type;
              return (
                <Chip
                  key={type}
                  label={label}
                  onClick={() => setParcelType(type)}
                  size="small"
                  sx={{
                    borderRadius: 999,
                    fontSize: 11,
                    height: 26,
                    bgcolor: active
                      ? "primary.main"
                      : (t) =>
                          t.palette.mode === "light"
                            ? "#F3F4F6"
                            : "rgba(15,23,42,0.96)",
                    color: active
                      ? "#020617"
                      : (t) => t.palette.text.primary
                  }}
                />
              );
            })}
          </Stack>

          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.5, display: "block" }}
          >
            Size
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 0.5, flexWrap: "wrap" }}>
            {["small", "medium", "large", "oversize"].map((size) => {
              const label =
                size === "small"
                  ? "Small (up to 5kg)"
                  : size === "medium"
                  ? "Medium (5–15kg)"
                  : size === "large"
                  ? "Large (15–30kg)"
                  : "Oversize";
              const active = parcelSize === size;
              return (
                <Chip
                  key={size}
                  label={label}
                  onClick={() => setParcelSize(size)}
                  size="small"
                  sx={{
                    borderRadius: 999,
                    fontSize: 11,
                    height: 26,
                    bgcolor: active
                      ? "primary.main"
                      : (t) =>
                          t.palette.mode === "light"
                            ? "#F3F4F6"
                            : "rgba(15,23,42,0.96)",
                    color: active
                      ? "#020617"
                      : (t) => t.palette.text.primary
                  }}
                />
              );
            })}
          </Stack>
          <Typography
            variant="caption"
            sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
          >
            Courier may adjust if parcel is significantly larger than selected.
          </Typography>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.6 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
            <NotesRoundedIcon sx={{ fontSize: 18, color: (t) => t.palette.text.secondary }} />
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Delivery instructions (optional)
            </Typography>
          </Stack>
          <TextField
            multiline
            minRows={3}
            fullWidth
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="E.g. Call when at the gate, fragile items inside, leave at reception…"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": { borderColor: "primary.main" }
              }
            }}
          />
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="contained"
        disabled={!canContinue}
        sx={{
          borderRadius: 999,
          py: 1.1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: canContinue ? "primary.main" : "#9CA3AF",
          color: canContinue ? "#020617" : "#E5E7EB",
          "&:hover": {
            bgcolor: canContinue ? "#06e29a" : "#9CA3AF"
          }
        }}
      >
        Find EV courier
      </Button>
    </Box>
  );
}

export default function RiderScreen59OrderDeliveryAddressParcelSetupCanvas_v2() {
      return (
    
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (t) => t.palette.background.default
        }}
      >
        

        <DarkModeToggle />

        

        <MobileShell>
          <OrderDeliveryAddressParcelSetupScreen />
        </MobileShell>
      </Box>
    
  );
}
