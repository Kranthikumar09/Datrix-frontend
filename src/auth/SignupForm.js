import React, { useEffect, useState, useRef, useCallback } from "react";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import PropTypes from "prop-types";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useAuth } from "../context/AuthContext";
import { useAppSnackbar } from "../components/ui/AppSnackbar";
import AppTextField from "../components/ui/AppTextField";
import AppPhoneField from "../components/ui/AppPhoneField";
import config from "../config/config";
import GoogleLogo from "../assets/images/g-logo.svg";
import WhatsappImg from "../assets/images/whstsapp-img.svg";

const API_URL = `${config.baseURL}/user/register`;
const GOOGLE_AUTH_URL = `${config.baseURL}/user/google-auth/login`;
const FACEBOOK_AUTH_URL = `${config.baseURL}/user/facebook-auth/login`;
const GOOGLE_CLIENT_ID =
  "1012050456512-229eq2t4bmrf7djm8nba44enuk08iq9i.apps.googleusercontent.com";
const NAME_MIN_LENGTH = 5;
const NAME_MAX_LENGTH = 65;
const PHONE_MIN_LENGTH = 8;
const PHONE_MAX_LENGTH = 15;
const PASSWORD_MIN_LENGTH = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEBOUNCE_DELAY = 300;

const STRENGTH_LABELS = ["Weak", "Fair", "Good", "Strong", "Very Strong"];

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
    case "phone_number": {
      const digits = value.replace(/\D/g, "");
      if (digits.length < PHONE_MIN_LENGTH || digits.length > PHONE_MAX_LENGTH) {
        return `Phone number must be between ${PHONE_MIN_LENGTH} and ${PHONE_MAX_LENGTH} digits`;
      }
      break;
    }
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

const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*]/.test(password)) score++;
  return score;
};

const pillSubmitSx = {
  borderRadius: "50px",
  py: 1.5,
  fontWeight: 600,
  textTransform: "none",
  minHeight: 48,
};

