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

import ScreenScaffold from "../components/ScreenScaffold";
import SectionHeader from "../components/primitives/SectionHeader";
import { uiTokens } from "../design/tokens";

export default function About(): React.JSX.Element {
  const navigate = useNavigate();

  const aboutItems = [
    {
      icon: <InfoRoundedIcon />,
      label: "App Version",
      description: "1.0.0",
      action: undefined
    },
    {
      icon: <DescriptionRoundedIcon />,
      label: "Terms of Service",
      description: "Read our terms and conditions",
      action: () => window.open("https://evzone.com/terms", "_blank")
    },
    {
      icon: <GavelRoundedIcon />,
      label: "Privacy Policy",
      description: "How we handle your data",
      action: () => window.open("https://evzone.com/privacy", "_blank")
    },
    {
      icon: <UpdateRoundedIcon />,
      label: "What's New",
      description: "Latest updates and features",
      action: () => window.open("https://evzone.com/updates", "_blank")
    }
  ];

  return (
    <ScreenScaffold>
      <SectionHeader
        title="About"
        subtitle="EVzone Rider App"
        leadingAction={
          <IconButton
            size="small"
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: uiTokens.radius.xl,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.9)",
              border: (t) =>
                t.palette.mode === "light"
                  ? "1px solid rgba(209,213,219,0.9)"
                  : "1px solid rgba(51,65,85,0.9)"
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        }
      />

      <Box sx={{ mt: uiTokens.spacing.smPlus }}>

          {/* App Info */}
          <Box
            sx={{
              mb: uiTokens.spacing.xl,
              textAlign: "center",
              py: uiTokens.spacing.xxl,
              background: (t) =>
                t.palette.mode === "light"
                  ? "linear-gradient(135deg, #03CD8C 0%, #00BFA5 100%)"
                  : "linear-gradient(135deg, #028A5E 0%, #016F4F 100%)",
              color: "#FFFFFF",
              boxShadow: "0 8px 32px rgba(3, 205, 140, 0.2)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Background Pattern */}
            <Box
              sx={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.1)"
              }}
            />
            
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                mb: 0.5,
                letterSpacing: "-0.02em"
              }}
            >
              EVzone Rider
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: 12,
                opacity: 0.9,
                fontWeight: 500
              }}
            >
              Version 1.0.0
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                px: 3,
                fontSize: 13,
                opacity: 0.95,
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
                    onClick={item.action}
                    sx={{
                      borderRadius: uiTokens.radius.sm,
                      mb: uiTokens.spacing.smPlus,
                      py: uiTokens.spacing.mdPlus,
                      px: uiTokens.spacing.mdPlus,
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
    </ScreenScaffold>
  );
}

