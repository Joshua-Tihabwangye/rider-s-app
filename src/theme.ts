import { createTheme, Theme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

export interface DesignTokens {
  palette: {
    mode: PaletteMode;
    primary: { main: string };
    secondary: { main: string };
    background: {
      default: string;
      paper: string;
    };
    text: {
      primary: string;
      secondary: string;
    };
    divider: string;
  };
  shape: { borderRadius: number };
  typography: {
    fontFamily: string;
    button: { textTransform: string; fontWeight: number };
    h6: { fontWeight: number };
  };
}

export const getDesignTokens = (mode: PaletteMode = "light"): DesignTokens => ({
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

export const createEvzoneTheme = (mode: PaletteMode = "light"): Theme =>
  createTheme(getDesignTokens(mode));

