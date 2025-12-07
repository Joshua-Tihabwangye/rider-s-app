import React from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  Avatar
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import MobileShell from "../components/MobileShell";

function ActiveDeliveryDriverInfoLiveTrackingScreen() {
  const navigate = useNavigate();
  const eta = "14 min";

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
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
              border: (t) =>
                t.palette.mode === "light"
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
              Courier & live tracking
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              See who is delivering and where they are now
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Map with live tracking */}
      <Box
        sx={{
          position: "relative",
          borderRadius: 3,
          overflow: "hidden",
          height: 200,
          mb: 2.5,
          background: (t) =>
            t.palette.mode === "light"
              ? "radial-gradient(circle at top, rgba(3,205,140,0.15) 0, #E5E7EB 55%, rgba(3,205,140,0.1) 100%)"
              : "radial-gradient(circle at top, rgba(15,118,205,0.5), #020617 60%, #020617 100%)"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.22,
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.5) 1px, transparent 1px)",
            backgroundSize: "34px 34px"
          }}
        />

        {/* Pickup marker */}
        <Box
          sx={{
            position: "absolute",
            left: "15%",
            bottom: "20%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <MyLocationRoundedIcon
            sx={{ fontSize: 22, color: "#22c55e", filter: "drop-shadow(0 6px 12px rgba(15,23,42,0.7))" }}
          />
        </Box>

        {/* Courier marker */}
        <Box
          sx={{
            position: "absolute",
            left: "45%",
            top: "50%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <LocalShippingRoundedIcon
            sx={{ fontSize: 26, color: "primary.main", filter: "drop-shadow(0 6px 14px rgba(15,23,42,0.8))" }}
          />
        </Box>

        {/* Destination marker */}
        <Box
          sx={{
            position: "absolute",
            right: "18%",
            top: "30%",
            transform: "translate(50%, -50%)"
          }}
        >
          <PlaceRoundedIcon
            sx={{
              fontSize: 30,
              color: "primary.main",
              filter: "drop-shadow(0 8px 16px rgba(15,23,42,0.8))"
            }}
          />
        </Box>

        {/* ETA chip */}
        <Box
          sx={{
            position: "absolute",
            left: 12,
            top: 12
          }}
        >
          <Chip
            size="small"
            icon={<AccessTimeRoundedIcon sx={{ fontSize: 14 }} />}
            label={`ETA ${eta}`}
            sx={{
              borderRadius: 999,
              fontSize: 11,
              height: 24,
              bgcolor: "rgba(15,23,42,0.72)",
              color: "#F9FAFB"
            }}
          />
        </Box>
      </Box>

      {/* Courier info card */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: "primary.main",
                  color: "#020617",
                  fontSize: 18,
                  fontWeight: 600
                }}
              >
                BK
              </Avatar>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  Bwanbale Kato
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <StarRoundedIcon sx={{ fontSize: 16, color: "#facc15" }} />
                  <Typography
                    variant="caption"
                    sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                  >
                    4.9 • 230 deliveries
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  EV courier – EV bike • UBL 630X
                </Typography>
              </Box>
            </Stack>
            <Chip
              size="small"
              label="Verified"
              sx={{
                borderRadius: 999,
                fontSize: 10,
                height: 22,
                bgcolor: "rgba(34,197,94,0.12)",
                color: "#16A34A"
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1.25} sx={{ mt: 1.6 }}>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              startIcon={<PhoneRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{
                borderRadius: 999,
                fontSize: 13,
                textTransform: "none"
              }}
            >
              Call
            </Button>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              startIcon={<MessageRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{
                borderRadius: 999,
                fontSize: 13,
                textTransform: "none"
              }}
            >
              Chat
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Route summary card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Box sx={{ mb: 1.1 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              From
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, letterSpacing: "-0.01em" }}
            >
              EVzone Marketplace – China–Africa Hub Warehouse
            </Typography>
          </Box>
          <Box sx={{ mb: 1.1 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              To
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, letterSpacing: "-0.01em" }}
            >
              Nsambya Road 472, Kampala
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            If you need to update delivery instructions, contact the courier or
            our support team.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default function RiderScreen63ActiveDeliveryDriverInfoLiveTrackingCanvas_v2() {
      return (
    
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (t) => t.palette.background.default
        }}
      >
        

        <DarkModeToggle />

        

        <MobileShell>
          <ActiveDeliveryDriverInfoLiveTrackingScreen />
        </MobileShell>
      </Box>
    
  );
}
