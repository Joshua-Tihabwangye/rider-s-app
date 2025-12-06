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
  { value: "rides", label: "Rides", icon: <DirectionsCarFilledRoundedIcon />, route: "/rides" },
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
    } else if (path.startsWith("/rental") || path.startsWith("/tours") || path.startsWith("/ambulance") || path.startsWith("/more") || path.startsWith("/history") || path.startsWith("/school-handoff") || path.startsWith("/help") || path.startsWith("/about") || path.startsWith("/settings") || path.startsWith("/school")) {
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
            ? "radial-gradient(circle at top, #D1FAE5 0, #F3F4F6 55%, #F3F4F6 100%)"
            : "radial-gradient(circle at top, #064E3B 0, #020617 60%, #020617 100%)",
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
          // Add padding bottom to account for fixed navigation (responsive nav height + safe area)
          paddingBottom: { 
            xs: "calc(64px + env(safe-area-inset-bottom))", 
            sm: "calc(64px + env(safe-area-inset-bottom))",
            md: "calc(64px + env(safe-area-inset-bottom))",
            lg: "calc(70px + env(safe-area-inset-bottom))",
            xl: "calc(74px + env(safe-area-inset-bottom))"
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
          zIndex: 2000, // Above modals to ensure it's always clickable
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
          data-nav="true"
          role="navigation"
          sx={{
            borderRadius: { 
              xs: 0, 
              sm: "16px 16px 0 0", 
              md: "16px 16px 0 0",
              lg: "20px 20px 0 0"
            },
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
            // Responsive max width for larger screens - only constrain on very large screens
            maxWidth: { xs: "100%", sm: "100%", md: "100%", lg: 600, xl: 600 },
            margin: { xs: 0, sm: 0, md: 0, lg: "0 auto", xl: "0 auto" },
            // Ensure it doesn't overflow on small screens
            width: "100%",
            boxSizing: "border-box"
          }}
        >
          <BottomNavigation
            value={navValue}
            onChange={handleChange}
            showLabels
            data-nav="true"
            role="navigation"
            sx={{
              bgcolor: "transparent",
              height: { 
                xs: "calc(64px + env(safe-area-inset-bottom))",
                sm: "calc(64px + env(safe-area-inset-bottom))",
                md: "calc(64px + env(safe-area-inset-bottom))",
                lg: 70,
                xl: 74
              },
              minHeight: { 
                xs: 64, 
                sm: 64, 
                md: 64,
                lg: 70,
                xl: 74
              },
              maxHeight: {
                xs: "calc(80px + env(safe-area-inset-bottom))",
                sm: "calc(80px + env(safe-area-inset-bottom))",
                md: "calc(80px + env(safe-area-inset-bottom))",
                lg: 85,
                xl: 90
              },
              py: { 
                xs: 0.5, 
                sm: 0.5, 
                md: 0.5,
                lg: 0.75,
                xl: 1
              },
              px: { 
                xs: 0.5, 
                sm: 1, 
                md: 1.5,
                lg: 3,
                xl: 4
              },
              // Ensure proper width on all screens
              width: "100%",
              boxSizing: "border-box",
              "& .MuiBottomNavigationAction-root": {
                color: (t) =>
                  t.palette.mode === "light"
                    ? "#808080"
                    : "rgba(128,128,128,0.9)",
                paddingY: { 
                  xs: 0.75, 
                  sm: 0.75, 
                  md: 0.75,
                  lg: 1.25,
                  xl: 1.5
                },
                paddingX: { 
                  xs: 0.25, 
                  sm: 0.5, 
                  md: 0.75,
                  lg: 2,
                  xl: 2.5
                },
                // Responsive max width - use percentage on mobile, allow more space on larger screens
                maxWidth: { 
                  xs: "20%", 
                  sm: "20%", 
                  md: "20%",
                  lg: "none",
                  xl: "none"
                },
                // Adjust for 5 tabs instead of 4
                "@media (max-width: 600px)": {
                  maxWidth: "20%"
                },
                // Ensure touch targets are at least 44x44px on mobile, larger on bigger screens
                minHeight: { 
                  xs: 44, 
                  sm: 44, 
                  md: 44,
                  lg: 56,
                  xl: 60
                },
                minWidth: {
                  xs: 44,
                  sm: 44,
                  md: 44,
                  lg: 56,
                  xl: 60
                },
                width: { 
                  xs: "auto", 
                  sm: "auto", 
                  md: "auto",
                  lg: "auto",
                  xl: "auto"
                },
                flex: { 
                  xs: "1 1 0%", 
                  sm: "1 1 0%", 
                  md: "1 1 0%",
                  lg: "1 1 0%",
                  xl: "1 1 0%"
                },
                "&.Mui-selected": {
                  color: "#32CD32" // Vibrant green for active state
                },
                // Better touch feedback
                transition: "all 0.2s ease-in-out",
                "&:active": {
                  transform: "scale(0.95)"
                },
                "&:hover": {
                  backgroundColor: "transparent"
                },
                // Ensure proper spacing on very small screens
                "@media (max-width: 360px)": {
                  paddingX: 0.125,
                  paddingY: 0.5
                }
              },
              "& .MuiBottomNavigationAction-label": {
                fontSize: { 
                  xs: 10, 
                  sm: 10, 
                  md: 11,
                  lg: 12,
                  xl: 13
                },
                fontWeight: 500,
                marginTop: { 
                  xs: 0.5, 
                  sm: 0.5, 
                  md: 0.5,
                  lg: 0.75,
                  xl: 1
                },
                lineHeight: { 
                  xs: 1.2, 
                  sm: 1.2, 
                  md: 1.3,
                  lg: 1.4,
                  xl: 1.5
                },
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                // Responsive label sizing for very small screens
                "@media (max-width: 360px)": {
                  fontSize: 9,
                  marginTop: 0.25
                },
                "&.Mui-selected": { 
                  fontSize: { 
                    xs: 11, 
                    sm: 11, 
                    md: 12,
                    lg: 13,
                    xl: 14
                  }, 
                  fontWeight: 600 
                }
              },
              "& .MuiSvgIcon-root": {
                fontSize: { 
                  xs: 22, 
                  sm: 22, 
                  md: 24,
                  lg: 28,
                  xl: 30
                },
                // Ensure icons scale properly on very small screens
                "@media (max-width: 360px)": {
                  fontSize: 20
                },
                // Prevent icon squeezing on larger screens
                minWidth: {
                  xs: "auto",
                  sm: "auto",
                  md: "auto",
                  lg: 28,
                  xl: 30
                },
                minHeight: {
                  xs: "auto",
                  sm: "auto",
                  md: "auto",
                  lg: 28,
                  xl: 30
                }
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
