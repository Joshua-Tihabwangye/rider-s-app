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
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import { useAppData } from "../contexts/AppDataContext";
import { ambulanceCompactTypographySx } from "../components/ambulance/ambulanceTypography";

export default function AmbulancePaymentMobileMoney(): React.JSX.Element {
  const navigate = useNavigate();
  const { ambulance, actions } = useAppData();
  const [phone, setPhone] = useState(ambulance.request.patientPhone ?? "");

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
        <Typography sx={{ fontWeight: 800, fontSize: 22 }}>Mobile money</Typography>
      </Stack>

      <Card elevation={0} sx={{ borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.5, mb: 1.2 }}>
        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1 }}>
          <PaymentsRoundedIcon sx={{ color: "#059669", fontSize: 34 }} />
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 18 }}>MTN / Airtel</Typography>
            <Typography sx={{ color: "#475569", fontSize: 14 }}>Approve prompt on your phone</Typography>
          </Box>
        </Stack>

        <TextField
          fullWidth
          label="Mobile number"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </Card>

      <Button
        fullWidth
        variant="contained"
        startIcon={<SecurityRoundedIcon />}
        disabled={phone.trim().length < 8}
        onClick={() => {
          actions.updateAmbulanceRequest({
            status: "en_route",
            patientPhone: phone,
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
