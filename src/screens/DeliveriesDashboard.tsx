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
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem
} from "@mui/material";

import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Badge from "@mui/material/Badge";

import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";
import DeliveryCard from "../components/deliveries/DeliveryCard";
import { COLORS } from "../constants/colors";

// Types for orders
interface SenderInfo {
  city: string;
  code: string;
  icon: string;
  name: string;
  avatar: string;
  address: string;
  profileImage?: string | null;
}

interface ReceiverInfo {
  city: string;
  code: string;
  icon: string;
}

interface DeliveringOrder {
  id: string;
  packageName: string;
  sender: SenderInfo;
  receiver: ReceiverInfo;
  date: Date;
  status: string;
  progress: number;
}

interface ReceivedOrder {
  id: string;
  packageName: string;
  sender: { city: string; code: string; icon: string; name: string; avatar: string; profileImage: string | null };
  receiver: { city: string; code: string; icon: string };
  time: string;
  status: string;
  progress: number;
  needsPayment: boolean;
  paymentMethod?: "gateway" | "cash" | null;
}

// Initial delivering orders
const INITIAL_DELIVERING_ORDERS: DeliveringOrder[] = [
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
    date: new Date(2024, 1, 7),
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
    date: new Date(2024, 1, 8),
    status: "Waiting to accept",
    progress: 20
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
    date: new Date(2024, 1, 9),
      status: "Waiting to accept",
      progress: 10
    }
  ];

// Initial received/accepted orders
const INITIAL_RECEIVED_ORDERS: ReceivedOrder[] = [
    {
      id: "WC12564899",
      packageName: "The Pair of Sneakers",
      sender: { city: "Atlanta", code: "5243", icon: "A", name: "John Doe", avatar: "JD", profileImage: null },
      receiver: { city: "Chicago", code: "6342", icon: "C" },
      time: "2 day – 3 days",
      status: "Waiting to collect",
      progress: 100,
    needsPayment: true,
    paymentMethod: null
    },
    {
      id: "WC12564901",
      packageName: "Electronics Package",
      sender: { city: "Kampala", code: "256", icon: "K", name: "Peter W.", avatar: "PW", profileImage: null },
      receiver: { city: "Entebbe", code: "256", icon: "E" },
      time: "3 days – 5 days",
      status: "Waiting to collect",
      progress: 100,
    needsPayment: true,
    paymentMethod: null
  },
  {
    id: "WC12564902",
    packageName: "Clothing Bundle",
    sender: { city: "Makerere", code: "256", icon: "M", name: "Mary K.", avatar: "MK", profileImage: null },
    receiver: { city: "Nsambya", code: "256", icon: "N" },
    time: "1 day – 2 days",
    status: "Delivered",
    progress: 100,
    needsPayment: false,
    paymentMethod: "gateway"
    }
  ];

function DeliveryDashboardHomeScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("delivering");
  const [menuAnchor, setMenuAnchor] = useState<{ open: boolean; anchorEl: HTMLElement | null; orderId: string | null }>({ 
    open: false, 
    anchorEl: null, 
    orderId: null 
  });
  const [trackingNumber, setTrackingNumber] = useState<string>("");

  // Stateful orders so accept/reject updates in-place
  const [deliveringOrders, setDeliveringOrders] = useState<DeliveringOrder[]>(INITIAL_DELIVERING_ORDERS);
  const [receivedOrders, setReceivedOrders] = useState<ReceivedOrder[]>(INITIAL_RECEIVED_ORDERS);
  
  // Toggle for showing/hiding delivered (completed) items
  const [showDelivered, setShowDelivered] = useState(false);

  const greenPrimary = COLORS.green.primary;
  const greenSecondary = COLORS.green.secondary;

  // Counts
  const pendingDeliveriesCount = deliveringOrders.filter(
    (order) => order.status === "Waiting to accept"
  ).length;
  const activeDeliveriesCount = deliveringOrders.length;
  
  // Separate received orders into active (not delivered) and delivered
  const activeReceivedOrders = receivedOrders.filter(o => o.status !== "Delivered");
  const deliveredOrders = receivedOrders.filter(o => o.status === "Delivered");
  const activeReceivedCount = activeReceivedOrders.length;

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
    handleMenuClose();
    navigate("/deliveries/invitations");
  };

  const handleShare = (): void => {
    console.log("Share for order:", menuAnchor.orderId);
    handleMenuClose();
  };

  const handleTrackShipment = () => {
    if (trackingNumber.trim()) {
      const searchId = trackingNumber.trim();
      // Look up order in both delivering and received lists
      const fromDelivering = deliveringOrders.find(o => o.id === searchId);
      const fromReceived = receivedOrders.find(o => o.id === searchId);
      const matchedOrder = fromDelivering
        ? {
            id: fromDelivering.id,
            packageName: fromDelivering.packageName,
            sender: fromDelivering.sender,
            receiver: fromDelivering.receiver,
            date: fromDelivering.date.toISOString(),
            status: fromDelivering.status,
            progress: fromDelivering.progress,
            source: "incoming" as const
          }
        : fromReceived
        ? {
            id: fromReceived.id,
            packageName: fromReceived.packageName,
            sender: fromReceived.sender,
            receiver: fromReceived.receiver,
            time: fromReceived.time,
            status: fromReceived.status,
            progress: fromReceived.progress,
            needsPayment: fromReceived.needsPayment,
            paymentMethod: fromReceived.paymentMethod,
            source: "accepted" as const
          }
        : null;

      navigate(`/deliveries/tracking/${searchId}/details`, {
        state: { trackingNumber: searchId, order: matchedOrder }
      });
    }
  };

  // Make payment via gateway — after payment, mark as paid and hide Make Payment button
  const handleMakePayment = (orderId: string, method: "gateway" | "cash"): void => {
    if (method === "cash") {
      // Cash: just record it, payment stays active (user pays driver directly)
      // Nothing changes — the Make Payment button remains visible for cash
      return;
    }
    // Gateway payment: navigate to payment, then on return mark as paid
    setReceivedOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, needsPayment: false, paymentMethod: "gateway" }
          : order
      )
    );
    // Simulate navigating to payment gateway and returning
    navigate("/rides/payment", {
      state: {
        type: "delivery",
        orderId: orderId,
        fromDelivery: true
      }
    });
  };

  // Simple make payment handler that shows payment options
  const handleMakePaymentClick = (orderId: string): void => {
    // Navigate to payment — on success it will mark as paid
    // For simulation, we mark as paid via gateway immediately
    setReceivedOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, needsPayment: false, paymentMethod: "gateway" }
          : order
      )
    );
    navigate("/rides/payment", {
      state: {
        type: "delivery",
        orderId: orderId,
        fromDelivery: true
      }
    });
  };

  // Accept delivery: remove from Incoming Deliveries and add to Accepted Deliveries
  const handleAcceptDelivery = (orderId: string): void => {
    const order = deliveringOrders.find(o => o.id === orderId);
    if (order) {
      // Remove from delivering
      setDeliveringOrders(prev => prev.filter(o => o.id !== orderId));
      // Add to received/accepted orders
      const newReceivedOrder: ReceivedOrder = {
        id: order.id,
        packageName: order.packageName,
        sender: {
          city: order.sender.city,
          code: order.sender.code,
          icon: order.sender.icon,
          name: order.sender.name,
          avatar: order.sender.avatar,
          profileImage: order.sender.profileImage || null
        },
        receiver: {
          city: order.receiver.city,
          code: order.receiver.code,
          icon: order.receiver.icon
        },
        time: "1 day – 3 days",
        status: "Waiting to collect",
        progress: 100,
        needsPayment: true,
        paymentMethod: null
      };
      setReceivedOrders(prev => [newReceivedOrder, ...prev]);
    }
  };

  // Reject delivery IN-PLACE: remove from list
  const handleRejectDelivery = (orderId: string): void => {
    if (window.confirm("Are you sure you want to reject this delivery?")) {
      setDeliveringOrders(prev => prev.filter(order => order.id !== orderId));
    }
  };

  // Mark a received order as delivered (hide it)
  const handleMarkDelivered = (orderId: string): void => {
    setReceivedOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: "Delivered", needsPayment: false }
          : order
      )
    );
  };

  // Toggle delivered items visibility
  const handleToggleDelivered = () => {
    setShowDelivered(prev => !prev);
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
              Make deliveries, track EV riders, and see incoming packages
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
              Create new delivery
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* Active summary - Dynamic counts */}
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
                {activeDeliveriesCount} incoming • {activeReceivedCount} accepted • {deliveredOrders.length} completed
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

        </CardContent>
      </Card>

      {/* Track Deliveries and Shipments Section */}
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
          Track deliveries and shipments
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1.5, display: "block" }}
          >
            Type your tracking number and find your order.
          </Typography>
          <TextField
          id="tracking-input"
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

      {/* Tabs: Incoming Deliveries / Accepted Deliveries */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          mb: 2,
          "& .MuiTab-root": {
            textTransform: "none",
            fontSize: 12,
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
              Incoming Deliveries
            </Badge>
          }
        />
        <Tab
          value="received"
          label={
            <Badge
              badgeContent={activeReceivedCount}
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
              Accepted Deliveries
            </Badge>
          }
        />
      </Tabs>

      {/* Delivery Cards - Incoming Deliveries Tab */}
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
                  No incoming deliveries
                </Typography>
                <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary" }}>
                  New delivery requests will appear here
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {/* Delivery Cards - Accepted Deliveries Tab */}
      {activeTab === "received" && (
        <Box sx={{ mb: 2 }}>
          {/* Active (non-delivered) accepted orders */}
          {activeReceivedOrders.length > 0 ? (
            activeReceivedOrders.map((order) => (
              <DeliveryCard
                key={order.id}
                order={order}
                variant="received"
                onMenuClick={handleMenuOpen}
                onMakePayment={order.paymentMethod === "gateway" ? undefined : handleMakePaymentClick}
                onMarkDelivered={!order.needsPayment || order.paymentMethod === "gateway" ? handleMarkDelivered : undefined}
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
                  No accepted deliveries
                </Typography>
                <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary" }}>
                  Accept incoming deliveries to see them here
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Show/Hide Delivered Button */}
          {deliveredOrders.length > 0 && (
            <Button
              fullWidth
              variant="outlined"
              startIcon={showDelivered ? <VisibilityOffRoundedIcon sx={{ fontSize: 18 }} /> : <VisibilityRoundedIcon sx={{ fontSize: 18 }} />}
              onClick={handleToggleDelivered}
              sx={{
                mt: 1,
                mb: 1.5,
                borderRadius: 2,
                py: 1,
                fontSize: 13,
                fontWeight: 600,
                textTransform: "none",
                borderColor: (t) =>
                  t.palette.mode === "light"
                    ? "rgba(209,213,219,0.9)"
                    : "rgba(51,65,85,0.9)",
                color: (t) => t.palette.text.secondary,
                "&:hover": {
                  borderColor: greenPrimary,
                  color: greenPrimary,
                  bgcolor: "rgba(3,205,140,0.08)"
                }
              }}
            >
              {showDelivered
                ? `Hide delivered (${deliveredOrders.length})`
                : `Show delivered (${deliveredOrders.length})`}
            </Button>
          )}

          {/* Delivered orders - only shown when toggled */}
          {showDelivered && deliveredOrders.length > 0 && (
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: (t) => t.palette.text.secondary,
                  mb: 1.5,
                  display: "block"
                }}
              >
                Delivered & Completed
              </Typography>
              {deliveredOrders.map((order) => (
                <Box key={order.id} sx={{ opacity: 0.7 }}>
                  <DeliveryCard
                    order={order}
                    variant="received"
                    onMenuClick={handleMenuOpen}
                    showTruckIcon={false}
                  />
                </Box>
              ))}
            </Box>
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

                <Typography
                  variant="caption"
                  sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
                >
        The deliveries dashboard helps you make deliveries in a few taps, track EV
        couriers in real time and stay on top of what's coming to you.
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
