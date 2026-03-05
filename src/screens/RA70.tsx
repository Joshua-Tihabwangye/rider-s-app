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
  Button
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";

import MobileShell from "../components/MobileShell";

const RENTAL_VEHICLES = [
  {
    id: "EV-RENT-01",
    name: "Nissan Leaf",
    type: "Hatchback",
    dailyPrice: "UGX 180,000",
    mode: "Self-drive",
    seats: 5,
    range: "220 km",
    tag: "Most popular"
  },
  {
    id: "EV-RENT-02",
    name: "Hyundai Kona EV",
    type: "SUV",
    dailyPrice: "UGX 230,000",
    mode: "Self-drive",
    seats: 5,
    range: "300 km",
    tag: "Family friendly"
  },
  {
    id: "EV-RENT-03",
    name: "Tesla Model 3",
    type: "Sedan",
    dailyPrice: "UGX 320,000",
    mode: "With chauffeur",
    seats: 4,
    range: "400 km",
    tag: "Premium"
  }
];

interface Vehicle {
  id: string;
  name: string;
  type: string;
  price?: string;
  dailyPrice?: string;
  mode?: string;
  seats?: number;
  range?: string;
  tag?: string;
  image?: string;
  features?: string[];
}

interface RentalVehicleCardProps {
  vehicle: Vehicle;
}

function RentalVehicleCard({ vehicle }: RentalVehicleCardProps): React.JSX.Element {
  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.75,
        borderRadius: 2,
        bgcolor: (t) =>
          t.palette.mode === "light"
            ? "linear-gradient(135deg,#FFFFFF,#F9FAFB)"
            : "linear-gradient(135deg,#020617,#020617)",
        border: (t) =>
          t.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)"
      }}
    >
      <CardContent sx={{ px: 1.75, py: 1.6 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <Box
            sx={{
              width: 64,
              height: 40,
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#E0F2FE" : "rgba(15,23,42,0.9)"
            }}
          >
            <ElectricCarRoundedIcon sx={{ fontSize: 28, color: "primary.main" }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  {vehicle.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  {vehicle.type} • {vehicle.mode}
                </Typography>
              </Box>
              {vehicle.tag && (
                <Chip
                  label={vehicle.tag}
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
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <PeopleAltRoundedIcon
                  sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  {vehicle.seats} seats
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <BatteryChargingFullRoundedIcon
                  sx={{ fontSize: 16, color: (t) => t.palette.text.secondary }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  {vehicle.range}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
          >
            {vehicle.dailyPrice} <Typography component="span" variant="caption" sx={{ fontSize: 11 }}>/ day</Typography>
          </Typography>
          <Button
            size="small"
            variant="contained"
            sx={{
              borderRadius: 999,
              px: 2,
              py: 0.5,
              fontSize: 12,
              textTransform: "none",
              bgcolor: "primary.main",
              color: "#020617",
              "&:hover": { bgcolor: "#06e29a" }
            }}
          >
            Select
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function RentalVehicleListScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const filteredVehicles = RENTAL_VEHICLES.filter((v) => {
    if (filter === "all") return true;
    if (filter === "self") return v.mode === "Self-drive";
    if (filter === "chauffeur") return v.mode === "With chauffeur";
    if (filter === "suv") return v.type === "SUV";
    return true;
  });

  return (
    <>
    {/* Green Header */}
        <Box sx={{ bgcolor: "#03CD8C", px: 2.5, pt: 2, pb: 2, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
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
            Choose your EV rental
          </Typography>
        </Box>
        <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>


      {/* Filters */}
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
        <Chip
          label="All"
          onClick={() => setFilter("all")}
          size="small"
          sx={{
            borderRadius: 999,
            fontSize: 11,
            height: 26,
            bgcolor: filter === "all" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
            color: filter === "all" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
        <Chip
          label="Self-drive"
          onClick={() => setFilter("self")}
          size="small"
          sx={{
            borderRadius: 999,
            fontSize: 11,
            height: 26,
            bgcolor: filter === "self" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
            color: filter === "self" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
        <Chip
          label="With chauffeur"
          onClick={() => setFilter("chauffeur")}
          size="small"
          sx={{
            borderRadius: 999,
            fontSize: 11,
            height: 26,
            bgcolor: filter === "chauffeur" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
            color: filter === "chauffeur" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
        <Chip
          label="SUVs"
          onClick={() => setFilter("suv")}
          size="small"
          sx={{
            borderRadius: 999,
            fontSize: 11,
            height: 26,
            bgcolor: filter === "suv" ? "primary.main" : (t) =>
              t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
            border: (t) =>
              t.palette.mode === "light" ? "1px solid rgba(209,213,219,0.9)" : "1px solid rgba(51,65,85,0.9)",
            color: filter === "suv" ? "#020617" : (t) => t.palette.text.primary
          }}
        />
      </Stack>

      {/* Vehicle list */}
      {filteredVehicles.length === 0 ? (
        <Typography
          variant="caption"
          sx={{ mt: 4, display: "block", textAlign: "center", color: (t) => t.palette.text.secondary }}
        >
          No EV rentals match your filters. Try adjusting your dates or location.
        </Typography>
      ) : (
        filteredVehicles.map((vehicle) => (
          <RentalVehicleCard key={vehicle.id} vehicle={vehicle} />
        ))
      )}
    </Box>
    </>

  );
}

export default function RiderScreen70RentalVehicleListCanvas_v2() {
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
          <RentalVehicleListScreen />
        </MobileShell>
      </Box>
    
  );
}
