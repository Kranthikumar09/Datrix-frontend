import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useAuth } from "../context/AuthContext";
import ProtectedPageLayout from "../components/layout/ProtectedPageLayout";
import FileUploadField from "../components/ui/FileUploadField";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import { useAppSnackbar } from "../components/ui/AppSnackbar";
import config from "../config/config";

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];

const UploadDocuments = () => {
  const [fullName, setFullName] = useState("");
  const [documents, setDocuments] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fileValidationError, setFileValidationError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const userId = JSON.parse(localStorage.getItem("user"))?.id || "N/A";
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const snackbar = useAppSnackbar();

  const getToken = () => localStorage.getItem("accessToken");
  const documentBaseUrl = `${config.assetUrl("uploads/user-documents")}/`;

  const fetchUserData = useCallback(async () => {
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
  }, [isAuthenticated, logout, navigate, snackbar, userId]);

  const fetchUploadedDocuments = useCallback(async () => {
    const token = getToken();
    if (!token || !isAuthenticated || !userId) {
      snackbar.error("Please log in to view documents.");
      logout();
      navigate("/login");
      return;
    }

    setFetchLoading(true);
    try {
      const response = await axios.get(`${config.baseURL}/user/details/get-documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setUploadedDocs(response.data.data || []);
      } else {
        throw new Error(response.data.message || "Failed to fetch documents");
      }
    } catch (err) {
      console.error("Error fetching uploaded documents:", err);
      if (err.response?.status === 401) {
        snackbar.error("Session expired. Please log in again.");
        logout();
        navigate("/login");
      } else {
        snackbar.error(err.message || "Failed to load uploaded documents");
      }
    } finally {
      setFetchLoading(false);
    }
  }, [isAuthenticated, logout, navigate, snackbar, userId]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
      fetchUploadedDocuments();
    } else {
      snackbar.error("Please log in to access this page.");
      navigate("/login");
    }
  }, [isAuthenticated, navigate, fetchUserData, fetchUploadedDocuments, snackbar]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      if (ALLOWED_FILE_TYPES.includes(file.type)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      setFileValidationError(`Unsupported file type(s): ${invalidFiles.join(", ")}`);
      setDocuments([]);
      return;
    }

    setFileValidationError("");
    setDocuments(validFiles);
    snackbar.success(`Selected ${validFiles.length} valid document${validFiles.length > 1 ? "s" : ""}`);
  };

  const clearSelection = () => {
    setDocuments([]);
    setFileValidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    if (fileValidationError) {
      snackbar.error("Please remove unsupported files before uploading.");
      return;
    }

    if (documents.length === 0) {
      snackbar.error("Please select at least one valid document.");
      return;
    }

    if (!token || !isAuthenticated || !userId) {
      snackbar.error("Please log in to upload documents.");
      logout();
      navigate("/login");
      return;
    }

    setLoading(true);
    setUploadError(null);

    const formData = new FormData();
    documents.forEach((doc) => {
      formData.append("docs", doc);
    });

    try {
      const response = await axios.post(`${config.baseURL}/user/details/upload-documents`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        snackbar.success(`Successfully uploaded ${documents.length} document${documents.length > 1 ? "s" : ""}!`);
        setDocuments([]);
        fetchUploadedDocuments();
      } else {
        throw new Error(response.data.message || "Failed to upload documents");
      }
    } catch (err) {
      console.error("Error uploading documents:", err);
      if (err.response?.status === 401) {
        snackbar.error("Session expired. Please log in again.");
        logout();
        navigate("/login");
      } else {
        const errorMessage = err.response?.data?.message || err.message || "Failed to upload documents";
        setUploadError(errorMessage);
        snackbar.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    const documentId = deleteTarget;
    setDeleteTarget(null);
    if (!documentId) return;

    const token = getToken();
    if (!token || !isAuthenticated || !userId) {
      snackbar.error("Please log in to delete documents.");
      logout();
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(`${config.baseURL}/user/details/delete-document`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { document_id: documentId },
      });

      if (response.data.success) {
        snackbar.success("Document deleted successfully!");
        fetchUploadedDocuments();
      } else {
        throw new Error(response.data.message || "Failed to delete document");
      }
    } catch (err) {
      console.error("Error deleting document:", err);
      if (err.response?.status === 401) {
        snackbar.error("Session expired. Please log in again.");
        logout();
        navigate("/login");
      } else {
        snackbar.error(err.response?.data?.message || err.message || "Failed to delete document");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedPageLayout fullName={fullName} userId={userId} title="Documents">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Upload Documents
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <FileUploadField
                  id="formFile"
                  label="Upload Your Documents"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  files={documents}
                  error={fileValidationError}
                  helperText="Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG"
                  disabled={loading}
                  onChange={handleFileChange}
                  onClear={clearSelection}
                />
                {uploadError ? <Alert severity="error">{uploadError}</Alert> : null}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || documents.length === 0 || Boolean(fileValidationError)}
                  startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                  sx={{ borderRadius: "50px", textTransform: "none", fontWeight: 600, alignSelf: "flex-start" }}
                >
                  {loading
                    ? "Uploading..."
                    : `Upload ${documents.length} Document${documents.length !== 1 ? "s" : ""}`}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Uploaded Documents
            </Typography>
            {fetchLoading ? (
              <LoadingState label="Loading documents..." height={180} />
            ) : uploadedDocs.length === 0 ? (
              <EmptyState title="No documents uploaded yet." />
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Document Name</TableCell>
                      <TableCell>Uploaded Date</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {uploadedDocs.map((doc, index) => (
                      <TableRow key={doc.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Link
                            href={`${documentBaseUrl}${doc.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                          >
                            {doc.path || "Unnamed Document"}
                          </Link>
                        </TableCell>
                        <TableCell>{new Date(doc.createdAt).toLocaleDateString("en-GB")}</TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            disabled={loading}
                            onClick={() => setDeleteTarget(doc.id)}
                            sx={{ textTransform: "none" }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete document?</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this document?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete} sx={{ textTransform: "none" }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </ProtectedPageLayout>
  );
};

export default UploadDocuments;
