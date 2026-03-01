import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import config from '../config/config';
import SignupForm from '../auth/SignupForm';

// Importing images
import workMainImg from '../assets/images/Work-main-img.jpg';
import uploadIcon from '../assets/images/upload-icon.svg';
import rightArrow from '../assets/images/right-arrow.svg';
import headingIcon from '../assets/images/heading-icon.svg';
import arrowIcon from '../assets/images/arrow-small-right.svg';
import studyCountryImage from '../assets/images/study-contry-img.jpg';
import professionImage from '../assets/images/Profession-img.jpg';
import employmentImage from '../assets/images/Employment-img.jpg';
import FaqSection from "../components/layout/FaqSection";
import connectionImg from '../assets/images/connection-img.svg';
import connectionImgNext from '../assets/images/connection-img-next.svg';
import objectImg from '../assets/images/object.svg';
import faqImg5 from '../assets/images/faq-img5.jpg';
import faqImg6 from '../assets/images/faq-img6.jpg';
import faqImg7 from '../assets/images/faq-img7.jpg';
import faqImg8 from '../assets/images/faq-img8.jpg';

// Constants
const WORK_COUNTRIES = [
  'India',
  'Australia',
  'Germany',
  'UK',
  'USA',
  'Europe',
  'Korea',
  'Finland',
];

const WORK_PROCESS_STEPS = [
  { id: '01', title: 'Research Your Options', reverse: false },
  { id: '02', title: 'Select country', reverse: true },
  { id: '03', title: 'Prepare for IELTS/ CELPIP/PTE/OET', reverse: false },
  { id: '04', title: 'Arrange all the requirements', reverse: true },
  { id: '05', title: 'Apply for work visa', reverse: false },
  { id: '06', title: 'Get work visa', reverse: true },
  { id: '07', title: 'Settle abroad', reverse: false },
];

const FAQ_ITEMS = [
  {
    id: 'One',
    question: 'What Documents Are Required for a Visa Application?',
    answer:
      'When applying for a visa, the specific documents required may vary depending on the type of visa and the destination country. However, some commonly required documents include...',
  },
  {
    id: 'Two',
    question: 'How Long Does the Immigration Process Take?',
    answer:
      'The immigration process can vary greatly depending on the country and visa type. Typically, processing times range from a few weeks to several months.',
  },
  {
    id: 'Three',
    question: 'Can I Work While Studying Abroad?',
    answer:
      'In many countries, international students are permitted to work part-time while studying. However, there are restrictions on the number of hours and the type of work.',
  },
  {
    id: 'Four',
    question: 'What Are the Common Reasons for Visa Rejection?',
    answer:
      'Common reasons for visa rejection include incomplete documentation, a history of visa violations, insufficient financial support, or an unclear purpose of travel.',
  },
  {
    id: 'Five',
    question: 'How Do I Choose the Right Country for Immigration?',
    answer:
      'Choosing the right country for immigration depends on various factors such as job opportunities, quality of life, language, immigration policies, and more.',
  },
];

// Custom Hook
const useFetchData = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        if (response.data.success) {
          setData(response.data.data);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        setError(error.message || 'Error fetching data');
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, loading, error };
};

