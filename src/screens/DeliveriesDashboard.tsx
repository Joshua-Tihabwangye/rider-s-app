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
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem
} from "@mui/material";

import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Badge from "@mui/material/Badge";

import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";
import DeliveryCard from "../components/deliveries/DeliveryCard";
import { COLORS } from "../constants/colors";

function DeliveryDashboardHomeScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [ctaState, setCtaState] = useState<string>("idle");
  const [viewMode, setViewMode] = useState<string>("sending");
  const [activeTab, setActiveTab] = useState<string>("delivering");
  const [menuAnchor, setMenuAnchor] = useState<{ open: boolean; anchorEl: HTMLElement | null; orderId: string | null }>({ 
    open: false, 
    anchorEl: null, 
    orderId: null 
  });
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  // For demo - can be toggled to show empty states
  const hasRecentDeliveries = true;

  const greenPrimary = COLORS.green.primary;
  const greenSecondary = COLORS.green.secondary;

  // Mock delivery orders data - Incoming deliveries
  const deliveringOrders = [
    {
      id: "WC12564897",
      packageName: "The Pair of Sneakers",
      sender: {
        city: "Atlanta",
        code: "5243",
        icon: "A",
        name: "John Doe",
        avatar: "JD",
        address: "123 Main Street, Atlanta, GA 30309, United States"
      },
      receiver: { city: "Chicago", code: "6342", icon: "C" },
      date: new Date(2024, 1, 7), // Feb 7, 2024
      status: "Waiting to accept",
      progress: 20
    },
    {
      id: "WC12564898",
      packageName: "Electronics Package",
      sender: {
        city: "Kampala",
        code: "256",
        icon: "K",
        name: "Sarah M.",
        avatar: "SM",
        address: "45 Nakasero Road, Kampala, Central Region, Uganda"
      },
      receiver: { city: "Entebbe", code: "256", icon: "E" },
      date: new Date(2024, 1, 8), // Feb 8, 2024
      status: "Request accepted",
      progress: 60
    },
    {
      id: "WC12564900",
      packageName: "Gift Box",
      sender: {
        city: "Nairobi",
        code: "254",
        icon: "N",
        name: "Michael K.",
        avatar: "MK",
        address: "78 Moi Avenue, Nairobi, Kenya"
      },
      receiver: { city: "Kampala", code: "256", icon: "K" },
      date: new Date(2024, 1, 9), // Feb 9, 2024
      status: "Waiting to accept",
      progress: 10
    }
  ];

  // Count pending deliveries (Waiting to accept)
  const pendingDeliveriesCount = deliveringOrders.filter(
    (order) => order.status === "Waiting to accept"
  ).length;

  const receivedOrders = [
    {
      id: "WC12564899",
      packageName: "The Pair of Sneakers",
      sender: { city: "Atlanta", code: "5243", icon: "A", name: "John Doe", avatar: "JD", profileImage: null },
      receiver: { city: "Chicago", code: "6342", icon: "C" },
      time: "2 day – 3 days",
      status: "Waiting to collect",
      progress: 100,
      needsPayment: true
    },
    {
      id: "WC12564900",
      packageName: "Clothing Bundle",
      sender: { city: "Makerere", code: "256", icon: "M", name: "Mary K.", avatar: "MK", profileImage: null },
      receiver: { city: "Nsambya", code: "256", icon: "N" },
      time: "1 day – 2 days",
      status: "Delivered",
      progress: 100,
      needsPayment: false
    },
    {
      id: "WC12564901",
      packageName: "Electronics Package",
      sender: { city: "Kampala", code: "256", icon: "K", name: "Peter W.", avatar: "PW", profileImage: null },
      receiver: { city: "Entebbe", code: "256", icon: "E" },
      time: "3 days – 5 days",
      status: "Waiting to collect",
      progress: 100,
      needsPayment: true
    }
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string): void => {
    setActiveTab(newValue);
  };

  const handleCreateNew = () => {
    navigate("/deliveries/new");
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, orderId: string): void => {
    event.stopPropagation();
    setMenuAnchor({ open: true, anchorEl: event.currentTarget, orderId });
  };

  const handleMenuClose = (): void => {
    setMenuAnchor({ open: false, anchorEl: null, orderId: null });
  };

  const handleInvite = () => {
    // Navigate to invitations page
    handleMenuClose();
    navigate("/deliveries/invitations");
  };

  const handleShare = (): void => {
    // Handle share action
    console.log("Share for order:", menuAnchor.orderId);
    handleMenuClose();
  };

  const handleTrackShipment = () => {
    if (trackingNumber.trim()) {
      // Navigate to tracking details page - using the tracking number as orderId
      // The route will handle looking up the order by tracking number
      navigate(`/deliveries/tracking/${trackingNumber.trim()}/details`, {
        state: { trackingNumber: trackingNumber.trim() }
      });
    }
  };

  const handleMakePayment = (orderId: string): void => {
    // Navigate to payment page with delivery context
    navigate("/rides/payment", {
      state: {
        type: "delivery",
        orderId: orderId,
        fromDelivery: true
      }
    });
  };

  const handleAcceptDelivery = (orderId: string): void => {
    // Navigate to acceptance confirmation or tracking
    navigate(`/deliveries/tracking/${orderId}/received`, {
      state: { action: "accept", orderId }
    });
  };

  const handleRejectDelivery = (orderId: string): void => {
    // Show confirmation dialog or navigate to rejection screen
    if (window.confirm("Are you sure you want to reject this delivery?")) {
      // Navigate to rejection screen or update order status
      navigate(`/deliveries/tracking/${orderId}/cancel`, {
        state: { action: "reject", orderId }
      });
    }
  };

  // Date formatting is now handled by utils/dateUtils

  const handleSendParcel = () => {
    setCtaState("send");
  };

  const handleTrackParcel = () => {
    setCtaState("track");
  };

  const handleViewIncoming = () => {
    navigate("/deliveries/tracking/incoming");
  };

  const handleViewHistory = () => {
    setCtaState("history");
  };

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
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 999,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FEF3C7" : "rgba(15,23,42,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <LocalShippingRoundedIcon sx={{ fontSize: 22, color: "#EA580C" }} />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Deliveries
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Send parcels, track EV riders, and see incoming packages
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tagline Section */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            mb: 0.5,
            color: greenPrimary
          }}
        >
          We deliver happiness!
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontSize: 12, color: (t) => t.palette.text.secondary }}
        >
          Make your Order Now.
        </Typography>
      </Box>

      {/* Create New Card */}
      <Card
        elevation={0}
        onClick={handleCreateNew}
        sx={{
          mb: 2.5,
          borderRadius: 2.5,
          cursor: "pointer",
          bgcolor: (t) =>
            t.palette.mode === "light"
              ? "linear-gradient(135deg, rgba(3,205,140,0.1) 0%, rgba(255,255,255,1) 100%)"
              : "linear-gradient(135deg, rgba(3,205,140,0.15) 0%, rgba(15,23,42,0.98) 100%)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(3,205,140,0.2)"
              : "1px solid rgba(3,205,140,0.3)",
          transition: "transform 0.12s ease, box-shadow 0.12s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: 4
          }
        }}
      >
        <CardContent sx={{ px: 2, py: 2 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: greenPrimary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative"
              }}
            >
              <Inventory2RoundedIcon sx={{ fontSize: 24, color: "#FFFFFF" }} />
              <AddRoundedIcon
                sx={{
                  fontSize: 16,
                  color: "#FFFFFF",
                  position: "absolute",
                  bottom: 4,
                  right: 4
                }}
              />
            </Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: (t) => t.palette.text.primary
              }}
            >
              Create new
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* Active summary */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 3,
          bgcolor: (t) =>
            t.palette.mode === "light"
              ? "radial-gradient(circle at top, #FFEDD5, #FFF7ED)"
              : "radial-gradient(circle at top, #7C2D12, #020617)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(248,171,85,0.7)"
              : "1px solid rgba(248,171,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.9, py: 1.9 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1.4 }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Today's deliveries · {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: (t) => t.palette.text.primary
                }}
              >
                3 active • 5 completed
              </Typography>
            </Box>
            <Chip
              size="small"
              icon={<TrackChangesRoundedIcon sx={{ fontSize: 16 }} />}
              label="All EV couriers"
              sx={{
                borderRadius: 999,
                fontSize: 10,
                height: 22,
                bgcolor: (t) =>
                  t.palette.mode === "light"
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(15,23,42,0.96)",
                color: (t) => t.palette.text.primary
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1.25}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Inventory2RoundedIcon sx={{ fontSize: 18 }} />}
              onClick={handleSendParcel}
              sx={{
                borderRadius: 999,
                py: 0.9,
                fontSize: 13,
                fontWeight: 600,
                textTransform: "none",
                bgcolor: "#7C2D12",
                color: "#FFFBEB",
                "&:hover": { bgcolor: "#9A3412" }
              }}
            >
              Send a parcel
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<TrackChangesRoundedIcon sx={{ fontSize: 18 }} />}
              onClick={handleTrackParcel}
              sx={{
                borderRadius: 999,
                py: 0.9,
                fontSize: 13,
                textTransform: "none",
                borderColor: (t) =>
                  t.palette.mode === "light"
                    ? "rgba(120,53,15,0.5)"
                    : "rgba(251,191,36,0.5)",
                color: (t) =>
                  t.palette.mode === "light"
                    ? "rgba(67,20,7,0.9)"
                    : "rgba(251,191,36,0.9)",
                "&:hover": {
                  borderColor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(120,53,15,0.9)"
                      : "rgba(251,191,36,0.9)",
                  bgcolor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(120,53,15,0.06)"
                      : "rgba(251,191,36,0.1)"
                }
              }}
            >
              Track a parcel
            </Button>
          </Stack>

          {ctaState !== "idle" && (
            <Box
              sx={{
                mt: 1.1,
                px: 1.1,
                py: 0.7,
                borderRadius: 2,
                bgcolor: (t) =>
                  t.palette.mode === "light"
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(15,23,42,0.96)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(248,171,85,0.35)"
                    : "1px solid rgba(248,171,85,0.7)"
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
              >
                {ctaState === "send" &&
                  "Next step: open the delivery creation flow with pickup, drop-off and parcel details (RA59)."}
                {ctaState === "track" &&
                  "Next step: open the live tracking view for an active parcel with map, ETA and courier info (RA60–RA63)."}
                {ctaState === "incoming" &&
                  "Switch to incoming view and show parcels that are on the way to you (RA51/RA53/RA54)."}
                {ctaState === "history" &&
                  "Open the full deliveries history, including sent and received parcels (RA50–RA54/RA68)."}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Track Your Shipment Section - Show on both tabs */}
      {(activeTab === "received" || activeTab === "delivering") && (
        <Box sx={{ mb: 2.5 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              mb: 0.5,
              color: (t) => t.palette.text.primary
            }}
          >
            Track your shipment
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1.5, display: "block" }}
          >
            Type your tracking number and find your order.
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Order Id"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleTrackShipment();
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Inventory2RoundedIcon sx={{ fontSize: 20, color: (t) => t.palette.text.secondary }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleTrackShipment}
                    sx={{
                      bgcolor: greenPrimary,
                      color: "#FFFFFF",
                      width: 32,
                      height: 32,
                      "&:hover": {
                        bgcolor: greenSecondary
                      }
                    }}
                  >
                    <SearchRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                "& fieldset": {
                  borderColor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": {
                  borderColor: greenPrimary
                },
                "&.Mui-focused fieldset": {
                  borderColor: greenPrimary
                }
              }
            }}
          />
        </Box>
      )}

      {/* Tabs: Delivering / Received */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          mb: 2,
          "& .MuiTab-root": {
            textTransform: "none",
            fontSize: 13,
            fontWeight: 600,
            minHeight: 44,
            color: (t) => t.palette.text.secondary,
            position: "relative"
          },
          "& .Mui-selected": {
            color: greenPrimary
          },
          "& .MuiTabs-indicator": {
            bgcolor: greenPrimary,
            height: 3,
            borderRadius: "3px 3px 0 0"
          }
        }}
      >
        <Tab
          value="delivering"
          label={
            <Badge
              badgeContent={pendingDeliveriesCount}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  right: -8,
                  top: 4,
                  fontSize: 10,
                  height: 18,
                  minWidth: 18,
                  padding: "0 4px"
                }
              }}
            >
              Delivering
            </Badge>
          }
        />
        <Tab
          value="received"
          label={
            <Badge
              badgeContent={receivedOrders.length}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  right: -8,
                  top: 4,
                  fontSize: 10,
                  height: 18,
                  minWidth: 18,
                  padding: "0 4px"
                }
              }}
            >
              Received
            </Badge>
          }
        />
      </Tabs>

      {/* Delivery Cards - Delivering Tab */}
      {activeTab === "delivering" && (
        <Box sx={{ mb: 2 }}>
          {deliveringOrders.length > 0 ? (
            deliveringOrders.map((order) => (
              <DeliveryCard
                key={order.id}
                order={order}
                variant="delivering"
                onMenuClick={handleMenuOpen}
                onAccept={handleAcceptDelivery}
                onReject={handleRejectDelivery}
              />
            ))
          ) : (
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)"
              }}
            >
              <CardContent sx={{ py: 4, textAlign: "center" }}>
                <Typography variant="caption" sx={{ color: "text.secondary", mb: 1, display: "block" }}>
                  No active deliveries
                </Typography>
                <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary" }}>
                  Create a new order to get started
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {/* Delivery Cards - Received Tab */}
      {activeTab === "received" && (
        <Box sx={{ mb: 2 }}>
          {receivedOrders.length > 0 ? (
            receivedOrders.map((order) => (
              <DeliveryCard
                key={order.id}
                order={order}
                variant="received"
                onMenuClick={handleMenuOpen}
                onMakePayment={handleMakePayment}
                showTruckIcon={true}
              />
            ))
          ) : (
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)"
              }}
            >
              <CardContent sx={{ py: 4, textAlign: "center" }}>
                <Typography variant="caption" sx={{ color: "text.secondary", mb: 1, display: "block" }}>
                  No received deliveries
                </Typography>
                <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary" }}>
                  Completed deliveries will appear here
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {/* Menu for delivery actions */}
      <Menu
        anchorEl={menuAnchor.anchorEl}
        open={menuAnchor.open}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 160,
            mt: 0.5
          }
        }}
      >
        <MenuItem onClick={handleInvite} sx={{ py: 1.25 }}>
          <PersonAddRoundedIcon sx={{ fontSize: 18, mr: 1.5, color: greenPrimary }} />
          <Typography variant="body2" sx={{ fontSize: 13 }}>
            Invite
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleShare} sx={{ py: 1.25 }}>
          <ShareRoundedIcon sx={{ fontSize: 18, mr: 1.5, color: greenPrimary }} />
          <Typography variant="body2" sx={{ fontSize: 13 }}>
            Share
          </Typography>
        </MenuItem>
      </Menu>

      {/* Sending vs Receiving tiles */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.7 }}>
          <Stack direction="row" spacing={1.3}>
            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor:
                  viewMode === "sending"
                    ? (t) =>
                        t.palette.mode === "light"
                          ? "#FEF3C7"
                          : "rgba(15,23,42,0.96)"
                    : (t) =>
                        t.palette.mode === "light"
                          ? "#F9FAFB"
                          : "rgba(15,23,42,0.96)",
                border:
                  viewMode === "sending"
                    ? (t) =>
                        t.palette.mode === "light"
                          ? "1px solid rgba(245,158,11,0.7)"
                          : "1px solid rgba(251,191,36,0.7)"
                    : (t) =>
                        t.palette.mode === "light"
                          ? "1px solid rgba(209,213,219,0.9)"
                          : "1px solid rgba(51,65,85,0.9)"
              }}
              onClick={() => setViewMode("sending")}
            >
              <CardContent sx={{ px: 1.4, py: 1.3, position: "relative" }}>
                <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.5 }}>
                  <ArrowUpwardRoundedIcon
                    sx={{ fontSize: 16, color: "#F59E0B", transform: "rotate(45deg)" }}
                  />
                <Typography
                  variant="caption"
                    sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Sending
                </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em", mb: 0.25 }}
                >
                  Next: Bugolobi → Makerere
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
                >
                  ETA 14:32
                </Typography>
                <ArrowForwardIosRoundedIcon
                  sx={{
                    fontSize: 14,
                    color: (t) => t.palette.text.secondary,
                    opacity: 0.5,
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)"
                  }}
                />
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor:
                  viewMode === "receiving"
                    ? (t) =>
                        t.palette.mode === "light"
                          ? "#EFF6FF"
                          : "rgba(15,23,42,0.96)"
                    : (t) =>
                        t.palette.mode === "light"
                          ? "#F9FAFB"
                          : "rgba(15,23,42,0.96)",
                border:
                  viewMode === "receiving"
                    ? (t) =>
                        t.palette.mode === "light"
                          ? "1px solid rgba(59,130,246,0.6)"
                          : "1px solid rgba(59,130,246,0.7)"
                    : (t) =>
                        t.palette.mode === "light"
                          ? "1px solid rgba(209,213,219,0.9)"
                          : "1px solid rgba(51,65,85,0.9)"
              }}
              onClick={handleViewIncoming}
            >
              <CardContent sx={{ px: 1.4, py: 1.3, position: "relative" }}>
                <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.5 }}>
                  <ArrowDownwardRoundedIcon
                    sx={{ fontSize: 16, color: "#03CD8C", transform: "rotate(-45deg)" }}
                  />
                <Typography
                  variant="caption"
                    sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Receiving
                </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em", mb: 0.25 }}
                >
                  Arriving: Kansanga → City centre
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
                >
                  Arriving today
                </Typography>
                <ArrowForwardIosRoundedIcon
                  sx={{
                    fontSize: 14,
                    color: (t) => t.palette.text.secondary,
                    opacity: 0.5,
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)"
                  }}
                />
              </CardContent>
            </Card>
          </Stack>
        </CardContent>
      </Card>

      {/* Recent deliveries */}
      <Card
        elevation={0}
        sx={{
          mb: 1.5,
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
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Stack direction="row" spacing={0.75} alignItems="center">
              <LocalMallRoundedIcon
                sx={{ fontSize: 18, color: (t) => t.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Recent deliveries
              </Typography>
            </Stack>
            <Button
              variant="text"
              size="small"
              onClick={handleViewHistory}
              sx={{
                fontSize: 10.5,
                color: (t) => t.palette.text.secondary,
                textTransform: "none",
                minWidth: "auto",
                px: 1,
                py: 0.5,
                "&:hover": {
                  bgcolor: (t) =>
                    t.palette.mode === "light" ? "rgba(3,205,140,0.08)" : "rgba(3,205,140,0.15)",
                  color: "#03CD8C"
                }
              }}
            >
              View history
            </Button>
          </Stack>
          <Divider sx={{ mb: 1, borderColor: (t) => t.palette.divider }} />

          {hasRecentDeliveries ? (
            [
              { route: "Nsambya → EV Hub", status: "Delivered", code: "DLV-001", date: "Today • 14:32", type: "sent" },
              { route: "Kampala → Entebbe", status: "In transit", code: "DLV-002", date: "Mon • 11:03", type: "sent" },
              { route: "Makerere → Bugolobi", status: "Delivered", code: "DLV-003", date: "Sun • 09:15", type: "received" }
            ].map((delivery, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 0.6,
                "&:not(:last-of-type)": {
                  borderBottom: (t) => `1px dashed ${t.palette.divider}`
                }
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
                {delivery.type === "sent" ? (
                  <ArrowUpwardRoundedIcon
                    sx={{ fontSize: 16, color: "#F59E0B", transform: "rotate(45deg)" }}
                  />
                ) : (
                  <ArrowDownwardRoundedIcon
                    sx={{ fontSize: 16, color: "#03CD8C", transform: "rotate(-45deg)" }}
                  />
                )}
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.25 }}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: 12.5, fontWeight: 500, letterSpacing: "-0.01em" }}
                >
                      {delivery.route}
                </Typography>
                    <Chip
                      label={delivery.status}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: 9,
                        fontWeight: 600,
                        bgcolor: delivery.status === "Delivered" ? "#D1FAE5" : "#FEF3C7",
                        color: delivery.status === "Delivered" ? "#064E3B" : "#78350F"
                      }}
                    />
                  </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
                >
                    {delivery.code} • {delivery.date}
                </Typography>
              </Box>
              </Stack>
              <ArrowForwardIosRoundedIcon
                sx={{ fontSize: 14, color: (t) => t.palette.text.secondary, opacity: 0.5 }}
              />
            </Box>
            ))
          ) : (
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{ fontSize: 12, color: (t) => t.palette.text.secondary, mb: 1 }}
              >
                No recent deliveries
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary, mb: 2, display: "block" }}
              >
                Send a parcel or track one using its code
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={handleSendParcel}
                sx={{
                  bgcolor: "#03CD8C",
                  color: "#FFFFFF",
                  borderRadius: 999,
                  px: 2.5,
                  py: 0.75,
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#22C55E"
                  }
                }}
              >
                Send a parcel
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
      >
        The deliveries dashboard helps you send parcels in a few taps, track EV
        couriers in real time and stay on top of what’s coming to you.
      </Typography>
    </Box>
  );
}

export default function DeliveriesDashboard(): React.JSX.Element {
  return (
    <>
      <DarkModeToggle />
      <MobileShell>
        <DeliveryDashboardHomeScreen />
      </MobileShell>
    </>
  );
}
