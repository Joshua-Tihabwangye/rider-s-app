import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Stack,
  Avatar,
  Switch,
  FormControlLabel
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import MobileShell from "../components/MobileShell";

// Passenger data - would come from backend/API
// Retrieve all passengers from the ongoing trip session API
const PASSENGERS = [
  {
    id: 1,
    name: "Stewart Robinson",
    initials: "SR",
    dropOff: "Stanbic Bank ATM | Kajjansi",
    fare: "15,256",
    isMain: true
  },
  {
    id: 2,
    name: "Georges Charette",
    initials: "GC",
    dropOff: "Stanbic Bank ATM | Kajjansi",
    fare: "15,256",
    isMain: false
  },
  {
    id: 3,
    name: "Frédéric Guimond",
    initials: "FG",
    dropOff: "CoRSU Rehabilitation Hospital, Kusubi",
    fare: "5,700",
    isMain: false
  },
  {
    id: 4,
    name: "Emmanuel Barrière",
    initials: "EB",
    dropOff: "Bwebajja, Entebbe Road",
    fare: "11,896",
    isMain: false
  }
];

interface Passenger {
  id: number;
  name: string;
  initials: string;
  isOwner?: boolean;
  joined?: boolean;
  isMain?: boolean;
  dropOff?: string;
  fare?: string;
}

interface PassengerCardProps {
  passenger: Passenger;
}

