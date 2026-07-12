
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedPageLayout from '../components/layout/ProtectedPageLayout';
import LoadingState from '../components/ui/LoadingState';
import config from "../config/config";

const WorkApplicationsDetails = () => {
  const { id } = useParams(); // Get the application ID from the URL
  const navigate = useNavigate(); // Initialize useNavigate
  const { isAuthenticated, logout } = useAuth(); // Use AuthContext

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullName, setFullName] = useState('');
  const userId = JSON.parse(localStorage.getItem('user'))?.id || 'N/A';

  const getToken = () => localStorage.getItem('accessToken');

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

  const fetchApplicationDetails = async () => {
    const token = getToken();
    if (!token || !isAuthenticated || !userId) {
      toast.error('Please log in to view application details.');
      logout();
      navigate('/login');
      setLoading(false);
      return;
    }

    if (!id) {
      setError('Application ID is missing');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${config.baseURL}/application/details/get`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          params: {
            application_id: id,
          },
        }
      );

      if (response.data.success) {
        const appData = response.data.data;
        if (appData && appData.purpose === 'Work') {
          setApplication(appData);
        } else {
          throw new Error('This application is not for work purposes');
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch application details');
      }
    } catch (err) {
      console.error('Error fetching application details:', err);
      setError(err.message || 'Failed to load application details');
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        toast.error(err.message || 'Failed to load application details');
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
      toast.error('Please log in to access this page.');
      navigate('/login');
    }
  }, [id, isAuthenticated, navigate, logout]);

  if (loading) {
    return (
      <ProtectedPageLayout fullName={fullName} userId={userId}>
        <LoadingState label="Loading application details..." height={240} />
        <ToastContainer theme="colored" position="top-right" autoClose={3000} />
      </ProtectedPageLayout>
    );
  }

  if (error) {
    return (
      <ProtectedPageLayout fullName={fullName} userId={userId}>
        <div className="alert alert-danger" role="alert">
          <h4>Error loading application details</h4>
          <p>{error}</p>
          <Link to="/work-applications" className="btn btn-primary">Back to Applications</Link>
        </div>
        <ToastContainer theme="colored" position="top-right" autoClose={3000} />
      </ProtectedPageLayout>
    );
  }

  if (!application) {
    return (
      <ProtectedPageLayout fullName={fullName} userId={userId}>
        <div className="alert alert-warning" role="alert">
          <h4>Application not found</h4>
          <Link to="/work-applications" className="btn btn-primary">Back to Applications</Link>
        </div>
        <ToastContainer theme="colored" position="top-right" autoClose={3000} />
      </ProtectedPageLayout>
    );
  }

  // Construct file URLs assuming files are served from a specific endpoint
  const resumeUrl = application.resume ? `${config.baseURL}/uploads/${application.resume}` : null;
  const coverLetterUrl = application.cover_letter ? `${config.baseURL}/uploads/${application.cover_letter}` : null;

  return (
    <ProtectedPageLayout fullName={fullName} userId={userId}>
                      <div className="single-area">
                        <h5 className="mb-0">Work Application Details</h5>
                      </div>
                      <div className="setting-personal-details">
                        <h5>Application #{application.id}</h5>
                        <div className="details-table">
                          <table className="table table-bordered table-sm">
                            <tbody>
                              <tr>
                                <th>Purpose</th>
                                <td>{application.purpose || 'N/A'}</td>
                              </tr>
                              <tr>
                                <th>Preferred Countries</th>
                                <td>{application.preferred_countries || 'N/A'}</td>
                              </tr>
                              <tr>
                                <th>Age</th>
                                <td>{application.age || 'N/A'}</td>
                              </tr>
                              <tr>
                                <th>Highest Education</th>
                                <td>{application.highest_education || 'N/A'}</td>
                              </tr>
                              <tr>
                                <th>Designation</th>
                                <td>{application.designation || 'N/A'}</td>
                              </tr>
                              <tr>
                                <th>Work Experience</th>
                                <td>{application.work_experience || 'N/A'}</td>
                              </tr>
                              <tr>
                                <th>Current Country</th>
                                <td>{application.current_country || 'N/A'}</td>
                              </tr>
                              <tr>
                                <th>Current State</th>
                                <td>{application.current_state || 'N/A'}</td>
                              </tr>
                              <tr>
                                <th>Query</th>
                                <td>{application.query || 'N/A'}</td>
                              </tr>
                              <tr>
                                <th>Resume</th>
                                <td>
                                  {application.resume ? (
                                    <span>
                                      {application.resume}
                                      </span>
                                  ) : (
                                    'N/A'
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Cover Letter</th>
                                <td>
                                  {application.cover_letter ? (
                                   <span>
                                      {application.cover_letter}
                                      </span>
                                  ) : (
                                    'N/A'
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Status</th>
                                <td>
                                  <span className={`status-badge ${application.status?.toLowerCase() || 'pending'}`}>
                                    {application.status || 'Pending'}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <th>Created At</th>
                                <td>{new Date(application.createdAt).toLocaleDateString() || 'N/A'}</td>
                              </tr>
                              <tr>
                                <th>Updated At</th>
                                <td>{new Date(application.updatedAt).toLocaleDateString() || 'N/A'}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="single-input btn-gp">
                          <Link to="/work-applications" className="color-btn btn">
                            Back to Applications
                          </Link>
                          {application.status === 'Pending' && (
                            <Link to={`/edit-work-application/${application.id}`} className="border-btn btn">
                              Edit Application
                            </Link>
                          )}
                        </div>
                      </div>
      <ToastContainer theme="colored" position="top-right" autoClose={3000} />
    </ProtectedPageLayout>
  );
};

export default WorkApplicationsDetails;
