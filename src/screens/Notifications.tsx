import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Badge
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../components/DarkModeToggle";
import MobileShell from "../components/MobileShell";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "ride" | "delivery" | "wallet" | "system";
  read: boolean;
  details?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: "Trip completed!",
    message: "Your ride to Ndeeba town has ended. Rate your driver.",
    details: "Your trip with Tim Smith in the Tesla Model Y (UPS 256 256) was completed successfully at 12:45 PM. Total fare: UGX 20,565.",
    time: "2 mins ago",
    type: "ride",
    read: false
  },
  {
    id: 2,
    title: "Package delivered",
    message: "John Doe has received the parcel DLV-2025-10-07.",
    details: "The parcel containing 'Electronics Spare Parts' has been delivered and signed for by John Doe at the EVzone Hub. Tracking ID: DLV-2025-10-07-001.",
    time: "1 hour ago",
    type: "delivery",
    read: true
  },
  {
    id: 3,
    title: "Wallet recharge",
    message: "Successfully added UGX 50,000 to your wallet.",
    details: "Your wallet has been credited with UGX 50,000 via Mobile Money (256700000000). Transaction ID: TXN-WLT-998273.",
    time: "Yesterday",
    type: "wallet",
    read: true
  },
  {
    id: 4,
    title: "Upcoming ride",
    message: "Don't forget your scheduled ride tomorrow at 10:00 AM.",
    details: "Reminder: You have a scheduled ride from Kansanga to Entebbe Airport tomorrow at 10:00 AM. Driver will arrive 5 mins early.",
    time: "2 days ago",
    type: "ride",
    read: true
  }
];

function NotificationsScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [tabValue, setTabValue] = useState(0);
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleOpenDetail = (notif: NotificationItem) => {
    setSelectedNotif(notif);
    if (!notif.read) {
      markAsRead(notif.id);
    }
  };

  const handleCloseDetail = () => {
    setSelectedNotif(null);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "ride": return <DirectionsCarRoundedIcon sx={{ color: "#03CD8C" }} />;
      case "delivery": return <LocalShippingRoundedIcon sx={{ color: "#3B82F6" }} />;
      case "wallet": return <AccountBalanceWalletRoundedIcon sx={{ color: "#F59E0B" }} />;
      default: return <NotificationsActiveRoundedIcon sx={{ color: "text.secondary" }} />;
    }
  };

  const displayedNotifications = tabValue === 0 
    ? notifications.filter(n => !n.read) 
    : notifications;

  return (
    <Box sx={{ p: 0 }}>
      {/* Header */}
      <Box sx={{ px: 2.5, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            size="small"
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: (theme) => theme.palette.mode === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.1)" }
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Notifications
          </Typography>
        </Box>
        <Badge badgeContent={unreadCount} color="error" sx={{ mr: 1 }}>
          <NotificationsActiveRoundedIcon color="action" />
        </Badge>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", px: 1 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab 
            label={unreadCount > 0 ? `New (${unreadCount})` : "New"} 
            sx={{ textTransform: "none", fontWeight: tabValue === 0 ? 700 : 500 }} 
          />
          <Tab 
            label="All Activity" 
            sx={{ textTransform: "none", fontWeight: tabValue === 1 ? 700 : 500 }} 
          />
        </Tabs>
      </Box>

      {/* List */}
      <List sx={{ p: 0, pb: 4 }}>
        {displayedNotifications.length === 0 ? (
          <Box sx={{ py: 10, textAlign: "center", opacity: 0.6 }}>
            <NotificationsActiveRoundedIcon sx={{ fontSize: 48, mb: 1, color: "text.disabled" }} />
            <Typography variant="body2">No {tabValue === 0 ? "new" : ""} notifications yet.</Typography>
          </Box>
        ) : (
          displayedNotifications.map((notif, index) => (
            <React.Fragment key={notif.id}>
              <ListItem
                alignItems="flex-start"
                onClick={() => handleOpenDetail(notif)}
                sx={{
                  py: 2,
                  px: 2.5,
                  bgcolor: notif.read ? "transparent" : (theme) => 
                    theme.palette.mode === "light" ? "rgba(3,205,140,0.05)" : "rgba(3,205,140,0.1)",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                  "&:hover": { bgcolor: (theme) => theme.palette.mode === "light" ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)" }
                }}
              >
                <ListItemAvatar sx={{ minWidth: 56 }}>
                  <Avatar sx={{ 
                    bgcolor: (theme) => theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.8)", 
                    border: "1px solid rgba(0,0,0,0.1)" 
                  }}>
                    {getIcon(notif.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {notif.title}
                      </Typography>
                      {!notif.read && (
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: "50%", 
                          bgcolor: "#03CD8C",
                          boxShadow: "0 0 8px rgba(3,205,140,0.6)"
                        }} />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.primary" sx={{ my: 0.5, fontSize: 13, opacity: notif.read ? 0.8 : 1 }}>
                        {notif.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {notif.time}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < displayedNotifications.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))
        )}
      </List>

      {/* Detail Dialog */}
      <Dialog 
        open={!!selectedNotif} 
        onClose={handleCloseDetail}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {selectedNotif?.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {selectedNotif?.time}
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            {selectedNotif?.details || selectedNotif?.message}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCloseDetail} 
            variant="contained" 
            fullWidth
            sx={{ 
              borderRadius: 999, 
              bgcolor: "#03CD8C",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { bgcolor: "#02b57b" }
            }}
          >
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function Notifications() {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <DarkModeToggle />
      <MobileShell>
        <NotificationsScreen />
      </MobileShell>
    </Box>
  );
}
