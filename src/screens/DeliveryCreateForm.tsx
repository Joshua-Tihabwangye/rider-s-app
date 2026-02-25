import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Chip,
  Alert
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import ScaleRoundedIcon from "@mui/icons-material/ScaleRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";
import { COLORS } from "../constants/colors";

// Simulated pickup suggestions
const PICKUP_SUGGESTIONS = [
  "Kampala City Centre, Uganda",
  "Makerere University, Kampala",
  "Kololo, Kampala",
  "Bugolobi, Kampala",
  "Nakasero, Kampala"
];

// Simulated drop-off suggestions
const DROPOFF_SUGGESTIONS = [
  "Entebbe International Airport",
  "Jinja, Uganda",
  "Nsambya, Kampala",
  "Ntinda, Kampala",
  "Kansanga, Kampala"
];

const PARCEL_CATEGORIES = [
  "Documents",
  "Electronics",
  "Clothing",
  "Food & Beverages",
  "Furniture",
  "Gift/Personal Items",
  "Medical Supplies",
  "Other"
];

const PARCEL_SIZES = [
  { label: "Small", description: "Fits in a backpack", icon: "📦" },
  { label: "Medium", description: "Fits in a car seat", icon: "📫" },
  { label: "Large", description: "Needs car trunk", icon: "🚚" },
  { label: "Extra Large", description: "Needs a van/truck", icon: "🏗️" }
];

function DeliveryCreateFormScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const theme = useTheme();

  const greenPrimary = COLORS.green.primary;

  // Form state
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [parcelName, setParcelName] = useState("");
  const [parcelCategory, setParcelCategory] = useState("");
  const [parcelSize, setParcelSize] = useState("");
  const [parcelWeight, setParcelWeight] = useState("");
  const [description, setDescription] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");

  // UI state
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contentBg = theme.palette.mode === "light" ? "#FFFFFF" : theme.palette.background.paper;
  const borderColor = theme.palette.mode === "light"
    ? "rgba(209,213,219,0.9)"
    : "rgba(51,65,85,0.9)";

  const canSubmit =
    pickupAddress.trim() !== "" &&
    dropoffAddress.trim() !== "" &&
    parcelName.trim() !== "" &&
    parcelCategory !== "" &&
    parcelSize !== "" &&
    receiverName.trim() !== "" &&
    receiverPhone.trim() !== "";

  const handleUseCurrentLocation = () => {
    setPickupAddress("Kampala City Centre, Uganda");
    setShowPickupSuggestions(false);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    // Generate a mock tracking ID
    const trackingId = `WC${Date.now().toString().slice(-8)}`;

    setSubmitted(true);

    // After 2 seconds, navigate back to deliveries with the new order info
    setTimeout(() => {
      navigate("/deliveries", {
        state: {
          newOrder: {
            id: trackingId,
            packageName: parcelName,
            pickup: pickupAddress,
            dropoff: dropoffAddress,
            category: parcelCategory,
            size: parcelSize,
            weight: parcelWeight,
            description,
            receiverName,
            receiverPhone,
            status: "Processing"
          }
        }
      });
    }, 2000);
  };

  if (submitted) {
    return (
      <Box sx={{ px: 2.5, pt: 6, pb: 3, textAlign: "center" }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: "rgba(3,205,140,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3
          }}
        >
          <CheckCircleRoundedIcon sx={{ fontSize: 48, color: greenPrimary }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Delivery Order Created!
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
          Your parcel "{parcelName}" is being processed.
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
          An EV courier will be assigned shortly.
        </Typography>
        <Typography variant="caption" sx={{ color: greenPrimary, fontWeight: 600 }}>
          Redirecting to deliveries...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <IconButton
          size="small"
          onClick={() => navigate("/deliveries")}
          sx={{
            borderRadius: 999,
            bgcolor: contentBg,
            border: `1px solid ${borderColor}`
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>
            Send a Parcel
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary }}>
            Fill in pickup, drop-off and parcel details
          </Typography>
        </Box>
      </Box>

      {/* Pickup Location */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2.5,
          bgcolor: contentBg,
          border: `1px solid ${borderColor}`
        }}
      >
        <CardContent sx={{ px: 2, py: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <MyLocationRoundedIcon sx={{ fontSize: 18, color: "#4CAF50" }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: 13 }}>
              Pickup Location
            </Typography>
          </Stack>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter pickup address"
            value={pickupAddress}
            onChange={(e) => {
              setPickupAddress(e.target.value);
              setShowPickupSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => setShowPickupSuggestions(pickupAddress.length > 0)}
            onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 200)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    size="small"
                    onClick={handleUseCurrentLocation}
                    sx={{
                      fontSize: 10,
                      textTransform: "none",
                      color: greenPrimary,
                      minWidth: "auto",
                      px: 1
                    }}
                  >
                    Use GPS
                  </Button>
                </InputAdornment>
              )
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& fieldset": { borderColor },
                "&:hover fieldset": { borderColor: greenPrimary },
                "&.Mui-focused fieldset": { borderColor: greenPrimary }
              }
            }}
          />
          {showPickupSuggestions && (
            <Box sx={{ mt: 1 }}>
              {PICKUP_SUGGESTIONS.filter(s =>
                s.toLowerCase().includes(pickupAddress.toLowerCase())
              ).slice(0, 3).map((suggestion, i) => (
                <Box
                  key={i}
                  onClick={() => {
                    setPickupAddress(suggestion);
                    setShowPickupSuggestions(false);
                  }}
                  sx={{
                    py: 0.75,
                    px: 1,
                    cursor: "pointer",
                    borderRadius: 1,
                    "&:hover": { bgcolor: "rgba(3,205,140,0.08)" }
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: 12 }}>
                    {suggestion}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Drop-off Location */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2.5,
          bgcolor: contentBg,
          border: `1px solid ${borderColor}`
        }}
      >
        <CardContent sx={{ px: 2, py: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <PlaceRoundedIcon sx={{ fontSize: 18, color: "#FF5722" }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: 13 }}>
              Drop-off Location
            </Typography>
          </Stack>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter drop-off address"
            value={dropoffAddress}
            onChange={(e) => {
              setDropoffAddress(e.target.value);
              setShowDropoffSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => setShowDropoffSuggestions(dropoffAddress.length > 0)}
            onBlur={() => setTimeout(() => setShowDropoffSuggestions(false), 200)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& fieldset": { borderColor },
                "&:hover fieldset": { borderColor: greenPrimary },
                "&.Mui-focused fieldset": { borderColor: greenPrimary }
              }
            }}
          />
          {showDropoffSuggestions && (
            <Box sx={{ mt: 1 }}>
              {DROPOFF_SUGGESTIONS.filter(s =>
                s.toLowerCase().includes(dropoffAddress.toLowerCase())
              ).slice(0, 3).map((suggestion, i) => (
                <Box
                  key={i}
                  onClick={() => {
                    setDropoffAddress(suggestion);
                    setShowDropoffSuggestions(false);
                  }}
                  sx={{
                    py: 0.75,
                    px: 1,
                    cursor: "pointer",
                    borderRadius: 1,
                    "&:hover": { bgcolor: "rgba(3,205,140,0.08)" }
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: 12 }}>
                    {suggestion}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Parcel Details */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2.5,
          bgcolor: contentBg,
          border: `1px solid ${borderColor}`
        }}
      >
        <CardContent sx={{ px: 2, py: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <Inventory2RoundedIcon sx={{ fontSize: 18, color: greenPrimary }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: 13 }}>
              Parcel Details
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            {/* Parcel Name */}
            <TextField
              fullWidth
              size="small"
              label="Parcel Name"
              placeholder="e.g. Pair of Sneakers"
              value={parcelName}
              onChange={(e) => setParcelName(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": { borderColor },
                  "&:hover fieldset": { borderColor: greenPrimary },
                  "&.Mui-focused fieldset": { borderColor: greenPrimary }
                }
              }}
            />

            {/* Category */}
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={parcelCategory}
                label="Category"
                onChange={(e) => setParcelCategory(e.target.value)}
                sx={{
                  borderRadius: 2,
                  "& fieldset": { borderColor },
                  "&:hover fieldset": { borderColor: greenPrimary },
                  "&.Mui-focused fieldset": { borderColor: greenPrimary }
                }}
              >
                {PARCEL_CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Parcel Size */}
            <Box>
              <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary, mb: 1, display: "block" }}>
                Parcel Size
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                {PARCEL_SIZES.map((size) => (
                  <Chip
                    key={size.label}
                    label={`${size.icon} ${size.label}`}
                    onClick={() => setParcelSize(size.label)}
                    size="medium"
                    sx={{
                      borderRadius: 2,
                      px: 0.5,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                      bgcolor: parcelSize === size.label
                        ? "rgba(3,205,140,0.15)"
                        : theme.palette.mode === "light" ? "#F9FAFB" : "rgba(255,255,255,0.05)",
                      color: parcelSize === size.label ? greenPrimary : theme.palette.text.primary,
                      border: parcelSize === size.label
                        ? `2px solid ${greenPrimary}`
                        : `1px solid ${borderColor}`,
                      "&:hover": {
                        borderColor: greenPrimary,
                        bgcolor: parcelSize === size.label
                          ? "rgba(3,205,140,0.15)"
                          : "rgba(3,205,140,0.05)"
                      }
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Weight */}
            <TextField
              fullWidth
              size="small"
              label="Approx. Weight (kg)"
              placeholder="e.g. 2.5"
              type="number"
              value={parcelWeight}
              onChange={(e) => setParcelWeight(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ScaleRoundedIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                  </InputAdornment>
                )
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": { borderColor },
                  "&:hover fieldset": { borderColor: greenPrimary },
                  "&.Mui-focused fieldset": { borderColor: greenPrimary }
                }
              }}
            />

            {/* Description */}
            <TextField
              fullWidth
              size="small"
              label="Description (optional)"
              placeholder="Any special handling instructions..."
              multiline
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1 }}>
                    <DescriptionRoundedIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                  </InputAdornment>
                )
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": { borderColor },
                  "&:hover fieldset": { borderColor: greenPrimary },
                  "&.Mui-focused fieldset": { borderColor: greenPrimary }
                }
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Receiver Details */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2.5,
          bgcolor: contentBg,
          border: `1px solid ${borderColor}`
        }}
      >
        <CardContent sx={{ px: 2, py: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <PersonRoundedIcon sx={{ fontSize: 18, color: "#2196F3" }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: 13 }}>
              Receiver Details
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            <TextField
              fullWidth
              size="small"
              label="Receiver Name"
              placeholder="Full name of the receiver"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonRoundedIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                  </InputAdornment>
                )
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": { borderColor },
                  "&:hover fieldset": { borderColor: greenPrimary },
                  "&.Mui-focused fieldset": { borderColor: greenPrimary }
                }
              }}
            />

            <TextField
              fullWidth
              size="small"
              label="Receiver Phone"
              placeholder="+256 7XX XXX XXX"
              value={receiverPhone}
              onChange={(e) => setReceiverPhone(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneRoundedIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                  </InputAdornment>
                )
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": { borderColor },
                  "&:hover fieldset": { borderColor: greenPrimary },
                  "&.Mui-focused fieldset": { borderColor: greenPrimary }
                }
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Estimated Cost Preview */}
      {canSubmit && (
        <Card
          elevation={0}
          sx={{
            mb: 2.5,
            borderRadius: 2.5,
            bgcolor: "rgba(3,205,140,0.08)",
            border: `1px solid rgba(3,205,140,0.3)`
          }}
        >
          <CardContent sx={{ px: 2, py: 1.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary }}>
                  Estimated Delivery Cost
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: greenPrimary, fontSize: 18 }}>
                  UGX {parcelSize === "Small" ? "8,000" : parcelSize === "Medium" ? "15,000" : parcelSize === "Large" ? "25,000" : "40,000"}
                </Typography>
              </Box>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <LocalShippingRoundedIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                <Typography variant="caption" sx={{ fontSize: 10.5, color: theme.palette.text.secondary }}>
                  EV Courier • 30–60 min
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <Button
        fullWidth
        variant="contained"
        onClick={handleSubmit}
        disabled={!canSubmit}
        sx={{
          borderRadius: 999,
          py: 1.4,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: canSubmit ? greenPrimary : "rgba(3,205,140,0.3)",
          color: "#FFFFFF",
          "&:hover": {
            bgcolor: canSubmit ? "#22C55E" : "rgba(3,205,140,0.3)"
          },
          "&.Mui-disabled": {
            bgcolor: "rgba(3,205,140,0.3)",
            color: "rgba(255,255,255,0.5)"
          }
        }}
      >
        Send Parcel
      </Button>

      {!canSubmit && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 1,
            fontSize: 11,
            color: theme.palette.text.secondary
          }}
        >
          Please fill in all required fields to continue
        </Typography>
      )}
    </Box>
  );
}

export default function DeliveryCreateForm(): React.JSX.Element {
  return (
    <>
      <DarkModeToggle />
      <MobileShell>
        <DeliveryCreateFormScreen />
      </MobileShell>
    </>
  );
}
