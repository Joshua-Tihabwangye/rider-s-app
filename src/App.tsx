import { GlobalThemeProvider } from "./contexts/ThemeContext";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes";

export default function App(): React.JSX.Element {
	return (
		<GlobalThemeProvider>
			<BrowserRouter>
				<AppRouter />
			</BrowserRouter>
		</GlobalThemeProvider>
	);
}
