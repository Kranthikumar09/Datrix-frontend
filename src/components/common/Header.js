import React, { useEffect, useState, useMemo } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import config from "../../config/config";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/images/logo.png";

const FALLBACK_LOGO = logo;

const Header = () => {
  const [logo, setLogo] = useState(null);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch site logo
  useEffect(() => {
    axios
      .get(`${config.baseURL}/site-content/general-content/get`)
      .then((response) => {
        setLogo(response.data?.data?.site_logo || null);
      })
      .catch((err) => console.error("API Error:", err));
  }, []);

  // Close mobile menu by simulating toggler click
  const closeMobileMenu = () => {
    const toggler = document.querySelector(".navbar-toggler");
    if (toggler) {
      toggler.click();
    }
  };

  // Handle logout
  const handleLogout = () => {
    closeMobileMenu(); // Close menu before logout
    logout();
    navigate("/");
  };

  // Determine active routes manually based on location
  const isStudyActive = useMemo(() => {
    const path = location.pathname;
    return path.startsWith("/study-filter") || path.startsWith("/study-details");
  }, [location.pathname]);

  const isWorkActive = useMemo(() => {
    const path = location.pathname;
    return path.startsWith("/work-filter") || path.startsWith("/job-details");
  }, [location.pathname]);

  const isBlogActive = useMemo(() => {
    const path = location.pathname;
    return path.startsWith("/blog") || path.startsWith("/blog-details");
  }, [location.pathname]);

  return (
    <header className="header-main">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <div className="header-inner">
            {/* Logo */}
            <NavLink className="navbar-brand" to="/">
              <img
                src={logo ? config.assetUrl(`uploads/general-content/${logo}`) : FALLBACK_LOGO}
                alt="Site Logo"
                onError={(e) => (e.target.src = FALLBACK_LOGO)}
              />
            </NavLink>

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
              {/* Navigation Links */}
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink 
                    className="nav-link" 
                    to="/" 
                    end
                    onClick={closeMobileMenu}
                  >
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link ${isActive || isStudyActive ? "active" : ""}`
                    }
                    to="/study"
                    onClick={closeMobileMenu}
                  >
                    Study
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link ${isActive || isWorkActive ? "active" : ""}`
                    }
                    to="/work"
                    onClick={closeMobileMenu}
                  >
                    Work
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    className="nav-link" 
                    to="/travel"
                    onClick={closeMobileMenu}
                  >
                    Travel
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link ${isActive || isBlogActive ? "active" : ""}`
                    }
                    to="/blog"
                    onClick={closeMobileMenu}
                  >
                    Blogs
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    className="nav-link" 
                    to="/about"
                    onClick={closeMobileMenu}
                  >
                    About
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    className="nav-link" 
                    to="/contact"
                    onClick={closeMobileMenu}
                  >
                    Contact
                  </NavLink>
                </li>
              </ul>

              {/* Conditional Buttons */}
              <div className="header-btn-main">
                {isAuthenticated ? (
                  <>
                    <NavLink 
                      to="/my-account" 
                      className="border-btn btn sw"
                      onClick={closeMobileMenu}
                    >
                      My Account
                    </NavLink>
                    <button onClick={handleLogout} className="color-btn btn">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink 
                      to="/login" 
                      className="border-btn btn"
                      onClick={closeMobileMenu}
                    >
                      Login
                    </NavLink>
                    <NavLink 
                      to="/signup" 
                      className="color-btn btn"
                      onClick={closeMobileMenu}
                    >
                      Sign Up
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;