import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  TextField
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MobileShell from "../components/MobileShell";

function TripTypeRoundTripScreen() {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState("oneway");
  const [returnSameDay, setReturnSameDay] = useState(true);
  const [returnDate, setReturnDate] = useState("2025-10-07");
  const [returnTime, setReturnTime] = useState("17:30");

  const canContinue = tripType === "oneway" || (tripType === "round" && !!returnDate && !!returnTime) || tripType === "later";

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
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
              border: (theme) =>
                theme.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Trip type & round trip
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              Choose whether you want a one-way or return ride
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Trip type buttons */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
          border: (theme) =>
            theme.palette.mode === "light"
              ? "1px solid rgba(209,213,219,0.9)"
              : "1px solid rgba(51,65,85,0.9)"
        }}
      >
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: (theme) => theme.palette.text.secondary,
              mb: 1.25
            }}
          >
            Trip type
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 1
            }}
          >
            {[
              { id: "oneway", label: "One-way" },
              { id: "round", label: "Round trip" },
              { id: "later", label: "Ride later" }
            ].map((opt) => {
              const isActive = tripType === opt.id;
              return (
                <Button
                  key={opt.id}
                  variant={isActive ? "contained" : "outlined"}
                  onClick={() => setTripType(opt.id)}
                  sx={{
                    borderRadius: 999,
                    fontSize: 12,
                    py: 0.7,
                    textTransform: "none",
                    bgcolor: isActive
                      ? "primary.main"
                      : (theme) =>
                          theme.palette.mode === "light"
                            ? "#F9FAFB"
                            : "rgba(15,23,42,0.96)",
                    color: isActive
                      ? "#020617"
                      : (theme) => theme.palette.text.primary,
                    borderColor: isActive
                      ? "primary.main"
                      : (theme) =>
                          theme.palette.mode === "light"
                            ? "rgba(209,213,219,0.9)"
                            : "rgba(51,65,85,0.9)"
                  }}
                >
                  {opt.label}
                </Button>
              );
            })}
          </Box>
        </CardContent>
      </Card>

      {/* Round trip details */}
      {tripType === "round" && (
        <Card
          elevation={0}
          sx={{
            mb: 2.5,
            borderRadius: 2,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
            border: (theme) =>
              theme.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)"
          }}
        >
          <CardContent sx={{ px: 1.75, py: 1.75 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AutorenewRoundedIcon
                sx={{ fontSize: 22, color: "#03CD8C" }}
              />
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  Round trip details
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
                >
                  Tell us when you want to return so we can price your ride fairly.
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={1} sx={{ mt: 1.75, mb: 1.5 }}>
              <Chip
                label="Return same day"
                size="small"
                onClick={() => setReturnSameDay(true)}
                sx={{
                  borderRadius: 999,
                  fontSize: 11,
                  height: 26,
                  bgcolor: returnSameDay
                    ? "primary.main"
                    : (theme) =>
                        theme.palette.mode === "light"
                          ? "#F3F4F6"
                          : "rgba(15,23,42,0.96)",
                  color: returnSameDay
                    ? "#020617"
                    : (theme) => theme.palette.text.primary
                }}
              />
              <Chip
                label="Return another day"
                size="small"
                onClick={() => setReturnSameDay(false)}
                sx={{
                  borderRadius: 999,
                  fontSize: 11,
                  height: 26,
                  bgcolor: !returnSameDay
                    ? "primary.main"
                    : (theme) =>
                        theme.palette.mode === "light"
                          ? "#F3F4F6"
                          : "rgba(15,23,42,0.96)",
                  color: !returnSameDay
                    ? "#020617"
                    : (theme) => theme.palette.text.primary
                }}
              />
            </Stack>

            <Stack spacing={1.75}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Return date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 999,
                    bgcolor: (theme) =>
                      theme.palette.mode === "light"
                        ? "#F9FAFB"
                        : "rgba(15,23,42,0.96)",
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

              <TextField
                fullWidth
                size="small"
                type="time"
                label="Return time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 999,
                    bgcolor: (theme) =>
                      theme.palette.mode === "light"
                        ? "#FFFFFF"
                        : "rgba(15,23,42,0.96)",
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
            </Stack>
          </CardContent>
        </Card>
      )}

      {tripType === "later" && (
        <Card
          elevation={0}
          sx={{
            mb: 2.5,
            borderRadius: 2,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
            border: (theme) =>
              theme.palette.mode === "light"
                ? "1px solid rgba(209,213,219,0.9)"
                : "1px solid rgba(51,65,85,0.9)"
          }}
        >
          <CardContent sx={{ px: 1.75, py: 1.75 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EventRoundedIcon
                sx={{ fontSize: 22, color: "primary.main" }}
              />
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  Ride later details
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
                >
                  You will choose exact date and time on the next screen.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

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
          For round trips we may hold your driver or assign a second driver
          depending on duration and availability. Pricing will adjust
          accordingly.
        </Typography>
      </Box>

      <Button
        fullWidth
        variant="contained"
        disabled={!canContinue}
        sx={{
          borderRadius: 999,
          py: 1.1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: canContinue ? "primary.main" : "#9CA3AF",
          color: canContinue ? "#020617" : "#E5E7EB",
          "&:hover": {
            bgcolor: canContinue ? "#06e29a" : "#9CA3AF"
          }
        }}
      >
        Continue
      </Button>
    </Box>
  );
}

export default function RiderScreen15TripTypeRoundTripCanvas_v2() {
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
          <TripTypeRoundTripScreen />
        </MobileShell>
      </Box>
    
  );
}
