import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

type AuthFormFieldProps = Omit<TextFieldProps, "error" | "helperText" | "size" | "fullWidth"> & {
  errorText?: string;
};

export default function AuthFormField({ errorText, sx, ...rest }: AuthFormFieldProps): React.JSX.Element {
  return (
    <TextField
      fullWidth
      size="small"
      error={!!errorText}
      helperText={errorText || undefined}
      sx={{
        "& .MuiInputBase-input::placeholder": {
          color: "rgba(107,114,128,0.88)",
          opacity: 1
        },
        "& .MuiOutlinedInput-root": {
          minHeight: 44,
          borderRadius: "16px",
          bgcolor: "rgba(255,255,255,0.96)",
          boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
          "& fieldset": {
            borderColor: errorText
              ? "var(--evz-danger)"
              : "rgba(3,205,140,0.18)"
          },
          "&:hover fieldset": {
            borderColor: errorText
              ? "var(--evz-danger)"
              : "rgba(3,205,140,0.32)"
          },
          "&.Mui-focused fieldset": {
            borderColor: errorText
              ? "var(--evz-danger)"
              : "var(--evz-brand-green)"
          }
        },
        "& .MuiInputBase-input": {
          py: 1.05,
          fontSize: 14
        },
        "& .MuiInputAdornment-root": {
          color: "rgba(3,205,140,0.96)"
        },
        "& .MuiFormHelperText-root": {
          fontSize: 10.5,
          mt: 0.45,
          ml: 0.85
        },
        ...sx
      } as TextFieldProps["sx"]}
      {...rest}
    />
  );
}
