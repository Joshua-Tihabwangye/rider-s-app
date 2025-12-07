import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  IconButton
} from "@mui/material";

import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import TourRoundedIcon from "@mui/icons-material/TourRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Button from "@mui/material/Button";
import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";

function HomeMultiServiceScreen(): JSX.Element {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentReminderIndex, setCurrentReminderIndex] = useState(0);
  
  // Color definitions: Green variants and Orange for CTAs
  const greenPrimary = "#03CD8C"; // Main green
  const greenSecondary = "#22C55E"; // Lighter green variant
  const orangeCTA = "#F77F00"; // Orange for CTA buttons

  // Mock reminders data - in production, this would come from backend
  const reminders = [
    {
      id: 1,
      title: "Student Bus Fees",
      description: "John Doe - Expires in 5 days. Grace period: 2 days remaining.",
      actionRoute: "/school-handoff/fees"
    },
    {
      id: 2,
      title: "Ride Promotion",
      description: "Get 20% off your next ride. Valid until end of month.",
      actionRoute: "/rides/promotions"
    },
    {
      id: 3,
      title: "Payment Alert",
      description: "Your wallet balance is low. Add funds to continue booking.",
      actionRoute: "/wallet"
    }
  ];

  // Auto-rotate reminders every 5 seconds
  useEffect(() => {
    if (reminders.length > 1) {
      const interval = setInterval(() => {
        setCurrentReminderIndex((prev) => (prev + 1) % reminders.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [reminders.length]);

  const handleReminderAction = (route) => {
    navigate(route);
  };

  const handlePreviousReminder = () => {
    setCurrentReminderIndex((prev) => (prev - 1 + reminders.length) % reminders.length);
  };

  const handleNextReminder = () => {
    setCurrentReminderIndex((prev) => (prev + 1) % reminders.length);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or rides dashboard
      navigate("/rides/enter", { state: { searchQuery: searchQuery.trim() } });
    }
  };

  const handleDownloadClick = () => {
    // Handle download action
    console.log("Download clicked");
  };
  
  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Top Section: Avatar, Search Bar, and Action Button */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 1.5
        }}
      >
        {/* Avatar */}
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: greenPrimary,
            fontSize: 18,
            fontWeight: 600,
            color: "#FFFFFF",
            flexShrink: 0
          }}
        >
          RZ
        </Avatar>

        {/* Search Bar */}
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search rides, shops, c..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch(e);
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon 
                    sx={{ 
                      fontSize: 20, 
                      color: (t) => t.palette.text.secondary 
                    }} 
                  />
                </InputAdornment>
              )
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 999,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.96)",
                "& fieldset": {
                  borderColor: (t) =>
                    t.palette.mode === "light"
                      ? "rgba(209,213,219,0.9)"
                      : "rgba(51,65,85,0.9)"
                },
                "&:hover fieldset": {
                  borderColor: greenPrimary
                },
                "&.Mui-focused fieldset": {
                  borderColor: greenPrimary
                }
              }
            }}
          />
        </Box>

        {/* Download/Action Button */}
        <IconButton
          onClick={handleDownloadClick}
          sx={{
            width: 40,
            height: 40,
            bgcolor: greenPrimary,
            color: "#FFFFFF",
            flexShrink: 0,
            "&:hover": {
              bgcolor: greenSecondary
            }
          }}
        >
          <ArrowDownwardRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Notification Banner (Reminder Card) */}
      {reminders.length > 0 && (
        <Card
          elevation={0}
          sx={{
            mb: 2.5,
            borderRadius: 2.5,
            bgcolor: (t) =>
              t.palette.mode === "light"
                ? "linear-gradient(135deg, rgba(3,205,140,0.08) 0%, rgba(255,255,255,1) 100%)"
                : "linear-gradient(135deg, rgba(3,205,140,0.15) 0%, rgba(15,23,42,0.98) 100%)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(3,205,140,0.2)"
                : "1px solid rgba(3,205,140,0.3)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <CardContent sx={{ px: 1.8, py: 1.6, position: "relative" }}>
            {/* Navigation arrows (only show if multiple reminders) */}
            {reminders.length > 1 && (
              <>
                <IconButton
                  onClick={handlePreviousReminder}
                  sx={{
                    position: "absolute",
                    left: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 28,
                    height: 28,
                    bgcolor: (t) =>
                      t.palette.mode === "light" ? "rgba(255,255,255,0.9)" : "rgba(15,23,42,0.9)",
                    border: (t) =>
                      t.palette.mode === "light"
                        ? "1px solid rgba(3,205,140,0.2)"
                        : "1px solid rgba(3,205,140,0.3)",
                    zIndex: 2,
                    "&:hover": {
                      bgcolor: (t) =>
                        t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,1)"
                    }
                  }}
                >
                  <ChevronLeftRoundedIcon sx={{ fontSize: 18, color: greenPrimary }} />
                </IconButton>
                <IconButton
                  onClick={handleNextReminder}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 28,
                    height: 28,
                    bgcolor: (t) =>
                      t.palette.mode === "light" ? "rgba(255,255,255,0.9)" : "rgba(15,23,42,0.9)",
                    border: (t) =>
                      t.palette.mode === "light"
                        ? "1px solid rgba(3,205,140,0.2)"
                        : "1px solid rgba(3,205,140,0.3)",
                    zIndex: 2,
                    "&:hover": {
                      bgcolor: (t) =>
                        t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,1)"
                    }
                  }}
                >
                  <ChevronRightRoundedIcon sx={{ fontSize: 18, color: greenPrimary }} />
                </IconButton>
              </>
            )}

            {/* Reminder Content */}
            <Box sx={{ px: reminders.length > 1 ? 4 : 0 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <NotificationsRoundedIcon
                  sx={{
                    fontSize: 18,
                    color: greenPrimary
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 10,
                    color: greenPrimary,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontWeight: 600
                  }}
                >
                  Reminder
                </Typography>
              </Stack>

              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  mb: 0.5,
                  color: (t) => t.palette.text.primary
                }}
              >
                {reminders[currentReminderIndex].title}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  fontSize: 11,
                  color: (t) => t.palette.text.secondary,
                  mb: 1.5,
                  display: "block",
                  lineHeight: 1.5
                }}
              >
                {reminders[currentReminderIndex].description}
              </Typography>

              <Button
                variant="contained"
                size="small"
                onClick={() => handleReminderAction(reminders[currentReminderIndex].actionRoute)}
                sx={{
                  bgcolor: greenPrimary,
                  color: "#FFFFFF",
                  borderRadius: 999,
                  px: 2.5,
                  py: 0.75,
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: greenSecondary
                  }
                }}
              >
                Check Now
              </Button>
            </Box>

            {/* Carousel Indicators */}
            {reminders.length > 1 && (
              <Stack
                direction="row"
                spacing={0.5}
                justifyContent="center"
                sx={{ mt: 1.5 }}
              >
                {reminders.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentReminderIndex(index)}
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor:
                        index === currentReminderIndex
                          ? greenPrimary
                          : (t) =>
                              t.palette.mode === "light"
                                ? "rgba(3,205,140,0.3)"
                                : "rgba(3,205,140,0.5)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: greenPrimary,
                        transform: "scale(1.2)"
                      }
                    }}
                  />
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      )}

      {/* Personalization Area - Your Last Ride */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2.5,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.8, py: 1.5 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 10, color: (t) => t.palette.text.secondary, mb: 0.5, display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}
          >
            YOUR LAST RIDE
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", mb: 0.25 }}
              >
                Home → Office
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
              >
                12 min • UGX 5,000
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate("/rides/enter")}
              sx={{
                bgcolor: greenPrimary,
                color: "#FFFFFF",
                borderRadius: 999,
                px: 2,
                py: 0.75,
                fontSize: 11,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  bgcolor: greenSecondary
                }
              }}
            >
              Rebook
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Primary service picker */}
      <Box sx={{ mb: 2.5 }}>
        <Typography
          variant="caption"
          sx={{ fontSize: 9, color: (t) => t.palette.text.secondary, mb: 1, display: "block", opacity: 0.7 }}
        >
          EVzone services
        </Typography>

        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1.2}>
            {/* Ride */}
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
                transition: "transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 4,
                  borderColor: orangeCTA
                }
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.4, position: "relative" }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
                  <ElectricCarRoundedIcon sx={{ fontSize: 20, color: greenPrimary }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em", flex: 1 }}
                  >
                    Ride
                  </Typography>
                  <ArrowForwardIosRoundedIcon 
                    sx={{ 
                      fontSize: 12, 
                      color: (t) => t.palette.text.secondary,
                      opacity: 0.5
                    }} 
                  />
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Book an electric ride now or later
                </Typography>
              </CardContent>
            </Card>

            {/* Delivery */}
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
                transition: "transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 4,
                  borderColor: orangeCTA
                }
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.4, position: "relative" }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
                  <LocalShippingRoundedIcon sx={{ fontSize: 20, color: greenPrimary }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em", flex: 1 }}
                  >
                    Delivery
                  </Typography>
                  <ArrowForwardIosRoundedIcon 
                    sx={{ 
                      fontSize: 12, 
                      color: (t) => t.palette.text.secondary,
                      opacity: 0.5
                    }} 
                  />
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Send or receive parcels with EV couriers
                </Typography>
              </CardContent>
            </Card>
          </Stack>

          <Stack direction="row" spacing={1.2}>
            {/* Rental */}
            <Card
              elevation={0}
              onClick={() => navigate("/rental")}
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
                transition: "transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 4,
                  borderColor: orangeCTA
                }
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.4, position: "relative" }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
                  <LuggageRoundedIcon sx={{ fontSize: 20, color: greenPrimary }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em", flex: 1 }}
                  >
                    Rental
                  </Typography>
                  <ArrowForwardIosRoundedIcon 
                    sx={{ 
                      fontSize: 12, 
                      color: (t) => t.palette.text.secondary,
                      opacity: 0.5
                    }} 
                  />
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Rent an EV for self-drive or chauffeur
                </Typography>
              </CardContent>
            </Card>

            {/* Tours */}
            <Card
              elevation={0}
              onClick={() => navigate("/tours")}
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
                transition: "transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 4,
                  borderColor: orangeCTA
                }
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.4, position: "relative" }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
                  <TourRoundedIcon sx={{ fontSize: 20, color: greenPrimary }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em", flex: 1 }}
                  >
                    Tours
                  </Typography>
                  <ArrowForwardIosRoundedIcon 
                    sx={{ 
                      fontSize: 12, 
                      color: (t) => t.palette.text.secondary,
                      opacity: 0.5
                    }} 
                  />
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Book EV tours, day trips
                </Typography>
              </CardContent>
            </Card>
          </Stack>

          <Stack direction="row" spacing={1.2}>
            {/* School */}
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
                transition: "transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 4,
                  borderColor: orangeCTA
                }
              }}
            >
              <CardContent sx={{ px: 1.4, py: 1.4, position: "relative" }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
                  <SchoolRoundedIcon sx={{ fontSize: 20, color: greenPrimary }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em", flex: 1 }}
                  >
                    School
                  </Typography>
                  <ArrowForwardIosRoundedIcon 
                    sx={{ 
                      fontSize: 12, 
                      color: (t) => t.palette.text.secondary,
                      opacity: 0.5
                    }} 
                  />
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Manage your school shuttle rides
                </Typography>
              </CardContent>
            </Card>

            {/* Ambulance */}
            <Card
              elevation={0}
              onClick={() => navigate("/ambulance")}
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
              <CardContent sx={{ px: 1.4, py: 1.4, position: "relative" }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
                  <LocalHospitalRoundedIcon sx={{ fontSize: 20, color: "#DC2626" }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em", flex: 1 }}
                  >
                    Ambulance
                  </Typography>
                  <ArrowForwardIosRoundedIcon 
                    sx={{ 
                      fontSize: 12, 
                      color: (t) => t.palette.text.secondary,
                      opacity: 0.5
                    }} 
                  />
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Request an emergency or transfer ambulance
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </Box>

      {/* Quick actions - Redesigned with better styling */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2.5,
          bgcolor: (t) =>
            t.palette.mode === "light"
              ? "linear-gradient(135deg, rgba(3,205,140,0.05) 0%, rgba(255,255,255,1) 100%)"
              : "linear-gradient(135deg, rgba(3,205,140,0.1) 0%, rgba(15,23,42,0.98) 100%)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(3,205,140,0.15)"
              : "1px solid rgba(3,205,140,0.25)"
        }}
      >
        <CardContent sx={{ px: 1.8, py: 1.8 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: 10,
              color: (t) => t.palette.text.secondary,
              mb: 1.5,
              display: "block",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontWeight: 600
            }}
          >
            Quick actions
          </Typography>
          <Stack direction="row" spacing={1.25} sx={{ flexWrap: "wrap" }}>
            <Chip
              icon={<RouteRoundedIcon sx={{ fontSize: 18, color: greenPrimary }} />}
              label="Book usual route"
              size="small"
              onClick={() => navigate("/rides/enter")}
              sx={{
                borderRadius: 999,
                fontSize: 12,
                height: 36,
                cursor: "pointer",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(3,205,140,0.3)"
                    : "1px solid rgba(3,205,140,0.4)",
                color: greenPrimary,
                fontWeight: 600,
                boxShadow: (t) =>
                  t.palette.mode === "light"
                    ? "0 2px 8px rgba(3,205,140,0.1)"
                    : "0 2px 8px rgba(3,205,140,0.15)",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: greenPrimary,
                  bgcolor: (t) =>
                    t.palette.mode === "light" ? "rgba(3,205,140,0.1)" : "rgba(3,205,140,0.2)",
                  transform: "translateY(-2px)",
                  boxShadow: (t) =>
                    t.palette.mode === "light"
                      ? "0 4px 12px rgba(3,205,140,0.2)"
                      : "0 4px 12px rgba(3,205,140,0.25)"
                },
                "&:active": {
                  transform: "translateY(0px)"
                }
              }}
            />
            <Chip
              icon={<WorkRoundedIcon sx={{ fontSize: 18, color: greenPrimary }} />}
              label="Go to work"
              size="small"
              onClick={() => navigate("/rides/enter")}
              sx={{
                borderRadius: 999,
                fontSize: 12,
                height: 36,
                cursor: "pointer",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(3,205,140,0.3)"
                    : "1px solid rgba(3,205,140,0.4)",
                color: greenPrimary,
                fontWeight: 600,
                boxShadow: (t) =>
                  t.palette.mode === "light"
                    ? "0 2px 8px rgba(3,205,140,0.1)"
                    : "0 2px 8px rgba(3,205,140,0.15)",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: greenPrimary,
                  bgcolor: (t) =>
                    t.palette.mode === "light" ? "rgba(3,205,140,0.1)" : "rgba(3,205,140,0.2)",
                  transform: "translateY(-2px)",
                  boxShadow: (t) =>
                    t.palette.mode === "light"
                      ? "0 4px 12px rgba(3,205,140,0.2)"
                      : "0 4px 12px rgba(3,205,140,0.25)"
                },
                "&:active": {
                  transform: "translateY(0px)"
                }
              }}
            />
            <Chip
              icon={<ElectricCarRoundedIcon sx={{ fontSize: 18, color: greenPrimary }} />}
              label="Rebook last ride"
              size="small"
              onClick={() => navigate("/rides/enter")}
              sx={{
                borderRadius: 999,
                fontSize: 12,
                height: 36,
                cursor: "pointer",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(3,205,140,0.3)"
                    : "1px solid rgba(3,205,140,0.4)",
                color: greenPrimary,
                fontWeight: 600,
                boxShadow: (t) =>
                  t.palette.mode === "light"
                    ? "0 2px 8px rgba(3,205,140,0.1)"
                    : "0 2px 8px rgba(3,205,140,0.15)",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: greenPrimary,
                  bgcolor: (t) =>
                    t.palette.mode === "light" ? "rgba(3,205,140,0.1)" : "rgba(3,205,140,0.2)",
                  transform: "translateY(-2px)",
                  boxShadow: (t) =>
                    t.palette.mode === "light"
                      ? "0 4px 12px rgba(3,205,140,0.2)"
                      : "0 4px 12px rgba(3,205,140,0.25)"
                },
                "&:active": {
                  transform: "translateY(0px)"
                }
              }}
            />
            <Chip
              icon={<LocalShippingRoundedIcon sx={{ fontSize: 18, color: greenPrimary }} />}
              label="Track a parcel"
              size="small"
              onClick={() => navigate("/deliveries")}
              sx={{
                borderRadius: 999,
                fontSize: 12,
                height: 36,
                cursor: "pointer",
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(3,205,140,0.3)"
                    : "1px solid rgba(3,205,140,0.4)",
                color: greenPrimary,
                fontWeight: 600,
                boxShadow: (t) =>
                  t.palette.mode === "light"
                    ? "0 2px 8px rgba(3,205,140,0.1)"
                    : "0 2px 8px rgba(3,205,140,0.15)",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: greenPrimary,
                  bgcolor: (t) =>
                    t.palette.mode === "light" ? "rgba(3,205,140,0.1)" : "rgba(3,205,140,0.2)",
                  transform: "translateY(-2px)",
                  boxShadow: (t) =>
                    t.palette.mode === "light"
                      ? "0 4px 12px rgba(3,205,140,0.2)"
                      : "0 4px 12px rgba(3,205,140,0.25)"
                },
                "&:active": {
                  transform: "translateY(0px)"
                }
              }}
            />
          </Stack>
        </CardContent>
      </Card>
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
