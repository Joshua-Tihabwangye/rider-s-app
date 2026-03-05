import React from "react";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../components/DarkModeToggle";
import {
  
  Box,
  IconButton,
  Typography
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import MobileShell from "../components/MobileShell";

function WhereToTodayAlternateScreen(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <>
    {/* Green Header */}
        <Box sx={{ bgcolor: "#03CD8C", px: 2.5, pt: 2, pb: 2, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
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
            Where to today?
          </Typography>
        </Box>
        </>


  );
}

export default function RiderScreen44WhereToTodayAlternateCanvas_v2() {
  return (
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: (t) => t.palette.background.default }}>
        

        <DarkModeToggle />

        

        <MobileShell>
          <WhereToTodayAlternateScreen />
        </MobileShell>
      </Box>
  );
}
