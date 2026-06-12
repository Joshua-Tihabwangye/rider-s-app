import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { GlobalThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AppDataProvider } from "./contexts/AppDataContext";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import AppRouter from "./routes";
import MobileShell from "./components/MobileShell";
import { ErrorBoundary } from "./components/ErrorBoundary";

function AppDataGate({ children }: { children: ReactNode }): React.JSX.Element {
	const { loading, hydrated, isAuthenticated } = useAuth();
	const { pathname } = useLocation();
	const isAuthRoute = pathname.startsWith("/auth");

	if (!hydrated) {
		return (
			<div
				aria-hidden
				style={{
					minHeight: "100vh",
					background: "var(--evz-background, #f3f4f6)"
				}}
			/>
		);
	}

	if (loading || !isAuthenticated || isAuthRoute) {
		return <>{children}</>;
	}

	return <AppDataProvider>{children}</AppDataProvider>;
}

export default function App(): React.JSX.Element {
	return (
		<ErrorBoundary>
			<GlobalThemeProvider>
				<BrowserRouter>
					<AuthProvider>
						<AppDataGate>
							<MobileShell>
								<AppRouter />
							</MobileShell>
						</AppDataGate>
					</AuthProvider>
				</BrowserRouter>
			</GlobalThemeProvider>
		</ErrorBoundary>
	);
}
