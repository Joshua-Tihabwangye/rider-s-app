import React from "react";
import { Box, Typography, IconButton, Button, Stack, Avatar } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../components/DarkModeToggle";
import MobileShell from "../components/MobileShell";

function EmergencyScreen(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 2.5, textAlign: "center", display: "flex", flexDirection: "column", height: "100%", justifyContent: "center" }}>
      <Box sx={{ position: "absolute", top: 16, left: 16 }}>
        <IconButton size="small" onClick={() => navigate(-1)}>
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      <Avatar
        sx={{
          width: 80,
          height: 80,
          bgcolor: "#DC2626",
          color: "#FFFFFF",
          fontSize: 40,
          margin: "0 auto mb: 3",
          boxShadow: "0 0 0 8px rgba(220,38,38,0.1), 0 0 0 16px rgba(220,38,38,0.05)"
        }}
      >
        <LocalFireDepartmentRoundedIcon sx={{ fontSize: 40 }} />
      </Avatar>

      <Typography variant="h5" sx={{ fontWeight: 800, mt: 4, mb: 1 }}>
        Emergency Assistance
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4, px: 2 }}>
        In case of an immediate threat or accident, use the options below to get help.
      </Typography>

      <Stack spacing={2} sx={{ width: "100%" }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<PhoneRoundedIcon />}
          sx={{
            py: 1.8,
            borderRadius: 3,
            bgcolor: "#DC2626",
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: 700,
            "&:hover": { bgcolor: "#B91C1C" }
          }}
        >
          Call 999 Emergency
        </Button>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<SecurityRoundedIcon />}
          sx={{
            py: 1.8,
            borderRadius: 3,
            borderColor: "rgba(0,0,0,0.1)",
            color: "text.primary",
            fontSize: 15,
            fontWeight: 600,
            textTransform: "none"
          }}
        >
          Alert EVzone Security
        </Button>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GroupRoundedIcon />}
          sx={{
            py: 1.8,
            borderRadius: 3,
            borderColor: "rgba(0,0,0,0.1)",
            color: "text.primary",
            fontSize: 15,
            fontWeight: 600,
            textTransform: "none"
          }}
        >
          Notify Emergency Contacts
        </Button>
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 4 }}>
        Your current location and trip details will be shared automatically with respondents.
      </Typography>
    </Box>
  );
}

export default function Emergency() {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <DarkModeToggle />
      <MobileShell>
        <EmergencyScreen />
      </MobileShell>
    </Box>
  );
}
