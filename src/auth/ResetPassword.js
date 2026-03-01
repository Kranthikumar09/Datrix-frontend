import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import config from "../config/config";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/images/logo.png";
import LoginBg from "../assets/images/login-bg.png";
import ArrowLeft from "../assets/images/arrow-left.svg";
import EyeBtn from "../assets/images/pass-view.svg";
import EyeBtnOff from "../assets/images/pass-view.svg";

const UPDATE_PASSWORD_URL = `${config.baseURL}/verify/update-password`;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [formData, setFormData] = useState({
    email: email || "",
    password: "",
    confirmPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState({
    password: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);

  // Redirect to forgot-password if no token or email
  useEffect(() => {
    if (!token || !email) {
      toast.error("Invalid or missing reset token or email.", {
        toastId: "token-error",
        autoClose: 5000,
      });
      navigate("/forgot-password");
    }
  }, [token, email, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear validation error for the field being edited
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    const errors = {};

    // Password validation
    if (!formData.password) {
      errors.password = "Please enter a new password";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else {
      // Match server-side password requirements
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        errors.password =
          "Password must include uppercase, lowercase, number, and special character";
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);

    // Focus on the first invalid field
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const inputElement = document.getElementById(firstErrorField);
      if (inputElement) inputElement.focus();
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform client-side validation
    if (!validateForm()) {
      return; // Inline errors will be shown
    }

    setLoading(true);
    setValidationErrors({});

    try {
      const response = await axios.post(UPDATE_PASSWORD_URL, {
        user_email: formData.email,
        token: token,
        password: formData.password,
      });

      if (response.data.success) {
        toast.success("Password updated successfully! Redirecting to login...", {
          toastId: "reset-success",
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        throw new Error(response.data.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Password Update Error:", error.response?.data || error.message);

      // Handle server-side errors
      const newValidationErrors = {};
      let toastMessage = null;

      if (error.response?.data?.errors) {
        // Structured errors (e.g., [{ path: "password", msg: "..." }])
        error.response.data.errors.forEach((err) => {
          if (err.path === "password") {
            newValidationErrors.password = err.msg;
          } else if (err.path === "user_email" || err.path === "token") {
            newValidationErrors.token = err.msg;
            toastMessage = err.msg;
          } else {
            toastMessage = err.msg || "Failed to update password";
          }
        });
      } else if (error.response?.data?.message) {
        // Generic message from server
        if (error.response.data.message.toLowerCase().includes("password")) {
          newValidationErrors.password = error.response.data.message;
        } else {
          toastMessage = error.response.data.message;
        }
      } else {
        // Network or unexpected errors
        toastMessage = error.message || "Failed to update password. Please try again.";
      }

      setValidationErrors(newValidationErrors);

      // Focus on the first invalid field (if not a token error)
      const firstErrorField = Object.keys(newValidationErrors).find(
        (field) => field !== "token"
      );
      if (firstErrorField) {
        const inputElement = document.getElementById(firstErrorField);
        if (inputElement) inputElement.focus();
      }

      // Show toast only for non-field-specific errors
      if (toastMessage) {
        toast.error(toastMessage, {
          toastId: "reset-error",
          autoClose: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const pageStyle = {
    backgroundImage: `url(${LoginBg})`,
  };

  return (
    <div className="main-section login-page" style={pageStyle}>
      <header className="header-main">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <div className="header-inner">
              <Link className="navbar-brand" to="/">
                <img src={Logo} alt="logo-img" />
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarTogglerDemo02"
                aria-controls="navbarTogglerDemo02"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                <div className="header-btn-main ms-auto">
                  <Link to="/login" className="back-home-btn">
                    <img src={ArrowLeft} alt="" />
                    <span> Back to Login </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <section className="login-section">
        <div className="container">
          <div className="row main-row justify-content-center">
            <div className="col-lg-5">
              <div className="login-form">
                <div className="form-headings">
                  <h2>Reset Password</h2>
                  <p>Enter your new password below.</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row contact-form p-0">
                    <div className="col-12">
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter your email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={true}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group password position-relative">
                        <label>New Password</label>
                        <input
                          type={passwordVisible.password ? "text" : "password"}
                          id="password"
                          className={`form-control pwd-input ${
                            validationErrors.password ? "is-invalid" : ""
                          }`}
                          placeholder="Enter your new password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          className="eye-btn"
                          onClick={() => togglePasswordVisibility("password")}
                          aria-label={passwordVisible.password ? "Hide password" : "Show password"}
                          disabled={loading}
                        >
                          <img
                            src={passwordVisible.password ? EyeBtnOff : EyeBtn}
                            alt="toggle visibility"
                          />
                        </button>
                        {validationErrors.password && (
                          <div className="invalid-feedback">{validationErrors.password}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group password position-relative">
                        <label>Confirm Password</label>
                        <input
                          type={passwordVisible.confirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          className={`form-control pwd-input ${
                            validationErrors.confirmPassword ? "is-invalid" : ""
                          }`}
                          placeholder="Confirm your new password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          className="eye-btn"
                          onClick={() => togglePasswordVisibility("confirmPassword")}
                          aria-label={
                            passwordVisible.confirmPassword ? "Hide password" : "Show password"
                          }
                          disabled={loading}
                        >
                          <img
                            src={passwordVisible.confirmPassword ? EyeBtnOff : EyeBtn}
                            alt="toggle visibility"
                          />
                        </button>
                        {validationErrors.confirmPassword && (
                          <div className="invalid-feedback">
                            {validationErrors.confirmPassword}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-action">
                        <button
                          type="submit"
                          className="color-btn btn w-100"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Updating...
                            </>
                          ) : (
                            "Update Password"
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

export default ResetPassword;