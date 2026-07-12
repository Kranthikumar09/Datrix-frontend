import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import config from "../config/config";
import photoUploadImg from '../assets/images/photo-upload.svg';

const UploadDocuments = () => {
  const [fullName, setFullName] = useState('');
  const [documents, setDocuments] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fileValidationError, setFileValidationError] = useState('');

  const userId = JSON.parse(localStorage.getItem('user'))?.id || 'N/A';
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const getToken = () => localStorage.getItem('accessToken');
  const documentBaseUrl = `${config.assetUrl('uploads/user-documents')}/`;

  const allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
  ];

  const fetchUserData = async () => {
    const token = getToken();
    if (!token || !isAuthenticated || !userId) {
      toast.error('Please log in to continue.');
      logout();
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        `${config.baseURL}/user/details/get`,
        { user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setFullName(response.data.data.name || '');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        toast.error('Failed to load user data');
      }
    }
  };

  const fetchUploadedDocuments = async () => {
    const token = getToken();
    if (!token || !isAuthenticated || !userId) {
      toast.error('Please log in to view documents.');
      logout();
      navigate('/login');
      return;
    }

    setFetchLoading(true);
    try {
      const response = await axios.get(
        `${config.baseURL}/user/details/get-documents`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setUploadedDocs(response.data.data || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch documents');
      }
    } catch (err) {
      console.error('Error fetching uploaded documents:', err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        toast.error(err.message || 'Failed to load uploaded documents');
      }
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
      fetchUploadedDocuments();
    } else {
      toast.error('Please log in to access this page.');
      navigate('/login');
    }
  }, [isAuthenticated, navigate, logout]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const invalidFiles = [];

    files.forEach(file => {
      if (allowedFileTypes.includes(file.type)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      setFileValidationError(`Unsupported file type(s): ${invalidFiles.join(', ')}`);
      setDocuments([]); // Prevent mixed upload
      return;
    }

    setFileValidationError('');
    setDocuments(validFiles);
    toast.success(`Selected ${validFiles.length} valid document${validFiles.length > 1 ? 's' : ''}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    if (fileValidationError) {
      toast.error('Please remove unsupported files before uploading.');
      return;
    }

    if (documents.length === 0) {
      toast.error('Please select at least one valid document.');
      return;
    }

    if (!token || !isAuthenticated || !userId) {
      toast.error('Please log in to upload documents.');
      logout();
      navigate('/login');
      return;
    }

    setLoading(true);
    setUploadError(null);

    const formData = new FormData();
    documents.forEach((doc) => {
      formData.append('docs', doc);
    });

    try {
      const response = await axios.post(
        `${config.baseURL}/user/details/upload-documents`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(`Successfully uploaded ${documents.length} document${documents.length > 1 ? 's' : ''}!`);
        setDocuments([]);
        document.getElementById('formFile').value = '';
        fetchUploadedDocuments();
      } else {
        throw new Error(response.data.message || 'Failed to upload documents');
      }
    } catch (err) {
      console.error('Error uploading documents:', err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to upload documents';
        setUploadError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    const token = getToken();
    if (!token || !isAuthenticated || !userId) {
      toast.error('Please log in to delete documents.');
      logout();
      navigate('/login');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(
        `${config.baseURL}/user/details/delete-document`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { document_id: documentId },
        }
      );

      if (response.data.success) {
        toast.success('Document deleted successfully!');
        fetchUploadedDocuments();
      } else {
        throw new Error(response.data.message || 'Failed to delete document');
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        toast.error(err.response?.data?.message || err.message || 'Failed to delete document');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-section">
      <ToastContainer
        theme="colored"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <section className="profile-section sdsd">
        <div className="container">
          <div className="row justify-content-center">
            <Sidebar fullName={fullName} userId={userId} />
            <div className="col-xl-9 col-lg-8">
              <div className="row setting-tab">
                <div className="col-md-5">
                  <div className="single-area">
                    <h5 className="mb-0">Upload Documents</h5>
                  </div>
                  <div className="profile-form">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group upload-file">
                            <label htmlFor="formFile" className="form-label">
                              <div className="file-inner">
                                <span className="upload-file-center">
                                  <img src={photoUploadImg} alt="Upload Icon" />
                                </span>
                              </div>
                              <span className="upload-text">Upload Your Documents</span>
                            </label>
                            <input
                              className="form-control"
                              type="file"
                              id="formFile"
                              onChange={handleFileChange}
                              multiple
                              disabled={loading}
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                            <small className="text-muted">Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG</small>
                            {fileValidationError && (
                              <div className="alert alert-danger mt-2" role="alert">
                                {fileValidationError}
                              </div>
                            )}
                            {documents.length > 0 && (
                              <div className="mt-2 text-success">
                                Selected ({documents.length}): 
                                <ul className="mb-0">
                                  {documents.map((doc, index) => (
                                    <li key={index}>{doc.name}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                        {uploadError && (
                          <div className="col-md-12">
                            <div className="alert alert-danger mt-3" role="alert">
                              {uploadError}
                            </div>
                          </div>
                        )}
                        <div className="col-md-12 mt-3 text-center">
                          <button
                            type="submit"
                            className="color-btn btn"
                            disabled={loading || documents.length === 0 || fileValidationError}
                          >
                            {loading ? 'Uploading...' : `Upload ${documents.length} Document${documents.length !== 1 ? 's' : ''}`}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="col-md-7">
                  <div className="single-area">
                    <h5 className="mb-0">Uploaded Documents</h5>
                  </div>
                  <div className="profile-form">
                    <div className="mt-5">
                      {fetchLoading ? (
                        <div className="d-flex justify-content-center my-3">
                          <div className="spinner-border text-danger" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : uploadedDocs.length === 0 ? (
                        <p>No documents uploaded yet.</p>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Document Name</th>
                                <th>Uploaded Date</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {uploadedDocs.map((doc, index) => (
                                <tr key={doc.id}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <a
                                      href={`${documentBaseUrl}${doc.path}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary"
                                    >
                                      {doc.path || 'Unnamed Document'}
                                    </a>
                                  </td>
                                  <td>{new Date(doc.createdAt).toLocaleDateString('en-GB')}</td>
                                  <td>
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() => handleDelete(doc.id)}
                                      disabled={loading}
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UploadDocuments;
