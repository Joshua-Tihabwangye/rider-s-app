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
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import { useAppData } from "../contexts/AppDataContext";
import { ambulanceCompactTypographySx } from "../components/ambulance/ambulanceTypography";

export default function AmbulancePaymentCard(): React.JSX.Element {
  const navigate = useNavigate();
  const { ambulance, actions } = useAppData();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const ready = cardNumber.replace(/\s/g, "").length >= 16 && expiry.length >= 4 && cvv.length >= 3;

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
        <Typography sx={{ fontWeight: 800, fontSize: 22 }}>Card payment</Typography>
      </Stack>

      <Card elevation={0} sx={{ borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.5, mb: 1.2 }}>
        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1 }}>
          <CreditCardRoundedIcon sx={{ color: "#334155", fontSize: 34 }} />
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 18 }}>Visa / Mastercard</Typography>
            <Typography sx={{ color: "#475569", fontSize: 14 }}>Secure card processing</Typography>
          </Box>
        </Stack>

        <TextField
          fullWidth
          label="Card number"
          value={cardNumber}
          onChange={(event) => setCardNumber(event.target.value.replace(/[^\d\s]/g, "").slice(0, 19))}
          sx={{ mb: 1 }}
        />
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            label="Expiry"
            placeholder="MM/YY"
            value={expiry}
            onChange={(event) => setExpiry(event.target.value.slice(0, 5))}
          />
          <TextField
            fullWidth
            label="CVV"
            value={cvv}
            onChange={(event) => setCvv(event.target.value.replace(/\D/g, "").slice(0, 4))}
          />
        </Stack>
      </Card>

      <Button
        fullWidth
        variant="contained"
        startIcon={<SecurityRoundedIcon />}
        disabled={!ready}
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
