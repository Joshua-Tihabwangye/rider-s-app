import React from "react";

interface ResponsiveShellProps {
	children: React.ReactNode;
}

export default function ResponsiveShell({
	children,
}: ResponsiveShellProps): React.JSX.Element {
	return <>{children}</>;
}
