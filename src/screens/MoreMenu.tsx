import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ScreenScaffold from "../components/ScreenScaffold";
import PageHeader from "../components/PageHeader";
import ActionGrid from "../components/primitives/ActionGrid";
import AppCard from "../components/primitives/AppCard";
import ListSection from "../components/primitives/ListSection";
import RowActionItem from "../components/primitives/RowActionItem";
import SectionHeader from "../components/primitives/SectionHeader";
import { uiTokens } from "../design/tokens";
import { useAuth } from "../contexts/AuthContext";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  description: string;
  route: string;
}

const ACCOUNT_ITEMS: MenuItem[] = [
  {
    icon: <DirectionsCarFilledRoundedIcon />,
    label: "Ride History",
    description: "View past and upcoming rides",
    route: "/rides/history/past"
  },
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

const APP_ITEMS: MenuItem[] = [
  {
    icon: <AccountBalanceWalletRoundedIcon />,
    label: "Wallet",
    description: "Manage your payment methods",
    route: "/wallet"
  },
  {
    icon: <SettingsRoundedIcon />,
    label: "Settings",
    description: "App preferences and account settings",
    route: "/settings"
  }
];

const SUPPORT_ITEMS: MenuItem[] = [
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

function ItemGroup({
  title,
  items,
  onNavigate
}: {
  title: string;
  items: MenuItem[];
  onNavigate: (route: string) => void;
}): React.JSX.Element {
  return (
    <Box>
      <SectionHeader title={title} compact />
      <ListSection sx={{ mt: uiTokens.spacing.sm }}>
        {items.map((item) => (
          <RowActionItem
            key={item.route}
            icon={item.icon}
            title={item.label}
            description={item.description}
            onClick={() => onNavigate(item.route)}
          />
        ))}
      </ListSection>
    </Box>
  );
}

export default function MoreMenu(): React.JSX.Element {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const initials = user?.initials ?? "??";
  const displayName = user?.fullName?.split(" ")[0] ?? "—";
  const phone = user?.phone ?? "";
  const email = user?.email ?? "";

  const handleSignOut = (): void => {
    signOut();
    navigate("/auth/sign-in", { replace: true });
  };

  return (
    <ScreenScaffold
      header={
        <PageHeader
          title="More"
          subtitle="Menu"
          hideBack
        />
      }
      contentSx={{ pt: { xs: uiTokens.spacing.xl, md: uiTokens.spacing.xxl } }}
    >

      <AppCard variant="brand" onClick={() => navigate("/profile")}>
        <Stack direction="row" spacing={uiTokens.spacing.mdPlus} alignItems="center">
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: uiTokens.colors.brand,
              fontSize: 18,
              fontWeight: 700,
              color: uiTokens.colors.ink
            }}
          >
            {initials}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ ...uiTokens.text.itemTitle, mb: 0.25 }}>
              {displayName}
            </Typography>
            <Typography variant="caption" sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary }}>
              {phone}
            </Typography>
            <Typography variant="caption" sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary, display: "block" }}>
              {email}
            </Typography>
          </Box>
        </Stack>
      </AppCard>

      <ActionGrid minWidth={280}>
        <ItemGroup title="Account & history" items={ACCOUNT_ITEMS} onNavigate={navigate} />
        <Stack spacing={uiTokens.spacing.lg}>
          <ItemGroup title="App & payments" items={APP_ITEMS} onNavigate={navigate} />
          <ItemGroup title="Support" items={SUPPORT_ITEMS} onNavigate={navigate} />
        </Stack>
      </ActionGrid>

      {/* Logout */}
      <Box sx={{ mt: uiTokens.spacing.smPlus }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutRoundedIcon />}
          onClick={handleSignOut}
          sx={{
            py: uiTokens.spacing.md,
            fontSize: 13,
            fontWeight: 600,
            textTransform: "none",
            borderRadius: uiTokens.radius.md,
            borderColor: "var(--evz-danger)",
            color: "var(--evz-danger)",
            "&:hover": {
              borderColor: "var(--evz-danger-hover)",
              bgcolor: "var(--evz-surface-danger-tint-soft)"
            }
          }}
        >
          Sign out
        </Button>
      </Box>
    </ScreenScaffold>
  );
}
