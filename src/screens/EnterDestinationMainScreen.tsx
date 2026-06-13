import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Alert
} from "@mui/material";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import GoogleMapView from "../components/maps/GoogleMapView";
import LocationAutocompleteField, {
  type LocationSelection
} from "../components/location/LocationAutocompleteField";
import { useAppData } from "../contexts/AppDataContext";

interface CommonPlaceCardProps {
  icon: React.ReactElement;
  label: string;
  address: string;
  onClick?: () => void;
}

function CommonPlaceCard({ icon, label, address, onClick }: CommonPlaceCardProps): React.JSX.Element {
  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        borderRadius: 2,
        cursor: onClick ? "pointer" : "default",
        bgcolor: (theme) =>
          theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: (theme) =>
          theme.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.8)",
        mb: 1.5,
        "&:hover": onClick ? { borderColor: "primary.main" } : {}
      }}
    >
      <CardContent sx={{ py: 1.5, px: 1.75 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: (theme) =>
                theme.palette.mode === "light"
                  ? "#EFF6FF"
                  : "rgba(248,250,252,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              {label}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              {address}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function EnterDestinationMainScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const { sharedLocationState, actions } = useAppData();
  const { updateRideRequest, updateSharedLocationState } = actions;
  const [destinationQuery, setDestinationQuery] = useState("");
  const [tab, setTab] = useState("common");
  const isOffline = typeof navigator !== "undefined" && navigator.onLine === false;
  const hasGeolocation = typeof navigator !== "undefined" && Boolean(navigator.geolocation);
  const showLocationFallback = isOffline || !hasGeolocation;

  const handleTabChange = (_event: React.SyntheticEvent, value: string): void => {
    setTab(value);
  };

  // Phase 6.2 — when the rider picks a destination, store it in ride state
  // and navigate directly to the ride options / confirm screen.
  const handleSelectDestination = (selection: LocationSelection) => {
    updateRideRequest({
      destination: {
        label: selection.label,
        address: selection.address,
        coordinates: selection.coordinates,
      },
    });
    updateSharedLocationState({
      destinationCoords: selection.coordinates,
    });
    navigate("/rides/options");
  };

  // Quick-tap on a common place card
  const handleCommonPlace = (label: string, address: string) => {
    setDestinationQuery(address);
    updateRideRequest({
      destination: { label, address, coordinates: undefined },
    });
    navigate("/rides/options");
  };

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
          aria-label="Open menu"
          onClick={() => navigate("/home")}
          sx={{
            borderRadius: 5,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
            border: (theme) =>
              theme.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)"
          }}
        >
          <MenuRoundedIcon sx={{ fontSize: 22 }} />
        </IconButton>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
        >
          Where to today?
        </Typography>
        <Box sx={{ width: 32 }} />
      </Box>

      {/* Phase 6.2 — live location autocomplete replaces the static search input */}
      <LocationAutocompleteField
        value={destinationQuery}
        onValueChange={setDestinationQuery}
        onSelectLocation={handleSelectDestination}
        placeholder="Where to?"
        nearbyCoordinates={sharedLocationState.riderLocation ?? sharedLocationState.pickupCoords ?? null}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: 5,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.96)",
            "& fieldset": {
              borderColor: (theme) =>
                theme.palette.mode === "light"
                  ? "rgba(209,213,219,0.9)"
                  : "rgba(51,65,85,0.9)"
            },
            "&:hover fieldset": { borderColor: "primary.main" }
          }
        }}
      />

      {showLocationFallback && (
        <Alert severity={isOffline ? "info" : "warning"} sx={{ mb: 2, borderRadius: 3 }}>
          {isOffline
            ? "You are offline, so live map loading is limited."
            : "This device does not expose geolocation."} You can still type a destination and continue.
        </Alert>
      )}

      {/* Map preview — shows rider's current position */}
      <Box
        sx={{
          mb: 3,
          borderRadius: 3,
          height: { xs: 250, md: 170 },
          position: "relative",
          overflow: "hidden"
        }}
      >
        <GoogleMapView
          center={sharedLocationState.riderLocation ?? { lat: 0.3476, lng: 32.5825 }}
          zoom={14}
          riderLocation={sharedLocationState.riderLocation}
          pickupLocation={sharedLocationState.pickupCoords}
          dropoffLocation={
            destinationQuery
              ? sharedLocationState.destinationCoords ?? null
              : null
          }
        />
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          minHeight: 36,
          mb: 1.5,
          "& .MuiTab-root": {
            minHeight: 36,
            fontSize: 12,
            textTransform: "none",
            color: "rgba(148,163,184,1)"
          },
          "& .Mui-selected": {
            color: "#111827"
          },
          "& .MuiTabs-indicator": {
            height: 2,
            borderRadius: 5,
            bgcolor: "primary.main"
          }
        }}
      >
        <Tab value="common" label="Common Places" />
        <Tab value="commutes" label="Daily Commutes" />
        <Tab value="upcoming" label="Upcoming Rides" />
      </Tabs>

      {/* Tab content */}
      <Box sx={{ mt: 1 }}>
        {tab === "common" && (
          <>
            <CommonPlaceCard
              icon={<HomeRoundedIcon sx={{ fontSize: 20, color: "#F97316" }} />}
              label="Home"
              address="12, JJ Apartments, New Street, Kampala"
              onClick={() => handleCommonPlace("Home", "12, JJ Apartments, New Street, Kampala")}
            />
            <CommonPlaceCard
              icon={<ApartmentRoundedIcon sx={{ fontSize: 20, color: "#F97316" }} />}
              label="Office"
              address="12, JJ Apartments, New Street, Kampala"
              onClick={() => handleCommonPlace("Office", "12, JJ Apartments, New Street, Kampala")}
            />
          </>
        )}

        {tab === "commutes" && (
          <Typography
            variant="caption"
            sx={{
              mt: 4,
              display: "block",
              textAlign: "center",
              color: (theme) => theme.palette.text.secondary
            }}
          >
            No daily commutes yet. Your frequent EV routes will show here.
          </Typography>
        )}

        {tab === "upcoming" && (
          <Typography
            variant="caption"
            sx={{
              mt: 4,
              display: "block",
              textAlign: "center",
              color: (theme) => theme.palette.text.secondary
            }}
          >
            No upcoming rides scheduled. Tap the search bar above to book.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default function RiderScreen2EnterDestinationCanvas_v2() {
      return (
    
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          bgcolor: (theme) => theme.palette.background.default
        }}
      >

          <EnterDestinationMainScreen />
        
      </Box>
    
  );
}