// Work Component
const Work = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchInputs, setSearchInputs] = useState({
    company: '',
    country: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);

    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem('accessToken');
      setIsLoggedIn(!!updatedToken);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(searchInputs).toString();
    navigate(`/work-filter?${queryParams}`);
  };

  const handleCountryClick = (country) => {
    navigate(`/work-filter?country=${encodeURIComponent(country)}`);
  };

  return (
    <div className="main-section">
      {/* Work Main Section */}
      <section className="study-page-main-section work-page-section p-50">
        <div className="container">
          <div className="study-page-inner">
            <div className="row">
              <div className="col-md-5">
                <div className="study-page-top-img h-100">
                  <img src={workMainImg} className="h-100" alt="Work" />
                </div>
              </div>
              <div className="col-md-7">
                <div className="study-page-right-data">
                  <div className="cmn-heading">
                    <h1>Work Overseas
</h1>
                    <p>Dreaming of an international career? Get expert job-search support, resume optimization, visa guidance, and global placement assistance.
</p>
                  </div>
                  {!isLoggedIn ? (
                    <>
                      <SignupForm redirect="/application-form" />
                    </>
                  ) : (
                    <>
                      <p>
                        Welcome back! You're ready to explore job opportunities abroad. Check your
                        application status or search for new jobs below.
                      </p>
                      <div className="header-btn-main mt-5">
                        <Link to="/work-applications" className="color-btn btn">
                          View Application <img alt="Right Arrow" src={rightArrow} />
                        </Link>
                        <Link to="/work-filter" className="color-btn btn">
                          Search Jobs <img alt="Right Arrow" src={rightArrow} />
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunity Section */}
      <section className="study-opportunity-section p-50 pt-0">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="resume-import">
                <Link to="/signup" type="button" className="submit action-button color-btn btn">
                  <img src={uploadIcon} alt="upload" />
                  Post your Resume
                </Link>
                <span>Your overseas job search starts here.</span>
              </div>
            </div>
          </div>
          <div className="study-opportunity-inner work-opp">
            <div className="row justify-content-center">
              <div className="col-12">
                <div className="study-opportunity-main">
                  <div className="cmn-heading text-center">
                    <h2>Work Opportunity</h2>
                  </div>
                  <div className="card-box p-relative">
                    <div className="search-filter">
                      <form onSubmit={handleSearchSubmit}>
                        <div className="form-group search-box">
                          <input
                            className="form-control"
                            placeholder="Search by Company"
                            type="text"
                            name="company"
                            value={searchInputs.company}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-group search-box">
                          <input
                            className="form-control"
                            placeholder="Search Country"
                            type="text"
                            name="country"
                            value={searchInputs.country}
                            onChange={handleInputChange}
                          />
                        </div>
                        <button type="submit" className="color-btn btn">
                          Search
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Sections */}
      <WorkByCountry onCountryClick={handleCountryClick} />
      <WorkBySkillset />
      <WorkByLocation />
      <RestSections />
    </div>
  );
};

