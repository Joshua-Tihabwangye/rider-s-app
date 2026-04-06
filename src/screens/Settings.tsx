import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Stack, Switch, Typography } from "@mui/material";

import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import PaymentRoundedIcon from "@mui/icons-material/PaymentRounded";
import PrivacyTipRoundedIcon from "@mui/icons-material/PrivacyTipRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

import PageHeader from "../components/PageHeader";
import ScreenScaffold from "../components/ScreenScaffold";
import AppCard from "../components/primitives/AppCard";
import ListSection from "../components/primitives/ListSection";
import SectionHeader from "../components/primitives/SectionHeader";
import RowActionItem from "../components/primitives/RowActionItem";
import { useThemeMode } from "../contexts/ThemeContext";
import { uiTokens } from "../design/tokens";

interface ToggleRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({ icon, title, description, checked, onChange }: ToggleRowProps): React.JSX.Element {
  return (
    <AppCard contentSx={{ px: 1.75, py: 1.5, gap: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.35 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "var(--evz-radius-md)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: uiTokens.colors.brand,
            bgcolor: uiTokens.surfaces.brandTintSoft
          }}
        >
          {icon}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ ...uiTokens.text.itemTitle, lineHeight: 1.25 }}>
            {title}
          </Typography>
          <Typography
            variant="caption"
            sx={{ ...uiTokens.text.itemBody, display: "block", mt: 0.35, color: (t) => t.palette.text.secondary }}
          >
            {description}
          </Typography>
        </Box>

        <Switch checked={checked} onChange={(e) => onChange(e.target.checked)} color="primary" />
      </Box>
    </AppCard>
  );
}

export default function Settings(): React.JSX.Element {
  const navigate = useNavigate();
  const { mode, toggleMode } = useThemeMode();
  const [notifications, setNotifications] = React.useState(true);

  return (
    <ScreenScaffold
      header={
        <PageHeader
          title="Settings"
          subtitle="Preferences"
          onBack={() => navigate(-1)}
        />
      }
      contentSx={{ pt: { xs: 2.5, md: 3 } }}
    >
      <ListSection sx={{ gap: 1.1 }}>
        <ToggleRow
          icon={<DarkModeRoundedIcon />}
          title="Dark Mode"
          description="Switch between light and dark theme"
          checked={mode === "dark"}
          onChange={() => toggleMode()}
        />
        <ToggleRow
          icon={<NotificationsRoundedIcon />}
          title="Notifications"
          description="Push notifications and alerts"
          checked={notifications}
          onChange={setNotifications}
        />
      </ListSection>

      <Stack spacing={1.1}>
        <SectionHeader eyebrow="General" title="App settings" compact />
        <ListSection>
          <RowActionItem
            icon={<LanguageRoundedIcon />}
            title="Language"
            description="English (US)"
            onClick={() => navigate("/settings/language")}
          />
          <RowActionItem
            icon={<PaymentRoundedIcon />}
            title="Payment Methods"
            description="Manage cards and payment options"
            onClick={() => navigate("/wallet")}
          />
        </ListSection>
      </Stack>

      <Stack spacing={1.1}>
        <SectionHeader eyebrow="Privacy" title="Security controls" compact />
        <ListSection>
          <RowActionItem
            icon={<SecurityRoundedIcon />}
            title="Security"
            description="Password, 2FA, and security settings"
            onClick={() => navigate("/settings/security")}
          />
          <RowActionItem
            icon={<PrivacyTipRoundedIcon />}
            title="Privacy"
            description="Data privacy and sharing preferences"
            onClick={() => navigate("/settings/privacy")}
          />
          <AppCard
            onClick={() => navigate("/rides/preferences/setup")}
            contentSx={{ px: 1.75, py: 1.45, gap: 0 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.4 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--evz-radius-md)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: uiTokens.colors.brand,
                  bgcolor: uiTokens.surfaces.brandTintSoft
                }}
              >
                <DirectionsCarRoundedIcon />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ ...uiTokens.text.itemTitle, lineHeight: 1.28 }}>
                  Ride Preferences
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ ...uiTokens.text.itemBody, color: (t) => t.palette.text.secondary, mt: 0.35, display: "block" }}
                >
                  Customize your ride experience preferences
                </Typography>
              </Box>
              <IconButton
                size="small"
                sx={{
                  width: 28,
                  height: 28,
                  color: (t) => t.palette.text.secondary,
                  borderRadius: "var(--evz-radius-sm)",
                  bgcolor: uiTokens.surfaces.cardMuted
                }}
              >
                <ArrowForwardIosRoundedIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          </AppCard>
        </ListSection>
      </Stack>
    </ScreenScaffold>
  );
}
