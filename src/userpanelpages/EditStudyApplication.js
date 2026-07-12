import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import ProtectedPageLayout from '../components/layout/ProtectedPageLayout';
import LoadingState from '../components/ui/LoadingState';
import config from '../config/config';

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

const EditStudyApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [studyLevels, setStudyLevels] = useState([]);
  const [countries, setCountries] = useState([]);

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

  // Fetch study levels
  const fetchStudyLevels = async () => {
    const token = getToken();
    if (!token || !isAuthenticated) {
      toast.error('Please log in to fetch study levels.');
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
        console.log('Fetched study levels:', levels);
        setStudyLevels(levels);
      } else {
        throw new Error(response.data.message || 'Failed to fetch study levels');
      }
    } catch (err) {
      console.error('Error fetching study levels:', err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        toast.error(err.message || 'Failed to load study levels');
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

      console.log('Application API response:', response.data);
      if (response.data.success) {
        const appData = response.data.data;
        console.log('Application data:', appData);
        if (appData && appData.purpose === 'Study') {
          setApplication({
            application_id: appData.id || id,
            purpose: 'Study',
            preferred_countries: appData.preferred_countries
              ? appData.preferred_countries
                  .split(',')
                  .map((country) => country.trim().toLowerCase())
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

  // Debug application state changes
  useEffect(() => {
    console.log('Application state:', application);
  }, [application]);

  // Debug current_country
  useEffect(() => {
    console.log('Current country:', application.current_country);
    console.log('Preferred countries:', application.preferred_countries);
  }, [application.current_country, application.preferred_countries]);

  // Initial data fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
      fetchCountries();
      fetchStudyLevels();
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

    if (
      !application.intrested_in_study_level ||
      !application.highest_education ||
      !application.percentage ||
      !application.total_budget ||
      application.preferred_countries.length === 0 ||
      !application.age ||
      !application.stream
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const percentage = parseFloat(application.percentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      toast.error('Percentage must be a number between 0 and 100.');
      return;
    }

    const budget = parseFloat(application.total_budget);
    if (isNaN(budget) || budget < 0) {
      toast.error('Total budget must be a positive number.');
      return;
    }

    const age = parseInt(application.age);
    if (isNaN(age) || age < 0) {
      toast.error('Age must be a positive number.');
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
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success('Study application updated successfully!');
        setTimeout(() => {
          navigate('/study-applications');
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

  return (
    <ProtectedPageLayout fullName={fullName} userId={userId}>
                      <div className="single-area">
                        <h5 className="mb-0">Edit Study Application</h5>
                      </div>
                      <div className="setting-personal-details">
                        <h5>Application #{application.application_id}</h5>
                        <form onSubmit={handleSubmit}>
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="single-input">
                                <label htmlFor="intrested_in_study_level">
                                  Interested Study Level <span className="text-danger">*</span>
                                </label>
                                <select
                                  id="intrested_in_study_level"
                                  name="intrested_in_study_level"
                                  value={application.intrested_in_study_level}
                                  onChange={handleInputChange}
                                  required
                                >
                                  <option value="">Select Study Level</option>
                                  {studyLevels.map((level) => (
                                    <option key={level} value={level.toLowerCase()}>
                                      {level}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
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
                                  {studyLevels.map((level) => (
                                    <option key={level} value={level.toLowerCase()}>
                                      {level}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="single-input">
                                <label htmlFor="stream">
                                  Stream <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  id="stream"
                                  name="stream"
                                  value={application.stream}
                                  onChange={handleInputChange}
                                  placeholder="Enter Stream (e.g., Computer Science)"
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="single-input">
                                <label htmlFor="percentage">
                                  Percentage <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="number"
                                  id="percentage"
                                  name="percentage"
                                  value={application.percentage}
                                  onChange={handleInputChange}
                                  placeholder="Enter Percentage"
                                  min="0"
                                  max="100"
                                  step="0.1"
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="single-input">
                                <label htmlFor="total_budget">
                                  Total Budget <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="number"
                                  id="total_budget"
                                  name="total_budget"
                                  value={application.total_budget}
                                  onChange={handleInputChange}
                                  placeholder="Enter Budget"
                                  min="0"
                                  required
                                />
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
                                  min="0"
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="single-input">
                                <label>
                                  Preferred Countries (Select up to 3){' '}
                                  <span className="text-danger">*</span>
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
                                          .map((c) => capitalizeCountry(c))
                                          .join(', ')} (${
                                          application.preferred_countries.length
                                        }/3)`
                                      : 'Select Countries'}
                                    <span className="dropdown-arrow">
                                      {isDropdownOpen ? '▲' : '▼'}
                                    </span>
                                  </button>
                                  {isDropdownOpen && (
                                    <div className="multiselect-dropdown" id="country-dropdown">
                                      {sortedPreferredCountries.map((country) => {
                                        const isChecked = application.preferred_countries.includes(country);
                                        console.log(
                                          `Country: ${country}, Checked: ${isChecked}, In preferred_countries: ${application.preferred_countries}`
                                        );
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
                                <label htmlFor="current_country">Current Country</label>
                                <select
                                  id="current_country"
                                  name="current_country"
                                  value={application.current_country}
                                  onChange={handleInputChange}
                                  className="custom-select"
                                >
                                  <option value="">Select Current Country</option>
                                  {sortedAllCountries.map((country) => (
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
                                />
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
                                  maxLength={500}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="single-input btn-gp">
                                <button type="submit" className="color-btn btn">
                                  Save Changes
                                </button>
                                <Link to="/study-applications" className="border-btn btn">
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

export default EditStudyApplication;