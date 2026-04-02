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
  Alert
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { COLORS } from "../constants/colors";

const INCOMING_TRACKING_REQUESTS = [
  {
    id: "XD 123456 F7890",
    name: "Johnathan Doe",
    profileImage: null,
    initials: "JD",
    date: "May 23, 2024",
    status: "received" // "received" or "pending"
  },
  {
    id: "XD 123456 F7891",
    name: "Johnathan Doe",
    profileImage: null,
    initials: "JD",
    date: "May 23, 2024",
    status: "received"
  },
  {
    id: "XD 123456 F7892",
    name: "Johnathan Doe",
    profileImage: null,
    initials: "JD",
    date: "May 23, 2024",
    status: "received"
  },
  {
    id: "XD 123456 F7893",
    name: "Johnathan Doe",
    profileImage: null,
    initials: "JD",
    date: "May 23, 2024",
    status: "received"
  },
  {
    id: "XD 123456 F7090",
    name: "Johnathan Doe",
    profileImage: null,
    initials: "JD",
    date: "May 23, 2024",
    status: "pending"
  },
  {
    id: "XD 123456 F7894",
    name: "Johnathan Doe",
    profileImage: null,
    initials: "JD",
    date: "May 23, 2024",
    status: "pending"
  },
  {
    id: "XD 123456 F7895",
    name: "Sarah Johnson",
    profileImage: null,
    initials: "SJ",
    date: "May 22, 2024",
    status: "pending"
  },
  {
    id: "XD 123456 F7896",
    name: "Michael Chen",
    profileImage: null,
    initials: "MC",
    date: "May 21, 2024",
    status: "pending"
  }
];

function IncomingTrackingRequestsScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("received");
  const [requests, setRequests] = useState(INCOMING_TRACKING_REQUESTS);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "warning" | "info" }>({ open: false, message: "", severity: "success" });
  const greenPrimary = COLORS.green.primary;

  // Filter requests based on active tab
  const filteredRequests = requests.filter(
    (request) => request.status === activeTab
  );

  const handleAccept = (requestId: string): void => {
    // Update request status to "received"
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === requestId ? { ...req, status: "received" } : req
      )
    );
    
    // Show success toast
    setSnackbar({
      open: true,
      message: "Request accepted",
      severity: "success"
    });

    // If we're on pending tab and this was the last pending request, switch to received tab
    if (activeTab === "pending") {
      const remainingPending = requests.filter(
        (req) => req.id !== requestId && req.status === "pending"
      );
      if (remainingPending.length === 0) {
        setTimeout(() => setActiveTab("received"), 500);
      }
    }
  };

  const handleDecline = (requestId: string): void => {
    // Remove the request from the list
    setRequests((prevRequests) =>
      prevRequests.filter((req) => req.id !== requestId)
    );
    
    // Show info toast
    setSnackbar({
      open: true,
      message: "Request declined",
      severity: "info"
    });

    // If we're on pending tab and this was the last pending request, switch to received tab
    if (activeTab === "pending") {
      const remainingPending = requests.filter(
        (req) => req.id !== requestId && req.status === "pending"
      );
      if (remainingPending.length === 0) {
        setTimeout(() => setActiveTab("received"), 500);
      }
    }
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
            sx={{
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "-0.01em",
              textAlign: "center"
            }}
          >
            Incoming Tracking requests
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
        {filteredRequests.length === 0 ? (
          <Typography
            variant="body2"
            sx={{
              mt: 4,
              display: "block",
              textAlign: "center",
              color: "#9CA3AF"
            }}
          >
            {activeTab === "received" 
              ? "You have no received tracking requests."
              : "You have no pending tracking requests."}
          </Typography>
        ) : (
          filteredRequests.map((request, index) => (
            <Box
              key={`${request.id}-${index}`}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 2,
                borderBottom: index < filteredRequests.length - 1 ? "1px solid #E5E7EB" : "none"
              }}
            >
              {/* Left Side: Profile Picture and Info */}
              <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                {/* Profile Picture */}
                <Avatar
                  src={request.profileImage || undefined}
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "#E5E7EB",
                    color: "#6B7280",
                    fontSize: 18,
                    fontWeight: 600
                  }}
                >
                  {request.initials}
                </Avatar>

                {/* User Information */}
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
                    {request.name}
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
                    {request.id}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 12,
                      color: "#9CA3AF",
                      display: "block"
                    }}
                  >
                    {request.date}
                  </Typography>
                </Box>
              </Stack>

              {/* Right Side: Action Buttons */}
              <Stack direction="row" spacing={1.5} alignItems="center">
                {/* Accept Button - Blue Circle with Checkmark */}
                <IconButton
                  onClick={() => handleAccept(request.id)}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "#3B82F6",
                    color: "#FFFFFF",
                    "&:hover": {
                      bgcolor: "#2563EB"
                    }
                  }}
                >
                  <CheckRoundedIcon sx={{ fontSize: 20 }} />
                </IconButton>

                {/* Decline Button - Grey Circle with X */}
                <IconButton
                  onClick={() => handleDecline(request.id)}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "#E5E7EB",
                    color: "#6B7280",
                    "&:hover": {
                      bgcolor: "#D1D5DB"
                    }
                  }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Stack>
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
            bgcolor: snackbar.severity === "success" ? greenPrimary : "#3B82F6",
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

export default function RiderScreen56IncomingTrackingRequestsCanvas_v2() {
  return (
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (t) => t.palette.background.default }}>

        <IncomingTrackingRequestsScreen />
      
    </Box>
  );
}
