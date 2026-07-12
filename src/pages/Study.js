import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import config from "../config/config";
import { BRAND } from "../config/brand";
import SignupForm from "../auth/SignupForm";
import FaqSection from "../components/layout/FaqSection";
import BrowseCategorySection from "../components/browse/BrowseCategorySection";
import AppTextField from "../components/ui/AppTextField";
import studyPageTopImg from "../assets/images/stydy-page-top-img.jpg";
import RightArrow from "../assets/images/right-arrow.svg";
import searchIcon from "../assets/images/search-normal.svg";
import studyCountryImg from "../assets/images/study-contry-img.jpg";
import studyDegreeImg from "../assets/images/study-degree-img.jpg";
import studyUniversityImg from "../assets/images/study-univercity.jpg";
import Career1 from "../assets/images/Career1.jpg";
import Career2 from "../assets/images/Career2.jpg";
import Career3 from "../assets/images/Career3.jpg";
import Career4 from "../assets/images/Career4.jpg";
import ObjectImg from "../assets/images/object.svg";
import Step1Img from "../assets/images/step1-img.svg";
import Step2Img from "../assets/images/step2-img.svg";
import Step3Img from "../assets/images/step3-img.svg";
import Step4Img from "../assets/images/step4-img.svg";
import Step5Img from "../assets/images/step5-img.svg";
import objectImg from "../assets/images/object.svg";
import faqImg1 from "../assets/images/faq-img1.jpg";
import faqImg2 from "../assets/images/faq-img2.jpg";
import faqImg3 from "../assets/images/faq-img3.jpg";
import faqImg4 from "../assets/images/faq-img4.jpg";

const STUDY_COUNTRIES = ["Canada", "India", "Australia", "Germany", "UK", "USA", "Europe", "Korea"];

const PROCESS_STEPS = [
  { id: "01", title: "Enquiry", text: "Speak with our experts and share your goals to get started.", image: Step1Img, reverse: false },
  { id: "02", title: "Expert Counselling", text: "Receive personalized guidance tailored to your academic or career path.", image: Step2Img, reverse: true },
  { id: "03", title: "Eligibility Check", text: "Understand your eligibility for universities, visas, or global job programs.", image: Step3Img, reverse: false },
  { id: "04", title: "Documentation", text: "We help you prepare and perfect every required document.", image: Step4Img, reverse: true },
  { id: "05", title: "Processing", text: "Your application, visa, and approvals are handled with complete end-to-end support.", image: Step5Img, reverse: false },
];

