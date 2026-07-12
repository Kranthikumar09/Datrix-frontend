import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

/**
 * Shared page banner for marketing pages.
 */
const PageBanner = ({ title, subtitle, children }) => (
  <Box
    component="section"
    className="page-banner"
    sx={{
      py: { xs: 4, md: 6 },
      bgcolor: "background.subtle",
    }}
  >
    <Container maxWidth="lg">
      <Stack spacing={1} sx={{ alignItems: "center", textAlign: "center" }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, color: "secondary.main" }}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
            {subtitle}
          </Typography>
        ) : null}
        {children}
      </Stack>
    </Container>
  </Box>
);

export default PageBanner;
