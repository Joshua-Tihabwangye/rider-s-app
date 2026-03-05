import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  Button
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import ContactSupportRoundedIcon from "@mui/icons-material/ContactSupportRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";

export default function Help(): React.JSX.Element {
  const navigate = useNavigate();

  const helpItems = [
    {
      icon: <HelpOutlineRoundedIcon />,
      label: "FAQs",
      description: "Frequently asked questions"
    },
    {
      icon: <ContactSupportRoundedIcon />,
      label: "Contact Support",
      description: "Get help from our support team"
    },
    {
      icon: <EmailRoundedIcon />,
      label: "Email Support",
      description: "support@evzone.com"
    },
    {
      icon: <PhoneRoundedIcon />,
      label: "Call Support",
      description: "+256 700 000 000"
    },
    {
      icon: <ChatBubbleOutlineRoundedIcon />,
      label: "Live Chat",
      description: "Chat with us in real-time"
    }
  ];

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
        <Box sx={{ bgcolor: "#03CD8C", px: 2.5, pt: 2, pb: 2, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
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
            Help & Support
          </Typography>
        </Box>

        <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>

          {/* Help List */}
          <List
            sx={{
              bgcolor: "transparent",
              "& .MuiListItem-root": {
                px: 0
              }
            }}
          >
            {helpItems.map((item, index) => (
              <React.Fragment key={item.label}>
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      py: 1.5,
                      px: 1.5,
                      bgcolor: (t) =>
                        t.palette.mode === "light"
                          ? "#FFFFFF"
                          : "rgba(15,23,42,0.98)",
                      border: (t) =>
                        t.palette.mode === "light"
                          ? "1px solid rgba(209,213,219,0.9)"
                          : "1px solid rgba(51,65,85,0.9)",
                      "&:hover": {
                        bgcolor: (t) =>
                          t.palette.mode === "light"
                            ? "#F9FAFB"
                            : "rgba(15,23,42,1)",
                        transform: "translateY(-1px)",
                        boxShadow: 2
                      },
                      transition: "all 0.2s ease"
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: "#03CD8C"
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      secondary={item.description}
                    />
                  </ListItemButton>
                </ListItem>
                {index < helpItems.length - 1 && (
                  <Divider sx={{ my: 0.5, opacity: 0.1 }} />
                )}
              </React.Fragment>
            ))}
          </List>

          {/* Quick Actions */}
          <Box sx={{ mt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                borderRadius: 999,
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
        </Box>
      </MobileShell>
    </Box>
  );
}

