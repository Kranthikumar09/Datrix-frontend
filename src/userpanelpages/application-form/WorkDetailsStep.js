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
import FileUploadField from '../../components/ui/FileUploadField';
import { ALL_COUNTRIES } from '../../constants/countries';

const SORTED_COUNTRIES = [...ALL_COUNTRIES].sort((a, b) => a.localeCompare(b));

const WORK_EXPERIENCE_OPTIONS = [
  { value: '0-1', label: '0-1 years' },
  { value: '1-3', label: '1-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5+', label: '5+ years' },
];

/**
 * Step 2 (Work path) — age, education, location, work experience, job title, resume, cover letter.
 */
const WorkDetailsStep = ({
  formData,
  onChange,
  onFileChange,
  educationLevels,
  loadingEducation,
  resumeValidationError,
  coverLetterValidationError,
  onNext,
  onPrevious,
}) => (
  <Stack spacing={3}>
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Enter Profile Summary
      </Typography>
      <Typography color="text.secondary">
        Tell us a bit about your work experience
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
        <AppSelect
          id="workExperience"
          label="How many years of work experience? *"
          name="workExperience"
          value={formData.workExperience}
          onChange={onChange}
        >
          <MenuItem value="">Select Years</MenuItem>
          {WORK_EXPERIENCE_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </AppSelect>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <AppTextField
          fullWidth
          label="What are/were you working as? *"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={onChange}
          placeholder="Enter job title (max 50 chars, 5 words)"
          inputProps={{ maxLength: 50 }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <FileUploadField
          id="resumeFile"
          label="Upload Your Resume"
          required
          accept=".pdf"
          value={formData.resume}
          error={resumeValidationError}
          helperText="Supported format: PDF (max 5MB)"
          onChange={(e) => onFileChange(e, 'resume')}
          onClear={() =>
            onFileChange({ target: { files: [] } }, 'resume')
          }
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <FileUploadField
          id="coverLetterFile"
          label="Upload Your Cover Letter"
          accept=".pdf"
          value={formData.coverLetter}
          error={coverLetterValidationError}
          helperText="Supported format: PDF (max 5MB)"
          onChange={(e) => onFileChange(e, 'coverLetter')}
          onClear={() =>
            onFileChange({ target: { files: [] } }, 'coverLetter')
          }
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

export default WorkDetailsStep;
