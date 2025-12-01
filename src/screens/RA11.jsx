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
  Button,
  Chip,
  Stack,
  Avatar
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import FamilyRestroomRoundedIcon from "@mui/icons-material/FamilyRestroomRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
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
          background: {
            default: "#F3F4F6",
            paper: "#FFFFFF"
          },
          text: {
            primary: "#0F172A",
            secondary: "#6B7280"
          },
          divider: "rgba(148,163,184,0.4)"
        }
      : {
          background: {
            default: "#020617",
            paper: "#020617"
          },
          text: {
            primary: "#F9FAFB",
            secondary: "#A6A6A6"
          },
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

function MobileShell({ children, activeTab = "rides", onTabChange }) {
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
        bgcolor: (theme) => theme.palette.background.default
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
          bgcolor: (theme) => theme.palette.background.default,
          backgroundImage: (theme) =>
            theme.palette.mode === "light"
              ? "radial-gradient(circle at top, #E0F2FE 0, #F3F4F6 55%, #F3F4F6 100%)"
              : "radial-gradient(circle at top, #020617 0, #020617 60%, #020617 100%)"
        }}
      >
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            color: (theme) => theme.palette.text.primary
          }}
        >
          <Box sx={{ flex: 1, overflowY: "auto", paddingBottom: "88px" }}>
            {children}
          </Box>

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
                bgcolor: (theme) =>
                  theme.palette.mode === "light"
                    ? "rgba(255,255,255,0.98)"
                    : "rgba(15,23,42,0.96)",
                backdropFilter: "blur(22px)",
                borderTop: (theme) =>
                  theme.palette.mode === "light"
                    ? "1px solid rgba(229,231,235,1)"
                    : "1px solid rgba(30,64,175,0.6)",
                boxShadow:
                  "0 -14px 40px rgba(15,23,42,0.26), 0 -1px 0 rgba(148,163,184,0.38)"
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
                    color: (theme) =>
                      theme.palette.mode === "light"
                        ? "#9CA3AF"
                        : "rgba(148,163,184,0.9)",
                    minWidth: 0,
                    paddingY: 0.5,
                    paddingX: 0.5,
                    maxWidth: 90
                  },
                  "& .Mui-selected": {
                    color: "#03CD8C"
                  },
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

const CONTACTS = [
  {
    id: 1,
    name: "Mary Immaculate",
    relation: "Sister",
    phone: "+256 700 123456",
    initials: "MI",
    rides: 24
  },
  {
    id: 2,
    name: "John Doe",
    relation: "Friend",
    phone: "+256 772 987654",
    initials: "JD",
    rides: 8
  },
  {
    id: 3,
    name: "Dad",
    relation: "Parent",
    phone: "+256 701 445566",
    initials: "D",
    rides: 4
  }
];

function ContactCard({ contact, selected, onSelect }) {
  const isActive = selected?.id === contact.id;
  return (
    <Card
      elevation={0}
      onClick={() => onSelect(contact)}
      sx={{
        mb: 1.5,
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
      <CardContent sx={{ px: 1.75, py: 1.4 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: isActive ? "primary.main" : "rgba(15,118,110,0.16)",
                color: isActive ? "#020617" : "#047857",
                fontSize: 16,
                fontWeight: 600
              }}
            >
              {contact.initials}
            </Avatar>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  {contact.name}
                </Typography>
                <Chip
                  size="small"
                  icon={
                    <FamilyRestroomRoundedIcon
                      sx={{ fontSize: 14, color: "#22c55e" }}
                    />
                  }
                  label={contact.relation}
                  sx={{
                    borderRadius: 999,
                    fontSize: 10,
                    height: 22,
                    bgcolor: (theme) =>
                      theme.palette.mode === "light"
                        ? "#F3F4F6"
                        : "rgba(15,23,42,1)",
                    color: "rgba(75,85,99,1)",
                    pl: 0.5
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <PhoneIphoneRoundedIcon
                  sx={{ fontSize: 15, color: "rgba(148,163,184,1)" }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
                >
                  {contact.phone}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.3 }}>
              <StarRoundedIcon sx={{ fontSize: 15, color: "#fbbf24" }} />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
              >
                {contact.rides} rides
              </Typography>
            </Box>
            {isActive && (
              <Chip
                label="Selected"
                size="small"
                sx={{
                  mt: 0.5,
                  borderRadius: 999,
                  fontSize: 10,
                  height: 22,
                  bgcolor: "primary.main",
                  color: "#020617"
                }}
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function SwitchRiderContactSelectedScreen() {
  const [selectedContact, setSelectedContact] = useState(CONTACTS[0]);

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
              Ride for contact
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              Use my account to book for someone I know
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Selected summary */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#ECFDF5" : "rgba(15,23,42,0.98)",
          border: "1px solid #03CD8C"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: "primary.main",
                color: "#020617",
                fontSize: 18,
                fontWeight: 600
              }}
            >
              {selectedContact.initials}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  {selectedContact.name}
                </Typography>
                <Chip
                  size="small"
                  icon={
                    <PersonRoundedIcon
                      sx={{ fontSize: 14, color: "#22c55e" }}
                    />
                  }
                  label={selectedContact.relation}
                  sx={{
                    borderRadius: 999,
                    fontSize: 10,
                    height: 22,
                    bgcolor: (theme) =>
                      theme.palette.mode === "light"
                        ? "#F3F4F6"
                        : "rgba(15,23,42,1)",
                    color: "rgba(75,85,99,1)",
                    pl: 0.5
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{ mt: 0.25, fontSize: 11, color: (theme) => theme.palette.text.secondary }}
              >
                {selectedContact.phone}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
              >
                They will receive SMS updates with driver details.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Contact list */}
      <Typography
        variant="caption"
        sx={{
          mb: 1,
          display: "block",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: (theme) => theme.palette.text.secondary
        }}
      >
        My contacts
      </Typography>

      <Box sx={{ mb: 2.5 }}>
        {CONTACTS.map((c) => (
          <ContactCard
            key={c.id}
            contact={c}
            selected={selectedContact}
            onSelect={setSelectedContact}
          />
        ))}
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
        Use this contact
      </Button>
    </Box>
  );
}

export default function RiderScreen11SwitchRiderContactSelectedCanvas_v2() {
  const [mode, setMode] = useState("light");
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (theme) => theme.palette.background.default
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
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (theme) =>
              theme.palette.mode === "light"
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

        <MobileShell activeTab="rides">
          <SwitchRiderContactSelectedScreen />
        </MobileShell>
      </Box>
    </ThemeProvider>
  );
}
