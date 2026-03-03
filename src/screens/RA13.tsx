import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Stack
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import FamilyRestroomRoundedIcon from "@mui/icons-material/FamilyRestroomRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import MobileShell from "../components/MobileShell";

function RideForContactSummaryScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [contact] = useState({
    name: "John Doe",
    relation: "Friend",
    phone: "+256 772 987654",
    initials: "JD"
  });

  return (
    <>
    {/* Green Header */}
        <Box sx={{ bgcolor: "#03CD8C", px: 2.5, pt: 2, pb: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "#FFFFFF",
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" }
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, letterSpacing: "-0.01em", color: "#FFFFFF" }}
          >
            Ride for contact
          </Typography>
        </Box>
        <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>


      {/* Contact summary */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#ECFDF5" : "rgba(15,23,42,0.98)",
          border: "1px solid #03CD8C"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: "primary.main",
                color: "#020617",
                fontSize: 18,
                fontWeight: 600
              }}
            >
              {contact.initials}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  {contact.name}
                </Typography>
                <Chip
                  size="small"
                  icon={
                    <FamilyRestroomRoundedIcon
                      sx={{ fontSize: 14, color: "#22c55e" }}
                    />
                  }
                  label={contact.relation}
                  sx={{
                    borderRadius: 999,
                    fontSize: 10,
                    height: 22,
                    bgcolor: (theme) =>
                      theme.palette.mode === "light"
                        ? "#F3F4F6"
                        : "rgba(15,23,42,1)",
                    color: "rgba(75,85,99,1)",
                    pl: 0.5
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{ mt: 0.25, fontSize: 11, color: (theme) => theme.palette.text.secondary }}
              >
                {contact.phone}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
              >
                They will receive SMS updates and live tracking for this ride.
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1.25} sx={{ mt: 1.75 }}>
            <Button
              size="small"
              variant="outlined"
              sx={{
                borderRadius: 999,
                fontSize: 11,
                textTransform: "none",
                px: 1.8,
                py: 0.4,
                borderColor: "primary.main",
                color: "primary.main"
              }}
            >
              Change contact
            </Button>
            <Button
              size="small"
              variant="text"
              sx={{
                borderRadius: 999,
                fontSize: 11,
                textTransform: "none",
                color: (theme) => theme.palette.text.secondary
              }}
            >
              Book for me instead
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Info */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid rgba(226,232,240,1)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.4 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <InfoOutlinedIcon
              sx={{ fontSize: 18, color: (theme) => theme.palette.text.secondary }}
            />
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
              >
                Your EVzone account and payment method will be used for this ride.
                The rider can contact the driver directly from the link we send.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Payer chip */}
      <Chip
        icon={<DirectionsCarFilledRoundedIcon sx={{ fontSize: 16 }} />}
        label="I am paying for this ride from my EVzone account"
        sx={{
          mb: 1.5,
          borderRadius: 999,
          fontSize: 11,
          height: 28,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#E0F2FE" : "rgba(15,23,42,0.96)",
          color: (theme) => theme.palette.text.primary
        }}
      />

      <Button
        fullWidth
        variant="contained"
        sx={{
          borderRadius: 999,
          py: 1.1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: "primary.main",
          color: "#020617",
          "&:hover": { bgcolor: "#06e29a" }
        }}
      >
        Continue
      </Button>
    </Box>
    </>

  );
}

export default function RiderScreen13RideForContactSummaryCanvas_v2() {
      return (
    
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (theme) => theme.palette.background.default
        }}
      >
        

        <DarkModeToggle />

        

        <MobileShell>
          <RideForContactSummaryScreen />
        </MobileShell>
      </Box>
    
  );
}
