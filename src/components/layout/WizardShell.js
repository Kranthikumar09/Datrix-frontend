import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import logoImg from "../../assets/images/logo.png";
import { BRAND } from "../../config/brand";

/**
 * Shared shell for multi-step wizard forms (ApplicationForm, JobApplyForm).
 * Preserves wizard-layout CSS class for legacy progress styling when needed.
 */
const WizardShell = ({
  steps = [],
  activeStep = 0,
  title,
  subtitle,
  children,
  maxWidth = "md",
}) => (
  <Box
    component="main"
    className="wizard-layout"
    sx={{
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      minHeight: "100vh",
      bgcolor: "background.subtle",
    }}
  >
    <Box
      sx={{
        width: { xs: "100%", md: 320 },
        flexShrink: 0,
        bgcolor: "secondary.main",
        color: "common.white",
        p: { xs: 3, md: 4 },
      }}
    >
      <Box
        component={RouterLink}
        to="/"
        sx={{ display: "inline-flex", mb: 4, textDecoration: "none" }}
      >
        <Box component="img" src={logoImg} alt={BRAND.name} sx={{ maxWidth: 160, height: "auto" }} />
      </Box>
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        sx={{
          "& .MuiStepLabel-label": { color: "rgba(255,255,255,0.7)" },
          "& .MuiStepLabel-label.Mui-active, & .MuiStepLabel-label.Mui-completed": {
            color: "common.white",
            fontWeight: 700,
          },
          "& .MuiStepIcon-root": { color: "rgba(255,255,255,0.35)" },
          "& .MuiStepIcon-root.Mui-active, & .MuiStepIcon-root.Mui-completed": {
            color: "primary.main",
          },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>

    <Box sx={{ flex: 1, py: { xs: 3, md: 5 }, px: { xs: 2, md: 4 } }}>
      <Container maxWidth={maxWidth} disableGutters>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {(title || subtitle) && (
            <Stack spacing={0.5} sx={{ mb: 3, textAlign: "center" }}>
              {title ? (
                <Typography variant="h4" component="h1" fontWeight={700}>
                  {title}
                </Typography>
              ) : null}
              {subtitle ? (
                <Typography color="text.secondary">{subtitle}</Typography>
              ) : null}
            </Stack>
          )}
          {children}
        </Paper>
      </Container>
    </Box>
  </Box>
);

export default WizardShell;
