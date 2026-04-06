import { createContext, useContext, useState, useMemo, useEffect, ReactNode } from "react";
import { ThemeProvider, Theme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { createEvzoneTheme } from "../theme";

type PaletteMode = "light" | "dark";

interface ThemeContextValue {
  mode: PaletteMode;
  toggleMode: () => void;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface GlobalThemeProviderProps {
  children: ReactNode;
}

export function GlobalThemeProvider({ children }: GlobalThemeProviderProps): React.JSX.Element {
  // Load mode from localStorage or default to "light"
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem("themeMode");
    return (savedMode === "dark" ? "dark" : "light") as PaletteMode;
  });

  // Save mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
    const root = document.getElementById("root");

    document.documentElement.setAttribute("data-theme", mode);
    document.body.setAttribute("data-theme", mode);
    if (root) {
      root.setAttribute("data-theme", mode);
    }

    const isDark = mode === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    document.body.classList.toggle("dark", isDark);
    if (root) {
      root.classList.toggle("dark", isDark);
    }

    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  const theme = useMemo(() => createEvzoneTheme(mode), [mode]);

  const toggleMode = (): void => {
    setMode((prev: PaletteMode) => (prev === "light" ? "dark" : "light"));
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
