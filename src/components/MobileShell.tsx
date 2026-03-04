import React, { useState, useEffect } from "react";
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

interface NavTab {
  value: string;
  label: string;
  icon: React.ReactElement;
  route: string;
}

const NAV_TABS: NavTab[] = [
  { value: "home", label: "Home", icon: <HomeOutlinedIcon />, route: "/home" },
  { value: "rides", label: "Rides", icon: <DirectionsCarFilledRoundedIcon />, route: "/rides" },
  { value: "deliveries", label: "Deliveries", icon: <LocalShippingRoundedIcon />, route: "/deliveries" },
  { value: "wallet", label: "Wallet", icon: <AccountBalanceWalletRoundedIcon />, route: "/wallet" },
  { value: "more", label: "More", icon: <MoreHorizRoundedIcon />, route: "/more" }
];

interface MobileShellProps {
  children: React.ReactNode;
}

export default function MobileShell({ children }: MobileShellProps): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const [navValue, setNavValue] = useState<string>("home");

  // Determine active tab based on current route
  useEffect(() => {
    const path = location.pathname;
    let currentTab = "home";
    
    if (path === "/" || path === "/home" || path === "/rides/booking/confirmation") {
      currentTab = "home";
    } else if (path.startsWith("/rides")) {
      currentTab = "rides";
    } else if (path.startsWith("/deliveries")) {
      currentTab = "deliveries";
    } else if (path.startsWith("/wallet")) {
      currentTab = "wallet";
    } else if (path.startsWith("/payment")) {
      currentTab = "wallet";
    } else if (path.startsWith("/rental") || path.startsWith("/tours") || path.startsWith("/ambulance") || path.startsWith("/more") || path.startsWith("/history") || path.startsWith("/school-handoff") || path.startsWith("/help") || path.startsWith("/about") || path.startsWith("/settings") || path.startsWith("/school")) {
      currentTab = "more";
    }
    
    setNavValue(currentTab);
  }, [location.pathname]);

  const handleChange = (_event: React.SyntheticEvent, newValue: string): void => {
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
        // Use dvh (Dynamic Viewport Height) to account for mobile browser UI
        height: { xs: "100dvh", sm: "100vh" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Premium dark workspace background
        bgcolor: "#020617",
        backgroundImage: "radial-gradient(circle at top right, #1E293B 0, #020617 100%)",
        overflow: "hidden",
        zIndex: 1
      }}
    >
      {/* The Primary System Frame (Screen + Navigation) */}
      <Box
        sx={{
          position: "relative",
          width: { xs: "100%", sm: "410px", md: "430px" },
          height: { xs: "100%", sm: "calc(100% - 60px)", md: "calc(100% - 80px)" },
          maxHeight: { sm: "840px", md: "900px" },
          display: "flex",
          flexDirection: "column",
          bgcolor: (t) => t.palette.background.default,
          borderRadius: { xs: 0, sm: "4px" },
          boxShadow: { 
            xs: "none", 
            sm: (t) => t.palette.mode === "light" 
              ? "0 10px 30px -5px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.05)" 
              : "0 20px 40px -12px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.05)"
          },
          border: "none",
          overflow: "hidden",
          backgroundImage: (t) =>
            t.palette.mode === "light"
              ? "radial-gradient(circle at top, #D1FAE5 0, #F3F4F6 55%, #F3F4F6 100%)"
              : "radial-gradient(circle at top, #064E3B 0, #020617 60%, #020617 100%)",
          paddingTop: { xs: "env(safe-area-inset-top)", sm: 0 },
        }}
      >
        {/* Scrollable content area */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            // Synchronize padding with navigation height + safe area
            paddingBottom: { 
              xs: "calc(64px + env(safe-area-inset-bottom))", 
              sm: "64px" 
            },
            WebkitOverflowScrolling: "touch",
            paddingLeft: { xs: "env(safe-area-inset-left)", sm: 0 },
            paddingRight: { xs: "env(safe-area-inset-right)", sm: 0 },
            minHeight: 0,
            boxSizing: "border-box"
          }}
        >
          {children}
        </Box>
        
        {/* Fixed bottom navigation */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100%",
            zIndex: 2000,
            // Handle bottom safe area for notched phones
            paddingBottom: { xs: "env(safe-area-inset-bottom)", sm: 0 },
            flexShrink: 0,
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? "rgba(255,255,255,0.95)"
                : "rgba(15,23,42,0.96)",
            backdropFilter: "blur(20px)",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: { xs: 0, sm: "20px 20px 0 0" },
              overflow: "hidden",
              bgcolor: "transparent",
              borderTop: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(229,231,235,1)"
                  : "1px solid rgba(30,64,175,0.3)",
              boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
              width: "100%",
              boxSizing: "border-box"
            }}
          >
            <BottomNavigation
              value={navValue}
              onChange={handleChange}
              showLabels
              sx={{
                bgcolor: "transparent",
                height: 64,
                width: "100%",
                "& .MuiBottomNavigationAction-root": {
                  color: "text.secondary",
                  minWidth: 0,
                  "&.Mui-selected": {
                    color: "#03CD8C"
                  }
                },
                "& .MuiBottomNavigationAction-label": {
                  fontSize: 10,
                  fontWeight: 500,
                  "&.Mui-selected": {
                    fontSize: 11,
                    fontWeight: 700
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
    </Box>
  );
}
