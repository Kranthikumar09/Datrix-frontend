import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import config from '../config/config';
import LeftImage from '../assets/images/un.png';
const StudyDetails = () => {
  const { courseId } = useParams(); // Get the courseId from URL
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch course details on component mount
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${config.baseURL}/courses/details/get`, {
          params: {
            course_id: courseId,
          },
        });

        if (response.data.success) {
          setCourseData(response.data.data);
        } else {
          setError('Failed to fetch course details.');
        }
      } catch (err) {
        setError('An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]); // Re-fetch if courseId changes

  // Show loading state with spinner (centered vertically and horizontally)
  if (loading) {
    return (
      <div className="spinner-container mt-5">
        <div className="spinner"></div>
      </div>
    );
  }

  // Show error message if data fetching failed
  if (error) {
    return <div>{error}</div>;
  }

  // If courseData is null or not found, show not found message
  if (!courseData) {
    return <div>Course not found.</div>;
  }

  // Destructure the course data
  const {
    name,
    specialization,
    level,
    credit_hours,
    duration,
    description,
    fees,
    eligibilities,
    university,
  } = courseData;

  // Parse eligibilities string into an array
  let eligibilityData = [];
  try {
    if (eligibilities && typeof eligibilities === 'string') {
      // Handle double-stringified JSON by parsing twice if necessary
      let parsedData = eligibilities;
      // Remove extra quotes if present
      if (parsedData.startsWith('"') && parsedData.endsWith('"')) {
        parsedData = parsedData.slice(1, -1);
      }
      // Replace escaped quotes
      parsedData = parsedData.replace(/\\"/g, '"');
      eligibilityData = JSON.parse(parsedData);
      // Ensure parsed data is an array
      if (!Array.isArray(eligibilityData)) {
        eligibilityData = [eligibilityData];
      }
    } else if (Array.isArray(eligibilities)) {
      // If eligibilities is already an array (unlikely but possible)
      eligibilityData = eligibilities;
    }
  } catch (e) {
    console.error('Error parsing eligibilities:', e);
    eligibilityData = []; // Fallback to empty array on error
  }

  return (
    <div className="main-section study-details">
      {/* Section Start */}
      <section className="mba-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="mba-main">
                <nav
                  aria-label="breadcrumb"
                  style={{
                    '--bs-breadcrumb-divider':
                      "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%228%22 height=%228%22%3E%3Cpath d=%22M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z%22 fill=%22%236c757d%22/%3E%3C/svg%3E')",
                  }}
                >
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="#">Study</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#">Course</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {name}
                    </li>
                  </ol>
                </nav>

                <div className="mba-inner">
                  <div className="mba-left-inner">
                    <img
                      src={university.image ? `https://express.studytraveler.com/uploads/universities/${university.image}` : LeftImage}
                      alt="Course"
                    />
                  </div>

                  <div className="mba-right-inner">
                    <h3>{name}</h3>
                    <div className="mba-right-address">
                      <span>{university.name}</span>
                      <div className="mba-right-sub-data">
                        <span>Location(s):</span>
                        <p>{university.location}</p>
                      </div>
                    </div>
                    <div className="mba-right-bottom">
                      <div className="mba-right-sub-data">
                        <span>Established:</span>
                        <p>{university.established}</p>
                      </div>
                      <div className="mba-right-sub-data">
                        <span>Type of Institute:</span>
                        <p>{university.type}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="institute-details-main">
                  <h3>Institute Details</h3>
                  <div className="id-inner">
                    <div className="id-data">
                      <h4>Acceptance Rate</h4>
                      <span>{university.acceptance_rate}%</span>
                    </div>
                    <div className="id-data">
                      <h4>Number of Students</h4>
                      <span>{university.number_of_students}</span>
                    </div>
                  </div>
                </div>

                <div className="institute-details-main course-overview">
                  <h3>Course Overview</h3>
                  <div className="id-inner">
                    <div className="id-data">
                      <h4>Course</h4>
                      <span>{name}</span>
                    </div>

                    <div className="id-data">
                      <h4>Specialization</h4>
                      <span>{specialization}</span>
                    </div>

                    <div className="id-data">
                      <h4>Level</h4>
                      <span>{level || 'Not specified'}</span>
                    </div>

                    <div className="id-data">
                      <h4>Duration</h4>
                      <span>{duration || 'Not specified'}</span>
                    </div>

                    <div className="id-data">
                      <h4>Credit Hours</h4>
                      <span>{credit_hours || 'Not specified'}</span>
                    </div>

                    <div className="id-data">
                      <h4>Eligibility Criteria</h4>
                      {Array.isArray(eligibilityData) && eligibilityData.length > 0 ? (
                        <ul>
                          {eligibilityData.map((eligibility, index) => (
                            <li key={index}>
                              {eligibility.name}: {eligibility.score}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No eligibility criteria available.</p>
                      )}
                    </div>

                    <div className="id-data">
                      <h4>Course Description</h4>
                      <p>{description || 'No description available.'}</p>
                    </div>
                  </div>
                </div>

                <div className="tution-payments institute-details-main">
                  <h3>Tuition And Payments</h3>
                  <h4>1st Year Tuition Fees</h4>
                  <div className="table-responsive data-table">
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          <th scope="col">Fees Components</th>
                          <th scope="col">Amount in USD ($)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Tuition & Fees</td>
                          <td>{fees}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h4>Other Expenses in 1st year</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Section End */}
    </div>
  );
};

export default StudyDetails;