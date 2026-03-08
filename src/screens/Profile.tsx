import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Card,
  CardContent,
  Stack,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    name: "Rider User",
    email: "rider@evzone.com",
    phone: "+256 700 000000",
    city: "Kampala, Uganda",
    avatarUrl: ""
  });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...profile });

  const handleEditClick = () => {
    setTempProfile({ ...profile });
    setEditDialogOpen(true);
  };

  const handleSaveProfile = () => {
    setProfile({ ...tempProfile });
    setEditDialogOpen(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Box sx={{ p: 2.5 }}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", minHeight: 48, mb: 3 }}>
        <IconButton
          size="small"
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            left: 0,
            bgcolor: "rgba(0,0,0,0.05)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.1)" }
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 700, mx: 7, textAlign: "center" }}>
          Profile
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={profile.avatarUrl}
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
            {!profile.avatarUrl && getInitials(profile.name)}
          </Avatar>
          <IconButton
            size="small"
            onClick={handleAvatarClick}
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              bgcolor: "#FFFFFF",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              "&:hover": { bgcolor: "#F3F4F6" }
            }}
          >
            <EditRoundedIcon sx={{ fontSize: 16, color: "#111827" }} />
          </IconButton>
        </Box>
        <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
          {profile.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Premium Member
        </Typography>
      </Box>

      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: (t) => t.palette.mode === 'light' ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.1)",
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
                  {profile.name}
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
                  {profile.email}
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
                  {profile.phone}
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
                  {profile.city}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="contained"
        onClick={handleEditClick}
        sx={{
          borderRadius: 999,
          py: 1.5,
          textTransform: "none",
          fontWeight: 700,
          bgcolor: (t) => t.palette.mode === 'light' ? "#000000" : "primary.main",
          color: (t) => t.palette.mode === 'light' ? "#FFFFFF" : "#020617",
          "&:hover": { bgcolor: (t) => t.palette.mode === 'light' ? "#333333" : "primary.dark" }
        }}
      >
        Edit Profile
      </Button>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Profile</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              size="small"
              value={tempProfile.name}
              onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              size="small"
              value={tempProfile.email}
              onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
            />
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              size="small"
              value={tempProfile.phone}
              onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
            />
            <TextField
              fullWidth
              label="Common City"
              variant="outlined"
              size="small"
              value={tempProfile.city}
              onChange={(e) => setTempProfile({ ...tempProfile, city: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setEditDialogOpen(false)}
            sx={{ textTransform: "none", fontWeight: 600, color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveProfile}
            variant="contained"
            sx={{
              borderRadius: 999,
              px: 3,
              bgcolor: "primary.main",
              color: "#020617",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { bgcolor: "primary.dark" }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
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
