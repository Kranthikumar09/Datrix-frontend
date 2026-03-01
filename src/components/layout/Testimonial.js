import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import config from "../../config/config";

import testimonialImg from "../../assets/images/testimonial-img.jpg";
import playIconImg from "../../assets/images/play.png";
import quotesImg from "../../assets/images/quotes-img.png";
import { Link } from "react-router-dom";

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    axios
      .get(`${config.baseURL}/site-content/testimonial-video/get`)
      .then((response) => {
        if (response.data.success) {
          setVideoUrl(response.data.data.testimonial_video);
        } else {
          setError("No video found");
        }
      })
      .catch((err) => {
        setError("No video found");
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${config.baseURL}/site-content/testimonials/get`)
      .then((response) => {
        if (response.data.success) {
          setTestimonials(response.data.data);
        } else {
          setError("No testimonials found");
        }
      })
      .catch((err) => {
        setError("No testimonials found"); // Explicitly set for 404 or other errors
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const settings = {
    dots: false,
    infinite: testimonials.length > 1,
    speed: 500,
    slidesToShow: testimonials.length > 1 ? 1 : 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => setCurrentSlide(next),
  };

  // Word-based truncation (limit: 60 words)
  const truncateTextByWords = (text, wordLimit = 60) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  const progress =
    testimonials.length > 0 ? ((currentSlide + 1) / testimonials.length) * 100 : 0;

  const handlePlayClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenInNewTab = () => {
    window.open(
      `https://express.studytraveler.com/uploads/testimonials/${videoUrl}`,
      "_blank"
    );
  };

  return (
    <section className="testimonial-section p-50">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-7">
            <div className="cmn-heading text-center">
              <h2>Success Through Study Traveler
</h2>
              <p>
              Inspiring stories from students and professionals who achieved their dreams with our guidance.

              </p>
            </div>
          </div>
        </div>

        <div className="testimonial-inner">
          <div className="row">
            {/* Left Side - Video Section */}
            <div className="col-md-5">
              <div className="testimonial-video">
                {videoUrl ? (
                  <figure>
                    <img
                      src={testimonialImg}
                      className="testimonial-img"
                      alt="Testimonial"
                    />
                    <Link to="#" className="video-icon" onClick={handlePlayClick}>
                      <img
                        src={playIconImg}
                        alt="Play Icon"
                        className="icon-img"
                      />
                    </Link>
                  </figure>
                ) : (
                  <img
                    src={testimonialImg}
                    className="testimonial-img"
                    alt="Testimonial"
                  />
                )}
              </div>
            </div>

            {/* Right Side - Testimonials Slider */}
            <div className="col-md-7">
              <div className="col-testi-slider">
                <div className="slider-main">
                  {loading ? (
                    <p>Loading testimonials...</p>
                  ) : error || testimonials.length === 0 ? (
                    <p>No testimonials found</p>
                  ) : (
                    <Slider {...settings}>
                      {testimonials.map((testimonial, index) => (
                        <div key={index} className="testimonial-slider">
                          <div className="top-testimonial">
                            <figure>
                              <img
                                src={quotesImg}
                                className="quotes-img"
                                alt="Quotes"
                              />
                            </figure>
                            <p>
                              {expandedIndex === index
                                ? testimonial.comment
                                : truncateTextByWords(testimonial.comment, 60)}
                              {testimonial.comment.split(" ").length > 60 && (
                                <button
                                  onClick={() =>
                                    setExpandedIndex(
                                      expandedIndex === index ? null : index
                                    )
                                  }
                                  style={{
                                    background: "none",
                                    border: "none",
                                    color: "#007bff",
                                    cursor: "pointer",
                                    paddingLeft: "5px",
                                  }}
                                >
                                  {expandedIndex === index
                                    ? "Read Less"
                                    : "Read More"}
                                </button>
                              )}
                            </p>
                          </div>
                          <div className="testimonial-bottom">
                            <figure>
                              <img
                                src={`https://express.studytraveler.com/uploads/testimonials/${testimonial.image}`}
                                className="profile-img"
                                alt={testimonial.name}
                              />
                            </figure>
                            <div className="testimonial-bottom-right">
                              <h3>{testimonial.name}</h3>
                              <span>
                                {testimonial.designation || "Happy Client"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Slider>
                  )}
                </div>

                {/* Progress Bar */}
                <div
                  className="progress"
                  role="progressbar"
                  aria-label="Progress example"
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Video */}
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>
              ×
            </span>
            <video width="100%" controls>
              <source
                src={`https://express.studytraveler.com/uploads/testimonials/${videoUrl}`}
                type="video/webm"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonial;