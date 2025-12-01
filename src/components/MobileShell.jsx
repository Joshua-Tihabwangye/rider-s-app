import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  BottomNavigation,
  BottomNavigationAction
} from "@mui/material";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";

const NAV_TABS = [
  { value: "home", label: "Home", icon: <HomeOutlinedIcon />, route: "/home" },
  { value: "rides", label: "Rides", icon: <DirectionsCarFilledRoundedIcon />, route: "/rides/enter" },
  { value: "deliveries", label: "Deliveries", icon: <LocalShippingRoundedIcon />, route: "/deliveries" },
  { value: "wallet", label: "Wallet", icon: <AccountBalanceWalletRoundedIcon />, route: "/wallet" },
  { value: "more", label: "More", icon: <MoreHorizRoundedIcon />, route: "/more" }
];

export default function MobileShell({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [navValue, setNavValue] = React.useState("home");

  // Determine active tab based on current route
  React.useEffect(() => {
    const path = location.pathname;
    let currentTab = "home";
    
    if (path === "/" || path === "/home") {
      currentTab = "home";
    } else if (path.startsWith("/rides")) {
      currentTab = "rides";
    } else if (path.startsWith("/deliveries")) {
      currentTab = "deliveries";
    } else if (path.startsWith("/wallet")) {
      currentTab = "wallet";
    } else if (path.startsWith("/rental") || path.startsWith("/tours") || path.startsWith("/ambulance") || path.startsWith("/more") || path.startsWith("/history") || path.startsWith("/school-handoff")) {
      currentTab = "more";
    }
    
    setNavValue(currentTab);
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setNavValue(newValue);
    const tab = NAV_TABS.find(t => t.value === newValue);
    if (tab && tab.route) {
      navigate(tab.route);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: { xs: "100dvh", sm: "100vh" }, // Dynamic viewport height for mobile, fallback for desktop
        display: "flex",
        flexDirection: "column",
        bgcolor: (t) => t.palette.background.default,
        backgroundImage: (t) =>
          t.palette.mode === "light"
            ? "radial-gradient(circle at top, #E0F2FE 0, #F3F4F6 55%, #F3F4F6 100%)"
            : "radial-gradient(circle at top, #020617 0, #020617 60%, #020617 100%)",
        // Safe area support for notched devices
        paddingTop: { xs: "env(safe-area-inset-top)", sm: 0 },
        // Prevent horizontal scroll
        overflowX: "hidden",
        overflowY: "hidden",
        // Ensure it covers full screen
        zIndex: 1
      }}
    >
      {/* Scrollable content area */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          // Add padding bottom to account for fixed navigation (64px nav + safe area)
          paddingBottom: { 
            xs: "calc(64px + env(safe-area-inset-bottom))", 
            sm: "calc(56px + env(safe-area-inset-bottom))" 
          },
          // Smooth scrolling on mobile
          WebkitOverflowScrolling: "touch",
          // Safe area handling
          paddingLeft: { xs: "env(safe-area-inset-left)", sm: 0 },
          paddingRight: { xs: "env(safe-area-inset-right)", sm: 0 },
          // Ensure content doesn't go under nav
          minHeight: 0,
          // Prevent content from being cut off
          boxSizing: "border-box"
        }}
      >
        {children}
      </Box>
      
      {/* Fixed bottom navigation - always visible, doesn't scroll */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 1000,
          // Safe area for bottom navigation
          paddingBottom: { xs: "env(safe-area-inset-bottom)", sm: 0 },
          // Ensure it stays at bottom and doesn't scroll
          flexShrink: 0,
          // Background to prevent content showing through
          backgroundColor: "transparent",
          // Prevent it from scrolling with content
          pointerEvents: "auto"
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: { xs: 0, sm: "16px 16px 0 0", md: "16px 16px 0 0" },
            overflow: "hidden",
            bgcolor: (t) =>
              t.palette.mode === "light"
                ? "rgba(255,255,255,0.98)"
                : "rgba(15,23,42,0.96)",
            backdropFilter: "blur(22px)",
            borderTop: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(229,231,235,1)"
                : "1px solid rgba(30,64,175,0.6)",
            boxShadow:
              "0 -14px 40px rgba(15,23,42,0.26), 0 -1px 0 rgba(148,163,184,0.38)",
            // Responsive max width for larger screens
            maxWidth: { xs: "100%", sm: "100%", md: 600 },
            margin: { xs: "0 auto", sm: "0 auto", md: "0 auto" }
          }}
        >
          <BottomNavigation
            value={navValue}
            onChange={handleChange}
            showLabels
            sx={{
              bgcolor: "transparent",
              height: { 
                xs: "calc(64px + env(safe-area-inset-bottom))",
                sm: 56,
                md: 64
              },
              minHeight: { xs: 64, sm: 56, md: 64 },
              py: { xs: 0.5, sm: 0.3, md: 0.5 },
              px: { xs: 0.5, sm: 1, md: 1.5 },
              "& .MuiBottomNavigationAction-root": {
                color: (t) =>
                  t.palette.mode === "light"
                    ? "#9CA3AF"
                    : "rgba(148,163,184,0.9)",
                minWidth: 0,
                paddingY: { xs: 0.75, sm: 0.5, md: 0.75 },
                paddingX: { xs: 0.25, sm: 0.5, md: 0.75 },
                // Responsive max width - use percentage on mobile, fixed on larger screens
                maxWidth: { xs: "20%", sm: 90, md: 120 },
                // Ensure touch targets are at least 44x44px on mobile
                minHeight: { xs: 44, sm: 40, md: 44 },
                width: { xs: "auto", sm: "auto", md: "auto" },
                flex: { xs: "1 1 0%", sm: "0 1 auto", md: "0 1 auto" },
                "&.Mui-selected": {
                  color: "#03CD8C"
                },
                // Better touch feedback
                transition: "all 0.2s ease-in-out",
                "&:active": {
                  transform: "scale(0.95)"
                }
              },
              "& .MuiBottomNavigationAction-label": {
                fontSize: { xs: 10, sm: 11, md: 12 },
                fontWeight: 500,
                marginTop: { xs: 0.5, sm: 0.25, md: 0.5 },
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                "&.Mui-selected": { 
                  fontSize: { xs: 11, sm: 12, md: 13 }, 
                  fontWeight: 600 
                }
              },
              "& .MuiSvgIcon-root": {
                fontSize: { xs: 22, sm: 24, md: 26 }
              }
            }}
          >
            {NAV_TABS.map((tab) => (
              <BottomNavigationAction
                key={tab.value}
                value={tab.value}
                label={tab.label}
                icon={tab.icon}
              />
            ))}
          </BottomNavigation>
        </Paper>
      </Box>
    </Box>
  );
}
