import React from 'react'
import { Link } from 'react-router-dom';
import ChooseLeftWork from '../assets/images/choose-left-work.png'
import RightArrow from "../assets/images/right-arrow.svg";
import CW1 from "../assets/images/choose-work1.svg";
import CW2 from "../assets/images/choose-work2.svg";
import CW3 from "../assets/images/choose-work3.svg";
import CW4 from "../assets/images/choose-work4.svg";

const WhyChooseWork = () => {
  return (
    <>
    
    <div className='main-section choose-study'>
        {/* Page banner start */}
        <section className="page-banner">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="pagebanner-text">
                            <h1>Why Choose Work</h1>
                            <p>
                                Unlock global career pathways with expert job search, visa assistance, and skill-mapping guidance.
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
                            <img src={ChooseLeftWork} alt="Study Abroad" />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="why-choose-right">
                            <h2>Find and get a job abroad with the world leaders in overseas careers</h2>
                            <p>
                                Dreaming of an international career? Get expert job-search support, resume optimization, visa guidance, 
                                and global placement assistance. We help you navigate the complex international job market to 
                                land high-paying roles that match your skills and aspirations.
                            </p>
                            <div className="header-btn-main">
                                <Link to="/work" className="color-btn btn">
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
                            <h2>How can working abroad change your life?</h2>
                            <p>
                                Gain international exposure, access higher earning potential, <br /> and experience a superior quality of life while building a global network.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row box-row">
                    <div className="col-md-3">
                        <div className="transform-future-inner">
                            <img src={CW1} alt="World-class Education" />
                            <h3>High paying jobs</h3>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="transform-future-inner">
                            <img src={CW2} alt="Global Perspective" />
                            <h3>Quality of life</h3>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="transform-future-inner">
                            <img src={CW3} alt="International Connections" />
                            <h3>Migrate with family</h3>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="transform-future-inner">
                            <img src={CW4} alt="Career Opportunities" />
                            <h3>Healthcare & Safety</h3>
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
                                {/* Fixed branding from Study Traveler to Fly-Abroad */}
                                <h2>Find a job abroad with Study traveler JobSite</h2>
                            </div>
                        </div>
                    </div>
                    <div className="study-hub-data-main">
                        <div className="study-hub-data">
                            <h3>50,000+</h3>
                            <p>Jobs available</p>
                        </div>

                        <div className="study-hub-data">
                            <h3>10,000+</h3>
                            <p>Employers</p>
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

export default WhyChooseWork