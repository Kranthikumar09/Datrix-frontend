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
import SignupForm from "../auth/SignupForm";
import FaqSection from "../components/layout/FaqSection";
import BrowseCategorySection from "../components/browse/BrowseCategorySection";
import AppTextField from "../components/ui/AppTextField";
import workMainImg from "../assets/images/Work-main-img.jpg";
import uploadIcon from "../assets/images/upload-icon.svg";
import RightArrow from "../assets/images/right-arrow.svg";
import studyCountryImage from "../assets/images/study-contry-img.jpg";
import professionImage from "../assets/images/Profession-img.jpg";
import employmentImage from "../assets/images/Employment-img.jpg";
import connectionImg from "../assets/images/connection-img.svg";
import connectionImgNext from "../assets/images/connection-img-next.svg";
import objectImg from "../assets/images/object.svg";
import faqImg5 from "../assets/images/faq-img5.jpg";
import faqImg6 from "../assets/images/faq-img6.jpg";
import faqImg7 from "../assets/images/faq-img7.jpg";
import faqImg8 from "../assets/images/faq-img8.jpg";

const WORK_COUNTRIES = ["India", "Australia", "Germany", "UK", "USA", "Europe", "Korea", "Finland"];

const WORK_PROCESS_STEPS = [
  { id: "01", title: "Research Your Options", reverse: false },
  { id: "02", title: "Select country", reverse: true },
  { id: "03", title: "Prepare for IELTS/ CELPIP/PTE/OET", reverse: false },
  { id: "04", title: "Arrange all the requirements", reverse: true },
  { id: "05", title: "Apply for work visa", reverse: false },
  { id: "06", title: "Get work visa", reverse: true },
  { id: "07", title: "Settle abroad", reverse: false },
];

