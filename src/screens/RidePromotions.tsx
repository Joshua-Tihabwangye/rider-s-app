import React from "react";
import { Typography, Box } from "@mui/material";
import ScreenScaffold from "../components/ScreenScaffold";
import PageHeader from "../components/PageHeader";

export default function RidePromotions(): React.JSX.Element {
  return (
    <ScreenScaffold
      header={<PageHeader title="Ride Promotions" subtitle="Special offers and discounts" />}
    >
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          Active ride promotions and referral bonuses will appear here.
        </Typography>
      </Box>
    </ScreenScaffold>
  );
}