function PassengerCard({ passenger }: PassengerCardProps): React.JSX.Element {
  return (
    <Card
      elevation={0}
        sx={{
        mb: 1.5,
        borderRadius: 2,
        bgcolor: (theme) =>
          theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: (theme) =>
          theme.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
      }}
    >
      <CardContent sx={{ px: 2, py: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Profile Photo */}
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: passenger.isMain ? "#03CD8C" : "rgba(15,23,42,0.9)",
              fontSize: 18,
              fontWeight: 600,
              color: "#FFFFFF"
            }}
          >
            {passenger.initials}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            {/* Passenger Name */}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                letterSpacing: "-0.01em",
                mb: 0.5,
                color: (theme) => theme.palette.text.primary
              }}
            >
              {passenger.name}
            </Typography>
            {/* Drop-off Location */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
              <PlaceRoundedIcon
                sx={{ fontSize: 14, color: (theme) => theme.palette.text.secondary }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontSize: 12,
                  color: (theme) => theme.palette.text.secondary
                }}
              >
                {passenger.dropOff}
              </Typography>
            </Box>
            {/* Fare - highlighted in green */}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                fontSize: 14,
                color: "#22c55e"
              }}
            >
              UGX {passenger.fare}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function SharingPassengersScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isActivated, setIsActivated] = useState(true);

  const handleToggleActivation = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = event.target.checked;
    setIsActivated(newValue);
    // Toggle state (ON/OFF) updates the trip_sharing_status field in the backend
    // The list of sharing passengers refreshes dynamically based on activation state
    console.log("Trip sharing status:", newValue ? "ON" : "OFF");
    // In production: Update backend API
    // fetch('/api/trip/sharing-status', { method: 'PUT', body: { enabled: newValue } })
  };

  // Filter passengers based on activation state
  // When switched off, only the main passenger remains on the trip
  const mainPassenger = PASSENGERS.find((p) => p.isMain) || PASSENGERS[0];
  const sharingPassengers = isActivated
    ? PASSENGERS.filter((p) => !p.isMain)
    : [];

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (theme) => theme.palette.background.default }}>
      {/* Map Background - Displays the trip route visually */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "45vh",
          background: (theme) =>
            theme.palette.mode === "light"
              ? "#F5F5F5"
              : "linear-gradient(135deg, rgba(15,23,42,0.3), #020617 60%, #020617 100%)",
          overflow: "hidden"
        }}
      >
        {/* Grid overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: theme.palette.mode === "light" ? 0.12 : 0.2,
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.4) 1px, transparent 1px)",
            backgroundSize: "32px 32px"
          }}
        />

        {/* Map Labels - to make it look like a real map */}
        <Typography
          sx={{
            position: "absolute",
            top: "10%",
            left: "10%",
            fontSize: 10,
            fontWeight: 500,
            color: (theme) => theme.palette.mode === "light" ? "#03CD8C" : "#E2E8F0",
            zIndex: 1,
            textShadow: (theme) => theme.palette.mode === "light" ? "none" : "0 1px 2px rgba(0,0,0,0.3)"
          }}
        >
          Entebbe
        </Typography>

            <Typography
          sx={{
            position: "absolute",
            top: "8%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 11,
            fontWeight: 600,
            color: (theme) => theme.palette.mode === "light" ? "#03CD8C" : "#E2E8F0",
            zIndex: 1,
            textShadow: (theme) => theme.palette.mode === "light" ? "none" : "0 1px 2px rgba(0,0,0,0.3)"
          }}
            >
          Lake Victoria Hotel
            </Typography>

            <Typography
          sx={{
            position: "absolute",
            top: "45%",
            left: "20%",
            fontSize: 9,
            fontWeight: 500,
            color: (theme) => theme.palette.mode === "light" ? "#03CD8C" : "#E2E8F0",
            zIndex: 1,
            textShadow: (theme) => theme.palette.mode === "light" ? "none" : "0 1px 2px rgba(0,0,0,0.3)"
          }}
        >
          Kajjansi
            </Typography>

          <Typography
          sx={{
            position: "absolute",
            bottom: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 9,
            fontWeight: 500,
            color: (theme) => theme.palette.mode === "light" ? "#03CD8C" : "#E2E8F0",
            zIndex: 1,
            textShadow: (theme) => theme.palette.mode === "light" ? "none" : "0 1px 2px rgba(0,0,0,0.3)"
          }}
        >
          Bwebajja
        </Typography>

        {/* Route line - showing trip route */}
        <Box
          sx={{
            position: "absolute",
            left: "15%",
            bottom: "25%",
            width: "60%",
            height: 4,
            bgcolor: "#1E3A5F",
            borderRadius: 2,
            transform: "rotate(-35deg)",
            transformOrigin: "left center",
            opacity: 0.7,
            zIndex: 2
          }}
        />

        {/* Pickup marker (green) - bottom-left */}
        <Box
          sx={{
            position: "absolute",
            left: "15%",
            bottom: "25%",
            width: 16,
            height: 16,
            borderRadius: "50%",
            bgcolor: "#22c55e",
            border: "3px solid white",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            zIndex: 5
          }}
        />

        {/* Destination markers for passengers */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "45%",
            transform: "translate(-50%, -50%)",
            width: 18,
            height: 18,
            borderRadius: "50%",
            bgcolor: "#F59E0B",
            border: "3px solid white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            zIndex: 5
          }}
        />

        <Box
          sx={{
            position: "absolute",
            right: "20%",
            bottom: "15%",
            width: 16,
            height: 16,
            borderRadius: "50%",
            bgcolor: "#F59E0B",
            border: "3px solid white",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            zIndex: 5
          }}
        />

        {/* Vehicle icon on route */}
        <Box
          sx={{
            position: "absolute",
            left: "40%",
            top: "60%",
            transform: "translate(-50%, -50%) rotate(-35deg)",
            zIndex: 6
          }}
        >
          <DirectionsCarFilledRoundedIcon
            sx={{
              fontSize: 28,
              color: "#03CD8C",
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))"
            }}
          />
          <Box
                  sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: "#FFFFFF",
              mt: 0.5,
              ml: "50%",
              transform: "translateX(-50%)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.25)"
            }}
          />
        </Box>

        {/* Back Arrow - Top left */}
        <IconButton
          size="small"
          aria-label="Back"
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            bgcolor: "rgba(3,205,140,0.15)",
            color: "#03CD8C",
            width: 40,
            height: 40,
            "&:hover": {
              bgcolor: "#93C5FD"
            },
            zIndex: 10
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>

        {/* Floating Sharing Icon (group of people) - Right side */}
        <IconButton
          sx={{
            position: "absolute",
            right: 14,
            top: "35%",
            bgcolor: "rgba(3,205,140,0.15)",
            color: "#03CD8C",
            width: 52,
            height: 52,
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            "&:hover": {
              bgcolor: "#93C5FD",
              transform: "scale(1.08)",
              transition: "transform 0.2s ease",
              boxShadow: "0 6px 16px rgba(0,0,0,0.3)"
            },
            zIndex: 10
          }}
        >
          <GroupRoundedIcon sx={{ fontSize: 26 }} />
        </IconButton>
      </Box>

      {/* Content Section - with proper spacing to not overlap map */}
      <Box sx={{ px: 2.5, pt: 3, pb: 2 }}>
        {/* Header Section */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}
      >
          <CardContent sx={{ px: 2, py: 1.5 }}>
            {/* Title */}
          <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                letterSpacing: "-0.01em",
                mb: 2,
                color: (theme) => theme.palette.text.primary
              }}
          >
              Sharing (Passengers)
          </Typography>

            {/* Activation Toggle */}
            <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.5,
                borderRadius: 2,
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)"
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: (theme) => theme.palette.text.primary
                  }}
                >
                  Activation
                </Typography>
                {isActivated && (
                  <CheckCircleRoundedIcon
                    sx={{ fontSize: 18, color: "#22c55e" }}
                  />
                )}
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={isActivated}
                    onChange={handleToggleActivation}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#22c55e"
                },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: "#22c55e"
              }
            }}
          />
                }
                label=""
              />
            </Box>
        </CardContent>
      </Card>

        {/* Main Passenger Section */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="subtitle2"
          sx={{
              fontWeight: 600,
              mb: 1.5,
              color: (theme) => theme.palette.text.primary,
              fontSize: 13
          }}
        >
            Main Passenger
          </Typography>
          {mainPassenger && <PassengerCard passenger={mainPassenger} />}
        </Box>

        {/* Sharing Passengers Section */}
        {isActivated && sharingPassengers.length > 0 && (
          <Box>
            <Typography
              variant="subtitle2"
          sx={{
            fontWeight: 600,
                mb: 1.5,
                color: (theme) => theme.palette.text.primary,
                fontSize: 13
          }}
        >
              Sharing Passengers
            </Typography>
            <Stack spacing={0}>
              {sharingPassengers.map((passenger) => (
                <PassengerCard key={passenger.id} passenger={passenger} />
              ))}
      </Stack>
          </Box>
        )}

        {!isActivated && (
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)",
              textAlign: "center"
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: 12,
                color: (theme) => theme.palette.text.secondary
              }}
            >
              Trip sharing is disabled. Only the main passenger remains on the trip.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default function RiderScreen31SharingPassengersCanvas_v2() {
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
        {/* Green Header */}
        <Box sx={{ bgcolor: "#03CD8C", px: 2.5, pt: 2, pb: 2, display: "flex", alignItems: "center", gap: 1.5, position: "relative", zIndex: 2 }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => window.history.back()}
            sx={{ borderRadius: 999, bgcolor: "rgba(255,255,255,0.2)", color: "#FFFFFF", "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: "-0.01em", color: "#FFFFFF" }}>
            Sharing passengers
          </Typography>
        </Box>
        <SharingPassengersScreen />
        </MobileShell>
      </Box>
  );
}
