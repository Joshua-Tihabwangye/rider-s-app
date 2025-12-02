import React, { useState } from "react";
import {
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Stack,
  Chip,
  Divider
} from "@mui/material";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";

import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";

function CommonPlaceCard({ icon, label, address, selected = false, onSelect }) {
  return (
    <Card
      elevation={0}
      onClick={onSelect}
      sx={{
        borderRadius: 2,
        cursor: onSelect ? "pointer" : "default",
        bgcolor: (theme) =>
          selected
            ? theme.palette.mode === "light"
              ? "#ECFDF5"
              : "rgba(15,23,42,0.96)"
            : theme.palette.mode === "light"
            ? "#FFFFFF"
            : "rgba(15,23,42,0.98)",
        border: (theme) =>
          selected
            ? "1px solid #03CD8C"
            : theme.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.8)",
        mb: 1.5
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

function EnterDestinationMainScreen() {
  const [tab, setTab] = useState("common");
  const [helperState, setHelperState] = useState("idle");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [whereTo, setWhereTo] = useState("");

  const handleTabChange = (event, value) => {
    setTab(value);
    setHelperState(`tab-${value}`);
  };

  const handleQuickAction = (type) => {
    setHelperState(type);
  };

  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    if (place === "home") {
      setWhereTo("12, JJ Apartments, New Street, Kampala");
    } else if (place === "office") {
      setWhereTo("Plot 5, Acacia Avenue, Kampala");
    }
    setHelperState("idle");
  };

  const handleWhereToChange = (event) => {
    setWhereTo(event.target.value);
    setHelperState("search");
    setSelectedPlace(null);
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
          onClick={() => setHelperState("menu")}
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

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Where to?"
        variant="outlined"
        value={whereTo}
        onChange={handleWhereToChange}
        onFocus={() => setHelperState("search")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon sx={{ fontSize: 20, color: "text.secondary" }} />
            </InputAdornment>
          )
        }}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: 999,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.96)",
            "& fieldset": {
              borderColor: (theme) =>
                theme.palette.mode === "light"
                  ? "rgba(209,213,219,0.9)"
                  : "rgba(51,65,85,0.9)"
            },
            "&:hover fieldset": {
              borderColor: "primary.main"
            }
          }
        }}
      />

      {/* Map preview */}
      <Box
        sx={{
          mb: 2,
          borderRadius: 3,
          height: 170,
          position: "relative",
          overflow: "hidden",
          background: (theme) =>
            theme.palette.mode === "light"
              ? "radial-gradient(circle at top, #BAE6FD 0, #EFF6FF 55%, #DBEAFE 100%)"
              : "radial-gradient(circle at top, rgba(15,118,205,0.6), rgba(15,23,42,1))"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.18,
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.35) 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: "24%",
            top: "60%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: "999px",
                bgcolor: "#3b82f6",
                border: "2px solid white"
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: -8,
                borderRadius: "999px",
                border: "1px solid rgba(59,130,246,0.5)"
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            position: "absolute",
            right: "18%",
            top: "26%",
            transform: "translate(50%, -50%)"
          }}
        >
          <PlaceRoundedIcon
            sx={{
              fontSize: 28,
              color: "primary.main",
              filter: "drop-shadow(0 4px 8px rgba(15,23,42,0.9))"
            }}
          />
        </Box>
      </Box>

      {/* Quick actions */}
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (t) =>
            t.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.55 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
            >
              Quick actions
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Chip
              label="Book ride now"
              size="small"
              onClick={() => handleQuickAction("book-now")}
              icon={<DirectionsCarFilledRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 26,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)"
              }}
            />
            <Chip
              label="Schedule ride"
              size="small"
              onClick={() => handleQuickAction("schedule")}
              icon={<AccessTimeRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 26,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)"
              }}
            />
            <Chip
              label="Book for a contact"
              size="small"
              onClick={() => handleQuickAction("book-contact")}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 26,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)"
              }}
            />
            <Chip
              label="Book for someone"
              size="small"
              onClick={() => handleQuickAction("book-someone")}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 26,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)"
              }}
            />
            <Chip
              label="Multi-stop trip"
              size="small"
              onClick={() => handleQuickAction("multi-stop")}
              icon={<ArrowForwardIosRoundedIcon sx={{ fontSize: 14 }} />}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 26,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)"
              }}
            />
            <Chip
              label="View ride history"
              size="small"
              onClick={() => handleQuickAction("history")}
              icon={<ReceiptLongRoundedIcon sx={{ fontSize: 14 }} />}
              sx={{
                borderRadius: 999,
                fontSize: 11,
                height: 26,
                bgcolor: (t) =>
                  t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
                border: (t) =>
                  t.palette.mode === "light"
                    ? "1px solid rgba(209,213,219,0.9)"
                    : "1px solid rgba(51,65,85,0.9)"
              }}
            />
          </Stack>
        </CardContent>
      </Card>

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
            borderRadius: 999,
            bgcolor: "primary.main"
          }
        }}
      >
        <Tab value="common" label="Common Places" />
        <Tab value="commutes" label="Daily Commutes" />
        <Tab value="upcoming" label="Upcoming Rides" />
      </Tabs>

      <Box sx={{ mt: 1 }}>
        {tab === "common" && (
          <>
            <CommonPlaceCard
              icon={<HomeRoundedIcon sx={{ fontSize: 20, color: "#F97316" }} />}
              label="Home"
              address="12, JJ Apartments, New Street, Kampala"
              selected={selectedPlace === "home"}
              onSelect={() => handleSelectPlace("home")}
            />
            <CommonPlaceCard
              icon={<ApartmentRoundedIcon sx={{ fontSize: 20, color: "#F97316" }} />}
              label="Office"
              address="Plot 5, Acacia Avenue, Kampala"
              selected={selectedPlace === "office"}
              onSelect={() => handleSelectPlace("office")}
            />
          </>
        )}

        {tab === "commutes" && (
          <Card
            elevation={0}
            sx={{
              mt: 1,
              mb: 1.5,
              borderRadius: 2,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <CardContent sx={{ px: 1.75, py: 1.6 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Daily commutes
                </Typography>
                <Typography
                  variant="caption"
                  onClick={() => setHelperState("commutes-manage")}
                  sx={{
                    fontSize: 10.5,
                    color: (t) => t.palette.text.secondary,
                    cursor: "pointer"
                  }}
                >
                  Manage
                </Typography>
              </Stack>
              <Divider sx={{ mb: 1, borderColor: (t) => t.palette.divider }} />

              {["Morning", "Evening"].map((when, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 0.6,
                    "&:not(:last-of-type)": {
                      borderBottom: (t) => `1px dashed ${t.palette.divider}`
                    }
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                    >
                      {when} commute
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: 12.5,
                        fontWeight: 500,
                        letterSpacing: "-0.01em"
                      }}
                    >
                      {idx === 0 ? "Home → Office" : "Office → Home"}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label="Book"
                    onClick={() => setHelperState("book-commute")}
                    sx={{
                      borderRadius: 999,
                      fontSize: 10,
                      height: 22,
                      bgcolor: (t) =>
                        t.palette.mode === "light"
                          ? "#F3F4F6"
                          : "rgba(15,23,42,0.96)",
                      color: (t) => t.palette.text.primary
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        )}

        {tab === "upcoming" && (
          <Card
            elevation={0}
            sx={{
              mt: 1,
              mb: 1.5,
              borderRadius: 2,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <CardContent sx={{ px: 1.75, py: 1.6 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                >
                  Upcoming rides
                </Typography>
                <Typography
                  variant="caption"
                  onClick={() => setHelperState("upcoming-all")}
                  sx={{
                    fontSize: 10.5,
                    color: (t) => t.palette.text.secondary,
                    cursor: "pointer"
                  }}
                >
                  See all
                </Typography>
              </Stack>
              <Divider sx={{ mb: 1.1, borderColor: (t) => t.palette.divider }} />

              {["Today · 21:00", "Tomorrow · 08:15", "Fri · 17:30"].map(
                (when, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      py: 0.6,
                      "&:not(:last-of-type)": {
                        borderBottom: (t) => `1px dashed ${t.palette.divider}`
                      }
                    }}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
                      >
                        {when}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: 12.5,
                          fontWeight: 500,
                          letterSpacing: "-0.01em"
                        }}
                      >
                        Nsambya →{" "}
                        {idx === 0
                          ? "Kansanga"
                          : idx === 1
                          ? "City centre"
                          : "Airport"}
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      label={
                        idx === 0
                          ? "Tonight"
                          : idx === 1
                          ? "Morning"
                          : "Weekend"
                      }
                      sx={{
                        borderRadius: 999,
                        fontSize: 10,
                        height: 22,
                        bgcolor: (t) =>
                          t.palette.mode === "light"
                            ? "#F3F4F6"
                            : "rgba(15,23,42,0.96)",
                        color: (t) => t.palette.text.primary
                      }}
                    />
                  </Box>
                )
              )}
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Helper panel */}
      {helperState !== "idle" && (
        <Card
          elevation={0}
          sx={{
            mb: 1.2,
            borderRadius: 2,
            bgcolor: (t) =>
              t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
            border: (t) =>
              t.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)"
          }}
        >
          <CardContent sx={{ px: 1.75, py: 1.1 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 10.5, color: (t) => t.palette.text.secondary }}
            >
              {helperState === "menu" &&
                "Next step: open the main EVzone menu with access to profile, payment methods and other modules."}
              {helperState === "search" &&
                "Next step: show suggestions and recent destinations as you type, then move to EV type selection (RA14/RA20)."}
              {helperState === "book-now" &&
                "Next step: open the immediate ride flow – pickup now, confirm EV type and payment (RA14 → RA20 → RA21)."}
              {helperState === "schedule" &&
                "Next step: open schedule flow – pick date & time, then EV type and payment (RA08/RA09 + RA20/RA21)."}
              {helperState === "multi-stop" &&
                "Next step: switch to the multi-stop entry screen so you can add A/B/C stops (RA39–RA43)."}
              {helperState === "history" &&
                "Next step: open ride history with past and upcoming EV rides (RA33/RA34/RA49/RA37)."}
              {helperState === "book-contact" &&
                "Next step: open the Switch Rider → Contact flow so you can book a ride for a saved contact (RA10–RA13)."}
              {helperState === "book-someone" &&
                "Next step: open the Switch Rider → Someone else flow to enter name and phone for a one-off rider (RA10–RA13)."}
              {helperState === "commutes-manage" &&
                "Next step: open the full Daily Commutes management view where you can add, edit or remove commute presets (RA03)."}
              {helperState === "book-commute" &&
                "Next step: prefill the route (e.g., Home ↔ Office) and take the rider straight into EV type selection for a quick commute booking."}
              {helperState === "upcoming-all" &&
                "Next step: open the dedicated Upcoming Rides screen to see all scheduled EV rides (RA49/RA34)."}
              {helperState.startsWith("tab-") &&
                "You can use tabs to jump between common places, daily commutes and your upcoming EV rides."}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default function RidesDashboard() {
  return (
    <>
      <DarkModeToggle />
      <MobileShell>
        <EnterDestinationMainScreen />
      </MobileShell>
    </>
  );
}
