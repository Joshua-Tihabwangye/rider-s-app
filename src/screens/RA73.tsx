import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  Button
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";

import MobileShell from "../components/MobileShell";

const BRANCHES = [
  "Nsambya EV Hub",
  "Bugolobi EV Hub",
  "Entebbe Airport EV Desk",
  "Kansanga EV Pickup Point"
];

function RentalPickupReturnBranchesScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [pickupBranch, setPickupBranch] = useState("Nsambya EV Hub");
  const [returnBranch, setReturnBranch] = useState("Nsambya EV Hub");

  const canContinue = Boolean(pickupBranch.trim() && returnBranch.trim());

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
              Pickup & return locations
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Choose where you collect and drop off the EV
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Pickup card */}
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
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.5, display: "block" }}
          >
            Pickup branch
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={pickupBranch}
            onChange={(e) => setPickupBranch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PlaceRoundedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                </InputAdornment>
              )
            }}
            sx={{
              mb: 1.5,
              "& .MuiOutlinedInput-root": {
                borderRadius: 999,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": { borderColor: "primary.main" }
              }
            }}
          />

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {BRANCHES.map((b) => (
              <Chip
                key={b}
                label={b}
                size="small"
                onClick={() => setPickupBranch(b)}
                sx={{
                  borderRadius: 999,
                  fontSize: 11,
                  height: 24,
                  bgcolor:
                    pickupBranch === b
                      ? "primary.main"
                      : (t) =>
                          t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                  color:
                    pickupBranch === b ? "#020617" : (t) => t.palette.text.primary
                }}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Return card */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
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
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 0.5, display: "block" }}
          >
            Return branch
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={returnBranch}
            onChange={(e) => setReturnBranch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PlaceRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                </InputAdornment>
              )
            }}
            sx={{
              mb: 1.5,
              "& .MuiOutlinedInput-root": {
                borderRadius: 999,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": { borderColor: "primary.main" }
              }
            }}
          />

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {BRANCHES.map((b) => (
              <Chip
                key={b}
                label={b}
                size="small"
                onClick={() => setReturnBranch(b)}
                sx={{
                  borderRadius: 999,
                  fontSize: 11,
                  height: 24,
                  bgcolor:
                    returnBranch === b
                      ? "primary.main"
                      : (t) =>
                          t.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,0.96)",
                  color:
                    returnBranch === b ? "#020617" : (t) => t.palette.text.primary
                }}
              />
            ))}
          </Stack>

          <Typography
            variant="caption"
            sx={{ mt: 1.2, fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            Some locations may charge a one‑way drop‑off fee if pickup and
            return branches are different. You’ll see this on the summary screen.
          </Typography>
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="contained"
        disabled={!canContinue}
        sx={{
          borderRadius: 999,
          py: 1.1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: canContinue ? "primary.main" : "#9CA3AF",
          color: canContinue ? "#020617" : "#E5E7EB",
          "&:hover": {
            bgcolor: canContinue ? "#06e29a" : "#9CA3AF"
          }
        }}
      >
        Continue to summary & payment
      </Button>
    </Box>
  );
}

export default function RiderScreen73RentalPickupReturnBranchesCanvas_v2() {
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
          <RentalPickupReturnBranchesScreen />
        </MobileShell>
      </Box>
    
  );
}
