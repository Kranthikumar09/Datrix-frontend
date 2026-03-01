import React, { useEffect, useState, useRef, useCallback } from "react";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import GoogleLogo from "../assets/images/g-logo.svg";
import FacebookLogo from "../assets/images/facebookk.svg";
import WhatsappImg from "../assets/images/whstsapp-img.svg";
import EyeBtn from "../assets/images/pass-view.svg";
import EyeBtnOff from "../assets/images/pass-view.svg";
import config from "../config/config";

// Constants
const API_URL = `${config.baseURL}/user/register`;
const GOOGLE_AUTH_URL = `${config.baseURL}/user/google-auth/login`;
const FACEBOOK_AUTH_URL = `${config.baseURL}/user/facebook-auth/login`;
const NAME_MIN_LENGTH = 5;
const NAME_MAX_LENGTH = 65;
const PHONE_MIN_LENGTH = 8;
const PHONE_MAX_LENGTH = 15;
const PASSWORD_MIN_LENGTH = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEBOUNCE_DELAY = 300;

// Validation utility
const validateField = (name, value) => {
  switch (name) {
    case "name":
      if (value.length < NAME_MIN_LENGTH || value.length > NAME_MAX_LENGTH) {
        return `Full name must be between ${NAME_MIN_LENGTH} and ${NAME_MAX_LENGTH} characters`;
      }
      break;
    case "email":
      if (!EMAIL_REGEX.test(value)) {
        return "Please enter a valid email address";
      }
      break;
    case "phone_number":
      const digits = value.replace(/\D/g, "");
      if (digits.length < PHONE_MIN_LENGTH || digits.length > PHONE_MAX_LENGTH) {
        return `Phone number must be between ${PHONE_MIN_LENGTH} and ${PHONE_MAX_LENGTH} digits`;
      }
      break;
    case "password":
      if (value.length < PASSWORD_MIN_LENGTH) {
        return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
      }
      if (!/[A-Z]/.test(value) || !/[0-9]/.test(value) || !/[!@#$%^&*]/.test(value)) {
        return "Password must include uppercase, number, and special character";
      }
      break;
    case "terms":
      if (!value) {
        return "You must accept the Terms and Conditions";
      }
      break;
    default:
      return "";
  }
  return "";
};

// Password strength utility
const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*]/.test(password)) score++;
  return score;
};

