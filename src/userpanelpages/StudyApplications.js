import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import config from "../config/config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedPageLayout from '../components/layout/ProtectedPageLayout';
import LoadingState from '../components/ui/LoadingState';

const StudyApplications = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { isAuthenticated, logout } = useAuth(); // Use AuthContext

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

  const fetchApplications = async () => {
    const token = getToken();
    if (!token || !isAuthenticated || !userId) {
      toast.error('Please log in to view your applications.');
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
            purpose: 'Study',
            user_id: userId,
          },
        }
      );

      if (response.data.success) {
        setApplications(response.data.data || []);
      } else {
        // Handle "Data not available" case
        if (response.data.message === "Data not available.") {
          setApplications([]); // Set empty array to show "No applications found"
        } else {
          throw new Error(response.data.message || 'Failed to fetch applications');
        }
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.message || 'Failed to load applications');
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        toast.error(err.message || 'Failed to load applications');
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
      toast.error('Please log in to access this page.');
      navigate('/login');
    }
  }, [isAuthenticated, navigate, logout]);

  if (loading) {
    return (
      <ProtectedPageLayout fullName={fullName} userId={userId}>
        <LoadingState label="Loading applications..." height={240} />
        <ToastContainer theme="colored" position="top-right" autoClose={3000} />
      </ProtectedPageLayout>
    );
  }

  if (error) {
    return (
      <ProtectedPageLayout fullName={fullName} userId={userId}>
        <div className="alert alert-danger" role="alert">
          <h4>Error loading applications</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchApplications}>Try Again</button>
        </div>
        <ToastContainer theme="colored" position="top-right" autoClose={3000} />
      </ProtectedPageLayout>
    );
  }

  return (
    <ProtectedPageLayout fullName={fullName} userId={userId}>
                      <div className="single-area">
                        <h5 className="mb-0">Study Applications</h5>
                        <a className="color-btn btn" href="/application-form">Create Application</a>
                      </div>
                      <div className="setting-personal-details">
                        <h5>Your Study Applications</h5>
                        
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered">
                            <thead>
                              <tr>
                                <th>App. ID</th>
                                <th>Preferred Countries</th>
                                <th>Budget</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {applications.length === 0 ? (
                                <tr>
                                  <td colSpan="6" className="text-center">No study applications found</td>
                                </tr>
                              ) : (
                                applications.map((app, index) => (
                                  <tr key={app.id}>
                                    <td>{app.id || 'N/A'}</td>
                                    <td>{app.preferred_countries || 'N/A'}</td>
                                    <td>{app.total_budget ? `$${app.total_budget}` : 'N/A'}</td>
                                    <td>
                                      <span className={`status-badge ${app.status?.toLowerCase() || 'pending'}`}>
                                        {app.status || 'Pending'}
                                      </span>
                                    </td>
                                    <td>{new Date(app.createdAt).toLocaleDateString() || 'N/A'}</td>
                                    <td>
                                      <div className="btn-gp">
                                        <Link to={`/study-application-details/${app.id}`} className="color-btn btn">
                                          View
                                        </Link>
                                        {app.status === 'Pending' && (
                                          <Link to={`/edit-study-application/${app.id}`} className="border-btn btn">
                                            Edit
                                          </Link>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
      <ToastContainer theme="colored" position="top-right" autoClose={3000} />
    </ProtectedPageLayout>
  );
};

export default StudyApplications;