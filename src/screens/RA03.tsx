import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import {
  
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Tabs,
  Tab
} from "@mui/material";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import MobileShell from "../components/MobileShell";

function CommuteCard(): JSX.Element {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        bgcolor: (theme) =>
          theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
        border: (theme) =>
          theme.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(51,65,85,0.9)",
        mt: 1.5
      }}
    >
      <CardContent sx={{ px: 1.75, py: 1.75 }}>
        <Box
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "rgba(16,185,129,0.16)",
                fontSize: 16,
                fontWeight: 600,
                color: "#047857"
              }}
            >
              B
            </Avatar>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
                >
                  Bwanbale
                </Typography>
                <Chip
                  size="small"
                  icon={
                    <DirectionsCarFilledRoundedIcon
                      sx={{ fontSize: 13, color: "#22c55e" }}
                    />
                  }
                  label="Tesla Model X • UPL 630"
                  sx={{
                    bgcolor: (theme) =>
                      theme.palette.mode === "light"
                        ? "#F3F4F6"
                        : "rgba(15,23,42,0.9)",
                    borderRadius: 999,
                    color: (theme) =>
                      theme.palette.mode === "light"
                        ? "#4B5563"
                        : "rgba(148,163,184,1)",
                    fontSize: 10,
                    pl: 0.5
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <StarRoundedIcon sx={{ fontSize: 15, color: "#facc15" }} />
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
                >
                  4.0 • 87 trips
                </Typography>
              </Box>
            </Box>
          </Box>
          <ArrowForwardIosRoundedIcon
            sx={{ fontSize: 16, color: "rgba(148,163,184,1)" }}
          />
        </Box>

        <Box sx={{ mt: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
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
                sx={{ fontWeight: 500, color: (theme) => theme.palette.text.primary }}
              >
                New School, JJ Street, Kampala
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              my: 1,
              height: 1,
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#E5E7EB" : "rgba(30,64,175,0.4)"
            }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
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
                sx={{ fontWeight: 500, color: (theme) => theme.palette.text.primary }}
              >
                New School, JJ Street, Kampala
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              Tomorrow • 07:30 AM
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: (theme) => theme.palette.text.secondary }}
            >
              12 km • Est. UGX 20,000
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            sx={{
              borderRadius: 999,
              px: 2.4,
              py: 0.4,
              fontSize: 11,
              bgcolor: "primary.main",
              textTransform: "none",
              "&:hover": { bgcolor: "#06e29a" }
            }}
          >
            Request
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

function DailyCommutesScreen(): JSX.Element {
  const [tab, setTab] = useState("commutes");

  const handleTabChange = (event, value) => {
    setTab(value);
  };

  return (
    <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>
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

      <TextField
        fullWidth
        size="small"
        placeholder="Where to?"
        variant="outlined"
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

      <Box
        sx={{
          mb: 3,
          borderRadius: 3,
          height: 160,
          position: "relative",
          overflow: "hidden",
          background: (theme) =>
            theme.palette.mode === "light"
              ? "radial-gradient(circle at top, #BBF7D0 0, #DCFCE7 50%, #F0FDF4 100%)"
              : "radial-gradient(circle at top, rgba(52,211,153,0.55), rgba(15,23,42,1))"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.18,
            backgroundImage:
              "linear-gradient(to right, rgba(15,23,42,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.18) 1px, transparent 1px)",
            backgroundSize: "30px 30px"
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: "20%",
            top: "65%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: "999px",
              bgcolor: "#03CD8C",
              border: "2px solid white"
            }}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            right: "20%",
            top: "30%",
            transform: "translate(50%, -50%)"
          }}
        >
          <DirectionsCarFilledRoundedIcon
            sx={{
              fontSize: 26,
              color: "primary.main",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.25))"
            }}
          />
        </Box>
      </Box>

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
        {tab === "commutes" && <CommuteCard />}

        {tab === "common" && (
          <Typography
            variant="caption"
            sx={{
              mt: 4,
              display: "block",
              textAlign: "center",
              color: (theme) => theme.palette.text.secondary
            }}
          >
            Your saved EV places (Home, Office) will appear here.
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
            No upcoming commutes. Schedule a Ride Later to see it here.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default function RiderScreen3DailyCommutesCanvas(): JSX.Element {
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
          <DailyCommutesScreen />
        </MobileShell>
      </Box>
    
  );
}
