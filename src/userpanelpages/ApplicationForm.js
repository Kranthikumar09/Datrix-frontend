import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useAppSnackbar } from '../components/ui/AppSnackbar';
import WizardShell from '../components/layout/WizardShell';
import config from '../config/config';
import { validateStep2 } from './application-form/formValidation';
import PurposeStep from './application-form/PurposeStep';
import StudyDetailsStep from './application-form/StudyDetailsStep';
import WorkDetailsStep from './application-form/WorkDetailsStep';
import QueryStep from './application-form/QueryStep';

const WIZARD_STEPS = ['Choose Purpose', 'Profile Summary', 'Query'];

const INITIAL_FORM_DATA = {
  age: '',
  highestEducation: '',
  country: '',
  workExperience: '',
  jobTitle: '',
  studyLevel: '',
  stream: '',
  percentage: '',
  budget: '',
  query: '',
  state: '',
  resume: null,
  coverLetter: null,
};

const ApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [countries, setCountries] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);
  const [loading, setLoading] = useState({ countries: false, education: false, submit: false });
  const [resumeValidationError, setResumeValidationError] = useState('');
  const [coverLetterValidationError, setCoverLetterValidationError] = useState('');
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const snackbar = useAppSnackbar();

  const getToken = () => localStorage.getItem('accessToken');

  const fetchData = useCallback(
    async (endpoint, setData, type) => {
      const token = getToken();
      if (!token || !isAuthenticated) {
        snackbar.error('Please log in to continue.');
        logout();
        navigate('/login');
        return;
      }
      setLoading((prev) => ({ ...prev, [type]: true }));
      try {
        const response = await axios.get(`${config.baseURL}${endpoint}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setData(response.data.data);
        } else {
          throw new Error(response.data.message || `Failed to fetch ${type}`);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          snackbar.error('Session expired. Please log in again.');
          logout();
          navigate('/login');
        } else {
          snackbar.error(`Error fetching ${type}: ${err.message}`);
        }
      } finally {
        setLoading((prev) => ({ ...prev, [type]: false }));
      }
    },
    [isAuthenticated, logout, navigate, snackbar]
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchData('/countries/get', setCountries, 'countries');
      fetchData('/site-content/education-levels/get', setEducationLevels, 'education');
    } else {
      snackbar.error('Please log in to access this page.');
      navigate('/login');
    }
  }, [fetchData, isAuthenticated, navigate, snackbar]);

  const handleNext = () => {
    if (currentStep === 1 && (!purpose || selectedCountries.length === 0)) {
      snackbar.error('Please select a purpose and at least one country');
      return;
    }
    if (
      currentStep === 2 &&
      !validateStep2(purpose, formData, resumeValidationError, coverLetterValidationError, snackbar)
    ) {
      return;
    }
    if (currentStep < 3) setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handlePurposeChange = (newPurpose) => {
    if (newPurpose !== purpose) {
      setFormData(INITIAL_FORM_DATA);
      setResumeValidationError('');
      setCoverLetterValidationError('');
      setPurpose(newPurpose);
    }
  };

  const handleCountryChange = useCallback(
    (_event, selected) => {
      const vals = selected ? selected.map((o) => o.value) : [];
      if (vals.length > 3) {
        snackbar.error('You can select up to 3 countries only.');
        return;
      }
      setSelectedCountries(vals);
    },
    [snackbar]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0];
    const maxSize = 5 * 1024 * 1024;

    if (!file) {
      setFormData((prev) => ({ ...prev, [field]: null }));
      if (field === 'resume') setResumeValidationError('');
      else setCoverLetterValidationError('');
      return;
    }

    if (file.type !== 'application/pdf') {
      const msg = 'File must be a PDF';
      if (field === 'resume') setResumeValidationError(msg);
      else setCoverLetterValidationError(msg);
      return;
    }

    if (file.size > maxSize) {
      const msg = 'File size exceeds 5MB';
      if (field === 'resume') setResumeValidationError(msg);
      else setCoverLetterValidationError(msg);
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: file }));
    if (field === 'resume') setResumeValidationError('');
    else setCoverLetterValidationError('');
  };

  const handleSubmit = async () => {
    const token = getToken();
    if (!token || !isAuthenticated) {
      snackbar.error('Please log in to submit the application.');
      logout();
      navigate('/login');
      return;
    }

    if (formData.query && formData.query.length > 500) {
      snackbar.error('Query must not exceed 500 characters');
      return;
    }

    setLoading((prev) => ({ ...prev, submit: true }));

    const formDataPayload = new FormData();
    formDataPayload.append('purpose', purpose);
    formDataPayload.append('preferred_countries', selectedCountries.join(','));
    formDataPayload.append('age', parseInt(formData.age));
    formDataPayload.append('intrested_in_study_level', formData.studyLevel || '');
    formDataPayload.append('highest_education', formData.highestEducation);
    formDataPayload.append('stream', formData.stream || '');
    formDataPayload.append('percentage', parseFloat(formData.percentage) || '');
    formDataPayload.append('total_budget', parseInt(formData.budget) || '');
    formDataPayload.append('designation', formData.jobTitle || '');
    formDataPayload.append('work_experience', formData.workExperience || '');
    formDataPayload.append('current_country', formData.country);
    formDataPayload.append('current_state', formData.state || '');
    formDataPayload.append('query', formData.query || '');

    if (purpose === 'work') {
      if (formData.resume) formDataPayload.append('resume', formData.resume);
      if (formData.coverLetter) formDataPayload.append('cover_letter', formData.coverLetter);
    }

    try {
      const response = await axios.post(
        `${config.baseURL}/application/submit`,
        formDataPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        snackbar.success(response.data.message);
        setFormData(INITIAL_FORM_DATA);
        setResumeValidationError('');
        setCoverLetterValidationError('');
        setPurpose('');
        setSelectedCountries([]);
        setCurrentStep(1);
        setTimeout(() => {
          navigate(purpose === 'study' ? '/study-applications' : '/work-applications');
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to submit application');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        snackbar.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        snackbar.error(`Submission failed: ${err.message}`);
      }
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  const countryOptions = useMemo(
    () =>
      countries
        .map((country) => ({ value: country.nicename, label: country.nicename }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [countries]
  );

  const stepTitle =
    currentStep === 1
      ? 'Choose Purpose & Country'
      : currentStep === 2
      ? 'Profile Summary'
      : 'Your Query';

  const stepSubtitle =
    currentStep === 1
      ? 'Select up to 3 countries of your choice'
      : currentStep === 2
      ? 'Tell us about your background'
      : 'Any additional notes or questions?';

  return (
    <WizardShell
      steps={WIZARD_STEPS}
      activeStep={currentStep - 1}
      title={stepTitle}
      subtitle={stepSubtitle}
    >
      {currentStep === 1 && (
        <PurposeStep
          purpose={purpose}
          onPurposeChange={handlePurposeChange}
          selectedCountries={selectedCountries}
          onCountryChange={handleCountryChange}
          countryOptions={countryOptions}
          loadingCountries={loading.countries}
          onNext={handleNext}
        />
      )}

      {currentStep === 2 && purpose === 'study' && (
        <StudyDetailsStep
          formData={formData}
          onChange={handleInputChange}
          educationLevels={educationLevels}
          loadingEducation={loading.education}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}

      {currentStep === 2 && purpose === 'work' && (
        <WorkDetailsStep
          formData={formData}
          onChange={handleInputChange}
          onFileChange={handleFileChange}
          educationLevels={educationLevels}
          loadingEducation={loading.education}
          resumeValidationError={resumeValidationError}
          coverLetterValidationError={coverLetterValidationError}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}

      {currentStep === 3 && (
        <QueryStep
          query={formData.query}
          onChange={handleInputChange}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
          submitting={loading.submit}
        />
      )}
    </WizardShell>
  );
};

export default ApplicationForm;
