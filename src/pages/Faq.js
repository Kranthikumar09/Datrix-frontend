import React, { useState } from "react";
import FaqSection from "../components/layout/FaqSection"; // Adjust the import path as needed

const Faq = () => {
  const [activeTab, setActiveTab] = useState("all");

  // Map tab IDs to API query values and display names
  const tabCategories = [
    { id: "all", relatedTo: "", displayName: "All" },
    { id: "study", relatedTo: "Study", displayName: "Study" },
    { id: "work", relatedTo: "Work", displayName: "Work" },
  ];

  // Handle tab change
  const handleTabChange = (relatedTo, id) => {
    setActiveTab(id);
  };

  return (
    <>
      <div className="main-section">
        {/* Page banner start */}
        <section className="page-banner">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="pagebanner-text">
                  <h1>Frequently Asked Questions</h1>
                  <p>
                    Welcome to our FAQ page! Below, you'll find answers to some of
                    the most common questions we get. If you still need help,
                    don't hesitate to get in touch with us directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Page banner end */}

        <section className="faq-section">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <nav>
                  <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    {tabCategories.map((category) => (
                      <button
                        key={category.id}
                        className={`nav-link ${
                          activeTab === category.id ? "active" : ""
                        }`}
                        id={`nav-${category.id}-tab`}
                        data-bs-toggle="tab"
                        data-bs-target={`#${category.id}`}
                        type="button"
                        role="tab"
                        aria-controls={category.id}
                        aria-selected={activeTab === category.id ? "true" : "false"}
                        onClick={() =>
                          handleTabChange(category.relatedTo, category.id)
                        }
                      >
                        {category.displayName}
                      </button>
                    ))}
                  </div>
                </nav>

                <div className="tab-content" id="nav-tabContent">
                  {tabCategories.map((category) => (
                    <div
                      key={category.id}
                      className={`tab-pane fade ${
                        activeTab === category.id ? "show active" : ""
                      }`}
                      id={category.id}
                      role="tabpanel"
                      tabIndex="0"
                    >
                      <FaqSection relatedTo={category.relatedTo} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Faq;