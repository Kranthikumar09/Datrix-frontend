import React, { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FaqSection from "../components/layout/FaqSection";
import PageBanner from "../components/ui/PageBanner";

const TAB_CATEGORIES = [
  { id: "all", relatedTo: "", displayName: "All" },
  { id: "study", relatedTo: "Study", displayName: "Study" },
  { id: "work", relatedTo: "Work", displayName: "Work" },
];

const Faq = () => {
  const [activeTab, setActiveTab] = useState(0);
  const activeCategory = TAB_CATEGORIES[activeTab];

  return (
    <Box component="main">
      <PageBanner
        title="Frequently Asked Questions"
        subtitle="Welcome to our FAQ page! Below, you'll find answers to some of the most common questions we get. If you still need help, don't hesitate to get in touch with us directly."
      />

      <Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="FAQ categories"
            sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
          >
            {TAB_CATEGORIES.map((category) => (
              <Tab
                key={category.id}
                label={category.displayName}
                id={`faq-tab-${category.id}`}
                aria-controls={`faq-tabpanel-${category.id}`}
              />
            ))}
          </Tabs>

          <Box
            role="tabpanel"
            id={`faq-tabpanel-${activeCategory.id}`}
            aria-labelledby={`faq-tab-${activeCategory.id}`}
          >
            <FaqSection relatedTo={activeCategory.relatedTo} />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Faq;
