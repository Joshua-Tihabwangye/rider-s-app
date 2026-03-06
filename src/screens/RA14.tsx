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

const RIDE_TYPES = [
  {
    id: "eco",
    name: "Eco EV",
    description: "Affordable everyday electric rides",
    icon: <ElectricCarRoundedIcon sx={{ fontSize: 26 }} />,
    eta: "3 min",
    price: "From UGX 9,500",
    tag: "Most popular",
    capacity: "1–4 riders"
  },
  {
    id: "comfort",
    name: "Comfort EV",
    description: "Extra legroom and quieter cabins",
    icon: <LocalTaxiRoundedIcon sx={{ fontSize: 26 }} />,
    eta: "6 min",
    price: "From UGX 14,000",
    tag: "Best value",
    capacity: "1–4 riders"
  },
  {
    id: "bike",
    name: "EV Bike",
    description: "Fast solo rides, great for traffic",
    icon: <TwoWheelerRoundedIcon sx={{ fontSize: 26 }} />,
    eta: "2 min",
    price: "From UGX 4,000",
    tag: null,
    capacity: "1 rider"
  }
];

interface RideType {
  id: string;
  name: string;
  description?: string;
  icon: React.ReactElement;
  eta?: string;
  price: string;
  tag: string | null;
  capacity: string;
}

interface RideTypeCardProps {
  type: RideType;
  selected: string;
  onSelect: (id: string) => void;
}

function RideTypeCard({ type, selected, onSelect }: RideTypeCardProps): React.JSX.Element {
  const isActive = selected === type.id;
  return (
    <Card
      elevation={0}
      onClick={() => onSelect(type.id)}
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
                width: 42,
                height: 42,
                borderRadius: 999,
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#F3F4F6" : "rgba(15,23,42,1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {type.icon}
            </Box>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  {type.name}
                </Typography>
                {type.tag && (
                  <Chip
                    label={type.tag}
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
                {type.description}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mx: 7, textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              {type.capacity}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              ETA {type.eta}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, mt: 0.5, color: (theme) => theme.palette.text.primary }}
            >
              {type.price}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function SelectRideTypeScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("eco");

  return (
    <>
    {/* Green Header */}
        <Box sx={{ bgcolor: "#03CD8C", px: 2, pt: 2, pb: 2, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
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
            Choose your EV ride
          </Typography>
        </Box>
        <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>


      {/* Trip summary pill */}
      <Chip
        icon={<DirectionsCarFilledRoundedIcon sx={{ fontSize: 16 }} />}
        label="Nsambya Road → Bugolobi • Today"
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

      {/* Ride type list */}
      <Box sx={{ mb: 2.5 }}>
        {RIDE_TYPES.map((rt) => (
          <RideTypeCard
            key={rt.id}
            type={rt}
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
          Prices shown are estimates and may change slightly based on actual
          distance and traffic. You will see the final fare after the trip.
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
    </>

  );
}

export default function RiderScreen14SelectRideTypeCanvas_v2() {
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
          <SelectRideTypeScreen />
        </MobileShell>
      </Box>
    
  );
}
