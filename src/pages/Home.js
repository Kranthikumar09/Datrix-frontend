import React, { useRef, } from 'react'
import { Link } from 'react-router-dom'
import TeacherIcon from "../assets/images/teacher.svg";
import BriefcaseIcon from "../assets/images/briefcase.svg";
import HomeRightImg from "../assets/images/home-right-img.png";
import Flag1 from "../assets/images/flag-1.svg";
import Flag2 from "../assets/images/flag-2.svg";
import Flag3 from "../assets/images/flag-3.svg";
import Flag4 from "../assets/images/flag-4.svg";
import Flag5 from "../assets/images/flag-5.svg";
import RightArrow from "../assets/images/right-arrow.svg";
import HeadingIcon from "../assets/images/heading-icon.svg";
import BookIcon from "../assets/images/book.svg";
import BookmarkIcon from "../assets/images/bookmark.svg";
import BriefBlack from "../assets/images/briefcase-black.svg";
import TeacherBlackIcon from "../assets/images/teacher-black.svg";
import InfoCircleIcon from "../assets/images/info-circle.svg";
import StudyRightImg from "../assets/images/study-right.jpg";
import ArrowSmallRight from "../assets/images/arrow-small-right.svg";
import blogImg1 from '../assets/images/blog-img1.jpg';
import blogImg2 from '../assets/images/blog-img2.jpg';
import blogImg3 from '../assets/images/blog-img3.jpg';
import objectImg from '../assets/images/object.svg';
import Testimonial from '../components/layout/Testimonial';
import JourneySection from '../components/layout/JourneySection';
import PartnerSection from '../components/layout/PartnerSection';
import AboutSection from '../components/layout/AboutSection';
import FaqSection from '../components/layout/FaqSection';
import faqImg1 from '../assets/images/faq-img1.jpg';
import faqImg2 from '../assets/images/faq-img2.jpg';
import faqImg3 from '../assets/images/faq-img3.jpg';
import faqImg4 from '../assets/images/faq-img4.jpg';


