import React from 'react'
import { Link } from 'react-router-dom';
import ChooseLeft from '../assets/images/why-choose-stydy-top.jpg'
import RightArrow from "../assets/images/right-arrow.svg";
import TF1 from "../assets/images/tf1.svg";
import TF2 from "../assets/images/tf2.svg";
import TF3 from "../assets/images/tf3.svg";
import TF4 from "../assets/images/tf4.svg";
const WhyChooseStudy = () => {
    return (
        <>
            

            <div className='main-section choose-study'>
                {/* Page banner start */}
                <section className="page-banner">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="pagebanner-text">
                                    <h1>Why Choose Study Abroad<br /> with Study Traveler?
</h1>
                                    <p>
                                        Experience transformative global education with trusted mentors, personalized programs, and end-to-end support.

                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Page banner end */}

                {/* Why Choose Inner Section Start */}
                <section className="why-choose-inner">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <div className="why-choose-left">
                                    <img src={ChooseLeft} alt="Study Abroad" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="why-choose-right">
                                    <h2>Discover, Learn & Grow with the Leaders in Global Education
</h2>
                                    <p>
                                       Expand your horizons, gain international exposure, and access top universities worldwide with our expert-led support system.

                                    </p>
                                    <div className="header-btn-main">
                                        <Link to="study" className="color-btn btn">
                                            Get Started <img src={RightArrow} alt="Right arrow" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Why Choose Inner Section End */}

                {/* Transform Future Section Start */}
                <section className="transform-future-section">
                    <div className="container">
                        <div className="row head-row">
                            <div className="col-12">
                                <div className="transform-future-heading text-center">
                                    <h2>How Studying Abroad Can Shape Your Future
</h2>
                                    <p>
                                       Gain global skills, competitive career advantages, and life-changing experiences <br/>that accelerate your personal and professional growth.

                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row box-row">
                            <div className="col-md-3">
                                <div className="transform-future-inner">
                                    <img src={TF1} alt="World-class Education" />
                                    <h3>Access to world-class education</h3>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="transform-future-inner">
                                    <img src={TF2} alt="Global Perspective" />
                                    <h3>Broaden your global perspective</h3>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="transform-future-inner">
                                    <img src={TF3} alt="International Connections" />
                                    <h3>Build international connections</h3>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="transform-future-inner">
                                    <img src={TF4} alt="Career Opportunities" />
                                    <h3>Unlock career opportunities</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Transform Future Section End */}

                {/* Study Hub Section Start */}
                <section className="study-hub-section">
                    <div className="container">
                        <div className="study-hub-inner">
                            <div className="row head-row">
                                <div className="col-12">
                                    <div className="study-hub-heading text-center">
                                        <h2>Find study programs abroad with Study Traveler Study Hub</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="study-hub-data-main">
                                <div className="study-hub-data">
                                    <h3>50,000+</h3>
                                    <p>Courses available</p>
                                </div>

                                <div className="study-hub-data">
                                    <h3>10,000+</h3>
                                    <p>Partner institutions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Study Hub Section End */}
            </div>

            

        </>
    )
}

export default WhyChooseStudy