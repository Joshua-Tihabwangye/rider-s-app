import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Card,
  CardContent
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import ContactSupportRoundedIcon from "@mui/icons-material/ContactSupportRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import { uiTokens } from "../design/tokens";

export default function Help(): React.JSX.Element {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);

  const helpItems = [
    {
      icon: <HelpOutlineRoundedIcon />,
      label: "FAQs",
      description: "Frequently asked questions",
      action: () => alert("FAQs coming soon")
    },
    {
      icon: <ContactSupportRoundedIcon />,
      label: "Contact Support",
      description: "Get help from our support team",
      action: () => { window.location.href = "mailto:support@evzone.com"; }
    },
    {
      icon: <EmailRoundedIcon />,
      label: "Email Support",
      description: "support@evzone.com",
      action: () => { window.location.href = "mailto:support@evzone.com"; }
    },
    {
      icon: <PhoneRoundedIcon />,
      label: "Call Support",
      description: "+256 700 000 000",
      action: () => { window.location.href = "tel:+256700000000"; }
    },
    {
      icon: <ChatBubbleOutlineRoundedIcon />,
      label: "Live Chat",
      description: "Chat with us in real-time",
      action: () => setChatOpen(true)
    }
  ];

  return (
    <ScreenScaffold>
      <SectionHeader
        title="Help & Support"
        subtitle="Get help from our team"
        leadingAction={
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 5,
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
        }
      />

      {/* Help List */}
      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.xl,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <List dense sx={{ py: 0 }}>
            {helpItems.map((item, index) => (
              <React.Fragment key={item.label}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={item.action}
                    sx={{
                      py: 1.5,
                      px: 2,
                      "&:hover": {
                        bgcolor: (t) =>
                          t.palette.mode === "light"
                            ? "rgba(0,0,0,0.02)"
                            : "rgba(255,255,255,0.02)"
                      }
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: (t) => t.palette.primary.main
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.label}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          {item.description}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {index < helpItems.length - 1 && (
                  <Divider sx={{ mx: 2, opacity: 0.1 }} />
                )}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Box sx={{ mt: 3 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => setChatOpen(true)}
          sx={{
            borderRadius: uiTokens.radius.xl,
            py: 1.2,
            fontSize: 15,
            fontWeight: 600,
            textTransform: "none",
            bgcolor: "primary.main",
            color: "#020617",
            "&:hover": {
              bgcolor: "#06e29a"
            }
          }}
        >
          Start Live Chat
        </Button>
      </Box>

      {/* Chat Dialog */}
      <Dialog
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        fullScreen
        PaperProps={{
          sx: {
            bgcolor: (theme) => theme.palette.background.default,
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Custom Header */}
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: (theme) => theme.palette.background.paper
          }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <IconButton onClick={() => setChatOpen(false)} size="small">
                <CloseRoundedIcon />
              </IconButton>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                  Live Support
                </Typography>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 500 }}>
                  ● Online
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Chat Messages Area */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ 
              alignSelf: 'flex-start', 
              maxWidth: '80%', 
              bgcolor: (theme) => theme.palette.mode === 'light' ? '#F3F4F6' : 'rgba(255,255,255,0.05)',
              p: 1.5,
              borderRadius: '16px 16px 16px 4px'
            }}>
              <Typography variant="body2">
                Hello! Thanks for reaching out to EVzone support. How can I help you today?
              </Typography>
            </Box>
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: (theme) => theme.palette.background.paper }}>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                placeholder="Type your message..."
                size="small"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 5,
                    bgcolor: (theme) => theme.palette.mode === 'light' ? '#F9FAFB' : 'rgba(255,255,255,0.03)'
                  }
                }}
              />
              <IconButton color="primary" sx={{ 
                bgcolor: 'primary.main', 
                color: '#020617',
                '&:hover': { bgcolor: '#06e29a' }
              }}>
                <SendRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        </Box>
      </Dialog>
    </ScreenScaffold>
  );
}

