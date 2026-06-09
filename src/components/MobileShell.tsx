import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { uiConfig } from "../config/uiConfig";

interface NavTab {
  value: string;
  label: string;
  route: string;
  icon: React.ReactElement;
}

interface MobileShellProps {
  children: React.ReactNode;
}

const TAB_BAR_HEIGHT = 72;
const CONTENT_MAX_WIDTH = {
  xs: "100%",
  md: "768px",
  lg: "1024px"
} as const;

const NAV_TABS: NavTab[] = [
  {
    value: "home",
    label: uiConfig.navigation.home,
    route: "/home",
    icon: <HomeOutlinedIcon />
  },
  {
    value: "wallet",
    label: uiConfig.navigation.wallet,
    route: "/wallet",
    icon: <AccountBalanceWalletRoundedIcon />
  },
  {
    value: "settings",
    label: uiConfig.navigation.settings,
    route: "/settings",
    icon: <SettingsRoundedIcon />
  },
  {
    value: "more",
    label: uiConfig.navigation.more,
    route: "/more",
    icon: <MoreHorizRoundedIcon />
  }
];

// Optimized route to tab mapping for O(1) lookup
const ROUTE_TO_TAB_MAP: Record<string, string> = {
  // Home routes
  "/": "home",
  "/home": "home",
  "/rides/booking/confirmation": "home",
  
  // Wallet routes
  "/wallet": "wallet",
  
  // Settings routes
  "/settings": "settings",
  
  // More routes (everything else)
  "/rides": "more",
  "/deliveries": "more",
  "/rental": "more",
  "/tours": "more",
  "/ambulance": "more",
  "/more": "more",
  "/history": "more",

  "/help": "more",
  "/about": "more",
  "/school": "more"
};

const ShellContext = React.createContext<boolean>(false);

export function useMobileShellContext(): boolean {
  return React.useContext(ShellContext);
}

/**
 * Efficiently determines the active tab based on the current pathname
 * Uses a map lookup for O(1) performance instead of O(n) if/else chain
 */
function getActiveTab(pathname: string): string {
  // Validate input to prevent potential issues
  if (typeof pathname !== "string") {
    console.warn("getActiveTab received non-string pathname:", pathname);
    return "home"; // fallback to home
  }
  
  // Check for exact matches first
  if (ROUTE_TO_TAB_MAP[pathname]) {
    return ROUTE_TO_TAB_MAP[pathname];
  }
  
  // Check for prefix matches for dynamic routes
  for (const [routePrefix, tabValue] of Object.entries(ROUTE_TO_TAB_MAP)) {
    if (pathname.startsWith(routePrefix) && routePrefix.endsWith("/")) {
      return tabValue;
    }
  }
  
  // Default fallback
  return "home";
}

export default function MobileShell({ children }: MobileShellProps): React.JSX.Element {
  const isNested = useMobileShellContext();
  const location = useLocation();
  const navigate = useNavigate();
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = React.useState(false);

  // Detect keyboard visibility using visual viewport
  React.useEffect(() => {
    const handleViewportChange = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        // Consider keyboard visible if viewport height is significantly smaller than window height
        const keyboardThreshold = windowHeight * 0.7; // 70% of window height
        setIsKeyboardVisible(viewportHeight < keyboardThreshold);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      handleViewportChange(); // Initial check

      return () => {
        window.visualViewport?.removeEventListener('resize', handleViewportChange);
      };
    }
  }, []);

  // Use useLayoutEffect for scroll reset to prevent visual flicker
  React.useLayoutEffect(() => {
    // Ensure route transitions always repaint fresh content from top.
    try {
      scrollContainerRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch (error) {
      console.error("Failed to reset scroll position:", error);
    }
  }, [location.pathname, location.search, location.key]);

  // Don't render the shell chrome on auth pages
  const isAuthPage = location.pathname.startsWith("/auth");

  if (isNested || isAuthPage) {
    return <>{children}</>;
  }

  const navValue = getActiveTab(location.pathname);

  const handleTabChange = (_event: React.SyntheticEvent, value: string): void => {
    try {
      const target = NAV_TABS.find((tab) => tab.value === value);
      if (target) {
        navigate(target.route);
      } else {
        console.warn(`Attempted to navigate to invalid tab value: ${value}`);
      }
    } catch (error) {
      console.error("Navigation error:", error);
      // Optionally show user feedback here
    }
  };

  return (
    <ShellContext.Provider value={true}>
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "stretch",
          justifyContent: "stretch",
          px: 0,
          py: 0,
          bgcolor: (t) => t.palette.background.default,
          overflow: "hidden"
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            bgcolor: (t) => t.palette.background.default,
            borderRadius: 0,
            border: "none",
            boxShadow: "none",
            overflow: "hidden",
            isolation: "isolate",
            transform: "translateZ(0)"
          }}
        >
          <Box
            sx={{
              height: "max(0px, env(safe-area-inset-top))",
              flexShrink: 0
            }}
          />
  

          <Box
            ref={scrollContainerRef}
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
                width: 0,
                height: 0
              },
              pb: isKeyboardVisible
                ? `calc(env(safe-area-inset-bottom) + 16px)`
                : `calc(${TAB_BAR_HEIGHT}px + env(safe-area-inset-bottom) + 16px)`,
              pl: "max(0px, env(safe-area-inset-left))",
              pr: "max(0px, env(safe-area-inset-right))"
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: CONTENT_MAX_WIDTH,
                mx: "auto",
                "--rider-shell-content-px-xs": "20px",
                "--rider-shell-content-px-md": "24px",
                "--rider-shell-section-gap": "16px",
                "--rider-scaffold-pt-xs": "20px",
                "--rider-scaffold-pt-md": "24px",
                "--rider-scaffold-pb-xs": "24px",
                "--rider-scaffold-pb-md": "28px"
              }}
            >
              {children}
            </Box>
          </Box>

          {!isKeyboardVisible && (
            <Box
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1200,
                pb: "max(0px, env(safe-area-inset-bottom))"
              }}
            >
               <Paper
                 elevation={0}
                 role="navigation"
                 data-nav="true"
                 sx={{
                   mx: 0,
                   borderRadius: 0,
                   bgcolor: "var(--evz-shell-nav-bg, #ffffff)",
                   backdropFilter: "blur(22px)",
                   borderTop: "1px solid var(--evz-shell-nav-border, rgba(0,0,0,0.1))",
                   boxShadow: "var(--evz-shell-nav-shadow, 0 -1px 3px rgba(0,0,0,0.1))"
                 }}
               >
                 <BottomNavigation
                   value={navValue}
                   onChange={handleTabChange}
                   showLabels
                   role="navigation"
                   data-nav="true"
                   sx={{
                     height: TAB_BAR_HEIGHT,
                     bgcolor: "transparent",
                     px: 0.5,
                     "& .MuiBottomNavigationAction-root": {
                       color: "var(--evz-shell-nav-icon, #6b7280)",
                       minWidth: 0,
                       minHeight: 56,
                       py: 0.75,
                       "&.Mui-selected": {
                         color: "var(--evz-shell-nav-icon-active, #03cd8c)"
                       }
                     },
                     "& .MuiBottomNavigationAction-label": {
                       fontSize: 11,
                       mt: 0.25,
                       lineHeight: 1.2,
                       "&.Mui-selected": {
                         fontSize: 11,
                         fontWeight: 600
                       }
                     },
                     "& .MuiSvgIcon-root": {
                       fontSize: 24
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
          )}
        </Box>
      </Box>
    </ShellContext.Provider>
  );
}
