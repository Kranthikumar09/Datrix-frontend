import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import debounce from 'lodash/debounce';
import config from '../config/config';
import LeftImage from '../assets/images/mba-img.jpg';
import FilterIcon from '../assets/images/filter.svg';

const WorkFilter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // Initialize filters from query parameters
  const initialFilters = {
    titles: queryParams.get('title') ? [queryParams.get('title')] : [],
    skills: queryParams.get('skill') ? [queryParams.get('skill')] : [],
    locations: queryParams.get('location') ? [queryParams.get('location')] : [],
    company: queryParams.get('company') || '',
    country: queryParams.get('country') || '',
  };

  const [filters, setFilters] = useState(initialFilters);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [titles, setTitles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [locations, setLocations] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_items: 0,
    total_pages: 1,
    next_page: null,
  });

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        const [titlesRes, skillsRes, locationsRes] = await Promise.all([
          axios.get(`${config.baseURL}/jobs/titles/get`),
          axios.get(`${config.baseURL}/jobs/skills/get`),
          axios.get(`${config.baseURL}/jobs/locations/get`),
        ]);

        // Validate and set filter options
        const titleData = Array.isArray(titlesRes.data.data)
          ? titlesRes.data.data.map(item => item?.title).filter(Boolean)
          : [];
        const skillData = Array.isArray(skillsRes.data.data)
          ? skillsRes.data.data.map(item => item?.skill).filter(Boolean)
          : [];
        const locData = Array.isArray(locationsRes.data.data)
          ? locationsRes.data.data.map(item => item?.location).filter(Boolean)
          : [];

        console.log('Filter Options:', { titleData, skillData, locData });

        setTitles(titleData);
        setSkills(skillData);
        setLocations(locData);
      } catch (error) {
        console.error('Error fetching filter options:', error);
        setError('Failed to load filter options. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  // Debounced fetch jobs
  const fetchJobs = useCallback(
    debounce(async (page = 1, appliedFilters = filters) => {
      setLoading(true);
      setError(null);
      try {
        const requestBody = {
          titles: appliedFilters.titles.length > 0 ? appliedFilters.titles : [],
          skills: appliedFilters.skills.length > 0 ? appliedFilters.skills : [],
          locations: appliedFilters.locations.length > 0 ? appliedFilters.locations : [],
          company: appliedFilters.company.trim() || '',
          country: appliedFilters.country.trim() || '',
          page: page.toString(),
          per_page: pagination.per_page.toString(),
        };

        console.log('Fetching jobs with:', requestBody);

        const response = await axios.post(`${config.baseURL}/jobs/get`, requestBody, {
          headers: { 'Content-Type': 'application/json' },
        });

        console.log('API Response:', response.data);

        if (response.data.success && Array.isArray(response.data.data)) {
          setJobs(response.data.data);
          setPagination({
            current_page: parseInt(response.data.pagination?.current_page) || page,
            per_page: parseInt(response.data.pagination?.per_page) || pagination.per_page,
            total_items: parseInt(response.data.pagination?.total_items) || response.data.data.length,
            total_pages: parseInt(response.data.pagination?.total_pages) || Math.ceil(response.data.data.length / pagination.per_page) || 1,
            next_page: response.data.pagination?.next_page || null,
          });
        } else {
          setJobs([]);
          setPagination({
            current_page: page,
            per_page: pagination.per_page,
            total_items: 0,
            total_pages: 0,
            next_page: null,
          });
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to load jobs. Please try again.');
        setJobs([]);
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

  // Sync filters with URL and fetch jobs
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.titles.length > 0) params.set('title', filters.titles[0]);
    if (filters.skills.length > 0) params.set('skill', filters.skills[0]);
    if (filters.locations.length > 0) params.set('location', filters.locations[0]);
    if (filters.company) params.set('company', filters.company);
    if (filters.country) params.set('country', filters.country);

    const queryString = params.toString();
    if (queryString !== location.search.slice(1)) {
      navigate({ search: queryString }, { replace: true });
    }

    fetchJobs(1, filters);
  }, [filters, fetchJobs, navigate, location.search]);

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
    fetchJobs(1, filters);
  };

  // Reset filters
  const handleResetFilters = () => {
    const resetFilters = {
      titles: [],
      skills: [],
      locations: [],
      company: '',
      country: '',
    };
    setFilters(resetFilters);
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    navigate('/work-filter', { replace: true });
  };

  // Pagination handling
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.total_pages) {
      fetchJobs(page, filters);
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

  // Parse skills safely
  const parseSkills = (skills) => {
    if (!skills) return 'N/A';
    try {
      // Handle double-encoded JSON
      let parsed = skills;
      while (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      return Array.isArray(parsed) ? parsed.join(', ') : String(parsed);
    } catch (error) {
      console.error('Error parsing skills:', error, 'Raw data:', skills);
      return skills || 'N/A';
    }
  };

  return (
    <div className="main-section work-filter">
      <section className="mba-section">
        <div className="container">
          <div className="row main-row">
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
                    <li className="breadcrumb-item"><Link to="/">Work</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Jobs</li>
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
                    <span
                      className="filter-icon"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasResponsive"
                      aria-controls="offcanvasResponsive"
                    >
                      <img src={FilterIcon} alt="Filter Icon" />
                    </span>
                  </div>
                  <div
                    className="offcanvas-lg offcanvas-start"
                    tabIndex="-1"
                    id="offcanvasResponsive"
                    aria-labelledby="offcanvasResponsiveLabel"
                  >
                    <div className="w-100 text-end d-lg-none">
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        data-bs-target="#offcanvasResponsive"
                        aria-label="Close"
                      ></button>
                    </div>
                    <form onSubmit={handleSearch}>
                      <div className="accordion accordion-flush filter-accordion" id="accordionFlushExample">
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="flush-headingOne">
                            <button
                              className="accordion-button"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#flush-collapseOne"
                            >
                              Job Titles
                            </button>
                          </h2>
                          <div
                            id="flush-collapseOne"
                            className="accordion-collapse collapse show"
                            aria-labelledby="flush-headingOne"
                          >
                            <div className="accordion-body">
                              {titles.length > 0 ? (
                                titles.map((title, index) => (
                                  <div className="chekbox-value" key={`title-${index}`}>
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={title}
                                        id={`title-${index}`}
                                        name="titles"
                                        checked={filters.titles.includes(title)}
                                        onChange={handleFilterInputChange}
                                      />
                                      <label className="form-check-label" htmlFor={`title-${index}`}>
                                        {title}
                                      </label>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p>No job titles available.</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="accordion-item">
                          <h2 className="accordion-header" id="flush-headingTwo">
                            <button
                              className="accordion-button"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#flush-collapseTwo"
                            >
                              Skills
                            </button>
                          </h2>
                          <div
                            id="flush-collapseTwo"
                            className="accordion-collapse collapse show"
                            aria-labelledby="flush-headingTwo"
                          >
                            <div className="accordion-body">
                              {skills.length > 0 ? (
                                skills.map((skill, index) => (
                                  <div className="chekbox-value" key={`skill-${index}`}>
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={skill}
                                        id={`skill-${index}`}
                                        name="skills"
                                        checked={filters.skills.includes(skill)}
                                        onChange={handleFilterInputChange}
                                      />
                                      <label className="form-check-label" htmlFor={`skill-${index}`}>
                                        {skill}
                                      </label>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p>No skills available.</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="accordion-item">
                          <h2 className="accordion-header" id="flush-headingThree">
                            <button
                              className="accordion-button"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#flush-collapseThree"
                            >
                              Locations
                            </button>
                          </h2>
                          <div
                            id="flush-collapseThree"
                            className="accordion-collapse collapse show"
                            aria-labelledby="flush-headingThree"
                          >
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
                                      <label className="form-check-label" htmlFor={`location-${index}`}>
                                        {loc}
                                      </label>
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
                        <button type="submit" className="color-btn btn w-100 filter-btn">
                          Apply Filters
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={handleResetFilters}
                        >
                          Reset
                        </button>
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
                          placeholder="Search by Company"
                          name="company"
                          value={filters.company}
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
                  <span>{pagination.total_items} Job Opportunities found</span>
                </div>

                <div className="filter-data">
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading jobs...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-5">
                      <p className="text-danger">{error}</p>
                      <button className="btn btn-outline-primary mt-2" onClick={() => fetchJobs(1, filters)}>
                        Retry
                      </button>
                    </div>
                  ) : jobs.length === 0 ? (
                    <div className="text-center py-5">
                      <h4>No Jobs Found</h4>
                      <p>No job opportunities match your current filters.</p>
                      <button className="btn btn-outline-primary mt-2" onClick={handleResetFilters}>
                        Clear All Filters
                      </button>
                    </div>
                  ) : (
                    jobs.map((job) => (
                      <div className="card-box" key={job.id || `job-${Math.random()}`}>
                        <div className="mba-inner p-0 m-0 mb-3 shadow-none border-0">
                          <div className="mba-right-inner">
                            <div className="head-badge d-flex justify-content-between">
                              <h3>
                                <Link to={`/job-details/${job.id || ''}`}>
                                  {job.title || 'Untitled Job'} at {job.company_name || 'Unknown Company'}
                                </Link>
                              </h3>
                              <div className="badge-label d-flex gap-3">
                                <span className="badge rounded-pill text-bg-gray">
                                  {job.employment_type || 'N/A'}
                                </span>
                              </div>
                            </div>
                            <div className="mba-right-address">
                              <div className="mba-right-sub-data">
                                <span>Location(s):</span>
                                <p>{job.location || 'N/A'}, {job.country || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <ul className="pack-list">
                          <li>
                            <h5>Skills Needed</h5>
                            <span>{parseSkills(job.skills)}</span>
                          </li>
                          <li>
                            <h5>Experience Required</h5>
                            <span>{job.experience_string || 'N/A'}</span>
                          </li>
                          <li>
                            <h5>Qualification</h5>
                            <span>{job.qualifications || 'N/A'}</span>
                          </li>
                          <li>
                            <h5>Specialization</h5>
                            <span>{job.specialization || 'N/A'}</span>
                          </li>
                        </ul>
                      </div>
                    ))
                  )}

                  {pagination.total_pages > 1 && !loading && jobs.length > 0 && (
                    <div className="pagination text-end">
                      <nav aria-label="Jobs pagination">
                        <ul className="pagination justify-content-end">
                          <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(pagination.current_page - 1)}
                              aria-label="Previous page"
                            >
                              Previous
                            </button>
                          </li>
                          {renderPaginationItems()}
                          <li className={`page-item ${pagination.current_page === pagination.total_pages ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(pagination.current_page + 1)}
                              aria-label="Next page"
                            >
                              Next
                            </button>
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

export default WorkFilter;