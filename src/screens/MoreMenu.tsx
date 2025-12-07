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
  Divider,
  Avatar,
  Card,
  CardContent,
  Stack
} from "@mui/material";

import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";

export default function MoreMenu(): JSX.Element {
  const navigate = useNavigate();

  const accountItems = [
    {
      icon: <HistoryRoundedIcon />,
      label: "All Orders History",
      description: "View all rides, deliveries, rentals, tours & ambulance",
      route: "/history/all"
    },
    {
      icon: <MailRoundedIcon />,
      label: "Invitations",
      description: "Manage sent and received invitations",
      route: "/deliveries/invitations"
    },
    {
      icon: <SchoolRoundedIcon />,
      label: "School Shuttles",
      description: "Book and track school shuttles",
      route: "/school-handoff"
    }
  ];

  const appItems = [
    {
      icon: <SettingsRoundedIcon />,
      label: "Settings",
      description: "App preferences and account settings",
      route: "/settings"
    }
  ];

  const supportItems = [
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

          {/* Profile Header */}
          <Card
            elevation={0}
            onClick={() => navigate("/profile")}
            sx={{
              mb: 2.5,
              borderRadius: 2.5,
              cursor: "pointer",
              bgcolor: (t) =>
                t.palette.mode === "light"
                  ? "linear-gradient(135deg, #E0F2FE 0%, #FFFFFF 100%)"
                  : "linear-gradient(135deg, rgba(3,205,140,0.1) 0%, rgba(15,23,42,0.98) 100%)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(3,205,140,0.2)"
                  : "1px solid rgba(3,205,140,0.3)",
              transition: "transform 0.12s ease, box-shadow 0.12s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: 2
              }
            }}
          >
            <CardContent sx={{ px: 2, py: 1.5 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "#03CD8C",
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#020617"
                  }}
                >
                  RZ
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: 15,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      mb: 0.25
                    }}
                  >
                    Rachel
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 11,
                      color: (t) => t.palette.text.secondary
                    }}
                  >
                    +256 777 777 777
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 11,
                      color: (t) => t.palette.text.secondary
                    }}
                  >
                    rachel@example.com
                  </Typography>
                </Box>
                <ArrowForwardIosRoundedIcon
                  sx={{
                    fontSize: 16,
                    color: (t) => t.palette.text.secondary,
                    opacity: 0.5
                  }}
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Account & History Section */}
          <Typography
            variant="caption"
            sx={{
              fontSize: 10,
              fontWeight: 600,
              color: (t) => t.palette.text.secondary,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              mb: 1,
              display: "block"
            }}
          >
            Account & history
          </Typography>
          <List
            sx={{
              bgcolor: "transparent",
              mb: 2.5,
              "& .MuiListItem-root": {
                px: 0
              }
            }}
          >
            {accountItems.map((item, index) => (
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
                    <ArrowForwardIosRoundedIcon
                      sx={{
                        fontSize: 14,
                        color: (t) => t.palette.text.secondary,
                        opacity: 0.5
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                {index < accountItems.length - 1 && (
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

          {/* App & Payments Section */}
          <Typography
            variant="caption"
            sx={{
              fontSize: 10,
              fontWeight: 600,
              color: (t) => t.palette.text.secondary,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              mb: 1,
              display: "block"
            }}
          >
            App & payments
          </Typography>
          <List
            sx={{
              bgcolor: "transparent",
              mb: 2.5,
              "& .MuiListItem-root": {
                px: 0
              }
            }}
          >
            {appItems.map((item) => (
              <ListItem disablePadding key={item.route}>
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
                  <ArrowForwardIosRoundedIcon
                    sx={{
                      fontSize: 14,
                      color: (t) => t.palette.text.secondary,
                      opacity: 0.5
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Support Section */}
          <Typography
            variant="caption"
            sx={{
              fontSize: 10,
              fontWeight: 600,
              color: (t) => t.palette.text.secondary,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              mb: 1,
              display: "block"
            }}
          >
            Support
          </Typography>
          <List
            sx={{
              bgcolor: "transparent",
              "& .MuiListItem-root": {
                px: 0
              }
            }}
          >
            {supportItems.map((item, index) => (
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
                    <ArrowForwardIosRoundedIcon
                      sx={{
                        fontSize: 14,
                        color: (t) => t.palette.text.secondary,
                        opacity: 0.5
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                {index < supportItems.length - 1 && (
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

