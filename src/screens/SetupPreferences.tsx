import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Autocomplete
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const accentGreen = "#03CD8C";

// Preferred Route Type Options
const ROUTE_PREFERENCES = [
  {
    category: "Urban Areas",
    options: [
      { id: "downtown", label: "Downtown" },
      { id: "city-centre", label: "City Centre" },
      { id: "shopping-malls", label: "Shopping Malls" },
      { id: "stadiums", label: "Stadiums" }
    ]
  },
  {
    category: "Suburban Areas",
    options: [
      { id: "gated-communities", label: "Gated Communities" },
      { id: "suburbs", label: "Suburbs" },
      { id: "airports", label: "Airports" },
      { id: "train-stations", label: "Train Stations" }
    ]
  },
  {
    category: "Rural & Scenic",
    options: [
      { id: "countryside", label: "Country Side" },
      { id: "forest-trails", label: "Forest Trails" },
      { id: "farmland", label: "Farmland" },
      { id: "mountain-passes", label: "Mountain Passes" },
      { id: "beaches", label: "Beaches" }
    ]
  }
];

// Ride Type Options
const RIDE_TYPE_OPTIONS = {
  modes: [
    { id: "standard-ride", label: "Standard Ride" },
    { id: "premium-ride", label: "Premium Ride" }
  ],
  occasions: [
    { id: "senior-citizen-assistance", label: "Senior Citizen Assistance" },
    { id: "tourism-event", label: "Tourism and Event" }
  ],
  transportationNeeds: [
    { id: "nightlife", label: "Nightlife" },
    { id: "inter-city-travel", label: "Inter-City Travel" }
  ],
  types: [
    { id: "airport-transfers", label: "Airport Transfers" },
    { id: "medical-pwd-transfers", label: "Medical/PWD Transfers" },
    { id: "rental-services", label: "Rental Services" }
  ]
};

// Vehicle Preferences
const VEHICLE_OPTIONS = {
  transmission: [
    { id: "ice", label: "Internal Combustion Engine" },
    { id: "hybrid-ev", label: "Hybrid EV" },
    { id: "electric-vehicle", label: "Electric Vehicle" }
  ],
  vehicleType: [
    { id: "sedan", label: "Sedan" },
    { id: "minivan", label: "Minivan" },
    { id: "hatchback", label: "Hatchback" },
    { id: "crossover", label: "Crossover" },
    { id: "suv", label: "SUV" },
    { id: "luxury-vehicle", label: "Luxury Vehicle" }
  ]
};

// Driver Personality Options
const DRIVER_PERSONALITY_OPTIONS = {
  communicationStyle: [
    { id: "chatty", label: "Chatty", description: "enjoys conversation" },
    { id: "silent", label: "Silent", description: "prefers minimal conversation" }
  ],
  languages: [
    "English",
    "Swahili",
    "Spanish",
    "Mandarin",
    "French",
    "Arabic",
    "Hindi"
  ],
  hobbies: [
    { id: "sports", label: "Sports" },
    { id: "music", label: "Music" },
    { id: "photography", label: "Photography" },
    { id: "travel", label: "Travel" },
    { id: "writing", label: "Writing" },
    { id: "books", label: "Books" }
  ],
  professionalBackground: [
    { id: "business", label: "Business" },
    { id: "education", label: "Education" },
    { id: "medical", label: "Medical" },
    { id: "it", label: "IT" },
    { id: "architect", label: "Architect" }
  ],
  drivingStyle: [
    { id: "calm-cautious", label: "Calm & Cautious", description: "smooth ride" },
    { id: "fast-efficient", label: "Fast & Efficient", description: "quicker ride" }
  ],
  personalityMatch: [
    { id: "outgoing", label: "Outgoing" },
    { id: "friendly", label: "Friendly" },
    { id: "professional", label: "Professional" },
    { id: "reserved", label: "Reserved" }
  ]
};

