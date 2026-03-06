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
  Stack
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import MobileShell from "../components/MobileShell";

function RideLaterSummaryScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [summary] = useState({
    pickup: "New School, JJ Street, Kampala",
    dropoff: "Bugolobi Village, Kampala",
    date: "Tue, 07 Oct 2025",
    time: "07:30 AM",
    passengers: 2,
    tripType: "Round trip",
    tripNote: "Driver will wait 45 minutes before return"
  });

  return (
    <>
    {/* Green Header */}
        <Box sx={{ bgcolor: "#03CD8C", px: 7, pt: 2, pb: 2, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
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
            Ride later summary
          </Typography>
        </Box>
        <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>


      {/* Trip summary card */}
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
          {/* From / To */}
          <Box sx={{ mb: 1.75 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.2 }}>
              <PlaceRoundedIcon
                sx={{ fontSize: 18, color: "#22c55e", mt: 0.2 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: (theme) => theme.palette.text.secondary
                  }}
                >
                  From
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: (theme) => theme.palette.text.primary
                  }}
                >
                  {summary.pickup}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                my: 1,
                height: 1,
                bgcolor: (theme) =>
                  theme.palette.mode === "light"
                    ? "#E5E7EB"
                    : "rgba(30,64,175,0.45)"
              }}
            />

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.2 }}>
              <PlaceRoundedIcon
                sx={{ fontSize: 18, color: "#03CD8C", mt: 0.2 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: (theme) => theme.palette.text.secondary
                  }}
                >
                  To
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: (theme) => theme.palette.text.primary
                  }}
                >
                  {summary.dropoff}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Date and time */}
          <Box sx={{ mb: 1.75 }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: (theme) => theme.palette.text.secondary,
                mb: 0.75
              }}
            >
              When
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap" }}>
              <Chip
                icon={<EventRoundedIcon sx={{ fontSize: 16 }} />}
                label={summary.date}
                size="small"
                sx={{
                  borderRadius: 999,
                  fontSize: 11,
                  bgcolor: (theme) =>
                    theme.palette.mode === "light" ? "#EFF6FF" : "rgba(15,23,42,1)",
                  color: (theme) => theme.palette.text.primary
                }}
              />
              <Chip
                icon={<AccessTimeRoundedIcon sx={{ fontSize: 16 }} />}
                label={summary.time}
                size="small"
                sx={{
                  borderRadius: 999,
                  fontSize: 11,
                  bgcolor: (theme) =>
                    theme.palette.mode === "light" ? "#ECFEFF" : "rgba(15,23,42,1)",
                  color: (theme) => theme.palette.text.primary
                }}
              />
            </Stack>
          </Box>

          {/* Passengers and trip type */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: (theme) => theme.palette.text.secondary,
                mb: 0.75
              }}
            >
              Trip details
            </Typography>

            <Stack spacing={1.25}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                <GroupsRoundedIcon
                  sx={{ fontSize: 18, color: "primary.main" }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
                >
                  {summary.passengers} passengers
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                <AutorenewRoundedIcon
                  sx={{ fontSize: 18, color: "#03CD8C" }}
                />
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 11,
                      color: (theme) => theme.palette.text.secondary
                    }}
                  >
                    {summary.tripType}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 11,
                      color: (theme) => theme.palette.text.secondary,
                      display: "block"
                    }}
                  >
                    {summary.tripNote}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{
          mb: 1.5,
          display: "block",
          fontSize: 11,
          color: (theme) => theme.palette.text.secondary
        }}
      >
        You can edit or cancel this Ride Later trip from Upcoming rides before a driver is assigned.
      </Typography>

      <Button
        fullWidth
        variant="contained"
        sx={{
          borderRadius: 999,
          py: 1.1,
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
          bgcolor: "primary.main",
          color: "#020617",
          "&:hover": { bgcolor: "#06e29a" }
        }}
      >
        Confirm Ride Later
      </Button>
    </Box>
    </>

  );
}

export default function RiderScreen9RideLaterSummaryCanvas_v2() {
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
          <RideLaterSummaryScreen />
        </MobileShell>
      </Box>
    
  );
}
