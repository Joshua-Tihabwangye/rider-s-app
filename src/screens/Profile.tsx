import React from "react";
import { Typography, Box, Avatar, Stack } from "@mui/material";
import ScreenScaffold from "../components/ScreenScaffold";
import PageHeader from "../components/PageHeader";
import { uiTokens } from "../design/tokens";

export default function Profile(): React.JSX.Element {
  return (
    <ScreenScaffold
      header={<PageHeader title="Profile" subtitle="Personal information" />}
    >
      <Box sx={{ p: 3 }}>
        <Stack spacing={3} alignItems="center">
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: uiTokens.colors.brand,
              fontSize: 24,
              fontWeight: 700,
              color: uiTokens.colors.ink
            }}
          >
            RZ
          </Avatar>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Rachel Zoe</Typography>
            <Typography variant="body2" color="text.secondary">+256 777 777 777</Typography>
            <Typography variant="body2" color="text.secondary">rachel@example.com</Typography>
          </Box>
          <Typography variant="body2" sx={{ mt: 2, color: (t) => t.palette.text.disabled }}>
            Full profile management coming soon.
          </Typography>
        </Stack>
      </Box>
    </ScreenScaffold>
  );
}
