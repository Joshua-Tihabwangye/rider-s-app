import React, { useState, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  Box,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  IconButton,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  Avatar
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

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

const NAV_TABS = [
  { value: "home", label: "Home", icon: <HomeOutlinedIcon /> },
  { value: "rides", label: "Rides", icon: <DirectionsCarFilledRoundedIcon /> },
  { value: "deliveries", label: "Deliveries", icon: <LocalShippingRoundedIcon /> },
  { value: "wallet", label: "Wallet", icon: <ShoppingCartRoundedIcon /> },
  { value: "more", label: "More", icon: <MoreHorizRoundedIcon /> }
];

function MobileShell({ children, activeTab = "deliveries", onTabChange }) {
  const [navValue, setNavValue] = useState(activeTab);

  const handleChange = (event, newValue) => {
    setNavValue(newValue);
    if (onTabChange) onTabChange(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        bgcolor: (t) => t.palette.background.default
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 430,
          minHeight: "100vh",
          borderRadius: { xs: 0, sm: 2 },
          overflow: "hidden",
          bgcolor: (t) => t.palette.background.default,
          backgroundImage: (t) =>
            t.palette.mode === "light"
              ? "radial-gradient(circle at top, #E5F9F1 0, #F3F4F6 55%, #F3F4F6 100%)"
              : "radial-gradient(circle at top, #020617 0, #020617 60%, #020617 100%)"
        }}
      >
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            color: (t) => t.palette.text.primary
          }}
        >
          <Box sx={{ flex: 1, overflowY: "auto", paddingBottom: "88px" }}>{children}</Box>
          <Box
            sx={{
              position: "fixed",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: 0,
              width: "100%",
              maxWidth: 430
            }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px 16px 0 0",
                overflow: "hidden",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "rgba(255,255,255,0.98)" : "rgba(15,23,42,0.96)",
                backdropFilter: "blur(22px)",
                borderTop: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(229,231,235,1)"
                    : "1px solid rgba(30,64,175,0.6)",
                boxShadow: "0 -14px 40px rgba(15,23,42,0.26), 0 -1px 0 rgba(148,163,184,0.38)"
              }}
            >
              <BottomNavigation
                value={navValue}
                onChange={handleChange}
                sx={{
                  bgcolor: "transparent",
                  py: 0.3,
                  px: 1,
                  "& .MuiBottomNavigationAction-root": {
                    color: (t) =>
                      t.palette.mode === "light" ? "#9CA3AF" : "rgba(148,163,184,0.9)",
                    minWidth: 0,
                    paddingY: 0.5,
                    paddingX: 0.5,
                    maxWidth: 90
                  },
                  "& .Mui-selected": { color: "#03CD8C" },
                  "& .MuiBottomNavigationAction-label": {
                    fontSize: 11,
                    fontWeight: 500,
                    "&.Mui-selected": { fontSize: 12, fontWeight: 600 }
                  }
                }}
              >
                {NAV_TABS.map((tab) => (
                  <BottomNavigationAction
                    key={tab.value}
                    value={tab.value}
                    label={tab.label}
                    icon={tab.icon}
                  />
                ))}
              </BottomNavigation>
            </Paper>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

const PENDING_INVITATIONS_V2 = [
  {
    id: "INV-001",
    fromName: "Mary Immaculate",
    initials: "MI",
    type: "Shared delivery",
    context: "Groceries from Nsambya Market",
    createdAt: "Today • 02:15 PM"
  },
  {
    id: "INV-002",
    fromName: "John Doe",
    initials: "JD",
    type: "Contact invite",
    context: "Family & friends",
    createdAt: "Yesterday • 11:40 AM"
  },
  {
    id: "INV-003",
    fromName: "EVzone Marketplace",
    initials: "EV",
    type: "Shared delivery",
    context: "EV accessories shipment",
    createdAt: "Mon • 04:05 PM"
  }
];

