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
        "& .MuiOutlinedInput-root": {
          borderRadius: "var(--evz-radius-md)",
          bgcolor: "var(--evz-surface-card)",
          "& fieldset": {
            borderColor: errorText
              ? "var(--evz-danger)"
              : undefined
          }
        },
        "& .MuiFormHelperText-root": {
          fontSize: 11,
          mt: 0.5
        },
        ...sx
      } as TextFieldProps["sx"]}
      {...rest}
    />
  );
}
