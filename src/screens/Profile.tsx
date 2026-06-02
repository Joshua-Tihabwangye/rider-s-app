import React from "react";
import { Typography, Box, Avatar, Stack } from "@mui/material";
import ScreenScaffold from "../components/ScreenScaffold";
import PageHeader from "../components/PageHeader";
import PageState from "../components/PageState";
import { uiTokens } from "../design/tokens";
import { useAuth } from "../contexts/AuthContext";

export default function Profile(): React.JSX.Element {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <ScreenScaffold header={<PageHeader title="Profile" subtitle="Personal information" />}>
        <PageState kind="loading" title="Loading profile" message="Fetching your rider account details." />
      </ScreenScaffold>
    );
  }

  if (!user) {
    return (
      <ScreenScaffold header={<PageHeader title="Profile" subtitle="Personal information" />}>
        <PageState
          kind="empty"
          title="No profile loaded"
          message="Sign in again to load your rider profile from the backend."
        />
      </ScreenScaffold>
    );
  }

  const initials = user.initials ?? "??";
  const fullName = user.fullName ?? "—";
  const phone = user.phone ?? "—";
  const email = user.email ?? "—";

  return (
    <ScreenScaffold
      header={<PageHeader title="Profile" subtitle="Personal information" />}
    >
      <Box sx={{ p: uiTokens.spacing.xl }}>
        <Stack spacing={uiTokens.spacing.xl} alignItems="center">
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: uiTokens.colors.brand,
              fontSize: 24,
              fontWeight: 700,
              color: uiTokens.colors.ink,
            }}
          >
            {initials}
          </Avatar>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{fullName}</Typography>
            <Typography variant="body2" color="text.secondary">{phone}</Typography>
            <Typography variant="body2" color="text.secondary">{email}</Typography>
          </Box>
          <Typography variant="body2" sx={{ mt: uiTokens.spacing.lg, color: (t) => t.palette.text.disabled }}>
            Full profile management coming soon.
          </Typography>
        </Stack>
      </Box>
    </ScreenScaffold>
  );
}
