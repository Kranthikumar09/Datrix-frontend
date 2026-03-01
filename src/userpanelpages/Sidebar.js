import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = ({ fullName, userId }) => {
  const location = useLocation(); // Get the current location

  return (
    <div className="col-xl-3 col-lg-4 col-md-12">
      <div className="dashboard-sidebar">
        <div className="single-item">
          <div className="single-item-in">
            <h2>{fullName}</h2>
            <p>ID: {userId || 'N/A'}</p>
          </div>
          <div className="single-item-tab">
            <ul>
              <li>
                <NavLink
                  to="/my-account"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <i className="fa-solid fa-user-lock" /> Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/study-applications"
                  className={() =>
                    location.pathname === '/study-applications' ||
                    location.pathname.startsWith('/study-application-details') ||
                    location.pathname.startsWith('/edit-study-application')
                      ? 'active'
                      : ''
                  }
                >
                  <i className="fa-solid fa-graduation-cap" /> Study Applications
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/work-applications"
                  className={() =>
                    location.pathname === '/work-applications' ||
                    location.pathname.startsWith('/work-application-details') ||
                    location.pathname.startsWith('/edit-work-application')
                      ? 'active'
                      : ''
                  }
                >
                  <i className="fa-solid fa-briefcase" /> Work Applications
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/applied-jobs"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <i className="fa-solid fa-list-check"></i> Applied Jobs
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/upload-documents"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <i className="fa-solid fa-file-upload" /> Documents
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;