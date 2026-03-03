import { Box } from "@mui/material";
import { GlobalThemeProvider } from "./contexts/ThemeContext";
import AppRouter from "./routes";

/* ─── Green top bar — blends with header/title area ──── */
function TopAppBar() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 16,
        background: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
        zIndex: 10000,
        display: "none",
        "@media (min-width: 481px)": {
          display: "block",
        },
      }}
    />
  );
}

/* ─── Green bottom bar — blends with navigation area ─── */
function BottomAppBar() {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 16,
        background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
        zIndex: 10000,
        display: "none",
        "@media (min-width: 481px)": {
          display: "block",
        },
      }}
    />
  );
}

export default function App(): React.JSX.Element {
  return (
    <GlobalThemeProvider>
      <TopAppBar />
      <AppRouter />
      <BottomAppBar />
    </GlobalThemeProvider>
  );
}
