import React, { useState, useRef, useEffect, useCallback } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  TextField,
  Button,
  useTheme
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import MobileShell from "../components/MobileShell";

// Mock geocoding service
const geocodeAddress = async (address) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock coordinates for common locations
  const mockLocations = {
    "kampala city": { lat: 0.3476, lng: 32.5825 },
    "entebbe": { lat: 0.0422, lng: 32.4435 },
    "jinja": { lat: 0.4244, lng: 33.2042 },
    "mbale": { lat: 1.0826, lng: 34.1750 }
  };
  
  const normalized = address.toLowerCase().trim();
  for (const [key, coords] of Object.entries(mockLocations)) {
    if (normalized.includes(key)) {
      return coords;
    }
  }
  
  // Default to Kampala if not found
  return { lat: 0.3476, lng: 32.5825 };
};

// Reverse geocoding - get address from coordinates
const reverseGeocode = async (lat, lng) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  // Mock address based on coordinates
  if (Math.abs(lat - 0.3476) < 0.1 && Math.abs(lng - 32.5825) < 0.1) {
    return "Kampala City";
  }
  return `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
};

function PickDestinationMapScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const mapRef = useRef(null);
  const isDraggingRef = useRef(false);
  const lastPanRef = useRef({ x: 0, y: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const clickTimeoutRef = useRef(null);
  
  // Get initial destination from navigation state
  const initialState = location.state || {};
  const [destination, setDestination] = useState(initialState.destination || "Kampala City");
  const [coordinates, setCoordinates] = useState(initialState.destinationCoords || { lat: 0.3476, lng: 32.5825 });
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Update destination when coordinates change (debounced to avoid too many calls)
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const address = await reverseGeocode(coordinates.lat, coordinates.lng);
      setDestination(address);
    }, 500); // Debounce by 500ms
    
    return () => clearTimeout(timeoutId);
  }, [coordinates]);
  
  // Handle geocoding when user types in destination field
  const handleDestinationChange = async (e) => {
    const value = e.target.value;
    setDestination(value);
    
    if (value.length >= 3) {
      setIsGeocoding(true);
      const coords = await geocodeAddress(value);
      setCoordinates(coords);
      setMapOffset({ x: 0, y: 0 }); // Reset map offset
      setIsGeocoding(false);
    }
  };
  
  // Handle map drag start
  const handleMouseDown = useCallback((e) => {
    if (mapRef.current) {
      isDraggingRef.current = true;
      setIsDragging(true);
      hasMovedRef.current = false;
      const startX = e.clientX || e.touches?.[0]?.clientX || 0;
      const startY = e.clientY || e.touches?.[0]?.clientY || 0;
      dragStartRef.current = { x: startX, y: startY };
      lastPanRef.current = { x: startX, y: startY };
      mapRef.current.style.cursor = "grabbing";
    }
  }, []);
  
  // Handle map drag
  const handleMouseMove = useCallback((e) => {
    if (isDraggingRef.current && mapRef.current) {
      const currentX = e.clientX || e.touches?.[0]?.clientX || 0;
      const currentY = e.clientY || e.touches?.[0]?.clientY || 0;
      
      // Check if mouse has moved significantly (more than 5px) to distinguish drag from click
      const deltaFromStart = Math.sqrt(
        Math.pow(currentX - dragStartRef.current.x, 2) + 
        Math.pow(currentY - dragStartRef.current.y, 2)
      );
      if (deltaFromStart > 5) {
        hasMovedRef.current = true;
      }
      
      const deltaX = currentX - lastPanRef.current.x;
      const deltaY = currentY - lastPanRef.current.y;
      
      setMapOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      // Update coordinates based on drag distance
      // Rough conversion: 1px ≈ 0.0001 degrees (adjust based on zoom level)
      const scale = 0.0001;
      setCoordinates(prev => ({
        lat: prev.lat - (deltaY * scale),
        lng: prev.lng + (deltaX * scale)
      }));
      
      lastPanRef.current = { x: currentX, y: currentY };
    }
  }, []);
  
  // Handle map click/tap to move pin
  const handleMapClick = useCallback(async (e) => {
    if (!mapRef.current) {
      return;
    }
    
    // Clear any pending single-click timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = mapRef.current.getBoundingClientRect();
    const clickX = (e.clientX || e.changedTouches?.[0]?.clientX || 0) - rect.left;
    const clickY = (e.clientY || e.changedTouches?.[0]?.clientY || 0) - rect.top;
    
    // Get center of map
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate offset needed to move clicked point to center
    const offsetX = centerX - clickX;
    const offsetY = centerY - clickY;
    
    // Update map offset
    setMapOffset(prev => ({
      x: prev.x + offsetX,
      y: prev.y + offsetY
    }));
    
    // Calculate new coordinates based on click position
    // Convert pixel offset to lat/lng offset
    const scale = 0.0001;
    const latOffset = -offsetY * scale;
    const lngOffset = offsetX * scale;
    
    const newCoords = {
      lat: coordinates.lat + latOffset,
      lng: coordinates.lng + lngOffset
    };
    
    setCoordinates(newCoords);
    
    // Update destination name via reverse geocoding (will be handled by useEffect)
    setIsGeocoding(true);
    setTimeout(() => setIsGeocoding(false), 300);
  }, [coordinates]);
  
  // Handle map drag end
  const handleMouseUp = useCallback((e) => {
    const wasDragging = isDraggingRef.current;
    const didMove = hasMovedRef.current;
    
    if (wasDragging && !didMove && mapRef.current) {
      // It was a click/tap, not a drag - move pin to click location
      // Use a small timeout to allow double-click to be detected first
      clickTimeoutRef.current = setTimeout(() => {
        handleMapClick(e);
      }, 250);
    }
    
    isDraggingRef.current = false;
    setIsDragging(false);
    hasMovedRef.current = false;
    if (mapRef.current) {
      mapRef.current.style.cursor = "grab";
    }
  }, [handleMapClick]);
  
  const handleConfirm = () => {
    // Navigate back to Enter Destination screen with selected coordinates
    navigate("/rides/enter/details", {
      state: {
        ...initialState,
        destination,
        destinationCoords: coordinates,
        fromMap: true
      }
    });
  };
  
  // Add event listeners for map dragging and clicking
  useEffect(() => {
    const mapElement = mapRef.current;
    if (mapElement) {
      mapElement.addEventListener("mousedown", handleMouseDown);
      mapElement.addEventListener("mousemove", handleMouseMove);
      mapElement.addEventListener("mouseup", handleMouseUp);
      mapElement.addEventListener("mouseleave", handleMouseUp);
      mapElement.addEventListener("touchstart", handleMouseDown, { passive: true });
      mapElement.addEventListener("touchmove", handleMouseMove, { passive: true });
      mapElement.addEventListener("touchend", handleMouseUp);
      // Also handle double-click for moving pin
      mapElement.addEventListener("dblclick", handleMapClick);
      
      return () => {
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current);
        }
        mapElement.removeEventListener("mousedown", handleMouseDown);
        mapElement.removeEventListener("mousemove", handleMouseMove);
        mapElement.removeEventListener("mouseup", handleMouseUp);
        mapElement.removeEventListener("mouseleave", handleMouseUp);
        mapElement.removeEventListener("touchstart", handleMouseDown);
        mapElement.removeEventListener("touchmove", handleMouseMove);
        mapElement.removeEventListener("touchend", handleMouseUp);
        mapElement.removeEventListener("dblclick", handleMapClick);
      };
    }
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleMapClick]);

  return (
    <Box 
      sx={{ 
        minHeight: "100vh",
        bgcolor: theme.palette.mode === "light" ? "#FFFFFF" : "#1E2A47",
        paddingBottom: { 
          xs: "calc(100px + env(safe-area-inset-bottom))", 
          sm: "100px" 
        },
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Header with Title and Destination Field */}
      <Box
        sx={{
          px: 2.5,
          pt: 2.5,
          pb: 2.5,
          bgcolor: theme.palette.mode === "light" ? "#FFFFFF" : "#1E2A47"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 999,
              bgcolor: theme.palette.mode === "light"
                ? "rgba(0,0,0,0.05)"
                : "rgba(255,255,255,0.1)",
              color: theme.palette.mode === "light" 
                ? theme.palette.text.primary 
                : "#FFFFFF",
              "&:hover": {
                bgcolor: theme.palette.mode === "light"
                  ? "rgba(0,0,0,0.1)"
                  : "rgba(255,255,255,0.2)"
              }
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
            <Typography
              variant="subtitle1"
            sx={{ 
              fontWeight: 600, 
              letterSpacing: "-0.01em",
              color: theme.palette.mode === "light" 
                ? theme.palette.text.primary 
                : "#FFFFFF"
            }}
            >
            Pick Your Destination
            </Typography>
        </Box>

        {/* Destination Field */}
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
              borderRadius: 999,
              bgcolor: theme.palette.mode === "light"
                ? "#FFFFFF"
                : "rgba(255,255,255,0.1)",
              color: theme.palette.mode === "light"
                ? theme.palette.text.primary
                : "#FFFFFF",
              "& fieldset": {
                borderColor: theme.palette.mode === "light"
                  ? "rgba(0,0,0,0.15)"
                  : "rgba(255,255,255,0.2)"
              },
              "&:hover fieldset": {
                borderColor: theme.palette.mode === "light"
                  ? "rgba(0,0,0,0.25)"
                  : "rgba(255,255,255,0.3)"
              },
              "&.Mui-focused fieldset": {
                borderColor: "#00AEEF"
              }
            },
            "& .MuiInputBase-input": {
              color: theme.palette.mode === "light"
                ? theme.palette.text.primary
                : "#FFFFFF",
              pl: 1.5,
              "&::placeholder": {
                color: theme.palette.mode === "light"
                  ? "rgba(0,0,0,0.5)"
                  : "rgba(255,255,255,0.6)",
                opacity: 1
              }
            }
          }}
        />
      </Box>

      {/* Map area - City map style with beige/grey land, blue water, white roads, green parks */}
      <Box
        ref={mapRef}
        sx={{
          position: "relative",
          flex: 1,
          overflow: "hidden",
          cursor: "grab",
          userSelect: "none",
          touchAction: "none",
          "&:active": {
            cursor: "grabbing"
          }
        }}
      >
        {/* Movable map background - City map style */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            transform: `translate(${mapOffset.x}px, ${mapOffset.y}px)`,
            transition: isDragging ? "none" : "transform 0.1s ease-out",
            width: "120%",
            height: "120%",
            // Base beige/grey land color
            background: "#F5F5DC"
          }}
        >
          {/* Water bodies - light blue lines/areas */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                linear-gradient(45deg, transparent 30%, rgba(173,216,230,0.6) 30%, rgba(173,216,230,0.6) 35%, transparent 35%),
                linear-gradient(135deg, transparent 40%, rgba(173,216,230,0.5) 40%, rgba(173,216,230,0.5) 45%, transparent 45%),
                linear-gradient(90deg, transparent 20%, rgba(173,216,230,0.7) 20%, rgba(173,216,230,0.7) 25%, transparent 25%),
                linear-gradient(0deg, transparent 60%, rgba(173,216,230,0.6) 60%, rgba(173,216,230,0.6) 65%, transparent 65%)
              `,
              backgroundSize: "200px 200px, 180px 180px, 220px 220px, 190px 190px",
              backgroundPosition: "0 0, 50px 50px, 100px 100px, 150px 150px"
            }}
          />
          
          {/* Green parks/patches */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                radial-gradient(circle at 25% 30%, rgba(144,238,144,0.4) 0%, rgba(144,238,144,0.4) 8%, transparent 8%),
                radial-gradient(circle at 70% 50%, rgba(144,238,144,0.35) 0%, rgba(144,238,144,0.35) 10%, transparent 10%),
                radial-gradient(circle at 45% 75%, rgba(144,238,144,0.3) 0%, rgba(144,238,144,0.3) 12%, transparent 12%),
                radial-gradient(circle at 80% 20%, rgba(144,238,144,0.4) 0%, rgba(144,238,144,0.4) 7%, transparent 7%)
              `,
              backgroundSize: "300px 300px, 250px 250px, 280px 280px, 270px 270px",
              backgroundPosition: "0 0, 100px 100px, 200px 200px, 150px 150px"
            }}
          />
          
          {/* White roads - dense network */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                linear-gradient(90deg, transparent 0%, #FFFFFF 0.5%, #FFFFFF 1%, transparent 1.5%),
                linear-gradient(0deg, transparent 0%, #FFFFFF 0.5%, #FFFFFF 1%, transparent 1.5%),
                linear-gradient(45deg, transparent 0%, #FFFFFF 0.3%, #FFFFFF 0.8%, transparent 1.3%),
                linear-gradient(135deg, transparent 0%, #FFFFFF 0.3%, #FFFFFF 0.8%, transparent 1.3%)
              `,
              backgroundSize: "60px 60px, 60px 60px, 80px 80px, 80px 80px",
              backgroundPosition: "0 0, 0 0, 30px 30px, 30px 30px",
              opacity: 0.9
            }}
          />
          
          {/* Additional road patterns for dense network */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                linear-gradient(90deg, transparent 48%, #FFFFFF 48%, #FFFFFF 52%, transparent 52%),
                linear-gradient(0deg, transparent 48%, #FFFFFF 48%, #FFFFFF 52%, transparent 52%)
              `,
              backgroundSize: "40px 40px, 40px 40px",
              opacity: 0.7
            }}
          />
          
          {/* City blocks/buildings texture */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                linear-gradient(45deg, rgba(200,200,180,0.2) 25%, transparent 25%, transparent 75%, rgba(200,200,180,0.2) 75%),
                linear-gradient(45deg, rgba(200,200,180,0.2) 25%, transparent 25%, transparent 75%, rgba(200,200,180,0.2) 75%)
              `,
              backgroundSize: "30px 30px, 30px 30px",
              backgroundPosition: "0 0, 15px 15px"
          }}
        />
        </Box>

        {/* Accuracy circle - Large semi-transparent light blue */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 200,
            height: 200,
            borderRadius: "999px",
            border: "1px dashed rgba(59,130,246,0.6)",
            bgcolor: "rgba(147,197,253,0.15)"
          }}
        />

        {/* Center pin - Green with black outline */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -100%)",
            zIndex: 10
          }}
        >
          <PlaceRoundedIcon
            sx={{
              fontSize: 40,
              color: "#4CAF50",
              filter: "drop-shadow(0 0 0 2px #000) drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
            }}
          />
        </Box>
      </Box>

      {/* Fixed Footer with Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: "calc(64px + env(safe-area-inset-bottom))", sm: 64, md: 64, lg: 70, xl: 74 },
          left: 0,
          right: 0,
          bgcolor: theme.palette.mode === "light" ? "#FFFFFF" : "#1E2A47",
          borderTop: theme.palette.mode === "light"
            ? "1px solid rgba(0,0,0,0.1)"
            : "1px solid rgba(255,255,255,0.1)",
          px: 2.5,
          py: 2,
          zIndex: 999,
          maxWidth: { lg: 600, xl: 600 },
          margin: { lg: "0 auto", xl: "0 auto" }
        }}
      >
          <Button
            fullWidth
            variant="contained"
          onClick={handleConfirm}
            sx={{
            borderRadius: 2,
            py: 1.5,
            fontSize: 16,
              fontWeight: 600,
              textTransform: "none",
            bgcolor: theme.palette.mode === "light"
              ? "#00AEEF"
              : "rgba(255,255,255,0.1)",
            color: "#FFFFFF",
            border: theme.palette.mode === "light"
              ? "none"
              : "1px solid rgba(255,255,255,0.2)",
            boxShadow: "none",
            "&:hover": {
              bgcolor: theme.palette.mode === "light"
                ? "#0099CC"
                : "rgba(255,255,255,0.15)",
              boxShadow: "none"
            }
            }}
          >
          Confirm Drop Location
          </Button>
      </Box>
    </Box>
  );
}

export default function RiderScreen6PickDestinationMapCanvas_v2() {
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
          <PickDestinationMapScreen />
        </MobileShell>
      </Box>
    
  );
}
