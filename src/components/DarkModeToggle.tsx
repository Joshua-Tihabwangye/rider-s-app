import React from "react";
import { IconButton } from "@mui/material";
import { useThemeMode } from "../contexts/ThemeContext";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

export default function DarkModeToggle(): JSX.Element {
  const { mode, toggleMode } = useThemeMode();

  return (
    <IconButton
      size="small"
      onClick={toggleMode}
      sx={{
        position: "fixed",
        bottom: { xs: "calc(80px + env(safe-area-inset-bottom))", sm: 90 },
        right: { xs: 16, sm: 24 },
        zIndex: 2100, // Above navigation and modals
        bgcolor: (t) =>
          t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
        border: (t) =>
          t.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(30,64,175,0.7)",
        boxShadow: 3,
        width: 40,
        height: 40,
        "&:hover": {
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.98)"
        }
      }}
      aria-label="Toggle light/dark mode"
    >
      {mode === "light" ? (
        <DarkModeRoundedIcon sx={{ fontSize: 20 }} />
      ) : (
        <LightModeRoundedIcon sx={{ fontSize: 20 }} />
      )}
    </IconButton>
  );
}

