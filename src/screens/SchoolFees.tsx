import React from "react";
import { Typography, Box } from "@mui/material";
import ScreenScaffold from "../components/ScreenScaffold";
import PageHeader from "../components/PageHeader";

export default function SchoolFees(): React.JSX.Element {
  return (
    <ScreenScaffold
      header={<PageHeader title="School Bus Fees" subtitle="Manage student transport payments" />}
    >
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          School bus fees management and payment history will appear here.
        </Typography>
      </Box>
    </ScreenScaffold>
  );
}
