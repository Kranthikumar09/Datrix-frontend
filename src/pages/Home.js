import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { BRAND } from "../config/brand";
import TeacherIcon from "../assets/images/teacher.svg";
import BriefcaseIcon from "../assets/images/briefcase.svg";
import HomeRightImg from "../assets/images/home-right-img.png";
import Flag1 from "../assets/images/flag-1.svg";
import Flag2 from "../assets/images/flag-2.svg";
import Flag3 from "../assets/images/flag-3.svg";
import Flag4 from "../assets/images/flag-4.svg";
import Flag5 from "../assets/images/flag-5.svg";
import RightArrow from "../assets/images/right-arrow.svg";
import HeadingIcon from "../assets/images/heading-icon.svg";
import BookIcon from "../assets/images/book.svg";
import BookmarkIcon from "../assets/images/bookmark.svg";
import BriefBlack from "../assets/images/briefcase-black.svg";
import TeacherBlackIcon from "../assets/images/teacher-black.svg";
import InfoCircleIcon from "../assets/images/info-circle.svg";
import StudyRightImg from "../assets/images/study-right.jpg";
import objectImg from "../assets/images/object.svg";
import Testimonial from "../components/layout/Testimonial";
import JourneySection from "../components/layout/JourneySection";
import PartnerSection from "../components/layout/PartnerSection";
import AboutSection from "../components/layout/AboutSection";
import FaqSection from "../components/layout/FaqSection";
import faqImg1 from "../assets/images/faq-img1.jpg";
import faqImg2 from "../assets/images/faq-img2.jpg";
import faqImg3 from "../assets/images/faq-img3.jpg";
import faqImg4 from "../assets/images/faq-img4.jpg";

const pillSx = {
  borderRadius: "50px",
  textTransform: "none",
  fontWeight: 600,
  px: 3.5,
  py: 1.25,
  minHeight: 48,
};

const FLAG_AWARDS = [
  { src: Flag1, label: "Germany", className: "shape-one" },
  { src: Flag5, label: "South Korea", className: "shape-two" },
  { src: Flag2, label: "South Africa", className: "shape-three" },
  { src: Flag3, label: "Turkey", className: "shape-four" },
  { src: Flag4, label: "Indonesia", className: "shape-five" },
];

