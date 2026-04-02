import { GlobalThemeProvider } from "./contexts/ThemeContext";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes";
import MobileShell from "./components/MobileShell";

export default function App(): React.JSX.Element {
	return (
		<GlobalThemeProvider>
			<BrowserRouter>
				<MobileShell>
					<AppRouter />
				</MobileShell>
			</BrowserRouter>
		</GlobalThemeProvider>
	);
}
