import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Snackbar,
  Alert
} from "@mui/material";
import ScreenScaffold from "../components/ScreenScaffold";
import PageHeader from "../components/PageHeader";
import { uiTokens } from "../design/tokens";

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingRoundedIcon from "@mui/icons-material/PendingRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PaymentRoundedIcon from "@mui/icons-material/PaymentRounded";
import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";

const STUDENTS = [
  { id: "s1", name: "Emma Robinson", school: "Kampala International School", grade: "Grade 5" },
  { id: "s2", name: "Liam Robinson", school: "Kampala International School", grade: "Grade 3" }
];

const FEE_SUMMARY = [
  {
    id: "f1",
    studentId: "s1",
    term: "Term 1 • 2026",
    amount: "UGX 450,000",
    dueDate: "15 Jan 2026",
    status: "paid" as const
  },
  {
    id: "f2",
    studentId: "s1",
    term: "Term 2 • 2026",
    amount: "UGX 450,000",
    dueDate: "15 May 2026",
    status: "pending" as const
  },
  {
    id: "f3",
    studentId: "s2",
    term: "Term 1 • 2026",
    amount: "UGX 380,000",
    dueDate: "15 Jan 2026",
    status: "paid" as const
  },
  {
    id: "f4",
    studentId: "s2",
    term: "Term 2 • 2026",
    amount: "UGX 380,000",
    dueDate: "10 Apr 2026",
    status: "overdue" as const
  }
];

const PAYMENT_HISTORY = [
  { id: "p1", desc: "Term 1 — Emma Robinson", amount: "- UGX 450,000", date: "12 Jan 2026", method: "Mobile Money" },
  { id: "p2", desc: "Term 1 — Liam Robinson", amount: "- UGX 380,000", date: "13 Jan 2026", method: "EVzone Wallet" }
];

const statusConfig = {
  paid: { label: "Paid", color: "#16A34A", bg: "rgba(22,163,74,0.1)", icon: <CheckCircleRoundedIcon sx={{ fontSize: 16 }} /> },
  pending: { label: "Pending", color: "#D97706", bg: "rgba(217,119,6,0.1)", icon: <PendingRoundedIcon sx={{ fontSize: 16 }} /> },
  overdue: { label: "Overdue", color: "#DC2626", bg: "rgba(220,38,38,0.1)", icon: <WarningAmberRoundedIcon sx={{ fontSize: 16 }} /> }
};

