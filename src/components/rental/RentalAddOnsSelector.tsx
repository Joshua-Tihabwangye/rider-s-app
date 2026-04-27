import React from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import type { RentalAddOnSelection } from "../../store/types";
import { formatUgx } from "../../features/rental/booking";
import { uiTokens } from "../../design/tokens";

interface RentalAddOnsSelectorProps {
  addOns: RentalAddOnSelection[];
  onToggleAddOn: (addOnId: string) => void;
  onQuantityChange: (addOnId: string, quantity: number) => void;
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
  onToggleAddOn,
  onQuantityChange
}: RentalAddOnsSelectorProps): React.JSX.Element {
  if (addOns.length === 0) {
    return (
      <Typography variant="caption" sx={{ fontSize: 11, color: (t) => t.palette.text.secondary }}>
        No add-ons configured for this trip purpose.
      </Typography>
    );
  }

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
              <Box sx={{ minWidth: 0, width: "100%" }}>
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

                {addOn.selected && (
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.4 }}>
                    <Typography variant="caption" sx={{ fontSize: 10.6, color: (t) => t.palette.text.secondary }}>
                      Quantity
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        onQuantityChange(addOn.id, Math.max(1, Math.round(addOn.quantity) - 1))
                      }
                      sx={{ width: 22, height: 22 }}
                    >
                      <RemoveRoundedIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                    <Typography variant="caption" sx={{ minWidth: 20, textAlign: "center", fontWeight: 700 }}>
                      {Math.max(1, Math.round(addOn.quantity || 1))}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        onQuantityChange(addOn.id, Math.max(1, Math.round(addOn.quantity) + 1))
                      }
                      sx={{ width: 22, height: 22 }}
                    >
                      <AddRoundedIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Stack>
                )}
              </Box>
            }
          />
        </Box>
      ))}
    </Stack>
  );
}
