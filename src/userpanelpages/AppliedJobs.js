import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar'; // Adjust path as needed
import config from "../config/config";

const AppliedJobs = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const [applications, setApplications] = useState([]);
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

  const fetchAppliedJobs = async () => {
    const token = getToken();
    if (!token || !isAuthenticated || !userId) {
      toast.error('Please log in to view your applied jobs.');
      logout();
      navigate('/login');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${config.baseURL}/applications/get`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          params: {
            purpose: 'Job',
            user_id: userId,
          },
        }
      );

      if (response.data.success) {
        setApplications(response.data.data || []);
      } else {
        if (response.data.message === "Data not available.") {
          setApplications([]);
        } else {
          throw new Error(response.data.message || 'Failed to fetch applied jobs');
        }
      }
    } catch (err) {
      console.error('Error fetching applied jobs:', err);
      setError(err.message || 'Failed to load applied jobs');
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        toast.error(err.message || 'Failed to load applied jobs');
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
      toast.error('Please log in to access this page.');
      navigate('/login');
    }
  }, [isAuthenticated, navigate, logout]);

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('en-GB') : 'N/A';
  };

  const handleViewJob = (jobId) => {
    navigate(`/job-details/${jobId}`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <ToastContainer theme="colored" position="top-right" autoClose={3000} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        <h4>Error loading applied jobs</h4>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchAppliedJobs}>Try Again</button>
        <ToastContainer theme="colored" position="top-right" autoClose={3000} />
      </div>
    );
  }

  return (
    <div className="main-section">
      <section className="profile-section">
        <div className="container">
          <div className="row justify-content-center">
            <Sidebar fullName={fullName} userId={userId} />
            <div className="col-xl-9 col-lg-8">
              <div className="tab-content">
                <div className="setting-tab">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="single-area">
                        <h5 className="mb-0">Applied Jobs</h5>
                      </div>
                      <div className="setting-personal-details">
                        <h5>Your Applied Jobs</h5>
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered">
                            <thead>
                              <tr>
                                <th>Job Id</th>
                                <th>Job Title</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Applied Date</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {applications.length > 0 ? (
                                applications.map((app) => (
                                  <tr key={app.id}>
                                    <td>{app.job_id}</td>
                                    <td>{app.job?.title} at {app.job?.company_name}</td>
                                    <td>{app.job?.location || 'N/A'}</td>
                                    <td>
                                      <span className={`status-badge ${app.status?.toLowerCase() || 'pending'}`}>
                                        {app.status || 'Pending'}
                                      </span>
                                    </td>
                                    <td>{formatDate(app.createdAt)}</td>
                                    <td>
                                      <div className="btn-gp">
                                        <button
                                          className="color-btn btn"
                                          onClick={() => handleViewJob(app.job_id)}
                                        >
                                          View Job
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="6" className="text-center">
                                    No applied jobs found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer theme="colored" position="top-right" autoClose={3000} />
    </div>
  );
};

export default AppliedJobs;