import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FacebookIcon from "@mui/icons-material/Facebook";
import config from "../config/config";
import { useAuth } from "../context/AuthContext";
import { useAppSnackbar } from "../components/ui/AppSnackbar";
import AppTextField from "../components/ui/AppTextField";
import AuthLayout from "./AuthLayout";
import GoogleLogo from "../assets/images/g-logo.svg";

const API_URL = `${config.baseURL}/user/login`;
const RESEND_VERIFY_URL = `${config.baseURL}/verify/email-token/send`;
const GOOGLE_AUTH_URL = `${config.baseURL}/user/google-auth/login`;
const FACEBOOK_AUTH_URL = `${config.baseURL}/user/facebook-auth/login`;
const GOOGLE_CLIENT_ID =
  "1012050456512-229eq2t4bmrf7djm8nba44enuk08iq9i.apps.googleusercontent.com";

const pillSubmitSx = {
  borderRadius: "50px",
  py: 1.5,
  fontWeight: 600,
  textTransform: "none",
  minHeight: 48,
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const snackbar = useAppSnackbar();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(null);
  const [showResend, setShowResend] = useState(false);

  const isLoading = Boolean(loading);

  useEffect(() => {
    setErrors({ email: "", password: "", general: "" });
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

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "", general: "" };

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name] || errors.general) {
      setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading("email");
    setShowResend(false);
    setErrors((prev) => ({ ...prev, general: "" }));

    try {
      const response = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      });

      if (response.data.success) {
        const { token, user } = response.data;
        if (!token || !user) {
          setErrors((prev) => ({ ...prev, general: "Invalid response from server" }));
          snackbar.error("Invalid response from server");
          setLoading(null);
          return;
        }

        snackbar.success(response.data.message || "Login successful!");
        login(token, user);
        const from = location.state?.from?.pathname || "/application-form";
        navigate(from, { replace: true });
      } else {
        const message = response.data.message || "Login failed";
        setErrors((prev) => ({ ...prev, general: message }));
        snackbar.error(message);
        setLoading(null);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      if (errorMessage.includes("Email Not verified")) {
        setShowResend(true);
      }
      setErrors((prev) => ({ ...prev, general: errorMessage }));
      snackbar.error(errorMessage);
      setLoading(null);
    }
  };

  const resendVerificationEmail = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }));
      snackbar.error("Please enter a valid email address");
      return;
    }

    setLoading("resend");
    try {
      const response = await axios.post(RESEND_VERIFY_URL, {
        user_email: formData.email.trim(),
        type: "verify",
      });
      snackbar.success(response.data.message || "Verification email sent successfully");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to resend verification email";
      setErrors((prev) => ({ ...prev, general: errorMessage }));
      snackbar.error(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse || !credentialResponse.credential) {
      setErrors((prev) => ({ ...prev, general: "Google authentication failed" }));
      snackbar.error("Google authentication failed");
      return;
    }

    setLoading("google");
    setErrors((prev) => ({ ...prev, general: "" }));

    try {
      const { credential } = credentialResponse;
      const response = await axios.post(GOOGLE_AUTH_URL, { token: credential });

      if (response.data.success) {
        login(response.data.token, response.data.user);
        snackbar.success(response.data.message || "Logged in with Google successfully");
        const from = location.state?.from?.pathname || "/application-form";
        navigate(from, { replace: true });
      } else {
        const message = response.data.message || "Google login failed";
        setErrors((prev) => ({ ...prev, general: message }));
        snackbar.error(message);
        setLoading(null);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Google login failed";
      setErrors((prev) => ({ ...prev, general: errorMessage }));
      snackbar.error(errorMessage);
      setLoading(null);
    }
  };

  const handleFacebookLogin = (e) => {
    e.preventDefault();
    if (!window.FB) {
      setErrors((prev) => ({ ...prev, general: "Facebook SDK not loaded" }));
      snackbar.error("Facebook SDK not loaded");
      return;
    }

    setLoading("facebook");
    setErrors((prev) => ({ ...prev, general: "" }));

    window.FB.login(
      (response) => {
        if (response.authResponse) {
          handleFacebookSuccess(response.authResponse.accessToken);
        } else {
          setLoading(null);
          setErrors((prev) => ({ ...prev, general: "Facebook login cancelled" }));
          snackbar.error("Facebook login cancelled");
        }
      },
      { scope: "public_profile,email" }
    );
  };

  const handleFacebookSuccess = async (accessToken) => {
    try {
      const response = await axios.post(FACEBOOK_AUTH_URL, { token: accessToken });
      if (response.data.success) {
        login(response.data.token, response.data.user);
        snackbar.success(response.data.message || "Logged in with Facebook successfully");
        const from = location.state?.from?.pathname || "/application-form";
        navigate(from, { replace: true });
      } else {
        const message = response.data.message || "Facebook login failed";
        setErrors((prev) => ({ ...prev, general: message }));
        snackbar.error(message);
        setLoading(null);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Facebook login failed";
      setErrors((prev) => ({ ...prev, general: errorMessage }));
      snackbar.error(errorMessage);
      setLoading(null);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Please login to your account"
      backTo="/"
      backLabel="Back to Home"
      showSideImages
      formColumns={{ xs: 12, lg: 5 }}
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2.5}>
          {errors.general ? (
            <Alert severity="error" role="alert">
              {errors.general}
            </Alert>
          ) : null}

          <AppTextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            helperText={errors.email}
            disabled={isLoading}
            required
            inputProps={{ "aria-required": true }}
          />

          <AppTextField
            label="Password"
            name="password"
            type={passwordVisible ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            helperText={errors.password}
            disabled={isLoading}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                    onClick={() => setPasswordVisible((prev) => !prev)}
                    edge="end"
                    disabled={isLoading}
                  >
                    {passwordVisible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ textAlign: "right" }}>
            <Link component={RouterLink} to="/forgot-password" underline="hover" fontWeight={600}>
              Forgot Password
            </Link>
          </Box>

          {showResend ? (
            <Link
              component="button"
              type="button"
              onClick={resendVerificationEmail}
              underline="hover"
              disabled={isLoading}
              sx={{ alignSelf: "flex-start", fontWeight: 600 }}
            >
              {loading === "resend" ? "Sending..." : "Resend Verification Email"}
            </Link>
          ) : null}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            sx={pillSubmitSx}
          >
            {loading === "email" ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={18} color="inherit" />
                <span>Logging In...</span>
              </Stack>
            ) : (
              "Log in"
            )}
          </Button>

          <Divider>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Stack spacing={1.5}>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              fullWidth
              disabled={isLoading}
              onClick={handleFacebookLogin}
              startIcon={<FacebookIcon />}
              sx={{ ...pillSubmitSx, justifyContent: "flex-start", pl: 2.5 }}
            >
              {loading === "facebook" ? "Checking..." : "Sign in with Facebook"}
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
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.01,
                  overflow: "hidden",
                }}
              >
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

          <Typography variant="body2" textAlign="center" color="text.secondary">
            Don&apos;t have an account?{" "}
            <Link component={RouterLink} to="/signup" underline="hover" fontWeight={700}>
              Sign-up
            </Link>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
};

const WrappedLogin = (props) => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Login {...props} />
  </GoogleOAuthProvider>
);

export default WrappedLogin;
