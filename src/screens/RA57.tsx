import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
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
  Alert
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import MobileShell from "../components/MobileShell";
import { COLORS } from "../constants/colors";

const INVITATIONS = [
  {
    id: "INV-001",
    inviteeName: "Johnathan Doe",
    userId: "XD 123456 F7890",
    profileImage: null,
    initials: "JD",
    dateSent: "May 23, 2024",
    status: "pending" // "pending", "accepted", "rejected"
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
  const greenPrimary = COLORS.green.primary;

  // Filter invitations based on active tab
  // For "pending" tab: show invitations sent by user that are pending
  // For "received" tab: show invitations received by user (would need different data structure)
  const filteredInvitations = activeTab === "pending"
    ? invitations.filter((inv) => inv.status === "pending")
    : invitations.filter((inv) => inv.status === "accepted" || inv.status === "rejected");

  const handleWithdraw = (invitationId: string): void => {
    // Remove the invitation from the list
    setInvitations((prevInvitations) =>
      prevInvitations.filter((inv) => inv.id !== invitationId)
    );
    
    // Show success toast
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
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: "#FFFFFF", pb: 8 }}>
      {/* Green Header Section */}
      <Box
        sx={{
          bgcolor: greenPrimary,
          pt: 3,
          pb: 4,
          px: 2.5,
          position: "relative"
        }}
      >
        {/* Top Bar: Back Arrow and Tabs */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          {/* Back Arrow */}
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              color: "#FFFFFF",
              bgcolor: "rgba(255,255,255,0.2)",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.3)"
              }
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>

          {/* Tabs: RECEIVED and PENDING */}
          <Stack direction="row" spacing={1}>
            <Chip
              label="RECEIVED"
              onClick={() => setActiveTab("received")}
              sx={{
                bgcolor: activeTab === "received" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: 11,
                height: 28,
                px: 1,
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.25)"
                }
              }}
            />
            <Chip
              label="PENDING"
              onClick={() => setActiveTab("pending")}
              sx={{
                bgcolor: activeTab === "pending" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: 11,
                height: 28,
                px: 1,
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.25)"
                }
              }}
            />
          </Stack>
        </Stack>

        {/* Centered Envelope Icon and Title */}
        <Stack alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <MailRoundedIcon sx={{ fontSize: 48, color: "#FFFFFF" }} />
          </Box>
          <Typography
            variant="h6"
            sx={{ mx: 7,
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "-0.01em",
              textAlign: "center"
            }}
          >
            Invitations
          </Typography>
        </Stack>
      </Box>

      {/* White Content Area - Scrollable List */}
      <Box
        sx={{
          bgcolor: "#FFFFFF",
          minHeight: "calc(100vh - 220px)",
          maxHeight: "calc(100vh - 220px)",
          overflowY: "auto",
          px: 2.5,
          pt: 2.5
        }}
      >
        {filteredInvitations.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ mx: 7,
              mt: 4,
              display: "block",
              textAlign: "center",
              color: "#9CA3AF"
            }}
          >
            {activeTab === "pending" 
              ? "No pending invitations"
              : "No received invitations"}
          </Typography>
        ) : (
          filteredInvitations.map((invitation, index) => (
            <Box
              key={invitation.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 2,
                borderBottom: index < filteredInvitations.length - 1 ? "1px solid #E5E7EB" : "none"
              }}
            >
              {/* Left Side: Profile Picture and Info */}
              <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                {/* Profile Picture */}
                <Avatar
                  src={invitation.profileImage || undefined}
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "#E5E7EB",
                    color: "#6B7280",
                    fontSize: 18,
                    fontWeight: 600
                  }}
                >
                  {invitation.initials}
                </Avatar>

                {/* Invitee Information */}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#111827",
                      mb: 0.5,
                      letterSpacing: "-0.01em"
                    }}
                  >
                    {invitation.inviteeName}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 12,
                      color: "#9CA3AF",
                      display: "block",
                      mb: 0.25
                    }}
                  >
                    {invitation.userId}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 12,
                      color: "#9CA3AF",
                      display: "block"
                    }}
                  >
                    {invitation.dateSent}
                  </Typography>
                </Box>
              </Stack>

              {/* Right Side: Status or Withdraw Button */}
              <Box sx={{ ml: 2 }}>
                {invitation.status === "pending" ? (
                  <Button
                    variant="contained"
                    onClick={() => handleWithdraw(invitation.id)}
                    sx={{
                      bgcolor: "#3B82F6",
                      color: "#FFFFFF",
                      borderRadius: 2,
                      px: 2,
                      py: 0.75,
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: "none",
                      minWidth: 100,
                      "&:hover": {
                        bgcolor: "#2563EB"
                      }
                    }}
                  >
                    Withdraw
                  </Button>
                ) : invitation.status === "accepted" ? (
                  <Chip
                    label="ACCEPTED"
                    sx={{
                      bgcolor: greenPrimary,
                      color: "#FFFFFF",
                      fontWeight: 700,
                      fontSize: 11,
                      height: 32,
                      px: 1.5
                    }}
                  />
                ) : (
                  <Chip
                    label="REJECTED"
                    sx={{
                      bgcolor: "#EF4444",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      fontSize: 11,
                      height: 32,
                      px: 1.5
                    }}
                  />
                )}
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* Toast Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            bgcolor: greenPrimary,
            color: "#FFFFFF",
            "& .MuiAlert-icon": {
              color: "#FFFFFF"
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
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
