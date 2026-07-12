import React from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";

/**
 * Outlined phone shell for intl-tel-input.
 * Matches AppTextField vertical rhythm so phone rows align with sibling fields.
 * Parent owns intl-tel-input init/destroy on the forwarded input ref.
 */
const AppPhoneField = React.forwardRef(function AppPhoneField(
  {
    id,
    label = "Phone Number *",
    error = false,
    helperText = " ",
    helperTextId,
    disabled = false,
    className = "",
    inputProps = {},
    sx,
    ...rest
  },
  ref
) {
  const {
    className: inputClassName = "",
    style: inputStyle,
    placeholder,
    ...otherInputProps
  } = inputProps;

  const resolvedHelperId = helperTextId || (id ? `${id}-helper-text` : undefined);

  return (
    <FormControl
      fullWidth
      variant="outlined"
      error={Boolean(error)}
      disabled={disabled}
      className={`phone-group phone-group--mui ${className}`.trim()}
      sx={sx}
    >
      <InputLabel
        htmlFor={id}
        shrink
        sx={{
          bgcolor: "background.paper",
          px: 0.5,
          maxWidth: "calc(100% - 24px)",
        }}
      >
        {label}
      </InputLabel>
      <Box
        className="app-phone-field__control"
        sx={{
          display: "flex",
          alignItems: "stretch",
          minHeight: 56,
          height: 56,
          borderRadius: 1,
          border: "1px solid",
          borderColor: error ? "error.main" : "rgba(0, 0, 0, 0.23)",
          bgcolor: "background.paper",
          overflow: "hidden",
          boxSizing: "border-box",
          "&:hover": {
            borderColor: error ? "error.main" : "text.primary",
          },
          "&:focus-within": {
            borderColor: error ? "error.main" : "primary.main",
            borderWidth: 2,
          },
          "& .iti": {
            width: "100% !important",
            display: "flex !important",
            alignItems: "stretch",
            gap: "0 !important",
            height: "100%",
          },
          "& .iti__flag-container": {
            position: "relative !important",
            zIndex: 2,
            height: "100%",
            "&::after": {
              content: '""',
              position: "absolute",
              right: 0,
              top: "20%",
              bottom: "20%",
              width: "1px",
              bgcolor: "divider",
            },
          },
          "& .iti__selected-flag, & .iti__country-container button, & .iti__selected-country, & .iti__selected-country-primary": {
            height: "100% !important",
            minHeight: "100% !important",
            border: "none !important",
            borderRadius: "0 !important",
            backgroundImage: "none !important",
            backgroundColor: "transparent !important",
            boxShadow: "none !important",
            paddingLeft: "12px !important",
            paddingRight: "10px !important",
            display: "flex !important",
            alignItems: "center",
          },
          "& .iti__selected-dial-code": {
            marginLeft: "6px",
            color: "text.primary",
            fontSize: "1rem",
          },
          "& input, & input.form-control, & input[type='tel']": {
            width: "100% !important",
            flex: 1,
            height: "100% !important",
            minHeight: "100% !important",
            border: "none !important",
            outline: "none !important",
            boxShadow: "none !important",
            borderRadius: "0 !important",
            padding: "0 14px 0 12px !important",
            fontFamily: "inherit",
            fontSize: "1rem",
            lineHeight: 1.4375,
            bgcolor: "transparent !important",
            boxSizing: "border-box",
          },
          "& input::placeholder": {
            color: "transparent !important",
            opacity: "0 !important",
          },
        }}
      >
        <input
          id={id}
          ref={ref}
          type="tel"
          disabled={disabled}
          className={inputClassName}
          placeholder={placeholder ?? ""}
          aria-describedby={resolvedHelperId}
          style={inputStyle}
          {...otherInputProps}
          {...rest}
        />
      </Box>
      <FormHelperText id={resolvedHelperId}>{helperText || " "}</FormHelperText>
    </FormControl>
  );
});

export default AppPhoneField;
