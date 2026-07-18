import React, { useImperativeHandle, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { DIAL_CODES, findCountryForNumber, getCountryByIso } from "../../constants/dialCodes";

/**
 * MUI phone field with country dial-code select.
 * Imperative ref API (subset of intl-tel-input): getNumber, isValidNumber,
 * getSelectedCountryData, setCountry, setNumber, destroy.
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
    defaultCountry = "in",
    countryIso: countryIsoProp,
    onCountryChange,
    value: valueProp,
    onChange,
    name,
    inputProps = {},
    sx,
    ...rest
  },
  ref
) {
  const {
    className: _ignoredClassName,
    style: _ignoredStyle,
    name: inputName,
    value: inputValue,
    onChange: inputOnChange,
    onBlur,
    required,
    maxLength = 15,
    minLength = 6,
    autoComplete = "tel-national",
    inputMode = "numeric",
    pattern,
    "aria-invalid": ariaInvalid,
    ...otherInputProps
  } = inputProps;

  const isCountryControlled = countryIsoProp !== undefined;
  const [internalCountry, setInternalCountry] = useState(
    () => (getCountryByIso(defaultCountry) ? defaultCountry : "in")
  );
  const countryIso = isCountryControlled ? countryIsoProp : internalCountry;
  const country = getCountryByIso(countryIso) || getCountryByIso("in");

  const isValueControlled = valueProp !== undefined || inputValue !== undefined;
  const [internalValue, setInternalValue] = useState("");
  const nationalValue = isValueControlled
    ? String(valueProp ?? inputValue ?? "")
    : internalValue;

  const resolvedHelperId = helperTextId || (id ? `${id}-helper-text` : undefined);
  const fieldName = name || inputName;

  const countryOptions = useMemo(
    () =>
      DIAL_CODES.map((item) => ({
        ...item,
        label: `${item.name} (+${item.dialCode})`,
      })),
    []
  );

  const setCountryIso = (nextIso) => {
    const next = getCountryByIso(nextIso);
    if (!next) return;
    if (!isCountryControlled) setInternalCountry(next.iso2);
    onCountryChange?.(next);
  };

  const emitChange = (nextNational, eventTarget) => {
    if (!isValueControlled) setInternalValue(nextNational);
    if (typeof inputOnChange === "function") {
      inputOnChange({
        target: {
          name: fieldName,
          value: nextNational,
          ...(eventTarget || {}),
        },
      });
      return;
    }
    if (typeof onChange === "function") {
      onChange({
        target: {
          name: fieldName,
          value: nextNational,
        },
      });
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      getNumber: () => {
        const digits = String(nationalValue).replace(/\D/g, "");
        return digits ? `+${country.dialCode}${digits}` : "";
      },
      isValidNumber: () => {
        const digits = String(nationalValue).replace(/\D/g, "");
        return /^\d{6,15}$/.test(digits);
      },
      getSelectedCountryData: () => ({
        iso2: country.iso2,
        dialCode: country.dialCode,
        name: country.name,
      }),
      setCountry: (iso2) => setCountryIso(iso2),
      setNumber: (raw = "") => {
        const value = String(raw || "").trim();
        if (!value) {
          emitChange("");
          return;
        }
        if (value.startsWith("+") || /^\d{8,}$/.test(value.replace(/\D/g, ""))) {
          const match = findCountryForNumber(value);
          if (match) {
            setCountryIso(match.iso2);
            const digits = value.replace(/\D/g, "");
            emitChange(digits.slice(match.dialCode.length));
            return;
          }
        }
        emitChange(value.replace(/\D/g, ""));
      },
      destroy: () => {},
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nationalValue, country.iso2, country.dialCode, country.name, fieldName]
  );

  return (
    <FormControl
      fullWidth
      variant="outlined"
      error={Boolean(error)}
      disabled={disabled}
      className={className}
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
        sx={{
          display: "flex",
          alignItems: "stretch",
          minHeight: 56,
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
        }}
      >
        <Select
          value={country.iso2}
          onChange={(event) => setCountryIso(event.target.value)}
          disabled={disabled}
          variant="standard"
          disableUnderline
          aria-label="Country calling code"
          MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
          sx={{
            minWidth: 108,
            height: 56,
            px: 1.5,
            borderRight: "1px solid",
            borderColor: "divider",
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              py: 0,
              pr: "28px !important",
              fontWeight: 600,
            },
          }}
          renderValue={() => `+${country.dialCode}`}
        >
          {countryOptions.map((item) => (
            <MenuItem key={item.iso2} value={item.iso2}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
        <TextField
          id={id}
          name={fieldName}
          value={nationalValue}
          onChange={(event) => {
            const next = event.target.value.replace(/\D/g, "").slice(0, Number(maxLength) || 15);
            emitChange(next, event.target);
          }}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          type="tel"
          variant="standard"
          fullWidth
          inputProps={{
            inputMode,
            autoComplete,
            pattern,
            maxLength,
            minLength,
            "aria-describedby": resolvedHelperId,
            "aria-invalid": ariaInvalid,
            ...otherInputProps,
            ...rest,
          }}
          InputProps={{
            disableUnderline: true,
            sx: {
              height: 56,
              px: 1.5,
              "& input": {
                py: 0,
                height: 56,
                boxSizing: "border-box",
              },
            },
          }}
        />
      </Box>
      <FormHelperText id={resolvedHelperId}>{helperText || " "}</FormHelperText>
    </FormControl>
  );
});

export default AppPhoneField;
