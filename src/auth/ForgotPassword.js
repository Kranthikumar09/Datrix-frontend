import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import config from "../config/config";
import { useAppSnackbar } from "../components/ui/AppSnackbar";
import AppTextField from "../components/ui/AppTextField";
import AuthLayout from "./AuthLayout";

const RESET_TOKEN_URL = `${config.baseURL}/verify/email-token/send`;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const snackbar = useAppSnackbar();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError("");
    setLoading(true);

    try {
      const response = await axios.post(RESET_TOKEN_URL, {
        user_email: trimmed,
        type: "password",
      });
      if (response.data.success) {
        snackbar.success("A password reset link has been sent to your email!");
        setEmail("");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        snackbar.error(response.data.message || "Failed to send reset link.");
      }
    } catch (error) {
      console.error("Reset Request Error:", error.response?.data || error.message);
      snackbar.error(
        error.response?.data?.message || "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email to receive a reset link."
      backTo="/login"
      backLabel="Back to Login"
      showSideImages={false}
      formColumns={{ xs: 12, sm: 10, md: 7, lg: 5 }}
    >
      <Stack component="form" onSubmit={handleSubmit} spacing={2.5} noValidate>
        <AppTextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError("");
          }}
          error={emailError}
          helperText={emailError}
          disabled={loading}
          required
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
              <span>Sending...</span>
            </Stack>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </Stack>
    </AuthLayout>
  );
};

export default ForgotPassword;