const Study = () => {
  const [specializations, setSpecializations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
    const handleStorageChange = () => setIsLoggedIn(!!localStorage.getItem("accessToken"));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [specRes, locRes] = await Promise.all([
          axios.get(`${config.baseURL}/courses/specializations/get`),
          axios.get(`${config.baseURL}/courses/locations/get`),
        ]);
        if (specRes.data.success) setSpecializations(specRes.data.data);
        if (locRes.data.success) setLocations(locRes.data.data);
      } catch (error) {
        console.error("Error fetching study browse data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/study-filter?course_name=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Box>
      <Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, borderColor: "primary.light", bgcolor: "background.soft" }}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 5 }}>
                <Box
                  component="img"
                  src={studyPageTopImg}
                  alt="Study abroad"
                  sx={{ width: "100%", height: "100%", minHeight: 280, objectFit: "cover", borderRadius: 2, display: "block" }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 7 }}>
                <Stack spacing={2}>
                  <Typography variant="h3" component="h1" fontWeight={800}>
                    Study Abroad
                  </Typography>
                  <Typography color="text.secondary">
                    Explore global education, unlock new cultures, and build a future filled with international opportunities.
                  </Typography>
                  {!isLoggedIn ? (
                    <SignupForm redirect="/application-form" />
                  ) : (
                    <>
                      <Typography color="text.secondary">
                        Welcome back! You&apos;re ready to explore study opportunities abroad. Check your application status or search for courses below.
                      </Typography>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <Button component={RouterLink} to="/study-applications" variant="contained" color="primary" endIcon={<Box component="img" src={RightArrow} alt="" sx={{ width: 16 }} />} sx={{ borderRadius: "50px", textTransform: "none", fontWeight: 600 }}>
                          View Application
                        </Button>
                        <Button component={RouterLink} to="/study-filter" variant="outlined" color="secondary" endIcon={<Box component="img" src={RightArrow} alt="" sx={{ width: 16 }} />} sx={{ borderRadius: "50px", textTransform: "none", fontWeight: 600 }}>
                          Search Courses
                        </Button>
                      </Stack>
                    </>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 4, md: 5 }, bgcolor: "background.subtle" }}>
        <Container maxWidth="lg">
          <Stack spacing={3} sx={{ alignItems: "center", textAlign: "center" }}>
            <Typography variant="h4" fontWeight={700}>Study Opportunity</Typography>
            <Box component="form" onSubmit={handleSearch} sx={{ width: "100%", maxWidth: 640 }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <AppTextField
                  placeholder="Search for the courses"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: <Box component="img" src={searchIcon} alt="" sx={{ width: 20, mr: 1 }} />,
                  }}
                />
                <Button type="submit" variant="contained" color="primary" endIcon={<Box component="img" src={RightArrow} alt="" sx={{ width: 16 }} />} sx={{ minHeight: 48, borderRadius: "50px", textTransform: "none", fontWeight: 600, px: 3, whiteSpace: "nowrap" }}>
                  Find
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>

      <BrowseCategorySection
        eyebrow="Country"
        title="By Country"
        image={studyCountryImg}
        imageAlt="Study countries"
        imagePosition="right"
        items={STUDY_COUNTRIES.map((country) => ({
          key: country,
          label: `Study in ${country}`,
          onClick: () => navigate(`/study-filter?country=${encodeURIComponent(country)}`),
        }))}
      />

      <BrowseCategorySection
        eyebrow="Specialize"
        title="By Specializations"
        image={studyDegreeImg}
        imageAlt="Study degrees"
        imagePosition="left"
        items={specializations.slice(0, 7).map((item) => ({
          key: item.specialization,
          label: item.specialization,
          to: `/study-filter?specialization=${encodeURIComponent(item.specialization)}`,
        }))}
        loading={!specializations.length}
      />

      <BrowseCategorySection
        eyebrow="Location"
        title="By Location"
        image={studyUniversityImg}
        imageAlt="Study universities"
        imagePosition="right"
        items={locations.slice(0, 7).map((item) => ({
          key: item.location,
          label: item.location,
          onClick: () => navigate(`/study-filter?location=${encodeURIComponent(item.location)}`),
        }))}
        loading={!locations.length}
      />

      <Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={1.5}>
                {[Career1, Career2, Career3, Career4].map((src, index) => (
                  <Grid key={src} size={6}>
                    <Box component="img" src={src} alt={`Career ${index + 1}`} sx={{ width: "100%", borderRadius: 2, display: "block" }} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Typography component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1, color: "primary.main", fontWeight: 600 }}>
                  CAREER <Box component="img" src={ObjectImg} alt="" />
                </Typography>
                <Typography variant="h4" fontWeight={700}>Select Your Career Path</Typography>
                <Typography color="text.secondary">
                  Whether you want to study, work, or settle abroad, {BRAND.name} guides you through every step with a structured, expert-designed roadmap.
                </Typography>
                <Button component={RouterLink} to="/signup" variant="contained" color="primary" endIcon={<Box component="img" src={RightArrow} alt="" sx={{ width: 16 }} />} sx={{ alignSelf: "flex-start", borderRadius: "50px", textTransform: "none", fontWeight: 600 }}>
                  Get Started
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box component="section" className="how-works-section" sx={{ py: { xs: 4, md: 6 }, bgcolor: "background.subtle" }}>
        <Container maxWidth="lg">
          <Stack spacing={1} sx={{ mb: 4, textAlign: "center", alignItems: "center" }}>
            <Typography component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1, color: "primary.main", fontWeight: 600 }}>
              HOW IT WORK <Box component="img" src={ObjectImg} alt="" />
            </Typography>
            <Typography variant="h4" fontWeight={700}>Begin Your Global Journey in 5 Simple Steps</Typography>
          </Stack>
          <Grid container spacing={2}>
            {PROCESS_STEPS.map((step) => (
              <Grid key={step.id} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                <Paper variant="outlined" sx={{ p: 2, height: "100%", borderRadius: 2, textAlign: "center" }}>
                  <Box component="img" src={step.image} alt={step.title} sx={{ width: 56, height: 56, mb: 1 }} />
                  <Typography variant="caption" color="primary.main" fontWeight={700}>{step.id}</Typography>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>{step.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{step.text}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={2}>
                <Typography component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1, color: "primary.main", fontWeight: 600 }}>
                  FAQS <Box component="img" src={objectImg} alt="" />
                </Typography>
                <Typography variant="h4" fontWeight={700}>Frequently Asked Questions</Typography>
                <FaqSection relatedTo="Study" />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Grid container spacing={1.5}>
                {[faqImg1, faqImg3, faqImg2, faqImg4].map((src, index) => (
                  <Grid key={src} size={6}>
                    <Box component="img" src={src} alt={`FAQ visual ${index + 1}`} sx={{ width: "100%", borderRadius: 2, display: "block" }} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Study;
