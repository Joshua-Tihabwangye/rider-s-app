import type { SxProps, Theme } from "@mui/material";

export const ambulanceCompactTypographySx: SxProps<Theme> = {
  "& .MuiTypography-root": {
    fontSize: "12.2px !important",
    lineHeight: 1.35
  },
  "& .MuiInputBase-input": {
    fontSize: "12.4px !important"
  },
  "& .MuiInputBase-input::placeholder": {
    fontSize: "12.4px !important",
    opacity: 1
  },
  "& .MuiFormLabel-root": {
    fontSize: "11.8px !important"
  },
  "& .MuiFormHelperText-root": {
    fontSize: "10.8px !important"
  },
  "& .MuiChip-label": {
    fontSize: "11.8px !important"
  },
  "& .MuiButton-root": {
    fontSize: "12.8px !important"
  },
  "& .MuiMenuItem-root": {
    fontSize: "12.2px !important"
  }
};
