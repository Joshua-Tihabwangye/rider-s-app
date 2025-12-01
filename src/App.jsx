import React from "react";
import { GlobalThemeProvider } from "./contexts/ThemeContext";
import AppRouter from "./routes";

export default function App() {
  return (
    <GlobalThemeProvider>
      <AppRouter />
    </GlobalThemeProvider>
  );
}
