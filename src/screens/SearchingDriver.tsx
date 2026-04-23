import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography
} from "@mui/material";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import LocalTaxiRoundedIcon from "@mui/icons-material/LocalTaxiRounded";
import MapShell from "../components/maps/MapShell";
import ScreenScaffold from "../components/ScreenScaffold";
import { uiTokens } from "../design/tokens";
import { useAppData } from "../contexts/AppDataContext";

function SearchingForDriverScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { actions } = useAppData();
  const [dots, setDots] = useState(".");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [searchTime, setSearchTime] = useState(0);

  useEffect(() => {
    actions.setRideStatus("searching");
  }, [actions.setRideStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 4 ? "." : `${prev}.`));
      setSearchTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchTime < 8) return;
    actions.setRideStatus("driver_on_way");
    navigate("/rides/driver-on-way");
  }, [actions.setRideStatus, navigate, searchTime]);

  const topMapBleedSx = {
    position: "relative",
    width: {
      xs: "calc(100% + (var(--rider-shell-content-px-xs, 20px) * 2))",
      md: "calc(100% + (var(--rider-shell-content-px-md, 24px) * 2))"
    },
    ml: {
      xs: "calc(var(--rider-shell-content-px-xs, 20px) * -1)",
      md: "calc(var(--rider-shell-content-px-md, 24px) * -1)"
    },
    mr: {
      xs: "calc(var(--rider-shell-content-px-xs, 20px) * -1)",
      md: "calc(var(--rider-shell-content-px-md, 24px) * -1)"
    },
    overflow: "hidden"
  } as const;

  return (
    <ScreenScaffold disableTopPadding>
      <Box sx={topMapBleedSx}>
        <MapShell
          preset="compact"
          sx={{ height: { xs: "52dvh", md: "54vh" } }}
          showControls={false}
          canvasSx={{ background: uiTokens.map.canvasEmphasis }}
        >
          <Box
            sx={{
              position: "absolute",
              left: "18%",
              bottom: "22%",
              width: 14,
              height: 14,
              borderRadius: "50%",
              bgcolor: "#22c55e",
              border: "2px solid #ffffff"
            }}
          />
          <Box
            sx={{
              position: "absolute",
              left: "44%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              animation: "carPulse 1.8s ease-in-out infinite",
              "@keyframes carPulse": {
                "0%, 100%": { transform: "translate(-50%, -50%) scale(1)" },
                "50%": { transform: "translate(-50%, -50%) scale(1.1)" }
              }
            }}
          >
            <LocalTaxiRoundedIcon sx={{ fontSize: 28, color: "#F97316" }} />
          </Box>
          <Chip
            size="small"
            icon={<RefreshRoundedIcon sx={{ fontSize: 14 }} />}
            label="Searching Nearby"
            sx={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              borderRadius: 5,
              fontSize: 11,
              height: 28,
              px: 1,
              bgcolor: "rgba(15,23,42,0.92)",
              color: "#F9FAFB",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              border: "1px solid rgba(255,255,255,0.1)"
            }}
          />
        </MapShell>
      </Box>

      <Box sx={{ pt: 0.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
          Searching for driver{dots}
        </Typography>
        <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
          Matching you with the nearest available EV driver.
        </Typography>
      </Box>

      <Card
        elevation={0}
        sx={{
          borderRadius: uiTokens.radius.sm,
          bgcolor: (t) => (t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"),
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 2 }}>
          <Stack direction="row" spacing={1.3} alignItems="center">
            <CircularProgress size={20} thickness={5} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Searching nearby drivers
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
                Hold on while we find the closest available driver.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="outlined"
        size="small"
        onClick={() => setShowCancelDialog(true)}
        sx={{
          borderRadius: uiTokens.radius.xl,
          py: 0.9,
          fontSize: 12,
          textTransform: "none"
        }}
      >
        Cancel request
      </Button>

      <Dialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: uiTokens.radius.lg,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)"
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>Cancel ride request?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: (theme) => theme.palette.text.secondary }}>
            You can request another ride any time.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: uiTokens.spacing.xl, pb: uiTokens.spacing.lg }}>
          <Button onClick={() => setShowCancelDialog(false)} sx={{ textTransform: "none" }}>
            Keep searching
          </Button>
          <Button
            onClick={() => navigate("/rides/options")}
            variant="contained"
            sx={{ textTransform: "none", bgcolor: "#EF4444", "&:hover": { bgcolor: "#DC2626" } }}
          >
            Cancel request
          </Button>
        </DialogActions>
      </Dialog>

    </ScreenScaffold>
  );
}

export default function RiderScreen22SearchingForDriverCanvas_v2() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (theme) => theme.palette.background.default
      }}
    >
      <SearchingForDriverScreen />
    </Box>
  );
}
