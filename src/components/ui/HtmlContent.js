import React from "react";
import Box from "@mui/material/Box";

/**
 * Renders CMS/backend HTML content.
 * Content is provided by the Datrix backend/CMS; frontend does not sanitize here.
 * Backend/CMS owners must ensure HTML is safe before serving.
 */
const HtmlContent = ({ html, sx, className }) => {
  if (!html) return null;
  return (
    <Box
      className={className}
      sx={{
        "& img": { maxWidth: "100%", height: "auto" },
        "& a": { color: "primary.main" },
        ...sx,
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default HtmlContent;