// WorkByCountry Component
const WorkByCountry = ({ onCountryClick }) => {
  return (
    <section className="home-study-section study-new-section p-50">
      <div className="container">
        <div className="home-study-inner">
          <div className="row align-items-center">
            <div className="col-md-7">
              <div className="home-study-left">
                <div className="cmn-heading">
                  <span className="top-name second-top-head">
                    <img src={headingIcon} alt="object-img" /> Country
                  </span>
                  <h2>By Country</h2>
                </div>
                <ul className="study-inner-mid">
                  {WORK_COUNTRIES.map((country, index) => (
                    <li key={index} className="study-innner-point">
                      <button
                        className="country-btn"
                        onClick={() => onCountryClick(country)}
                        type="button"
                      >
                        <span>Work in {country}</span>
                        <img src={arrowIcon} alt="arrow" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-md-5">
              <div className="home-study-right">
                <figure>
                  <img src={studyCountryImage} alt="Work in Country" />
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

WorkByCountry.propTypes = {
  onCountryClick: PropTypes.func.isRequired,
};

// WorkBySkillset Component
const WorkBySkillset = () => {
  const { data: skills, loading } = useFetchData(`${config.baseURL}/jobs/skills/get`);
  const navigate = useNavigate();

  const handleSkillClick = (skill) => {
    navigate(`/work-filter?skill=${encodeURIComponent(skill)}`);
  };

  return (
    <section className="home-Work-section p-50">
      <div className="container">
        <div className="home-study-inner">
          <div className="row align-items-center">
            <div className="col-md-5">
              <div className="home-study-right">
                <figure>
                  <img src={professionImage} alt="Profession" />
                </figure>
              </div>
            </div>
            <div className="col-md-7">
              <div className="home-study-left">
                <div className="cmn-heading">
                  <span className="top-name second-top-head">
                    <img src={headingIcon} alt="object-img" /> Skillset
                  </span>
                  <h2>By Skillset</h2>
                </div>
                <ul className="study-inner-mid">
                  {loading ? (
                    <p>Loading skills...</p>
                  ) : (
                    skills.slice(0, 7).map((item, index) => (
                      <li key={index} className="study-innner-point">
                        <button
                          className="skill-btn"
                          onClick={() => handleSkillClick(item.skill)}
                          type="button"
                        >
                          <span>{item.skill}</span>
                          <img src={arrowIcon} alt="arrow" />
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// WorkByLocation Component
const WorkByLocation = () => {
  const { data: locations, loading } = useFetchData(`${config.baseURL}/jobs/locations/get`);

  return (
    <section className="home-study-section study-new-section p-50">
    <div className="container">
      <div className="home-study-inner">
        <div className="row align-items-center">
          <div className="col-md-5">
            <div className="home-study-right">
              <figure>
                <img src={employmentImage} alt="Employment" />
              </figure>
            </div>
          </div>
          <div className="col-md-7">
            <div className="home-study-left">
              <div className="cmn-heading">
                <span className="top-name second-top-head">
                  <img src={headingIcon} alt="object-img" /> Location
                </span>
                <h2>By Location</h2>
              </div>
              <ul className="study-inner-mid">
                {loading ? (
                  <p>Loading locations...</p>
                ) : (
                  locations.slice(0, 7).map((loc, index) => (
                    <li key={index} className="study-innner-point">
                      <Link to={`/work-filter?location=${encodeURIComponent(loc.location)}`}>
                        <span>{loc.location}</span>
                        <img src={arrowIcon} alt="arrow" />
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

// RestSections Component
const RestSections = () => {
  return (
    <>
      <section className="work-process-section p-50">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-7">
              <div className="cmn-heading text-center">
                <span className="top-name">
                  PROCESS
                  <img src={objectImg} alt="object-img" />
                </span>
                <h2>Work Process</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="work-process-inner">
                {WORK_PROCESS_STEPS.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div className={`work-steps work-step${index + 1}`}>
                      {step.reverse ? (
                        <>
                          <h3>{step.title}</h3>
                          <span className="line-point"></span>
                          <span className="work-step-circle-data">{step.id}</span>
                        </>
                      ) : (
                        <>
                          <span className="work-step-circle-data">{step.id}</span>
                          <span className="line-point"></span>
                          <h3>{step.title}</h3>
                        </>
                      )}
                    </div>
                    {index < WORK_PROCESS_STEPS.length - 1 && (
                      <div className="connect-img-data">
                        <figure>
                          <img
                            src={index % 2 === 0 ? connectionImg : connectionImgNext}
                            alt="connection-img"
                          />
                        </figure>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section p-50">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-7">
              <div className="faq-left-data">
                <div className="cmn-heading">
                  <span className="top-name">
                    FAQS
                    <img src={objectImg} alt="object-img" />
                  </span>
                  <h2>Frequently Asked Questions</h2>
                </div>
                   {/* FAQ Section */}
      <FaqSection relatedTo="Work" />
              </div>
            </div>
            <div className="col-md-5">
              <div className="faq-images-main">
                <div className="faq-img-top">
                  <div className="faq-img-inner">
                    <figure>
                      <img src={faqImg5} alt="faq-img5" />
                    </figure>
                  </div>
                  <div className="faq-img-inner">
                    <figure>
                      <img src={faqImg6} alt="faq-img6" />
                    </figure>
                  </div>
                </div>
                <div className="faq-img-bottom">
                  <div className="faq-img-inner">
                    <figure>
                      <img src={faqImg7} alt="faq-img7" />
                    </figure>
                  </div>
                  <div className="faq-img-inner">
                    <figure>
                      <img src={faqImg8} alt="faq-img8" />
                    </figure>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Work;