const Work = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [skills, setSkills] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchInputs, setSearchInputs] = useState({ company: "", country: "" });

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
        const [skillsRes, locRes] = await Promise.all([
          axios.get(`${config.baseURL}/jobs/skills/get`),
          axios.get(`${config.baseURL}/jobs/locations/get`),
        ]);
        if (skillsRes.data.success) setSkills(skillsRes.data.data);
        if (locRes.data.success) setLocations(locRes.data.data);
      } catch (error) {
        console.error("Error fetching work browse data:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(searchInputs).toString();
    navigate(`/work-filter?${queryParams}`);
  };

  return (
    <Box component="main">
      <Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, borderColor: "primary.light", bgcolor: "background.soft" }}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 5 }}>
                <Box
                  component="img"
                  src={workMainImg}
                  alt="Work overseas"
                  sx={{ width: "100%", height: "100%", minHeight: 280, objectFit: "cover", borderRadius: 2, display: "block" }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 7 }}>
                <Stack spacing={2}>
                  <Typography variant="h3" component="h1" fontWeight={800}>
                    Work Overseas
                  </Typography>
                  <Typography color="text.secondary">
                    Dreaming of an international career? Get expert job-search support, resume optimization, visa guidance, and global placement assistance.
                  </Typography>
                  {!isLoggedIn ? (
                    <SignupForm redirect="/application-form" />
                  ) : (
                    <>
                      <Typography color="text.secondary">
                        Welcome back! You&apos;re ready to explore job opportunities abroad. Check your application status or search for new jobs below.
                      </Typography>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <Button
                          component={RouterLink}
                          to="/work-applications"
                          variant="contained"
                          color="primary"
                          endIcon={<Box component="img" src={RightArrow} alt="" sx={{ width: 16 }} />}
                          sx={{ borderRadius: "50px", textTransform: "none", fontWeight: 600 }}
                        >
                          View Application
                        </Button>
                        <Button
                          component={RouterLink}
                          to="/work-filter"
                          variant="outlined"
                          color="secondary"
                          endIcon={<Box component="img" src={RightArrow} alt="" sx={{ width: 16 }} />}
                          sx={{ borderRadius: "50px", textTransform: "none", fontWeight: 600 }}
                        >
                          Search Jobs
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
          <Stack spacing={3} sx={{ alignItems: "center" }}>
            <Button
              component={RouterLink}
              to="/signup"
              variant="contained"
              color="primary"
              startIcon={<Box component="img" src={uploadIcon} alt="" sx={{ width: 20 }} />}
              sx={{ borderRadius: "50px", textTransform: "none", fontWeight: 600, px: 3 }}
            >
              Post your Resume
            </Button>
            <Typography color="text.secondary" textAlign="center">
              Your overseas job search starts here.
            </Typography>
            <Typography variant="h4" fontWeight={700} textAlign="center">
              Work Opportunity
            </Typography>
            <Box component="form" onSubmit={handleSearchSubmit} sx={{ width: "100%", maxWidth: 720 }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <AppTextField
                  name="company"
                  placeholder="Search by Company"
                  value={searchInputs.company}
                  onChange={handleInputChange}
                  fullWidth
                />
                <AppTextField
                  name="country"
                  placeholder="Search Country"
                  value={searchInputs.country}
                  onChange={handleInputChange}
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  endIcon={<Box component="img" src={RightArrow} alt="" sx={{ width: 16 }} />}
                  sx={{ minHeight: 48, borderRadius: "50px", textTransform: "none", fontWeight: 600, px: 3, whiteSpace: "nowrap" }}
                >
                  Search
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>

      <BrowseCategorySection
        eyebrow="Country"
        title="By Country"
        image={studyCountryImage}
        imageAlt="Work countries"
        imagePosition="right"
        items={WORK_COUNTRIES.map((country) => ({
          key: country,
          label: `Work in ${country}`,
          onClick: () => navigate(`/work-filter?country=${encodeURIComponent(country)}`),
        }))}
      />

      <BrowseCategorySection
        eyebrow="Skillset"
        title="By Skillset"
        image={professionImage}
        imageAlt="Work skillsets"
        imagePosition="left"
        items={skills.slice(0, 7).map((item) => ({
          key: item.skill,
          label: item.skill,
          onClick: () => navigate(`/work-filter?skill=${encodeURIComponent(item.skill)}`),
        }))}
        loading={!skills.length}
      />

      <BrowseCategorySection
        eyebrow="Location"
        title="By Location"
        image={employmentImage}
        imageAlt="Work locations"
        imagePosition="right"
        items={locations.slice(0, 7).map((item) => ({
          key: item.location,
          label: item.location,
          to: `/work-filter?location=${encodeURIComponent(item.location)}`,
        }))}
        loading={!locations.length}
      />

      <Box component="section" className="work-process-section" sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Stack spacing={1} sx={{ mb: 4, textAlign: "center", alignItems: "center" }}>
            <Typography component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1, color: "primary.main", fontWeight: 600 }}>
              PROCESS <Box component="img" src={objectImg} alt="" />
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              Work Process
            </Typography>
          </Stack>
          <Box className="work-process-inner">
            {WORK_PROCESS_STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <Box className={`work-steps work-step${index + 1}`}>
                  {step.reverse ? (
                    <>
                      <Typography component="h3" variant="subtitle1" fontWeight={700}>
                        {step.title}
                      </Typography>
                      <span className="line-point" />
                      <span className="work-step-circle-data">{step.id}</span>
                    </>
                  ) : (
                    <>
                      <span className="work-step-circle-data">{step.id}</span>
                      <span className="line-point" />
                      <Typography component="h3" variant="subtitle1" fontWeight={700}>
                        {step.title}
                      </Typography>
                    </>
                  )}
                </Box>
                {index < WORK_PROCESS_STEPS.length - 1 && (
                  <Box className="connect-img-data">
                    <Box
                      component="img"
                      src={index % 2 === 0 ? connectionImg : connectionImgNext}
                      alt=""
                      sx={{ display: "block", maxWidth: "100%" }}
                    />
                  </Box>
                )}
              </React.Fragment>
            ))}
          </Box>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 4, md: 6 }, bgcolor: "background.subtle" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={2}>
                <Typography component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1, color: "primary.main", fontWeight: 600 }}>
                  FAQS <Box component="img" src={objectImg} alt="" />
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  Frequently Asked Questions
                </Typography>
                <FaqSection relatedTo="Work" />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Grid container spacing={1.5}>
                {[faqImg5, faqImg7, faqImg6, faqImg8].map((src, index) => (
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

export default Work;
