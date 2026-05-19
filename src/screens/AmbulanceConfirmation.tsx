import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import { useAppData } from "../contexts/AppDataContext";
import {
  ambulanceCompactTypographySx,
  ambulanceContainedButtonSx
} from "../components/ambulance/ambulanceTypography";

interface BreakdownItem {
  label: string;
  amount: number;
}

const breakdown: BreakdownItem[] = [
  { label: "Ambulance dispatch (ALS)", amount: 450000 },
  { label: "Medical staff (2 crew)", amount: 300000 },
  { label: "Distance fee", amount: 120000 },
  { label: "Equipment fee", amount: 150000 },
  { label: "Service fee", amount: 50000 }
];

function formatAmount(amount: number): string {
  return `UGX ${amount.toLocaleString("en-UG")}`;
}

function AmbulanceRequestConfirmationETAScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { ambulance, actions } = useAppData();
  const request = ambulance.request;

  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "card" | "mobile">("wallet");
  const subtotal = useMemo(() => breakdown.reduce((sum, item) => sum + item.amount, 0), []);
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + taxes;

  const pickupLabel = request.pickup?.label ?? request.pickup?.address ?? "Nakasero Hill Road, Kampala";
  const destinationLabel =
    request.destination?.label ?? request.destination?.address ?? "Mulago National Referral Hospital";
  const eta = request.status === "assigned" ? "6 min" : "8 min";

  return (
    <Box sx={[{ px: 2.5, pt: 2.5, pb: 4 }, ambulanceCompactTypographySx]}>
      <Box
        sx={{
          mb: 2,
          display: "grid",
          gridTemplateColumns: "42px 1fr 42px",
          alignItems: "center",
          gap: 1
        }}
      >
        <IconButton
          size="small"
          onClick={() => navigate(-1)}
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.92)"),
            border: "1px solid var(--evz-border-subtle)"
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 700, fontSize: 20 }}>
            Confirm ambulance
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: 13 }}>Review before dispatch</Typography>
        </Box>

        <Box />
      </Box>

      <Card
        elevation={0}
        sx={{
          mb: 1.6,
          borderRadius: 3,
          border: "1px solid rgba(239,68,68,0.25)",
          p: 2,
          background: "linear-gradient(135deg, rgba(239,68,68,0.06) 0%, #FFFFFF 56%)"
        }}
      >
        <Stack direction="row" spacing={1.7} alignItems="center">
          <Box sx={{ flex: 1 }}>
            <Chip
              icon={<HealthAndSafetyRoundedIcon sx={{ fontSize: 16 }} />}
              label="Emergency"
              size="small"
              sx={{
                height: 30,
                borderRadius: 2,
                bgcolor: "#EF4444",
                color: "#FFFFFF",
                mb: 1
              }}
            />
            <Typography sx={{ color: "#475569", fontSize: 14 }}>Selected ambulance</Typography>
            <Typography sx={{ fontWeight: 800, fontSize: 20, lineHeight: 1.2 }}>
              {request.assignedUnit ?? "EV-AMB-4"}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.2 }}>
              <AccessTimeRoundedIcon sx={{ color: "#059669" }} />
              <Box>
                <Typography sx={{ color: "#64748B", fontSize: 12 }}>ETA</Typography>
                <Typography sx={{ color: "#059669", fontWeight: 800, fontSize: 18, lineHeight: 1 }}>{eta}</Typography>
              </Box>
            </Stack>
          </Box>
          <Box
            sx={{
              width: 170,
              height: 122,
              borderRadius: 2,
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(239,68,68,0.18)",
              display: "grid",
              placeItems: "center"
            }}
          >
            <LocalHospitalRoundedIcon sx={{ color: "#DC2626", fontSize: 72 }} />
          </Box>
        </Stack>
      </Card>

      {[
        {
          title: "Pickup location",
          value: pickupLabel,
          subtitle: "Kampala, Uganda",
          icon: <PlaceRoundedIcon sx={{ color: "#059669" }} />,
          action: "Edit",
          onAction: () => navigate("/ambulance/location")
        },
        {
          title: "Destination",
          value: destinationLabel,
          subtitle: "Kampala, Uganda",
          icon: <LocalHospitalRoundedIcon sx={{ color: "#EA580C" }} />,
          action: "Edit",
          onAction: () => navigate("/ambulance/destination")
        },
        {
          title: "Patient details",
          value: `${request.patientName ?? "Patient"} • ${request.patientAge ?? 45} yrs`,
          subtitle: `Condition: ${request.patientCondition ?? "Chest pain, difficulty breathing"}`,
          icon: <PersonOutlineRoundedIcon sx={{ color: "#059669" }} />,
          action: "Edit",
          onAction: () => navigate("/ambulance/location")
        },
        {
          title: "Crew details",
          value: "2 Crew • Paramedic + EMT",
          subtitle: "Advanced Life Support (ALS)",
          icon: <GroupsRoundedIcon sx={{ color: "#059669" }} />,
          action: "View details",
          onAction: () => navigate(`/ambulance/history/${request.id}/general`, { state: { requestSnapshot: request } })
        }
      ].map((item) => (
        <Card
          key={item.title}
          elevation={0}
          sx={{ mb: 1.2, borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.4 }}
        >
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 2,
                bgcolor: "rgba(5,150,105,0.1)",
                display: "grid",
                placeItems: "center"
              }}
            >
              {item.icon}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: "#64748B", fontSize: 13 }}>{item.title}</Typography>
              <Typography sx={{ fontSize: 17, fontWeight: 700, lineHeight: 1.25 }}>{item.value}</Typography>
              <Typography sx={{ color: "#475569", fontSize: 13 }}>{item.subtitle}</Typography>
            </Box>
            <Button
              size="small"
              onClick={item.onAction}
              endIcon={<EditRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{ color: "#059669", textTransform: "none", fontWeight: 700 }}
            >
              {item.action}
            </Button>
          </Stack>
        </Card>
      ))}

      <Card elevation={0} sx={{ mb: 1.6, borderRadius: 2.5, border: "1px solid var(--evz-border-subtle)", p: 1.6 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 22, mb: 1.2 }}>Price breakdown</Typography>
        <Stack spacing={0.75}>
          {breakdown.map((item) => (
            <Stack key={item.label} direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontSize: 16, color: "#334155" }}>{item.label}</Typography>
              <Typography sx={{ fontSize: 16, color: "#0F172A" }}>{formatAmount(item.amount)}</Typography>
            </Stack>
          ))}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ fontSize: 16, color: "#334155" }}>Taxes (VAT 5%)</Typography>
            <Typography sx={{ fontSize: 16, color: "#0F172A" }}>{formatAmount(taxes)}</Typography>
          </Stack>
        </Stack>
        <Box sx={{ borderTop: "1px dashed var(--evz-border-subtle)", mt: 1.1, pt: 1.1, display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontWeight: 800, fontSize: 22 }}>Total payable</Typography>
          <Typography sx={{ fontWeight: 800, fontSize: 24, color: "#059669", lineHeight: 1 }}>
            {formatAmount(total)}
          </Typography>
        </Box>
      </Card>

      <Typography sx={{ fontWeight: 700, fontSize: 20, mb: 1 }}>Payment method</Typography>
      <Stack direction="row" spacing={1.2} sx={{ mb: 1 }}>
        {[
          {
            id: "wallet" as const,
            label: "Wallet",
            subtitle: "Balance: UGX 850,000",
            icon: <AccountBalanceWalletRoundedIcon sx={{ fontSize: 32 }} />
          },
          {
            id: "card" as const,
            label: "Card",
            subtitle: "Visa, Mastercard",
            icon: <CreditCardRoundedIcon sx={{ fontSize: 32 }} />
          },
          {
            id: "mobile" as const,
            label: "Mobile money",
            subtitle: "MTN, Airtel",
            icon: <PaymentsRoundedIcon sx={{ fontSize: 32 }} />
          }
        ].map((method) => {
          const selected = paymentMethod === method.id;
          return (
            <Card
              key={method.id}
              elevation={0}
              onClick={() => setPaymentMethod(method.id)}
              sx={{
                flex: 1,
                borderRadius: 2.5,
                border: selected ? "2px solid rgba(5,150,105,0.5)" : "1px solid var(--evz-border-subtle)",
                p: 1.2,
                cursor: "pointer"
              }}
            >
              <Stack alignItems="center" spacing={0.4}>
                <Box sx={{ color: selected ? "#059669" : "#64748B", position: "relative" }}>
                  {method.icon}
                  {selected && (
                    <CheckCircleRoundedIcon
                      sx={{ position: "absolute", right: -10, top: -6, color: "#059669", bgcolor: "#FFFFFF", borderRadius: "50%" }}
                    />
                  )}
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: 15, textAlign: "center" }}>{method.label}</Typography>
                <Typography sx={{ color: "#64748B", fontSize: 12, textAlign: "center" }}>{method.subtitle}</Typography>
              </Stack>
            </Card>
          );
        })}
      </Stack>

      <Stack direction="row" spacing={0.6} alignItems="center" justifyContent="center">
        <SecurityRoundedIcon sx={{ color: "#64748B", fontSize: 18 }} />
        <Typography sx={{ color: "#64748B", fontSize: 13 }}>Your payment is secure and encrypted.</Typography>
      </Stack>

      <Card
        elevation={0}
        sx={{
          mt: 1.4,
          borderRadius: 3,
          border: "1px solid var(--evz-border-subtle)",
          px: 2,
          py: 1.4
        }}
      >
        <Stack direction="row" spacing={{ xs: 1, sm: 1.4 }} alignItems="center">
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ color: "#334155", fontSize: { xs: 12, sm: 13 } }}>Total payable</Typography>
            <Typography sx={{ fontWeight: 800, fontSize: { xs: 22, sm: 26 }, lineHeight: 1, color: "#059669" }}>
              {formatAmount(total)}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<SecurityRoundedIcon />}
            onClick={() => {
              const requestPatch = {
                requestedAt: request.requestedAt ?? new Date().toISOString(),
                dispatchedAt: request.dispatchedAt ?? new Date().toISOString()
              };
              actions.updateAmbulanceRequest(requestPatch);
              if (paymentMethod === "wallet") {
                navigate("/ambulance/payment/wallet");
                return;
              }
              if (paymentMethod === "card") {
                navigate("/ambulance/payment/card");
                return;
              }
              navigate("/ambulance/payment/mobile-money");
            }}
            sx={{
              minWidth: { xs: 178, sm: 230, md: 260 },
              borderRadius: 3,
              px: { xs: 1.8, sm: 2.6 },
              py: { xs: 1.05, sm: 1.4 },
              fontWeight: 800,
              fontSize: { xs: 13, sm: 16 },
              whiteSpace: "nowrap",
              flexShrink: 0,
              ...ambulanceContainedButtonSx
            }}
          >
            Confirm emergency request
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}

export default function RiderScreen86AmbulanceRequestConfirmationETACanvas_v2(): React.JSX.Element {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (t) => t.palette.background.default
      }}
    >
      <AmbulanceRequestConfirmationETAScreen />
    </Box>
  );
}
