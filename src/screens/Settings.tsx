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
  Switch,
  Divider,
  Menu,
  MenuItem
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import PaymentRoundedIcon from "@mui/icons-material/PaymentRounded";
import PrivacyTipRoundedIcon from "@mui/icons-material/PrivacyTipRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";
import { useThemeMode } from "../contexts/ThemeContext";

export default function Settings(): React.JSX.Element {
  const navigate = useNavigate();
  const { mode, toggleMode } = useThemeMode();
  const [notifications, setNotifications] = React.useState(true);
  const [language, setLanguage] = React.useState("English (US)");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (lang?: string) => {
    if (lang) setLanguage(lang);
    setAnchorEl(null);
  };

  const languages = [
    "English (US)",
    "Kiswahili",
    "Mandarin Chinese",
    "Hindi",
    "Spanish",
    "French",
    "Arabic",
    "Bengali",
    "Portuguese",
    "Russian"
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
        <Box sx={{ bgcolor: "#03CD8C", px: 2, pt: 2, pb: 2, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
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
            Settings
          </Typography>
        </Box>

        <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>

          {/* Settings List */}
          <List
            sx={{
              bgcolor: "transparent",
              "& .MuiListItem-root": {
                px: 0
              }
            }}
          >
            {/* Dark Mode Toggle */}
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
                      : "1px solid rgba(51,65,85,0.9)"
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: "#03CD8C"
                  }}
                >
                  <DarkModeRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Dark Mode"
                  secondary="Switch between light and dark theme"
                />
                <Switch
                  checked={mode === "dark"}
                  onChange={toggleMode}
                  color="primary"
                />
              </ListItemButton>
            </ListItem>

            {/* Notifications */}
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
                      : "1px solid rgba(51,65,85,0.9)"
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: "#03CD8C"
                  }}
                >
                  <NotificationsRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Notifications"
                  secondary="Push notifications and alerts"
                />
                <Switch
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  color="primary"
                />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 1, opacity: 0.1 }} />

            {/* Language */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleClick}
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
                      : "1px solid rgba(51,65,85,0.9)"
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: "#03CD8C"
                  }}
                >
                  <LanguageRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Language"
                  secondary={language}
                />
                <ArrowForwardIosRoundedIcon
                  sx={{
                    fontSize: 16,
                    color: (t) => t.palette.text.secondary,
                    ml: 1
                  }}
                />
              </ListItemButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleClose()}
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    mt: 1,
                    minWidth: 180,
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                    bgcolor: (t) => t.palette.background.paper
                  }
                }}
              >
                {languages.map((lang) => (
                  <MenuItem
                    key={lang}
                    selected={lang === language}
                    onClick={() => handleClose(lang)}
                    sx={{
                      fontSize: "0.875rem",
                      py: 1,
                      "&.Mui-selected": {
                        bgcolor: "rgba(3, 205, 140, 0.1)",
                        color: "#03CD8C",
                        "&:hover": { bgcolor: "rgba(3, 205, 140, 0.2)" }
                      }
                    }}
                  >
                    {lang}
                  </MenuItem>
                ))}
              </Menu>
            </ListItem>

            {/* Payment Methods */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate("/wallet")}
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
                      : "1px solid rgba(51,65,85,0.9)"
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: "#03CD8C"
                  }}
                >
                  <PaymentRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Payment Methods"
                  secondary="Manage cards and payment options"
                />
                <ArrowForwardIosRoundedIcon
                  sx={{
                    fontSize: 16,
                    color: (t) => t.palette.text.secondary,
                    ml: 1
                  }}
                />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 1, opacity: 0.1 }} />

            {/* Security */}
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
                      : "1px solid rgba(51,65,85,0.9)"
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: "#03CD8C"
                  }}
                >
                  <SecurityRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Security"
                  secondary="Password, 2FA, and security settings"
                />
              </ListItemButton>
            </ListItem>

            {/* Privacy */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate("/about")} // Using about as a placeholder for privacy
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
                      : "1px solid rgba(51,65,85,0.9)"
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: "#03CD8C"
                  }}
                >
                  <PrivacyTipRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Privacy"
                  secondary="Data privacy and sharing preferences"
                />
                <ArrowForwardIosRoundedIcon
                  sx={{
                    fontSize: 16,
                    color: (t) => t.palette.text.secondary,
                    ml: 1
                  }}
                />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 1, opacity: 0.1 }} />

            {/* Ride Preferences */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate("/rides/preferences/setup")}
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
                      : "1px solid rgba(51,65,85,0.9)"
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: "#03CD8C"
                  }}
                >
                  <DirectionsCarRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Ride Preferences"
                  secondary="Customize your ride experience preferences"
                />
                <ArrowForwardIosRoundedIcon
                  sx={{
                    fontSize: 16,
                    color: (t) => t.palette.text.secondary,
                    ml: 1
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </MobileShell>
    </Box>
  );
}

