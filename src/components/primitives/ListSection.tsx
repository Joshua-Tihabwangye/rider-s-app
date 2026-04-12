import React from "react";
import { Box, BoxProps, SxProps, Theme } from "@mui/material";

interface ListSectionProps extends Omit<BoxProps, "children" | "sx"> {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export default function ListSection({ children, sx, ...rest }: ListSectionProps): React.JSX.Element {
  return (
    <Box
      {...rest}
      sx={[
        {
          display: "flex",
          flexDirection: "column",
          gap: 1
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      {children}
    </Box>
  );
}
