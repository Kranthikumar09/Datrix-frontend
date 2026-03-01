import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import config from '../config/config';

// Utility functions (formatDate, parseSkills, parseCommaSeparated)
const formatDate = (dateString) => {
  if (!dateString) return 'Not Specified';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'Invalid Date';
  }
};

const parseSkills = (skills) => {
  if (!skills) return 'Not Specified';
  try {
    let parsed = skills;
    while (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }
    return Array.isArray(parsed) ? parsed.join(', ') : String(parsed);
  } catch {
    return String(skills);
  }
};

const parseCommaSeparated = (value) => {
  if (!value) return ['Not Specified'];
  return value.split(',').map((item) => item.trim() || 'Not Specified');
};

const WorkDetails = () => {
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  // Get token from localStorage
  const getToken = () => localStorage.getItem('accessToken');

  // Fetch job details
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
        setError('Job details not found.');
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('Failed to load job details. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch application status
  const fetchApplicationStatus = useCallback(async () => {
    const token = getToken();
    if (!token || !isAuthenticated) {
      // Assume not applied if user is not authenticated
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
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setHasApplied(true);
      } else {
        setHasApplied(false);
      }
    } catch (err) {
      console.error('Error checking application status:', err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        // Non-auth errors: assume not applied
        setHasApplied(false);
        toast.error('Failed to check application status.');
      }
    }
  }, [id, isAuthenticated, logout, navigate]);

  useEffect(() => {
    fetchJobDetails();
    fetchApplicationStatus();
  }, [fetchJobDetails, fetchApplicationStatus]);

  // Render loading state
  if (loading) {
    return (
      <div className="spinner-container mt-5" role="status">
        <div className="spinner" aria-label="Loading job details"></div>
        <ToastContainer theme="colored" position="top-right" autoClose={3000} />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="error-container mt-5" role="alert">
        <p>{error}</p>
        <button className="color-btn btn" onClick={fetchJobDetails}>
          Retry
        </button>
        <ToastContainer theme="colored" position="top-right" autoClose={3000} />
      </div>
    );
  }

  // Render not found state
  if (!jobDetails) {
    return (
      <div className="not-found-container mt-5" role="alert">
        <p>Job not found.</p>
        <ToastContainer theme="colored" position="top-right" autoClose={3000} />
      </div>
    );
  }

  // Destructure job details
  const {
    id: job_id = id,
    title = 'Not Specified',
    company_name = 'Not Specified',
    location = 'Not Specified',
    country = 'Not Specified',
    employment_type = 'Not Specified',
    skills,
    qualifications = 'Not Specified',
    experience_string = 'Not Specified',
    experience_min = 'Not Specified',
    experience_max = 'Not Specified',
    specialization = 'Not Specified',
    start_date,
    end_date,
    posted_date,
    telecommute = 'Not Specified',
    sponser_visa = 'Not Specified',
    industry = 'Not Specified',
    functional_area = 'Not Specified',
    domain = 'Not Specified',
    english_proficiency = 'Not Specified',
    number_of_posts = 'Not Specified',
    address = 'Not Specified',
    required_visa_status = 'Not Specified',
    description = 'No description provided.',
    responsibilities = 'Not Specified',
    publish_status = 'Not Specified',
    createdAt,
    updatedAt,
  } = jobDetails;

  return (
    <div className="main-section work-details" role="main">
      <section className="mba-section">
        <div className="container">
          <div className="row main-row">
            <div className="col-12">
              <div className="mba-main">
                {/* Breadcrumb Navigation */}
                <nav
                  aria-label="breadcrumb"
                  style={{
                    '--bs-breadcrumb-divider':
                      "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%228%22 height=%228%22%3E%3Cpath d=%22M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z%22 fill=%22%236c757d%22/%3E%3C/svg%3E')",
                  }}
                >
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/work">Work</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/jobs">Jobs</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {title} at {company_name}
                    </li>
                  </ol>
                </nav>

                <div className="mba-inner">
                  <div className="mba-right-inner w-100">
                    {/* Job Title and Company */}
                    <div className="work-detail-head">
                      <h3 className="text-decoration-none">
                        {title} at {company_name}
                      </h3>
                      <div className="badge-label d-flex gap-3">
                        <span className="badge rounded-pill text-bg-gray">{employment_type}</span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="mba-right-bottom">
                      <div className="mba-right-sub-data">
                        <span>Location(s):</span>
                        <p>
                          {location}, {country}
                        </p>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="job-detail-row">
                      <div className="id-inner">
                        <div className="id-data">
                          <h4>Job ID</h4>
                          <span>{job_id}</span>
                        </div>
                        <div className="id-data">
                          <h4>Start Date</h4>
                          <span>{formatDate(start_date)}</span>
                        </div>
                        <div className="id-data">
                          <h4>Expiry Date</h4>
                          <span>{formatDate(end_date)}</span>
                        </div>
                        <div className="id-data">
                          <h4>Posted On</h4>
                          <span>{formatDate(posted_date)}</span>
                        </div>
                        <div className="id-data">
                          <h4>Experience</h4>
                          <span>{experience_string}</span>
                        </div>
                        <div className="id-data">
                          <h4>Telecommute</h4>
                          <span>{telecommute}</span>
                        </div>
                        <div className="id-data">
                          <h4>Sponsor Visa</h4>
                          <span>{sponser_visa}</span>
                        </div>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div className="job-apply-btn">
                      <Link
                        to={hasApplied ? '#' : `/job-apply-form/${job_id}`}
                        className={`color-btn btn ${hasApplied ? 'disabled' : ''}`}
                        aria-label={
                          hasApplied
                            ? `Already applied for ${title} at ${company_name}`
                            : `Apply for ${title} at ${company_name}`
                        }
                        style={hasApplied ? { pointerEvents: 'none', opacity: 0.6 } : {}}
                      >
                        {hasApplied ? 'Applied' : 'Apply'}
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Requirement Summary */}
                <div className="institute-details-main">
                  <h3>Requirement Summary</h3>
                  <div className="requirement-summary-row">
                    <div className="id-inner">
                      <div className="id-data">
                        <h4>Experience Range</h4>
                        <span>
                          Min: {experience_min} - Max: {experience_max} year(s)
                        </span>
                      </div>
                      <div className="id-data">
                        <h4>Specialization</h4>
                        <span>{specialization}</span>
                      </div>
                      <div className="id-data">
                        <h4>Industry</h4>
                        <span>{industry}</span>
                      </div>
                      <div className="id-data">
                        <h4>Functional Area</h4>
                        <span>{functional_area}</span>
                      </div>
                      <div className="id-data">
                        <h4>Domain</h4>
                        <span>{domain}</span>
                      </div>
                      <div className="id-data">
                        <h4>English Proficiency</h4>
                        <span>{english_proficiency}</span>
                      </div>
                      <div className="id-data">
                        <h4>Number of Posts</h4>
                        <span>{number_of_posts}</span>
                      </div>
                      <div className="id-data">
                        <h4>Address</h4>
                        <span>{address}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visa Status and Employment Type */}
                <div className="institute-details-main course-overview">
                  <div className="required-visa-status">
                    <div className="id-inner">
                      <div className="id-data">
                        <h3>Required Visa Status</h3>
                        <ul className="description-inner">
                          {parseCommaSeparated(required_visa_status).map((status, index) => (
                            <li key={index}>{status}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="id-data">
                        <h3>Employment Type</h3>
                        <ul className="description-inner">
                          <li>{employment_type}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div className="job-desc institute-details-main">
                  <h3>Job Description</h3>
                  <div className="editor-box">
                    <p>{description}</p>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="institute-details-main">
                  <h3>Additional Details</h3>
                  <div className="additional-details-row">
                    <div className="id-inner">
                      <div className="id-data">
                        <h4>Publish Status</h4>
                        <span>{publish_status}</span>
                      </div>
                      <div className="id-data">
                        <h4>Created At</h4>
                        <span>{formatDate(createdAt)}</span>
                      </div>
                      <div className="id-data">
                        <h4>Updated At</h4>
                        <span>{formatDate(updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills, Education, Responsibilities */}
          <div className="bottom-row row">
            <div className="col-lg-4">
              <div className="institute-details-main">
                <div className="skills">
                  <h3>Skills</h3>
                  <div className="id-inner">
                    <div className="id-data">
                      <ul className="description-inner">
                        <li>{parseSkills(skills)}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="institute-details-main">
                <div className="education">
                  <h3>Qualification</h3>
                  <div className="id-inner">
                    <div className="id-data">
                      <ul className="description-inner">
                        <li>{qualifications}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="institute-details-main">
                <div className="responsibilities">
                  <h3>Responsibilities</h3>
                  <div className="id-inner">
                    <div className="id-data">
                      <ul className="description-inner">
                        <li>{responsibilities}</li>
                      </ul>
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

export default WorkDetails;