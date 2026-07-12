import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

const BrowseBreadcrumbs = ({ items = [] }) => (
  <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
    {items.map((item, index) => {
      const isLast = index === items.length - 1;
      if (isLast || !item.to) {
        return (
          <Typography key={item.label} color="text.primary" fontWeight={isLast ? 600 : 400}>
            {item.label}
          </Typography>
        );
      }
      return (
        <Link
          key={item.label}
          component={RouterLink}
          to={item.to}
          underline="hover"
          color="inherit"
        >
          {item.label}
        </Link>
      );
    })}
  </Breadcrumbs>
);

export default BrowseBreadcrumbs;
