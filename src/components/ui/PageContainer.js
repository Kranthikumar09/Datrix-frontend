import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

const PageContainer = ({
  children,
  maxWidth = "lg",
  disableGutters = false,
  component = "main",
  sx,
  ...props
}) => (
  <Container
    component={component}
    maxWidth={maxWidth}
    disableGutters={disableGutters}
    sx={{ py: { xs: 2, md: 3 }, ...sx }}
    {...props}
  >
    <Box>{children}</Box>
  </Container>
);

export default PageContainer;
