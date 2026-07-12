import React from "react";
import Button from "@mui/material/Button";

/**
 * Shared application button. Prefer variants over one-off sx colors.
 * variant="contained" ≈ legacy .color-btn
 * variant="outlined" color="secondary" ≈ legacy .border-btn
 */
const AppButton = ({ children, variant = "contained", color = "primary", ...props }) => (
  <Button variant={variant} color={color} {...props}>
    {children}
  </Button>
);

export default AppButton;