const SignupForm = ({ redirect }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const snackbar = useAppSnackbar();
  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
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
  const [loading, setLoading] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const isLoading = Boolean(loading);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const input = phoneInputRef.current;
    if (!input) return undefined;

    const iti = intlTelInput(input, {
      initialCountry: "in",
      separateDialCode: true,
      autoPlaceholder: "off",
    });

    const onCountryChange = () => {
      const selectedCode = iti.getSelectedCountryData().dialCode;
      setFormData((prev) => ({ ...prev, phone_code: `+${selectedCode}` }));
    };

    input.addEventListener("countrychange", onCountryChange);

    return () => {
      input.removeEventListener("countrychange", onCountryChange);
      iti.destroy();
    };
  }, []);

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
      var js;
      var fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

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
    setLoading("email");

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
      snackbar.error("Please fix the errors before submitting");
      return;
    }

    try {
      const response = await axios.post(API_URL, formData);
      if (response.data.success) {
        snackbar.success(
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
        snackbar.error(response.data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        error.response.data.errors.forEach((err) => snackbar.error(err.msg));
      } else {
        snackbar.error(error.response?.data?.message || "Something went wrong!");
      }
    } finally {
      setLoading(null);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading("google");
    try {
      const { credential } = credentialResponse;
      const response = await axios.post(GOOGLE_AUTH_URL, { token: credential });
      if (response.data.success) {
        snackbar.success(
          response.data.user?.isNewUser
            ? "Signed up with Google successfully!"
            : "Logged in with Google successfully!"
        );
        if (response.data.token && response.data.user) {
          login(response.data.token, response.data.user);
          setTimeout(() => navigate(redirect), 2000);
        }
      } else {
        snackbar.error(response.data.message || "Google authentication failed.");
      }
    } catch (error) {
      snackbar.error(error.response?.data?.message || "Google authentication error!");
    } finally {
      setLoading(null);
    }
  };

  const handleFacebookLogin = () => {
    if (window.FB) {
      setLoading("facebook");
      window.FB.login(
        (response) => {
          if (response.authResponse) {
            handleFacebookSuccess(response.authResponse.accessToken);
          } else {
            setLoading(null);
            snackbar.error("Facebook authentication cancelled or failed.");
          }
        },
        { scope: "public_profile,email" }
      );
    } else {
      snackbar.error("Facebook SDK not loaded. Please try again.");
    }
  };

  const handleFacebookSuccess = async (accessToken) => {
    try {
      const response = await axios.post(FACEBOOK_AUTH_URL, { token: accessToken });
      if (response.data.success) {
        snackbar.success(
          response.data.user?.isNewUser
            ? "Signed up with Facebook successfully!"
            : "Logged in with Facebook successfully!"
        );
        if (response.data.token && response.data.user) {
          login(response.data.token, response.data.user);
          setTimeout(() => navigate(redirect), 2000);
        }
      } else {
        snackbar.error(response.data.message || "Facebook authentication failed.");
      }
    } catch (error) {
      snackbar.error(error.response?.data?.message || "Facebook authentication error!");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate aria-label="Sign up form">
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <AppTextField
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            disabled={isLoading}
            inputRef={nameInputRef}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name ? errors.name : " "}
            inputProps={{
              "aria-describedby": "name-error",
              "aria-invalid": touched.name && errors.name ? "true" : "false",
            }}
            FormHelperTextProps={{ id: "name-error" }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <AppTextField
            id="email"
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            disabled={isLoading}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email ? errors.email : " "}
            inputProps={{
              "aria-describedby": "email-error",
              "aria-invalid": touched.email && errors.email ? "true" : "false",
            }}
            FormHelperTextProps={{ id: "email-error" }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <AppPhoneField
            id="signup_phone_number"
            label="Phone Number *"
            ref={phoneInputRef}
            error={Boolean(touched.phone_number && errors.phone_number)}
            helperText={touched.phone_number && errors.phone_number ? errors.phone_number : " "}
            helperTextId="phone-error"
            disabled={isLoading}
            className="signup"
            inputProps={{
              name: "phone_number",
              value: formData.phone_number,
              onChange: handleChange,
              onBlur: handleBlur,
              required: true,
              "aria-invalid": touched.phone_number && errors.phone_number ? "true" : "false",
              autoComplete: "tel-national",
              className: "",
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <AppTextField
            id="password"
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            disabled={isLoading}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password ? errors.password : " "}
            inputProps={{
              "aria-describedby": "password-error password-strength",
              "aria-invalid": touched.password && errors.password ? "true" : "false",
            }}
            FormHelperTextProps={{ id: "password-error" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    disabled={isLoading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {formData.password ? (
            <Box id="password-strength" sx={{ mt: 0.5 }}>
              <LinearProgress
                variant="determinate"
                value={(passwordStrength / 4) * 100}
                color={passwordStrength >= 3 ? "success" : passwordStrength >= 2 ? "warning" : "error"}
                aria-valuenow={passwordStrength}
                aria-valuemin={0}
                aria-valuemax={4}
                aria-label="Password strength"
                sx={{ height: 6, borderRadius: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                Password strength: {STRENGTH_LABELS[passwordStrength]}
              </Typography>
            </Box>
          ) : null}
        </Grid>

        <Grid size={12}>
          <Stack spacing={1}>
            <FormControlLabel
              control={
                <Checkbox
                  id="whatsapp_flag"
                  name="whatsapp_flag"
                  checked={formData.whatsapp_flag === "yes"}
                  onChange={handleChange}
                  disabled={isLoading}
                  inputProps={{ "aria-label": "Receive WhatsApp updates" }}
                />
              }
              label={
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Box component="img" src={WhatsappImg} alt="WhatsApp" sx={{ height: 22 }} />
                  <Typography variant="body2">Receive WhatsApp updates</Typography>
                </Stack>
              }
            />

            <FormControl error={Boolean(touched.terms && errors.terms)}>
              <FormControlLabel
                control={
                  <Checkbox
                    id="terms"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    inputProps={{
                      "aria-label": "Accept Terms and Conditions",
                      "aria-describedby": "terms-error",
                      "aria-invalid": touched.terms && errors.terms ? "true" : "false",
                    }}
                  />
                }
                label={
                  <Typography variant="body2">
                    I accept the{" "}
                    <Link component={RouterLink} to="/terms-conditions" target="_blank" underline="hover">
                      Terms & Conditions
                    </Link>
                  </Typography>
                }
              />
              <FormHelperText id="terms-error">
                {touched.terms && errors.terms ? errors.terms : " "}
              </FormHelperText>
            </FormControl>
          </Stack>
        </Grid>

        <Grid size={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            aria-label="Submit sign up form"
            sx={pillSubmitSx}
          >
            {loading === "email" ? <CircularProgress size={22} color="inherit" /> : "Get Started"}
          </Button>
        </Grid>

        <Grid size={12}>
          <Divider>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>
        </Grid>

        <Grid size={12}>
          <Stack spacing={1.5}>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              fullWidth
              disabled={isLoading}
              onClick={handleFacebookLogin}
              startIcon={<FacebookIcon />}
              aria-label="Sign up with Facebook"
              sx={{ ...pillSubmitSx, justifyContent: "flex-start", pl: 2.5 }}
            >
              {loading === "facebook" ? "Checking..." : "Continue with Facebook"}
            </Button>

            <Box
              className="google-login-wrapper"
              sx={{
                position: "relative",
                borderRadius: "50px",
                border: "2px solid",
                borderColor: "divider",
                minHeight: 48,
                display: "flex",
                alignItems: "center",
                px: 2,
                overflow: "hidden",
                opacity: isLoading ? 0.6 : 1,
                pointerEvents: isLoading ? "none" : "auto",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: "100%" }}>
                <Box component="img" src={GoogleLogo} alt="" sx={{ width: 22, height: 22 }} />
                <Typography fontWeight={600}>
                  {loading === "google" ? "Checking..." : "Continue with Google"}
                </Typography>
              </Stack>
              <Box sx={{ position: "absolute", inset: 0, opacity: 0.01, overflow: "hidden" }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => snackbar.error("Login Failed")}
                  width="400"
                  size="large"
                  text="continue_with"
                  theme="filled_blue"
                />
              </Box>
            </Box>
          </Stack>
        </Grid>

        <Grid size={12}>
          <Typography variant="body2" textAlign="center" color="text.secondary">
            Already have an account?{" "}
            <Link component={RouterLink} to="/login" underline="hover" fontWeight={700} aria-label="Go to login page">
              Log in
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

SignupForm.propTypes = {
  redirect: PropTypes.string,
};

SignupForm.defaultProps = {
  redirect: "/my-account",
};

const WrappedSignupForm = (props) => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <SignupForm {...props} />
  </GoogleOAuthProvider>
);

export default WrappedSignupForm;
