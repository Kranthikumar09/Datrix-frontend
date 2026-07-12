import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import config from "../../config/config";
import LoadingState from "../ui/LoadingState";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";

const PartnerSection = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPartners = () => {
    if (!config.baseURL) {
      setError("API is not configured.");
      setLoading(false);
      return;
    }
    setLoading(true);
    axios
      .get(`${config.baseURL}/site-content/our-partners/get`)
      .then((response) => {
        if (response.data.success && Array.isArray(response.data.data)) {
          setPartners(response.data.data);
          setError(null);
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
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPartners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const partnerslider = {
    infinite: partners.length > 1,
    slidesToShow: Math.min(5, partners.length || 1),
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(3, partners.length || 1) } },
      { breakpoint: 700, settings: { slidesToShow: Math.min(2, partners.length || 1) } },
      { breakpoint: 480, settings: { slidesToShow: Math.min(2, partners.length || 1) } },
    ],
  };

  return (
    <Box component="section" className="partner-section" sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack spacing={1.5} sx={{ mb: 4, maxWidth: 800, mx: "auto", textAlign: "center", alignItems: "center" }}>
          <Typography variant="h4" component="h2" fontWeight={700}>
            Our Global Network of Trusted Partners
          </Typography>
          <Typography color="text.secondary">
            We proudly collaborate with top universities, industry-leading institutions, travel
            networks, and global education bodies to bring you exclusive opportunities worldwide.
            Through these partnerships, we ensure access to premium admissions, verified programs,
            faster processing, and authentic global pathways.
          </Typography>
        </Stack>

        {loading ? (
          <LoadingState label="Loading partners..." />
        ) : error ? (
          <ErrorState title="Unable to load partners" message={error} onRetry={fetchPartners} />
        ) : partners.length > 0 ? (
          <Box className="partner-logos">
            {partners.length > 1 ? (
              <Slider {...partnerslider}>
                {partners.map((partner, index) => (
                  <Box key={`${partner.title}-${index}`} component="figure" sx={{ m: 0, px: 2, textAlign: "center" }}>
                    <Box
                      component="img"
                      src={config.assetUrl(`uploads/our-partners/${partner.image}`)}
                      alt={partner.title}
                      className="partner-img"
                      sx={{ maxHeight: 72, width: "auto", mx: "auto" }}
                    />
                  </Box>
                ))}
              </Slider>
            ) : (
              <Box component="figure" sx={{ m: 0, textAlign: "center" }}>
                <Box
                  component="img"
                  src={config.assetUrl(`uploads/our-partners/${partners[0].image}`)}
                  alt={partners[0].title}
                  className="partner-img"
                  sx={{ maxHeight: 72, width: "auto" }}
                />
              </Box>
            )}
          </Box>
        ) : (
          <EmptyState title="No partners available" message="Partner logos will appear here when available." />
        )}
      </Container>
    </Box>
  );
};

export default PartnerSection;
