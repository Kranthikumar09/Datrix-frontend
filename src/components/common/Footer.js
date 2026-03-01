import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../../config/config'; 


import LinkedInSvg from "../../assets/images/Linkedin-icon.svg";
import FbSvg from "../../assets/images/facebook.svg";
import InstaSvg from "../../assets/images/instagram.svg";
import YtSvg from "../../assets/images/ytube.svg";
import AddressSvg from "../../assets/images/address.svg";
import MailSvg from "../../assets/images/mail.svg";
import PhoneSvg from "../../assets/images/phone.svg";
import logo from "../../assets/images/logo.png";

const IMAGE_BASE_URL = "https://express.studytraveler.com/uploads/general-content";
const FALLBACK_LOGO = logo;


const Footer = forwardRef((props, ref) => {
    const [siteData, setSiteData] = useState({});
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [videoSrc, setVideoSrc] = useState('');

    useEffect(() => {
        axios.get(`${config.baseURL}/site-content/general-content/get`)
            .then((response) => {
                setSiteData(response.data?.data || {});
            })
            .catch((err) => {
                console.error("API Error:", err);
                setError(err.message);
            });
    }, []);

    const handleModalOpen = (src) => {
        setVideoSrc(src);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setVideoSrc('');
    };

    useImperativeHandle(ref, () => ({
        handleModalOpen
    }));

    return (
        <>
            <footer className="footer-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="footer-inner-data">
                                <Link className="footer-logo" to="/">
                                    <img
                                        src={siteData.site_logo ? `${IMAGE_BASE_URL}/${siteData.site_logo}` : FALLBACK_LOGO}
                                        alt={siteData.site_title || "Study Traveler"}
                                        onError={(e) => (e.target.src = FALLBACK_LOGO)} 
                                    />
                                </Link>

                             
                                <ul className="list-unstyled footer-social">
                                    {siteData.contact_social_linkedin && (
                                        <li>
                                            <Link to={siteData.contact_social_linkedin} target="_blank">
                                                <img src={LinkedInSvg} alt="LinkedIn" />
                                            </Link>
                                        </li>
                                    )}
                                    {siteData.contact_social_facebook && (
                                        <li>
                                            <Link to={siteData.contact_social_facebook} target="_blank">
                                                <img src={FbSvg} alt="Facebook" />
                                            </Link>
                                        </li>
                                    )}
                                    {siteData.contact_social_instagram && (
                                        <li>
                                            <Link to={siteData.contact_social_instagram} target="_blank">
                                                <img src={InstaSvg} alt="Instagram" />
                                            </Link>
                                        </li>
                                    )}
                                    {siteData.contact_social_youtube && (
                                        <li>
                                            <Link to={siteData.contact_social_youtube} target="_blank">
                                                <img src={YtSvg} alt="YouTube" />
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="our-inner-links">
                                <h3>Company</h3>
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/about">About us</Link></li>
                                    {/* <li><Link to="/">Careers</Link></li> */}
                                    <li><Link to="/contact">Contact</Link></li>
                                    {/* <li><Link to="/blog">Blogs</Link></li> */}
                                </ul>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="company-info">
                                <h3>Contact</h3>
                                <ul>
                                    {/* <li>
                                        <img src={AddressSvg} alt="Address" /> 
                                        <span>{siteData.contact_address || "Address not available"}</span>
                                    </li> */}
                                    <li>
                                        <img src={MailSvg} alt="Email" /> 
                                        <span>{siteData.contact_email || "info@studytraveler.com"}</span>
                                    </li>
                                    <li>
                                        <img src={PhoneSvg} alt="Phone" /> 
                                        <span>{siteData.contact_phone_number || "+61 45 743 84 88"}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="our-inner-links resource">
                                <h3>Resource</h3>
                                <ul>
                                    {/* <li><Link to="/contact">Contact us</Link></li> */}
                                    <li><Link to="/faq">FAQs</Link></li>
                                    <li><Link to="/blog">Blogs</Link></li>
                                    <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                                    <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="footer-bottom">
                                <span>{siteData.footer_copyright_text || "Copyright ©2025 Study Traveler. All Rights Reserved."}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Video Modal */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} id="videomodal" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title" id="staticBackdropLabel">Video</h3>
                                <button type="button" className="btn-close" onClick={handleModalClose} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <iframe width="100%" height="600" className="embed-responsive-item" src={videoSrc} allowFullScreen></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
});

export default Footer;
