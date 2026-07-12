import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

/**
 * Shared section wrapper for consistent horizontal padding / max width.
 */
const SectionContainer = ({
  children,
  maxWidth = "lg",
  component = "section",
  disableGutters = false,
  sx,
  ...props
}) => (
  <Box component={component} sx={sx} {...props}>
    <Container maxWidth={maxWidth} disableGutters={disableGutters}>
      {children}
    </Container>
  </Box>
);

export default SectionContainer;
