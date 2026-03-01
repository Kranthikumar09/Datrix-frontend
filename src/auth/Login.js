import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import config from "../config/config";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Logo from "../assets/images/logo.png";
import LoginBg from "../assets/images/login-bg.png";
import ArrowLeft from "../assets/images/arrow-left.svg";
import LoginFav from "../assets/images/login-favicon.png";
import LoginImg1 from "../assets/images/login-img-1.png";
import LoginImg2 from "../assets/images/login-img-2.png";
import LoginImg3 from "../assets/images/login-img-3.png";
import FacebookLogo from "../assets/images/facebookk.svg";
import GoogleLogo from "../assets/images/g-logo.svg";
import EyeBtn from "../assets/images/pass-view.svg";
import EyeBtnOff from "../assets/images/pass-view.svg";

const API_URL = `${config.baseURL}/user/login`;
const RESEND_VERIFY_URL = `${config.baseURL}/verify/email-token/send`;
const GOOGLE_AUTH_URL = `${config.baseURL}/user/google-auth/login`;
const FACEBOOK_AUTH_URL = `${config.baseURL}/user/facebook-auth/login`;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: ""
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  
  // CHANGE 1: Use a string or null to track WHICH button is loading
  // null = idle, 'email' = form submit, 'facebook' = fb login, 'google' = google login
  const [loading, setLoading] = useState(null); 
  
  const [showResend, setShowResend] = useState(false);

  // Helper to check if ANY loading is happening (for disabling inputs)
  const isLoading = Boolean(loading);

  useEffect(() => {
    setErrors({
      email: "",
      password: "",
      general: ""
    });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    if (errors.general) {
      setErrors({ ...errors, general: "" });
    }
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setPasswordVisible((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // CHANGE 2: Set specific loading type
    setLoading("email");
    setShowResend(false);
    setErrors({ ...errors, general: "" });

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      if (response.data.success) {
        const { token, user } = response.data;

        if (!token || !user) {
          setErrors({ ...errors, general: "Invalid response from server" });
          toast.error("Invalid response from server");
          setLoading(null); // Reset to null
          return;
        }

        toast.success(response.data.message || "Login successful!");
        login(token, user);
        const from = location.state?.from?.pathname || "/application-form";
        navigate(from, { replace: true });
      } else {
        setErrors({ ...errors, general: response.data.message || "Login failed" });
        toast.error(response.data.message || "Login failed");
        setLoading(null);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      
      if (errorMessage.includes("Email Not verified")) {
        setShowResend(true);
      }
      
      setErrors({ 
        ...errors, 
        general: errorMessage 
      });
      
      toast.error(errorMessage);
      setLoading(null);
    }
  };

  const resendVerificationEmail = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrors({ ...errors, email: "Please enter a valid email address" });
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading("resend"); // Use a specific state for resend if desired, or reuse 'email'
    
    try {
      const response = await axios.post(RESEND_VERIFY_URL, {
        user_email: formData.email.trim(),
        type: "verify",
      });
      
      toast.success(response.data.message || "Verification email sent successfully");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to resend verification email";
      setErrors({ ...errors, general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse || !credentialResponse.credential) {
      setErrors({ ...errors, general: "Google authentication failed" });
      toast.error("Google authentication failed");
      return;
    }

    // CHANGE 3: Set Google specific loading
    setLoading("google");
    setErrors({ ...errors, general: "" });
    
    try {
      const { credential } = credentialResponse;
      const response = await axios.post(GOOGLE_AUTH_URL, { token: credential });

      if (response.data.success) {
        login(response.data.token, response.data.user);
        toast.success(response.data.message || "Logged in with Google successfully");
        const from = location.state?.from?.pathname || "/application-form";
        navigate(from, { replace: true });
      } else {
        setErrors({ ...errors, general: response.data.message || "Google login failed" });
        toast.error(response.data.message || "Google login failed");
        setLoading(null);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Google login failed";
      setErrors({ ...errors, general: errorMessage });
      toast.error(errorMessage);
      setLoading(null);
    }
  };

  const handleGoogleFailure = () => {
    setErrors({ ...errors, general: "Google login failed" });
    toast.error("Google login failed");
  };

  const handleFacebookLogin = (e) => {
    e.preventDefault();
    
    if (!window.FB) {
      setErrors({ ...errors, general: "Facebook SDK not loaded" });
      toast.error("Facebook SDK not loaded");
      return;
    }

    // CHANGE 4: Set Facebook specific loading
    setLoading("facebook");
    setErrors({ ...errors, general: "" });
    
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          handleFacebookSuccess(response.authResponse.accessToken);
        } else {
          setLoading(null);
          setErrors({ ...errors, general: "Facebook login cancelled" });
          toast.error("Facebook login cancelled");
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
        toast.success(response.data.message || "Logged in with Facebook successfully");
        const from = location.state?.from?.pathname || "/application-form";
        navigate(from, { replace: true });
      } else {
        setErrors({ ...errors, general: response.data.message || "Facebook login failed" });
        toast.error(response.data.message || "Facebook login failed");
        setLoading(null);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Facebook login failed";
      setErrors({ ...errors, general: errorMessage });
      toast.error(errorMessage);
      setLoading(null);
    }
  };

  const loginPageStyle = {
    backgroundImage: `url(${LoginBg})`,
  };

  return (
    <div className="main-section login-page" style={loginPageStyle}>
      <header className="header-main">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <div className="header-inner">
              <Link className="navbar-brand" to="/">
                <img src={Logo} alt="logo-img" />
              </Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                <div className="header-btn-main ms-auto">
                  <Link to="/" className="back-home-btn">
                    <img src={ArrowLeft} alt="" />
                    <span> Back to Home </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <section className="login-section">
        <div className="container">
          <div className="row main-row">
            <div className="col-lg-7">
              <div className="login-section-imgs">
                <img src={LoginFav} alt="" />
                <div className="left-two">
                  <img src={LoginImg1} alt="" />
                  <img src={LoginImg2} alt="" />
                </div>
                <div className="right-single">
                  <img src={LoginImg3} alt="" className="h-100" />
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="login-form">
                <div className="form-headings">
                  <h2>Welcome Back</h2>
                  <p>Please login to your account</p>
                </div>
                <form onSubmit={handleSubmit} noValidate>
                  {errors.general && (
                    <div className="alert alert-danger" role="alert">
                      {errors.general}
                    </div>
                  )}
                  <div className="row contact-form p-0">
                    <div className="col-12">
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          className={`form-control ${errors.email ? "is-invalid" : ""}`}
                          placeholder="Enter your email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={isLoading} 
                          required
                        />
                        {errors.email && (
                          <div className="invalid-feedback d-block">{errors.email}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group password">
                        <label>Password</label>
                        <input
                          type={passwordVisible ? "text" : "password"}
                          className={`form-control pwd-input ${errors.password ? "is-invalid" : ""}`}
                          placeholder="Enter your password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          disabled={isLoading}
                          required
                        />
                        <button 
                          className="eye-btn" 
                          type="button" 
                          onClick={togglePasswordVisibility}
                        >
                          <img src={passwordVisible ? EyeBtnOff : EyeBtn} alt="" />
                        </button>
                        {errors.password && (
                          <div className="invalid-feedback d-block">{errors.password}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="forgot-password">
                        <Link to="/forgot-password">Forgot Password</Link>
                      </div>
                    </div>
                    {showResend && (
                      <div className="col-12">
                        <div className="resend-verification">
                          <Link to="#" onClick={resendVerificationEmail}>
                            Resend Verification Email
                          </Link>
                        </div>
                      </div>
                    )}
                    <div className="col-12">
                      <div className="form-action">
                        {/* CHANGE 5: Check if loading === 'email' */}
                        <button
                          type="submit"
                          className="color-btn btn w-100"
                          disabled={isLoading}
                        >
                          {loading === 'email' ? "Logging In..." : "Log in"}
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
                        {/* CHANGE 6: Check if loading === 'facebook' */}
                        <Link
                          to="#"
                          onClick={handleFacebookLogin}
                          className={`facebook-signup-link ${isLoading ? 'disabled-link' : ''}`}
                          style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                        >
                          <img src={FacebookLogo} alt="facebook" />
                          <span>{loading === 'facebook' ? "Checking..." : "Sign in with Facebook"}</span>
                        </Link>
                        
                        <div className="google-login-wrapper">
                            {/* CHANGE 7: Check if loading === 'google' */}
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
                        <span>Don't have an account?</span>
                        <Link to="/signup">Sign-up</Link>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const WrappedLogin = (props) => (
  <GoogleOAuthProvider clientId="1012050456512-229eq2t4bmrf7djm8nba44enuk08iq9i.apps.googleusercontent.com">
    <Login {...props} />
  </GoogleOAuthProvider>
);

export default WrappedLogin;