export default function SchoolFees(): React.JSX.Element {
  const navigate = useNavigate();
  const [activeStudent, setActiveStudent] = useState("s1");
  const [snackbar, setSnackbar] = useState(false);

  const filteredFees = FEE_SUMMARY.filter((f) => f.studentId === activeStudent);
  const totalDue = filteredFees
    .filter((f) => f.status !== "paid")
    .reduce((sum, f) => sum + parseInt(f.amount.replace(/[^0-9]/g, ""), 10), 0);

  const handlePayNow = () => {
    setSnackbar(true);
  };

  return (
    <ScreenScaffold
      header={<PageHeader title="School Bus Fees" subtitle="Manage student transport payments" />}
    >
      {/* Student selector */}
      <Stack direction="row" spacing={1} sx={{ mb: uiTokens.spacing.md }}>
        {STUDENTS.map((s) => (
          <Chip
            key={s.id}
            label={s.name}
            size="small"
            onClick={() => setActiveStudent(s.id)}
            avatar={
              <Avatar sx={{ width: 22, height: 22, bgcolor: activeStudent === s.id ? "#047857" : "grey.400" }}>
                <SchoolRoundedIcon sx={{ fontSize: 14, color: "#fff" }} />
              </Avatar>
            }
            sx={{
              borderRadius: 5,
              fontSize: 11,
              height: 30,
              bgcolor: activeStudent === s.id ? "primary.main" : (t) => t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
              color: activeStudent === s.id ? (t) => (t.palette.mode === "light" ? "#020617" : "#FFFFFF") : (t) => t.palette.text.primary,
              fontWeight: activeStudent === s.id ? 600 : 400
            }}
          />
        ))}
      </Stack>

      {/* Student info card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) => t.palette.mode === "light"
            ? "radial-gradient(circle at top, #DBEAFE, #F9FAFB)"
            : "radial-gradient(circle at top, #0F172A, #020617)",
          border: (t) => t.palette.mode === "light"
            ? "1px solid rgba(59,130,246,0.3)"
            : "1px solid rgba(56,189,248,0.4)"
        }}
      >
        <CardContent sx={{ px: { xs: 1.5, sm: 1.9 }, py: { xs: 1.5, sm: 1.7 } }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <DirectionsBusRoundedIcon sx={{ fontSize: 18, color: "#1D4ED8" }} />
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              {STUDENTS.find((s) => s.id === activeStudent)?.school}
            </Typography>
          </Stack>
          <Typography variant="body1" sx={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em" }}>
            {STUDENTS.find((s) => s.id === activeStudent)?.name}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
            {STUDENTS.find((s) => s.id === activeStudent)?.grade} • EV Shuttle Transport
          </Typography>
          {totalDue > 0 && (
            <Box sx={{ mt: uiTokens.spacing.md }}>
              <Typography variant="caption" sx={{ fontSize: 10, color: (t) => t.palette.text.secondary, display: "block" }}>
                Total outstanding
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#DC2626", fontSize: 18 }}>
                UGX {totalDue.toLocaleString()}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Fee schedule */}
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) => t.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: { xs: 1.5, sm: 1.75 }, py: { xs: 1.5, sm: 1.7 } }}>
          <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}>
            Fee schedule
          </Typography>
          <Divider sx={{ mb: 1, borderColor: (t) => t.palette.divider }} />

          {filteredFees.map((fee) => {
            const cfg = statusConfig[fee.status];
            return (
              <Box
                key={fee.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 0.75,
                  "&:not(:last-of-type)": {
                    borderBottom: (t) => `1px dashed ${t.palette.divider}`
                  }
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontSize: 12.5, fontWeight: 500, letterSpacing: "-0.01em" }}>
                    {fee.term}
                  </Typography>
                  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.25 }}>
                    <CalendarMonthRoundedIcon sx={{ fontSize: 14, color: (t) => t.palette.text.secondary }} />
                    <Typography variant="caption" sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}>
                      Due: {fee.dueDate}
                    </Typography>
                  </Stack>
                </Box>
                <Stack direction="column" alignItems="flex-end" spacing={0.25}>
                  <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600 }}>
                    {fee.amount}
                  </Typography>
                  <Chip
                    size="small"
                    icon={cfg.icon}
                    label={cfg.label}
                    sx={{
                      fontSize: 10, height: 22, borderRadius: 5,
                      bgcolor: cfg.bg, color: cfg.color,
                      "& .MuiChip-icon": { color: cfg.color }
                    }}
                  />
                </Stack>
              </Box>
            );
          })}

          {totalDue > 0 && (
            <Button
              fullWidth
              variant="contained"
              startIcon={<PaymentRoundedIcon />}
              onClick={handlePayNow}
              sx={{
                mt: 1.5,
                borderRadius: uiTokens.radius.xl,
                py: 0.9,
                fontSize: 13,
                fontWeight: 600,
                textTransform: "none",
                bgcolor: (t) => t.palette.mode === "light" ? "#022C22" : "#03CD8C",
                color: (t) => t.palette.mode === "light" ? "#ECFDF5" : "#020617",
                "&:hover": { bgcolor: (t) => t.palette.mode === "light" ? "#064E3B" : "#02B87A" }
              }}
            >
              Pay UGX {totalDue.toLocaleString()} now
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Payment history */}
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) => t.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: { xs: 1.5, sm: 1.75 }, py: { xs: 1.5, sm: 1.7 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
              Payment history
            </Typography>
            <Typography
              variant="caption"
              onClick={() => navigate("/history/all")}
              sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary, cursor: "pointer" }}
            >
              View all
            </Typography>
          </Stack>
          <Divider sx={{ mb: 0.5, borderColor: (t) => t.palette.divider }} />

          <List dense sx={{ py: 0 }}>
            {PAYMENT_HISTORY.map((tx) => (
              <ListItem key={tx.id} disableGutters sx={{ py: 0.5 }}>
                <ListItemAvatar>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: "rgba(22,163,74,0.12)", color: "#16A34A" }}>
                    <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="caption" sx={{ fontSize: 11.5, fontWeight: 500 }}>{tx.desc}</Typography>}
                  secondary={<Typography variant="caption" sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}>{tx.date} • {tx.method}</Typography>}
                />
                <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600, color: "#16A34A" }}>
                  {tx.amount}
                </Typography>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Typography variant="caption" sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary, mt: 1, display: "block" }}>
        Manage school bus transport fees for your children. Payments are processed through your EVzone Wallet or linked payment methods.
      </Typography>

      <Snackbar
        open={snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar(false)} severity="success" sx={{ borderRadius: uiTokens.radius.xl, width: "100%" }}>
          Payment initiated! Check your wallet for confirmation.
        </Alert>
      </Snackbar>
    </ScreenScaffold>
  );
}
