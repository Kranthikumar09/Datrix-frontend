import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/images/logo.png';
import config from "../config/config";

const JobApplyForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    job_id: '',
    resume: null,
    cover_letter: null,
    purpose: 'job'
  });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { isAuthenticated, logout } = useAuth();

  const getToken = () => localStorage.getItem('accessToken');

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to access this page.');
      navigate('/login');
    } else {
      if (jobId) {
        setFormData(prev => ({ ...prev, job_id: jobId }));
      }
      setCurrentStep(2);
    }
  }, [isAuthenticated, navigate, jobId]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || !files[0]) {
      toast.warn(`No file selected for ${name}.`);
      return;
    }

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(files[0].type)) {
      toast.error(`Invalid file type for ${name}. Please upload a PDF, DOC, or DOCX file.`);
      return;
    }

    if (files[0].size > maxSize) {
      toast.error(`File size for ${name} exceeds 5MB. Please upload a smaller file.`);
      return;
    }

    if (name === 'cover_letter' && formData.resume && files[0].name === formData.resume.name) {
      toast.warn('Cover letter is the same as resume. Please upload a different file if available.');
    }

    setFormData(prev => ({ ...prev, [name]: files[0] }));
    toast.success(`${name === 'resume' ? 'Resume' : 'Cover Letter'} uploaded: ${files[0].name}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called, formData:', formData);

    const token = getToken();
    
    // Simplified validation
    if (!formData.resume) {
      console.log('Validation failed: Missing resume');
      toast.error('Please upload your resume.');
      return;
    }

    if (!formData.job_id) {
      console.log('Validation failed: Missing job_id');
      toast.error('Job ID is missing.');
      return;
    }

    setLoading(true);
    toast.info('Submitting your application...', { autoClose: false, toastId: 'submitting' });

    const formDataToSend = new FormData();
    formDataToSend.append('job_id', formData.job_id);
    formDataToSend.append('resume', formData.resume);
    if (formData.cover_letter) {
      formDataToSend.append('cover_letter', formData.cover_letter);
    }
    formDataToSend.append('purpose', formData.purpose);

    try {
      const response = await axios.post(`${config.baseURL}/application/submit`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.dismiss('submitting');
        toast.success('Job application submitted successfully!');
        setTimeout(() => navigate('/applied-jobs'), 2000);
      } else {
        throw new Error(response.data.error || response.data.message || 'Failed to submit application');
      }
    } catch (err) {
      toast.dismiss('submitting');
      console.error('Submission error:', err);
      if (err.response) {
        const { status, data } = err.response;
        const errorMessage = data.error || data.message || 'Something went wrong';

        switch (status) {
          case 400:
            if (data.errors) {
              Object.entries(data.errors).forEach(([field, messages]) => {
                messages.forEach(message => toast.error(`${field}: ${message}`));
              });
            } else {
              toast.error(errorMessage);
            }
            break;

          case 401:
            toast.error('Session expired. Please log in again.');
            logout();
            navigate('/login');
            break;

          case 403:
            toast.error(errorMessage);
            break;

          case 404:
            toast.error(errorMessage);
            break;

          case 422:
            if (data.errors) {
              Object.entries(data.errors).forEach(([field, messages]) => {
                messages.forEach(message => toast.error(`${field}: ${message}`));
              });
            } else {
              toast.error(errorMessage);
            }
            break;

          case 500:
            toast.error(errorMessage);
            break;

          default:
            toast.error(errorMessage);
        }
      } else if (err.request) {
        toast.error('Network error: Unable to reach the server');
      } else {
        toast.error(`Error: ${err.message}`);
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
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <main>
        <div className="left-side-divider" style={{ width: '377px' }}>
          <Link to="/" className="d-flex navbar-brand align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
            <img src={logoImg} alt="logo-img" />
          </Link>
          <ul id="progressbar" className="side-bar-progress">
            <li className="active" id="account"><strong>Register</strong></li>
            <li className="active" id="apply"><strong>Apply Job</strong></li>
          </ul>
        </div>

        <div className="right-side-divider">
          <div className="container-fluid">
            <div className="row">
              <div className="col-11 text-center mt-3 mb-2">
                <div className="card px-0 pt-4 pb-0 mt-3 mb-3">
                  <form id="msform" onSubmit={handleSubmit}>
                    <fieldset>
                      <div className="form-card">
                        <div className="row text-center">
                          <div className="col-12">
                            <h2 className="fs-title">Apply for Job</h2>
                            <p className="sub-title">Upload your resume and cover letter</p>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group upload-file">
                              <label htmlFor="resume" className="form-label">
                                <div className="file-inner">
                                  <span className="upload-file-center">
                                    <img alt="" src="/static/media/photo-upload.d4568259a54ccf0fde3b65a9da53aa45.svg" />
                                  </span>
                                </div>
                                <span className="upload-text">Upload Resume</span>
                              </label>
                              <input
                                className="form-control"
                                id="resume"
                                name="resume"
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                              />
                              {formData.resume && (
                                <div className="mt-2 text-success">
                                  Uploaded: {formData.resume.name}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-group upload-file">
                              <label htmlFor="cover_letter" className="form-label">
                                <div className="file-inner">
                                  <span className="upload-file-center">
                                    <img alt="" src="/static/media/photo-upload.d4568259a54ccf0fde3b65a9da53aa45.svg" />
                                  </span>
                                </div>
                                <span className="upload-text">Upload Cover Letter</span>
                              </label>
                              <input
                                className="form-control"
                                id="cover_letter"
                                name="cover_letter"
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                              />
                              {formData.cover_letter && (
                                <div className="mt-2 text-success">
                                  Uploaded: {formData.cover_letter.name}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bottom-btn">
                        <button
                          type="submit"
                          className="action-button color-btn btn"
                          disabled={loading}
                        >
                          {loading ? 'Submitting...' : 'Submit Application'}
                        </button>
                      </div>
                    </fieldset>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobApplyForm;