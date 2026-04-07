import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Stack,
  Avatar,
  Button,
  Chip,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Divider,
  Tab,
  Tabs
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import { uiTokens } from "../design/tokens";

const INVITATIONS = [
  {
    id: "INV-001",
    inviteeName: "Johnathan Doe",
    userId: "XD 123456 F7890",
    profileImage: null,
    initials: "JD",
    dateSent: "May 23, 2024",
    status: "pending"
  },
  {
    id: "INV-002",
    inviteeName: "Sarah Johnson",
    userId: "XD 123456 F7891",
    profileImage: null,
    initials: "SJ",
    dateSent: "May 22, 2024",
    status: "accepted"
  },
  {
    id: "INV-003",
    inviteeName: "Michael Chen",
    userId: "XD 123456 F7892",
    profileImage: null,
    initials: "MC",
    dateSent: "May 21, 2024",
    status: "rejected"
  },
  {
    id: "INV-004",
    inviteeName: "Emily Davis",
    userId: "XD 123456 F7893",
    profileImage: null,
    initials: "ED",
    dateSent: "May 20, 2024",
    status: "pending"
  },
  {
    id: "INV-005",
    inviteeName: "David Wilson",
    userId: "XD 123456 F7894",
    profileImage: null,
    initials: "DW",
    dateSent: "May 19, 2024",
    status: "accepted"
  },
  {
    id: "INV-006",
    inviteeName: "Lisa Anderson",
    userId: "XD 123456 F7895",
    profileImage: null,
    initials: "LA",
    dateSent: "May 18, 2024",
    status: "pending"
  }
];

function InvitationsPendingScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const [invitations, setInvitations] = useState(INVITATIONS);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "warning" | "info" }>({ open: false, message: "", severity: "success" });

  const filteredInvitations = activeTab === "pending"
    ? invitations.filter((inv) => inv.status === "pending")
    : invitations.filter((inv) => inv.status === "accepted" || inv.status === "rejected");

  const handleWithdraw = (invitationId: string): void => {
    setInvitations((prevInvitations) =>
      prevInvitations.filter((inv) => inv.id !== invitationId)
    );
    setSnackbar({
      open: true,
      message: "Invitation withdrawn",
      severity: "success"
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ScreenScaffold>
      <SectionHeader
        title="Invitations"
        subtitle="Manage delivery invitations"
        leadingAction={
          <IconButton
            size="small"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 5,
              bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
              border: (t) => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        }
      />

      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) => t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            variant="fullWidth"
            sx={{
              minHeight: 48,
              borderBottom: '1px solid',
              borderColor: 'divider',
              "& .MuiTab-root": {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 14
              }
            }}
          >
            <Tab value="received" label="Received" />
            <Tab value="pending" label="Pending" />
          </Tabs>

          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {filteredInvitations.length === 0 ? (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                  {activeTab === "pending" ? "No pending invitations" : "No received invitations"}
                </Typography>
              ) : (
                filteredInvitations.map((invitation, index) => (
                  <Box key={invitation.id}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={invitation.profileImage || undefined}
                        sx={{ width: 48, height: 48, bgcolor: (t) => t.palette.mode === 'light' ? '#F3F4F6' : 'rgba(255,255,255,0.05)', color: 'text.primary', fontWeight: 600 }}
                      >
                        {invitation.initials}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{invitation.inviteeName}</Typography>
                        <Typography variant="caption" color="text.secondary" display="block">{invitation.userId}</Typography>
                        <Typography variant="caption" color="text.secondary" display="block">{invitation.dateSent}</Typography>
                      </Box>
                      <Box>
                        {invitation.status === "pending" ? (
                          <Button 
                            variant="contained" 
                            size="small" 
                            onClick={() => handleWithdraw(invitation.id)}
                            sx={{ borderRadius: 5, textTransform: 'none', fontWeight: 600, bgcolor: 'primary.main', color: '#020617', "&:hover": { bgcolor: '#06e29a' } }}
                          >
                            Withdraw
                          </Button>
                        ) : (
                          <Chip 
                            size="small" 
                            label={invitation.status.toUpperCase()} 
                            color={invitation.status === "accepted" ? "success" : "error"}
                            sx={{ fontWeight: 700, borderRadius: 5, fontSize: 10 }}
                          />
                        )}
                      </Box>
                    </Stack>
                    {index < filteredInvitations.length - 1 && <Divider sx={{ mt: 2, opacity: 0.1 }} />}
                  </Box>
                ))
              )}
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: uiTokens.radius.xl }}>{snackbar.message}</Alert>
      </Snackbar>
    </ScreenScaffold>
  );
}

export default function RiderScreen57InvitationsPendingTabCanvas_v2() {
  return <InvitationsPendingScreen />;
}
