import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import config from '../config/config';
import profileimg from '../assets/images/user.png';
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Sidebar';
import EyeBtn from "../assets/images/pass-view.svg";
import EyeBtnOff from "../assets/images/pass-view.svg";

const IMAGE_BASE_URL = 'https://express.studytraveler.com/uploads/users/';

const MyAccount = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    highestEducation: '',
    preferredCountry: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileImage, setProfileImage] = useState(profileimg);
  const [isSocialLogin, setIsSocialLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const phoneInputRef = useRef(null);
  const phoneInstance = useRef(null);

  const createAuthAxios = () => {
    const token = localStorage.getItem('accessToken');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || !userData?.id || !isAuthenticated) {
      toast.error('Please log in to continue.', { toastId: 'auth-error', autoClose: 5000 });
      logout();
      navigate('/login');
      throw new Error('Authentication credentials not found');
    }

    return {
      instance: axios.create({
        baseURL: config.baseURL,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }),
      userId: userData.id,
    };
  };

  const fetchInitialData = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to access this page.', { toastId: 'auth-error', autoClose: 5000 });
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { instance, userId } = createAuthAxios();

      const userResponse = await instance.post('/user/details/get', { user_id: userId });

      const userDataFromApi = userResponse.data.data;

      setProfileData({
        fullName: userDataFromApi.name || '',
        email: userDataFromApi.email || '',
        phone: `${userDataFromApi.phone_code || ''}${userDataFromApi.phone_number || ''}`,
        highestEducation: userDataFromApi.education || '',
        preferredCountry: userDataFromApi.country || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      setIsSocialLogin(userDataFromApi.auth_provider && ['google', 'facebook'].includes(userDataFromApi.auth_provider.toLowerCase()));

      if (userDataFromApi.image) {
        setProfileImage(`${IMAGE_BASE_URL}${userDataFromApi.image}`);
      } else {
        setProfileImage(profileimg);
      }
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError(err.message || 'Failed to load profile data');
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.', { toastId: 'session-expired', autoClose: 5000 });
        logout();
        navigate('/login');
      } else {
        toast.error(err.message || 'Failed to load profile data', {
          toastId: 'fetch-error',
          autoClose: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB', {
        toastId: 'image-size-error',
        position: 'top-right',
        autoClose: 5000,
      });
      return;
    }

    try {
      const localImageUrl = URL.createObjectURL(file);
      setProfileImage(localImageUrl);

      const { instance, userId } = createAuthAxios();

      const formData = new FormData();
      formData.append('image', file);

      const uploadInstance = axios.create({
        baseURL: config.baseURL,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadResponse = await uploadInstance.post('/user/details/upload-image', formData);

      if (uploadResponse.data.success) {
        const updatedUserResponse = await instance.post('/user/details/get', { user_id: userId });

        if (updatedUserResponse.data.success && updatedUserResponse.data.data.image) {
          const newImageUrl = `${IMAGE_BASE_URL}${updatedUserResponse.data.data.image}`;
          setProfileImage(newImageUrl);
          URL.revokeObjectURL(localImageUrl);
          toast.success('Profile image uploaded successfully', {
            toastId: 'image-upload-success',
            position: 'top-right',
            autoClose: 3000,
          });
        } else {
          throw new Error('Failed to retrieve updated image data');
        }
      } else {
        setProfileImage(profileimg);
        throw new Error(uploadResponse.data.message || 'Image upload failed');
      }
    } catch (err) {
      console.error('Image upload error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setProfileImage(profileimg);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.', { toastId: 'session-expired', autoClose: 5000 });
        logout();
        navigate('/login');
      } else {
        toast.error(err.response?.data?.message || 'Failed to upload image', {
          toastId: 'image-upload-error',
          position: 'top-right',
          autoClose: 5000,
        });
      }
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [isAuthenticated, navigate, logout]);

  useEffect(() => {
    if (phoneInputRef.current && !loading) {
      if (phoneInstance.current) {
        phoneInstance.current.destroy();
      }

      phoneInstance.current = intlTelInput(phoneInputRef.current, {
        initialCountry: 'us',
        preferredCountries: ['us', 'gb', 'au', 'in', 'de'],
        separateDialCode: true,
        utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.15/js/utils.js',
      });

      if (profileData.phone) {
        phoneInstance.current.setNumber(profileData.phone);
      }

      return () => {
        if (phoneInstance.current) {
          phoneInstance.current.destroy();
        }
      };
    }
  }, [loading, profileData.phone]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!profileData.fullName.trim()) {
      errors.fullName = 'Please enter your full name';
    }
    if (!phoneInstance.current || !phoneInstance.current.isValidNumber()) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!isSocialLogin && (profileData.newPassword || profileData.confirmPassword || profileData.currentPassword)) {
      if (!profileData.currentPassword) {
        errors.currentPassword = 'Please enter your current password';
      }
      if (!profileData.newPassword) {
        errors.newPassword = 'Please enter a new password';
      } else if (profileData.newPassword.length < 8) {
        errors.newPassword = 'Password must be at least 8 characters';
      }
      if (!profileData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your new password';
      } else if (profileData.newPassword !== profileData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const inputElement = document.getElementById(firstErrorField);
      if (inputElement) inputElement.focus();
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please log in to update your profile.', { toastId: 'auth-error', autoClose: 5000 });
      logout();
      navigate('/login');
      return;
    }

    if (!validateForm()) return;

    setSubmitting(true);
    setValidationErrors({});

    try {
      const { instance } = createAuthAxios();

      const fullNumber = phoneInstance.current.getNumber();
      const phoneCode = phoneInstance.current.getSelectedCountryData().dialCode
        ? `+${phoneInstance.current.getSelectedCountryData().dialCode}`
        : '';
      const phoneNumber = fullNumber.replace(phoneCode, '');

      const updatePayload = {
        name: profileData.fullName,
        email: profileData.email,
        phone_code: phoneCode,
        phone_number: phoneNumber,
        education: profileData.highestEducation,
        country: profileData.preferredCountry,
        password: '',
      };

      const isPasswordUpdate = !isSocialLogin && profileData.newPassword && profileData.confirmPassword;
      if (isPasswordUpdate) {
        updatePayload.current_password = profileData.currentPassword;
        updatePayload.new_password = profileData.newPassword;
        updatePayload.password = profileData.newPassword;
      }

      const response = await instance.post('/user/details/update', updatePayload);

      if (response.data.success) {
        const successMessage = isPasswordUpdate
          ? 'Password updated successfully'
          : response.data.message || 'Profile updated successfully';
        toast.success(successMessage, {
          toastId: 'profile-update-success',
          position: 'top-right',
          autoClose: 3000,
        });

        setProfileData((prev) => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));

        await fetchInitialData();
      } else {
        throw new Error(response.data.message || 'Update failed');
      }
    } catch (err) {
      console.error('Update error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.', { toastId: 'session-expired', autoClose: 5000 });
        logout();
        navigate('/login');
      } else if (err.response?.data?.errors) {
        const apiErrors = err.response.data.errors;
        const newValidationErrors = {};

        apiErrors.forEach((error) => {
          let field = error.path;
          if (field === 'name') field = 'fullName';
          else if (field === 'education') field = 'highestEducation';
          else if (field === 'country') field = 'preferredCountry';
          else if (['phone_code', 'phone_number'].includes(field)) field = 'phone';
          else if (field === 'email') return; // Email not editable, skip
          else if (field === 'current_password') field = 'currentPassword';
          else if (['new_password', 'password'].includes(field)) field = 'newPassword';
          // Note: confirmPassword errors are handled client-side only
          newValidationErrors[field] = error.msg;
        });

        setValidationErrors(newValidationErrors);

        const firstErrorField = Object.keys(newValidationErrors)[0];
        if (firstErrorField) {
          const inputElement = document.getElementById(firstErrorField);
          if (inputElement) inputElement.focus();
        }

        toast.error('Please correct the errors in the form.', {
          toastId: 'form-validation-error',
          position: 'top-right',
          autoClose: 5000,
        });
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
        toast.error(errorMessage, {
          toastId: 'profile-update-error',
          position: 'top-right',
          autoClose: 5000,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="colored"
          style={{ zIndex: 9999 }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        <h4>Error loading profile</h4>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchInitialData}>
          Try Again
        </button>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="colored"
          style={{ zIndex: 9999 }}
        />
      </div>
    );
  }

  return (
    <div className="main-section">
      <section className="profile-section">
        <div className="container">
          <div className="row justify-content-center">
            <Sidebar fullName={profileData.fullName} userId={userId} />

            <div className="col-xl-9 col-lg-8">
              <div className="tab-content">
                <div className="setting-tab">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="single-area">
                        <h5 className="mb-0">Profile Details</h5>
                      </div>

                      <div className="single-area">
                        <div className="file-upload">
                          <div className="img-area">
                            <img src={profileImage} alt="Profile" onError={() => setProfileImage(profileimg)} />
                          </div>
                          <div className="right-area">
                            <p className="title">Upload profile photo:</p>
                            <label className="file">
                              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={submitting} />
                              <span className="file-custom" />
                            </label>
                            <p className="mdr">Choose a photo (JPG, PNG, max 5MB)</p>
                          </div>
                        </div>
                      </div>

                      <div className="single-area justify-content-start">
                        <div className="icon-area">
                          <i className="fa-solid fa-envelope" />
                        </div>
                        <p className="mdr">{profileData.email} (Cannot be changed)</p>
                      </div>

                      <div className="setting-personal-details">
                        <h5>Account Details</h5>
                        <form onSubmit={handleSubmit}>
                          <div className="row">
                            <div className="col-lg-12 mb-4">
                              <h6>Personal Information</h6>
                            </div>

                            <div className="col-lg-6">
                              <div className="single-input">
                                <label htmlFor="fullName">
                                  Full Name <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  id="fullName"
                                  name="fullName"
                                  value={profileData.fullName}
                                  onChange={handleInputChange}
                                  placeholder="Enter Full Name"
                                  maxLength={65}
                                  className={validationErrors.fullName ? 'is-invalid' : ''}
                                  disabled={submitting}
                                />
                                {validationErrors.fullName && (
                                  <div className="invalid-feedback">{validationErrors.fullName}</div>
                                )}
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <div className="single-input">
                                <label htmlFor="phone">
                                  Phone Number <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="tel"
                                  id="phone"
                                  ref={phoneInputRef}
                                  placeholder="Enter Phone Number"
                                  className={validationErrors.phone ? 'is-invalid' : ''}
                                  disabled={submitting}
                                />
                                {validationErrors.phone && (
                                  <div className="invalid-feedback">{validationErrors.phone}</div>
                                )}
                              </div>
                            </div>

                            {isSocialLogin ? (
                              <div className="col-lg-12 mt-4 mb-4">
                                <div className="alert alert-info" role="alert">
                                  <p>
                                    You registered with a social account (Google or Facebook). You can only sign in using
                                    your social provider. Password management is not available.
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="col-lg-12 mt-4 mb-4">
                                  <h6>Password Management (Optional)</h6>
                                  <p className="text-muted small">Leave blank to keep your current password</p>
                                </div>

                                <div className="col-lg-4">
                                  <div className="single-input position-relative">
                                    <label htmlFor="currentPassword">Current Password</label>
                                    <input
                                      type={showPasswords.currentPassword ? 'text' : 'password'}
                                      id="currentPassword"
                                      name="currentPassword"
                                      value={profileData.currentPassword}
                                      onChange={handleInputChange}
                                      placeholder="Enter Current Password"
                                      className={validationErrors.currentPassword ? 'is-invalid' : ''}
                                      disabled={submitting}
                                    />
                                    <button
                                      type="button"
                                      className="password-toggle-btn"
                                      onClick={() => togglePasswordVisibility('currentPassword')}
                                      aria-label={showPasswords.currentPassword ? 'Hide password' : 'Show password'}
                                      style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '65%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                      }}
                                      disabled={submitting}
                                    >
                                      <img
                                        src={showPasswords.currentPassword ? EyeBtnOff : EyeBtn}
                                        alt="Toggle password visibility"
                                        style={{ width: '20px', height: '20px' }}
                                      />
                                    </button>
                                    {validationErrors.currentPassword && (
                                      <div className="invalid-feedback">{validationErrors.currentPassword}</div>
                                    )}
                                  </div>
                                </div>

                                <div className="col-lg-4">
                                  <div className="single-input position-relative">
                                    <label htmlFor="newPassword">New Password</label>
                                    <input
                                      type={showPasswords.newPassword ? 'text' : 'password'}
                                      id="newPassword"
                                      name="newPassword"
                                      value={profileData.newPassword}
                                      onChange={handleInputChange}
                                      placeholder="Enter New Password"
                                      className={validationErrors.newPassword ? 'is-invalid' : ''}
                                      disabled={submitting}
                                    />
                                    <button
                                      type="button"
                                      className="password-toggle-btn"
                                      onClick={() => togglePasswordVisibility('newPassword')}
                                      aria-label={showPasswords.newPassword ? 'Hide password' : 'Show password'}
                                      style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '65%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                      }}
                                      disabled={submitting}
                                    >
                                      <img
                                        src={showPasswords.newPassword ? EyeBtnOff : EyeBtn}
                                        alt="Toggle password visibility"
                                        style={{ width: '20px', height: '20px' }}
                                      />
                                    </button>
                                    {validationErrors.newPassword && (
                                      <div className="invalid-feedback">{validationErrors.newPassword}</div>
                                    )}
                                  </div>
                                </div>

                                <div className="col-lg-4">
                                  <div className="single-input position-relative">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                      type={showPasswords.confirmPassword ? 'text' : 'password'}
                                      id="confirmPassword"
                                      name="confirmPassword"
                                      value={profileData.confirmPassword}
                                      onChange={handleInputChange}
                                      placeholder="Confirm New Password"
                                      className={validationErrors.confirmPassword ? 'is-invalid' : ''}
                                      disabled={submitting}
                                    />
                                    <button
                                      type="button"
                                      className="password-toggle-btn"
                                      onClick={() => togglePasswordVisibility('confirmPassword')}
                                      aria-label={showPasswords.confirmPassword ? 'Hide password' : 'Show password'}
                                      style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '65%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                      }}
                                      disabled={submitting}
                                    >
                                      <img
                                        src={showPasswords.confirmPassword ? EyeBtnOff : EyeBtn}
                                        alt="Toggle password visibility"
                                        style={{ width: '20px', height: '20px' }}
                                      />
                                    </button>
                                    {validationErrors.confirmPassword && (
                                      <div className="invalid-feedback">{validationErrors.confirmPassword}</div>
                                    )}
                                  </div>
                                </div>
                              </>
                            )}

                            <div className="col-lg-12 mt-4">
                              <div className="single-input">
                                <button
                                  type="submit"
                                  className="submit action-button color-btn btn"
                                  disabled={submitting}
                                >
                                  {submitting ? (
                                    <>
                                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                      Updating...
                                    </>
                                  ) : (
                                    'Update Account'
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
          </div>
        </div>
      </section>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default MyAccount;