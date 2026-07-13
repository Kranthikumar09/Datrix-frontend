import React from "react";
import Chip from "@mui/material/Chip";

const STATUS_COLORS = {
  pending: "warning",
  approved: "success",
  accepted: "success",
  rejected: "error",
  declined: "error",
  processing: "info",
  submitted: "info",
  completed: "success",
};

/**
 * Status chip for application/job lists and details.
 * Preserves original status text; maps known values to MUI colors.
 */
const StatusChip = ({ status, size = "small" }) => {
  const label = status || "Pending";
  const key = String(label).toLowerCase();
  const color = STATUS_COLORS[key] || "default";

  return (
    <Chip
      label={label}
      color={color}
      size={size}
      variant={color === "default" ? "outlined" : "filled"}
      sx={{ fontWeight: 600 }}
    />
  );
};

export default StatusChip;
