import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import AppButton from "./AppButton";

const ErrorState = ({
  title = "Something went wrong",
  message = "Please try again.",
  onRetry,
  retryLabel = "Try again",
}) => (
  <Box sx={{ py: 2 }}>
    <Alert
      severity="error"
      action={
        onRetry ? (
          <AppButton color="inherit" size="small" onClick={onRetry}>
            {retryLabel}
          </AppButton>
        ) : null
      }
    >
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  </Box>
);

export default ErrorState;
