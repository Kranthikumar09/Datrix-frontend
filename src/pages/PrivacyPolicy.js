import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import PageBanner from "../components/ui/PageBanner";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import HtmlContent from "../components/ui/HtmlContent";
import { useAppSnackbar } from "../components/ui/AppSnackbar";
import config from "../config/config";

const PrivacyPolicy = () => {
  const snackbar = useAppSnackbar();
  const [privacyContent, setPrivacyContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrivacyPolicy = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${config.baseURL}/site-content/legal-page-content/get`,
        new URLSearchParams({
          page_key: "privacy_policy",
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data.success && response.data.data) {
        setPrivacyContent(response.data.data);
      } else {
        throw new Error("No privacy policy content available");
      }
    } catch (err) {
      console.error("Error fetching privacy policy:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to load privacy policy";
      setError(errorMessage);
      snackbar.error(errorMessage, { autoHideDuration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivacyPolicy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Box component="main">
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <LoadingState label="Loading privacy policy..." height={200} />
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box component="main">
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <ErrorState
            title="Error loading privacy policy"
            message={error}
            onRetry={fetchPrivacyPolicy}
          />
        </Container>
      </Box>
    );
  }

  return (
    <Box component="main">
      <PageBanner
        title={privacyContent?.heading || "Privacy Policy"}
        subtitle={privacyContent?.sub_heading || undefined}
      />

      <Box component="section" className="terms-content" sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          {privacyContent?.content ? (
            <HtmlContent html={privacyContent.content} className="inner-content" />
          ) : (
            <EmptyState
              title="No content available"
              message="No content available at this time."
            />
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default PrivacyPolicy;
