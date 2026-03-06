import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from "@mui/material";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";
import MobileShell from "../components/MobileShell";
import DarkModeToggle from "../components/DarkModeToggle";

export default function About(): React.JSX.Element {
  const navigate = useNavigate();

  const aboutItems = [
    {
      icon: <InfoRoundedIcon />,
      label: "App Version",
      description: "1.0.0"
    },
    {
      icon: <DescriptionRoundedIcon />,
      label: "Terms of Service",
      description: "Read our terms and conditions"
    },
    {
      icon: <GavelRoundedIcon />,
      label: "Privacy Policy",
      description: "How we handle your data"
    },
    {
      icon: <UpdateRoundedIcon />,
      label: "What's New",
      description: "Latest updates and features"
    }
  ];

  return (
    <>
      <DarkModeToggle />
      <MobileShell>
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
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em", color: "#FFFFFF" }}
            >
              About
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: 11,
                color: "rgba(255,255,255,0.85)",
                display: "block"
              }}
            >
              EVzone Rider App
            </Typography>
          </Box>
        </Box>

        <Box sx={{ px: 2.5, pt: 2, pb: 3 }}>
          {/* App Info */}
          <Box
            sx={{
              mb: 3,
              textAlign: "center",
              py: 3,
              borderRadius: 2,
              bgcolor: (t) =>
                t.palette.mode === "light"
                  ? "#FFFFFF"
                  : "rgba(15,23,42,0.98)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 0.5,
                color: "primary.main"
              }}
            >
              EVzone Rider
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: 12,
                color: (t) => t.palette.text.secondary
              }}
            >
              Version 1.0.0
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                px: 2,
                fontSize: 12,
                color: (t) => t.palette.text.secondary,
                lineHeight: 1.6
              }}
            >
              Your all-in-one platform for rides, deliveries, rentals, tours, and emergency services.
            </Typography>
          </Box>

          {/* About List */}
          <List
            sx={{
              bgcolor: "transparent",
              "& .MuiListItem-root": {
                px: 0
              }
            }}
          >
            {aboutItems.map((item, index) => (
              <React.Fragment key={item.label}>
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      py: 1.5,
                      px: 1.5,
                      bgcolor: (t) =>
                        t.palette.mode === "light"
                          ? "#FFFFFF"
                          : "rgba(15,23,42,0.98)",
                      border: (t) =>
                        t.palette.mode === "light"
                          ? "1px solid rgba(209,213,219,0.9)"
                          : "1px solid rgba(51,65,85,0.9)",
                      "&:hover": {
                        bgcolor: (t) =>
                          t.palette.mode === "light"
                            ? "#F9FAFB"
                            : "rgba(15,23,42,1)",
                        transform: "translateY(-1px)",
                        boxShadow: 2
                      },
                      transition: "all 0.2s ease"
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: "#03CD8C"
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      secondary={item.description}
                    />
                  </ListItemButton>
                </ListItem>
                {index < aboutItems.length - 1 && (
                  <Divider sx={{ my: 0.5, opacity: 0.1 }} />
                )}
              </React.Fragment>
            ))}
          </List>

          {/* Copyright */}
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: 11,
                color: (t) => t.palette.text.secondary
              }}
            >
              © 2025 EVzone. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </MobileShell>
    </>
  );
}

