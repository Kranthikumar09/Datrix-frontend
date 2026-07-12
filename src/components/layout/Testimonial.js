import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import LinearProgress from "@mui/material/LinearProgress";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { BRAND } from "../../config/brand";
import config from "../../config/config";
import LoadingState from "../ui/LoadingState";
import EmptyState from "../ui/EmptyState";
import testimonialImg from "../../assets/images/testimonial-img.jpg";
import quotesImg from "../../assets/images/quotes-img.png";

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    if (!config.baseURL) return;
    axios
      .get(`${config.baseURL}/site-content/testimonial-video/get`)
      .then((response) => {
        if (response.data.success) {
          setVideoUrl(response.data.data.testimonial_video);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!config.baseURL) {
      setLoading(false);
      setError("API is not configured.");
      return;
    }
    axios
      .get(`${config.baseURL}/site-content/testimonials/get`)
      .then((response) => {
        if (response.data.success) {
          setTestimonials(response.data.data || []);
        } else {
          setError("No testimonials found");
        }
      })
      .catch(() => setError("No testimonials found"))
      .finally(() => setLoading(false));
  }, []);

  const settings = {
    dots: false,
    infinite: testimonials.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (_current, next) => setCurrentSlide(next),
  };

  const truncateTextByWords = (text, wordLimit = 60) => {
    const words = (text || "").split(" ");
    if (words.length > wordLimit) {
      return `${words.slice(0, wordLimit).join(" ")}...`;
    }
    return text;
  };

  const progress =
    testimonials.length > 0 ? ((currentSlide + 1) / testimonials.length) * 100 : 0;

  return (
    <Box component="section" className="testimonial-section" sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 4, maxWidth: 720, mx: "auto" }}>
          <Typography variant="h4" component="h2" fontWeight={700} gutterBottom>
            Success Through {BRAND.name}
          </Typography>
          <Typography color="text.secondary">
            Inspiring stories from students and professionals who achieved their dreams with our
            guidance.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box className="testimonial-video" sx={{ position: "relative" }}>
              <Box
                component="img"
                src={testimonialImg}
                alt="Testimonial video"
                sx={{ width: "100%", borderRadius: 3, display: "block" }}
              />
              {videoUrl ? (
                <IconButton
                  aria-label="Play testimonial video"
                  onClick={() => setIsModalOpen(true)}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "primary.main",
                    color: "common.white",
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                >
                  <PlayArrowIcon />
                </IconButton>
              ) : null}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            {loading ? (
              <LoadingState label="Loading testimonials..." />
            ) : error || testimonials.length === 0 ? (
              <EmptyState title="No testimonials found" message={error || "No testimonials found"} />
            ) : (
              <Box>
                <Slider {...settings}>
                  {testimonials.map((testimonial, index) => (
                    <Box key={`${testimonial.name}-${index}`} sx={{ px: 1 }}>
                      <Box component="img" src={quotesImg} alt="" sx={{ width: 48, mb: 2 }} />
                      <Typography color="text.secondary" sx={{ mb: 2 }}>
                        {expandedIndex === index
                          ? testimonial.comment
                          : truncateTextByWords(testimonial.comment, 60)}
                        {(testimonial.comment || "").split(" ").length > 60 ? (
                          <Button
                            size="small"
                            onClick={() =>
                              setExpandedIndex(expandedIndex === index ? null : index)
                            }
                            sx={{ textTransform: "none", ml: 0.5 }}
                          >
                            {expandedIndex === index ? "Read Less" : "Read More"}
                          </Button>
                        ) : null}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box
                          component="img"
                          src={config.assetUrl(`uploads/testimonials/${testimonial.image}`)}
                          alt={testimonial.name}
                          sx={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }}
                        />
                        <Box>
                          <Typography fontWeight={700}>{testimonial.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {testimonial.designation || "Happy Client"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Slider>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ mt: 3, height: 6, borderRadius: 1 }}
                  aria-label="Testimonial progress"
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="md">
        <IconButton
          aria-label="Close video"
          onClick={() => setIsModalOpen(false)}
          sx={{ position: "absolute", right: 8, top: 8, zIndex: 1 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          {videoUrl ? (
            <Box
              component="video"
              controls
              sx={{ width: "100%", display: "block" }}
              src={config.assetUrl(`uploads/testimonials/${videoUrl}`)}
            >
              Your browser does not support the video tag.
            </Box>
          ) : null}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Testimonial;
