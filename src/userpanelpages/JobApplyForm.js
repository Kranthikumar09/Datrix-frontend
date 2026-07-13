import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useAuth } from "../context/AuthContext";
import config from "../config/config";
import { useAppSnackbar } from "../components/ui/AppSnackbar";
import FileUploadField from "../components/ui/FileUploadField";
import WizardShell from "../components/layout/WizardShell";

const VALID_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE = 5 * 1024 * 1024;

const JobApplyForm = () => {
  const [formData, setFormData] = useState({
    job_id: "",
    resume: null,
    cover_letter: null,
    purpose: "job",
  });
  const [fileErrors, setFileErrors] = useState({ resume: "", cover_letter: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { jobId } = useParams();
  const { isAuthenticated, logout } = useAuth();
  const snackbar = useAppSnackbar();

  const getToken = () => localStorage.getItem("accessToken");

  useEffect(() => {
    if (!isAuthenticated) {
      snackbar.error("Please log in to access this page.");
      navigate("/login");
      return;
    }
    if (jobId) {
      setFormData((prev) => ({ ...prev, job_id: jobId }));
    }
  }, [isAuthenticated, navigate, jobId, snackbar]);

  const validateFile = (name, file) => {
    if (!VALID_TYPES.includes(file.type)) {
      return `Invalid file type for ${name}. Please upload a PDF, DOC, or DOCX file.`;
    }
    if (file.size > MAX_SIZE) {
      return `File size for ${name} exceeds 5MB. Please upload a smaller file.`;
    }
    return "";
  };

  const handleFileChange = (name) => (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      snackbar.warning(`No file selected for ${name}.`);
      return;
    }

    const error = validateFile(name, file);
    if (error) {
      setFileErrors((prev) => ({ ...prev, [name]: error }));
      snackbar.error(error);
      e.target.value = "";
      return;
    }

    if (name === "cover_letter" && formData.resume && file.name === formData.resume.name) {
      snackbar.warning("Cover letter is the same as resume. Please upload a different file if available.");
    }

    setFileErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({ ...prev, [name]: file }));
    snackbar.success(`${name === "resume" ? "Resume" : "Cover Letter"} uploaded: ${file.name}`);
  };

  const clearFile = (name) => () => {
    setFormData((prev) => ({ ...prev, [name]: null }));
    setFileErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    if (!formData.resume) {
      snackbar.error("Please upload your resume.");
      setFileErrors((prev) => ({ ...prev, resume: "Please upload your resume." }));
      return;
    }

    if (!formData.job_id) {
      snackbar.error("Job ID is missing.");
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("job_id", formData.job_id);
    formDataToSend.append("resume", formData.resume);
    if (formData.cover_letter) {
      formDataToSend.append("cover_letter", formData.cover_letter);
    }
    formDataToSend.append("purpose", formData.purpose);

    try {
      const response = await axios.post(`${config.baseURL}/application/submit`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        snackbar.success("Job application submitted successfully!");
        setTimeout(() => navigate("/applied-jobs"), 2000);
      } else {
        throw new Error(response.data.error || response.data.message || "Failed to submit application");
      }
    } catch (err) {
      console.error("Submission error:", err);
      if (err.response) {
        const { status, data } = err.response;
        const errorMessage = data.error || data.message || "Something went wrong";

        if ((status === 400 || status === 422) && data.errors) {
          Object.entries(data.errors).forEach(([field, messages]) => {
            messages.forEach((message) => snackbar.error(`${field}: ${message}`));
          });
        } else if (status === 401) {
          snackbar.error("Session expired. Please log in again.");
          logout();
          navigate("/login");
        } else {
          snackbar.error(errorMessage);
        }
      } else if (err.request) {
        snackbar.error("Network error: Unable to reach the server");
      } else {
        snackbar.error(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <WizardShell
      steps={["Register", "Apply Job"]}
      activeStep={1}
      title="Apply for Job"
      subtitle="Upload your resume and cover letter"
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FileUploadField
              id="resume"
              label="Upload Resume"
              required
              accept=".pdf,.doc,.docx"
              value={formData.resume}
              error={fileErrors.resume}
              disabled={loading}
              onChange={handleFileChange("resume")}
              onClear={clearFile("resume")}
              inputProps={{ name: "resume" }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FileUploadField
              id="cover_letter"
              label="Upload Cover Letter"
              accept=".pdf,.doc,.docx"
              value={formData.cover_letter}
              error={fileErrors.cover_letter}
              disabled={loading}
              onChange={handleFileChange("cover_letter")}
              onClear={clearFile("cover_letter")}
              inputProps={{ name: "cover_letter" }}
            />
          </Grid>
        </Grid>

        <Stack direction="row" sx={{ justifyContent: "center", mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{ borderRadius: "50px", textTransform: "none", fontWeight: 600, px: 4, py: 1.25 }}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </Stack>
      </Box>
    </WizardShell>
  );
};

export default JobApplyForm;
