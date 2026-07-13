import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Desktop sidebar + mobile drawer for browse filter checkboxes.
 */
const FilterForm = ({ groups, filters, onFilterChange, onApply, onReset, onCloseMobile }) => (
  <Box component="form" onSubmit={onApply}>
    <Stack spacing={1}>
      {groups.map((group) => (
        <Accordion key={group.key} defaultExpanded disableGutters elevation={0} sx={{ "&:before": { display: "none" }, border: "1px solid", borderColor: "divider", borderRadius: 1, mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>{group.title}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, maxHeight: 220, overflow: "auto" }}>
            {group.options.length > 0 ? (
              <FormGroup>
                {group.options.map((option, index) => {
                  const id = `${group.key}-${index}`;
                  return (
                    <FormControlLabel
                      key={id}
                      control={
                        <Checkbox
                          size="small"
                          value={option}
                          name={group.key}
                          checked={filters[group.key]?.includes(option)}
                          onChange={onFilterChange}
                        />
                      }
                      label={<Typography variant="body2">{option}</Typography>}
                    />
                  );
                })}
              </FormGroup>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No options available.
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
    <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
      <Button type="submit" variant="contained" color="primary" fullWidth onClick={onCloseMobile}>
        Apply Filters
      </Button>
      <Button type="button" variant="outlined" color="secondary" onClick={() => { onReset(); onCloseMobile?.(); }}>
        Reset
      </Button>
    </Stack>
  </Box>
);

const FilterSidebar = ({ groups, filters, onFilterChange, onApply, onReset }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleApply = (e) => {
    onApply(e);
    setMobileOpen(false);
  };

  const panel = (
    <FilterForm
      groups={groups}
      filters={filters}
      onFilterChange={onFilterChange}
      onApply={handleApply}
      onReset={onReset}
      onCloseMobile={() => setMobileOpen(false)}
    />
  );

  return (
    <>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          Filters
        </Typography>
        {!isDesktop ? (
          <IconButton aria-label="Open filters" onClick={() => setMobileOpen(true)}>
            <FilterListIcon />
          </IconButton>
        ) : null}
      </Stack>

      {isDesktop ? (
        <Box sx={{ position: "sticky", top: 100 }}>{panel}</Box>
      ) : (
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          PaperProps={{ sx: { width: 320, p: 2 } }}
          aria-labelledby="filter-drawer-title"
        >
          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography id="filter-drawer-title" variant="h6" fontWeight={700}>
              Filters
            </Typography>
            <IconButton aria-label="Close filters" onClick={() => setMobileOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          {panel}
        </Drawer>
      )}
    </>
  );
};

export default FilterSidebar;
