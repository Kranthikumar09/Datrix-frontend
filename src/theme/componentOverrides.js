/**
 * Theme component overrides — application-wide MUI styling.
 * Keep visual decisions here instead of scattered one-off sx objects.
 */

const componentOverrides = (theme) => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        margin: 0,
        padding: 0,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      },
      a: {
        textDecoration: "none",
        color: "inherit",
      },
      img: {
        maxWidth: "100%",
      },
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        textTransform: "none",
        fontWeight: 600,
        borderRadius: theme.shape.borderRadius,
        minHeight: theme.custom.formControlHeight,
        paddingLeft: theme.spacing(2.5),
        paddingRight: theme.spacing(2.5),
      },
      containedPrimary: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
        },
      },
      outlinedSecondary: {
        borderWidth: 2,
        borderColor: theme.palette.secondary.main,
        color: theme.palette.secondary.main,
        "&:hover": {
          borderWidth: 2,
          borderColor: theme.palette.secondary.main,
          backgroundColor: "rgba(0, 4, 24, 0.04)",
        },
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: "outlined",
      size: "medium",
      fullWidth: true,
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
        minHeight: theme.custom.formControlHeight,
        backgroundColor: theme.palette.background.paper,
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },
      },
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: {
        fontWeight: 500,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: "none",
      },
      rounded: {
        borderRadius: theme.shape.borderRadius,
      },
    },
  },
  MuiLink: {
    defaultProps: {
      underline: "hover",
    },
  },
  MuiContainer: {
    defaultProps: {
      maxWidth: "lg",
    },
  },
  MuiTooltip: {
    defaultProps: {
      arrow: true,
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
      },
    },
  },
  MuiSnackbar: {
    defaultProps: {
      anchorOrigin: { vertical: "top", horizontal: "right" },
    },
  },
});

export default componentOverrides;
