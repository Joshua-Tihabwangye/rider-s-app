import React from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography
} from "@mui/material";
import type { RentalAddOnSelection } from "../../store/types";
import { formatUgx } from "../../features/rental/booking";
import { uiTokens } from "../../design/tokens";

interface RentalAddOnsSelectorProps {
  addOns: RentalAddOnSelection[];
  onToggleAddOn: (addOnId: string) => void;
}

function getPricingLabel(pricingType: RentalAddOnSelection["pricingType"]): string {
  switch (pricingType) {
    case "per_day":
      return "per day";
    case "per_hour":
      return "per hour";
    case "per_trip":
      return "per trip";
    case "one_time":
    default:
      return "one-time";
  }
}

export default function RentalAddOnsSelector({
  addOns,
  onToggleAddOn
}: RentalAddOnsSelectorProps): React.JSX.Element {
  return (
    <Stack spacing={0.85}>
      {addOns.map((addOn) => (
        <Box
          key={addOn.id}
          sx={{
            borderRadius: uiTokens.radius.lg,
            border: addOn.selected
              ? "1px solid rgba(249,115,22,0.55)"
              : "1px solid rgba(209,213,219,0.85)",
            bgcolor: addOn.selected ? "rgba(249,115,22,0.08)" : "transparent",
            px: 1,
            py: 0.45
          }}
        >
          <FormControlLabel
            sx={{ width: "100%", m: 0 }}
            control={
              <Checkbox
                checked={addOn.selected}
                onChange={() => onToggleAddOn(addOn.id)}
                color="warning"
              />
            }
            label={
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontSize: 12.8, fontWeight: 600 }}>
                  {addOn.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 10.8, color: (t) => t.palette.text.secondary }}
                >
                  {addOn.description}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", fontSize: 10.8, color: "#C2410C", mt: 0.1 }}
                >
                  {formatUgx(addOn.price)} {getPricingLabel(addOn.pricingType)}
                </Typography>
              </Box>
            }
          />
        </Box>
      ))}
    </Stack>
  );
}
