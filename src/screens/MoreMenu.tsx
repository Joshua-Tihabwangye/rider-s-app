import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import ScreenScaffold from "../components/ScreenScaffold";
import PageHeader from "../components/PageHeader";
import ActionGrid from "../components/primitives/ActionGrid";
import AppCard from "../components/primitives/AppCard";
import ListSection from "../components/primitives/ListSection";
import RowActionItem from "../components/primitives/RowActionItem";
import SectionHeader from "../components/primitives/SectionHeader";
import { uiTokens } from "../design/tokens";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  description: string;
  route: string;
}

const ACCOUNT_ITEMS: MenuItem[] = [
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
      <ListSection sx={{ mt: 0.75 }}>
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

  return (
    <ScreenScaffold
      header={
        <PageHeader
          title="More"
          subtitle="Menu"
          hideBack
        />
      }
      contentSx={{ pt: { xs: 2.5, md: 3 } }}
    >

      <AppCard variant="brand" onClick={() => navigate("/profile")}>
        <Stack direction="row" spacing={1.5} alignItems="center">
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
            RZ
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ ...uiTokens.text.itemTitle, mb: 0.25 }}>
              Rachel
            </Typography>
            <Typography variant="caption" sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary }}>
              +256 777 777 777
            </Typography>
            <Typography variant="caption" sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary, display: "block" }}>
              rachel@example.com
            </Typography>
          </Box>
        </Stack>
      </AppCard>

      <ActionGrid minWidth={280}>
        <ItemGroup title="Account & history" items={ACCOUNT_ITEMS} onNavigate={navigate} />
        <Stack spacing={2}>
          <ItemGroup title="App & payments" items={APP_ITEMS} onNavigate={navigate} />
          <ItemGroup title="Support" items={SUPPORT_ITEMS} onNavigate={navigate} />
        </Stack>
      </ActionGrid>
    </ScreenScaffold>
  );
}
