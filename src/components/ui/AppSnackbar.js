import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const AppSnackbarContext = createContext(null);

export const AppSnackbarProvider = ({ children }) => {
  const [state, setState] = useState({
    open: false,
    message: "",
    severity: "info",
    autoHideDuration: 3000,
  });

  const showSnackbar = useCallback((message, options = {}) => {
    setState({
      open: true,
      message,
      severity: options.severity || "info",
      autoHideDuration: options.autoHideDuration ?? 3000,
    });
  }, []);

  const hideSnackbar = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const api = useMemo(
    () => ({
      showSnackbar,
      hideSnackbar,
      success: (message, options) => showSnackbar(message, { ...options, severity: "success" }),
      error: (message, options) => showSnackbar(message, { ...options, severity: "error" }),
      info: (message, options) => showSnackbar(message, { ...options, severity: "info" }),
      warning: (message, options) => showSnackbar(message, { ...options, severity: "warning" }),
    }),
    [showSnackbar, hideSnackbar]
  );

  return (
    <AppSnackbarContext.Provider value={api}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={state.autoHideDuration}
        onClose={hideSnackbar}
      >
        <Alert
          onClose={hideSnackbar}
          severity={state.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </AppSnackbarContext.Provider>
  );
};

export const useAppSnackbar = () => {
  const ctx = useContext(AppSnackbarContext);
  if (!ctx) {
    throw new Error("useAppSnackbar must be used within AppSnackbarProvider");
  }
  return ctx;
};

/** Standalone controlled snackbar for gradual Toastify migration */
const AppSnackbar = ({
  open,
  message,
  severity = "info",
  autoHideDuration = 3000,
  onClose,
}) => (
  <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={onClose}>
    <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
      {message}
    </Alert>
  </Snackbar>
);

export default AppSnackbar;
