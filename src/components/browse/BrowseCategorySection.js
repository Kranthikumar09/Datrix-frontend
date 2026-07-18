import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HeadingIcon from "../../assets/images/heading-icon.svg";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";

/**
 * Reusable two-column browse section (country / specialization / location lists).
 */
const BrowseCategorySection = ({
  eyebrow,
  title,
  image,
  imageAlt,
  imagePosition = "right",
  items = [],
  loading = false,
  error = null,
  errorTitle,
  onRetry,
  emptyLabel = "No items available.",
  bgcolor,
}) => {
  const list = (
    <Stack spacing={2}>
      <Box>
        <Typography
          component="span"
          sx={{ display: "inline-flex", alignItems: "center", gap: 1, color: "primary.main", fontWeight: 600, mb: 1 }}
        >
          <Box component="img" src={HeadingIcon} alt="" sx={{ width: 18 }} />
          {eyebrow}
        </Typography>
        <Typography variant="h4" component="h2" fontWeight={700}>
          {title}
        </Typography>
      </Box>
      {loading ? (
        <LoadingState label="Loading options..." height={120} />
      ) : error ? (
        <ErrorState
          title={errorTitle || `Unable to load ${String(title || "options").replace(/^By\s+/i, "").toLowerCase()}`}
          message={error}
          onRetry={onRetry}
        />
      ) : items.length > 0 ? (
        <List disablePadding>
          {items.map((item) => (
            <ListItemButton
              key={item.key || item.label}
              component={item.to ? RouterLink : "button"}
              to={item.to}
              onClick={item.onClick}
              sx={{ borderRadius: 2, mb: 1, border: "1px solid", borderColor: "divider" }}
            >
              <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontWeight: 600 } } }} />
              <ChevronRightIcon color="action" />
            </ListItemButton>
          ))}
        </List>
      ) : (
        <Typography color="text.secondary">{emptyLabel}</Typography>
      )}
    </Stack>
  );

  const imageCol = (
    <Grid size={{ xs: 12, md: 5 }} sx={{ order: { xs: 2, md: imagePosition === "left" ? 1 : 2 } }}>
      <Box
        component="img"
        src={image}
        alt={imageAlt}
        sx={{ width: "100%", borderRadius: 3, display: "block" }}
      />
    </Grid>
  );

  const contentCol = (
    <Grid size={{ xs: 12, md: 7 }} sx={{ order: { xs: 1, md: imagePosition === "left" ? 2 : 1 } }}>
      {list}
    </Grid>
  );

  return (
    <Box component="section" sx={{ py: { xs: 4, md: 6 }, bgcolor }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ alignItems: "center" }}>
          {imagePosition === "left" ? (
            <>
              {imageCol}
              {contentCol}
            </>
          ) : (
            <>
              {contentCol}
              {imageCol}
            </>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default BrowseCategorySection;
