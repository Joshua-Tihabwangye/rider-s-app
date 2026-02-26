import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Stack,
  Button
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import PhoneEnabledRoundedIcon from "@mui/icons-material/PhoneEnabledRounded";

import MobileShell from "../components/MobileShell";

function AmbulanceHomeRequestTypeScreen(): React.JSX.Element {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
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
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
        >
          Ambulance Request
        </Typography>
        <Box sx={{ width: 32 }} />
      </Box>
      {/* Critical banner */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FEF2F2" : "rgba(127,29,29,0.85)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid #FCA5A5"
              : "1px solid rgba(254,202,202,0.6)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.6 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 999,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FEE2E2" : "rgba(248,113,113,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <LocalHospitalRoundedIcon sx={{ fontSize: 24, color: "#DC2626" }} />
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}
              >
                For emergencies
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                If this is life‑threatening, call your local emergency number
                immediately before using this app.
              </Typography>
            </Box>
          </Stack>
          <Button
            fullWidth
            variant="contained"
            startIcon={<PhoneEnabledRoundedIcon sx={{ fontSize: 18 }} />}
            sx={{
              borderRadius: 999,
              py: 1,
              fontSize: 14,
              fontWeight: 600,
              textTransform: "none",
              bgcolor: "#DC2626",
              color: "#FEF2F2",
              "&:hover": { bgcolor: "#B91C1C" }
            }}
          >
            Call emergency services
          </Button>
        </CardContent>
      </Card>

      {/* Request type card */}
      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}
      >
        Choose ambulance request type
      </Typography>

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
          <Stack spacing={1.5}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                Immediate ambulance
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                For urgent but non‑life‑threatening situations. We will connect
                you to the nearest available ambulance.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate("/ambulance/location", { state: { mode: "urgent" } })}
                sx={{
                  mt: 1,
                  borderRadius: 999,
                  py: 1,
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: "none",
                  bgcolor: "primary.main",
                  color: "#020617",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "#06e29a",
                    transform: "translateY(-1px)",
                    boxShadow: 4
                  },
                  "&:active": { transform: "translateY(0)" }
                }}
              >
                Request ambulance now
              </Button>
            </Box>

            <Box sx={{ mt: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                Scheduled transfer
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                For planned hospital transfers or clinic referrals at a later
                time.
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/ambulance/book-transfer")}
                sx={{
                  mt: 1,
                  borderRadius: 999,
                  py: 1,
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: "none",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: 2
                  },
                  "&:active": { transform: "translateY(0)" }
                }}
              >
                Schedule a transfer
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
      >
        Ambulance requests from this app are coordinated via partner hospitals
        and providers. Availability may vary by location.
      </Typography>
    </Box>
  );
}

export default function RiderScreen83AmbulanceHomeRequestTypeCanvas_v2() {
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
          <AmbulanceHomeRequestTypeScreen />
        </MobileShell>
      </Box>
    
  );
}
