import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import ProtectedPageLayout from '../components/layout/ProtectedPageLayout';
import LoadingState from '../components/ui/LoadingState';
import config from '../config/config';
import photoUploadImg from '../assets/images/photo-upload.svg'; // Adjust path as needed

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
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];

const lowerAllCountries = ALL_COUNTRIES.map(c => c.toLowerCase().trim());
const sortedAllCountries = ['united states', ...lowerAllCountries.filter(c => c !== 'united states').sort((a, b) => a.localeCompare(b))];

const capitalizeCountry = (country) => {
  return country.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const EditWorkApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

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
    resume: null, // Existing resume filename or null
    cover_letter: null, // Existing cover letter filename or null
    new_resume: null, // New resume file to upload
    new_cover_letter: null, // New cover letter file to upload
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullName, setFullName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);
  const [resumeValidationError, setResumeValidationError] = useState('');
  const [coverLetterValidationError, setCoverLetterValidationError] = useState('');

  const userId = JSON.parse(localStorage.getItem('user'))?.id || 'N/A';
  const getToken = () => localStorage.getItem('accessToken');

  // Fetch user data
  const fetchUserData = async () => {
    const token = getToken();
    if (!token || !isAuthenticated || !userId) {
      toast.error('Please log in to continue.');
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
      console.error('Error fetching user data:', err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        toast.error('Failed to load user data');
      }
    }
  };

  // Fetch countries
  const fetchCountries = async () => {
    const token = getToken();
    if (!token || !isAuthenticated) {
      toast.error('Please log in to fetch countries.');
      logout();
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(`${config.baseURL}/countries/get`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setCountries(
          response.data.data.map((country) =>
            country.nicename.trim().toLowerCase()
          )
        );
      } else {
        throw new Error(response.data.message || 'Failed to fetch countries');
      }
    } catch (err) {
      console.error('Error fetching countries:', err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        toast.error(err.message || 'Failed to load countries');
      }
    }
  };

  // Fetch education levels
  const fetchEducationLevels = async () => {
    const token = getToken();
    if (!token || !isAuthenticated) {
      toast.error('Please log in to fetch education levels.');
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
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const levels = response.data.data.map((level) => level.title);
        setEducationLevels(levels);
      } else {
        throw new Error(response.data.message || 'Failed to fetch education levels');
      }
    } catch (err) {
      console.error('Error fetching education levels:', err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        toast.error(err.message || 'Failed to load education levels');
      }
    }
  };

  // Fetch application details
  const fetchApplication = async () => {
    const token = getToken();
    if (!token || !isAuthenticated || !id) {
      toast.error('Please log in or provide a valid application ID.');
      logout();
      navigate('/login');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${config.baseURL}/application/details/get`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          params: {
            application_id: id,
          },
        }
      );

      if (response.data.success) {
        const appData = response.data.data;
        if (appData && appData.purpose === 'Work') {
          setApplication({
            application_id: appData.id || id,
            purpose: 'Work',
            preferred_countries: appData.preferred_countries
              ? appData.preferred_countries
                  .split(',')
                  .map((country) => country.trim().toLowerCase())
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
      console.error('Error fetching application:', err);
      setError(err.message || 'Failed to load application');
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        toast.error(err.message || 'Failed to load application');
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
      fetchCountries();
      fetchEducationLevels();
      fetchApplication();
    } else {
      toast.error('Please log in to access this page.');
      navigate('/login');
    }
  }, [id, isAuthenticated, navigate, logout]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplication((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file changes
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!file) {
      setApplication((prev) => ({ ...prev, [field]: null }));
      if (field === 'new_resume') setResumeValidationError('');
      else setCoverLetterValidationError('');
      return;
    }

    if (file.type !== 'application/pdf') {
      const error = 'File must be a PDF';
      if (field === 'new_resume') setResumeValidationError(error);
      else setCoverLetterValidationError(error);
      return;
    }

    if (file.size > maxSize) {
      const error = 'File size exceeds 5MB';
      if (field === 'new_resume') setResumeValidationError(error);
      else setCoverLetterValidationError(error);
      return;
    }

    setApplication((prev) => ({ ...prev, [field]: file }));
    if (field === 'new_resume') setResumeValidationError('');
    else setCoverLetterValidationError('');
  };

  // Handle country selection for preferred_countries
  const handleCountry = (country) => {
    const normalizedCountry = country.trim().toLowerCase();
    setApplication((prev) => {
      const newCountries = prev.preferred_countries.includes(normalizedCountry)
        ? prev.preferred_countries.filter((c) => c !== normalizedCountry)
        : prev.preferred_countries.length < 3
        ? [...prev.preferred_countries, normalizedCountry]
        : prev.preferred_countries;
      return { ...prev, preferred_countries: newCountries };
    });
  };

  // Toggle country dropdown for preferred_countries
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token || !isAuthenticated) {
      toast.error('Please log in to update the application.');
      logout();
      navigate('/login');
      return;
    }

    // Required field validation
    if (
      !application.highest_education ||
      !application.designation ||
      !application.work_experience ||
      application.preferred_countries.length === 0 ||
      !application.age ||
      !application.current_country
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }

    // Work experience validation
    const validWorkExperienceOptions = ['0-1', '1-3', '3-5', '5+'];
    if (!validWorkExperienceOptions.includes(application.work_experience)) {
      toast.error('Please select a valid work experience option.');
      return;
    }

    // Age validation
    const age = parseInt(application.age);
    if (isNaN(age) || age < 18 || age > 80) {
      toast.error('Age must be a number between 18 and 80.');
      return;
    }

    // File validation
    if (application.new_resume && resumeValidationError) {
      toast.error(`Resume: ${resumeValidationError}`);
      return;
    }
    if (application.new_cover_letter && coverLetterValidationError) {
      toast.error(`Cover Letter: ${coverLetterValidationError}`);
      return;
    }

    // Prepare FormData for submission
    const formData = new FormData();
    formData.append('application_id', parseInt(application.application_id)); // Convert to number
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

    // Debug FormData contents
    for (let [key, value] of formData.entries()) {
      console.log(`FormData: ${key} = ${value}`);
    }

    try {
      const response = await axios.post(
        `${config.baseURL}/application/update`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success('Work application updated successfully!');
        setTimeout(() => {
          navigate('/work-applications');
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to update application');
      }
    } catch (err) {
      console.error('Error updating application:', err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        toast.error(err.message || 'Failed to update application');
      }
    }
  };

  // Sorted preferred countries from API
  const sortedPreferredCountries = ['united states', ...countries.filter(c => c !== 'united states').sort((a, b) => a.localeCompare(b))];

  // Loading state
  if (loading) {
    return (
      <ProtectedPageLayout fullName={fullName} userId={userId}>
        <LoadingState label="Loading application..." height={240} />
        <ToastContainer theme="colored" position="top-right" autoClose={3000} />
      </ProtectedPageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <ProtectedPageLayout fullName={fullName} userId={userId}>
        <div className="alert alert-danger" role="alert">
          <h4>Error loading application</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchApplication}>
            Try Again
          </button>
        </div>
        <ToastContainer theme="colored" position="top-right" autoClose={3000} />
      </ProtectedPageLayout>
    );
  }

  // Sort countries with United States first
  const sortedCurrentCountries = sortedAllCountries;

  return (
    <ProtectedPageLayout fullName={fullName} userId={userId}>
                      <div className="single-area">
                        <h5 className="mb-0">Edit Work Application</h5>
                      </div>
                      <div className="setting-personal-details">
                        <h5>Application #{application.application_id}</h5>
                        <form onSubmit={handleSubmit}>
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="single-input">
                                <label htmlFor="highest_education">
                                  Highest Education <span className="text-danger">*</span>
                                </label>
                                <select
                                  id="highest_education"
                                  name="highest_education"
                                  value={application.highest_education}
                                  onChange={handleInputChange}
                                  required
                                >
                                  <option value="">Select Education Level</option>
                                  {educationLevels.map((level) => (
                                    <option key={level} value={level.toLowerCase()}>
                                      {level}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="single-input">
                                <label htmlFor="designation">
                                  Designation <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  id="designation"
                                  name="designation"
                                  value={application.designation}
                                  onChange={handleInputChange}
                                  placeholder="Enter Designation"
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="single-input">
                                <label htmlFor="work_experience">
                                  Work Experience (years) <span className="text-danger">*</span>
                                </label>
                                <select
                                  id="work_experience"
                                  name="work_experience"
                                  value={application.work_experience}
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
                            <div className="col-lg-6">
                              <div className="single-input">
                                <label htmlFor="age">
                                  Age <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="number"
                                  id="age"
                                  name="age"
                                  value={application.age}
                                  onChange={handleInputChange}
                                  placeholder="Enter Age"
                                  min="18"
                                  max="80"
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="single-input">
                                <label>
                                  Preferred Countries (Select up to 3) <span className="text-danger">*</span>
                                </label>
                                <div className="custom-multiselect">
                                  <button
                                    type="button"
                                    className="multiselect-trigger"
                                    onClick={toggleDropdown}
                                    aria-expanded={isDropdownOpen}
                                    aria-controls="country-dropdown"
                                  >
                                    {application.preferred_countries.length > 0
                                      ? `${application.preferred_countries
                                          .map(
                                            (c) => capitalizeCountry(c)
                                          )
                                          .join(', ')} (${application.preferred_countries.length}/3)`
                                      : 'Select Countries'}
                                    <span className="dropdown-arrow">{isDropdownOpen ? '▲' : '▼'}</span>
                                  </button>
                                  {isDropdownOpen && (
                                    <div className="multiselect-dropdown" id="country-dropdown">
                                      {sortedPreferredCountries.map((country) => {
                                        const isChecked = application.preferred_countries.includes(country);
                                        return (
                                          <label key={country} className="multiselect-option">
                                            <input
                                              type="checkbox"
                                              value={country}
                                              checked={isChecked}
                                              onChange={() => handleCountry(country)}
                                              disabled={
                                                application.preferred_countries.length >= 3 &&
                                                !isChecked
                                              }
                                              aria-label={`Select ${country}`}
                                            />
                                            <span className="checkbox-custom"></span>
                                            {capitalizeCountry(country)}
                                          </label>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="single-input">
                                <label htmlFor="current_country">
                                  Current Country <span className="text-danger">*</span>
                                </label>
                                <select
                                  id="current_country"
                                  name="current_country"
                                  value={application.current_country}
                                  onChange={handleInputChange}
                                  className="custom-select"
                                  required
                                >
                                  <option value="">Select Current Country</option>
                                  {sortedCurrentCountries.map((country) => (
                                    <option key={country} value={country}>
                                      {capitalizeCountry(country)}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="single-input">
                                <label htmlFor="current_state">Current State</label>
                                <input
                                  type="text"
                                  id="current_state"
                                  name="current_state"
                                  value={application.current_state}
                                  onChange={handleInputChange}
                                  placeholder="Enter Current State"
                                  maxLength="50"
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="single-input upload-file">
                                <label htmlFor="new_resume">
                                  Resume {application.resume ? '(Current: ' + application.resume + ')' : ''}{' '}
                                  <span className="text-danger">*</span>
                                </label>
                                <label htmlFor="new_resume" className="form-label">
                                  <div className="file-inner">
                                    <span className="upload-file-center">
                                      <img src={photoUploadImg} alt="Upload Icon" />
                                    </span>
                                  </div>
                                  <span className="upload-text">Upload New Resume</span>
                                </label>
                                <input
                                  className="form-control"
                                  type="file"
                                  id="new_resume"
                                  name="new_resume"
                                  onChange={(e) => handleFileChange(e, 'new_resume')}
                                  accept=".pdf"
                                />
                                <small className="text-muted">Supported format: PDF (max 5MB)</small>
                                {resumeValidationError && (
                                  <div className="alert alert-danger mt-2" role="alert">
                                    {resumeValidationError}
                                  </div>
                                )}
                                {application.new_resume && (
                                  <div className="mt-2 text-success">
                                    Selected: {application.new_resume.name}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="single-input upload-file">
                                <label htmlFor="new_cover_letter">
                                  Cover Letter {application.cover_letter ? '(Current: ' + application.cover_letter + ')' : ''}
                                </label>
                                <label htmlFor="new_cover_letter" className="form-label">
                                  <div className="file-inner">
                                    <span className="upload-file-center">
                                      <img src={photoUploadImg} alt="Upload Icon" />
                                    </span>
                                  </div>
                                  <span className="upload-text">Upload New Cover Letter</span>
                                </label>
                                <input
                                  className="form-control"
                                  type="file"
                                  id="new_cover_letter"
                                  name="new_cover_letter"
                                  onChange={(e) => handleFileChange(e, 'new_cover_letter')}
                                  accept=".pdf"
                                />
                                <small className="text-muted">Supported format: PDF (max 5MB)</small>
                                {coverLetterValidationError && (
                                  <div className="alert alert-danger mt-2" role="alert">
                                    {coverLetterValidationError}
                                  </div>
                                )}
                                {application.new_cover_letter && (
                                  <div className="mt-2 text-success">
                                    Selected: {application.new_cover_letter.name}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="single-input">
                                <label htmlFor="query">Query</label>
                                <textarea
                                  id="query"
                                  name="query"
                                  value={application.query}
                                  onChange={handleInputChange}
                                  placeholder="Enter any additional queries or notes"
                                  rows="4"
                                  maxLength="500"
                                />
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="single-input btn-gp">
                                <button type="submit" className="color-btn btn">
                                  Save Changes
                                </button>
                                <Link to="/work-applications" className="border-btn btn">
                                  Cancel
                                </Link>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
      <ToastContainer theme="colored" position="top-right" autoClose={3000} />
    </ProtectedPageLayout>
  );
};

export default EditWorkApplication;