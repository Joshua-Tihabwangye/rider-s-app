import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  useTheme
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import MapShell from "../components/maps/MapShell";
import { uiTokens } from "../design/tokens";
import type { MapPoint } from "../components/maps/LeafletMapView";
import { geocodeAddress, reverseGeocode } from "../services/maps";

const KAMPALA_CENTER: MapPoint = { lat: 0.3476, lng: 32.5825 };

interface StopState {
  id: string;
  value: string;
  coordinates?: MapPoint;
  address?: string;
}

function PickDestinationMapScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const initialState = (location.state as Record<string, unknown> | null) ?? {};

  const initialCoordinates = (initialState.destinationCoords as MapPoint | undefined) ?? KAMPALA_CENTER;
  const initialDestination = (initialState.destination as string | undefined) ?? "Kampala City";

  const [destination, setDestination] = useState(initialDestination);
  const [coordinates, setCoordinates] = useState<MapPoint>(initialCoordinates);
  const [mapCenter, setMapCenter] = useState<MapPoint>(initialCoordinates);
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      const label = await reverseGeocode(coordinates);
      setDestination(label ?? `${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`);
    }, 420);
    return () => window.clearTimeout(timer);
  }, [coordinates.lat, coordinates.lng]);

  const handleDestinationChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const value = event.target.value;
    setDestination(value);
    if (value.trim().length < 3) {
      return;
    }
    setIsGeocoding(true);
    const nextPoint = await geocodeAddress(value);
    if (nextPoint) {
      setCoordinates(nextPoint);
      setMapCenter(nextPoint);
    }
    setIsGeocoding(false);
  };

  const handleConfirm = (): void => {
    if (
      initialState.returnRoute === "/rides/enter/multi-stops" &&
      Array.isArray(initialState.stops)
    ) {
      const mapPickStopId = initialState.mapPickStopId as string | undefined;
      const stops = initialState.stops as StopState[];
      const updatedStops = stops.map((stop) =>
        stop.id === mapPickStopId
          ? { ...stop, value: destination, address: destination, coordinates }
          : stop
      );
      navigate("/rides/enter/multi-stops", {
        state: { ...initialState, stops: updatedStops, fromMap: true }
      });
      return;
    }

    navigate("/rides/enter/details", {
      state: {
        ...initialState,
        destination,
        destinationCoords: coordinates,
        fromMap: true
      }
    });
  };

  const mapMarkers = useMemo(
    () => [
      {
        id: "selected-destination",
        position: coordinates,
        label: destination || "Selected destination",
        color: "#03CD8C"
      }
    ],
    [coordinates, destination]
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.mode === "light" ? "#FFFFFF" : "#1E2A47",
        paddingBottom: { xs: "calc(100px + env(safe-area-inset-bottom))", sm: "100px" },
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Box sx={{ px: 2.5, pt: 2.5, pb: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: uiTokens.spacing.md,
            mb: uiTokens.spacing.lg
          }}
        >
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: uiTokens.radius.xl,
              bgcolor: theme.palette.mode === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)",
              color: theme.palette.mode === "light" ? theme.palette.text.primary : "#FFFFFF"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: theme.palette.mode === "light" ? theme.palette.text.primary : "#FFFFFF"
            }}
          >
            Pick Your Destination
          </Typography>
        </Box>

        <TextField
          fullWidth
          size="small"
          variant="outlined"
          value={destination}
          onChange={handleDestinationChange}
          placeholder="Kampala City"
          disabled={isGeocoding}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: uiTokens.radius.xl,
              bgcolor: theme.palette.mode === "light" ? "#FFFFFF" : "rgba(255,255,255,0.1)"
            }
          }}
        />
      </Box>

      <MapShell
        height="100%"
        sx={{ flex: 1 }}
        showControls={false}
        mapCenter={mapCenter}
        mapMarkers={mapMarkers}
        onMapClick={(point) => {
          setCoordinates(point);
          setMapCenter(point);
          setIsGeocoding(true);
          window.setTimeout(() => setIsGeocoding(false), 250);
        }}
      />

      <Box
        sx={{
          position: "fixed",
          bottom: { xs: "calc(64px + env(safe-area-inset-bottom))", sm: 64 },
          left: 0,
          right: 0,
          bgcolor: theme.palette.mode === "light" ? "#FFFFFF" : "#1E2A47",
          borderTop:
            theme.palette.mode === "light"
              ? "1px solid rgba(0,0,0,0.1)"
              : "1px solid rgba(255,255,255,0.1)",
          px: uiTokens.spacing.xl,
          py: uiTokens.spacing.lg,
          zIndex: 999
        }}
      >
        <Button
          fullWidth
          variant="contained"
          onClick={handleConfirm}
          sx={{
            borderRadius: uiTokens.radius.sm,
            py: uiTokens.spacing.md,
            fontSize: 16,
            fontWeight: 600,
            textTransform: "none",
            bgcolor: theme.palette.mode === "light" ? "#03CD8C" : "rgba(255,255,255,0.1)",
            color: "#FFFFFF"
          }}
        >
          Confirm Drop Location
        </Button>
      </Box>
    </Box>
  );
}

export default function RiderScreen6PickDestinationMapCanvas_v2(): React.JSX.Element {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (theme) => theme.palette.background.default
      }}
    >
      <PickDestinationMapScreen />
    </Box>
  );
}
