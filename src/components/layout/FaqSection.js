import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";
import EmptyState from "../ui/EmptyState";
import config from "../../config/config";
import { networkErrorMessage } from "../../utils/networkErrorMessage";

const FaqSection = ({ relatedTo = "All" }) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!config.baseURL) {
        setError("API is not configured.");
        return;
      }
      const response = await fetch(
        `${config.baseURL}/site-content/faqs/get?related_to=${encodeURIComponent(relatedTo)}`
      );
      if (!response.ok) {
        setError(`Request failed (${response.status}). Unable to load FAQs.`);
        setFaqs([]);
        return;
      }
      const data = await response.json();
      if (data.success) {
        const items = data.data || [];
        setFaqs(items);
        setExpanded(items.length ? `panel-0` : false);
      } else {
        setError(data.message || "Failed to fetch FAQs");
        setFaqs([]);
      }
    } catch (err) {
      setFaqs([]);
      setError(networkErrorMessage(err, "An error occurred while fetching FAQs."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relatedTo]);

  if (loading) return <LoadingState label="Loading FAQs..." height={80} />;
  if (error) return <ErrorState title="Unable to load FAQs" message={error} onRetry={fetchFaqs} />;
  if (!faqs.length) {
    return <EmptyState title="No FAQs available" message="No FAQs available for this category." />;
  }

  return (
    <Box className="faq-inner">
      {faqs.map((faq, index) => {
        const panelId = `panel-${index}`;
        return (
          <Accordion
            key={panelId}
            expanded={expanded === panelId}
            onChange={(_, isExpanded) => setExpanded(isExpanded ? panelId : false)}
            disableGutters
            elevation={0}
            sx={{
              mb: 1.5,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "12px !important",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`${panelId}-content`} id={`${panelId}-header`}>
              <Typography fontWeight={600} color="secondary.main">
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails id={`${panelId}-content`}>
              <Typography color="text.secondary">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default FaqSection;
