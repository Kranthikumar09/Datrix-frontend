import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import intlTelInput from "intl-tel-input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "intl-tel-input/build/css/intlTelInput.css";
import RightArrow from "../assets/images/right-arrow.svg";
import mapIcon from "../assets/images/map1.svg";
import smstrackingIcon from "../assets/images/smstracking.svg";
import mobileIcon from "../assets/images/mobile.svg";
import linkedinIcon from "../assets/images/linkedin.svg";
import fbIcon from "../assets/images/fb.svg";
import instaIcon from "../assets/images/insta.svg";
import youtubeIcon from "../assets/images/youtube.svg";
import config from '../config/config';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone_number: "",
        subject: "General Inquiry",
        message: "",
        honeypot: "", // Added honeypot field
    });
    const [siteContent, setSiteContent] = useState({
        contact_address: "",
        contact_email: "",
        contact_phone_number: "",
        contact_social_linkedin: "",
        contact_social_instagram: "",
        contact_social_facebook: "",
        contact_social_youtube: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState("in"); // Default to India
    const phoneInputRef = useRef(null); // Ref to store phone input element
    const itiRef = useRef(null); // Ref to store intlTelInput instance

    useEffect(() => {
        const fetchSiteContent = async () => {
            try {
                const response = await axios.get(`${config.baseURL}/site-content/general-content/get`);
                if (response.data.success) {
                    setSiteContent(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching site content:", error);
            }
        };

        fetchSiteContent();

        const input = document.querySelector("#phone_number");
        phoneInputRef.current = input;
        if (input) {
            const iti = intlTelInput(input, {
                initialCountry: selectedCountry,
                separateDialCode: true
            });
            itiRef.current = iti; // Store the instance
            // Update selected country when user changes it
            input.addEventListener("countrychange", () => {
                setSelectedCountry(iti.getSelectedCountryData().iso2);
            });
            return () => {
                iti.destroy(); // Cleanup on unmount
            };
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            phone_number: "",
            subject: "General Inquiry",
            message: "",
            honeypot: "", // Reset honeypot field
        });
        setSelectedCountry("in"); // Reset country to India
        if (phoneInputRef.current && itiRef.current) {
            itiRef.current.setCountry("in"); // Reset intl-tel-input to India
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if honeypot field is filled
        if (formData.honeypot) {
            toast.error("Bot submission detected.", { position: "top-right" });
            console.log("Honeypot triggered:", formData.honeypot);
            return;
        }

        // Validate name field
        const trimmedName = formData.name.trim();
        if (!trimmedName || trimmedName.length === 0) {
            toast.error("Name cannot be empty or contain only spaces.", { position: "top-right" });
            return;
        }

        // Validate email field
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error("Please enter a valid email address.", { position: "top-right" });
            return;
        }

        // Validate phone number field
        const trimmedPhone = formData.phone_number.trim();
        if (!trimmedPhone || !/^\d{8,15}$/.test(trimmedPhone)) {
            toast.error("Please enter a valid phone number (8-15 digits).", { position: "top-right" });
            return;
        }

        // Validate message field
        if (!formData.message.trim()) {
            toast.error("Message cannot be empty.", { position: "top-right" });
            return;
        }

        setIsSubmitting(true);

        const phoneInput = phoneInputRef.current;
        const iti = itiRef.current;
        const phoneCode = iti.getSelectedCountryData().dialCode;

        const updatedFormData = {
            ...formData,
            name: trimmedName, // Send trimmed name to backend
            phone_code: `+${phoneCode}`,
            phone_number: trimmedPhone, // Send trimmed phone number
        };

        try {
            const response = await axios.post(`${config.baseURL}/contact-requests/submit`, updatedFormData);

            if (response.data.success) {
                toast.success("Your message has been sent successfully! 🎉", { position: "top-right" });
                resetForm(); // Reset form and country code after successful submission
            } else {
                toast.error("Failed to submit. Please check your details.", { position: "top-right" });
            }
        } catch (error) {
            toast.error("Failed to submit. Please try again later.", { position: "top-right" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const socialLinks = [
        { link: siteContent.contact_social_linkedin, icon: linkedinIcon, alt: "LinkedIn" },
        { link: siteContent.contact_social_facebook, icon: fbIcon, alt: "Facebook" },
        { link: siteContent.contact_social_instagram, icon: instaIcon, alt: "Instagram" },
        { link: siteContent.contact_social_youtube, icon: youtubeIcon, alt: "YouTube" }
    ].filter(social => social.link && social.link.trim() !== "");

    return (
        <>
            <ToastContainer theme="colored" />

            <div className="main-section">
                <section className="page-banner">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="pagebanner-text">
                                    <h1>Let's Connect</h1>
                                    <p>
                                        We’d love to hear from you! Whether you have a question, suggestion, or just want to chat, don’t hesitate to reach out.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="contact-info">
                    <div className="container">
                        <div className="row main-row">
                            <div className="bg-color">
                                <div className="row form-row">
                                    <div className="col-lg-5 ps-0">
                                        <div className="contact-details">
                                            <div className="circle-mini"></div>
                                            <div className="circle-big"></div>
                                            <div className="info-details">
                                                <h2>Contact Information</h2>
                                                <p>We’re here to assist you! Feel free to get in touch through any of the following channels.</p>
                                                <ul>
                                                    {/* <li>
                                                        <span className="icon"><img src={mapIcon} alt="Map Icon" /></span>
                                                        <span className="text">{siteContent.contact_address}</span>
                                                    </li> */}
                                                    <li>
                                                        <span className="icon"><img src={smstrackingIcon} alt="Email" /></span>
                                                        <span className="text">{siteContent.contact_email}</span>
                                                    </li>
                                                    <li>
                                                        <span className="icon"><img src={mobileIcon} alt="Phone" /></span>
                                                        <span className="text">{siteContent.contact_phone_number}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="bottom-socials">
                                                <ul>
                                                    {socialLinks.map((social, index) => (
                                                        <li key={index}>
                                                            <a href={social.link} target="_blank" rel="noopener noreferrer">
                                                                <img src={social.icon} alt={social.alt} />
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-7 pe-0">
                                        <div className="contact-form">
                                            <form onSubmit={handleSubmit}>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label>Name *</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Name"
                                                                name="name"
                                                                value={formData.name}
                                                                onChange={handleChange}
                                                                required
                                                                maxLength={60}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label>Select Subject</label>
                                                            <select className="form-select" name="subject" value={formData.subject} onChange={handleChange}>
                                                                <option value="General Inquiry">General Inquiry</option>
                                                                <option value="Study Application">Study Application</option>
                                                                <option value="Work Visa">Work Visa</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group phone-group">
                                                            <label>Mobile number *</label>
                                                            <input
                                                                type="tel"
                                                                id="phone_number"
                                                                className="form-control"
                                                                name="phone_number"
                                                                value={formData.phone_number}
                                                                onChange={handleChange}
                                                                required
                                                                inputMode="numeric"
                                                                pattern="[0-9]*"
                                                                maxLength="15"
                                                                minLength="8"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label>Email *</label>
                                                            <input
                                                                type="email"
                                                                className="form-control"
                                                                placeholder="Email"
                                                                name="email"
                                                                value={formData.email}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <label>Message *</label>
                                                            <textarea
                                                                className="form-control"
                                                                rows="5"
                                                                placeholder="Write your message.."
                                                                name="message"
                                                                value={formData.message}
                                                                onChange={handleChange}
                                                                required
                                                            ></textarea>
                                                        </div>
                                                    </div>
                                                    {/* Honeypot Field */}
                                                    <div className="col-md-12" style={{ display: 'none' }}>
                                                        <div className="form-group">
                                                            <label htmlFor="honeypot">Website</label>
                                                            <input
                                                                id="honeypot"
                                                                type="text"
                                                                className="form-control"
                                                                name="honeypot"
                                                                value={formData.honeypot}
                                                                onChange={handleChange}
                                                                placeholder=""
                                                                tabIndex="-1"
                                                                autoComplete="off"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="form-action">
                                                            <button
                                                                type="submit"
                                                                className="color-btn btn"
                                                                disabled={isSubmitting}
                                                            >
                                                                {isSubmitting ? (
                                                                    <span>
                                                                        Sending... <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                    </span>
                                                                ) : (
                                                                    <>
                                                                        Send Message
                                                                        <img src={RightArrow} alt="Right Arrow" />
                                                                    </>
                                                                )}
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
                    </div>
                </section>
            </div>
        </>
    );
};

export default Contact;