import React, { useId, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Accessible MUI file upload shell with a native file input internally.
 * Supports single or multiple files, remove, and validation messaging.
 */
const FileUploadField = ({
  id,
  label,
  helperText,
  error,
  accept,
  multiple = false,
  disabled = false,
  required = false,
  value = null,
  files = null,
  existingFileName,
  onChange,
  onClear,
  inputProps = {},
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const inputRef = useRef(null);

  const selectedFiles = multiple
    ? Array.isArray(files)
      ? files
      : []
    : value
      ? [value]
      : [];

  const handleInputChange = (event) => {
    if (onChange) onChange(event);
  };

  const handleClear = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (inputRef.current) inputRef.current.value = "";
    if (onClear) onClear();
  };

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
        {label}
        {required ? (
          <Typography component="span" color="error.main">
            {" "}
            *
          </Typography>
        ) : null}
      </Typography>

      <Box
        sx={{
          border: "1px dashed",
          borderColor: error ? "error.main" : "divider",
          borderRadius: 2,
          bgcolor: "background.subtle",
          p: 2,
        }}
      >
        <Stack spacing={1.5} sx={{ alignItems: "flex-start" }}>
          <Button
            component="label"
            variant="outlined"
            color={error ? "error" : "primary"}
            startIcon={<CloudUploadIcon />}
            disabled={disabled}
            htmlFor={inputId}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Choose file{multiple ? "s" : ""}
            <input
              ref={inputRef}
              id={inputId}
              type="file"
              hidden
              accept={accept}
              multiple={multiple}
              disabled={disabled}
              onChange={handleInputChange}
              {...inputProps}
            />
          </Button>

          {existingFileName && selectedFiles.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Current: {existingFileName}
            </Typography>
          ) : null}

          {selectedFiles.length > 0 ? (
            <Stack spacing={0.5} sx={{ width: "100%" }}>
              {selectedFiles.map((file) => (
                <Stack
                  key={`${file.name}-${file.size}-${file.lastModified}`}
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center", justifyContent: "space-between" }}
                >
                  <Typography variant="body2" color="success.main" noWrap title={file.name}>
                    {file.name}
                  </Typography>
                  {onClear && !multiple ? (
                    <IconButton
                      size="small"
                      aria-label={`Remove ${file.name}`}
                      onClick={handleClear}
                      disabled={disabled}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  ) : null}
                </Stack>
              ))}
              {onClear && multiple ? (
                <Button size="small" onClick={handleClear} disabled={disabled} sx={{ alignSelf: "flex-start" }}>
                  Clear selection
                </Button>
              ) : null}
            </Stack>
          ) : null}
        </Stack>
      </Box>

      {(error || helperText) && (
        <FormHelperText error={Boolean(error)} sx={{ mx: 0, mt: 0.75 }}>
          {typeof error === "string" ? error : helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default FileUploadField;
