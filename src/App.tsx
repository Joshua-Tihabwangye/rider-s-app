import { GlobalThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AppDataProvider } from "./contexts/AppDataContext";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes";
import MobileShell from "./components/MobileShell";

export default function App(): React.JSX.Element {
	return (
		<GlobalThemeProvider>
			<BrowserRouter>
				<AuthProvider>
					<AppDataProvider>
						<MobileShell>
							<AppRouter />
						</MobileShell>
					</AppDataProvider>
				</AuthProvider>
			</BrowserRouter>
		</GlobalThemeProvider>
	);
}
