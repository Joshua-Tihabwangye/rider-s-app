import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Chip,
  Button
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import TwoWheelerRoundedIcon from "@mui/icons-material/TwoWheelerRounded";
import LocalTaxiRoundedIcon from "@mui/icons-material/LocalTaxiRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import MobileShell from "../components/MobileShell";

const EV_OPTIONS = [
  {
    id: "eco",
    name: "Eco EV",
    description: "Best for solo & everyday rides",
    icon: <ElectricCarRoundedIcon sx={{ fontSize: 26 }} />,
    eta: "3 min",
    price: "UGX 9,500",
    capacity: "1–4 riders",
    tag: "Most popular",
    emission: "0g CO₂ / km"
  },
  {
    id: "comfort",
    name: "Comfort EV",
    description: "More legroom and quieter cabins",
    icon: <LocalTaxiRoundedIcon sx={{ fontSize: 26 }} />,
    eta: "6 min",
    price: "UGX 14,000",
    capacity: "1–4 riders",
    tag: "Extra comfort",
    emission: "0g CO₂ / km"
  },
  {
    id: "suv",
    name: "EV SUV",
    description: "Space for family & luggage",
    icon: <ElectricCarRoundedIcon sx={{ fontSize: 26 }} />,
    eta: "8 min",
    price: "UGX 19,500",
    capacity: "1–6 riders",
    tag: "Group ride",
    emission: "0g CO₂ / km"
  },
  {
    id: "bike",
    name: "EV Bike",
    description: "Fast solo rides, great for traffic",
    icon: <TwoWheelerRoundedIcon sx={{ fontSize: 26 }} />,
    eta: "2 min",
    price: "UGX 4,000",
    capacity: "1 rider",
    tag: null,
    emission: "0g CO₂ / km"
  }
];

function EVOptionCard({ option, selected, onSelect }) {
  const isActive = selected === option.id;
  return (
    <Card
      elevation={0}
      onClick={() => onSelect(option.id)}
      sx={{
        mb: 1.75,
        borderRadius: 2,
        cursor: "pointer",
        transition: "all 0.15s ease",
        bgcolor: (theme) =>
          theme.palette.mode === "light"
            ? isActive
              ? "#ECFDF5"
              : "#FFFFFF"
            : isActive
            ? "rgba(15,118,110,0.32)"
            : "rgba(15,23,42,0.98)",
        border: (theme) =>
          isActive
            ? "1px solid #03CD8C"
            : theme.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)"
      }}
    >
      <CardContent sx={{ px: 1.75, py: 1.6 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 999,
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {option.icon}
            </Box>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  {option.name}
                </Typography>
                {option.tag && (
                  <Chip
                    label={option.tag}
                    size="small"
                    sx={{
                      borderRadius: 999,
                      fontSize: 10,
                      height: 22,
                      bgcolor: "rgba(59,130,246,0.08)",
                      color: "#1D4ED8"
                    }}
                  />
                )}
              </Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
              >
                {option.description}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 10,
                  color: (theme) => theme.palette.text.secondary
                }}
              >
                {option.capacity} • {option.emission}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              ETA {option.eta}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, mt: 0.3, color: (theme) => theme.palette.text.primary }}
            >
              {option.price}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function SelectYourRideScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("eco");

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
              Select your ride
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              All options are fully electric, no fuel vehicles
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Trip summary chip */}
      <Chip
        icon={<DirectionsCarFilledRoundedIcon sx={{ fontSize: 16 }} />}
        label="Nsambya Road → Bugolobi • 6.2 km"
        sx={{
          mb: 2.5,
          borderRadius: 999,
          fontSize: 11,
          height: 28,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#E0F2FE" : "rgba(15,23,42,0.96)",
          color: (theme) => theme.palette.text.primary
        }}
      />

      {/* EV options list */}
      <Box sx={{ mb: 2.5 }}>
        {EV_OPTIONS.map((opt) => (
          <EVOptionCard
            key={opt.id}
            option={opt}
            selected={selected}
            onSelect={setSelected}
          />
        ))}
      </Box>

      {/* Info */}
      <Box
        sx={{
          mb: 1.5,
          display: "flex",
          alignItems: "flex-start",
          gap: 1
        }}
      >
        <InfoOutlinedIcon
          sx={{ fontSize: 18, color: (theme) => theme.palette.text.secondary }}
        />
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
        >
          Your choice affects comfort and price, but every EVzone ride is
          100% electric, quieter and cleaner than traditional taxis.
        </Typography>
      </Box>

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
  );
}

export default function RiderScreen20SelectYourRideCanvas_v2() {
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
          <SelectYourRideScreen />
        </MobileShell>
      </Box>
    
  );
}
