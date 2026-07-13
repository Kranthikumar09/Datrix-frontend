import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PageBanner from "../components/ui/PageBanner";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import HtmlContent from "../components/ui/HtmlContent";
import { useAppSnackbar } from "../components/ui/AppSnackbar";
import config from "../config/config";
import { BRAND } from "../config/brand";

const BlogDetails = () => {
  const snackbar = useAppSnackbar();
  const [blogDetails, setBlogDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();

  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${config.baseURL}/blogs/details/get`, {
        params: { blog_slug: slug },
      });

      if (response.data.success) {
        setBlogDetails(response.data.data);
      } else {
        setError("Blog not found.");
        setBlogDetails(null);
      }
    } catch (err) {
      console.error("Error fetching blog details:", err);
      setError("Failed to load blog details. Please try again later.");
      snackbar.error("Failed to load blog details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (blogDetails) {
      const metaTitle = blogDetails.meta_title || blogDetails.title || BRAND.defaultTitle;
      document.title = metaTitle.includes(BRAND.name)
        ? metaTitle
        : `${metaTitle} | ${BRAND.name}`;
      const metaDescription =
        document.querySelector('meta[name="description"]') || document.createElement("meta");
      metaDescription.name = "description";
      metaDescription.content = blogDetails.meta_description || BRAND.defaultDescription;
      if (!metaDescription.parentNode) document.head.appendChild(metaDescription);

      const metaKeywords =
        document.querySelector('meta[name="keywords"]') || document.createElement("meta");
      metaKeywords.name = "keywords";
      metaKeywords.content = blogDetails.meta_keywords || BRAND.keywords;
      if (!metaKeywords.parentNode) document.head.appendChild(metaKeywords);
    }
  }, [blogDetails]);

  if (loading) {
    return (
      <Box component="main">
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <LoadingState label="Loading blog details..." height={200} />
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box component="main">
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <ErrorState title="Unable to load blog" message={error} onRetry={fetchBlogDetails} />
        </Container>
      </Box>
    );
  }

  if (!blogDetails) {
    return (
      <Box component="main">
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <EmptyState title="Blog not found" message="The requested blog post could not be found." />
        </Container>
      </Box>
    );
  }

  return (
    <Box component="main">
      <PageBanner title={blogDetails.title} />

      <Box component="section" className="blog-details-section" sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Box className="single-details">
              <Box
                component="img"
                src={`${config.assetUrl("uploads/blogs")}/${blogDetails.image}`}
                alt={blogDetails.title}
                loading="lazy"
                sx={{
                  width: "100%",
                  maxHeight: 480,
                  objectFit: "cover",
                  borderRadius: 3,
                  mb: 2,
                }}
              />
              <Typography color="text.secondary">{blogDetails.short_description}</Typography>
            </Box>

            <HtmlContent html={blogDetails.content} className="blog-content" />
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default BlogDetails;
