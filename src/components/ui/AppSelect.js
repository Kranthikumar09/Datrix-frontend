import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";

const AppSelect = ({
  label,
  value,
  onChange,
  children,
  error,
  helperText,
  fullWidth = true,
  id,
  ...props
}) => {
  const labelId = id ? `${id}-label` : undefined;

  return (
    <FormControl fullWidth={fullWidth} error={Boolean(error)}>
      {label ? <InputLabel id={labelId}>{label}</InputLabel> : null}
      <Select
        labelId={labelId}
        id={id}
        label={label}
        value={value}
        onChange={onChange}
        {...props}
      >
        {children}
      </Select>
      {(helperText || (error && typeof error === "string")) && (
        <FormHelperText>{helperText || error}</FormHelperText>
      )}
    </FormControl>
  );
};

export default AppSelect;
