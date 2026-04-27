import React from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import type { RentalCustomEstimate } from "../../store/types";
import { formatUgx } from "../../features/rental/booking";
import { uiTokens } from "../../design/tokens";

interface RentalEstimateCardProps {
  estimate: RentalCustomEstimate;
}

function Row({
  label,
  value,
  emphasis = false
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}): React.JSX.Element {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={1}>
      <Typography
        variant="caption"
        sx={{ fontSize: 11.5, color: (t) => t.palette.text.secondary }}
      >
        {label}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          fontSize: 11.5,
          fontWeight: emphasis ? 700 : 600,
          color: emphasis ? (t) => t.palette.text.primary : (t) => t.palette.text.secondary
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

export default function RentalEstimateCard({
  estimate
}: RentalEstimateCardProps): React.JSX.Element {
  return (
    <Box
      sx={{
        borderRadius: uiTokens.radius.xl,
        border: "1px solid rgba(249,115,22,0.4)",
        bgcolor: "linear-gradient(140deg, rgba(255,247,237,0.95), rgba(255,255,255,0.98))",
        p: 1.4
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontSize: 13, fontWeight: 700, color: "#C2410C", mb: 0.8 }}
      >
        Estimated pricing
      </Typography>
      <Stack spacing={0.45}>
        <Row label="Base rental estimate" value={formatUgx(estimate.baseRental)} />
        <Row label="Chauffeur fee" value={formatUgx(estimate.chauffeurFee)} />
        <Row label="Add-ons total" value={formatUgx(estimate.addOnsTotal)} />
        <Row label="One-way return fee" value={formatUgx(estimate.oneWayFee)} />
        <Row
          label="Refundable deposit"
          value={formatUgx(estimate.refundableDeposit)}
        />
      </Stack>
      <Divider sx={{ my: 0.8 }} />
      <Row label="Total estimated amount" value={formatUgx(estimate.totalEstimated)} emphasis />
      <Typography
        variant="caption"
        sx={{ mt: 0.7, display: "block", fontSize: 10.7, color: (t) => t.palette.text.secondary }}
      >
        Final pricing may vary slightly based on final vehicle availability and verified trip details.
      </Typography>
    </Box>
  );
}
