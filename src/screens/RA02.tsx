import React, { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
import {
  
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab
} from "@mui/material";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import MobileShell from "../components/MobileShell";

interface CommonPlaceCardProps {
  icon: React.ReactElement;
  label: string;
  address: string;
}

function CommonPlaceCard({ icon, label, address }: CommonPlaceCardProps): React.JSX.Element {
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

function EnterDestinationMainScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const [tab, setTab] = useState("common");

  const handleTabChange = (_event: React.SyntheticEvent, value: string): void => {
    setTab(value);
  };

  return (
    <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          minHeight: 48
        }}
      >
        <IconButton
          size="small"
          aria-label="Open menu"
          onClick={() => navigate("/home")}
          sx={{
            position: "absolute",
            left: 0,
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
          sx={{ fontWeight: 600, letterSpacing: "-0.01em", mx: 7, textAlign: "center" }}
        >
          Where to today?
        </Typography>
      </Box>

      {/* Search */}
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

      {/* Map preview */}
      <Box
        sx={{
          mb: 3,
          borderRadius: 3,
          height: 170,
          position: "relative",
          overflow: "hidden",
          background: (theme) =>
            theme.palette.mode === "light"
              ? "radial-gradient(circle at top, rgba(3,205,140,0.15) 0, #EFF6FF 55%, #DBEAFE 100%)"
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
                bgcolor: "#03CD8C",
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

      {/* Tab content */}
      <Box sx={{ mt: 1 }}>
        {tab === "common" && (
          <>
            <CommonPlaceCard
              icon={<HomeRoundedIcon sx={{ fontSize: 20, color: "#F97316" }} />}
              label="Home"
              address="12, JJ Apartments, New Street, Kampala"
            />
            <CommonPlaceCard
              icon={
                <ApartmentRoundedIcon sx={{ fontSize: 20, color: "#F97316" }} />
              }
              label="Office"
              address="12, JJ Apartments, New Street, Kampala"
            />
          </>
        )}

        {tab === "commutes" && (
          <Typography
            variant="caption"
            sx={{mt: 4,
              display: "block",
              textAlign: "center",
              color: (theme) => theme.palette.text.secondary
            }}
          >
            No daily commutes yet. Your frequent EV routes will show here.
          </Typography>
        )}

        {tab === "upcoming" && (
          <Typography
            variant="caption"
            sx={{mt: 4,
              display: "block",
              textAlign: "center",
              color: (theme) => theme.palette.text.secondary
            }}
          >
            No upcoming rides scheduled. Tap the search bar above to book.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default function RiderScreen2EnterDestinationCanvas_v2() {
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
          <EnterDestinationMainScreen />
        </MobileShell>
      </Box>
    
  );
}
