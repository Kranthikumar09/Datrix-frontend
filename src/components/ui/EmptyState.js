import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AppButton from "./AppButton";

const EmptyState = ({
  title = "Nothing here yet",
  message = "There are no items to display.",
  actionLabel,
  onAction,
}) => (
  <Box
    sx={{
      textAlign: "center",
      py: 4,
      px: 2,
    }}
  >
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: actionLabel ? 2 : 0 }}>
      {message}
    </Typography>
    {actionLabel && onAction ? (
      <AppButton onClick={onAction}>{actionLabel}</AppButton>
    ) : null}
  </Box>
);

export default EmptyState;
