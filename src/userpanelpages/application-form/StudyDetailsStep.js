import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AppTextField from '../../components/ui/AppTextField';
import AppSelect from '../../components/ui/AppSelect';
import { ALL_COUNTRIES } from '../../constants/countries';

const SORTED_COUNTRIES = [...ALL_COUNTRIES].sort((a, b) => a.localeCompare(b));

/**
 * Step 2 (Study path) — age, education, location, study level, stream, percentage, budget.
 */
const StudyDetailsStep = ({
  formData,
  onChange,
  educationLevels,
  loadingEducation,
  onNext,
  onPrevious,
}) => (
  <Stack spacing={3}>
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Enter Profile Summary
      </Typography>
      <Typography color="text.secondary">
        Tell us a bit about your education background
      </Typography>
    </Box>

    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, md: 6 }}>
        <AppTextField
          fullWidth
          label="How old are you? *"
          type="number"
          name="age"
          value={formData.age}
          onChange={onChange}
          placeholder="Enter age (18-80)"
          inputProps={{ min: 18, max: 80 }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        {loadingEducation ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: 56 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              Loading education levels...
            </Typography>
          </Box>
        ) : (
          <AppSelect
            id="highestEducation"
            label="What is your highest education? *"
            name="highestEducation"
            value={formData.highestEducation}
            onChange={onChange}
          >
            <MenuItem value="">Select Highest Education</MenuItem>
            {educationLevels.map((level) => (
              <MenuItem key={level.title} value={level.title.toLowerCase()}>
                {level.title}
              </MenuItem>
            ))}
          </AppSelect>
        )}
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <AppSelect
          id="country"
          label="Where are you from? *"
          name="country"
          value={formData.country}
          onChange={onChange}
        >
          <MenuItem value="">Select your country</MenuItem>
          {SORTED_COUNTRIES.map((country) => (
            <MenuItem key={country} value={country}>
              {country}
            </MenuItem>
          ))}
        </AppSelect>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <AppTextField
          fullWidth
          label="Current State"
          name="state"
          value={formData.state}
          onChange={onChange}
          placeholder="Enter state (max 50 chars)"
          inputProps={{ maxLength: 50 }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        {loadingEducation ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: 56 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              Loading education levels...
            </Typography>
          </Box>
        ) : (
          <AppSelect
            id="studyLevel"
            label="Level of studies interested in? *"
            name="studyLevel"
            value={formData.studyLevel}
            onChange={onChange}
          >
            <MenuItem value="">Select Level</MenuItem>
            {educationLevels.map((level) => (
              <MenuItem key={level.title} value={level.title.toLowerCase()}>
                {level.title}
              </MenuItem>
            ))}
          </AppSelect>
        )}
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <AppTextField
          fullWidth
          label="Stream? *"
          name="stream"
          value={formData.stream}
          onChange={onChange}
          placeholder="Enter stream (max 50 chars)"
          inputProps={{ maxLength: 50 }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <AppTextField
          fullWidth
          label="Percentage? *"
          type="number"
          name="percentage"
          value={formData.percentage}
          onChange={onChange}
          placeholder="Enter percentage (0-100)"
          inputProps={{ min: 0, max: 100, step: 0.1 }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <AppTextField
          fullWidth
          label="Total Budget? *"
          type="number"
          name="budget"
          value={formData.budget}
          onChange={onChange}
          placeholder="Enter budget (max 15 digits)"
          inputProps={{ min: 0, step: 1000 }}
        />
      </Grid>
    </Grid>

    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      <Button variant="outlined" onClick={onPrevious} size="large">
        Previous
      </Button>
      <Button
        variant="contained"
        onClick={onNext}
        disabled={loadingEducation}
        size="large"
      >
        Continue
      </Button>
    </Box>
  </Stack>
);

export default StudyDetailsStep;
