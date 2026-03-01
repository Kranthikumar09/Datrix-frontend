import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import the Link component
import HomeAboutus1 from "../../assets/images/home-aboutus1.jpg";
import HomeAboutus2 from "../../assets/images/home-aboutus2.jpg";
import HomeAboutus3 from "../../assets/images/home-aboutus3.jpg";
import ObjectImg from "../../assets/images/object.svg";
import CheckImg from "../../assets/images/check-img.svg";
import RightArrow from "../../assets/images/right-arrow.svg";

const AboutSection = () => {
    const location = useLocation();
    return (
        <>
            <section className="aboutus-section p-75">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="aboutus-left">
                                <div className="about-left-top">
                                    <div className="aboutus-left-img">
                                        <figure>
                                            <img src={HomeAboutus1} alt="About Us 1" />
                                        </figure>
                                    </div>
                                    <div className="aboutus-left-img">
                                        <figure>
                                            <img src={HomeAboutus2} alt="About Us 2" />
                                        </figure>
                                    </div>
                                </div>

                                <div className="about-left-bottom">
                                    <div className="about-exp">
                                        <span>10+</span>
                                        <p>years of <br /> experiences</p>
                                    </div>
                                    <div className="aboutus-left-img about-shape-one">
                                        <figure>
                                            <img src={HomeAboutus3} alt="About Us 3" />
                                        </figure>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="right-about-data">
                                <div className="cmn-heading">
                                    <span className="top-name">ABOUT US <img src={ObjectImg} alt="Object " /></span>
                                    <h2>Study Traveler | Your Gateway to <span>Global Opportunities</span></h2>
                                    <p>Step into a world of limitless possibilities with expert guidance for education, immigration, and global travel.
</p>
                                </div>
                                <div className="right-about-bottom-main">
                                    <div className="right-about-bottom-inner">
                                        <h3> <img src={CheckImg} alt="Check" /> Study</h3>
                                        <p>Shape your academic future with world-class universities and personalized admission support.
</p>
                                    </div>
                                    <div className="right-about-bottom-inner">
                                        <h3> <img src={CheckImg} alt="Check" /> Work</h3>
                                        <p>Unlock global career pathways with expert job search, visa assistance, and skill-mapping guidance.
</p>
                                    </div>
                                </div>
                                <div className="header-btn-main">
      {/* Check if the current page is not the About page */}
      {location.pathname !== '/about' && (
        <Link to="/about" className="color-btn btn">
          Read More <img src={RightArrow} alt="Right Arrow" />
        </Link>
      )}
    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AboutSection;
