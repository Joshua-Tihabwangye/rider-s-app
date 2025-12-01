import React from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import {
  
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button
} from "@mui/material";

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";

import MobileShell from "../components/MobileShell";
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: { main: "#03CD8C" },
    secondary: { main: "#F77F00" },
    ...(mode === "light"
      ? {
          background: { default: "#F3F4F6", paper: "#FFFFFF" },
          text: { primary: "#0F172A", secondary: "#6B7280" },
          divider: "rgba(148,163,184,0.4)"
        }
      : {
          background: { default: "#020617", paper: "#020617" },
          text: { primary: "#F9FAFB", secondary: "#A6A6A6" },
          divider: "rgba(148,163,184,0.24)"
        })
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    button: { textTransform: "none", fontWeight: 600 },
    h6: { fontWeight: 600 }
  }
});

function SchoolShuttlesHandoffScreen() {
  return (
    <Box sx={{ px: 2.5, pt: 3, pb: 3 }}>
      <Box
        sx={{
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 999,
            bgcolor: "rgba(59,130,246,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <SchoolRoundedIcon sx={{ fontSize: 26, color: "#1D4ED8" }} />
        </Box>
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
          >
            School shuttles are in EVzone School
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            Book or confirm your child’s seat and track the bus from the
            dedicated Parents / School app.
          </Typography>
        </Box>
      </Box>

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
        <CardContent sx={{ px: 1.75, py: 1.75 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary, mb: 1, display: "block" }}
          >
            In EVzone School you can:
          </Typography>
          <Stack spacing={0.6} sx={{ mb: 1.5 }}>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              • Register children for school shuttle routes
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              • See daily pick-up and drop-off times
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11 }}>
              • Track the bus in real time
            </Typography>
          </Stack>
          <Typography
            variant="caption"
            sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
          >
            This app just links you to the School / Parents app for all shuttle
            operations.
          </Typography>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={1.25} sx={{ mb: 1.5 }}>
        <Button
          fullWidth
          variant="contained"
          sx={{
            borderRadius: 999,
            py: 1,
            fontSize: 14,
            fontWeight: 600,
            textTransform: "none",
            bgcolor: "primary.main",
            color: "#020617",
            "&:hover": { bgcolor: "#06e29a" }
          }}
        >
          Open EVzone School app
        </Button>
        <Button
          fullWidth
          variant="outlined"
          sx={{
            borderRadius: 999,
            py: 1,
            fontSize: 13,
            textTransform: "none"
          }}
        >
          Get the app
        </Button>
      </Stack>

      <Typography
        variant="caption"
        sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}
      >
        Once installed, you’ll be able to move between EVzone and EVzone School
        seamlessly.
      </Typography>
    </Box>
  );
}

export default function RiderScreen89SchoolShuttlesHandoffCanvas_v2() {
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
          <SchoolShuttlesHandoffScreen />
        </MobileShell>
      </Box>
    
  );
}
