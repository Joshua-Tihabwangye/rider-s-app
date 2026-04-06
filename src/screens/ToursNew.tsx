import React from "react";
import { Typography, Box } from "@mui/material";
import ScreenScaffold from "../components/ScreenScaffold";
import PageHeader from "../components/PageHeader";

export default function ToursNew(): React.JSX.Element {
  return (
    <ScreenScaffold
      header={<PageHeader title="Create New Tour" subtitle="Build your custom EV experience" />}
    >
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          Custom tour builder and charter request flow will appear here.
        </Typography>
      </Box>
    </ScreenScaffold>
  );
}
