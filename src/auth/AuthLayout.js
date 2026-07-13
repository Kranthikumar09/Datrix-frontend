import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BRAND } from "../config/brand";
import Logo from "../assets/images/logo.png";
import LoginBg from "../assets/images/login-bg.png";
import LoginFav from "../assets/images/login-favicon.png";
import LoginImg1 from "../assets/images/login-img-1.png";
import LoginImg2 from "../assets/images/login-img-2.png";
import LoginImg3 from "../assets/images/login-img-3.png";

/**
 * Shared MUI shell for authentication pages.
 * Replaces Bootstrap navbar shells used on login/signup/password flows.
 */
const AuthLayout = ({
  children,
  title,
  subtitle,
  backTo = "/",
  backLabel = "Back to Home",
  showSideImages = true,
  formColumns = { xs: 12, lg: 5 },
}) => (
  <Box
    component="main"
    className="main-section login-page"
    sx={{
      minHeight: "100vh",
      backgroundImage: `url(${LoginBg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    <Box
      component="header"
      sx={{
        py: 2,
        px: { xs: 2, md: 3 },
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{
            px: { xs: 2, md: 3 },
            py: 1.5,
            borderRadius: "100px",
            bgcolor: "background.paper",
            boxShadow: "0px 20px 15px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box
            component={RouterLink}
            to="/"
            sx={{ display: "inline-flex", alignItems: "center" }}
            aria-label={BRAND.name}
          >
            <Box
              component="img"
              src={Logo}
              alt={BRAND.name}
              sx={{ maxHeight: 44, width: "auto" }}
            />
          </Box>
          <Button
            component={RouterLink}
            to={backTo}
            startIcon={<ArrowBackIcon />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "secondary.main",
              borderRadius: "50px",
            }}
          >
            {backLabel}
          </Button>
        </Stack>
      </Container>
    </Box>

    <Box component="section" sx={{ py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {showSideImages ? (
            <Grid size={{ xs: 12, lg: 12 - (formColumns.lg || 5) }} sx={{ display: { xs: "none", lg: "block" } }}>
              <Box className="login-section-imgs">
                <Box component="img" src={LoginFav} alt="" sx={{ maxWidth: "100%" }} />
                <Box className="left-two">
                  <Box component="img" src={LoginImg1} alt="" />
                  <Box component="img" src={LoginImg2} alt="" />
                </Box>
                <Box className="right-single">
                  <Box component="img" src={LoginImg3} alt="" sx={{ height: "100%" }} />
                </Box>
              </Box>
            </Grid>
          ) : null}

          <Grid size={formColumns}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                bgcolor: "background.paper",
                boxShadow: "0px 8px 40px rgba(0, 0, 0, 0.05)",
              }}
            >
              {(title || subtitle) && (
                <Box sx={{ mb: 3 }}>
                  {title ? (
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: subtitle ? 1 : 0 }}>
                      {title}
                    </Typography>
                  ) : null}
                  {subtitle ? (
                    <Typography variant="body1" color="text.secondary">
                      {subtitle}
                    </Typography>
                  ) : null}
                </Box>
              )}
              {children}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  </Box>
);

export default AuthLayout;
