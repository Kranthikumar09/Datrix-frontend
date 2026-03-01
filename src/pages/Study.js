import { useNavigate, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import config from "../config/config";
import axios from "axios";
import studyPageTopImg from "../assets/images/stydy-page-top-img.jpg";
import bookIcon from "../assets/images/book.svg";
import arrowRightIcon from "../assets/images/arrow-small-right.svg";
import whatsappIcon from "../assets/images/whstsapp-img.svg";
import leftBtnIcon from "../assets/images/left-btn.svg";
import RightArrow from "../assets/images/right-arrow.svg";
import searchIcon from '../assets/images/search-normal.svg';
import headingIcon from '../assets/images/heading-icon.svg';
import studyCountryImg from '../assets/images/study-contry-img.jpg';
import studyDegreeImg from '../assets/images/study-degree-img.jpg';
import studyUniversityImg from '../assets/images/study-univercity.jpg';
import Career1 from '../assets/images/Career1.jpg';
import Career2 from '../assets/images/Career2.jpg';
import Career3 from '../assets/images/Career3.jpg';
import Career4 from '../assets/images/Career4.jpg';
import ObjectImg from '../assets/images/object.svg';
import FaqSection from "../components/layout/FaqSection";
import Step1Img from '../assets/images/step1-img.svg';
import Step2Img from '../assets/images/step2-img.svg';
import Step3Img from '../assets/images/step3-img.svg';
import Step4Img from '../assets/images/step4-img.svg';
import Step5Img from '../assets/images/step5-img.svg';
import SignupForm from "../auth/SignupForm";
import objectImg from '../assets/images/object.svg';
import faqImg1 from '../assets/images/faq-img1.jpg';
import faqImg2 from '../assets/images/faq-img2.jpg';
import faqImg3 from '../assets/images/faq-img3.jpg';
import faqImg4 from '../assets/images/faq-img4.jpg';

const Study = () => {
  const [specializations, setSpecializations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Added for auth
  const navigate = useNavigate();

  // Check login status on load and updates
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token); // Convert to boolean (true/false)

    // Optional: Listen for storage changes
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("accessToken");
      setIsLoggedIn(!!updatedToken);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Handle search and redirect
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/study-filter?course_name=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Fetch Specializations from API
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get(`${config.baseURL}/courses/specializations/get`);
        if (response.data.success) {
          setSpecializations(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching specializations:", error);
      }
    };
    fetchSpecializations();
  }, []);

  // Fetch Locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${config.baseURL}/courses/locations/get`);
        if (response.data.success) {
          setLocations(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  // Handle country selection
  const handleCountryClick = (country) => {
    navigate(`/study-filter?country=${encodeURIComponent(country)}`);
  };

  // Handle location click and redirect
  const handleLocationClick = (location) => {
    navigate(`/study-filter?location=${encodeURIComponent(location)}`);
  };

  const [phoneNumber, setPhoneNumber] = useState('');
  const handlePhoneChange = (value) => {
    setPhoneNumber(value);
  };

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Function to update the progress bar
  const setProgressBar = (step) => {
    const percent = (100 / totalSteps) * step;
    return percent.toFixed();
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const [showRadioSelectData, setShowRadioSelectData] = useState(false);

  const handleSchoolStudentsClick = () => {
    setShowRadioSelectData(true);
  };

  const handleGraduatesClick = () => {
    setShowRadioSelectData(false);
  };

  return (
    <div className="main-section">
      {/* Page banner start */}
      <section className="study-page-main-section p-50">
        <div className="container">
          <div className="study-page-inner">
            <div className="row">
              <div className="col-md-5">
                <div className="study-page-top-img h-100">
                  <img src={studyPageTopImg} className="h-100" alt="Study Abroad" />
                </div>
              </div>
              <div className="col-md-7">
                <div className="study-page-right-data">
                  <div className="cmn-heading">
                    <h1>Study Abroad</h1>
                    <p>
                     Explore global education, unlock new cultures, and build a future filled with international opportunities.
                    </p>
                  </div>
                  {/* Conditional Content Based on Authentication */}
                  {!isLoggedIn ? (
                    <>
                      <SignupForm redirect="/application-form" />
                      
                    </>
                  ) : (
                    <>
                      <p>
                        Welcome back! You're ready to explore study opportunities abroad. Check your application status or search for courses below.
                      </p>
                      <div className="header-btn-main mt-5">
                        <Link to="/study-applications" className="color-btn btn">
                          View Application <img alt="Right Arrow" src={RightArrow} />
                        </Link>
                        <Link to="/study-filter" className="color-btn btn">
                          Search Courses <img alt="Right Arrow" src={RightArrow} />
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${setProgressBar(currentStep)}%` }}
          />
        </div>
      </section>
      {/* Page banner end */}

      {/* Study Opportunity start */}
      <section className="study-opportunity-section p-50">
        <div className="container">
          <div className="study-opportunity-inner">
            <div className="row justify-content-center">
              <div className="col-12">
                <div className="study-opportunity-main">
                  <div className="cmn-heading text-center">
                    <h2>Study Opportunity</h2>
                  </div>
                  <form onSubmit={handleSearch} className="search-form-data">
                    <div className="row justify-content-center">
                      <div className="col-md-7">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search for the courses"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <img src={searchIcon} alt="search icon" className="search-img" />
                          <button type="submit" className="submit action-button color-btn btn">
                            Find <img src={RightArrow} alt="right arrow" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Study Opportunity end */}

      {/* Study section start */}
      <section className="home-study-section study-new-section p-50">
        <div className="container">
          <div className="home-study-inner">
            <div className="row align-items-center">
              <div className="col-md-7">
                <div className="home-study-left">
                  <div className="cmn-heading">
                    <span className="top-name second-top-head">
                      <img src={headingIcon} alt="object-img" />
                      Country
                    </span>
                    <h2>By Country</h2>
                  </div>
                  <ul className="study-inner-mid">
                    {[
                      "Canada",
                      "India",
                      "Australia",
                      "Germany",
                      "UK",
                      "USA",
                      "Europe",
                      "Korea",
                    ].map((country, index) => (
                      <li className="study-innner-point" key={index}>
                        <button
                          className="country-button"
                          onClick={() => handleCountryClick(country)}
                        >
                          <span>Study in {country}</span>
                          <img src={arrowRightIcon} alt="" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-md-5">
                <div className="home-study-right">
                  <figure>
                    <img src={studyCountryImg} alt="Study Countries" />
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Study section end */}

      <section className="home-Work-section p-50">
  <div className="container">
    <div className="home-study-inner">
      <div className="row align-items-center">
        <div className="col-md-5">
          <div className="home-study-right">
            <figure>
              <img src={studyDegreeImg} alt="Study Degrees" />
            </figure>
          </div>
        </div>
        <div className="col-md-7">
          <div className="home-study-left">
            <div className="cmn-heading">
              <span className="top-name second-top-head">
                <img src={headingIcon} alt="object-img" />
                Specialize
              </span>
              <h2>By Specializations</h2>
            </div>
            <ul className="study-inner-mid">
              {specializations.length > 0 ? (
                specializations.slice(0, 7).map((item, index) => (
                  <li className="study-innner-point" key={index}>
                    <Link to={`/study-filter?specialization=${encodeURIComponent(item.specialization)}`}>
                      <span>{item.specialization}</span>
                      <img src={arrowRightIcon} alt="" />
                    </Link>
                  </li>
                ))
              ) : (
                <p>Loading specializations...</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Location section start */}
      <section className="home-study-section study-new-section p-50">
  <div className="container">
    <div className="home-study-inner">
      <div className="row align-items-center">
        <div className="col-md-7">
          <div className="home-study-left">
            <div className="cmn-heading">
              <span className="top-name second-top-head">
                <img src={headingIcon} alt="object-img" />
                Location
              </span>
              <h2>By Location</h2>
            </div>
            <ul className="study-inner-mid">
              {locations.length > 0 ? (
                locations.slice(0, 7).map((item, index) => (
                  <li className="study-innner-point" key={index}>
                    <button
                      className="location-button"
                      onClick={() => handleLocationClick(item.location)}
                    >
                      <span>{item.location}</span>
                      <img src={arrowRightIcon} alt="" />
                    </button>
                  </li>
                ))
              ) : (
                <p>Loading locations...</p>
              )}
            </ul>
          </div>
        </div>
        <div className="col-md-5">
          <div className="home-study-right">
            <figure>
              <img src={studyUniversityImg} alt="Study Universities" />
            </figure>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
      {/* Location section end */}

      {/* Career section start */}
      <section className="career-path-section p-50">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-md-6 text-left">
              <div className="faq-images-main">
                <div className="faq-img-top">
                  <div className="faq-img-inner">
                    <figure>
                      <img src={Career1} alt="Career 1" />
                    </figure>
                  </div>
                  <div className="faq-img-inner">
                    <figure>
                      <img src={Career2} alt="Career 2" />
                    </figure>
                  </div>
                </div>
                <div className="faq-img-bottom">
                  <div className="faq-img-inner">
                    <figure>
                      <img src={Career3} alt="Career 3" />
                    </figure>
                  </div>
                  <div className="faq-img-inner">
                    <figure>
                      <img src={Career4} alt="Career 4" />
                    </figure>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="career-path-right">
                <div className="cmn-heading">
                  <span className="top-name">
                    CAREER <img src={ObjectImg} alt="object-img" />
                  </span>
                  <h2>Select Your Career Path</h2>
                  <p>
                   Whether you want to study, work, or settle abroad, Study Traveler guides you through every step with a structured, expert-designed roadmap.
                  </p>
                </div>
                <div className="header-btn-main">
                  <Link to="/signup" className="color-btn btn">
                    Get Started <img src={RightArrow} alt="Right Arrow" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Career section end */}

      {/* Process section start */}
      <section className="how-works-section p-50">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-md-7">
              <div className="cmn-heading text-center">
                <span className="top-name">
                  HOW IT WORK <img src={ObjectImg} alt="object-img" />
                </span>
                <h2>Begin Your Global Journey in 5 Simple Steps
</h2>
              </div>
            </div>
          </div>
       <div className="how-works-inner">
  <div className="row justify-content-center">
    <div className="col-12">
      <div className="actual-graph">

        <div className="steps step1">
          <div className="step-img-data">
            <figure>
              <img src={Step1Img} alt="Step 1" />
            </figure>
          </div>
          <h3>Enquiry</h3>
          <span></span>
          <h4>01</h4>
          <p>Speak with our experts and share your goals to get started.</p>
        </div>

        <div className="steps step2">
          <h3>Expert <br /> Counselling</h3>
          <p>Receive personalized guidance tailored to your academic or career path.</p>
          <h4>02</h4>
          <span></span>
          <div className="step-img-data">
            <figure>
              <img src={Step2Img} alt="Step 2" />
            </figure>
          </div>
        </div>

        <div className="steps step3">
          <div className="step-img-data">
            <figure>
              <img src={Step3Img} alt="Step 3" />
            </figure>
          </div>
          <h3>Eligibility Check</h3>
          <span></span>
          <h4>03</h4>
          <p>Understand your eligibility for universities, visas, or global job programs.</p>
        </div>

        <div className="steps step4">
          <h3>Documentation</h3>
          <p>We help you prepare and perfect every required document.</p>
          <h4>04</h4>
          <span></span>
          <div className="step-img-data">
            <figure>
              <img src={Step4Img} alt="Step 4" />
            </figure>
          </div>
        </div>

        <div className="steps step5">
          <div className="step-img-data">
            <figure>
              <img src={Step5Img} alt="Step 5" />
            </figure>
          </div>
          <h3>Processing</h3>
          <span></span>
          <h4>05</h4>
          <p>Your application, visa, and approvals are handled with complete end-to-end support.</p>
        </div>

      </div>
    </div>
  </div>
</div>

        </div>
      </section>
      {/* Process section end */}


  <section className="faq-section p-50">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-7">
                        <div className="faq-left-data">
                            <div className="cmn-heading">
                                <span className="top-name">
                                    FAQS <img src={objectImg} alt="object-img" />
                                </span>
                                <h2>Frequently Asked Questions</h2>
                            </div>

                          {/* FAQ Section */}
      <FaqSection relatedTo="Study" />
                        </div>
                    </div>

                    {/* Right Side Images */}
                    <div className="col-md-5">
                        <div className="faq-images-main">
                            <div className="faq-img-top">
                                <div className="faq-img-inner">
                                    <figure>
                                        <img src={faqImg1} alt="FAQ 1" />
                                    </figure>
                                </div>
                                <div className="faq-img-inner">
                                    <figure>
                                        <img src={faqImg3} alt="FAQ 3" />
                                    </figure>
                                </div>
                            </div>

                            <div className="faq-img-bottom">
                                <div className="faq-img-inner">
                                    <figure>
                                        <img src={faqImg2} alt="FAQ 2" />
                                    </figure>
                                </div>
                                <div className="faq-img-inner">
                                    <figure>
                                        <img src={faqImg4} alt="FAQ 4" />
                                    </figure>
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

export default Study;