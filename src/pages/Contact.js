import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import RightArrow from "../assets/images/right-arrow.svg";
import smstrackingIcon from "../assets/images/smstracking.svg";
import mobileIcon from "../assets/images/mobile.svg";
import linkedinIcon from "../assets/images/linkedin.svg";
import fbIcon from "../assets/images/fb.svg";
import instaIcon from "../assets/images/insta.svg";
import youtubeIcon from "../assets/images/youtube.svg";
import config from "../config/config";
import { BRAND } from "../config/brand";
import { useAppSnackbar } from "../components/ui/AppSnackbar";
import PageBanner from "../components/ui/PageBanner";
import AppTextField from "../components/ui/AppTextField";
import AppSelect from "../components/ui/AppSelect";
import AppPhoneField from "../components/ui/AppPhoneField";
import { networkErrorMessage } from "../utils/networkErrorMessage";

const SUBJECT_OPTIONS = [
  "General Inquiry",
  "Study Application",
  "Work Visa",
];

const emptySiteContent = {
  contact_address: "",
  contact_email: "",
  contact_phone_number: "",
  contact_social_linkedin: "",
  contact_social_instagram: "",
  contact_social_facebook: "",
  contact_social_youtube: "",
};

const Contact = () => {
  const snackbar = useAppSnackbar();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    subject: "General Inquiry",
    message: "",
    honeypot: "",
  });
  const [siteContent, setSiteContent] = useState(emptySiteContent);
  const [contentLoading, setContentLoading] = useState(true);
  const [contentError, setContentError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("in");
  const phoneInputRef = useRef(null);

  const fetchSiteContent = useCallback(async () => {
    if (!config.baseURL) {
      setContentLoading(false);
      setSiteContent(emptySiteContent);
      setContentError("API is not configured.");
      return;
    }
    try {
      setContentLoading(true);
      setContentError(null);
      const response = await axios.get(
        `${config.baseURL}/site-content/general-content/get`
      );
      if (response.data.success) {
        setSiteContent({ ...emptySiteContent, ...(response.data.data || {}) });
        setContentError(null);
      } else {
        setSiteContent(emptySiteContent);
        setContentError(response.data.message || "Unable to load contact information.");
      }
    } catch (error) {
      setSiteContent(emptySiteContent);
      setContentError(
        networkErrorMessage(error, "Unable to load contact information.")
      );
    } finally {
      setContentLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSiteContent();
  }, [fetchSiteContent]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone_number: "",
      subject: "General Inquiry",
      message: "",
      honeypot: "",
    });
    setSelectedCountry("in");
    phoneInputRef.current?.setCountry("in");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.honeypot) {
      snackbar.error("Bot submission detected.");
      return;
    }

    const trimmedName = formData.name.trim();
    if (!trimmedName || trimmedName.length === 0) {
      snackbar.error("Name cannot be empty or contain only spaces.");
      return;
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      snackbar.error("Please enter a valid email address.");
      return;
    }

    const trimmedPhone = formData.phone_number.trim();
    if (!trimmedPhone || !/^\d{8,15}$/.test(trimmedPhone)) {
      snackbar.error("Please enter a valid phone number (8-15 digits).");
      return;
    }

    if (!formData.message.trim()) {
      snackbar.error("Message cannot be empty.");
      return;
    }

    setIsSubmitting(true);

    const phoneCode = phoneInputRef.current?.getSelectedCountryData()?.dialCode || "91";

    const updatedFormData = {
      ...formData,
      name: trimmedName,
      phone_code: `+${phoneCode}`,
      phone_number: trimmedPhone,
    };

    try {
      const response = await axios.post(
        `${config.baseURL}/contact-requests/submit`,
        updatedFormData
      );

      if (response.data.success) {
        snackbar.success("Your message has been sent successfully!");
        resetForm();
      } else {
        snackbar.error(
          response.data.message || "Failed to submit. Please check your details."
        );
      }
    } catch (error) {
      snackbar.error(
        networkErrorMessage(
          error,
          error.response?.data?.message || "Failed to submit. Please try again later."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayEmail =
    siteContent.contact_email || BRAND.contactEmailFallback || "Email not available";
  const displayPhone = siteContent.contact_phone_number || "Phone not available";
  const displayAddress = siteContent.contact_address?.trim() || "";

  const socialLinks = [
    { link: siteContent.contact_social_linkedin, icon: linkedinIcon, alt: "LinkedIn" },
    { link: siteContent.contact_social_facebook, icon: fbIcon, alt: "Facebook" },
    { link: siteContent.contact_social_instagram, icon: instaIcon, alt: "Instagram" },
    { link: siteContent.contact_social_youtube, icon: youtubeIcon, alt: "YouTube" },
  ].filter((social) => social.link && social.link.trim() !== "");

  return (
    <Box component="main">
      <PageBanner
        title="Let's Connect"
        subtitle="We'd love to hear from you! Whether you have a question, suggestion, or just want to chat, don't hesitate to reach out."
      />

      <Box component="section" sx={{ pb: { xs: 6, md: 12.5 }, pt: 2 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              bgcolor: "rgba(226, 64, 60, 0.05)",
              p: 1.25,
              borderRadius: 2.5,
              minHeight: 250,
            }}
          >
            <Grid container spacing={0}>
              <Grid size={{ xs: 12, lg: 5 }}>
                <Box
                  sx={{
                    bgcolor: "primary.main",
                    borderRadius: 2.5,
                    p: { xs: 3, md: 5 },
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: { xs: 280, lg: "100%" },
                  }}
                >
                  <Box>
                    <Typography
                      variant="h5"
                      component="h2"
                      sx={{ color: "common.white", fontWeight: 600, mb: 1.5 }}
                    >
                      Contact Information
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "common.white", mb: 3, opacity: 0.95 }}
                    >
                      We're here to assist you! Feel free to get in touch through any of
                      the following channels.
                    </Typography>

                    {contentLoading ? (
                      <Stack spacing={1.5} sx={{ alignItems: "flex-start", py: 2 }}>
                        <CircularProgress size={28} sx={{ color: "common.white" }} />
                        <Typography variant="body2" sx={{ color: "common.white", opacity: 0.9 }}>
                          Loading contact details...
                        </Typography>
                      </Stack>
                    ) : contentError ? (
                      <Alert
                        severity="warning"
                        action={
                          <Button color="inherit" size="small" onClick={fetchSiteContent}>
                            Try again
                          </Button>
                        }
                        sx={{
                          bgcolor: "rgba(255,255,255,0.95)",
                          color: "text.primary",
                          alignItems: "center",
                        }}
                      >
                        {contentError}
                      </Alert>
                    ) : (
                      <Stack spacing={2} component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
                        {displayAddress ? (
                          <Box component="li">
                            <Typography sx={{ color: "common.white" }}>
                              {displayAddress}
                            </Typography>
                          </Box>
                        ) : null}
                        <Box
                          component="li"
                          sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                        >
                          <Box
                            component="img"
                            src={smstrackingIcon}
                            alt=""
                            sx={{ width: 24, height: 24 }}
                          />
                          {siteContent.contact_email || BRAND.contactEmailFallback ? (
                            <Link
                              href={`mailto:${displayEmail}`}
                              sx={{ color: "common.white", textDecoration: "underline" }}
                            >
                              {displayEmail}
                            </Link>
                          ) : (
                            <Typography sx={{ color: "common.white" }}>{displayEmail}</Typography>
                          )}
                        </Box>
                        <Box
                          component="li"
                          sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                        >
                          <Box
                            component="img"
                            src={mobileIcon}
                            alt=""
                            sx={{ width: 24, height: 24 }}
                          />
                          {siteContent.contact_phone_number ? (
                            <Link
                              href={`tel:${siteContent.contact_phone_number.replace(/\s+/g, "")}`}
                              sx={{ color: "common.white", textDecoration: "underline" }}
                            >
                              {displayPhone}
                            </Link>
                          ) : (
                            <Typography sx={{ color: "common.white" }}>{displayPhone}</Typography>
                          )}
                        </Box>
                      </Stack>
                    )}
                  </Box>

                  {!contentLoading && !contentError && socialLinks.length > 0 ? (
                    <Stack direction="row" spacing={1.5} sx={{ mt: 4 }}>
                      {socialLinks.map((social) => (
                        <IconButton
                          key={social.alt}
                          component={Link}
                          href={social.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.alt}
                          sx={{
                            bgcolor: "rgba(255,255,255,0.15)",
                            "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                          }}
                        >
                          <Box
                            component="img"
                            src={social.icon}
                            alt={social.alt}
                            sx={{ width: 20, height: 20 }}
                          />
                        </IconButton>
                      ))}
                    </Stack>
                  ) : null}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, lg: 7 }}>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ p: { xs: 2, md: 4 } }}
                >
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <AppTextField
                        label="Name *"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        fullWidth
                        slotProps={{ htmlInput: { maxLength: 60 } }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <AppSelect
                        id="subject"
                        label="Select Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                      >
                        {SUBJECT_OPTIONS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </AppSelect>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <AppPhoneField
                        id="phone_number"
                        label="Mobile number *"
                        ref={phoneInputRef}
                        defaultCountry="in"
                        countryIso={selectedCountry}
                        onCountryChange={(country) => setSelectedCountry(country.iso2)}
                        inputProps={{
                          name: "phone_number",
                          value: formData.phone_number,
                          onChange: handleChange,
                          required: true,
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                          maxLength: 15,
                          minLength: 8,
                          autoComplete: "tel-national",
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <AppTextField
                        label="Email *"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        fullWidth
                      />
                    </Grid>

                    <Grid size={12}>
                      <AppTextField
                        label="Message *"
                        name="message"
                        placeholder="Write your message.."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        fullWidth
                        multiline
                        rows={5}
                      />
                    </Grid>

                    <Box sx={{ display: "none" }} aria-hidden="true">
                      <label htmlFor="honeypot">Website</label>
                      <input
                        id="honeypot"
                        type="text"
                        name="honeypot"
                        value={formData.honeypot}
                        onChange={handleChange}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </Box>

                    <Grid size={12}>
                      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={isSubmitting}
                          endIcon={
                            isSubmitting ? (
                              <CircularProgress size={18} color="inherit" />
                            ) : (
                              <Box
                                component="img"
                                src={RightArrow}
                                alt=""
                                sx={{ width: 16, height: 16 }}
                              />
                            )
                          }
                          sx={{
                            borderRadius: 50,
                            px: 4.5,
                            py: 1.5,
                            fontWeight: 600,
                            textTransform: "none",
                          }}
                        >
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Contact;
