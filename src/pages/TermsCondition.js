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

const TermsCondition = () => {
  const snackbar = useAppSnackbar();
  const [termsContent, setTermsContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTermsAndConditions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${config.baseURL}/site-content/legal-page-content/get`,
        new URLSearchParams({
          page_key: "terms_and_conditions",
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data.success && response.data.data) {
        setTermsContent(response.data.data);
      } else {
        throw new Error("No terms and conditions content available");
      }
    } catch (err) {
      console.error("Error fetching terms and conditions:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to load terms and conditions";
      setError(errorMessage);
      snackbar.error(errorMessage, { autoHideDuration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTermsAndConditions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Box component="main">
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <LoadingState label="Loading terms and conditions..." height={200} />
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box component="main">
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <ErrorState
            title="Error loading terms and conditions"
            message={error}
            onRetry={fetchTermsAndConditions}
          />
        </Container>
      </Box>
    );
  }

  return (
    <Box component="main">
      <PageBanner
        title={termsContent?.heading || "Terms & Conditions"}
        subtitle={termsContent?.sub_heading || undefined}
      />

      <Box component="section" className="terms-content" sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          {termsContent?.content ? (
            <HtmlContent html={termsContent.content} className="inner-content" />
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

export default TermsCondition;
