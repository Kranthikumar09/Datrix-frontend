import React from 'react'
import AboutSection from '../components/layout/AboutSection'
import JourneySection from '../components/layout/JourneySection'
import PartnerSection from '../components/layout/PartnerSection'
import Testimonial from '../components/layout/Testimonial'
import abtMissOne from '../assets/images/abt-miss-one.png';
import abtMissTwo from '../assets/images/abt-miss-two.png';
import objectImg from '../assets/images/object.svg';
import valueIcon1 from '../assets/images/value-icon-1.svg';
import valueIcon2 from '../assets/images/value-icon-2.svg';
import valueIcon3 from '../assets/images/value-icon-3.svg';
import valueIcon4 from '../assets/images/value-icon-4.svg';

const About = () => {
    return (
        <>
            
            <div className="main-section">
                {/* Page banner start */}
                <section className="page-banner">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="pagebanner-text">
                                    <h1>About Study Traveler</h1>
                                    <p>
                                        Whether you aspire to study, work, settle, or explore new horizons, we simplify the process,
                                        ensuring a smooth journey toward your global dreams.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Page banner end */}

                {/* About start */}

                <AboutSection />

                {/* About end */}
                {/* Mission Section Start */}
                <section className="mission-section">
                    <div className="container">
                        <div className="row">
                            {/* First mission box */}
                            <div className="col-lg-6">
                                <div className="about-mission-box">
                                    <img src={abtMissOne} alt="Our Vision" />
                                    <div className="text-box">
                                        <h6>Our Vision</h6>
                                        <p>
                                           To empower every student and professional with the opportunity to explore the world, unlock global education, and build meaningful international careers — regardless of background or borders.
                                        </p>
                                        <p>We envision a future where studying, working, and traveling abroad is seamless, transparent, and accessible to all.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Second mission box */}
                            <div className="col-lg-6">
                                <div className="about-mission-box">
                                    <img src={abtMissTwo} alt="Our Mission" />
                                    <div className="text-box">
                                        <h6>Our Mission</h6>
                                        <p>
                                           To guide individuals through every step of their global journey with trusted expertise, personalized counselling, and innovative technology.</p><p>
We are committed to simplifying admissions, visa processes, and travel planning while delivering authentic, reliable, and end-to-end support — from the first enquiry to successful settlement abroad.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission Section End */}

                {/* About Values Start */}

                <section className="about-values">
                    <div className="container">
                        <div className="row head-row">
                            <div className="col-12">
                                <div className="cmn-heading text-center">
                                    <span className="top-name">
                                        Value <img src={objectImg} alt="object-img" />
                                    </span>
                                    <h2>Our Values</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-3 col-md-6">
                                <div className="values-box">
                                    <img src={valueIcon1} alt="Learning" />
                                    <h5>Learning</h5>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="values-box">
                                    <img src={valueIcon2} alt="Integrity" />
                                    <h5>Integrity</h5>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="values-box">
                                    <img src={valueIcon3} alt="Fast" />
                                    <h5>Fast</h5>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="values-box">
                                    <img src={valueIcon4} alt="Empathy" />
                                    <h5>Empathy</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Values End */}

                {/* Testimonial Section Start*/}
                <Testimonial />
                {/* End of Testimonial Section */}

                {/* Partner Section Start */}

                <PartnerSection />

                {/* Partner Section End */}

                {/* Journey Section Start */}

                <JourneySection />

                {/* Journey Section End */}
            </div>

            

        </>
    )
}

export default About;