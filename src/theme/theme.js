import { createTheme } from "@mui/material/styles";
import componentOverrides from "./componentOverrides";

/**
 * Datrix Consulting MUI theme.
 * Phase 1 preserves the existing product color direction
 * (#E2403C accent, #000418 dark) until an approved Datrix palette exists.
 */

const baseTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#E2403C",
      dark: "#C62828",
      light: "#EF9A98",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#000418",
      dark: "#000000",
      light: "#415D65",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
      subtle: "#F9FAFB",
      soft: "#FEF5F5",
    },
    text: {
      primary: "#000000",
      secondary: "#666666",
      muted: "#415D65",
    },
    divider: "#ECEFF3",
    error: {
      main: "#E2403C",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#ED6C02",
      contrastText: "#FFFFFF",
    },
    info: {
      main: "#0288D1",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#2E7D32",
      contrastText: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, color: "#000418" },
    h2: { fontWeight: 700, color: "#000418" },
    h3: { fontWeight: 600, color: "#000418" },
    h4: { fontWeight: 600, color: "#000418" },
    h5: { fontWeight: 600, color: "#000418" },
    h6: { fontWeight: 600, color: "#000418" },
    button: {
      fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      textTransform: "none",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      color: "#666666",
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    "none",
    "0px 2px 4px rgba(12, 17, 24, 0.11)",
    "0px 20px 15px rgba(0, 0, 0, 0.05)",
    "0px 8px 40px rgba(0, 0, 0, 0.05)",
    "0px 8px 40px rgba(0, 0, 0, 0.05)",
    "0px 8px 40px rgba(0, 0, 0, 0.05)",
    "0px 8px 40px rgba(0, 0, 0, 0.05)",
    "0px 8px 40px rgba(0, 0, 0, 0.05)",
    "0px 8px 40px rgba(0, 0, 0, 0.05)",
    "0px 8px 40px rgba(0, 0, 0, 0.05)",
    "0px 8px 40px rgba(0, 0, 0, 0.05)",
    "0px 8px 40px rgba(0, 0, 0, 0.05)",
    "0px 8px 40px rgba(0, 0, 0, 0.05)",
    "0px 8px 40px rgba(0, 0, 0, 0.05)",
    "0px 8px 40px rgba(0, 0, 0, 0.05)",
    "0px 8px 40px rgba(0, 0, 0, 0.05)",
    "0px 8px 40px rgba(0, 0, 0, 0.05)",
    "0px 8px 40px rgba(0, 0, 0, 0.05)",
    "0px 8px 40px rgba(0, 0, 0, 0.05)",
    "0px 8px 40px rgba(0, 0, 0, 0.05)",
    "0px 8px 40px rgba(0, 0, 0, 0.05)",
    "0px 8px 40px rgba(0, 0, 0, 0.05)",
    "0px 8px 40px rgba(0, 0, 0, 0.05)",
    "0px 8px 40px rgba(0, 0, 0, 0.05)",
    "0px 8px 40px rgba(0, 0, 0, 0.05)",
  ],
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  custom: {
    formControlHeight: 48,
    containerWidths: {
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1400,
    },
  },
});

const theme = createTheme(baseTheme, {
  components: componentOverrides(baseTheme),
});

export default theme;
