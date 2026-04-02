import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Tabs, Tab, Paper, useMediaQuery, useTheme } from "@mui/material";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import MobileShell from "./MobileShell";

interface NavTab {
	value: string;
	label: string;
	icon: React.ReactElement;
	route: string;
}

const NAV_TABS: NavTab[] = [
	{
		value: "home",
		label: "Home",
		icon: <HomeOutlinedIcon />,
		route: "/home",
	},
	{
		value: "rides",
		label: "Rides",
		icon: <DirectionsCarFilledRoundedIcon />,
		route: "/rides",
	},
	{
		value: "deliveries",
		label: "Deliveries",
		icon: <LocalShippingRoundedIcon />,
		route: "/deliveries",
	},
	{
		value: "wallet",
		label: "Wallet",
		icon: <AccountBalanceWalletRoundedIcon />,
		route: "/wallet",
	},
	{
		value: "more",
		label: "More",
		icon: <MoreHorizRoundedIcon />,
		route: "/more",
	},
];

interface ResponsiveShellProps {
	children: React.ReactNode;
}

function DesktopTabView({
	children,
	navValue,
	onTabChange,
}: {
	children: React.ReactNode;
	navValue: string;
	onTabChange: (value: string) => void;
}): React.JSX.Element {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				height: "100vh",
				width: "100%",
				bgcolor: (t) => t.palette.background.default,
				backgroundImage: (t) =>
					t.palette.mode === "light"
						? "radial-gradient(circle at top, #D1FAE5 0, #F3F4F6 55%, #F3F4F6 100%)"
						: "radial-gradient(circle at top, #064E3B 0, #020617 60%, #020617 100%)",
			}}
		>
			{/* Top Tab Navigation for Desktop */}
			<Paper
				elevation={0}
				sx={{
					borderRadius: 0,
					bgcolor: (t) =>
						t.palette.mode === "light"
							? "rgba(255,255,255,0.95)"
							: "rgba(15,23,42,0.95)",
					backdropFilter: "blur(22px)",
					borderBottom: (t) =>
						t.palette.mode === "light"
							? "1px solid rgba(229,231,235,1)"
							: "1px solid rgba(30,64,175,0.6)",
					boxShadow: "0 4px 24px rgba(15,23,42,0.12)",
					position: "sticky",
					top: 0,
					zIndex: 100,
				}}
			>
				<Box sx={{ px: 3, py: 1 }}>
					<Tabs
						value={navValue}
						onChange={(
							_e: React.SyntheticEvent,
							newValue: string,
						) => onTabChange(newValue)}
						variant="standard"
						sx={{
							"& .MuiTabs-indicator": {
								height: 3,
								backgroundColor: (t) => t.palette.primary.main,
							},
							"& .MuiTab-root": {
								textTransform: "none",
								fontSize: 15,
								fontWeight: 500,
								color: (t) => t.palette.text.secondary,
								gap: 1,
								"&.Mui-selected": {
									color: (t) => t.palette.primary.main,
								},
							},
						}}
					>
						{NAV_TABS.map((tab) => (
							<Tab
								key={tab.value}
								value={tab.value}
								label={tab.label}
								icon={tab.icon}
								iconPosition="start"
							/>
						))}
					</Tabs>
				</Box>
			</Paper>

			{/* Content Area */}
			<Box
				sx={{
					flex: 1,
					overflowY: "auto",
					overflowX: "hidden",
					WebkitOverflowScrolling: "touch",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Box sx={{ flex: 1 }}>{children}</Box>
			</Box>
		</Box>
	);
}

export default function ResponsiveShell({
	children,
}: ResponsiveShellProps): React.JSX.Element {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const location = useLocation();
	const navigate = useNavigate();
	const [navValue, setNavValue] = useState<string>("home");

	// Determine active tab based on current route
	useEffect(() => {
		const path = location.pathname;
		let currentTab = "home";

		if (
			path === "/" ||
			path === "/home" ||
			path === "/rides/booking/confirmation"
		) {
			currentTab = "home";
		} else if (path.startsWith("/rides")) {
			currentTab = "rides";
		} else if (path.startsWith("/deliveries")) {
			currentTab = "deliveries";
		} else if (path.startsWith("/wallet")) {
			currentTab = "wallet";
		} else if (
			path.startsWith("/rental") ||
			path.startsWith("/tours") ||
			path.startsWith("/ambulance") ||
			path.startsWith("/more") ||
			path.startsWith("/history") ||
			path.startsWith("/school-handoff") ||
			path.startsWith("/help") ||
			path.startsWith("/about") ||
			path.startsWith("/settings") ||
			path.startsWith("/school")
		) {
			currentTab = "more";
		}

		setNavValue(currentTab);
	}, [location.pathname]);

	const handleTabChange = (newValue: string): void => {
		setNavValue(newValue);
		const tab = NAV_TABS.find((t) => t.value === newValue);
		if (tab && tab.route) {
			navigate(tab.route);
		}
	};

	// Show mobile view on small screens, desktop tab view on larger screens
	if (isMobile) {
		return <MobileShell>{children}</MobileShell>;
	}

	return (
		<DesktopTabView navValue={navValue} onTabChange={handleTabChange}>
			{children}
		</DesktopTabView>
	);
}