// Accessibility & Medical Preferences
const ACCESSIBILITY_OPTIONS = {
  accessibilityOptions: [
    { id: "wheelchair", label: "Wheelchair" },
    { id: "accessible-vehicles", label: "Accessible Vehicles" },
    { id: "seat-adjustment", label: "Seat Adjustment for Easy Entry/Exit" }
  ],
  medicalTransport: [
    { id: "stretcher", label: "Stretcher" },
    { id: "first-aid-kit", label: "First Aid Kit" },
    { id: "oxygen-tank", label: "Oxygen Tank" }
  ],
  driverTraining: [
    { id: "medical-assistance", label: "Drivers trained in medical assistance" },
    { id: "pwd-assistance", label: "Drivers familiar with assisting PWDs" }
  ],
  seatsDesign: [
    { id: "baby-child-seats", label: "Baby or Child Seats" },
    { id: "secure-seating-pwd", label: "Secure Seating for PWDs" },
    { id: "extra-legroom", label: "Extra Legroom or Reclining Seats" }
  ]
};

interface PreferenceOption {
  id: string;
  label: string;
  description?: string;
}

interface PreferenceChipProps {
  option: PreferenceOption;
  active: boolean;
  onToggle: (id: string) => void;
  description?: string;
}

// Preference Chip Component
function PreferenceChip({ option, active, onToggle, description }: PreferenceChipProps): React.JSX.Element {
  const theme = useTheme();
  
  return (
    <Box>
      <Chip
        onClick={() => onToggle(option.id)}
        label={option.label}
        size="medium"
        sx={{
          borderRadius: 2,
          px: 1.5,
          py: 0.5,
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          bgcolor: active
            ? "rgba(3,205,140,0.15)"
            : theme.palette.mode === "light"
              ? "#FFFFFF"
              : "rgba(255,255,255,0.05)",
          color: active
            ? accentGreen
            : theme.palette.text.primary,
          border: active
            ? "2px solid #03CD8C"
            : theme.palette.mode === "light"
              ? "1px solid #E0E0E0"
              : "1px solid rgba(255,255,255,0.2)",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: accentGreen,
            bgcolor: active
              ? "rgba(3,205,140,0.15)"
              : theme.palette.mode === "light"
                ? "rgba(0,0,0,0.05)"
                : "rgba(255,255,255,0.1)"
          }
        }}
      />
      {description && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 0.5,
            ml: 1,
            fontSize: 11,
            color: theme.palette.text.secondary,
            fontStyle: "italic"
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}

function RidePreferenceSetupScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const contentBg = theme.palette.mode === "light" ? "#FFFFFF" : theme.palette.background.paper;
  
  // State for all preferences
  const [routeTypes, setRouteTypes] = useState<string[]>([]);
  const [rideTypes, setRideTypes] = useState<{
    modes: string[];
    occasions: string[];
    transportationNeeds: string[];
    types: string[];
  }>({
    modes: [],
    occasions: [],
    transportationNeeds: [],
    types: []
  });
  const [vehiclePrefs, setVehiclePrefs] = useState<{
    transmission: string[];
    vehicleType: string[];
  }>({
    transmission: [],
    vehicleType: []
  });
  const [driverPersonality, setDriverPersonality] = useState<{
    communicationStyle: string[];
    culturalBackground: string;
    languages: string[];
    hobbies: string[];
    professionalBackground: string[];
    drivingStyle: string[];
    personalityMatch: string[];
  }>({
    communicationStyle: [],
    culturalBackground: "",
    languages: [],
    hobbies: [],
    professionalBackground: [],
    drivingStyle: [],
    personalityMatch: []
  });
  const [accessibility, setAccessibility] = useState<{
    accessibilityOptions: string[];
    medicalTransport: string[];
    driverTraining: string[];
    seatsDesign: string[];
  }>({
    accessibilityOptions: [],
    medicalTransport: [],
    driverTraining: [],
    seatsDesign: []
  });
  
  // Accordion state
  const [expandedSections, setExpandedSections] = useState<{
    routeType: boolean;
    rideType: boolean;
    vehicle: boolean;
    driver: boolean;
    accessibility: boolean;
  }>({
    routeType: true,
    rideType: false,
    vehicle: false,
    driver: false,
    accessibility: false
  });
  
  const toggleSection = (section: keyof typeof expandedSections): void => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Route Type Toggle
  const toggleRouteType = (id: string): void => {
    setRouteTypes((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };
  
  // Ride Type Toggle
  const toggleRideType = (category: keyof typeof rideTypes, id: string): void => {
    setRideTypes((prev) => ({
      ...prev,
      [category]: prev[category].includes(id)
        ? prev[category].filter((r: string) => r !== id)
        : [...prev[category], id]
    }));
  };
  
  // Vehicle Preference Toggle
  const toggleVehiclePref = (category: keyof typeof vehiclePrefs, id: string): void => {
    setVehiclePrefs((prev) => ({
      ...prev,
      [category]: prev[category].includes(id)
        ? prev[category].filter((v: string) => v !== id)
        : [...prev[category], id]
    }));
  };
  
  // Driver Personality Toggle
  const toggleDriverPersonality = (category: keyof typeof driverPersonality, id: string): void => {
    setDriverPersonality((prev) => {
      const currentValue = prev[category];
      if (Array.isArray(currentValue)) {
        return {
      ...prev,
          [category]: currentValue.includes(id)
            ? currentValue.filter((d: string) => d !== id)
            : [...currentValue, id]
        };
      }
      return {
        ...prev,
        [category]: [id]
      };
    });
  };
  
  // Accessibility Toggle
  const toggleAccessibility = (category: keyof typeof accessibility, id: string): void => {
    setAccessibility((prev) => ({
      ...prev,
      [category]: prev[category].includes(id)
        ? prev[category].filter((a: string) => a !== id)
        : [...prev[category], id]
    }));
  };
  
  // Handle Save
  const handleSave = () => {
    const preferences = {
      route_type: routeTypes,
      ride_type: rideTypes,
      vehicle_preferences: vehiclePrefs,
      driver_personality: driverPersonality,
      accessibility: accessibility
    };
    
    // TODO: Save to user profile/backend
    console.log("Saving preferences:", preferences);
    
    // Show success message and navigate back
    alert("Preferences saved successfully!");
    navigate(-1);
  };
  
  // Validation
  const canSave = routeTypes.length > 0; // At least one route type required
  
  // Auto-save on navigation away (if preferences have been changed)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Only auto-save if at least one preference is selected
      if (routeTypes.length > 0 || 
          rideTypes.modes.length > 0 || 
          rideTypes.occasions.length > 0 ||
          rideTypes.transportationNeeds.length > 0 ||
          rideTypes.types.length > 0 ||
          vehiclePrefs.transmission.length > 0 ||
          vehiclePrefs.vehicleType.length > 0 ||
          driverPersonality.communicationStyle.length > 0 ||
          driverPersonality.languages.length > 0 ||
          driverPersonality.hobbies.length > 0 ||
          driverPersonality.professionalBackground.length > 0 ||
          driverPersonality.drivingStyle.length > 0 ||
          driverPersonality.personalityMatch.length > 0 ||
          accessibility.accessibilityOptions.length > 0 ||
          accessibility.medicalTransport.length > 0 ||
          accessibility.driverTraining.length > 0 ||
          accessibility.seatsDesign.length > 0) {
        // Auto-save preferences
        const preferences = {
          route_type: routeTypes,
          ride_type: rideTypes,
          vehicle_preferences: vehiclePrefs,
          driver_personality: driverPersonality,
          accessibility: accessibility
        };
        // Save to localStorage as backup (can be replaced with API call)
        localStorage.setItem('user_preferences', JSON.stringify(preferences));
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [routeTypes, rideTypes, vehiclePrefs, driverPersonality, accessibility]);
  
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
              bgcolor: contentBg,
              border: theme.palette.mode === "light"
                ? "1px solid rgba(0,0,0,0.1)"
                : "1px solid rgba(255,255,255,0.1)"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Ride Preference Setup
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: theme.palette.text.secondary }}
            >
              Customize your ride experience preferences
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Scrollable Form */}
      <Box sx={{ maxHeight: "calc(100vh - 350px)", overflowY: "auto", mb: 2 }}>
        <Stack spacing={2}>
          {/* 1. Preferred Route Type */}
          <Accordion
            expanded={expandedSections.routeType}
            onChange={() => toggleSection("routeType")}
            elevation={0}
            sx={{
              bgcolor: contentBg,
              border: theme.palette.mode === "light"
                ? "1px solid rgba(0,0,0,0.1)"
                : "1px solid rgba(255,255,255,0.1)",
              borderRadius: 2,
              "&:before": { display: "none" }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreRoundedIcon />}
              sx={{ px: 2, py: 1.5 }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                1. Preferred Route Type
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2, pb: 2 }}>
              <Typography
                variant="body2"
                sx={{ mb: 2, color: theme.palette.text.secondary, fontSize: 13 }}
              >
                Select the most common routes you take to improve ride matching accuracy.
              </Typography>
              <Stack spacing={2.5}>
                {ROUTE_PREFERENCES.map((category) => (
                  <Box key={category.category}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        mb: 1.5,
                        color: theme.palette.text.primary,
                        fontSize: 13
                      }}
                    >
                      {category.category}:
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                      {category.options.map((option) => (
                        <PreferenceChip
                          key={option.id}
                          option={option}
                          active={routeTypes.includes(option.id)}
                          onToggle={toggleRouteType}
                        />
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* 2. Ride Type */}
          <Accordion
            expanded={expandedSections.rideType}
            onChange={() => toggleSection("rideType")}
            elevation={0}
            sx={{
              bgcolor: contentBg,
              border: theme.palette.mode === "light"
                ? "1px solid rgba(0,0,0,0.1)"
                : "1px solid rgba(255,255,255,0.1)",
              borderRadius: 2,
              "&:before": { display: "none" }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreRoundedIcon />}
              sx={{ px: 2, py: 1.5 }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                2. Ride Type
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2, pb: 2 }}>
              <Typography
                variant="body2"
                sx={{ mb: 2, color: theme.palette.text.secondary, fontSize: 13 }}
              >
                Select your preferred ride service options based on purpose or occasion.
              </Typography>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: 13 }}>
                    Modes:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    {RIDE_TYPE_OPTIONS.modes.map((option) => (
                      <PreferenceChip
                        key={option.id}
                        option={option}
                        active={rideTypes.modes.includes(option.id)}
                        onToggle={(id) => toggleRideType("modes", id)}
                      />
                    ))}
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: 13 }}>
                    Occasions:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    {RIDE_TYPE_OPTIONS.occasions.map((option) => (
                      <PreferenceChip
                        key={option.id}
                        option={option}
                        active={rideTypes.occasions.includes(option.id)}
                        onToggle={(id) => toggleRideType("occasions", id)}
                      />
                    ))}
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: 13 }}>
                    Transportation Needs:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    {RIDE_TYPE_OPTIONS.transportationNeeds.map((option) => (
                      <PreferenceChip
                        key={option.id}
                        option={option}
                        active={rideTypes.transportationNeeds.includes(option.id)}
                        onToggle={(id) => toggleRideType("transportationNeeds", id)}
                      />
                    ))}
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: 13 }}>
                    Types:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    {RIDE_TYPE_OPTIONS.types.map((option) => (
                      <PreferenceChip
                        key={option.id}
                        option={option}
                        active={rideTypes.types.includes(option.id)}
                        onToggle={(id) => toggleRideType("types", id)}
                      />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* 3. Vehicle Preferences */}
          <Accordion
            expanded={expandedSections.vehicle}
            onChange={() => toggleSection("vehicle")}
            elevation={0}
            sx={{
              bgcolor: contentBg,
              border: theme.palette.mode === "light"
                ? "1px solid rgba(0,0,0,0.1)"
                : "1px solid rgba(255,255,255,0.1)",
              borderRadius: 2,
              "&:before": { display: "none" }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreRoundedIcon />}
              sx={{ px: 2, py: 1.5 }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                3. Vehicle Preferences
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2, pb: 2 }}>
              <Typography
                variant="body2"
                sx={{ mb: 2, color: theme.palette.text.secondary, fontSize: 13 }}
              >
                Define the kind of vehicle and performance you prefer for rides.
              </Typography>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: 13 }}>
                    Transmission:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    {VEHICLE_OPTIONS.transmission.map((option) => (
                      <PreferenceChip
                        key={option.id}
                        option={option}
                        active={vehiclePrefs.transmission.includes(option.id)}
                        onToggle={(id) => toggleVehiclePref("transmission", id)}
                      />
                    ))}
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: 13 }}>
                    Preferred Vehicle Type:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    {VEHICLE_OPTIONS.vehicleType.map((option) => (
                      <PreferenceChip
                        key={option.id}
                        option={option}
                        active={vehiclePrefs.vehicleType.includes(option.id)}
                        onToggle={(id) => toggleVehiclePref("vehicleType", id)}
                      />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* 4. Driver Personality */}
          <Accordion
            expanded={expandedSections.driver}
            onChange={() => toggleSection("driver")}
            elevation={0}
            sx={{
              bgcolor: contentBg,
              border: theme.palette.mode === "light"
                ? "1px solid rgba(0,0,0,0.1)"
                : "1px solid rgba(255,255,255,0.1)",
              borderRadius: 2,
              "&:before": { display: "none" }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreRoundedIcon />}
              sx={{ px: 2, py: 1.5 }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                4. Driver Personality
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2, pb: 2 }}>
              <Typography
                variant="body2"
                sx={{ mb: 2, color: theme.palette.text.secondary, fontSize: 13 }}
              >
                Personalize the kind of driver personality and interaction style you're comfortable with.
              </Typography>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: 13 }}>
                    Communication Style:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    {DRIVER_PERSONALITY_OPTIONS.communicationStyle.map((option) => (
                      <PreferenceChip
                        key={option.id}
                        option={option}
                        active={driverPersonality.communicationStyle.includes(option.id)}
                        onToggle={(id) => toggleDriverPersonality("communicationStyle", id)}
                        description={option.description}
                      />
                    ))}
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: 13 }}>
                    Cultural Background:
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Optional"
                    value={driverPersonality.culturalBackground}
                    onChange={(e) =>
                      setDriverPersonality((prev) => ({
                        ...prev,
                        culturalBackground: e.target.value
                      }))
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2
                      }
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: 13 }}>
                    Language Preferences:
                  </Typography>
                  <Autocomplete
                    multiple
                    options={DRIVER_PERSONALITY_OPTIONS.languages}
                    value={driverPersonality.languages}
                    onChange={(event, newValue) => {
                      setDriverPersonality((prev) => ({
                        ...prev,
                        languages: newValue
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select languages"
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2
                          }
                        }}
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option}
                          label={option}
                          size="small"
                          sx={{
                            borderRadius: 2,
                            bgcolor: "rgba(3,205,140,0.15)",
                            color: accentGreen,
                            border: "1px solid #03CD8C"
                          }}
                        />
                      ))
                    }
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: 13 }}>
                    Hobbies:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    {DRIVER_PERSONALITY_OPTIONS.hobbies.map((option) => (
                      <PreferenceChip
                        key={option.id}
                        option={option}
                        active={driverPersonality.hobbies.includes(option.id)}
                        onToggle={(id) => toggleDriverPersonality("hobbies", id)}
                      />
                    ))}
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: 13 }}>
                    Professional Background:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    {DRIVER_PERSONALITY_OPTIONS.professionalBackground.map((option) => (
                      <PreferenceChip
                        key={option.id}
                        option={option}
                        active={driverPersonality.professionalBackground.includes(option.id)}
                        onToggle={(id) => toggleDriverPersonality("professionalBackground", id)}
                      />
                    ))}
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: 13 }}>
                    Driving Style:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    {DRIVER_PERSONALITY_OPTIONS.drivingStyle.map((option) => (
                      <PreferenceChip
                        key={option.id}
                        option={option}
                        active={driverPersonality.drivingStyle.includes(option.id)}
                        onToggle={(id) => toggleDriverPersonality("drivingStyle", id)}
                        description={option.description}
                      />
                    ))}
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: 13 }}>
                    Personality Match:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    {DRIVER_PERSONALITY_OPTIONS.personalityMatch.map((option) => (
                      <PreferenceChip
                        key={option.id}
                        option={option}
                        active={driverPersonality.personalityMatch.includes(option.id)}
                        onToggle={(id) => toggleDriverPersonality("personalityMatch", id)}
                      />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* 5. Accessibility & Medical Preferences */}
          <Accordion
            expanded={expandedSections.accessibility}
            onChange={() => toggleSection("accessibility")}
            elevation={0}
            sx={{
              bgcolor: contentBg,
              border: theme.palette.mode === "light"
                ? "1px solid rgba(0,0,0,0.1)"
                : "1px solid rgba(255,255,255,0.1)",
              borderRadius: 2,
              "&:before": { display: "none" }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreRoundedIcon />}
              sx={{ px: 2, py: 1.5 }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                5. Accessibility & Medical Preferences
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2, pb: 2 }}>
              <Typography
                variant="body2"
                sx={{ mb: 2, color: theme.palette.text.secondary, fontSize: 13 }}
              >
                For passengers with mobility or medical needs.
              </Typography>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: 13 }}>
                    Accessibility Options:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    {ACCESSIBILITY_OPTIONS.accessibilityOptions.map((option) => (
                      <PreferenceChip
                        key={option.id}
                        option={option}
                        active={accessibility.accessibilityOptions.includes(option.id)}
                        onToggle={(id) => toggleAccessibility("accessibilityOptions", id)}
                      />
                    ))}
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: 13 }}>
                    Medical Transport Add-ons:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    {ACCESSIBILITY_OPTIONS.medicalTransport.map((option) => (
                      <PreferenceChip
                        key={option.id}
                        option={option}
                        active={accessibility.medicalTransport.includes(option.id)}
                        onToggle={(id) => toggleAccessibility("medicalTransport", id)}
                      />
                    ))}
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: 13 }}>
                    Driver Training:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    {ACCESSIBILITY_OPTIONS.driverTraining.map((option) => (
                      <PreferenceChip
                        key={option.id}
                        option={option}
                        active={accessibility.driverTraining.includes(option.id)}
                        onToggle={(id) => toggleAccessibility("driverTraining", id)}
                      />
                    ))}
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: 13 }}>
                    Seats & Design:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    {ACCESSIBILITY_OPTIONS.seatsDesign.map((option) => (
                      <PreferenceChip
                        key={option.id}
                        option={option}
                        active={accessibility.seatsDesign.includes(option.id)}
                        onToggle={(id) => toggleAccessibility("seatsDesign", id)}
                      />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Box>

      {/* Info Card */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: theme.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
          border: theme.palette.mode === "light"
            ? "1px solid rgba(226,232,240,1)"
            : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.4 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <InfoOutlinedIcon
              sx={{ fontSize: 18, color: theme.palette.text.secondary }}
            />
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: theme.palette.text.secondary }}
              >
                These preferences will influence suggested ride types, driver matches, vehicle assignment, and accessibility readiness for all your future rides.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button
        fullWidth
        variant="contained"
        onClick={handleSave}
        disabled={!canSave}
        sx={{
          borderRadius: 2,
          py: 1.5,
          fontSize: 16,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: canSave ? accentGreen : "rgba(0,0,0,0.2)",
          color: "#FFFFFF",
          boxShadow: "none",
          mb: 1.5,
          "&:hover": {
            bgcolor: canSave ? "#22C55E" : "rgba(0,0,0,0.3)",
            boxShadow: "none"
          },
          "&.Mui-disabled": {
            bgcolor: "rgba(0,0,0,0.2)",
            color: "#FFFFFF",
            opacity: 1
          }
        }}
      >
        Save Preferences
      </Button>

      {/* Link to Driver Preferences */}
      <Box sx={{ mt: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate("/rides/preferences/driver")}
          sx={{
            borderRadius: 2,
            py: 1.5,
            fontSize: 14,
            fontWeight: 600,
            textTransform: "none",
            borderColor: accentGreen,
            borderWidth: 2,
            color: accentGreen,
            "&:hover": {
              borderColor: accentGreen,
              borderWidth: 2,
              bgcolor: theme.palette.mode === "light" ? "rgba(0,123,255,0.08)" : "rgba(0,123,255,0.15)"
            }
          }}
        >
          👤 View Driver Preferences Example
        </Button>
      </Box>
    </Box>
  );
}

export default function RiderScreen18RidePreferenceSetupCanvas_v2() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: (theme) => theme.palette.background.default
      }}
    >

        <RidePreferenceSetupScreen />
      
    </Box>
  );
}