function InvitationCardV2({ invitation }) {
  const isDelivery = invitation.type === "Shared delivery";

  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.75,
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
        <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: "primary.main",
                color: "#020617",
                fontSize: 16,
                fontWeight: 600
              }}
            >
              {invitation.initials}
            </Avatar>
            <Box>
              <Typography
                variant="body2"
                sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                {invitation.fromName}
              </Typography>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <Chip
                  size="small"
                  label={invitation.type}
                  sx={{
                    borderRadius: 999,
                    fontSize: 10,
                    height: 20,
                    bgcolor: isDelivery
                      ? "rgba(59,130,246,0.12)"
                      : "rgba(139,92,246,0.12)",
                    color: isDelivery ? "#1D4ED8" : "#6D28D9"
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  {invitation.context}
                </Typography>
              </Stack>
            </Box>
          </Stack>
          <Chip
            size="small"
            label="Pending"
            sx={{
              borderRadius: 999,
              fontSize: 10,
              height: 22,
              bgcolor: "rgba(250,204,21,0.15)",
              color: "#CA8A04"
            }}
          />
        </Stack>

        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 1.1 }}>
          <AccessTimeRoundedIcon
            sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
          />
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            Invited {invitation.createdAt}
          </Typography>
        </Stack>

        {/* Emphasised CTA row */}
        <Stack direction="row" spacing={1.25} sx={{ mt: 1.6 }}>
          <Button
            fullWidth
            size="medium"
            variant="contained"
            startIcon={<PersonAddAltRoundedIcon sx={{ fontSize: 18 }} />}
            sx={{
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 600,
              textTransform: "none",
              py: 0.9,
              bgcolor: "primary.main",
              color: "#020617",
              "&:hover": { bgcolor: "#06e29a" }
            }}
          >
            Accept invite
          </Button>
          <Button
            size="medium"
            variant="text"
            sx={{
              minWidth: 90,
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 500,
              textTransform: "none",
              color: "#EF4444"
            }}
          >
            Decline
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function InvitationsPendingV2Screen() {
  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header + summary */}
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
              Invitations – Pending (v2)
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Approve requests to join shared deliveries or contacts
            </Typography>
          </Box>
        </Box>
        <Chip
          size="small"
          icon={<GroupRoundedIcon sx={{ fontSize: 16 }} />}
          label={`${PENDING_INVITATIONS_V2.length} pending`}
          sx={{
            borderRadius: 999,
            fontSize: 10,
            height: 22,
            bgcolor: "rgba(34,197,94,0.12)",
            color: "#16A34A"
          }}
        />
      </Box>

      {PENDING_INVITATIONS_V2.length === 0 ? (
        <Typography
          variant="caption"
          sx={{
            mt: 4,
            display: "block",
            textAlign: "center",
            fontSize: 11,
            color: (t) => t.palette.text.secondary
          }}
        >
          You have no pending invitations.
        </Typography>
      ) : (
        PENDING_INVITATIONS_V2.map((inv) => (
          <InvitationCardV2 key={inv.id} invitation={inv} />
        ))
      )}
    </Box>
  );
}

export default function RiderScreen58InvitationsPendingTabV2Canvas_v2() {
  const [mode, setMode] = useState("light");
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (t) => t.palette.background.default
        }}
      >
        <IconButton
          size="small"
          onClick={() => setMode((prev) => (prev === "light" ? "dark" : "light"))}
          sx={{
            position: "fixed",
            top: 10,
            right: 10,
            zIndex: 50,
            bgcolor: (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(30,64,175,0.7)",
            boxShadow: 3
          }}
          aria-label="Toggle light/dark mode"
        >
          {mode === "light" ? (
            <DarkModeRoundedIcon sx={{ fontSize: 18 }} />
          ) : (
            <LightModeRoundedIcon sx={{ fontSize: 18 }} />
          )}
        </IconButton>

        <MobileShell activeTab="deliveries">
          <InvitationsPendingV2Screen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