const SignupForm = ({ redirect }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const nameInputRef = useRef(null);
  const debounceTimer = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    phone_code: "+91",
    login_flag: "false",
    whatsapp_flag: "no",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  // CHANGE 1: Use specific loading state (null, 'email', 'facebook', 'google')
  const [loading, setLoading] = useState(null);
  
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Helper to check if ANY loading is happening
  const isLoading = Boolean(loading);

  // Focus first input on mount
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  // Initialize intl-tel-input
  useEffect(() => {
    const input = document.querySelector("#signup_phone_number");
    if (input) {
      const iti = intlTelInput(input, {
        initialCountry: "in",
        separateDialCode: true,
      });

      input.addEventListener("countrychange", () => {
        const selectedCode = iti.getSelectedCountryData().dialCode;
        setFormData((prev) => ({ ...prev, phone_code: `+${selectedCode}` }));
      });

      return () => {
        input.removeEventListener("countrychange", () => {});
        iti.destroy();
      };
    }
  }, []);

  // Load Facebook SDK
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "1233591551437361",
        cookie: true,
        xfbml: true,
        version: "v20.0",
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  // Debounced validation
  const validateWithDebounce = useCallback((name, value) => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
      if (name === "password") {
        setPasswordStrength(getPasswordStrength(value));
      }
    }, DEBOUNCE_DELAY);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue =
      type === "checkbox" && name === "whatsapp_flag"
        ? checked
          ? "yes"
          : "no"
        : type === "checkbox" && name === "terms"
        ? checked
        : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (type !== "checkbox") {
      validateWithDebounce(name, newValue);
    } else if (name === "terms") {
      const error = validateField(name, newValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // CHANGE 2: Set email loading
    setLoading('email');

    // Validate all fields
    const newErrors = {};
    const newTouched = {};
    ["name", "email", "phone_number", "password", "terms"].forEach((key) => {
      newErrors[key] = validateField(key, formData[key]);
      newTouched[key] = true;
    });

    setErrors(newErrors);
    setTouched(newTouched);

    if (Object.values(newErrors).some((error) => error)) {
      setLoading(null);
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      const response = await axios.post(API_URL, formData);
      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Registration successful! Please check your email to verify your account."
        );
        if (response.data.token && response.data.user) {
          login(response.data.token, response.data.user);
          setTimeout(() => navigate(redirect), 2000);
        } else {
          setTimeout(() => navigate("/login"), 2000);
        }
      } else {
        toast.error(response.data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        error.response.data.errors.forEach((err) => toast.error(err.msg));
      } else {
        toast.error(error.response?.data?.message || "Something went wrong!");
      }
    } finally {
      setLoading(null);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    // CHANGE 3: Set Google loading
    setLoading('google');
    try {
      const { credential } = credentialResponse;
      const response = await axios.post(GOOGLE_AUTH_URL, { token: credential });
      if (response.data.success) {
        toast.success(
          response.data.user?.isNewUser
            ? "Signed up with Google successfully!"
            : "Logged in with Google successfully!"
        );
        if (response.data.token && response.data.user) {
          login(response.data.token, response.data.user);
          setTimeout(() => navigate(redirect), 2000);
        }
      } else {
        toast.error(response.data.message || "Google authentication failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Google authentication error!");
    } finally {
      setLoading(null);
    }
  };

  const handleGoogleFailure = () => {
    toast.error("Google authentication failed. Please try again.");
  };

  const handleFacebookLogin = () => {
    if (window.FB) {
      // CHANGE 4: Set Facebook loading
      setLoading('facebook');
      window.FB.login(
        (response) => {
          if (response.authResponse) {
            const accessToken = response.authResponse.accessToken;
            handleFacebookSuccess(accessToken);
          } else {
            setLoading(null);
            toast.error("Facebook authentication cancelled or failed.");
          }
        },
        { scope: "public_profile,email" }
      );
    } else {
      toast.error("Facebook SDK not loaded. Please try again.");
    }
  };

  const handleFacebookSuccess = async (accessToken) => {
    try {
      const response = await axios.post(FACEBOOK_AUTH_URL, { token: accessToken });
      if (response.data.success) {
        toast.success(
          response.data.user?.isNewUser
            ? "Signed up with Facebook successfully!"
            : "Logged in with Facebook successfully!"
        );
        if (response.data.token && response.data.user) {
          login(response.data.token, response.data.user);
          setTimeout(() => navigate(redirect), 2000);
        }
      } else {
        toast.error(response.data.message || "Facebook authentication failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Facebook authentication error!");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="signup-form-container login-form">
      <form onSubmit={handleSubmit} noValidate aria-label="Sign up form">
        <div className="row contact-form p-0">
          <div className="col-lg-6 col-12">
            <div className="form-group">
              <label htmlFor="name">
                Full Name<span className="text-danger" aria-hidden="true">*</span>
                <span className="visually-hidden"> (required)</span>
              </label>
              <input
                id="name"
                type="text"
                className={`form-control ${touched.name && errors.name ? "is-invalid" : ""}`}
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                disabled={isLoading}
                ref={nameInputRef}
                aria-describedby="name-error"
                aria-invalid={touched.name && errors.name ? "true" : "false"}
              />
              {touched.name && errors.name && (
                <div id="name-error" className="invalid-feedback">
                  {errors.name}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6 col-12">
            <div className="form-group">
              <label htmlFor="email">
                Email<span className="text-danger" aria-hidden="true">*</span>
                <span className="visually-hidden"> (required)</span>
              </label>
              <div className="position-relative">
                <input
                  id="email"
                  type="email"
                  className={`form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  disabled={isLoading}
                  aria-describedby="email-error"
                  aria-invalid={touched.email && errors.email ? "true" : "false"}
                  data-tooltip={formData.email}
                />
                {touched.email && errors.email && (
                  <div id="email-error" className="invalid-feedback">
                    {errors.email}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-12">
            <div className="form-group phone-group signup">
              <label htmlFor="signup_phone_number">
                Phone Number<span className="text-danger" aria-hidden="true">*</span>
                <span className="visually-hidden"> (required)</span>
              </label>
              <input
                id="signup_phone_number"
                type="tel"
                className={`form-control ${
                  touched.phone_number && errors.phone_number ? "is-invalid" : ""
                }`}
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                disabled={isLoading}
                aria-describedby="phone-error"
                aria-invalid={touched.phone_number && errors.phone_number ? "true" : "false"}
              />
              {touched.phone_number && errors.phone_number && (
                <div id="phone-error" className="invalid-feedback">
                  {errors.phone_number}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6 col-12">
            <div className="form-group">
              <label htmlFor="password">
                Password<span className="text-danger" aria-hidden="true">*</span>
                <span className="visually-hidden"> (required)</span>
              </label>
              <div className="position-relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${
                    touched.password && errors.password ? "is-invalid" : ""
                  }`}
                  placeholder="Enter Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  disabled={isLoading}
                  aria-describedby="password-error password-strength"
                  aria-invalid={touched.password && errors.password ? "true" : "false"}
                />
                <button
                  type="button"
                  className="eye-button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <img
                    src={showPassword ? EyeBtnOff : EyeBtn}
                    alt={showPassword ? "Hide password" : "Show password"}
                    className="eye-icon"
                  />
                </button>
                {touched.password && errors.password && (
                  <div id="password-error" className="invalid-feedback">
                    {errors.password}
                  </div>
                )}
              </div>
              {formData.password && (
                <div className="password-strength mt-1">
                  <div
                    className={`strength-bar strength-${Math.min(passwordStrength, 4)}`}
                    role="progressbar"
                    aria-valuenow={passwordStrength}
                    aria-valuemin="0"
                    aria-valuemax="4"
                    aria-label="Password strength"
                  ></div>
                  <small className="form-text text-muted">
                    Password strength: {["Weak", "Fair", "Good", "Strong", "Very Strong"][passwordStrength]}
                  </small>
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-12 col-12">
            <div className="check-box-btn mt-4">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="whatsapp_flag"
                  name="whatsapp_flag"
                  checked={formData.whatsapp_flag === "yes"}
                  onChange={handleChange}
                  disabled={isLoading}
                  aria-label="Receive WhatsApp updates"
                />
                <label className="form-check-label" htmlFor="whatsapp_flag">
                  <img src={WhatsappImg} alt="WhatsApp" />
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className={`form-check-input ${touched.terms && errors.terms ? "is-invalid" : ""}`}
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  aria-label="Accept Terms and Conditions"
                  aria-describedby="terms-error"
                  aria-invalid={touched.terms && errors.terms ? "true" : "false"}
                />
                <label className="form-check-label check-label" htmlFor="terms">
                  I accept the <Link to="/terms-conditions" target="_blank">Terms & Conditions</Link>
                </label>
                {touched.terms && errors.terms && (
                  <div id="terms-error" className="invalid-feedback">
                    {errors.terms}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="form-action">
              {/* CHANGE 5: Check specific loading state */}
              <button
                type="submit"
                className="color-btn btn w-100"
                disabled={isLoading}
                aria-label="Submit sign up form"
              >
                {loading === 'email' ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  "Get Started"
                )}
              </button>
            </div>
          </div>
          <div className="col-12">
            <div className="or-option">
              <span>OR</span>
            </div>
          </div>
          <div className="col-12">
            <div className="other-logins">
              {/* CHANGE 6: Check specific loading state and disable click */}
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (!isLoading) handleFacebookLogin();
                }}
                className={`facebook-signup-link ${isLoading ? 'disabled-link' : ''}`}
                style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                aria-label="Sign up with Facebook"
              >
                <img src={FacebookLogo} alt="" />
                <span>{loading === 'facebook' ? "Checking..." : "Continue with Facebook"}</span>
              </Link>
              
              <div className="google-login-wrapper">
                {/* CHANGE 7: Check specific loading state */}
                <div className="google-custom-visual">
                    <img src={GoogleLogo} alt="Google" className="google-logo" />
                    <span className="google-text">
                        {loading === 'google' ? "Checking..." : "Continue with Google"}
                    </span>
                </div>

                <div className="google-hidden-overlay">
                    <div className="google-scale-wrapper">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error("Login Failed")}
                            width="400"
                            size="large"
                            text="continue_with"
                            theme="filled_blue"
                        />
                    </div>
                </div>

              </div>

            </div>
          </div>
          <div className="col-12">
            <div className="signup-link">
              <span>Already have an account?</span>
              <Link to="/login" aria-label="Go to login page">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

SignupForm.propTypes = {
  redirect: PropTypes.string,
};

SignupForm.defaultProps = {
  redirect: "/my-account",
};

const WrappedSignupForm = (props) => (
  <GoogleOAuthProvider clientId="1012050456512-229eq2t4bmrf7djm8nba44enuk08iq9i.apps.googleusercontent.com">
    <SignupForm {...props} />
  </GoogleOAuthProvider>
);

export default WrappedSignupForm;