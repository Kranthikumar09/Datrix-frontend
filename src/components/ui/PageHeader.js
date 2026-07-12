import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const PageHeader = ({ title, subtitle, actions, eyebrow, sx }) => (
  <Box
    component="header"
    sx={{
      mb: 3,
      ...sx,
    }}
  >
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      alignItems={{ xs: "flex-start", sm: "center" }}
      justifyContent="space-between"
    >
      <Box>
        {eyebrow ? (
          <Typography variant="overline" color="primary" sx={{ display: "block", mb: 0.5 }}>
            {eyebrow}
          </Typography>
        ) : null}
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.75 }}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      {actions ? <Box sx={{ flexShrink: 0 }}>{actions}</Box> : null}
    </Stack>
  </Box>
);

export default PageHeader;
