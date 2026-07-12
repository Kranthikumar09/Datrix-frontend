import React from "react";
import TextField from "@mui/material/TextField";

const AppTextField = ({ label, error, helperText, ...props }) => (
  <TextField
    label={label}
    error={Boolean(error)}
    helperText={helperText || (error && typeof error === "string" ? error : undefined)}
    {...props}
  />
);

export default AppTextField;
