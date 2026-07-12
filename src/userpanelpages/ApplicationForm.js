import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Select from 'react-select';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/images/logo.png';
import briefcaseImg from '../assets/images/briefcase.svg';
import closeCircleImg from '../assets/images/close-circle.svg';
import officeImg from '../assets/images/office-img.svg';
import studyRedImg from '../assets/images/study-red.svg';
import photoUploadImg from '../assets/images/photo-upload.svg'; 
import config from '../config/config';


// Custom styles for react-select
const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: '0.375rem',
    borderColor: '#ced4da',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#adb5bd',
    },
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? '#f8f9fa' : 'white',
    color: state.isSelected ? 'white' : '#212529',
    '&:hover': {
      backgroundColor: '#e9ecef',
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#007bff',
    color: 'white',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'white',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: 'white',
    '&:hover': {
      backgroundColor: '#0056b3',
      cursor: 'pointer',
    },
  }),
};

const ALL_COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Congo-Brazzaville)",
  "Costa Rica",
  "Côte d'Ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia (Czech Republic)",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini (fmr. \"Swaziland\")",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Holy See",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar (formerly Burma)",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine State",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];

const ApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [countries, setCountries] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);
  const [loading, setLoading] = useState({ countries: false, education: false, submit: false });
  const [resumeValidationError, setResumeValidationError] = useState('');
  const [coverLetterValidationError, setCoverLetterValidationError] = useState('');

  const [formData, setFormData] = useState({
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
  });

  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const getToken = () => localStorage.getItem('accessToken');

  const fetchData = useCallback(async (endpoint, setData, type) => {
    const token = getToken();
    if (!token || !isAuthenticated) {
      toast.error('Please log in to continue.');
      logout();
      navigate('/login');
      return;
    }

    setLoading((prev) => ({ ...prev, [type]: true }));
    try {
      const response = await axios.get(`${config.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setData(response.data.data);
      } else {
        throw new Error(response.data.message || `Failed to fetch ${type}`);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        toast.error(`Error fetching ${type}: ${err.message}`);
      }
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  }, [isAuthenticated, logout, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData('/countries/get', setCountries, 'countries');
      fetchData('/site-content/education-levels/get', setEducationLevels, 'education');
    } else {
      toast.error('Please log in to access this page.');
      navigate('/login');
    }
  }, [fetchData, isAuthenticated, navigate]);

  const handleNext = () => {
    if (currentStep === 1 && (!purpose || selectedCountries.length === 0)) {
      toast.error('Please select a purpose and at least one country');
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      return;
    }
    if (currentStep < 3) setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handlePurposeChange = (e) => {
    const newPurpose = e.target.id;
    if (newPurpose !== purpose) {
      setFormData({
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
      });
      setResumeValidationError('');
      setCoverLetterValidationError('');
      setPurpose(newPurpose);
    }
  };

  const handleCountryChange = (selectedOptions) => {
    const selected = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    if (selected.length > 3) {
      toast.error('You can select up to 3 countries only.');
      return;
    }
    setSelectedCountries(selected);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!file) {
      setFormData((prev) => ({ ...prev, [field]: null }));
      if (field === 'resume') setResumeValidationError('');
      else setCoverLetterValidationError('');
      return;
    }

    if (file.type !== 'application/pdf') {
      const error = 'File must be a PDF';
      if (field === 'resume') setResumeValidationError(error);
      else setCoverLetterValidationError(error);
      return;
    }

    if (file.size > maxSize) {
      const error = 'File size exceeds 5MB';
      if (field === 'resume') setResumeValidationError(error);
      else setCoverLetterValidationError(error);
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: file }));
    if (field === 'resume') setResumeValidationError('');
    else setCoverLetterValidationError('');
  };

  const validateStep2 = () => {
    const commonRequired = ['age', 'highestEducation', 'country'];
    const workRequired = ['workExperience', 'jobTitle', 'resume'];
    const studyRequired = ['studyLevel', 'stream', 'percentage', 'budget'];
    let missingFields = [];
    let invalidFields = [];

    // Common validations
    if (!formData.age) {
      missingFields.push('age');
    } else if (!/^\d+$/.test(formData.age) || formData.age < 18 || formData.age > 80) {
      invalidFields.push('age (must be 18-80, numbers only)');
    }

    if (!formData.highestEducation) missingFields.push('highest education');
    if (!formData.country) missingFields.push('country');

    if (formData.state) {
      if (!/^[a-zA-Z\s-]+$/.test(formData.state)) {
        invalidFields.push('state (letters, spaces, hyphens only)');
      } else if (formData.state.length > 50) {
        invalidFields.push('state (max 50 characters)');
      }
    }

    if (purpose === 'work') {
      if (!formData.workExperience) missingFields.push('work experience');
      if (!formData.jobTitle) {
        missingFields.push('job title');
      } else {
        const jobTitleWords = formData.jobTitle.trim().split(/\s+/);
        if (!/^[a-zA-Z\s-]+$/.test(formData.jobTitle)) {
          invalidFields.push('job title (letters, spaces, hyphens only)');
        } else if (jobTitleWords.length > 5) {
          invalidFields.push('job title (max 5 words)');
        } else if (formData.jobTitle.length > 50) {
          invalidFields.push('job title (max 50 characters)');
        }
      }

      // Resume validation
      if (!formData.resume) {
        missingFields.push('resume');
      } else if (resumeValidationError) {
        invalidFields.push(`resume (${resumeValidationError})`);
      }

      // Cover letter validation (optional)
      if (coverLetterValidationError) {
        invalidFields.push(`cover letter (${coverLetterValidationError})`);
      }
    } else if (purpose === 'study') {
      if (!formData.studyLevel) missingFields.push('study level');
      if (!formData.stream) {
        missingFields.push('stream');
      } else if (!/^[a-zA-Z\s-]+$/.test(formData.stream)) {
        invalidFields.push('stream (letters, spaces, hyphens only)');
      } else if (formData.stream.length > 50) {
        invalidFields.push('stream (max 50 characters)');
      }

      if (!formData.percentage) {
        missingFields.push('percentage');
      } else if (isNaN(formData.percentage) || formData.percentage < 0 || formData.percentage > 100) {
        invalidFields.push('percentage (must be 0-100)');
      }

      if (!formData.budget) {
        missingFields.push('budget');
      } else if (!/^\d+$/.test(formData.budget) || formData.budget < 0 || formData.budget.length > 15) {
        invalidFields.push('budget (positive number, max 15 digits)');
      }
    }

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`);
      return false;
    }
    if (invalidFields.length > 0) {
      toast.error(`Invalid fields: ${invalidFields.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token || !isAuthenticated) {
      toast.error('Please log in to submit the application.');
      logout();
      navigate('/login');
      return;
    }

    if (formData.query && formData.query.length > 500) {
      toast.error('Query must not exceed 500 characters');
      return;
    }

    setLoading((prev) => ({ ...prev, submit: true }));

    // Use FormData for file uploads
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

    // Append files if purpose is work
    if (purpose === 'work') {
      if (formData.resume) formDataPayload.append('resume', formData.resume);
      if (formData.coverLetter) formDataPayload.append('cover_letter', formData.coverLetter);
    }

    try {
      const response = await axios.post(`${config.baseURL}/application/submit`, formDataPayload, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
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
        });
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
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        toast.error(`Submission failed: ${err.message}`);
      }
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  // Prepare country options for react-select from API
  const countryOptions = countries
    .map((country) => ({
      value: country.nicename,
      label: country.nicename,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="main-section">
      <ToastContainer theme="colored" position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      <main className="wizard-layout">
        <div className="left-side-divider" style={{ width: '377px' }}>
          <Link to="/" className="d-flex navbar-brand align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
            <img src={logoImg} alt="logo-img" />
          </Link>
          <ul id="progressbar" className="side-bar-progress">
            <li className="active" id="account"><strong>Register</strong></li>
            <li className={currentStep >= 1 ? "active" : ""} id="personal"><strong>Choose Purpose</strong></li>
            <li className={currentStep >= 2 ? "active" : ""} id="payment"><strong>Profile Summary</strong></li>
            <li className={currentStep >= 3 ? "active" : ""} id="confirm"><strong>Query</strong></li>
          </ul>
        </div>

        <div className="right-side-divider">
          <div className="container-fluid">
            <div className="row">
              <div className="col-11 text-center mt-3 mb-2">
                <div className="card px-0 pt-4 pb-0 mt-3 mb-3">
                  <form id="msform" onSubmit={handleSubmit}>
                    {/* Step 1 */}
                    {currentStep === 1 && (
                      <fieldset>
                        <div className="form-card">
                          <div className="row text-center">
                            <div className="col-12">
                              <div className="right-side-heading">
                                <h2 className="fs-title">Choose a Purpose & Country</h2>
                                <p className="sub-title">Select up to 3 countries of your choice</p>
                              </div>
                            </div>

                            <div className="choose-contry-section">
                              <div className="contry-top-data">
                                <span><img src={briefcaseImg} alt="briefcase" /> I would like to</span>
                                <Link to="#"><img src={closeCircleImg} alt="close" /></Link>
                              </div>

                              <div className="contry-main">
                                <ul className="study-inner-mid">
                                  <li className="study-innner-point">
                                    <input type="radio" className="btn-check" name="options" id="work"
                                      onChange={handlePurposeChange} checked={purpose === 'work'} />
                                    <label className="btn" htmlFor="work">
                                      <img src={officeImg} alt="work" /> Work
                                    </label>
                                  </li>
                                  <li className="study-innner-point">
                                    <input type="radio" className="btn-check" name="options" id="study"
                                      onChange={handlePurposeChange} checked={purpose === 'study'} />
                                    <label className="btn" htmlFor="study">
                                      <img src={studyRedImg} alt="study" /> Study
                                    </label>
                                  </li>
                                </ul>

                                <span className="point-heading">in</span>

                                <div className="country-search mb-3">
                                  {loading.countries && <div className="loading-message">Loading countries...</div>}
                                  {!loading.countries && (
                                    <>
                                      <Select
                                        isMulti
                                        options={countryOptions}
                                        value={countryOptions.filter((option) => selectedCountries.includes(option.value))}
                                        onChange={handleCountryChange}
                                        placeholder="Search and select up to 3 countries..."
                                        styles={customSelectStyles}
                                        noOptionsMessage={() => 'No countries found'}
                                        maxMenuHeight={200}
                                        isClearable
                                        closeMenuOnSelect={false}
                                      />
                                      <small className="form-text text-muted">
                                        Selected {selectedCountries.length}/3 countries
                                      </small>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bottom-btn">
                          <button
                            type="button"
                            className="next action-button color-btn btn"
                            onClick={handleNext}
                            disabled={loading.countries}
                          >
                            Continue
                          </button>
                        </div>
                      </fieldset>
                    )}

                    {/* Step 2 */}
                    {currentStep === 2 && (
                      <fieldset>
                        <div className="form-card profile-form-main">
                          <div className="row">
                            <div className="col-12">
                              <div className="right-side-heading">
                                <h2 className="fs-title">Enter Profile Summary</h2>
                                <p className="sub-title">Tell us a bit about your education and work experience</p>
                              </div>
                            </div>
                          </div>

                          <div className="profile-form">
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label>How old are you? <span className="text-danger">*</span></label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    placeholder="Enter age (18-80)"
                                    min="18"
                                    max="80"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label>What is your highest education? <span className="text-danger">*</span></label>
                                  {loading.education && <div className="loading-message">Loading education levels...</div>}
                                  {!loading.education && educationLevels.length > 0 && (
                                    <select
                                      className="form-select"
                                      name="highestEducation"
                                      value={formData.highestEducation}
                                      onChange={handleInputChange}
                                      required
                                    >
                                      <option value="">Select Highest Education</option>
                                      {educationLevels.map((level, index) => (
                                        <option key={index} value={level.title.toLowerCase()}>
                                          {level.title}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label>Where are you from? <span className="text-danger">*</span></label>
                                  <select
                                    className="form-select"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    required
                                  >
                                    <option value="">Select your country</option>
                                    {ALL_COUNTRIES
                                      .sort()
                                      .map((country) => (
                                        <option key={country} value={country}>
                                          {country}
                                        </option>
                                      ))}
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label>Current State</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    placeholder="Enter state (max 50 chars)"
                                    maxLength="50"
                                  />
                                </div>
                              </div>

                              {purpose === 'work' && (
                                <>
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label>How many years of work experience? <span className="text-danger">*</span></label>
                                      <select
                                        className="form-select"
                                        name="workExperience"
                                        value={formData.workExperience}
                                        onChange={handleInputChange}
                                        required
                                      >
                                        <option value="">Select Years</option>
                                        <option value="0-1">0-1 years</option>
                                        <option value="1-3">1-3 years</option>
                                        <option value="3-5">3-5 years</option>
                                        <option value="5+">5+ years</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label>What are/were you working as? <span className="text-danger">*</span></label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        name="jobTitle"
                                        value={formData.jobTitle}
                                        onChange={handleInputChange}
                                        placeholder="Enter job title (max 50 chars, 5 words)"
                                        maxLength="50"
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-group upload-file">
                                      <label htmlFor="resumeFile" className="form-label">
                                        <div className="file-inner">
                                          <span className="upload-file-center">
                                            <img src={photoUploadImg} alt="Upload Icon" />
                                          </span>
                                        </div>
                                        <span className="upload-text">Upload Your Resume <span className="text-danger">*</span></span>
                                      </label>
                                      <input
                                        className="form-control"
                                        type="file"
                                        id="resumeFile"
                                        onChange={(e) => handleFileChange(e, 'resume')}
                                        disabled={loading.submit}
                                        accept=".pdf"
                                        required
                                      />
                                      <small className="text-muted">Supported format: PDF (max 5MB)</small>
                                      {resumeValidationError && (
                                        <div className="alert alert-danger mt-2" role="alert">
                                          {resumeValidationError}
                                        </div>
                                      )}
                                      {formData.resume && (
                                        <div className="mt-2 text-success">
                                          Selected: {formData.resume.name}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-group upload-file">
                                      <label htmlFor="coverLetterFile" className="form-label">
                                        <div className="file-inner">
                                          <span className="upload-file-center">
                                            <img src={photoUploadImg} alt="Upload Icon" />
                                          </span>
                                        </div>
                                        <span className="upload-text">Upload Your Cover Letter</span>
                                      </label>
                                      <input
                                        className="form-control"
                                        type="file"
                                        id="coverLetterFile"
                                        onChange={(e) => handleFileChange(e, 'coverLetter')}
                                        disabled={loading.submit}
                                        accept=".pdf"
                                      />
                                      <small className="text-muted">Supported format: PDF (max 5MB)</small>
                                      {coverLetterValidationError && (
                                        <div className="alert alert-danger mt-2" role="alert">
                                          {coverLetterValidationError}
                                        </div>
                                      )}
                                      {formData.coverLetter && (
                                        <div className="mt-2 text-success">
                                          Selected: {formData.coverLetter.name}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </>
                              )}

                              {purpose === 'study' && (
                                <>
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label>Level of studies interested in? <span className="text-danger">*</span></label>
                                      {loading.education && <div className="loading-message">Loading education levels...</div>}
                                      {!loading.education && educationLevels.length > 0 && (
                                        <select
                                          className="form-select"
                                          name="studyLevel"
                                          value={formData.studyLevel}
                                          onChange={handleInputChange}
                                          required
                                        >
                                          <option value="">Select Level</option>
                                          {educationLevels.map((level, index) => (
                                            <option key={index} value={level.title.toLowerCase()}>
                                              {level.title}
                                            </option>
                                          ))}
                                        </select>
                                      )}
                                      {!loading.education && educationLevels.length === 0 && (
                                        <div className="error-message">No education levels available</div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label>Stream? <span className="text-danger">*</span></label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        name="stream"
                                        value={formData.stream}
                                        onChange={handleInputChange}
                                        placeholder="Enter stream (max 50 chars)"
                                        maxLength="50"
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label>Percentage? <span className="text-danger">*</span></label>
                                      <input
                                        type="number"
                                        className="form-control"
                                        name="percentage"
                                        value={formData.percentage}
                                        onChange={handleInputChange}
                                        placeholder="Enter percentage (0-100)"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label>Total Budget? <span className="text-danger">*</span></label>
                                      <input
                                        type="number"
                                        className="form-control"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleInputChange}
                                        placeholder="Enter budget (max 15 digits)"
                                        maxLength="15"
                                        min="0"
                                        step="1000"
                                        required
                                      />
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="bottom-btn bottom-privious gap-3">
                          <button
                            type="button"
                            className="previous action-button color-btn btn"
                            onClick={handlePrevious}
                          >
                            Previous
                          </button>
                          <button
                            type="button"
                            className="next action-button color-btn btn"
                            onClick={handleNext}
                            disabled={loading.education}
                          >
                            Continue
                          </button>
                        </div>
                      </fieldset>
                    )}

                    {/* Step 3 */}
                    {currentStep === 3 && (
                      <fieldset>
                        <div className="form-card">
                          <div className="row justify-content-center">
                            <div className="col-lg-9 col-12">
                              <div className="right-side-heading">
                                <h2 className="fs-title">Got a question, feedback, or thoughts?</h2>
                                <p className="sub-title">Type your query here (max 500 characters).</p>
                              </div>
                            </div>
                          </div>

                          <div className="profile-form">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="form-group">
                                  <label>Query</label>
                                  <textarea
                                    className="form-control"
                                    name="query"
                                    value={formData.query}
                                    onChange={handleInputChange}
                                    placeholder="Type your query (max 500 chars)"
                                    maxLength="500"
                                    rows="4"
                                  />
                                </div>
                              </div>
                              {loading.submit && <div className="loading-message">Submitting application...</div>}
                            </div>
                          </div>
                        </div>

                        <div className="bottom-btn bottom-privious gap-3">
                          <button
                            type="button"
                            className="previous action-button color-btn btn"
                            onClick={handlePrevious}
                          >
                            Previous
                          </button>
                          <button
                            type="submit"
                            className="next action-button color-btn btn"
                            disabled={loading.submit}
                          >
                            {loading.submit ? 'Submitting...' : 'Submit'}
                          </button>
                        </div>
                      </fieldset>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplicationForm;