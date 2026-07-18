import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { BRAND } from "../../config/brand";
import HomeAboutus1 from "../../assets/images/home-aboutus1.jpg";
import HomeAboutus2 from "../../assets/images/home-aboutus2.jpg";
import HomeAboutus3 from "../../assets/images/home-aboutus3.jpg";
import ObjectImg from "../../assets/images/object.svg";
import CheckImg from "../../assets/images/check-img.svg";
import RightArrow from "../../assets/images/right-arrow.svg";

const AboutSection = () => {
  const location = useLocation();

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="aboutus-left">
              <Box className="about-left-top">
                <Box className="aboutus-left-img">
                  <Box component="figure" sx={{ m: 0 }}>
                    <Box component="img" src={HomeAboutus1} alt="About us" />
                  </Box>
                </Box>
                <Box className="aboutus-left-img">
                  <Box component="figure" sx={{ m: 0 }}>
                    <Box component="img" src={HomeAboutus2} alt="About us" />
                  </Box>
                </Box>
              </Box>
              <Box className="about-left-bottom">
                <Box className="about-exp">
                  <Typography component="span">10+</Typography>
                  <Typography component="p">
                    years of <br /> experiences
                  </Typography>
                </Box>
                <Box className="aboutus-left-img about-shape-one">
                  <Box component="figure" sx={{ m: 0 }}>
                    <Box component="img" src={HomeAboutus3} alt="About us" />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3} className="right-about-data">
              <Box className="cmn-heading">
                <Typography
                  component="span"
                  className="top-name"
                  sx={{ display: "inline-flex", alignItems: "center", gap: 1, color: "primary.main", fontWeight: 600 }}
                >
                  ABOUT US <Box component="img" src={ObjectImg} alt="" />
                </Typography>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mt: 1 }}>
                  {BRAND.name} | Your Gateway to{" "}
                  <Box component="span" sx={{ color: "primary.main" }}>
                    Global Opportunities
                  </Box>
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1.5 }}>
                  Step into a world of limitless possibilities with expert guidance for education,
                  immigration, and global travel.
                </Typography>
              </Box>

              <Stack spacing={2} className="right-about-bottom-main">
                <Box className="right-about-bottom-inner">
                  <Typography variant="h6" component="h3" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box component="img" src={CheckImg} alt="" /> Study
                  </Typography>
                  <Typography color="text.secondary">
                    Shape your academic future with world-class universities and personalized admission support.
                  </Typography>
                </Box>
                <Box className="right-about-bottom-inner">
                  <Typography variant="h6" component="h3" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box component="img" src={CheckImg} alt="" /> Work
                  </Typography>
                  <Typography color="text.secondary">
                    Unlock global career pathways with expert job search, visa assistance, and skill-mapping guidance.
                  </Typography>
                </Box>
              </Stack>

              {location.pathname !== "/about" ? (
                <Button
                  component={RouterLink}
                  to="/about"
                  variant="contained"
                  color="primary"
                  endIcon={<Box component="img" src={RightArrow} alt="" sx={{ width: 16 }} />}
                  sx={{ borderRadius: "50px", alignSelf: "flex-start", textTransform: "none", fontWeight: 600, px: 3.5, py: 1.25 }}
                >
                  Read More
                </Button>
              ) : null}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection;
