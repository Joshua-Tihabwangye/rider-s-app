import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../components/DarkModeToggle";
import { Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button, IconButton } from "@mui/material";

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

import MobileShell from "../components/MobileShell";

function SchoolShuttlesHandoffScreen(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <>
        <Box sx={{ bgcolor: "#03CD8C", px: 2, pt: 2, pb: 2, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
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
            sx={{ fontWeight: 600, letterSpacing: "-0.01em", color: "#FFFFFF", textAlign: "center" }}
          >
            School shuttles are in EVzone School
          </Typography>
        </Box>
        <Box sx={{ px: 2.5, pt: 2, pb: 20 }}>
          {/* Integration Card */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#F8FAFC" : "rgba(15,23,42,0.98)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)",
              overflow: "hidden"
            }}
          >
            <Box sx={{ bgcolor: "#1D4ED8", px: 2, py: 0.8 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em"
                }}
              >
                External App Integration
              </Typography>
            </Box>
            <CardContent sx={{ px: 2.5, py: 2.5 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, letterSpacing: "-0.01em", mb: 0.5 }}
                  >
                    Link School Portal
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: 13,
                      color: (t) => t.palette.text.secondary,
                      lineHeight: 1.5
                    }}
                  >
                    Connect your EVzone account to your school's official portal. This allows you to sync your transport and IDs directly with the school shuttle system.
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<SchoolRoundedIcon sx={{ fontSize: 20 }} />}
                  sx={{
                    borderRadius: 999,
                    py: 1.25,
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: "none",
                    bgcolor: "#1D4ED8",
                    color: "#FFFFFF",
                    boxShadow: "0 4px 12px rgba(29, 78, 216, 0.25)",
                    "&:hover": { 
                      bgcolor: "#1e40af",
                      boxShadow: "0 6px 16px rgba(29, 78, 216, 0.35)"
                    }
                  }}
                >
                  Link School Account
                </Button>

                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    color: (t) => t.palette.text.secondary,
                    fontSize: 11,
                    px: 1
                  }}
                >
                  By linking your account, you agree to share your transport and schedule data between platforms.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Box>
        </>


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
