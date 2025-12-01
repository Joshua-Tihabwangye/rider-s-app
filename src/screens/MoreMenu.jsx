import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from "@mui/material";

import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";

export default function MoreMenu() {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: <HistoryRoundedIcon />,
      label: "All Orders History",
      description: "View all rides, deliveries, rentals, tours & ambulance",
      route: "/history/all"
    },
    {
      icon: <SchoolRoundedIcon />,
      label: "School Shuttles",
      description: "Book and track school shuttles",
      route: "/school-handoff"
    },
    {
      icon: <SettingsRoundedIcon />,
      label: "Settings",
      description: "App preferences and account settings",
      route: "/settings"
    },
    {
      icon: <HelpRoundedIcon />,
      label: "Help & Support",
      description: "Get help and contact support",
      route: "/help"
    },
    {
      icon: <InfoRoundedIcon />,
      label: "About",
      description: "App version and information",
      route: "/about"
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
        <Box sx={{ px: 2.5, pt: 3, pb: 3 }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                letterSpacing: "-0.01em",
                mb: 0.5
              }}
            >
              More
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: 12,
                color: (t) => t.palette.text.secondary
              }}
            >
              Settings, history, help and more
            </Typography>
          </Box>

          {/* Menu List */}
          <List
            sx={{
              bgcolor: "transparent",
              "& .MuiListItem-root": {
                px: 0
              }
            }}
          >
            {menuItems.map((item, index) => (
              <React.Fragment key={item.route}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate(item.route);
                    }}
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
                        color: (t) =>
                          t.palette.mode === "light"
                            ? "#03CD8C"
                            : "#03CD8C"
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            letterSpacing: "-0.01em"
                          }}
                        >
                          {item.label}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: 11,
                            color: (t) => t.palette.text.secondary,
                            mt: 0.25
                          }}
                        >
                          {item.description}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {index < menuItems.length - 1 && (
                  <Divider
                    sx={{
                      my: 0.5,
                      opacity: 0.1
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </MobileShell>
    </Box>
  );
}

