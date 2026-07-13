import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import PageBanner from "../ui/PageBanner";
import RightArrow from "../../assets/images/right-arrow.svg";

const WhyChooseLayout = ({
  bannerTitle,
  bannerSubtitle,
  heroImage,
  heroImageAlt,
  introTitle,
  introBody,
  ctaTo,
  ctaLabel = "Get Started",
  featuresTitle,
  featuresSubtitle,
  features,
  statsTitle,
  stats,
}) => (
  <Box component="main">
    <PageBanner title={bannerTitle} subtitle={bannerSubtitle} />

    <Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={heroImage}
              alt={heroImageAlt}
              sx={{ width: "100%", borderRadius: 3, display: "block" }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Typography variant="h4" component="h2" fontWeight={700}>
                {introTitle}
              </Typography>
              <Typography color="text.secondary">{introBody}</Typography>
              <Button
                component={RouterLink}
                to={ctaTo}
                variant="contained"
                color="primary"
                endIcon={<Box component="img" src={RightArrow} alt="" sx={{ width: 16 }} />}
                sx={{ alignSelf: "flex-start", borderRadius: "50px", textTransform: "none", fontWeight: 600, px: 3.5, py: 1.25 }}
              >
                {ctaLabel}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>

    <Box component="section" sx={{ py: { xs: 4, md: 6 }, bgcolor: "background.subtle" }}>
      <Container maxWidth="lg">
        <Stack spacing={1} sx={{ mb: 4, textAlign: "center", alignItems: "center" }}>
          <Typography variant="h4" component="h2" fontWeight={700}>
            {featuresTitle}
          </Typography>
          {featuresSubtitle ? (
            <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
              {featuresSubtitle}
            </Typography>
          ) : null}
        </Stack>
        <Grid container spacing={3}>
          {features.map((feature) => (
            <Grid key={feature.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper elevation={0} sx={{ p: 3, height: "100%", textAlign: "center", borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                <Box component="img" src={feature.icon} alt={feature.title} sx={{ width: 56, height: 56, mb: 1.5 }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  {feature.title}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>

    <Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            bgcolor: "primary.main",
            color: "common.white",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" component="h2" fontWeight={700} sx={{ mb: 3 }}>
            {statsTitle}
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={4}
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            {stats.map((stat) => (
              <Box key={stat.label}>
                <Typography variant="h3" fontWeight={800}>
                  {stat.value}
                </Typography>
                <Typography sx={{ opacity: 0.9 }}>{stat.label}</Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Container>
    </Box>
  </Box>
);

export default WhyChooseLayout;
