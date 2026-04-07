import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  Avatar
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PercentRoundedIcon from "@mui/icons-material/PercentRounded";
import { uiTokens } from "../design/tokens";

const SHARED_PASSENGERS = [
  { id: 1, name: "You", initials: "YOU", share: 0.4, isOwner: true },
  { id: 2, name: "Mary", initials: "M", share: 0.35 },
  { id: 3, name: "John", initials: "J", share: 0.25 }
];

interface Passenger {
  id: number;
  name: string;
  initials: string;
  isOwner?: boolean;
  share?: number;
}

interface SharedPassengerRowProps {
  passenger: Passenger;
}

function SharedPassengerRow({ passenger }: SharedPassengerRowProps): React.JSX.Element {
  const isOwner = passenger.isOwner;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: uiTokens.spacing.smPlus
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.md }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: isOwner ? "primary.main" : "rgba(15,23,42,0.9)",
            color: "#F9FAFB",
            fontSize: 13,
            fontWeight: 600
          }}
        >
          {passenger.initials}
        </Avatar>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.sm }}>
            <Typography
              variant="body2"
              sx={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.01em" }}
            >
              {passenger.name}
            </Typography>
            {isOwner && (
              <Chip
                label="Payer"
                size="small"
                sx={{
                  borderRadius: uiTokens.radius.xl,
                  fontSize: 10,
                  height: 20,
                  bgcolor: "rgba(34,197,94,0.12)",
                  color: "#16A34A"
                }}
              />
            )}
          </Box>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            {passenger.share ? Math.round(passenger.share * 100) : 0}% of fare
          </Typography>
        </Box>
      </Box>
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, fontSize: 13, letterSpacing: "-0.01em" }}
      >
        UGX {passenger.share ? (14500 * passenger.share).toFixed(0) : "0"}
      </Typography>
    </Box>
  );
}

function SharedPassengersScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const totalFare = 14500;

  return (
    <Box sx={{ px: uiTokens.spacing.xl, pt: uiTokens.spacing.xl, pb: uiTokens.spacing.xxl }}>
      {/* Header */}
      <Box
        sx={{
          mb: uiTokens.spacing.lg,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: uiTokens.spacing.mdPlus }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: uiTokens.radius.xl,
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
              Shared passengers
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Who joined this ride and how the fare is shared
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Fare summary */}
      <Card
        elevation={0}
        sx={{
          mb: uiTokens.spacing.xl,
          borderRadius: uiTokens.radius.sm,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.lg }}>
          <Stack direction="row" spacing={uiTokens.spacing.mdPlus} alignItems="center" justifyContent="space-between">
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                Total fare
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                UGX {totalFare.toLocaleString()}
              </Typography>
            </Box>
            <Chip
              icon={<PercentRoundedIcon sx={{ fontSize: 16 }} />}
              label="Split between passengers"
              size="small"
              sx={{
                borderRadius: uiTokens.radius.xl,
                fontSize: 10,
                height: 24,
                bgcolor: "rgba(34,197,94,0.12)",
                color: "#16A34A"
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Passenger list */}
      <Card
        elevation={0}
        sx={{
          mb: uiTokens.spacing.lg,
          borderRadius: uiTokens.radius.sm,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: uiTokens.spacing.lg, py: uiTokens.spacing.lg }}>
          <Stack spacing={0.5}>
            {SHARED_PASSENGERS.map((p) => (
              <SharedPassengerRow key={p.id} passenger={p} />
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{ mb: uiTokens.spacing.mdPlus, display: "block", fontSize: 11, color: (t) => t.palette.text.secondary }}
      >
        Only joined passengers are charged at the end of the trip. Invited
        passengers who never joined will not be billed.
      </Typography>

      <Button
        fullWidth
        variant="contained"
        sx={{
          borderRadius: uiTokens.radius.xl,
          py: uiTokens.spacing.md,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: "primary.main",
          color: "#020617",
          "&:hover": { bgcolor: "#06e29a" }
        }}
      >
        Done
      </Button>
    </Box>
  );
}

export default function RiderScreen36SharedPassengersCanvas_v2() {
      return (
    
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (theme) => theme.palette.background.default
        }}
      >

          <SharedPassengersScreen />
        
      </Box>
    
  );
}
