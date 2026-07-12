import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import CloseIcon from "@mui/icons-material/Close";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import config from "../../config/config";
import { BRAND } from "../../config/brand";
import fallbackLogoAsset from "../../assets/images/logo.png";

const FALLBACK_LOGO = fallbackLogoAsset;

const COMPANY_LINKS = [
  { label: "Home", to: "/" },
  { label: "About us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const RESOURCE_LINKS = [
  { label: "FAQs", to: "/faq" },
  { label: "Blogs", to: "/blog" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms-conditions" },
];

const Footer = forwardRef((props, ref) => {
  const [siteData, setSiteData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");

  useEffect(() => {
    if (!config.baseURL) return undefined;

    axios
      .get(`${config.baseURL}/site-content/general-content/get`)
      .then((response) => {
        setSiteData(response.data?.data || {});
      })
      .catch((err) => {
        console.error("API Error:", err);
      });

    return undefined;
  }, []);

  const handleModalOpen = (src) => {
    setVideoSrc(src);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setVideoSrc("");
  };

  useImperativeHandle(ref, () => ({
    handleModalOpen,
  }));

  const socialLinks = [
    {
      href: siteData.contact_social_linkedin,
      label: "LinkedIn",
      icon: <LinkedInIcon fontSize="small" />,
    },
    {
      href: siteData.contact_social_facebook,
      label: "Facebook",
      icon: <FacebookIcon fontSize="small" />,
    },
    {
      href: siteData.contact_social_instagram,
      label: "Instagram",
      icon: <InstagramIcon fontSize="small" />,
    },
    {
      href: siteData.contact_social_youtube,
      label: "YouTube",
      icon: <YouTubeIcon fontSize="small" />,
    },
  ].filter((item) => Boolean(item.href));

  const contactEmail =
    siteData.contact_email || BRAND.contactEmailFallback || "Email not available";
  const contactPhone = siteData.contact_phone_number || "+61 45 743 84 88";
  const logoSrc = siteData.site_logo
    ? config.assetUrl(`uploads/general-content/${siteData.site_logo}`)
    : FALLBACK_LOGO;

  return (
    <>
      <Box
        component="footer"
        sx={{
          borderTop: "1px solid #edeff1",
          pt: 6,
          bgcolor: "background.subtle",
          borderBottom: "6px solid",
          borderBottomColor: "primary.main",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={3}>
                <Link
                  component={RouterLink}
                  to="/"
                  underline="none"
                  aria-label={BRAND.name}
                  sx={{ display: "inline-flex", width: "fit-content" }}
                >
                  <Box
                    component="img"
                    src={logoSrc}
                    alt={siteData.site_title || BRAND.name}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_LOGO;
                    }}
                    sx={{ maxHeight: 48, width: "auto" }}
                  />
                </Link>

                {socialLinks.length > 0 && (
                  <Stack direction="row" spacing={1.5}>
                    {socialLinks.map((item) => (
                      <IconButton
                        key={item.label}
                        component="a"
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.label}
                        sx={{
                          width: 45,
                          height: 45,
                          border: "2.25px solid #ECEFF3",
                          color: "secondary.main",
                          "&:hover": {
                            bgcolor: "primary.main",
                            borderColor: "primary.main",
                            color: "primary.contrastText",
                          },
                        }}
                      >
                        {item.icon}
                      </IconButton>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <Typography variant="subtitle2" sx={{ color: "secondary.main", fontWeight: 600, mb: 1.5 }}>
                Company
              </Typography>
              <Stack spacing={1.5} component="nav" aria-label="Company">
                {COMPANY_LINKS.map((item) => (
                  <Link
                    key={item.to}
                    component={RouterLink}
                    to={item.to}
                    underline="hover"
                    sx={{ color: "text.muted", fontWeight: 500, fontSize: 14 }}
                  >
                    {item.label}
                  </Link>
                ))}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <Typography variant="subtitle2" sx={{ color: "secondary.main", fontWeight: 600, mb: 1.5 }}>
                Contact
              </Typography>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.25} alignItems="flex-start">
                  <EmailOutlinedIcon sx={{ color: "primary.main", fontSize: 20, mt: 0.25 }} />
                  <Typography variant="body2" sx={{ color: "text.muted", fontWeight: 500 }}>
                    {contactEmail}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1.25} alignItems="flex-start">
                  <PhoneIphoneOutlinedIcon sx={{ color: "primary.main", fontSize: 20, mt: 0.25 }} />
                  <Typography variant="body2" sx={{ color: "text.muted", fontWeight: 500 }}>
                    {contactPhone}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 4, md: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "secondary.main", fontWeight: 600, mb: 1.5 }}>
                Resource
              </Typography>
              <Stack spacing={1.5} component="nav" aria-label="Resources">
                {RESOURCE_LINKS.map((item) => (
                  <Link
                    key={item.to}
                    component={RouterLink}
                    to={item.to}
                    underline="hover"
                    sx={{ color: "text.muted", fontWeight: 500, fontSize: 14 }}
                  >
                    {item.label}
                  </Link>
                ))}
              </Stack>
            </Grid>
          </Grid>

          <Box
            sx={{
              borderTop: "1px solid #ECEFF3",
              textAlign: "center",
              py: 3,
              mt: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: "text.muted", fontWeight: 500 }}>
              {siteData.footer_copyright_text || BRAND.copyright}
            </Typography>
          </Box>
        </Container>
      </Box>

      <Dialog
        open={showModal}
        onClose={handleModalClose}
        fullWidth
        maxWidth="lg"
        aria-labelledby="footer-video-dialog-title"
      >
        <DialogTitle id="footer-video-dialog-title" sx={{ pr: 6 }}>
          Video
          <IconButton
            aria-label="Close video dialog"
            onClick={handleModalClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {videoSrc ? (
            <Box
              component="iframe"
              title="Footer video"
              src={videoSrc}
              allowFullScreen
              sx={{
                width: "100%",
                height: { xs: 260, sm: 420, md: 600 },
                border: 0,
                display: "block",
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
});

Footer.displayName = "Footer";

export default Footer;
