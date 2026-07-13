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
import config from '../config/config';
import { sortedCountriesLower, capitalizeCountry } from '../constants/countries';

const EditStudyApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const snackbar = useAppSnackbar();

  const [application, setApplication] = useState({
    application_id: '',
    purpose: 'Study',
    preferred_countries: [],
    age: '',
    intrested_in_study_level: '',
    highest_education: '',
    stream: '',
    percentage: '',
    total_budget: '',
    current_country: '',
    current_state: '',
    query: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullName, setFullName] = useState('');
  const [studyLevels, setStudyLevels] = useState([]);
  const [countries, setCountries] = useState([]);

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

  const fetchStudyLevels = async () => {
    const token = getToken();
    if (!token || !isAuthenticated) {
      snackbar.error('Please log in to fetch study levels.');
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
        setStudyLevels(response.data.data.map((level) => level.title));
      } else {
        throw new Error(response.data.message || 'Failed to fetch study levels');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        snackbar.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        snackbar.error(err.message || 'Failed to load study levels');
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
        if (appData && appData.purpose === 'Study') {
          setApplication({
            application_id: appData.id || id,
            purpose: 'Study',
            preferred_countries: appData.preferred_countries
              ? appData.preferred_countries.split(',').map((c) => c.trim().toLowerCase())
              : [],
            age: appData.age || '',
            intrested_in_study_level: appData.intrested_in_study_level?.toLowerCase() || '',
            highest_education: appData.highest_education?.toLowerCase() || '',
            stream: appData.stream || '',
            percentage: appData.percentage || '',
            total_budget: appData.total_budget || '',
            current_country: appData.current_country
              ? appData.current_country.trim().toLowerCase()
              : '',
            current_state: appData.current_state || '',
            query: appData.query || '',
          });
        } else {
          throw new Error('This application is not for study purposes');
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
      fetchStudyLevels();
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
      !application.intrested_in_study_level ||
      !application.highest_education ||
      !application.percentage ||
      !application.total_budget ||
      application.preferred_countries.length === 0 ||
      !application.age ||
      !application.stream
    ) {
      snackbar.error('Please fill in all required fields.');
      return;
    }

    const percentage = parseFloat(application.percentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      snackbar.error('Percentage must be a number between 0 and 100.');
      return;
    }

    const budget = parseFloat(application.total_budget);
    if (isNaN(budget) || budget < 0) {
      snackbar.error('Total budget must be a positive number.');
      return;
    }

    const age = parseInt(application.age);
    if (isNaN(age) || age < 0) {
      snackbar.error('Age must be a positive number.');
      return;
    }

    try {
      const response = await axios.post(
        `${config.baseURL}/application/update`,
        {
          application_id: application.application_id,
          purpose: application.purpose,
          preferred_countries: application.preferred_countries.join(','),
          age: application.age,
          intrested_in_study_level: application.intrested_in_study_level,
          highest_education: application.highest_education,
          stream: application.stream,
          percentage: application.percentage,
          total_budget: application.total_budget,
          current_country: application.current_country,
          current_state: application.current_state,
          query: application.query,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        snackbar.success('Study application updated successfully!');
        setTimeout(() => navigate('/study-applications'), 2000);
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
    <ProtectedPageLayout fullName={fullName} userId={userId} title="Edit Study Application">
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Application #{application.application_id}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <AppSelect
              id="intrested_in_study_level"
              label="Interested Study Level *"
              name="intrested_in_study_level"
              value={application.intrested_in_study_level}
              onChange={handleInputChange}
            >
              <MenuItem value="">Select Study Level</MenuItem>
              {studyLevels.map((level) => (
                <MenuItem key={level} value={level.toLowerCase()}>
                  {level}
                </MenuItem>
              ))}
            </AppSelect>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <AppSelect
              id="highest_education"
              label="Highest Education *"
              name="highest_education"
              value={application.highest_education}
              onChange={handleInputChange}
            >
              <MenuItem value="">Select Education Level</MenuItem>
              {studyLevels.map((level) => (
                <MenuItem key={level} value={level.toLowerCase()}>
                  {level}
                </MenuItem>
              ))}
            </AppSelect>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <AppTextField
              fullWidth
              label="Stream *"
              name="stream"
              value={application.stream}
              onChange={handleInputChange}
              placeholder="Enter Stream (e.g., Computer Science)"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <AppTextField
              fullWidth
              label="Percentage *"
              type="number"
              name="percentage"
              value={application.percentage}
              onChange={handleInputChange}
              placeholder="Enter Percentage"
              inputProps={{ min: 0, max: 100, step: 0.1 }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <AppTextField
              fullWidth
              label="Total Budget *"
              type="number"
              name="total_budget"
              value={application.total_budget}
              onChange={handleInputChange}
              placeholder="Enter Budget"
              inputProps={{ min: 0 }}
            />
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
              inputProps={{ min: 0 }}
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
              label="Current Country"
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
                to="/study-applications"
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

export default EditStudyApplication;
