import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from "@mui/material";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ScreenScaffold from "../components/ScreenScaffold";
import DeliveryCard from "../components/deliveries/DeliveryCard";
import ActionGrid from "../components/primitives/ActionGrid";
import AppCard from "../components/primitives/AppCard";
import InlineStat from "../components/primitives/InlineStat";
import ListSection from "../components/primitives/ListSection";
import PrimarySection from "../components/primitives/PrimarySection";
import SectionHeader from "../components/primitives/SectionHeader";
import { uiTokens } from "../design/tokens";

interface DeliveryOrder {
  id: string;
  packageName: string;
  sender: {
    city: string;
    code: string;
    name: string;
    avatar: string;
    address: string;
    profileImage?: string | null;
  };
  receiver: { city: string; code: string };
  date?: Date;
  time?: string;
  status: string;
  progress: number;
  needsPayment?: boolean;
}

const DELIVERING_ORDERS: DeliveryOrder[] = [
  {
    id: "WC12564897",
    packageName: "The Pair of Sneakers",
    sender: {
      city: "Atlanta",
      code: "5243",
      name: "John Doe",
      avatar: "JD",
      address: "123 Main Street, Atlanta, GA 30309, United States"
    },
    receiver: { city: "Chicago", code: "6342" },
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
      name: "Sarah M.",
      avatar: "SM",
      address: "45 Nakasero Road, Kampala, Central Region, Uganda"
    },
    receiver: { city: "Entebbe", code: "256" },
    date: new Date(2024, 1, 8),
    status: "Request accepted",
    progress: 60
  },
  {
    id: "WC12564900",
    packageName: "Gift Box",
    sender: {
      city: "Nairobi",
      code: "254",
      name: "Michael K.",
      avatar: "MK",
      address: "78 Moi Avenue, Nairobi, Kenya"
    },
    receiver: { city: "Kampala", code: "256" },
    date: new Date(2024, 1, 9),
    status: "Waiting to accept",
    progress: 10
  }
];

const RECEIVED_ORDERS: DeliveryOrder[] = [
  {
    id: "WC12564899",
    packageName: "The Pair of Sneakers",
    sender: {
      city: "Atlanta",
      code: "5243",
      name: "John Doe",
      avatar: "JD",
      address: "Atlanta"
    },
    receiver: { city: "Chicago", code: "6342" },
    time: "2 day – 3 days",
    status: "Waiting to collect",
    progress: 100,
    needsPayment: true
  },
  {
    id: "WC12564900",
    packageName: "Clothing Bundle",
    sender: {
      city: "Makerere",
      code: "256",
      name: "Mary K.",
      avatar: "MK",
      address: "Makerere"
    },
    receiver: { city: "Nsambya", code: "256" },
    time: "1 day – 2 days",
    status: "Delivered",
    progress: 100
  },
  {
    id: "WC12564901",
    packageName: "Electronics Package",
    sender: {
      city: "Kampala",
      code: "256",
      name: "Peter W.",
      avatar: "PW",
      address: "Kampala"
    },
    receiver: { city: "Entebbe", code: "256" },
    time: "3 days – 5 days",
    status: "Waiting to collect",
    progress: 100,
    needsPayment: true
  }
];

const RECENT_DELIVERIES = [
  { route: "Nsambya → EV Hub", status: "Delivered", code: "DLV-001", date: "Today • 14:32", type: "sent" },
  { route: "Kampala → Entebbe", status: "In transit", code: "DLV-002", date: "Mon • 11:03", type: "sent" },
  { route: "Makerere → Bugolobi", status: "Delivered", code: "DLV-003", date: "Sun • 09:15", type: "received" }
];

function DeliveryDashboardHomeScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<string>("sending");
  const [activeTab, setActiveTab] = useState<string>("delivering");
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [menuAnchor, setMenuAnchor] = useState<{
    open: boolean;
    anchorEl: HTMLElement | null;
    orderId: string | null;
  }>({
    open: false,
    anchorEl: null,
    orderId: null
  });

  const pendingDeliveriesCount = DELIVERING_ORDERS.filter(
    (order) => order.status === "Waiting to accept"
  ).length;

  const hasRecentDeliveries = RECENT_DELIVERIES.length > 0;

  const handleTrackShipment = (): void => {
    if (trackingNumber.trim()) {
      navigate(`/deliveries/tracking/${trackingNumber.trim()}/details`, {
        state: { trackingNumber: trackingNumber.trim() }
      });
    }
  };

  const handleAcceptDelivery = (orderId: string): void => {
    navigate(`/deliveries/tracking/${orderId}/received`, {
      state: { action: "accept", orderId }
    });
  };

  const handleRejectDelivery = (orderId: string): void => {
    if (window.confirm("Are you sure you want to reject this delivery?")) {
      navigate(`/deliveries/tracking/${orderId}/cancel`, {
        state: { action: "reject", orderId }
      });
    }
  };

  const handleMakePayment = (orderId: string): void => {
    navigate("/rides/payment", {
      state: {
        type: "delivery",
        orderId,
        fromDelivery: true
      }
    });
  };

  return (
    <ScreenScaffold>
      <SectionHeader
        title="Deliveries"
        subtitle="Send parcels, track EV riders, and see incoming packages"
      />

      <PrimarySection variant="warning">
        <SectionHeader
          eyebrow="Delivery control"
          title="We deliver happiness"
          subtitle="Track active operations and create new shipments quickly."
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
            gap: uiTokens.spacing.sm
          }}
        >
          <InlineStat label="Active" value="3" />
          <InlineStat label="Completed" value="5" />
          <InlineStat label="Pending" value={`${pendingDeliveriesCount}`} />
          <InlineStat
            label="Date"
            value={new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric"
            })}
          />
        </Box>
        <Box sx={{ display: "grid", gap: uiTokens.spacing.smPlus, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
          <Button
            variant="contained"
            startIcon={<Inventory2RoundedIcon sx={{ fontSize: 18 }} />}
            onClick={() => navigate("/deliveries/new")}
            sx={{
              bgcolor: uiTokens.colors.warningDeep,
              color: uiTokens.colors.warningInk,
              py: uiTokens.spacing.sm,
              fontSize: 13,
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { bgcolor: uiTokens.colors.warningDeepHover }
            }}
          >
            Create new delivery
          </Button>
          <Button
            variant="outlined"
            startIcon={<TrackChangesRoundedIcon sx={{ fontSize: 18 }} />}
            onClick={() => {
              const el = document.getElementById("tracking-field");
              if (el) el.focus();
            }}
            sx={{
              py: uiTokens.spacing.sm,
              fontSize: 13,
              fontWeight: 600,
              textTransform: "none",
              borderColor: uiTokens.borders.warning,
              color: (t) =>
                t.palette.mode === "light" ? uiTokens.colors.warningTextLight : uiTokens.colors.warningTextDark
            }}
          >
            Track shipment
          </Button>
        </Box>
      </PrimarySection>

      <AppCard variant="muted">
        <SectionHeader
          eyebrow="Track shipment"
          title="Find your order by ID"
          compact
        />
        <TextField
          fullWidth
          id="tracking-field"
          size="small"
          placeholder="Order ID"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          onKeyDown={(e) => {
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
                    width: 32,
                    height: 32,
                    bgcolor: uiTokens.colors.brand,
                    color: uiTokens.colors.white,
                    "&:hover": { bgcolor: uiTokens.colors.brandHover }
                  }}
                >
                  <SearchRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            mt: uiTokens.spacing.sm,
            "& .MuiOutlinedInput-root": {
              bgcolor: uiTokens.surfaces.card,
              "& fieldset": { border: uiTokens.borders.subtle }
            }
          }}
        />
      </AppCard>

      <Box
        sx={{
          display: "grid",
          gap: uiTokens.spacing.lg,
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.35fr) minmax(0, 1fr)" },
          alignItems: "start"
        }}
      >
        <Box>
          <Tabs
            value={activeTab}
            onChange={(_event: React.SyntheticEvent, newValue: string) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{
              mb: uiTokens.spacing.md,
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: 13,
                fontWeight: 600,
                minHeight: 44,
                color: (t) => t.palette.text.secondary
              },
              "& .Mui-selected": {
                color: uiTokens.colors.brand
              },
              "& .MuiTabs-indicator": {
                bgcolor: uiTokens.colors.brand,
                height: 3
              }
            }}
          >
            <Tab
              value="delivering"
              label={
                <Badge badgeContent={pendingDeliveriesCount} color="error">
                  Delivering
                </Badge>
              }
            />
            <Tab
              value="received"
              label={
                <Badge badgeContent={RECEIVED_ORDERS.length} color="error">
                  Received
                </Badge>
              }
            />
          </Tabs>

          <ListSection>
            {(activeTab === "delivering" ? DELIVERING_ORDERS : RECEIVED_ORDERS).map((order) => (
              <DeliveryCard
                key={order.id}
                order={order}
                variant={activeTab === "delivering" ? "delivering" : "received"}
                onMenuClick={(event, orderId) =>
                  setMenuAnchor({ open: true, anchorEl: event.currentTarget, orderId })
                }
                onClick={(id) => navigate(`/deliveries/tracking/${id}/details`)}
                onAccept={handleAcceptDelivery}
                onReject={handleRejectDelivery}
                onMakePayment={handleMakePayment}
                showTruckIcon={activeTab === "received"}
              />
            ))}
          </ListSection>
        </Box>

        <Stack spacing={2}>
          <ActionGrid>
            <AppCard
              variant={viewMode === "sending" ? "warning" : "muted"}
              onClick={() => setViewMode("sending")}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <ArrowUpwardRoundedIcon sx={{ fontSize: 16, color: uiTokens.colors.warning }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ ...uiTokens.text.eyebrow, color: (t) => t.palette.text.secondary }}>
                    Sending
                  </Typography>
                  <Typography variant="body2" sx={{ ...uiTokens.text.itemTitle, mt: uiTokens.spacing.xxs }}>
                    Next: Bugolobi → Makerere
                  </Typography>
                </Box>
              </Stack>
            </AppCard>

            <AppCard
              variant={viewMode === "receiving" ? "brand" : "muted"}
              onClick={() => {
                setViewMode("receiving");
                navigate("/deliveries/tracking/incoming");
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <ArrowDownwardRoundedIcon sx={{ fontSize: 16, color: uiTokens.colors.brand }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ ...uiTokens.text.eyebrow, color: (t) => t.palette.text.secondary }}>
                    Receiving
                  </Typography>
                  <Typography variant="body2" sx={{ ...uiTokens.text.itemTitle, mt: uiTokens.spacing.xxs }}>
                    Arriving: Kansanga → City Centre
                  </Typography>
                </Box>
              </Stack>
            </AppCard>
          </ActionGrid>

          <AppCard>
            <SectionHeader
              eyebrow="Recent"
              title="Recent deliveries"
              action={
                <Button
                  size="small"
                  onClick={() => navigate("/history/all")}
                  sx={{ fontSize: 11, textTransform: "none", color: (t) => t.palette.text.secondary }}
                >
                  View history
                </Button>
              }
              compact
            />
            <ListSection sx={{ mt: uiTokens.spacing.sm }}>
              {hasRecentDeliveries &&
                RECENT_DELIVERIES.map((delivery) => (
                  <Box
                    key={delivery.code}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: uiTokens.spacing.sm,
                      py: uiTokens.spacing.xs,
                      borderBottom: (t) => `1px dashed ${t.palette.divider}`
                    }}
                  >
                    <Stack direction="row" spacing={0.85} alignItems="center" sx={{ flex: 1 }}>
                      {delivery.type === "sent" ? (
                        <ArrowUpwardRoundedIcon sx={{ fontSize: 15, color: uiTokens.colors.warning }} />
                      ) : (
                        <ArrowDownwardRoundedIcon sx={{ fontSize: 15, color: uiTokens.colors.brand }} />
                      )}
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontSize: 12.5, fontWeight: 600 }}>
                          {delivery.route}
                        </Typography>
                        <Typography variant="caption" sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary }}>
                          {delivery.code} • {delivery.date}
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        color:
                          delivery.status === "Delivered"
                            ? uiTokens.colors.successText
                            : uiTokens.colors.amber900
                      }}
                    >
                      {delivery.status}
                    </Typography>
                  </Box>
                ))}
            </ListSection>
          </AppCard>
        </Stack>
      </Box>


      <Menu
        anchorEl={menuAnchor.anchorEl}
        open={menuAnchor.open}
        onClose={() => setMenuAnchor({ open: false, anchorEl: null, orderId: null })}
        PaperProps={{ sx: { minWidth: 160, mt: uiTokens.spacing.xxs } }}
      >
        <MenuItem
          onClick={() => {
            setMenuAnchor({ open: false, anchorEl: null, orderId: null });
            navigate("/deliveries/invitations");
          }}
          sx={{ py: uiTokens.spacing.smPlus }}
        >
          <PersonAddRoundedIcon sx={{ fontSize: 18, mr: uiTokens.spacing.md, color: uiTokens.colors.brand }} />
          <Typography variant="body2" sx={{ fontSize: 13 }}>
            Invite
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            console.log("Share for order:", menuAnchor.orderId);
            setMenuAnchor({ open: false, anchorEl: null, orderId: null });
          }}
          sx={{ py: uiTokens.spacing.smPlus }}
        >
          <ShareRoundedIcon sx={{ fontSize: 18, mr: uiTokens.spacing.md, color: uiTokens.colors.brand }} />
          <Typography variant="body2" sx={{ fontSize: 13 }}>
            Share
          </Typography>
        </MenuItem>
      </Menu>
    </ScreenScaffold>
  );
}

export default function DeliveriesDashboard(): React.JSX.Element {
  return <DeliveryDashboardHomeScreen />;
}
