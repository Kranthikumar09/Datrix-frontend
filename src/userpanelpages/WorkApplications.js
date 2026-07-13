import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAuth } from "../context/AuthContext";
import config from "../config/config";
import ProtectedPageLayout from "../components/layout/ProtectedPageLayout";
import LoadingState from "../components/ui/LoadingState";
import ApplicationsDataList from "../components/ui/ApplicationsDataList";
import StatusChip from "../components/ui/StatusChip";
import { useAppSnackbar } from "../components/ui/AppSnackbar";

const WorkApplications = () => {
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

  const fetchApplications = async () => {
    const token = getToken();
    if (!token || !isAuthenticated || !userId) {
      snackbar.error("Please log in to view your applications.");
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
          purpose: "Work",
          user_id: userId,
        },
      });

      if (response.data.success) {
        setApplications(response.data.data || []);
      } else if (response.data.message === "Data not available.") {
        setApplications([]);
      } else {
        throw new Error(response.data.message || "Failed to fetch applications");
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError(err.message || "Failed to load applications");
      if (err.response?.status === 401) {
        snackbar.error("Session expired. Please log in again.");
        logout();
        navigate("/login");
      } else {
        snackbar.error(err.message || "Failed to load applications");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
      fetchApplications();
    } else {
      snackbar.error("Please log in to access this page.");
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, navigate, logout]);

  const columns = [
    { id: "id", label: "App. ID", render: (app) => app.id || "N/A" },
    { id: "preferred_countries", label: "Preferred Countries", render: (app) => app.preferred_countries || "N/A" },
    { id: "designation", label: "Designation", render: (app) => app.designation || "N/A" },
    { id: "status", label: "Status", render: (app) => <StatusChip status={app.status} /> },
    {
      id: "createdAt",
      label: "Date",
      render: (app) => (app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A"),
    },
  ];

  const actions = (app) => (
    <>
      <Button
        component={RouterLink}
        to={`/work-application-details/${app.id}`}
        size="small"
        variant="contained"
        color="primary"
        sx={{ textTransform: "none", borderRadius: "50px", fontWeight: 600 }}
      >
        View
      </Button>
      {app.status === "Pending" ? (
        <Button
          component={RouterLink}
          to={`/edit-work-application/${app.id}`}
          size="small"
          variant="outlined"
          color="secondary"
          sx={{ textTransform: "none", borderRadius: "50px", fontWeight: 600 }}
        >
          Edit
        </Button>
      ) : null}
    </>
  );

  if (loading) {
    return (
      <ProtectedPageLayout fullName={fullName} userId={userId} title="Work Applications">
        <LoadingState label="Loading applications..." height={240} />
      </ProtectedPageLayout>
    );
  }

  if (error) {
    return (
      <ProtectedPageLayout fullName={fullName} userId={userId} title="Work Applications">
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchApplications}>
              Try Again
            </Button>
          }
        >
          <Typography fontWeight={700}>Error loading applications</Typography>
          {error}
        </Alert>
      </ProtectedPageLayout>
    );
  }

  return (
    <ProtectedPageLayout fullName={fullName} userId={userId} title="Work Applications">
      <Stack spacing={2.5}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={700}>
            Your Work Applications
          </Typography>
          <Button
            component={RouterLink}
            to="/application-form"
            variant="contained"
            color="primary"
            sx={{ textTransform: "none", borderRadius: "50px", fontWeight: 600, alignSelf: { xs: "stretch", sm: "auto" } }}
          >
            Create Application
          </Button>
        </Stack>

        <ApplicationsDataList
          columns={columns}
          rows={applications}
          emptyTitle="No work applications found"
          emptyMessage="Create an application to get started."
          actions={actions}
        />
      </Stack>
    </ProtectedPageLayout>
  );
};

export default WorkApplications;
