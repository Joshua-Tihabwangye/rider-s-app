import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from "react";
import { ThemeProvider, createTheme, Theme, PaletteMode } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { getDesignTokens } from "../theme";

interface ThemeContextValue {
  mode: PaletteMode;
  toggleMode: () => void;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface GlobalThemeProviderProps {
  children: ReactNode;
}

export function GlobalThemeProvider({ children }: GlobalThemeProviderProps): JSX.Element {
  // Load mode from localStorage or default to "light"
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem("themeMode");
    return (savedMode === "dark" ? "dark" : "light") as PaletteMode;
  });

  // Save mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const toggleMode = (): void => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value: ThemeContextValue = {
    mode,
    toggleMode,
    theme
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeMode(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within GlobalThemeProvider");
  }
  return context;
}

