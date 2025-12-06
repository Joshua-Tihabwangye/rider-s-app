import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Autocomplete,
  Paper,
  Chip
} from "@mui/material";

import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import EvStationRoundedIcon from "@mui/icons-material/EvStationRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import LocalTaxiRoundedIcon from "@mui/icons-material/LocalTaxiRounded";
import LocalGasStationRoundedIcon from "@mui/icons-material/LocalGasStationRounded";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";

function HomeMultiServiceScreen() {
  const navigate = useNavigate();
  const [reminderIndex, setReminderIndex] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  // Search autocomplete options across all service categories
  const searchOptions = [
    { label: "Book a Ride", category: "Ride", route: "/rides/enter" },
    { label: "Share a Ride", category: "Ride", route: "/rides/enter?mode=share" },
    { label: "Deliver a Parcel", category: "Delivery", route: "/deliveries" },
    { label: "Track Delivery", category: "Delivery", route: "/deliveries" },
    { label: "EV Marketplace", category: "Marketplace", route: "/more" },
    { label: "ShopNow", category: "Marketplace", route: "/more" },
    { label: "My Cart", category: "Marketplace", route: "/more" },
    { label: "Public Charging Station", category: "Charging", route: "/more" },
    { label: "Private Station", category: "Charging", route: "/more" },
    { label: "My Vehicles", category: "Charging", route: "/more" },
    { label: "School Bus Services", category: "School", route: "/school-handoff" },
    { label: "Student Bus Fees", category: "School", route: "/school-handoff" }
  ];

  // Sample reminder data with expiry dates - in production, this would come from backend
  const [reminders, setReminders] = useState([
    {
      id: 1,
      label: "Reminder",
      title: "Student Bus Fees",
      description: "Your Student Bus fees, for the student John Doe, paid on 24-01-2023 has expired, an additional 3hrs has been allowed for you continue accessing the service while we wait for your payment and you have until 24-01-2023 before the service is locked",
      action: "Check Now",
      expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      gracePeriodEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    },
    {
      id: 2,
      label: "Promotion",
      title: "Ride Promotion",
      description: "Get 20% off your next ride - Expires tomorrow",
      action: "View Offer",
      expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      gracePeriodEnd: null
    },
    {
      id: 3,
      label: "Reminder",
      title: "Payment Due",
      description: "Your monthly subscription payment is due in 2 days",
      action: "Pay Now",
      expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      gracePeriodEnd: null
    },
    {
      id: 4,
      label: "Promotion",
      title: "New User Bonus",
      description: "Complete your first ride and get UGX 5,000 credit",
      action: "Claim Now",
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      gracePeriodEnd: null
    },
    {
      id: 5,
      label: "Reminder",
      title: "Vehicle Service",
      description: "Your vehicle is due for maintenance service",
      action: "Schedule",
      expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      gracePeriodEnd: null
    }
  ]);

  // Filter out expired reminders - check periodically
  useEffect(() => {
    const checkExpiredReminders = () => {
      setReminders((currentReminders) => {
        const now = new Date();
        const activeReminders = currentReminders.filter((reminder) => {
          const expiryDate = reminder.gracePeriodEnd || reminder.expiryDate;
          return expiryDate > now;
        });
        
        // Reset index if reminders were removed
        if (activeReminders.length !== currentReminders.length) {
          setReminderIndex((prev) => {
            if (prev >= activeReminders.length && activeReminders.length > 0) {
              return 0;
            }
            return prev;
          });
        }
        
        return activeReminders;
      });
    };

    // Check immediately
    checkExpiredReminders();
    
    // Check every minute for expired reminders
    const interval = setInterval(checkExpiredReminders, 60000);
    return () => clearInterval(interval);
  }, []); // Run once on mount, then check periodically

  // Auto-rotate reminders every 5 seconds
  useEffect(() => {
    if (reminders.length > 1) {
      const interval = setInterval(() => {
        setReminderIndex((prev) => (prev + 1) % reminders.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [reminders.length]);

  const handleReminderAction = () => {
    // Navigate to payment/renewal page
    navigate("/school-handoff");
  };

  const handleSearchSelect = (option) => {
    if (option && option.route) {
      navigate(option.route);
      setSearchOpen(false);
      setSearchValue("");
    }
  };

  const filteredSearchOptions = searchOptions.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
    option.category.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Top bar */}
      <Box
        sx={{
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          position: "relative"
        }}
      >
        {/* Profile icon */}
        <IconButton
          onClick={() => navigate("/more")}
          sx={{
            p: 0,
            flexShrink: 0,
            "&:hover": { opacity: 0.8 }
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#03CD8C",
              fontSize: 16,
              fontWeight: 600,
              color: "#020617"
            }}
          >
            RZ
          </Avatar>
        </IconButton>

        {/* Search Bar with Autocomplete */}
        <Autocomplete
          freeSolo
          open={searchOpen}
          onOpen={() => setSearchOpen(true)}
          onClose={() => setSearchOpen(false)}
          options={filteredSearchOptions}
          getOptionLabel={(option) => (typeof option === "string" ? option : option.label)}
          groupBy={(option) => option.category}
          value={searchValue}
          onChange={(event, newValue) => {
            if (newValue) {
              handleSearchSelect(newValue);
            }
          }}
          onInputChange={(event, newInputValue) => {
            setSearchValue(newInputValue);
          }}
          inputValue={searchValue}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search rides, shops, charging stations..."
              variant="outlined"
              size="small"
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: (t) =>
                    t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                  border: (t) =>
                    t.palette.mode === "light"
                      ? "1px solid rgba(209,213,219,0.9)"
                      : "1px solid rgba(51,65,85,0.9)",
                  "& fieldset": {
                    border: "none"
                  },
                  "&:hover fieldset": {
                    border: "none"
                  },
                  "&.Mui-focused fieldset": {
                    border: (t) =>
                      t.palette.mode === "light"
                        ? "1px solid #03CD8C"
                        : "1px solid #03CD8C"
                  }
                },
                "& .MuiInputBase-input": {
                  fontSize: 13,
                  py: 1.2,
                  px: 1.5
                }
              }}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      <SearchRoundedIcon
                        sx={{ fontSize: 20, color: (t) => t.palette.text.secondary }}
                      />
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                )
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props} key={option.label}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%" }}>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {option.label}
                </Typography>
                <Chip
                  label={option.category}
                  size="small"
                  sx={{
                    bgcolor: "#03CD8C",
                    color: "#020617",
                    fontSize: 10,
                    height: 20
                  }}
                />
              </Stack>
            </Box>
          )}
          PaperComponent={(props) => (
            <Paper
              {...props}
              sx={{
                mt: 1,
                borderRadius: 2,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                boxShadow: "0 4px 20px rgba(15,23,42,0.15)"
              }}
            />
          )}
          sx={{ flex: 1 }}
        />

        {/* Download icon */}
        <IconButton
          onClick={() => {
            // Navigate to downloads/offline resources (using more menu for now)
            navigate("/more");
          }}
          sx={{
            ml: 1,
            flexShrink: 0,
            width: 40,
            height: 40,
            bgcolor: "#03CD8C",
            color: "#020617",
            borderRadius: 1.5,
            "&:hover": {
              bgcolor: "#02B87A"
            }
          }}
        >
          <DownloadRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Notification Banner (Reminder Card) */}
      {reminders.length > 0 && reminders[reminderIndex] && (
        <Card
          elevation={0}
          sx={{
            mb: 2.5,
            borderRadius: 2,
            bgcolor: (t) =>
              t.palette.mode === "light"
                ? "linear-gradient(135deg, #D1FAE5 0%, #FFFFFF 100%)"
                : "linear-gradient(135deg, rgba(3,205,140,0.15) 0%, rgba(15,23,42,0.98) 100%)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(3,205,140,0.2)"
                : "1px solid rgba(3,205,140,0.3)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <CardContent sx={{ px: 2, py: 1.5 }}>
            <Box sx={{ position: "relative" }}>
              {/* Pill-shaped label tag */}
              <Chip
                label={reminders[reminderIndex]?.label || "Reminder"}
                size="small"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bgcolor: "#03CD8C",
                  color: "#020617",
                  fontSize: 9,
                  fontWeight: 600,
                  height: 20,
                  borderRadius: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}
              />
              
              <Box sx={{ pt: 2.5 }}>
                {/* Title */}
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: 15,
                    fontWeight: 700,
                    mb: 1,
                    color: "#03CD8C"
                  }}
                >
                  {reminders[reminderIndex]?.title || ""}
                </Typography>
                
                {/* Description */}
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 11,
                    color: (t) => t.palette.text.secondary,
                    display: "block",
                    mb: 2,
                    lineHeight: 1.5
                  }}
                >
                  {reminders[reminderIndex]?.description || ""}
                </Typography>
                
                {/* Action Button - Centered */}
                <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleReminderAction}
                    sx={{
                      bgcolor: "#03CD8C",
                      color: "#020617",
                      fontSize: 11,
                      fontWeight: 600,
                      px: 3,
                      py: 0.75,
                      borderRadius: 1.5,
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "#02B87A"
                      }
                    }}
                  >
                    {reminders[reminderIndex]?.action || "Check Now"}
                  </Button>
                </Box>
                
                {/* Carousel Indicators - 5 dots */}
                <Box sx={{ display: "flex", justifyContent: "center", gap: 0.75, mt: 1 }}>
                  {Array.from({ length: Math.min(reminders.length, 5) }).map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => setReminderIndex(index)}
                      sx={{
                        width: index === reminderIndex ? 8 : 6,
                        height: index === reminderIndex ? 8 : 6,
                        borderRadius: "50%",
                        bgcolor: index === reminderIndex 
                          ? (t) => t.palette.mode === "light" ? "#6B7280" : "#9CA3AF"
                          : (t) => t.palette.mode === "light" ? "#D1D5DB" : "#4B5563",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Service Sections */}
      <Box sx={{ mb: 2.5 }}>
        {/* EVZone Marketplace - 4 cards in a row */}
        <Typography
          variant="caption"
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: (t) => t.palette.text.secondary,
            mb: 1.5,
            display: "block",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}
        >
          EVZone Marketplace
        </Typography>
        <Box
          sx={{
            bgcolor: (t) =>
              t.palette.mode === "light" ? "#D1FAE5" : "rgba(3,205,140,0.1)",
            borderRadius: 2,
            p: 1.2
          }}
        >
          <Stack direction="row" spacing={1.2}>
          {/* EVzone MarketPlace - shopping bag with target - merges with background */}
          <Card
            elevation={0}
            onClick={() => navigate("/more")}
            sx={{
              flex: 1,
              borderRadius: 2,
              cursor: "pointer",
              bgcolor: "transparent",
              border: "none",
              transition: "transform 0.12s ease, opacity 0.12s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                opacity: 0.9
              }
            }}
          >
            <CardContent sx={{ px: 1.4, py: 1.4, textAlign: "center", position: "relative" }}>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <LocalMallRoundedIcon
                  sx={{ fontSize: 28, color: "#F77F00", mb: 0.5 }}
                />
                <BoltRoundedIcon
                  sx={{
                    fontSize: 14,
                    color: "#F77F00",
                    position: "absolute",
                    top: -4,
                    right: -4,
                    bgcolor: (t) => t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                    borderRadius: "50%",
                    p: 0.25
                  }}
                />
              </Box>
              <Typography
                variant="subtitle2"
                sx={{ fontSize: 12, fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                EVzone MarketPlace
              </Typography>
            </CardContent>
          </Card>

          {/* EV Marketplace - electric car with lightning */}
          <Card
            elevation={0}
            onClick={() => navigate("/more")}
            sx={{
              flex: 1,
              borderRadius: 2,
              cursor: "pointer",
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)",
              transition: "transform 0.12s ease, box-shadow 0.12s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ px: 1.4, py: 1.4, textAlign: "center", position: "relative" }}>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <ElectricCarRoundedIcon
                  sx={{ fontSize: 28, color: "#F77F00", mb: 0.5 }}
                />
                <BoltRoundedIcon
                  sx={{
                    fontSize: 14,
                    color: "#F77F00",
                    position: "absolute",
                    top: -4,
                    right: -4
                  }}
                />
              </Box>
              <Typography
                variant="subtitle2"
                sx={{ fontSize: 12, fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                EV Marketplace
              </Typography>
            </CardContent>
          </Card>

          {/* ShopNow */}
          <Card
            elevation={0}
            onClick={() => navigate("/more")}
            sx={{
              flex: 1,
              borderRadius: 2,
              cursor: "pointer",
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)",
              transition: "transform 0.12s ease, box-shadow 0.12s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ px: 1.4, py: 1.4, textAlign: "center" }}>
              <LocalMallRoundedIcon
                sx={{ fontSize: 28, color: "#F77F00", mb: 0.5 }}
              />
              <Typography
                variant="subtitle2"
                sx={{ fontSize: 12, fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                ShopNow
              </Typography>
            </CardContent>
          </Card>

          {/* My Cart */}
          <Card
            elevation={0}
            onClick={() => navigate("/more")}
            sx={{
              flex: 1,
              borderRadius: 2,
              cursor: "pointer",
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)",
              transition: "transform 0.12s ease, box-shadow 0.12s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ px: 1.4, py: 1.4, textAlign: "center" }}>
              <ShoppingCartRoundedIcon
                sx={{ fontSize: 28, color: "#F77F00", mb: 0.5 }}
              />
              <Typography
                variant="subtitle2"
                sx={{ fontSize: 12, fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                My Cart
              </Typography>
            </CardContent>
          </Card>
        </Stack>
        </Box>

        {/* EVZone Charging - 4 cards in a row */}
        <Typography
          variant="caption"
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: (t) => t.palette.text.secondary,
            mb: 1.5,
            display: "block",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}
        >
          EVZone Charging
        </Typography>
        <Box
          sx={{
            bgcolor: (t) =>
              t.palette.mode === "light" ? "#D1FAE5" : "rgba(3,205,140,0.1)",
            borderRadius: 2,
            p: 1.2
          }}
        >
          <Stack direction="row" spacing={1.2}>
          {/* EVzone Charging - merges with background */}
          <Card
            elevation={0}
            onClick={() => navigate("/more")}
            sx={{
              flex: 1,
              borderRadius: 2,
              cursor: "pointer",
              bgcolor: "transparent",
              border: "none",
              transition: "transform 0.12s ease, opacity 0.12s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                opacity: 0.9
              }
            }}
          >
            <CardContent sx={{ px: 1.4, py: 1.4, textAlign: "center" }}>
              <EvStationRoundedIcon
                sx={{ fontSize: 28, color: "#F77F00", mb: 0.5 }}
              />
              <Typography
                variant="subtitle2"
                sx={{ fontSize: 12, fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                EVzone Charging
              </Typography>
            </CardContent>
          </Card>

          {/* My Vehicles */}
          <Card
            elevation={0}
            onClick={() => navigate("/more")}
            sx={{
              flex: 1,
              borderRadius: 2,
              cursor: "pointer",
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)",
              transition: "transform 0.12s ease, box-shadow 0.12s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ px: 1.4, py: 1.4, textAlign: "center" }}>
              <DirectionsCarRoundedIcon
                sx={{ fontSize: 28, color: "#F77F00", mb: 0.5 }}
              />
              <Typography
                variant="subtitle2"
                sx={{ fontSize: 12, fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                My Vehicles
              </Typography>
            </CardContent>
          </Card>

          {/* Public Station - gas pump with lightning */}
          <Card
            elevation={0}
            onClick={() => navigate("/more")}
            sx={{
              flex: 1,
              borderRadius: 2,
              cursor: "pointer",
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)",
              transition: "transform 0.12s ease, box-shadow 0.12s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ px: 1.4, py: 1.4, textAlign: "center", position: "relative" }}>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <LocalGasStationRoundedIcon
                  sx={{ fontSize: 28, color: "#F77F00", mb: 0.5 }}
                />
                <BoltRoundedIcon
                  sx={{
                    fontSize: 14,
                    color: "#F77F00",
                    position: "absolute",
                    top: -4,
                    right: -4
                  }}
                />
              </Box>
              <Typography
                variant="subtitle2"
                sx={{ fontSize: 12, fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                Public Station
              </Typography>
            </CardContent>
          </Card>

          {/* Private Station - house with lightning */}
          <Card
            elevation={0}
            onClick={() => navigate("/more")}
            sx={{
              flex: 1,
              borderRadius: 2,
              cursor: "pointer",
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)",
              transition: "transform 0.12s ease, box-shadow 0.12s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ px: 1.4, py: 1.4, textAlign: "center", position: "relative" }}>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <HomeRoundedIcon sx={{ fontSize: 28, color: "#F77F00", mb: 0.5 }} />
                <BoltRoundedIcon
                  sx={{
                    fontSize: 14,
                    color: "#F77F00",
                    position: "absolute",
                    top: -4,
                    right: -4
                  }}
                />
              </Box>
              <Typography
                variant="subtitle2"
                sx={{ fontSize: 12, fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                Private Station
              </Typography>
            </CardContent>
          </Card>
        </Stack>
        </Box>

        {/* EVZone Ride - 4 cards in a row */}
        <Typography
          variant="caption"
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: (t) => t.palette.text.secondary,
            mb: 1.5,
            display: "block",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}
        >
          EVZone Ride
        </Typography>
        <Box
          sx={{
            bgcolor: (t) =>
              t.palette.mode === "light" ? "#D1FAE5" : "rgba(3,205,140,0.1)",
            borderRadius: 2,
            p: 1.2
          }}
        >
          <Stack direction="row" spacing={1.2}>
          {/* EVzone Ride - taxi with lightning - merges with background */}
          <Card
            elevation={0}
            onClick={() => navigate("/rides/enter")}
            sx={{
              flex: 1,
              borderRadius: 2,
              cursor: "pointer",
              bgcolor: "transparent",
              border: "none",
              transition: "transform 0.12s ease, opacity 0.12s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                opacity: 0.9
              }
            }}
          >
            <CardContent sx={{ px: 1.4, py: 1.4, textAlign: "center", position: "relative" }}>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <LocalTaxiRoundedIcon
                  sx={{ fontSize: 28, color: "#F77F00", mb: 0.5 }}
                />
                <BoltRoundedIcon
                  sx={{
                    fontSize: 14,
                    color: "#F77F00",
                    position: "absolute",
                    top: -4,
                    right: -4
                  }}
                />
              </Box>
              <Typography
                variant="subtitle2"
                sx={{ fontSize: 12, fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                EVzone Ride
              </Typography>
            </CardContent>
          </Card>

          {/* Book a Ride - taxi icon */}
          <Card
            elevation={0}
            onClick={() => navigate("/rides/enter")}
            sx={{
              flex: 1,
              borderRadius: 2,
              cursor: "pointer",
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)",
              transition: "transform 0.12s ease, box-shadow 0.12s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ px: 1.4, py: 1.4, textAlign: "center" }}>
              <LocalTaxiRoundedIcon
                sx={{ fontSize: 28, color: "#F77F00", mb: 0.5 }}
              />
              <Typography
                variant="subtitle2"
                sx={{ fontSize: 12, fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                Book a Ride
              </Typography>
            </CardContent>
          </Card>

          {/* Share a Ride - taxi with people */}
          <Card
            elevation={0}
            onClick={() => navigate("/rides/enter?mode=share")}
            sx={{
              flex: 1,
              borderRadius: 2,
              cursor: "pointer",
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)",
              transition: "transform 0.12s ease, box-shadow 0.12s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ px: 1.4, py: 1.4, textAlign: "center", position: "relative" }}>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <LocalTaxiRoundedIcon
                  sx={{ fontSize: 28, color: "#F77F00", mb: 0.5 }}
                />
                <GroupRoundedIcon
                  sx={{
                    fontSize: 12,
                    color: "#F77F00",
                    position: "absolute",
                    top: -6,
                    right: -6
                  }}
                />
              </Box>
              <Typography
                variant="subtitle2"
                sx={{ fontSize: 12, fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                Share a Ride
              </Typography>
            </CardContent>
          </Card>

          {/* Deliver a Parcel - package box */}
          <Card
            elevation={0}
            onClick={() => navigate("/deliveries")}
            sx={{
              flex: 1,
              borderRadius: 2,
              cursor: "pointer",
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)",
              transition: "transform 0.12s ease, box-shadow 0.12s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ px: 1.4, py: 1.4, textAlign: "center" }}>
              <InventoryRoundedIcon
                sx={{ fontSize: 28, color: "#F77F00", mb: 0.5 }}
              />
              <Typography
                variant="subtitle2"
                sx={{ fontSize: 12, fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                Deliver a Parcel
              </Typography>
            </CardContent>
          </Card>
        </Stack>
        </Box>

        {/* School Section - 3 cards in a row with light yellow-orange background */}
        <Typography
          variant="caption"
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: (t) => t.palette.text.secondary,
            mb: 1.5,
            display: "block",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}
        >
          School Section
        </Typography>
        <Box
          sx={{
            borderRadius: 2,
            bgcolor: (t) =>
              t.palette.mode === "light" ? "#D1FAE5" : "rgba(3,205,140,0.1)",
            p: 1.2
          }}
        >
          <Stack direction="row" spacing={1.2}>
            {/* School card - green book with graduation cap - merges with background */}
            <Card
              elevation={0}
              onClick={() => navigate("/school-handoff")}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: "transparent",
                border: "none",
                transition: "transform 0.12s ease, opacity 0.12s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  opacity: 0.9
                }
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.4, textAlign: "center", position: "relative" }}>
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <MenuBookRoundedIcon
                    sx={{ fontSize: 28, color: "#03CD8C", mb: 0.5 }}
                  />
                  <SchoolRoundedIcon
                    sx={{
                      fontSize: 14,
                      color: "#03CD8C",
                      position: "absolute",
                      top: -4,
                      right: -4
                    }}
                  />
                </Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontSize: 12, fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  School
                </Typography>
              </CardContent>
            </Card>

            {/* Parent card - orange person reading */}
            <Card
              elevation={0}
              onClick={() => navigate("/school-handoff")}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                transition: "transform 0.12s ease, box-shadow 0.12s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.4, textAlign: "center", position: "relative" }}>
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <PersonRoundedIcon
                    sx={{ fontSize: 28, color: "#F77F00", mb: 0.5 }}
                  />
                  <MenuBookRoundedIcon
                    sx={{
                      fontSize: 12,
                      color: "#F77F00",
                      position: "absolute",
                      top: -6,
                      right: -6
                    }}
                  />
                </Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontSize: 12, fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  Parent
                </Typography>
              </CardContent>
            </Card>

            {/* Student card - orange books with graduation cap */}
            <Card
              elevation={0}
              onClick={() => navigate("/school-handoff")}
              sx={{
                flex: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)",
                transition: "transform 0.12s ease, box-shadow 0.12s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.4, textAlign: "center", position: "relative" }}>
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <MenuBookRoundedIcon
                    sx={{ fontSize: 28, color: "#F77F00", mb: 0.5 }}
                  />
                  <SchoolRoundedIcon
                    sx={{
                      fontSize: 14,
                      color: "#F77F00",
                      position: "absolute",
                      top: -4,
                      right: -4
                    }}
                  />
                </Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontSize: 12, fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  Student
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Box>

    </Box>
  );
}

export default function RiderScreen01HomeMultiServiceCanvas_v2() {
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
        <HomeMultiServiceScreen />
      </MobileShell>
    </Box>
  );
}