const Home = () => {

    const footerRef = useRef();

    // const handleWorkButtonClick = () => {
    //     footerRef.current.handleModalOpen('');
    // };


    return (
        <>
            
            <div className="main-section">
                {/* Hero banner start */}
                <section className="hero-section p-50">
                    <div className="container">
                        <div className="hero-inner">
                            <div className="row align-items-center">
                                <div className="col-md-7">
                                    <div className="banner-left">
  <h1>
    Study Traveler <br /> <span>Your Gateway to Global Opportunities</span>
  </h1>
  <p>
    Step into a world of limitless possibilities with expert guidance for education, immigration, and global travel.
  </p>
<div className="header-btn-main">
                                            <Link to="/study" className="border-btn btn">
                                                <img src={TeacherIcon} alt="Study Icon" />
                                                Study
                                            </Link>
                                          
                                            <Link to="/work" className="color-btn btn">
                                                <img src={BriefcaseIcon} alt="Work Icon" />
                                                Work
                                            </Link>
                                        </div>
</div>
                                </div>
                                <div className="col-md-5">
                                    <div className="banner-right">
                                        <figure>
                                            <img src={HomeRightImg} alt="Home Right Image" />
                                        </figure>

                                        <div className="banner-award shape-one">
                                            <figure>
                                                <img src={Flag1} alt="Germany Flag" />
                                            </figure>
                                            <div className="award-content">
                                                <h6>Germany</h6>
                                            </div>
                                        </div>

                                        <div className="banner-award shape-two">
                                            <figure>
                                                <img src={Flag5} alt="South Korea Flag" />
                                            </figure>
                                            <div className="award-content">
                                                <h6>South Korea</h6>
                                            </div>
                                        </div>

                                        <div className="banner-award shape-three">
                                            <figure>
                                                <img src={Flag2} alt="South Africa Flag" />
                                            </figure>
                                            <div className="award-content">
                                                <h6>South Africa</h6>
                                            </div>
                                        </div>

                                        <div className="banner-award shape-four">
                                            <figure>
                                                <img src={Flag3} alt="Turkey Flag" />
                                            </figure>
                                            <div className="award-content">
                                                <h6>Turkey</h6>
                                            </div>
                                        </div>

                                        <div className="banner-award shape-five">
                                            <figure>
                                                <img src={Flag4} alt="Indonesia Flag" />
                                            </figure>
                                            <div className="award-content">
                                                <h6>Indonesia</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Hero banner end */}
                {/* Home About start */}
                <AboutSection/>
                {/* Home About end */}

                {/* Home Study start */}
                <section className="home-study-section p-50">
                    <div className="container">
                        <div className="home-study-inner">
                            <div className="row align-items-center">
                                <div className="col-md-7">
                                    <div className="home-study-left">
                                        <div className="cmn-heading">
                                            <span className="top-name second-top-head">
                                                <img src={HeadingIcon} alt="heading-icon" /> Study
                                            </span>
                                            <h2>Shape Your Future with Global Education Opportunities</h2>
                                        </div>

                                        <ul className="study-inner-mid">
                                            <li className="study-innner-point">
                                                <Link to="/signup">
                                                    <img src={BookIcon} alt="Book Icon" />
                                                    <span>School students</span>
                                                    <img src={ArrowSmallRight} alt="Arrow Right" />
                                                </Link>
                                            </li>
                                            <li className="study-innner-point">
                                                <Link to="/signup">
                                                    <img src={TeacherBlackIcon} alt="Teacher Icon" />
                                                    <span>Graduates</span>
                                                    <img src={ArrowSmallRight} alt="Arrow Right" />
                                                </Link>
                                            </li>
                                            <li className="study-innner-point">
                                                <Link to="why-choose-study">
                                                    <img src={InfoCircleIcon} alt="Info Circle Icon" />
                                                    <span>Why choose Study Traveler?</span>
                                                    <img src={ArrowSmallRight} alt="Arrow Right" />
                                                </Link>
                                            </li>
                                        </ul>

                                        <div className="header-btn-main">
                                            <Link to="/signup" className="color-btn btn">
                                                Begin Your Journey Now
                                                <img src={RightArrow} alt="Right Arrow" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-5">
                                    <div className="home-study-right">
                                        <figure>
                                            <img src={StudyRightImg} alt="Study Right Image" />
                                        </figure>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Home Study end */}

                {/* Home Work start */}
                <section className="home-Work-section p-50">
                    <div className="container">
                        <div className="home-study-inner">
                            <div className="row align-items-center">
                                <div className="col-md-5">
                                    <div className="home-study-right">
                                        <figure>
                                            <img src={StudyRightImg} alt="Study Right" />
                                        </figure>
                                    </div>
                                </div>
                                <div className="col-md-7">
                                    <div className="home-study-left">
                                        <div className="cmn-heading">
                                            <span className="top-name second-top-head">
                                                <img src={HeadingIcon} alt="heading-icon" /> Work
                                            </span>
                                            <h2>Unlock Global Career Opportunities with Ease</h2>
                                        </div>

                                        <ul className="study-inner-mid">
                                            <li className="study-innner-point">
                                                <Link to="/signup">
                                                    <img src={BriefBlack} alt="Book Icon" />
                                                    <span>Search Overseas Jobs</span>
                                                    <img src={ArrowSmallRight} alt="Arrow Right" />
                                                </Link>
                                            </li>
                                            <li className="study-innner-point">
                                                <Link to="/signup">
                                                    <img src={BookmarkIcon} alt="Teacher Icon" />
                                                    <span>Job & Abroad</span>
                                                    <img src={ArrowSmallRight} alt="Arrow Right" />
                                                </Link>
                                            </li>
                                            <li className="study-innner-point">
                                                <Link to="/why-choose-work">
                                                    <img src={InfoCircleIcon} alt="Info Icon" />
                                                    <span>Why choose Study Traveler?</span>
                                                    <img src={ArrowSmallRight} alt="Arrow Right" />
                                                </Link>
                                            </li>
                                        </ul>

                                        <div className="header-btn-main">
                                            <Link to="/signup" className="color-btn btn">
                                            Start Your Work Journey Today
                                                <img src={RightArrow} alt="Right Arrow" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Home Work End */}

              
               {/* Testimonial Section Start*/}
               <Testimonial/>

          
                {/* End of Testimonial Section */}

                {/* Partner Section Start */}

               <PartnerSection/>

                {/* Partner Section End */}

           


                {/* FAQ Section start */}

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
      <FaqSection relatedTo="" />
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

                {/* FAQ Section End */}


                {/* Journey Section Start */}

                <JourneySection/>

                {/* Journey Section End */}
            </div>

          

        </>
    )
}

export default Home