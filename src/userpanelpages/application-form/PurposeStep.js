import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import officeImg from '../../assets/images/office-img.svg';
import studyRedImg from '../../assets/images/study-red.svg';

/**
 * Step 1 — Purpose selection (Work / Study) and preferred country multiselect.
 */
const PurposeStep = ({
  purpose,
  onPurposeChange,
  selectedCountries,
  onCountryChange,
  countryOptions,
  loadingCountries,
  onNext,
}) => {
  const selectedCountryOptions = countryOptions.filter((o) =>
    selectedCountries.includes(o.value)
  );

  return (
    <Stack spacing={4}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Choose a Purpose &amp; Country
        </Typography>
        <Typography color="text.secondary">
          Select up to 3 countries of your choice
        </Typography>
      </Box>

      <Stack spacing={2} sx={{ alignItems: 'center' }}>
        <Typography variant="subtitle2" color="text.secondary">
          I would like to
        </Typography>

        <ToggleButtonGroup
          value={purpose}
          exclusive
          onChange={(_e, newValue) => {
            if (newValue !== null) onPurposeChange(newValue);
          }}
          aria-label="Application purpose"
          sx={{ gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <ToggleButton
            value="work"
            aria-label="Work"
            sx={{
              px: 4,
              py: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              flexDirection: 'column',
              gap: 1,
              minWidth: 120,
              '&.Mui-selected': {
                borderColor: 'primary.main',
                bgcolor: 'primary.50',
              },
            }}
          >
            <Box component="img" src={officeImg} alt="" sx={{ width: 40, height: 40 }} />
            <Typography fontWeight={600}>Work</Typography>
          </ToggleButton>

          <ToggleButton
            value="study"
            aria-label="Study"
            sx={{
              px: 4,
              py: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              flexDirection: 'column',
              gap: 1,
              minWidth: 120,
              '&.Mui-selected': {
                borderColor: 'primary.main',
                bgcolor: 'primary.50',
              },
            }}
          >
            <Box component="img" src={studyRedImg} alt="" sx={{ width: 40, height: 40 }} />
            <Typography fontWeight={600}>Study</Typography>
          </ToggleButton>
        </ToggleButtonGroup>

        {purpose && (
          <Typography variant="caption" color="primary.main" fontWeight={600}>
            {purpose === 'work' ? 'Work' : 'Study'} selected
          </Typography>
        )}
      </Stack>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }} color="text.secondary">
          in
        </Typography>
        <Autocomplete
          multiple
          options={countryOptions}
          value={selectedCountryOptions}
          onChange={onCountryChange}
          loading={loadingCountries}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          disableCloseOnSelect
          noOptionsText="No countries found"
          ListboxProps={{ style: { maxHeight: 200 } }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Preferred Countries *"
              placeholder="Search and select up to 3 countries..."
              helperText={`Selected ${selectedCountries.length}/3 countries`}
            />
          )}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={onNext}
          disabled={loadingCountries}
          size="large"
        >
          Continue
        </Button>
      </Box>
    </Stack>
  );
};

export default PurposeStep;
