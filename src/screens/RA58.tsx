import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import MobileShell from "../components/MobileShell";

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

interface Invitation {
  id: string;
  fromName: string;
  initials: string;
  type: string;
  context?: string;
  createdAt?: string;
  profileImage?: string | null;
  status?: string;
}

interface InvitationCardV2Props {
  invitation: Invitation;
}

function InvitationCardV2({ invitation }: InvitationCardV2Props): React.JSX.Element {
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

function InvitationsPendingV2Screen(): React.JSX.Element {
  const navigate = useNavigate();
  return (
    <>
        <Box sx={{ bgcolor: "#03CD8C", px: 2, pt: 2, pb: 2, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              position: "absolute",
              left: 20,
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "#FFFFFF",
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" }
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, letterSpacing: "-0.01em", color: "#FFFFFF" }}
          >
            Invitations – Pending (v2)
          </Typography>
        </Box>
        <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>


      {PENDING_INVITATIONS_V2.length === 0 ? (
        <Typography
          variant="caption"
          sx={{ mx: 7,
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
    </>

  );
}

export default function RiderScreen58InvitationsPendingTabV2Canvas_v2() {
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
          <InvitationsPendingV2Screen />
        </MobileShell>
      </Box>
    
  );
}
