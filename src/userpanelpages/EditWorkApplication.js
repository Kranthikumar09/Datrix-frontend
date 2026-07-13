import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useAuth } from '../context/AuthContext';
import { useAppSnackbar } from '../components/ui/AppSnackbar';
import ProtectedPageLayout from '../components/layout/ProtectedPageLayout';
import LoadingState from '../components/ui/LoadingState';
import AppTextField from '../components/ui/AppTextField';
import AppSelect from '../components/ui/AppSelect';
import FileUploadField from '../components/ui/FileUploadField';
import config from '../config/config';
import { sortedCountriesLower, capitalizeCountry } from '../constants/countries';

const WORK_EXPERIENCE_OPTIONS = [
  { value: '0-1', label: '0-1 years' },
  { value: '1-3', label: '1-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5+', label: '5+ years' },
];

const EditWorkApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const snackbar = useAppSnackbar();

  const [application, setApplication] = useState({
    application_id: '',
    purpose: 'Work',
    preferred_countries: [],
    age: '',
    highest_education: '',
    designation: '',
    work_experience: '',
    current_country: '',
    current_state: '',
    query: '',
    query_image: '',
    query_video_or_audio: '',
    resume: null,
    cover_letter: null,
    new_resume: null,
    new_cover_letter: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullName, setFullName] = useState('');
  const [countries, setCountries] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);
  const [resumeError, setResumeError] = useState('');
  const [coverLetterError, setCoverLetterError] = useState('');

  const userId = JSON.parse(localStorage.getItem('user'))?.id || 'N/A';
  const getToken = () => localStorage.getItem('accessToken');

  const fetchUserData = async () => {
    const token = getToken();
    if (!token || !isAuthenticated || !userId) {
      snackbar.error('Please log in to continue.');
      logout();
      navigate('/login');
      return;
    }
    try {
      const response = await axios.post(
        `${config.baseURL}/user/details/get`,
        { user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setFullName(response.data.data.name || '');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        snackbar.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        snackbar.error('Failed to load user data');
      }
    }
  };

  const fetchCountries = async () => {
    const token = getToken();
    if (!token || !isAuthenticated) {
      snackbar.error('Please log in to fetch countries.');
      logout();
      navigate('/login');
      return;
    }
    try {
      const response = await axios.get(`${config.baseURL}/countries/get`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setCountries(
          response.data.data.map((country) => country.nicename.trim().toLowerCase())
        );
      } else {
        throw new Error(response.data.message || 'Failed to fetch countries');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        snackbar.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        snackbar.error(err.message || 'Failed to load countries');
      }
    }
  };

  const fetchEducationLevels = async () => {
    const token = getToken();
    if (!token || !isAuthenticated) {
      snackbar.error('Please log in to fetch education levels.');
      logout();
      navigate('/login');
      return;
    }
    try {
      const response = await axios.get(
        `${config.baseURL}/site-content/education-levels/get`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setEducationLevels(response.data.data.map((level) => level.title));
      } else {
        throw new Error(response.data.message || 'Failed to fetch education levels');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        snackbar.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        snackbar.error(err.message || 'Failed to load education levels');
      }
    }
  };

  const fetchApplication = async () => {
    const token = getToken();
    if (!token || !isAuthenticated || !id) {
      snackbar.error('Please log in or provide a valid application ID.');
      logout();
      navigate('/login');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`${config.baseURL}/application/details/get`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: { application_id: id },
      });
      if (response.data.success) {
        const appData = response.data.data;
        if (appData && appData.purpose === 'Work') {
          setApplication({
            application_id: appData.id || id,
            purpose: 'Work',
            preferred_countries: appData.preferred_countries
              ? appData.preferred_countries.split(',').map((c) => c.trim().toLowerCase())
              : [],
            age: appData.age || '',
            highest_education: appData.highest_education?.toLowerCase() || '',
            designation: appData.designation || '',
            work_experience: appData.work_experience || '',
            current_country: appData.current_country
              ? appData.current_country.trim().toLowerCase()
              : '',
            current_state: appData.current_state || '',
            query: appData.query || '',
            query_image: appData.query_image || '',
            query_video_or_audio: appData.query_video_or_audio || '',
            resume: appData.resume || null,
            cover_letter: appData.cover_letter || null,
            new_resume: null,
            new_cover_letter: null,
          });
        } else {
          throw new Error('This application is not for work purposes');
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch application');
      }
    } catch (err) {
      setError(err.message || 'Failed to load application');
      if (err.response?.status === 401) {
        snackbar.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        snackbar.error(err.message || 'Failed to load application');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
      fetchCountries();
      fetchEducationLevels();
      fetchApplication();
    } else {
      snackbar.error('Please log in to access this page.');
      navigate('/login');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplication((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (field) => (e) => {
    const file = e.target.files?.[0];
    const maxSize = 5 * 1024 * 1024;

    if (!file) {
      setApplication((prev) => ({ ...prev, [field]: null }));
      if (field === 'new_resume') setResumeError('');
      else setCoverLetterError('');
      return;
    }

    if (file.type !== 'application/pdf') {
      const msg = 'File must be a PDF';
      if (field === 'new_resume') setResumeError(msg);
      else setCoverLetterError(msg);
      return;
    }

    if (file.size > maxSize) {
      const msg = 'File size exceeds 5MB';
      if (field === 'new_resume') setResumeError(msg);
      else setCoverLetterError(msg);
      return;
    }

    setApplication((prev) => ({ ...prev, [field]: file }));
    if (field === 'new_resume') setResumeError('');
    else setCoverLetterError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token || !isAuthenticated) {
      snackbar.error('Please log in to update the application.');
      logout();
      navigate('/login');
      return;
    }

    if (
      !application.highest_education ||
      !application.designation ||
      !application.work_experience ||
      application.preferred_countries.length === 0 ||
      !application.age ||
      !application.current_country
    ) {
      snackbar.error('Please fill in all required fields.');
      return;
    }

    const validWorkExperienceOptions = ['0-1', '1-3', '3-5', '5+'];
    if (!validWorkExperienceOptions.includes(application.work_experience)) {
      snackbar.error('Please select a valid work experience option.');
      return;
    }

    const age = parseInt(application.age);
    if (isNaN(age) || age < 18 || age > 80) {
      snackbar.error('Age must be a number between 18 and 80.');
      return;
    }

    if (application.new_resume && resumeError) {
      snackbar.error(`Resume: ${resumeError}`);
      return;
    }
    if (application.new_cover_letter && coverLetterError) {
      snackbar.error(`Cover Letter: ${coverLetterError}`);
      return;
    }

    const formData = new FormData();
    formData.append('application_id', parseInt(application.application_id));
    formData.append('purpose', application.purpose);
    formData.append('preferred_countries', application.preferred_countries.join(','));
    formData.append('age', application.age);
    formData.append('highest_education', application.highest_education);
    formData.append('designation', application.designation);
    formData.append('work_experience', application.work_experience);
    formData.append('current_country', application.current_country);
    formData.append('current_state', application.current_state);
    formData.append('query', application.query);
    formData.append('query_image', application.query_image);
    formData.append('query_video_or_audio', application.query_video_or_audio);
    if (application.new_resume) formData.append('resume', application.new_resume);
    if (application.new_cover_letter) formData.append('cover_letter', application.new_cover_letter);

    try {
      const response = await axios.post(
        `${config.baseURL}/application/update`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        snackbar.success('Work application updated successfully!');
        setTimeout(() => navigate('/work-applications'), 2000);
      } else {
        throw new Error(response.data.message || 'Failed to update application');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        snackbar.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        snackbar.error(err.message || 'Failed to update application');
      }
    }
  };

  // Preferred country options from API (sorted, US first)
  const sortedPreferredCountries = [
    'united states',
    ...countries
      .filter((c) => c !== 'united states')
      .sort((a, b) => a.localeCompare(b)),
  ];
  const preferredCountryOptions = sortedPreferredCountries.map((c) => ({
    value: c,
    label: capitalizeCountry(c),
  }));
  const selectedPreferredOptions = preferredCountryOptions.filter((o) =>
    application.preferred_countries.includes(o.value)
  );

  if (loading) {
    return (
      <ProtectedPageLayout fullName={fullName} userId={userId}>
        <LoadingState label="Loading application..." height={240} />
      </ProtectedPageLayout>
    );
  }

  if (error) {
    return (
      <ProtectedPageLayout fullName={fullName} userId={userId}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchApplication}>
              Try Again
            </Button>
          }
        >
          {error}
        </Alert>
      </ProtectedPageLayout>
    );
  }

  return (
    <ProtectedPageLayout fullName={fullName} userId={userId} title="Edit Work Application">
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Application #{application.application_id}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <AppSelect
              id="highest_education"
              label="Highest Education *"
              name="highest_education"
              value={application.highest_education}
              onChange={handleInputChange}
            >
              <MenuItem value="">Select Education Level</MenuItem>
              {educationLevels.map((level) => (
                <MenuItem key={level} value={level.toLowerCase()}>
                  {level}
                </MenuItem>
              ))}
            </AppSelect>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <AppTextField
              fullWidth
              label="Designation *"
              name="designation"
              value={application.designation}
              onChange={handleInputChange}
              placeholder="Enter Designation"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <AppSelect
              id="work_experience"
              label="Work Experience (years) *"
              name="work_experience"
              value={application.work_experience}
              onChange={handleInputChange}
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
              label="Age *"
              type="number"
              name="age"
              value={application.age}
              onChange={handleInputChange}
              placeholder="Enter Age"
              inputProps={{ min: 18, max: 80 }}
            />
          </Grid>

          <Grid size={12}>
            <Autocomplete
              multiple
              options={preferredCountryOptions}
              value={selectedPreferredOptions}
              onChange={(_e, selected) => {
                const vals = selected ? selected.map((o) => o.value) : [];
                if (vals.length > 3) {
                  snackbar.error('You can select up to 3 countries only.');
                  return;
                }
                setApplication((prev) => ({ ...prev, preferred_countries: vals }));
              }}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              getOptionDisabled={(option) =>
                application.preferred_countries.length >= 3 &&
                !application.preferred_countries.includes(option.value)
              }
              disableCloseOnSelect
              noOptionsText="No countries found"
              ListboxProps={{ style: { maxHeight: 200 } }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Preferred Countries (up to 3) *"
                  placeholder="Search countries..."
                  helperText={`${application.preferred_countries.length}/3 selected`}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <AppSelect
              id="current_country"
              label="Current Country *"
              name="current_country"
              value={application.current_country}
              onChange={handleInputChange}
            >
              <MenuItem value="">Select Current Country</MenuItem>
              {sortedCountriesLower.map((country) => (
                <MenuItem key={country} value={country}>
                  {capitalizeCountry(country)}
                </MenuItem>
              ))}
            </AppSelect>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <AppTextField
              fullWidth
              label="Current State"
              name="current_state"
              value={application.current_state}
              onChange={handleInputChange}
              placeholder="Enter Current State"
              inputProps={{ maxLength: 50 }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FileUploadField
              id="new_resume"
              label="Resume"
              required
              accept=".pdf"
              value={application.new_resume}
              existingFileName={application.resume || undefined}
              error={resumeError}
              helperText="Supported format: PDF (max 5MB)"
              onChange={handleFileChange('new_resume')}
              onClear={() => {
                setApplication((prev) => ({ ...prev, new_resume: null }));
                setResumeError('');
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FileUploadField
              id="new_cover_letter"
              label="Cover Letter"
              accept=".pdf"
              value={application.new_cover_letter}
              existingFileName={application.cover_letter || undefined}
              error={coverLetterError}
              helperText="Supported format: PDF (max 5MB)"
              onChange={handleFileChange('new_cover_letter')}
              onClear={() => {
                setApplication((prev) => ({ ...prev, new_cover_letter: null }));
                setCoverLetterError('');
              }}
            />
          </Grid>

          <Grid size={12}>
            <AppTextField
              fullWidth
              label="Query"
              name="query"
              value={application.query}
              onChange={handleInputChange}
              placeholder="Enter any additional queries or notes"
              multiline
              rows={4}
              inputProps={{ maxLength: 500 }}
            />
          </Grid>

          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
              <Button
                component={RouterLink}
                to="/work-applications"
                variant="outlined"
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ProtectedPageLayout>
  );
};

export default EditWorkApplication;
