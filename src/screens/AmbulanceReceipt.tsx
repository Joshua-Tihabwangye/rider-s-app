import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { useAppData } from "../contexts/AppDataContext";
import {
  ambulanceCompactTypographySx,
  ambulanceContainedButtonSx
} from "../components/ambulance/ambulanceTypography";

function formatDate(value?: string): string {
  if (!value) return "Pending";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Pending";
  return date.toLocaleString("en-UG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function AmbulanceReceipt(): React.JSX.Element {
  const navigate = useNavigate();
  const { requestId } = useParams<{ requestId: string }>();
  const { ambulance } = useAppData();

  const request = useMemo(() => {
    const all = [ambulance.request, ...ambulance.history];
    return all.find((entry) => entry.id === requestId) ?? null;
  }, [ambulance.history, ambulance.request, requestId]);

  if (!request) {
    return (
      <Box sx={[{ px: 2.5, pt: 2.5, pb: 3 }, ambulanceCompactTypographySx]}>
        <Button onClick={() => navigate("/ambulance/history")} sx={{ textTransform: "none" }}>
          Back to ambulance history
        </Button>
        <Typography sx={{ mt: 1, color: "#475569" }}>Receipt not found.</Typography>
      </Box>
    );
  }

  const lineItems = [
    { label: "Base fare", amount: 1800 },
    { label: "Distance charge (14.3 km)", amount: 700 },
    { label: "Medical equipment & supplies", amount: 500 },
    { label: "Taxes & fees", amount: 214 }
  ];
  const total = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const formatUgx = (amount: number) => `UGX ${amount.toLocaleString("en-UG")}`;

  return (
    <Box sx={[{ px: 2.5, pt: 2.5, pb: 4 }, ambulanceCompactTypographySx]}>
      <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2 }}>
        <IconButton
          size="small"
          onClick={() => navigate(-1)}
          sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: "#fff", border: "1px solid var(--evz-border-subtle)" }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Typography sx={{ fontWeight: 800, fontSize: 22 }}>Ambulance receipt</Typography>
      </Stack>

      <Card elevation={0} sx={{ borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.6, mb: 1.3 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <ReceiptLongRoundedIcon sx={{ color: "#11B86A" }} />
          <Typography sx={{ fontWeight: 700 }}>Receipt #{request.id}</Typography>
        </Stack>
        <Typography sx={{ color: "#475569" }}>Issued: {formatDate(request.completedAt ?? request.arrivedAt ?? request.requestedAt)}</Typography>
        <Typography sx={{ color: "#475569" }}>Ambulance unit: {request.assignedUnit ?? "EV-AMB-4"}</Typography>
        <Typography sx={{ color: "#475569" }}>Patient: {request.patientName ?? "Patient"}</Typography>
        <Typography sx={{ color: "#475569" }}>Pickup: {request.pickup?.address ?? "Kampala, Uganda"}</Typography>
        <Typography sx={{ color: "#475569" }}>Dropoff: {request.destination?.address ?? "Kampala, Uganda"}</Typography>
      </Card>

      <Card elevation={0} sx={{ borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.6, mb: 1.4 }}>
        <Typography sx={{ fontWeight: 700, mb: 1 }}>Charges</Typography>
        <Stack spacing={0.7}>
          {lineItems.map((item) => (
            <Stack key={item.label} direction="row" justifyContent="space-between">
              <Typography sx={{ color: "#334155" }}>{item.label}</Typography>
              <Typography sx={{ color: "#0F172A" }}>{formatUgx(item.amount)}</Typography>
            </Stack>
          ))}
        </Stack>
        <Box sx={{ borderTop: "1px solid var(--evz-border-subtle)", mt: 1.1, pt: 1.1, display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontWeight: 800, color: "#047857" }}>Total paid</Typography>
          <Typography sx={{ fontWeight: 800, color: "#11B86A" }}>{formatUgx(total)}</Typography>
        </Box>
      </Card>

      <Button
        fullWidth
        variant="contained"
        startIcon={<DownloadRoundedIcon />}
        onClick={() => window.print()}
        sx={{ borderRadius: 3, py: 1.2, fontWeight: 700, ...ambulanceContainedButtonSx }}
      >
        Download / Print receipt
      </Button>
    </Box>
  );
}

