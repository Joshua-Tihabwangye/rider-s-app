import React from "react";
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
  Stack,
  Avatar,
  Divider
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import MobileShell from "../components/MobileShell";

function DriverProfileDuringTripScreen(): JSX.Element {
  const navigate = useNavigate();
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
              Your EV driver
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              Learn more about who’s driving you
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Profile card */}
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
        <CardContent sx={{ px: 1.75, py: 1.8 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.75 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: "primary.main",
                color: "#020617",
                fontSize: 22,
                fontWeight: 700
              }}
            >
              BK
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  Bwanbale Kato
                </Typography>
                <Chip
                  size="small"
                  icon={
                    <VerifiedUserRoundedIcon
                      sx={{ fontSize: 14, color: "#22c55e" }}
                    />
                  }
                  label="Verified"
                  sx={{
                    borderRadius: 999,
                    fontSize: 10,
                    height: 22,
                    bgcolor: (theme) =>
                      theme.palette.mode === "light"
                        ? "#F3F4F6"
                        : "rgba(15,23,42,1)",
                    color: "rgba(55,65,81,1)",
                    pl: 0.5
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <StarRoundedIcon sx={{ fontSize: 16, color: "#facc15" }} />
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
                >
                  4.9 • 230 trips • 2 years on EVzone
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 1.8, borderColor: (t) => t.palette.divider }} />

          {/* Badges */}
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 1.25 }}>
            <Chip
              icon={<ElectricCarRoundedIcon sx={{ fontSize: 16 }} />}
              label="EV expert"
              size="small"
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 24,
                bgcolor: "rgba(34,197,94,0.1)",
                color: "#16A34A"
              }}
            />
            <Chip
              icon={<EmojiEventsRoundedIcon sx={{ fontSize: 16 }} />}
              label="Top-rated 3 months"
              size="small"
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 24,
                bgcolor: "rgba(253,224,71,0.15)",
                color: "#CA8A04"
              }}
            />
            <Chip
              icon={<TimelineRoundedIcon sx={{ fontSize: 16 }} />}
              label="98% on-time"
              size="small"
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 24,
                bgcolor: "rgba(59,130,246,0.12)",
                color: "#1D4ED8"
              }}
            />
          </Stack>

          {/* Languages & stats */}
          <Stack direction="row" spacing={2.5} sx={{ mb: 1.25 }}>
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Languages
              </Typography>
              <Stack direction="row" spacing={0.5}>
                <Chip
                  icon={<TranslateRoundedIcon sx={{ fontSize: 14 }} />}
                  label="English"
                  size="small"
                  sx={{
                    borderRadius: 999,
                    fontSize: 10,
                    height: 22,
                    bgcolor: (t) =>
                      t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                    color: (t) => t.palette.text.primary
                  }}
                />
                <Chip
                  label="Luganda"
                  size="small"
                  sx={{
                    borderRadius: 999,
                    fontSize: 10,
                    height: 22,
                    bgcolor: (t) =>
                      t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                    color: (t) => t.palette.text.primary
                  }}
                />
              </Stack>
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                EV driving
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                36,000+ EV km driven
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Joined 2023
              </Typography>
            </Box>
          </Stack>

          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            Feedback from riders mentions clean vehicles, smooth driving and very
            good knowledge of Kampala city.
          </Typography>
        </CardContent>
      </Card>

      {/* Actions */}
      <Stack direction="row" spacing={1.25} sx={{ mb: 1.5 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<PhoneRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{
            borderRadius: 999,
            py: 0.9,
            fontSize: 13,
            textTransform: "none"
          }}
        >
          Call
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<MessageRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{
            borderRadius: 999,
            py: 0.9,
            fontSize: 13,
            textTransform: "none"
          }}
        >
          Chat
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<ShareRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{
            borderRadius: 999,
            py: 0.9,
            fontSize: 13,
            textTransform: "none"
          }}
        >
          Share trip
        </Button>
      </Stack>

      {/* Preferences Button */}
      <Button
        fullWidth
        variant="outlined"
        startIcon={<SettingsRoundedIcon sx={{ fontSize: 18 }} />}
        onClick={() => navigate("/rides/preferences/driver", { state: { isModal: true } })}
        sx={{
          borderRadius: 999,
          py: 0.9,
          fontSize: 13,
          textTransform: "none",
          mb: 1.5
        }}
      >
        View Preferences
      </Button>

      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(226,232,240,1)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.4 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <InfoOutlinedIcon
              sx={{ fontSize: 18, color: (t) => t.palette.text.secondary }}
            />
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Your safety matters. You can report any issues with your driver
              after the trip – ratings and reports help us keep standards high
              for all EVzone riders.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default function RiderScreen28DriverProfileDuringTripCanvas_v2() {
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
          <DriverProfileDuringTripScreen />
        </MobileShell>
      </Box>
    
  );
}
