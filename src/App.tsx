import { GlobalThemeProvider } from "./contexts/ThemeContext";
import AppRouter from "./routes";

export default function App(): React.JSX.Element {
  return (
    <GlobalThemeProvider>
      <AppRouter />
    </GlobalThemeProvider>
  );
}

