import React from "react";
import { Box, Typography, IconButton, Button, Stack, Card, CardContent, Switch } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../components/DarkModeToggle";
import MobileShell from "../components/MobileShell";

function TripSharingScreen(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 2.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <IconButton size="small" onClick={() => navigate(-1)}>
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Trip Sharing
        </Typography>
      </Box>

      <Box sx={{ mx: 7, textAlign: "center", mb: 4 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Let friends and family know where you are. Share your live location during any ride.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ShareRoundedIcon />}
          sx={{
            borderRadius: 999,
            px: 4,
            py: 1.25,
            bgcolor: "primary.main",
            color: "#020617",
            fontWeight: 700,
            textTransform: "none"
          }}
        >
          Share Live Trip
        </Button>
      </Box>

      <Stack spacing={2}>
        <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.05)" }}>
          <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <GroupRoundedIcon sx={{ color: "primary.main" }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Auto-share with contacts</Typography>
                <Typography variant="caption" color="text.secondary">Always share trips with emergency contacts</Typography>
              </Box>
            </Box>
            <Switch size="small" color="primary" />
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.05)" }}>
          <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <HistoryRoundedIcon sx={{ color: "text.secondary" }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Sharing history</Typography>
                <Typography variant="caption" color="text.secondary">View past shared trips</Typography>
              </Box>
            </Box>
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 14, transform: "rotate(180deg)", color: "text.disabled" }} />
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

export default function TripSharing() {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <DarkModeToggle />
      <MobileShell>
        <TripSharingScreen />
      </MobileShell>
    </Box>
  );
}
