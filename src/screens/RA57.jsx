import React from "react";
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
  Button,
  Avatar
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import MobileShell from "../components/MobileShell";

const PENDING_INVITATIONS = [
  {
    id: "INV-001",
    fromName: "Mary Immaculate",
    initials: "MI",
    context: "Shared delivery – Groceries from Nsambya Market",
    createdAt: "Today • 02:15 PM"
  },
  {
    id: "INV-002",
    fromName: "John Doe",
    initials: "JD",
    context: "Contact invite – Family & friends",
    createdAt: "Yesterday • 11:40 AM"
  },
  {
    id: "INV-003",
    fromName: "EVzone Marketplace",
    initials: "EV",
    context: "Shared delivery – EV accessories",
    createdAt: "Mon • 04:05 PM"
  }
];

function InvitationCard({ invitation }) {
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
                width: 36,
                height: 36,
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
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                {invitation.context}
              </Typography>
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

        <Stack direction="row" spacing={1.25} sx={{ mt: 1.4 }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<PersonAddAltRoundedIcon sx={{ fontSize: 16 }} />}
            sx={{
              borderRadius: 999,
              fontSize: 12,
              textTransform: "none",
              py: 0.6,
              bgcolor: "primary.main",
              color: "#020617",
              "&:hover": { bgcolor: "#06e29a" }
            }}
          >
            Accept
          </Button>
          <Button
            size="small"
            variant="text"
            sx={{
              borderRadius: 999,
              fontSize: 12,
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

function InvitationsPendingScreen() {
  const navigate = useNavigate();
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
              Invitations – Pending
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Requests to join shared deliveries or contacts
            </Typography>
          </Box>
        </Box>
      </Box>

      {PENDING_INVITATIONS.length === 0 ? (
        <Typography
          variant="caption"
          sx={{ mt: 4, display: "block", textAlign: "center", color: (t) => t.palette.text.secondary }}
        >
          You have no pending invitations.
        </Typography>
      ) : (
        PENDING_INVITATIONS.map((inv) => (
          <InvitationCard key={inv.id} invitation={inv} />
        ))
      )}
    </Box>
  );
}

export default function RiderScreen57InvitationsPendingTabCanvas_v2() {
      return (
    
      
      <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (t) => t.palette.background.default }}>
        

        <DarkModeToggle />

        

        <MobileShell>
          <InvitationsPendingScreen />
        </MobileShell>
      </Box>
    
  );
}
