import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Stack } from "@mui/material";
import ScreenScaffold from "../components/ScreenScaffold";
import PageHeader from "../components/PageHeader";
import ListSection from "../components/primitives/ListSection";
import RowActionItem from "../components/primitives/RowActionItem";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import FingerprintRoundedIcon from "@mui/icons-material/FingerprintRounded";
import { uiTokens } from "../design/tokens";

export default function SecuritySettings(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <ScreenScaffold
      header={
        <PageHeader
          title="Security"
          subtitle="Privacy & Auth"
          onBack={() => navigate(-1)}
        />
      }
      contentSx={{ pt: { xs: 2.5, md: 3 } }}
    >
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="subtitle2" sx={{ ...uiTokens.text.itemTitle, mb: 1.5, px: 1 }}>
            Login & Security
          </Typography>
          <ListSection>
            <RowActionItem
              icon={<LockRoundedIcon />}
              title="Change Password"
              description="Last changed 3 months ago"
              onClick={() => {}}
            />
            <RowActionItem
              icon={<SecurityRoundedIcon />}
              title="Two-Factor Authentication"
              description="On • SMS (...77)"
              onClick={() => {}}
            />
          </ListSection>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ ...uiTokens.text.itemTitle, mb: 1.5, px: 1 }}>
            Biometrics
          </Typography>
          <ListSection>
            <RowActionItem
              icon={<FingerprintRoundedIcon />}
              title="Touch ID / Face ID"
              description="Use biometrics for quick login"
              onClick={() => {}}
            />
          </ListSection>
        </Box>
      </Stack>
      
      <Box sx={{ mt: 4, px: 1 }}>
        <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
          Your security is our priority. We recommend enabling 2FA for all accounts.
        </Typography>
      </Box>
    </ScreenScaffold>
  );
}
