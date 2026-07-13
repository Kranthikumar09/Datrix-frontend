import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAuth } from "../context/AuthContext";
import ProtectedPageLayout from "../components/layout/ProtectedPageLayout";
import LoadingState from "../components/ui/LoadingState";
import ApplicationsDataList from "../components/ui/ApplicationsDataList";
import StatusChip from "../components/ui/StatusChip";
import { useAppSnackbar } from "../components/ui/AppSnackbar";
import config from "../config/config";

const AppliedJobs = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const snackbar = useAppSnackbar();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullName, setFullName] = useState("");
  const userId = JSON.parse(localStorage.getItem("user"))?.id || "N/A";

  const getToken = () => localStorage.getItem("accessToken");

  const fetchUserData = async () => {
    const token = getToken();
    if (!token || !isAuthenticated || !userId) {
      snackbar.error("Please log in to continue.");
      logout();
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${config.baseURL}/user/details/get`,
        { user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setFullName(response.data.data.name || "");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      if (err.response?.status === 401) {
        snackbar.error("Session expired. Please log in again.");
        logout();
        navigate("/login");
      } else {
        snackbar.error("Failed to load user data");
      }
    }
  };

  const fetchAppliedJobs = async () => {
    const token = getToken();
    if (!token || !isAuthenticated || !userId) {
      snackbar.error("Please log in to view your applied jobs.");
      logout();
      navigate("/login");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${config.baseURL}/applications/get`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          purpose: "Job",
          user_id: userId,
        },
      });

      if (response.data.success) {
        setApplications(response.data.data || []);
      } else if (response.data.message === "Data not available.") {
        setApplications([]);
      } else {
        throw new Error(response.data.message || "Failed to fetch applied jobs");
      }
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
      setError(err.message || "Failed to load applied jobs");
      if (err.response?.status === 401) {
        snackbar.error("Session expired. Please log in again.");
        logout();
        navigate("/login");
      } else {
        snackbar.error(err.message || "Failed to load applied jobs");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
      fetchAppliedJobs();
    } else {
      snackbar.error("Please log in to access this page.");
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, navigate, logout]);

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString("en-GB") : "N/A";

  const handleViewJob = (jobId) => {
    navigate(`/job-details/${jobId}`);
  };

  const columns = [
    { id: "job_id", label: "Job Id", render: (app) => app.job_id || "N/A" },
    {
      id: "title",
      label: "Job Title",
      render: (app) => `${app.job?.title || "N/A"} at ${app.job?.company_name || "N/A"}`,
    },
    { id: "location", label: "Location", render: (app) => app.job?.location || "N/A" },
    { id: "status", label: "Status", render: (app) => <StatusChip status={app.status} /> },
    { id: "createdAt", label: "Applied Date", render: (app) => formatDate(app.createdAt) },
  ];

  const actions = (app) => (
    <Button
      size="small"
      variant="contained"
      color="primary"
      onClick={() => handleViewJob(app.job_id)}
      sx={{ textTransform: "none", borderRadius: "50px", fontWeight: 600 }}
    >
      View Job
    </Button>
  );

  if (loading) {
    return (
      <ProtectedPageLayout fullName={fullName} userId={userId} title="Applied Jobs">
        <LoadingState label="Loading applied jobs..." height={240} />
      </ProtectedPageLayout>
    );
  }

  if (error) {
    return (
      <ProtectedPageLayout fullName={fullName} userId={userId} title="Applied Jobs">
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchAppliedJobs}>
              Try Again
            </Button>
          }
        >
          <Typography fontWeight={700}>Error loading applied jobs</Typography>
          {error}
        </Alert>
      </ProtectedPageLayout>
    );
  }

  return (
    <ProtectedPageLayout fullName={fullName} userId={userId} title="Applied Jobs">
      <Stack spacing={2.5}>
        <Typography variant="h6" fontWeight={700}>
          Your Applied Jobs
        </Typography>
        <ApplicationsDataList
          columns={columns}
          rows={applications}
          emptyTitle="No applied jobs found"
          emptyMessage="Jobs you apply to will appear here."
          actions={actions}
        />
      </Stack>
    </ProtectedPageLayout>
  );
};

export default AppliedJobs;
