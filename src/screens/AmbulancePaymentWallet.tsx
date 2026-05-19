import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import { useAppData } from "../contexts/AppDataContext";
import { ambulanceCompactTypographySx } from "../components/ambulance/ambulanceTypography";

export default function AmbulancePaymentWallet(): React.JSX.Element {
  const navigate = useNavigate();
  const { ambulance, actions } = useAppData();
  const [pin, setPin] = useState("");

  return (
    <Box sx={[{ px: 2.5, pt: 2.5, pb: 14 }, ambulanceCompactTypographySx]}>
      <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2 }}>
        <IconButton
          size="small"
          onClick={() => navigate(-1)}
          sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: "#fff", border: "1px solid var(--evz-border-subtle)" }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Typography sx={{ fontWeight: 800, fontSize: 22 }}>Wallet payment</Typography>
      </Stack>

      <Card elevation={0} sx={{ borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.5, mb: 1.2 }}>
        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1 }}>
          <AccountBalanceWalletRoundedIcon sx={{ color: "#059669", fontSize: 34 }} />
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 18 }}>EVzone Wallet</Typography>
            <Typography sx={{ color: "#475569", fontSize: 14 }}>Balance: UGX 850,000</Typography>
          </Box>
        </Stack>
        <Typography sx={{ color: "#334155", fontSize: 14 }}>
          Request: {ambulance.request.assignedUnit ?? "ALS Ambulance"}
        </Typography>
      </Card>

      <Card elevation={0} sx={{ borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.5, mb: 1.2 }}>
        <Typography sx={{ fontWeight: 700, mb: 1 }}>Confirm with wallet PIN</Typography>
        <TextField
          fullWidth
          label="4-digit PIN"
          value={pin}
          onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
          inputProps={{ inputMode: "numeric", maxLength: 4 }}
        />
      </Card>

      <Button
        fullWidth
        variant="contained"
        startIcon={<SecurityRoundedIcon />}
        disabled={pin.length < 4}
        onClick={() => {
          actions.updateAmbulanceRequest({
            status: "en_route",
            dispatchedAt: ambulance.request.dispatchedAt ?? new Date().toISOString()
          });
          navigate("/ambulance/tracking");
        }}
        sx={{
          borderRadius: 3,
          py: 1.3,
          fontWeight: 700,
          fontSize: 16,
          color: "#FFFFFF",
          background: "linear-gradient(90deg, #059669 0%, #EA580C 100%)"
        }}
      >
        Pay and dispatch
      </Button>
    </Box>
  );
}
