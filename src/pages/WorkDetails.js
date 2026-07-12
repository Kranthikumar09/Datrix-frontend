import React, { useState, useEffect, useCallback } from "react";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { useAuth } from "../context/AuthContext";
import { useAppSnackbar } from "../components/ui/AppSnackbar";
import config from "../config/config";
import BrowseBreadcrumbs from "../components/ui/BrowseBreadcrumbs";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

const formatDate = (dateString) => {
  if (!dateString) return "Not Specified";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

const parseSkills = (skills) => {
  if (!skills) return "Not Specified";
  try {
    let parsed = skills;
    while (typeof parsed === "string") {
      parsed = JSON.parse(parsed);
    }
    return Array.isArray(parsed) ? parsed.join(", ") : String(parsed);
  } catch {
    return String(skills);
  }
};

const parseCommaSeparated = (value) => {
  if (!value) return ["Not Specified"];
  return value.split(",").map((item) => item.trim() || "Not Specified");
};

const DetailField = ({ label, value, children }) => (
  <Paper variant="outlined" sx={{ p: 2, height: "100%", borderRadius: 2 }}>
    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
      {label}
    </Typography>
    {children || (
      <Typography variant="body1" fontWeight={500}>
        {value || "Not Specified"}
      </Typography>
    )}
  </Paper>
);

const WorkDetails = () => {
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const snackbar = useAppSnackbar();
  const { isAuthenticated, logout } = useAuth();

  const getToken = () => localStorage.getItem("accessToken");

  const fetchJobDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${config.baseURL}/jobs/details/get`, {
        params: { job_id: id },
      });

      if (response.data.success) {
        setJobDetails(response.data.data);
      } else {
        setError("Job details not found.");
      }
    } catch (err) {
      console.error("Error fetching job details:", err);
      setError("Failed to load job details. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchApplicationStatus = useCallback(async () => {
    const token = getToken();
    if (!token || !isAuthenticated) {
      setHasApplied(false);
      return;
    }

    try {
      const response = await axios.post(
        `${config.baseURL}/application/is-user-applied-on-job`,
        { job_id: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setHasApplied(Boolean(response.data.success));
    } catch (err) {
      console.error("Error checking application status:", err);
      if (err.response?.status === 401) {
        snackbar.error("Session expired. Please log in again.");
        logout();
        navigate("/login");
      } else {
        setHasApplied(false);
        snackbar.error("Failed to check application status.");
      }
    }
  }, [id, isAuthenticated, logout, navigate, snackbar]);

  useEffect(() => {
    fetchJobDetails();
    fetchApplicationStatus();
  }, [fetchJobDetails, fetchApplicationStatus]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <LoadingState label="Loading job details..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <ErrorState title="Unable to load job" message={error} onRetry={fetchJobDetails} />
      </Container>
    );
  }

  if (!jobDetails) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <EmptyState title="Job not found" message="The requested job could not be found." />
      </Container>
    );
  }

  const {
    id: job_id = id,
    title = "Not Specified",
    company_name = "Not Specified",
    location = "Not Specified",
    country = "Not Specified",
    employment_type = "Not Specified",
    skills,
    qualifications = "Not Specified",
    experience_string = "Not Specified",
    experience_min = "Not Specified",
    experience_max = "Not Specified",
    specialization = "Not Specified",
    start_date,
    end_date,
    posted_date,
    telecommute = "Not Specified",
    sponser_visa = "Not Specified",
    industry = "Not Specified",
    functional_area = "Not Specified",
    domain = "Not Specified",
    english_proficiency = "Not Specified",
    number_of_posts = "Not Specified",
    address = "Not Specified",
    required_visa_status = "Not Specified",
    description = "No description provided.",
    responsibilities = "Not Specified",
    publish_status = "Not Specified",
    createdAt,
    updatedAt,
  } = jobDetails;

  return (
    <Box sx={{ py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <BrowseBreadcrumbs
          items={[
            { label: "Work", to: "/work" },
            { label: "Jobs", to: "/work-filter" },
            { label: `${title} at ${company_name}` },
          ]}
        />

        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", alignItems: "flex-start", gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight={700} sx={{ mb: 1 }}>
                {title} at {company_name}
              </Typography>
              <Typography color="text.secondary">
                {location}, {country}
              </Typography>
            </Box>
            <Chip label={employment_type} color="default" />
          </Stack>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailField label="Job ID" value={job_id} /></Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailField label="Start Date" value={formatDate(start_date)} /></Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailField label="Expiry Date" value={formatDate(end_date)} /></Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailField label="Posted On" value={formatDate(posted_date)} /></Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailField label="Experience" value={experience_string} /></Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailField label="Telecommute" value={telecommute} /></Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailField label="Sponsor Visa" value={sponser_visa} /></Grid>
          </Grid>

          <Button
            component={hasApplied ? "button" : RouterLink}
            to={hasApplied ? undefined : `/job-apply-form/${job_id}`}
            variant="contained"
            color="primary"
            disabled={hasApplied}
            sx={{ borderRadius: "50px", textTransform: "none", fontWeight: 600, px: 4 }}
          >
            {hasApplied ? "Applied" : "Apply"}
          </Button>
        </Paper>

        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
          Requirement Summary
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6 }}><DetailField label="Experience Range" value={`Min: ${experience_min} - Max: ${experience_max} year(s)`} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><DetailField label="Specialization" value={specialization} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><DetailField label="Industry" value={industry} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><DetailField label="Functional Area" value={functional_area} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><DetailField label="Domain" value={domain} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><DetailField label="English Proficiency" value={english_proficiency} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><DetailField label="Number of Posts" value={number_of_posts} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><DetailField label="Address" value={address} /></Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <DetailField label="Required Visa Status">
              <Stack component="ul" spacing={0.5} sx={{ m: 0, pl: 2 }}>
                {parseCommaSeparated(required_visa_status).map((status, index) => (
                  <Typography component="li" key={index} variant="body2">{status}</Typography>
                ))}
              </Stack>
            </DetailField>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <DetailField label="Employment Type" value={employment_type} />
          </Grid>
        </Grid>

        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
          Job Description
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, mb: 4, borderRadius: 2 }}>
          <Typography color="text.secondary">{description}</Typography>
        </Paper>

        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
          Additional Details
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 4 }}><DetailField label="Publish Status" value={publish_status} /></Grid>
          <Grid size={{ xs: 12, sm: 4 }}><DetailField label="Created At" value={formatDate(createdAt)} /></Grid>
          <Grid size={{ xs: 12, sm: 4 }}><DetailField label="Updated At" value={formatDate(updatedAt)} /></Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}><DetailField label="Skills" value={parseSkills(skills)} /></Grid>
          <Grid size={{ xs: 12, md: 4 }}><DetailField label="Qualification" value={qualifications} /></Grid>
          <Grid size={{ xs: 12, md: 4 }}><DetailField label="Responsibilities" value={responsibilities} /></Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WorkDetails;
