import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import intlTelInput from 'intl-tel-input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'intl-tel-input/build/css/intlTelInput.css';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import RightArrow from '../assets/images/right-arrow.svg';
import travelBannerImage from '../assets/images/sdgf.jpg';

const BASE_URL = 'https://express.studytraveler.com/backend/api';

// Custom styles for react-select component
const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: '0.375rem',
    borderColor: '#ced4da',
    boxShadow: 'none',
    '&:hover': { borderColor: '#adb5bd' },
  }),
  menu: (provided) => ({ ...provided, zIndex: 9999 }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? '#f8f9fa' : 'white',
    color: state.isSelected ? 'white' : '#212529',
    '&:hover': { backgroundColor: '#e9ecef' },
  }),
};

const TravelForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    interestedCountry: [],
    passengers: '',
    dateRange: { from: null, to: null },
    phoneNumber: '',
    email: '',
    description: '',
    honeypot: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    interestedCountry: '',
    passengers: '',
    dateRange: '',
    phoneNumber: '',
    email: '',
    description: '',
    honeypot: '',
  });

  const [countries, setCountries] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState({ countries: false });
  const [selectedCountryCode, setSelectedCountryCode] = useState('in');
  const phoneInputRef = useRef(null);
  const itiRef = useRef(null);

  // Fetch countries
  const fetchData = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, countries: true }));
      const response = await axios.get(`${BASE_URL}/countries/get`);
      if (response.data.success) setCountries(response.data.data);
    } catch (error) {
      toast.error(`Error fetching countries: ${error.message}`, { position: 'top-right' });
    } finally {
      setLoading((prev) => ({ ...prev, countries: false }));
    }
  }, []);

  useEffect(() => {
    fetchData();

    const input = phoneInputRef.current;
    if (input) {
      const iti = intlTelInput(input, {
        initialCountry: selectedCountryCode,
        separateDialCode: true,
        utilsScript:
          'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
      });
      itiRef.current = iti;
      input.addEventListener('countrychange', () => {
        setSelectedCountryCode(iti.getSelectedCountryData().iso2);
      });
      return () => iti.destroy();
    }
  }, [fetchData]);

  const countryOptions = useMemo(
    () =>
      countries
        .map((country) => ({ value: country.nicename, label: country.nicename }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [countries]
  );

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  }, []);

  const handleCountryChange = useCallback((selected) => {
    const selectedValues = selected ? selected.map((option) => option.value) : [];
    if (selectedValues.length > 3) {
      toast.error('You can select up to 3 countries only.', { position: 'top-right' });
      return;
    }
    setFormData((prev) => ({ ...prev, interestedCountry: selectedValues }));
    validateField('interestedCountry', selectedValues);
  }, []);

  const validateField = (name, value) => {
    let error = '';
    if (name === 'name') {
      if (!value.trim()) error = 'Please enter your name';
      else if (value.length < 2 || value.length > 50)
        error = 'Name must be between 2 and 50 characters';
    } else if (name === 'interestedCountry' && value.length === 0) {
      error = 'Please select at least one country';
    } else if (name === 'passengers') {
      if (!value || !/^\d+$/.test(value)) error = 'Please enter a valid number';
      else if (+value < 1 || +value > 50) error = 'Passengers must be between 1 and 50';
    } else if (name === 'dateRange') {
      if (!value.from || !value.to) error = 'Please select both start and end dates';
      else if (value.to < value.from) error = 'End date cannot be before start date';
    } else if (name === 'phoneNumber') {
      if (!value || !/^\d{6,15}$/.test(value))
        error = 'Please enter a valid phone number (6-15 digits)';
    } else if (name === 'email') {
      if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        error = 'Please enter a valid email address';
    } else if (name === 'description' && value.length > 500) {
      error = 'Description cannot exceed 500 characters';
    } else if (name === 'honeypot' && value) {
      error = 'Bot detected';
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      interestedCountry: [],
      passengers: '',
      dateRange: { from: null, to: null },
      phoneNumber: '',
      email: '',
      description: '',
      honeypot: '',
    });
    setErrors({
      name: '',
      interestedCountry: '',
      passengers: '',
      dateRange: '',
      phoneNumber: '',
      email: '',
      description: '',
      honeypot: '',
    });
    setSelectedCountryCode('in');
    if (phoneInputRef.current && itiRef.current) {
      itiRef.current.setCountry('in');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    validateField('name', formData.name);
    validateField('interestedCountry', formData.interestedCountry);
    validateField('passengers', formData.passengers);
    validateField('dateRange', formData.dateRange);
    validateField('phoneNumber', formData.phoneNumber);
    validateField('email', formData.email);
    validateField('description', formData.description);
    validateField('honeypot', formData.honeypot);

    if (formData.honeypot) {
      toast.error('Bot submission detected.', { position: 'top-right' });
      return;
    }

    const hasErrors = Object.values(errors).some((error) => error);
    if (hasErrors || formData.interestedCountry.length === 0) {
      toast.error('Please fix the errors in the form.', { position: 'top-right' });
      return;
    }

    setIsSubmitting(true);

    const phoneData = itiRef.current?.getSelectedCountryData();
    const phoneCode = phoneData ? `+${phoneData.dialCode}` : '+91';

    const fromDate = formData.dateRange.from;
    const toDate = formData.dateRange.to;
    const numberOfDays =
      fromDate && toDate
        ? Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1
        : 0;

    const payload = {
      name: formData.name,
      phone_code: phoneCode,
      phone_number: formData.phoneNumber,
      interested_country: formData.interestedCountry.join(','),
      number_of_passengers: parseInt(formData.passengers, 10),
      number_of_days: numberOfDays,
      email: formData.email,
      description: formData.description,
    };

    try {
      const response = await axios.post(`${BASE_URL}/travel-requests/submit`, payload);
      if (response.data.success) {
        toast.success('Travel request submitted successfully! 🎉', { position: 'top-right' });
        resetForm();
      } else {
        toast.error(response.data.message || 'Submission failed. Check your details.', { position: 'top-right' });
      }
    } catch (error) {
      toast.error(`Submission failed: ${error.response?.data?.message || 'Try again later.'}`, { position: 'top-right' });
      console.log('Error details:', error.response?.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer theme="colored" position="top-right" autoClose={3000} />
      <div className="main-section">
        <section className="page-banner">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="pagebanner-text">
                  <h1>Plan Your Trip</h1>
                  <p>Let us help you plan your perfect travel experience. Share your details below!</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-info">
          <div className="container">
            <div className="row main-row">
              <div className="bg-color">
                <div className="row form-row">
                  <div className="col-lg-5 ps-0">
                    <img
                      src={travelBannerImage}
                      alt="Travel Visual"
                      className="qs img-fluid w-100 h-100 object-fit-cover"
                    />
                  </div>
                  <div className="col-lg-7 pe-0">
                    <div className="contact-form">
                      <form onSubmit={handleSubmit} noValidate>
                        <div className="row">
                          {/* Name */}
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="name">Name *</label>
                              <input
                                id="name"
                                type="text"
                                className={`form-control ${errors.name ? 'border-red-500' : ''}`}
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., John Doe"
                              />
                              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                            </div>
                          </div>

                          {/* Interested Countries */}
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="interestedCountries">Interested Countries *</label>
                              <Select
                                id="interestedCountries"
                                isMulti
                                options={countryOptions}
                                value={countryOptions.filter((option) =>
                                  formData.interestedCountry.includes(option.value)
                                )}
                                onChange={handleCountryChange}
                                placeholder="Select up to 3 countries..."
                                styles={customSelectStyles}
                                isLoading={loading.countries}
                                noOptionsMessage={() => 'No countries found'}
                                maxMenuHeight={200}
                                isClearable
                                closeMenuOnSelect={false}
                                className={errors.interestedCountry ? 'border-red-500' : ''}
                              />
                              {errors.interestedCountry && (
                                <p className="text-sm text-red-600 mt-1">{errors.interestedCountry}</p>
                              )}
                            </div>
                          </div>

                          {/* Passengers */}
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="passengers">No. of Passengers *</label>
                              <input
                                id="passengers"
                                type="number"
                                className={`form-control ${errors.passengers ? 'border-red-500' : ''}`}
                                name="passengers"
                                value={formData.passengers}
                                onChange={handleChange}
                                min="1"
                                max="50"
                                placeholder="e.g., 2"
                              />
                              {errors.passengers && (
                                <p className="text-sm text-red-600 mt-1">{errors.passengers}</p>
                              )}
                            </div>
                          </div>

                          {/* Date Range Picker */}
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="dateRange">Select Dates *</label>
                              <DatePicker
                                id="dateRange"
                                selected={formData.dateRange.from}
                                onChange={(dates) => {
                                  const [start, end] = dates;
                                  setFormData((prev) => ({
                                    ...prev,
                                    dateRange: { from: start, to: end },
                                  }));
                                  validateField('dateRange', { from: start, to: end });
                                }}
                                startDate={formData.dateRange.from}
                                endDate={formData.dateRange.to}
                                selectsRange
                                placeholderText="Select from and to dates"
                                className={`form-control ${errors.dateRange ? 'border-red-500' : ''}`}
                                minDate={new Date()}
                                isClearable
                              />
                              {errors.dateRange && (
                                <p className="text-sm text-red-600 mt-1">{errors.dateRange}</p>
                              )}
                            </div>
                          </div>

                          {/* Phone Number */}
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="phoneNumber">Phone Number *</label>
                              <input
                                id="phoneNumber"
                                type="tel"
                                ref={phoneInputRef}
                                className={`form-control ${errors.phoneNumber ? 'border-red-500' : ''}`}
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={(e) => {
                                  const rawNumber = e.target.value.replace(/\D/g, '');
                                  setFormData((prev) => ({ ...prev, phoneNumber: rawNumber }));
                                  validateField('phoneNumber', rawNumber);
                                }}
                                placeholder="e.g., 1234567890"
                              />
                              {errors.phoneNumber && (
                                <p className="text-sm text-red-600 mt-1">{errors.phoneNumber}</p>
                              )}
                            </div>
                          </div>

                          {/* Email */}
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="email">Email *</label>
                              <input
                                id="email"
                                type="email"
                                className={`form-control ${errors.email ? 'border-red-500' : ''}`}
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="e.g., your.email@example.com"
                              />
                              {errors.email && (
                                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                              )}
                            </div>
                          </div>

                          {/* Description */}
                          <div className="col-md-12">
                            <div className="form-group">
                              <label htmlFor="description">Description</label>
                              <textarea
                                id="description"
                                className={`form-control ${errors.description ? 'border-red-500' : ''}`}
                                name="description"
                                rows={5}
                                maxLength={500}
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Any special requests or description? (Optional, max 500 characters)"
                              />
                              {errors.description && (
                                <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                              )}
                              <p className="text-sm text-gray-500 mt-1">
                                {formData.description.length}/500 characters
                              </p>
                            </div>
                          </div>

                          {/* Honeypot */}
                          <div className="col-md-12" style={{ display: 'none' }}>
                            <div className="form-group">
                              <label htmlFor="honeypot">Website</label>
                              <input
                                id="honeypot"
                                type="text"
                                className="form-control"
                                name="honeypot"
                                value={formData.honeypot}
                                onChange={handleChange}
                                tabIndex="-1"
                                autoComplete="off"
                              />
                            </div>
                          </div>

                          {/* Submit */}
                          <div className="col-12">
                            <div className="form-action">
                              <button
                                type="submit"
                                className="color-btn btn"
                                disabled={isSubmitting || loading.countries}
                              >
                                {isSubmitting ? (
                                  <span>
                                    Sending...{' '}
                                    <span
                                      className="spinner-border spinner-border-sm"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                  </span>
                                ) : (
                                  <>
                                    Submit Request <img src={RightArrow} alt="Right Arrow" />
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TravelForm;
