import React, { useState, useEffect } from "react";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAuth } from "../context/AuthContext";
import ProtectedPageLayout from "../components/layout/ProtectedPageLayout";
import LoadingState from "../components/ui/LoadingState";
import DetailsTable from "../components/ui/DetailsTable";
import StatusChip from "../components/ui/StatusChip";
import { useAppSnackbar } from "../components/ui/AppSnackbar";
import config from "../config/config";

const StudyApplicationsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const snackbar = useAppSnackbar();

  const [application, setApplication] = useState(null);
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

  const fetchApplicationDetails = async () => {
    const token = getToken();
    if (!token || !isAuthenticated || !userId) {
      snackbar.error("Please log in to view application details.");
      logout();
      navigate("/login");
      setLoading(false);
      return;
    }

    if (!id) {
      setError("Application ID is missing");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${config.baseURL}/application/details/get`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          application_id: id,
        },
      });

      if (response.data.success) {
        const appData = response.data.data;
        if (appData && appData.purpose === "Study") {
          setApplication(appData);
        } else {
          throw new Error("This application is not for study purposes");
        }
      } else {
        throw new Error(response.data.message || "Failed to fetch application details");
      }
    } catch (err) {
      console.error("Error fetching application details:", err);
      setError(err.message || "Failed to load application details");
      if (err.response?.status === 401) {
        snackbar.error("Session expired. Please log in again.");
        logout();
        navigate("/login");
      } else {
        snackbar.error(err.message || "Failed to load application details");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
      fetchApplicationDetails();
    } else {
      snackbar.error("Please log in to access this page.");
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated, navigate, logout]);

  if (loading) {
    return (
      <ProtectedPageLayout fullName={fullName} userId={userId} title="Study Application Details">
        <LoadingState label="Loading application details..." height={240} />
      </ProtectedPageLayout>
    );
  }

  if (error) {
    return (
      <ProtectedPageLayout fullName={fullName} userId={userId} title="Study Application Details">
        <Alert
          severity="error"
          action={
            <Button component={RouterLink} to="/study-applications" color="inherit" size="small">
              Back to Applications
            </Button>
          }
        >
          <Typography fontWeight={700}>Error loading application details</Typography>
          {error}
        </Alert>
      </ProtectedPageLayout>
    );
  }

  if (!application) {
    return (
      <ProtectedPageLayout fullName={fullName} userId={userId} title="Study Application Details">
        <Alert
          severity="warning"
          action={
            <Button component={RouterLink} to="/study-applications" color="inherit" size="small">
              Back to Applications
            </Button>
          }
        >
          <Typography fontWeight={700}>Application not found</Typography>
        </Alert>
      </ProtectedPageLayout>
    );
  }

  const detailRows = [
    { label: "Purpose", value: application.purpose || "N/A" },
    { label: "Preferred Countries", value: application.preferred_countries || "N/A" },
    { label: "Age", value: application.age || "N/A" },
    { label: "Highest Education", value: application.highest_education || "N/A" },
    { label: "Study Level", value: application.intrested_in_study_level || "N/A" },
    { label: "Stream", value: application.stream || "N/A" },
    { label: "Percentage", value: application.percentage ? `${application.percentage}%` : "N/A" },
    { label: "Total Budget", value: application.total_budget ? `$${application.total_budget}` : "N/A" },
    { label: "Current Country", value: application.current_country || "N/A" },
    { label: "Current State", value: application.current_state || "N/A" },
    { label: "Query", value: application.query || "N/A" },
    { label: "Status", value: <StatusChip status={application.status} /> },
    {
      label: "Created At",
      value: application.createdAt ? new Date(application.createdAt).toLocaleDateString() : "N/A",
    },
    {
      label: "Updated At",
      value: application.updatedAt ? new Date(application.updatedAt).toLocaleDateString() : "N/A",
    },
  ];

  return (
    <ProtectedPageLayout fullName={fullName} userId={userId} title="Study Application Details">
      <Stack spacing={2.5}>
        <Typography variant="h6" fontWeight={700}>
          Application #{application.id}
        </Typography>
        <DetailsTable rows={detailRows} />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button
            component={RouterLink}
            to="/study-applications"
            variant="contained"
            color="primary"
            sx={{ textTransform: "none", borderRadius: "50px", fontWeight: 600 }}
          >
            Back to Applications
          </Button>
          {application.status === "Pending" ? (
            <Button
              component={RouterLink}
              to={`/edit-study-application/${application.id}`}
              variant="outlined"
              color="secondary"
              sx={{ textTransform: "none", borderRadius: "50px", fontWeight: 600 }}
            >
              Edit Application
            </Button>
          ) : null}
        </Stack>
      </Stack>
    </ProtectedPageLayout>
  );
};

export default StudyApplicationsDetails;
