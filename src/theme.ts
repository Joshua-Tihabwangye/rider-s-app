import { createTheme, Theme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

export const radiusScale = {
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5,
  xxl: 5,
  pill: 5
} as const;

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
    primary: { main: mode === "light" ? "#03cd8c" : "#10b981" },
    secondary: { main: mode === "light" ? "#f77f00" : "#f97316" },
    background: {
      default: mode === "light" ? "#f3f4f6" : "#020617",
      paper: mode === "light" ? "#ffffff" : "#0f172a"
    },
    text: {
      primary: mode === "light" ? "#0f172a" : "#f9fafb",
      secondary: mode === "light" ? "#6b7280" : "#a6a6a6"
    },
    divider: mode === "light" ? "rgba(209,213,219,0.9)" : "rgba(51,65,85,0.9)"
  },
  shape: { borderRadius: radiusScale.md },
  typography: {
    fontFamily:
      '"Poppins", "Manrope", "Avenir Next", "Segoe UI", sans-serif',
    button: { textTransform: "none", fontWeight: 600 },
    h6: { fontWeight: 600 }
  }
});

export const createEvzoneTheme = (mode: PaletteMode = "light"): Theme =>
  createTheme({
    ...getDesignTokens(mode),
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "var(--evz-radius-lg)"
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: "var(--evz-radius-lg)"
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "var(--evz-radius-md)"
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: "var(--evz-radius-pill)"
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiInputBase-root": {
              borderRadius: "var(--evz-radius-md)"
            }
          }
        }
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: "var(--evz-radius-md)"
          }
        }
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: "var(--evz-radius-md)"
          }
        }
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            borderRadius: "var(--evz-radius-xl)"
          }
        }
      },
      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            borderRadius: "var(--evz-radius-lg)"
          }
        }
      }
    }
  });
