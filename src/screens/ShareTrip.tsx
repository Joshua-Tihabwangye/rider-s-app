import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  Avatar
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import PercentRoundedIcon from "@mui/icons-material/PercentRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";

const PASSENGERS = [
  { id: 1, name: "You", initials: "YOU", isOwner: true, joined: true },
  { id: 2, name: "Mary", initials: "M", joined: true },
  { id: 3, name: "John", initials: "J", joined: false }
];

interface Passenger {
  id: number;
  name: string;
  initials: string;
  isOwner?: boolean;
  joined: boolean;
}

interface PassengerChipProps {
  passenger: Passenger;
}

function PassengerChip({ passenger }: PassengerChipProps): React.JSX.Element {
  const bg = passenger.joined ? "rgba(34,197,94,0.1)" : "rgba(148,163,184,0.12)";
  const fg = passenger.joined ? "#16A34A" : "#6B7280";
  return (
    <Chip
      avatar={
        <Avatar
          sx={{
            width: 24,
            height: 24,
            bgcolor: passenger.joined ? "primary.main" : "rgba(15,23,42,0.9)",
            color: "#F9FAFB",
            fontSize: 11,
            fontWeight: 600
          }}
        >
          {passenger.initials}
        </Avatar>
      }
      label={
        passenger.isOwner
          ? `${passenger.name} (payer)`
          : passenger.name + (passenger.joined ? " (joined)" : " (invited)")
      }
      size="small"
      sx={{
        borderRadius: 999,
        fontSize: 11,
        height: 28,
        bgcolor: bg,
        color: fg
      }}
    />
  );
}

function ShareRidePassengersScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [shareUrl] = useState("https://ev.zone/r/ABC123");
  const [splitFare, setSplitFare] = useState(true);

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 999,
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
              border: (theme) =>
                theme.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Share ride & passengers
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              Share tracking, invite co-riders and split the fare
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Share link */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
          >
            Share live trip link
          </Typography>

          <TextField
            fullWidth
            size="small"
            value={shareUrl}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <LinkRoundedIcon
                    sx={{ fontSize: 18, color: "text.secondary" }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Stack direction="row" spacing={0.8}>
                    <IconButton size="small" aria-label="Copy link">
                      <ContentCopyRoundedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton size="small" aria-label="Share link">
                      <ShareRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Stack>
                </InputAdornment>
              )
            }}
            sx={{
              mt: 0.75,
              "& .MuiOutlinedInput-root": {
                borderRadius: 999,
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (theme) =>
                    theme.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": {
                  borderColor: "primary.main"
                }
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Passengers + split fare */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.25 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <GroupRoundedIcon sx={{ fontSize: 20, color: "primary.main" }} />
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                Passengers
              </Typography>
            </Box>
            <Button
              size="small"
              variant="text"
              startIcon={<PersonAddAltRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{ fontSize: 11, textTransform: "none" }}
            >
              Invite passenger
            </Button>
          </Box>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 1.5 }}>
            {PASSENGERS.map((p) => (
              <PassengerChip key={p.id} passenger={p} />
            ))}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              icon={<PercentRoundedIcon sx={{ fontSize: 16 }} />}
              label="Split fare with joined passengers"
              onClick={() => setSplitFare((prev) => !prev)}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 28,
                bgcolor: splitFare
                  ? "primary.main"
                  : (theme) =>
                      theme.palette.mode === "light"
                        ? "#F3F4F6"
                        : "rgba(15,23,42,0.96)",
                color: splitFare
                  ? "#020617"
                  : (theme) => theme.palette.text.primary,
                "& .MuiChip-icon": {
                  color: splitFare ? "#020617" : "rgba(148,163,184,1)"
                }
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Invite by phone */}
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
        <CardContent sx={{ px: 1.75, py: 1.5 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
          >
            Invite someone by phone
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter phone number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIphoneRoundedIcon
                    sx={{ fontSize: 18, color: "text.secondary" }}
                  />
                </InputAdornment>
              )
            }}
            sx={{
              mt: 0.75,
              "& .MuiOutlinedInput-root": {
                borderRadius: 999,
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (theme) =>
                    theme.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": {
                  borderColor: "primary.main"
                }
              }
            }}
          />
        </CardContent>
      </Card>

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
          mb: 1.25,
          "&:hover": { bgcolor: "#06e29a" }
        }}
      >
        Done
      </Button>

      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
      >
        Shared passengers can see live tracking. If splitting fare, only joined
        passengers will be charged at the end of the trip.
      </Typography>
    </Box>
  );
}

export default function RiderScreen30ShareRidePassengersCanvas_v2() {
      return (
    
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (theme) => theme.palette.background.default
        }}
      >

          <ShareRidePassengersScreen />
        
      </Box>
    
  );
}
