import React from "react";
import { IconButton } from "@mui/material";
import { useThemeMode } from "../contexts/ThemeContext";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

export default function DarkModeToggle() {
  const { mode, toggleMode } = useThemeMode();

  return (
    <IconButton
      size="small"
      onClick={toggleMode}
      sx={{
        position: "fixed",
        top: 10,
        right: 10,
        zIndex: 50,
        bgcolor: (t) =>
          t.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.95)",
        border: (t) =>
          t.palette.mode === "light"
            ? "1px solid rgba(209,213,219,0.9)"
            : "1px solid rgba(30,64,175,0.7)",
        boxShadow: 3,
        "&:hover": {
          bgcolor: (t) =>
            t.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.98)"
        }
      }}
      aria-label="Toggle light/dark mode"
    >
      {mode === "light" ? (
        <DarkModeRoundedIcon sx={{ fontSize: 18 }} />
      ) : (
        <LightModeRoundedIcon sx={{ fontSize: 18 }} />
      )}
    </IconButton>
  );
}

