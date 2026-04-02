import React from "react";
import MobileShell from "./MobileShell";

interface ResponsiveShellProps {
  children: React.ReactNode;
}

export default function ResponsiveShell({ children }: ResponsiveShellProps): React.JSX.Element {
  return <MobileShell>{children}</MobileShell>;
}
