import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { BRAND } from "../../config/brand";

const JourneySection = () => (
  <Box component="section" className="journy-section" sx={{ py: { xs: 4, md: 6 } }}>
    <Container maxWidth="lg">
      <Box className="journy-inner" sx={{ textAlign: "center", p: { xs: 3, md: 5 }, borderRadius: 4 }}>
        <Stack spacing={2} alignItems="center" className="cmn-heading">
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: "common.white" }}>
            Join the Leaders in Study and Work Abroad Guidance
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.9)", maxWidth: 720 }}>
            Ready to take your education or career global? At {BRAND.name}, we&apos;re here to help you
            unlock opportunities to study and work abroad.
          </Typography>
          <Button
            component={RouterLink}
            to="/signup"
            variant="contained"
            color="primary"
            sx={{ borderRadius: "50px", textTransform: "none", fontWeight: 600, px: 4, py: 1.25, mt: 1 }}
          >
            Start Your Journey!
          </Button>
        </Stack>
      </Box>
    </Container>
  </Box>
);

export default JourneySection;
