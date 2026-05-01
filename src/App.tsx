import { GlobalThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AppDataProvider } from "./contexts/AppDataContext";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes";
import MobileShell from "./components/MobileShell";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App(): React.JSX.Element {
	return (
		<ErrorBoundary>
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
		</ErrorBoundary>
	);
}
