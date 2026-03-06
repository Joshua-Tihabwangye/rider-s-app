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
  Button,
  Chip,
  Stack,
  Avatar
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PercentRoundedIcon from "@mui/icons-material/PercentRounded";
import MobileShell from "../components/MobileShell";

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
        py: 1
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
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
                  borderRadius: 999,
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
    <>
    {/* Green Header */}
        <Box sx={{ bgcolor: "#03CD8C", px: 7, pt: 2, pb: 2, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              position: "absolute",
              left: 20,
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
            Shared passengers
          </Typography>
        </Box>
        <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>


      {/* Fare summary */}
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
          <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
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
                borderRadius: 999,
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
          <Stack spacing={0.5}>
            {SHARED_PASSENGERS.map((p) => (
              <SharedPassengerRow key={p.id} passenger={p} />
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{ mb: 1.25, display: "block", fontSize: 11, color: (t) => t.palette.text.secondary }}
      >
        Only joined passengers are charged at the end of the trip. Invited
        passengers who never joined will not be billed.
      </Typography>

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
        Done
      </Button>
    </Box>
    </>

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
        

        <DarkModeToggle />

        

        <MobileShell>
          <SharedPassengersScreen />
        </MobileShell>
      </Box>
    
  );
}
