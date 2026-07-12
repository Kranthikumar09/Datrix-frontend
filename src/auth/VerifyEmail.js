import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import config from "../config/config";
import { useAppSnackbar } from "../components/ui/AppSnackbar";
import LoginBg from "../assets/images/login-bg.png";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const snackbar = useAppSnackbar();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      const email = searchParams.get("email");
      const token = searchParams.get("token");
      const type = searchParams.get("type");

      if (!email || !token || !type) {
        snackbar.error("Invalid verification link.");
        setError("Invalid verification link.");
        setLoading(false);
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      try {
        const response = await axios.post(`${config.baseURL}/verify/email-token`, {
          user_email: email,
          token,
          type,
        });

        if (response.data.success) {
          if (type === "verify") {
            snackbar.success(
              response.data.message || "Email verified successfully! Please log in."
            );
            setTimeout(() => navigate("/login"), 2000);
          } else if (type === "password") {
            snackbar.success(
              response.data.message || "Verification successful! Please reset your password."
            );
            setTimeout(
              () => navigate(`/reset-password?email=${email}&token=${token}`),
              2000
            );
          }
        } else {
          const message = response.data.message || "Verification failed.";
          snackbar.error(message);
          setError(message);
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Verification failed.";
        snackbar.error(errorMessage);
        setError(errorMessage);
        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        backgroundImage: `url(${LoginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 440,
          p: 4,
          borderRadius: 3,
          textAlign: "center",
          boxShadow: "0px 8px 40px rgba(0, 0, 0, 0.05)",
        }}
      >
        {loading ? (
          <Stack spacing={2} alignItems="center">
            <CircularProgress color="primary" />
            <Typography variant="h5" fontWeight={700}>
              Verifying...
            </Typography>
            <Typography color="text.secondary">Please wait a moment.</Typography>
          </Stack>
        ) : error ? (
          <Stack spacing={2} alignItems="center">
            <ErrorOutlinedIcon color="error" sx={{ fontSize: 48 }} />
            <Typography variant="h5" fontWeight={700} color="error.main">
              Verification Failed
            </Typography>
            <Alert severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          </Stack>
        ) : (
          <Stack spacing={2} alignItems="center">
            <CheckCircleOutlinedIcon color="success" sx={{ fontSize: 48 }} />
            <Typography variant="h5" fontWeight={700} color="success.main">
              Verified Successfully!
            </Typography>
            <Typography color="text.secondary">Redirecting...</Typography>
          </Stack>
        )}
      </Paper>
    </Box>
  );
};

export default VerifyEmail;
