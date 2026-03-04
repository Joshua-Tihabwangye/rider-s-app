import React from "react";
import { Box, Typography, IconButton, Avatar, Card, CardContent, Stack, Divider, Button } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../components/DarkModeToggle";
import MobileShell from "../components/MobileShell";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

function ProfileScreen(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 2.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <IconButton
          size="small"
          onClick={() => navigate(-1)}
          sx={{
            bgcolor: "rgba(0,0,0,0.05)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.1)" }
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Profile
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
        <Box sx={{ position: "relative" }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: "primary.main",
              color: "#020617",
              fontSize: 32,
              fontWeight: 700,
              boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
            }}
          >
            RZ
          </Avatar>
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              bgcolor: "#FFFFFF",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              "&:hover": { bgcolor: "#F3F4F6" }
            }}
          >
            <EditRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
        <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
          Rider User
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Premium Member
        </Typography>
      </Box>

      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid rgba(0,0,0,0.1)",
          mb: 3
        }}
      >
        <CardContent>
          <Stack spacing={2.5}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <PersonRoundedIcon sx={{ color: "primary.main" }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Rider User
                </Typography>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <EmailRoundedIcon sx={{ color: "primary.main" }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Email Address
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  rider@evzone.com
                </Typography>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <PhoneRoundedIcon sx={{ color: "primary.main" }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Phone Number
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  +256 700 000000
                </Typography>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <LocationOnRoundedIcon sx={{ color: "primary.main" }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Common City
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Kampala, Uganda
                </Typography>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="contained"
        sx={{
          borderRadius: 999,
          py: 1.5,
          textTransform: "none",
          fontWeight: 700,
          bgcolor: "#000000",
          color: "#FFFFFF",
          "&:hover": { bgcolor: "#333333" }
        }}
      >
        Save Changes
      </Button>
    </Box>
  );
}

export default function Profile() {
  return (
    <>
      <DarkModeToggle />
      <MobileShell>
        <ProfileScreen />
      </MobileShell>
    </>
  );
}
