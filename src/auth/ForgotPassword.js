import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../config/config";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/images/logo.png";
import LoginBg from "../assets/images/login-bg.png";
import ArrowLeft from "../assets/images/arrow-left.svg";

const RESET_TOKEN_URL = `${config.baseURL}/verify/email-token/send`;

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(RESET_TOKEN_URL, {
                user_email: email,
                type: "password",
            });
            if (response.data.success) {
                toast.success("A password reset link has been sent to your email!");
                setEmail("");
                setTimeout(() => {
                    navigate("/login"); // Redirect to login after 3 seconds
                }, 3000);
            } else {
                toast.error(response.data.message || "Failed to send reset link.");
            }
        } catch (error) {
            console.error("Reset Request Error:", error.response?.data || error.message);
            toast.error(
                error.response?.data?.message || "Failed to send reset link. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const pageStyle = {
        backgroundImage: `url(${LoginBg})`,
    };

    return (
        <div className="main-section login-page" style={pageStyle}>
            <header className="header-main">
                <nav className="navbar navbar-expand-lg">
                    <div className="container">
                        <div className="header-inner">
                            <Link className="navbar-brand" to="/">
                                <img src={Logo} alt="logo-img" />
                            </Link>
                            <button
                                className="navbar-toggler"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#navbarTogglerDemo02"
                                aria-controls="navbarTogglerDemo02"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                                <div className="header-btn-main ms-auto">
                                    <Link to="/login" className="back-home-btn">
                                        <img src={ArrowLeft} alt="" />
                                        <span> Back to Login </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            <section className="login-section">
                <div className="container">
                    <div className="row main-row justify-content-center">
                        <div className="col-lg-5">
                            <div className="login-form">
                                <div className="form-headings">
                                    <h2>Forgot Password</h2>
                                    <p>Enter your email to receive a reset link.</p>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="row contact-form p-0">
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="Enter your email"
                                                    name="email"
                                                    value={email}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={loading}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-action">
                                                <button
                                                    type="submit"
                                                    className="color-btn btn w-100"
                                                    disabled={loading}
                                                >
                                                    {loading ? "Sending..." : "Send Reset Link"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ForgotPassword;