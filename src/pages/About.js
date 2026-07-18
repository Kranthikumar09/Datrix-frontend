import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AboutSection from "../components/layout/AboutSection";
import JourneySection from "../components/layout/JourneySection";
import PartnerSection from "../components/layout/PartnerSection";
import Testimonial from "../components/layout/Testimonial";
import PageBanner from "../components/ui/PageBanner";
import { BRAND } from "../config/brand";
import abtMissOne from "../assets/images/abt-miss-one.png";
import abtMissTwo from "../assets/images/abt-miss-two.png";
import objectImg from "../assets/images/object.svg";
import valueIcon1 from "../assets/images/value-icon-1.svg";
import valueIcon2 from "../assets/images/value-icon-2.svg";
import valueIcon3 from "../assets/images/value-icon-3.svg";
import valueIcon4 from "../assets/images/value-icon-4.svg";

const VALUES = [
  { icon: valueIcon1, label: "Learning" },
  { icon: valueIcon2, label: "Integrity" },
  { icon: valueIcon3, label: "Fast" },
  { icon: valueIcon4, label: "Empathy" },
];

const About = () => (
  <Box component="main">
    <PageBanner
      title={`About ${BRAND.name}`}
      subtitle="Whether you aspire to study, work, settle, or explore new horizons, we simplify the process, ensuring a smooth journey toward your global dreams."
    />

    <AboutSection />

    <Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack
              spacing={2}
              className="about-mission-box"
              sx={{
                height: "100%",
                p: { xs: 2, md: 3 },
                borderRadius: 3,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box
                component="img"
                src={abtMissOne}
                alt="Our Vision"
                sx={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 2 }}
              />
              <Box className="text-box">
                <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  Our Vision
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                  To empower every student and professional with the opportunity to explore the world,
                  unlock global education, and build meaningful international careers — regardless of
                  background or borders.
                </Typography>
                <Typography color="text.secondary">
                  We envision a future where studying, working, and traveling abroad is seamless,
                  transparent, and accessible to all.
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack
              spacing={2}
              className="about-mission-box"
              sx={{
                height: "100%",
                p: { xs: 2, md: 3 },
                borderRadius: 3,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box
                component="img"
                src={abtMissTwo}
                alt="Our Mission"
                sx={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 2 }}
              />
              <Box className="text-box">
                <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  Our Mission
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                  To guide individuals through every step of their global journey with trusted
                  expertise, personalized counselling, and innovative technology.
                </Typography>
                <Typography color="text.secondary">
                  We are committed to simplifying admissions, visa processes, and travel planning
                  while delivering authentic, reliable, and end-to-end support — from the first
                  enquiry to successful settlement abroad.
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>

    <Box component="section" sx={{ py: { xs: 4, md: 6 }, bgcolor: "background.subtle" }}>
      <Container maxWidth="lg">
        <Stack spacing={1} sx={{ mb: 4, textAlign: "center", alignItems: "center" }}>
          <Typography
            component="span"
            className="top-name"
            sx={{ display: "inline-flex", alignItems: "center", gap: 1, color: "primary.main", fontWeight: 600 }}
          >
            Value <Box component="img" src={objectImg} alt="" />
          </Typography>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
            Our Values
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {VALUES.map((value) => (
            <Grid key={value.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <Stack
                spacing={1.5}
                className="values-box"
                sx={{
                  alignItems: "center",
                  textAlign: "center",
                  p: 3,
                  height: "100%",
                  borderRadius: 3,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box component="img" src={value.icon} alt={value.label} sx={{ width: 56, height: 56 }} />
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  {value.label}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>

    <Testimonial />
    <PartnerSection />
    <JourneySection />
  </Box>
);

export default About;
