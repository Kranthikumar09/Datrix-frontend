import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import debounce from 'lodash/debounce';
import config from '../config/config';
import { Link } from 'react-router-dom';
import LeftImage from '../assets/images/un.png';
import FilterIcon from '../assets/images/filter.svg';

const StudyFilter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // Initialize filters from query parameters
  const initialFilters = {
    specializations: queryParams.get('specialization') ? [queryParams.get('specialization')] : [],
    locations: queryParams.get('location') ? [queryParams.get('location')] : [],
    eligibilities: queryParams.get('eligibility') ? [queryParams.get('eligibility')] : [],
    course_name: queryParams.get('course_name') || '',
    country: queryParams.get('country') || '',
  };

  const [filters, setFilters] = useState(initialFilters);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [eligibilities, setEligibilities] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_items: 0,
    total_pages: 1,
    next_page: null,
  });

  // Parse eligibilities safely
  const parseEligibilities = (eligibilities) => {
    if (!eligibilities) return [];
    try {
      const cleaned = eligibilities.replace(/^"|"$/g, '').replace(/\\"/g, '"');
      const parsed = JSON.parse(cleaned);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing eligibilities:', error, 'Raw data:', eligibilities);
      return [];
    }
  };

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        const [specializationsRes, locationsRes, eligibilitiesRes] = await Promise.all([
          axios.get(`${config.baseURL}/courses/specializations/get`),
          axios.get(`${config.baseURL}/courses/locations/get`),
          axios.get(`${config.baseURL}/courses/eligiblities/get`),
        ]);

        // Validate and set filter options
        const specData = Array.isArray(specializationsRes.data.data)
          ? specializationsRes.data.data.map(item => item?.specialization).filter(Boolean)
          : [];
        const locData = Array.isArray(locationsRes.data.data)
          ? locationsRes.data.data.map(item => item?.location).filter(Boolean)
          : [];
        const eligData = Array.isArray(eligibilitiesRes.data.data)
          ? eligibilitiesRes.data.data.map(item => item?.eligiblity).filter(Boolean)
          : [];

        console.log('Filter Options:', { specData, locData, eligData });

        setSpecializations(specData);
        setLocations(locData);
        setEligibilities(eligData);
      } catch (error) {
        console.error('Error fetching filter options:', error);
        setError('Failed to load filter options. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  // Debounced fetch courses
  const fetchCourses = useCallback(
    debounce(async (page = 1, appliedFilters = filters) => {
      setLoading(true);
      setError(null);
      try {
        const requestBody = {
          specializations: appliedFilters.specializations.length > 0 ? appliedFilters.specializations : [],
          locations: appliedFilters.locations.length > 0 ? appliedFilters.locations : [],
          eligibilities: appliedFilters.eligibilities.length > 0 ? appliedFilters.eligibilities : [],
          course_name: appliedFilters.course_name.trim() || '',
          country: appliedFilters.country.trim() || '',
          page: page.toString(),
          per_page: pagination.per_page.toString(),
        };

        console.log('Fetching courses with:', requestBody);

        const response = await axios.post(`${config.baseURL}/courses/get`, requestBody, {
          headers: { 'Content-Type': 'application/json' },
        });

        console.log('API Response:', response.data);

        if (response.data.success && Array.isArray(response.data.data)) {
          setCourses(response.data.data);
          setPagination({
            current_page: parseInt(response.data.pagination?.current_page) || page,
            per_page: parseInt(response.data.pagination?.per_page) || pagination.per_page,
            total_items: parseInt(response.data.pagination?.total_items) || response.data.data.length,
            total_pages: parseInt(response.data.pagination?.total_pages) || Math.ceil(response.data.data.length / pagination.per_page) || 1,
            next_page: response.data.pagination?.next_page || null,
          });
        } else {
          setCourses([]);
          setPagination({
            current_page: page,
            per_page: pagination.per_page,
            total_items: 0,
            total_pages: 0,
            next_page: null,
          });
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses. Please try again.');
        setCourses([]);
        setPagination({
          current_page: page,
          per_page: pagination.per_page,
          total_items: 0,
          total_pages: 0,
          next_page: null,
        });
      } finally {
        setLoading(false);
      }
    }, 300),
    [pagination.per_page]
  );

  // Sync filters with URL and fetch courses
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.specializations.length > 0) params.set('specialization', filters.specializations[0]);
    if (filters.locations.length > 0) params.set('location', filters.locations[0]);
    if (filters.eligibilities.length > 0) params.set('eligibility', filters.eligibilities[0]);
    if (filters.course_name) params.set('course_name', filters.course_name);
    if (filters.country) params.set('country', filters.country);

    const queryString = params.toString();
    if (queryString !== location.search.slice(1)) {
      navigate({ search: queryString }, { replace: true });
    }

    fetchCourses(1, filters);
  }, [filters, fetchCourses, navigate, location.search]);

  // Handle filter input changes
  const handleFilterInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => {
      if (type === 'checkbox') {
        const updatedArray = checked ? [...prev[name], value] : prev[name].filter((item) => item !== value);
        return { ...prev, [name]: updatedArray };
      }
      return { ...prev, [name]: value };
    });
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    fetchCourses(1, filters);
  };

  // Reset filters
  const handleResetFilters = () => {
    const resetFilters = {
      specializations: [],
      locations: [],
      eligibilities: [],
      course_name: '',
      country: '',
    };
    setFilters(resetFilters);
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    navigate('/study-filter', { replace: true });
  };

  // Pagination handling
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.total_pages) {
      fetchCourses(page, filters);
    }
  };

  const renderPaginationItems = () => {
    const { current_page, total_pages } = pagination;
    if (total_pages <= 1) return null;

    const pageNeighbors = 1;
    const totalNumbers = pageNeighbors * 2 + 1;
    let startPage = Math.max(1, current_page - pageNeighbors);
    let endPage = Math.min(total_pages, current_page + pageNeighbors);

    if (total_pages <= totalNumbers) {
      startPage = 1;
      endPage = total_pages;
    } else if (current_page <= pageNeighbors + 1) {
      endPage = totalNumbers;
    } else if (current_page >= total_pages - pageNeighbors) {
      startPage = total_pages - totalNumbers + 1;
    }

    const pages = [];
    if (startPage > 1) {
      pages.push(
        <li key="first" className="page-item">
          <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
        </li>
      );
      if (startPage > 2) {
        pages.push(<li key="ellipsis-start" className="page-item disabled"><span className="page-link">...</span></li>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i} className={`page-item ${current_page === i ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>{i}</button>
        </li>
      );
    }

    if (endPage < total_pages) {
      if (endPage < total_pages - 1) {
        pages.push(<li key="ellipsis-end" className="page-item disabled"><span className="page-link">...</span></li>);
      }
      pages.push(
        <li key="last" className="page-item">
          <button className="page-link" onClick={() => handlePageChange(total_pages)}>{total_pages}</button>
        </li>
      );
    }

    return pages;
  };

  return (
    <div className="main-section study-filter">
      <section className="mba-section">
        <div className="container">
          <div className="row main-row">
            <div className="col-12">
              <div className="mba-main">
                <nav aria-label="breadcrumb" style={{ '--bs-breadcrumb-divider': "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%228%22 height=%228%22%3E%3Cpath d=%22M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z%22 fill=%22%236c757d%22/%3E%3C/svg%3E')" }}>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Study</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Course</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <section className="course-section">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-4 col-xl-3">
                <div className="filter-box">
                  <div className="filter-header">
                    <h3>Filters</h3>
                    <span className="filter-icon" data-bs-toggle="offcanvas" data-bs-target="#offcanvasResponsive" aria-controls="offcanvasResponsive">
                      <img src={FilterIcon} alt="Filter Icon" />
                    </span>
                  </div>
                  <div className="offcanvas-lg offcanvas-start" tabIndex="-1" id="offcanvasResponsive" aria-labelledby="offcanvasResponsiveLabel">
                    <div className="w-100 text-end d-lg-none">
                      <button type="button" className="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#offcanvasResponsive" aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleSearch}>
                      <div className="accordion accordion-flush filter-accordion" id="accordionFlushExample">
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="flush-headingOne">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne">All Specializations</button>
                          </h2>
                          <div id="flush-collapseOne" className="accordion-collapse collapse show" aria-labelledby="flush-headingOne">
                            <div className="accordion-body">
                              {specializations.length > 0 ? (
                                specializations.map((spec, index) => (
                                  <div className="chekbox-value" key={`spec-${index}`}>
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={spec}
                                        id={`specialization-${index}`}
                                        name="specializations"
                                        checked={filters.specializations.includes(spec)}
                                        onChange={handleFilterInputChange}
                                      />
                                      <label className="form-check-label" htmlFor={`specialization-${index}`}>{spec}</label>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p>No specializations available.</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="accordion-item">
                          <h2 className="accordion-header" id="flush-headingTwo">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo">Eligibility</button>
                          </h2>
                          <div id="flush-collapseTwo" className="accordion-collapse collapse show" aria-labelledby="flush-headingTwo">
                            <div className="accordion-body">
                              {eligibilities.length > 0 ? (
                                eligibilities.map((elig, index) => (
                                  <div className="chekbox-value" key={`elig-${index}`}>
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={elig}
                                        id={`eligibility-${index}`}
                                        name="eligibilities"
                                        checked={filters.eligibilities.includes(elig)}
                                        onChange={handleFilterInputChange}
                                      />
                                      <label className="form-check-label" htmlFor={`eligibility-${index}`}>{elig}</label>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p>No eligibility criteria available.</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="accordion-item">
                          <h2 className="accordion-header" id="flush-headingThree">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree">Locations</button>
                          </h2>
                          <div id="flush-collapseThree" className="accordion-collapse collapse show" aria-labelledby="flush-headingThree">
                            <div className="accordion-body">
                              {locations.length > 0 ? (
                                locations.map((loc, index) => (
                                  <div className="chekbox-value" key={`loc-${index}`}>
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={loc}
                                        id={`location-${index}`}
                                        name="locations"
                                        checked={filters.locations.includes(loc)}
                                        onChange={handleFilterInputChange}
                                      />
                                      <label className="form-check-label" htmlFor={`location-${index}`}>{loc}</label>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p>No locations available.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="filter-actions mt-4 d-flex justify-content-between gap-3">
                        <button type="submit" className="color-btn btn w-100 filter-btn">Apply Filters</button>
                        <button type="button" className="btn btn-outline-secondary" onClick={handleResetFilters}>Reset</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-8 col-xl-9">
                <div className="card-box">
                  <div className="search-filter">
                    <form onSubmit={handleSearch}>
                      <div className="form-group search-box">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search Course"
                          name="course_name"
                          value={filters.course_name}
                          onChange={handleFilterInputChange}
                        />
                      </div>
                      <div className="form-group search-box">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search Country"
                          name="country"
                          value={filters.country}
                          onChange={handleFilterInputChange}
                        />
                      </div>
                      <button type="submit" className="color-btn btn">Search</button>
                    </form>
                  </div>
                </div>

                <div className="result-bx">
                  <span>{pagination.total_items} Study Opportunities found</span>
                </div>

                <div className="filter-data">
                {loading ? (
  <div className="text-center py-5">
    <div className="spinner-border text-danger" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="mt-2">Loading courses...</p>
  </div>
) : error ? (
  <div className="text-center py-5">
    <p className="text-danger">{error}</p>
    <button className="btn btn-outline-primary mt-2" onClick={() => fetchCourses(1, filters)}>Retry</button>
  </div>
) : courses.length === 0 ? (
  <div className="text-center py-5">
    <h4>No Courses Found</h4>
    <p>No study opportunities match your current filters.</p>
    <button className="btn btn-outline-primary mt-2" onClick={handleResetFilters}>
      Clear All Filters
    </button>
  </div>
) : (
  courses.map((course) => (
    <div className="card-box" key={course.id || `course-${Math.random()}`}>
      <div className="mba-inner p-0 m-0 mb-3 shadow-none border-0">
        <div className="mba-left-inner">
          <img
            src={course.university?.image ? config.assetUrl(`uploads/universities/${course.university.image}`) : LeftImage}
            alt={course.university?.name || 'Course'}
            onError={(e) => { e.target.src = LeftImage; }}
          />
        </div>
        <div className="mba-right-inner">
          <h3><Link to={`/study-details/${course.id || ''}`}>{course.name || 'Untitled Course'}</Link></h3>
          <div className="mba-right-address">
            <span>
              {course.university?.name || 'Unknown University'} - 
              {course.university?.location || 'Unknown Location'}{course.university?.country ? `, ${course.university.country}` : ''}
            </span>
          </div>
          <div className="mba-right-bottom">
            <div className="price-pack">
              <span>{course.fees ? `${course.fees} INR/yr` : 'Fees N/A'}</span>
              <small>Application Fee</small>
            </div>
          </div>
        </div>
      </div>
      <ul className="pack-list">
        <li>
          <h5>Specialization</h5>
          <span>{course.specialization || 'N/A'}</span>
        </li>
        {parseEligibilities(course.eligibilities).length > 0 ? (
          parseEligibilities(course.eligibilities).map((eligibility, index) => (
            <li key={`elig-item-${index}`}>
              <h5>{eligibility.name || 'Eligibility'}</h5>
              <span>{eligibility.score || 'N/A'}</span>
            </li>
          ))
        ) : (
          <li>
            <h5>Eligibility</h5>
            <span>No specific eligibility criteria</span>
          </li>
        )}
      </ul>
    </div>
  ))
)}

                  {pagination.total_pages > 1 && !loading && courses.length > 0 && (
                    <div className="pagination text-end">
                      <nav aria-label="Course pagination">
                        <ul className="pagination justify-content-end">
                          <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(pagination.current_page - 1)} aria-label="Previous page">Previous</button>
                          </li>
                          {renderPaginationItems()}
                          <li className={`page-item ${pagination.current_page === pagination.total_pages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(pagination.current_page + 1)} aria-label="Next page">Next</button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default StudyFilter;