import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import config from "../../config/config"; // Ensure this contains the correct baseURL

const PartnerSection = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetching partners from the API
  useEffect(() => {
    axios
      .get(`${config.baseURL}/site-content/our-partners/get`)
      .then((response) => {
        if (response.data.success && Array.isArray(response.data.data)) {
          setPartners(response.data.data);
        } else {
          setError("No partners found.");
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setError("No partners found.");
        } else {
          setError("An error occurred while fetching partners.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Slider settings
  const partnerslider = {
    infinite: partners.length > 1, // Enable infinite loop only if there are multiple partners
    slidesToShow: Math.min(5, partners.length), // Show max 5 partners based on available partners
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(3, partners.length), slidesToScroll: 1 } },
      { breakpoint: 700, settings: { slidesToShow: Math.min(2, partners.length), slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: Math.min(2, partners.length), slidesToScroll: 1 } }
    ]
  };

  return (
    <section className="partner-section p-50">
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-8 offset-lg-2">
            <div className="cmn-heading text-center">
              <h2>Our Global Network of Trusted Partners</h2>
    
<p className="">We proudly collaborate with top universities, industry-leading institutions, travel networks, and global education bodies to bring you exclusive opportunities worldwide.
Through these partnerships, we ensure access to premium admissions, verified programs, faster processing, and authentic global pathways.</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {loading ? (
              <p className="text-center">Loading partners...</p>
            ) : error ? (
              <p className="text-center">{error}</p>
            ) : partners.length > 0 ? (
              <div className="partner-logos">
                {partners.length > 1 ? (
                  // Render Slider if there are multiple partners
                  <Slider {...partnerslider}>
                    {partners.map((partner, index) => (
                      <figure key={index}>
                        <img
                          src={`https://express.studytraveler.com/uploads/our-partners/${partner.image}`}
                          alt={partner.title}
                          className="partner-img"
                        />
                      </figure>
                    ))}
                  </Slider>
                ) : (
                  // Render a single image if there is only one partner
                  <figure>
                    <img
                      src={`https://express.studytraveler.com/uploads/our-partners/${partners[0].image}`}
                      alt={partners[0].title}
                      className="partner-img"
                    />
                  </figure>
                )}
              </div>
            ) : (
              <p className="text-center">No partners available.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