const Home = () => (
  <Box component="main">
    <Box component="section" className="hero-section" sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={2.5} className="banner-left">
              <Typography variant="h3" component="h1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                {BRAND.name}
                <br />
                <Box component="span" sx={{ color: "primary.main" }}>
                  Your Gateway to Global Opportunities
                </Box>
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 540 }}>
                Step into a world of limitless possibilities with expert guidance for education,
                immigration, and global travel.
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <Button
                  component={RouterLink}
                  to="/study"
                  variant="outlined"
                  color="secondary"
                  startIcon={<Box component="img" src={TeacherIcon} alt="" sx={{ width: 20 }} />}
                  sx={{
                    ...pillSx,
                    borderWidth: 2,
                    "&:hover": { borderWidth: 2, bgcolor: "secondary.main", color: "common.white" },
                  }}
                >
                  Study
                </Button>
                <Button
                  component={RouterLink}
                  to="/work"
                  variant="contained"
                  color="primary"
                  startIcon={<Box component="img" src={BriefcaseIcon} alt="" sx={{ width: 20 }} />}
                  sx={pillSx}
                >
                  Work
                </Button>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box className="banner-right" sx={{ position: "relative" }}>
              <Box
                component="img"
                src={HomeRightImg}
                alt={`${BRAND.name} opportunities`}
                sx={{ width: "100%", display: "block" }}
              />
              {FLAG_AWARDS.map((flag) => (
                <Box key={flag.label} className={`banner-award ${flag.className}`}>
                  <Box component="img" src={flag.src} alt={`${flag.label} flag`} />
                  <Typography component="h6" variant="subtitle2">
                    {flag.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>

    <AboutSection />

    <Box component="section" className="home-study-section" sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography
                  component="span"
                  sx={{ display: "inline-flex", alignItems: "center", gap: 1, color: "primary.main", fontWeight: 600 }}
                >
                  <Box component="img" src={HeadingIcon} alt="" /> Study
                </Typography>
                <Typography variant="h4" component="h2" fontWeight={700} sx={{ mt: 1 }}>
                  Shape Your Future with Global Education Opportunities
                </Typography>
              </Box>
              <List disablePadding>
                {[
                  { to: "/signup", icon: BookIcon, label: "School students" },
                  { to: "/signup", icon: TeacherBlackIcon, label: "Graduates" },
                  { to: "/why-choose-study", icon: InfoCircleIcon, label: `Why choose ${BRAND.name}?` },
                ].map((item) => (
                  <ListItemButton
                    key={item.label}
                    component={RouterLink}
                    to={item.to}
                    sx={{ borderRadius: 2, mb: 1, border: "1px solid", borderColor: "divider" }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box component="img" src={item.icon} alt="" />
                    </ListItemIcon>
                    <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
                    <ChevronRightIcon color="action" />
                  </ListItemButton>
                ))}
              </List>
              <Button
                component={RouterLink}
                to="/signup"
                variant="contained"
                color="primary"
                endIcon={<Box component="img" src={RightArrow} alt="" sx={{ width: 16 }} />}
                sx={{ ...pillSx, alignSelf: "flex-start" }}
              >
                Begin Your Journey Now
              </Button>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              component="img"
              src={StudyRightImg}
              alt="Study abroad"
              sx={{ width: "100%", borderRadius: 3, display: "block" }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>

    <Box component="section" className="home-Work-section" sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }} order={{ xs: 2, md: 1 }}>
            <Box
              component="img"
              src={StudyRightImg}
              alt="Work abroad"
              sx={{ width: "100%", borderRadius: 3, display: "block" }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }} order={{ xs: 1, md: 2 }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography
                  component="span"
                  sx={{ display: "inline-flex", alignItems: "center", gap: 1, color: "primary.main", fontWeight: 600 }}
                >
                  <Box component="img" src={HeadingIcon} alt="" /> Work
                </Typography>
                <Typography variant="h4" component="h2" fontWeight={700} sx={{ mt: 1 }}>
                  Unlock Global Career Opportunities with Ease
                </Typography>
              </Box>
              <List disablePadding>
                {[
                  { to: "/signup", icon: BriefBlack, label: "Search Overseas Jobs" },
                  { to: "/signup", icon: BookmarkIcon, label: "Job & Abroad" },
                  { to: "/why-choose-work", icon: InfoCircleIcon, label: `Why choose ${BRAND.name}?` },
                ].map((item) => (
                  <ListItemButton
                    key={item.label}
                    component={RouterLink}
                    to={item.to}
                    sx={{ borderRadius: 2, mb: 1, border: "1px solid", borderColor: "divider" }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box component="img" src={item.icon} alt="" />
                    </ListItemIcon>
                    <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
                    <ChevronRightIcon color="action" />
                  </ListItemButton>
                ))}
              </List>
              <Button
                component={RouterLink}
                to="/signup"
                variant="contained"
                color="primary"
                endIcon={<Box component="img" src={RightArrow} alt="" sx={{ width: 16 }} />}
                sx={{ ...pillSx, alignSelf: "flex-start" }}
              >
                Start Your Work Journey Today
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>

    <Testimonial />
    <PartnerSection />

    <Box component="section" className="faq-section" sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ mb: 2 }}>
              <Typography
                component="span"
                sx={{ display: "inline-flex", alignItems: "center", gap: 1, color: "primary.main", fontWeight: 600 }}
              >
                FAQS <Box component="img" src={objectImg} alt="" />
              </Typography>
              <Typography variant="h4" component="h2" fontWeight={700} sx={{ mt: 1 }}>
                Frequently Asked Questions
              </Typography>
            </Box>
            <FaqSection relatedTo="" />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Grid container spacing={2}>
              {[faqImg1, faqImg3, faqImg2, faqImg4].map((src, index) => (
                <Grid key={src} size={6}>
                  <Box
                    component="img"
                    src={src}
                    alt={`FAQ visual ${index + 1}`}
                    sx={{ width: "100%", borderRadius: 2, display: "block" }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>

    <JourneySection />
  </Box>
);

export default Home;
