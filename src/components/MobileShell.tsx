import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";

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
    label: "Home",
    route: "/home",
    icon: <HomeOutlinedIcon />
  },
  {
    value: "wallet",
    label: "Wallet",
    route: "/wallet",
    icon: <AccountBalanceWalletRoundedIcon />
  },
  {
    value: "more",
    label: "More",
    route: "/more",
    icon: <MoreHorizRoundedIcon />
  }
];

const ShellContext = React.createContext<boolean>(false);

export function useMobileShellContext(): boolean {
  return React.useContext(ShellContext);
}

function getActiveTab(pathname: string): string {
  if (pathname === "/" || pathname === "/home" || pathname === "/rides/booking/confirmation") {
    return "home";
  }

  if (pathname.startsWith("/wallet")) {
    return "wallet";
  }

  if (
    pathname.startsWith("/rides") ||
    pathname.startsWith("/deliveries") ||
    pathname.startsWith("/rental") ||
    pathname.startsWith("/tours") ||
    pathname.startsWith("/ambulance") ||
    pathname.startsWith("/more") ||
    pathname.startsWith("/history") ||
    pathname.startsWith("/school-handoff") ||
    pathname.startsWith("/help") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/school") ||
    pathname.startsWith("/manager")
  ) {
    return "more";
  }

  return "home";
}

export default function MobileShell({ children }: MobileShellProps): React.JSX.Element {
  const isNested = useMobileShellContext();
  const location = useLocation();
  const navigate = useNavigate();

  if (isNested) {
    return <>{children}</>;
  }

  const navValue = getActiveTab(location.pathname);

  const handleTabChange = (_event: React.SyntheticEvent, value: string): void => {
    const target = NAV_TABS.find((tab) => tab.value === value);
    if (target) {
      navigate(target.route);
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
            height: "100dvh",
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
              pb: `calc(${TAB_BAR_HEIGHT}px + env(safe-area-inset-bottom) + 16px)`,
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
                bgcolor: "var(--evz-shell-nav-bg)",
                backdropFilter: "blur(22px)",
                borderTop: "1px solid var(--evz-shell-nav-border)",
                boxShadow: "var(--evz-shell-nav-shadow)"
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
                    color: "var(--evz-shell-nav-icon)",
                    minWidth: 0,
                    minHeight: 56,
                    py: 0.75,
                    "&.Mui-selected": {
                      color: "var(--evz-shell-nav-icon-active)"
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
        </Box>
      </Box>
    </ShellContext.Provider>
  );
}
