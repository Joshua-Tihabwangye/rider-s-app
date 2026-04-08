import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Stack, Switch } from "@mui/material";
import ScreenScaffold from "../components/ScreenScaffold";
import PageHeader from "../components/PageHeader";
import AppCard from "../components/primitives/AppCard";
import { uiTokens } from "../design/tokens";

export default function PrivacySettings(): React.JSX.Element {
  const navigate = useNavigate();
  const [dataSharing, setDataSharing] = React.useState(true);
  const [locationHistory, setLocationHistory] = React.useState(false);

  return (
    <ScreenScaffold
      header={
        <PageHeader
          title="Privacy"
          subtitle="Data & Safety"
          onBack={() => navigate(-1)}
        />
      }
      contentSx={{ pt: uiTokens.spacing.container }}
    >
      <Stack spacing={uiTokens.spacing.lg}>
        <AppCard>
          <Typography variant="subtitle2" sx={{ ...uiTokens.text.itemTitle, mb: uiTokens.spacing.lg }}>
            Data Privacy
          </Typography>
          <Stack spacing={uiTokens.spacing.lg}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Share Anonymous Usage Data
                </Typography>
                <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                  Help us improve your experience
                </Typography>
              </Box>
              <Switch 
                checked={dataSharing} 
                onChange={(e) => setDataSharing(e.target.checked)} 
                color="primary" 
              />
            </Box>
            
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Location History
                </Typography>
                <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
                  Keep a log of your visited places
                </Typography>
              </Box>
              <Switch 
                checked={locationHistory} 
                onChange={(e) => setLocationHistory(e.target.checked)} 
                color="primary" 
              />
            </Box>
          </Stack>
        </AppCard>
        
        <Box sx={{ mt: uiTokens.spacing.xxl, px: uiTokens.spacing.sm }}>
          <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
            You can request a copy of your data or account deletion at any time through our support center.
          </Typography>
        </Box>
      </Stack>
    </ScreenScaffold>
  );
}
