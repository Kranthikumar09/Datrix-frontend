import React from "react";
import { Link } from "react-router-dom";
import SignupForm from "./SignupForm";
import Logo from "../assets/images/logo.png";
import LoginBg from "../assets/images/login-bg.png";
import ArrowLeft from "../assets/images/arrow-left.svg";
import LoginFav from "../assets/images/login-favicon.png";
import LoginImg1 from "../assets/images/login-img-1.png";
import LoginImg2 from "../assets/images/login-img-2.png";
import LoginImg3 from "../assets/images/login-img-3.png";

const Signup = () => {
    const loginPageStyle = {
        backgroundImage: `url(${LoginBg})`
    };

    return (
        <>
            <div className="main-section login-page" style={loginPageStyle}>
                {/* ✅ Header Section */}
                <header className="header-main">
                    <nav className="navbar navbar-expand-lg">
                        <div className="container">
                            <div className="header-inner">
                                <Link className="navbar-brand" to="/">
                                    <img src={Logo} alt="logo-img" />
                                </Link>
                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false"
                                    aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                                    <div className="header-btn-main ms-auto">
                                        <Link to="/" className="back-home-btn">
                                            <img src={ArrowLeft} alt="" />
                                            <span> Back to Home </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </header>

                {/* ✅ Signup Section */}
                <section className="login-section">
                    <div className="container">
                        <div className="row main-row">
                            {/* ✅ Left Side (Images) */}
                            <div className="col-lg-6">
                                <div className="login-section-imgs">
                                    <img src={LoginFav} alt="" />
                                    <div className="left-two">
                                        <img src={LoginImg1} alt="" />
                                        <img src={LoginImg2} alt="" />
                                    </div>
                                    <div className="right-single">
                                        <img src={LoginImg3} alt="" className="h-100" />
                                    </div>
                                </div>
                            </div>

                            {/* ✅ Right Side (Form) */}
                            <div className="col-lg-6">
                                <div className="login-form">
                                    <div className="form-headings">
                                        <h2>Create an Account</h2>
                                    </div>

                                    {/* ✅ Pass Redirect Prop Here */}
                                    <SignupForm redirect="/application-form" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Signup;
