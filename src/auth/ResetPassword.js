import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import config from "../config/config";
import { useAppSnackbar } from "../components/ui/AppSnackbar";
import AppTextField from "../components/ui/AppTextField";
import AuthLayout from "./AuthLayout";

const UPDATE_PASSWORD_URL = `${config.baseURL}/verify/update-password`;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const snackbar = useAppSnackbar();
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

  useEffect(() => {
    if (!token || !email) {
      snackbar.error("Invalid or missing reset token or email.");
      navigate("/forgot-password");
    }
    // snackbar intentionally omitted — run once on mount for missing params
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, email, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

    if (!formData.password) {
      errors.password = "Please enter a new password";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        errors.password =
          "Password must include uppercase, lowercase, number, and special character";
      }
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setValidationErrors({});

    try {
      const response = await axios.post(UPDATE_PASSWORD_URL, {
        user_email: formData.email,
        token,
        password: formData.password,
      });

      if (response.data.success) {
        snackbar.success("Password updated successfully! Redirecting to login...", {
          autoHideDuration: 2000,
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        throw new Error(response.data.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Password Update Error:", error.response?.data || error.message);

      const newValidationErrors = {};
      let toastMessage = null;

      if (error.response?.data?.errors) {
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
        if (error.response.data.message.toLowerCase().includes("password")) {
          newValidationErrors.password = error.response.data.message;
        } else {
          toastMessage = error.response.data.message;
        }
      } else {
        toastMessage = error.message || "Failed to update password. Please try again.";
      }

      setValidationErrors(newValidationErrors);
      if (toastMessage) {
        snackbar.error(toastMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your new password below."
      backTo="/login"
      backLabel="Back to Login"
      showSideImages={false}
      formColumns={{ xs: 12, sm: 10, md: 7, lg: 5 }}
    >
      <Stack component="form" onSubmit={handleSubmit} spacing={2.5} noValidate>
        {validationErrors.token ? (
          <Alert severity="error">{validationErrors.token}</Alert>
        ) : null}

        <AppTextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled
        />

        <AppTextField
          id="password"
          label="New Password"
          name="password"
          type={passwordVisible.password ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Enter your new password"
          value={formData.password}
          onChange={handleChange}
          error={validationErrors.password}
          helperText={validationErrors.password}
          disabled={loading}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={passwordVisible.password ? "Hide password" : "Show password"}
                  onClick={() => togglePasswordVisibility("password")}
                  edge="end"
                  disabled={loading}
                >
                  {passwordVisible.password ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <AppTextField
          id="confirmPassword"
          label="Confirm Password"
          name="confirmPassword"
          type={passwordVisible.confirmPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Confirm your new password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={validationErrors.confirmPassword}
          helperText={validationErrors.confirmPassword}
          disabled={loading}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    passwordVisible.confirmPassword ? "Hide password" : "Show password"
                  }
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  edge="end"
                  disabled={loading}
                >
                  {passwordVisible.confirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ borderRadius: "50px", py: 1.5, fontWeight: 600, textTransform: "none", minHeight: 48 }}
        >
          {loading ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} color="inherit" />
              <span>Updating...</span>
            </Stack>
          ) : (
            "Update Password"
          )}
        </Button>
      </Stack>
    </AuthLayout>
  );
};

export default ResetPassword;
